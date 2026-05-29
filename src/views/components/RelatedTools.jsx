import Link from 'next/link';
import { toolRegistry } from '../../models/toolRegistry';

export default function RelatedTools({ tool }) {
  const related = toolRegistry
    .filter((candidate) => candidate.id !== tool.id && candidate.category === tool.category)
    .slice(0, 6);

  return (
    <section className="tool-content-section" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">Related PDF tools</h2>
      <ul className="related-tools-list">
        {related.map((relatedTool) => (
          <li key={relatedTool.id}>
            <Link href={`/tools/${relatedTool.slug}`}>{relatedTool.name}</Link>
            <p>{relatedTool.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
