import App from '../App';
import { absoluteUrl, siteConfig } from '../lib/seo/site';

export const metadata = {
  title: 'Create Fillable PDF Online - Make PDF Fillable Free',
  description:
    'Make PDF fillable online for free. Create interactive PDF forms, add text fields, checkboxes, and signature boxes to existing PDFs. No watermarks or registration required.',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      en: absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  openGraph: {
    title: 'Free Fillable PDF Creator - Make PDF Fillable Online',
    description: 'Easily make any PDF fillable. Add interactive form fields, edit text visually, and use free PDF tools to merge, split, and sign documents.',
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
          'Add digital signature fields to PDF documents',
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
              text: 'Upload your PDF, use the form field tools to add interactive text boxes, checkboxes, or dropdowns, then export the fillable AcroForm. Related tools can unlock fields, fill forms, or flatten responses.',
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
              text: 'Yes. PDFForge creates standard PDF forms (AcroForms) that are fully compatible with Adobe Acrobat Reader, Chrome, preview, and other professional PDF software.',
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
