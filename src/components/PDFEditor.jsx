import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Download, Type, XCircle, ChevronLeft, ChevronRight, RefreshCw, MousePointer2, ZoomIn, ZoomOut } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Helper to map PDF.js font names to pdf-lib standard fonts
const mapFont = (fontName) => {
  const name = (fontName || '').toLowerCase();
  if (name.includes('bold') && name.includes('italic')) {
    if (name.includes('serif') || name.includes('times')) return StandardFonts.TimesRomanBoldItalic;
    if (name.includes('mono') || name.includes('courier')) return StandardFonts.CourierBoldOblique;
    return StandardFonts.HelveticaBoldOblique;
  }
  if (name.includes('bold')) {
    if (name.includes('serif') || name.includes('times')) return StandardFonts.TimesRomanBold;
    if (name.includes('mono') || name.includes('courier')) return StandardFonts.CourierBold;
    return StandardFonts.HelveticaBold;
  }
  if (name.includes('italic') || name.includes('oblique')) {
    if (name.includes('serif') || name.includes('times')) return StandardFonts.TimesRomanItalic;
    if (name.includes('mono') || name.includes('courier')) return StandardFonts.CourierOblique;
    return StandardFonts.HelveticaOblique;
  }
  if (name.includes('serif') || name.includes('times')) return StandardFonts.TimesRoman;
  if (name.includes('mono') || name.includes('courier')) return StandardFonts.Courier;
  return StandardFonts.Helvetica;
};

const PDFEditor = ({ file, onReset }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  
  const [texts, setTexts] = useState([]);
  const [extractedItems, setExtractedItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
        
        const textContent = await page.getTextContent();
        const items = textContent.items.map((item, idx) => {
          const tx = item.transform[4];
          const ty = item.transform[5];
          const [vx, vy] = viewport.convertToViewportPoint(tx, ty);
          
          return {
            id: `orig-${pageNum}-${idx}`,
            text: item.str,
            originalText: item.str,
            x: tx,
            y: ty,
            vx,
            vy,
            width: item.width,
            height: item.height,
            fontSize: Math.sqrt(item.transform[0]**2 + item.transform[1]**2),
            fontName: item.fontName,
            isModified: false,
            page: pageNum
          };
        });
        
        setExtractedItems(prev => {
           const otherPages = prev.filter(i => i.page !== pageNum);
           const modifiedThisPage = prev.filter(i => i.page === pageNum && i.isModified);
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
      size: 14,
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
      const fontCache = {};

      // Handle replacements (modified extracted items)
      for (let item of extractedItems) {
        if (item.isModified) {
          const page = pages[item.page - 1];
          
          // Match font
          const fontType = mapFont(item.fontName);
          if (!fontCache[fontType]) {
            fontCache[fontType] = await pdfLibDoc.embedFont(fontType);
          }
          const font = fontCache[fontType];

          // Whiteout
          page.drawRectangle({
            x: item.x - 1,
            y: item.y - 1,
            width: (item.width * 1.05) + 2,
            height: item.fontSize + 2,
            color: rgb(1, 1, 1),
          });

          // Draw new text with matched font
          page.drawText(item.text, {
            x: item.x,
            y: item.y,
            size: item.fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
      }

      // Handle new added texts
      for (let t of texts) {
        const page = pages[t.page - 1];
        const { width, height } = page.getSize();
        
        const font = await pdfLibDoc.embedFont(StandardFonts.Helvetica);
        const xPos = t.x * width;
        const yPos = height - (t.y * height) - (t.size);

        page.drawText(t.text, {
          x: xPos,
          y: yPos,
          size: t.size,
          font: font,
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
          <div className="toolbar-title">Navigation</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setPageNum(p => Math.max(1, p - 1)); setEditingId(null); }}
              disabled={pageNum <= 1}
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: '0.9rem' }}>
              {pageNum} / {numPages}
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setPageNum(p => Math.min(numPages, p + 1)); setEditingId(null); }}
              disabled={pageNum >= numPages}
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="toolbar-group">
          <div className="toolbar-title">Zoom</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setScale(s => Math.max(0.5, s - 0.25))} style={{ flex: 1, padding: '0.5rem' }}>
              <ZoomOut size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => setScale(s => Math.min(3, s + 0.25))} style={{ flex: 1, padding: '0.5rem' }}>
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        <div className="toolbar-group">
          <div className="toolbar-title">Tools</div>
          <button className="btn btn-secondary" onClick={addText}>
            <Type size={16} /> Add Text Box
          </button>
          <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '5px', lineHeight: '1.4'}}>
            <MousePointer2 size={10} style={{verticalAlign: 'middle', marginRight: '4px'}} /> 
            Click any text in the document to edit it directly.
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        <div className="toolbar-group">
          <button className="btn btn-primary" onClick={downloadPDF} disabled={isProcessing}>
            {isProcessing ? <RefreshCw className="spinner" size={16} /> : <Download size={16} />}
            {isProcessing ? 'Saving...' : 'Save & Download'}
          </button>
          <button className="btn btn-secondary" onClick={onReset} style={{ marginTop: '0.5rem', color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.2)' }}>
            <XCircle size={16} /> Close
          </button>
        </div>
      </aside>

      <main className="glass-panel main-viewer">
        <div 
          className="canvas-container" 
          onPointerMove={handlePointerMove}
        >
          <div style={{ position: 'relative', margin: '2rem', display: 'inline-block', transition: 'transform 0.2s ease' }}>
            <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '4px' }} />
            
            {/* Existing Text Edit Layers */}
            {!dragItem.current && currentExtracted.map(item => (
              <div
                key={item.id}
                className={`text-hit-area ${item.isModified ? 'is-modified' : ''} ${editingId === item.id ? 'is-editing' : ''}`}
                onClick={() => setEditingId(item.id)}
                style={{
                  left: item.vx,
                  top: item.vy - (item.fontSize * scale * 0.9), // Fine-tuned vertical alignment
                  width: Math.max(item.width * scale, 20),
                  height: item.fontSize * scale * 1.2,
                  position: 'absolute',
                  cursor: 'text',
                  display: 'flex',
                  alignItems: 'center',
                  background: item.isModified && editingId !== item.id ? 'white' : 'transparent',
                  overflow: 'visible',
                  whiteSpace: 'nowrap'
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
                      width: 'auto',
                      minWidth: '100%',
                      height: '100%',
                      fontFamily: item.fontName ? 'serif' : 'sans-serif' // Minimal visual hint
                    }}
                  />
                ) : (
                  item.isModified && (
                    <span style={{ 
                      fontSize: item.fontSize * scale, 
                      color: 'black',
                      pointerEvents: 'none',
                      fontFamily: item.fontName ? 'serif' : 'sans-serif'
                    }}>
                      {item.text}
                    </span>
                  )
                )}
              </div>
            ))}

            {/* New Text Boxes Overlay */}
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
