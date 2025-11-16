import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/providers/CartProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'

const inter = Inter({ subsets: ['cyrillic', 'latin'] })

export const metadata: Metadata = {
  title: 'Маркетплейс',
  description: 'Агрегатор товаров от разных продавцов',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'https://telegram.org/js/telegram-web-app.js';
                script.async = true;
                script.onload = function() {
                  if (window.Telegram && window.Telegram.WebApp) {
                    var tg = window.Telegram.WebApp;
                    tg.expand();
                    
                    // Проверяем версию API перед вызовом методов, которые требуют версию 6.1+
                    var version = parseFloat(tg.version || '0');
                    if (version >= 6.1) {
                      if (tg.setHeaderColor) {
                        tg.setHeaderColor('#ffffff');
                      }
                      if (tg.setBackgroundColor) {
                        tg.setBackgroundColor('#f8f9fa');
                      }
                    }
                    
                    tg.ready();
                  }
                };
                document.head.appendChild(script);
              })();
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

