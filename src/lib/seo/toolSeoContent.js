import { toolCategories } from '../../models/toolCategories';
import { absoluteUrl, siteConfig } from './site';

const categoryFeatures = {
  [toolCategories.pageStructure.id]: [
    'Page order, ranges, and document structure controls',
    'Downloadable PDF or ZIP output depending on the operation',
    'Related tools for rotating, splitting, extracting, and organizing pages',
  ],
  [toolCategories.contentEditing.id]: [
    'Visible PDF content edits with page and position controls',
    'Text, image, annotation, stamp, watermark, and numbering workflows',
    'Download-ready output that can continue into another PDF editing step',
  ],
  [toolCategories.formsMetadata.id]: [
    'Form, metadata, attachment, JavaScript, and document information controls',
    'Structured outputs for inspection tools and PDF downloads for document edits',
    'Options designed for repeatable document cleanup and review workflows',
  ],
  [toolCategories.securitySigning.id]: [
    'Password, permission, signature, timestamp, sanitizing, and redaction workflows',
    'Security-oriented processing with explicit output files and validation results',
    'Clear caveats where a first-pass service is not yet cryptographic parity',
  ],
  [toolCategories.conversionOcr.id]: [
    'Conversion, OCR, compression, repair, scan, image, and comparison workflows',
    'PDF downloads, ZIP exports, or JSON inspection files based on the tool',
    'Server-side processing paths that can later use Poppler, Ghostscript, OCR, and image binaries',
  ],
  [toolCategories.automationProduct.id]: [
    'Workflow, reader, API, folder scanning, SSO, and deployment-oriented PDF tools',
    'JSON definitions or guide outputs where the product workflow is still being built',
    'Internal links to every registered PDF operation for crawlable discovery',
  ],
  [toolCategories.recommended.id]: [
    'Common PDF editing controls for fast document changes',
    'Upload, configure, process, and download in one focused page',
    'Related tools for follow-up edits and document cleanup',
  ],
};

const specificFeatures = {
  pdfTextEditor: [
    'Cover selected PDF areas and draw replacement text',
    'Choose page numbers, box size, text color, and cover color',
    'Use visual editing for layout fixes while object-level text editing is upgraded',
  ],
  merge: [
    'Combine multiple PDFs in upload order',
    'Keep pages from every selected document',
    'Download one merged PDF file',
  ],
  split: [
    'Split after every page or specific page numbers',
    'Use page ranges for section-based outputs',
    'Download split PDF files in a ZIP archive',
  ],
  addPassword: [
    'Add an open password and owner password',
    'Set printing, editing, copying, and annotation permissions',
    'Use qpdf-backed encryption in the runtime environment',
  ],
  certSign: [
    'Add a visible certificate signature block',
    'Set signer name, reason, location, date, and page position',
    'Prepare the document for future cryptographic signing support',
  ],
  multiTool: [
    'Define several registered tool IDs in one workflow',
    'Review uploaded PDF summaries before chained execution is added',
    'Export a JSON workflow definition for the selected steps',
  ],
  automate: [
    'Name an automation and choose a trigger type',
    'Define repeatable PDF steps using registered tool IDs',
    'Export a workflow definition before persistence is added',
  ],
};

const getVerb = (tool) => {
  const name = tool.name.replace(/\bPDF\b/g, 'PDF');

  if (/^(Add|Remove|Extract|Replace|Validate|Compare|Convert|Compress|Repair|Read|Sanitize|Flatten|Unlock|Fill|Rotate|Crop|Merge|Split|Scale|Overlay|Redact|Automate|Timestamp|Change|Edit)/i.test(name)) {
    return name.toLowerCase();
  }

  return `use ${name.toLowerCase()}`;
};

const getOutputLabel = (tool) => {
  if (['split', 'removeBlanks', 'extractImages', 'scannerImageSplit'].includes(tool.id)) {
    return 'ZIP archive';
  }

  if (['getPdfInfo', 'validateSignature', 'showJS', 'compare', 'read', 'devApi', 'devFolderScanning', 'devSsoGuide', 'devAirgapped', 'multiTool', 'automate'].includes(tool.id)) {
    return 'JSON result';
  }

  return 'processed PDF';
};

export const getToolSeoContent = (tool) => {
  const verb = getVerb(tool);
  const featureList = specificFeatures[tool.id] || categoryFeatures[tool.category] || categoryFeatures[toolCategories.recommended.id];
  const outputLabel = getOutputLabel(tool);
  const actionKeyword = `${tool.name} online`;

  return {
    actionKeyword,
    supportingKeyword: `${tool.description} with private uploads, clear options, and a downloadable ${outputLabel}.`,
    howToTitle: `How to ${verb} online for free`,
    steps: [
      {
        title: `Select files for ${tool.name}`,
        body: tool.uploadMode === 'multiple'
          ? `Upload the PDF files in the order ${tool.name} should process them. The first file is used as the base document for tools that need one.`
          : `Upload the PDF file you want to process with ${tool.name}.`,
      },
      {
        title: `Choose ${tool.name.toLowerCase()} settings`,
        body: `Set the options for ${tool.name.toLowerCase()} and review the selected files before processing.`,
        features: featureList,
      },
      {
        title: `Download your ${outputLabel}`,
        body: `When the server finishes processing, save the ${outputLabel} and continue with another PDFForge tool if your document needs more changes.`,
      },
    ],
    subTasks: [
      {
        title: `${tool.name} options and controls`,
        body: `${tool.name} exposes the key controls needed for this workflow directly in the upload panel, so users can act before reading a long guide.`,
      },
      {
        title: `Private ${tool.name.toLowerCase()} processing`,
        body: 'Uploaded files are handled for the requested operation and the public page keeps the privacy and processing constraints visible near the primary action.',
      },
      {
        title: `Continue after ${tool.name.toLowerCase()}`,
        body: 'Related tools and the all-tools footer let users move into the next PDF task without returning to search results.',
      },
    ],
    workflows: [
      `${tool.name} for quick document cleanup`,
      `${tool.name} before sharing a PDF with clients or teammates`,
      `${tool.name} as one step in a larger PDF editing workflow`,
    ],
    limits: 'Free online processing for practical PDF workflows. Large, encrypted, malformed, or highly specialized PDFs may require a more advanced parity pass.',
  };
};

export const getToolJsonLd = (tool) => {
  const path = `/tools/${tool.slug}`;
  const url = absoluteUrl(path);
  const content = getToolSeoContent(tool);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${tool.name} Online`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url,
      description: tool.seoDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: content.steps[1].features,
      provider: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'PDF tools',
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.name,
          item: url,
        },
      ],
    },
  ];
};
