'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useTheme } from '@/contexts/ThemeContext';
import { NavHeader } from '@/components/nav-header';

type Stage = 'vent' | 'reconstruct' | 'solution' | 'archive';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { theme } = useTheme();
  const [currentStage, setCurrentStage] = useState<Stage>('vent');
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gentleAskAlreadySent, setGentleAskAlreadySent] = useState(false);
  const [reconstructUserMsgCount, setReconstructUserMsgCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '你好，我是你的情绪陪伴者。今天遇到什么不开心的事情了吗？说出来，我在这听着。',
    },
  ]);

  const stages = [
    { key: 'vent' as Stage, name: '情绪舱', icon: '😔', desc: '尽情倾诉，不讲道理' },
    { key: 'reconstruct' as Stage, name: '事件还原', icon: '📋', desc: '梳理事情经过' },
    { key: 'solution' as Stage, name: '哄哄锦囊', icon: '💡', desc: '获取和解方案' },
    { key: 'archive' as Stage, name: '复盘沉淀', icon: '📝', desc: '封存，避免重蹈覆辙' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === currentStage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    if (currentStage !== 'vent') setGentleAskAlreadySent(false);
    if (currentStage !== 'reconstruct') setReconstructUserMsgCount(0);
  }, [currentStage]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;

    const history: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(history);
    setInput('');
    setError(null);
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          stage: currentStage,
          theme,
          ...(currentStage === 'vent' ? { ventMeta: { gentleAskAlreadySent } } : {}),
          ...(currentStage === 'reconstruct'
            ? { reconstructMeta: { userMsgCount: reconstructUserMsgCount } }
            : {}),
        }),
      });
      const data: {
        content?: string;
        error?: string;
        nextStage?: Stage;
        ventMeta?: { gentleAskAlreadySent?: boolean };
        reconstructMeta?: { userMsgCount?: number };
      } = await res.json();
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : '请求失败');
      if (!data.content) throw new Error('模型未返回内容');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content! }]);
      if (data.nextStage) setCurrentStage(data.nextStage);
      if (typeof data.ventMeta?.gentleAskAlreadySent === 'boolean') {
        setGentleAskAlreadySent(data.ventMeta.gentleAskAlreadySent);
      }
      if (typeof data.reconstructMeta?.userMsgCount === 'number') {
        setReconstructUserMsgCount(data.reconstructMeta.userMsgCount);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '请求失败');
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-3d">
      <NavHeader activeKey="chat">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-[10px] sm:text-xs text-muted-foreground">对话中 · DeepSeek</span>
        </div>
      </NavHeader>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* 桌面侧栏 */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 border-r bg-card/80 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 xl:p-6">
            <h2 className="mb-4 xl:mb-6 text-base xl:text-lg font-bold text-foreground">当前阶段</h2>
            <p className="mb-3 xl:mb-4 text-[10px] xl:text-xs text-muted-foreground">
              阶段会改变 AI 的回复策略；可随时切换后再继续提问。
            </p>
            <div className="space-y-2 xl:space-y-3">
              {stages.map((stage, index) => (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => setCurrentStage(stage.key)}
                  className={`relative w-full overflow-hidden rounded-xl xl:rounded-2xl border-2 p-3 xl:p-4 transition-all text-left ${
                    currentStage === stage.key
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-2 xl:gap-3">
                    <div className="flex h-8 w-8 xl:h-10 xl:w-10 items-center justify-center rounded-full bg-background text-lg xl:text-2xl">
                      {stage.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm xl:text-base font-semibold text-foreground truncate">{stage.name}</h3>
                        {index < currentStageIndex && (
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                        )}
                      </div>
                      <p className="text-[10px] xl:text-xs text-muted-foreground truncate">{stage.desc}</p>
                    </div>
                  </div>
                  {currentStage === stage.key && (
                    <Badge className="absolute right-2 top-2 rounded-full bg-primary text-primary-foreground text-[10px]">
                      进行中
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col min-h-0 min-w-0">
          {/* 移动端水平阶段条 */}
          <div className="border-b bg-card/80 backdrop-blur-sm p-2 sm:p-3 lg:hidden">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto">
              {stages.map((stage) => (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => setCurrentStage(stage.key)}
                  className={`flex min-w-[60px] sm:min-w-[80px] flex-col items-center gap-0.5 sm:gap-1 whitespace-nowrap rounded-xl sm:rounded-2xl border-2 p-2 sm:p-3 transition-all ${
                    currentStage === stage.key
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <span className="text-lg sm:text-2xl">{stage.icon}</span>
                  <span className="text-[10px] sm:text-xs font-medium text-foreground">{stage.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 min-h-0">
            <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-4 ${
                      message.role === 'user' ? 'message-bubble-user' : 'message-bubble-ai'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="message-bubble-ai flex max-w-[80%] items-center gap-2 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-4">
                    <Spinner className="size-4 sm:size-5 text-primary" />
                    <span className="text-xs sm:text-sm text-muted-foreground">正在思考…</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 输入栏 */}
          <div className="shrink-0 border-t bg-card/80 backdrop-blur-sm px-3 sm:px-6 py-3 sm:py-4">
            <div className="mx-auto max-w-3xl">
              {error && (
                <p className="mb-2 sm:mb-3 rounded-xl sm:rounded-2xl border border-destructive/30 bg-destructive/10 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex gap-2 sm:gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    currentStage === 'vent'
                      ? '尽情倾诉，不讲道理...'
                      : currentStage === 'reconstruct'
                        ? '告诉我发生了什么...'
                        : '还有什么想说的...'
                  }
                  disabled={isSending}
                  className="min-h-[48px] sm:min-h-[60px] resize-none rounded-xl sm:rounded-2xl border border-primary/30 bg-muted/50 text-sm sm:text-base focus-visible:border-primary focus-visible:ring-0"
                />
                <Button
                  onClick={() => void handleSend()}
                  size="lg"
                  disabled={!input.trim() || isSending}
                  className="rounded-xl sm:rounded-2xl px-3 sm:px-4"
                >
                  {isSending ? <Spinner className="size-4 sm:size-5" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
                </Button>
              </div>
              <p className="mt-1.5 sm:mt-2 text-center text-[10px] sm:text-xs text-muted-foreground">
                Enter 发送，Shift+Enter 换行
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
