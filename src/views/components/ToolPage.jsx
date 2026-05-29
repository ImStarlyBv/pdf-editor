import ToolHero from './ToolHero';
import ToolInstructions from './ToolInstructions';
import RelatedTools from './RelatedTools';

export default function ToolPage({ tool }) {
  return (
    <main id="content" className="site-main" tabIndex={-1}>
      <ToolHero tool={tool} />

      <section className="tool-content-section cta-band" aria-labelledby="middle-cta-title">
        <h2 id="middle-cta-title">Process PDFs faster with {tool.name}</h2>
        <p>
          Use this page to start a {tool.name.toLowerCase()} workflow, then continue with related
          PDF tools from the footer when you need another edit.
        </p>
        <a className="btn btn-secondary" href="#tool-title">
          Start {tool.name}
        </a>
      </section>

      <ToolInstructions tool={tool} />
      <RelatedTools tool={tool} />

      <section className="tool-content-section final-cta" aria-labelledby="final-cta-title">
        <h2 id="final-cta-title">Ready to use {tool.name}?</h2>
        <a className="btn btn-primary" href="#tool-title">
          {tool.name}
        </a>
      </section>
    </main>
  );
}
