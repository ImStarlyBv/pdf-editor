import App from '../App';
import { absoluteUrl, siteConfig } from '../lib/seo/site';

export const metadata = {
  title: 'Create Fillable PDF Online - Make PDF Fillable Free',
  description:
    'Make a PDF fillable online. Create interactive PDF forms, add text fields, checkboxes, and signature areas to existing PDFs, then continue with related PDF tools when needed.',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      en: absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  openGraph: {
    title: 'Free Fillable PDF Creator - Make PDF Fillable Online',
    description: 'Make existing PDFs fillable, add form fields, edit text visually, and continue with focused PDF tools for merge, split, OCR, signing, and cleanup tasks.',
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
          'Make PDF fillable and interactive',
          'Create PDF forms with text fields, checkboxes, and radio buttons',
          'Add signature areas to PDF documents',
          'Convert Word and scanned documents to fillable PDF forms',
          'Edit PDF text visually and manage page structure',
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
              text: 'Upload your PDF, add fields where someone needs to type or choose an answer, then export the updated document. Related tools can unlock fields, fill forms, run OCR, or flatten responses.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I create a fillable PDF from a Word document?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Save your Word document as a PDF, then upload it to PDFForge to add interactive form fields, signature areas, and pick-lists over the existing layout.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are these PDF forms compatible with Adobe Reader?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'PDFForge is designed around standard PDF form workflows. Test exported forms in the PDF reader your recipients will use before publishing important documents.',
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
