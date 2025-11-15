// Telegram WebApp API integration
export function initTelegramWebApp() {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    const tg = (window as any).Telegram.WebApp;
    
    // Расширяем приложение на весь экран
    tg.expand();
    
    // Настройка цветов темы
    tg.setHeaderColor('#005BFF');
    tg.setBackgroundColor('#667eea');
    
    // Включаем вибрацию при клике
    tg.enableClosingConfirmation();
    
    // Готовность приложения
    tg.ready();
    
    return tg;
  }
  return null;
}

