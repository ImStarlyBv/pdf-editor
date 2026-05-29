import { toolRegistry } from '../models/toolRegistry';
import { absoluteUrl } from '../lib/seo/site';

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolRegistry.map((tool) => ({
      url: absoluteUrl(`/tools/${tool.slug}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];
}
