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
- Current backend dispatch coverage is 37 implemented tool handlers out of 58 registered tools.
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
- Latest local checks passed:
  - `npm run lint`
  - `npm run build`
  - Docker image build `pdf-editor-deploy-check`
  - in-memory smoke tests for the 10 latest first-pass services
  - in-memory smoke tests for the 10 newly translated first-pass services
  - in-memory smoke tests for edit metadata and PDF info

Current implementation caveats:
- The latest 10 services are first-pass implementations, not full Stirling parity. Add Text, Sign, Watermark, Stamp, and Annotate draw visible PDF content; Sign does not yet support drawn/image signatures. Sanitize removes common interactive entries, annotations, and standard metadata but is not yet a full defensive sanitizer. Show PDF JavaScript scans PDF source bytes for JavaScript markers and returns JSON; it does not yet parse every object stream variant.
- Flatten PDF now has a form-only `pdf-lib` path and a Ghostscript full-page raster path. The form-only path was locally smoke-tested; full-page raster flatten requires Ghostscript in the runtime and was not locally smoke-tested on Windows.
- `PDF Info` is a useful first pass, but not full Stirling parity yet. It still needs encryption, permissions, forms, XMP, compliance, image stats, and deeper per-page details.
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
- PDF Text Editor
- Add Text to PDF
- Add Image to PDF
- Annotate PDF
- Add Watermark
- Add Stamp
- Add Page Numbers
- Redact PDF
- Remove Images From PDF
- Remove PDF Annotations

Likely tools/libraries:
- existing editor logic
- `pdf-lib`
- `pdfjs-dist`
- `qpdf` where object-level cleanup is required

Important:
- Redaction must actually remove or destroy underlying content. It cannot only draw a black rectangle.

Completed:
- Added `Add Text to PDF`. `POST /api/tools/addText` draws configurable text on selected pages.
- Added `Sign PDF` typed-signature pass. `POST /api/tools/sign` draws typed signature text on selected pages.
- Added `Add Watermark`. `POST /api/tools/watermark` draws configurable text watermarks, including opacity and rotation.
- Added `Add Stamp`. `POST /api/tools/addStamp` draws configurable stamp text on selected pages.
- Added `Annotate PDF`. `POST /api/tools/annotate` draws highlight-style visible annotations with optional text.
- Added `Remove PDF Annotations`. `POST /api/tools/removeAnnotations` removes page annotation entries and common interactive catalog actions.
- Added tool-specific parameter fields to the shared upload panel for add text, sign, watermark, stamp, annotate, and form fill.

Remaining:
- Upgrade Sign PDF to support drawn signatures and uploaded signature images.
- Upgrade Add Image to PDF and image watermark/stamp workflows.
- Upgrade annotations to richer Stirling-style annotation types.
- Implement true redaction that destroys underlying content.
- Implement object-level image removal.

## Forms And Metadata Services
Tools:
- Fill PDF Form
- Unlock PDF Forms
- Flatten PDF
- Edit PDF Metadata
- Edit PDF Table of Contents
- PDF Info
- Add Attachments To PDF
- Show PDF JavaScript

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
- Added tool-specific parameter fields to the shared upload panel for edit metadata.

Remaining:
- Expand PDF Info toward full Stirling parity with encryption, permissions, forms, XMP, compliance, image statistics, and per-page low-level details.
- Add attachment and table-of-contents services.
- Upgrade form and JavaScript tools toward full Stirling parity.
- Upgrade flatten/unlock form behavior where `pdf-lib` is less complete than PDFBox.

## Security And Signing Services
Tools:
- Password Protect PDF
- Remove PDF Password
- Change PDF Permissions
- Sanitize PDF
- Certificate Sign PDF
- Timestamp PDF
- Validate PDF Signature
- Remove Certificate Signature

Likely tools/libraries:
- `qpdf`
- `node-signpdf` or equivalent signing library
- OpenSSL/BouncyCastle-equivalent Node tooling where needed
- trusted certificate parsing/validation libraries

Important:
- Signing and validation need careful correctness checks. We should follow Stirling behavior closely and add tests with signed sample PDFs.

Completed:
- Added `Sanitize PDF`. `POST /api/tools/sanitize` removes common catalog action entries, page annotations, form entries, and standard metadata as a first pass.

Remaining:
- Upgrade sanitize to Stirling-level hidden content, embedded file, JavaScript, metadata, and annotation cleanup.

## Conversion, OCR, And Image Services
Tools:
- Convert PDF
- OCR PDF
- Compress PDF
- Repair PDF
- Extract Images From PDF
- Split Scanned PDF
- Scanner Effect PDF
- Adjust PDF Contrast
- Replace PDF Colors
- Compare PDFs

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

Remaining:
- Upgrade compression to Ghostscript/qpdf quality profiles.
- Upgrade repair to qpdf/ghostscript repair paths for malformed PDFs that `pdf-lib` cannot load.
- Upgrade compare to visual/content diff parity.

## Automation And Product Pages
Tools:
- Multi-Tool
- Read PDF
- Automate PDF
- PDF API
- Folder Scanning
- SSO Guide
- Air-Gapped PDF Tools

Implementation:
- Multi-Tool becomes a workflow UI that chains registered services.
- Automate PDF becomes a saved/defined pipeline model.
- Read PDF can use the existing viewer/editor surface.
- PDF API exposes docs for the same `/api/tools/[toolId]` backend routes.
- Folder Scanning, SSO Guide, and Air-Gapped PDF Tools become product/support routes with real SEO content and internal links. If they later require account/system features, those become separate product tasks.

Completed:
- Added `Read PDF`. `POST /api/tools/read` returns `read-pdf.json` with document summary and content stream previews.
- Added `Auto Rename PDF`. `POST /api/tools/autoRename` returns the uploaded PDF with a filename suggested from PDF title metadata or the original filename.
- Added first-pass JSON guide endpoints for `PDF API`, `Folder Scanning`, `SSO Guide`, and `Air-Gapped PDF Tools`.

Remaining:
- Upgrade Read PDF to actual text extraction/rendered reader parity.
- Upgrade Auto Rename PDF to Stirling-level content-based naming.
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
- Status: Started.

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

Remaining:
- Replace generic instructional copy with deeper tool-specific long-tail copy.
- Add tool-specific feature bullet lists from Stirling parameters.
- Add richer Sejda-style keyword sections for each high-value tool.

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
- Built Docker image `pdf-editor-deploy-check` successfully after lockfile and `.dockerignore` fixes.
- Ran Docker container on host port `3001` and verified deployed pages plus deployed API calls for merge, add page numbers, edit metadata, and PDF info.
- Added the official Next ESLint flat config through `eslint-config-next/core-web-vitals`; the previous "Next.js plugin was not detected" warning is resolved.
- Confirmed `/` is prerendered as static content by Next.js.
- Confirmed `/api/tools/[toolId]` is dynamic, as intended for backend tool operations.
- Confirmed `/tools/[slug]` routes are prerendered as static HTML with `generateStaticParams`.
- Confirmed `/sitemap.xml` and `/robots.txt` are generated by Next.js.
- Latest build generated 64 static pages and passed.
- Latest lint passed after adding the upload UI and controller validation.

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
