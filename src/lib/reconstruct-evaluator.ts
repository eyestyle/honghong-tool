import type { IncomingMessage } from '@/lib/emotion-evaluator';

export interface ReconstructReadiness {
  ready: boolean;
}

const EVAL_SYSTEM = `你是一个内部评估模块，负责判断对话是否已经收集了足够的信息来给出和解/哄人建议。

判断标准（需同时满足）：
1. 吵架/冲突的起因/导火索已基本明确
2. 事件经过/时间线基本清晰（至少知道发生了什么、双方各自做了什么）
3. 双方的核心诉求或情绪点已可推断
4. 基于以上信息，可以给出有针对性的和解建议（话术、行动、心理准备）

只输出一个 JSON，不要 markdown，不要其它文字，格式严格为：
{"ready":true} 或 {"ready":false}`;

function extractJsonObject(text: string): string | null {
  const t = text.trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  return t.slice(start, end + 1);
}

export async function evaluateReconstructReadiness(
  messages: IncomingMessage[],
  options: { apiKey: string; apiBase: string; model: string },
): Promise<ReconstructReadiness> {
  const recent = messages.slice(-20);
  const dialogue = recent
    .map((m) => `${m.role === 'user' ? '用户' : '助手'}：${m.content}`)
    .join('\n');

  const url = `${options.apiBase.replace(/\/$/, '')}/chat/completions`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          { role: 'system', content: EVAL_SYSTEM },
          {
            role: 'user',
            content: `以下是用户与情绪陪伴助手的对话记录，请判断是否已收集足够信息：\n\n${dialogue}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 30,
      }),
    });

    const rawText = await res.text();
    if (!res.ok) {
      console.log('[reconstruct-eval] upstream error, defaulting to not ready');
      return { ready: false };
    }

    const data = JSON.parse(rawText) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw = data.choices?.[0]?.message?.content?.trim() ?? '';
    const jsonStr = extractJsonObject(raw);
    if (!jsonStr) {
      console.log('[reconstruct-eval] no JSON found in response:', raw);
      return { ready: false };
    }

    const parsed = JSON.parse(jsonStr) as { ready?: unknown };
    const ready = parsed.ready === true;
    console.log('[reconstruct-eval] result:', { ready, raw });
    return { ready };
  } catch (e) {
    console.log('[reconstruct-eval] error:', e);
    return { ready: false };
  }
}
