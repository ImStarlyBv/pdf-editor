import Link from 'next/link';
import { toolCategories } from '../../models/toolCategories';
import { getToolsByCategory } from '../../models/toolRegistry';

export default function ToolFooter() {
  const groupedTools = getToolsByCategory();

  return (
    <footer id="all-pdf-tools" className="site-footer">
      <div className="footer-inner">
        <div className="footer-heading">
          <h2>Complete Document Tool Directory</h2>
          <p>Find the document task you need, grouped by workflow so each link has a clear purpose.</p>
        </div>

        <div className="footer-tools-grid">
          {Object.values(toolCategories).map((category) => {
            const tools = groupedTools[category.id] || [];

            if (tools.length === 0) {
              return null;
            }

            return (
              <nav key={category.id} aria-labelledby={`footer-${category.id}`}>
                <h3 id={`footer-${category.id}`}>{category.name}</h3>
                <ul>
                  {tools.map((tool) => (
                    <li key={tool.id}>
                      <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
                      <p>{tool.description}</p>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
