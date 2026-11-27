/**
 * Pre-Push Automated Validator Gatekeeper & Coverage Report Generator
 * Validates:
 *   1. NCERT Class VI 7-subject / 76-chapter PDF & curriculum schema (+ flags extra unmapped PDFs)
 *   2. Frontier Deep Learning Lab (4 verticals, 9 simulators across min/default/max bounds)
 *   3. Official Bloom Public School 2026-27 Datesheets (PA-1, Mid-Term, PA-2, Annual)
 *   4. All 36 Term-Specific Paper Combinations (SCIENCE/MATH/SSC x PA1/MIDTERM/PA2/ANNUAL x A/B/RANDOM)
 *   5. PWA manifest icons & sw.js CORE_ASSETS parity with index.html local scripts/stylesheets
 * Run: node scripts/validate-content.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function extractJsFunction(src, name) {
  const idx = src.indexOf('function ' + name);
  if (idx === -1) throw new Error(`Missing function in app.js: ${name}`);
  const start = src.indexOf('{', idx);
  let depth = 0;
  let i = start;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  return src.slice(idx, i + 1);
}

function loadClass6Bundle() {
  const sandbox = {
    window: {},
    document: { getElementById: () => null },
    localStorage: { getItem: () => null, setItem: () => {} },
    console,
    Set, Array, Math, Object, String, Number, Date, isNaN
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
    'classes/class6/deep-learning.js',
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

  const activeClass = sandbox.getActiveClass();
  const bps = (activeClass.data && activeClass.data.examBlueprints) || {};
  return {
    sandbox,
    activeClass,
    sciBp: bps.SCIENCE,
    mathBp: bps.MATH,
    sscBp: bps.SSC
  };
}

function validateAndBuildReport() {
  const { sandbox, activeClass, sciBp, mathBp, sscBp } = loadClass6Bundle();
  const data = activeClass.data;
  const subjects = data.subjects || [];
  const videos = data.videos || [];
  const formulas = data.formulas || [];
  const concepts = data.concepts || {};
  const quiz = data.quiz || {};

  const errors = [];
  const schemaTree = {};
  const summaryRows = [];
  const referencedChapterPdfs = new Set();

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
      if (pdfRel) referencedChapterPdfs.add(pdfRel.replace(/\\/g, '/'));
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

  // Informational audit of extra PDFs in ALL_CHAPTERS/ beyond chapter count
  const unmappedDiskPdfs = [];
  const allChaptersDir = path.join(ROOT, 'ALL_CHAPTERS');
  if (fs.existsSync(allChaptersDir)) {
    for (const subDir of fs.readdirSync(allChaptersDir, { withFileTypes: true })) {
      if (!subDir.isDirectory()) continue;
      const folderPath = path.join(allChaptersDir, subDir.name);
      for (const f of fs.readdirSync(folderPath)) {
        if (!f.toLowerCase().endsWith('.pdf')) continue;
        const rel = `ALL_CHAPTERS/${subDir.name}/${f}`;
        if (!referencedChapterPdfs.has(rel)) {
          unmappedDiskPdfs.push(rel);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Gate 2: Frontier Deep Learning Lab (verticals, NCERT anchors & simulators)
  // -------------------------------------------------------------------------
  const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const dl = data.deepLearning || { verticals: [], missions: [] };
  const dlVerticalIds = new Set((dl.verticals || []).map(v => v.id));
  if ((dl.verticals || []).length < 4) errors.push(`Expected >= 4 Deep Learning verticals, got ${(dl.verticals || []).length}`);
  if ((dl.missions || []).length < 9) errors.push(`Expected >= 9 Deep Learning missions, got ${(dl.missions || []).length}`);

  vm.runInContext('var CRYPTO_PRIMES = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];', sandbox);
  vm.runInContext(extractJsFunction(appSrc, 'computeDeepSimOutput'), sandbox);

  let simChecksPassed = 0;
  for (const m of (dl.missions || [])) {
    if (!dlVerticalIds.has(m.vertical)) errors.push(`[DeepLearning ${m.id}] Unknown vertical: ${m.vertical}`);
    const anchorSub = subjects.find(s => s.id === (m.ncert && m.ncert.subjectId));
    if (!anchorSub) {
      errors.push(`[DeepLearning ${m.id}] Unknown NCERT subject: ${m.ncert && m.ncert.subjectId}`);
    } else if (m.ncert.chapterNum < 1 || m.ncert.chapterNum > anchorSub.count) {
      errors.push(`[DeepLearning ${m.id}] Invalid NCERT chapter ${m.ncert.chapterNum} for ${anchorSub.id}`);
    }

    for (const bound of ['min', 'default', 'max']) {
      const vals = {};
      ((m.sim && m.sim.controls) || []).forEach(c => { vals[c.key] = Number(c[bound]); });
      const res = sandbox.computeDeepSimOutput(m, vals);
      if (!res || !res.status || !Array.isArray(res.kpis) || res.kpis.length === 0) {
        errors.push(`[DeepLearning ${m.id}] Empty simulator output at ${bound}`);
      } else {
        for (const k of res.kpis) {
          if (String(k.val).includes('NaN') || String(k.val).includes('undefined')) {
            errors.push(`[DeepLearning ${m.id}] NaN/undefined KPI at ${bound}: ${JSON.stringify(k)}`);
          }
        }
      }
    }
    simChecksPassed++;
  }

  // -------------------------------------------------------------------------
  // Gate 3: Official 2026-27 Bloom Datesheets (PA1, MIDTERM, PA2, ANNUAL)
  // -------------------------------------------------------------------------
  const subjectIdSet = new Set(subjects.map(s => s.id));
  const dsMap = data.datesheets || {};
  const termKeys = ['PA1', 'MIDTERM', 'PA2', 'ANNUAL'];
  let totalDatesheetRows = 0;
  for (const tk of termKeys) {
    const td = dsMap[tk];
    if (!td || !Array.isArray(td.exams) || td.exams.length !== 6) {
      errors.push(`[Datesheet ${tk}] Expected 6 exam entries, got ${td && td.exams ? td.exams.length : 0}`);
      continue;
    }
    for (const ex of td.exams) {
      totalDatesheetRows++;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ex.date)) errors.push(`[Datesheet ${tk}] Invalid ISO date: ${ex.date}`);
      if (!subjectIdSet.has(ex.subjectId)) errors.push(`[Datesheet ${tk}] Unknown subjectId: ${ex.subjectId}`);
      if (td.localPath && !fs.existsSync(path.join(ROOT, td.localPath))) {
        errors.push(`[Datesheet ${tk}] Missing localPath: ${td.localPath}`);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Gate 4: All 36 Term-Specific Paper Combinations (PA1, MIDTERM, PA2, ANNUAL)
  // -------------------------------------------------------------------------
  vm.runInContext("var annualPaperState = { termMode: 'ANNUAL', reproNumber: 1 }; var EXAM_BLUEPRINTS = (getActiveClass().data && getActiveClass().data.examBlueprints) || {};", sandbox);
  ['getAnnualBlueprint', 'pickShuffled', 'getActiveTermConfig', 'buildAnnualPaper'].forEach(fn => {
    vm.runInContext(extractJsFunction(appSrc, fn), sandbox);
  });

  let paperCombosPassed = 0;
  for (const subId of ['SCIENCE', 'MATH', 'SSC']) {
    const bp = sandbox.getAnnualBlueprint(subId);
    if (!bp) {
      errors.push(`[Papers] Missing blueprint for ${subId}`);
      continue;
    }
    for (const tk of termKeys) {
      const cfg = bp.termSyllabi && bp.termSyllabi[tk];
      if (!cfg) {
        errors.push(`[Papers ${subId}] Missing termSyllabi.${tk}`);
        continue;
      }
      const allowed = new Set(cfg.chapters);
      for (const mode of ['A', 'B', 'RANDOM']) {
        const p = sandbox.buildAnnualPaper(subId, mode, tk);
        const allQs = [...p.secAMcq, ...p.secAAr, ...p.secAFill, ...p.secB, ...p.secC, ...p.secD, ...p.secE, ...p.secF];
        const outOfSyl = allQs.filter(q => !allowed.has(q.ch));
        const marks =
          p.secAMcq.length * 1 + p.secAAr.length * 1 + p.secAFill.length * 1 +
          p.secB.length * 2 + p.secC.length * 3 +
          p.secD.length * 5 + p.secE.length * 4 + p.secF.length * 3;
        if (outOfSyl.length > 0) {
          errors.push(`[Papers ${subId}/${tk}/${mode}] Out-of-syllabus chapters leaked: ${outOfSyl.map(x => `${x.id}:ch${x.ch}`).join(', ')}`);
        } else if (marks !== cfg.maxMarks) {
          errors.push(`[Papers ${subId}/${tk}/${mode}] Mark mismatch: got ${marks}, expected ${cfg.maxMarks}`);
        } else {
          paperCombosPassed++;
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Gate 5: PWA Manifest Icons & sw.js CORE_ASSETS Parity with index.html
  // -------------------------------------------------------------------------
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const swSrc = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const swCoreMatch = swSrc.match(/CORE_ASSETS\s*=\s*\[([\s\S]*?)\]/);
  const swCoreList = swCoreMatch
    ? [...swCoreMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1].replace(/^\.\//, ''))
    : [];
  const swCoreSet = new Set(swCoreList);

  const htmlAssets = new Set();
  for (const m of indexHtml.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    if (!/^https?:\/\//i.test(m[1])) htmlAssets.add(m[1].replace(/^\.\//, ''));
  }
  for (const m of indexHtml.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)) {
    const relMatch = m[0].match(/rel=["']([^"']+)["']/i);
    const rel = relMatch ? relMatch[1].toLowerCase() : '';
    if (!/^https?:\/\//i.test(m[1]) && (rel.includes('stylesheet') || rel === 'manifest' || rel.includes('icon'))) {
      htmlAssets.add(m[1].replace(/^\.\//, ''));
    }
  }

  let pwaAssetsChecked = 0;
  for (const assetRel of htmlAssets) {
    pwaAssetsChecked++;
    if (!fs.existsSync(path.join(ROOT, assetRel))) {
      errors.push(`[PWA index.html] Referenced local asset missing on disk: ${assetRel}`);
    }
    if (!swCoreSet.has(assetRel)) {
      errors.push(`[PWA sw.js] Asset loaded in index.html is missing from CORE_ASSETS: ${assetRel}`);
    }
  }
  for (const assetRel of swCoreList) {
    if (assetRel === '' || assetRel === './') continue;
    if (!fs.existsSync(path.join(ROOT, assetRel))) {
      errors.push(`[PWA sw.js] CORE_ASSETS entry missing on disk: ${assetRel}`);
    }
  }

  const manifestObj = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  for (const ic of (manifestObj.icons || [])) {
    if (!fs.existsSync(path.join(ROOT, ic.src))) {
      errors.push(`[PWA manifest.json] Icon missing on disk: ${ic.src}`);
    }
  }

  // -------------------------------------------------------------------------
  // Gate 6: Architecture Guardrails (No window.* data leaks, No External JS CDNs)
  // -------------------------------------------------------------------------
  const class6Dir = path.join(ROOT, 'classes', 'class6');
  for (const f of fs.readdirSync(class6Dir)) {
    if (!f.endsWith('.js')) continue;
    const src = fs.readFileSync(path.join(class6Dir, f), 'utf8');
    if (/window\.[A-Za-z0-9_$]+\s*=/.test(src)) {
      errors.push(`[Architecture classes/class6/${f}] Forbidden window.* data leak found; use registerClassData / registerExamBlueprint`);
    }
  }

  for (const wa of (data.webapps || [])) {
    if (!wa.path || !fs.existsSync(path.join(ROOT, wa.path))) continue;
    const waHtml = fs.readFileSync(path.join(ROOT, wa.path), 'utf8');
    for (const m of waHtml.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)["']/gi)) {
      errors.push(`[Architecture ${wa.path}] External runtime script CDN forbidden in offline lab: ${m[1]}`);
    }
  }

  // Generate COVERAGE_REPORT.md
  const lines = [
    '# Class VI (NCERT) Content Schema & Coverage Report',
    '',
    `Generated by \`scripts/validate-content.js\`. Validated across **${subjects.length} subjects**, **${totalChapters} chapters**, **${paperCombosPassed}/36 term paper combinations**, **${totalDatesheetRows} datesheet rows**, and **${simChecksPassed} Deep Learning simulators**.`,
    '',
    '## 1. Subject-Level Coverage Summary',
    '',
    '| Subject | Book | Chapters | PDFs on Disk | Curated Videos | Chapters w/ Concepts | Total Concepts | Formula Sheets | Chapter Quiz Items |',
    '| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |',
    ...summaryRows.map(r =>
      `| **${r.name}** (\`${r.id}\`) | ${r.book} | ${r.chapters} | ${r.pdfs}/${r.chapters} | ${r.videos}/${r.chapters} | ${r.conceptsCh}/${r.chapters} | ${r.totalConcepts} | ${r.formulaSheets} | ${r.totalQuizItems} |`
    ),
    '',
    '## 2. Overall Totals & Automated Validation Gates',
    `- **Textbook PDFs Validated on Disk:** ${chaptersWithPdf} / ${totalChapters} (${Math.round((chaptersWithPdf / totalChapters) * 100)}%)`,
    `- **Chapters with Curated Ad-Free Videos:** ${chaptersWithVideo} / ${totalChapters} (${Math.round((chaptersWithVideo / totalChapters) * 100)}%)`,
    `- **Chapters with Structured Key Concepts & Self-Checks:** ${chaptersWithConcepts} / ${totalChapters} (${Math.round((chaptersWithConcepts / totalChapters) * 100)}%)`,
    `- **Chapters with Reference Formula/Grammar Sheets:** ${chaptersWithFormulas} / ${totalChapters}`,
    `- **Term-Specific Paper Permutations Verified:** ${paperCombosPassed} / 36 (\`SCIENCE\`, \`MATH\`, \`SSC\` × \`PA1\`, \`MIDTERM\`, \`PA2\`, \`ANNUAL\` × \`Set A\`, \`Set B\`, \`RANDOM\`)`,
    `- **Bloom Public School 2026–27 Datesheets Verified:** ${termKeys.length} terms (${totalDatesheetRows} Class VI exam dates)`,
    `- **Frontier Deep Learning Lab Simulators Verified:** ${simChecksPassed} / 9 across \`min\`, \`default\`, and \`max\` bounds`,
    `- **PWA \`CORE_ASSETS\` & Manifest Icon Parity:** ${pwaAssetsChecked} index.html assets & ${(manifestObj.icons || []).length} manifest icons verified`,
    `- **Schema & Validator Errors:** ${errors.length}`,
    '',
    ...(unmappedDiskPdfs.length ? [
      '### Informational: Unmapped PDFs Found in `ALL_CHAPTERS/`',
      '*(Present on disk beyond configured chapter counts in `curriculum.js`; flagged for awareness without failing validation.)*',
      ...unmappedDiskPdfs.map(p => `- \`${p}\``),
      ''
    ] : []),
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
  console.log(
    `Validation complete: ${totalChapters} chapters (${chaptersWithPdf}/${totalChapters} PDFs), ` +
    `${paperCombosPassed}/36 term papers, ${totalDatesheetRows} datesheet rows, ` +
    `${simChecksPassed} Deep Learning simulators, ${pwaAssetsChecked} PWA assets checked — ${errors.length} errors.`
  );
  if (unmappedDiskPdfs.length) {
    console.log('Informational extra PDFs on disk:', unmappedDiskPdfs.join(', '));
  }
  if (errors.length > 0) {
    console.error('Validation errors:\n - ' + errors.join('\n - '));
    process.exitCode = 1;
  }
}

validateAndBuildReport();
