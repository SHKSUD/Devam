/**
 * Class VI — curriculum data (subjects, chapters, papers, webapps, exam dates).
 * Paths are relative to the app root.
 */
(function () {
  // Subjects & Chapter Database (NCERT Class VI 2026-2027)
  const subjects = [
    {
      id: 'MATH',
      name: 'Mathematics',
      book: 'Ganita Prakash',
      code: 'MATH-06',
      count: 10,
      folder: 'ALL_CHAPTERS/GANITAPRAKAASH_MATH',
      filePattern: (i) => `ALL_CHAPTERS/GANITAPRAKAASH_MATH/ch${i}.pdf`,
      syllabus: 'CURRICULUM/SYLLABUS/Ganit_Prakash_Syllabus.pdf',
      samplePaper: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/MATH_VIA_SMP_GANITPRAKAASH.pdf',
      khanQuery: 'class 6 ncert mathematics',
      chapters: [
        'Patterns in Mathematics',
        'Lines and Angles',
        'Number Play',
        'Data Handling',
        'Prime Time',
        'Perimeter and Area',
        'Fractions',
        'Playing with Constructions',
        'Symmetry',
        'The Other Side of Zero (Integers)'
      ]
    },
    {
      id: 'SCIENCE',
      name: 'Science',
      book: 'Curiosity',
      code: 'SCI-06',
      count: 12,
      folder: 'ALL_CHAPTERS/CURIOSITY-SCIENCE',
      filePattern: (i) => `ALL_CHAPTERS/CURIOSITY-SCIENCE/ch${i}.pdf`,
      syllabus: 'CURRICULUM/SYLLABUS/Science_Curiosity_Syllabus.pdf',
      samplePaper: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/SCIENCE_VIA_SMP_CURIOSITY.pdf',
      khanQuery: 'class 6 science ncert',
      chapters: [
        'The Wonderful World of Science',
        'Diversity in the Living World',
        'Mindful Eating: Path to a Healthy Body',
        'Exploring Magnets',
        'Measurement of Length and Motion',
        'Materials Around Us',
        'Temperature and its Measurement',
        'A Journey through States of Water',
        'Methods of Separation in Everyday Life',
        'Living Creatures: Exploring Characteristics',
        "Nature's Treasures",
        'Beyond Earth'
      ]
    },
    {
      id: 'SSC',
      name: 'Social Science',
      book: 'Exploring Society: India and Beyond',
      code: 'SOC-06',
      count: 16,
      folder: 'ALL_CHAPTERS/SSC',
      filePattern: (i) => `ALL_CHAPTERS/SSC/ch${i}.pdf`,
      syllabus: 'CURRICULUM/SYLLABUS/Social_Science_Exploring_India_Syllabus.pdf',
      samplePaper: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/SOCIAL SCIENCE_VIA_SMP_.pdf',
      khanQuery: 'class 6 ncert social science geography history',
      chapters: [
        'Locating Places on the Earth',
        'Oceans and Continents',
        'Landforms and Life',
        'Timeline and Sources of History',
        'India, That is Bharat',
        'The Beginnings of Indian Civilisation',
        "India's Cultural Roots",
        'Unity in Diversity',
        'Family and Community',
        'Grassroots Democracy - Part 1 (Governance)',
        'Grassroots Democracy - Part 2 (Local Govt)',
        'Economic Activities Around Us',
        'The Value of Work',
        'Maps and Map Reading',
        'Physical Features of India',
        'India: Climate, Vegetation and Wildlife'
      ]
    },
    {
      id: 'ENGLISH',
      name: 'English',
      book: 'Poorvi',
      code: 'ENG-06',
      count: 6,
      folder: 'ALL_CHAPTERS/POORVI_ENGLISH',
      filePattern: (i) => `ALL_CHAPTERS/POORVI_ENGLISH/ch${i}.pdf`,
      syllabus: 'CURRICULUM/SYLLABUS/English_Poorvi_Syllabus.pdf',
      samplePaper: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/English_VIA_SMP_POORVI.pdf',
      khanQuery: 'grade 6 english grammar and comprehension',
      chapters: [
        'A Bottle of Dew',
        'The Raven and the Fox',
        'Rama to the Rescue',
        'The Unlikely Best Friends',
        "A Friend's Prayer",
        'The Chair'
      ]
    },
    {
      id: 'HINDI',
      name: 'Hindi',
      book: 'Malhaar',
      code: 'HIN-06',
      count: 14,
      folder: 'ALL_CHAPTERS/MALLHAR_HINDI',
      filePattern: (i) => `ALL_CHAPTERS/MALLHAR_HINDI/ch${i}.pdf`,
      syllabus: 'CURRICULUM/SYLLABUS/Hindi_mallhar_Syllabus.pdf',
      samplePaper: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/Hindi_VIA_SMP_MALHAAR.pdf',
      khanQuery: 'class 6 hindi ncert vyakaran',
      chapters: [
        'मातृभूमि (कविता)',
        'गोल (संस्मरण)',
        'पहली बूँद',
        'हार की जीत',
        'रहीम के दोहे',
        'मेरी माँ',
        'बूँद और समुद्र',
        'ईदगाह',
        'साए',
        'कबीर के दोहे',
        'प्रकृति की सीख',
        'नीलू',
        'पत्र और डायरी',
        'अभ्यास और व्याकरण'
      ]
    },
    {
      id: 'SANSKRIT',
      name: 'Sanskrit',
      book: 'Deepakam',
      code: 'SAN-06',
      count: 17,
      folder: 'ALL_CHAPTERS/DIPAKAM',
      filePattern: (i) => `ALL_CHAPTERS/DIPAKAM/CH_ (${i}).pdf`,
      syllabus: 'CURRICULUM/SYLLABUS/Sankrit_Dipakam_Syllabus.pdf',
      samplePaper: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/SANSKRIT_VIA_SMP_.pdf',
      khanQuery: 'ncert sanskrit class 6 deepakam',
      chapters: Array.from({ length: 17 }, (_, i) => `दीपकम - प्रथमो भागः (पाठ ${i + 1})`)
    },
    {
      id: 'FRENCH',
      name: 'French',
      book: 'Language Curriculum',
      code: 'FRN-06',
      count: 1,
      folder: 'CURRICULUM/SYLLABUS',
      filePattern: () => 'CURRICULUM/SYLLABUS/French_Language_Syllabus.pdf',
      syllabus: 'CURRICULUM/SYLLABUS/French_Language_Syllabus.pdf',
      samplePaper: null,
      khanQuery: 'beginner french vocabulary for kids',
      chapters: ['Introduction to French Grammar & Vocabulary']
    }
  ];
  
  // Sample Papers Database
  const samplePapers = [
    {
      id: 'sp_math',
      title: 'Mathematics Mid-Term Examination Paper',
      subject: 'Mathematics',
      term: 'Mid-Term',
      path: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/MATH_VIA_SMP_GANITPRAKAASH.pdf',
      description: 'Covers Patterns, Lines & Angles, and Data Handling with step-by-step problem sets.'
    },
    {
      id: 'sp_sci',
      title: 'Science Mid-Term Assessment Paper',
      subject: 'Science',
      term: 'Mid-Term',
      path: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/SCIENCE_VIA_SMP_CURIOSITY.pdf',
      description: 'Components of Food, Living World Diversity, and Magnetism evaluation paper.'
    },
    {
      id: 'sp_eng',
      title: 'English Grammar & Literature Sample Paper',
      subject: 'English',
      term: 'Mid-Term',
      path: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/English_VIA_SMP_POORVI.pdf',
      description: 'Reading comprehension, poem analysis, nouns, adjectives, and composition.'
    },
    {
      id: 'sp_ssc',
      title: 'Social Science Evaluation Paper',
      subject: 'Social Science',
      term: 'Mid-Term',
      path: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/SOCIAL SCIENCE_VIA_SMP_.pdf',
      description: 'Earth geography, Continents & Oceans, and Historical timeline questions.'
    },
    {
      id: 'sp_hin',
      title: 'Hindi Vyakaran & Sahitya Assessment',
      subject: 'Hindi',
      term: 'Mid-Term',
      path: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/Hindi_VIA_SMP_MALHAAR.pdf',
      description: 'Comprehensive evaluation on grammar, prose comprehension, and poetry.'
    },
    {
      id: 'sp_san',
      title: 'Sanskrit Language & Grammar Practice',
      subject: 'Sanskrit',
      term: 'Mid-Term',
      path: 'CURRICULUM/SAMPLE_PAPERS/MID_TERM/SANSKRIT_VIA_SMP_.pdf',
      description: 'Shloka recitation, shabd roop, dhatu roop, and Sanskrit sentence translation.'
    },
    {
      id: 'sp_master',
      title: 'NCERT Class VI Master Curriculum Guide',
      subject: 'General',
      term: 'Annual Curriculum',
      path: 'CURRICULUM/SYLLABUS/0011001.pdf',
      description: 'Official academic syllabus guidelines and learning outcomes framework.'
    }
  ];
  
  // Interactive Webapps Database
  const webapps = [
    {
      id: 'math_datahandling',
      title: 'Data Handling Interactive Sandbox',
      subject: 'Mathematics',
      path: 'WEBAPPS/GANITAPRAKAASH_MATH/index_datahandling_ch04.html',
      description: 'Frequency tables, tally marks, bar charts, and data interpretation simulator.'
    },
    {
      id: 'math_numbers',
      title: '50-Question Master Number Play Challenge',
      subject: 'Mathematics',
      path: 'WEBAPPS/GANITAPRAKAASH_MATH/mathquiz_numbers.html',
      description: 'Prime numbers, factors, divisibility tests, and integer rules.'
    },
    {
      id: 'ncert_sandbox',
      title: 'NCERT Interactive Multi-Subject Lab',
      subject: 'General',
      path: 'WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/index.html',
      description: 'Interactive test module with chapter-level practice questions.'
    }
  ];
  
  // Exam Schedule Files
  const examSchedule = [
    {
      title: 'Periodic Assessment II Schedule & Datesheet',
      term: 'Mid-Year',
      path: 'CURRICULUM/EXAM_DATES/periodic assessment ii.html',
      description: 'Timetable, syllabus portions, and assessment guidelines.'
    },
    {
      title: 'Annual Final Examination Datesheet',
      term: 'Annual',
      path: 'CURRICULUM/EXAM_DATES/annual.html',
      description: 'Final academic session schedule and subject distribution.'
    }
  ];
  
  registerClassData('6', { subjects, samplePapers, webapps, examSchedule });
})();
