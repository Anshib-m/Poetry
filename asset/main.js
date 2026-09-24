(() => {
  const pieces = Array.isArray(window.writing) ? window.writing : [];
  const index = document.getElementById('index');
  const reader = document.getElementById('reader');
  const sectionNames = { poem: 'Poetry', story: 'Stories' };
  const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const archiveDate = piece => {
    const time = make('time', 'archive-date', dateFormat.format(new Date(`${piece.archiveDate}T00:00:00Z`)));
    time.dateTime = piece.archiveDate;
    return time;
  };
  const pieceUrl = (piece, section) => {
    const query = new URLSearchParams({ piece: piece.id });
    if (section) query.set('chapter', section.id);
    return `./index.html?${query}#reader`;
  };
  const storyDetail = piece => {
    if (piece.readingMode === 'chapters') return `${piece.label} · Prologue + ${piece.sections.length - 1} chapters`;
    if (piece.sections?.length > 1) return `${piece.label} · ${piece.sections.length} parts`;
    return piece.label;
  };
  const storyParagraph = paragraph => {
    const p = make('p', paragraph.text === '.' ? 'story-separator' : '');
    if (paragraph.runs) {
      for (const run of paragraph.runs) {
        let content = document.createTextNode(run.text);
        if (run.italic) {
          const em = make('em'); em.append(content); content = em;
        }
        if (run.bold) {
          const strong = make('strong'); strong.append(content); content = strong;
        }
        p.append(content);
      }
    } else p.textContent = paragraph.text;
    return p;
  };
  for (const kind of ['poem', 'story']) {
    const list = document.querySelector(`[data-kind="${kind}"]`);
    if (!list) continue;
    const entries = pieces.filter(piece => piece.kind === kind)
      .sort((a, b) => (b.archiveDate || '').localeCompare(a.archiveDate || ''));
    if (!entries.length) continue;
    const empty = list.parentElement.querySelector('.empty-state');
    if (empty) empty.hidden = true;
    for (const piece of entries) {
      const row = make('li');
      const link = make('a', 'piece-link');
      link.href = pieceUrl(piece);
      const summary = make('div', 'piece-summary');
      if (piece.archiveDate) summary.append(archiveDate(piece));
      if (piece.kind === 'story') {
        summary.append(make('p', `story-meta${piece.status === 'dropped' ? ' dropped' : ''}`, storyDetail(piece)));
      }
      summary.append(make('h3', '', piece.title));
      if (piece.description) summary.append(make('p', 'piece-description', piece.description));
      link.append(summary, make('span', 'read-label', 'Read →'));
      row.append(link); list.append(row);
    }
  }
  const query = new URLSearchParams(location.search);
  const selectedId = query.get('piece');
  if (!selectedId) return;
  index.hidden = true; reader.hidden = false;
  const piece = pieces.find(item => item.id === selectedId);
  const collectionUrl = `./index.html#${piece?.kind === 'story' ? 'stories' : 'poetry'}`;
  const back = make('a', 'back-link', '← Back to the collection'); back.href = collectionUrl;
  reader.append(back);
  if (!piece) {
    document.title = 'Writing not found | Anshib M';
    reader.append(make('h1', '', 'Writing not found.'), make('p', '', 'This piece is not in the collection.'));
    return;
  }
  if (piece.kind === 'poem') reader.classList.add('poem-reader');
  document.title = `${piece.title} | Anshib M`;
  reader.append(make('p', 'eyebrow', sectionNames[piece.kind]), make('h1', '', piece.title));
  const byline = make('div', 'byline');
  byline.append(make('span', '', 'By Anshib M'));
  if (piece.archiveDate) {
    const dated = make('span', 'reader-date');
    dated.append(document.createTextNode('Archive date · '), archiveDate(piece));
    byline.append(dated);
  }
  if (piece.kind === 'story') byline.append(make('span', 'reader-date', storyDetail(piece)));
  reader.append(byline);
  if (piece.status === 'dropped') {
    const notice = make('aside', 'story-notice');
    notice.append(make('p', 'story-meta dropped', 'Dropped · Incomplete'), make('p', '', 'This story was left unfinished.'));
    reader.append(notice);
  }
  const body = make('div', piece.kind === 'story' ? 'story-text' : 'poem-text');
  let chapterIndex = -1;
  if (piece.kind === 'story' && piece.sections?.length) {
    let shownSections = piece.sections;
    if (piece.readingMode === 'chapters') {
      const selectedChapter = query.get('chapter');
      chapterIndex = selectedChapter ? piece.sections.findIndex(section => section.id === selectedChapter) : 0;
      const contents = make('details', 'chapter-menu');
      contents.append(make('summary', '', 'Chapters'));
      const nav = make('nav', 'chapter-list'); nav.setAttribute('aria-label', 'Chapters');
      const list = make('ol');
      piece.sections.forEach((section, i) => {
        const row = make('li');
        const link = make('a', '', section.title); link.href = pieceUrl(piece, section);
        if (i === chapterIndex) link.setAttribute('aria-current', 'page');
        row.append(link); list.append(row);
      });
      nav.append(list); contents.append(nav); reader.append(contents);
      if (chapterIndex < 0) {
        contents.open = true;
        body.append(make('p', '', 'Chapter not found. Choose a chapter from the menu above.'));
        shownSections = [];
      } else {
        shownSections = [piece.sections[chapterIndex]];
        document.title = `${shownSections[0].title} | ${piece.title}`;
      }
    } else if (piece.sections.length > 1) {
      const parts = make('nav', 'part-links'); parts.setAttribute('aria-label', 'Story parts');
      for (const section of piece.sections) {
        const link = make('a', '', section.title); link.href = `#${section.id}`; parts.append(link);
      }
      reader.append(parts);
    }
    for (const section of shownSections) {
      const sectionNode = make('section', 'story-section'); sectionNode.id = section.id;
      if (section.title) sectionNode.append(make('h2', '', section.title));
      for (const paragraph of section.paragraphs) sectionNode.append(storyParagraph(paragraph));
      body.append(sectionNode);
    }
  } else {
    // Preserve poem formatting, including repeated blank lines and indentation.
    const text = String(piece.text ?? '').replace(/\r\n?/g, '\n');
    body.append(make('p', '', text));
  }
  reader.append(body);
  if (chapterIndex >= 0) {
    const navigation = make('nav', 'chapter-navigation'); navigation.setAttribute('aria-label', 'Chapter navigation');
    for (const [offset, label] of [[-1, '← Previous'], [1, 'Next →']]) {
      const section = piece.sections[chapterIndex + offset];
      if (!section) continue;
      const link = make('a', offset < 0 ? 'previous-chapter' : 'next-chapter');
      link.href = pieceUrl(piece, section);
      link.append(make('span', 'chapter-direction', label), make('span', 'chapter-name', section.title));
      navigation.append(link);
    }
    if (navigation.childElementCount) reader.append(navigation);
  }
  const bottom = make('div', 'reader-bottom');
  const returnLink = make('a', '', 'Back to the collection'); returnLink.href = collectionUrl;
  bottom.append(returnLink); reader.append(bottom);
})();
