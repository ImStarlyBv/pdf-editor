import App from '../App';
import { absoluteUrl, siteConfig } from '../lib/seo/site';

export const metadata = {
  title: 'Create Fillable PDF Online Free & Online PDF Tools',
  description:
    'Create fillable PDFs online, edit PDF text visually, add form fields, and use free PDF tools to merge, split, compress, OCR, sign, secure, convert, and organize documents.',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'PDFForge',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: absoluteUrl('/'),
        description: metadata.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Create fillable PDF forms online',
          'Edit PDF text visually',
          'Add fillable PDF fields and signatures',
          'Merge, split, compress, OCR, convert, sign, protect, and organize PDF files',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I make a PDF fillable online?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Upload the PDF, add fields where people need to type or choose an answer, then export the updated file. Related tools can unlock fields, fill forms, flatten responses, or edit metadata.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I create a fillable PDF from a Word document?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Save or print the Word document as a PDF first, then add fillable fields, signature boxes, checkboxes, radio options, links, and helper labels over the preserved layout.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is this only a fillable PDF creator?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. PDFForge also includes tools for merge PDF, split PDF, compress PDF, OCR PDF, sign PDF, redact PDF, organize pages, and automate PDF workflows.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <App />
    </>
  );
}
