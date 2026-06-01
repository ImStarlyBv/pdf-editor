import { absoluteUrl, siteConfig } from '../lib/seo/site';

export default function robots() {
  const host = new URL(siteConfig.url).host;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host,
  };
}
