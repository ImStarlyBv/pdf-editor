import Link from 'next/link';

export default function ToolFooter() {
  return (
    <footer id="all-pdf-tools" className="site-footer">
      <div className="footer-inner">
        <div className="footer-heading">
          <h2>Complete Document Tool Directory</h2>
          <p>
            Explore our full suite of professional tools. Whether you need to reorganize pages, secure sensitive data, or automate your document workflows, you&apos;ll find the right solution in our comprehensive directory below.
          </p>
        </div>

        <div className="footer-tools-grid">
          <nav aria-labelledby="footer-page-structure">
            <h3 id="footer-page-structure">Page & Structure</h3>
            <ul>
              <li>
                <Link href="/tools/merge-pdf">Merge Documents</Link>
                <p>Combine multiple files into one</p>
              </li>
              <li>
                <Link href="/tools/split-pdf">Split Files</Link>
                <p>Divide documents into sections</p>
              </li>
              <li>
                <Link href="/tools/crop-pdf">Crop Pages</Link>
                <p>Trim visible page areas</p>
              </li>
              <li>
                <Link href="/tools/rotate-pdf">Rotate Pages</Link>
                <p>Fix page orientation</p>
              </li>
              <li>
                <Link href="/tools/reorganize-pdf-pages">Reorder Pages</Link>
                <p>Arrange and duplicate pages</p>
              </li>
              <li>
                <Link href="/tools/extract-pdf-pages">Extract Pages</Link>
                <p>Save specific pages as new files</p>
              </li>
              <li>
                <Link href="/tools/remove-pdf-pages">Delete Pages</Link>
                <p>Remove unwanted content</p>
              </li>
              <li>
                <Link href="/tools/remove-blank-pages-from-pdf">Strip Blanks</Link>
                <p>Automatically remove empty pages</p>
              </li>
              <li>
                <Link href="/tools/scale-pdf-pages">Resize Pages</Link>
                <p>Adjust page dimensions</p>
              </li>
              <li>
                <Link href="/tools/pdf-page-layout">Page Layouts</Link>
                <p>N-up and grid page arrangements</p>
              </li>
              <li>
                <Link href="/tools/booklet-pdf">Booklet Creator</Link>
                <p>Prepare files for booklet printing</p>
              </li>
              <li>
                <Link href="/tools/pdf-to-single-page">One-Page View</Link>
                <p>Convert to single long page</p>
              </li>
              <li>
                <Link href="/tools/overlay-pdf">Layer Documents</Link>
                <p>Overlay one file on another</p>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-content-editing">
            <h3 id="footer-content-editing">Content Editing</h3>
            <ul>
              <li>
                <Link href="/tools/pdf-text-editor">Visual Text Editor</Link>
                <p>Edit text and images directly</p>
              </li>
              <li>
                <Link href="/tools/sign-pdf">Add Signature</Link>
                <p>Sign by drawing or typing</p>
              </li>
              <li>
                <Link href="/tools/add-text-to-pdf">Insert Text</Link>
                <p>Add new text blocks anywhere</p>
              </li>
              <li>
                <Link href="/tools/add-image-to-pdf">Insert Images</Link>
                <p>Add photos and graphics</p>
              </li>
              <li>
                <Link href="/tools/annotate-pdf">Markup Pages</Link>
                <p>Highlights, notes, and comments</p>
              </li>
              <li>
                <Link href="/tools/watermark-pdf">Apply Watermarks</Link>
                <p>Add text or image backgrounds</p>
              </li>
              <li>
                <Link href="/tools/stamp-pdf">Apply Stamps</Link>
                <p>Insert professional status stamps</p>
              </li>
              <li>
                <Link href="/tools/add-page-numbers-to-pdf">Page Numbering</Link>
                <p>Customize page numbers</p>
              </li>
              <li>
                <Link href="/tools/remove-pdf-annotations">Clear Markups</Link>
                <p>Strip all notes and highlights</p>
              </li>
              <li>
                <Link href="/tools/remove-images-from-pdf">Strip Images</Link>
                <p>Remove all embedded graphics</p>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-forms-metadata">
            <h3 id="footer-forms-metadata">Forms & Metadata</h3>
            <ul>
              <li>
                <Link href="/tools/fill-pdf-form">Form Filler</Link>
                <p>Fill out interactive fields</p>
              </li>
              <li>
                <Link href="/tools/unlock-pdf-forms">Enable Fields</Link>
                <p>Unlock protected form areas</p>
              </li>
              <li>
                <Link href="/tools/flatten-pdf">Flatten Forms</Link>
                <p>Merge fields into page content</p>
              </li>
              <li>
                <Link href="/tools/pdf-info">Document Details</Link>
                <p>View file properties and count</p>
              </li>
              <li>
                <Link href="/tools/edit-pdf-metadata">Change Properties</Link>
                <p>Update title, author, and tags</p>
              </li>
              <li>
                <Link href="/tools/edit-pdf-table-of-contents">Manage Bookmarks</Link>
                <p>Edit outlines and TOC entries</p>
              </li>
              <li>
                <Link href="/tools/add-attachments-to-pdf">Embed Files</Link>
                <p>Attach documents inside the PDF</p>
              </li>
              <li>
                <Link href="/tools/show-pdf-javascript">Inspect Scripts</Link>
                <p>View embedded JavaScript code</p>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-security-signing">
            <h3 id="footer-security-signing">Security & Access</h3>
            <ul>
              <li>
                <Link href="/tools/password-protect-pdf">Secure Document</Link>
                <p>Add encryption and passwords</p>
              </li>
              <li>
                <Link href="/tools/remove-pdf-password">Remove Protection</Link>
                <p>Unlock password-protected files</p>
              </li>
              <li>
                <Link href="/tools/certificate-sign-pdf">Digital Signatures</Link>
                <p>Sign with official certificates</p>
              </li>
              <li>
                <Link href="/tools/validate-pdf-signature">Verify Signatures</Link>
                <p>Validate digital signature data</p>
              </li>
              <li>
                <Link href="/tools/redact-pdf">Redact Content</Link>
                <p>Permanently hide sensitive info</p>
              </li>
              <li>
                <Link href="/tools/sanitize-pdf">Clean Content</Link>
                <p>Strip hidden data and metadata</p>
              </li>
              <li>
                <Link href="/tools/change-pdf-permissions">Manage Access</Link>
                <p>Control printing and editing</p>
              </li>
              <li>
                <Link href="/tools/timestamp-pdf">Document Timestamps</Link>
                <p>Add official time evidence</p>
              </li>
              <li>
                <Link href="/tools/remove-pdf-certificate-signature">Clear Signatures</Link>
                <p>Remove certificate blocks</p>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-conversion-ocr">
            <h3 id="footer-conversion-ocr">Conversion & Files</h3>
            <ul>
              <li>
                <Link href="/tools/ocr-pdf">Text Recognition</Link>
                <p>Make scans searchable (OCR)</p>
              </li>
              <li>
                <Link href="/tools/convert-pdf">File Converter</Link>
                <p>Convert to Office, Images & more</p>
              </li>
              <li>
                <Link href="/tools/compress-pdf">Shrink Files</Link>
                <p>Reduce file size for sharing</p>
              </li>
              <li>
                <Link href="/tools/repair-pdf">Fix Documents</Link>
                <p>Repair damaged or broken files</p>
              </li>
              <li>
                <Link href="/tools/extract-images-from-pdf">Pull Images</Link>
                <p>Extract high-res graphics</p>
              </li>
              <li>
                <Link href="/tools/split-scanned-pdf">Separate Scans</Link>
                <p>Split double-page scans</p>
              </li>
              <li>
                <Link href="/tools/adjust-pdf-contrast">Enhance Visuals</Link>
                <p>Improve scan readability</p>
              </li>
              <li>
                <Link href="/tools/replace-pdf-colors">Color Settings</Link>
                <p>Invert or replace colors</p>
              </li>
              <li>
                <Link href="/tools/scanner-effect-pdf">Scan Filters</Link>
                <p>Apply realistic scanner effects</p>
              </li>
              <li>
                <Link href="/tools/compare-pdfs">Compare Files</Link>
                <p>Spot differences between versions</p>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-automation">
            <h3 id="footer-automation">Automation & Workflows</h3>
            <ul>
              <li>
                <Link href="/tools/pdf-tools">Chained Actions</Link>
                <p>Run multiple tools at once</p>
              </li>
              <li>
                <Link href="/tools/automate-pdf">Workflow Builder</Link>
                <p>Create repeatable sequences</p>
              </li>
              <li>
                <Link href="/tools/auto-rename-pdf">Smart Renaming</Link>
                <p>Rename files based on content</p>
              </li>
              <li>
                <Link href="/tools/read-pdf">Online Reader</Link>
                <p>Open and view files securely</p>
              </li>
              <li>
                <Link href="/tools/pdf-api">Developer API</Link>
                <p>Integrate our tools anywhere</p>
              </li>
              <li>
                <Link href="/tools/folder-scanning">Auto Scan</Link>
                <p>Monitor and process folders</p>
              </li>
              <li>
                <Link href="/tools/sso-guide">Login Setup</Link>
                <p>Configure SSO for your team</p>
              </li>
              <li>
                <Link href="/tools/air-gapped-pdf-tools">Offline Access</Link>
                <p>Deploy in secure environments</p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
