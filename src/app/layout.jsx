import '../index.css';
import SiteHeader from '../views/components/SiteHeader';
import ToolFooter from '../views/components/ToolFooter';

export const metadata = {
  title: {
    default: 'PDFForge | Free Online PDF Tools',
    template: '%s | PDFForge',
  },
  description:
    'Free online PDF tools to edit, merge, split, compress, convert, OCR, sign, secure, and organize PDF files.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <ToolFooter />
      </body>
    </html>
  );
}
