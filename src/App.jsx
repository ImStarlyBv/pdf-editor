'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { UploadCloud } from 'lucide-react';
import { getToolsByCategory, toolRegistry } from './models/toolRegistry';
import { toolCategories } from './models/toolCategories';

const PDFEditor = dynamic(() => import('./components/PDFEditor'), {
  ssr: false,
});

const featuredToolIds = [
  'pdfTextEditor',
  'formFill',
  'merge',
  'split',
  'compress',
  'ocr',
  'sign',
  'addPassword',
];

const formFieldTypes = [
  'Text boxes for names, dates, totals, and addresses',
  'Multi-line fields for comments or application answers',
  'Checkboxes and radio options for approvals and choices',
  'Dropdown-style fields for controlled responses',
  'Signature areas for signed PDF forms and agreements',
  'Links, labels, page numbers, stamps, and helper text',
];

const workflowSteps = [
  {
    title: 'Upload or drop in your PDF',
    body: 'Start with an existing PDF, a scanned form, or a document exported from Word. The editor keeps the original page layout visible while you prepare fields and text.',
  },
  {
    title: 'Add editable fields and PDF content',
    body: 'Place fillable PDF fields, update labels, add text, create links, insert signatures, annotate pages, or route the file to a focused PDF tool when the job needs merge, split, OCR, compression, or protection.',
  },
  {
    title: 'Review, save, and reuse the workflow',
    body: 'Check the finished PDF form, export the edited document, or continue with related tools such as flatten PDF, unlock PDF forms, password protect PDF, and automate PDF.',
  },
];

const subTasks = [
  {
    title: 'Create a fillable PDF from a flat form',
    body: 'Convert a static PDF into a writable document by placing fields over blank lines, table cells, signature spaces, and approval boxes.',
  },
  {
    title: 'Edit visible PDF text',
    body: 'Use visual cover-and-replace editing for quick wording changes, typo fixes, labels, instructions, and form prompts without rebuilding the whole file.',
  },
  {
    title: 'Prepare PDFs made from Word documents',
    body: 'Export the Word document as a PDF, upload it here, then add fillable fields, checkboxes, signature areas, or links where people need to respond.',
  },
  {
    title: 'Publish cleaner PDF workflows',
    body: 'Finish form work with compression, page organization, OCR, metadata cleanup, password protection, signing, or reusable multi-tool automation.',
  },
];

const faqItems = [
  {
    question: 'How do I make a PDF fillable online?',
    answer:
      'Upload the PDF, add fields where people need to type or choose an answer, then export the updated file. You can also use related PDF form tools to unlock fields, fill forms, flatten responses, or edit metadata.',
  },
  {
    question: 'Can I create a fillable PDF from a Word document?',
    answer:
      'Yes. Save or print the Word document as a PDF first, then use PDFForge to add fillable fields, signature boxes, checkboxes, radio options, links, and helper labels over the preserved layout.',
  },
  {
    question: 'Is this only a fillable PDF creator?',
    answer:
      'No. The landing editor focuses on editable and fillable PDFs, while the tool directory covers common PDF tasks such as merge PDF, split PDF, compress PDF, OCR PDF, sign PDF, redact PDF, organize pages, and automate PDF workflows.',
  },
  {
    question: 'Does the PDF text editor rewrite original PDF objects?',
    answer:
      'The current text editor is a visual cover-and-replace workflow for reliable page appearance. Object-level PDF text rewriting needs stricter font, encoding, and layout handling and should be added as a separate advanced mode.',
  },
];

const groupedTools = getToolsByCategory();
const featuredTools = featuredToolIds
  .map((id) => toolRegistry.find((tool) => tool.id === id))
  .filter(Boolean);

function App() {
  const [pdfFile, setPdfFile] = useState(null);

  const loadPdfFile = (file) => {
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        setPdfFile({
          name: file.name,
          data: new Uint8Array(event.target.result),
        });
      };
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleFileUpload = (event) => {
    loadPdfFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    loadPdfFile(event.dataTransfer.files[0]);
  };

  const preventDefault = (event) => event.preventDefault();

  return (
    <main id="content" className="container landing-page" tabIndex={-1}>
      {!pdfFile ? (
        <>
          <section className="landing-hero" aria-labelledby="landing-title">
            <div className="landing-hero-copy">
              <p className="eyebrow">Online PDF editor and form builder</p>
              <h1 id="landing-title">Create Fillable PDF Online</h1>
              <p className="landing-subtitle">
                Build writable PDF forms, edit PDF text visually, add signatures, organize pages, and continue with free online PDF tools for merge, split, compress, OCR, convert, protect, and automate workflows.
              </p>
              <ul className="hero-trust-list">
                <li>Start with an existing PDF form, scanned document, or Word-exported PDF.</li>
                <li>Use focused tools for editing, forms, page organization, conversion, security, and signing.</li>
                <li>Files are loaded into the editor in your browser; server tools use task-specific processing.</li>
              </ul>
            </div>

            <div
              className="dropzone landing-upload-panel"
              onDrop={handleDrop}
              onDragOver={preventDefault}
              onDragEnter={preventDefault}
              onClick={() => document.getElementById('file-upload')?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  document.getElementById('file-upload')?.click();
                }
              }}
            >
              <UploadCloud className="dropzone-icon" aria-hidden="true" />
              <h2>Upload PDF to start editing</h2>
              <p>Drag and drop a PDF or browse your device to make a PDF fillable, add fields, and export an editable document.</p>
              <input
                type="file"
                id="file-upload"
                accept="application/pdf"
                className="visually-hidden"
                onChange={handleFileUpload}
              />
              <div className="upload-source-row" aria-label="Additional upload options">
                <span>Device upload</span>
                <span>Blank form workflow coming next</span>
                <span>Cloud imports planned</span>
              </div>
            </div>
          </section>

          <nav className="quick-tool-nav" aria-label="Popular PDF tools">
            {featuredTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                {tool.name}
              </Link>
            ))}
          </nav>

          <section className="seo-section landing-how-to" aria-labelledby="how-to-title">
            <div className="section-heading">
              <p className="eyebrow">Step-by-step PDF form workflow</p>
              <h2 id="how-to-title">How to create a fillable PDF form free</h2>
              <p>
                The fastest pattern is action first, then details: upload your PDF, add the fields people need, review the page order and text, then export or continue with another PDF tool.
              </p>
            </div>

            <ol className="workflow-list">
              {workflowSteps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="feature-callout">
              <h3>Fillable PDF field types and editing actions</h3>
              <ul>
                {formFieldTypes.map((fieldType) => (
                  <li key={fieldType}>{fieldType}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="seo-section" aria-labelledby="task-guides-title">
            <div className="section-heading">
              <p className="eyebrow">Semantic PDF tasks</p>
              <h2 id="task-guides-title">Common ways to edit, prepare, and publish PDF documents</h2>
            </div>
            <div className="seo-grid">
              {subTasks.map((task) => (
                <article className="seo-card" key={task.title}>
                  <h3>{task.title}</h3>
                  <p>{task.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="seo-section tool-directory-section" aria-labelledby="tool-directory-title">
            <div className="section-heading">
              <p className="eyebrow">All online PDF tools</p>
              <h2 id="tool-directory-title">Choose a PDF tool by task</h2>
              <p>
                Use these internal links to move from the fillable PDF editor into specialized PDF tools for pages, text, forms, conversion, OCR, signatures, security, and automation.
              </p>
            </div>
            <div className="landing-tool-directory">
              {Object.values(toolCategories).map((category) => {
                const tools = groupedTools[category.id] || [];

                if (tools.length === 0) {
                  return null;
                }

                return (
                  <section key={category.id} className="tool-directory-group">
                    <h3>{category.name}</h3>
                    <ul>
                      {tools.slice(0, 10).map((tool) => (
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
          </section>

          <section className="seo-section faq-section" aria-labelledby="faq-title">
            <div className="section-heading">
              <p className="eyebrow">PDF editor questions</p>
              <h2 id="faq-title">Fillable PDF and online PDF tool FAQ</h2>
            </div>
            <div className="faq-list">
              {faqItems.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="final-cta landing-final-cta" aria-labelledby="final-cta-title">
            <h2 id="final-cta-title">Ready to make a fillable PDF online?</h2>
            <p>Upload a PDF to start editing, or open a focused PDF tool when you need merge, split, OCR, compression, signing, page cleanup, or automation.</p>
            <div className="cta-actions">
              <button className="btn btn-primary" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                Upload PDF
              </button>
              <Link className="btn btn-secondary" href="/tools/pdf-tools">
                Browse PDF tools
              </Link>
            </div>
          </section>
        </>
      ) : (
        <PDFEditor file={pdfFile} onReset={() => setPdfFile(null)} />
      )}
    </main>
  );
}

export default App;
