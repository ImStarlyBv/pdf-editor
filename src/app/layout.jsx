import '../index.css';
import SiteHeader from '../views/components/SiteHeader';
import ToolFooter from '../views/components/ToolFooter';
import { siteConfig } from '../lib/seo/site';

export const metadata = {
  metadataBase: new URL(siteConfig.url),
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
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prefetch: [
                {
                  tag: 'pdf-tool-page-prefetch',
                  where: { href_matches: '/tools/*' },
                  eagerness: 'moderate',
                },
              ],
            }),
          }}
        />
        <SiteHeader />
        {children}
        <ToolFooter />
      </body>
    </html>
  );
}
