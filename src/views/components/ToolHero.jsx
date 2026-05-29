import ToolUploadPanel from './ToolUploadPanel';

export default function ToolHero({ tool }) {
  return (
    <section className="tool-hero" aria-labelledby="tool-title">
      <div className="tool-hero-copy">
        <p className="eyebrow">Free online PDF tool</p>
        <h1 id="tool-title">{tool.name} Online</h1>
        <p className="hero-subtitle">{tool.description}.</p>
      </div>

      <div className="tool-action-panel" aria-label={`${tool.name} upload panel`}>
        <ToolUploadPanel tool={tool} />
        <p className="tool-source-row">
          or choose files from Dropbox, Google Drive, OneDrive, or your device
        </p>
        <p className="tool-microcopy">
          Files stay private. Temporary uploads are designed to be removed after processing.
        </p>
      </div>
    </section>
  );
}
