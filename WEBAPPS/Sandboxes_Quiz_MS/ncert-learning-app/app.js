let manifestData = null;
let currentChapterData = null;

async function initApp() {
  try {
    const res = await fetch('./data/manifest.json');
    if (!res.ok) throw new Error("Manifest load failed");
    manifestData = await res.json();
    populateSubjectSelect();
  } catch (err) {
    document.getElementById('app-content').innerHTML = `<div class="placeholder-card" style="border-color: var(--danger)"><p><strong>Error loading manifest data:</strong> ${err.message}</p></div>`;
  }
}

function populateSubjectSelect() {
  const subjectSelect = document.getElementById('subject-select');
  subjectSelect.innerHTML = '<option value="">-- Choose Subject --</option>';
  manifestData.subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.id;
    opt.textContent = sub.name;
    subjectSelect.appendChild(opt);
  });
}

function onSubjectChange() {
  const subjectId = document.getElementById('subject-select').value;
  const chapterSelect = document.getElementById('chapter-select');
  chapterSelect.innerHTML = '<option value="">-- Choose Chapter --</option>';
  document.getElementById('chapter-info').style.display = 'none';
  document.getElementById('app-content').innerHTML = '<div class="placeholder-card"><p>Select a chapter to begin.</p></div>';
  if (!subjectId) return;
  const subject = manifestData.subjects.find(s => s.id === subjectId);
  subject.chapters.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = ch.dataFile;
    opt.textContent = `Ch ${ch.number}: ${ch.title}`;
    chapterSelect.appendChild(opt);
  });
}

async function onChapterChange() {
  const dataFile = document.getElementById('chapter-select').value;
  if (!dataFile) return;
  try {
    const res = await fetch(`./${dataFile}`);
    if (!res.ok) throw new Error("Failed to load chapter content");
    currentChapterData = await res.json();
    renderChapter();
  } catch (err) {
    document.getElementById('app-content').innerHTML = `<div class="placeholder-card" style="border-color: var(--danger)"><p><strong>Error:</strong> ${err.message}</p></div>`;
  }
}

function renderChapter() {
  if (!currentChapterData) return;
  document.getElementById('chapter-title').textContent = `Chapter ${currentChapterData.chapter_number}: ${currentChapterData.title}`;
  document.getElementById('chapter-desc').textContent = currentChapterData.description;
  document.getElementById('chapter-info').style.display = 'block';

  let html = '<div class="chapter-card"><h3>Practice Assessment</h3>';
  currentChapterData.quizzes.forEach((q, idx) => {
    html += `<div class="question-block" id="block-${q.id}"><div class="question-text">Q${idx + 1}: ${q.question}</div><div class="options">`;
    q.options.forEach((opt, oIdx) => {
      html += `<label class="option-label"><input type="radio" name="${q.id}" value="${oIdx}"> ${opt}</label>`;
    });
    html += `</div><button class="btn btn-primary" style="margin-top: 10px;" onclick="checkAnswer('${q.id}', ${q.answer_index})">Submit Answer</button><div class="hint-box" id="hint-${q.id}"></div></div>`;
  });
  html += '</div>';
  document.getElementById('app-content').innerHTML = html;
}

function checkAnswer(quizId, correctIndex) {
  const selected = document.querySelector(`input[name="${quizId}"]:checked`);
  const hintBox = document.getElementById(`hint-${quizId}`);
  if (!selected) { alert("Please select an answer choice first."); return; }
  const userVal = parseInt(selected.value);
  const quizObj = currentChapterData.quizzes.find(q => q.id === quizId);
  if (userVal === correctIndex) {
    hintBox.className = "hint-box correct";
    hintBox.innerHTML = `<strong>Correct!</strong> ${quizObj.explanation}`;
  } else {
    hintBox.className = "hint-box incorrect";
    hintBox.innerHTML = `<strong>Incorrect.</strong> ${quizObj.explanation}`;
  }
  hintBox.style.display = "block";
}

function resetCurrentQuiz() {
  if (!currentChapterData) return;
  renderChapter();
}

initApp();
