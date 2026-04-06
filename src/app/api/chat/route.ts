import { NextResponse } from 'next/server';
import {
  buildPeaceMakerSystemPrompt,
  buildReconstructToSolutionTransitionNote,
  buildVentGuidanceAugmentation,
  buildVentToReconstructTransitionNote,
  type PeaceMakerStage,
  type PeaceMakerTheme,
  type VentGuidance,
} from '@/lib/peace-maker-prompt';
import {
  countUserMessages,
  detectTransitionRefusal,
  evaluateEmotionLevelHeuristic,
  type IncomingMessage,
} from '@/lib/emotion-evaluator';
import { evaluateReconstructReadiness } from '@/lib/reconstruct-evaluator';

const DEFAULT_API_BASE = 'https://api.siliconflow.cn/v1';
const DEFAULT_MODEL = 'deepseek-ai/DeepSeek-V3';
const MIN_VENT_USER_MESSAGES = 3;
const MIN_RECONSTRUCT_USER_MESSAGES = 2;

function normalizeTheme(value: unknown): PeaceMakerTheme {
  if (value === 'sister' || value === 'brother' || value === 'elder') return value;
  return 'elder';
}

function normalizeStage(value: unknown): PeaceMakerStage {
  if (value === 'vent' || value === 'reconstruct' || value === 'solution' || value === 'archive') {
    return value;
  }
  return 'vent';
}

function resolveVentGuidance(params: {
  emotionLevel: number;
  gentleAskAlreadySent: boolean;
  tooEarly: boolean;
}): VentGuidance {
  const { emotionLevel, gentleAskAlreadySent, tooEarly } = params;
  if (tooEarly || emotionLevel >= 60) return 'listen';
  if (emotionLevel >= 20) {
    return gentleAskAlreadySent ? 'listen_after_ask' : 'gentle_ask';
  }
  return gentleAskAlreadySent ? 'switch_reconstruct' : 'gentle_ask';
}

export async function POST(request: Request) {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: '服务器未配置 SILICONFLOW_API_KEY，请在环境变量中设置 SiliconFlow API Key。' },
      { status: 503 },
    );
  }

  let body: {
    messages?: IncomingMessage[];
    stage?: unknown;
    theme?: unknown;
    ventMeta?: { gentleAskAlreadySent?: boolean };
    reconstructMeta?: { userMsgCount?: number };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '请求体不是合法 JSON' }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages: IncomingMessage[] = rawMessages
    .filter(
      (m): m is IncomingMessage =>
        m != null &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0,
    )
    .slice(-40);

  if (messages.length === 0) {
    return NextResponse.json({ error: '至少需要一条有效消息' }, { status: 400 });
  }

  const theme = normalizeTheme(body.theme);
  const stage = normalizeStage(body.stage);
  const gentleAskAlreadySent = Boolean(body.ventMeta?.gentleAskAlreadySent);
  const reconstructUserMsgCount = Number(body.reconstructMeta?.userMsgCount) || 0;

  const base = (process.env.SILICONFLOW_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '');
  const model = process.env.SILICONFLOW_MODEL || DEFAULT_MODEL;
  const evalModel = process.env.SILICONFLOW_EVAL_MODEL || model;

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const userRefuses = stage === 'vent' && detectTransitionRefusal(lastUser);
  const userMsgCount = countUserMessages(messages);

  let systemPrompt = buildPeaceMakerSystemPrompt(theme, stage);
  let nextStage: PeaceMakerStage | undefined;
  let ventMetaOut: { gentleAskAlreadySent: boolean } | undefined;
  let reconstructMetaOut: { userMsgCount: number } | undefined;

  // ── 情绪舱逻辑 ──
  if (stage === 'vent') {
    if (userRefuses) {
      console.log('[peace-maker] user refused transition, staying in vent');
      systemPrompt = [
        systemPrompt,
        '',
        buildVentGuidanceAugmentation('respect_refusal'),
      ].join('\n');
      ventMetaOut = { gentleAskAlreadySent };
    } else {
      const evalResult = evaluateEmotionLevelHeuristic(messages);
      const { emotion_level: emotionLevel, trend } = evalResult;
      const tooEarly = userMsgCount < MIN_VENT_USER_MESSAGES;
      const guidance = resolveVentGuidance({ emotionLevel, gentleAskAlreadySent, tooEarly });

      console.log('[peace-maker] vent decision', {
        emotionLevel, trend, userMsgCount, tooEarly, gentleAskAlreadySent, guidance,
        lastUserText: lastUser.slice(0, 60),
      });

      if (guidance === 'switch_reconstruct') {
        systemPrompt = [
          buildPeaceMakerSystemPrompt(theme, 'reconstruct'),
          buildVentToReconstructTransitionNote(),
          '',
          buildVentGuidanceAugmentation('switch_reconstruct'),
        ].join('\n');
        nextStage = 'reconstruct';
        ventMetaOut = { gentleAskAlreadySent: false };
        reconstructMetaOut = { userMsgCount: 0 };
        console.log('[peace-maker] >>> SWITCHING vent -> reconstruct');
      } else {
        systemPrompt = [systemPrompt, '', buildVentGuidanceAugmentation(guidance)].join('\n');
        ventMetaOut = {
          gentleAskAlreadySent: guidance === 'gentle_ask' ? true : gentleAskAlreadySent,
        };
      }
    }
  }

  // ── 事件还原逻辑：判断是否可进入锦囊 ──
  if (stage === 'reconstruct') {
    const newReconstructCount = reconstructUserMsgCount + 1;
    reconstructMetaOut = { userMsgCount: newReconstructCount };

    if (newReconstructCount >= MIN_RECONSTRUCT_USER_MESSAGES) {
      console.log('[peace-maker] reconstruct: evaluating readiness...', { newReconstructCount });

      const { ready } = await evaluateReconstructReadiness(messages, {
        apiKey,
        apiBase: base,
        model: evalModel,
      });

      if (ready) {
        systemPrompt = [
          buildPeaceMakerSystemPrompt(theme, 'solution'),
          '',
          buildReconstructToSolutionTransitionNote(),
        ].join('\n');
        nextStage = 'solution';
        console.log('[peace-maker] >>> SWITCHING reconstruct -> solution');
      } else {
        console.log('[peace-maker] reconstruct: not ready yet, continue gathering info');
      }
    } else {
      console.log('[peace-maker] reconstruct: too early to evaluate', { newReconstructCount });
    }
  }

  // ── 调用主模型 ──
  const url = `${base}/chat/completions`;

  const upstreamMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: upstreamMessages,
      temperature: 0.7,
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: rawText || `上游接口错误 (${res.status})` },
      { status: res.status >= 500 ? 502 : res.status },
    );
  }

  let data: {
    choices?: Array<{
      message?: { content?: string; reasoning_content?: string };
    }>;
  };

  try {
    data = JSON.parse(rawText) as typeof data;
  } catch {
    return NextResponse.json({ error: '上游返回非 JSON' }, { status: 502 });
  }

  const message = data.choices?.[0]?.message;
  let content = message?.content?.trim() ?? '';
  if (!content && message?.reasoning_content) {
    content = String(message.reasoning_content).trim();
  }

  if (!content) {
    return NextResponse.json({ error: '模型未返回有效内容' }, { status: 502 });
  }

  // ── 构建响应 ──
  const payload: {
    content: string;
    nextStage?: PeaceMakerStage;
    ventMeta?: { gentleAskAlreadySent: boolean };
    reconstructMeta?: { userMsgCount: number };
  } = { content };

  if (nextStage) payload.nextStage = nextStage;
  if (ventMetaOut) payload.ventMeta = ventMetaOut;
  if (reconstructMetaOut) payload.reconstructMeta = reconstructMetaOut;

  return NextResponse.json(payload);
}
