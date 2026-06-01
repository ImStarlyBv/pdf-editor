# Tangible Content Patterns - Sejda PDF Forms Analysis

This document identifies the exact structural patterns used on Sejda's "pdf-forms" page. These are tangible, repeatable sequences that you can map directly to your own page architecture.

## 1. The "Top-Heavy Hero" Pattern (Intent Capture)
Sejda assumes the user wants to **act** before they **read**.
*   **H1 (Main Keyword):** "Create Fillable PDF Online"
*   **H1-Sub (Supporting Keyword):** "Free PDF forms creator. Make existing PDF documents fillable"
*   **Visual Data Block:** 
    *   Large Green Button: `Upload PDF file`
    *   Dropdown for Cloud Storage: `Dropbox, Google Drive, OneDrive`
    *   Text Link: `or start with a blank document`
*   **Trust/Constraint Micro-copy:** 
    *   `Files stay private. Automatically deleted after 2 hours.`
    *   `Free service for documents up to 200 pages or 50 MB and 3 tasks per hour.`

## 2. The "Keyword Expansion" Instructional Pattern
Instead of a simple "How it works", Sejda uses a nested list that describes **Features as Steps**.

*   **H2 (How-To Keyword):** `How to Create a Fillable PDF Form Free`
*   **Step Sequence:**
    1.  `Select an existing PDF document` (Actionable Step)
    2.  `Add fillable form fields to your PDF form` (Feature Integration)
        *   **Tangible Data List:** (Bulleted list of every field type)
            *   `Text Field`, `Textarea`, `Radio`, `Checkbox`, `Dropdown`, `Signature box`.
    3.  `How to create a fillable PDF text field` (Specific Sub-task H4)
        *   Pattern: **Instructional Text + GIF/Screenshot**.
    4.  `Create checkboxes, radio buttons or dropdown` (Grouped Sub-task H4)
    5.  `Change border color. Configure text color in PDF form fields` (Technical Sub-task H4)
    6.  `Control form field names and other properties` (Advanced Sub-task H4)
    7.  `Change PDF tab order` (UX Sub-task H4)
    8.  `Align PDF fields, multi-select and duplicate across pages` (Efficiency Sub-task H4)
    9.  `Publish for others to fill & sign` (Conversion Sub-task H4)
    10. `Save your document` (Final Step H3)

## 3. The "Sandwich" Conversion Pattern
*   **Top CTA:** Large green upload button.
*   **Middle CTA (Contextual):** `Rather work offline? Try Sejda Desktop`.
*   **Bottom CTA (Final Catch):** 
    *   `Ready to create a fillable PDF online?` (H3 Question)
    *   `Create a PDF form` (XL Button)

## 4. The "Language Authority" Pattern
*   **Hreflang Grid:** In the `<head>`, they list 29 different language versions (en, de, fr, es, it, etc.).
*   **Tangible Result:** This signals to Google that they are a global authority, not just a local tool.

## 5. The "Mega-Menu SEO" Pattern
*   **Structural List:** Under the "All Tools" menu, they don't just list names; they list `Caption` + `Description`.
*   **Pattern:** 
    *   `Merge`: "Combine multiple PDFs and images into one"
    *   `Organize`: "Arrange and reorder PDF pages"
    *   *Effect:* This embeds hundreds of long-tail keywords into every single page via the header.

---
### Actionable Template for Our Page:
1.  **Header:** [Main Intent] + [Secondary Intent/Limit Info]
2.  **Tool Block:** [Primary Action Button] + [Alternative Sources] + [Privacy/Limit Disclaimer]
3.  **Instructional Block:**
    *   [How to Topic]
    *   [Step 1: Prep]
    *   [Step 2: Core Action] -> [Nested list of specific sub-features] -> [Sub-task tutorials with visuals]
    *   [Step 3: Save/Export]
4.  **Final CTA:** [Direct Question] + [Action Button]
