import { notFound } from 'next/navigation';
import ToolPage from '../../../views/components/ToolPage';
import { getToolBySlug, toolRegistry } from '../../../models/toolRegistry';
import { absoluteUrl } from '../../../lib/seo/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return toolRegistry.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {};
  }

  const path = `/tools/${tool.slug}`;

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        en: absoluteUrl(path),
        'x-default': absoluteUrl(path),
      },
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: absoluteUrl(path),
      siteName: 'PDFForge',
      type: 'website',
    },
  };
}

export default async function ToolRoutePage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
