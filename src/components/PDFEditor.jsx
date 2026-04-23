import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Download, Type, XCircle, ChevronLeft, ChevronRight, RefreshCw, MousePointer2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const PDFEditor = ({ file, onReset }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  
  // Custom added texts
  const [texts, setTexts] = useState([]);
  // Extracted existing text items
  const [extractedItems, setExtractedItems] = useState([]);
  // Which item is being edited (if any)
  const [editingId, setEditingId] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Load the PDF Document via pdfjs
  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: file.data.slice(0) });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNum(1);
      } catch (error) {
        console.error("Error loading PDF", error);
        alert("Failed to load PDF.");
      }
    };
    loadPDF();
  }, [file]);

  // Render the current page and extract text
  useEffect(() => {
    if (!pdfDoc) return;

    const renderAndExtract = async () => {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      renderTaskRef.current = page.render(renderContext);
      try {
        await renderTaskRef.current.promise;
        
        // Extract text content
        const textContent = await page.getTextContent();
        const items = textContent.items.map((item, idx) => {
          // item.transform is [scaleX, skewX, skewY, scaleY, translateX, translateY]
          // PDF coordinates (0,0) at bottom-left.
          const tx = item.transform[4];
          const ty = item.transform[5];
          
          // Convert PDF coordinates to viewport coordinates
          const [vx, vy] = viewport.convertToViewportPoint(tx, ty);
          
          return {
            id: `orig-${pageNum}-${idx}`,
            text: item.str,
            originalText: item.str,
            x: tx, // original PDF X
            y: ty, // original PDF Y
            vx,    // viewport X for display
            vy,    // viewport Y for display
            width: item.width,
            height: item.height,
            fontSize: Math.sqrt(item.transform[0]**2 + item.transform[1]**2),
            fontName: item.fontName,
            isModified: false,
            page: pageNum
          };
        });
        
        // Only update items for this page that haven't been stored yet 
        // Or refresh them if we want to keep edits (more complex)
        // For now, we clear them for the page if they don't have edits.
        setExtractedItems(prev => {
           // Keep items from other pages, and keep modified items from this page
           const otherPages = prev.filter(i => i.page !== pageNum);
           const modifiedThisPage = prev.filter(i => i.page === pageNum && i.isModified);
           
           // For new ones, only add if they aren't already modified
           const newItems = items.filter(ni => !modifiedThisPage.some(mi => mi.id === ni.id));
           return [...otherPages, ...modifiedThisPage, ...newItems];
        });

      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error("Render error", err);
        }
      }
    };

    renderAndExtract();
  }, [pdfDoc, pageNum, scale]);

  const addText = () => {
    const newText = {
      id: Date.now(),
      page: pageNum,
      x: 0.5,
      y: 0.5,
      text: "New Text",
      size: 16,
      isNew: true
    };
    setTexts([...texts, newText]);
  };

  const currentTexts = texts.filter(t => t.page === pageNum);
  const currentExtracted = extractedItems.filter(i => i.page === pageNum);

  const updateExtractedText = (id, newText) => {
    setExtractedItems(prev => prev.map(item => 
      item.id === id ? { ...item, text: newText, isModified: newText !== item.originalText } : item
    ));
  };

  const updateNewText = (id, newProps) => {
    setTexts(texts.map(t => t.id === id ? { ...t, ...newProps } : t));
  };

  const removeText = (id) => {
    setTexts(texts.filter(t => t.id !== id));
  };

  // Drag text implementation (only for new added texts)
  const dragItem = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e, id) => {
    e.stopPropagation();
    const target = e.currentTarget;
    dragItem.current = id;
    dragOffset.current = {
      x: e.clientX - target.getBoundingClientRect().left,
      y: e.clientY - target.getBoundingClientRect().top
    };
  };

  const handlePointerMove = (e) => {
    if (!dragItem.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    let relX = (e.clientX - rect.left - dragOffset.current.x) / rect.width;
    let relY = (e.clientY - rect.top - dragOffset.current.y) / rect.height;
    
    relX = Math.max(0, Math.min(relX, 1));
    relY = Math.max(0, Math.min(relY, 1));

    updateNewText(dragItem.current, { x: relX, y: relY });
  };

  const handlePointerUp = () => {
    dragItem.current = null;
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const downloadPDF = async () => {
    setIsProcessing(true);
    try {
      const pdfLibDoc = await PDFDocument.load(file.data);
      pdfLibDoc.registerFontkit(fontkit);

      const pages = pdfLibDoc.getPages();

      // Handle replacements (modified extracted items)
      for (let item of extractedItems) {
        if (item.isModified) {
          const page = pages[item.page - 1];
          const { height } = page.getSize();
          
          // 1. Whiteout original text
          // Note: Width estimation is tricky, we use a heuristic or item.width from pdfjs
          // pdfjs item.width is in PDF units.
          page.drawRectangle({
            x: item.x - 2,
            y: item.y - 2,
            width: (item.width * 1.1) + 4,
            height: item.fontSize + 4,
            color: rgb(1, 1, 1), // White
          });

          // 2. Draw new text
          page.drawText(item.text, {
            x: item.x,
            y: item.y,
            size: item.fontSize,
            color: rgb(0, 0, 0),
          });
        }
      }

      // Handle new added texts
      for (let t of texts) {
        const page = pages[t.page - 1];
        const { width, height } = page.getSize();
        
        const textSizeInPdf = t.size; 
        const xPos = t.x * width;
        const yPos = height - (t.y * height) - (textSizeInPdf);

        page.drawText(t.text, {
          x: xPos,
          y: yPos,
          size: textSizeInPdf,
          color: rgb(0, 0, 0)
        });
      }

      const pdfBytes = await pdfLibDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to create PDF. " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="editor-workspace">
      <aside className="sidebar glass-panel">
        <div className="file-badge">
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
            {file.name}
          </span>
        </div>
        
        <div className="toolbar-group">
          <div className="toolbar-title">Pages ({pageNum}/{numPages})</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setPageNum(p => Math.max(1, p - 1)); setEditingId(null); }}
              disabled={pageNum <= 1}
              style={{ flex: 1 }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setPageNum(p => Math.min(numPages, p + 1)); setEditingId(null); }}
              disabled={pageNum >= numPages}
              style={{ flex: 1 }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="toolbar-group" style={{ marginTop: '1rem' }}>
          <div className="toolbar-title">Tools</div>
          <button className="btn btn-secondary" onClick={addText}>
            <Type size={16} /> Add New Text
          </button>
          <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '5px'}}>
            <MousePointer2 size={10} inline /> Click existing text to edit it
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        <div className="toolbar-group">
          <button className="btn btn-primary" onClick={downloadPDF} disabled={isProcessing}>
            {isProcessing ? <RefreshCw className="spinner" style={{width: 16, height: 16}} /> : <Download size={16} />}
            {isProcessing ? 'Processing...' : 'Download PDF'}
          </button>
          <button className="btn btn-secondary" onClick={onReset} style={{ marginTop: '0.5rem', color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.2)' }}>
            <XCircle size={16} /> Close Document
          </button>
        </div>
      </aside>

      <main className="glass-panel main-viewer">
        <div 
          className="canvas-container" 
          onPointerMove={handlePointerMove}
        >
          <div style={{ position: 'relative', margin: '2rem auto', display: 'inline-block' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
            
            {/* HIT AREAS for existing text */}
            {!dragItem.current && currentExtracted.map(item => (
              <div
                key={item.id}
                className={`text-hit-area ${item.isModified ? 'is-modified' : ''} ${editingId === item.id ? 'is-editing' : ''}`}
                onClick={() => setEditingId(item.id)}
                style={{
                  left: item.vx,
                  top: item.vy - (item.fontSize * scale), // Adjust because vy is baseline in converter usually
                  width: item.width * scale,
                  height: item.fontSize * scale,
                  position: 'absolute',
                  cursor: 'text',
                  display: 'flex',
                  alignItems: 'center',
                  // Hide original text by using a solid background when modified
                  background: item.isModified && editingId !== item.id ? 'white' : 'transparent',
                  color: 'black'
                }}
              >
                {editingId === item.id ? (
                  <input
                    autoFocus
                    className="extracted-text-input"
                    value={item.text}
                    onChange={(e) => updateExtractedText(item.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    style={{
                      fontSize: item.fontSize * scale,
                      width: '100%',
                      height: '100%'
                    }}
                  />
                ) : (
                  item.isModified && (
                    <span style={{ 
                      fontSize: item.fontSize * scale, 
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none'
                    }}>
                      {item.text}
                    </span>
                  )
                )}
              </div>
            ))}

            {/* Overlays for NEW added texts */}
            {canvasRef.current && currentTexts.map(t => (
              <div 
                key={t.id}
                className="absolute-text-container"
                style={{
                  left: t.x * canvasRef.current.width,
                  top: t.y * canvasRef.current.height,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <input
                  type="text"
                  className="absolute-text-input"
                  value={t.text}
                  onChange={(e) => updateNewText(t.id, { text: e.target.value })}
                  onPointerDown={(e) => handlePointerDown(e, t.id)}
                  style={{
                    fontSize: t.size * scale,
                    cursor: dragItem.current === t.id ? 'grabbing' : 'grab'
                  }}
                />
                <button 
                  className="delete-text-btn" 
                  onClick={() => removeText(t.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDFEditor;
