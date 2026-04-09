'use client';

import Link from 'next/link';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { NavHeader } from '@/components/nav-header';

function DashboardContent() {
  const { theme, setTheme } = useTheme();
  const [mood, setMood] = useState<string>('');

  const themeConfig = {
    elder: {
      name: '智慧老者',
      icon: '🧙',
      desc: '禅意、武侠风格，语重心长，立场中立公正',
    },
    sister: {
      name: '邻家小姐姐',
      icon: '👩',
      desc: '共情、温柔、细腻，立场偏向你',
    },
    brother: {
      name: '温柔大哥哥',
      icon: '👨',
      desc: '温柔、阳光，说话有亲和力，立场偏向你',
    },
  };

  const moods = [
    { emoji: '😔', label: '难过', value: 'sad' },
    { emoji: '😤', label: '生气', value: 'angry' },
    { emoji: '😰', label: '焦虑', value: 'anxious' },
    { emoji: '😔', label: '委屈', value: 'wronged' },
    { emoji: '🤔', label: '困惑', value: 'confused' },
    { emoji: '😌', label: '平静', value: 'calm' },
  ];

  return (
    <div className="min-h-screen bg-gradient-3d">
      <NavHeader activeKey={mood ? undefined : 'home'} subtitle="Peace Maker v1.0" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="mb-8 sm:mb-16 text-center">
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">AI 情绪助手已就位</span>
          </div>
          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            你感觉怎么样？
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            选择陪伴者，让我们陪你度过这段时光
          </p>
        </div>

        <Card className="card-soft-gradient mx-auto max-w-4xl border-0 p-4 sm:p-6 lg:p-8 shadow-lg">
          <CardContent className="p-0">
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 sm:mb-4 flex gap-8 border-b pb-3 sm:pb-4">
                <div className="tab-nav-item active font-medium text-sm sm:text-base">选择陪伴者</div>
              </div>
              <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-3">
                {(Object.entries(themeConfig) as [keyof typeof themeConfig, typeof themeConfig[keyof typeof themeConfig]][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 transition-all hover:scale-[1.02] text-left ${
                        theme === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-muted/30 hover:border-primary/30'
                      }`}
                    >
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">{config.icon}</div>
                      <h3 className="mb-1 sm:mb-2 text-base sm:text-lg font-bold text-foreground">{config.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{config.desc}</p>
                      {theme === key && (
                        <Badge className="absolute right-3 top-3 sm:right-4 sm:top-4 bg-primary text-primary-foreground text-[10px] sm:text-xs">
                          当前
                        </Badge>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="mb-3 sm:mb-4 flex gap-8 border-b pb-3 sm:pb-4">
                <div className="tab-nav-item active font-medium text-sm sm:text-base">今日心情</div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:grid-cols-6">
                {moods.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setMood(item.value)}
                    className={`flex flex-col items-center gap-1.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all hover:scale-[1.05] ${
                      mood === item.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-2xl sm:text-4xl">{item.emoji}</span>
                    <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              {mood && (
                <div className="mt-6 sm:mt-8 text-center">
                  <Link href="/chat">
                    <Button size="lg" className="btn-soft gap-2 text-sm sm:text-base">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                      开始对话
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 sm:mt-12 mx-auto max-w-4xl rounded-2xl sm:rounded-3xl bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-2 text-center text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">止戈录摘要</h2>
            <p className="mb-8 sm:mb-12 text-center text-sm sm:text-base text-muted-foreground">记录每一次成长，避免重蹈覆辙</p>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-3">
              <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                <dt className="text-sm sm:text-base text-muted-foreground">本月冲突次数</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-primary sm:text-5xl">5 次</dd>
                <dd className="text-xs sm:text-sm text-muted-foreground">较上月减少 3 次</dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                <dt className="text-sm sm:text-base text-muted-foreground">高频诱因</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">3 个</dd>
                <dd className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  <Badge variant="secondary" className="rounded-full">家务分配</Badge>
                  <Badge variant="secondary" className="rounded-full">沟通方式</Badge>
                  <Badge variant="secondary" className="rounded-full">时间管理</Badge>
                </dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                <dt className="text-sm sm:text-base text-muted-foreground">有效对策</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">3 个</dd>
                <dd className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  <Badge className="rounded-full bg-primary text-primary-foreground">先倾听</Badge>
                  <Badge className="rounded-full bg-primary text-primary-foreground">承认错误</Badge>
                  <Badge className="rounded-full bg-primary text-primary-foreground">事后复盘</Badge>
                </dd>
              </div>
            </dl>
            <div className="mt-8 sm:mt-12">
              <Link href="/archive">
                <Button variant="outline" className="w-full rounded-2xl">
                  查看完整止戈录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-3d">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
}
