import App from '../App';
import { absoluteUrl, siteConfig } from '../lib/seo/site';

export const metadata = {
  title: 'Free Fillable PDF Creator & Online PDF Tools',
  description:
    'Create fillable PDFs online and access free PDF tools to edit, merge, split, compress, convert, OCR, sign, and organize documents.',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      en: absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  openGraph: {
    title: 'Free Fillable PDF Creator & Online PDF Tools',
    description: siteConfig.description,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    type: 'website',
  },
};

export default function HomePage() {
  return <App />;
}
