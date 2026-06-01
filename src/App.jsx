'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { UploadCloud } from 'lucide-react';
import { toolCategories } from './models/toolCategories';

const PDFEditor = dynamic(() => import('./components/PDFEditor'), {
  ssr: false,
});

const formFieldTypes = [
  'Easy-to-use text fields for names, dates, and amounts',
  'Multi-line areas for longer answers and detailed feedback',
  'Simple checkboxes and radio buttons for quick selections',
  'Drop-down menus to help users pick from a list of options',
  'Secure signature boxes for digital and handwritten signatures',
  'Helpful links, clickable labels, and on-screen tips',
  'Smart controls to set the field order and basic form rules',
];

const workflowSteps = [
  {
    title: 'Upload your document',
    body: 'Start with an existing PDF, a scanned form, or a document exported from Word or Google Docs. The editor keeps the page layout visible while you add fields and review the file.',
  },
  {
    title: 'Add form fields and edit content',
    body: 'Place fields where people need to type, choose an option, or sign. You can also prepare labels, helper text, annotations, images, and visual text updates.',
  },
  {
    title: 'Review, export, and continue',
    body: 'Review the edited document, export the updated file, or continue with a focused tool for flattening, passwords, page cleanup, OCR, signing, or automation.',
  },
];

const subTasks = [
  {
    title: 'Turn flat PDFs into interactive forms',
    body: 'Add writable fields over blank lines and signature spaces so an existing document can collect structured answers.',
  },
  {
    title: 'Make Word docs easy to fill out',
    body: 'Export your Word document as a PDF and upload it here to add checkboxes, text fields, and dropdowns over the existing layout.',
  },
  {
    title: 'Better forms for better results',
    body: 'Use clear labels, logical field placement, and review steps so the form is easier to complete before you share or archive it.',
  },
  {
    title: 'Sign documents in seconds',
    body: 'Add clear spots for signatures so your clients know exactly where to sign. It\'s perfect for contracts, job applications, and simple agreements.',
  },
  {
    title: 'Ready for any document',
    body: 'Use form tools for W-9s, rental forms, surveys, and similar documents that need structured responses.',
  },
];

const faqItems = [
  {
    question: 'How can I make a PDF fillable online?',
    answer:
      'Upload your PDF, add fields where someone needs to type or choose an answer, then export the updated document. Use the footer directory when you need a related task such as OCR, signing, compression, or page cleanup.',
  },
  {
    question: 'Can I turn a Word doc into a fillable PDF?',
    answer:
      'Yes! First, save your Word file as a PDF. Then upload it here to add signature spots, checkboxes, and interactive fields over your original layout.',
  },
  {
    question: 'Where can people sign my PDF?',
    answer:
      'You can place a "Signature field" anywhere on the page. Users can then type, draw, or upload their signature directly into that spot.',
  },
  {
    question: 'Can I make some fields required?',
    answer:
      'Use clear labels and field settings where available, then test the exported file in your target PDF reader before publishing the form.',
  },
  {
    question: 'Does this work with scanned paper forms?',
    answer:
      'Yes. You can place fillable fields right on top of a scanned image. If you need to search the text first, use our OCR tool before adding the form fields.',
  },
];

const toolFamilies = [
  {
    title: toolCategories.formsMetadata.name,
    body: 'Everything you need for PDF forms: create, fill, flatten, and manage document data with ease.',
  },
  {
    title: toolCategories.contentEditing.name,
    body: 'Quickly add text, signatures, and images, or markup your pages with notes and highlights.',
  },
  {
    title: toolCategories.pageStructure.name,
    body: 'Organize your document by merging, splitting, rotating, or reordering pages exactly how you want them.',
  },
  {
    title: toolCategories.conversionOcr.name,
    body: 'Professional-grade tools to compress, convert, repair, and turn scanned files into searchable documents.',
  },
  {
    title: toolCategories.securitySigning.name,
    body: 'Keep your information safe with password protection, secure redaction, and official digital signatures.',
  },
  {
    title: toolCategories.automationProduct.name,
    body: 'Save time with powerful automation that can run multiple PDF tasks for you at once.',
  },
];

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
                <li>Use the focused tools for PDF tasks that need extra processing, and review the result before sharing important documents.</li>
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
                <span>Prepare interactive form fields</span>
                <span>Continue with focused PDF tools</span>
              </div>
            </div>
          </section>

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
              <p className="eyebrow">PDF tool categories</p>
              <h2 id="tool-directory-title">Choose the next PDF task in context</h2>
              <p>
                The footer contains the complete tool directory. This overview explains what each group is for so the links are useful to people, not repeated as a keyword list.
              </p>
            </div>
            <div className="landing-tool-directory">
              {toolFamilies.map((family) => (
                <article key={family.title} className="tool-directory-group">
                  <h3>{family.title}</h3>
                  <p>{family.body}</p>
                </article>
              ))}
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
              <a className="btn btn-secondary" href="#all-pdf-tools">
                Browse PDF tools
              </a>
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
