import App from '../App';
import { absoluteUrl, siteConfig } from '../lib/seo/site';

export const metadata = {
  title: 'Create Fillable PDF Online - Make Any PDF Fillable Free',
  description:
    'Easily make your PDFs fillable online. Add interactive text fields, checkboxes, and signature spots to any document for free. No signup or watermarks required.',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      en: absoluteUrl('/'),
      'x-default': absoluteUrl('/'),
    },
  },
  openGraph: {
    title: 'Free Fillable PDF Creator - Make Your Documents Interactive',
    description: 'Turn static PDFs into interactive forms in seconds. Add fillable fields, checkboxes, and signature areas with our simple online editor.',
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
          'Make any PDF fillable and interactive',
          'Add text boxes, checkboxes, and radio buttons',
          'Insert secure signature spots for easy signing',
          'Works with Word docs and scanned paper forms',
          'Edit text and organize pages in one place',
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
              text: 'Simply upload your PDF and use our form tools to add text boxes, checkboxes, or dropdowns. Once you\'re done, download your new fillable form and it\'s ready to use.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I create a fillable PDF from a Word document?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Save your Word file as a PDF first, then bring it to PDFForge. You can then add signature areas and checkboxes right on top of your original document.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will my fillable forms work in other PDF readers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we create standard PDF forms that work perfectly in Adobe Reader, Chrome, and most other professional PDF software.',
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
