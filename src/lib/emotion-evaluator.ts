export interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EmotionEvaluationResult {
  emotion_level: number;
  trend: 'rising' | 'declining' | 'stable';
}

const NEGATIVE_WORDS = [
  '抱怨', '指责', '责怪', '甩锅', '生气', '愤怒', '火大', '怒', '抓狂',
  '烦', '恶心', '讨厌', '难过', '委屈', '委屈死', '愤慨', '气死', '憋屈',
  '受够', '受不了', '冷战', '争吵', '吵架', '翻旧账', '不公平', '无情',
  '背叛', '敷衍', '压抑', '绝望', '崩溃', '烦死', '疯了', '无语', '滚',
  '去死', '混蛋', '王八蛋', '草', '他妈', '操', '脑残', '恨', '伤心',
  '心寒', '寒心', '害怕', '痛苦', '折磨', '窝囊', '窝火',
];

const FACT_CONNECTORS = [
  '因为', '所以', '于是', '然后', '当时', '具体', '经过', '发生',
  '时间', '地点', '我看到', '我听到', '事实', '我们约定', '其实',
  '回想', '事情是这样',
];

const CALM_WORDS = [
  '冷静', '平静', '缓和', '缓下来',
  '不生气', '没那么生气', '没有那么生气', '没那么气',
  '放下', '放松', '安静', '平和',
  '思考', '想一想', '理性', '想通', '想清楚',
  '整理', '梳理', '回忆',
  '准备', '准备好', '愿意', '可以聊', '可以谈', '我们来聊', '一起聊',
  '好多了', '好很多', '好了', '没事了', '算了', '释然', '好吧',
  '心情好', '舒服多了', '缓过来', '不那么', '淡定', '看开',
  '不难过', '不伤心', '不委屈', '消气', '气消了', '没那么难过',
  '嗯嗯', '谢谢', '感谢', '你说得对', '有道理', '明白了', '懂了',
  '我知道了', '我懂', '我理解',
];

const INTENSIFIERS = [
  '再也', '永远', '从来', '全部', '太', '特别',
  '极其', '彻底', '完全', '必须', '绝对',
];

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  let idx = 0;
  while (true) {
    idx = haystack.indexOf(needle, idx);
    if (idx === -1) break;
    count += 1;
    idx += Math.max(1, needle.length);
  }
  return count;
}

function computeHeuristicEmotion(text: string): number {
  const t = text.trim();
  if (!t) return 5;

  const exclamations = (t.match(/[!！]/g) ?? []).length;
  const multiQuestion = (t.match(/[?？]{2,}/g) ?? []).length;
  const dots = (t.match(/\.{3,}|…/g) ?? []).length;
  const punctScore = exclamations * 8 + multiQuestion * 5 + dots * 4;

  let negativeHits = 0;
  for (const w of NEGATIVE_WORDS) negativeHits += countOccurrences(t, w);

  let intensifierHits = 0;
  for (const w of INTENSIFIERS) intensifierHits += countOccurrences(t, w);

  let factHits = 0;
  for (const w of FACT_CONNECTORS) factHits += countOccurrences(t, w);

  let calmHits = 0;
  for (const w of CALM_WORDS) calmHits += countOccurrences(t, w);

  const repeatBoost = Math.min(20, negativeHits * 3);

  const raw =
    5 +
    negativeHits * 15 +
    punctScore * 0.7 +
    intensifierHits * 5 +
    repeatBoost -
    factHits * 4 -
    calmHits * 15;

  const clamped = Math.round(Math.min(100, Math.max(0, raw)));

  console.log('[emotion-heuristic]', {
    text: t.slice(0, 60),
    negativeHits,
    calmHits,
    factHits,
    punctScore,
    raw: Math.round(raw),
    result: clamped,
  });

  return clamped;
}

function clampEmotion(n: number): number {
  if (Number.isNaN(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function computeTrend(prev: number, next: number): EmotionEvaluationResult['trend'] {
  if (next <= prev - 8) return 'declining';
  if (next >= prev + 8) return 'rising';
  return 'stable';
}

export function countUserMessages(messages: IncomingMessage[]): number {
  return messages.filter((m) => m.role === 'user').length;
}

export function evaluateEmotionLevelHeuristic(messages: IncomingMessage[]): EmotionEvaluationResult {
  const userMsgs = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const lastText = userMsgs[userMsgs.length - 1] ?? '';
  const prevText = userMsgs.length >= 2 ? userMsgs[userMsgs.length - 2] : lastText;

  const lastEmotion = computeHeuristicEmotion(lastText);
  const prevEmotion = computeHeuristicEmotion(prevText);

  return {
    emotion_level: clampEmotion(lastEmotion),
    trend: computeTrend(prevEmotion, lastEmotion),
  };
}

export function detectTransitionRefusal(lastUserMessage: string): boolean {
  const t = lastUserMessage.trim();
  if (t.length < 2) return false;
  const patterns = [
    /不想(现在)?(梳理|还原|聊.*经过|说.*经过)/,
    /先别说/,
    /还没说完/,
    /别问我.*(当时|经过|细节)/,
    /等等再(说|聊)/,
    /先听我说/,
    /不想聊.*(经过|梳理)/,
    /别说.*(当时|经过|怎么回事)/,
    /暂时不想/,
    /先别(问|聊)/,
    /别提.*(经过|还原)/,
    /不想.*(整理|捋)/,
  ];
  return patterns.some((re) => re.test(t));
}
