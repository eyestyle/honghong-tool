'use client';

import { Search, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NavHeader } from '@/components/nav-header';

export default function ArchivePage() {
  const records = [
    { id: '1', date: '2024-01-15', trigger: '家务分配', keyPattern: '沟通方式', solution: '先倾听，后表达', reflection: '避免使用指责语气，用"我"句式表达感受' },
    { id: '2', date: '2024-01-10', trigger: '时间管理', keyPattern: '规划能力', solution: '提前沟通安排', reflection: '重要事项提前告知，避免临时变动' },
    { id: '3', date: '2024-01-08', trigger: '孩子教育', keyPattern: '教育理念', solution: '私下讨论，统一立场', reflection: '在孩子面前保持一致，分歧私下沟通' },
    { id: '4', date: '2024-01-05', trigger: '财务规划', keyPattern: '消费观念', solution: '制定预算计划', reflection: '每月定期讨论财务，明确大额支出' },
    { id: '5', date: '2024-01-02', trigger: '家庭聚会', keyPattern: '社交安排', solution: '协商时间表', reflection: '双方家庭活动要平衡，提前规划' },
    { id: '6', date: '2023-12-28', trigger: '工作压力', keyPattern: '情绪管理', solution: '给彼此空间', reflection: '压力大时先处理情绪，再处理问题' },
  ];

  return (
    <div className="min-h-screen bg-gradient-3d">
      <NavHeader activeKey="archive" subtitle="止戈录" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">止戈录</h2>
          <p className="mb-4 sm:mb-6 text-base sm:text-lg lg:text-xl text-muted-foreground">
            记录每一次成长，避免重蹈覆辙
          </p>

          <div className="flex gap-2 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索诱因、模式或解决方案..."
                className="pl-10 sm:pl-12 rounded-xl sm:rounded-2xl border-0 bg-muted/50 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl sm:rounded-2xl shrink-0">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-8 sm:mb-12 grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-4">
          <Card className="glass rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-6 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3 px-0">
              <CardDescription className="text-[10px] sm:text-sm">总记录数</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-foreground">{records.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="glass rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-6 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3 px-0">
              <CardDescription className="text-[10px] sm:text-sm">本月新增</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-foreground">5</CardTitle>
            </CardHeader>
          </Card>
          <Card className="glass rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-6 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3 px-0">
              <CardDescription className="text-[10px] sm:text-sm">高频诱因</CardDescription>
              <CardTitle className="text-base sm:text-lg lg:text-xl text-primary">家务分配</CardTitle>
            </CardHeader>
          </Card>
          <Card className="glass rounded-2xl sm:rounded-3xl border-0 p-4 sm:p-6 shadow-lg">
            <CardHeader className="pb-2 sm:pb-3 px-0">
              <CardDescription className="text-[10px] sm:text-sm">有效对策</CardDescription>
              <CardTitle className="text-base sm:text-lg lg:text-xl text-primary">先倾听</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <Card key={record.id} className="glass rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-transform cursor-pointer border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="mb-2 sm:mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {record.date}
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs">{record.keyPattern}</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg lg:text-xl text-foreground">{record.trigger}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">诱因</div>
                    <p className="rounded-xl sm:rounded-2xl bg-muted/30 p-2.5 sm:p-3 text-xs sm:text-sm">{record.trigger}</p>
                  </div>
                  <div>
                    <div className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">模式</div>
                    <Badge variant="outline" className="rounded-full text-[10px] sm:text-xs">{record.keyPattern}</Badge>
                  </div>
                  <div>
                    <div className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">解决方案</div>
                    <p className="rounded-xl sm:rounded-2xl bg-primary/10 p-2.5 sm:p-3 text-xs sm:text-sm">{record.solution}</p>
                  </div>
                  <div>
                    <div className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-muted-foreground">反思建议</div>
                    <p className="rounded-xl sm:rounded-2xl bg-accent/10 p-2.5 sm:p-3 text-xs sm:text-sm">{record.reflection}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Button variant="outline" size="lg" className="rounded-2xl">
            加载更多记录
          </Button>
        </div>
      </main>
    </div>
  );
}
