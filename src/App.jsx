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
  'Text fields for names, dates, amounts, and addresses',
  'Multi-line text areas for comments, feedback, or long-form answers',
  'Checkboxes and radio buttons for approvals, options, and multiple choices',
  'Dropdown menus and list boxes for controlled responses and pick-lists',
  'Signature fields for digital signatures, initials, and signed agreements',
  'Interactive elements like links, clickable labels, and helper tooltips',
  'Functional controls for tab order, field properties, and validation rules',
];

const workflowSteps = [
  {
    title: 'Upload your document or start from scratch',
    body: 'Start with an existing PDF, a scanned paper form, or a document exported from Word or Google Docs. Our editor preserves your layout while you add the interactive layer.',
  },
  {
    title: 'Add interactive fields and form content',
    body: 'Place fillable PDF fields anywhere on the page. Configure field names, set required flags, and adjust fonts. You can also edit existing text, add images, or insert signature boxes.',
  },
  {
    title: 'Finalize, protect, and publish',
    body: 'Review your fillable form, export the updated PDF, or continue with specialized tools to flatten fields, password protect the document, or automate your data collection workflow.',
  },
];

const subTasks = [
  {
    title: 'Convert static PDF to interactive forms',
    body: 'Transform "flat" documents into dynamic forms by overlaying writable fields on top of blank lines, boxes, and signature spaces without losing the original formatting.',
  },
  {
    title: 'Make Word documents fillable',
    body: 'Export your Word doc as a PDF and upload it here to add checkboxes, text fields, and dropdowns. It\'s the fastest way to create professional PDF forms from a text editor base.',
  },
  {
    title: 'Optimize PDF forms for better UX',
    body: 'Configure the tab order so users can navigate between fields logically. Set helper labels and validation rules to ensure you collect accurate data from every respondent.',
  },
  {
    title: 'Sign and collect signatures online',
    body: 'Add designated signature areas to your PDF. Once fillable, you can send the document for signing or use it as a reusable template for job applications and contracts.',
  },
  {
    title: 'Common use cases for fillable PDFs',
    body: 'Perfect for W-9 forms, rental agreements, customer surveys, job applications, medical history forms, and any document requiring user input and electronic signatures.',
  },
];

const faqItems = [
  {
    question: 'How do I make a PDF fillable online?',
    answer:
      'Upload your PDF to our editor, click the form field tools to place text boxes, checkboxes, or dropdowns, and then save your document. Our tool creates standard AcroForms that are compatible with all major PDF readers.',
  },
  {
    question: 'Can I create a fillable PDF from a Word document?',
    answer:
      'Yes. The best workflow is to save your Word document as a PDF first, then upload it to PDFForge to add the interactive fields, signature boxes, and checkboxes over the layout.',
  },
  {
    question: 'How do I add a signature field to my PDF?',
    answer:
      'Select the "Signature field" tool and click on the area where you want the user to sign. You can also add your own signature by typing, drawing, or uploading an image of your handwritten signature.',
  },
  {
    question: 'Can I set fields as "Required" in the PDF?',
    answer:
      'Absolutely. You can click on any form field to open its properties and mark it as required. This helps ensure that users don\'t skip critical information when filling out your form.',
  },
  {
    question: 'Does this work on scanned documents?',
    answer:
      'Yes. If your PDF is a scan of a paper form, you can simply overlay fillable fields on top of the scanned image. If you need to make the scanned text searchable first, use our OCR PDF tool before adding form fields.',
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
              <p className="eyebrow">Free online PDF forms creator</p>
              <h1 id="landing-title">Create Fillable PDF Online</h1>
              <p className="landing-subtitle">
                Make existing PDF documents fillable, build interactive forms from scratch, edit PDF text visually, and use free online PDF tools to merge, split, compress, OCR, and automate workflows.
              </p>
              <ul className="hero-trust-list">
                <li>Convert static PDFs, Word docs, and scanned forms into dynamic, writable documents.</li>
                <li>Add text fields, checkboxes, radio buttons, dropdowns, and digital signature areas.</li>
                <li>Files are processed securely in your browser; server-side tools use private task-specific environments.</li>
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
                <span>Local device upload</span>
                <span>Create interactive AcroForms</span>
                <span>Enterprise cloud workflows</span>
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
