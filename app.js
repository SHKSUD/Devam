/**
 * Master Study App — Class VI Academic Suite
 * Core Logic & State Management
 * Includes: Rebuilt Formulas (Point 4) & Gemini Navy Video Studio (Point 6)
 */

// Class data for the active class is loaded from classes/registry.js
const ACTIVE_CLASS = getActiveClass();
const SUBJECTS = ACTIVE_CLASS.data.subjects || [];
const SAMPLE_PAPERS_DATA = ACTIVE_CLASS.data.samplePapers || [];
const WEBAPPS_DATA = ACTIVE_CLASS.data.webapps || [];
const EXAM_SCHEDULE_DATA = ACTIVE_CLASS.data.examSchedule || [];

// One-time move of old (pre-registry) Class 6 progress into class-scoped keys
(function migrateLegacyStorage() {
  const pairs = [[classStorageKey('completed', ACTIVE_CLASS.id), 'completed'], [classStorageKey('notebook_urls', ACTIVE_CLASS.id), 'notebook_urls'], [classStorageKey('scratchpad', ACTIVE_CLASS.id), 'scratchpad']];
  try {
    pairs.forEach(([oldKey, name]) => {
      const newKey = classStorageKey(name, '6');
      const old = localStorage.getItem(oldKey);
      if (old !== null && localStorage.getItem(newKey) === null) localStorage.setItem(newKey, old);
    });
  } catch (e) {}
})();
const QUIZ_DATA = ACTIVE_CLASS.data.quiz || {};
const FORMULA_DATABASE = ACTIVE_CLASS.data.formulas || [];
const CURATED_VIDEOS_DATABASE = ACTIVE_CLASS.data.videos || [];
const CONCEPTS = ACTIVE_CLASS.data.concepts || {};

// Global State
let appState = {
  activeTab: 'curriculum',
  theme: localStorage.getItem('study_theme_v6') || 'dark',
  currentSubject: null,
  currentReaderDoc: null,
  completedChapters: JSON.parse(localStorage.getItem(classStorageKey('completed', ACTIVE_CLASS.id)) || '{}'),
  mastery: JSON.parse(localStorage.getItem(classStorageKey('mastery', ACTIVE_CLASS.id)) || '{}'),
  conceptAnswers: {},
  openConceptPanels: new Set(),
  notebookUrls: JSON.parse(localStorage.getItem(classStorageKey('notebook_urls', ACTIVE_CLASS.id)) || '{}'),
  searchQuery: '',
  formulaCategory: 'ALL',
  formulaSearchQuery: '',
  videoCategory: 'ALL',
  conceptCategory: 'ALL',
  activeConceptDetail: null
};

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(appState.theme);
  initClassSwitcher();
  initNavigation();
  initSearch();
  initScratchpad();
  initMusicPlayer();
  
  // Render views
  renderCurriculum();
  renderVideos('ALL');
  renderFormulas('ALL');
  renderSamplePapers();
  renderNotebookStudio();
  renderWebapps();
  renderExamSchedule();
  renderConceptHub('ALL');

  // Keyboard Shortcuts (Esc, Ctrl+K, Ctrl+J)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReaderModal();
      closeGeminiVideoModal();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      const input = document.getElementById('globalSearchInput');
      if (input) input.focus();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
      e.preventDefault();
      switchTab('formulas');
    }
  });
});

// Theme Management
function applyTheme(theme) {
  appState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('study_theme_v6', theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeBtn.innerHTML = theme === 'dark' ? `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <span>Light</span>
    ` : `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <span>Dark</span>
    `;
  }
}

function toggleTheme() {
  applyTheme(appState.theme === 'dark' ? 'light' : 'dark');
}

// Tab Switching
function switchTab(tabId) {
  appState.activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));

  const tabBtn = document.getElementById(`nav-tab-${tabId}`);
  const viewSec = document.getElementById(`view-${tabId}`);
  if (tabBtn) tabBtn.classList.add('active');
  if (viewSec) viewSec.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      if (tabTarget) switchTab(tabTarget);
    });
  });
}

// ---------------------------------------------------------------------------
// VIEW 1: CURRICULUM & SUBJECT DASHBOARD
// ---------------------------------------------------------------------------
function renderCurriculum() {
  const container = document.getElementById('subjectsContainer');
  if (!container) return;

  const query = appState.searchQuery.toLowerCase().trim();
  const filtered = SUBJECTS.filter(s => {
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.book.toLowerCase().includes(query) ||
      s.chapters.some(c => c.toLowerCase().includes(query))
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No subjects or chapters match "<strong>${escapeHtml(query)}</strong>".
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(sub => {
    const completedCount = sub.chapters.filter((_, i) => appState.completedChapters[`${sub.id}_ch${i + 1}`]).length;
    const progress = Math.round((completedCount / sub.count) * 100);

    return `
      <div class="subject-card-suave">
        <div>
          <div class="card-top">
            <div>
              <div class="subject-name">${sub.name}</div>
              <div class="subject-book">${sub.book}</div>
            </div>
            <span class="subject-badge">${sub.count} Chapters</span>
          </div>

          <div class="card-progress-bar">
            <div class="card-progress-fill" style="width: ${progress}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-tertiary); margin-bottom: 14px;">
            <span>${completedCount} of ${sub.count} completed</span>
            <span>${progress}%</span>
          </div>
          ${renderSubjectMasteryLine(sub.id)}
        </div>

        <div class="card-actions-row">
          <button class="btn-card highlight" onclick="openSubjectDetail('${sub.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Lessons
          </button>
          
          <button class="btn-card ai-highlight" onclick="launchNotebookLM('${sub.id}', '${sub.name}')" title="Open AI Study Notebook">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            NotebookLM
          </button>

          ${sub.syllabus ? `
            <button class="btn-card" onclick="openReader('${sub.syllabus}', '${sub.name} Official Syllabus', 'SYLLABUS')">
              Syllabus
            </button>
          ` : ''}

          <button class="btn-card" onclick="startQuiz('${sub.id}')">
            Quiz
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ---------------------------------------------------------------------------
// VIEW 2: SUBJECT DETAIL & CHAPTERS (With Gemini Video integration)
// ---------------------------------------------------------------------------
function openSubjectDetail(subjectId) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return;

  appState.currentSubject = sub;
  switchTab('lessons');

  document.getElementById('lessonsSubjectTitle').innerText = sub.name;
  document.getElementById('lessonsSubjectMeta').innerText = `${sub.book} • ${sub.count} Chapter Curriculum`;

  const container = document.getElementById('chaptersTableWrap');
  if (!container) return;

  let html = '';
  for (let i = 1; i <= sub.count; i++) {
    const chapterKey = `${sub.id}_ch${i}`;
    const isDone = Boolean(appState.completedChapters[chapterKey]);
    const chapterName = sub.chapters[i - 1] || `Chapter ${i}`;
    const filePath = sub.filePattern(i);
    const khanSearchUrl = `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(`${sub.name} Class 6 ${chapterName}`)}`;
    
    // Check if curated Gemini Navy video exists
    const curatedVideo = typeof CURATED_VIDEOS_DATABASE !== 'undefined'
      ? CURATED_VIDEOS_DATABASE.find(v => v.subjectId === sub.id && v.chapterNum === i)
      : null;

    html += `
      <div class="chapter-row-suave">
        <div class="chapter-info-block">
          <div class="chapter-num-badge ${isDone ? 'completed' : ''}" title="${isDone ? 'Completed' : 'Pending'}">
            ${isDone ? '✓' : i}
          </div>
          <div>
            <div class="chapter-title-text">${chapterName}</div>
            <div class="chapter-subtext">Chapter ${i} • NCERT Textbook PDF</div>
          </div>
        </div>

        <div class="chapter-actions-cluster">
          ${getChapterConcepts(sub.id, i).length ? `
            <button class="btn-card concept-highlight" onclick="toggleConceptPanel('${sub.id}', ${i})" title="Study the key ideas of this chapter">
              ${appState.openConceptPanels.has(`${sub.id}_${i}`) ? 'Hide' : 'Concepts'} ${chapterMasteryCount(sub.id, i)}/${getChapterConcepts(sub.id, i).length}
            </button>
          ` : ''}
          ${curatedVideo ? `
            <button class="btn-card gemini-highlight" onclick="openGeminiVideoModal('${curatedVideo.id}')" title="Watch Gemini masterclass">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Watch Video
            </button>
          ` : `
            <a class="btn-card" href="${khanSearchUrl}" target="_blank" rel="noopener" title="Search Khan Academy video lectures">
              Khan Video
            </a>
          `}

          <button class="btn-card ai-highlight" onclick="launchNotebookLM('${sub.id}', '${sub.name} - ${chapterName}')" title="Study with NotebookLM AI">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
            </svg>
            NotebookLM
          </button>

          <button class="btn-card highlight" onclick="openReader('${filePath}', '${sub.name} — Chapter ${i}: ${chapterName}', '${sub.code}')">
            Read PDF
          </button>

          <button class="btn-card" style="${isDone ? 'color: var(--success);' : ''}" onclick="toggleChapterDone('${chapterKey}')">
            ${isDone ? 'Marked Done' : 'Mark Done'}
          </button>
        </div>
      </div>
      ${appState.openConceptPanels.has(`${sub.id}_${i}`) ? renderConceptPanel(sub, i) : ''}
    `;
  }

  container.innerHTML = html;
}

function toggleChapterDone(key) {
  if (appState.completedChapters[key]) {
    delete appState.completedChapters[key];
  } else {
    appState.completedChapters[key] = true;
  }
  localStorage.setItem(classStorageKey('completed', ACTIVE_CLASS.id), JSON.stringify(appState.completedChapters));
  renderCurriculum();
  if (appState.currentSubject) {
    openSubjectDetail(appState.currentSubject.id);
  }
}

// ---------------------------------------------------------------------------
// VIEW 3: CURATED VIDEOS IN SIGNATURE GEMINI NAVY GRADIENT (POINT 6)
// ---------------------------------------------------------------------------
function filterVideoCategory(category, btnElem) {
  appState.videoCategory = category;
  document.querySelectorAll('#videoSubjectPills .pill-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
  renderVideos(category);
}

function renderVideos(category = 'ALL') {
  const container = document.getElementById('videosContainer');
  if (!container || typeof CURATED_VIDEOS_DATABASE === 'undefined') return;

  const filtered = CURATED_VIDEOS_DATABASE.filter(v => category === 'ALL' || v.subjectId === category);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No video masterclasses found for this subject filter.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(v => {
    const thumbStyle = v.embedId
      ? `background-image: linear-gradient(180deg, rgba(7, 13, 30, 0.35) 0%, rgba(7, 13, 30, 0.88) 100%), url('https://i.ytimg.com/vi/${v.embedId}/hqdefault.jpg'); background-size: cover; background-position: center;`
      : '';
    const khanLink = v.khanUnitUrl
      ? v.khanUnitUrl
      : `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(v.khanQuery)}`;

    const stitchedTopicsHtml = Array.isArray(v.topics) && v.topics.length > 0 ? `
      <div class="gemini-stitched-list">
        <div class="gemini-stitched-header">
          <span>Stitched Khan Academy Topic Sequence</span>
          <span>${v.topics.length} Parts</span>
        </div>
        ${v.topics.map((t, idx) => `
          <button class="gemini-topic-row" onclick="openGeminiVideoModal('${v.id}', ${idx})">
            <span class="gemini-topic-play">▶</span>
            <span class="gemini-topic-title">${escapeHtml(t.title)}</span>
            ${t.section ? `<span class="gemini-topic-sec">${escapeHtml(t.section)}</span>` : ''}
            <span class="gemini-topic-dur">${escapeHtml(t.duration || '')}</span>
          </button>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="gemini-video-card">
        <div class="gemini-video-thumb" style="${thumbStyle}" onclick="openGeminiVideoModal('${v.id}', 0)">
          <span class="gemini-ch-pill">Ch ${v.chapterNum}</span>
          <div class="gemini-play-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <span class="gemini-duration-tag">${v.duration}</span>
        </div>

        <div class="gemini-video-content">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div class="gemini-video-title">${v.title}</div>
            <span style="font-size: 11px; font-weight: 600; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 2px 8px; border-radius: 4px; flex-shrink: 0;">
              ${v.subjectName}
            </span>
          </div>

          <div class="gemini-video-sub">
            Chapter ${v.chapterNum}: ${v.chapterTitle} • ${v.source}
          </div>

          <p class="gemini-video-desc">
            ${v.description}
          </p>

          ${stitchedTopicsHtml}

          <div class="gemini-video-actions">
            <button class="btn-gemini-watch" onclick="openGeminiVideoModal('${v.id}', 0)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              ${Array.isArray(v.topics) && v.topics.length > 1 ? `Play Stitched (${v.topics.length} Topics)` : 'Watch Masterclass'}
            </button>

            <a class="btn-gemini-outline" href="${khanLink}" target="_blank" rel="noopener" title="Open Khan Academy Course / Practice">
              Khan Course ↗
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openGeminiVideoModal(videoId, topicIdx = 0) {
  if (typeof CURATED_VIDEOS_DATABASE === 'undefined') return;
  const video = CURATED_VIDEOS_DATABASE.find(v => v.id === videoId);
  if (!video) return;

  const modal = document.getElementById('geminiVideoModal');
  const frame = document.getElementById('theatreVideoFrame');
  const titleElem = document.getElementById('theatreVideoTitle');
  const metaElem = document.getElementById('theatreVideoMeta');
  const pdfBtn = document.getElementById('theatrePdfBtn');
  const nbBtn = document.getElementById('theatreNbBtn');

  const topics = Array.isArray(video.topics) && video.topics.length > 0 ? video.topics : null;
  const safeIdx = topics ? Math.max(0, Math.min(topicIdx, topics.length - 1)) : 0;
  const activeTopic = topics ? topics[safeIdx] : null;
  const currentEmbedId = activeTopic ? activeTopic.embedId : video.embedId;

  if (titleElem) {
    titleElem.innerText = activeTopic ? `${video.chapterTitle} — ${activeTopic.title}` : video.title;
  }
  if (metaElem) {
    metaElem.innerText = `${video.subjectName} • Chapter ${video.chapterNum}: ${video.chapterTitle} (${video.source}${activeTopic && activeTopic.section ? ' • ' + activeTopic.section : ''})`;
  }

  // Distraction-free playback; if topics exist, queue remaining topics in playlist param
  if (frame) {
    if (topics && topics.length > 1) {
      const remainingIds = topics.slice(safeIdx + 1).map(t => t.embedId).join(',');
      const playlistParam = remainingIds ? `&playlist=${remainingIds}` : '';
      frame.src = `https://www.youtube-nocookie.com/embed/${currentEmbedId}?autoplay=1&rel=0&modestbranding=1${playlistParam}`;
    } else {
      frame.src = `https://www.youtube-nocookie.com/embed/${currentEmbedId}?autoplay=1&rel=0&modestbranding=1`;
    }
  }

  // Render or update the Stitched Topic Switcher Bar inside the Theatre Modal
  let stitchBar = document.getElementById('theatreStitchBar');
  if (!stitchBar && modal) {
    const footer = modal.querySelector('.gemini-theatre-footer');
    if (footer && footer.parentNode) {
      stitchBar = document.createElement('div');
      stitchBar.id = 'theatreStitchBar';
      stitchBar.className = 'gemini-theatre-stitch-bar';
      footer.parentNode.insertBefore(stitchBar, footer);
    }
  }
  if (stitchBar) {
    if (topics && topics.length > 0) {
      stitchBar.style.display = 'flex';
      stitchBar.innerHTML = `
        <span class="stitch-bar-label">CHAPTER TOPICS:</span>
        <div class="stitch-bar-pills">
          ${topics.map((t, idx) => `
            <button class="stitch-pill-btn ${idx === safeIdx ? 'active' : ''}" onclick="openGeminiVideoModal('${video.id}', ${idx})">
              ${escapeHtml(t.title)} ${t.duration ? `<span style="opacity:0.65;">(${escapeHtml(t.duration)})</span>` : ''}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      stitchBar.style.display = 'none';
      stitchBar.innerHTML = '';
    }
  }

  // Hook up Chapter PDF button
  if (pdfBtn) {
    const sub = SUBJECTS.find(s => s.id === video.subjectId);
    if (sub) {
      const pdfPath = sub.filePattern(video.chapterNum);
      pdfBtn.onclick = () => {
        closeGeminiVideoModal();
        openReader(pdfPath, `${sub.name} — Chapter ${video.chapterNum}: ${video.chapterTitle}`, sub.code);
      };
      pdfBtn.style.display = 'inline-flex';
    } else {
      pdfBtn.style.display = 'none';
    }
  }

  // Hook up NotebookLM button
  if (nbBtn) {
    nbBtn.onclick = () => {
      launchNotebookLM(video.subjectId, `${video.subjectName} - ${video.chapterTitle}`);
    };
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeGeminiVideoModal() {
  const modal = document.getElementById('geminiVideoModal');
  const frame = document.getElementById('theatreVideoFrame');
  if (modal) modal.classList.remove('active');
  if (frame) frame.src = '';
  document.body.style.overflow = 'auto';
}

// ---------------------------------------------------------------------------
// VIEW 4: FORMULAS & GRAMMAR REFERENCE (POINT 4)
// ---------------------------------------------------------------------------
function filterFormulaCategory(category, btnElem) {
  appState.formulaCategory = category;
  document.querySelectorAll('#formulaSubjectPills .pill-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
  renderFormulas(category, appState.formulaSearchQuery);
}

function onFormulaSearchInput(query) {
  appState.formulaSearchQuery = query;
  renderFormulas(appState.formulaCategory, query);
}

function renderFormulas(category = 'ALL', query = '') {
  const container = document.getElementById('formulasMasterContainer');
  if (!container || typeof FORMULA_DATABASE === 'undefined') return;

  const q = query.toLowerCase().trim();
  const filtered = FORMULA_DATABASE.filter(card => {
    const matchesCategory = category === 'ALL' || card.subject === category;
    if (!matchesCategory) return false;

    if (!q) return true;
    const inTitle = card.title.toLowerCase().includes(q);
    const inCategory = card.category.toLowerCase().includes(q);
    const inSummary = card.summary.toLowerCase().includes(q);
    const inItems = card.content.some(item => 
      item.label.toLowerCase().includes(q) || 
      item.formula.toLowerCase().includes(q) || 
      (item.note && item.note.toLowerCase().includes(q))
    );
    return inTitle || inCategory || inSummary || inItems;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No reference formulas or grammar rules match "<strong>${escapeHtml(query)}</strong>".
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(card => `
    <div class="formula-card-pro">
      <div>
        <div class="formula-card-header">
          <div>
            <div class="formula-card-title">${card.title}</div>
            <div class="formula-card-meta">${card.subjectName} • ${card.category}</div>
          </div>
          <span class="subject-badge">${card.category}</span>
        </div>
        <div class="formula-card-summary">${card.summary}</div>
      </div>

      <div class="formula-table-clean">
        ${card.content.map(item => `
          <div class="formula-row-item">
            <div class="formula-row-main">
              <span class="formula-label">${item.label}</span>
              <span class="formula-code-badge" onclick="copyFormulaValue('${escapeJs(item.formula)}', this)" title="Click to copy formula">
                ${escapeHtml(item.formula)}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </span>
            </div>
            ${item.note ? `<div class="formula-note">${escapeHtml(item.note)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function copyFormulaValue(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const originalBg = element.style.background;
    element.style.background = 'var(--success-subtle)';
    element.style.color = 'var(--success)';
    setTimeout(() => {
      element.style.background = originalBg;
      element.style.color = '';
    }, 1200);
    showToast(`Copied formula: "${text}"`);
  });
}

// ---------------------------------------------------------------------------
// VIEWPORT READING PANE (Apple Pro Style, Edge-to-Edge)
// ---------------------------------------------------------------------------
function openReader(docUrl, title, badge = 'DOCUMENT') {
  appState.currentReaderDoc = { url: docUrl, title: title, badge: badge };

  const modal = document.getElementById('readerModal');
  const frame = document.getElementById('readerFrame');
  const titleElem = document.getElementById('readerDocTitle');
  const badgeElem = document.getElementById('readerBadge');

  if (titleElem) titleElem.innerText = title;
  if (badgeElem) badgeElem.innerText = badge;
  if (frame) frame.src = docUrl;

  // Contextual Watch Video Button
  const readerVideoBtn = document.getElementById('readerVideoBtn');
  if (readerVideoBtn) {
    let matchedVideo = null;
    if (typeof CURATED_VIDEOS_DATABASE !== 'undefined') {
      const lowerTitle = title.toLowerCase();
      matchedVideo = CURATED_VIDEOS_DATABASE.find(v => {
        return lowerTitle.includes(v.subjectName.toLowerCase()) && 
               (lowerTitle.includes(`chapter ${v.chapterNum}`) || lowerTitle.includes(`ch ${v.chapterNum}`));
      });
    }

    if (matchedVideo) {
      readerVideoBtn.style.display = 'inline-flex';
      readerVideoBtn.onclick = () => openGeminiVideoModal(matchedVideo.id);
    } else {
      readerVideoBtn.style.display = 'inline-flex';
      readerVideoBtn.onclick = () => {
        closeReaderModal();
        switchTab('videos');
      };
    }
  }

  // Setup Khan Academy button
  const khanBtn = document.getElementById('readerKhanBtn');
  if (khanBtn) {
    const query = encodeURIComponent(`Class 6 NCERT ${title}`);
    khanBtn.onclick = () => window.open(`https://www.khanacademy.org/search?page_search_query=${query}`, '_blank');
  }

  // Setup NotebookLM button
  const nbBtn = document.getElementById('readerNotebookBtn');
  if (nbBtn) {
    nbBtn.onclick = () => {
      const sub = SUBJECTS.find(s => title.toLowerCase().includes(s.name.toLowerCase()));
      launchNotebookLM(sub ? sub.id : 'MATH', title);
    };
  }

  // Pop-out button
  const newTabBtn = document.getElementById('readerNewTabBtn');
  if (newTabBtn) {
    newTabBtn.onclick = () => window.open(docUrl, '_blank');
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeReaderModal() {
  const modal = document.getElementById('readerModal');
  const frame = document.getElementById('readerFrame');
  if (modal) modal.classList.remove('active');
  if (frame) frame.src = '';
  document.body.style.overflow = 'auto';
  appState.currentReaderDoc = null;
}

// ---------------------------------------------------------------------------
// VIEW 5: SAMPLE PAPERS
// ---------------------------------------------------------------------------
function renderSamplePapers() {
  const container = document.getElementById('samplePapersContainer');
  if (!container) return;

  const query = appState.searchQuery.toLowerCase().trim();
  const filtered = SAMPLE_PAPERS_DATA.filter(p => {
    if (!query) return true;
    return (
      p.title.toLowerCase().includes(query) ||
      p.subject.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No sample papers match your query.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(paper => `
    <div class="subject-card-suave">
      <div>
        <div class="card-top">
          <div>
            <div class="subject-name" style="font-size: 15px;">${paper.title}</div>
            <div class="subject-book">${paper.subject} • ${paper.term}</div>
          </div>
          <span class="subject-badge">${paper.term}</span>
        </div>
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.45;">
          ${paper.description}
        </p>
      </div>

      <div class="card-actions-row" style="margin-top: 18px;">
        <button class="btn-card highlight" onclick="openReader('${paper.path}', '${paper.title}', 'PAPER')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Open Paper
        </button>
        <button class="btn-card" onclick="window.open('${paper.path}', '_blank')">
          Pop-out ↗
        </button>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------------------------
// VIEW 6: GOOGLE NOTEBOOKLM STUDIO
// ---------------------------------------------------------------------------
function renderNotebookStudio() {
  const container = document.getElementById('notebookSubjectList');
  if (container) {
    container.innerHTML = SUBJECTS.filter(s => s.id !== 'FRENCH').map(sub => {
      const savedUrl = appState.notebookUrls[sub.id] || '';
      return `
        <div class="notebook-config-row">
          <div>
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${sub.name}</div>
            <div style="font-size: 11px; color: var(--text-tertiary);">${sub.book}</div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input 
              type="url" 
              class="notebook-input" 
              placeholder="https://notebooklm.google.com/notebook/..." 
              value="${escapeHtml(savedUrl)}" 
              onchange="updateSubjectNotebookUrl('${sub.id}', this.value)"
            />
            <button class="btn-suave ai-btn" style="padding: 4px 8px; font-size: 12px;" onclick="launchNotebookLM('${sub.id}', '${sub.name}')">
              Open ↗
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  const promptContainer = document.getElementById('notebookPromptList');
  if (promptContainer) {
    const prompts = [
      {
        title: '🎙️ Audio Overview (Deep Dive)',
        prompt: 'Generate an engaging 8-minute conversational discussion explaining the key concepts of this chapter with real-world analogies tailored for a 6th grade student.'
      },
      {
        title: '📝 Exam Cheat Sheet & Key Formulas',
        prompt: 'Extract all definitions, scientific principles, dates, and mathematical formulas from these sources into a concise high-yield revision sheet with memory tricks.'
      },
      {
        title: '🗂️ 15 High-Yield Flashcards',
        prompt: 'Create 15 active-recall flashcards with Questions and Answers covering the most frequently tested concepts and tricky questions in this textbook chapter.'
      },
      {
        title: '❓ 5-Minute Socratic Practice Test',
        prompt: 'Act as a friendly, expert tutor. Quiz me with 5 conceptual questions one at a time. Wait for my response before giving constructive feedback and textbook references.'
      }
    ];

    promptContainer.innerHTML = prompts.map(p => `
      <div class="prompt-item">
        <div>
          <div class="prompt-title">${p.title}</div>
          <div class="prompt-body">"${p.prompt}"</div>
        </div>
        <button class="btn-suave" style="font-size: 11px; padding: 4px 8px;" onclick="copyNotebookPrompt(this, '${escapeJs(p.prompt)}')">
          Copy
        </button>
      </div>
    `).join('');
  }
}

function updateSubjectNotebookUrl(subjectId, url) {
  appState.notebookUrls[subjectId] = url.trim();
  localStorage.setItem(classStorageKey('notebook_urls', ACTIVE_CLASS.id), JSON.stringify(appState.notebookUrls));
  showToast('Notebook URL updated');
}

function launchNotebookLM(subjectId, contextTitle) {
  const customUrl = appState.notebookUrls[subjectId];
  const targetUrl = customUrl && customUrl.startsWith('http') ? customUrl : 'https://notebooklm.google.com/';
  window.open(targetUrl, '_blank', 'noopener');
  if (!customUrl) {
    showToast(`Opening Google NotebookLM. Tip: Link your ${contextTitle} notebook in the NotebookLM tab!`);
  }
}

function copyNotebookPrompt(buttonElem, text) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = buttonElem.innerText;
    buttonElem.innerText = 'Copied!';
    buttonElem.style.borderColor = 'var(--success)';
    buttonElem.style.color = 'var(--success)';
    setTimeout(() => {
      buttonElem.innerText = originalText;
      buttonElem.style.borderColor = '';
      buttonElem.style.color = '';
    }, 1800);
    showToast('Prompt copied to clipboard! Paste in NotebookLM.');
  });
}

// Scratchpad
function initScratchpad() {
  const pad = document.getElementById('scratchpadInput');
  const count = document.getElementById('scratchpadCharCount');
  if (!pad) return;

  pad.value = localStorage.getItem(classStorageKey('scratchpad', ACTIVE_CLASS.id)) || '';
  if (count) count.innerText = `${pad.value.length} characters`;

  pad.addEventListener('input', () => {
    localStorage.setItem(classStorageKey('scratchpad', ACTIVE_CLASS.id), pad.value);
    if (count) count.innerText = `${pad.value.length} characters`;
  });
}

function copyScratchpadNotes() {
  const pad = document.getElementById('scratchpadInput');
  if (!pad || !pad.value.trim()) {
    showToast('Scratchpad is empty.');
    return;
  }
  navigator.clipboard.writeText(pad.value).then(() => {
    showToast('Notes copied! Ready to paste into NotebookLM.');
  });
}

function clearScratchpadNotes() {
  if (confirm('Clear scratchpad notes?')) {
    const pad = document.getElementById('scratchpadInput');
    if (pad) {
      pad.value = '';
      localStorage.removeItem(classStorageKey('scratchpad', ACTIVE_CLASS.id));
      const count = document.getElementById('scratchpadCharCount');
      if (count) count.innerText = '0 characters';
      showToast('Scratchpad cleared');
    }
  }
}

// ---------------------------------------------------------------------------
// VIEW 7: INTERACTIVE LABS
// ---------------------------------------------------------------------------
function renderWebapps() {
  const container = document.getElementById('webappsContainer');
  if (!container) return;

  container.innerHTML = WEBAPPS_DATA.map(app => `
    <div class="subject-card-suave">
      <div>
        <div class="card-top">
          <div>
            <div class="subject-name" style="font-size: 15px;">${app.title}</div>
            <div class="subject-book">${app.subject}</div>
          </div>
          <span class="subject-badge">Interactive</span>
        </div>
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.45;">
          ${app.description}
        </p>
      </div>

      <div class="card-actions-row" style="margin-top: 18px;">
        <button class="btn-card highlight" onclick="openReader('${app.path}', '${app.title}', 'INTERACTIVE')">
          Launch in Reader
        </button>
        <button class="btn-card" onclick="window.open('${app.path}', '_blank')">
          New Window ↗
        </button>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------------------------
// VIEW 8: EXAM SCHEDULE
// ---------------------------------------------------------------------------
function renderExamSchedule() {
  const container = document.getElementById('examScheduleContainer');
  if (!container) return;

  container.innerHTML = EXAM_SCHEDULE_DATA.map(item => `
    <div class="subject-card-suave">
      <div>
        <div class="card-top">
          <div>
            <div class="subject-name" style="font-size: 15px;">${item.title}</div>
            <div class="subject-book">${item.term} Datesheet</div>
          </div>
          <span class="subject-badge">${item.term}</span>
        </div>
        <p style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.45;">
          ${item.description}
        </p>
      </div>

      <div class="card-actions-row" style="margin-top: 18px;">
        <button class="btn-card highlight" onclick="openReader('${item.path}', '${item.title}', 'SCHEDULE')">
          View Timetable
        </button>
        <button class="btn-card" onclick="window.open('${item.path}', '_blank')">
          Open Fullscreen ↗
        </button>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------------------------
// VIEW 9: QUIZ ENGINE
// ---------------------------------------------------------------------------
let activeQuiz = {
  subjectId: null,
  questions: [],
  index: 0,
  score: 0
};

function startQuiz(subjectId) {
  if (typeof QUIZ_DATA === 'undefined' || !QUIZ_DATA[subjectId]) {
    showToast(`No quiz questions found for ${subjectId}`);
    return;
  }

  activeQuiz = {
    subjectId: subjectId,
    questions: QUIZ_DATA[subjectId],
    index: 0,
    score: 0
  };

  switchTab('quiz');
  renderQuizCard();
}

function renderQuizCard() {
  const container = document.getElementById('quizCardContainer');
  if (!container) return;

  const q = activeQuiz.questions[activeQuiz.index];
  if (!q) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <h3 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Quiz Completed</h3>
        <p style="color: var(--text-secondary); font-size: 14px;">Your Score: <strong>${activeQuiz.score} / ${activeQuiz.questions.length}</strong></p>
        <button class="btn-suave primary" style="margin-top: 24px;" onclick="switchTab('curriculum')">
          Return to Subjects
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="quiz-meta-row">
      <span>${escapeHtml(q.chapter || 'Assessment')}</span>
      <span>Question ${activeQuiz.index + 1} of ${activeQuiz.questions.length}</span>
    </div>

    <div class="quiz-question-heading">${escapeHtml(q.question)}</div>

    <div id="quizOptionList">
      ${q.options.map((opt, i) => `
        <button class="quiz-option-suave" onclick="selectQuizOption(${i})">
          <span>${escapeHtml(opt)}</span>
          <span style="font-family: var(--font-mono); font-size: 11px; opacity: 0.5;">[${String.fromCharCode(65 + i)}]</span>
        </button>
      `).join('')}
    </div>

    <div id="quizFeedbackBox"></div>
  `;
}

function selectQuizOption(choiceIdx) {
  const q = activeQuiz.questions[activeQuiz.index];
  const buttons = document.querySelectorAll('.quiz-option-suave');
  buttons.forEach(b => b.disabled = true);

  if (choiceIdx === q.correct) {
    buttons[choiceIdx].classList.add('correct');
    activeQuiz.score++;
  } else {
    buttons[choiceIdx].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
  }

  const feedback = document.getElementById('quizFeedbackBox');
  if (feedback) {
    feedback.innerHTML = `
      <div class="quiz-explanation-box">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation || 'Verified textbook concept.')}
      </div>
      <div style="margin-top: 20px; text-align: right;">
        <button class="btn-suave primary" onclick="nextQuizQuestion()">
          Next Question →
        </button>
      </div>
    `;
  }
}

function nextQuizQuestion() {
  activeQuiz.index++;
  renderQuizCard();
}

// ---------------------------------------------------------------------------
// GLOBAL SEARCH & FILTER
// ---------------------------------------------------------------------------
function initSearch() {
  const input = document.getElementById('globalSearchInput');
  if (!input) return;

  input.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    renderCurriculum();
    renderSamplePapers();
    renderConceptHub(appState.conceptCategory);
  });
}

// ---------------------------------------------------------------------------
// TOAST NOTIFICATIONS
// ---------------------------------------------------------------------------
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('suaveToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'suaveToast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3000);
}

// Utilities
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeJs(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}


// Class switcher & class-specific labels
function initClassSwitcher() {
  const cls = ACTIVE_CLASS;
  document.title = `Master Study App — ${cls.label} Academic Suite`;
  document.querySelectorAll('[data-class-roman]').forEach(el => { el.textContent = el.dataset.classRoman.replace('{roman}', cls.roman); });
  document.querySelectorAll('[data-class-text]').forEach(el => {
    el.textContent = el.dataset.classText.replace('{label}', cls.label).replace('{session}', cls.session);
  });

  const select = document.getElementById('classSelect');
  if (!select) return;
  select.innerHTML = CLASS_REGISTRY.map(c => {
    const ready = c.available && CLASS_DATA[c.id];
    return `<option value="${c.id}" ${c.id === cls.id ? 'selected' : ''} ${ready ? '' : 'disabled'}>${c.label}${ready ? '' : ' (coming soon)'}</option>`;
  }).join('');
  select.addEventListener('change', () => setActiveClass(select.value));
}

// ---------------------------------------------------------------------------
// Concepts: key ideas per chapter, with self-checks and mastery tracking
// ---------------------------------------------------------------------------
function getChapterConcepts(subjectId, chapterNum) {
  return (CONCEPTS[subjectId] && CONCEPTS[subjectId][chapterNum]) || [];
}

function chapterMasteryCount(subjectId, chapterNum) {
  return getChapterConcepts(subjectId, chapterNum).filter(c => appState.mastery[c.id]).length;
}

function renderSubjectMasteryLine(subjectId) {
  const all = Object.values(CONCEPTS[subjectId] || {}).flat();
  if (!all.length) return '';
  const done = all.filter(c => appState.mastery[c.id]).length;
  return `<div class="concept-mastery-line">🎯 ${done} of ${all.length} concepts mastered</div>`;
}

function saveMastery() {
  localStorage.setItem(classStorageKey('mastery', ACTIVE_CLASS.id), JSON.stringify(appState.mastery));
}

function toggleConceptPanel(subjectId, chapterNum) {
  const key = `${subjectId}_${chapterNum}`;
  if (appState.openConceptPanels.has(key)) appState.openConceptPanels.delete(key);
  else appState.openConceptPanels.add(key);
  rerenderSubjectKeepingScroll(subjectId);
}

function rerenderSubjectKeepingScroll(subjectId) {
  const y = window.scrollY;
  openSubjectDetail(subjectId);
  window.scrollTo(0, y);
}

function conceptNotebookPrompt(sub, chapterNum, c) {
  return `I am a ${ACTIVE_CLASS.label} student studying NCERT ${sub.name} (${sub.book}), Chapter ${chapterNum}: ${sub.chapters[chapterNum - 1]}, section ${c.section}.\n` +
    `Help me understand the concept "${c.title}". The big idea: ${c.idea}\n` +
    `1) Explain it simply using the textbook. 2) Give me 2 everyday examples. 3) Ask me 3 questions one at a time and wait for my answer before checking it.`;
}

function renderConceptPanel(sub, chapterNum) {
  const list = getChapterConcepts(sub.id, chapterNum);
  const pdf = sub.filePattern(chapterNum);
  const cards = list.map((c, idx) => {
    const mastered = Boolean(appState.mastery[c.id]);
    const answers = appState.conceptAnswers[c.id] || {};
    const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${ACTIVE_CLASS.label} NCERT ${sub.book} ${c.title}`)}`;
    const questions = (c.check || []).map((q, qi) => {
      const picked = answers[qi];
      const answered = picked !== undefined;
      const right = picked === q.correct;
      return `
        <div class="concept-question">
          <div class="concept-q-text">${qi + 1}. ${escapeHtml(q.q)}</div>
          <div class="concept-options">
            ${q.options.map((opt, oi) => {
              let cls = '';
              if (answered && right && oi === q.correct) cls = 'correct';
              else if (answered && !right && oi === picked) cls = 'wrong';
              return `<button class="concept-option ${cls}" onclick="answerConcept('${sub.id}', ${chapterNum}, '${c.id}', ${qi}, ${oi})">${escapeHtml(opt)}</button>`;
            }).join('')}
          </div>
          ${answered ? `<div class="concept-why ${right ? 'ok' : 'retry'}">${right ? '✓ ' + escapeHtml(q.why) : 'Not quite — re-read the idea above and try again.'}</div>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="concept-card ${mastered ? 'mastered' : ''}">
        <div class="concept-head">
          <span class="concept-section">§ ${escapeHtml(c.section)}</span>
          <span class="concept-title">${idx + 1}. ${escapeHtml(c.title)}</span>
          ${mastered ? '<span class="concept-badge">Mastered ✓</span>' : ''}
        </div>
        <div class="concept-idea">${escapeHtml(c.idea)}</div>
        <div class="concept-explain">${escapeHtml(c.explain)}</div>
        <div class="concept-example"><strong>Example:</strong> ${escapeHtml(c.example)}</div>
        <div class="concept-check-label">Check yourself</div>
        ${questions}
        <div class="concept-actions">
          <button class="btn-card ai-highlight" onclick="askNotebookAboutConcept('${sub.id}', ${chapterNum}, '${c.id}')">Ask NotebookLM</button>
          <a class="btn-card" href="${videoUrl}" target="_blank" rel="noopener">Find a video</a>
          <button class="btn-card highlight" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(`${sub.name} — Chapter ${chapterNum}: ${sub.chapters[chapterNum - 1]}`)}', '${sub.code}')">Read § ${escapeHtml(c.section)} in book</button>
          ${mastered ? `<button class="btn-card" onclick="resetConcept('${sub.id}', ${chapterNum}, '${c.id}')">Practise again</button>` : ''}
        </div>
      </div>`;
  }).join('');

  return `<div class="concept-panel">${cards}</div>`;
}

function answerConcept(subjectId, chapterNum, conceptId, qIdx, optIdx) {
  const c = getChapterConcepts(subjectId, chapterNum).find(x => x.id === conceptId);
  if (!c) return;
  const answers = appState.conceptAnswers[conceptId] = appState.conceptAnswers[conceptId] || {};
  answers[qIdx] = optIdx;
  const allRight = c.check.every((q, i) => answers[i] === q.correct);
  if (allRight && !appState.mastery[conceptId]) {
    appState.mastery[conceptId] = true;
    saveMastery();
    showToast(`Concept mastered: ${c.title} 🎯`);
  }
  renderCurriculum();
  renderConceptHub(appState.conceptCategory);
  if (appState.activeTab === 'concepts' && appState.activeConceptDetail && appState.activeConceptDetail.conceptId === conceptId) {
    openConceptHubDetail(subjectId, chapterNum, conceptId);
  } else if (appState.activeTab === 'lessons') {
    rerenderSubjectKeepingScroll(subjectId);
  }
}

function resetConcept(subjectId, chapterNum, conceptId) {
  delete appState.mastery[conceptId];
  delete appState.conceptAnswers[conceptId];
  saveMastery();
  renderCurriculum();
  renderConceptHub(appState.conceptCategory);
  if (appState.activeTab === 'concepts' && appState.activeConceptDetail && appState.activeConceptDetail.conceptId === conceptId) {
    openConceptHubDetail(subjectId, chapterNum, conceptId);
  } else if (appState.activeTab === 'lessons') {
    rerenderSubjectKeepingScroll(subjectId);
  }
}

function askNotebookAboutConcept(subjectId, chapterNum, conceptId) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  const c = getChapterConcepts(subjectId, chapterNum).find(x => x.id === conceptId);
  if (!sub || !c) return;
  const prompt = conceptNotebookPrompt(sub, chapterNum, c);
  const open = () => launchNotebookLM(subjectId, sub.name);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(prompt).then(() => { showToast('Study prompt copied — paste it into NotebookLM'); open(); }, open);
  } else open();
}

// ---------------------------------------------------------------------------
// VIEW 10: UNIFIED CONCEPT HUB (P0 Concept-Centric Workspace)
// ---------------------------------------------------------------------------
function getAllConceptsFlat() {
  const result = [];
  SUBJECTS.forEach(sub => {
    const subConcepts = CONCEPTS[sub.id] || {};
    Object.keys(subConcepts).forEach(chKey => {
      const chNum = Number(chKey);
      const chapterTitle = sub.chapters[chNum - 1] || `Chapter ${chNum}`;
      (subConcepts[chKey] || []).forEach(c => {
        result.push({
          ...c,
          subjectId: sub.id,
          subjectName: sub.name,
          bookName: sub.book,
          chapterNum: chNum,
          chapterTitle: chapterTitle
        });
      });
    });
  });
  return result;
}

function filterConceptCategory(category, btnElem) {
  appState.conceptCategory = category;
  document.querySelectorAll('#conceptSubjectPills .pill-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
  closeConceptPanel();
  renderConceptHub(category);
}

function renderConceptHub(category = 'ALL') {
  const grid = document.getElementById('conceptCardsGrid');
  if (!grid) return;

  const q = (appState.searchQuery || '').toLowerCase().trim();
  const all = getAllConceptsFlat();
  const filtered = all.filter(item => {
    if (category !== 'ALL' && item.subjectId !== category) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.idea.toLowerCase().includes(q) ||
      item.explain.toLowerCase().includes(q) ||
      item.chapterTitle.toLowerCase().includes(q) ||
      item.subjectName.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No concepts match your current filter.
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const mastered = Boolean(appState.mastery[item.id]);
    const hasVideo = CURATED_VIDEOS_DATABASE.some(v => v.subjectId === item.subjectId && v.chapterNum === item.chapterNum);
    const hasFormulas = FORMULA_DATABASE.some(f => f.subject === item.subjectId);

    return `
      <div class="concept-hub-card ${mastered ? 'mastered' : ''}" onclick="openConceptHubDetail('${item.subjectId}', ${item.chapterNum}, '${item.id}')">
        <div>
          <div class="concept-hub-top">
            <span class="concept-hub-subject">${escapeHtml(item.subjectName)} • Ch ${item.chapterNum}</span>
            <span class="concept-status-pill ${mastered ? 'done' : 'pending'}">
              ${mastered ? '● Mastered' : '○ To Master'}
            </span>
          </div>
          <div class="concept-hub-title">${escapeHtml(item.title)}</div>
          <div class="concept-hub-idea">${escapeHtml(item.idea)}</div>
        </div>

        <div class="concept-hub-footer">
          <div class="concept-resource-tags">
            <span class="res-tag">PDF §${escapeHtml(item.section)}</span>
            ${hasVideo ? '<span class="res-tag gemini">✦ Video</span>' : ''}
            ${hasFormulas ? '<span class="res-tag">Formulas</span>' : ''}
            <span class="res-tag">${(item.check || []).length} Check Qs</span>
          </div>
          <span class="concept-open-arrow">Study →</span>
        </div>
      </div>
    `;
  }).join('');
}

function openConceptHubDetail(subjectId, chapterNum, conceptId) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  const concept = getChapterConcepts(subjectId, chapterNum).find(c => c.id === conceptId);
  if (!sub || !concept) return;

  appState.activeConceptDetail = { subjectId, chapterNum, conceptId };

  const panel = document.getElementById('conceptDetailPanel');
  const grid = document.getElementById('conceptCardsGrid');
  if (panel) panel.style.display = 'block';
  if (grid) grid.style.display = 'none';

  const chapterName = sub.chapters[chapterNum - 1] || `Chapter ${chapterNum}`;
  const pdfPath = sub.filePattern(chapterNum);
  const mastered = Boolean(appState.mastery[concept.id]);

  const titleEl = document.getElementById('conceptPanelTitle');
  const metaEl = document.getElementById('conceptPanelMeta');
  if (titleEl) {
    titleEl.innerHTML = `${escapeHtml(concept.title)} ${mastered ? '<span class="concept-badge" style="margin-left:8px;">Mastered ✓</span>' : ''}`;
  }
  if (metaEl) {
    metaEl.textContent = `${sub.name} (${sub.book}) • Chapter ${chapterNum}: ${chapterName} • Section § ${concept.section}`;
  }

  // 1. PDF Preview & Actions
  const pdfFrame = document.getElementById('conceptPdfFrame');
  if (pdfFrame && pdfFrame.getAttribute('data-src') !== pdfPath) {
    pdfFrame.src = pdfPath;
    pdfFrame.setAttribute('data-src', pdfPath);
  }
  const openPdfBtn = document.getElementById('conceptOpenPdfBtn');
  if (openPdfBtn) {
    openPdfBtn.onclick = () => openReader(pdfPath, `${sub.name} — Chapter ${chapterNum}: ${chapterName}`, sub.code);
  }
  const popoutPdfBtn = document.getElementById('conceptPopoutPdfBtn');
  if (popoutPdfBtn) {
    popoutPdfBtn.onclick = () => window.open(pdfPath, '_blank');
  }

  // 2. Curated Video + Self-Check Idea Box
  const videoContent = document.getElementById('conceptVideoContent');
  const matchedVideo = CURATED_VIDEOS_DATABASE.find(v => v.subjectId === subjectId && v.chapterNum === chapterNum);
  const answers = appState.conceptAnswers[concept.id] || {};
  const questionsHtml = (concept.check || []).map((q, qi) => {
    const picked = answers[qi];
    const answered = picked !== undefined;
    const right = picked === q.correct;
    return `
      <div class="concept-question" style="margin-top: 10px;">
        <div class="concept-q-text">${qi + 1}. ${escapeHtml(q.q)}</div>
        <div class="concept-options">
          ${q.options.map((opt, oi) => {
            let cls = '';
            if (answered && right && oi === q.correct) cls = 'correct';
            else if (answered && !right && oi === picked) cls = 'wrong';
            return `<button class="concept-option ${cls}" onclick="answerConcept('${sub.id}', ${chapterNum}, '${concept.id}', ${qi}, ${oi})">${escapeHtml(opt)}</button>`;
          }).join('')}
        </div>
        ${answered ? `<div class="concept-why ${right ? 'ok' : 'retry'}">${right ? '✓ ' + escapeHtml(q.why) : 'Not quite — review the explanation and try again.'}</div>` : ''}
      </div>
    `;
  }).join('');

  if (videoContent) {
    videoContent.innerHTML = `
      <div class="concept-idea" style="color:#38bdf8; margin-bottom:6px;">${escapeHtml(concept.idea)}</div>
      <div style="font-size:12.5px; color:#cbd5e1; line-height:1.55; margin-bottom:10px;">${escapeHtml(concept.explain)}</div>
      <div style="font-size:12px; color:#e2e8f0; background:rgba(255,255,255,0.05); border-left:3px solid #38bdf8; padding:8px 10px; border-radius:4px; margin-bottom:12px;">
        <strong>Example:</strong> ${escapeHtml(concept.example)}
      </div>
      ${matchedVideo ? `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding-top:8px; border-top:1px solid rgba(56,189,248,0.18);">
          <div>
            <div style="font-size:12px; font-weight:600; color:#f8fafc;">${escapeHtml(matchedVideo.title)}</div>
            <div style="font-size:11px; color:#38bdf8;">${escapeHtml(matchedVideo.source)} • ${escapeHtml(matchedVideo.duration)}</div>
          </div>
          <button class="btn-gemini-watch" style="flex:0 0 auto; padding:6px 14px;" onclick="openGeminiVideoModal('${matchedVideo.id}', 0)">
            ▶ Play Stitched
          </button>
        </div>
        ${Array.isArray(matchedVideo.topics) && matchedVideo.topics.length > 0 ? `
          <div class="gemini-stitched-list" style="margin-top:10px;">
            <div class="gemini-stitched-header">
              <span>Khan Academy Topic Sequence</span>
              <span>${matchedVideo.topics.length} Parts</span>
            </div>
            ${matchedVideo.topics.map((t, idx) => `
              <button class="gemini-topic-row" onclick="openGeminiVideoModal('${matchedVideo.id}', ${idx})">
                <span class="gemini-topic-play">▶</span>
                <span class="gemini-topic-title">${escapeHtml(t.title)}</span>
                ${t.section ? `<span class="gemini-topic-sec">${escapeHtml(t.section)}</span>` : ''}
                <span class="gemini-topic-dur">${escapeHtml(t.duration || '')}</span>
              </button>
            `).join('')}
          </div>
        ` : ''}
      ` : `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding-top:8px; border-top:1px solid rgba(56,189,248,0.18);">
          <span style="font-size:12px; color:#94a3b8;">Search curated lessons for this concept:</span>
          <a class="btn-gemini-outline" href="https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(`${sub.name} Class 6 ${concept.title}`)}" target="_blank" rel="noopener">
            Khan Academy ↗
          </a>
        </div>
      `}
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1);">
        <div class="concept-check-label" style="color:#94a3b8;">Concept Mastery Check</div>
        ${questionsHtml}
      </div>
    `;
  }

  // 3. Key Formulas / Reference
  const formulasBox = document.getElementById('conceptFormulasContent');
  if (formulasBox) {
    const relatedFormulas = FORMULA_DATABASE.filter(f => f.subject === subjectId);
    if (relatedFormulas.length > 0) {
      formulasBox.innerHTML = relatedFormulas.slice(0, 2).map(card => `
        <div style="margin-bottom:10px;">
          <div style="font-size:12px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">${escapeHtml(card.title)}</div>
          ${card.content.slice(0, 3).map(item => `
            <div class="formula-row-main" style="padding:4px 0; border-bottom:1px solid var(--border-subtle);">
              <span class="formula-label" style="font-size:11.5px;">${escapeHtml(item.label)}</span>
              <span class="formula-code-badge" style="font-size:11px;" onclick="copyFormulaValue('${escapeJs(item.formula)}', this)">${escapeHtml(item.formula)}</span>
            </div>
          `).join('')}
        </div>
      `).join('');
    } else {
      formulasBox.innerHTML = `<div style="font-size:12px; color:var(--text-tertiary);">Open the Formulas & Grammar tab (⌘J) for complete reference sheets.</div>`;
    }
  }

  // 4. Quick Action Buttons
  const quizBtn = document.getElementById('conceptQuizBtn');
  if (quizBtn) quizBtn.onclick = () => startQuiz(subjectId);

  const nbBtn = document.getElementById('conceptNotebookBtn');
  if (nbBtn) nbBtn.onclick = () => askNotebookAboutConcept(subjectId, chapterNum, concept.id);

  const khanBtn = document.getElementById('conceptKhanBtn');
  if (khanBtn) {
    khanBtn.onclick = () => window.open(`https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(`${sub.name} Class 6 ${concept.title}`)}`, '_blank');
  }
}

function closeConceptPanel() {
  appState.activeConceptDetail = null;
  const panel = document.getElementById('conceptDetailPanel');
  const grid = document.getElementById('conceptCardsGrid');
  const pdfFrame = document.getElementById('conceptPdfFrame');
  if (panel) panel.style.display = 'none';
  if (grid) grid.style.display = 'grid';
  if (pdfFrame) {
    pdfFrame.src = '';
    pdfFrame.removeAttribute('data-src');
  }
}

// ---------------------------------------------------------------------------
// AMBIENT FOCUS MUSIC PLAYER (P0 — Hybrid Stream + Web Audio Synth)
// ---------------------------------------------------------------------------
const FOCUS_CHANNELS = {
  lofi: {
    name: 'Lo-Fi Chill Study',
    streamUrl: 'https://streams.ilovemusic.de/iloveradio17.mp3',
    synthType: 'lofi'
  },
  rain: {
    name: 'Gentle Rain & Thunder',
    streamUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    synthType: 'rain'
  },
  focus: {
    name: 'Deep Focus (Alpha Wave)',
    streamUrl: '', // Uses pure Web Audio binaural generator
    synthType: 'focus'
  },
  classical: {
    name: 'Warm Ambient Pad',
    streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3',
    synthType: 'classical'
  }
};

let musicState = {
  channel: localStorage.getItem('study_music_channel') || 'lofi',
  volume: Number(localStorage.getItem('study_music_volume') || 40),
  isPlaying: false,
  audioCtx: null,
  synthNodes: [],
  synthTimer: null
};

function initMusicPlayer() {
  const slider = document.getElementById('musicVolumeSlider');
  if (slider) slider.value = musicState.volume;

  const hidden = localStorage.getItem('study_music_hidden') === '1';
  if (hidden) {
    dismissMusicPlayer();
  }

  // Highlight saved channel button
  document.querySelectorAll('.music-channel-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.channel === musicState.channel);
  });
  const ch = FOCUS_CHANNELS[musicState.channel] || FOCUS_CHANNELS.lofi;
  const trackEl = document.getElementById('musicTrackName');
  if (trackEl) trackEl.textContent = ch.name;
}

function selectMusicChannel(channelId, btnElem) {
  if (!FOCUS_CHANNELS[channelId]) return;
  musicState.channel = channelId;
  localStorage.setItem('study_music_channel', channelId);

  document.querySelectorAll('.music-channel-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');

  const trackEl = document.getElementById('musicTrackName');
  if (trackEl) trackEl.textContent = FOCUS_CHANNELS[channelId].name;

  if (musicState.isPlaying) {
    stopMusicEngine();
    startMusicEngine();
  }
}

function toggleMusicPlayback() {
  if (musicState.isPlaying) {
    stopMusicEngine();
    musicState.isPlaying = false;
  } else {
    startMusicEngine();
    musicState.isPlaying = true;
  }
  updateMusicUI();
}

function setMusicVolume(val) {
  musicState.volume = Number(val);
  localStorage.setItem('study_music_volume', String(musicState.volume));
  const audio = document.getElementById('focusMusicAudio');
  if (audio) audio.volume = Math.max(0, Math.min(1, musicState.volume / 100));
  if (musicState.masterGain && musicState.audioCtx) {
    musicState.masterGain.gain.setTargetAtTime((musicState.volume / 100) * 0.25, musicState.audioCtx.currentTime, 0.05);
  }
}

function updateMusicUI() {
  const playIcon = document.getElementById('musicPlayIcon');
  const waveBars = document.getElementById('musicWaveBars');
  const dot = document.getElementById('musicStatusDot');
  const playBtn = document.getElementById('musicPlayBtn');

  if (playIcon) {
    playIcon.innerHTML = musicState.isPlaying
      ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
      : '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
  }
  if (waveBars) waveBars.classList.toggle('playing', musicState.isPlaying);
  if (dot) dot.classList.toggle('playing', musicState.isPlaying);
  if (playBtn) playBtn.classList.toggle('playing', musicState.isPlaying);
}

function startMusicEngine() {
  const ch = FOCUS_CHANNELS[musicState.channel] || FOCUS_CHANNELS.lofi;
  const audio = document.getElementById('focusMusicAudio');

  // Always start the soothing Web Audio ambient layer immediately so there is zero silence/delay,
  // and if a stream URL is configured, attempt to play the stream and fade out synth once streaming.
  startWebAudioSynth(ch.synthType);

  if (audio && ch.streamUrl) {
    audio.src = ch.streamUrl;
    audio.volume = Math.max(0, Math.min(1, musicState.volume / 100));
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Stream succeeded — mute fallback synth so only stream plays
        stopWebAudioSynthOnly();
      }).catch(() => {
        // Stream blocked or offline — Web Audio synth keeps playing seamlessly!
      });
    }
  }
}

function stopMusicEngine() {
  const audio = document.getElementById('focusMusicAudio');
  if (audio) {
    audio.pause();
    audio.removeAttribute('src');
  }
  stopWebAudioSynthOnly();
}

function stopWebAudioSynthOnly() {
  if (musicState.synthTimer) {
    clearInterval(musicState.synthTimer);
    musicState.synthTimer = null;
  }
  musicState.synthNodes.forEach(node => {
    try { if (node.stop) node.stop(); } catch (e) {}
    try { if (node.disconnect) node.disconnect(); } catch (e) {}
  });
  musicState.synthNodes = [];
}

function startWebAudioSynth(type) {
  stopWebAudioSynthOnly();
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!musicState.audioCtx) musicState.audioCtx = new AudioCtx();
    const ctx = musicState.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const master = ctx.createGain();
    master.gain.value = (musicState.volume / 100) * 0.25;
    master.connect(ctx.destination);
    musicState.masterGain = master;
    musicState.synthNodes.push(master);

    if (type === 'rain') {
      // Gentle pink-filtered rain noise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1100;
      whiteNoise.connect(filter);
      filter.connect(master);
      whiteNoise.start(0);
      musicState.synthNodes.push(whiteNoise, filter);
    } else if (type === 'focus') {
      // Alpha-wave binaural focus pad (200 Hz & 210 Hz = 10 Hz Alpha beat)
      const freqs = [200, 210, 300];
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        g.gain.value = 0.18;
        osc.connect(g);
        g.connect(master);
        osc.start();
        musicState.synthNodes.push(osc, g);
      });
    } else {
      // Warm Lo-Fi / Classical harmonic chord progression
      const chords = type === 'classical'
        ? [[261.63, 329.63, 392.00], [220.00, 261.63, 329.63], [174.61, 220.00, 261.63], [196.00, 246.94, 293.66]]
        : [[261.63, 311.13, 392.00, 466.16], [233.08, 293.66, 349.23, 440.00], [207.65, 261.63, 311.13, 392.00]];
      let chordIdx = 0;
      const oscs = chords[0].map(f => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        filter.type = 'lowpass';
        filter.frequency.value = 650;
        g.gain.value = 0.12;
        osc.connect(filter);
        filter.connect(g);
        g.connect(master);
        osc.start();
        musicState.synthNodes.push(osc, filter, g);
        return osc;
      });
      musicState.synthTimer = setInterval(() => {
        chordIdx = (chordIdx + 1) % chords.length;
        const nextChord = chords[chordIdx];
        oscs.forEach((osc, i) => {
          if (nextChord[i] && ctx) {
            osc.frequency.setTargetAtTime(nextChord[i], ctx.currentTime, 0.4);
          }
        });
      }, 4500);
    }
  } catch (e) {}
}

function dismissMusicPlayer() {
  const bar = document.getElementById('musicPlayerBar');
  const pill = document.getElementById('musicPillBtn');
  if (bar) bar.style.display = 'none';
  if (pill) pill.style.display = 'inline-flex';
  localStorage.setItem('study_music_hidden', '1');
}

function showMusicPlayer() {
  const bar = document.getElementById('musicPlayerBar');
  const pill = document.getElementById('musicPillBtn');
  if (bar) bar.style.display = 'block';
  if (pill) pill.style.display = 'none';
  localStorage.setItem('study_music_hidden', '0');
}
