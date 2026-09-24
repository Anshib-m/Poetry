# Writing by Anshib

A static personal writing site. No CMS, backend, accounts, analytics, or database.

The site files live in `dist/`. There is no build step. Open `dist/index.html` directly or serve locally with `python3 -m http.server 5188 --bind 127.0.0.1 --directory dist`. Keep changes local until Anshib explicitly asks to finalise and deploy.

## Add approved writing

Add entries to `dist/writing.js`, each with `id`, `title`, `kind` (`poem` or `story`), and `text`. An optional `archiveDate` uses YYYY-MM-DD format. Keep the author's original line breaks, blank lines, and indentation in `text`. The collection renders title links with archive dates, newest first. Readers open a piece with `?piece=its-id`.

The collection contains 14 poems supplied by Anshib in Instagram and Google Notes screenshots on 13 September 2026. Only poem text is transcribed, excluding app controls, captions, comments, and metadata. Untitled poems use their first line as a display title. Display titles and poem bodies use sentence case at Anshib’s request, with capitals for sentence and stanza openings and the pronoun I. Original wording, punctuation, and stanza breaks remain unchanged.

## Stories

`dist/stories.js` appends three stories from the author's Word documents. Chalkboard Confessions is the main story, with its original prologue and 30 chapters. Its chapter menu and Previous/Next links use `index.html?piece=chalkboard-confessions&chapter=chapter-1`. Fading Echoes: Love Lost in the Shadows is a separate short story with Part 1 and Part 2 together on one page. Harmony Lost: A Tale of Unfulfilled Love is marked `Dropped · Incomplete` in both the collection and reader.

Story entries use `sections`, containing an `id`, original heading in `title`, and `paragraphs`. Each paragraph has original `text`, with optional `runs` for bold/italic emphasis. `readingMode: 'chapters'` renders one section at a time; otherwise all sections appear together. No new story text or dates were invented. The Word cover title and generated index are replaced by the website title and chapter menu; blank page-layout paragraphs are omitted. Original body paragraphs, including the literal dot separators in Fading Echoes and the italics in Harmony Lost, are preserved.

Anshib requested random dates from around the start of writing, 20 May 2025. The dates were assigned once between that day and 13 September 2026 and stored with each poem. They are labelled as archive dates, not verified composition or publication dates. One Google Notes screenshot carries the original date 19/02/2026; this is retained as `sourceDate` separately from its assigned archive date.

Typography uses Google Fonts. The site includes a favicon and privacy/terms pages. Hosting remains private until an explicit request to change the audience.
