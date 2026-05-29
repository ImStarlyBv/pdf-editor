const getActionLabel = (toolName) => toolName.toLowerCase().replace(/\bpdf\b/g, 'PDF');

export default function ToolInstructions({ tool }) {
  const action = getActionLabel(tool.name);

  return (
    <section className="tool-content-section" aria-labelledby="how-to-title">
      <h2 id="how-to-title">How to {action} online</h2>
      <ol className="instruction-list">
        <li>
          <h3>Select your PDF files</h3>
          <p>
            Upload the PDF file you want to process. For multi-file tools, add every document in
            the order you want the tool to use.
          </p>
        </li>
        <li>
          <h3>Choose your {tool.name.toLowerCase()} options</h3>
          <p>
            Configure the settings for {tool.name.toLowerCase()}, review the file list, and apply
            the operation when everything looks right.
          </p>
          <ul>
            <li>Works with browser uploads and server-side processing.</li>
            <li>Uses a dedicated backend endpoint at {tool.nextEndpoint}.</li>
            <li>Designed to preserve file quality while matching the selected tool behavior.</li>
          </ul>
        </li>
        <li>
          <h3>Download the processed PDF</h3>
          <p>
            When processing finishes, download the new file and continue with another PDF tool if
            your workflow needs more changes.
          </p>
        </li>
      </ol>
    </section>
  );
}
