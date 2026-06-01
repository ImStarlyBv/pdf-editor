const normalizeSiteUrl = (url) => {
  const rawUrl = url || 'https://fillablepdf.online';
  const parsedUrl = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
  parsedUrl.hostname = parsedUrl.hostname.replace(/^www\./, '');
  parsedUrl.pathname = '';
  parsedUrl.search = '';
  parsedUrl.hash = '';
  return parsedUrl.toString().replace(/\/$/, '');
};

export const siteConfig = {
  name: 'PDFForge',
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  description:
    'Free online PDF tools to edit, merge, split, compress, convert, OCR, sign, secure, and organize PDF files.',
};

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
};
