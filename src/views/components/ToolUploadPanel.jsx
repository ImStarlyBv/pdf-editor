'use client';

import { useId, useState } from 'react';
import { UploadCloud } from 'lucide-react';

const formatFileList = (files) => {
  if (files.length === 0) {
    return 'No files selected';
  }

  if (files.length === 1) {
    return files[0].name;
  }

  return `${files.length} files selected`;
};

const getDownloadFilename = (response, fallback) => {
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/i);
  return match?.[1] || fallback;
};

function ToolParameterFields({ tool }) {
  const pageNumbersId = useId();
  const pageNumbersHelpId = useId();
  const angleId = useId();
  const angleHelpId = useId();
  const rotatePagesId = useId();
  const rotatePagesHelpId = useId();
  const extractPagesId = useId();
  const extractPagesHelpId = useId();
  const removePagesId = useId();
  const removePagesHelpId = useId();
  const reorganizeModeId = useId();
  const reorganizeModeHelpId = useId();
  const reorganizePagesId = useId();
  const reorganizePagesHelpId = useId();
  const cropHelpId = useId();
  const scaleFactorId = useId();
  const scalePageSizeId = useId();
  const scaleOrientationId = useId();
  const scaleHelpId = useId();
  const layoutModeId = useId();
  const layoutPagesPerSheetId = useId();
  const layoutRowsId = useId();
  const layoutColsId = useId();
  const layoutOrientationId = useId();
  const layoutArrangementId = useId();
  const layoutDirectionId = useId();
  const layoutHelpId = useId();
  const bookletSpineId = useId();
  const bookletDuplexId = useId();
  const bookletGutterId = useId();
  const bookletBorderId = useId();
  const bookletDoubleSidedId = useId();
  const bookletFlipId = useId();
  const bookletHelpId = useId();
  const overlayModeId = useId();
  const overlayPositionId = useId();
  const overlayCountsId = useId();
  const overlayHelpId = useId();
  const removeBlanksThresholdId = useId();
  const removeBlanksWhitePercentId = useId();
  const removeBlanksIncludeId = useId();
  const removeBlanksHelpId = useId();
  const pageNumberPositionId = useId();
  const pageNumberStartId = useId();
  const pageNumberPagesId = useId();
  const pageNumberTextId = useId();
  const pageNumberMarginId = useId();
  const pageNumberFontSizeId = useId();
  const pageNumberFontTypeId = useId();
  const pageNumberFontColorId = useId();
  const pageNumberZeroPadId = useId();
  const pageNumberHelpId = useId();
  const metadataTitleId = useId();
  const metadataAuthorId = useId();
  const metadataSubjectId = useId();
  const metadataKeywordsId = useId();
  const metadataCreatorId = useId();
  const metadataProducerId = useId();
  const metadataCreationDateId = useId();
  const metadataModificationDateId = useId();
  const metadataDeleteAllId = useId();
  const metadataHelpId = useId();
  const flattenOnlyFormsId = useId();
  const flattenRenderDpiId = useId();
  const flattenHelpId = useId();
  const textToolTextId = useId();
  const textToolPagesId = useId();
  const textToolXId = useId();
  const textToolYId = useId();
  const textToolFontSizeId = useId();
  const textToolColorId = useId();
  const textToolOpacityId = useId();
  const textToolRotationId = useId();
  const textToolHelpId = useId();
  const annotationTextId = useId();
  const annotationPagesId = useId();
  const annotationXId = useId();
  const annotationYId = useId();
  const annotationWidthId = useId();
  const annotationHeightId = useId();
  const annotationColorId = useId();
  const annotationHelpId = useId();
  const formFillValuesId = useId();
  const formFillFlattenId = useId();
  const formFillHelpId = useId();

  if (tool.id === 'split') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={pageNumbersId}>Split after pages</label>
          <input
            id={pageNumbersId}
            name="pageNumbers"
            type="text"
            defaultValue="all"
            required
            aria-describedby={pageNumbersHelpId}
          />
          <p id={pageNumbersHelpId} className="field-help">
            Use all, a page number like 2, or ranges like 2,5-7.
          </p>
        </div>
      </div>
    );
  }

  if (tool.id === 'crop') {
    return (
      <div className="tool-parameter-fields">
        <p id={cropHelpId} className="field-help">
          Enter crop coordinates in PDF points from the top-left corner.
        </p>
        <div className="field-grid" aria-describedby={cropHelpId}>
          <div className="field">
            <label htmlFor={`${cropHelpId}-x`}>X</label>
            <input id={`${cropHelpId}-x`} name="x" type="number" min="0" step="1" defaultValue="0" required />
          </div>
          <div className="field">
            <label htmlFor={`${cropHelpId}-y`}>Y</label>
            <input id={`${cropHelpId}-y`} name="y" type="number" min="0" step="1" defaultValue="0" required />
          </div>
          <div className="field">
            <label htmlFor={`${cropHelpId}-width`}>Width</label>
            <input id={`${cropHelpId}-width`} name="width" type="number" min="1" step="1" defaultValue="500" required />
          </div>
          <div className="field">
            <label htmlFor={`${cropHelpId}-height`}>Height</label>
            <input id={`${cropHelpId}-height`} name="height" type="number" min="1" step="1" defaultValue="700" required />
          </div>
        </div>
      </div>
    );
  }

  if (tool.id === 'rotate') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={angleId}>Rotation angle</label>
          <select id={angleId} name="angle" defaultValue="90" required aria-describedby={angleHelpId}>
            <option value="90">90 degrees clockwise</option>
            <option value="180">180 degrees</option>
            <option value="270">270 degrees clockwise</option>
          </select>
          <p id={angleHelpId} className="field-help">
            Stirling accepts angles in 90 degree steps.
          </p>
        </div>

        <div className="field">
          <label htmlFor={rotatePagesId}>Pages to rotate</label>
          <input
            id={rotatePagesId}
            name="pages"
            type="text"
            defaultValue="all"
            aria-describedby={rotatePagesHelpId}
          />
          <p id={rotatePagesHelpId} className="field-help">
            Use all, a single page like 3, or ranges like 1-4,8.
          </p>
        </div>
      </div>
    );
  }

  if (tool.id === 'extractPages') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={extractPagesId}>Pages to extract</label>
          <input
            id={extractPagesId}
            name="pageNumbers"
            type="text"
            required
            aria-describedby={extractPagesHelpId}
          />
          <p id={extractPagesHelpId} className="field-help">
            Use a single page like 3, ranges like 1-4,8, or all.
          </p>
        </div>
      </div>
    );
  }

  if (tool.id === 'scalePages') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={scaleFactorId}>Scale factor</label>
          <input id={scaleFactorId} name="scaleFactor" type="number" min="0.1" step="0.1" defaultValue="1" required aria-describedby={scaleHelpId} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor={scalePageSizeId}>Page size</label>
            <select id={scalePageSizeId} name="pageSize" defaultValue="KEEP">
              <option value="KEEP">Keep original</option>
              <option value="A4">A4</option>
              <option value="LETTER">Letter</option>
              <option value="LEGAL">Legal</option>
              <option value="A3">A3</option>
              <option value="A5">A5</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={scaleOrientationId}>Orientation</label>
            <select id={scaleOrientationId} name="orientation" defaultValue="PORTRAIT">
              <option value="PORTRAIT">Portrait</option>
              <option value="LANDSCAPE">Landscape</option>
            </select>
          </div>
        </div>
        <p id={scaleHelpId} className="field-help">
          A scale factor of 1 fits each page inside the selected output size.
        </p>
      </div>
    );
  }

  if (tool.id === 'addPageNumbers') {
    return (
      <div className="tool-parameter-fields">
        <div className="field-grid">
          <div className="field">
            <label htmlFor={pageNumberPositionId}>Position</label>
            <select id={pageNumberPositionId} name="position" defaultValue="8" required>
              <option value="1">Top left</option>
              <option value="2">Top center</option>
              <option value="3">Top right</option>
              <option value="4">Middle left</option>
              <option value="5">Middle center</option>
              <option value="6">Middle right</option>
              <option value="7">Bottom left</option>
              <option value="8">Bottom center</option>
              <option value="9">Bottom right</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={pageNumberStartId}>Starting number</label>
            <input id={pageNumberStartId} name="startingNumber" type="number" min="1" step="1" defaultValue="1" required />
          </div>
          <div className="field">
            <label htmlFor={pageNumberPagesId}>Pages to number</label>
            <input id={pageNumberPagesId} name="pagesToNumber" type="text" defaultValue="all" aria-describedby={pageNumberHelpId} />
          </div>
          <div className="field">
            <label htmlFor={pageNumberTextId}>Custom text</label>
            <input id={pageNumberTextId} name="customText" type="text" defaultValue="{n}" aria-describedby={pageNumberHelpId} />
          </div>
          <div className="field">
            <label htmlFor={pageNumberMarginId}>Margin</label>
            <select id={pageNumberMarginId} name="customMargin" defaultValue="medium">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra large</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={pageNumberFontSizeId}>Font size</label>
            <input id={pageNumberFontSizeId} name="fontSize" type="number" min="1" step="1" defaultValue="12" required />
          </div>
          <div className="field">
            <label htmlFor={pageNumberFontTypeId}>Font type</label>
            <select id={pageNumberFontTypeId} name="fontType" defaultValue="times">
              <option value="helvetica">Helvetica</option>
              <option value="courier">Courier</option>
              <option value="times">Times</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={pageNumberFontColorId}>Font color</label>
            <input id={pageNumberFontColorId} name="fontColor" type="text" defaultValue="#000000" pattern="#?[0-9A-Fa-f]{6}" aria-describedby={pageNumberHelpId} />
          </div>
          <div className="field">
            <label htmlFor={pageNumberZeroPadId}>Zero-pad width</label>
            <input id={pageNumberZeroPadId} name="zeroPad" type="number" min="0" step="1" defaultValue="0" />
          </div>
        </div>
        <p id={pageNumberHelpId} className="field-help">
          Use pages like all or 1,3-5. Custom text supports {'{n}'}, {'{total}'}, and {'{filename}'}.
        </p>
      </div>
    );
  }

  if (tool.id === 'removePages') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={removePagesId}>Pages to remove</label>
          <input
            id={removePagesId}
            name="pageNumbers"
            type="text"
            required
            aria-describedby={removePagesHelpId}
          />
          <p id={removePagesHelpId} className="field-help">
            Use a comma-separated list like 2,5-7. At least one page must remain.
          </p>
        </div>
      </div>
    );
  }

  if (tool.id === 'changeMetadata') {
    return (
      <div className="tool-parameter-fields">
        <div className="field-grid">
          <div className="field">
            <label htmlFor={metadataTitleId}>Title</label>
            <input id={metadataTitleId} name="title" type="text" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataAuthorId}>Author</label>
            <input id={metadataAuthorId} name="author" type="text" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataSubjectId}>Subject</label>
            <input id={metadataSubjectId} name="subject" type="text" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataKeywordsId}>Keywords</label>
            <input id={metadataKeywordsId} name="keywords" type="text" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataCreatorId}>Creator</label>
            <input id={metadataCreatorId} name="creator" type="text" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataProducerId}>Producer</label>
            <input id={metadataProducerId} name="producer" type="text" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataCreationDateId}>Creation date</label>
            <input id={metadataCreationDateId} name="creationDate" type="datetime-local" aria-describedby={metadataHelpId} />
          </div>
          <div className="field">
            <label htmlFor={metadataModificationDateId}>Modification date</label>
            <input id={metadataModificationDateId} name="modificationDate" type="datetime-local" aria-describedby={metadataHelpId} />
          </div>
          <div className="field checkbox-field">
            <input id={metadataDeleteAllId} name="deleteAll" type="checkbox" value="true" />
            <label htmlFor={metadataDeleteAllId}>Delete standard metadata</label>
          </div>
        </div>
        <p id={metadataHelpId} className="field-help">
          Empty fields leave existing metadata unchanged unless delete standard metadata is selected.
        </p>
      </div>
    );
  }

  if (tool.id === 'flatten') {
    return (
      <div className="tool-parameter-fields">
        <div className="field-grid">
          <div className="field checkbox-field">
            <input id={flattenOnlyFormsId} name="flattenOnlyForms" type="checkbox" value="true" aria-describedby={flattenHelpId} />
            <label htmlFor={flattenOnlyFormsId}>Flatten form fields only</label>
          </div>
          <div className="field">
            <label htmlFor={flattenRenderDpiId}>Render DPI</label>
            <input id={flattenRenderDpiId} name="renderDpi" type="number" min="72" max="300" step="1" defaultValue="100" aria-describedby={flattenHelpId} />
          </div>
        </div>
        <p id={flattenHelpId} className="field-help">
          Leave the checkbox off to rasterize each page into unselectable PDF pages. Turn it on to flatten only interactive form fields.
        </p>
      </div>
    );
  }

  if (['addText', 'sign', 'watermark', 'addStamp'].includes(tool.id)) {
    const defaults = {
      addText: { text: 'New text', fontSize: 18, color: '#000000', opacity: 1, rotation: 0 },
      sign: { text: 'Signed', fontSize: 28, color: '#000000', opacity: 1, rotation: 0 },
      watermark: { text: 'Watermark', fontSize: 48, color: '#888888', opacity: 0.3, rotation: 35 },
      addStamp: { text: 'APPROVED', fontSize: 30, color: '#c1121f', opacity: 1, rotation: 0 },
    }[tool.id];

    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={textToolTextId}>Text</label>
          <input id={textToolTextId} name="text" type="text" defaultValue={defaults.text} required aria-describedby={textToolHelpId} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor={textToolPagesId}>Pages</label>
            <input id={textToolPagesId} name="pages" type="text" defaultValue="all" aria-describedby={textToolHelpId} />
          </div>
          <div className="field">
            <label htmlFor={textToolXId}>X</label>
            <input id={textToolXId} name="x" type="number" min="0" step="1" defaultValue="72" />
          </div>
          <div className="field">
            <label htmlFor={textToolYId}>Y</label>
            <input id={textToolYId} name="y" type="number" min="0" step="1" defaultValue="72" />
          </div>
          <div className="field">
            <label htmlFor={textToolFontSizeId}>Font size</label>
            <input id={textToolFontSizeId} name="fontSize" type="number" min="1" step="1" defaultValue={defaults.fontSize} required />
          </div>
          <div className="field">
            <label htmlFor={textToolColorId}>Color</label>
            <input id={textToolColorId} name="fontColor" type="text" defaultValue={defaults.color} pattern="#?[0-9A-Fa-f]{6}" aria-describedby={textToolHelpId} />
          </div>
          <div className="field">
            <label htmlFor={textToolOpacityId}>Opacity</label>
            <input id={textToolOpacityId} name="opacity" type="number" min="0" max="1" step="0.05" defaultValue={defaults.opacity} />
          </div>
          <div className="field">
            <label htmlFor={textToolRotationId}>Rotation</label>
            <input id={textToolRotationId} name="rotation" type="number" step="1" defaultValue={defaults.rotation} />
          </div>
        </div>
        <p id={textToolHelpId} className="field-help">
          Use pages like all or 1,3-5. Coordinates are PDF points from the lower-left page corner.
        </p>
      </div>
    );
  }

  if (tool.id === 'annotate') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={annotationTextId}>Annotation text</label>
          <input id={annotationTextId} name="text" type="text" defaultValue="Note" aria-describedby={annotationHelpId} />
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor={annotationPagesId}>Pages</label>
            <input id={annotationPagesId} name="pages" type="text" defaultValue="1" aria-describedby={annotationHelpId} />
          </div>
          <div className="field">
            <label htmlFor={annotationXId}>X</label>
            <input id={annotationXId} name="x" type="number" min="0" step="1" defaultValue="72" />
          </div>
          <div className="field">
            <label htmlFor={annotationYId}>Y</label>
            <input id={annotationYId} name="y" type="number" min="0" step="1" defaultValue="120" />
          </div>
          <div className="field">
            <label htmlFor={annotationWidthId}>Width</label>
            <input id={annotationWidthId} name="width" type="number" min="1" step="1" defaultValue="180" required />
          </div>
          <div className="field">
            <label htmlFor={annotationHeightId}>Height</label>
            <input id={annotationHeightId} name="height" type="number" min="1" step="1" defaultValue="36" required />
          </div>
          <div className="field">
            <label htmlFor={annotationColorId}>Color</label>
            <input id={annotationColorId} name="color" type="text" defaultValue="#fff176" pattern="#?[0-9A-Fa-f]{6}" aria-describedby={annotationHelpId} />
          </div>
        </div>
        <p id={annotationHelpId} className="field-help">
          This first pass adds visible highlight-style markup to selected pages.
        </p>
      </div>
    );
  }

  if (tool.id === 'formFill') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={formFillValuesId}>Field values</label>
          <textarea
            id={formFillValuesId}
            name="fieldValues"
            rows={6}
            aria-describedby={formFillHelpId}
            defaultValue={'name=Ada Lovelace\nemail=ada@example.com'}
          />
        </div>
        <div className="field checkbox-field">
          <input id={formFillFlattenId} name="flatten" type="checkbox" value="true" aria-describedby={formFillHelpId} />
          <label htmlFor={formFillFlattenId}>Flatten after filling</label>
        </div>
        <p id={formFillHelpId} className="field-help">
          Enter one field per line as fieldName=value, or paste a JSON object with field names and values.
        </p>
      </div>
    );
  }

  if (tool.id === 'removeBlanks') {
    return (
      <div className="tool-parameter-fields">
        <div className="field-grid">
          <div className="field">
            <label htmlFor={removeBlanksThresholdId}>Pixel whiteness threshold</label>
            <input id={removeBlanksThresholdId} name="threshold" type="number" min="0" max="255" step="1" defaultValue="10" aria-describedby={removeBlanksHelpId} />
          </div>
          <div className="field">
            <label htmlFor={removeBlanksWhitePercentId}>White percent</label>
            <input id={removeBlanksWhitePercentId} name="whitePercent" type="number" min="0.1" max="100" step="0.1" defaultValue="99.9" aria-describedby={removeBlanksHelpId} />
          </div>
          <div className="field checkbox-field">
            <input id={removeBlanksIncludeId} name="includeBlankPages" type="checkbox" value="true" />
            <label htmlFor={removeBlanksIncludeId}>Include detected blank pages in ZIP</label>
          </div>
        </div>
        <p id={removeBlanksHelpId} className="field-help">
          Current detection removes pages with empty PDF content streams. Image-level white-page detection will require the renderer path.
        </p>
      </div>
    );
  }

  if (tool.id === 'reorganizePages') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={reorganizeModeId}>Reorganize mode</label>
          <select
            id={reorganizeModeId}
            name="customMode"
            defaultValue="custom"
            aria-describedby={reorganizeModeHelpId}
          >
            <option value="custom">Custom page order</option>
            <option value="REVERSE_ORDER">Reverse order</option>
            <option value="ODD_EVEN_SPLIT">Odd pages then even pages</option>
            <option value="DUPLEX_SORT">Duplex sort</option>
            <option value="REMOVE_FIRST">Remove first page</option>
            <option value="REMOVE_LAST">Remove last page</option>
            <option value="REMOVE_FIRST_AND_LAST">Remove first and last pages</option>
            <option value="DUPLICATE">Duplicate every page</option>
          </select>
          <p id={reorganizeModeHelpId} className="field-help">
            Custom order uses the page order field. Duplicate mode uses it as the duplicate count.
          </p>
        </div>

        <div className="field">
          <label htmlFor={reorganizePagesId}>Page order or duplicate count</label>
          <input
            id={reorganizePagesId}
            name="pageNumbers"
            type="text"
            defaultValue="all"
            aria-describedby={reorganizePagesHelpId}
          />
          <p id={reorganizePagesHelpId} className="field-help">
            For custom order, use values like 3,1,2 or 1-3,7. For duplicate mode, enter a number like 2.
          </p>
        </div>
      </div>
    );
  }

  if (tool.id === 'pageLayout') {
    return (
      <div className="tool-parameter-fields">
        <div className="field-grid">
          <div className="field">
            <label htmlFor={layoutModeId}>Layout mode</label>
            <select id={layoutModeId} name="mode" defaultValue="DEFAULT">
              <option value="DEFAULT">Preset</option>
              <option value="CUSTOM">Custom grid</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={layoutPagesPerSheetId}>Pages per sheet</label>
            <select id={layoutPagesPerSheetId} name="pagesPerSheet" defaultValue="4">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="9">9</option>
              <option value="16">16</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={layoutRowsId}>Rows</label>
            <input id={layoutRowsId} name="rows" type="number" min="1" step="1" defaultValue="2" />
          </div>
          <div className="field">
            <label htmlFor={layoutColsId}>Columns</label>
            <input id={layoutColsId} name="cols" type="number" min="1" step="1" defaultValue="2" />
          </div>
          <div className="field">
            <label htmlFor={layoutOrientationId}>Orientation</label>
            <select id={layoutOrientationId} name="orientation" defaultValue="PORTRAIT">
              <option value="PORTRAIT">Portrait</option>
              <option value="LANDSCAPE">Landscape</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={layoutArrangementId}>Arrangement</label>
            <select id={layoutArrangementId} name="arrangement" defaultValue="BY_ROWS">
              <option value="BY_ROWS">By rows</option>
              <option value="BY_COLUMNS">By columns</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={layoutDirectionId}>Reading direction</label>
            <select id={layoutDirectionId} name="readingDirection" defaultValue="LTR">
              <option value="LTR">Left to right</option>
              <option value="RTL">Right to left</option>
            </select>
          </div>
        </div>
        <input name="innerMargin" type="hidden" value="8" />
        <input name="topMargin" type="hidden" value="12" />
        <input name="bottomMargin" type="hidden" value="12" />
        <input name="leftMargin" type="hidden" value="12" />
        <input name="rightMargin" type="hidden" value="12" />
        <input name="addBorder" type="hidden" value="false" />
        <input name="borderWidth" type="hidden" value="1" />
        <p id={layoutHelpId} className="field-help">
          Preset mode uses pages per sheet. Custom mode uses rows and columns.
        </p>
      </div>
    );
  }

  if (tool.id === 'bookletImposition') {
    return (
      <div className="tool-parameter-fields">
        <input name="pagesPerSheet" type="hidden" value="2" />
        <div className="field-grid">
          <div className="field">
            <label htmlFor={bookletSpineId}>Spine location</label>
            <select id={bookletSpineId} name="spineLocation" defaultValue="LEFT">
              <option value="LEFT">Left spine</option>
              <option value="RIGHT">Right spine</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={bookletDuplexId}>Duplex pass</label>
            <select id={bookletDuplexId} name="duplexPass" defaultValue="BOTH">
              <option value="BOTH">Both sides</option>
              <option value="FIRST">Front sides only</option>
              <option value="SECOND">Back sides only</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={bookletGutterId}>Gutter size</label>
            <input id={bookletGutterId} name="gutterSize" type="number" min="0" step="1" defaultValue="12" aria-describedby={bookletHelpId} />
          </div>
          <div className="field checkbox-field">
            <input id={bookletBorderId} name="addBorder" type="checkbox" value="true" />
            <label htmlFor={bookletBorderId}>Add page border</label>
          </div>
          <div className="field checkbox-field">
            <input id={bookletDoubleSidedId} name="doubleSided" type="checkbox" value="true" defaultChecked />
            <label htmlFor={bookletDoubleSidedId}>Double-sided booklet</label>
          </div>
          <div className="field checkbox-field">
            <input id={bookletFlipId} name="flipOnShortEdge" type="checkbox" value="true" />
            <label htmlFor={bookletFlipId}>Flip back side on short edge</label>
          </div>
        </div>
        <input name="addGutter" type="hidden" value="true" />
        <p id={bookletHelpId} className="field-help">
          Booklet output is always 2-up landscape for folding and binding.
        </p>
      </div>
    );
  }

  if (tool.id === 'overlayPdfs') {
    return (
      <div className="tool-parameter-fields">
        <div className="field">
          <label htmlFor={overlayModeId}>Overlay mode</label>
          <select id={overlayModeId} name="overlayMode" defaultValue="SequentialOverlay" aria-describedby={overlayHelpId}>
            <option value="SequentialOverlay">Sequential overlay pages</option>
            <option value="InterleavedOverlay">Interleaved overlay files</option>
            <option value="FixedRepeatOverlay">Fixed repeat counts</option>
          </select>
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor={overlayPositionId}>Overlay position</label>
            <select id={overlayPositionId} name="overlayPosition" defaultValue="0">
              <option value="0">Foreground</option>
              <option value="1">Background</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={overlayCountsId}>Fixed repeat counts</label>
            <input id={overlayCountsId} name="counts" type="text" defaultValue="1" aria-describedby={overlayHelpId} />
          </div>
        </div>
        <p id={overlayHelpId} className="field-help">
          Select the base PDF first, then one or more overlay PDFs. For fixed repeat, enter one count per overlay file, like 2,1.
        </p>
      </div>
    );
  }

  return null;
}

export default function ToolUploadPanel({ tool }) {
  const inputId = useId();
  const statusId = useId();
  const helpId = useId();
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const acceptsPdf = tool.acceptedTypes.length === 0 || tool.acceptedTypes.includes('application/pdf');
  const acceptsMultiple = tool.uploadMode === 'multiple';
  const fileAccept = tool.id === 'addAttachments'
    ? 'application/pdf,.pdf,text/plain,image/png,image/jpeg,application/octet-stream'
    : acceptsPdf ? 'application/pdf,.pdf' : undefined;
  const fileRequired = tool.acceptedTypes.length > 0 || tool.id === 'addAttachments';
  const needsFiles = fileRequired;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const selectedFiles = formData.getAll('files').filter((file) => file && file.size > 0);

    setStatus('loading');
    setMessage(`Uploading ${formatFileList(selectedFiles)}...`);

    try {
      const response = await fetch(tool.nextEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || payload.message || `${tool.name} failed`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = getDownloadFilename(response, `${tool.slug}.pdf`);
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);

      setStatus('success');
      setMessage(`${tool.name} finished. Your download has started.`);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <form
      className="tool-upload-form"
      action={tool.nextEndpoint}
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <fieldset>
        <legend>{tool.name}</legend>
        {needsFiles ? (
          <div className="field">
            <label htmlFor={inputId}>PDF file{acceptsMultiple ? 's' : ''}</label>
            <input
              id={inputId}
              name="files"
              type="file"
              accept={fileAccept}
              multiple={acceptsMultiple}
              required={fileRequired}
              aria-describedby={`${helpId} ${statusId}`}
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
            />
            <p id={helpId} className="field-help">
              {tool.id === 'addAttachments'
                ? 'Select the target PDF first, then one or more files to embed as attachments.'
                : acceptsMultiple
                  ? 'Select one or more PDF files for this tool.'
                  : 'Select one PDF file for this tool.'}
            </p>
          </div>
        ) : (
          <p id={helpId} className="field-help">
            This guide endpoint does not require an uploaded file.
          </p>
        )}

        <input name="toolId" type="hidden" value={tool.id} />
        <ToolParameterFields tool={tool} />

        <button className="btn btn-primary tool-primary-action" type="submit" disabled={status === 'loading'}>
          <UploadCloud aria-hidden="true" size={20} />
          {status === 'loading' ? 'Processing...' : `Upload for ${tool.name}`}
        </button>

        <p className="selected-files">{formatFileList(files)}</p>
        <p
          id={statusId}
          className={`tool-status tool-status-${status}`}
          aria-live={status === 'error' ? 'assertive' : 'polite'}
        >
          {message || 'Files stay private while the tool prepares your PDF workflow.'}
        </p>
      </fieldset>
    </form>
  );
}
