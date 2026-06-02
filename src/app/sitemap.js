import { toolCategories } from '../models/toolCategories';
import { toolRegistry } from '../models/toolRegistry';
import { absoluteUrl } from '../lib/seo/site';

const LAST_MODIFIED = new Date('2026-06-02T00:00:00.000Z');

const categoryProfiles = {
  [toolCategories.recommended.id]: {
    changeFrequency: 'weekly',
    priority: 0.95,
  },
  [toolCategories.formsMetadata.id]: {
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  [toolCategories.contentEditing.id]: {
    changeFrequency: 'weekly',
    priority: 0.88,
  },
  [toolCategories.pageStructure.id]: {
    changeFrequency: 'weekly',
    priority: 0.86,
  },
  [toolCategories.conversionOcr.id]: {
    changeFrequency: 'weekly',
    priority: 0.84,
  },
  [toolCategories.securitySigning.id]: {
    changeFrequency: 'monthly',
    priority: 0.78,
  },
  [toolCategories.automationProduct.id]: {
    changeFrequency: 'monthly',
    priority: 0.62,
  },
};

const coreToolIds = new Set([
  'pdfTextEditor',
  'formFill',
  'merge',
  'split',
  'compress',
  'ocr',
  'sign',
  'addPassword',
]);

const productDocToolIds = new Set([
  'devApi',
  'devFolderScanning',
  'devSsoGuide',
  'devAirgapped',
]);

const getToolProfile = (tool) => {
  if (productDocToolIds.has(tool.id)) {
    return {
      changeFrequency: 'yearly',
      priority: 0.35,
    };
  }

  if (coreToolIds.has(tool.id)) {
    return {
      changeFrequency: 'weekly',
      priority: 0.92,
    };
  }

  return categoryProfiles[tool.category] || {
    changeFrequency: 'monthly',
    priority: 0.7,
  };
};

const sitemapRoute = (path, changeFrequency, priority) => ({
  url: absoluteUrl(path),
  lastModified: LAST_MODIFIED,
  changeFrequency,
  priority,
});

export default function sitemap() {
  return [
    sitemapRoute('/', 'weekly', 1),
    ...toolRegistry.map((tool) => {
      const profile = getToolProfile(tool);

      return sitemapRoute(
        `/tools/${tool.slug}`,
        profile.changeFrequency,
        profile.priority,
      );
    }),
  ];
}
