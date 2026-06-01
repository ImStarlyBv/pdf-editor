import App from '../App';
import { absoluteUrl, siteConfig } from '../lib/seo/site';

export const metadata = {
  title: 'Create Fillable PDF Online - Make PDF Fillable Free',
  description:
    'Make a PDF fillable online. Create interactive PDF forms, add text fields, checkboxes, and signature areas to existing PDFs, then continue with related document tools when needed.',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      en: absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  openGraph: {
    title: 'Free Fillable PDF Creator - Make Documents Interactive',
    description: 'Make existing PDFs fillable, add form fields, edit text visually, and continue with focused tools for merge, split, OCR, signing, and cleanup tasks.',
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
          'Make PDF documents fillable and interactive',
          'Add text fields, checkboxes, and radio buttons',
          'Add signature areas to documents',
          'Prepare Word exports and scanned paper forms',
          'Edit text visually and organize pages in one place',
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
              text: 'Save your Word file as a PDF first, then bring it to PDFForge. You can add signature areas, checkboxes, and fields over the original layout.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will my fillable forms work in other PDF readers?',
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
