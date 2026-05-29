import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const makeOutputFilename = (filename, suffix) => {
  const safeName = filename?.replace(/[\\/:*?"<>|]+/g, '').trim() || 'document.pdf';
  const baseName = safeName.toLowerCase().endsWith('.pdf') ? safeName.slice(0, -4) : safeName;
  return `${baseName}${suffix}`;
};

const pageSizes = {
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  LETTER: [612, 792],
  LEGAL: [612, 1008],
};

const getTargetPageSize = ({ pageSize = 'A4', orientation = 'PORTRAIT', fallback }) => {
  const baseSize = pageSize === 'KEEP' ? fallback : pageSizes[pageSize];

  if (!baseSize) {
    throw new Error(`Unsupported page size: ${pageSize}`);
  }

  const [width, height] = baseSize;
  return orientation === 'LANDSCAPE'
    ? [Math.max(width, height), Math.min(width, height)]
    : [Math.min(width, height), Math.max(width, height)];
};

const getPositiveNumber = ({ value, fallback, label }) => {
  const parsed = Number(value ?? fallback);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label} must be greater than 0.`);
  }

  return parsed;
};

const getNonNegativeNumber = ({ value, fallback = 0, label }) => {
  const parsed = Number(value ?? fallback);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} must be 0 or greater.`);
  }

  return parsed;
};

const getBoolean = (value, fallback = false) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value.toString() === 'true' || value.toString() === 'on';
};

const getPositiveInteger = ({ value, fallback, label }) => {
  const parsed = Number.parseInt(value ?? fallback, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive whole number.`);
  }

  return parsed;
};

const parsePositiveIntegerList = ({ value, expectedLength, label }) => {
  const entries = (value || '')
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isInteger(item));

  if (entries.length !== expectedLength || entries.some((item) => item <= 0)) {
    throw new Error(`${label} must contain ${expectedLength} positive whole numbers.`);
  }

  return entries;
};

const parseHexColor = (value) => {
  const match = value?.trim().match(/^#?([0-9a-f]{6})$/i);

  if (!match) {
    return rgb(0, 0, 0);
  }

  const hex = match[1];
  return rgb(
    Number.parseInt(hex.slice(0, 2), 16) / 255,
    Number.parseInt(hex.slice(2, 4), 16) / 255,
    Number.parseInt(hex.slice(4, 6), 16) / 255,
  );
};

const getMarginFactor = (customMargin) => {
  switch ((customMargin || 'medium').toLowerCase()) {
    case 'small':
      return 0.02;
    case 'large':
      return 0.05;
    case 'x-large':
      return 0.075;
    case 'medium':
    default:
      return 0.035;
  }
};

const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

const getCrc32 = (bytes) => {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
};

const concatBytes = (chunks) => {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }

  return output;
};

const uint16 = (value) => {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, value, true);
  return bytes;
};

const uint32 = (value) => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, true);
  return bytes;
};

const textBytes = (value) => new TextEncoder().encode(value);

const createZip = (entries) => {
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const entry of entries) {
    const name = textBytes(entry.name);
    const data = entry.bytes;
    const crc = getCrc32(data);

    const localHeader = concatBytes([
      uint32(0x04034b50),
      uint16(20),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(crc),
      uint32(data.length),
      uint32(data.length),
      uint16(name.length),
      uint16(0),
      name,
    ]);

    localChunks.push(localHeader, data);

    centralChunks.push(concatBytes([
      uint32(0x02014b50),
      uint16(20),
      uint16(20),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(crc),
      uint32(data.length),
      uint32(data.length),
      uint16(name.length),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(0),
      uint32(offset),
      name,
    ]));

    offset += localHeader.length + data.length;
  }

  const centralDirectory = concatBytes(centralChunks);
  const endOfCentralDirectory = concatBytes([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(entries.length),
    uint16(entries.length),
    uint32(centralDirectory.length),
    uint32(offset),
    uint16(0),
  ]);

  return concatBytes([...localChunks, centralDirectory, endOfCentralDirectory]);
};

const parsePageNumbers = ({ value, totalPages, label = 'page numbers' }) => {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.toLowerCase() === 'all') {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const pages = new Set();

  for (const part of trimmed.split(',')) {
    const token = part.trim();
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (start > end) {
        throw new Error(`Invalid ${label}: range ${token} must start before it ends.`);
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page - 1);
      }
      continue;
    }

    if (/^\d+$/.test(token)) {
      pages.add(Number(token) - 1);
      continue;
    }

    throw new Error(`Invalid ${label}: ${token}`);
  }

  const parsedPages = [...pages].sort((a, b) => a - b);
  const invalidPage = parsedPages.find((page) => page < 0 || page >= totalPages);

  if (invalidPage !== undefined) {
    throw new Error(`Invalid ${label}: page ${invalidPage + 1} is outside this PDF.`);
  }

  return parsedPages;
};

const parsePageOrder = ({ value, totalPages, label = 'page order' }) => {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.toLowerCase() === 'all') {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const pages = [];

  for (const part of trimmed.split(',')) {
    const token = part.trim();
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      const step = start <= end ? 1 : -1;

      for (let page = start; page !== end + step; page += step) {
        pages.push(page - 1);
      }
      continue;
    }

    if (/^\d+$/.test(token)) {
      pages.push(Number(token) - 1);
      continue;
    }

    throw new Error(`Invalid ${label}: ${token}`);
  }

  const invalidPage = pages.find((page) => page < 0 || page >= totalPages);

  if (invalidPage !== undefined) {
    throw new Error(`Invalid ${label}: page ${invalidPage + 1} is outside this PDF.`);
  }

  return pages;
};

const copyPagesToNewDocument = async (sourceDocument, pageIndices) => {
  if (pageIndices.length === 0) {
    throw new Error('At least one page must remain in the output PDF.');
  }

  const outputDocument = await PDFDocument.create();
  const copiedPages = await outputDocument.copyPages(sourceDocument, pageIndices);
  copiedPages.forEach((page) => outputDocument.addPage(page));
  return outputDocument;
};

const drawEmbeddedPageIntoBox = async ({
  outputDocument,
  outputPage,
  sourcePage,
  x,
  y,
  width,
  height,
  border = false,
}) => {
  if (!sourcePage) {
    if (border) {
      outputPage.drawRectangle({ x, y, width, height, borderColor: rgb(0, 0, 0), borderWidth: 1.5 });
    }
    return;
  }

  const embeddedPage = await outputDocument.embedPage(sourcePage);
  const scale = Math.min(width / sourcePage.getWidth(), height / sourcePage.getHeight());
  const drawnWidth = sourcePage.getWidth() * scale;
  const drawnHeight = sourcePage.getHeight() * scale;
  const drawX = x + ((width - drawnWidth) / 2);
  const drawY = y + ((height - drawnHeight) / 2);

  outputPage.drawPage(embeddedPage, {
    x: drawX,
    y: drawY,
    width: drawnWidth,
    height: drawnHeight,
  });

  if (border) {
    outputPage.drawRectangle({ x, y, width, height, borderColor: rgb(0, 0, 0), borderWidth: 1.5 });
  }
};

const getPageContentObjects = (document, page) => {
  const contents = page.node.Contents();

  if (!contents) {
    return [];
  }

  if (typeof contents.size === 'function' && typeof contents.get === 'function') {
    return Array.from({ length: contents.size() }, (_, index) =>
      document.context.lookup(contents.get(index)));
  }

  return [document.context.lookup(contents)];
};

const isStructurallyBlankPage = (document, page) => {
  const objects = getPageContentObjects(document, page);

  if (objects.length === 0) {
    return true;
  }

  return objects.every((object) => {
    if (!object) {
      return true;
    }

    if (typeof object.getContentsString === 'function') {
      return object.getContentsString().trim().length === 0;
    }

    if (typeof object.getContents === 'function') {
      return object.getContents().length === 0;
    }

    return false;
  });
};

const copySelectedPages = async ({ sourceDocument, pageIndices }) => {
  const outputDocument = await PDFDocument.create();
  const copiedPages = await outputDocument.copyPages(sourceDocument, pageIndices);
  copiedPages.forEach((page) => outputDocument.addPage(page));
  return outputDocument.save();
};

const mergePdfs = async ({ files }) => {
  if (files.length < 2) {
    return {
      status: 'error',
      message: 'Merge PDF requires at least two PDF files.',
    };
  }

  const mergedDocument = await PDFDocument.create();

  for (const file of files) {
    const sourceBytes = await file.arrayBuffer();
    const sourceDocument = await PDFDocument.load(sourceBytes, { ignoreEncryption: false });
    const copiedPages = await mergedDocument.copyPages(
      sourceDocument,
      sourceDocument.getPageIndices(),
    );

    copiedPages.forEach((page) => mergedDocument.addPage(page));
  }

  const mergedBytes = await mergedDocument.save();

  return {
    kind: 'file',
    bytes: mergedBytes,
    filename: makeOutputFilename(files[0].name, '_merged.pdf'),
    contentType: 'application/pdf',
  };
};

const addPageNumbers = async ({ files, formData }) => {
  const [file] = files;
  const document = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const fontType = formData.get('fontType')?.toString().toLowerCase() || 'helvetica';
  const font = await document.embedFont(
    fontType === 'courier'
      ? StandardFonts.Courier
      : fontType === 'times'
        ? StandardFonts.TimesRoman
        : StandardFonts.Helvetica,
  );
  const fontSize = getPositiveNumber({
    value: formData.get('fontSize'),
    fallback: 12,
    label: 'Font size',
  });
  const marginFactor = getMarginFactor(formData.get('customMargin')?.toString());
  const position = Math.max(1, Math.min(9, Number.parseInt(formData.get('position') || '8', 10)));
  const selectedPages = parsePageNumbers({
    value: formData.get('pagesToNumber')?.toString() || 'all',
    totalPages: document.getPageCount(),
    label: 'pages to number',
  });
  const selectedPageSet = new Set(selectedPages);
  const startingNumber = getPositiveInteger({
    value: formData.get('startingNumber'),
    fallback: 1,
    label: 'Starting number',
  });
  const zeroPad = getNonNegativeNumber({
    value: formData.get('zeroPad'),
    fallback: 0,
    label: 'Zero-pad width',
  });
  const customText = formData.get('customText')?.toString() || '{n}';
  const color = parseHexColor(formData.get('fontColor')?.toString() || '#000000');
  const baseName = makeOutputFilename(file.name, '').replace(/\.pdf$/i, '');
  let currentNumber = startingNumber;

  for (const [index, page] of document.getPages().entries()) {
    if (!selectedPageSet.has(index)) {
      continue;
    }

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const pageNumberText = zeroPad > 0
      ? currentNumber.toString().padStart(zeroPad, '0')
      : currentNumber.toString();
    const text = customText
      .replaceAll('{n}', pageNumberText)
      .replaceAll('{total}', document.getPageCount().toString())
      .replaceAll('{filename}', baseName);
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    const col = ((position - 1) % 3) + 1;
    const row = Math.floor((position - 1) / 3) + 1;
    const leftX = marginFactor * pageWidth;
    const midX = pageWidth / 2;
    const rightX = pageWidth - (marginFactor * pageWidth);
    const bottomY = marginFactor * pageHeight;
    const midY = pageHeight / 2;
    const topY = pageHeight - (marginFactor * pageHeight);
    const x = col === 1 ? leftX : col === 2 ? midX - (textWidth / 2) : rightX - textWidth;
    const y = row === 1 ? topY - textHeight : row === 2 ? midY - (textHeight / 2) : bottomY;

    page.drawText(text, { x, y, size: fontSize, font, color });
    currentNumber += 1;
  }

  return {
    kind: 'file',
    bytes: await document.save(),
    filename: makeOutputFilename(file.name, '_page_numbers_added.pdf'),
    contentType: 'application/pdf',
  };
};

const padToMultipleOf4 = (pageCount) => Math.ceil(pageCount / 4) * 4;

const getBookletSides = ({ totalPages, doubleSided, duplexPass, flipOnShortEdge }) => {
  const paddedTotal = padToMultipleOf4(totalPages);
  const sides = [];
  const sheets = paddedTotal / 4;

  for (let sheet = 0; sheet < sheets; sheet += 1) {
    const frontLeft = paddedTotal - 1 - (sheet * 2);
    const frontRight = sheet * 2;
    const backLeft = (sheet * 2) + 1;
    const backRight = paddedTotal - 2 - (sheet * 2);
    const clamp = (pageIndex) => (pageIndex < totalPages ? pageIndex : -1);
    const includeFront = duplexPass === 'BOTH' || duplexPass === 'FIRST';
    const includeBack = duplexPass === 'BOTH' || duplexPass === 'SECOND';

    if (includeFront) {
      sides.push({ left: clamp(frontLeft), right: clamp(frontRight) });
    }

    if (includeBack) {
      sides.push(doubleSided && flipOnShortEdge
        ? { left: clamp(backRight), right: clamp(backLeft) }
        : { left: clamp(backLeft), right: clamp(backRight) });
    }
  }

  return sides;
};

const bookletImposition = async ({ files, formData }) => {
  const [file] = files;
  const pagesPerSheet = getPositiveInteger({
    value: formData.get('pagesPerSheet'),
    fallback: 2,
    label: 'Pages per sheet',
  });

  if (pagesPerSheet !== 2) {
    throw new Error('Booklet printing uses 2 pages per side. For 4-up, use PDF Page Layout.');
  }

  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const outputDocument = await PDFDocument.create();
  const sourcePages = sourceDocument.getPages();
  const firstPage = sourcePages[0];
  const pageWidth = Math.max(firstPage.getWidth(), firstPage.getHeight());
  const pageHeight = Math.min(firstPage.getWidth(), firstPage.getHeight());
  const addBorder = getBoolean(formData.get('addBorder'), false);
  const spineLocation = formData.get('spineLocation')?.toString() || 'LEFT';
  const addGutter = getBoolean(formData.get('addGutter'), false);
  const gutterSize = Math.min(
    getNonNegativeNumber({ value: formData.get('gutterSize'), fallback: 12, label: 'Gutter size' }),
    (pageWidth / 2) - 1,
  );
  const doubleSided = getBoolean(formData.get('doubleSided'), true);
  const duplexPass = formData.get('duplexPass')?.toString() || 'BOTH';
  const flipOnShortEdge = getBoolean(formData.get('flipOnShortEdge'), false);
  const sides = getBookletSides({
    totalPages: sourcePages.length,
    doubleSided,
    duplexPass,
    flipOnShortEdge,
  });

  for (const side of sides) {
    const outputPage = outputDocument.addPage([pageWidth, pageHeight]);
    const cellWidth = pageWidth / 2;
    const rtl = spineLocation === 'RIGHT';
    const leftColumn = rtl ? 1 : 0;
    const rightColumn = rtl ? 0 : 1;
    const gutter = addGutter ? gutterSize : 0;
    const leftX = (leftColumn * cellWidth) + (gutter / 2);
    const rightX = (rightColumn * cellWidth) - (gutter / 2);
    const leftWidth = cellWidth - (gutter / 2);
    const rightWidth = cellWidth - (gutter / 2);

    await drawEmbeddedPageIntoBox({
      outputDocument,
      outputPage,
      sourcePage: sourcePages[side.left],
      x: leftX,
      y: 0,
      width: leftWidth,
      height: pageHeight,
      border: addBorder,
    });
    await drawEmbeddedPageIntoBox({
      outputDocument,
      outputPage,
      sourcePage: sourcePages[side.right],
      x: rightX,
      y: 0,
      width: rightWidth,
      height: pageHeight,
      border: addBorder,
    });
  }

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_booklet.pdf'),
    contentType: 'application/pdf',
  };
};

const cropPdf = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const outputDocument = await PDFDocument.create();
  const x = getNonNegativeNumber({ value: formData.get('x'), label: 'Crop x' });
  const y = getNonNegativeNumber({ value: formData.get('y'), label: 'Crop y' });
  const width = getPositiveNumber({ value: formData.get('width'), label: 'Crop width' });
  const height = getPositiveNumber({ value: formData.get('height'), label: 'Crop height' });

  for (const sourcePage of sourceDocument.getPages()) {
    const sourceWidth = sourcePage.getWidth();
    const sourceHeight = sourcePage.getHeight();
    const bottom = sourceHeight - y - height;

    if (x + width > sourceWidth || bottom < 0 || bottom + height > sourceHeight) {
      throw new Error('Crop area must fit inside every page.');
    }

    const embeddedPage = await outputDocument.embedPage(sourcePage, {
      left: x,
      bottom,
      right: x + width,
      top: bottom + height,
    });
    const outputPage = outputDocument.addPage([width, height]);
    outputPage.drawPage(embeddedPage, { x: 0, y: 0, width, height });
  }

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_cropped.pdf'),
    contentType: 'application/pdf',
  };
};

const extractPages = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const pageIndices = parsePageOrder({
    value: formData.get('pageNumbers')?.toString(),
    totalPages: sourceDocument.getPageCount(),
    label: 'pages to extract',
  });
  const outputDocument = await copyPagesToNewDocument(sourceDocument, pageIndices);

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_extracted_pages.pdf'),
    contentType: 'application/pdf',
  };
};

const removePages = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const totalPages = sourceDocument.getPageCount();
  const pagesToRemove = new Set(parsePageNumbers({
    value: formData.get('pageNumbers')?.toString(),
    totalPages,
    label: 'pages to remove',
  }));
  const pageIndices = Array.from(
    { length: totalPages },
    (_, index) => index,
  ).filter((pageIndex) => !pagesToRemove.has(pageIndex));
  const outputDocument = await copyPagesToNewDocument(sourceDocument, pageIndices);

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_removed_pages.pdf'),
    contentType: 'application/pdf',
  };
};

const removeBlanks = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const includeBlankPages = getBoolean(formData.get('includeBlankPages'), false);
  const blankPageIndices = [];
  const nonBlankPageIndices = [];

  sourceDocument.getPages().forEach((page, index) => {
    if (isStructurallyBlankPage(sourceDocument, page)) {
      blankPageIndices.push(index);
    } else {
      nonBlankPageIndices.push(index);
    }
  });

  const baseName = makeOutputFilename(file.name, '').replace(/\.pdf$/i, '');
  const entries = [];

  if (nonBlankPageIndices.length > 0) {
    entries.push({
      name: `${baseName}_nonBlankPages.pdf`,
      bytes: await copySelectedPages({ sourceDocument, pageIndices: nonBlankPageIndices }),
    });
  } else {
    entries.push({
      name: `${baseName}_allBlankPages.pdf`,
      bytes: await copySelectedPages({ sourceDocument, pageIndices: blankPageIndices }),
    });
  }

  if (includeBlankPages && nonBlankPageIndices.length > 0 && blankPageIndices.length > 0) {
    entries.push({
      name: `${baseName}_blankPages.pdf`,
      bytes: await copySelectedPages({ sourceDocument, pageIndices: blankPageIndices }),
    });
  }

  return {
    kind: 'file',
    bytes: createZip(entries),
    filename: makeOutputFilename(file.name, '_processed.zip'),
    contentType: 'application/zip',
  };
};

const scalePages = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const outputDocument = await PDFDocument.create();
  const firstPage = sourceDocument.getPage(0);
  const [targetWidth, targetHeight] = getTargetPageSize({
    pageSize: formData.get('pageSize')?.toString() || 'KEEP',
    orientation: formData.get('orientation')?.toString() || 'PORTRAIT',
    fallback: [firstPage.getWidth(), firstPage.getHeight()],
  });
  const scaleFactor = getPositiveNumber({
    value: formData.get('scaleFactor'),
    fallback: 1,
    label: 'Scale factor',
  });

  for (const sourcePage of sourceDocument.getPages()) {
    const embeddedPage = await outputDocument.embedPage(sourcePage);
    const baseScale = Math.min(
      targetWidth / sourcePage.getWidth(),
      targetHeight / sourcePage.getHeight(),
    );
    const scale = baseScale * scaleFactor;
    const drawnWidth = sourcePage.getWidth() * scale;
    const drawnHeight = sourcePage.getHeight() * scale;
    const outputPage = outputDocument.addPage([targetWidth, targetHeight]);

    outputPage.drawPage(embeddedPage, {
      x: (targetWidth - drawnWidth) / 2,
      y: (targetHeight - drawnHeight) / 2,
      width: drawnWidth,
      height: drawnHeight,
    });
  }

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_scaled.pdf'),
    contentType: 'application/pdf',
  };
};

const splitPdf = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const totalPages = sourceDocument.getPageCount();
  const splitPoints = parsePageNumbers({
    value: formData.get('pageNumbers')?.toString() || 'all',
    totalPages,
    label: 'split points',
  });

  if (!splitPoints.includes(totalPages - 1)) {
    splitPoints.push(totalPages - 1);
    splitPoints.sort((a, b) => a - b);
  }

  const baseName = makeOutputFilename(file.name, '').replace(/\.pdf$/i, '');
  const entries = [];
  let firstPage = 0;

  for (const [index, splitPoint] of splitPoints.entries()) {
    if (splitPoint < firstPage) {
      continue;
    }

    const splitDocument = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: splitPoint - firstPage + 1 },
      (_, pageOffset) => firstPage + pageOffset,
    );
    const copiedPages = await splitDocument.copyPages(sourceDocument, pageIndices);
    copiedPages.forEach((page) => splitDocument.addPage(page));

    entries.push({
      name: `${baseName}_${index + 1}.pdf`,
      bytes: await splitDocument.save(),
    });

    firstPage = splitPoint + 1;
  }

  return {
    kind: 'file',
    bytes: createZip(entries),
    filename: makeOutputFilename(file.name, '_split.zip'),
    contentType: 'application/zip',
  };
};

const pageLayout = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const outputDocument = await PDFDocument.create();
  const mode = formData.get('mode')?.toString() || 'DEFAULT';
  const pagesPerSheet = mode === 'CUSTOM'
    ? Number(formData.get('rows') || 1) * Number(formData.get('cols') || 1)
    : Number(formData.get('pagesPerSheet') || 4);
  const cols = mode === 'CUSTOM'
    ? Number(formData.get('cols') || 1)
    : pagesPerSheet === 2 ? 2 : Math.sqrt(pagesPerSheet);
  const rows = mode === 'CUSTOM'
    ? Number(formData.get('rows') || 1)
    : pagesPerSheet === 2 ? 1 : Math.sqrt(pagesPerSheet);

  if (!Number.isInteger(pagesPerSheet) || pagesPerSheet <= 0 || !Number.isInteger(cols) || !Number.isInteger(rows)) {
    throw new Error('Page layout requires a valid page grid.');
  }

  const [pageWidth, pageHeight] = getTargetPageSize({
    pageSize: 'A4',
    orientation: formData.get('orientation')?.toString() || 'PORTRAIT',
  });
  const arrangement = formData.get('arrangement')?.toString() || 'BY_ROWS';
  const readingDirection = formData.get('readingDirection')?.toString() || 'LTR';
  const topMargin = getNonNegativeNumber({ value: formData.get('topMargin'), label: 'Top margin' });
  const bottomMargin = getNonNegativeNumber({ value: formData.get('bottomMargin'), label: 'Bottom margin' });
  const leftMargin = getNonNegativeNumber({ value: formData.get('leftMargin'), label: 'Left margin' });
  const rightMargin = getNonNegativeNumber({ value: formData.get('rightMargin'), label: 'Right margin' });
  const innerMargin = getNonNegativeNumber({ value: formData.get('innerMargin'), label: 'Inner margin' });
  const addBorder = formData.get('addBorder')?.toString() === 'true';
  const borderWidth = getPositiveNumber({ value: formData.get('borderWidth'), fallback: 1, label: 'Border width' });
  const cellWidth = (pageWidth - leftMargin - rightMargin) / cols;
  const cellHeight = (pageHeight - topMargin - bottomMargin) / rows;
  const innerWidth = cellWidth - (2 * innerMargin);
  const innerHeight = cellHeight - (2 * innerMargin);

  if (innerWidth <= 0 || innerHeight <= 0) {
    throw new Error('Margins are too large for this page layout.');
  }

  const sourcePages = sourceDocument.getPages();

  for (let groupStart = 0; groupStart < sourcePages.length; groupStart += pagesPerSheet) {
    const outputPage = outputDocument.addPage([pageWidth, pageHeight]);

    for (let offset = 0; offset < pagesPerSheet && groupStart + offset < sourcePages.length; offset += 1) {
      const sourcePage = sourcePages[groupStart + offset];
      const embeddedPage = await outputDocument.embedPage(sourcePage);
      const rowIndex = arrangement === 'BY_ROWS' ? Math.floor(offset / cols) : offset % rows;
      const colBase = arrangement === 'BY_ROWS' ? offset % cols : Math.floor(offset / rows);
      const colIndex = readingDirection === 'RTL' ? cols - 1 - colBase : colBase;
      const scale = Math.min(innerWidth / sourcePage.getWidth(), innerHeight / sourcePage.getHeight());
      const drawnWidth = sourcePage.getWidth() * scale;
      const drawnHeight = sourcePage.getHeight() * scale;
      const x = leftMargin + (colIndex * cellWidth) + innerMargin + ((innerWidth - drawnWidth) / 2);
      const y = pageHeight - topMargin - ((rowIndex + 1) * cellHeight) + innerMargin + ((innerHeight - drawnHeight) / 2);

      outputPage.drawPage(embeddedPage, { x, y, width: drawnWidth, height: drawnHeight });

      if (addBorder) {
        outputPage.drawRectangle({
          x,
          y,
          width: drawnWidth,
          height: drawnHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth,
        });
      }
    }
  }

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_multi_page_layout.pdf'),
    contentType: 'application/pdf',
  };
};

const pdfToSinglePage = async ({ files }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const outputDocument = await PDFDocument.create();
  const sourcePages = sourceDocument.getPages();
  const totalHeight = sourcePages.reduce((sum, page) => sum + page.getHeight(), 0);
  const maxWidth = sourcePages.reduce((max, page) => Math.max(max, page.getWidth()), 0);
  const outputPage = outputDocument.addPage([maxWidth, totalHeight]);
  let yOffset = totalHeight;

  for (const sourcePage of sourcePages) {
    const embeddedPage = await outputDocument.embedPage(sourcePage);
    yOffset -= sourcePage.getHeight();
    outputPage.drawPage(embeddedPage, {
      x: 0,
      y: yOffset,
      width: sourcePage.getWidth(),
      height: sourcePage.getHeight(),
    });
  }

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_singlePage.pdf'),
    contentType: 'application/pdf',
  };
};

const loadOverlayDocuments = async (overlayFiles) =>
  Promise.all(overlayFiles.map(async (file) => ({
    file,
    document: await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false }),
  })));

const getOverlaySelection = ({ overlayDocuments, basePageIndex, mode, counts }) => {
  if (mode === 'InterleavedOverlay') {
    const overlay = overlayDocuments[basePageIndex % overlayDocuments.length];
    return {
      document: overlay.document,
      pageIndex: basePageIndex % overlay.document.getPageCount(),
    };
  }

  if (mode === 'FixedRepeatOverlay') {
    let currentPage = 0;

    for (const [overlayIndex, overlay] of overlayDocuments.entries()) {
      const overlaySpan = counts[overlayIndex] * overlay.document.getPageCount();

      if (basePageIndex < currentPage + overlaySpan) {
        return {
          document: overlay.document,
          pageIndex: (basePageIndex - currentPage) % overlay.document.getPageCount(),
        };
      }

      currentPage += overlaySpan;
    }

    const overlay = overlayDocuments[overlayDocuments.length - 1];
    return {
      document: overlay.document,
      pageIndex: overlay.document.getPageCount() - 1,
    };
  }

  const totalOverlayPages = overlayDocuments.reduce(
    (sum, overlay) => sum + overlay.document.getPageCount(),
    0,
  );
  let remaining = basePageIndex % totalOverlayPages;

  for (const overlay of overlayDocuments) {
    const pageCount = overlay.document.getPageCount();

    if (remaining < pageCount) {
      return {
        document: overlay.document,
        pageIndex: remaining,
      };
    }

    remaining -= pageCount;
  }

  const overlay = overlayDocuments[0];
  return { document: overlay.document, pageIndex: 0 };
};

const overlayPdfs = async ({ files, formData }) => {
  if (files.length < 2) {
    throw new Error('Overlay PDF requires one base PDF and at least one overlay PDF.');
  }

  const [baseFile, ...overlayFiles] = files;
  const baseDocument = await PDFDocument.load(await baseFile.arrayBuffer(), { ignoreEncryption: false });
  const overlayDocuments = await loadOverlayDocuments(overlayFiles);
  const outputDocument = await PDFDocument.create();
  const mode = formData.get('overlayMode')?.toString() || 'SequentialOverlay';
  const overlayPosition = Number.parseInt(formData.get('overlayPosition') || '0', 10);
  const counts = mode === 'FixedRepeatOverlay'
    ? parsePositiveIntegerList({
      value: formData.get('counts')?.toString(),
      expectedLength: overlayFiles.length,
      label: 'Overlay counts',
    })
    : [];

  if (!['SequentialOverlay', 'InterleavedOverlay', 'FixedRepeatOverlay'].includes(mode)) {
    throw new Error(`Unsupported overlay mode: ${mode}`);
  }

  for (const [basePageIndex, basePage] of baseDocument.getPages().entries()) {
    const outputPage = outputDocument.addPage([basePage.getWidth(), basePage.getHeight()]);
    const embeddedBasePage = await outputDocument.embedPage(basePage);
    const selection = getOverlaySelection({
      overlayDocuments,
      basePageIndex,
      mode,
      counts,
    });
    const overlayPage = selection.document.getPage(selection.pageIndex);
    const embeddedOverlayPage = await outputDocument.embedPage(overlayPage);
    const overlayScale = Math.min(
      basePage.getWidth() / overlayPage.getWidth(),
      basePage.getHeight() / overlayPage.getHeight(),
    );
    const overlayWidth = overlayPage.getWidth() * overlayScale;
    const overlayHeight = overlayPage.getHeight() * overlayScale;
    const drawBase = () => outputPage.drawPage(embeddedBasePage, {
      x: 0,
      y: 0,
      width: basePage.getWidth(),
      height: basePage.getHeight(),
    });
    const drawOverlay = () => outputPage.drawPage(embeddedOverlayPage, {
      x: (basePage.getWidth() - overlayWidth) / 2,
      y: (basePage.getHeight() - overlayHeight) / 2,
      width: overlayWidth,
      height: overlayHeight,
    });

    if (overlayPosition === 1) {
      drawOverlay();
      drawBase();
    } else {
      drawBase();
      drawOverlay();
    }
  }

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(baseFile.name, '_overlayed.pdf'),
    contentType: 'application/pdf',
  };
};

const getReorganizedPageOrder = ({ customMode, pageNumbers, totalPages }) => {
  switch ((customMode || 'custom').toUpperCase()) {
    case 'CUSTOM':
      return parsePageOrder({ value: pageNumbers, totalPages, label: 'page order' });
    case 'REVERSE_ORDER':
      return Array.from({ length: totalPages }, (_, index) => totalPages - index - 1);
    case 'REMOVE_FIRST':
      return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index + 1);
    case 'REMOVE_LAST':
      return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index);
    case 'REMOVE_FIRST_AND_LAST':
      return Array.from({ length: Math.max(totalPages - 2, 0) }, (_, index) => index + 1);
    case 'ODD_EVEN_SPLIT':
      return [
        ...Array.from({ length: Math.ceil(totalPages / 2) }, (_, index) => index * 2),
        ...Array.from({ length: Math.floor(totalPages / 2) }, (_, index) => (index * 2) + 1),
      ];
    case 'DUPLEX_SORT': {
      const half = Math.ceil(totalPages / 2);
      const order = [];

      for (let page = 0; page < half; page += 1) {
        order.push(page);
        const pairedPage = totalPages - page - 1;

        if (pairedPage >= half) {
          order.push(pairedPage);
        }
      }

      return order;
    }
    case 'DUPLICATE': {
      const duplicateCount = Number.parseInt(pageNumbers || '2', 10);

      if (!Number.isInteger(duplicateCount) || duplicateCount < 1) {
        throw new Error('Duplicate count must be a positive whole number.');
      }

      return Array.from({ length: totalPages }).flatMap((_, pageIndex) =>
        Array.from({ length: duplicateCount }, () => pageIndex));
    }
    default:
      throw new Error(`Unsupported reorganize mode: ${customMode}`);
  }
};

const reorganizePages = async ({ files, formData }) => {
  const [file] = files;
  const sourceDocument = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const pageIndices = getReorganizedPageOrder({
    customMode: formData.get('customMode')?.toString() || 'custom',
    pageNumbers: formData.get('pageNumbers')?.toString(),
    totalPages: sourceDocument.getPageCount(),
  });
  const outputDocument = await copyPagesToNewDocument(sourceDocument, pageIndices);

  return {
    kind: 'file',
    bytes: await outputDocument.save(),
    filename: makeOutputFilename(file.name, '_rearranged.pdf'),
    contentType: 'application/pdf',
  };
};

const rotatePdf = async ({ files, formData }) => {
  const [file] = files;
  const angle = Number(formData.get('angle') || 90);

  if (!Number.isInteger(angle) || angle % 90 !== 0) {
    return {
      status: 'error',
      message: 'Angle must be a multiple of 90.',
    };
  }

  const document = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
  const totalPages = document.getPageCount();
  const selectedPages = parsePageNumbers({
    value: formData.get('pages')?.toString() || 'all',
    totalPages,
    label: 'pages to rotate',
  });
  const selectedPageSet = new Set(selectedPages);

  document.getPages().forEach((page, index) => {
    if (!selectedPageSet.has(index)) {
      return;
    }

    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + angle));
  });

  return {
    kind: 'file',
    bytes: await document.save(),
    filename: makeOutputFilename(file.name, '_rotated.pdf'),
    contentType: 'application/pdf',
  };
};

const toolHandlers = {
  addPageNumbers,
  bookletImposition,
  crop: cropPdf,
  extractPages,
  merge: mergePdfs,
  overlayPdfs,
  pageLayout,
  pdfToSinglePage,
  removeBlanks,
  removePages,
  reorganizePages,
  rotate: rotatePdf,
  scalePages,
  split: splitPdf,
};

export const runTool = async ({ tool, files, formData }) => {
  const handler = toolHandlers[tool.id];

  if (handler) {
    return handler({ tool, files, formData });
  }

  return {
    status: 'not_implemented',
    fileCount: files.length,
    message: `${tool.name} is registered and ready for service translation.`,
  };
};
