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
  activeConceptDetail: null,
  subjectViewMode: localStorage.getItem('study_subject_view_mode') || 'swipe',
  subjectSwipeIndex: 0,
  conceptViewMode: localStorage.getItem('study_concept_view_mode') || 'swipe',
  conceptSwipeIndex: 0
};

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(appState.theme);
  initClassSwitcher();
  initNavigation();
  initSearch();
  initScratchpad();
  initMusicPlayer();
  initTouchSwipeNavigation();
  
  // Render views
  renderCurriculum();
  renderVideos('ALL');
  renderFormulas('ALL');
  renderSamplePapers();
  renderNotebookStudio();
  renderWebapps();
  renderExamSchedule();
  renderConceptHub('ALL');
  renderQuestBanner();
  renderQuest();

  // Keyboard Shortcuts (Esc, Ctrl+K, Ctrl+J, ArrowLeft/Right for Swipe Switcher)
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
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';
    if (!isTyping && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key === 'ArrowLeft') handleGlobalSwipeStep(-1);
      if (e.key === 'ArrowRight') handleGlobalSwipeStep(1);
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
  updateGroupNav(tabId);
  if (tabId === 'quest') renderQuest();
  if (tabId === 'curriculum') renderQuestBanner();
  if (tabId === 'papers') renderAnnualPaperStudio();
  if (tabId === 'quiz' && !activeQuiz.questions.length) {
    startQuiz(activeQuiz.subjectId || 'SCIENCE', activeQuiz.chapterNum || null);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavigation() {
  buildGroupNav();
  updateGroupNav(appState.activeTab || 'curriculum');
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      if (tabTarget) switchTab(tabTarget);
    });
  });
}

// ---------------------------------------------------------------------------
// VIEW 1: FULL-SPACE CONNECTED SUBJECT STUDIO (iPadOS / macOS Scroll-Snap)
// ---------------------------------------------------------------------------
function setSubjectViewMode(mode) {
  appState.subjectViewMode = mode === 'grid' ? 'grid' : 'swipe';
  localStorage.setItem('study_subject_view_mode', appState.subjectViewMode);
  renderCurriculum();
}

function stepSubjectSwipe(delta) {
  const query = appState.searchQuery.toLowerCase().trim();
  const filtered = SUBJECTS.filter(s => !query || s.name.toLowerCase().includes(query) || s.book.toLowerCase().includes(query) || s.chapters.some(c => c.toLowerCase().includes(query)));
  if (!filtered.length) return;
  const nextIdx = ((appState.subjectSwipeIndex + delta) % filtered.length + filtered.length) % filtered.length;
  selectSubjectSwipeIndex(nextIdx);
}

function selectSubjectSwipeIndex(idx) {
  appState.subjectSwipeIndex = idx;
  const track = document.getElementById('subjectScrollSnapTrack');
  const slide = document.getElementById(`subject-slide-${idx}`);
  if (track && slide) {
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    updateSubjectSwipeIndicators(idx);
  } else {
    renderCurriculum();
  }
}

function updateSubjectSwipeIndicators(idx) {
  appState.subjectSwipeIndex = idx;
  document.querySelectorAll('.swipe-subject-pill[data-sub-idx]').forEach(btn => {
    const active = Number(btn.dataset.subIdx) === idx;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.swipe-dot[data-sub-idx]').forEach(dot => {
    dot.classList.toggle('active', Number(dot.dataset.subIdx) === idx);
  });
}

function openSubjectFormulaSheet(subjectId) {
  switchTab('formulas');
  const pillBtn = document.querySelector(`#formulaSubjectPills button[onclick*="'${subjectId}'"]`);
  filterFormulaCategory(subjectId, pillBtn);
}

function renderCurriculum() {
  const container = document.getElementById('subjectsContainer');
  if (!container) return;

  const btnSwipe = document.getElementById('modeBtnSwipe');
  const btnGrid = document.getElementById('modeBtnGrid');
  if (btnSwipe) btnSwipe.classList.toggle('active', appState.subjectViewMode === 'swipe');
  if (btnGrid) btnGrid.classList.toggle('active', appState.subjectViewMode === 'grid');

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
    container.className = 'subjects-layout';
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No subjects or chapters match "<strong>${escapeHtml(query)}</strong>".
      </div>
    `;
    return;
  }

  // FULL-SPACE CONNECTED SUBJECT STUDIO (iPadOS / macOS Scroll-Snap Carousel)
  if (appState.subjectViewMode === 'swipe' && !query) {
    if (appState.subjectSwipeIndex >= filtered.length) appState.subjectSwipeIndex = 0;
    const activeIdx = appState.subjectSwipeIndex;

    container.className = 'swipe-switcher-stage full-viewport-stage';
    container.innerHTML = `
      <!-- Top Subject Switcher Bar (Touch + Trackpad + Pill Click) -->
      <div class="subject-switcher-bar">
        <div class="swipe-pill-strip" role="tablist" aria-label="Switch Subject">
          ${filtered.map((s, i) => {
            const doneCnt = s.chapters.filter((_, chIdx) => isChapterDone(s.id, chIdx + 1)).length;
            return `
              <button class="swipe-subject-pill ${i === activeIdx ? 'active' : ''}" data-sub-idx="${i}" onclick="selectSubjectSwipeIndex(${i})" role="tab" aria-selected="${i === activeIdx}">
                <span class="swipe-pill-dot"></span>
                <span>${escapeHtml(s.name)}</span>
                <span class="swipe-pill-count">${doneCnt}/${s.count}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="subject-arrow-pair">
          <button class="swipe-mini-arrow" onclick="stepSubjectSwipe(-1)" title="Previous Subject (←)" aria-label="Previous Subject">‹</button>
          <button class="swipe-mini-arrow" onclick="stepSubjectSwipe(1)" title="Next Subject (→)" aria-label="Next Subject">›</button>
        </div>
      </div>

      <!-- Native Horizontal Scroll-Snap Track (All Subject Studios Connected) -->
      <div class="subject-scroll-snap-track" id="subjectScrollSnapTrack">
        ${filtered.map((sub, sIdx) => {
          const completedCount = sub.chapters.filter((_, i) => isChapterDone(sub.id, i + 1)).length;
          const progress = Math.round((completedCount / sub.count) * 100);
          const masteryCounts = subjectMasteryCounts(sub.id);
          const subVideos = CURATED_VIDEOS_DATABASE.filter(v => v.subjectId === sub.id);
          const subFormulas = FORMULA_DATABASE.filter(f => f.subject === sub.id);
          const hasQuiz = Boolean(QUIZ_DATA[sub.id]);

          return `
            <article class="full-subject-studio-slide" id="subject-slide-${sIdx}" data-sub-idx="${sIdx}">
              <!-- Studio Slide Header -->
              <div class="studio-slide-top">
                <div class="studio-slide-brand">
                  <div class="swipe-kicker">NCERT ${escapeHtml(ACTIVE_CLASS.label)} · Subject ${sIdx + 1} of ${filtered.length} · ⇄ Swipe Left / Right</div>
                  <div class="studio-title-row">
                    <h3 class="swipe-subject-title">${escapeHtml(sub.name)}</h3>
                    <span class="studio-book-pill">${escapeHtml(sub.book)}</span>
                  </div>
                </div>

                <div class="studio-top-metrics">
                  <span class="swipe-stat-chip">${completedCount}/${sub.count} Chapters</span>
                  ${masteryCounts.total ? `<span class="swipe-stat-chip accent">${masteryCounts.mastered}/${masteryCounts.total} Ideas Mastered</span>` : ''}
                  <div class="chapter-ring compact-ring" style="--pct:${progress}" title="${completedCount} of ${sub.count} chapters complete">
                    <span>${progress}%</span>
                  </div>
                </div>
              </div>

              <!-- Connected 2-Column Split Workspace (Chapters Left + Syllabus/Papers/Tools Right) -->
              <div class="studio-connected-split">
                <!-- LEFT PANE: Jony Ive Calm Hairline Chapter List (Progressive Disclosure) -->
                <div class="studio-chapters-pane ive-inset-group">
                  <div class="studio-pane-header">
                    <span>Chapters (${sub.count})</span>
                    <button class="link-btn-minimal" onclick="openSubjectDetail('${sub.id}')">All Chapters ›</button>
                  </div>

                  <div class="studio-chapters-scroll ive-hairline-list">
                    ${sub.chapters.map((chTitle, i) => {
                      const chNum = i + 1;
                      const numLabel = String(chNum).padStart(2, '0');
                      const done = isChapterDone(sub.id, chNum);
                      const cs = getChapterConcepts(sub.id, chNum);
                      const m = chapterMasteryCount(sub.id, chNum);
                      const vid = chapterVideo(sub.id, chNum);
                      const pdfPath = sub.filePattern(chNum);
                      const readTitle = `${sub.name} — Chapter ${chNum}: ${chTitle}`;
                      const dotsHtml = cs.length
                        ? `<span class="ive-mastery-dots" title="${m} of ${cs.length} key ideas mastered">${cs.map((_, di) => `<i class="${di < m ? 'lit' : ''}"></i>`).join('')}</span>`
                        : '';

                      return `
                        <div class="connected-ch-row ive-calm-row ${done ? 'done' : ''}" onclick="openChapter('${sub.id}', ${chNum})">
                          <div class="connected-ch-main">
                            <span class="ive-ch-index ${done ? 'completed' : ''}">${done ? '✓' : numLabel}</span>
                            <div class="connected-ch-text">
                              <div class="connected-ch-title">${escapeHtml(chTitle)}</div>
                            </div>
                          </div>
                          <div class="connected-ch-actions" onclick="event.stopPropagation()">
                            ${dotsHtml}
                            <button class="ch-action-pill ive-ghost-pill" onclick="openReader('${escapeJs(pdfPath)}', '${escapeJs(readTitle)}', '${sub.code}')" title="Read Chapter PDF">
                              PDF
                            </button>
                            ${vid ? `
                              <button class="ch-action-pill ive-ghost-pill gemini" onclick="openGeminiVideoModal('${vid.id}', 0)" title="Watch Video Masterclass">
                                ▶
                              </button>
                            ` : ''}
                            <span class="ive-row-chevron" onclick="openChapter('${sub.id}', ${chNum})" title="Open Chapter">›</span>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- RIGHT PANE: Connected Syllabus, Sample Papers, Videos, Formulas & AI -->
                <div class="studio-resources-pane">
                  <!-- 1. Official Syllabus & Curriculum Card -->
                  <div class="connected-module-card">
                    <div class="module-card-kicker">📋 Official Curriculum &amp; Syllabus</div>
                    <div class="module-card-title">${escapeHtml(sub.name)} Official Syllabus</div>
                    <p class="module-card-desc">Month-wise NCERT syllabus, classroom activities, and Periodic / Mid-Term / Final Exam portions.</p>
                    <div class="module-card-actions">
                      ${sub.syllabus ? `
                        <button class="btn-card highlight" onclick="openReader('${sub.syllabus}', '${sub.name} Official Syllabus', 'SYLLABUS')">
                          Open Syllabus PDF
                        </button>
                        <button class="btn-card" onclick="window.open('${sub.syllabus}', '_blank')">
                          Pop-out ↗
                        </button>
                      ` : '<span class="module-muted-note">Included in main curriculum</span>'}
                    </div>
                  </div>

                  <!-- 2. Connected Sample Papers & Reproducible Annual Exam Card -->
                  <div class="connected-module-card accent-border">
                    <div class="module-card-kicker">📝 Examination &amp; Sample Papers</div>
                    <div class="module-card-title">${(sub.id === 'SCIENCE' || sub.id === 'MATH' || sub.id === 'SSC') ? '60M Annual Exam Paper Studio + Mid-Term PDF' : `${escapeHtml(sub.name)} Sample & Exam Papers`}</div>
                    <p class="module-card-desc">
                      ${(sub.id === 'SCIENCE' || sub.id === 'MATH' || sub.id === 'SSC')
                        ? 'Reproduce full 60-mark Bloom Public School Annual Exam papers (Set A, Set B, or Randomized) with Timed Exam Mode, Socratic hints, Solve Pad & Marking Scheme.'
                        : 'Practice with official school examination sample papers and model assessments.'}
                    </p>
                    <div class="module-card-actions">
                      ${(sub.id === 'SCIENCE' || sub.id === 'MATH' || sub.id === 'SSC') ? `
                        <button class="btn-card gemini-highlight" onclick="openAnnualPaperStudio('${sub.id}')">
                          ✦ Annual Paper Studio (60M)
                        </button>
                      ` : `
                        <button class="btn-card" onclick="openAnnualPaperStudio('${sub.id}')">
                          ✦ Annual Paper Studio
                        </button>
                      `}
                      ${sub.samplePaper ? `
                        <button class="btn-card highlight" onclick="openReader('${sub.samplePaper}', '${sub.name} Official Sample Paper', 'PAPER')">
                          Mid-Term Paper PDF
                        </button>
                      ` : ''}
                    </div>
                  </div>

                  <!-- 3. Connected Video Masterclasses, Formulas, Quiz & NotebookLM -->
                  <div class="connected-module-card">
                    <div class="module-card-kicker">⚡ Connected Study Tools</div>
                    <div class="module-card-title">Masterclasses, Formulas, Quiz &amp; AI</div>
                    <div class="connected-tools-grid">
                      <button class="btn-card gemini-highlight" onclick="switchTab('videos'); filterVideoCategory('${sub.id}', null)">
                        ▶ Videos (${subVideos.length})
                      </button>
                      ${subFormulas.length ? `
                        <button class="btn-card" onclick="openSubjectFormulaSheet('${sub.id}')">
                          📐 Formulas (${subFormulas.length})
                        </button>
                      ` : ''}
                      ${hasQuiz ? `
                        <button class="btn-card highlight" onclick="startQuiz('${sub.id}')">
                          🎯 Practice Quiz
                        </button>
                      ` : ''}
                      <button class="btn-card ai-highlight" onclick="launchNotebookLM('${sub.id}', '${sub.name}')">
                        ✦ NotebookLM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>

      <div class="swipe-dots-footer">
        ${filtered.map((s, i) => `<button class="swipe-dot ${i === activeIdx ? 'active' : ''}" data-sub-idx="${i}" onclick="selectSubjectSwipeIndex(${i})" aria-label="${escapeHtml(s.name)}"></button>`).join('')}
      </div>
    `;

    // Sync scroll position & attach scroll-snap observer for iPad touch / macOS trackpad swiping
    const track = document.getElementById('subjectScrollSnapTrack');
    if (track) {
      const targetSlide = document.getElementById(`subject-slide-${activeIdx}`);
      if (targetSlide && activeIdx > 0) {
        track.scrollLeft = targetSlide.offsetLeft;
      }
      let scrollTimer = null;
      track.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const w = track.clientWidth || 1;
          const newIdx = Math.round(track.scrollLeft / w);
          if (newIdx >= 0 && newIdx < filtered.length && newIdx !== appState.subjectSwipeIndex) {
            updateSubjectSwipeIndicators(newIdx);
          }
        }, 60);
      }, { passive: true });
    }
    return;
  }

  // COMPACT GRID MODE (Decluttered)
  container.className = 'subjects-layout';
  container.innerHTML = filtered.map(sub => {
    const completedCount = sub.chapters.filter((_, i) => isChapterDone(sub.id, i + 1)).length;
    const progress = Math.round((completedCount / sub.count) * 100);

    return `
      <div class="subject-card-suave minimal-card">
        <div onclick="openSubjectDetail('${sub.id}')" style="cursor:pointer;">
          <div class="card-top">
            <div>
              <div class="subject-name">${sub.name}</div>
              <div class="subject-book">${sub.book}</div>
            </div>
            <span class="subject-badge">${completedCount}/${sub.count} Ch</span>
          </div>

          <div class="card-progress-bar">
            <div class="card-progress-fill" style="width: ${progress}%;"></div>
          </div>
          ${renderSubjectMasteryLine(sub.id)}
        </div>

        <div class="card-actions-row minimal-actions">
          <button class="btn-card highlight" onclick="openSubjectDetail('${sub.id}')">
            Chapters →
          </button>
          ${sub.syllabus ? `
            <button class="btn-card" onclick="openReader('${sub.syllabus}', '${sub.name} Official Syllabus', 'SYLLABUS')">
              Syllabus
            </button>
          ` : ''}
          ${(sub.id === 'SCIENCE' || sub.id === 'MATH' || sub.id === 'SSC') ? `
            <button class="btn-card gemini-highlight" onclick="openAnnualPaperStudio('${sub.id}')">
              Annual Paper (60M)
            </button>
          ` : ''}
          <button class="btn-card ai-highlight" onclick="launchNotebookLM('${sub.id}', '${sub.name}')" title="Open AI Study Notebook">
            NotebookLM
          </button>
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
    const chapterName = sub.chapters[i - 1] || `Chapter ${i}`;
    const done = isChapterDone(sub.id, i);
    const cs = getChapterConcepts(sub.id, i);
    const m = chapterMasteryCount(sub.id, i);
    html += `
      <button class="chapter-row-suave chapter-row-link" onclick="openChapter('${sub.id}', ${i})">
        <div class="chapter-info-block">
          <div class="chapter-num-badge ${done ? 'completed' : ''}">${done ? '✓' : i}</div>
          <div>
            <div class="chapter-title-text">${escapeHtml(chapterName)}</div>
            <div class="chapter-subtext">Chapter ${i}${cs.length ? ` • ${m}/${cs.length} key ideas mastered` : ''}${done ? ' • Complete' : ''}</div>
          </div>
        </div>
        <span class="chapter-open">${done ? 'Review' : 'Study'} →</span>
      </button>
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
  refreshStudyViews();
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
  if (!currentEmbedId) {
    window.open(youtubeSearchUrl(`${ACTIVE_CLASS.label} NCERT ${video.subjectName} ${activeTopic ? activeTopic.title : video.title}`), '_blank', 'noopener');
    showToast('That video is unavailable — opened a YouTube search instead');
    return;
  }

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
function applyReaderSplitState() {
  const modal = document.getElementById('readerModal');
  const splitBtn = document.getElementById('readerSplitViewBtn');
  const isSplit = Boolean(appState.readerSplitMode);
  const isOpen = modal && modal.classList.contains('active');

  if (modal) {
    modal.classList.toggle('split-docked', isSplit);
  }
  document.body.classList.toggle('reader-split-active', Boolean(isOpen && isSplit));
  if (isOpen) {
    document.body.style.overflow = isSplit ? 'auto' : 'hidden';
  }
  if (splitBtn) {
    splitBtn.innerHTML = isSplit ? '◫ Fullscreen PDF' : '◫ Split View';
    splitBtn.classList.toggle('primary', isSplit);
  }
}

function toggleReaderSplitView(forceState) {
  if (typeof forceState === 'boolean') {
    appState.readerSplitMode = forceState;
  } else {
    appState.readerSplitMode = !appState.readerSplitMode;
  }
  applyReaderSplitState();
  showToast(appState.readerSplitMode
    ? 'Split View enabled — read the PDF on the left while solving on the right'
    : 'Switched PDF Reader to Fullscreen view');
}

function openReader(docUrl, title, badge = 'DOCUMENT', preferSplit = false) {
  appState.currentReaderDoc = { url: docUrl, title: title, badge: badge };
  if (preferSplit) {
    appState.readerSplitMode = true;
  }

  const modal = document.getElementById('readerModal');
  const frame = document.getElementById('readerFrame');
  const titleElem = document.getElementById('readerDocTitle');
  const badgeElem = document.getElementById('readerBadge');

  if (titleElem) titleElem.innerText = title;
  if (badgeElem) badgeElem.innerText = badge;
  if (frame && frame.getAttribute('src') !== docUrl) {
    frame.src = docUrl;
  }

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
    applyReaderSplitState();
  }
}

function closeReaderModal() {
  const modal = document.getElementById('readerModal');
  const frame = document.getElementById('readerFrame');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('split-docked');
  }
  document.body.classList.remove('reader-split-active');
  if (frame) frame.src = '';
  document.body.style.overflow = 'auto';
  appState.currentReaderDoc = null;
}

// ---------------------------------------------------------------------------
// VIEW 5: ANNUAL EXAM PAPER STUDIO (SCIENCE, MATH & SSC + TIMED EXAM + REPLICA)
// ---------------------------------------------------------------------------
let annualPaperState = {
  view: 'annual',       // 'annual' | 'midterm'
  subjectId: 'SCIENCE', // 'SCIENCE' | 'MATH' | 'SSC'
  setMode: 'A',         // 'A' | 'B' | 'RANDOM'
  replicaMode: false,   // false = Studio Mode, true = Exact School Replica Paper Look
  reproNumber: 1,
  showAllAnswers: false,
  examTimerActive: false,
  examPaused: false,
  examSubmitted: false,
  examRemainingSec: 9000, // 2 hours 30 minutes = 9000 seconds
  examTotalSec: 9000,
  examIntervalId: null,
  diagnosticReport: null,
  revealedIds: {},
  hintIds: {},
  solveOpenIds: {},
  userDrafts: {},
  checkResults: {},
  mcqPicks: {},
  paper: null
};

function getAnnualBlueprint(subjectId) {
  if (subjectId === 'MATH' && window.MATH_ANNUAL_BLUEPRINT) return window.MATH_ANNUAL_BLUEPRINT;
  if (subjectId === 'SSC' && window.SSC_ANNUAL_BLUEPRINT) return window.SSC_ANNUAL_BLUEPRINT;
  return window.SCIENCE_ANNUAL_BLUEPRINT;
}

function stopExamTimerInterval() {
  if (annualPaperState.examIntervalId) {
    clearInterval(annualPaperState.examIntervalId);
    annualPaperState.examIntervalId = null;
  }
}

function formatExamClock(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startExamSimulation() {
  stopExamTimerInterval();
  annualPaperState.examTimerActive = true;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = false;
  annualPaperState.examRemainingSec = 9000;
  annualPaperState.examTotalSec = 9000;
  annualPaperState.diagnosticReport = null;
  annualPaperState.showAllAnswers = false;
  annualPaperState.revealedIds = {};
  annualPaperState.hintIds = {};
  annualPaperState.checkResults = {};

  annualPaperState.examIntervalId = setInterval(() => {
    if (!annualPaperState.examTimerActive || annualPaperState.examPaused) return;
    annualPaperState.examRemainingSec = Math.max(0, annualPaperState.examRemainingSec - 1);
    const clockEl = document.getElementById('liveExamClockDisplay');
    if (clockEl) {
      clockEl.textContent = formatExamClock(annualPaperState.examRemainingSec);
      clockEl.classList.toggle('urgent', annualPaperState.examRemainingSec < 600);
    }
    if (annualPaperState.examRemainingSec <= 0) {
      submitExamSimulation(true);
    }
  }, 1000);

  renderAnnualPaperStudio();
  showToast('⏱️ 2h 30m Exam Simulation started! Hints & answers are locked until you submit.');
}

function togglePauseExamSimulation() {
  if (!annualPaperState.examTimerActive) return;
  annualPaperState.examPaused = !annualPaperState.examPaused;
  renderAnnualPaperStudio();
}

function cancelExamSimulation() {
  stopExamTimerInterval();
  annualPaperState.examTimerActive = false;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = false;
  annualPaperState.diagnosticReport = null;
  renderAnnualPaperStudio();
  showToast('Exited timed exam simulation mode.');
}

function computeAnnualExamDiagnostics() {
  const subId = annualPaperState.subjectId || 'SCIENCE';
  const bp = getAnnualBlueprint(subId);
  const p = annualPaperState.paper;
  if (!bp || !p) return null;

  const chMap = {};
  (bp.assessedChapters || []).forEach(c => {
    chMap[c.num] = { num: c.num, title: c.title, earned: 0, max: 0, attempted: 0, totalItems: 0 };
  });
  const ensureCh = (chNum) => {
    const n = Number(chNum) || 1;
    if (!chMap[n]) {
      const subObj = SUBJECTS.find(s => s.id === subId);
      chMap[n] = {
        num: n,
        title: (subObj && subObj.chapters[n - 1]) || `Chapter ${n}`,
        earned: 0,
        max: 0,
        attempted: 0,
        totalItems: 0
      };
    }
    return chMap[n];
  };

  let objectiveEarned = 0;
  let objectiveMax = 0;
  let subjectiveEarned = 0;
  let subjectiveMax = 0;
  let totalAttempted = 0;
  let totalQuestionsCount = 0;

  // 1. Section A MCQs (1M each)
  (p.secAMcq || []).forEach((item, idx) => {
    const qKey = `mcq_${idx}`;
    const pick = annualPaperState.mcqPicks[qKey];
    const chStat = ensureCh(item.ch);
    chStat.max += 1;
    chStat.totalItems += 1;
    objectiveMax += 1;
    totalQuestionsCount += 1;
    if (pick !== undefined) {
      totalAttempted += 1;
      chStat.attempted += 1;
      if (pick === item.correct) {
        objectiveEarned += 1;
        chStat.earned += 1;
      }
    }
  });

  // 2. Section A Assertion-Reason (1M each)
  (p.secAAr || []).forEach((item, idx) => {
    const qKey = `ar_${idx}`;
    const pick = annualPaperState.mcqPicks[qKey];
    const chStat = ensureCh(item.ch);
    chStat.max += 1;
    chStat.totalItems += 1;
    objectiveMax += 1;
    totalQuestionsCount += 1;
    if (pick !== undefined) {
      totalAttempted += 1;
      chStat.attempted += 1;
      if (pick === item.correct) {
        objectiveEarned += 1;
        chStat.earned += 1;
      }
    }
  });

  // Helper to evaluate a subjective question draft against expected keywords
  const gradeSubjectiveItem = (qKey, item, maxMarks) => {
    const chStat = ensureCh(item.ch);
    chStat.max += maxMarks;
    chStat.totalItems += 1;
    subjectiveMax += maxMarks;
    totalQuestionsCount += 1;

    const raw = (annualPaperState.userDrafts[qKey] || '').trim();
    const expectedAns = item.ans || (item.choiceA && item.choiceB ? `${item.choiceA.ans}\n${item.choiceB.ans}` : '');
    const keys = extractKeyTermsFromAnswer(expectedAns, item.keywords);

    if (!raw) {
      annualPaperState.checkResults[qKey] = { matched: [], missed: keys, total: keys.length, earnedMarks: 0, maxMarks };
      return;
    }

    totalAttempted += 1;
    chStat.attempted += 1;
    const lower = raw.toLowerCase();
    const matched = keys.filter(k => lower.includes(k.toLowerCase()));
    const missed = keys.filter(k => !lower.includes(k.toLowerCase()));

    // Proportional keyword score with sensible floor for substantive written responses
    const targetKeyCount = Math.max(1, Math.min(keys.length, 3));
    let ratio = matched.length / targetKeyCount;
    if (ratio < 0.35 && raw.length >= 25) ratio = 0.35;
    ratio = Math.min(1, ratio);
    const earned = Math.round(ratio * maxMarks * 2) / 2; // nearest 0.5 mark

    subjectiveEarned += earned;
    chStat.earned += earned;
    annualPaperState.checkResults[qKey] = { matched, missed, total: keys.length, earnedMarks: earned, maxMarks };
  };

  (p.secAFill || []).forEach((item, idx) => gradeSubjectiveItem(`fill_${idx}`, item, 1));
  (p.secB || []).forEach((item, idx) => gradeSubjectiveItem(`secb_${idx}`, item, 2));
  (p.secC || []).forEach((item, idx) => gradeSubjectiveItem(`secc_${idx}`, item, 3));
  (p.secD || []).forEach((item, idx) => gradeSubjectiveItem(`secd_${idx}`, item, 5));
  (p.secE || []).forEach((item, idx) => gradeSubjectiveItem(`sece_${idx}`, item, 4));
  (p.secF || []).forEach((item, idx) => gradeSubjectiveItem(`secf_${idx}`, item, 3));

  const totalEarned = Math.round((objectiveEarned + subjectiveEarned) * 10) / 10;
  const totalMax = objectiveMax + subjectiveMax;
  const timeSpentSec = Math.max(1, annualPaperState.examTotalSec - annualPaperState.examRemainingSec);

  return {
    totalEarned,
    totalMax,
    objectiveEarned,
    objectiveMax,
    subjectiveEarned: Math.round(subjectiveEarned * 10) / 10,
    subjectiveMax,
    totalAttempted,
    totalQuestionsCount,
    timeSpentSec,
    chapters: Object.values(chMap).filter(c => c.max > 0).sort((a, b) => a.num - b.num)
  };
}

function submitExamSimulation(autoExpired = false) {
  stopExamTimerInterval();
  annualPaperState.examTimerActive = false;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = true;
  annualPaperState.showAllAnswers = true;
  annualPaperState.diagnosticReport = computeAnnualExamDiagnostics();
  renderAnnualPaperStudio();
  const rep = annualPaperState.diagnosticReport;
  showToast(autoExpired
    ? `⏰ Time's up! Paper auto-submitted — Score: ${rep ? rep.totalEarned : 0}/60`
    : `✓ Exam Evaluated! Estimated Score: ${rep ? rep.totalEarned : 0} / ${rep ? rep.totalMax : 60}`);
}

function openAnnualPaperStudio(subjectId = 'SCIENCE') {
  let targetSub = 'SCIENCE';
  if (subjectId === 'MATH' && window.MATH_ANNUAL_BLUEPRINT) targetSub = 'MATH';
  else if (subjectId === 'SSC' && window.SSC_ANNUAL_BLUEPRINT) targetSub = 'SSC';

  const changedSub = annualPaperState.subjectId !== targetSub;
  annualPaperState.subjectId = targetSub;
  annualPaperState.view = 'annual';
  if (changedSub || !annualPaperState.paper) {
    stopExamTimerInterval();
    annualPaperState.setMode = 'A';
    annualPaperState.examTimerActive = false;
    annualPaperState.examPaused = false;
    annualPaperState.examSubmitted = false;
    annualPaperState.diagnosticReport = null;
    annualPaperState.mcqPicks = {};
    annualPaperState.revealedIds = {};
    annualPaperState.hintIds = {};
    annualPaperState.solveOpenIds = {};
    annualPaperState.checkResults = {};
    annualPaperState.paper = buildAnnualPaper(targetSub, 'A');
  }
  switchTab('papers');
  setPaperStudioView('annual');
}

function setPaperStudioView(viewMode) {
  annualPaperState.view = viewMode === 'midterm' ? 'midterm' : 'annual';
  const btnSci = document.getElementById('paperTabBtnScience');
  const btnMath = document.getElementById('paperTabBtnMath');
  const btnSsc = document.getElementById('paperTabBtnSsc');
  const btnMidterm = document.getElementById('paperTabBtnMidterm');
  const annualWrap = document.getElementById('annualPaperStudioWrap');
  const midtermWrap = document.getElementById('samplePapersContainer');

  if (btnSci) btnSci.classList.toggle('active', annualPaperState.view === 'annual' && annualPaperState.subjectId === 'SCIENCE');
  if (btnMath) btnMath.classList.toggle('active', annualPaperState.view === 'annual' && annualPaperState.subjectId === 'MATH');
  if (btnSsc) btnSsc.classList.toggle('active', annualPaperState.view === 'annual' && annualPaperState.subjectId === 'SSC');
  if (btnMidterm) btnMidterm.classList.toggle('active', annualPaperState.view === 'midterm');
  if (annualWrap) annualWrap.style.display = annualPaperState.view === 'annual' ? 'block' : 'none';
  if (midtermWrap) midtermWrap.style.display = annualPaperState.view === 'midterm' ? 'grid' : 'none';

  if (annualPaperState.view === 'annual') {
    renderAnnualPaperStudio();
  }
}

function toggleReplicaPaperStyle() {
  annualPaperState.replicaMode = !annualPaperState.replicaMode;
  renderAnnualPaperStudio();
}

function pickShuffled(arr, count) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function buildAnnualPaper(subjectId = 'SCIENCE', setMode = 'A') {
  const bp = getAnnualBlueprint(subjectId);
  if (!bp) return null;

  const isMath = subjectId === 'MATH';
  const isSsc = subjectId === 'SSC';
  const mcqCount = isMath ? 8 : (isSsc ? 10 : 15);
  const fillCount = isMath ? 6 : 0;
  const secBCount = isMath ? 4 : 5;
  const secCCount = isMath ? 3 : (isSsc ? 4 : 5);
  const secDCount = (isMath || isSsc) ? 3 : 2;
  const secECount = isMath ? 3 : 2;
  const secFCount = isSsc ? 1 : 0;

  if (setMode === 'A' || setMode === 'B') {
    const filterSet = (pool, cnt) => {
      if (!pool || !cnt) return [];
      const exact = pool.filter(x => x.set === setMode);
      return (exact.length >= cnt ? exact : pool).slice(0, cnt);
    };
    return {
      setLabel: setMode === 'A' ? 'Set A — Official School Blueprint' : 'Set B — High-Yield Competency Blueprint',
      secAMcq: filterSet(bp.sectionAMcqPool, mcqCount),
      secAAr: filterSet(bp.sectionAAssertionPool, 2),
      secAFill: filterSet(bp.sectionAFillPool || [], fillCount),
      secB: filterSet(bp.sectionBPool, secBCount),
      secC: filterSet(bp.sectionCPool, secCCount),
      secD: filterSet(bp.sectionDPool, secDCount),
      secE: filterSet(bp.sectionEPool, secECount),
      secF: filterSet(bp.sectionFPool || [], secFCount)
    };
  }

  // RANDOM REPRODUCED SET
  if (isMath || isSsc) {
    return {
      setLabel: `Reproduced Annual Paper #${annualPaperState.reproNumber} (Randomized 60M Mix)`,
      secAMcq: pickShuffled(bp.sectionAMcqPool, mcqCount),
      secAAr: pickShuffled(bp.sectionAAssertionPool, 2),
      secAFill: pickShuffled(bp.sectionAFillPool || [], fillCount),
      secB: pickShuffled(bp.sectionBPool, secBCount),
      secC: pickShuffled(bp.sectionCPool, secCCount),
      secD: pickShuffled(bp.sectionDPool, secDCount),
      secE: pickShuffled(bp.sectionEPool, secECount),
      secF: pickShuffled(bp.sectionFPool || [], secFCount)
    };
  }

  const matchItems = bp.sectionCPool.filter(x => x.type === 'match');
  const nonMatchC = bp.sectionCPool.filter(x => x.type !== 'match');
  const withChoiceB = bp.sectionBPool.filter(x => x.choiceA && x.choiceB);
  const singleB = bp.sectionBPool.filter(x => !x.choiceA);
  const pickedWithChoiceB = pickShuffled(withChoiceB, 2);
  const pickedSingleB = pickShuffled(singleB, 3);
  const orderedSecB = [
    pickedSingleB[0],
    pickedWithChoiceB[0],
    pickedSingleB[1],
    pickedWithChoiceB[1],
    pickedSingleB[2]
  ].filter(Boolean);

  const dCompulsory = bp.sectionDPool.filter(x => !x.choiceA);
  const dChoice = bp.sectionDPool.filter(x => x.choiceA && x.choiceB);
  const eCompulsory = bp.sectionEPool.filter(x => !x.choiceA);
  const eChoice = bp.sectionEPool.filter(x => x.choiceA && x.choiceB);

  return {
    setLabel: `Reproduced Annual Paper #${annualPaperState.reproNumber} (Randomized 60M Mix)`,
    secAMcq: pickShuffled(bp.sectionAMcqPool, 15),
    secAAr: pickShuffled(bp.sectionAAssertionPool, 2),
    secAFill: [],
    secB: orderedSecB,
    secC: [pickShuffled(matchItems, 1)[0], ...pickShuffled(nonMatchC, 4)].filter(Boolean),
    secD: [pickShuffled(dCompulsory, 1)[0], pickShuffled(dChoice, 1)[0]].filter(Boolean),
    secE: [pickShuffled(eCompulsory, 1)[0], pickShuffled(eChoice, 1)[0]].filter(Boolean),
    secF: []
  };
}

function selectAnnualPaperSet(setMode) {
  stopExamTimerInterval();
  annualPaperState.setMode = setMode;
  annualPaperState.examTimerActive = false;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = false;
  annualPaperState.diagnosticReport = null;
  annualPaperState.mcqPicks = {};
  annualPaperState.revealedIds = {};
  annualPaperState.hintIds = {};
  annualPaperState.checkResults = {};
  annualPaperState.paper = buildAnnualPaper(annualPaperState.subjectId, setMode);
  renderAnnualPaperStudio();
}

function reproduceAnnualPaper() {
  stopExamTimerInterval();
  annualPaperState.reproNumber += 1;
  annualPaperState.setMode = 'RANDOM';
  annualPaperState.examTimerActive = false;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = false;
  annualPaperState.diagnosticReport = null;
  annualPaperState.mcqPicks = {};
  annualPaperState.revealedIds = {};
  annualPaperState.hintIds = {};
  annualPaperState.checkResults = {};
  annualPaperState.paper = buildAnnualPaper(annualPaperState.subjectId, 'RANDOM');
  renderAnnualPaperStudio();
  const bp = getAnnualBlueprint(annualPaperState.subjectId);
  showToast(`Reproduced fresh ${bp ? bp.totalQuestions : 31}-question Annual Paper #${annualPaperState.reproNumber} (60 Marks)`);
}

function toggleAnnualAnswerKey() {
  if (annualPaperState.examTimerActive) {
    showToast('Answer key is locked during Timed Exam Mode — click Submit & Grade to unlock.');
    return;
  }
  annualPaperState.showAllAnswers = !annualPaperState.showAllAnswers;
  renderAnnualPaperStudio();
}

function toggleSingleAnnualAnswer(qId) {
  if (annualPaperState.examTimerActive) return;
  annualPaperState.revealedIds[qId] = !annualPaperState.revealedIds[qId];
  renderAnnualPaperStudio();
}

function toggleAnnualHint(qId) {
  if (annualPaperState.examTimerActive) return;
  annualPaperState.hintIds[qId] = !annualPaperState.hintIds[qId];
  renderAnnualPaperStudio();
}

function toggleAnnualSolvePad(qId) {
  annualPaperState.solveOpenIds[qId] = !annualPaperState.solveOpenIds[qId];
  renderAnnualPaperStudio();
}

function onAnnualDraftInput(qId, val) {
  annualPaperState.userDrafts[qId] = val;
}

function extractKeyTermsFromAnswer(ansText, explicitKeywords) {
  if (Array.isArray(explicitKeywords) && explicitKeywords.length > 0) {
    return explicitKeywords.map(k => String(k).trim()).filter(Boolean);
  }
  const stop = new Set(['the','and','for','that','with','from','this','are','was','were','have','has','had','not','but','can','will','into','both','each','more','than','only','also','when','where','which','while','option','mark','marks','step','answer','since','because','therefore','between','using']);
  const nums = (ansText.match(/\b\d+(?:\.\d+)?\b/g) || []).filter(n => n !== '1' && n !== '2' && n !== '0');
  const words = (ansText.match(/[A-Za-z]{5,}/g) || [])
    .map(w => w.toLowerCase())
    .filter(w => !stop.has(w));
  return [...new Set([...nums.slice(0, 3), ...words.slice(0, 5)])].slice(0, 6);
}

function checkSubjectiveDraft(qId, expectedAns, explicitKeywords) {
  const raw = (annualPaperState.userDrafts[qId] || '').trim();
  if (!raw) {
    showToast('Write a short answer or key steps first to check your work.');
    return;
  }
  const lower = raw.toLowerCase();
  const keys = extractKeyTermsFromAnswer(expectedAns, explicitKeywords);
  const matched = keys.filter(k => lower.includes(k.toLowerCase()));
  const missed = keys.filter(k => !lower.includes(k.toLowerCase()));
  annualPaperState.checkResults[qId] = {
    matched,
    missed,
    total: keys.length
  };
  renderAnnualPaperStudio();
}

function synthesizeHintForItem(item, subjectId, chNum) {
  if (item.hint) return item.hint;
  if (item.choiceA && item.choiceA.hint) return item.choiceA.hint;
  const sub = SUBJECTS.find(s => s.id === subjectId);
  const chTitle = sub && sub.chapters[chNum - 1] ? sub.chapters[chNum - 1] : `Chapter ${chNum}`;
  const rawAns = item.ans || (item.choiceA ? item.choiceA.ans : '');
  const terms = extractKeyTermsFromAnswer(rawAns, item.keywords);
  if (terms.length > 0) {
    return `Recall ${chTitle} (Ch ${chNum}) — structure your answer around key terms/values such as: ${terms.slice(0, 3).join(', ')}.`;
  }
  return `Review the core principle in ${chTitle} (Chapter ${chNum}) before writing your step-by-step answer.`;
}

function openChapterPdfFromPaper(subjectId, chNum) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return;
  const chTitle = sub.chapters[chNum - 1] || `Chapter ${chNum}`;
  openReader(sub.filePattern(chNum), `${sub.name} — Chapter ${chNum}: ${chTitle}`, sub.code, true);
  showToast(`Opened Ch ${chNum} in Side-by-Side Split View — solve on the right while reading!`);
}

function answerAnnualMcq(qKey, optIdx) {
  annualPaperState.mcqPicks[qKey] = optIdx;
  renderAnnualPaperStudio();
}

function renderAnnualDiagramSvg(type) {
  if (type === 'india_map_skill') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 500 280" width="100%" style="max-width:480px; display:block; margin:0 auto;">
          <rect x="8" y="8" width="484" height="264" rx="10" fill="rgba(56,189,248,0.06)" stroke="currentColor" stroke-width="1.4"/>
          <text x="250" y="28" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">OUTLINE MAP OF INDIA — MAP SKILL (Q27)</text>
          <!-- Stylized Schematic Outline of India -->
          <path d="M195,42 L235,44 L245,68 L275,92 L325,102 L365,88 L385,105 L355,135 L315,138 L295,165 L255,210 L232,254 L212,248 L195,195 L175,155 L142,148 L132,126 L162,112 L168,82 Z" fill="rgba(16,185,129,0.12)" stroke="currentColor" stroke-width="1.8"/>
          <!-- 82°30'E Standard Meridian dashed line -->
          <line x1="258" y1="45" x2="258" y2="255" stroke="currentColor" stroke-width="1.1" stroke-dasharray="4,3" opacity="0.55"/>
          <text x="264" y="58" font-size="9.5" fill="currentColor" opacity="0.75">82°30' E (IST)</text>
          <!-- Marker (A): Indus-Sarasvati / Punjab-Haryana region -->
          <circle cx="182" cy="86" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
          <line x1="182" y1="86" x2="108" y2="74" stroke="#ef4444" stroke-width="1.4"/>
          <rect x="26" y="60" width="82" height="24" rx="4" fill="rgba(239,68,68,0.14)" stroke="#ef4444" stroke-width="1.2"/>
          <text x="67" y="76" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Site (A)</text>
          <!-- Marker (B): West Coast / Arabian Sea / Lothal -->
          <circle cx="135" cy="185" r="6" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5"/>
          <rect x="30" y="173" width="94" height="24" rx="4" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" stroke-width="1.2"/>
          <text x="77" y="189" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Region (B)</text>
          <!-- Marker (C): Gujarat Rann of Kutch / East Coast -->
          <circle cx="152" cy="134" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
          <line x1="152" y1="134" x2="108" y2="128" stroke="#f59e0b" stroke-width="1.4"/>
          <rect x="26" y="116" width="82" height="24" rx="4" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="67" y="132" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Place (C)</text>
          <!-- Compass Rose -->
          <g transform="translate(440, 62)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="currentColor" stroke-width="1.2"/>
            <polygon points="0,-15 -4,0 4,0" fill="currentColor"/>
            <text x="0" y="-20" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">N</text>
          </g>
          <text x="365" y="205" text-anchor="middle" font-size="10.5" font-style="italic" fill="currentColor" opacity="0.75">Bay of Bengal</text>
          <text x="112" y="232" text-anchor="middle" font-size="10.5" font-style="italic" fill="currentColor" opacity="0.75">Arabian Sea</text>
        </svg>
      </div>`;
  }
  if (type === 'supercells_row') {
    const cells = [240, 315, 198, 412, 390, 501, 480];
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 500 54" width="100%" style="max-width:480px; display:block; margin:0 auto;">
          ${cells.map((v, i) => `
            <rect x="${12 + i * 68}" y="8" width="64" height="38" rx="4" fill="rgba(59,130,246,0.08)" stroke="currentColor" stroke-width="1.4"/>
            <text x="${44 + i * 68}" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">${v}</text>
          `).join('')}
        </svg>
      </div>`;
  }
  if (type === 'l_shape_area') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 420 130" width="100%" style="max-width:420px; display:block; margin:0 auto;">
          <rect x="40" y="15" width="180" height="45" fill="rgba(59,130,246,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <text x="130" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Rectangle A (12 m × 4 m)</text>
          <rect x="40" y="60" width="120" height="55" fill="rgba(16,185,129,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <text x="100" y="92" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Rect B (8 m × 5 m)</text>
        </svg>
      </div>`;
  }
  if (type === 'clock_angles') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 380 120" width="100%" style="max-width:380px; display:block; margin:0 auto;">
          <circle cx="110" cy="60" r="46" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <line x1="110" y1="60" x2="110" y2="24" stroke="currentColor" stroke-width="2"/>
          <line x1="110" y1="60" x2="138" y2="44" stroke="#ef4444" stroke-width="2.5"/>
          <text x="110" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">2:00 PM</text>

          <circle cx="270" cy="60" r="46" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <line x1="270" y1="60" x2="270" y2="24" stroke="currentColor" stroke-width="2"/>
          <line x1="270" y1="60" x2="286" y2="88" stroke="#ef4444" stroke-width="2.5"/>
          <text x="270" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">5:00 PM</text>
        </svg>
      </div>`;
  }
  if (type === 'books_bargraph') {
    const bars = [['Anu', 6], ['Riya', 8], ['Mohit', 4], ['Sameer', 10], ['Kavya', 7]];
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 460 140" width="100%" style="max-width:460px; display:block; margin:0 auto;">
          <line x1="50" y1="15" x2="50" y2="115" stroke="currentColor" stroke-width="1.5"/>
          <line x1="50" y1="115" x2="420" y2="115" stroke="currentColor" stroke-width="1.5"/>
          ${bars.map(([name, val], i) => {
            const h = val * 9;
            const x = 75 + i * 68;
            const y = 115 - h;
            return `
              <rect x="${x}" y="${y}" width="36" height="${h}" rx="3" fill="rgba(59,130,246,0.35)" stroke="currentColor" stroke-width="1.2"/>
              <text x="${x + 18}" y="${y - 4}" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${val}</text>
              <text x="${x + 18}" y="130" text-anchor="middle" font-size="11" fill="currentColor">${name}</text>
            `;
          }).join('')}
        </svg>
      </div>`;
  }
  if (type === 'seeds_venation') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 520 145" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <rect x="8" y="8" width="240" height="128" rx="8" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <text x="128" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Fig. A — Opened Gram Seed</text>
          <ellipse cx="98" cy="76" rx="34" ry="24" fill="rgba(56,189,248,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <ellipse cx="158" cy="76" rx="34" ry="24" fill="rgba(56,189,248,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <path d="M128 54 C128 42, 136 42, 134 54 L128 96" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="128" y="122" text-anchor="middle" font-size="11" fill="currentColor">Two Cotyledons + Embryo Axis</text>

          <rect x="270" y="8" width="240" height="128" rx="8" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <text x="390" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Fig. B — Maize Seed (L.S.)</text>
          <path d="M355 42 L425 42 L412 104 L368 104 Z" fill="rgba(16,185,129,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <line x1="362" y1="74" x2="418" y2="74" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3,2"/>
          <text x="390" y="62" text-anchor="middle" font-size="10.5" fill="currentColor">Endosperm</text>
          <text x="390" y="92" text-anchor="middle" font-size="10.5" fill="currentColor">Single Cotyledon</text>
          <text x="390" y="122" text-anchor="middle" font-size="11" fill="currentColor">Single Cotyledon (Scutellum)</text>
        </svg>
      </div>`;
  }
  if (type === 'motion_balls') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 520 130" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <rect x="10" y="10" width="500" height="110" rx="8" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <line x1="120" y1="10" x2="120" y2="120" stroke="currentColor" stroke-width="1.2"/>
          <line x1="10" y1="65" x2="510" y2="65" stroke="currentColor" stroke-width="1.2"/>
          <text x="65" y="42" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">10:00 AM</text>
          <text x="65" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">10:15 AM</text>
          <!-- Track 1 -->
          <line x1="150" y1="44" x2="475" y2="44" stroke="currentColor" stroke-width="1.5"/>
          <text x="150" y="58" font-size="10" fill="currentColor">X (0 m)</text>
          <text x="465" y="58" font-size="10" fill="currentColor">Z (20 m)</text>
          <circle cx="210" cy="34" r="10" fill="rgba(59,130,246,0.2)" stroke="currentColor" stroke-width="1.5"/>
          <text x="210" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">P</text>
          <circle cx="290" cy="34" r="10" fill="rgba(16,185,129,0.2)" stroke="currentColor" stroke-width="1.5"/>
          <text x="290" y="38" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Q</text>
          <!-- Track 2 -->
          <line x1="150" y1="98" x2="475" y2="98" stroke="currentColor" stroke-width="1.5"/>
          <text x="150" y="112" font-size="10" fill="currentColor">X (0 m)</text>
          <text x="465" y="112" font-size="10" fill="currentColor">Z (20 m)</text>
          <circle cx="210" cy="88" r="10" fill="rgba(59,130,246,0.2)" stroke="currentColor" stroke-width="1.5"/>
          <text x="210" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">P</text>
          <circle cx="435" cy="88" r="10" fill="rgba(16,185,129,0.2)" stroke="currentColor" stroke-width="1.5"/>
          <text x="435" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Q</text>
        </svg>
      </div>`;
  }
  if (type === 'thermometer_scale') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 520 105" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <rect x="20" y="18" width="480" height="54" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <rect x="35" y="38" width="375" height="10" rx="4" fill="rgba(239,68,68,0.45)"/>
          ${Array.from({ length: 41 }, (_, i) => {
            const x = 70 + i * 10;
            const isMajor = i % 10 === 0;
            const isMid = i % 5 === 0;
            const h = isMajor ? 22 : (isMid ? 16 : 10);
            const val = -10 + i;
            return `
              <line x1="${x}" y1="18" x2="${x}" y2="${18 + h}" stroke="currentColor" stroke-width="${isMajor ? 1.8 : 1}"/>
              ${isMajor ? `<text x="${x}" y="64" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${val}°C</text>` : ''}
            `;
          }).join('')}
          <line x1="410" y1="4" x2="410" y2="16" stroke="#ef4444" stroke-width="2.2"/>
          <polygon points="405,12 415,12 410,18" fill="#ef4444"/>
          <text x="410" y="94" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor">↑ Reading at 4th division past 20 °C</text>
        </svg>
      </div>`;
  }
  if (type === 'frog_lifecycle') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 520 110" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <rect x="14" y="24" width="100" height="58" rx="10" fill="rgba(56,189,248,0.1)" stroke="currentColor" stroke-width="1.3"/>
          <text x="64" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor">Stage 1</text>
          <text x="64" y="68" text-anchor="middle" font-size="10.5" fill="currentColor">Eggs (Spawn)</text>
          <text x="126" y="56" text-anchor="middle" font-size="16" fill="currentColor">→</text>

          <rect x="142" y="24" width="104" height="58" rx="10" fill="rgba(56,189,248,0.1)" stroke="currentColor" stroke-width="1.3"/>
          <text x="194" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor">Stage 2</text>
          <text x="194" y="68" text-anchor="middle" font-size="10.5" fill="currentColor">Tadpole (Gills)</text>
          <text x="258" y="56" text-anchor="middle" font-size="16" fill="currentColor">→</text>

          <rect x="274" y="24" width="104" height="58" rx="10" fill="rgba(56,189,248,0.1)" stroke="currentColor" stroke-width="1.3"/>
          <text x="326" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor">Stage 3</text>
          <text x="326" y="68" text-anchor="middle" font-size="10.5" fill="currentColor">Froglet (Legs)</text>
          <text x="390" y="56" text-anchor="middle" font-size="16" fill="currentColor">→</text>

          <rect x="406" y="24" width="100" height="58" rx="10" fill="rgba(16,185,129,0.14)" stroke="currentColor" stroke-width="1.3"/>
          <text x="456" y="50" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor">Stage 4</text>
          <text x="456" y="68" text-anchor="middle" font-size="10.5" fill="currentColor">Adult Frog</text>
        </svg>
      </div>`;
  }
  if (type === 'saptarishi_polestar') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 520 125" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <rect x="10" y="8" width="500" height="108" rx="10" fill="rgba(15,23,42,0.35)" stroke="currentColor" stroke-width="1.3"/>
          <polyline points="60,82 110,68 155,74 205,64 215,95 275,92 280,58 205,64" fill="none" stroke="currentColor" stroke-width="1.4"/>
          ${[[60,82],[110,68],[155,74],[205,64],[215,95],[275,92],[280,58]].map(([cx,cy]) => `<circle cx="${cx}" cy="${cy}" r="4" fill="#38bdf8"/>`).join('')}
          <line x1="275" y1="92" x2="430" y2="28" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="5,4"/>
          <circle cx="430" cy="28" r="6.5" fill="#f59e0b"/>
          <text x="165" y="42" font-size="11.5" font-weight="700" fill="currentColor">Saptarishi (Ursa Major)</text>
          <text x="430" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">★ Star X (North)</text>
        </svg>
      </div>`;
  }
  if (type === 'magnet_poles') {
    return `
      <div class="paper-diagram-box">
        <svg viewBox="0 0 520 110" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <line x1="175" y1="8" x2="175" y2="44" stroke="currentColor" stroke-width="1.5"/>
          <rect x="105" y="44" width="140" height="32" rx="5" fill="rgba(59,130,246,0.15)" stroke="currentColor" stroke-width="1.5"/>
          <text x="125" y="65" font-size="12" font-weight="700" fill="currentColor">Y</text>
          <text x="175" y="65" text-anchor="middle" font-size="11" fill="currentColor">Magnet 2</text>
          <text x="225" y="65" font-size="12" font-weight="700" fill="currentColor">X</text>
          <text x="275" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="#ef4444">⇄ Repels</text>
          <rect x="310" y="44" width="140" height="32" rx="5" fill="rgba(239,68,68,0.15)" stroke="currentColor" stroke-width="1.5"/>
          <text x="330" y="65" font-size="12" font-weight="700" fill="#ef4444">N</text>
          <text x="380" y="65" text-anchor="middle" font-size="11" fill="currentColor">Magnet 1</text>
          <text x="430" y="65" font-size="12" font-weight="700" fill="currentColor">S</text>
        </svg>
      </div>`;
  }
  return '';
}

function renderAnnualPaperStudio() {
  const wrap = document.getElementById('annualPaperStudioWrap');
  const subId = annualPaperState.subjectId || 'SCIENCE';
  const bp = getAnnualBlueprint(subId);
  if (!wrap || !bp) return;

  const btnSci = document.getElementById('paperTabBtnScience');
  const btnMath = document.getElementById('paperTabBtnMath');
  const btnSsc = document.getElementById('paperTabBtnSsc');
  if (btnSci) btnSci.classList.toggle('active', annualPaperState.view === 'annual' && subId === 'SCIENCE');
  if (btnMath) btnMath.classList.toggle('active', annualPaperState.view === 'annual' && subId === 'MATH');
  if (btnSsc) btnSsc.classList.toggle('active', annualPaperState.view === 'annual' && subId === 'SSC');

  if (!annualPaperState.paper) {
    annualPaperState.paper = buildAnnualPaper(subId, annualPaperState.setMode);
  }
  const p = annualPaperState.paper;
  const subObj = SUBJECTS.find(s => s.id === subId);
  const syllabusPath = subObj && subObj.syllabus ? subObj.syllabus : 'CURRICULUM/SYLLABUS/Science_Curiosity_Syllabus.pdf';
  const isExamActive = Boolean(annualPaperState.examTimerActive);

  // Compute Section A interactive score
  const totalSecA = p.secAMcq.length + p.secAAr.length;
  let answeredCount = 0;
  let correctCount = 0;
  p.secAMcq.forEach((item, idx) => {
    const pick = annualPaperState.mcqPicks[`mcq_${idx}`];
    if (pick !== undefined) {
      answeredCount++;
      if (pick === item.correct) correctCount++;
    }
  });
  p.secAAr.forEach((item, idx) => {
    const pick = annualPaperState.mcqPicks[`ar_${idx}`];
    if (pick !== undefined) {
      answeredCount++;
      if (pick === item.correct) correctCount++;
    }
  });

  const arStandardOptions = [
    'A. Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
    'B. Both Assertion (A) and Reason (R) are true, but Reason (R) is not the correct explanation of Assertion (A).',
    'C. Assertion (A) is true, but Reason (R) is false.',
    'D. Assertion (A) is false, but Reason (R) is true.'
  ];

  // Interactive Coaching Bar per question (Hint + Solve & Auto-Check + Marking Scheme)
  const renderCoachingBlock = (qKey, item, ansText, allowSolvePad = false) => {
    const ansOpen = !isExamActive && (annualPaperState.showAllAnswers || Boolean(annualPaperState.revealedIds[qKey]));
    const hintOpen = !isExamActive && Boolean(annualPaperState.hintIds[qKey]);
    const solveOpen = isExamActive ? allowSolvePad : Boolean(annualPaperState.solveOpenIds[qKey]);
    const hintText = synthesizeHintForItem(item, subId, item.ch);
    const draftVal = annualPaperState.userDrafts[qKey] || '';
    const checkRes = annualPaperState.checkResults[qKey];
    const keywordsJson = escapeJs(JSON.stringify(item.keywords || []));

    return `
      <div class="paper-ans-control">
        ${isExamActive ? '' : `
          <div class="coaching-action-strip">
            <button class="btn-coaching-pill hint" onclick="toggleAnnualHint('${qKey}')">
              💡 ${hintOpen ? 'Hide Hint' : 'Hint'}
            </button>
            ${allowSolvePad ? `
              <button class="btn-coaching-pill solve" onclick="toggleAnnualSolvePad('${qKey}')">
                ✍️ ${solveOpen ? 'Hide Scratchpad' : 'Solve & Auto-Check'}
              </button>
            ` : ''}
            <button class="btn-coaching-pill scheme" onclick="toggleSingleAnnualAnswer('${qKey}')">
              ${ansOpen ? '▾ Hide Marking Scheme' : '▸ Marking Scheme'}
            </button>
          </div>
        `}

        ${hintOpen ? `<div class="paper-hint-box"><strong>💡 Socratic Hint:</strong> ${escapeHtml(hintText)}</div>` : ''}

        ${solveOpen ? `
          <div class="paper-solve-box">
            <textarea class="paper-solve-input" rows="2" placeholder="${isExamActive ? 'Exam Mode: Write your answer or steps here (evaluated upon submission)...' : 'Write or Apple-Pencil Scribble your steps / key answer here...'}" oninput="onAnnualDraftInput('${qKey}', this.value)">${escapeHtml(draftVal)}</textarea>
            ${isExamActive ? '' : `
              <div class="paper-solve-footer">
                <button class="btn-card highlight" onclick="checkSubjectiveDraft('${qKey}', '${escapeJs(ansText)}', JSON.parse('${keywordsJson}'))">
                  ✓ Check Key Points
                </button>
                ${checkRes ? `
                  <span class="solve-feedback-chip ${checkRes.matched.length > 0 ? 'ok' : 'warn'}">
                    ${checkRes.earnedMarks !== undefined ? `<strong>[${checkRes.earnedMarks}/${checkRes.maxMarks}M]</strong> ` : ''}
                    ${checkRes.matched.length > 0 ? `✓ Matched key points: ${escapeHtml(checkRes.matched.join(', '))}` : 'Keep going — check the hint or include exact values/terms'}
                    ${checkRes.missed.length > 0 ? ` · Can also include: ${escapeHtml(checkRes.missed.slice(0, 3).join(', '))}` : ''}
                  </span>
                ` : ''}
              </div>
            `}
          </div>
        ` : ''}

        ${ansOpen ? `<div class="paper-marking-box"><strong>Official Marking Scheme:</strong>\n${escapeHtml(ansText)}</div>` : ''}
      </div>
    `;
  };

  const renderChBadge = (chNum, marks) => `
    <div class="exam-q-meta">
      <button class="exam-ch-tag clickable" onclick="openChapterPdfFromPaper('${subId}', ${chNum})" title="Dock NCERT Chapter ${chNum} PDF in Side-by-Side Split View">
        📖 Ch ${chNum}
      </button>
      <span class="exam-mark-badge">${marks}</span>
    </div>
  `;

  // Question numbering offsets
  const arStart = p.secAMcq.length + 1;
  const fillStart = arStart + p.secAAr.length;
  const secBStart = fillStart + (p.secAFill ? p.secAFill.length : 0);
  const secCStart = secBStart + p.secB.length;
  const secDStart = secCStart + p.secC.length;
  const secEStart = secDStart + p.secD.length;
  const secFStart = secEStart + p.secE.length;
  const hasSecF = Boolean(p.secF && p.secF.length);

  const secATotalMarks = (secBStart - 1);
  const secBTotalMarks = p.secB.length * 2;
  const secCTotalMarks = p.secC.length * 3;
  const secDTotalMarks = p.secD.length * 5;
  const secETotalMarks = p.secE.length * 4;
  const secFTotalMarks = hasSecF ? p.secF.length * 3 : 0;

  const schoolCrestSvg = `
    <svg class="school-crest-svg" width="54" height="54" viewBox="0 0 64 64">
      <polygon points="32,4 60,32 32,60 4,32" fill="none" stroke="#8b2635" stroke-width="3"/>
      <polygon points="32,12 42,22 32,32 22,22" fill="#8b2635"/>
      <polygon points="22,22 32,32 22,42 12,32" fill="#8b2635"/>
      <polygon points="42,22 52,32 42,42 32,32" fill="#8b2635"/>
      <polygon points="32,32 42,42 32,52 22,42" fill="#8b2635"/>
    </svg>
  `;

  // Live Exam Timer Bar OR Post-Exam Diagnostic Readiness Report
  const examSimulationBannerHtml = isExamActive ? `
    <div class="exam-live-timer-banner">
      <div class="exam-timer-left">
        <span class="exam-live-pulse"></span>
        <div>
          <div class="exam-timer-title">LIVE 2h 30m EXAM SIMULATION — ${escapeHtml(bp.subject)}</div>
          <div class="exam-timer-sub">Hints &amp; marking schemes are locked. Select MCQs and write answers in the scratchpads below.</div>
        </div>
      </div>
      <div class="exam-timer-right">
        <span class="exam-clock-pill" id="liveExamClockDisplay">${formatExamClock(annualPaperState.examRemainingSec)}</span>
        <button class="btn-suave" onclick="togglePauseExamSimulation()">
          ${annualPaperState.examPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button class="btn-suave primary" onclick="submitExamSimulation(false)">
          ✓ Submit &amp; Grade (60M)
        </button>
        <button class="btn-suave" onclick="cancelExamSimulation()">
          ✕ Exit
        </button>
      </div>
    </div>
  ` : '';

  const rep = annualPaperState.diagnosticReport;
  const diagnosticReportHtml = (!isExamActive && annualPaperState.examSubmitted && rep) ? `
    <div class="exam-diagnostic-card">
      <div class="diag-header-row">
        <div>
          <div class="diag-kicker">📊 ANNUAL EXAM READINESS REPORT · ${escapeHtml(bp.subject)}</div>
          <h3 class="diag-title">Estimated Score: <strong>${rep.totalEarned} / ${rep.totalMax} Marks</strong> (${Math.round((rep.totalEarned / rep.totalMax) * 100)}%)</h3>
          <div class="diag-meta">
            Section A (MCQs &amp; AR): <strong>${rep.objectiveEarned}/${rep.objectiveMax}M</strong> ·
            Subjective Keyword Evaluation: <strong>${rep.subjectiveEarned}/${rep.subjectiveMax}M</strong> ·
            Attempted: <strong>${rep.totalAttempted}/${rep.totalQuestionsCount} Qs</strong> ·
            Time Spent: <strong>${formatExamClock(rep.timeSpentSec)}</strong>
          </div>
        </div>
        <button class="btn-suave" onclick="annualPaperState.examSubmitted = false; renderAnnualPaperStudio();">Dismiss Report ✕</button>
      </div>
      <div class="diag-chapter-grid">
        ${rep.chapters.map(c => {
          const pct = c.max ? Math.round((c.earned / c.max) * 100) : 0;
          const statusCls = pct >= 75 ? 'strong' : (pct >= 45 ? 'moderate' : 'needs-focus');
          return `
            <div class="diag-ch-item ${statusCls}">
              <div class="diag-ch-top">
                <span class="diag-ch-name">Ch ${c.num}: ${escapeHtml(c.title)}</span>
                <span class="diag-ch-score">${c.earned}/${c.max}M (${pct}%)</span>
              </div>
              <div class="diag-ch-bar"><div class="diag-ch-fill" style="width:${pct}%"></div></div>
              <div class="diag-ch-actions">
                <span>${pct >= 75 ? '✓ Exam Ready' : (pct >= 45 ? '⚡ Good — Review Key Terms' : '🎯 Priority Revision')}</span>
                <button class="link-btn-minimal" onclick="openChapterPdfFromPaper('${subId}', ${c.num})">📖 Split-View Ch ${c.num} ›</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  wrap.innerHTML = `
    <!-- Top Studio Control Bar -->
    <div class="annual-studio-toolbar">
      <div class="annual-studio-left">
        <div class="mode-seg-pill">
          <button class="mode-seg-btn ${annualPaperState.setMode === 'A' ? 'active' : ''}" onclick="selectAnnualPaperSet('A')">Set A</button>
          <button class="mode-seg-btn ${annualPaperState.setMode === 'B' ? 'active' : ''}" onclick="selectAnnualPaperSet('B')">Set B</button>
        </div>
        <button class="btn-suave gemini-btn" onclick="reproduceAnnualPaper()" title="Dynamically reproduce a fresh 60-mark paper">
          ↻ Reproduce New Paper
        </button>
        ${isExamActive ? `
          <button class="btn-suave primary" onclick="submitExamSimulation(false)">
            ✓ Submit &amp; Grade Exam
          </button>
        ` : `
          <button class="btn-suave ai-btn" onclick="startExamSimulation()" title="Start 2h 30m timed exam simulation with locked hints and post-exam readiness report">
            ⏱️ Start 2h 30m Exam
          </button>
        `}
        <button class="btn-suave ${annualPaperState.replicaMode ? 'primary' : ''}" onclick="toggleReplicaPaperStyle()" title="Switch between Dark Studio View and Exact Printed School Paper Replica">
          ${annualPaperState.replicaMode ? '📄 School Replica (ON)' : '📄 School Paper Replica'}
        </button>
      </div>

      <div class="annual-studio-right">
        <span class="annual-score-pill">${isExamActive ? `Answered: <strong>${answeredCount}/${totalSecA}</strong>` : `MCQs: <strong>${correctCount}/${totalSecA}</strong>`}</span>
        ${isExamActive ? '' : `
          <button class="btn-suave ${annualPaperState.showAllAnswers ? 'primary' : ''}" onclick="toggleAnnualAnswerKey()">
            ${annualPaperState.showAllAnswers ? '✓ All Answers Shown' : '👁️ Full Answer Key'}
          </button>
        `}
        <button class="btn-suave" onclick="openReader('${syllabusPath}', '${escapeJs(bp.subject)} Official Syllabus', 'SYLLABUS', true)">
          ◫ Split-View Syllabus
        </button>
        <button class="btn-suave" onclick="printAnnualPaper()">
          🖨️ Print / Save PDF
        </button>
      </div>
    </div>

    ${examSimulationBannerHtml}
    ${diagnosticReportHtml}

    <!-- Syllabus & Blueprint Alignment Audit Strip -->
    <div class="annual-syllabus-strip">
      <div class="syllabus-strip-row">
        <span class="syllabus-badge-ok">✓ Annual Exam Syllabus (${bp.assessedChapters.length} Chapters = 60M):</span>
        ${bp.assessedChapters.map(c => `<button class="syllabus-ch-chip" onclick="openChapterPdfFromPaper('${subId}', ${c.num})" title="Open ${subId} Ch ${c.num} in Side-by-Side Split View">Ch ${c.num}: ${escapeHtml(c.title)}</button>`).join('')}
      </div>
      ${bp.excludedChapters && bp.excludedChapters.length ? `
        <div class="syllabus-strip-row excluded-row">
          <span class="syllabus-badge-muted">Excluded per School Final Exam Syllabus (CBE / SEA / Activity only):</span>
          ${bp.excludedChapters.map(c => `<span class="syllabus-ch-excluded" title="${escapeHtml(c.reason)}">Ch ${c.num}: ${escapeHtml(c.title)}</span>`).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Official Bloom Public School Examination Sheet -->
    <div class="official-exam-sheet ${annualPaperState.replicaMode ? 'replica-paper-mode' : ''}" id="printableAnnualPaperSheet">
      <div class="exam-sheet-header">
        <div class="exam-crest-header">
          ${schoolCrestSvg}
          <div>
            <div class="exam-school-title">${escapeHtml(bp.schoolName)}</div>
            <div class="exam-school-sub">${escapeHtml(bp.schoolAddress)}</div>
            <div class="exam-paper-banner">${escapeHtml(bp.examTitle)}</div>
            <div class="exam-subject-banner">${escapeHtml(bp.subject)} — ${escapeHtml(bp.classLabel)}</div>
          </div>
        </div>
        <div class="exam-set-pill">${escapeHtml(p.setLabel)}</div>
        <div class="exam-meta-bar">
          <span><strong>TIME ALLOWED:</strong> ${escapeHtml(bp.duration)}</span>
          <span><strong>TOTAL QUESTIONS:</strong> ${bp.totalQuestions} (Sections A–${hasSecF ? 'F' : 'E'})</span>
          <span><strong>MAX MARKS:</strong> ${bp.maxMarks}</span>
        </div>
      </div>

      <div class="exam-instructions-box">
        <div class="exam-inst-title">General Instructions:</div>
        <ul>
          ${bp.instructions.map(inst => `<li>${escapeHtml(inst)}</li>`).join('')}
        </ul>
      </div>

      <!-- ==================== SECTION A ==================== -->
      <div class="exam-section-block">
        <div class="exam-section-bar">
          <span>SECTION A — Objective Type Questions (Q1–Q${secBStart - 1})</span>
          <span>${secATotalMarks} × 1 = ${secATotalMarks} Marks</span>
        </div>

        ${p.secAMcq.map((item, idx) => {
          const qNum = idx + 1;
          const qKey = `mcq_${idx}`;
          const picked = annualPaperState.mcqPicks[qKey];
          const answered = picked !== undefined;
          return `
            <div class="exam-q-row">
              <div class="exam-q-num">Q${qNum}.</div>
              <div class="exam-q-body">
                <div class="exam-q-top">
                  <div class="exam-q-text">${escapeHtml(item.q).replace(/\n/g, '<br>')}</div>
                  ${renderChBadge(item.ch, 1)}
                </div>
                <div class="exam-mcq-grid">
                  ${item.options.map((opt, oi) => {
                    let cls = '';
                    if (answered) {
                      if (isExamActive) {
                        if (oi === picked) cls = 'picked-exam';
                      } else {
                        if (oi === item.correct) cls = 'correct';
                        else if (oi === picked) cls = 'wrong';
                      }
                    }
                    return `<button class="exam-mcq-opt ${cls}" onclick="answerAnnualMcq('${qKey}', ${oi})">${escapeHtml(opt)}</button>`;
                  }).join('')}
                </div>
                ${renderCoachingBlock(qKey, item, item.ans, false)}
              </div>
            </div>
          `;
        }).join('')}

        <!-- Assertion-Reason -->
        <div class="exam-ar-notice">
          <strong>Direction for Q${arStart} &amp; Q${arStart + 1} (Assertion–Reason):</strong> In the following two questions, a statement of Assertion (A) is followed by a statement of Reason (R). Choose the correct option below.
        </div>

        ${p.secAAr.map((item, idx) => {
          const qNum = arStart + idx;
          const qKey = `ar_${idx}`;
          const picked = annualPaperState.mcqPicks[qKey];
          const answered = picked !== undefined;
          return `
            <div class="exam-q-row">
              <div class="exam-q-num">Q${qNum}.</div>
              <div class="exam-q-body">
                <div class="exam-q-top">
                  <div class="exam-q-text">
                    <strong>Assertion (A):</strong> ${escapeHtml(item.assertion)}<br>
                    <strong>Reason (R):</strong> ${escapeHtml(item.reason)}
                  </div>
                  ${renderChBadge(item.ch, 1)}
                </div>
                <div class="exam-mcq-grid single-col">
                  ${arStandardOptions.map((opt, oi) => {
                    let cls = '';
                    if (answered) {
                      if (isExamActive) {
                        if (oi === picked) cls = 'picked-exam';
                      } else {
                        if (oi === item.correct) cls = 'correct';
                        else if (oi === picked) cls = 'wrong';
                      }
                    }
                    return `<button class="exam-mcq-opt ${cls}" onclick="answerAnnualMcq('${qKey}', ${oi})">${escapeHtml(opt)}</button>`;
                  }).join('')}
                </div>
                ${renderCoachingBlock(qKey, item, item.ans, false)}
              </div>
            </div>
          `;
        }).join('')}

        <!-- Fill in the blanks (for Mathematics Q11–Q16) -->
        ${p.secAFill && p.secAFill.length ? `
          <div class="exam-ar-notice">
            <strong>Fill in the blanks (Q${fillStart} to Q${secBStart - 1} · 1 Mark each):</strong>
          </div>
          ${p.secAFill.map((item, idx) => {
            const qNum = fillStart + idx;
            const qKey = `fill_${idx}`;
            const diagHtml = item.diagramType ? renderAnnualDiagramSvg(item.diagramType) : '';
            return `
              <div class="exam-q-row">
                <div class="exam-q-num">Q${qNum}.</div>
                <div class="exam-q-body">
                  <div class="exam-q-top">
                    <div class="exam-q-text">
                      ${diagHtml}
                      ${escapeHtml(item.q).replace(/\n/g, '<br>')}
                    </div>
                    ${renderChBadge(item.ch, 1)}
                  </div>
                  ${renderCoachingBlock(qKey, item, item.ans, true)}
                </div>
              </div>
            `;
          }).join('')}
        ` : ''}
      </div>

      <!-- ==================== SECTION B ==================== -->
      <div class="exam-section-block">
        <div class="exam-section-bar">
          <span>SECTION B — Very Short Answer Questions (Q${secBStart}–Q${secCStart - 1})</span>
          <span>${p.secB.length} × 2 = ${secBTotalMarks} Marks</span>
        </div>

        ${p.secB.map((item, idx) => {
          const qNum = secBStart + idx;
          const qKey = `secb_${idx}`;
          if (item.choiceA && item.choiceB) {
            const combinedAns = `Option A:\n${item.choiceA.ans}\n\nOR Option B:\n${item.choiceB.ans}`;
            return `
              <div class="exam-q-row">
                <div class="exam-q-num">Q${qNum}.</div>
                <div class="exam-q-body">
                  <div class="exam-q-top">
                    <div class="exam-q-text">
                      <span class="exam-choice-pill">Attempt either (I) or (II)</span><br>
                      <strong>(I)</strong> ${escapeHtml(item.choiceA.q).replace(/\n/g, '<br>')}
                      <div class="exam-or-divider">— OR —</div>
                      <strong>(II)</strong> ${escapeHtml(item.choiceB.q).replace(/\n/g, '<br>')}
                    </div>
                    ${renderChBadge(item.ch, 2)}
                  </div>
                  ${renderCoachingBlock(qKey, item, combinedAns, true)}
                </div>
              </div>
            `;
          }
          return `
            <div class="exam-q-row">
              <div class="exam-q-num">Q${qNum}.</div>
              <div class="exam-q-body">
                <div class="exam-q-top">
                  <div class="exam-q-text">${escapeHtml(item.q).replace(/\n/g, '<br>')}</div>
                  ${renderChBadge(item.ch, 2)}
                </div>
                ${renderCoachingBlock(qKey, item, item.ans, true)}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- ==================== SECTION C ==================== -->
      <div class="exam-section-block">
        <div class="exam-section-bar">
          <span>SECTION C — Short Answer Questions (Q${secCStart}–Q${secDStart - 1})</span>
          <span>${p.secC.length} × 3 = ${secCTotalMarks} Marks</span>
        </div>

        ${p.secC.map((item, idx) => {
          const qNum = secCStart + idx;
          const qKey = `secc_${idx}`;
          if (item.choiceA && item.choiceB) {
            const combinedAns = `Option (I):\n${item.choiceA.ans}\n\nOR Option (II):\n${item.choiceB.ans}`;
            return `
              <div class="exam-q-row">
                <div class="exam-q-num">Q${qNum}.</div>
                <div class="exam-q-body">
                  <div class="exam-q-top">
                    <div class="exam-q-text">
                      <span class="exam-choice-pill">Attempt either (I) or (II)</span><br>
                      <strong>(I)</strong> ${escapeHtml(item.choiceA.q).replace(/\n/g, '<br>')}
                      <div class="exam-or-divider">— OR —</div>
                      <strong>(II)</strong> ${escapeHtml(item.choiceB.q).replace(/\n/g, '<br>')}
                    </div>
                    ${renderChBadge(item.ch, 3)}
                  </div>
                  ${renderCoachingBlock(qKey, item, combinedAns, true)}
                </div>
              </div>
            `;
          }
          const matchTableHtml = item.type === 'match' ? `
            <table class="exam-match-table">
              <thead>
                <tr><th>Column A</th><th>Column B</th></tr>
              </thead>
              <tbody>
                ${item.colA.map((a, i) => `<tr><td>${escapeHtml(a)}</td><td>${escapeHtml(item.colB[i] || '')}</td></tr>`).join('')}
              </tbody>
            </table>
          ` : '';

          return `
            <div class="exam-q-row">
              <div class="exam-q-num">Q${qNum}.</div>
              <div class="exam-q-body">
                <div class="exam-q-top">
                  <div class="exam-q-text">${escapeHtml(item.q).replace(/\n/g, '<br>')}</div>
                  ${renderChBadge(item.ch, 3)}
                </div>
                ${matchTableHtml}
                ${renderCoachingBlock(qKey, item, item.ans, true)}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- ==================== SECTION D ==================== -->
      <div class="exam-section-block">
        <div class="exam-section-bar">
          <span>SECTION D — Long Answer Questions (Q${secDStart}–Q${secEStart - 1})</span>
          <span>${p.secD.length} × 5 = ${secDTotalMarks} Marks</span>
        </div>

        ${p.secD.map((item, idx) => {
          const qNum = secDStart + idx;
          const qKey = `secd_${idx}`;
          const diagHtml = item.diagramType ? renderAnnualDiagramSvg(item.diagramType) : '';

          if (item.choiceA && item.choiceB) {
            const combinedAns = `Option (I):\n${item.choiceA.ans}\n\nOR Option (II):\n${item.choiceB.ans}`;
            return `
              <div class="exam-q-row">
                <div class="exam-q-num">Q${qNum}.</div>
                <div class="exam-q-body">
                  <div class="exam-q-top">
                    <div class="exam-q-text">
                      <span class="exam-choice-pill">Attempt either (I) or (II)</span>
                      ${diagHtml}
                      <strong>(I)</strong> ${escapeHtml(item.choiceA.q).replace(/\n/g, '<br>')}
                      <div class="exam-or-divider">— OR —</div>
                      <strong>(II)</strong> ${escapeHtml(item.choiceB.q).replace(/\n/g, '<br>')}
                    </div>
                    ${renderChBadge(item.ch, 5)}
                  </div>
                  ${renderCoachingBlock(qKey, item, combinedAns, true)}
                </div>
              </div>
            `;
          }
          return `
            <div class="exam-q-row">
              <div class="exam-q-num">Q${qNum}.</div>
              <div class="exam-q-body">
                <div class="exam-q-top">
                  <div class="exam-q-text">
                    ${diagHtml}
                    ${escapeHtml(item.q).replace(/\n/g, '<br>')}
                  </div>
                  ${renderChBadge(item.ch, 5)}
                </div>
                ${renderCoachingBlock(qKey, item, item.ans, true)}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- ==================== SECTION E ==================== -->
      <div class="exam-section-block">
        <div class="exam-section-bar">
          <span>SECTION E — Case-Based / Source-Based Integrated Units (Q${secEStart}–Q${secEStart + p.secE.length - 1})</span>
          <span>${p.secE.length} × 4 = ${secETotalMarks} Marks</span>
        </div>

        ${p.secE.map((item, idx) => {
          const qNum = secEStart + idx;
          const qKey = `sece_${idx}`;
          const diagHtml = item.diagramType ? renderAnnualDiagramSvg(item.diagramType) : '';

          if (item.choiceA && item.choiceB) {
            const combinedAns = `Option A:\n${item.choiceA.ans}\n\nOR Option B:\n${item.choiceB.ans}`;
            return `
              <div class="exam-q-row">
                <div class="exam-q-num">Q${qNum}.</div>
                <div class="exam-q-body">
                  <div class="exam-q-top">
                    <div class="exam-q-text">
                      <span class="exam-choice-pill">Attempt either A or B</span>
                      ${diagHtml}
                      <div class="exam-case-passage"><strong>Case A:</strong> ${escapeHtml(item.choiceA.passage)}</div>
                      ${escapeHtml(item.choiceA.q).replace(/\n/g, '<br>')}
                      <div class="exam-or-divider">— OR —</div>
                      <div class="exam-case-passage"><strong>Case B:</strong> ${escapeHtml(item.choiceB.passage)}</div>
                      ${escapeHtml(item.choiceB.q).replace(/\n/g, '<br>')}
                    </div>
                    ${renderChBadge(item.ch, 4)}
                  </div>
                  ${renderCoachingBlock(qKey, item, combinedAns, true)}
                </div>
              </div>
            `;
          }
          return `
            <div class="exam-q-row">
              <div class="exam-q-num">Q${qNum}.</div>
              <div class="exam-q-body">
                <div class="exam-q-top">
                  <div class="exam-q-text">
                    ${diagHtml}
                    <div class="exam-case-passage">${escapeHtml(item.passage)}</div>
                    ${escapeHtml(item.q).replace(/\n/g, '<br>')}
                  </div>
                  ${renderChBadge(item.ch, 4)}
                </div>
                ${renderCoachingBlock(qKey, item, item.ans, true)}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- ==================== SECTION F (MAP SKILL FOR SOCIAL SCIENCE) ==================== -->
      ${hasSecF ? `
        <div class="exam-section-block">
          <div class="exam-section-bar">
            <span>SECTION F — Map Skill Based Questions (Q${secFStart})</span>
            <span>${p.secF.length} × 3 = ${secFTotalMarks} Marks</span>
          </div>

          ${p.secF.map((item, idx) => {
            const qNum = secFStart + idx;
            const qKey = `secf_${idx}`;
            const diagHtml = item.diagramType ? renderAnnualDiagramSvg(item.diagramType) : '';
            return `
              <div class="exam-q-row">
                <div class="exam-q-num">Q${qNum}.</div>
                <div class="exam-q-body">
                  <div class="exam-q-top">
                    <div class="exam-q-text">
                      ${diagHtml}
                      ${escapeHtml(item.q).replace(/\n/g, '<br>')}
                    </div>
                    ${renderChBadge(item.ch, 3)}
                  </div>
                  ${renderCoachingBlock(qKey, item, item.ans, true)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function printAnnualPaper() {
  window.print();
}

function renderSamplePapers() {
  renderAnnualPaperStudio();
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
// VIEW 9: DYNAMIC SHUFFLED + PARAMETRIC CHAPTER QUIZ ENGINE
// ---------------------------------------------------------------------------
let activeQuiz = {
  subjectId: 'SCIENCE',
  chapterNum: null,
  questions: [],
  index: 0,
  score: 0
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleWithCorrect(options, correctIdx) {
  const tagged = options.map((text, idx) => ({ text, isRight: idx === correctIdx }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  return {
    options: tagged.map(x => x.text),
    correct: tagged.findIndex(x => x.isRight)
  };
}

function generateParametricQuestions(subjectId, chapterNum = null) {
  const out = [];
  const want = (ch) => !chapterNum || Number(chapterNum) === ch;

  if (subjectId === 'MATH') {
    if (want(1)) {
      const n = randInt(3, 9);
      const sq = n * n;
      const opts = shuffleWithCorrect([`${sq}`, `${n * (n + 1)}`, `${sq - n}`, `${sq + n}`], 0);
      out.push({
        chapterNum: 1,
        chapter: 'Chapter 1 - Patterns in Mathematics',
        question: `What is the ${n}th square number in the sequence 1, 4, 9, 16, ...?`,
        ...opts,
        explanation: `The nth square number is n × n. So ${n} × ${n} = ${sq}.`
      });
    }
    if (want(2)) {
      const deg = randInt(25, 155);
      const kind = deg < 90 ? 'Acute angle' : deg === 90 ? 'Right angle' : 'Obtuse angle';
      const opts = shuffleWithCorrect(['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle'], kind === 'Acute angle' ? 0 : kind === 'Right angle' ? 1 : 2);
      out.push({
        chapterNum: 2,
        chapter: 'Chapter 2 - Lines and Angles',
        question: `An angle measuring ${deg}° is classified as a:`,
        ...opts,
        explanation: `${deg}° is ${deg < 90 ? 'less than 90° (acute)' : deg === 90 ? 'exactly 90° (right)' : 'between 90° and 180° (obtuse)'}.`
      });
    }
    if (want(3)) {
      const a = randInt(2, 9);
      const b = randInt(1, 8);
      const num = a * 10000 + b * 1000 + randInt(100, 999);
      const ansVal = (b * 1000).toLocaleString();
      const opts = shuffleWithCorrect([ansVal, `${b * 100}`, `${b * 10000}`, `${b}`], 0);
      out.push({
        chapterNum: 3,
        chapter: 'Chapter 3 - Number Play',
        question: `What is the place value of ${b} in the number ${num.toLocaleString()}?`,
        ...opts,
        explanation: `In ${num.toLocaleString()}, the digit ${b} is in the thousands place, so its place value is ${ansVal}.`
      });
    }
    if (want(4)) {
      const base = randInt(4, 15);
      const d = randInt(2, 5);
      const nums = [base - d, base, base + d, base + 2 * d];
      const mean = (nums[0] + nums[1] + nums[2] + nums[3]) / 4;
      const opts = shuffleWithCorrect([`${mean}`, `${mean + 2}`, `${mean - 2}`, `${nums.reduce((s, x) => s + x, 0)}`], 0);
      out.push({
        chapterNum: 4,
        chapter: 'Chapter 4 - Data Handling',
        question: `Find the average (mean) of the observations: ${nums.join(', ')}.`,
        ...opts,
        explanation: `Sum = ${nums.reduce((s, x) => s + x, 0)}. Mean = Sum ÷ 4 = ${mean}.`
      });
    }
    if (want(6)) {
      const L = randInt(6, 18);
      const B = randInt(3, L - 1);
      const perim = 2 * (L + B);
      const opts = shuffleWithCorrect([`${perim} cm`, `${L * B} cm`, `${L + B} cm`, `${2 * L + B} cm`], 0);
      out.push({
        chapterNum: 6,
        chapter: 'Chapter 6 - Perimeter and Area',
        question: `A rectangular notebook has length ${L} cm and breadth ${B} cm. What is its perimeter?`,
        ...opts,
        explanation: `Perimeter of a rectangle = 2 × (Length + Breadth) = 2 × (${L} + ${B}) = ${perim} cm.`
      });
    }
    if (want(7)) {
      const pairs = [
        [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 2, 50]
      ];
      const [num, den, pct] = pairs[randInt(0, pairs.length - 1)];
      const opts = shuffleWithCorrect([`${pct}%`, `${pct - 10}%`, `${pct + 15}%`, `${Math.round(pct / 2)}%`], 0);
      out.push({
        chapterNum: 7,
        chapter: 'Chapter 7 - Fractions',
        question: `What is the fraction ${num}/${den} expressed as a percentage?`,
        ...opts,
        explanation: `(${num} ÷ ${den}) × 100 = ${pct}%.`
      });
    }
    if (want(10)) {
      const start = randInt(-8, -2);
      const move = randInt(5, 12);
      const res = start + move;
      const opts = shuffleWithCorrect([`${res}`, `${res - 2}`, `${start - move}`, `${-res}`], 0);
      out.push({
        chapterNum: 10,
        chapter: 'Chapter 10 - The Other Side of Zero (Integers)',
        question: `On a number line, if you start at ${start} and move ${move} steps to the right, where do you land?`,
        ...opts,
        explanation: `Moving right adds to the integer: (${start}) + ${move} = ${res}.`
      });
    }
  }

  if (subjectId === 'SCIENCE') {
    if (want(5)) {
      const startCm = (randInt(15, 40) / 10).toFixed(1);
      const lenCm = randInt(7, 16);
      const endCm = (parseFloat(startCm) + lenCm).toFixed(1);
      const wrongAdd = (parseFloat(startCm) + parseFloat(endCm)).toFixed(1);
      const opts = shuffleWithCorrect([`${lenCm}.0 cm`, `${endCm} cm`, `${wrongAdd} cm`, `${(lenCm - 1).toFixed(1)} cm`], 0);
      out.push({
        chapterNum: 5,
        chapter: 'Chapter 5 - Measurement of Length and Motion',
        question: `A broken ruler starts at ${startCm} cm. If one end of a pencil is at ${startCm} cm and the other end is at ${endCm} cm, what is the true length of the pencil?`,
        ...opts,
        explanation: `True length = Final reading − Initial reading = ${endCm} − ${startCm} = ${lenCm}.0 cm.`
      });
    }
    if (want(7)) {
      const c = randInt(15, 45);
      const k = (c + 273.15).toFixed(2);
      const opts = shuffleWithCorrect([`${k} K`, `${(c + 273).toFixed(2)} K`, `${(273.15 - c).toFixed(2)} K`, `${(c + 100).toFixed(2)} K`], 0);
      out.push({
        chapterNum: 7,
        chapter: 'Chapter 7 - Temperature and its Measurement',
        question: `Convert ${c} °C into the SI temperature scale (Kelvin, using T(K) = T(°C) + 273.15):`,
        ...opts,
        explanation: `T(K) = ${c} + 273.15 = ${k} K.`
      });

      const divs = [5, 10, 20][randInt(0, 2)];
      const span = 20;
      const lc = (span / divs).toFixed(1);
      const opts2 = shuffleWithCorrect([`${lc} °C`, `${(span / (divs * 2)).toFixed(1)} °C`, `${(span / (divs / 2)).toFixed(1)} °C`, `0.1 °C`], 0);
      out.push({
        chapterNum: 7,
        chapter: 'Chapter 7 - Temperature and its Measurement',
        question: `In a laboratory thermometer, there are ${divs} equal small divisions between 10 °C and 30 °C. What is its least count?`,
        ...opts2,
        explanation: `Least count = (30 − 10) ÷ ${divs} = ${span} ÷ ${divs} = ${lc} °C.`
      });
    }
  }

  if (subjectId === 'SSC') {
    if (want(1)) {
      const hrs = randInt(1, 5);
      const deg = hrs * 15;
      const isEast = Math.random() > 0.35;
      const dir = isEast ? 'E' : 'W';
      const rightTime = isEast ? `${hrs}:00 PM` : `${12 - hrs}:00 AM`;
      const wrong1 = isEast ? `${12 - hrs}:00 AM` : `${hrs}:00 PM`;
      const wrong2 = `${hrs + 1}:00 PM`;
      const wrong3 = `${Math.max(1, hrs - 1)}:00 AM`;
      const opts = shuffleWithCorrect([rightTime, wrong1, wrong2, wrong3], 0);
      out.push({
        chapterNum: 1,
        chapter: 'Chapter 1 - Locating Places on the Earth',
        question: `If it is 12:00 noon at Greenwich (0° Prime Meridian), what will be the local time at ${deg}°${dir} longitude?`,
        ...opts,
        explanation: `Every 15° of longitude equals 1 hour. ${deg}° ÷ 15° = ${hrs} hour(s) ${isEast ? 'ahead (East)' : 'behind (West)'} of 12:00 noon, which is ${rightTime}.`
      });
    }
    if (want(4)) {
      const bce = randInt(2, 6) * 100 + randInt(10, 80);
      const ce = randInt(2, 5) * 100 + randInt(10, 80);
      const diff = bce + ce - 1;
      const opts = shuffleWithCorrect([`${diff} years`, `${bce + ce} years`, `${Math.abs(bce - ce)} years`, `${diff - 10} years`], 0);
      out.push({
        chapterNum: 4,
        chapter: 'Chapter 4 - Timeline and Sources of History',
        question: `How many years elapsed between ${bce} BCE and ${ce} CE on the historical timeline (remembering there is no Year Zero)?`,
        ...opts,
        explanation: `To find years between a BCE date and a CE date, add them and subtract 1 (since there is no Year 0): ${bce} + ${ce} − 1 = ${diff} years.`
      });
    }
  }

  return out;
}

function buildDynamicQuizPool(subjectId, chapterNum = null) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  const pool = [];
  const seenQ = new Set();

  const pushUnique = (item) => {
    const key = (item.question || '').trim().toLowerCase().slice(0, 90);
    if (!key || seenQ.has(key)) return;
    seenQ.add(key);
    pool.push(item);
  };

  // 1. Fresh Parametric Numericals
  generateParametricQuestions(subjectId, chapterNum).forEach(pushUnique);

  // 2. Chapter Concepts Self-Check Questions (from concepts.js & concepts-science.js)
  const subConcepts = (typeof CONCEPTS !== 'undefined' && CONCEPTS[subjectId]) ? CONCEPTS[subjectId] : {};
  Object.keys(subConcepts).forEach(chKey => {
    const chN = Number(chKey);
    if (chapterNum && chN !== Number(chapterNum)) return;
    const chTitle = sub && sub.chapters[chN - 1] ? sub.chapters[chN - 1] : `Chapter ${chN}`;
    (subConcepts[chKey] || []).forEach(c => {
      (c.check || []).forEach(qItem => {
        const shuffled = shuffleWithCorrect(qItem.options, qItem.correct);
        pushUnique({
          chapterNum: chN,
          chapter: `Chapter ${chN} - ${chTitle}`,
          question: qItem.q,
          options: shuffled.options,
          correct: shuffled.correct,
          explanation: qItem.why || c.idea
        });
      });
    });
  });

  // 3. Annual Paper Studio MCQ Pools (for Science, Mathematics & Social Science)
  const activeBp = (subjectId === 'SCIENCE' && window.SCIENCE_ANNUAL_BLUEPRINT)
    ? window.SCIENCE_ANNUAL_BLUEPRINT
    : (subjectId === 'MATH' && window.MATH_ANNUAL_BLUEPRINT)
      ? window.MATH_ANNUAL_BLUEPRINT
      : (subjectId === 'SSC' && window.SSC_ANNUAL_BLUEPRINT)
        ? window.SSC_ANNUAL_BLUEPRINT
        : null;

  if (activeBp) {
    (activeBp.sectionAMcqPool || []).forEach(m => {
      if (chapterNum && Number(m.ch) !== Number(chapterNum)) return;
      const chTitle = sub && sub.chapters[m.ch - 1] ? sub.chapters[m.ch - 1] : `Chapter ${m.ch}`;
      const cleanOpts = m.options.map(o => o.replace(/^(?:[A-D]\.|\([a-d]\))\s*/i, ''));
      const shuffled = shuffleWithCorrect(cleanOpts, m.correct);
      pushUnique({
        chapterNum: m.ch,
        chapter: `Chapter ${m.ch} - ${chTitle}`,
        question: m.q,
        options: shuffled.options,
        correct: shuffled.correct,
        explanation: m.ans
      });
    });
  }

  // 4. Legacy QUIZ_DATA Questions (Shuffled Options)
  const baseList = (typeof QUIZ_DATA !== 'undefined' && QUIZ_DATA[subjectId]) ? QUIZ_DATA[subjectId] : [];
  baseList.forEach(qItem => {
    const chMatch = (qItem.chapter || '').match(/Chapter\s*(\d+)/i);
    const parsedCh = chMatch ? Number(chMatch[1]) : null;
    if (chapterNum && parsedCh && parsedCh !== Number(chapterNum)) return;
    const shuffled = shuffleWithCorrect(qItem.options, qItem.correct);
    pushUnique({
      chapterNum: parsedCh,
      chapter: qItem.chapter || (sub ? sub.name : subjectId),
      question: qItem.question,
      options: shuffled.options,
      correct: shuffled.correct,
      explanation: qItem.explanation
    });
  });

  // Shuffle the combined pool and pick up to 8 questions per round
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 8);
}

function populateQuizSelectors(subjectId, chapterNum) {
  const subSel = document.getElementById('quizSubjectSelect');
  const chSel = document.getElementById('quizChapterSelect');
  if (subSel) {
    subSel.innerHTML = SUBJECTS.filter(s => s.id !== 'FRENCH').map(s =>
      `<option value="${s.id}" ${s.id === subjectId ? 'selected' : ''}>${escapeHtml(s.name)}</option>`
    ).join('');
  }
  if (chSel) {
    const sub = SUBJECTS.find(s => s.id === subjectId);
    const chapters = sub ? sub.chapters : [];
    chSel.innerHTML = `<option value="">All Chapters (Mixed)</option>` +
      chapters.map((name, i) => `<option value="${i + 1}" ${Number(chapterNum) === i + 1 ? 'selected' : ''}>Ch ${i + 1}: ${escapeHtml(name)}</option>`).join('');
  }
}

function onQuizSubjectChange(newSubId) {
  startQuiz(newSubId, null);
}

function onQuizChapterChange(chVal) {
  startQuiz(activeQuiz.subjectId || 'SCIENCE', chVal ? Number(chVal) : null);
}

function refreshActiveQuiz() {
  startQuiz(activeQuiz.subjectId || 'SCIENCE', activeQuiz.chapterNum || null);
  showToast('Generated a fresh shuffled question set!');
}

function startQuiz(subjectId, chapterNum = null) {
  let questions = buildDynamicQuizPool(subjectId, chapterNum);
  let fallbackNotice = false;
  if (!questions.length && chapterNum) {
    questions = buildDynamicQuizPool(subjectId, null);
    fallbackNotice = true;
  }
  if (!questions.length) {
    showToast(`No quiz questions found for ${subjectId}`);
    return;
  }

  activeQuiz = {
    subjectId: subjectId,
    chapterNum: fallbackNotice ? null : chapterNum,
    questions: questions,
    index: 0,
    score: 0
  };

  populateQuizSelectors(subjectId, activeQuiz.chapterNum);
  const sub = SUBJECTS.find(s => s.id === subjectId);
  const headerSub = document.getElementById('quizHeaderSub');
  if (headerSub && sub) {
    headerSub.textContent = activeQuiz.chapterNum
      ? `${sub.name} · Chapter ${activeQuiz.chapterNum} — freshly shuffled questions & options`
      : `${sub.name} (All Chapters) — freshly shuffled questions & options`;
  }

  if (fallbackNotice) {
    showToast(`No chapter-specific questions yet — loaded mixed ${sub ? sub.name : subjectId} quiz!`);
  }
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
        <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:24px;">
          <button class="btn-suave gemini-btn" onclick="refreshActiveQuiz()">
            ↻ Try Fresh Questions
          </button>
          <button class="btn-suave primary" onclick="switchTab('curriculum')">
            Return to Subjects
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="quiz-meta-row">
      <span>${escapeHtml(q.chapter || 'Assessment')}</span>
      <span>Question ${activeQuiz.index + 1} of ${activeQuiz.questions.length} · Score: ${activeQuiz.score}</span>
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
  refreshStudyViews();
}

function refreshStudyViews() {
  const y = window.scrollY;
  const tab = appState.activeTab;
  if (tab === 'chapter') renderChapterPage();
  else if (tab === 'lessons' && appState.currentSubject) openSubjectDetail(appState.currentSubject.id);
  renderCurriculum();
  if (typeof renderConceptHub === 'function') renderConceptHub(appState.conceptCategory || 'ALL');
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
      <div class="concept-card ${mastered ? 'mastered' : ''}" id="concept-${c.id}">
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
    appState.pinnedSwipeConceptId = conceptId;
    saveMastery();
    showToast(`Concept mastered: ${c.title} 🎯`);
  }
  renderCurriculum();
  renderConceptHub(appState.conceptCategory);
  if (appState.activeTab === 'concepts' && appState.activeConceptDetail && appState.activeConceptDetail.conceptId === conceptId) {
    openConceptHubDetail(subjectId, chapterNum, conceptId);
  } else {
    refreshStudyViews();
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
  } else {
    refreshStudyViews();
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
  appState.conceptSwipeIndex = 0;
  document.querySelectorAll('#conceptSubjectPills .pill-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
  closeConceptPanel();
  renderConceptHub(category);
}

function setConceptViewMode(mode) {
  appState.conceptViewMode = mode === 'grid' ? 'grid' : 'swipe';
  localStorage.setItem('study_concept_view_mode', appState.conceptViewMode);
  renderConceptHub(appState.conceptCategory || 'ALL');
}

function stepConceptSwipe(delta) {
  const q = (appState.searchQuery || '').toLowerCase().trim();
  const cat = appState.conceptCategory || 'ALL';
  const filtered = getAllConceptsFlat().filter(item => {
    if (cat !== 'ALL' && item.subjectId !== cat) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.idea.toLowerCase().includes(q) ||
      item.explain.toLowerCase().includes(q) ||
      item.chapterTitle.toLowerCase().includes(q) ||
      item.subjectName.toLowerCase().includes(q)
    );
  });
  if (!filtered.length) return;
  appState.conceptSwipeIndex = ((appState.conceptSwipeIndex + delta) % filtered.length + filtered.length) % filtered.length;
  renderConceptHub(cat);
}

function renderConceptHub(category = 'ALL') {
  const grid = document.getElementById('conceptCardsGrid');
  if (!grid) return;

  const btnSwipe = document.getElementById('conceptModeSwipeBtn');
  const btnGrid = document.getElementById('conceptModeGridBtn');
  if (btnSwipe) btnSwipe.classList.toggle('active', appState.conceptViewMode === 'swipe');
  if (btnGrid) btnGrid.classList.toggle('active', appState.conceptViewMode === 'grid');

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

  filtered.sort((x, y) => (appState.mastery[x.id] ? 1 : 0) - (appState.mastery[y.id] ? 1 : 0));
  const toRevise = filtered.filter(c => !appState.mastery[c.id]).length;
  const summary = document.getElementById('reviseSummary');
  if (summary) summary.textContent = filtered.length ? `${toRevise} of ${filtered.length} key ideas still to master — swipe ← / → or tap to revise.` : '';

  if (filtered.length === 0) {
    grid.className = 'concept-cards-grid';
    grid.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-tertiary);">
        No concepts match your current filter.
      </div>
    `;
    return;
  }

  // SWIPE DECK MODE (1 Focused Flashcard at a time)
  if (appState.conceptViewMode === 'swipe') {
    if (appState.conceptSwipeIndex >= filtered.length) appState.conceptSwipeIndex = 0;
    let idx = appState.conceptSwipeIndex;
    if (appState.pinnedSwipeConceptId) {
      const pinnedIdx = filtered.findIndex(x => x.id === appState.pinnedSwipeConceptId);
      if (pinnedIdx !== -1) {
        idx = pinnedIdx;
        appState.conceptSwipeIndex = pinnedIdx;
      }
      appState.pinnedSwipeConceptId = null;
    }
    const item = filtered[idx];
    const mastered = Boolean(appState.mastery[item.id]);
    const matchedVideo = CURATED_VIDEOS_DATABASE.find(v => v.subjectId === item.subjectId && v.chapterNum === item.chapterNum);
    const answers = appState.conceptAnswers[item.id] || {};

    const questionsHtml = (item.check || []).map((qItem, qi) => {
      const picked = answers[qi];
      const answered = picked !== undefined;
      const right = picked === qItem.correct;
      return `
        <div class="concept-question">
          <div class="concept-q-text">${qi + 1}. ${escapeHtml(qItem.q)}</div>
          <div class="concept-options">
            ${qItem.options.map((opt, oi) => {
              let cls = '';
              if (answered && right && oi === qItem.correct) cls = 'correct';
              else if (answered && !right && oi === picked) cls = 'wrong';
              return `<button class="concept-option ${cls}" onclick="answerConcept('${item.subjectId}', ${item.chapterNum}, '${item.id}', ${qi}, ${oi})">${escapeHtml(opt)}</button>`;
            }).join('')}
          </div>
          ${answered ? `<div class="concept-why ${right ? 'ok' : 'retry'}">${right ? '✓ ' + escapeHtml(qItem.why) : 'Not quite — re-read the explanation above and try again.'}</div>` : ''}
        </div>
      `;
    }).join('');

    grid.className = 'swipe-switcher-stage';
    grid.innerHTML = `
      <div class="swipe-deck-wrapper" id="conceptSwipeDeck">
        <button class="swipe-nav-arrow prev" onclick="stepConceptSwipe(-1)" title="Previous Concept (←)" aria-label="Previous Concept">‹</button>

        <div class="swipe-focus-card concept-flashcard ${mastered ? 'mastered' : ''}">
          <div class="swipe-card-header">
            <div>
              <div class="swipe-kicker">${escapeHtml(item.subjectName)} · Ch ${item.chapterNum}: ${escapeHtml(item.chapterTitle)} · §${escapeHtml(item.section)}</div>
              <h3 class="swipe-subject-title">${escapeHtml(item.title)}</h3>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="swipe-counter-pill">${idx + 1} / ${filtered.length}</span>
              <span class="concept-status-pill ${mastered ? 'done' : 'pending'}">
                ${mastered ? '● Mastered' : '○ To master'}
              </span>
            </div>
          </div>

          <div class="flashcard-idea-banner">${escapeHtml(item.idea)}</div>
          <p class="flashcard-explain">${escapeHtml(item.explain)}</p>
          ${item.example ? `<div class="flashcard-example"><strong>Example:</strong> ${escapeHtml(item.example)}</div>` : ''}

          <div class="flashcard-checks">
            <div class="concept-check-label">Self-Check — answer all correctly to mark Mastered</div>
            ${questionsHtml}
          </div>

          <div class="swipe-card-actions" style="margin-top: 16px;">
            <button class="btn-card highlight" onclick="openChapter('${item.subjectId}', ${item.chapterNum}, '${item.id}')">
              Open in Chapter ${item.chapterNum} →
            </button>
            ${matchedVideo ? `
              <button class="btn-card gemini-highlight" onclick="openGeminiVideoModal('${matchedVideo.id}', 0)">
                ▶ Watch Masterclass
              </button>
            ` : ''}
            <button class="btn-card ai-highlight" onclick="askNotebookAboutConcept('${item.subjectId}', ${item.chapterNum}, '${item.id}')">
              ✦ Ask NotebookLM
            </button>
          </div>
        </div>

        <button class="swipe-nav-arrow next" onclick="stepConceptSwipe(1)" title="Next Concept (→)" aria-label="Next Concept">›</button>
      </div>
    `;
    return;
  }

  // GRID MODE
  grid.className = 'concept-cards-grid';
  grid.innerHTML = filtered.map(item => {
    const mastered = Boolean(appState.mastery[item.id]);
    const hasVideo = CURATED_VIDEOS_DATABASE.some(v => v.subjectId === item.subjectId && v.chapterNum === item.chapterNum);
    const hasFormulas = FORMULA_DATABASE.some(f => f.subject === item.subjectId);

    return `
      <div class="concept-hub-card ${mastered ? 'mastered' : ''}" onclick="openChapter('${item.subjectId}', ${item.chapterNum}, '${item.id}')">
        <div>
          <div class="concept-hub-top">
            <span class="concept-hub-subject">${escapeHtml(item.subjectName)} • Ch ${item.chapterNum}</span>
            <span class="concept-status-pill ${mastered ? 'done' : 'pending'}">
              ${mastered ? '● Mastered' : '○ To master'}
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
          <span class="concept-open-arrow">${mastered ? 'Review' : 'Study'} →</span>
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

  // Jony Ive Principle 5: Default to the unobtrusive Dynamic Island pill unless explicitly opened
  const savedHidden = localStorage.getItem('study_music_hidden');
  const hidden = savedHidden === null ? true : savedHidden === '1';
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

// ---------------------------------------------------------------------------
// GLOBAL SWIPE ENGINE (Touch Swipe + Drag + Keyboard ← / →)
// ---------------------------------------------------------------------------
function handleGlobalSwipeStep(delta) {
  const readerOpen = document.getElementById('readerModal')?.classList.contains('active');
  const videoOpen = document.getElementById('geminiVideoModal')?.classList.contains('active');
  if (readerOpen || videoOpen) return;

  if (appState.activeTab === 'curriculum' && appState.subjectViewMode === 'swipe') {
    stepSubjectSwipe(delta);
  } else if (appState.activeTab === 'concepts' && appState.conceptViewMode === 'swipe' && !appState.activeConceptDetail) {
    stepConceptSwipe(delta);
  } else if (appState.activeTab === 'chapter' && appState.currentChapter) {
    const sub = SUBJECTS.find(s => s.id === appState.currentChapter.subjectId);
    if (!sub) return;
    const nextCh = appState.currentChapter.chapterNum + delta;
    if (nextCh >= 1 && nextCh <= sub.count) {
      openChapter(sub.id, nextCh);
    }
  }
}

function initTouchSwipeNavigation() {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    if (e.target.closest('.subject-scroll-snap-track, .chapter-swipe-rail, .swipe-pill-strip, .nav-tabs, input, textarea, select')) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!tracking || !e.changedTouches || !e.changedTouches.length) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      handleGlobalSwipeStep(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

// ---------------------------------------------------------------------------
// UX P1: Single-Row Minimalist Segmented Navigation + Chapter Study + Quest
// ---------------------------------------------------------------------------
const NAV_GROUPS = [
  { id: 'study', label: 'Study', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>', tabs: ['curriculum', 'videos', 'notebook'], also: ['lessons', 'chapter'] },
  { id: 'practice', label: 'Practice', icon: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>', tabs: ['concepts', 'quiz', 'quest', 'papers'], also: [] },
  { id: 'tools', label: 'Reference & Labs', icon: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>', tabs: ['formulas', 'webapps'], also: [] },
  { id: 'exams', label: 'Exams', icon: '<rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>', tabs: ['exams'], also: [] }
];

function navGroupFor(tabId) {
  return NAV_GROUPS.find(g => g.tabs.includes(tabId) || g.also.includes(tabId)) || NAV_GROUPS[0];
}

function buildGroupNav() {
  const tabs = document.querySelector('.nav-tabs');
  if (!tabs || document.getElementById('navGroups')) return;
  const bar = document.createElement('div');
  bar.id = 'navGroups';
  bar.className = 'nav-groups';
  bar.setAttribute('role', 'tablist');
  bar.innerHTML = NAV_GROUPS.map(g => `
    <button class="nav-group-btn" id="nav-group-${g.id}" data-group="${g.id}" role="tab">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${g.icon}</svg>
      <span>${g.label}</span>
    </button>`).join('');
  tabs.parentNode.insertBefore(bar, tabs);
  bar.querySelectorAll('.nav-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = NAV_GROUPS.find(x => x.id === btn.dataset.group);
      switchTab(g.tabs[0]);
    });
  });
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.dataset.group = navGroupFor(t.dataset.tab).id;
  });
  NAV_GROUPS.forEach(g => g.tabs.forEach(id => {
    const t = document.getElementById(`nav-tab-${id}`);
    if (t) tabs.appendChild(t);
  }));
}

function updateGroupNav(tabId) {
  const group = navGroupFor(tabId);
  document.body.dataset.navGroup = group.id;
  document.querySelectorAll('.nav-group-btn').forEach(b => b.classList.toggle('active', b.dataset.group === group.id));
  document.querySelectorAll('.nav-tab').forEach(t => { t.hidden = t.dataset.group !== group.id; });
  const tabsRow = document.querySelector('.nav-tabs');
  if (tabsRow) tabsRow.hidden = group.tabs.length < 2;
  // Inside a subject or chapter, keep "Subjects" highlighted
  if (group.also.includes(tabId)) {
    const home = document.getElementById(`nav-tab-${group.tabs[0]}`);
    if (home) home.classList.add('active');
  }
}

// ---------- Chapter progress ----------
function isChapterDone(subjectId, chapterNum) {
  const list = getChapterConcepts(subjectId, chapterNum);
  if (list.length && list.every(c => appState.mastery[c.id])) return true;
  return Boolean(appState.completedChapters[`${subjectId}_ch${chapterNum}`]);
}

function chapterVideo(subjectId, chapterNum) {
  return CURATED_VIDEOS_DATABASE.find(v => v.subjectId === subjectId && v.chapterNum === chapterNum) || null;
}

function youtubeSearchUrl(text) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(text)}`;
}

// ---------- Chapter study page ----------
// ---------- Chapter study page (Jony Ive 5-Step Segmented Focus Deck) ----------
function setChapterStep(stepVal) {
  appState.activeChapterStep = stepVal;
  renderChapterPage();
}

function openChapter(subjectId, chapterNum, focusConceptId) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return;
  appState.currentSubject = sub;
  appState.currentChapter = { subjectId, chapterNum };
  appState.activeChapterStep = focusConceptId ? 2 : (appState.activeChapterStep || 1);
  switchTab('chapter');
  renderChapterPage();
  if (focusConceptId) {
    const el = document.getElementById(`concept-${focusConceptId}`);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
}

function renderChapterPage() {
  const view = document.getElementById('chapterPage');
  const cur = appState.currentChapter;
  if (!view || !cur) return;
  const sub = SUBJECTS.find(s => s.id === cur.subjectId);
  const n = cur.chapterNum;
  const name = sub.chapters[n - 1] || `Chapter ${n}`;
  const concepts = getChapterConcepts(sub.id, n);
  const mastered = chapterMasteryCount(sub.id, n);
  const done = isChapterDone(sub.id, n);
  const video = chapterVideo(sub.id, n);
  const pdf = sub.filePattern(n);
  const readTitle = `${sub.name} — Chapter ${n}: ${name}`;
  const prev = n > 1 ? n - 1 : null;
  const next = n < sub.count ? n + 1 : null;
  const pct = concepts.length ? Math.round((mastered / concepts.length) * 100) : (done ? 100 : 0);
  const activeStep = appState.activeChapterStep || 1;

  const stepsData = [
    {
      num: 1,
      short: '1. Read',
      title: 'Read the NCERT Chapter',
      isDone: false,
      body: `
        <p class="study-step-text">Start with the official NCERT textbook chapter. Skim the section headings first, then read carefully in the full-bleed reader or dock it side-by-side.</p>
        <div class="study-step-actions">
          <button class="btn-card highlight" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', false)">📖 Open Chapter PDF</button>
          <button class="btn-card gemini-highlight" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', true); setChapterStep(2);">◫ Split-View PDF + Key Ideas</button>
          <button class="btn-card" onclick="window.open('${escapeJs(pdf)}', '_blank')">Pop-out PDF ↗</button>
        </div>`
    },
    {
      num: 2,
      short: `2. Ideas${concepts.length ? ` (${mastered}/${concepts.length})` : ''}`,
      title: `Key Ideas & Self-Check${concepts.length ? ` <span class="study-step-count">${mastered}/${concepts.length}</span>` : ''}`,
      isDone: concepts.length > 0 && mastered === concepts.length,
      body: concepts.length
        ? `<p class="study-step-text">Read each core idea, then answer its check questions. Get them all right to mark it mastered.</p>${renderConceptPanel(sub, n)}`
        : `<p class="study-step-text">Key ideas for this chapter haven't been added yet. Use NotebookLM (Step 4) to extract the main ideas.</p>`
    },
    {
      num: 3,
      short: '3. Watch',
      title: 'Watch Curated Masterclass',
      isDone: false,
      body: `
        <p class="study-step-text">${video ? escapeHtml(video.title) + ' (' + escapeHtml(video.duration) + ')' : 'Watch a focused concept video lesson for this chapter.'}</p>
        <div class="study-step-actions">
          ${video ? `<button class="btn-card gemini-highlight" onclick="openGeminiVideoModal('${video.id}', 0)">▶ Watch Stitched Masterclass</button>` : ''}
          <a class="btn-card" href="${youtubeSearchUrl(`${ACTIVE_CLASS.label} NCERT ${sub.book} chapter ${n} ${name}`)}" target="_blank" rel="noopener">Search YouTube ↗</a>
        </div>`
    },
    {
      num: 4,
      short: '4. Ask AI',
      title: 'Ask Google NotebookLM',
      isDone: false,
      body: `
        <p class="study-step-text">Your grounded AI study partner — copies a ready-made Class 6 study prompt for Chapter ${n} and opens NotebookLM.</p>
        <div class="study-step-actions">
          <button class="btn-card ai-highlight" onclick="askNotebookAboutChapter('${sub.id}', ${n})">✦ Copy Study Prompt &amp; Open</button>
        </div>`
    },
    {
      num: 5,
      short: '5. Practise',
      title: 'Practise & Verify Mastery',
      isDone: done,
      body: `
        <p class="study-step-text">Test yourself with freshly shuffled questions for Chapter ${n}, or attempt an examination sample paper.</p>
        <div class="study-step-actions">
          <button class="btn-card highlight" onclick="startQuiz('${sub.id}', ${n})">🎯 Fresh Chapter ${n} Quiz</button>
          <button class="btn-card" onclick="startQuiz('${sub.id}')">${escapeHtml(sub.name)} Full Quiz</button>
          ${sub.samplePaper ? `<button class="btn-card" onclick="openReader('${escapeJs(sub.samplePaper)}', '${escapeJs(sub.name + ' sample paper')}', 'PAPER')">Sample Paper PDF</button>` : ''}
          ${concepts.length ? '' : `<button class="btn-card ${done ? '' : 'highlight'}" onclick="toggleChapterDone('${sub.id}_ch${n}')">${done ? 'Marked done ✓ (undo)' : 'Mark chapter done'}</button>`}
        </div>`
    }
  ];

  const renderStepCard = (s) => `
    <div class="study-step ive-step-stage ${s.isDone ? 'done' : ''}">
      <div class="study-step-num">${s.isDone ? '✓' : s.num}</div>
      <div class="study-step-body">
        <div class="study-step-title">${s.title}</div>
        ${s.body}
        ${activeStep !== 'all' ? `
          <div class="ive-step-footer-nav">
            ${s.num > 1 ? `<button class="btn-suave" onclick="setChapterStep(${s.num - 1})">← Step ${s.num - 1}</button>` : '<span></span>'}
            ${s.num < 5 ? `<button class="btn-suave primary" onclick="setChapterStep(${s.num + 1})">Next: ${stepsData[s.num].short} →</button>` : ''}
          </div>
        ` : ''}
      </div>
    </div>`;

  const chapterPillsHtml = `
    <div class="swipe-pill-strip chapter-mini-strip" role="tablist" aria-label="Chapter Switcher">
      ${sub.chapters.map((chTitle, idx) => {
        const chNum = idx + 1;
        const chDone = isChapterDone(sub.id, chNum);
        return `
          <button class="swipe-subject-pill ${chNum === n ? 'active' : ''}" onclick="openChapter('${sub.id}', ${chNum})" title="${escapeHtml(chTitle)}">
            <span>${chDone ? '✓ ' : ''}Ch ${chNum}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  const visibleSteps = activeStep === 'all'
    ? stepsData.map(renderStepCard).join('')
    : renderStepCard(stepsData.find(x => x.num === Number(activeStep)) || stepsData[0]);

  view.innerHTML = `
    <div class="chapter-page-top">
      <button class="btn-suave" onclick="switchTab('curriculum')">← ${escapeHtml(sub.name)}</button>
      ${chapterPillsHtml}
      <div class="chapter-page-nav">
        ${prev ? `<button class="btn-suave" onclick="openChapter('${sub.id}', ${prev})" title="Previous Chapter (←)">‹ Ch ${prev}</button>` : ''}
        ${next ? `<button class="btn-suave" onclick="openChapter('${sub.id}', ${next})" title="Next Chapter (→)">Ch ${next} ›</button>` : ''}
      </div>
    </div>

    <div class="chapter-hero ive-glass-hero">
      <div>
        <div class="chapter-hero-kicker">${escapeHtml(sub.name)} · ${escapeHtml(sub.book)} · Chapter ${n} of ${sub.count}</div>
        <h2 class="chapter-hero-title">${escapeHtml(name)}</h2>
        <div class="chapter-hero-status">${done ? '✓ Chapter complete' : concepts.length ? `${mastered} of ${concepts.length} key ideas mastered` : 'Follow the 5 focused steps below'}</div>
      </div>
      <div class="chapter-ring" style="--pct:${pct}"><span>${pct}%</span></div>
    </div>

    <!-- Jony Ive 5-Step Segmented Focus Switcher -->
    <div class="ive-step-seg-bar" role="tablist" aria-label="Chapter Study Steps">
      ${stepsData.map(s => `
        <button class="ive-step-seg-btn ${Number(activeStep) === s.num ? 'active' : ''} ${s.isDone ? 'done' : ''}" onclick="setChapterStep(${s.num})">
          ${s.isDone ? '✓ ' : ''}${s.short}
        </button>
      `).join('')}
      <button class="ive-step-seg-btn ${activeStep === 'all' ? 'active' : ''}" onclick="setChapterStep('all')" title="Show all 5 steps stacked">
        All Steps
      </button>
    </div>

    <div class="study-steps">
      ${visibleSteps}
    </div>
  `;
}

function chapterNotebookPrompt(sub, n) {
  return `I am a ${ACTIVE_CLASS.label} student studying NCERT ${sub.name} (${sub.book}), Chapter ${n}: ${sub.chapters[n - 1]}.\n` +
    `1) List the key ideas of this chapter in simple words. 2) Explain each with an everyday example. ` +
    `3) Then quiz me with 5 questions, one at a time, waiting for my answer before checking it.`;
}

function askNotebookAboutChapter(subjectId, n) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return;
  const open = () => launchNotebookLM(subjectId, sub.name);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(chapterNotebookPrompt(sub, n)).then(() => { showToast('Study prompt copied — paste it into NotebookLM'); open(); }, open);
  } else open();
}

// ---------------------------------------------------------------------------
// DAILY CURIOSITY QUEST — one quest a day, hints instead of answers
// ---------------------------------------------------------------------------
const QUESTS = ACTIVE_CLASS.data.quests || [];
const QUEST_EPOCH = new Date(2026, 0, 1); // rotation starts 1 Jan 2026 (local time)
const QUEST_TAG_LABELS = { science: '🔬 Science', math: '🔢 Math', creativity: '🎨 Creativity' };

function questDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function questForDate(d = new Date()) {
  if (!QUESTS.length) return null;
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const n = Math.round((day - QUEST_EPOCH) / 86400000);
  return QUESTS[((n % QUESTS.length) + QUESTS.length) % QUESTS.length];
}

function loadQuestLog() {
  try { return JSON.parse(localStorage.getItem(classStorageKey('quests', ACTIVE_CLASS.id)) || '{}'); } catch (e) { return {}; }
}

function saveQuestLog(log) {
  try { localStorage.setItem(classStorageKey('quests', ACTIVE_CLASS.id), JSON.stringify(log)); } catch (e) {}
}

function questEntry(log, key, quest) {
  if (!log[key] || log[key].questId !== quest.id) {
    log[key] = { questId: quest.id, hints: 0, attempts: 0, solved: false, revealed: false, stars: 0, last: '' };
  }
  return log[key];
}

function questStreak(log) {
  const d = new Date();
  if (!(log[questDateKey(d)] && log[questDateKey(d)].solved)) d.setDate(d.getDate() - 1); // today not done yet: count from yesterday
  let streak = 0;
  while (log[questDateKey(d)] && log[questDateKey(d)].solved) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

function questStars(log) {
  return Object.values(log).reduce((sum, e) => sum + (e.solved ? e.stars : 0), 0);
}

function renderQuestBanner() {
  const el = document.getElementById('questBanner');
  if (!el) return;
  const quest = questForDate();
  if (!quest) { el.innerHTML = ''; return; }
  const log = loadQuestLog();
  const entry = log[questDateKey()];
  const done = entry && entry.questId === quest.id && entry.solved;
  const streak = questStreak(log);
  el.innerHTML = `
    <button class="quest-pill-compact ${done ? 'done' : ''}" onclick="switchTab('quest')" title="Open Today's Curiosity Quest">
      <span class="quest-pill-icon">${done ? '✓' : '🧭'}</span>
      <span class="quest-pill-label">Daily Quest: <strong>${escapeHtml(quest.title)}</strong></span>
      ${streak ? `<span class="quest-pill-streak">🔥 ${streak}d</span>` : ''}
    </button>`;
}

function renderQuest() {
  const view = document.getElementById('questPage');
  if (!view) return;
  const quest = questForDate();
  if (!quest) { view.innerHTML = '<p class="study-step-text">No quests have been added for this class yet.</p>'; return; }

  const key = questDateKey();
  const log = loadQuestLog();
  const e = questEntry(log, key, quest);
  saveQuestLog(log);
  const finished = e.solved || e.revealed;
  const hintsLeft = quest.hints.length - e.hints;
  const canReveal = !finished && hintsLeft === 0 && e.attempts >= 3 && quest.type !== 'open';
  const sub = quest.link && SUBJECTS.find(s => s.id === quest.link.subject);
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  let answerHtml = '';
  if (finished) {
    answerHtml = `
      <div class="quest-result ${e.solved ? 'ok' : ''}">
        <div class="quest-result-title">${e.solved ? `🎉 Solved! You earned ${'⭐'.repeat(e.stars) || 'no stars — but you finished!'}` : 'Here is how it works'}</div>
        ${quest.type === 'open' && e.last ? `<div class="quest-my-answer"><strong>Your answer:</strong> ${escapeHtml(e.last)}</div>` : ''}
        <p>${escapeHtml(quest.explain)}</p>
        <p class="quest-come-back">Come back tomorrow for a new quest!</p>
      </div>`;
  } else if (quest.type === 'choice') {
    answerHtml = `<div class="quest-options">${quest.options.map((o, i) =>
      `<button class="concept-option quest-option" onclick="submitQuestAnswer(${i})">${escapeHtml(o)}</button>`).join('')}</div>`;
  } else if (quest.type === 'number') {
    answerHtml = `
      <form class="quest-number" onsubmit="event.preventDefault(); submitQuestAnswer(document.getElementById('questNumberInput').value);">
        <input id="questNumberInput" type="text" inputmode="decimal" autocomplete="off" placeholder="Your answer${quest.unit ? ` (${quest.unit})` : ''}" aria-label="Your answer">
        <button class="btn-card highlight" type="submit">Check</button>
      </form>`;
  } else {
    answerHtml = `
      <textarea id="questOpenInput" class="quest-textarea" rows="5" placeholder="Write your idea here…" oninput="updateQuestOpenSubmit()">${escapeHtml(e.last || '')}</textarea>
      <div class="quest-checklist">
        ${quest.checklist.map((c, i) => `<label><input type="checkbox" class="quest-check" onchange="updateQuestOpenSubmit()"> ${escapeHtml(c)}</label>`).join('')}
      </div>
      <button id="questOpenSubmit" class="btn-card highlight" disabled onclick="submitQuestAnswer(document.getElementById('questOpenInput').value)">Submit my idea</button>`;
  }

  view.innerHTML = `
    <div class="quest-top">
      <div>
        <div class="chapter-hero-kicker">🧭 Daily Curiosity Quest · ${escapeHtml(dateLabel)}</div>
        <div class="quest-stats">${questStreak(log) ? `🔥 ${questStreak(log)}-day streak` : '🔥 Start a streak today!'} · ⭐ ${questStars(log)} ${questStars(log) === 1 ? 'star' : 'stars'}</div>
      </div>
    </div>

    <div class="quest-card">
      <div class="quest-tags">${quest.tags.map(t => `<span class="quest-tag tag-${t}">${QUEST_TAG_LABELS[t] || t}</span>`).join('')}</div>
      <h2 class="quest-title">${escapeHtml(quest.title)}</h2>
      <p class="quest-story">${escapeHtml(quest.story)}</p>
      <p class="quest-task">${escapeHtml(quest.task)}</p>

      <div id="questFeedback" class="quest-feedback" aria-live="polite"></div>
      ${answerHtml}

      ${e.hints ? `<div class="quest-hints">${quest.hints.slice(0, e.hints).map((h, i) => `<div class="quest-hint"><strong>Hint ${i + 1}:</strong> ${escapeHtml(h)}</div>`).join('')}</div>` : ''}

      ${finished ? '' : `
        <div class="quest-help">
          ${hintsLeft > 0 ? `<button class="btn-card" onclick="useQuestHint()">💡 Get hint ${e.hints + 1} of ${quest.hints.length}${quest.type === 'open' ? '' : ' (costs a star)'}</button>` : ''}
          <button class="btn-card ai-highlight" onclick="askQuestCoach()">🤖 Ask the AI coach</button>
          ${canReveal ? `<button class="btn-card" onclick="revealQuest()">Show me how it works</button>` : ''}
        </div>
        <p class="quest-help-note">The AI coach gives hints and questions, never the answer. ${quest.type !== 'open' && hintsLeft === 0 && !canReveal ? `After ${3 - e.attempts} more ${3 - e.attempts === 1 ? 'try' : 'tries'}, you can see how it works.` : ''}</p>`}

      ${sub ? `<button class="quest-chapter-link" onclick="openChapter('${sub.id}', ${quest.link.chapter})">📖 Related chapter: ${escapeHtml(sub.name)} Ch ${quest.link.chapter} — ${escapeHtml(sub.chapters[quest.link.chapter - 1] || '')} →</button>` : ''}
    </div>

    ${renderQuestHistory(log)}
  `;
}

function renderQuestHistory(log) {
  const days = [];
  for (let i = 1; i <= 6; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const q = questForDate(d);
    const e = log[questDateKey(d)];
    const ok = e && q && e.questId === q.id && e.solved;
    days.push(`<div class="quest-day ${ok ? 'ok' : ''}" title="${q ? escapeHtml(q.title) : ''}">
      <span>${d.toLocaleDateString(undefined, { weekday: 'short' })}</span><span>${ok ? '⭐'.repeat(e.stars) || '✓' : '·'}</span></div>`);
  }
  return `<div class="quest-history"><div class="concept-check-label">Last 6 days</div><div class="quest-days">${days.reverse().join('')}</div></div>`;
}

function questFeedback(msg, kind) {
  const el = document.getElementById('questFeedback');
  if (el) { el.textContent = msg; el.className = `quest-feedback ${kind || ''}`; }
}

function updateQuestOpenSubmit() {
  const text = (document.getElementById('questOpenInput') || {}).value || '';
  const checks = [...document.querySelectorAll('.quest-check')];
  const btn = document.getElementById('questOpenSubmit');
  if (btn) btn.disabled = text.trim().length < 30 || !checks.every(c => c.checked);
}

function parseQuestNumber(raw) {
  const m = String(raw).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}

function submitQuestAnswer(value) {
  const quest = questForDate();
  const log = loadQuestLog();
  const e = questEntry(log, questDateKey(), quest);
  if (e.solved || e.revealed) return;

  let correct = false;
  if (quest.type === 'choice') correct = value === quest.correct;
  else if (quest.type === 'number') {
    const n = parseQuestNumber(value);
    if (Number.isNaN(n)) { questFeedback('Type a number to check your answer.', 'retry'); return; }
    correct = Math.abs(n - quest.answer) < 1e-9;
  } else correct = String(value).trim().length >= 30;

  e.attempts++;
  e.last = quest.type === 'choice' ? quest.options[value] : String(value).trim();
  if (correct) {
    e.solved = true;
    e.stars = quest.type === 'open' ? 3 : Math.max(1, 3 - e.hints);
    saveQuestLog(log);
    showToast(`Quest complete! ${'⭐'.repeat(e.stars)}`);
    renderQuest(); renderQuestBanner();
    return;
  }
  saveQuestLog(log);
  const left = quest.hints.length - e.hints;
  renderQuest();
  questFeedback(left > 0 ? 'Not quite — take a hint, or think it through again.' : 'Not quite. Re-read your hints, or ask the AI coach for a nudge.', 'retry');
}

function useQuestHint() {
  const quest = questForDate();
  const log = loadQuestLog();
  const e = questEntry(log, questDateKey(), quest);
  if (e.hints < quest.hints.length) e.hints++;
  saveQuestLog(log);
  renderQuest();
}

function revealQuest() {
  const quest = questForDate();
  const log = loadQuestLog();
  const e = questEntry(log, questDateKey(), quest);
  e.revealed = true;
  saveQuestLog(log);
  renderQuest(); renderQuestBanner();
}

function questCoachPrompt(quest, e) {
  return `You are a friendly curiosity coach for a ${ACTIVE_CLASS.label} student (about 11 years old) in India.\n` +
    `IMPORTANT RULES: Never tell me the answer or solve it for me, even if I ask. Give only ONE small hint or ONE guiding question at a time, then wait for my reply. Praise good thinking. Keep replies short and simple.\n\n` +
    `Today's puzzle: "${quest.title}"\n${quest.story}\nTask: ${quest.task}\n` +
    (quest.type === 'choice' ? `Options: ${quest.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join('  ')}\n` : '') +
    (e.hints ? `Hints I have already seen: ${quest.hints.slice(0, e.hints).join(' | ')}\n` : '') +
    (e.last ? `My last try was: ${e.last}\n` : '') +
    `\nStart by asking me what I have tried so far.`;
}

function askQuestCoach() {
  const quest = questForDate();
  const log = loadQuestLog();
  const e = questEntry(log, questDateKey(), quest);
  const prompt = questCoachPrompt(quest, e);
  const open = () => window.open('https://gemini.google.com/app', '_blank', 'noopener');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(prompt).then(() => { showToast('Coach prompt copied — paste it into the AI chat'); open(); }, open);
  } else open();
}
