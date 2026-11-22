/**
 * Phase 2: Build-time Content Schema Validator & Coverage Report Generator
 * Schema: subject -> chapter -> { pdf, pdfExists, video, formulas[], concepts[], quiz_items[] }
 * Run: node scripts/validate-content.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function loadClass6Bundle() {
  const sandbox = {
    window: {},
    localStorage: { getItem: () => null, setItem: () => {} },
    console
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);

  const files = [
    'classes/registry.js',
    'classes/class6/curriculum.js',
    'classes/class6/quiz.js',
    'classes/class6/reference.js',
    'classes/class6/concepts.js',
    'classes/class6/concepts-science.js',
    'classes/class6/quests.js',
    'classes/class6/annual-paper-science.js',
    'classes/class6/annual-paper-math.js',
    'classes/class6/annual-paper-ssc.js'
  ];

  for (const rel of files) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing required data file: ${rel}`);
    }
    const code = fs.readFileSync(full, 'utf8');
    vm.runInContext(code, sandbox, { filename: rel });
  }

  return {
    activeClass: sandbox.getActiveClass(),
    sciBp: sandbox.SCIENCE_ANNUAL_BLUEPRINT,
    mathBp: sandbox.MATH_ANNUAL_BLUEPRINT,
    sscBp: sandbox.SSC_ANNUAL_BLUEPRINT
  };
}

function validateAndBuildReport() {
  const { activeClass, sciBp, mathBp, sscBp } = loadClass6Bundle();
  const data = activeClass.data;
  const subjects = data.subjects || [];
  const videos = data.videos || [];
  const formulas = data.formulas || [];
  const concepts = data.concepts || {};
  const quiz = data.quiz || {};

  const errors = [];
  const schemaTree = {};
  const summaryRows = [];

  let totalChapters = 0;
  let chaptersWithPdf = 0;
  let chaptersWithVideo = 0;
  let chaptersWithFormulas = 0;
  let chaptersWithConcepts = 0;
  let chaptersWithQuiz = 0;

  for (const sub of subjects) {
    if (!sub.id || !sub.name || !Array.isArray(sub.chapters)) {
      errors.push(`Invalid subject entry: ${JSON.stringify(sub)}`);
      continue;
    }

    const subVideos = videos.filter(v => v.subjectId === sub.id);
    const subFormulas = formulas.filter(f => f.subject === sub.id);
    const subConceptsMap = concepts[sub.id] || {};
    const subLegacyQuiz = quiz[sub.id] || [];
    const annualBp = sub.id === 'SCIENCE' ? sciBp : (sub.id === 'MATH' ? mathBp : (sub.id === 'SSC' ? sscBp : null));
    const annualMcqs = (annualBp && annualBp.sectionAMcqPool) || [];

    schemaTree[sub.id] = {
      id: sub.id,
      name: sub.name,
      book: sub.book,
      totalChapters: sub.count,
      chapters: []
    };

    for (let i = 1; i <= sub.count; i++) {
      totalChapters++;
      const chTitle = sub.chapters[i - 1] || `Chapter ${i}`;
      const pdfRel = typeof sub.filePattern === 'function' ? sub.filePattern(i) : null;
      const pdfExists = Boolean(pdfRel && fs.existsSync(path.join(ROOT, pdfRel)));
      if (!pdfExists) {
        errors.push(`[${sub.id} Ch ${i}] Missing PDF on disk: ${pdfRel}`);
      } else {
        chaptersWithPdf++;
      }

      const chVideo = subVideos.find(v => Number(v.chapterNum) === i) || null;
      if (chVideo) chaptersWithVideo++;

      const chConcepts = subConceptsMap[i] || [];
      if (chConcepts.length > 0) chaptersWithConcepts++;

      if (subFormulas.length > 0) chaptersWithFormulas++;

      // Count quiz items from concepts self-check + annual blueprint MCQs + legacy quiz
      const conceptQuizItems = chConcepts.reduce((acc, c) => acc + ((c.check && c.check.length) || 0), 0);
      const bpQuizItems = annualMcqs.filter(m => Number(m.ch) === i).length;
      const legacyItems = subLegacyQuiz.filter(q => {
        const m = (q.chapter || '').match(/Chapter\s*(\d+)/i);
        return m ? Number(m[1]) === i : false;
      }).length;
      const totalQuizItems = conceptQuizItems + bpQuizItems + legacyItems;
      if (totalQuizItems > 0 || subLegacyQuiz.length > 0) chaptersWithQuiz++;

      const chNode = {
        chapterNum: i,
        title: chTitle,
        pdf: pdfRel,
        pdfExists,
        hasVideo: Boolean(chVideo),
        videoDuration: chVideo ? chVideo.duration : null,
        formulaSheetsCount: subFormulas.length,
        conceptsCount: chConcepts.length,
        quizItemsCount: totalQuizItems,
        gaps: []
      };

      if (!pdfExists) chNode.gaps.push('pdf');
      if (!chVideo) chNode.gaps.push('video');
      if (chConcepts.length === 0) chNode.gaps.push('concepts');
      if (totalQuizItems === 0) chNode.gaps.push('chapter-specific-quiz');

      schemaTree[sub.id].chapters.push(chNode);
    }

    const chList = schemaTree[sub.id].chapters;
    summaryRows.push({
      id: sub.id,
      name: sub.name,
      book: sub.book,
      chapters: sub.count,
      pdfs: chList.filter(c => c.pdfExists).length,
      videos: chList.filter(c => c.hasVideo).length,
      conceptsCh: chList.filter(c => c.conceptsCount > 0).length,
      totalConcepts: chList.reduce((s, c) => s + c.conceptsCount, 0),
      formulaSheets: subFormulas.length,
      quizCh: chList.filter(c => c.quizItemsCount > 0).length,
      totalQuizItems: chList.reduce((s, c) => s + c.quizItemsCount, 0)
    });
  }

  // Generate COVERAGE_REPORT.md
  const lines = [
    '# Class VI (NCERT) Content Schema & Coverage Report',
    '',
    `Generated by \`scripts/validate-content.js\`. Schema validated across **${subjects.length} subjects** and **${totalChapters} chapters**.`,
    '',
    '## 1. Subject-Level Coverage Summary',
    '',
    '| Subject | Book | Chapters | PDFs on Disk | Curated Videos | Chapters w/ Concepts | Total Concepts | Formula Sheets | Chapter Quiz Items |',
    '| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |',
    ...summaryRows.map(r =>
      `| **${r.name}** (\`${r.id}\`) | ${r.book} | ${r.chapters} | ${r.pdfs}/${r.chapters} | ${r.videos}/${r.chapters} | ${r.conceptsCh}/${r.chapters} | ${r.totalConcepts} | ${r.formulaSheets} | ${r.totalQuizItems} |`
    ),
    '',
    '## 2. Overall Totals',
    `- **Textbook PDFs Validated on Disk:** ${chaptersWithPdf} / ${totalChapters} (${Math.round((chaptersWithPdf / totalChapters) * 100)}%)`,
    `- **Chapters with Curated Ad-Free Videos:** ${chaptersWithVideo} / ${totalChapters} (${Math.round((chaptersWithVideo / totalChapters) * 100)}%)`,
    `- **Chapters with Structured Key Concepts & Self-Checks:** ${chaptersWithConcepts} / ${totalChapters} (${Math.round((chaptersWithConcepts / totalChapters) * 100)}%)`,
    `- **Chapters with Reference Formula/Grammar Sheets:** ${chaptersWithFormulas} / ${totalChapters}`,
    `- **Schema Validation Errors:** ${errors.length}`,
    '',
    '## 3. Chapter-by-Chapter Gap Audit',
    '*(Note: The UI automatically hides tabs for missing modules so students never see empty placeholder states.)*',
    ''
  ];

  for (const sub of subjects) {
    const node = schemaTree[sub.id];
    lines.push(`### ${node.name} — *${node.book}*`);
    for (const ch of node.chapters) {
      const status = ch.gaps.length === 0
        ? 'Complete (PDF + Video + Concepts + Quiz)'
        : `Gaps: ${ch.gaps.join(', ')}`;
      lines.push(`- **Ch ${String(ch.chapterNum).padStart(2, '0')}: ${ch.title}** — PDF: ${ch.pdfExists ? 'Yes' : 'MISSING'} · Video: ${ch.hasVideo ? 'Yes' : 'No'} · Concepts: ${ch.conceptsCount} · Quiz Qs: ${ch.quizItemsCount} *(${status})*`);
    }
    lines.push('');
  }

  fs.writeFileSync(path.join(ROOT, 'COVERAGE_REPORT.md'), lines.join('\n'), 'utf8');
  console.log(`Schema validation complete: ${totalChapters} chapters audited, ${chaptersWithPdf}/${totalChapters} PDFs verified on disk, ${errors.length} errors.`);
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    process.exitCode = 1;
  }
}

validateAndBuildReport();
