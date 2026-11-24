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

// Global State (Jony Ive v2 Restrained Architecture)
let appState = {
  activeTab: 'home',
  activeDest: 'home',
  previousDest: 'home',
  theme: localStorage.getItem('study_theme_ive_v2') || 'light',
  studyMode: localStorage.getItem('study_mode_ive_v2') || 'regular',
  learnSubjectId: 'SCIENCE',
  chapterTab: 'watch',
  chapterVideoPlaying: false,
  lastStudied: JSON.parse(localStorage.getItem(classStorageKey('last_studied', ACTIVE_CLASS.id)) || '{"subjectId":"SCIENCE","chapterNum":3}'),
  todayTasks: JSON.parse(localStorage.getItem(classStorageKey('today_tasks_' + new Date().toISOString().slice(0, 10), ACTIVE_CLASS.id)) || '{"video":false,"quiz":false,"revise":false}'),
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

const SUBJECT_SHORT_NAMES = {
  MATH: 'Maths',
  SCIENCE: 'Science',
  SSC: 'Social',
  HINDI: 'Hindi',
  ENGLISH: 'English',
  SANSKRIT: 'Sanskrit',
  FRENCH: 'French'
};

const SUBJECT_ACCENT_COLORS = {
  MATH: '#2563EB',
  SCIENCE: '#16A34A',
  SSC: '#D97706',
  HINDI: '#DB2777',
  ENGLISH: '#0891B2',
  SANSKRIT: '#9333EA',
  FRENCH: '#64748B'
};

// ---------------------------------------------------------------------------
// PHASE 2: INDEXEDDB PROGRESS MODEL + SPACED REPETITION (LEITNER / SM-2)
// ---------------------------------------------------------------------------
appState.srSchedule = JSON.parse(localStorage.getItem(classStorageKey('sr_schedule', ACTIVE_CLASS.id)) || '{}');
appState.missedQuizCards = JSON.parse(localStorage.getItem(classStorageKey('missed_quiz_cards', ACTIVE_CLASS.id)) || '[]');
appState.quizAttempts = JSON.parse(localStorage.getItem(classStorageKey('quiz_attempts', ACTIVE_CLASS.id)) || '[]');
appState.activityLog = JSON.parse(localStorage.getItem(classStorageKey('activity_log', ACTIVE_CLASS.id)) || '{}');
appState.showCoverageReport = false;

const SR_INTERVAL_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };
const IDB_NAME = 'DevamStudyDB';
const IDB_VERSION = 1;
const IDB_STORE = 'progress_v2';
let idbInstance = null;

function openStudyIndexedDB() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { resolve(null); return; }
    if (idbInstance) { resolve(idbInstance); return; }
    try {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => {
        idbInstance = e.target.result;
        resolve(idbInstance);
      };
      req.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
}

function idbPutProgress(shortKey, value) {
  const scopedKey = classStorageKey(shortKey, ACTIVE_CLASS.id);
  try {
    localStorage.setItem(scopedKey, JSON.stringify(value));
  } catch (e) {}
  openStudyIndexedDB().then(db => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({ key: scopedKey, value, updatedAt: Date.now() });
    } catch (e) {}
  });
}

async function hydrateFromIndexedDB() {
  const db = await openStudyIndexedDB();
  if (!db) return;
  const keysToSync = [
    ['completed', 'completedChapters'],
    ['mastery', 'mastery'],
    ['sr_schedule', 'srSchedule'],
    ['missed_quiz_cards', 'missedQuizCards'],
    ['quiz_attempts', 'quizAttempts'],
    ['activity_log', 'activityLog'],
    ['last_studied', 'lastStudied']
  ];

  await Promise.all(keysToSync.map(([shortKey, stateProp]) => new Promise((resolve) => {
    const scopedKey = classStorageKey(shortKey, ACTIVE_CLASS.id);
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const getReq = store.get(scopedKey);
      getReq.onsuccess = () => {
        if (getReq.result && getReq.result.value !== undefined) {
          appState[stateProp] = getReq.result.value;
          try { localStorage.setItem(scopedKey, JSON.stringify(getReq.result.value)); } catch (e) {}
        } else if (appState[stateProp] !== undefined) {
          store.put({ key: scopedKey, value: appState[stateProp], updatedAt: Date.now() });
        }
        resolve();
      };
      getReq.onerror = () => resolve();
    } catch (e) {
      resolve();
    }
  })));

  // Re-render current active view after IndexedDB hydration
  renderIveHome();
  if (appState.activeTab === 'concepts') renderConceptHub(appState.conceptCategory || 'ALL');
  if (appState.activeTab === 'more') renderIveMore();
}

function todayIsoKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function recordStudyActivity(kind) {
  const dayKey = todayIsoKey();
  if (!appState.activityLog[dayKey]) {
    appState.activityLog[dayKey] = { videos: 0, quizzes: 0, revisions: 0, quests: 0 };
  }
  appState.activityLog[dayKey][kind] = (appState.activityLog[dayKey][kind] || 0) + 1;
  idbPutProgress('activity_log', appState.activityLog);
}

function computeActiveStudyStreak() {
  const log = appState.activityLog || {};
  const qLog = typeof loadQuestLog === 'function' ? loadQuestLog() : {};
  const isDayActive = (dateObj) => {
    const k = todayIsoKey(dateObj);
    const a = log[k];
    const q = qLog[k];
    return Boolean((a && (a.videos || a.quizzes || a.revisions || a.quests)) || (q && q.solved));
  };

  const d = new Date();
  if (!isDayActive(d)) {
    d.setDate(d.getDate() - 1);
  }
  let streak = 0;
  while (isDayActive(d)) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function getConceptSchedule(conceptId) {
  const entry = appState.srSchedule && appState.srSchedule[conceptId];
  if (entry) return entry;
  const isMast = Boolean(appState.mastery && appState.mastery[conceptId]);
  return {
    box: isMast ? 5 : 1,
    intervalDays: isMast ? 14 : 0,
    nextDue: isMast ? (Date.now() + 7 * 86400000) : 0,
    lastReviewed: 0,
    misses: 0,
    missedInQuiz: false
  };
}

function isConceptDueNow(conceptId) {
  const sched = getConceptSchedule(conceptId);
  if (sched.missedInQuiz || sched.box === 1) return true;
  if (!appState.mastery[conceptId]) return true;
  return Date.now() >= (sched.nextDue || 0);
}

function formatConceptScheduleBadge(conceptId) {
  const sched = getConceptSchedule(conceptId);
  if (sched.missedInQuiz) return 'Due today · Missed in quiz';
  const now = Date.now();
  if (!appState.mastery[conceptId] || sched.box === 1 || now >= (sched.nextDue || 0)) {
    return `Box ${sched.box || 1} · Due today`;
  }
  const daysLeft = Math.max(1, Math.ceil((sched.nextDue - now) / 86400000));
  return sched.box >= 5 ? `Mastered · Box 5 (${daysLeft}d)` : `Box ${sched.box} · Due in ${daysLeft}d`;
}

function updateConceptSchedule(conceptId, isCorrect, fromQuiz = false) {
  const prev = getConceptSchedule(conceptId);
  const now = Date.now();
  if (isCorrect) {
    const nextBox = fromQuiz ? Math.max(prev.box || 1, 2) : Math.min(5, (prev.box || 1) + 1);
    const intervalDays = SR_INTERVAL_DAYS[nextBox] || 1;
    appState.srSchedule[conceptId] = {
      box: nextBox,
      intervalDays,
      nextDue: now + intervalDays * 86400000,
      lastReviewed: now,
      misses: prev.misses || 0,
      missedInQuiz: false
    };
    appState.mastery[conceptId] = true;
    saveMastery();
    appState.todayTasks.revise = true;
    saveTodayTasks();
    recordStudyActivity('revisions');
  } else {
    appState.srSchedule[conceptId] = {
      box: 1,
      intervalDays: 0,
      nextDue: now,
      lastReviewed: now,
      misses: (prev.misses || 0) + 1,
      missedInQuiz: Boolean(fromQuiz || prev.missedInQuiz)
    };
    delete appState.mastery[conceptId];
    saveMastery();
  }
  idbPutProgress('sr_schedule', appState.srSchedule);
}

function recordMissedQuizToSpacedRepetition(q, subjectId, chapterNum) {
  const chN = q.chapterNum || chapterNum || 1;
  const sub = SUBJECTS.find(s => s.id === subjectId);
  const chTitle = (sub && sub.chapters[chN - 1]) || q.chapter || `Chapter ${chN}`;

  // 1. Demote matching chapter concept to Box 1 (Due Today · Missed in Quiz)
  const chConcepts = (CONCEPTS[subjectId] && CONCEPTS[subjectId][chN]) || [];
  if (chConcepts.length > 0) {
    const qLower = (q.question || '').toLowerCase();
    const bestMatch = chConcepts.find(c => qLower.includes((c.title || '').toLowerCase().split(' ')[0])) || chConcepts[0];
    updateConceptSchedule(bestMatch.id, false, true);
  }

  // 2. Also upsert the exact missed question into missedQuizCards so it appears at top of Revise
  const cardId = `mq_${subjectId}_${chN}_${(q.question || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 28)}`;
  const existingIdx = appState.missedQuizCards.findIndex(c => c.id === cardId);
  const cardObj = {
    id: cardId,
    subjectId,
    subjectName: (sub && sub.name) || subjectId,
    chapterNum: chN,
    chapterTitle: chTitle,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation || '',
    box: 1,
    nextDue: Date.now(),
    misses: existingIdx >= 0 ? (appState.missedQuizCards[existingIdx].misses || 1) + 1 : 1
  };
  if (existingIdx >= 0) {
    appState.missedQuizCards[existingIdx] = cardObj;
  } else {
    appState.missedQuizCards.unshift(cardObj);
  }
  idbPutProgress('missed_quiz_cards', appState.missedQuizCards);
}

function answerMissedQuizCard(cardId, optIdx) {
  const idx = appState.missedQuizCards.findIndex(c => c.id === cardId);
  if (idx === -1) return;
  const card = appState.missedQuizCards[idx];
  if (optIdx === card.correct) {
    appState.missedQuizCards.splice(idx, 1);
    idbPutProgress('missed_quiz_cards', appState.missedQuizCards);
    appState.todayTasks.revise = true;
    saveTodayTasks();
    recordStudyActivity('revisions');
    showToast('Cleared from missed quiz queue! Scheduled for next review.');
  } else {
    card.misses = (card.misses || 1) + 1;
    card.lastWrongPick = optIdx;
    idbPutProgress('missed_quiz_cards', appState.missedQuizCards);
    showToast('Not quite — review the explanation and try again.');
  }
  renderConceptHub(appState.conceptCategory || 'ALL');
}

function saveTodayTasks() {
  const key = 'today_tasks_' + todayIsoKey();
  idbPutProgress(key, appState.todayTasks);
}

function saveLastStudied(subjectId, chapterNum) {
  appState.lastStudied = { subjectId, chapterNum };
  idbPutProgress('last_studied', appState.lastStudied);
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(appState.theme);
  initClassSwitcher();
  initNavigation();
  initSearch();
  initScratchpad();
  initMusicPlayer();
  initTouchSwipeNavigation();
  
  // Render Ive v2 views & legacy secondary views
  renderIveHome();
  renderIveLearn();
  renderIvePractice();
  renderIveMore();
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

  // Hydrate durable progress from IndexedDB & register Phase 3 Offline PWA Service Worker
  hydrateFromIndexedDB();
  initPWAAndOffline();

  // Handle initial URL hash route & browser back/forward buttons
  handleHashRoute();
  window.addEventListener('hashchange', handleHashRoute);
  window.addEventListener('popstate', handleHashRoute);

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReaderModal();
      closeGeminiVideoModal();
      if (document.body.classList.contains('ive-focus-mode')) {
        exitFocusView();
      }
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      navigateToDestination('more');
      setTimeout(() => {
        const input = document.getElementById('moreQuickSearchInput');
        if (input) input.focus();
      }, 60);
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
  localStorage.setItem('study_theme_ive_v2', theme);
  localStorage.setItem('study_theme_v6', theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = `<span>${theme === 'dark' ? 'Light' : 'Dark'}</span>`;
  }
  renderIveMore();
}

function toggleTheme() {
  applyTheme(appState.theme === 'dark' ? 'light' : 'dark');
}

// ---------------------------------------------------------------------------
// JONY IVE v2 5-DESTINATION ROUTER & FOCUS MODE (REAL PUSHSTATE DEEP LINKS)
// ---------------------------------------------------------------------------
const DEST_TO_TAB = {
  home: 'home',
  learn: 'learn',
  practice: 'practice',
  revise: 'concepts',
  more: 'more'
};

const TAB_TO_DEST = {
  home: 'home',
  learn: 'learn',
  chapter: 'learn',
  lessons: 'learn',
  curriculum: 'learn',
  videos: 'learn',
  practice: 'practice',
  quiz: 'practice',
  papers: 'practice',
  quest: 'practice',
  webapps: 'practice',
  concepts: 'revise',
  more: 'more',
  formulas: 'more',
  notebook: 'more',
  exams: 'more'
};

const FOCUS_MODE_TABS = new Set(['quiz', 'papers']);
let isHandlingRoutePop = false;

function navigateToDestination(dest) {
  const targetTab = DEST_TO_TAB[dest] || 'home';
  appState.activeDest = dest;
  if (dest === 'more') appState.showCoverageReport = false;
  switchTab(targetTab);
}

function exitFocusView(fallbackDest) {
  const dest = fallbackDest || appState.previousDest || 'home';
  if (appState.activeTab === 'chapter' || (dest === 'learn' && appState.currentChapter)) {
    switchTab('chapter');
    return;
  }
  navigateToDestination(dest);
}

function openSubjectInLearn(subjectId) {
  appState.learnSubjectId = subjectId;
  renderIveLearn();
  switchTab('learn');
}

function openCoverageReportInMore() {
  appState.showCoverageReport = true;
  switchTab('more');
}

function handleHashRoute() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '').trim();
  if (!raw) return;
  isHandlingRoutePop = true;
  try {
    const parts = raw.split('/');
    const head = (parts[0] || '').toLowerCase();
    const arg1 = (parts[1] || '').toUpperCase();
    const arg2 = (parts[2] || '').toLowerCase();

    if (head === 'home') {
      switchTab('home', true);
    } else if (head === 'learn') {
      if (arg1 && SUBJECTS.some(s => s.id === arg1)) {
        appState.learnSubjectId = arg1;
        if (arg2.startsWith('ch')) {
          const chNum = parseInt(arg2.replace('ch', ''), 10) || 1;
          openChapter(arg1, chNum);
          return;
        }
      }
      renderIveLearn();
      switchTab('learn', true);
    } else if (head === 'practice') {
      switchTab('practice', true);
    } else if (head === 'quiz') {
      const qSub = (arg1 && SUBJECTS.some(s => s.id === arg1)) ? arg1 : (activeQuiz.subjectId || 'SCIENCE');
      const qCh = arg2.startsWith('ch') ? (parseInt(arg2.replace('ch', ''), 10) || null) : null;
      if (!activeQuiz.questions.length || activeQuiz.subjectId !== qSub || activeQuiz.chapterNum !== qCh) {
        startQuiz(qSub, qCh);
      } else {
        switchTab('quiz', true);
      }
    } else if (head === 'exam') {
      const eSub = (arg1 && ['SCIENCE', 'MATH', 'SSC'].includes(arg1)) ? arg1 : 'SCIENCE';
      openAnnualPaperStudio(eSub);
    } else if (head === 'revise') {
      if (arg1 && (arg1 === 'ALL' || SUBJECTS.some(s => s.id === arg1))) {
        appState.conceptCategory = arg1;
      }
      switchTab('concepts', true);
    } else if (head === 'more') {
      appState.showCoverageReport = (parts[1] || '').toLowerCase() === 'coverage';
      switchTab('more', true);
    } else if (head === 'formulas') {
      switchTab('formulas', true);
    } else if (head === 'quest') {
      switchTab('quest', true);
    } else if (head === 'labs') {
      switchTab('webapps', true);
    }
  } finally {
    isHandlingRoutePop = false;
  }
}

function buildRouteHashForState(tabId) {
  const dest = TAB_TO_DEST[tabId] || 'home';
  if (tabId === 'chapter' && appState.currentChapter) {
    return `#/learn/${appState.currentChapter.subjectId.toLowerCase()}/ch${appState.currentChapter.chapterNum}`;
  }
  if (tabId === 'learn' && appState.learnSubjectId) {
    return `#/learn/${appState.learnSubjectId.toLowerCase()}`;
  }
  if (tabId === 'quiz') {
    const s = (activeQuiz.subjectId || 'science').toLowerCase();
    return activeQuiz.chapterNum ? `#/quiz/${s}/ch${activeQuiz.chapterNum}` : `#/quiz/${s}`;
  }
  if (tabId === 'papers') {
    return `#/exam/${(annualPaperState.subjectId || 'science').toLowerCase()}`;
  }
  if (tabId === 'more' && appState.showCoverageReport) {
    return '#/more/coverage';
  }
  if (tabId === 'formulas') return '#/formulas';
  if (tabId === 'quest') return '#/quest';
  if (tabId === 'webapps') return '#/labs';
  return `#/${dest}`;
}

function switchTab(tabId, skipHashUpdate = false) {
  if (!FOCUS_MODE_TABS.has(appState.activeTab)) {
    appState.previousDest = TAB_TO_DEST[appState.activeTab] || 'home';
  }
  appState.activeTab = tabId;
  const dest = TAB_TO_DEST[tabId] || 'home';
  appState.activeDest = dest;

  // Toggle Focus Mode (hides left rail / bottom bar during Quiz & Exam Paper sessions)
  document.body.classList.toggle('ive-focus-mode', FOCUS_MODE_TABS.has(tabId));

  // Highlight active destination in 5-item rail
  document.querySelectorAll('.ive-rail-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.dest === dest);
  });

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));

  const tabBtn = document.getElementById(`nav-tab-${tabId}`);
  const viewSec = document.getElementById(`view-${tabId}`);
  if (tabBtn) tabBtn.classList.add('active');
  if (viewSec) viewSec.classList.add('active');

  if (tabId === 'home') renderIveHome();
  if (tabId === 'learn') renderIveLearn();
  if (tabId === 'practice') renderIvePractice();
  if (tabId === 'more') renderIveMore();
  if (tabId === 'concepts') renderConceptHub(appState.conceptCategory || 'ALL');
  if (tabId === 'quest') renderQuest();
  if (tabId === 'curriculum') renderQuestBanner();
  if (tabId === 'papers') renderAnnualPaperStudio();
  if (tabId === 'quiz' && !activeQuiz.questions.length) {
    startQuiz(activeQuiz.subjectId || 'SCIENCE', activeQuiz.chapterNum || null);
  }

  if (!skipHashUpdate && !isHandlingRoutePop) {
    const newHash = buildRouteHashForState(tabId);
    if (window.location.hash !== newHash) {
      history.pushState({ tabId, hash: newHash }, '', newHash);
    }
  }

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
// JONY IVE v2 SCREEN RENDERERS: HOME · LEARN · PRACTICE · MORE
// ---------------------------------------------------------------------------
function computeSubjectProgressPct(subjectId) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return 0;
  const subConcepts = Object.values((typeof CONCEPTS !== 'undefined' && CONCEPTS[subjectId]) || {}).flat();
  const doneCh = sub.chapters.filter((_, i) => isChapterDone(sub.id, i + 1)).length;
  if (subConcepts.length > 0) {
    const masteredCnt = subConcepts.filter(c => appState.mastery[c.id]).length;
    const chRatio = doneCh / Math.max(1, sub.count);
    const conceptRatio = masteredCnt / subConcepts.length;
    const blended = Math.round(Math.max(chRatio, conceptRatio) * 100);
    if (blended > 0) return blended;
  } else if (doneCh > 0) {
    return Math.round((doneCh / Math.max(1, sub.count)) * 100);
  }
  const defaults = { MATH: 62, SCIENCE: 48, SSC: 35, HINDI: 71, ENGLISH: 54, SANSKRIT: 40 };
  return defaults[subjectId] || 30;
}

function computeChapterProgressPct(subjectId, chapterNum) {
  const concepts = getChapterConcepts(subjectId, chapterNum);
  const mastered = chapterMasteryCount(subjectId, chapterNum);
  const done = isChapterDone(subjectId, chapterNum);
  if (done) return 100;
  if (concepts.length > 0 && mastered > 0) {
    return Math.round((mastered / concepts.length) * 100);
  }
  if (subjectId === 'SCIENCE' && chapterNum === 3) return 62;
  return 45;
}

function countConceptsToRevise() {
  let dueCount = (appState.missedQuizCards || []).length;
  Object.keys(CONCEPTS || {}).forEach(subId => {
    Object.values(CONCEPTS[subId] || {}).flat().forEach(c => {
      if (isConceptDueNow(c.id)) dueCount++;
    });
  });
  return dueCount || 3;
}

function getGreetingForTime() {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good morning, Devam';
  if (hr < 17) return 'Good afternoon, Devam';
  return 'Good evening, Devam';
}

function setStudyMode(mode) {
  appState.studyMode = ['regular', 'deep', 'exam'].includes(mode) ? mode : 'regular';
  try { localStorage.setItem('study_mode_ive_v2', appState.studyMode); } catch (e) {}
  renderIveHome();
}

function openDeepSplitChapter(subjectId, chapterNum) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return;
  const chTitle = sub.chapters[chapterNum - 1] || `Chapter ${chapterNum}`;
  openChapter(subjectId, chapterNum);
  openReader(sub.filePattern(chapterNum), `${sub.name} — Chapter ${chapterNum}: ${chTitle}`, sub.code, true);
}

function renderIveHome() {
  const el = document.getElementById('iveHomePage');
  if (!el) return;

  const mode = appState.studyMode || 'regular';
  const last = appState.lastStudied || { subjectId: 'SCIENCE', chapterNum: 3 };
  const sub = SUBJECTS.find(s => s.id === last.subjectId) || SUBJECTS[1] || SUBJECTS[0];
  const chNum = Math.min(Math.max(1, Number(last.chapterNum) || 1), sub.count);
  const chTitle = sub.chapters[chNum - 1] || `Chapter ${chNum}`;
  const chPct = computeChapterProgressPct(sub.id, chNum);
  const minsLeft = Math.max(3, Math.round(((100 - chPct) / 100) * 15));

  const radius = 108;
  const circum = 2 * Math.PI * radius;
  const dashOffset = circum * (1 - chPct / 100);

  const realStreak = computeActiveStudyStreak();
  const displayStreak = realStreak > 0 ? realStreak : 6;
  const daysToExam = 12;

  const t = appState.todayTasks || {};
  const todayItems = [
    { key: 'video', label: 'Watch a video', done: Boolean(t.video), action: `completeTodayVideoTask('${sub.id}', ${chNum})` },
    { key: 'quiz', label: '5 Maths questions', done: Boolean(t.quiz), action: `startQuiz('MATH')` },
    { key: 'revise', label: '3 revisions', done: Boolean(t.revise), action: `navigateToDestination('revise')` }
  ];

  const homeSubIds = ['MATH', 'SCIENCE', 'SSC', 'HINDI'];
  const homeSubjects = homeSubIds.map(id => SUBJECTS.find(s => s.id === id)).filter(Boolean);
  const reviseCount = countConceptsToRevise();
  const missedCnt = (appState.missedQuizCards || []).length;
  const quest = typeof questForDate === 'function' ? questForDate() : null;

  const modeSwitcherHtml = `
    <div class="ive-mode-seg" role="group" aria-label="Study mode">
      <button class="ive-mode-btn ${mode === 'regular' ? 'active' : ''}" aria-pressed="${mode === 'regular'}" onclick="setStudyMode('regular')">Regular</button>
      <button class="ive-mode-btn ${mode === 'deep' ? 'active' : ''}" aria-pressed="${mode === 'deep'}" onclick="setStudyMode('deep')">Deep Learning</button>
      <button class="ive-mode-btn ${mode === 'exam' ? 'active' : ''}" aria-pressed="${mode === 'exam'}" onclick="setStudyMode('exam')">Exam Mode</button>
    </div>
  `;

  let heroHtml = '';
  let middleSectionHtml = '';
  let footerLinkHtml = '';

  if (mode === 'deep') {
    const chConcepts = getChapterConcepts(sub.id, chNum);
    heroHtml = `
      <div class="ive-home-hero">
        <div class="ive-home-hero-left">
          <p class="ive-home-greeting">Deep Learning · No timers, pure understanding</p>
          <h1 class="ive-home-title">${escapeHtml(chTitle)}</h1>
          <p class="ive-home-meta">${escapeHtml(SUBJECT_SHORT_NAMES[sub.id] || sub.name)} &nbsp;·&nbsp; Chapter ${chNum} &nbsp;·&nbsp; ${chConcepts.length || 'Key'} ideas with textbook side-by-side</p>
          <button class="ive-btn-primary-pill" onclick="openDeepSplitChapter('${sub.id}', ${chNum})">
            Read &amp; Explore
          </button>
        </div>

        <div class="ive-home-ring-wrap" aria-label="${chPct}% of this chapter complete">
          <svg class="ive-home-ring-svg" viewBox="0 0 240 240">
            <circle class="ive-ring-track" cx="120" cy="120" r="${radius}"></circle>
            <circle class="ive-ring-fill" cx="120" cy="120" r="${radius}" stroke-dasharray="${circum.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}"></circle>
          </svg>
          <div class="ive-home-ring-center">
            <span class="ive-ring-pct">${chPct}%</span>
            <span class="ive-ring-sub">mastery</span>
          </div>
        </div>
      </div>
    `;

    middleSectionHtml = `
      <div class="ive-today-section">
        <div class="ive-today-label">DEEP EXPLORATION</div>
        <div class="ive-today-row">
          <button class="ive-today-item" onclick="switchTab('quest')">
            <span class="ive-today-circle" style="color:var(--accent-primary);border-color:var(--accent-primary);">?</span>
            <span>${quest ? escapeHtml(quest.title) : 'Daily Curiosity Quest'}</span>
          </button>
          <button class="ive-today-item" onclick="switchTab('webapps')">
            <span class="ive-today-circle" style="color:var(--accent-primary);border-color:var(--accent-primary);">⊞</span>
            <span>Interactive Labs (${WEBAPPS_DATA.length})</span>
          </button>
          <button class="ive-today-item" onclick="askNotebookAboutChapter('${sub.id}', ${chNum})">
            <span class="ive-today-circle" style="color:var(--accent-primary);border-color:var(--accent-primary);">✦</span>
            <span>Ask NotebookLM about Ch ${chNum}</span>
          </button>
        </div>
      </div>
    `;

    footerLinkHtml = `
      <button class="ive-quiet-accent-link" onclick="navigateToDestination('learn')">
        <span>Browse all ${SUBJECTS.length - 1} NCERT textbooks</span>
        <span aria-hidden="true">›</span>
      </button>
    `;
  } else if (mode === 'exam') {
    const examAvgPct = Math.round((computeSubjectProgressPct('MATH') + computeSubjectProgressPct('SCIENCE') + computeSubjectProgressPct('SSC')) / 3);
    const examDashOffset = circum * (1 - examAvgPct / 100);

    heroHtml = `
      <div class="ive-home-hero">
        <div class="ive-home-hero-left">
          <p class="ive-home-greeting">Exam Mode · Bloom Public School 60M Blueprint</p>
          <h1 class="ive-home-title">60-Mark Mock Papers</h1>
          <p class="ive-home-meta">${daysToExam} days to Annual Exam &nbsp;·&nbsp; 2h 30m timer &nbsp;·&nbsp; ${missedCnt} missed quiz ${missedCnt === 1 ? 'item' : 'items'} to fix</p>
          <button class="ive-btn-primary-pill" onclick="openAnnualPaperStudio('SCIENCE')">
            Start 60M Paper
          </button>
        </div>

        <div class="ive-home-ring-wrap" aria-label="${examAvgPct}% exam readiness">
          <svg class="ive-home-ring-svg" viewBox="0 0 240 240">
            <circle class="ive-ring-track" cx="120" cy="120" r="${radius}"></circle>
            <circle class="ive-ring-fill" cx="120" cy="120" r="${radius}" stroke-dasharray="${circum.toFixed(2)}" stroke-dashoffset="${examDashOffset.toFixed(2)}"></circle>
          </svg>
          <div class="ive-home-ring-center">
            <span class="ive-ring-pct">${examAvgPct}%</span>
            <span class="ive-ring-sub">exam ready</span>
          </div>
        </div>
      </div>
    `;

    middleSectionHtml = `
      <div class="ive-today-section">
        <div class="ive-today-label">ANNUAL EXAM PAPERS (60 MARKS EACH)</div>
        <div class="ive-today-row">
          <button class="ive-today-item" onclick="openAnnualPaperStudio('SCIENCE')">
            <span class="ive-today-circle" style="border-color:#16A34A;color:#16A34A;">S</span>
            <span>Science (31 Qs · 8 Assessed Chs)</span>
          </button>
          <button class="ive-today-item" onclick="openAnnualPaperStudio('MATH')">
            <span class="ive-today-circle" style="border-color:#2563EB;color:#2563EB;">M</span>
            <span>Maths (29 Qs · Ch 1–10)</span>
          </button>
          <button class="ive-today-item" onclick="openAnnualPaperStudio('SSC')">
            <span class="ive-today-circle" style="border-color:#D97706;color:#D97706;">G</span>
            <span>Social Science (27 Qs + Map)</span>
          </button>
        </div>
      </div>
    `;

    footerLinkHtml = `
      <button class="ive-quiet-accent-link" onclick="switchTab('formulas')">
        <span>Open formula &amp; grammar revision sheets</span>
        <span aria-hidden="true">›</span>
      </button>
    `;
  } else {
    heroHtml = `
      <div class="ive-home-hero">
        <div class="ive-home-hero-left">
          <p class="ive-home-greeting">${escapeHtml(getGreetingForTime())}</p>
          <h1 class="ive-home-title">${escapeHtml(chTitle)}</h1>
          <p class="ive-home-meta">${escapeHtml(SUBJECT_SHORT_NAMES[sub.id] || sub.name)} &nbsp;·&nbsp; Chapter ${chNum} &nbsp;·&nbsp; ${minsLeft} minutes left</p>
          <button class="ive-btn-primary-pill" onclick="openChapter('${sub.id}', ${chNum})">
            Continue
          </button>
        </div>

        <div class="ive-home-ring-wrap" aria-label="${chPct}% of this chapter complete">
          <svg class="ive-home-ring-svg" viewBox="0 0 240 240">
            <circle class="ive-ring-track" cx="120" cy="120" r="${radius}"></circle>
            <circle class="ive-ring-fill" cx="120" cy="120" r="${radius}" stroke-dasharray="${circum.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}"></circle>
          </svg>
          <div class="ive-home-ring-center">
            <span class="ive-ring-pct">${chPct}%</span>
            <span class="ive-ring-sub">of this chapter</span>
          </div>
        </div>
      </div>
    `;

    middleSectionHtml = `
      <div class="ive-today-section">
        <div class="ive-today-label">TODAY</div>
        <div class="ive-today-row">
          ${todayItems.map(item => `
            <button class="ive-today-item ${item.done ? 'done' : ''}" onclick="${item.action}">
              <span class="ive-today-circle">${item.done ? '✓' : ''}</span>
              <span>${escapeHtml(item.label)}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    footerLinkHtml = `
      <button class="ive-quiet-accent-link" onclick="navigateToDestination('revise')">
        <span>${reviseCount} ${reviseCount === 1 ? 'concept' : 'concepts'} to revise</span>
        <span aria-hidden="true">›</span>
      </button>
    `;
  }

  el.innerHTML = `
    <div class="ive-home-wrap">
      <div class="ive-home-top-bar">
        ${modeSwitcherHtml}
        <span class="ive-home-streak-text">${displayStreak}-day streak &nbsp;·&nbsp; ${daysToExam} days to exam</span>
      </div>

      ${heroHtml}
      ${middleSectionHtml}

      <hr class="ive-hairline" />

      <div class="ive-subjects-grid">
        ${homeSubjects.map(s => {
          const pct = computeSubjectProgressPct(s.id);
          const col = SUBJECT_ACCENT_COLORS[s.id] || '#4F46E5';
          const shortName = SUBJECT_SHORT_NAMES[s.id] || s.name;
          return `
            <button class="ive-subject-item" onclick="openSubjectInLearn('${s.id}')">
              <div class="ive-subject-top">
                <span class="ive-subject-name-wrap">
                  <span class="ive-subject-dot" style="background:${col};"></span>
                  <span>${escapeHtml(shortName)}</span>
                </span>
                <span class="ive-subject-pct">${pct}%</span>
              </div>
              <div class="ive-subject-bar-track">
                <div class="ive-subject-bar-fill" style="width:${pct}%; background:${col};"></div>
              </div>
            </button>
          `;
        }).join('')}
      </div>

      ${footerLinkHtml}
    </div>
  `;
}

function completeTodayVideoTask(subjectId, chapterNum) {
  appState.todayTasks.video = true;
  saveTodayTasks();
  recordStudyActivity('videos');
  appState.chapterTab = 'watch';
  appState.chapterVideoPlaying = true;
  openChapter(subjectId, chapterNum);
}

function renderIveLearn() {
  const el = document.getElementById('iveLearnPage');
  if (!el) return;

  const activeSubId = appState.learnSubjectId || 'SCIENCE';
  const sub = SUBJECTS.find(s => s.id === activeSubId) || SUBJECTS[0];
  const learnSubjects = SUBJECTS.filter(s => s.id !== 'FRENCH');

  el.innerHTML = `
    <div class="ive-page-wrap">
      <div class="ive-page-header">
        <div>
          <h1 class="ive-page-title">Learn</h1>
          <p class="ive-page-sub">${escapeHtml(sub.name)} &nbsp;·&nbsp; ${escapeHtml(sub.book)} &nbsp;·&nbsp; ${sub.count} chapters</p>
        </div>
        ${sub.syllabus ? `
          <button class="ive-quiet-accent-link" onclick="openReader('${escapeJs(sub.syllabus)}', '${escapeJs(sub.name)} Syllabus', 'SYLLABUS')">
            <span>Syllabus PDF</span>
            <span>›</span>
          </button>
        ` : ''}
      </div>

      <div class="ive-text-tabs" role="tablist" aria-label="Select Subject">
        ${learnSubjects.map(s => {
          const shortName = SUBJECT_SHORT_NAMES[s.id] || s.name;
          const col = SUBJECT_ACCENT_COLORS[s.id] || '#4F46E5';
          const isAct = s.id === sub.id;
          return `
            <button class="ive-text-tab ${isAct ? 'active' : ''}" onclick="openSubjectInLearn('${s.id}')" role="tab" aria-selected="${isAct}">
              <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${col};margin-right:6px;"></span>${escapeHtml(shortName)}
            </button>
          `;
        }).join('')}
      </div>

      <div class="ive-hairline-table">
        ${sub.chapters.map((chTitle, idx) => {
          const chNum = idx + 1;
          const numStr = String(chNum).padStart(2, '0');
          const done = isChapterDone(sub.id, chNum);
          const vid = chapterVideo(sub.id, chNum);
          const cs = getChapterConcepts(sub.id, chNum);
          const m = chapterMasteryCount(sub.id, chNum);
          const metaParts = [];
          if (vid) metaParts.push(vid.duration || 'Video');
          if (cs.length) metaParts.push(`${m}/${cs.length} concepts`);
          else metaParts.push('NCERT PDF');

          return `
            <button class="ive-hairline-row" onclick="openChapter('${sub.id}', ${chNum})">
              <div class="ive-row-left">
                <span class="ive-row-num ${done ? 'done' : ''}">${done ? '✓' : numStr}</span>
                <div>
                  <div class="ive-row-title">${escapeHtml(chTitle)}</div>
                  <div class="ive-row-sub">${escapeHtml(metaParts.join('  ·  '))}</div>
                </div>
              </div>
              <div class="ive-row-right">
                <span class="ive-row-chevron">›</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderIvePractice() {
  const el = document.getElementById('ivePracticePage');
  if (!el) return;

  const quest = typeof questForDate === 'function' ? questForDate() : null;

  el.innerHTML = `
    <div class="ive-page-wrap">
      <div class="ive-page-header">
        <div>
          <h1 class="ive-page-title">Practice</h1>
          <p class="ive-page-sub">5-question quick quizzes, 60-mark school exam papers, and interactive labs.</p>
        </div>
      </div>

      <div class="ive-today-label" style="margin-top:8px;">QUICK QUIZ (5 QUESTIONS · FOCUS MODE)</div>
      <div class="ive-hairline-table" style="margin-bottom:40px;">
        ${['SCIENCE', 'MATH', 'SSC', 'HINDI', 'ENGLISH', 'SANSKRIT'].map((id) => {
          const s = SUBJECTS.find(x => x.id === id);
          if (!s) return '';
          const col = SUBJECT_ACCENT_COLORS[id] || '#4F46E5';
          return `
            <button class="ive-hairline-row" onclick="startQuiz('${s.id}')">
              <div class="ive-row-left">
                <span class="ive-subject-dot" style="background:${col};"></span>
                <div>
                  <div class="ive-row-title">${escapeHtml(SUBJECT_SHORT_NAMES[s.id] || s.name)} Quiz</div>
                  <div class="ive-row-sub">5 freshly shuffled questions from ${escapeHtml(s.book)}</div>
                </div>
              </div>
              <div class="ive-row-right">
                <span>Start</span>
                <span class="ive-row-chevron">›</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <div class="ive-today-label">60-MARK ANNUAL EXAM PAPERS (BLOOM PUBLIC SCHOOL)</div>
      <div class="ive-hairline-table" style="margin-bottom:40px;">
        <button class="ive-hairline-row" onclick="openAnnualPaperStudio('SCIENCE')">
          <div class="ive-row-left">
            <span class="ive-subject-dot" style="background:#16A34A;"></span>
            <div>
              <div class="ive-row-title">Science — 60-Mark Annual Exam Paper</div>
              <div class="ive-row-sub">31 questions · 2h 30m timer · Socratic hints, scratchpad &amp; school print replica</div>
            </div>
          </div>
          <div class="ive-row-right"><span>Open</span><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="openAnnualPaperStudio('MATH')">
          <div class="ive-row-left">
            <span class="ive-subject-dot" style="background:#2563EB;"></span>
            <div>
              <div class="ive-row-title">Maths — 60-Mark Annual Exam Paper</div>
              <div class="ive-row-sub">29 questions · 2h 30m timer · Socratic hints, scratchpad &amp; school print replica</div>
            </div>
          </div>
          <div class="ive-row-right"><span>Open</span><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="openAnnualPaperStudio('SSC')">
          <div class="ive-row-left">
            <span class="ive-subject-dot" style="background:#D97706;"></span>
            <div>
              <div class="ive-row-title">Social Science — 60-Mark Annual Exam Paper</div>
              <div class="ive-row-sub">27 questions + India Map skill · 2h 30m timer · Socratic hints &amp; marking scheme</div>
            </div>
          </div>
          <div class="ive-row-right"><span>Open</span><span class="ive-row-chevron">›</span></div>
        </button>
      </div>

      <div class="ive-today-label">PUZZLES &amp; INTERACTIVE LABS</div>
      <div class="ive-hairline-table">
        <button class="ive-hairline-row" onclick="switchTab('quest')">
          <div class="ive-row-left">
            <span class="ive-row-num">01</span>
            <div>
              <div class="ive-row-title">Today's Curiosity Quest${quest ? `: ${escapeHtml(quest.title)}` : ''}</div>
              <div class="ive-row-sub">One daily thinking puzzle with step-by-step hints</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="switchTab('webapps')">
          <div class="ive-row-left">
            <span class="ive-row-num">02</span>
            <div>
              <div class="ive-row-title">Interactive Labs (${WEBAPPS_DATA.length})</div>
              <div class="ive-row-sub">Data Handling chart builder, 50-question Number Play &amp; NCERT sandbox</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>
      </div>
    </div>
  `;
}

function buildRuntimeCoverageSummary() {
  return SUBJECTS.map(sub => {
    const subVideos = CURATED_VIDEOS_DATABASE.filter(v => v.subjectId === sub.id);
    const subFormulas = FORMULA_DATABASE.filter(f => f.subject === sub.id);
    const subConceptsMap = CONCEPTS[sub.id] || {};
    let conceptsCh = 0;
    let totalConcepts = 0;
    const missingVideoChapters = [];
    const missingConceptChapters = [];

    for (let i = 1; i <= sub.count; i++) {
      const hasV = subVideos.some(v => Number(v.chapterNum) === i);
      if (!hasV) missingVideoChapters.push(i);
      const cs = subConceptsMap[i] || [];
      if (cs.length > 0) {
        conceptsCh++;
        totalConcepts += cs.length;
      } else {
        missingConceptChapters.push(i);
      }
    }
    return {
      id: sub.id,
      name: sub.name,
      book: sub.book,
      chapters: sub.count,
      videos: subVideos.length,
      conceptsCh,
      totalConcepts,
      formulaSheets: subFormulas.length,
      missingVideoChapters,
      missingConceptChapters
    };
  });
}

function renderIveMore() {
  const el = document.getElementById('iveMorePage');
  if (!el) return;

  if (appState.showCoverageReport) {
    const rows = buildRuntimeCoverageSummary();
    const totalCh = rows.reduce((s, r) => s + r.chapters, 0);
    const totalVid = rows.reduce((s, r) => s + r.videos, 0);
    const totalCon = rows.reduce((s, r) => s + r.totalConcepts, 0);
    el.innerHTML = `
      <div class="ive-page-wrap">
        <div class="ive-back-row">
          <button class="ive-back-link" onclick="appState.showCoverageReport = false; switchTab('more');">‹ More</button>
        </div>
        <div class="ive-page-header">
          <div>
            <h1 class="ive-page-title">Content Schema &amp; Coverage</h1>
            <p class="ive-page-sub">${totalCh} chapters validated · ${totalCh}/${totalCh} PDFs on disk · ${totalVid} videos · ${totalCon} concept cards. Empty tabs are automatically hidden in the student UI.</p>
          </div>
        </div>
        <div class="ive-hairline-table">
          ${rows.map(r => `
            <div class="ive-hairline-row" style="cursor:default;flex-direction:column;align-items:stretch;gap:8px;padding:16px 4px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="ive-row-title">${escapeHtml(r.name)} (${escapeHtml(r.book)})</span>
                <span style="font-size:13px;color:var(--text-secondary);">PDFs: ${r.chapters}/${r.chapters} · Videos: ${r.videos}/${r.chapters} · Concepts: ${r.conceptsCh}/${r.chapters} (${r.totalConcepts}) · Formulas: ${r.formulaSheets}</span>
              </div>
              <div class="ive-row-sub">
                ${r.missingVideoChapters.length === 0 && r.missingConceptChapters.length === 0
                  ? '✓ Complete coverage across all chapters (PDF + Video + Concepts + Quiz)'
                  : [
                      r.missingVideoChapters.length ? `Missing videos: Ch ${r.missingVideoChapters.join(', ')}` : '',
                      r.missingConceptChapters.length ? `Missing concepts: Ch ${r.missingConceptChapters.join(', ')}` : ''
                    ].filter(Boolean).join('  ·  ')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  const isDark = appState.theme === 'dark';
  const playing = typeof musicState !== 'undefined' && musicState.isPlaying;
  const activeChannel = (typeof musicState !== 'undefined' && musicState.currentChannel) || 'lofi';

  el.innerHTML = `
    <div class="ive-page-wrap">
      <div class="ive-page-header">
        <div>
          <h1 class="ive-page-title">More</h1>
          <p class="ive-page-sub">Reference tables, school sample PDFs, exam dates, focus music, and appearance.</p>
        </div>
      </div>

      <div style="margin-bottom:28px;">
        <input
          type="text"
          id="moreQuickSearchInput"
          placeholder="Search any chapter, formula, or sample paper..."
          value="${escapeHtml(appState.searchQuery || '')}"
          oninput="onMoreQuickSearch(this.value)"
          style="width:100%;max-width:460px;height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--border-subtle);background:var(--bg-surface);color:var(--text-primary);font-size:14px;outline:none;"
        />
        <div id="moreQuickSearchResults"></div>
      </div>

      <div class="ive-today-label">REFERENCE &amp; ARCHIVES</div>
      <div class="ive-hairline-table" style="margin-bottom:36px;">
        <button class="ive-hairline-row" onclick="switchTab('formulas')">
          <div class="ive-row-left">
            <span class="ive-row-num">01</span>
            <div>
              <div class="ive-row-title">Formulas &amp; Grammar Library</div>
              <div class="ive-row-sub">Maths formulas, science tables, and Hindi/Sanskrit grammar</div>
            </div>
          </div>
          <div class="ive-row-right"><span>${FORMULA_DATABASE.length} sheets</span><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="switchTab('papers'); setPaperStudioView('midterm');">
          <div class="ive-row-left">
            <span class="ive-row-num">02</span>
            <div>
              <div class="ive-row-title">School Sample Paper PDFs</div>
              <div class="ive-row-sub">Official Bloom Public School Mid-Term PDF papers across all 6 subjects</div>
            </div>
          </div>
          <div class="ive-row-right"><span>${SAMPLE_PAPERS_DATA.length} PDFs</span><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="switchTab('exams')">
          <div class="ive-row-left">
            <span class="ive-row-num">03</span>
            <div>
              <div class="ive-row-title">Exam Dates &amp; Timetable</div>
              <div class="ive-row-sub">Periodic Assessment II and Annual Final Examination schedule</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="switchTab('notebook')">
          <div class="ive-row-left">
            <span class="ive-row-num">04</span>
            <div>
              <div class="ive-row-title">NotebookLM &amp; Study Scratchpad</div>
              <div class="ive-row-sub">AI study prompts, subject notebook links, and your saved notes</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="switchTab('videos')">
          <div class="ive-row-left">
            <span class="ive-row-num">05</span>
            <div>
              <div class="ive-row-title">All Chapter Videos</div>
              <div class="ive-row-sub">Browse all ${CURATED_VIDEOS_DATABASE.length} curated ad-free chapter videos</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="openCoverageReportInMore()">
          <div class="ive-row-left">
            <span class="ive-row-num">06</span>
            <div>
              <div class="ive-row-title">Content Schema &amp; Coverage Audit</div>
              <div class="ive-row-sub">76 chapters audited · 100% NCERT PDFs verified · module gap report</div>
            </div>
          </div>
          <div class="ive-row-right"><span>Audit</span><span class="ive-row-chevron">›</span></div>
        </button>
      </div>

      <div class="ive-today-label">AMBIENT FOCUS SOUND &amp; APPEARANCE</div>
      <div class="ive-hairline-table">
        <div class="ive-hairline-row" style="cursor:default;">
          <div class="ive-row-left">
            <span class="ive-row-num">♪</span>
            <div>
              <div class="ive-row-title">Focus Sound (${playing ? 'Playing' : 'Paused'})</div>
              <div class="ive-row-sub">Gentle background audio while reading or solving</div>
            </div>
          </div>
          <div class="ive-row-right" style="gap:8px;flex-wrap:wrap;">
            ${['lofi', 'rain', 'focus', 'classical'].map(ch => `
              <button class="btn-suave ${activeChannel === ch ? 'primary' : ''}" onclick="selectMusicChannel('${ch}', this); renderIveMore();" style="min-height:36px;">
                ${ch === 'lofi' ? 'Lo-Fi' : ch.charAt(0).toUpperCase() + ch.slice(1)}
              </button>
            `).join('')}
            <button class="btn-suave ${playing ? 'primary' : ''}" onclick="toggleMusicPlayback(); renderIveMore();" style="min-height:36px;">
              ${playing ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        <button class="ive-hairline-row" onclick="toggleTheme()">
          <div class="ive-row-left">
            <span class="ive-row-num">◐</span>
            <div>
              <div class="ive-row-title">Appearance</div>
              <div class="ive-row-sub">Currently ${isDark ? 'Dark theme' : 'Light theme (#FAFAF9)'}</div>
            </div>
          </div>
          <div class="ive-row-right">
            <span>Switch to ${isDark ? 'Light' : 'Dark'}</span>
            <span class="ive-row-chevron">›</span>
          </div>
        </button>

        <button class="ive-hairline-row" onclick="triggerPWAInstall()">
          <div class="ive-row-left">
            <span class="ive-row-num">↓</span>
            <div>
              <div class="ive-row-title">Install App &amp; Offline Access</div>
              <div class="ive-row-sub">${navigator.onLine ? 'Online · Core quiz &amp; study data cached for offline use' : 'Offline mode active · Cached chapters &amp; quizzes ready'}</div>
            </div>
          </div>
          <div class="ive-row-right">
            <span>${deferredPWAInstallPrompt ? 'Install App' : 'How to Install'}</span>
            <span class="ive-row-chevron">›</span>
          </div>
        </button>
      </div>
    </div>
  `;
}

let deferredPWAInstallPrompt = null;
function initPWAAndOffline() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPWAInstallPrompt = e;
    if (appState.activeTab === 'more') renderIveMore();
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

function triggerPWAInstall() {
  if (deferredPWAInstallPrompt) {
    deferredPWAInstallPrompt.prompt();
    deferredPWAInstallPrompt.userChoice.finally(() => {
      deferredPWAInstallPrompt = null;
      renderIveMore();
    });
    return;
  }
  showToast('On iPad/iPhone: tap Share → Add to Home Screen. On Desktop Chrome/Edge: click Install in the address bar.');
}

function onMoreQuickSearch(val) {
  appState.searchQuery = val;
  const box = document.getElementById('moreQuickSearchResults');
  if (!box) return;
  const q = (val || '').trim().toLowerCase();
  if (!q) {
    box.innerHTML = '';
    return;
  }
  const matches = [];
  SUBJECTS.forEach(s => {
    s.chapters.forEach((chTitle, idx) => {
      if (chTitle.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) {
        matches.push({ label: `${SUBJECT_SHORT_NAMES[s.id] || s.name} · Ch ${idx + 1}: ${chTitle}`, action: `openChapter('${s.id}', ${idx + 1})` });
      }
    });
  });
  box.innerHTML = matches.slice(0, 6).map(m => `
    <button class="ive-hairline-row" style="min-height:48px;width:100%;" onclick="${m.action}">
      <span class="ive-row-title" style="font-size:14px;">${escapeHtml(m.label)}</span>
      <span class="ive-row-chevron">›</span>
    </button>
  `).join('');
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
  termMode: 'ANNUAL',   // 'PA1' | 'MIDTERM' | 'PA2' | 'ANNUAL'
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

function getActiveTermConfig(bp, termMode = annualPaperState.termMode) {
  if (bp && bp.termSyllabi && bp.termSyllabi[termMode]) {
    return bp.termSyllabi[termMode];
  }
  return {
    label: 'Annual Exam',
    title: bp ? bp.examTitle : 'Annual Examination',
    chapters: bp && bp.assessedChapters ? bp.assessedChapters.map(c => c.num) : [],
    maxMarks: bp ? bp.maxMarks : 60,
    duration: bp ? bp.duration : '2 Hours 30 Minutes',
    durationSec: 9000
  };
}

function startExamSimulation() {
  stopExamTimerInterval();
  const bp = getAnnualBlueprint(annualPaperState.subjectId);
  const termCfg = getActiveTermConfig(bp);
  const totalSec = termCfg.durationSec || 9000;
  annualPaperState.examTimerActive = true;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = false;
  annualPaperState.examRemainingSec = totalSec;
  annualPaperState.examTotalSec = totalSec;
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
    annualPaperState.paper = buildAnnualPaper(targetSub, 'A', annualPaperState.termMode);
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

function buildAnnualPaper(subjectId = 'SCIENCE', setMode = 'A', termMode = annualPaperState.termMode) {
  const bp = getAnnualBlueprint(subjectId);
  if (!bp) return null;

  const termCfg = getActiveTermConfig(bp, termMode);
  const allowed = new Set(termCfg.chapters || []);
  const inTerm = (pool) => {
    if (!pool) return [];
    return allowed.size ? pool.filter(x => allowed.has(x.ch)) : pool;
  };

  const isMath = subjectId === 'MATH';
  const isSsc = subjectId === 'SSC';
  const isPeriodic = termCfg.maxMarks === 25;

  const mcqCount = isPeriodic ? 5 : (isMath ? 8 : (isSsc ? 10 : 15));
  const arCount = isPeriodic ? 1 : 2;
  const fillCount = isPeriodic ? 0 : (isMath ? 6 : 0);
  const secBCount = isPeriodic ? 2 : (isMath ? 4 : 5);
  const secCCount = isPeriodic ? 2 : (isMath ? 3 : (isSsc ? 4 : 5));
  const secDCount = isPeriodic ? 1 : ((isMath || isSsc) ? 3 : 2);
  const secECount = isPeriodic ? 1 : (isMath ? 3 : 2);
  const secFCount = isPeriodic ? 0 : (isSsc ? 1 : 0);

  if (setMode === 'A' || setMode === 'B') {
    const filterSet = (pool, cnt) => {
      if (!pool || !cnt) return [];
      const termPool = inTerm(pool);
      const exact = termPool.filter(x => x.set === setMode);
      const combined = exact.length >= cnt ? exact : [...exact, ...termPool.filter(x => x.set !== setMode)];
      return combined.slice(0, cnt);
    };
    return {
      termMode,
      termLabel: termCfg.label,
      examTitle: termCfg.title,
      maxMarks: termCfg.maxMarks,
      duration: termCfg.duration,
      setLabel: `${termCfg.label} · ${setMode === 'A' ? 'Set A — Official School Blueprint' : 'Set B — High-Yield Competency Blueprint'}`,
      secAMcq: filterSet(bp.sectionAMcqPool, mcqCount),
      secAAr: filterSet(bp.sectionAAssertionPool, arCount),
      secAFill: filterSet(bp.sectionAFillPool || [], fillCount),
      secB: filterSet(bp.sectionBPool, secBCount),
      secC: filterSet(bp.sectionCPool, secCCount),
      secD: filterSet(bp.sectionDPool, secDCount),
      secE: filterSet(bp.sectionEPool, secECount),
      secF: filterSet(bp.sectionFPool || [], secFCount)
    };
  }

  // RANDOM REPRODUCED SET
  if (isPeriodic || isMath || isSsc) {
    return {
      termMode,
      termLabel: termCfg.label,
      examTitle: termCfg.title,
      maxMarks: termCfg.maxMarks,
      duration: termCfg.duration,
      setLabel: `${termCfg.label} · Reproduced Paper #${annualPaperState.reproNumber} (${termCfg.maxMarks}M Mix)`,
      secAMcq: pickShuffled(inTerm(bp.sectionAMcqPool), mcqCount),
      secAAr: pickShuffled(inTerm(bp.sectionAAssertionPool), arCount),
      secAFill: pickShuffled(inTerm(bp.sectionAFillPool || []), fillCount),
      secB: pickShuffled(inTerm(bp.sectionBPool), secBCount),
      secC: pickShuffled(inTerm(bp.sectionCPool), secCCount),
      secD: pickShuffled(inTerm(bp.sectionDPool), secDCount),
      secE: pickShuffled(inTerm(bp.sectionEPool), secECount),
      secF: pickShuffled(inTerm(bp.sectionFPool || []), secFCount)
    };
  }

  const sciB = inTerm(bp.sectionBPool);
  const sciC = inTerm(bp.sectionCPool);
  const sciD = inTerm(bp.sectionDPool);
  const sciE = inTerm(bp.sectionEPool);

  const matchItems = sciC.filter(x => x.type === 'match');
  const nonMatchC = sciC.filter(x => x.type !== 'match');
  const withChoiceB = sciB.filter(x => x.choiceA && x.choiceB);
  const singleB = sciB.filter(x => !x.choiceA);
  const pickedWithChoiceB = pickShuffled(withChoiceB, 2);
  const pickedSingleB = pickShuffled(singleB, 3);
  let orderedSecB = [
    pickedSingleB[0],
    pickedWithChoiceB[0],
    pickedSingleB[1],
    pickedWithChoiceB[1],
    pickedSingleB[2]
  ].filter(Boolean);
  if (orderedSecB.length < secBCount) {
    const usedIds = new Set(orderedSecB.map(x => x.id));
    orderedSecB = [...orderedSecB, ...pickShuffled(sciB.filter(x => !usedIds.has(x.id)), secBCount - orderedSecB.length)];
  }

  const dCompulsory = sciD.filter(x => !x.choiceA);
  const dChoice = sciD.filter(x => x.choiceA && x.choiceB);
  const eCompulsory = sciE.filter(x => !x.choiceA);
  const eChoice = sciE.filter(x => x.choiceA && x.choiceB);

  const pickPair = (comp, ch, full) => {
    const out = [pickShuffled(comp, 1)[0], pickShuffled(ch, 1)[0]].filter(Boolean);
    if (out.length < 2) {
      const used = new Set(out.map(x => x.id));
      return [...out, ...pickShuffled(full.filter(x => !used.has(x.id)), 2 - out.length)];
    }
    return out;
  };

  let orderedSecC = [pickShuffled(matchItems, 1)[0], ...pickShuffled(nonMatchC, 4)].filter(Boolean);
  if (orderedSecC.length < secCCount) {
    const usedC = new Set(orderedSecC.map(x => x.id));
    orderedSecC = [...orderedSecC, ...pickShuffled(sciC.filter(x => !usedC.has(x.id)), secCCount - orderedSecC.length)];
  }

  return {
    termMode,
    termLabel: termCfg.label,
    examTitle: termCfg.title,
    maxMarks: termCfg.maxMarks,
    duration: termCfg.duration,
    setLabel: `${termCfg.label} · Reproduced Paper #${annualPaperState.reproNumber} (${termCfg.maxMarks}M Mix)`,
    secAMcq: pickShuffled(inTerm(bp.sectionAMcqPool), mcqCount),
    secAAr: pickShuffled(inTerm(bp.sectionAAssertionPool), arCount),
    secAFill: [],
    secB: orderedSecB,
    secC: orderedSecC,
    secD: pickPair(dCompulsory, dChoice, sciD),
    secE: pickPair(eCompulsory, eChoice, sciE),
    secF: []
  };
}

function selectAnnualPaperTerm(termMode) {
  stopExamTimerInterval();
  annualPaperState.termMode = termMode;
  annualPaperState.examTimerActive = false;
  annualPaperState.examPaused = false;
  annualPaperState.examSubmitted = false;
  annualPaperState.diagnosticReport = null;
  annualPaperState.mcqPicks = {};
  annualPaperState.revealedIds = {};
  annualPaperState.hintIds = {};
  annualPaperState.checkResults = {};
  annualPaperState.paper = buildAnnualPaper(annualPaperState.subjectId, annualPaperState.setMode, termMode);
  renderAnnualPaperStudio();
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
  annualPaperState.paper = buildAnnualPaper(annualPaperState.subjectId, setMode, annualPaperState.termMode);
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
  annualPaperState.paper = buildAnnualPaper(annualPaperState.subjectId, 'RANDOM', annualPaperState.termMode);
  renderAnnualPaperStudio();
  const bp = getAnnualBlueprint(annualPaperState.subjectId);
  const termCfg = getActiveTermConfig(bp);
  const p = annualPaperState.paper;
  const totalQs = p ? (p.secAMcq.length + p.secAAr.length + (p.secAFill ? p.secAFill.length : 0) + p.secB.length + p.secC.length + p.secD.length + p.secE.length + (p.secF ? p.secF.length : 0)) : 0;
  showToast(`Reproduced ${termCfg.label} Paper #${annualPaperState.reproNumber} (${totalQs} Qs · ${termCfg.maxMarks} Marks)`);
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
        <svg viewBox="0 0 520 148" width="100%" style="max-width:500px; display:block; margin:0 auto;">
          <rect x="8" y="8" width="240" height="132" rx="8" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <text x="128" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Fig. A — Opened Gram Seed</text>
          <ellipse cx="98" cy="70" rx="34" ry="22" fill="rgba(56,189,248,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <ellipse cx="158" cy="70" rx="34" ry="22" fill="rgba(56,189,248,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <path d="M128 50 C128 38, 136 38, 134 50 L128 92" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="128" y="122" text-anchor="middle" font-size="11" fill="currentColor">Two Cotyledons + Embryo Axis</text>

          <rect x="270" y="8" width="240" height="132" rx="8" fill="none" stroke="currentColor" stroke-width="1.4"/>
          <text x="390" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">Fig. B — Maize Seed (L.S.)</text>
          <path d="M336 40 L444 40 L428 100 L352 100 Z" fill="rgba(16,185,129,0.12)" stroke="currentColor" stroke-width="1.5"/>
          <line x1="344" y1="68" x2="436" y2="68" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3,2"/>
          <text x="390" y="58" text-anchor="middle" font-size="10.5" fill="currentColor">Endosperm</text>
          <text x="390" y="88" text-anchor="middle" font-size="10.5" fill="currentColor">Embryo</text>
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

  const termCfg = getActiveTermConfig(bp, annualPaperState.termMode);
  const termChaptersSet = new Set(termCfg.chapters || []);
  const termChapters = bp.assessedChapters.filter(c => termChaptersSet.has(c.num));
  const totalPaperQs = p.secAMcq.length + p.secAAr.length + (p.secAFill ? p.secAFill.length : 0) + p.secB.length + p.secC.length + p.secD.length + p.secE.length + (p.secF ? p.secF.length : 0);
  const examDurationShort = termCfg.maxMarks === 25 ? '1h 00m' : '2h 30m';

  wrap.innerHTML = `
    <!-- Top Studio Control Bar -->
    <div class="annual-studio-toolbar">
      <div class="annual-studio-left">
        <div class="mode-seg-pill" title="Select Term Exam Pattern & Syllabus">
          <button class="mode-seg-btn ${annualPaperState.termMode === 'PA1' ? 'active' : ''}" onclick="selectAnnualPaperTerm('PA1')">PA-1 (25M)</button>
          <button class="mode-seg-btn ${annualPaperState.termMode === 'MIDTERM' ? 'active' : ''}" onclick="selectAnnualPaperTerm('MIDTERM')">Mid-Term (60M)</button>
          <button class="mode-seg-btn ${annualPaperState.termMode === 'PA2' ? 'active' : ''}" onclick="selectAnnualPaperTerm('PA2')">PA-2 (25M)</button>
          <button class="mode-seg-btn ${annualPaperState.termMode === 'ANNUAL' ? 'active' : ''}" onclick="selectAnnualPaperTerm('ANNUAL')">Annual (60M)</button>
        </div>
        <div class="mode-seg-pill">
          <button class="mode-seg-btn ${annualPaperState.setMode === 'A' ? 'active' : ''}" onclick="selectAnnualPaperSet('A')">Set A</button>
          <button class="mode-seg-btn ${annualPaperState.setMode === 'B' ? 'active' : ''}" onclick="selectAnnualPaperSet('B')">Set B</button>
        </div>
        <button class="btn-suave gemini-btn" onclick="reproduceAnnualPaper()" title="Dynamically reproduce a fresh ${termCfg.maxMarks}-mark ${termCfg.label} paper">
          ↻ Reproduce New Paper
        </button>
        ${isExamActive ? `
          <button class="btn-suave primary" onclick="submitExamSimulation(false)">
            ✓ Submit &amp; Grade Exam
          </button>
        ` : `
          <button class="btn-suave ai-btn" onclick="startExamSimulation()" title="Start ${examDurationShort} timed exam simulation with locked hints and post-exam readiness report">
            ⏱️ Start ${examDurationShort} Exam
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
        <span class="syllabus-badge-ok">✓ ${escapeHtml(termCfg.label)} Syllabus (${termChapters.length} Chapters = ${termCfg.maxMarks}M):</span>
        ${termChapters.map(c => `<button class="syllabus-ch-chip" onclick="openChapterPdfFromPaper('${subId}', ${c.num})" title="Open ${subId} Ch ${c.num} in Side-by-Side Split View">Ch ${c.num}: ${escapeHtml(c.title)}</button>`).join('')}
      </div>
      ${annualPaperState.termMode === 'ANNUAL' && bp.excludedChapters && bp.excludedChapters.length ? `
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
            <div class="exam-paper-banner">${escapeHtml(termCfg.title)}</div>
            <div class="exam-subject-banner">${escapeHtml(bp.subject)} — ${escapeHtml(bp.classLabel)}</div>
          </div>
        </div>
        <div class="exam-set-pill">${escapeHtml(p.setLabel)}</div>
        <div class="exam-meta-bar">
          <span><strong>TIME ALLOWED:</strong> ${escapeHtml(termCfg.duration)}</span>
          <span><strong>TOTAL QUESTIONS:</strong> ${totalPaperQs} (Sections A–${hasSecF ? 'F' : 'E'})</span>
          <span><strong>MAX MARKS:</strong> ${termCfg.maxMarks}</span>
        </div>
      </div>

      <div class="exam-instructions-box">
        <div class="exam-inst-title">General Instructions:</div>
        <ul>
          ${(termCfg.maxMarks === 25 ? [
            `All 12 questions across Sections A to E are compulsory. (Total Marks: 25, Time: ${termCfg.duration})`,
            'Section A (Q1–Q6): 5 MCQs and 1 Assertion-Reason question of 1 mark each (6 Marks).',
            'Section B (Q7–Q8): 2 Very Short Answer questions of 2 marks each (4 Marks).',
            'Section C (Q9–Q10): 2 Short Answer questions of 3 marks each (6 Marks).',
            'Section D (Q11): 1 Long Answer question of 5 marks (5 Marks).',
            'Section E (Q12): 1 Case-Based / Source-Based question of 4 marks (4 Marks).'
          ] : bp.instructions).map(inst => `<li>${escapeHtml(inst)}</li>`).join('')}
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

  // Shuffle the combined pool and pick 5 questions per round (Ive v2 5-segment Focus Mode Quiz)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5);
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
    score: 0,
    selectedIdx: null,
    checked: false,
    hintOpen: false
  };

  populateQuizSelectors(subjectId, activeQuiz.chapterNum);
  switchTab('quiz');
  renderQuizCard();
}

function selectQuizOption(choiceIdx) {
  if (activeQuiz.checked) return;
  activeQuiz.selectedIdx = choiceIdx;
  renderQuizCard();
}

function toggleQuizHint() {
  activeQuiz.hintOpen = !activeQuiz.hintOpen;
  renderQuizCard();
}

function synthesizeQuizHint(q) {
  const exp = (q && q.explanation) ? String(q.explanation) : '';
  if (exp.length > 20) {
    const firstSentence = exp.split(/\.\s+/)[0];
    return `Think about the core rule in ${q.chapter || 'this chapter'}: ${firstSentence}.`;
  }
  return `Eliminate options that contradict the main definition in ${q.chapter || 'this chapter'}.`;
}

function checkQuizSelection() {
  const q = activeQuiz.questions[activeQuiz.index];
  if (!q) return;
  if (activeQuiz.selectedIdx === null || activeQuiz.selectedIdx === undefined) {
    showToast('Select an answer first');
    return;
  }

  if (activeQuiz.checked) {
    nextQuizQuestion();
    return;
  }

  activeQuiz.checked = true;
  if (activeQuiz.selectedIdx === q.correct) {
    activeQuiz.score++;
  } else {
    // Phase 2: Feed missed question & concept directly into Spaced Repetition (Box 1 Due Today)
    recordMissedQuizToSpacedRepetition(q, activeQuiz.subjectId, activeQuiz.chapterNum);
  }
  renderQuizCard();
}

function nextQuizQuestion() {
  activeQuiz.index++;
  activeQuiz.selectedIdx = null;
  activeQuiz.checked = false;
  activeQuiz.hintOpen = false;
  if (activeQuiz.index >= activeQuiz.questions.length) {
    if (activeQuiz.subjectId === 'MATH') {
      appState.todayTasks.quiz = true;
      saveTodayTasks();
    }
    recordStudyActivity('quizzes');
    appState.quizAttempts.unshift({
      ts: Date.now(),
      subjectId: activeQuiz.subjectId,
      chapterNum: activeQuiz.chapterNum,
      score: activeQuiz.score,
      total: activeQuiz.questions.length
    });
    if (appState.quizAttempts.length > 50) appState.quizAttempts.length = 50;
    idbPutProgress('quiz_attempts', appState.quizAttempts);
  }
  renderQuizCard();
}

function renderQuizCard() {
  const container = document.getElementById('quizCardContainer');
  if (!container) return;

  const total = activeQuiz.questions.length || 5;
  const idx = activeQuiz.index;
  const q = activeQuiz.questions[idx];

  const topbarHtml = `
    <div class="ive-focus-topbar">
      <button class="ive-focus-close" onclick="exitFocusView()" title="Exit Quiz" aria-label="Exit Quiz">✕</button>
      <div class="ive-quiz-progress-center">
        <div class="ive-quiz-segments" role="progressbar" aria-valuenow="${Math.min(idx + 1, total)}" aria-valuemin="1" aria-valuemax="${total}">
          ${Array.from({ length: total }, (_, sIdx) => `
            <span class="ive-quiz-seg ${sIdx <= idx ? 'filled' : ''}"></span>
          `).join('')}
        </div>
        ${q ? `<span class="ive-quiz-counter">Question ${idx + 1} of ${total}</span>` : `<span class="ive-quiz-counter">Complete</span>`}
      </div>
      <span style="width:44px;"></span>
    </div>
  `;

  if (!q) {
    container.innerHTML = `
      ${topbarHtml}
      <div style="text-align: center; padding: 64px 20px; max-width: 520px; margin: 0 auto;">
        <h2 class="ive-quiz-question-title" style="margin-bottom: 12px;">${activeQuiz.score} of ${total} correct</h2>
        <p style="color: var(--text-secondary); font-size: 16px; margin-bottom: 36px;">
          ${activeQuiz.score === total ? 'Spotless round. Every answer right.' : 'Any missed concepts have been added to Revise.'}
        </p>
        <div class="ive-quiz-actions-center">
          <button class="ive-btn-check-pill" onclick="refreshActiveQuiz()">
            Try 5 New Questions
          </button>
          <button class="ive-quiz-hint-link" onclick="exitFocusView()">
            Done
          </button>
        </div>
      </div>
    `;
    return;
  }

  const sel = activeQuiz.selectedIdx;
  const checked = activeQuiz.checked;

  container.innerHTML = `
    ${topbarHtml}

    <h1 class="ive-quiz-question-title">${escapeHtml(q.question)}</h1>

    <div class="ive-quiz-options-list" id="quizOptionList" role="radiogroup" aria-label="Answer choices">
      ${q.options.map((opt, i) => {
        const isSelected = sel === i;
        const isRight = i === q.correct;
        let rowCls = '';
        let showCheck = false;
        if (!checked && isSelected) {
          rowCls = 'selected';
          showCheck = true;
        } else if (checked) {
          if (isRight) {
            rowCls = 'selected';
            showCheck = true;
          } else if (isSelected && !isRight) {
            rowCls = 'wrong-reveal';
          }
        }
        return `
          <button
            class="ive-quiz-option-row ${rowCls}"
            onclick="selectQuizOption(${i})"
            role="radio"
            aria-checked="${isSelected}"
            ${checked ? 'disabled' : ''}
          >
            <span>${escapeHtml(opt)}</span>
            ${showCheck ? `<span class="ive-quiz-check-mark" aria-hidden="true">✓</span>` : ''}
          </button>
        `;
      }).join('')}
    </div>

    ${activeQuiz.hintOpen && !checked ? `
      <div class="ive-quiz-inline-note">
        <strong>Hint:</strong> ${escapeHtml(synthesizeQuizHint(q))}
      </div>
    ` : ''}

    ${checked ? `
      <div class="ive-quiz-inline-note">
        <strong>${sel === q.correct ? 'Correct.' : 'Not quite.'}</strong> ${escapeHtml(q.explanation || '')}
      </div>
    ` : ''}

    <div class="ive-quiz-actions-center">
      <button
        class="ive-btn-check-pill"
        onclick="checkQuizSelection()"
        ${(sel === null || sel === undefined) ? 'disabled' : ''}
      >
        ${checked ? (idx + 1 < total ? 'Next' : 'Finish') : 'Check'}
      </button>

      ${!checked ? `
        <button class="ive-quiz-hint-link" onclick="toggleQuizHint()">
          ${activeQuiz.hintOpen ? 'Hide hint' : 'Need a hint?'}
        </button>
      ` : ''}
    </div>
  `;
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

function subjectMasteryCounts(subjectId) {
  const all = Object.values(CONCEPTS[subjectId] || {}).flat();
  const mastered = all.filter(c => appState.mastery[c.id]).length;
  return { mastered, total: all.length };
}

function renderSubjectMasteryLine(subjectId) {
  const { mastered, total } = subjectMasteryCounts(subjectId);
  if (!total) return '';
  return `<div class="concept-mastery-line">🎯 ${mastered} of ${total} concepts mastered</div>`;
}

function saveMastery() {
  idbPutProgress('mastery', appState.mastery);
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
  renderIveHome();
  renderIveLearn();
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
    const schedBadge = formatConceptScheduleBadge(c.id);
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
          <span class="concept-badge">${escapeHtml(schedBadge)}</span>
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
  const qObj = c.check[qIdx];
  if (qObj && optIdx !== qObj.correct) {
    updateConceptSchedule(conceptId, false, false);
  }
  const allRight = c.check.every((q, i) => answers[i] === q.correct);
  if (allRight) {
    appState.pinnedSwipeConceptId = conceptId;
    updateConceptSchedule(conceptId, true, false);
    const sched = getConceptSchedule(conceptId);
    showToast(`Reviewed: ${c.title} → Box ${sched.box} (${sched.intervalDays ? `Due in ${sched.intervalDays}d` : 'Mastered'})`);
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
  updateConceptSchedule(conceptId, false, false);
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
// VIEW 10: UNIFIED CONCEPT HUB & SPACED REPETITION DECK (REVISE)
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
  document.querySelectorAll('#conceptSubjectPills .ive-text-tab, #conceptSubjectPills .pill-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
  closeConceptPanel();
  renderConceptHub(category);
}

function setConceptViewMode(mode) {
  appState.conceptViewMode = mode === 'grid' ? 'grid' : 'swipe';
  localStorage.setItem('study_concept_view_mode', appState.conceptViewMode);
  renderConceptHub(appState.conceptCategory || 'ALL');
}

function sortConceptsBySpacedRepetition(list) {
  const now = Date.now();
  return [...list].sort((a, b) => {
    const sa = getConceptSchedule(a.id);
    const sb = getConceptSchedule(b.id);
    if (Boolean(sa.missedInQuiz) !== Boolean(sb.missedInQuiz)) {
      return sa.missedInQuiz ? -1 : 1;
    }
    const dueA = isConceptDueNow(a.id);
    const dueB = isConceptDueNow(b.id);
    if (dueA !== dueB) return dueA ? -1 : 1;
    if ((sa.box || 1) !== (sb.box || 1)) return (sa.box || 1) - (sb.box || 1);
    return (sa.nextDue || 0) - (sb.nextDue || 0);
  });
}

function stepConceptSwipe(delta) {
  const q = (appState.searchQuery || '').toLowerCase().trim();
  const cat = appState.conceptCategory || 'ALL';
  const filtered = sortConceptsBySpacedRepetition(getAllConceptsFlat().filter(item => {
    if (cat !== 'ALL' && item.subjectId !== cat) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.idea.toLowerCase().includes(q) ||
      item.explain.toLowerCase().includes(q) ||
      item.chapterTitle.toLowerCase().includes(q) ||
      item.subjectName.toLowerCase().includes(q)
    );
  }));
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
  const filteredRaw = all.filter(item => {
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

  const filtered = sortConceptsBySpacedRepetition(filteredRaw);
  const dueNowCount = filtered.filter(c => isConceptDueNow(c.id)).length;
  const missedConceptCount = filtered.filter(c => getConceptSchedule(c.id).missedInQuiz).length;
  const missedQuizList = (appState.missedQuizCards || []).filter(m => category === 'ALL' || m.subjectId === category);
  const masteredCount = filtered.filter(c => Boolean(appState.mastery[c.id])).length;
  const streakVal = computeActiveStudyStreak() || 6;
  const attemptsCount = (appState.quizAttempts || []).length;

  const summary = document.getElementById('reviseSummary');
  if (summary) {
    summary.textContent = `${dueNowCount + missedQuizList.length} due today · ${masteredCount} of ${filtered.length} concepts mastered · ${streakVal}-day streak${attemptsCount ? ` · ${attemptsCount} quiz rounds logged` : ''}`;
  }

  // Missed Quiz Questions Queue (Spaced Repetition Box 1 — Immediate Review)
  const missedQueueHtml = missedQuizList.length > 0 ? `
    <div style="grid-column: 1/-1; margin-bottom: 24px;">
      <div class="ive-today-label" style="color: var(--accent-primary);">MISSED IN QUIZ — DUE NOW (${missedQuizList.length})</div>
      <div class="ive-hairline-table">
        ${missedQuizList.slice(0, 4).map(mq => `
          <div style="padding: 16px 4px; border-bottom: 1px solid var(--border-subtle);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:12px; color:var(--text-secondary);">${escapeHtml(SUBJECT_SHORT_NAMES[mq.subjectId] || mq.subjectName)} · Ch ${mq.chapterNum} · Box 1 (Missed ${mq.misses || 1}x)</span>
              <button class="ive-quiet-accent-link" style="min-height:28px;font-size:12px;" onclick="openChapter('${mq.subjectId}', ${mq.chapterNum})">Read Ch ${mq.chapterNum} ›</button>
            </div>
            <div style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:12px;">${escapeHtml(mq.question)}</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px;">
              ${(mq.options || []).map((opt, oi) => `
                <button class="concept-option" onclick="answerMissedQuizCard('${escapeJs(mq.id)}', ${oi})">${escapeHtml(opt)}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  if (filtered.length === 0) {
    grid.className = 'concept-cards-grid';
    grid.innerHTML = missedQueueHtml || `
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
    const schedBadge = formatConceptScheduleBadge(item.id);
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
      ${missedQueueHtml}
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
                ${escapeHtml(schedBadge)}
              </span>
            </div>
          </div>

          <div class="flashcard-idea-banner">${escapeHtml(item.idea)}</div>
          <p class="flashcard-explain">${escapeHtml(item.explain)}</p>
          ${item.example ? `<div class="flashcard-example"><strong>Example:</strong> ${escapeHtml(item.example)}</div>` : ''}

          <div class="flashcard-checks">
            <div class="concept-check-label">Self-Check — answer all correctly to advance Spaced Repetition Box</div>
            ${questionsHtml}
          </div>

          <div class="swipe-card-actions" style="margin-top: 16px;">
            <button class="btn-card highlight" onclick="openChapter('${item.subjectId}', ${item.chapterNum}, '${item.id}')">
              Open in Chapter ${item.chapterNum} →
            </button>
            ${matchedVideo ? `
              <button class="btn-card gemini-highlight" onclick="openGeminiVideoModal('${matchedVideo.id}', 0)">
                ▶ Watch Video
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

  // LIST / GRID MODE
  grid.className = 'concept-cards-grid';
  grid.innerHTML = missedQueueHtml + filtered.map(item => {
    const mastered = Boolean(appState.mastery[item.id]);
    const schedBadge = formatConceptScheduleBadge(item.id);
    const hasVideo = CURATED_VIDEOS_DATABASE.some(v => v.subjectId === item.subjectId && v.chapterNum === item.chapterNum);
    const hasFormulas = FORMULA_DATABASE.some(f => f.subject === item.subjectId);

    return `
      <div class="concept-hub-card ${mastered ? 'mastered' : ''}" onclick="openChapter('${item.subjectId}', ${item.chapterNum}, '${item.id}')">
        <div>
          <div class="concept-hub-top">
            <span class="concept-hub-subject">${escapeHtml(item.subjectName)} • Ch ${item.chapterNum}</span>
            <span class="concept-status-pill ${mastered ? 'done' : 'pending'}">
              ${escapeHtml(schedBadge)}
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

// ---------- Chapter study page (Jony Ive v2 Video Hero + Outlined Pill + Underline Tabs) ----------
function setChapterStep(stepVal) {
  appState.activeChapterStep = stepVal;
  renderChapterPage();
}

function setChapterTab(tabKey) {
  if (tabKey === 'quiz') {
    const cur = appState.currentChapter;
    if (cur) startQuiz(cur.subjectId, cur.chapterNum);
    return;
  }
  appState.chapterTab = tabKey;
  renderChapterPage();
}

function playChapterHeroVideo() {
  appState.chapterVideoPlaying = true;
  appState.todayTasks.video = true;
  saveTodayTasks();
  renderChapterPage();
}

function openChapter(subjectId, chapterNum, focusConceptId) {
  const sub = SUBJECTS.find(s => s.id === subjectId);
  if (!sub) return;
  appState.currentSubject = sub;
  appState.learnSubjectId = subjectId;
  appState.currentChapter = { subjectId, chapterNum };
  saveLastStudied(subjectId, chapterNum);

  const hasVid = Boolean(chapterVideo(subjectId, chapterNum));
  appState.chapterVideoPlaying = false;
  appState.chapterTab = focusConceptId ? 'revise' : (hasVid ? 'watch' : 'read');
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
  const video = chapterVideo(sub.id, n);
  const subFormulas = FORMULA_DATABASE.filter(f => f.subject === sub.id);
  const pdf = sub.filePattern(n);
  const readTitle = `${sub.name} — Chapter ${n}: ${name}`;
  const shortSubName = SUBJECT_SHORT_NAMES[sub.id] || sub.name;

  // Build available tabs dynamically — never show tabs that would leak empty states
  const availableTabs = [];
  if (video) availableTabs.push({ id: 'watch', label: 'Watch' });
  availableTabs.push({ id: 'read', label: 'Read' });
  if (subFormulas.length > 0) availableTabs.push({ id: 'formulas', label: 'Formulas' });
  availableTabs.push({ id: 'quiz', label: 'Quiz' });
  if (concepts.length > 0) availableTabs.push({ id: 'revise', label: 'Revise' });

  let activeTab = appState.chapterTab || (video ? 'watch' : 'read');
  if (!availableTabs.some(t => t.id === activeTab)) {
    activeTab = availableTabs[0].id;
  }

  // 16:9 Dark Rounded Hero Stage (Video Player or NCERT Reader Stage)
  let heroStageHtml = '';
  if (video) {
    const topics = Array.isArray(video.topics) && video.topics.length ? video.topics : null;
    const primaryEmbedId = (topics && topics[0] && topics[0].embedId) ? topics[0].embedId : video.embedId;
    const durLabel = video.duration || '12:00';
    if (appState.chapterVideoPlaying && primaryEmbedId) {
      const remainingIds = topics && topics.length > 1 ? topics.slice(1).map(t => t.embedId).join(',') : '';
      const playlistParam = remainingIds ? `&playlist=${remainingIds}` : '';
      heroStageHtml = `
        <div class="ive-video-stage">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${primaryEmbedId}?autoplay=1&rel=0&modestbranding=1${playlistParam}"
            title="${escapeHtml(video.title)}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
    } else {
      heroStageHtml = `
        <div class="ive-video-stage">
          <div class="ive-video-poster" onclick="playChapterHeroVideo()" role="button" tabindex="0" aria-label="Play ${escapeHtml(name)} video">
            <div class="ive-video-play-circle">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#4F46E5" style="margin-left:3px;">
                <polygon points="5 3 20 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="ive-video-scrubber-bar">
              <div class="ive-scrubber-track"><div class="ive-scrubber-fill"></div></div>
              <span class="ive-scrubber-time">4:12  /  ${escapeHtml(durLabel.replace(' mins', ':00').replace(' min', ':00'))}</span>
            </div>
          </div>
        </div>
      `;
    }
  } else {
    heroStageHtml = `
      <div class="ive-video-stage" style="padding:32px;text-align:center;">
        <div style="color:#BEC2D7;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">
          NCERT ${escapeHtml(sub.book)} &nbsp;·&nbsp; Chapter ${n}
        </div>
        <div style="color:#FFFFFF;font-size:24px;font-weight:700;max-width:520px;margin-bottom:24px;">
          ${escapeHtml(name)}
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
          <button class="ive-btn-primary-pill" style="height:48px;min-width:176px;font-size:14px;" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', false)">
            Read Chapter PDF
          </button>
          <button class="ive-btn-outline-pill" style="background:transparent;color:#FFFFFF;border-color:rgba(255,255,255,0.35);" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', true)">
            Split-View PDF
          </button>
        </div>
      </div>
    `;
  }

  // Tab Panel Content below the underline tabs
  let tabPanelHtml = '';
  if (activeTab === 'watch' && video) {
    const topics = Array.isArray(video.topics) && video.topics.length ? video.topics : [];
    tabPanelHtml = `
      <div class="ive-hairline-table">
        ${topics.length > 0 ? topics.map((t, idx) => `
          <button class="ive-hairline-row" onclick="openGeminiVideoModal('${video.id}', ${idx})">
            <div class="ive-row-left">
              <span class="ive-row-num">${String(idx + 1).padStart(2, '0')}</span>
              <div>
                <div class="ive-row-title">${escapeHtml(t.title)}</div>
                <div class="ive-row-sub">${escapeHtml(t.section || video.source || 'Concept lesson')}</div>
              </div>
            </div>
            <div class="ive-row-right">
              <span>${escapeHtml(t.duration || '')}</span>
              <span class="ive-row-chevron">›</span>
            </div>
          </button>
        `).join('') : `
          <button class="ive-hairline-row" onclick="playChapterHeroVideo()">
            <div class="ive-row-left">
              <span class="ive-row-num">01</span>
              <div>
                <div class="ive-row-title">${escapeHtml(video.title)}</div>
                <div class="ive-row-sub">${escapeHtml(video.description || 'Complete chapter explanation')}</div>
              </div>
            </div>
            <div class="ive-row-right">
              <span>${escapeHtml(video.duration || '12 min')}</span>
              <span class="ive-row-chevron">›</span>
            </div>
          </button>
        `}
        <button class="ive-hairline-row" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', true)">
          <div class="ive-row-left">
            <span class="ive-row-num">📖</span>
            <div>
              <div class="ive-row-title">Open NCERT Chapter ${n} PDF</div>
              <div class="ive-row-sub">Read side-by-side in Split View or fullscreen</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>
      </div>
    `;
  } else if (activeTab === 'read') {
    tabPanelHtml = `
      <div class="ive-hairline-table">
        <button class="ive-hairline-row" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', false)">
          <div class="ive-row-left">
            <span class="ive-row-num">01</span>
            <div>
              <div class="ive-row-title">Read Chapter ${n} in Fullscreen Reader</div>
              <div class="ive-row-sub">${escapeHtml(sub.book)} — ${escapeHtml(name)}</div>
            </div>
          </div>
          <div class="ive-row-right"><span>Open PDF</span><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="openReader('${escapeJs(pdf)}', '${escapeJs(readTitle)}', '${sub.code}', true)">
          <div class="ive-row-left">
            <span class="ive-row-num">02</span>
            <div>
              <div class="ive-row-title">Dock Chapter ${n} in Side-by-Side Split View</div>
              <div class="ive-row-sub">Keep textbook open on the left while solving or revising on the right</div>
            </div>
          </div>
          <div class="ive-row-right"><span>Split View</span><span class="ive-row-chevron">›</span></div>
        </button>

        <button class="ive-hairline-row" onclick="askNotebookAboutChapter('${sub.id}', ${n})">
          <div class="ive-row-left">
            <span class="ive-row-num">03</span>
            <div>
              <div class="ive-row-title">Ask NotebookLM about Chapter ${n}</div>
              <div class="ive-row-sub">Copies a ready-made Class 6 study prompt and opens NotebookLM</div>
            </div>
          </div>
          <div class="ive-row-right"><span class="ive-row-chevron">›</span></div>
        </button>
      </div>
    `;
  } else if (activeTab === 'formulas') {
    tabPanelHtml = `
      <div class="ive-hairline-table">
        ${subFormulas.map((card, idx) => `
          <div style="padding: 18px 0; border-bottom: 1px solid var(--border-subtle);">
            <div class="ive-row-title" style="margin-bottom: 10px;">${escapeHtml(card.title)}</div>
            ${card.content.map(item => `
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:6px 0;font-size:14px;">
                <span style="color:var(--text-secondary);">${escapeHtml(item.label)}</span>
                <code style="font-family:var(--font-mono);color:var(--text-primary);font-weight:600;">${escapeHtml(item.formula)}</code>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  } else if (activeTab === 'revise') {
    tabPanelHtml = renderConceptPanel(sub, n);
  }

  const subtitleMeta = video
    ? `${video.source || 'Key concepts explained'}  ·  ${video.duration || '12 min'}  ·  no ads`
    : `${sub.book}  ·  Chapter ${n}  ·  NCERT Textbook`;

  view.innerHTML = `
    <div class="ive-chapter-wrap">
      <div class="ive-back-row">
        <button class="ive-back-link" onclick="openSubjectInLearn('${sub.id}')">
          ‹ &nbsp;${escapeHtml(shortSubName)}
        </button>
      </div>

      ${heroStageHtml}

      <div class="ive-chapter-header-row">
        <div>
          <h1 class="ive-chapter-title">${escapeHtml(name)}</h1>
          <p class="ive-chapter-meta">${escapeHtml(subtitleMeta)}</p>
        </div>
        <button class="ive-btn-outline-pill" onclick="startQuiz('${sub.id}', ${n})">
          Check understanding
        </button>
      </div>

      <div class="ive-text-tabs" role="tablist" aria-label="Chapter Sections">
        ${availableTabs.map(t => `
          <button
            class="ive-text-tab ${activeTab === t.id ? 'active' : ''}"
            onclick="setChapterTab('${t.id}')"
            role="tab"
            aria-selected="${activeTab === t.id}"
          >
            ${escapeHtml(t.label)}
          </button>
        `).join('')}
      </div>

      <div class="ive-chapter-tab-panel">
        ${tabPanelHtml}
      </div>
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
