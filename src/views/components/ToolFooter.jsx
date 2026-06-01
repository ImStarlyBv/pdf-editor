import Link from 'next/link';
import { getToolsByCategory } from '../../models/toolRegistry';
import { toolCategories } from '../../models/toolCategories';

const cleanAnchorText = (name, categoryName) => {
  // If the category header already contains "PDF", we can strip "PDF" from the tool name
  // to create a more natural semantic flow and avoid keyword stuffing.
  if (categoryName.toLowerCase().includes('pdf') || categoryName.toLowerCase().includes('tools')) {
    return name.replace(/\bPDF\b/g, '').replace(/\s+/g, ' ').trim();
  }
  return name;
};

export default function ToolFooter() {
  const groupedTools = getToolsByCategory();

  return (
    <footer id="all-pdf-tools" className="site-footer">
      <div className="footer-inner">
        <div className="footer-heading">
          <h2>Complete PDF Tool Directory</h2>
          <p>
            Explore our full suite of professional PDF tools. From simple page rotations to complex form creation and secure digital signing, we have everything you need to manage your documents effectively in one place.
          </p>
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
                      <Link href={`/tools/${tool.slug}`}>
                        {cleanAnchorText(tool.name, category.name)}
                      </Link>
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
