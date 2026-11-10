# Create folder structure
New-Item -ItemType Directory -Force -Path "ncert-learning-app\data\math" | Out-Null
New-Item -ItemType Directory -Force -Path "ncert-learning-app\data\science" | Out-Null

# Write index.html
@'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCERT Class 6 Interactive Sandbox</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="app-header">
    <h1>NCERT Class 6 Learning Sandbox</h1>
    <p>Interactive exercises & practice quizzes for <em>Ganita Prakash</em> & <em>Curiosity</em></p>
  </header>
  <main class="container">
    <section class="controls-card">
      <div class="control-group">
        <label for="subject-select">Select Subject:</label>
        <select id="subject-select" onchange="onSubjectChange()">
          <option value="">Loading subjects...</option>
        </select>
      </div>
      <div class="control-group">
        <label for="chapter-select">Select Chapter:</label>
        <select id="chapter-select" onchange="onChapterChange()">
          <option value="">Select a subject first</option>
        </select>
      </div>
      <button class="btn btn-secondary" onclick="resetCurrentQuiz()">🔄 Start Fresh</button>
    </section>
    <section id="chapter-info" class="chapter-info-card" style="display: none;">
      <h2 id="chapter-title"></h2>
      <p id="chapter-desc"></p>
    </section>
    <section id="app-content">
      <div class="placeholder-card">
        <p>Please select a subject and chapter to load interactive learning materials.</p>
      </div>
    </section>
  </main>
  <script src="app.js"></script>
</body>
</html>
'@ | Set-Content -Path "ncert-learning-app\index.html" -Encoding UTF8

# Write style.css
@'
:root {
  --primary: #0056b3;
  --primary-hover: #004085;
  --bg-color: #f4f7f6;
  --card-bg: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --success: #28a745;
  --danger: #dc3545;
}
body { font-family: system-ui, sans-serif; background-color: var(--bg-color); color: var(--text-color); margin: 0; padding: 20px; }
.app-header { text-align: center; margin-bottom: 24px; }
.app-header h1 { color: var(--primary); margin-bottom: 6px; }
.container { max-width: 900px; margin: 0 auto; }
.controls-card, .chapter-info-card, .chapter-card, .placeholder-card {
  background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.controls-card { display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap; }
.control-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 200px; }
label { font-weight: 600; font-size: 0.9em; }
select { padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 1rem; background-color: #fff; }
.btn { padding: 10px 18px; border: none; border-radius: 6px; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-secondary { background: #6c757d; color: #fff; }
.question-block { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
.option-label { display: block; padding: 10px 14px; background: #f8f9fa; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 8px; cursor: pointer; }
.hint-box { display: none; margin-top: 12px; padding: 12px; border-radius: 6px; font-size: 0.95em; }
.hint-box.correct { background: #d4edda; border-left: 5px solid var(--success); color: #155724; }
.hint-box.incorrect { background: #f8d7da; border-left: 5px solid var(--danger); color: #721c24; }
'@ | Set-Content -Path "ncert-learning-app\style.css" -Encoding UTF8

# Write app.js
@'
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
'@ | Set-Content -Path "ncert-learning-app\app.js" -Encoding UTF8

# Write manifest.json
@'
{
  "subjects": [
    {
      "id": "ganita_prakash",
      "name": "Mathematics (Ganita Prakash)",
      "class": 6,
      "chapters": [{ "number": 4, "title": "Data Handling", "dataFile": "data/math/ch04.json" }]
    },
    {
      "id": "curiosity",
      "name": "Science (Curiosity)",
      "class": 6,
      "chapters": [{ "number": 4, "title": "Exploring Magnets", "dataFile": "data/science/ch04.json" }]
    }
  ]
}
'@ | Set-Content -Path "ncert-learning-app\data\manifest.json" -Encoding UTF8

# Write ch04 math JSON
@'
{
  "chapter_number": 4,
  "title": "Data Handling",
  "subject": "ganita_prakash",
  "description": "Organizing raw data using frequency tables, tally marks, pictographs, and bar graphs.",
  "quizzes": [
    {
      "id": "m_ch04_01",
      "question": "In a standard tally mark table, how is a group of 5 represented?",
      "options": ["4 vertical lines crossed diagonally by a 5th line", "5 vertical parallel lines", "3 horizontal and 2 vertical lines", "A circle with a slash"],
      "answer_index": 0,
      "explanation": "Tally marks group counts in sets of 5 using 4 vertical lines crossed diagonally by the 5th line."
    },
    {
      "id": "m_ch04_02",
      "question": "If 1 tree icon in a pictograph represents 10 trees, how many icons represent 40 trees?",
      "options": ["2 icons", "4 icons", "10 icons", "40 icons"],
      "answer_index": 1,
      "explanation": "Dividing the target total by the scale factor: 40 ÷ 10 = 4 icons."
    }
  ]
}
'@ | Set-Content -Path "ncert-learning-app\data\math\ch04.json" -Encoding UTF8

# Write ch04 science JSON
@'
{
  "chapter_number": 4,
  "title": "Exploring Magnets",
  "subject": "curiosity",
  "description": "Understanding magnetic vs non-magnetic materials, poles of a magnet, and magnetic forces.",
  "quizzes": [
    {
      "id": "s_ch04_01",
      "question": "What happens when two North poles (N-N) of bar magnets approach each other?",
      "options": ["They attract each other", "They repel each other", "They neutralize each other", "They generate electricity"],
      "answer_index": 1,
      "explanation": "Like magnetic poles (N-N or S-S) always repel each other, whereas opposite poles (N-S) attract."
    },
    {
      "id": "s_ch04_02",
      "question": "Where is the magnetic force strongest on a standard bar magnet?",
      "options": ["At the exact center", "At both of its magnetic poles", "Along the top edge only", "Force is completely uniform everywhere"],
      "answer_index": 1,
      "explanation": "Magnetic field lines are most concentrated at the poles, making the magnetic force strongest at both ends."
    }
  ]
}
'@ | Set-Content -Path "ncert-learning-app\data\science\ch04.json" -Encoding UTF8

# Zip the directory
Compress-Archive -Path "ncert-learning-app" -DestinationPath "ncert-learning-app.zip" -Force
Write-Host "Setup completed successfully!" -ForegroundColor Green