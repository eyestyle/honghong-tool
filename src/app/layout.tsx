import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: {
    default: '哄哄长记性 (Peace Maker)',
    template: '%s | Peace Maker',
  },
  description: '吵架后情绪缓冲与和解工具 - 智慧老者、知心姐姐、温柔哥哥陪你度过难关',
  keywords: [
    '吵架哄老婆',
    '情感助手',
    '情绪管理',
    '和解工具',
    'AI情感咨询',
  ],
  authors: [{ name: 'Peace Maker Team' }],
  generator: 'Peace Maker',
  openGraph: {
    title: '哄哄长记性 | 和解神器',
    description: '智慧老者、知心姐姐、温柔哥哥陪你度过每一次冲突',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        <ThemeProvider>
          {isDev && <Inspector />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
