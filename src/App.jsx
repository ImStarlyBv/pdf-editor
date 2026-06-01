'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { UploadCloud } from 'lucide-react';
import { toolCategories } from './models/toolCategories';

const PDFEditor = dynamic(() => import('./components/PDFEditor'), {
  ssr: false,
});

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
    title: 'Upload your PDF document',
    body: 'Start with an existing PDF, a scanned paper form, or a document exported from Word or Google Docs. The editor keeps the page layout visible while you add fields and review the file.',
  },
  {
    title: 'Add interactive fields and form content',
    body: 'Place fillable PDF fields where people need to type, choose an option, or sign. You can also prepare labels, helper text, annotations, images, and visual text updates.',
  },
  {
    title: 'Finalize, protect, and publish',
    body: 'Review the edited PDF, export the updated document, or continue with a focused tool for flattening, passwords, page cleanup, OCR, signing, or automation.',
  },
];

const subTasks = [
  {
    title: 'Convert static PDF to interactive forms',
    body: 'Transform "flat" documents into dynamic forms by overlaying writable fields on top of blank lines, boxes, and signature spaces without losing the original formatting.',
  },
  {
    title: 'Make Word documents fillable',
    body: 'Export your Word document as a PDF and upload it here to add checkboxes, text fields, and dropdowns over the existing layout.',
  },
  {
    title: 'Optimize PDF forms for better UX',
    body: 'Use clear labels, logical field placement, and review steps so the form is easier to complete before you share or archive it.',
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
      'Upload your PDF, add fields where someone needs to type or choose an answer, then export the updated document. Use the footer directory when you need a related task such as OCR, signing, compression, or page cleanup.',
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
      'Use clear labels and field settings where available, then test the exported file in your target PDF reader before publishing the form.',
  },
  {
    question: 'Does this work on scanned documents?',
    answer:
      'Yes. If your PDF is a scan of a paper form, you can simply overlay fillable fields on top of the scanned image. If you need to make the scanned text searchable first, use our OCR PDF tool before adding form fields.',
  },
];

const toolFamilies = [
  {
    title: toolCategories.formsMetadata.name,
    body: 'Create, fill, flatten, unlock, inspect, and prepare PDF forms and metadata when a document needs structured input.',
  },
  {
    title: toolCategories.contentEditing.name,
    body: 'Add text, signatures, annotations, images, stamps, watermarks, and page numbers when the visible PDF needs edits.',
  },
  {
    title: toolCategories.pageStructure.name,
    body: 'Merge, split, crop, rotate, extract, reorder, and resize pages when the document structure needs cleanup.',
  },
  {
    title: toolCategories.conversionOcr.name,
    body: 'Compress, convert, repair, compare, extract images, improve scans, and run OCR when the source file needs processing.',
  },
  {
    title: toolCategories.securitySigning.name,
    body: 'Protect, sanitize, redact, sign, timestamp, validate, and update permissions when the PDF needs security controls.',
  },
  {
    title: toolCategories.automationProduct.name,
    body: 'Use multi-tool and automation workflows when the same PDF process needs to run repeatedly.',
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
