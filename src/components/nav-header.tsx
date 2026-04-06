'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, MessageSquare, Archive, Settings, Menu, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavHeaderProps {
  activeKey?: 'home' | 'chat' | 'archive' | 'settings';
  subtitle?: string;
  children?: React.ReactNode;
}

const navItems = [
  { key: 'home', href: '/', icon: Home, label: '首页' },
  { key: 'chat', href: '/chat', icon: MessageSquare, label: '对话' },
  { key: 'archive', href: '/archive', icon: Archive, label: '止戈录' },
  { key: 'settings', href: '/settings', icon: Settings, label: '设置' },
] as const;

export function NavHeader({ activeKey, subtitle, children }: NavHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="shrink-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">哄哄长记性</h1>
              {subtitle && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</p>
              )}
              {children}
            </div>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={activeKey === item.key ? 'bg-primary/10 text-primary' : ''}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* 移动端展开菜单 */}
        {mobileOpen && (
          <nav className="mt-3 flex flex-col gap-1 sm:hidden border-t pt-3">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${activeKey === item.key ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
