import Link from 'next/link';
import { getToolsByCategory } from '../../models/toolRegistry';
import { toolCategories } from '../../models/toolCategories';

export default function SiteHeader() {
  const groupedTools = getToolsByCategory();

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
            {Object.values(toolCategories).map((category) => {
              const tools = groupedTools[category.id] || [];

              if (tools.length === 0) {
                return null;
              }

              return (
                <section key={category.id} className="tool-menu-group">
                  <h2>{category.name}</h2>
                  <ul>
                    {tools.map((tool) => (
                      <li key={tool.id}>
                        <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
                        <p>{tool.description}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </details>
      </nav>
    </header>
  );
}
