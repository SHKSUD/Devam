/**
 * Class registry — the list of classes the app knows about.
 *
 * To add a new class (e.g. Class 7):
 *   1. Create classes/class7/ with curriculum.js, quiz.js, reference.js
 *      (copy the class6 files as a template; each ends with registerClassData('7', {...})).
 *   2. Put its PDFs in their own folder (e.g. CLASS_7/ALL_CHAPTERS/...) and point paths there.
 *   3. Add <script> tags for the new files in index.html.
 *   4. Set `available: true` for it below.
 */
const CLASS_REGISTRY = [
  { id: '6', label: 'Class 6', roman: 'VI', session: '2026–2027', available: true },
  { id: '7', label: 'Class 7', roman: 'VII', session: '2027–2028', available: false }
];

const CLASS_DATA = {};
const ACTIVE_CLASS_KEY = 'study_active_class';

function registerClassData(classId, part) {
  CLASS_DATA[classId] = Object.assign(CLASS_DATA[classId] || {}, part);
}

/** Add one subject's concepts to a class (lets each subject live in its own file). */
function registerConcepts(classId, subjectId, chapters) {
  const data = CLASS_DATA[classId] = CLASS_DATA[classId] || {};
  data.concepts = data.concepts || {};
  data.concepts[subjectId] = chapters;
}

function getActiveClass() {
  let id = null;
  try { id = localStorage.getItem(ACTIVE_CLASS_KEY); } catch (e) {}
  let meta = CLASS_REGISTRY.find(c => c.id === id && c.available && CLASS_DATA[c.id]);
  if (!meta) meta = CLASS_REGISTRY.find(c => c.available && CLASS_DATA[c.id]) || CLASS_REGISTRY[0];
  return { ...meta, data: CLASS_DATA[meta.id] || {} };
}

function setActiveClass(classId) {
  try { localStorage.setItem(ACTIVE_CLASS_KEY, classId); } catch (e) {}
  window.location.reload();
}

/** Storage key scoped to a class, so progress for Class 6 and Class 7 never mixes. */
function classStorageKey(name, classId) {
  return `study_${name}_c${classId}`;
}
