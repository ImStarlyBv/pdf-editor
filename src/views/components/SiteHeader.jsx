import Link from 'next/link';
import { toolCategories } from '../../models/toolCategories';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <nav className="site-nav" aria-label="Primary">
        <Link className="brand-link" href="/">
          PDFForge
        </Link>
        <details className="all-tools-menu">
          <summary>All Tools</summary>
          <div className="all-tools-panel">
            <section className="tool-menu-group">
              <h2>Tool directory</h2>
              <p>Browse the complete PDF tool list in the footer, grouped by task.</p>
              <ul>
                {Object.values(toolCategories).map((category) => (
                  <li key={category.id}>
                    <a href={`#footer-${category.id}`}>{category.name}</a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </details>
      </nav>
    </header>
  );
}
