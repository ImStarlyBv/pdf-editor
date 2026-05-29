export const siteConfig = {
  name: 'PDFForge',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  description:
    'Free online PDF tools to edit, merge, split, compress, convert, OCR, sign, secure, and organize PDF files.',
};

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
};
