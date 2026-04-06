'use client';

import { Save, Key, Globe, User, Info, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { NavHeader } from '@/components/nav-header';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeConfig = {
    elder: { name: '智慧老者', icon: '🧙', desc: '禅意、武侠风格，语重心长，立场中立公正' },
    sister: { name: '邻家小姐姐', icon: '👩', desc: '共情、温柔、细腻，立场偏向你' },
    brother: { name: '温柔大哥哥', icon: '👨', desc: '温柔、阳光，说话有亲和力，立场偏向你' },
  };

  const models = [
    { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', provider: 'SiliconFlow 默认' },
    { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1', provider: 'SiliconFlow' },
    { id: 'Pro/zai-org/GLM-4.7', name: 'GLM-4.7', provider: 'SiliconFlow' },
  ];

  return (
    <div className="min-h-screen bg-gradient-3d">
      <NavHeader activeKey="settings" subtitle="设置" />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">设置</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            配置 API、选择角色，个性化你的体验
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* API 配置 */}
          <Card className="card-soft-gradient border-0 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
            <CardHeader className="px-0 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground">API 配置</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                对话由服务端调用 SiliconFlow（默认 DeepSeek）。密钥请写在项目根目录{' '}
                <span className="font-mono">.env.local</span> 的 SILICONFLOW_API_KEY 中。
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="api-key" className="text-foreground text-sm">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="font-mono rounded-xl sm:rounded-2xl border-0 bg-muted/50 text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  实际请求使用服务端环境变量，请勿把生产密钥写进前端
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="base-url" className="text-foreground text-sm">Base URL</Label>
                <Input
                  id="base-url"
                  type="url"
                  placeholder="https://api.siliconflow.cn/v1"
                  className="font-mono rounded-xl sm:rounded-2xl border-0 bg-muted/50 text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="model" className="text-foreground text-sm">模型选择</Label>
                <div className="grid gap-2 sm:gap-3">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className="flex items-center justify-between rounded-xl sm:rounded-2xl border-2 border-border bg-muted/30 p-3 sm:p-4 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10">
                          <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-medium text-foreground">{model.name}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">{model.provider}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-full text-[10px] sm:text-xs hidden sm:inline-flex">{model.id}</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 角色选择 */}
          <Card className="card-soft-gradient border-0 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
            <CardHeader className="px-0 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground">角色选择</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                选择你的情绪陪伴者，不同风格，同样的温暖
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                {(Object.entries(themeConfig) as [keyof typeof themeConfig, typeof themeConfig[keyof typeof themeConfig]][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 transition-all hover:scale-[1.02] text-left ${
                        theme === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-muted/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">{config.icon}</div>
                      <h3 className="mb-1 sm:mb-2 text-sm sm:text-base font-bold text-foreground">{config.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{config.desc}</p>
                      {theme === key && (
                        <Badge className="absolute right-3 top-3 sm:right-4 sm:top-4 bg-primary text-primary-foreground rounded-full text-[10px] sm:text-xs">
                          当前
                        </Badge>
                      )}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* 其他设置 */}
          <Card className="card-soft-gradient border-0 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
            <CardHeader className="px-0 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground">其他设置</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">个性化你的使用体验</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3 sm:space-y-4">
              {[
                { label: '自动保存对话', desc: '对话自动保存到本地，防止丢失', on: true },
                { label: '启用提示音', desc: '收到新消息时播放提示音', on: false },
                { label: '显示详细日志', desc: '在对话中显示 AI 思考过程', on: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-border p-3 sm:p-4">
                  <div className="mr-3">
                    <div className="text-sm sm:text-base font-medium text-foreground">{item.label}</div>
                    <div className="text-[10px] sm:text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  <div className={`h-5 w-9 sm:h-6 sm:w-11 rounded-full shrink-0 ${item.on ? 'bg-primary' : 'bg-muted'}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 关于 */}
          <Card className="card-soft-gradient border-0 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
            <CardHeader className="px-0 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-foreground">关于</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-2 sm:space-y-3">
              {[
                ['版本', 'v1.0.0'],
                ['框架', 'Next.js 16 + React 19'],
                ['UI', 'Shadcn UI + Tailwind CSS 4'],
                ['数据存储', 'LocalStorage (本地)'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono text-foreground">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 sm:gap-4">
            <Button variant="outline" className="rounded-xl sm:rounded-2xl text-sm">重置默认</Button>
            <Button className="btn-soft gap-2 rounded-xl sm:rounded-2xl text-sm">
              <Save className="h-4 w-4 sm:h-5 sm:w-5" />
              保存设置
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
