// Генерация placeholder изображений через SVG data URI
export function generatePlaceholder(width: number, height: number, text?: string, bgColor?: string, textColor?: string): string {
  const bg = bgColor || '#E5E7EB';
  const color = textColor || '#9CA3AF';
  const displayText = (text || `${width}×${height}`).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="${color}" text-anchor="middle" dominant-baseline="middle">${displayText}</text></svg>`;
  
  // Используем URL encoding вместо base64 для совместимости
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Цвета для разных категорий товаров
const categoryColors: Record<string, { bg: string; text: string }> = {
  electronics: { bg: '#DBEAFE', text: '#1E40AF' },
  clothing: { bg: '#FCE7F3', text: '#9F1239' },
  home: { bg: '#FEF3C7', text: '#92400E' },
  sports: { bg: '#D1FAE5', text: '#065F46' },
  beauty: { bg: '#F3E8FF', text: '#6B21A8' },
  books: { bg: '#E0E7FF', text: '#3730A3' },
  toys: { bg: '#FED7AA', text: '#9A3412' },
  food: { bg: '#FEE2E2', text: '#991B1B' },
};

export function getProductPlaceholder(category: string, productName: string): string {
  const colors = categoryColors[category] || { bg: '#E5E7EB', text: '#6B7280' };
  const shortName = productName.length > 15 ? productName.substring(0, 15) + '...' : productName;
  return generatePlaceholder(300, 300, shortName, colors.bg, colors.text);
}

export function getSellerAvatarPlaceholder(sellerName: string): string {
  const initials = sellerName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  return generatePlaceholder(60, 60, initials, '#3B82F6', '#FFFFFF');
}

