# Stirling Tools To Next.js MVC Implementation Plan

## Goal
Translate every tool from `Stirling-PDF` into our `pdf-editor` product as a full-stack Next.js app.

This is not a Java port and not a loose rewrite from scratch. Stirling is the reference implementation for:
- tool list
- tool names
- tool categories
- tool descriptions
- endpoint behavior
- request parameters
- validation rules
- result/download behavior
- SEO/tool-page inventory

Our implementation target is:
- Next.js frontend routes for every tool
- Next.js backend route handlers for every tool operation
- MVC-style structure inside the Next.js repo
- Dockerized runtime with the PDF binaries needed by the backend
- Sejda-style SEO patterns from `sejda_patterns.md`
- footer and all-tools navigation exposing every tool on every page
- HTML-first SEO delivery for every public tool page

## Latest Checkpoint
Current status after the latest continuation:
- Docker deployment check is fixed and passing.
- Added 10 more first-pass service translations:
  - `Add Text to PDF`
  - `Sign PDF` typed-signature pass
  - `Add Watermark`
  - `Add Stamp`
  - `Annotate PDF`
  - `Remove PDF Annotations`
  - `Sanitize PDF`
  - `Unlock PDF Forms`
  - `Fill PDF Form`
  - `Show PDF JavaScript`
- Added another 10 first-pass service translations:
  - `Add Attachments To PDF`
  - `Compress PDF`
  - `Repair PDF`
  - `Auto Rename PDF`
  - `Compare PDFs`
  - `Read PDF`
  - `PDF API`
  - `Folder Scanning`
  - `SSO Guide`
  - `Air-Gapped PDF Tools`
- Added 3 more first-pass service translations:
  - `Add Image to PDF`
  - `Timestamp PDF`
  - `Remove Certificate Signature`
- Added `.dockerignore` to keep local build artifacts, logs, env files, and `node_modules` out of the Docker build context.
- Refreshed `package-lock.json` so Docker `npm ci` succeeds.
- Built image `pdf-editor-deploy-check` successfully.
- Ran the production container on host port `3001`.
- Verified deployed public pages from the container runtime.
- Verified deployed API calls for:
  - `merge`
  - `addPageNumbers`
  - `changeMetadata`
  - `getPdfInfo`
- Added `Edit PDF Metadata` service and upload-panel fields.
- Added `PDF Info` service returning `response.json`.
- Added 4 more first-pass security service translations:
  - `Password Protect PDF`
  - `Remove PDF Password`
  - `Change PDF Permissions`
  - `Validate PDF Signature`
- Added 10 more first-pass service translations:
  - `Edit PDF Table of Contents`
  - `Extract Images From PDF`
  - `Remove Images From PDF`
  - `Split Scanned PDF`
  - `Adjust PDF Contrast`
  - `Replace PDF Colors`
  - `OCR PDF`
  - `Convert PDF`
  - `Redact PDF`
  - `Scanner Effect PDF`
- Added the final 4 first-pass service translations:
  - `PDF Text Editor`
  - `Multi-Tool`
  - `Certificate Sign PDF`
  - `Automate PDF`
- Current backend dispatch coverage is 58 implemented tool handlers out of 58 registered tools.
- Remaining unimplemented backend handlers: none.
- Latest local checks passed:
  - `npm run lint`
  - `npm run build`
  - Docker image build `pdf-editor-deploy-check`
  - in-memory smoke tests for add image, timestamp PDF, and remove certificate signature
  - in-memory smoke tests for PDF text editor, certificate sign PDF, multi-tool, and automate PDF
  - in-memory smoke tests for the 10 latest first-pass services
  - in-memory smoke tests for the 10 newly translated first-pass services
  - in-memory smoke tests for edit metadata and PDF info
  - Docker-based in-memory smoke tests for password protect, remove password, change permissions, and validate signature
  - in-memory smoke tests for edit table of contents, extract images, remove images, split scanned PDF, adjust contrast, replace colors, OCR, convert, redact, and scanner effect

Current implementation caveats:
- The latest 10 services are first-pass implementations, not full Stirling parity. Add Text, Sign, Watermark, Stamp, and Annotate draw visible PDF content; Sign does not yet support drawn/image signatures. Sanitize removes common interactive entries, annotations, and standard metadata but is not yet a full defensive sanitizer. Show PDF JavaScript scans PDF source bytes for JavaScript markers and returns JSON; it does not yet parse every object stream variant.
- Flatten PDF now has a form-only `pdf-lib` path and a Ghostscript full-page raster path. The form-only path was locally smoke-tested; full-page raster flatten requires Ghostscript in the runtime and was not locally smoke-tested on Windows.
- `PDF Info` is a useful first pass, but not full Stirling parity yet. It still needs encryption, permissions, forms, XMP, compliance, image stats, and deeper per-page details.
- Password protect, remove password, and change permissions depend on `qpdf`. They were smoke-tested in the Docker runtime image because qpdf is not installed on the Windows host. Validate signature is currently a structural scan for signature markers, not full cryptographic certificate-chain, revocation, timestamp, or digest validation.
- The latest 10 services are first-pass implementations. Edit table of contents exports validated TOC data but does not yet write PDF outline objects. Extract images scans for JPEG/DCTDecode image streams only. Remove images deletes direct page image XObject resources where possible. OCR extracts available text and returns JSON; it does not yet run full OCR or write a searchable PDF layer. Redact performs true whole-page replacement for selected pages, not area/text redaction parity. Contrast, color replacement, split scanned PDF, and scanner effect use lightweight PDF transformations rather than full image-processing parity.
- PDF Text Editor covers a selected area and draws replacement text; it does not yet rewrite existing PDF text objects. Certificate Sign PDF adds a visible signature block and metadata; it is not a cryptographic certificate signature yet. Multi-Tool and Automate PDF export workflow definitions as JSON; they do not yet execute chained jobs or persist automations.
- `Remove Blank Pages From PDF` currently detects structurally empty PDF pages. Full image/text blank-page detection still needs the renderer path.
- `npm install` reported 2 moderate npm audit findings. No forced audit fix was run because that can introduce breaking dependency changes.

## Local Skill References
Modern web guidance skills were installed manually because the runtime did not expose them as active skills in the session list.

Installed locations:
- `C:\Users\LuisUrbaez\.codex\skills\modern-web-guidance`
- `C:\Users\LuisUrbaez\.codex\skills\chrome-extensions`
- `C:\Users\LuisUrbaez\.codex\skills\.system\modern-web-guidance`
- `C:\Users\LuisUrbaez\.codex\skills\.system\chrome-extensions`

For frontend, HTML, CSS, client-side JavaScript, accessibility, and performance work, use the guidance manually if the runtime does not auto-load it:

```powershell
npx.cmd -y modern-web-guidance@latest search "<implementation query>" --skill-version 2026_05_16-c5e7870
npx.cmd -y modern-web-guidance@latest retrieve "<guide-id>"
```

Required workflow before frontend/UI work:

```powershell
# 1. Search for the closest guidance before implementing the UI/change.
npx.cmd -y modern-web-guidance@latest search "accessible file upload form progress status error messages React" --skill-version 2026_05_16-c5e7870

# 2. Retrieve the most relevant guide IDs returned by the search.
npx.cmd -y modern-web-guidance@latest retrieve "forms,accessibility"
```

For Chrome extension work, read the installed skill directly if the runtime does not auto-load it:

```powershell
Get-Content -Raw C:\Users\LuisUrbaez\.codex\skills\.system\chrome-extensions\SKILL.md
```

For modern web guidance instructions, read the installed skill directly if needed:

```powershell
Get-Content -Raw C:\Users\LuisUrbaez\.codex\skills\.system\modern-web-guidance\SKILL.md
```

Current guidance already checked before implementation:
- `html`
- `performance`
- `improve-next-page-load-performance`
- `accessibility`
- `forms`
- `accessible-error-announcement`
- `required-field-feedback`

Applied rules from that guidance:
- public tool pages must be semantic HTML, not empty client shells
- keep one clear H1 per tool page
- use real landmarks: `header`, `nav`, `main`, `footer`
- links are anchors, actions are buttons
- critical SEO copy must exist before hydration
- avoid layout shift with stable dimensions and predictable layout

## Architecture Decision
Use one full-stack Next.js app first.

The Next.js app will contain:
- pages/app routes for SEO and UI
- API route handlers for tool operations
- controllers for request parsing and HTTP responses
- services for PDF business logic
- models/schemas for tool parameters and validation
- shared tool registry data for SEO, routing, footer, sitemap, and UI

We will not use Java/Spring in our app.

Stirling Java code will be read as the behavioral source, then translated into TypeScript/Node services and Docker-installed command-line tools where needed.

We will not use Prisma.

If persistence is needed, we will use TypeORM. Default direction:
- start without a database for simple stateless tool processing
- use filesystem/temp-job storage for uploaded files and generated outputs
- add a TypeScript query builder or ORM only when we need persisted jobs, users, API keys, audit logs, saved automations, or billing data
- when persistence is required, use TypeORM entities, repositories, and migrations

## HTML-First SEO Rendering
Every public marketing/tool route must be delivered as real HTML for crawlers.

Next.js rendering rules:
- Tool landing pages should use static generation whenever possible.
- `/tools/[slug]` should generate static HTML from `toolRegistry`.
- Homepage, all-tools hub, footer links, and instructional content must be present in the initial HTML response.
- Metadata should be generated server-side with Next metadata APIs.
- Sitemap and robots should be generated from the same registry.
- Interactive upload controls can hydrate on the client after the HTML is delivered.
- Backend API routes stay dynamic because they process uploads and return files.

Important distinction:
- SEO pages: pre-rendered HTML.
- Tool operations: dynamic backend route handlers.
- Shared data: generated from the same canonical registry so HTML, sitemap, footer, and API docs stay aligned.

## MVC Structure
Proposed structure after migration:

```txt
pdf-editor/
  src/
    app/
      page.jsx
      layout.jsx
      sitemap.js
      robots.js
      tools/
        [slug]/
          page.jsx
      api/
        tools/
          [toolId]/
            route.js
    controllers/
      tools/
        toolController.js
        uploadController.js
    services/
      tools/
        compressService.js
        convertService.js
        ocrService.js
        securityService.js
        pageService.js
        metadataService.js
        formService.js
        imageService.js
        signingService.js
        automationService.js
    models/
      toolRegistry.js
      toolSchemas.js
      toolCategories.js
      toolResults.js
      persistence/
        jobs.js
        users.js
        automations.js
    views/
      components/
        SiteHeader.jsx
        AllToolsMenu.jsx
        ToolFooter.jsx
        ToolHero.jsx
        ToolInstructions.jsx
        ToolUploadPanel.jsx
        ToolResultPanel.jsx
        RelatedTools.jsx
    lib/
      files/
      pdf/
      process/
      seo/
```

MVC mapping:
- **Models:** tool registry, schemas, validation, route metadata, parameter definitions.
- **Views:** React components and SEO page templates.
- **Controllers:** Next API route handlers and controller functions that parse uploads, validate params, call services, and return files/errors.
- **Services:** actual PDF operations using Node libraries or Docker-installed binaries.
- **Persistence models:** only added when required, using TypeORM. No Prisma schema/client.

## Docker Direction
Use the same deployment pattern as the current frontend Docker setup, but for Next.js.

Current pattern:
- build app in Docker
- serve app in a container
- run through Docker Compose

New pattern:
- build Next.js app in Docker
- run Next.js server in the container
- install required PDF binaries in the image
- expose one app service first
- add worker services later only if long-running jobs need them

Expected Docker runtime dependencies:
- `qpdf` for password operations, repair-adjacent tasks, encryption, decryption, inspection
- `ghostscript` for compression, optimization, repair, PDF rendering workflows
- `poppler-utils` for PDF info, text extraction, image extraction, page rendering
- `tesseract-ocr` and `ocrmypdf` for OCR
- `libreoffice` for Office/document conversion
- `imagemagick` or `graphicsmagick` for scanner/image effects
- `exiftool` if metadata support needs it beyond library coverage

Completed:
- Switched the Next.js Docker image to `node:20-bookworm-slim` across all stages so runtime PDF binaries and native Node modules share the same Linux base.
- Added runtime packages for `qpdf`, `ghostscript`, `poppler-utils`, `tesseract-ocr`, `ocrmypdf`, `libreoffice`, `imagemagick`, and `exiftool`.
- Added writable runtime cache/config environment under `/tmp` for non-root LibreOffice and related tooling.
- Built the Docker image successfully and verified the expected PDF binaries inside the container.
- Fixed deployment build failure where `npm ci` rejected an out-of-sync lockfile by refreshing `package-lock.json`.
- Added `.dockerignore` so Docker excludes `.next`, `node_modules`, logs, env files, and other local-only files; build context dropped from hundreds of MB to under 1 MB.
- Rebuilt and ran the production container successfully on host port `3001`.
- Verified deployed pages and deployed API calls from the container runtime.

Database note:
- no database container is required for the first stateless tool-processing phase
- if we add persisted jobs/users/automations later, Compose can add Postgres
- the app database layer still must not use Prisma
- persisted database access should use TypeORM

## Source Translation Workflow
For each Stirling tool, do this:

1. Locate the frontend registry entry in:
   - `Stirling-PDF/frontend/editor/src/core/data/useTranslatedToolRegistry.tsx`
   - `Stirling-PDF/frontend/editor/src/core/types/toolId.ts`
   - `Stirling-PDF/frontend/editor/src/core/data/toolsTaxonomy.ts`

2. Locate the frontend operation hook:
   - `Stirling-PDF/frontend/editor/src/core/hooks/tools/**/use*Operation.ts`
   - `Stirling-PDF/frontend/editor/src/core/hooks/tools/**/use*Parameters.ts`

3. Locate the backend controller:
   - `Stirling-PDF/app/core/src/main/java/stirling/software/SPDF/controller/api/**`

4. Extract:
   - endpoint path
   - HTTP method
   - upload field names
   - accepted files
   - parameters
   - validation rules
   - output type
   - filename behavior
   - error behavior

5. Translate into Next.js:
   - model schema in `src/models/toolSchemas.js`
   - tool registry entry in `src/models/toolRegistry.js`
   - controller case in `src/controllers/tools/toolController.js`
   - service function in `src/services/tools/*Service.js`
   - API handler in `src/app/api/tools/[toolId]/route.js`
   - UI page using shared view components

6. Add SEO:
   - tool route
   - title
   - meta description
   - canonical URL
   - sitemap entry
   - footer link
   - all-tools menu entry
   - related tools
   - instructional content following `sejda_patterns.md`

## Required Tool Coverage
Every Stirling tool must be represented. No tool is skipped.

Initial canonical tool set:
- PDF Text Editor
- Multi-Tool
- Merge PDF
- Certificate Sign PDF
- Timestamp PDF
- Sign PDF
- Add Text to PDF
- Add Image to PDF
- Annotate PDF
- Password Protect PDF
- Add Watermark
- Add Stamp
- Sanitize PDF
- Flatten PDF
- Unlock PDF Forms
- Fill PDF Form
- Change PDF Permissions
- PDF Info
- Validate PDF Signature
- Edit PDF Metadata
- Edit PDF Table of Contents
- Crop PDF
- Rotate PDF
- Split PDF
- Reorganize PDF Pages
- Scale PDF Pages
- Add Page Numbers
- PDF Page Layout
- Booklet PDF
- PDF To Single Page
- Add Attachments To PDF
- Extract PDF Pages
- Extract Images From PDF
- Remove PDF Pages
- Remove Blank Pages From PDF
- Remove PDF Annotations
- Remove Images From PDF
- Remove PDF Password
- Overlay PDF
- Split Scanned PDF
- Adjust PDF Contrast
- Replace PDF Colors
- OCR PDF
- Convert PDF
- Compress PDF
- Repair PDF
- Redact PDF
- Remove Certificate Signature
- Auto Rename PDF
- Scanner Effect PDF
- Compare PDFs
- Show PDF JavaScript
- Read PDF
- Automate PDF
- PDF API
- Folder Scanning
- SSO Guide
- Air-Gapped PDF Tools

If Stirling contains additional proprietary/prototype tools in the checked-out repo, those also get added to the registry unless they are license-restricted.

## Implementation Phases

## Phase 1: Next.js Migration Foundation
- Status: Done for the initial foundation.

- Replace Vite app structure with Next.js app structure.
- Preserve the current editor experience during migration.
- Move existing editor UI into Next-compatible components.
- Add `src/app/layout.jsx`, `src/app/page.jsx`, and shared styling.
- Configure Dockerfile for Next.js build and runtime.
- Update `docker-compose.yml` to run the Next.js service.

Deliverable:
- Current app works in Next.js with Docker.

Completed:
- Switched `pdf-editor` scripts from Vite to Next.js.
- Added `next.config.mjs` with standalone output.
- Added `src/app/layout.jsx` and `src/app/page.jsx`.
- Preserved the existing editor as a client-side component.
- Made the PDF editor load with `ssr: false` so public SEO HTML can prerender without browser-only PDF APIs breaking the build.
- Replaced the nginx/Vite Dockerfile with a Next.js standalone Dockerfile.
- Updated Docker Compose to expose the Next.js service on port `3000`.
- Removed old Vite dev dependencies.

## Phase 2: Canonical Tool Registry
- Status: Done for the initial registry seed.

- Translate Stirling's tool registry into `src/models/toolRegistry.js`.
- Add each tool's:
  - `id`
  - `slug`
  - `name`
  - `description`
  - `category`
  - `subcategory`
  - `sourceEndpoint`
  - `nextEndpoint`
  - `uploadMode`
  - `acceptedTypes`
  - `parameters`
  - `seoTitle`
  - `seoDescription`
  - `relatedTools`
- Use this registry everywhere. Do not hardcode footer/menu/sitemap tool lists separately.

Deliverable:
- One source of truth for every Stirling tool in the Next.js app.

Completed:
- Added MVC model files:
  - `src/models/toolCategories.js`
  - `src/models/toolRegistry.js`
  - `src/models/toolSchemas.js`
  - `src/models/toolResults.js`
- Seeded the canonical registry with all Stirling tools listed in this plan.
- Each registry entry includes route slug, name, description, category, source endpoint, Next endpoint, upload mode, accepted types, and SEO metadata seed.
- Added lookup helpers by slug, ID, and category.

## Phase 3: SEO Routes For Every Tool
- Status: Done for the initial static route/template pass.

- Create `/tools/[slug]` pages for every registry tool.
- Pre-render `/tools/[slug]` pages as static HTML from `toolRegistry` where possible.
- Use `generateStaticParams` for all known tool slugs.
- Generate metadata from the registry.
- Generate sitemap entries from the registry.
- Add canonical URLs.
- Add honest hreflang only for routes we actually support.
- Apply the Sejda patterns:
  - top-heavy hero
  - upload/action block
  - privacy and limit microcopy
  - keyword-rich instruction section
  - middle CTA
  - bottom CTA
  - all-tools footer
  - all-tools menu with names plus descriptions

Deliverable:
- Every Stirling tool has a crawlable SEO page delivered as real initial HTML.

Completed:
- Added `/tools/[slug]` app route.
- Added `generateStaticParams` from `toolRegistry`.
- Added per-tool `generateMetadata` with title, description, canonical, hreflang `en`, hreflang `x-default`, and Open Graph metadata.
- Added shared SEO page components:
  - `src/views/components/ToolPage.jsx`
  - `src/views/components/ToolHero.jsx`
  - `src/views/components/ToolInstructions.jsx`
  - `src/views/components/RelatedTools.jsx`
- Confirmed `next build` prerenders `/tools/[slug]` as SSG static HTML.
- Current build generated 64 static pages total, including the tool pages.

## Phase 4: Shared Tool UI
- Status: Started. Initial generic upload/result UI is done.

- Build reusable upload and result components.
- Support single-file, multi-file, and complex parameter tools.
- Match Stirling's parameter concepts but use our own UI implementation.
- Include progress, error states, download state, and reset flow.

Deliverable:
- One reusable frontend flow that can power all tool pages.

Completed:
- Added initial reusable SEO/upload CTA panel in `ToolHero`.
- Added reusable instructional content and related tools sections.
- Added `src/views/components/ToolUploadPanel.jsx`.
- Tool pages now render a reusable multipart upload form tied to each tool's `nextEndpoint`.
- The upload form uses native file inputs, visible labels, field help, selected-file summary, and live status/error messaging.
- The upload form posts to `/api/tools/[toolId]` through `fetch` while preserving real form semantics in the HTML.

Remaining:
- Add tool-specific parameter forms from Stirling operation hooks.
- Replace placeholder result handling with real file downloads once services are translated.

## Phase 5: API Controllers
- Status: Started.

- Add `POST /api/tools/[toolId]`.
- Add controller-level handling for:
  - multipart uploads
  - file size limits
  - allowed file types
  - schema validation
  - service dispatch
  - result download response
  - JSON error response
- Keep controllers thin. Controllers should not contain PDF operation logic.

Deliverable:
- Every tool route can call a matching backend controller path.

Completed:
- Added `src/app/api/tools/[toolId]/route.js`.
- Added `src/controllers/tools/toolController.js`.
- Added `src/controllers/tools/uploadController.js`.
- Added placeholder service dispatch in `src/services/tools/toolService.js`.
- Current API correctly resolves registered tools and returns a `501` placeholder until each service is translated.
- Added multipart form parsing through `getUploadedFiles`.
- Added basic upload validation:
  - unknown tool returns `404`
  - missing required files returns `400`
  - single-file tools reject multiple files
  - tools reject unsupported MIME types based on registry `acceptedTypes`
- Placeholder service now receives validated files and returns the file count.

## Phase 5.1: Persistence Strategy Without Prisma
- Status: Documented, not implemented.

- Keep simple tool requests stateless where possible.
- Store temporary uploads and outputs under a controlled temp directory.
- Add cleanup jobs for expired files.
- Introduce database persistence only for features that require it:
  - saved automations
  - user accounts
  - API keys
  - long-running job history
  - audit logs
  - team/org settings
- Use TypeORM if/when persistence is required.
- Model persisted records with TypeORM entities and migrations.
- Do not add Prisma dependencies, Prisma schema files, Prisma migrations, or generated Prisma client code.

Deliverable:
- Backend state strategy is explicit, TypeORM-based when needed, and Prisma-free.

## Phase 6: Service Translation By Tool Group
- Status: Started.

Translate Stirling behavior into TypeScript services by category.

## Page And Structure Services
Tools:
- Merge PDF
- Split PDF
- Reorganize PDF Pages
- Extract PDF Pages
- Remove PDF Pages
- Remove Blank Pages From PDF
- Rotate PDF
- Crop PDF
- Scale PDF Pages
- PDF Page Layout
- Booklet PDF
- PDF To Single Page
- Overlay PDF

Likely tools/libraries:
- `pdf-lib`
- `qpdf`
- `ghostscript`
- `poppler-utils`

Completed:
- Added the first real translated structure service: `Merge PDF`.
- `POST /api/tools/merge` now merges multiple uploaded PDFs with `pdf-lib`.
- Successful merge responses return `application/pdf` downloads instead of placeholder JSON.
- The upload panel now handles binary file downloads while retaining semantic form markup and live status messages.
- Added `Split PDF` using Stirling's split-points model. `POST /api/tools/split` accepts `pageNumbers` such as `all`, `2`, or `2,5-7` and returns a ZIP of PDFs.
- Added `Rotate PDF`. `POST /api/tools/rotate` accepts a 90-degree-step `angle` and optional `pages` selection, then returns a rotated PDF.
- Added initial tool-specific parameter fields to the shared upload panel for split and rotate.
- Added `Extract PDF Pages`. `POST /api/tools/extractPages` accepts `pageNumbers` such as `2,4` or `1-3,7` and returns a PDF containing those pages.
- Added `Remove PDF Pages`. `POST /api/tools/removePages` accepts `pageNumbers` and returns a PDF with those pages removed, while rejecting outputs with no remaining pages.
- Added `Reorganize PDF Pages`. `POST /api/tools/reorganizePages` accepts custom page order plus initial Stirling-style `customMode` values: `REVERSE_ORDER`, `ODD_EVEN_SPLIT`, `DUPLEX_SORT`, `REMOVE_FIRST`, `REMOVE_LAST`, `REMOVE_FIRST_AND_LAST`, and `DUPLICATE`.
- Added tool-specific parameter fields to the shared upload panel for extract, remove, and reorganize pages.
- Added `Crop PDF`. `POST /api/tools/crop` accepts `x`, `y`, `width`, and `height` crop coordinates in PDF points and returns a cropped PDF.
- Added `Scale PDF Pages`. `POST /api/tools/scalePages` accepts `scaleFactor`, `pageSize`, and `orientation`, then returns pages scaled onto the target page size.
- Added `PDF Page Layout`. `POST /api/tools/pageLayout` accepts layout grid parameters and returns A4 sheets with multiple source pages per output page.
- Added tool-specific parameter fields to the shared upload panel for crop, scale pages, and page layout.
- Added `Booklet PDF`. `POST /api/tools/bookletImposition` creates a 2-up landscape saddle-stitch booklet with spine, gutter, border, duplex pass, and short-edge flip options.
- Added `PDF To Single Page`. `POST /api/tools/pdfToSinglePage` stacks all PDF pages into one long output page.
- Added `Overlay PDF`. `POST /api/tools/overlayPdfs` treats the first uploaded PDF as the base document, overlays the remaining PDFs in sequential, interleaved, or fixed-repeat mode, and supports foreground/background placement.
- Added tool-specific parameter fields to the shared upload panel for booklet and overlay PDFs.
- Added `Add Page Numbers`. `POST /api/tools/addPageNumbers` supports Stirling-style position values 1-9, starting number, page selection, custom text with `{n}`, `{total}`, and `{filename}`, margin size, font size/type/color, and zero-padding.
- Added `Remove Blank Pages From PDF`. `POST /api/tools/removeBlanks` returns a ZIP with non-blank pages and optionally detected blank pages. Current detection removes pages with empty PDF content streams; image-level white-page detection still needs the renderer/binary path for full Stirling parity.
- Added tool-specific parameter fields to the shared upload panel for add page numbers and remove blank pages.

Remaining:
- Upgrade remove blank pages to Stirling-level image/text detection using the renderer path.
- Continue with the next unimplemented content, metadata, security, conversion, and OCR services.

## Content Editing Services
Tools:
- [x] PDF Text Editor
- [x] Add Text to PDF
- [x] Add Image to PDF
- [x] Annotate PDF
- [x] Add Watermark
- [x] Add Stamp
- [x] Add Page Numbers
- [x] Redact PDF
- [x] Remove Images From PDF
- [x] Remove PDF Annotations

Likely tools/libraries:
- existing editor logic
- `pdf-lib`
- `pdfjs-dist`
- `qpdf` where object-level cleanup is required

Important:
- Redaction must actually remove or destroy underlying content. It cannot only draw a black rectangle.

Completed:
- Added `Add Text to PDF`. `POST /api/tools/addText` draws configurable text on selected pages.
- Added `PDF Text Editor`. `POST /api/tools/pdfTextEditor` covers selected regions and draws replacement text as a first-pass edit.
- Added `Add Image to PDF`. `POST /api/tools/addImage` places a PNG or JPEG image onto selected PDF pages.
- Added `Sign PDF` typed-signature pass. `POST /api/tools/sign` draws typed signature text on selected pages.
- Added `Add Watermark`. `POST /api/tools/watermark` draws configurable text watermarks, including opacity and rotation.
- Added `Add Stamp`. `POST /api/tools/addStamp` draws configurable stamp text on selected pages.
- Added `Annotate PDF`. `POST /api/tools/annotate` draws highlight-style visible annotations with optional text.
- Added `Remove PDF Annotations`. `POST /api/tools/removeAnnotations` removes page annotation entries and common interactive catalog actions.
- Added `Redact PDF`. `POST /api/tools/redact` performs true whole-page replacement for selected pages as a first pass.
- Added `Remove Images From PDF`. `POST /api/tools/removeImage` removes direct page image XObject resources where possible.
- Added tool-specific parameter fields to the shared upload panel for add text, sign, watermark, stamp, annotate, and form fill.

Remaining:
- Upgrade Sign PDF to support drawn signatures and uploaded signature images.
- Upgrade PDF Text Editor to object-level text replacement instead of visual cover-and-replace edits.
- Upgrade image watermark/stamp workflows beyond the current text-first passes.
- Upgrade annotations to richer Stirling-style annotation types.
- Upgrade redaction from whole-page replacement to area/text redaction parity.
- Upgrade image removal to recursive object-level image cleanup.

## Forms And Metadata Services
Tools:
- [x] Fill PDF Form
- [x] Unlock PDF Forms
- [x] Flatten PDF
- [x] Edit PDF Metadata
- [x] Edit PDF Table of Contents
- [x] PDF Info
- [x] Add Attachments To PDF
- [x] Show PDF JavaScript

Likely tools/libraries:
- `pdf-lib`
- `qpdf`
- `poppler-utils`
- `exiftool` if needed

Completed:
- Added `Edit PDF Metadata`. `POST /api/tools/changeMetadata` updates standard PDF metadata fields including title, author, subject, keywords, creator, producer, creation date, and modification date, and supports a delete-standard-metadata option.
- Added `PDF Info`. `POST /api/tools/getPdfInfo` returns a `response.json` download with basic file info, document metadata, page count, page sizes, and page rotations.
- Added `Add Attachments To PDF`. `POST /api/tools/addAttachments` embeds uploaded attachments into the first uploaded PDF.
- Added `Unlock PDF Forms`. `POST /api/tools/unlockPDFForms` clears read-only and required form field flags where supported by `pdf-lib`.
- Added `Fill PDF Form`. `POST /api/tools/formFill` accepts field values as JSON or `field=value` lines and optionally flattens the filled form.
- Added `Show PDF JavaScript`. `POST /api/tools/showJS` scans uploaded PDF bytes for JavaScript markers and returns `response.json`.
- Added `Edit PDF Table of Contents`. `POST /api/tools/editTableOfContents` validates requested TOC entries and returns `table-of-contents.json` as a first pass.
- Added tool-specific parameter fields to the shared upload panel for edit metadata.

Remaining:
- Expand PDF Info toward full Stirling parity with encryption, permissions, forms, XMP, compliance, image statistics, and per-page low-level details.
- Upgrade table-of-contents service to write real PDF outline/bookmark objects.
- Upgrade form and JavaScript tools toward full Stirling parity.
- Upgrade flatten/unlock form behavior where `pdf-lib` is less complete than PDFBox.

## Security And Signing Services
Tools:
- [x] Password Protect PDF
- [x] Remove PDF Password
- [x] Change PDF Permissions
- [x] Sanitize PDF
- [x] Certificate Sign PDF
- [x] Timestamp PDF
- [x] Validate PDF Signature
- [x] Remove Certificate Signature

Likely tools/libraries:
- `qpdf`
- `node-signpdf` or equivalent signing library
- OpenSSL/BouncyCastle-equivalent Node tooling where needed
- trusted certificate parsing/validation libraries

Important:
- Signing and validation need careful correctness checks. We should follow Stirling behavior closely and add tests with signed sample PDFs.

Completed:
- Added `Timestamp PDF`. `POST /api/tools/timestampPdf` draws a timestamp label on selected PDF pages as a first pass.
- Added `Certificate Sign PDF`. `POST /api/tools/certSign` adds a visible certificate-signature block and metadata as a first pass.
- Added `Sanitize PDF`. `POST /api/tools/sanitize` removes common catalog action entries, page annotations, form entries, and standard metadata as a first pass.
- Added `Remove Certificate Signature`. `POST /api/tools/removeCertSign` strips interactive form/action entries and page annotations as a first-pass signature cleanup.
- Added `Password Protect PDF`. `POST /api/tools/addPassword` uses qpdf 256-bit encryption with open/owner passwords and first-pass print, modify, copy, and annotation permissions.
- Added `Remove PDF Password`. `POST /api/tools/removePassword` uses qpdf decryption with an optional current password.
- Added `Change PDF Permissions`. `POST /api/tools/changePermissions` rewrites PDF permission flags with qpdf encryption.
- Added `Validate PDF Signature`. `POST /api/tools/validateSignature` returns `signature-validation.json` from a structural signature-marker scan.
- Added tool-specific parameter fields to the shared upload panel for password protection, password removal, and permission changes.

Remaining:
- Upgrade certificate signing to real cryptographic signing with certificate parsing, digest signing, ByteRange, and validation fixtures.
- Upgrade sanitize to Stirling-level hidden content, embedded file, JavaScript, metadata, and annotation cleanup.
- Upgrade timestamp PDF from visible timestamp text to cryptographic timestamp/signature parity where required.
- Upgrade remove certificate signature to targeted signature-field removal instead of broad interactive-entry cleanup.
- Upgrade password and permissions behavior toward full Stirling parity, including richer encryption options and clearer owner/user password semantics.
- Upgrade signature validation to full cryptographic validation with certificate chain, digest, timestamp, and revocation checks.

## Conversion, OCR, And Image Services
Tools:
- [x] Convert PDF
- [x] OCR PDF
- [x] Compress PDF
- [x] Repair PDF
- [x] Extract Images From PDF
- [x] Split Scanned PDF
- [x] Scanner Effect PDF
- [x] Adjust PDF Contrast
- [x] Replace PDF Colors
- [x] Compare PDFs

Likely tools/libraries:
- `ghostscript`
- `ocrmypdf`
- `tesseract-ocr`
- `libreoffice`
- `poppler-utils`
- `imagemagick`
- `sharp`

Completed:
- Added `Compress PDF`. `POST /api/tools/compress` reloads and saves PDFs with object streams enabled.
- Added `Repair PDF`. `POST /api/tools/repair` reloads and rewrites the PDF structure as a first-pass repair.
- Added `Compare PDFs`. `POST /api/tools/compare` returns `comparison.json` with page count, metadata, page size, and rotation differences.
- Added `Extract Images From PDF`. `POST /api/tools/extractImages` returns a ZIP with a manifest and detected JPEG/DCTDecode streams.
- Added `Split Scanned PDF`. `POST /api/tools/scannerImageSplit` splits each PDF page into a separate PDF inside a ZIP.
- Added `Adjust PDF Contrast`. `POST /api/tools/adjustContrast` applies a lightweight page overlay as a first-pass contrast effect.
- Added `Replace PDF Colors`. `POST /api/tools/replaceColor` applies a configurable tint overlay as a first-pass color replacement effect.
- Added `OCR PDF`. `POST /api/tools/ocr` extracts available text with Poppler when present and returns `ocr-result.json`.
- Added `Convert PDF`. `POST /api/tools/convert` extracts available text and returns `.txt` or `.json`.
- Added `Scanner Effect PDF`. `POST /api/tools/scannerEffect` redraws pages with an off-white scanned-paper treatment.

Remaining:
- Upgrade compression to Ghostscript/qpdf quality profiles.
- Upgrade repair to qpdf/ghostscript repair paths for malformed PDFs that `pdf-lib` cannot load.
- Upgrade compare to visual/content diff parity.
- Upgrade extract images to cover PNG, JBIG2, JPX, inline images, masks, and nested form XObjects.
- Upgrade OCR to run `ocrmypdf`/Tesseract and produce searchable PDFs.
- Upgrade convert PDF to full Stirling conversion parity through LibreOffice, Poppler, and image exporters.
- Upgrade scanner, contrast, and color tools to full raster/image-processing parity.

## Automation And Product Pages
Tools:
- [x] Multi-Tool
- [x] Read PDF
- [x] Automate PDF
- [x] PDF API
- [x] Folder Scanning
- [x] SSO Guide
- [x] Air-Gapped PDF Tools

Implementation:
- Multi-Tool becomes a workflow UI that chains registered services.
- Automate PDF becomes a saved/defined pipeline model.
- Read PDF can use the existing viewer/editor surface.
- PDF API exposes docs for the same `/api/tools/[toolId]` backend routes.
- Folder Scanning, SSO Guide, and Air-Gapped PDF Tools become product/support routes with real SEO content and internal links. If they later require account/system features, those become separate product tasks.

Completed:
- Added `Read PDF`. `POST /api/tools/read` returns `read-pdf.json` with document summary and content stream previews.
- Added `Auto Rename PDF`. `POST /api/tools/autoRename` returns the uploaded PDF with a filename suggested from PDF title metadata or the original filename.
- Added `Multi-Tool`. `POST /api/tools/multiTool` returns a validated workflow definition JSON from uploaded PDFs and requested tool IDs.
- Added `Automate PDF`. `POST /api/tools/automate` returns an automation definition JSON with trigger and step data.
- Added first-pass JSON guide endpoints for `PDF API`, `Folder Scanning`, `SSO Guide`, and `Air-Gapped PDF Tools`.

Remaining:
- Upgrade Read PDF to actual text extraction/rendered reader parity.
- Upgrade Auto Rename PDF to Stirling-level content-based naming.
- Upgrade Multi-Tool to execute chained registered services and pass outputs between steps.
- Upgrade Automate PDF to persist workflow definitions and run jobs through the future TypeORM-backed automation layer.
- Build real product workflows for API docs, folder scanning, SSO, and air-gapped deployment pages.

## Phase 7: Footer And All-Tools Menu
- Status: Done for the initial registry-generated navigation pass.

- Footer appears on every page.
- Footer lists every tool from `toolRegistry`.
- Group footer tools by category/subcategory.
- Header all-tools menu includes:
  - tool name
  - description
  - route
- Use real anchor links for crawlability.
- Do not maintain a separate footer list.

Deliverable:
- Every page links to every tool page.

Completed:
- Added `src/views/components/SiteHeader.jsx`.
- Added `src/views/components/ToolFooter.jsx`.
- Added root layout rendering for header and footer on every page.
- Header "All Tools" menu is generated from `toolRegistry`.
- Footer all-tools grid is generated from `toolRegistry`.
- Links are real Next anchors to `/tools/[slug]`.
- Tools are grouped by category from `toolCategories`.

## Phase 8: Sejda SEO Pattern Enforcement
- Status: Done for the generated first-pass enforcement.

Every tool page must include:
- one H1 targeting the tool's main keyword
- supporting subtitle with secondary keyword
- primary upload/action CTA above the fold
- privacy and file handling microcopy
- clear free/limit copy if limits exist
- H2 "How to..." section
- step-by-step instructions
- nested feature bullets
- middle CTA
- final CTA
- related tools
- all-tools footer

Deliverable:
- SEO structure is consistent across all tools.

Completed:
- Added top-heavy tool hero with H1, subtitle, CTA, source row, and privacy microcopy.
- Added instructional H2 section and step sequence.
- Added middle CTA, final CTA, related tools, header all-tools menu, and footer all-tools grid.
- Added semantic landmarks and skip link based on the local modern web guidance.
- Added reusable generated SEO content in `src/lib/seo/toolSeoContent.js`.
- Added tool-specific feature lists, workflow copy, and subtask sections to every public tool page.
- Added JSON-LD `WebApplication` and `BreadcrumbList` structured data for each tool page, based on Google Search Central guidance to use structured data that matches visible page content.
- Added descriptive text to footer tool links so the all-tools footer follows the Sejda mega-menu SEO pattern.
- Added conservative Speculation Rules prefetching for `/tools/*` links as a progressive enhancement.
- Verified generated static HTML contains the SEO copy, JSON-LD, canonical/hreflang links, mega-menu, footer links, and tool-specific sections before hydration.

Remaining:
- Replace generated first-pass copy with hand-authored long-tail copy for the highest-value tools.
- Add screenshots or short visual walkthrough media where it helps users understand complex tools.
- Replace placeholder production domain configuration before launch so canonical and JSON-LD URLs do not use `https://yourdomain.com`.

## Phase 9: Testing And Validation
- Status: Started.

For each translated tool:
- compare behavior against Stirling's endpoint behavior
- test required params
- test invalid params
- test bad file type
- test encrypted or malformed PDFs where relevant
- test download filename
- test output opens in a PDF reader
- test API error response

Build checks:
- `npm run build`
- `npm run lint`
- Docker build
- Docker Compose run
- representative tool operation tests

SEO checks:
- sitemap contains every tool
- footer contains every tool
- all-tools menu contains every tool
- page source contains the H1, instructions, footer links, and all critical SEO copy before hydration
- page titles are unique
- meta descriptions are unique
- no broken internal links

Completed:
- Ran `npm run lint` successfully.
- Ran `npm run build` successfully.
- Ran an in-memory service smoke test for booklet, PDF to single page, and overlay PDF; each returned downloadable PDF bytes.
- Ran an in-memory service smoke test for add page numbers and remove blank pages; each returned downloadable output bytes.
- Ran an in-memory service smoke test for edit metadata and PDF info; edit metadata returned PDF bytes and PDF info returned JSON bytes.
- Ran an in-memory service smoke test for add text, sign, watermark, stamp, annotate, remove annotations, sanitize, unlock forms, fill form, and show JavaScript; each returned downloadable PDF or JSON bytes, and generated PDFs loaded successfully.
- Ran an in-memory service smoke test for add attachments, compress, repair, auto rename, compare, read, PDF API, folder scanning, SSO guide, and air-gapped tools; each returned downloadable PDF or JSON bytes, and generated PDFs loaded successfully.
- Ran an in-memory service smoke test for add image, timestamp PDF, and remove certificate signature; each returned downloadable PDF bytes, and generated PDFs loaded successfully.
- Ran an in-memory service smoke test for PDF text editor, certificate sign PDF, multi-tool, and automate PDF; each returned downloadable PDF or JSON bytes.
- Built Docker image `pdf-editor-deploy-check` successfully after lockfile and `.dockerignore` fixes.
- Ran Docker container on host port `3001` and verified deployed pages plus deployed API calls for merge, add page numbers, edit metadata, and PDF info.
- Added the official Next ESLint flat config through `eslint-config-next/core-web-vitals`; the previous "Next.js plugin was not detected" warning is resolved.
- Confirmed `/` is prerendered as static content by Next.js.
- Confirmed `/api/tools/[toolId]` is dynamic, as intended for backend tool operations.
- Confirmed `/tools/[slug]` routes are prerendered as static HTML with `generateStaticParams`.
- Confirmed `/sitemap.xml` and `/robots.txt` are generated by Next.js.
- Latest build generated 64 static pages and passed.
- Latest lint passed after adding the upload UI and controller validation.
- Latest lint and build passed after applying Sejda/Google SEO page patterns.
- Verified generated static HTML for representative tool pages includes JSON-LD, tool instructions, feature sections, privacy copy, and all-tools navigation.

Known warning:
- None from the current lint/build pass.

## Implementation Order
1. Migrate app shell from Vite to Next.js. Done.
2. Add MVC folder structure. Done.
3. Translate Stirling tool registry into `toolRegistry`. Initial seed done.
4. Generate SEO pages for every tool. Initial static route pass done.
5. Add all-tools footer and header menu. Initial registry-generated pass done.
6. Add generic `/api/tools/[toolId]` route and controller dispatch. Started with placeholder dispatch.
7. Translate basic PDF structure tools first.
8. Add Docker PDF binaries.
9. Translate conversion/OCR/security tools.
10. Add multi-tool and automation workflows.
11. Validate every route, endpoint, footer link, and sitemap entry.

## Non-Negotiables
- No Stirling tool is skipped.
- No Java backend.
- No Prisma.
- Next.js owns both frontend and backend behavior.
- Public SEO routes must ship real HTML, not client-only empty shells.
- MVC boundaries stay clear.
- SEO pages are real pages, not hidden keyword dumps.
- Tool behavior is translated from Stirling, not guessed.
- Footer and all-tools menu are generated from the canonical registry.
- Docker must include whatever runtime binaries the translated backend services require.
