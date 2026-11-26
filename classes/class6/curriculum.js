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
        'Grassroots Democracy - Part 2 (Rural Local Govt)',
        'Grassroots Democracy - Part 3 (Urban Local Govt)',
        'The Value of Work',
        'Economic Activities Around Us',
        'NCERT Glossary & Key Terms',
        'Constitution Preamble & Textbook Overview'
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
  
  // Official Bloom Public School Class VI Exam Datesheets (2026-2027)
  // Verified from bloompublicschool.org & CURRICULUM/EXAM_DATES/
  const datesheets = {
    PA1: {
      termKey: 'PA1',
      label: 'PA-1',
      shortLabel: 'PA-1 (Jul)',
      title: 'Periodic Assessment I (July 2026)',
      monthLabel: 'Jul 2026',
      maxMarks: 25,
      duration: '1 Hour',
      bloomUrl: 'https://www.bloompublicschool.org/periodic-assessment-i.html',
      localPath: null,
      exams: [
        { date: '2026-07-03', displayDate: '03/07/2026', day: 'Friday', subjectId: 'SANSKRIT', subjectName: 'Sanskrit', hasMockPaper: false },
        { date: '2026-07-06', displayDate: '06/07/2026', day: 'Monday', subjectId: 'SCIENCE', subjectName: 'Science', hasMockPaper: true },
        { date: '2026-07-07', displayDate: '07/07/2026', day: 'Tuesday', subjectId: 'ENGLISH', subjectName: 'English', hasMockPaper: false },
        { date: '2026-07-08', displayDate: '08/07/2026', day: 'Wednesday', subjectId: 'SSC', subjectName: 'Social Science', hasMockPaper: true },
        { date: '2026-07-09', displayDate: '09/07/2026', day: 'Thursday', subjectId: 'HINDI', subjectName: 'Hindi', hasMockPaper: false },
        { date: '2026-07-10', displayDate: '10/07/2026', day: 'Friday', subjectId: 'MATH', subjectName: 'Mathematics', hasMockPaper: true }
      ]
    },
    MIDTERM: {
      termKey: 'MIDTERM',
      label: 'Mid-Term',
      shortLabel: 'Mid-Term (Sep)',
      title: 'Mid-Term Examination (September 2026)',
      monthLabel: 'Sep 2026',
      maxMarks: 60,
      duration: '2 Hours 30 Minutes',
      bloomUrl: 'https://www.bloompublicschool.org/mid-term.html',
      localPath: null,
      exams: [
        { date: '2026-09-15', displayDate: '15/09/2026', day: 'Tuesday', subjectId: 'SSC', subjectName: 'Social Science', hasMockPaper: true },
        { date: '2026-09-18', displayDate: '18/09/2026', day: 'Friday', subjectId: 'SCIENCE', subjectName: 'Science', hasMockPaper: true },
        { date: '2026-09-22', displayDate: '22/09/2026', day: 'Tuesday', subjectId: 'HINDI', subjectName: 'Hindi', hasMockPaper: false },
        { date: '2026-09-25', displayDate: '25/09/2026', day: 'Friday', subjectId: 'SANSKRIT', subjectName: 'Sanskrit', hasMockPaper: false },
        { date: '2026-09-28', displayDate: '28/09/2026', day: 'Monday', subjectId: 'MATH', subjectName: 'Mathematics', hasMockPaper: true },
        { date: '2026-09-30', displayDate: '30/09/2026', day: 'Wednesday', subjectId: 'ENGLISH', subjectName: 'English', hasMockPaper: false }
      ]
    },
    PA2: {
      termKey: 'PA2',
      label: 'PA-2',
      shortLabel: 'PA-2 (Dec)',
      title: 'Periodic Assessment II (December 2026)',
      monthLabel: 'Dec 2026',
      maxMarks: 25,
      duration: '1 Hour',
      bloomUrl: 'https://www.bloompublicschool.org/periodic-assessment-ii.html',
      localPath: 'CURRICULUM/EXAM_DATES/periodic assessment ii.html',
      exams: [
        { date: '2026-12-07', displayDate: '07/12/2026', day: 'Monday', subjectId: 'SANSKRIT', subjectName: 'Sanskrit', hasMockPaper: false },
        { date: '2026-12-08', displayDate: '08/12/2026', day: 'Tuesday', subjectId: 'SCIENCE', subjectName: 'Science', hasMockPaper: true },
        { date: '2026-12-09', displayDate: '09/12/2026', day: 'Wednesday', subjectId: 'ENGLISH', subjectName: 'English', hasMockPaper: false },
        { date: '2026-12-10', displayDate: '10/12/2026', day: 'Thursday', subjectId: 'MATH', subjectName: 'Mathematics', hasMockPaper: true },
        { date: '2026-12-11', displayDate: '11/12/2026', day: 'Friday', subjectId: 'HINDI', subjectName: 'Hindi', hasMockPaper: false },
        { date: '2026-12-14', displayDate: '14/12/2026', day: 'Monday', subjectId: 'SSC', subjectName: 'Social Science', hasMockPaper: true }
      ]
    },
    ANNUAL: {
      termKey: 'ANNUAL',
      label: 'Annual Exam',
      shortLabel: 'Annual (Feb)',
      title: 'Annual Final Examination (February 2027)',
      monthLabel: 'Feb 2027',
      maxMarks: 60,
      duration: '2 Hours 30 Minutes',
      bloomUrl: 'https://www.bloompublicschool.org/annual.html',
      localPath: 'CURRICULUM/EXAM_DATES/annual.html',
      exams: [
        { date: '2027-02-15', displayDate: '15/02/2027', day: 'Monday', subjectId: 'MATH', subjectName: 'Mathematics', hasMockPaper: true },
        { date: '2027-02-17', displayDate: '17/02/2027', day: 'Wednesday', subjectId: 'SANSKRIT', subjectName: 'Sanskrit', hasMockPaper: false },
        { date: '2027-02-19', displayDate: '19/02/2027', day: 'Friday', subjectId: 'SCIENCE', subjectName: 'Science', hasMockPaper: true },
        { date: '2027-02-22', displayDate: '22/02/2027', day: 'Monday', subjectId: 'SSC', subjectName: 'Social Science', hasMockPaper: true },
        { date: '2027-02-25', displayDate: '25/02/2027', day: 'Thursday', subjectId: 'ENGLISH', subjectName: 'English', hasMockPaper: false },
        { date: '2027-02-27', displayDate: '27/02/2027', day: 'Saturday', subjectId: 'HINDI', subjectName: 'Hindi', hasMockPaper: false }
      ]
    }
  };

  // Exam Schedule Files (All 4 Bloom Public School 2026-2027 Terms)
  const examSchedule = [
    {
      termKey: 'PA1',
      title: 'Periodic Assessment I Datesheet (July 2026)',
      term: 'PA-1 · 25M',
      path: null,
      bloomUrl: 'https://www.bloompublicschool.org/periodic-assessment-i.html',
      description: 'Class VI schedule from 03/07/2026 to 10/07/2026 (Sanskrit, Science, English, Social Science, Hindi, Math).'
    },
    {
      termKey: 'MIDTERM',
      title: 'Mid-Term Examination Datesheet (September 2026)',
      term: 'Mid-Term · 60M',
      path: null,
      bloomUrl: 'https://www.bloompublicschool.org/mid-term.html',
      description: 'Class VI schedule from 15/09/2026 to 30/09/2026 (Social Science, Science, Hindi, Sanskrit, Math, English).'
    },
    {
      termKey: 'PA2',
      title: 'Periodic Assessment II Datesheet (December 2026)',
      term: 'PA-2 · 25M',
      path: 'CURRICULUM/EXAM_DATES/periodic assessment ii.html',
      bloomUrl: 'https://www.bloompublicschool.org/periodic-assessment-ii.html',
      description: 'Class VI schedule from 07/12/2026 to 14/12/2026 (Sanskrit, Science, English, Math, Hindi, Social Science).'
    },
    {
      termKey: 'ANNUAL',
      title: 'Annual Final Examination Datesheet (February 2027)',
      term: 'Annual · 60M',
      path: 'CURRICULUM/EXAM_DATES/annual.html',
      bloomUrl: 'https://www.bloompublicschool.org/annual.html',
      description: 'Class VI schedule from 15/02/2027 to 27/02/2027 (Math, Sanskrit, Science, Social Science, English, Hindi).'
    }
  ];

  registerClassData('6', { subjects, samplePapers, webapps, examSchedule, datesheets });
})();
