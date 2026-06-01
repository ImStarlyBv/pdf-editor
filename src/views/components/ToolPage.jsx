import ToolHero from './ToolHero';
import ToolInstructions from './ToolInstructions';
import RelatedTools from './RelatedTools';
import { getToolJsonLd, getToolSeoContent } from '../../lib/seo/toolSeoContent';

function ToolStructuredData({ tool }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getToolJsonLd(tool)).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default function ToolPage({ tool }) {
  const content = getToolSeoContent(tool);

  return (
    <main id="content" className="site-main" tabIndex={-1}>
      <ToolStructuredData tool={tool} />
      <ToolHero tool={tool} />

      <section className="tool-content-section cta-band" aria-labelledby="middle-cta-title">
        <h2 id="middle-cta-title">Process PDFs faster with {tool.name}</h2>
        <p>
          Start with the upload panel, use the visible {tool.name.toLowerCase()} options, and
          download the result without leaving this page.
        </p>
        <a className="btn btn-secondary" href="#tool-title">
          Start {tool.name}
        </a>
      </section>

      <ToolInstructions tool={tool} />

      <section className="tool-content-section keyword-section" aria-labelledby="features-title">
        <h2 id="features-title">{tool.name} features</h2>
        <div className="feature-grid">
          {content.steps[1].features.map((feature) => (
            <article key={feature} className="feature-card">
              <h3>{feature}</h3>
              <p>
                {tool.name} keeps this capability visible in the page content and connected to the
                upload workflow, so searchers and crawlers can understand the tool before JavaScript
                hydration.
              </p>
            </article>
          ))}
        </div>
      </section>

      <RelatedTools tool={tool} />

      <section className="tool-content-section final-cta" aria-labelledby="final-cta-title">
        <h2 id="final-cta-title">Ready to {content.actionKeyword}?</h2>
        <a className="btn btn-primary" href="#tool-title">
          {tool.name}
        </a>
      </section>
    </main>
  );
}
