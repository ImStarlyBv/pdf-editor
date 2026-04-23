import { useState } from 'react';
import PDFEditor from './components/PDFEditor';
import { UploadCloud } from 'lucide-react';

function App() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        setPdfFile({
          name: file.name,
          data: new Uint8Array(e.target.result)
        });
      };
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
       const reader = new FileReader();
       reader.readAsArrayBuffer(file);
       reader.onload = (e) => {
         setPdfFile({
           name: file.name,
           data: new Uint8Array(e.target.result)
         });
       };
    }
  };

  const preventDefault = (e) => e.preventDefault();

  return (
    <div className="container">
      <header className="header">
        <h1>PDFForge Editor</h1>
        <p>Free Fillable PDF Creator: Learn how to make a PDF fillable and generate editable PDFs in seconds.</p>
      </header>

      {!pdfFile ? (
        <>
          <div 
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <UploadCloud className="dropzone-icon" />
            <h2>Drag & Drop your PDF here</h2>
            <p>Or click to browse from your device to start making your PDF fillable</p>
            <input 
              type="file" 
              id="file-upload" 
              accept="application/pdf" 
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          <section className="seo-section">
            <div className="seo-grid">
              <div className="seo-card">
                <h3>Create & Edit PDFs</h3>
                <ul>
                  <li><strong>How to make a PDF fillable:</strong> Simply upload your document and start adding interactive fields.</li>
                  <li><strong>Generate editable PDF:</strong> Turn any static document into a dynamic, writable file.</li>
                  <li><strong>Create fillable PDF free:</strong> Our serverless tool allows you to build forms without any subscription.</li>
                </ul>
              </div>
              <div className="seo-card">
                <h3>Advanced Features</h3>
                <ul>
                  <li><strong>How to replace a word with another word in PDF:</strong> Use our direct text editing tool to modify existing content.</li>
                  <li><strong>Add fillable fields in PDF:</strong> Insert text inputs, checkboxes, and more with ease.</li>
                  <li><strong>Hyperlink in PDF document:</strong> Enhance your files by adding clickable web links.</li>
                </ul>
              </div>
              <div className="seo-card">
                <h3>Conversion Tools</h3>
                <ul>
                  <li><strong>Convert Word doc to fillable PDF:</strong> Easily change PDF form to fillable after converting from Word.</li>
                  <li><strong>Word document fillable field:</strong> Learn how to make a word document fillable and export it as a PDF.</li>
                  <li><strong>How to convert a word document to a fillable PDF:</strong> A step-by-step guide for seamless document workflow.</li>
                </ul>
              </div>
            </div>
            <div className="seo-content-footer" style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>PDFForge is the ultimate <strong>fillable PDF form creator</strong>. Whether you need to <strong>insert fillable field in PDF</strong>, <strong>making fillable PDF</strong> from scratch, or <strong>change PDF form to fillable</strong>, our tool has you covered. Learn <strong>how to create a fillable PDF</strong> or <strong>how can I create a fillable PDF form</strong> today for free!</p>
            </div>

            <article className="seo-detailed-content" style={{ marginTop: '4rem', textAlign: 'left', maxWidth: '900px', margin: '4rem auto' }}>
              <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Comprehensive Guide: How to Create a Fillable PDF Form</h2>
              
              <section style={{ marginBottom: '2rem' }}>
                <h3>How to make a PDF fillable easily?</h3>
                <p>To <strong>make a PDF fillable</strong>, simply drag your document into our serverless editor. Our tool allows you to <strong>add fillable fields in PDF</strong> documents instantly. You can <strong>generate editable PDF</strong> files from static ones by overlaying new text or modifying existing lines. This is the most efficient way to <strong>create fillable PDF free</strong> without downloading heavy software.</p>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h3>How to create a fillable PDF from a Word document?</h3>
                <p>If you are wondering <strong>how to convert a word document to a fillable PDF</strong>, the process is simple. First, save your Word file as a PDF. Then, upload it to PDFForge to <strong>insert fillable field in PDF</strong> areas where you need user input. This effectively lets you <strong>convert word form to fillable PDF</strong> while maintaining your original layout. Many users ask <strong>how to make a word document fillable</strong>; the best answer is to use a dedicated <strong>fillable PDF form creator</strong> like ours.</p>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h3>Can I replace words in an existing PDF?</h3>
                <p>Yes! If you need to know <strong>how to replace a word with another word in PDF</strong>, our editor provides a unique "click-to-edit" feature. We extract the text layers, allowing you to <strong>generate editable PDF</strong> content directly. You can <strong>change PDF form to fillable</strong> and edit the labels or instructions within the document itself, ensuring a professional <strong>making fillable PDF</strong> experience.</p>
              </section>

              <section style={{ marginBottom: '2rem' }}>
                <h3>Professional Writable PDF Document Generation</h3>
                <p>Our platform is designed for those who need a <strong>writable PDF document</strong> for business or personal use. Whether you are <strong>converting a word form to a fillable PDF form</strong> or looking for <strong>word document fillable field</strong> solutions, our tool provides the flexibility to <strong>add fillable fields to word</strong>-originated PDFs. You can even include a <strong>hyperlink in PDF document</strong> files to direct users to external resources.</p>
              </section>
            </article>
          </section>
        </>
      ) : (
        <PDFEditor file={pdfFile} onReset={() => setPdfFile(null)} />
      )}
    </div>
  );
}

export default App;
