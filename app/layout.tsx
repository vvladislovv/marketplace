/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/providers/CartProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        />
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
      <body suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

