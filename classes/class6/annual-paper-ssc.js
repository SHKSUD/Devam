/**
 * Class VI Social Science (Exploring Society: India and Beyond) — Reproducible Annual Examination Sample Paper Engine
 * Aligned strictly with:
 *   1. Bloom Public School, C-8 Vasant Kunj, New Delhi — Social Science Sample Paper (2026–27)
 *      - Time Allowed: 2 Hours 30 Minutes | Max Marks: 60 | Total Questions: 27 across Six Sections (A–F)
 *      - Section A (12 Marks, Q1–Q12):
 *          • Q1–Q10: 10 Multiple Choice Questions (1 mark each)
 *          • Q11–Q12: 2 Assertion–Reason Questions (1 mark each)
 *      - Section B (10 Marks, Q13–Q17): 5 Very Short Answer questions × 2 marks each (Max 40 words; Internal OR in Q13 & Q15)
 *      - Section C (12 Marks, Q18–Q21): 4 Short Answer questions × 3 marks each (Max 60 words; Internal OR in Q19 & Q21)
 *      - Section D (15 Marks, Q22–Q24): 3 Long Answer questions × 5 marks each (Max 120 words; Internal OR in Q22, Q23 & Q24)
 *      - Section E (8 Marks, Q25–Q26): 2 Case-Based / Source-Based questions × 4 marks each (1 + 1 + 2 marks)
 *      - Section F (3 Marks, Q27): 1 Map Skill Based question × 3 marks (1 + 1 + 1 marks on Outline Map of India)
 *   2. Official Final Examination Syllabus (Page 6 of Social_Science_Exploring_India_Syllabus.pdf):
 *      - Assessed Final Exam Chapters (9 Chapters):
 *          • Geography: Ch 1 (Locating Places on the Earth), Ch 3 (Landforms and Life)
 *          • History: Ch 4 (Timeline and Sources of History), Ch 6 (The Beginnings of Indian Civilisation), Ch 7 (India's Cultural Roots)
 *          • Social & Political Life / Economics: Ch 10 (Governance), Ch 11 (Rural Local Govt), Ch 12 (Urban Local Govt), Ch 14 (Economic Activities Around Us)
 *      - Excluded Chapters (Activity Based Assessment / Subject Enrichment Activity SEA only):
 *          • Ch 2 (Oceans and Continents), Ch 5 (India, That Is Bharat), Ch 8 (Unity in Diversity), Ch 9 (Family and Community), Ch 13 (The Value of Work)
 */
(function () {
  const SSC_ANNUAL_BLUEPRINT = {
    schoolName: 'BLOOM PUBLIC SCHOOL',
    schoolAddress: 'C-8 Vasant Kunj, New Delhi',
    examTitle: 'Sample Question Paper — Annual Examination (2026–27)',
    subject: 'Social Science (Exploring Society: India and Beyond)',
    classLabel: 'Class – VI',
    duration: '2 hours 30 minutes',
    maxMarks: 60,
    totalQuestions: 27,
    assessedChapters: [
      { num: 1, title: 'Locating Places on the Earth (Geography)', weightMarks: 7 },
      { num: 3, title: 'Landforms and Life (Geography)', weightMarks: 7 },
      { num: 4, title: 'Timeline and Sources of History (History)', weightMarks: 6 },
      { num: 6, title: 'The Beginnings of Indian Civilisation (History)', weightMarks: 8 },
      { num: 7, title: "India's Cultural Roots (History)", weightMarks: 7 },
      { num: 10, title: 'Grassroots Democracy — Part 1: Governance (SPL)', weightMarks: 6 },
      { num: 11, title: 'Grassroots Democracy — Part 2: Rural Local Govt (SPL)', weightMarks: 6 },
      { num: 12, title: 'Grassroots Democracy — Part 3: Urban Local Govt (SPL)', weightMarks: 6 },
      { num: 14, title: 'Economic Activities Around Us (Economics)', weightMarks: 7 }
    ],
    excludedChapters: [
      { num: 2, title: 'Oceans and Continents', reason: 'Activity Based Assessment (Map Work)' },
      { num: 5, title: 'India, That Is Bharat', reason: 'Activity Based Assessment (Presentation)' },
      { num: 8, title: "Unity in Diversity, or 'Many in the One'", reason: 'Activity Based Assessment (Art Integration)' },
      { num: 9, title: 'Family and Community', reason: 'Subject Enrichment Activity (SEA — Drama)' },
      { num: 13, title: 'The Value of Work', reason: 'Subject Enrichment Activity (SEA — Chart)' }
    ],
    termSyllabi: {
      PA1: { label: 'PA-1', title: 'Sample Question Paper — Periodic Assessment – I (2026–27)', chapters: [1, 4, 10], maxMarks: 25, duration: '1 Hour', durationSec: 3600 },
      MIDTERM: { label: 'Mid-Term', title: 'Sample Question Paper — Mid-Term Examination (2026–27)', chapters: [1, 4, 6, 10, 11], maxMarks: 60, duration: '2 hours 30 minutes', durationSec: 9000 },
      PA2: { label: 'PA-2', title: 'Sample Question Paper — Periodic Assessment – II (2026–27)', chapters: [3, 7, 12], maxMarks: 25, duration: '1 Hour', durationSec: 3600 },
      ANNUAL: { label: 'Annual', title: 'Sample Question Paper — Annual Examination (2026–27)', chapters: [1, 3, 4, 6, 7, 10, 11, 12, 14], maxMarks: 60, duration: '2 hours 30 minutes', durationSec: 9000 }
    },
    instructions: [
      'i. The question paper comprises Six Sections – A, B, C, D, E and F. There are 27 questions in the question paper. All questions are compulsory.',
      'ii. Section A – Question no. 1 to 12 are MCQs (including 2 Assertion–Reason questions) of 1 mark each.',
      'iii. Section B – Question no. 13 to 17 are Very Short Answer Type Questions, carrying 2 marks each. Answers to each question should not exceed 40 words.',
      'iv. Section C – Question no. 18 to 21 are Short Answer Type Questions, carrying 3 marks each. Answers to each question should not exceed 60 words.',
      'v. Section D – Question no. 22 to 24 are Long Answer Type Questions, carrying 5 marks each. Answers to each question should not exceed 120 words.',
      'vi. Section E – Question no. 25 and 26 are Case Based Questions with three sub-questions and are of 4 marks each (1 + 1 + 2).',
      'vii. Section F – Question no. 27 is Map Skill Based, carrying 3 marks (1 + 1 + 1).',
      'viii. There is no overall choice in the question paper. However, an internal choice has been provided in a few questions. Only one of the choices in such questions has to be attempted.'
    ],

    // =========================================================================
    // SECTION A PART 1: Q1–Q10 MCQs (10 picked per paper)
    // =========================================================================
    sectionAMcqPool: [
      // --- SET A (10 MCQs across the 9 Final Exam Chapters) ---
      {
        id: 'ssc_mcq_1', set: 'A', ch: 1,
        q: 'If it is 12:00 noon at Greenwich (0° Prime Meridian), what will be the local time at a place located at 15°E longitude?',
        options: ['(a) 10:00 AM', '(b) 11:00 AM', '(c) 1:00 PM', '(d) 2:00 PM'],
        correct: 2,
        hint: 'The Earth rotates 15° in 1 hour. Moving East of Greenwich means time is AHEAD (+1 hour per 15°E).',
        ans: '(c) 1:00 PM (15° East is 1 hour ahead of Greenwich Mean Time).'
      },
      {
        id: 'ssc_mcq_2', set: 'A', ch: 3,
        q: 'Which of the following plateaus is known as the "Roof of the World" because it is the highest and largest plateau in the world?',
        options: ['(a) Deccan Plateau', '(b) Tibetan Plateau', '(c) Cherrapunji Plateau', '(d) Chota Nagpur Plateau'],
        correct: 1,
        hint: 'This vast plateau in Central/East Asia has an average altitude of about 4,500 metres.',
        ans: '(b) Tibetan Plateau (It is the highest and largest plateau in the world, hence called the "Roof of the World").'
      },
      {
        id: 'ssc_mcq_3', set: 'A', ch: 4,
        q: 'Which term is used by historians today in place of "BC" (Before Christ) to count years before the start of the Common Era?',
        options: ['(a) CE', '(b) BCE', '(c) AD', '(d) BP'],
        correct: 1,
        hint: 'CE stands for Common Era; what stands for "Before Common Era"?',
        ans: '(b) BCE (Before Common Era).'
      },
      {
        id: 'ssc_mcq_4', set: 'A', ch: 6,
        q: 'Why are the inhabitants of the Indus-Sarasvatī Civilisation also called "Harappans"?',
        options: [
          '(a) They lived near a river named Harappa',
          '(b) Harappa was their royal capital city',
          '(c) Harappa was the first city of this civilisation to be excavated in 1920–21',
          '(d) All inscriptions mention King Harappa'
        ],
        correct: 2,
        hint: 'In archaeology, a civilisation is often named after the very first site where it was discovered.',
        ans: '(c) Harappa (in present-day Punjab, Pakistan) was the first city of this civilisation to be excavated in 1920–21.'
      },
      {
        id: 'ssc_mcq_5', set: 'A', ch: 6,
        q: 'At which Harappan site in Gujarat was a huge brick dockyard (218 m × 36 m) discovered, showing maritime trade with Mesopotamia?',
        options: ['(a) Kalibangan', '(b) Lothal', '(c) Rakhigarhi', '(d) Banawali'],
        correct: 1,
        hint: 'This town in Gujarat near the Gulf of Khambhat had a massive basin connected to the sea for ships and boats.',
        ans: '(b) Lothal (in Gujarat).'
      },
      {
        id: 'ssc_mcq_6', set: 'A', ch: 7,
        q: 'What is the meaning of the famous Vedic statement "Ekam sat viprā bahudhā vadanti" from the Rig Veda?',
        options: [
          '(a) Wealth is the highest goal of life',
          '(b) The Existent (Supreme Reality/Truth) is one, but sages give it many names',
          '(c) Kings must rule through force alone',
          '(d) Only rituals can bring rain'
        ],
        correct: 1,
        hint: 'Ekam = One, Sat = Truth/Being, Viprā = sages, Bahudhā vadanti = call it by many names.',
        ans: '(b) The Existent (Supreme Reality/Truth) is one, but wise sages call it by many names.'
      },
      {
        id: 'ssc_mcq_7', set: 'A', ch: 10,
        q: 'Which organ of the government is responsible for making new laws and updating or removing existing laws?',
        options: ['(a) Executive', '(b) Judiciary', '(c) Legislature', '(d) Police Department'],
        correct: 2,
        hint: 'Parliament at the national level and State Assemblies at the state level belong to this law-making organ.',
        ans: '(c) Legislature (It consists of elected representatives who frame and pass laws).'
      },
      {
        id: 'ssc_mcq_8', set: 'A', ch: 11,
        q: 'In the three-tier Panchayati Raj system, the Panchayat Samiti functions at which level?',
        options: ['(a) Village level', '(b) Block (Mandal/Taluka) level', '(c) District (Zila) level', '(d) State level'],
        correct: 1,
        hint: 'Gram Panchayat is at the village level, Zila Parishad is at the district level, and Panchayat Samiti is the middle link.',
        ans: '(b) Block level (It links the Gram Panchayats of villages with the Zila Parishad of the district).'
      },
      {
        id: 'ssc_mcq_9', set: 'A', ch: 12,
        q: 'Which is the oldest municipal institution in India, established on 29 September 1688?',
        options: [
          '(a) Municipal Corporation of Greater Mumbai',
          '(b) Indore Municipal Corporation',
          '(c) Madras Corporation (now Greater Chennai Corporation)',
          '(d) Delhi Municipal Corporation'
        ],
        correct: 2,
        hint: 'The East India Company issued a charter constituting the town of Fort St. George into a corporation in 1688.',
        ans: '(c) Madras Corporation (now Greater Chennai Corporation), established in 1688.'
      },
      {
        id: 'ssc_mcq_10', set: 'A', ch: 14,
        q: 'Converting raw cotton from farms into cloth in a textile mill belongs to which economic sector?',
        options: ['(a) Primary sector', '(b) Secondary sector', '(c) Tertiary sector', '(d) Non-economic activity'],
        correct: 1,
        hint: 'Processing raw materials from nature into manufactured goods in factories is the definition of this sector.',
        ans: '(b) Secondary sector (Manufacturing and processing raw materials into finished products).'
      },

      // --- SET B (10 MCQs across the 9 Final Exam Chapters) ---
      {
        id: 'ssc_mcq_11', set: 'B', ch: 1,
        q: 'Which standard meridian of longitude is used to determine Indian Standard Time (IST), which is 5 hours 30 minutes ahead of GMT?',
        options: ['(a) 0° Prime Meridian', '(b) 82°30\' E (82.5° E)', '(c) 68°7\' E', '(d) 97°25\' E'],
        correct: 1,
        hint: 'Multiply 5.5 hours by 15° per hour: 5.5 × 15° = 82.5° East.',
        ans: '(b) 82°30\' E (82.5° E) longitude, which passes through Mirzapur in Uttar Pradesh.'
      },
      {
        id: 'ssc_mcq_12', set: 'B', ch: 3,
        q: 'In the Sangam literature of ancient Tamilakam, which tiṇai (landscape) refers to mountainous regions associated with hunting and gathering?',
        options: ['(a) Kuriñji', '(b) Mullai', '(c) Marudam', '(d) Neydal'],
        correct: 0,
        hint: 'Marudam is fertile agricultural plains, Neydal is coastal regions, Palai is arid land, and Kuriñji is mountains.',
        ans: '(a) Kuriñji (Mountainous regions and their surrounding lifestyle).'
      },
      {
        id: 'ssc_mcq_13', set: 'B', ch: 4,
        q: 'Who are the specialists that study the human past by excavating physical remains such as tools, pots, beads, coins, and house foundations?',
        options: ['(a) Geologists', '(b) Palaeontologists', '(c) Archaeologists', '(d) Astrologers'],
        correct: 2,
        hint: 'Palaeontologists study fossils of millions of years ago; who digs up human artefacts and settlements?',
        ans: '(c) Archaeologists.'
      },
      {
        id: 'ssc_mcq_14', set: 'B', ch: 6,
        q: 'Which metal did the Harappans create by alloying (mixing) copper with tin to make tools, mirrors, and statues like the "Dancing Girl"?',
        options: ['(a) Iron', '(b) Bronze', '(c) Steel', '(d) Aluminium'],
        correct: 1,
        hint: 'The Harappan Civilisation belongs to the Bronze Age (Copper + Tin = ?).',
        ans: '(b) Bronze (Harappans mastered bronze metallurgy by adding tin to copper).'
      },
      {
        id: 'ssc_mcq_15', set: 'B', ch: 7,
        q: 'At which place did Siddhārtha Gautama attain enlightenment while meditating under a pipal tree at the age of 35, becoming the "Buddha"?',
        options: ['(a) Lumbini', '(b) Bodh Gaya', '(c) Sarnath', '(d) Kushinagar'],
        correct: 1,
        hint: 'He was born in Lumbini (Nepal) and attained enlightenment in Bihar under the Bodhi tree.',
        ans: '(b) Bodh Gaya (in present-day Bihar).'
      },
      {
        id: 'ssc_mcq_16', set: 'B', ch: 7,
        q: 'Which core principle of Jainism means "moving away from having a single narrow viewpoint and seeing the many sides of truth"?',
        options: ['(a) Anekāntavāda', '(b) Aparigraha', '(c) Ahimsā', '(d) Karma'],
        correct: 0,
        hint: 'Aneka = many, Anta = aspects/perspectives (not just one single viewpoint).',
        ans: '(a) Anekāntavāda ("not just one" aspect — truth has many perspectives).'
      },
      {
        id: 'ssc_mcq_17', set: 'B', ch: 10,
        q: 'What is the official motto of the Government of India, which means "Truth alone triumphs"?',
        options: ['(a) Yato Dharmastato Jayah', '(b) Satyameva Jayate', '(c) Vasudhaiva Kutumbakam', '(d) Sarve Bhavantu Sukhinah'],
        correct: 1,
        hint: 'Yato Dharmastato Jayah is the Supreme Court motto; Satyameva Jayate is inscribed below the Ashoka Lion Capital.',
        ans: '(b) Satyameva Jayate ("Truth alone triumphs").'
      },
      {
        id: 'ssc_mcq_18', set: 'B', ch: 11,
        q: 'Who is the elected head of a Gram Panchayat in rural India?',
        options: ['(a) District Collector', '(b) Patwari', '(c) Sarpanch or Pradhan', '(d) Municipal Commissioner'],
        correct: 2,
        hint: 'Members of the Gram Sabha directly elect the head of the village Panchayat.',
        ans: '(c) Sarpanch or Pradhan.'
      },
      {
        id: 'ssc_mcq_19', set: 'B', ch: 12,
        q: 'In India, cities with a population above 10 lakhs (1 million) have which highest urban local body?',
        options: ['(a) Nagar Panchayat', '(b) Municipal Council (Nagar Palika)', '(c) Municipal Corporation (Mahanagar Nigam)', '(d) Gram Sabha'],
        correct: 2,
        hint: 'Below 1 lakh is Nagar Panchayat; 1 to 10 lakhs is Municipal Council; above 10 lakhs is the largest body.',
        ans: '(c) Municipal Corporation (also called Mahanagar Nigam).'
      },
      {
        id: 'ssc_mcq_20', set: 'B', ch: 14,
        q: 'Which famous dairy cooperative was founded in 1946 in Anand, Gujarat, under the leadership of Tribhuvandas Patel and Dr. Varghese Kurien?',
        options: ['(a) Mother Dairy', '(b) AMUL (Anand Milk Union Limited)', '(c) Nandini', '(d) Verka'],
        correct: 1,
        hint: 'Sardar Vallabhbhai Patel advised the farmers of Anand district to form this milk cooperative.',
        ans: '(b) AMUL (Anand Milk Union Limited).'
      }
    ],

    // =========================================================================
    // SECTION A PART 2: Q11–Q12 ASSERTION–REASON (2 picked per paper)
    // =========================================================================
    sectionAAssertionPool: [
      {
        id: 'ssc_ar_1', set: 'A', ch: 1,
        assertion: 'Parallels of latitude become shorter in length as we move away from the Equator towards the North or South Pole.',
        reason: 'The Earth is geoid (nearly spherical) in shape, with the largest circumference at the Equator (0°) and points at the Poles (90°N and 90°S).',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).'
      },
      {
        id: 'ssc_ar_2', set: 'A', ch: 14,
        assertion: 'A truck driver transporting wheat from a farm to a flour mill is engaged in a Tertiary (Service) sector activity.',
        reason: 'The Tertiary sector produces raw materials directly from nature like farming and mining.',
        correct: 2,
        ans: 'C. Assertion (A) is true, but Reason (R) is false (The Tertiary sector provides support services like transport and banking; the Primary sector extracts raw materials from nature).'
      },
      {
        id: 'ssc_ar_3', set: 'B', ch: 6,
        assertion: 'Dholavira in Gujarat had an extraordinary water harvesting system with at least six large rock-cut and stone reservoirs.',
        reason: 'The Harappans gave great importance to water management, cleanliness, and connected underground drains.',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).'
      },
      {
        id: 'ssc_ar_4', set: 'B', ch: 10,
        assertion: 'In a democracy, the three organs of government — Legislature, Executive, and Judiciary — are kept separate while working together.',
        reason: 'Separation of powers ensures a system of checks and balances so that no single organ can misuse authority.',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).'
      },
      {
        id: 'ssc_ar_5_pa2', set: 'A', ch: 3,
        assertion: 'River plains such as the Ganga-Brahmaputra basin have some of the highest population densities in the world.',
        reason: 'Alluvial soil deposited by rivers makes plains very fertile for agriculture, while flat terrain supports easy transport and settlement.',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).'
      }
    ],

    // =========================================================================
    // SECTION B: Q13–Q17 VERY SHORT ANSWER (5 × 2 = 10 Marks, Internal OR in Q13 & Q15)
    // =========================================================================
    sectionBPool: [
      // --- SET A (5 questions, internal OR in Q13 & Q15) ---
      {
        id: 'ssc_secb_1', set: 'A', ch: 4,
        choiceA: {
          q: 'Can we compare historians to detectives? Give two reasons for your answer.',
          ans: 'Yes, historians are like detectives because:\n1. They gather clues from diverse historical sources (coins, inscriptions, manuscripts, excavated tools, and monuments). (1 Mark)\n2. They cross-check and piece together these clues logically to reconstruct how people lived in the past. (1 Mark)'
        },
        choiceB: {
          q: 'If King Chandragupta I was born in 320 CE, which century CE did he belong to? How many years was that after the Buddha\'s birth (taken as 560 BCE)?',
          ans: '1. 320 CE falls in the 4th century CE (301 CE to 400 CE). (1 Mark)\n2. Years after Buddha\'s birth = 560 + 320 − 1 (since there is no Year Zero) = 879 years. (1 Mark)'
        },
        keywords: ['clues', 'sources', 'inscriptions', '4th century', '879']
      },
      {
        id: 'ssc_secb_2', set: 'A', ch: 1,
        q: 'Describe the three main types of maps based on what they show.',
        keywords: ['physical', 'political', 'thematic', 'boundaries', 'mountains'],
        ans: '1. Physical Maps: Show natural features such as mountains, plateaus, plains, rivers, and oceans. (1 Mark)\n2. Political Maps: Show countries, states, capitals, cities, and administrative boundaries.\n3. Thematic Maps: Focus on specific information such as rainfall, road networks, or population distribution. (1 Mark)'
      },
      {
        id: 'ssc_secb_3', set: 'A', ch: 10,
        choiceA: {
          q: 'What is the literal meaning of the word "democracy", and why do we have representative democracy in India?',
          ans: '1. The word "democracy" comes from two Greek words — demos (people) and kratos (rule/power), meaning "rule of the people". (1 Mark)\n2. Because millions of citizens cannot all gather in one place to pass laws daily, they elect representatives (MPs and MLAs) through voting to govern on their behalf. (1 Mark)'
        },
        choiceB: {
          q: 'Who are MLAs and MPs? At which levels of government do they represent citizens?',
          ans: '1. MLAs (Members of Legislative Assembly): Elected representatives at the State level who sit in the State Vidhan Sabha. (1 Mark)\n2. MPs (Members of Parliament): Elected representatives at the National (Central) level who sit in the Lok Sabha / Rajya Sabha. (1 Mark)'
        },
        keywords: ['people', 'rule', 'representatives', 'MLA', 'MP', 'state', 'national']
      },
      {
        id: 'ssc_secb_4', set: 'A', ch: 3,
        q: 'Why are river plains (floodplains) the most densely populated landforms on Earth? Give two reasons.',
        keywords: ['fertile', 'alluvium', 'agriculture', 'flat', 'transport'],
        ans: '1. Fertile Soil & Water: Rivers deposit mineral-rich sediments (alluvium), making floodplains ideal for growing crops. (1 Mark)\n2. Gentle Slope: Flat terrain makes building houses, roads, railways, and river navigation easy. (1 Mark)'
      },
      {
        id: 'ssc_secb_5', set: 'A', ch: 14,
        q: 'Define a "Cooperative" and explain why the milk farmers of Anand formed one in 1946.',
        keywords: ['voluntarily', 'collectively', 'middlemen', 'AMUL', 'Pasteurisation'],
        ans: '1. Cooperative: A group of people who voluntarily come together to meet their economic needs collectively and share decisions fairly. (1 Mark)\n2. The farmers of Anand formed AMUL to free themselves from exploitation by middlemen who bought milk at meagre prices. (1 Mark)'
      },

      // --- SET B (5 questions, internal OR in Q13 & Q15) ---
      {
        id: 'ssc_secb_6', set: 'B', ch: 1,
        choiceA: {
          q: 'Differentiate between Parallels of Latitude and Meridians of Longitude (any two points).',
          ans: '1. Direction & Shape: Latitudes are full circles running East–West parallel to the Equator; Longitudes are half-circles running North–South from Pole to Pole. (1 Mark)\n2. Function: Latitudes determine heat zones (climate); Longitudes determine local time and time zones. (1 Mark)'
        },
        choiceB: {
          q: 'Why is a globe a better model of the Earth than a flat world map?',
          ans: '1. Because both the Earth and a globe are spherical (geoid), a globe represents the true shapes, sizes, and distances of continents and oceans without distortion. (1 Mark)\n2. Flattening a sphere onto a flat map inevitably stretches or distorts polar regions (like peeling an orange). (1 Mark)'
        },
        keywords: ['parallel', 'equator', 'pole', 'time', 'spherical', 'distortion']
      },
      {
        id: 'ssc_secb_7', set: 'B', ch: 7,
        q: 'Name the four Vedas. Which is the oldest Veda, and which Indian classical traditions grew from them?',
        keywords: ['Rig Veda', 'Yajur', 'Sama', 'Atharva', 'UNESCO'],
        ans: '1. The four Vedas are the Rig Veda, Yajur Veda, Sāma Veda, and Atharva Veda. (1 Mark)\n2. The Rig Veda is the oldest (recognized by UNESCO as a masterpiece of oral heritage); the Upanishads, yoga, music (Sāma Veda), and ayurveda grew from Vedic traditions. (1 Mark)'
      },
      {
        id: 'ssc_secb_8', set: 'B', ch: 12,
        choiceA: {
          q: 'How are urban local bodies classified into three types based on city population in India?',
          ans: '1. Municipal Corporation (Mahanagar Nigam): For large cities with population above 10 lakhs.\n2. Municipal Council (Nagar Palika): For medium towns/cities with population between 1 lakh and 10 lakhs. (1 Mark)\n3. Nagar Panchayat: For smaller towns transitioning from rural to urban areas. (1 Mark)'
        },
        choiceB: {
          q: 'State any four civic duties that responsible citizens should perform to help Urban Local Bodies keep their city clean and functional.',
          ans: '1. Segregate wet and dry household waste before handing it to garbage collectors.\n2. Promptly report leaking water pipes, damaged roads, or broken street lights to the ward office. (1 Mark)\n3. Avoid single-use plastics and pay property/water taxes honestly on time. (1 Mark)'
        },
        keywords: ['Corporation', 'Council', 'Nagar Panchayat', '10 lakhs', 'waste', 'taxes']
      },
      {
        id: 'ssc_secb_9', set: 'B', ch: 3,
        q: 'Why are plateaus often called "storehouses of minerals"? Give one Indian example.',
        keywords: ['minerals', 'mining', 'iron', 'coal', 'Chota Nagpur', 'Deccan'],
        ans: '1. Plateaus are rich in mineral deposits (iron, coal, manganese, gold) formed over millions of years, making mining a major activity there. (1 Mark)\n2. Example: The Chota Nagpur Plateau in eastern India (rich in iron ore, coal, and manganese) or the Deccan Plateau. (1 Mark)'
      },
      {
        id: 'ssc_secb_10', set: 'B', ch: 6,
        q: 'What did the Harappans eat? Mention any four food items confirmed by archaeological findings.',
        keywords: ['barley', 'wheat', 'millets', 'pulses', 'turmeric', 'dairy'],
        ans: '1. Cereals & Pulses: Barley, wheat, millets, rice (in Gujarat), and various pulses/lentils. (1 Mark)\n2. Vegetables, Spices & Animal products: Dairy products, fish, meat, and spices like turmeric and ginger (found in cooking pot residues). (1 Mark)'
      }
    ],

    // =========================================================================
    // SECTION C: Q18–Q21 SHORT ANSWER (4 × 3 = 12 Marks, Internal OR in Q19 & Q21)
    // =========================================================================
    sectionCPool: [
      // --- SET A (4 questions, internal OR in Q19 & Q21) ---
      {
        id: 'ssc_secc_1', set: 'A', ch: 4,
        q: 'How did the lifestyle of early humans change when they transitioned from hunter-gatherers to growing the first crops after the Ice Age?',
        keywords: ['settled', 'agriculture', 'domestication', 'pottery', 'hamlets', 'rivers'],
        ans: '1. Settled Life near Rivers: Instead of wandering in caves and rock shelters, humans built permanent mud houses in hamlets near fertile river valleys. (1 Mark)\n2. Cultivation & Domestication: They began cultivating cereals (wheat, barley, rice) and domesticating animals like cattle, sheep, goats, and dogs. (1 Mark)\n3. New Crafts & Community: Need for storing grain led to pottery making, better polished stone tools, metal use (copper), and village communities headed by chieftains. (1 Mark)'
      },
      {
        id: 'ssc_secc_2', set: 'A', ch: 1,
        choiceA: {
          q: 'Explain the three essential components of a map — Distance (Scale), Direction, and Symbols — with an example of each.',
          ans: '1. Distance (Scale): The ratio between distance on the map and actual distance on the ground (e.g., 1 cm = 10 km) so large areas fit on paper. (1 Mark)\n2. Direction: Cardinal points (North, East, South, West) and intermediate directions (NE, SE, SW, NW), marked by an "N" arrow at the top. (1 Mark)\n3. Symbols: Standard signs, letters, and colours (blue for water, green for plains, PO for Post Office) fixed by the Survey of India to pack rich details into small spaces. (1 Mark)'
        },
        choiceB: {
          q: 'What are the three major heat (climatic) zones of the Earth? Name the latitudes that bound them.',
          ans: '1. Torrid (Tropical) Zone: Lies between the Tropic of Cancer (23.5°N) and Tropic of Capricorn (23.5°S); receives direct overhead sunlight and is the hottest zone. (1 Mark)\n2. Temperate Zones: Lie between 23.5°N–66.5°N (North) and 23.5°S–66.5°S (South); have moderate temperatures. (1 Mark)\n3. Frigid (Polar) Zones: Lie beyond the Arctic Circle (66.5°N to 90°N) and Antarctic Circle (66.5°S to 90°S); remain extremely cold and snow-covered. (1 Mark)'
        },
        keywords: ['scale', 'direction', 'cardinal', 'symbols', 'Torrid', 'Temperate', 'Frigid']
      },
      {
        id: 'ssc_secc_3', set: 'A', ch: 10,
        q: 'Explain how the three organs of government — Legislature, Executive, and Judiciary — work together in the case of cybercriminals stealing money online.',
        keywords: ['Legislature', 'cyber laws', 'Executive', 'police', 'Judiciary', 'courts'],
        ans: '1. Legislature: Parliament passes cyber laws defining online fraud and identity theft as punishable crimes. (1 Mark)\n2. Executive: The cyber police department investigates the crime, tracks down the cybercriminals, and arrests them according to the law. (1 Mark)\n3. Judiciary: The courts conduct a fair trial, examine the evidence, and sentence the guilty criminals to prison or fines. (1 Mark)'
      },
      {
        id: 'ssc_secc_4', set: 'A', ch: 11,
        choiceA: {
          q: 'Who are the Panchayat Secretary and the Patwari? How do they assist the Gram Panchayat?',
          ans: '1. Panchayat Secretary: An appointed official who calls meetings, maintains official records/registers, and handles administrative accounts of the Gram Panchayat. (1.5 Marks)\n2. Patwari (Lekhpal/Talati): A village official who maintains land ownership records, maps agricultural plots (sometimes centuries old), and records crop statistics for farmers. (1.5 Marks)'
        },
        choiceB: {
          q: 'What is the "Child-Friendly Panchayat Initiative"? Give two examples of how Bal Panchayats in India have solved real problems.',
          ans: '1. Child-Friendly Panchayat Initiative creates Bal Sabhas and Bal Panchayats where children voice concerns about education, health, and safety. (1 Mark)\n2. In Maharashtra, Bal Panchayats campaigned to eliminate child labour and child marriage, bringing children back to school.\n3. In Sikkim (Sangkhu Radhu Khandu), the Panchayat built compound walls for school safety and kitchens for hygienic midday meals. (2 Marks)'
        },
        keywords: ['Panchayat Secretary', 'records', 'Patwari', 'land', 'Bal Panchayat', 'Sikkim', 'Maharashtra']
      },

      // --- SET B (4 questions, internal OR in Q19 & Q21) ---
      {
        id: 'ssc_secc_5', set: 'B', ch: 3,
        q: 'Compare young fold mountains and old fold mountains with an example of each, and state two ways mountains are vital to human life.',
        keywords: ['Himalayas', 'Aravalli', 'tall', 'sharp peaks', 'rounded', 'rivers'],
        ans: '1. Young Mountains (e.g., Himalayas): Formed relatively recently in Earth\'s history; have very tall, sharp peaks and steep slopes. (1 Mark)\n2. Old Mountains (e.g., Aravalli Range): Formed hundreds of millions of years ago; have lower, rounded peaks worn down by erosion. (1 Mark)\n3. Significance: Melting snow and glaciers feed perennial rivers (Ganga, Yamuna, Brahmaputra) for irrigation, and mountain forests provide timber and medicinal herbs. (1 Mark)'
      },
      {
        id: 'ssc_secc_6', set: 'B', ch: 7,
        choiceA: {
          q: 'Discuss the core teachings of the Upanishads. Explain the concepts of "Brahman" and "Ātman" with an example.',
          ans: '1. Brahman & Ātman: The Upanishads teach that everything in the universe is connected by one divine essence called Brahman, which resides within each living being as the Ātman (self/soul). (1.5 Marks)\n2. Unity of All Life: Just as salt dissolved in water is invisible yet present in every drop (Shvetaketu\'s story) or a tiny banyan seed holds a mighty tree, the same divine essence connects all beings ("Tat tvam asi" — You are That). (1.5 Marks)'
        },
        choiceB: {
          q: 'How have folk and tribal traditions enriched Indian culture? Explain with two examples of tribal deities integrated with pan-Indian traditions.',
          ans: '1. Bidirectional Interaction: Tribal and folk traditions constantly exchanged stories, art, music, and reverence for nature with mainstream Hindu traditions. (1 Mark)\n2. Example 1: Lord Jagannātha at Puri (Odisha) was originally worshipped as a tribal deity using wooden icons.\n3. Example 2: Singbonga (supreme deity of Munda and Santhal tribes) and Donyipolo (Sun-Moon god in Arunachal Pradesh) reflect deep harmony with nature. (2 Marks)'
        },
        keywords: ['Brahman', 'Atman', 'Shvetaketu', 'Jagannatha', 'tribal', 'Donyipolo']
      },
      {
        id: 'ssc_secc_7', set: 'B', ch: 12,
        q: 'What is a "Ward" in an urban area? List any three important functions performed by a Ward Committee and Urban Local Bodies.',
        keywords: ['wards', 'garbage', 'water supply', 'health camps', 'infrastructure', 'taxes'],
        ans: '1. Ward: Cities and towns are divided into smaller administrative units called wards, each electing a ward member/councillor. (1 Mark)\n2. Functions of Ward Committee & ULBs:\n   • Organising health camps, vaccination drives, and campaigns against single-use plastics.\n   • Maintaining water supply, drainage, street lights, roads, and solid waste collection.\n   • Issuing birth/marriage/trade certificates and collecting local property taxes. (2 Marks)'
      },
      {
        id: 'ssc_secc_8', set: 'B', ch: 14,
        choiceA: {
          q: 'Distinguish between Primary, Secondary, and Tertiary economic sectors with two examples of each.',
          ans: '1. Primary Sector: Directly extracts raw materials from nature. Examples: Agriculture, fishing, mining, forestry. (1 Mark)\n2. Secondary Sector: Processes raw materials from the primary sector into finished goods in factories/construction. Examples: Textile mills, automobile factories, furniture making. (1 Mark)\n3. Tertiary (Service) Sector: Provides essential services supporting primary and secondary sectors. Examples: Banking, transportation, hospitals, software development. (1 Mark)'
        },
        choiceB: {
          q: 'Explain with a flow diagram how all three economic sectors work together to turn wood pulp from trees into the NCERT textbook in your hands.',
          ans: '1. Primary Sector (Forestry): Trees are harvested in sustainably managed forests to obtain timber logs and wood pulp. (1 Mark)\n2. Secondary Sector (Manufacturing): Paper mills process wood pulp into paper rolls, and printing presses print and bind the pages into textbooks. (1 Mark)\n3. Tertiary Sector (Services): Trucks/trains transport logs and books, warehouses store them, and retail bookshops sell them to students. (1 Mark)'
        },
        keywords: ['Primary', 'Secondary', 'Tertiary', 'nature', 'manufacturing', 'services', 'pulp', 'printing']
      }
    ],

    // =========================================================================
    // SECTION D: Q22–Q24 LONG ANSWER (3 × 5 = 15 Marks, Internal OR in all 3)
    // =========================================================================
    sectionDPool: [
      // --- SET A (3 Long Answer questions × 5 marks each) ---
      {
        id: 'ssc_secd_1', set: 'A', ch: 6,
        choiceA: {
          q: 'Describe the remarkable town planning, craft skills, and toys discovered in the Harappan (Indus-Sarasvatī) cities.',
          ans: '1. Two-Part Town Planning: Cities like Harappa and Mohenjo-daro had an elevated "Upper Town" (Citadel) for public buildings like the Great Bath and a larger "Lower Town" with residential houses along wide streets oriented to cardinal directions. (2 Marks)\n2. Advanced Craft & Metallurgy: Harappans crafted carnelian beads drilled with special tools, shell bangles, steatite seals with animal figures and script, and bronze sculptures (e.g., Dancing Girl). (1.5 Marks)\n3. Terracotta Toys & Games: Excavations revealed terracotta whistles, miniature bullock carts, spinning tops, animal puppets with movable heads, and gameboards showing a vibrant cultural life. (1.5 Marks)'
        },
        choiceB: {
          q: 'How was Dholavira (in Gujarat) different from most other Indus-Sarasvatī cities? Also state two major causes that led to the decline of the Harappan Civilisation around 1900 BCE.',
          ans: '1. Three Distinct Zones: Unlike other Harappan cities divided into two parts, Dholavira had three zones — the Citadel, the Middle Town, and the Lower Town — built extensively using stone alongside bricks. (1.5 Marks)\n2. Giant Water Reservoirs: Dholavira had at least six huge stone and rock-cut reservoirs (some 73 m long) interconnected by underground drains for arid-region water harvesting, plus a large 10-sign signboard. (1.5 Marks)\n3. Causes of Decline (~1900 BCE):\n   • Climatic Change: Prolonged reduced rainfall and a drier phase around 2200–1900 BCE.\n   • Drying of the Sarasvatī River: The Ghaggar-Hakra (Sarasvatī) river dried up, forcing inhabitants of cities like Kalibangan and Banawali to migrate to smaller rural settlements. (2 Marks)'
        },
        keywords: ['Upper Town', 'Lower Town', 'Great Bath', 'carnelian', 'Dholavira', 'reservoirs', 'Sarasvati', 'climate']
      },
      {
        id: 'ssc_secd_2', set: 'A', ch: 1,
        choiceA: {
          q: 'What is Indian Standard Time (IST)? Why do countries need a Standard Time instead of using local solar time for every city, and how are world Time Zones calculated?',
          ans: '1. Need for Standard Time: Since local time changes by 4 minutes for every 1° of longitude, Porbandar (Gujarat) and Tinsukia (Assam) are nearly 30° apart (~2 hours difference in sunrise). Using different local times would create chaos for railways, flights, and communication. (2 Marks)\n2. Indian Standard Time (IST): India adopts the local time of the central meridian 82°30\' E (82.5° E) as the uniform standard time for the whole country, which is 5 hours 30 minutes ahead of GMT (+5:30). (1.5 Marks)\n3. World Time Zones: The globe (360°) is divided into 24 standard time zones of 15° longitude each (1 hour per 15°). Moving East of Greenwich (0°) adds hours (+), while moving West subtracts hours (−). (1.5 Marks)'
        },
        choiceB: {
          q: 'Explain how a grid of latitudes and longitudes helps us locate any place on Earth accurately, and illustrate cardinal and intermediate directions with a neat labelled diagram.',
          ans: '1. Coordinate Grid System: Parallels of latitude (running East–West, 0° to 90°N/S) and Meridians of longitude (running North–South, 0° to 180°E/W) cross each other at right angles to form a global grid. (2 Marks)\n2. Pinpointing Locations: The intersection of a specific latitude and longitude gives the exact coordinates of a city (e.g., Delhi lies near 29°N latitude and 77°E longitude). (1 Mark)\n3. Cardinal & Intermediate Directions:\n   • Four Cardinal Points: North (N), East (E), South (S), West (W).\n   • Four Intermediate Directions: North-East (NE), South-East (SE), South-West (SW), North-West (NW). (2 Marks)'
        },
        keywords: ['82.5', '5 hours 30 minutes', 'GMT', '15°', 'grid', 'coordinates', 'cardinal', 'intermediate']
      },
      {
        id: 'ssc_secd_3', set: 'A', ch: 11,
        choiceA: {
          q: 'Explain the three-tier structure of the Panchayati Raj system in rural India, its key functions, and the main sources of funds of a Gram Panchayat.',
          ans: '1. Three-Tier Structure:\n   • Village Level: Gram Sabha (all adult voters) elects the Gram Panchayat headed by the Sarpanch.\n   • Block Level: Panchayat Samiti coordinates development plans across villages in a block.\n   • District Level: Zila Parishad oversees district-level rural development and fund allocation. (2 Marks)\n2. Key Functions: Maintaining village roads, wells, sanitation, street lights, primary schools, health centres, and implementing schemes like PM Gram Sadak Yojana. (1.5 Marks)\n3. Sources of Funds: Grants from State/Central governments under Finance Commission schemes, local taxes on houses/markets, and community donations. (1.5 Marks)'
        },
        choiceB: {
          q: 'Compare the teachings and life journeys of Gautama Buddha and Vardhamāna Mahāvīra. What common values did both Buddhism and Jainism emphasize?',
          ans: '1. Gautama Buddha (Buddhism): Born at Lumbini (560 BCE), attained enlightenment at Bodh Gaya. Taught that avidyā (ignorance) and attachment (kāma) cause suffering, and prescribed the Eightfold Path, ahimsā, and inner discipline. (2 Marks)\n2. Vardhamāna Mahāvīra (Jainism): Born near Vaishali (540 BCE), practised 12 years of asceticism to become a Jina (conqueror). Taught Ahimsā (non-injury to even microscopic beings), Anekāntavāda (many-sided truth), and Aparigraha (non-possession). (2 Marks)\n3. Common Values: Both rejected caste superiority by birth, opposed animal sacrifices, taught in people\'s spoken languages, and emphasized Ahimsā, truth, and compassion. (1 Mark)'
        },
        keywords: ['Gram Sabha', 'Panchayat Samiti', 'Zila Parishad', 'Sarpanch', 'Buddha', 'Mahavira', 'Ahimsa', 'Aparigraha']
      },

      // --- SET B (3 Long Answer questions × 5 marks each) ---
      {
        id: 'ssc_secd_4', set: 'B', ch: 3,
        choiceA: {
          q: 'Describe the three major landforms of the Earth — Mountains, Plateaus, and Plains — comparing their physical features, economic opportunities, and natural challenges.',
          ans: '1. Mountains: High landforms with steep slopes and narrow peaks (e.g., Himalayas). Opportunities: Perennial river sources, terrace farming, tourism, medicinal herbs. Challenges: Landslides, avalanches, cloudbursts, and harsh cold. (2 Marks)\n2. Plateaus: Elevated flat-topped lands ("tablelands", e.g., Deccan & Tibetan Plateaus). Opportunities: Rich mineral storehouses (mining), waterfalls for hydroelectricity (Hundru, Jog Falls), and black-soil cotton farming. Challenges: Rocky soil and water scarcity in rain-shadow areas. (1.5 Marks)\n3. Plains: Flat or gently undulating lowlands formed by river alluvium (e.g., Gangetic Plains). Opportunities: Intensive agriculture, dense transport networks, and trade. Challenges: Seasonal river floods and groundwater depletion. (1.5 Marks)'
        },
        choiceB: {
          q: 'How is Indian society governed across three levels — Local, State, and National? Explain the principle of "Partcipatory Democracy" and why local government is the base of the governance pyramid.',
          ans: '1. Three Levels of Government:\n   • Local Level: Gram Panchayats (rural) and Municipal Bodies (urban) handle neighbourhood issues like water, sanitation, and local roads.\n   • State Level: State Government handles police, agriculture, health, and education within the state.\n   • National (Central) Level: Union Government handles defence, foreign affairs, railways, and currency. (2.5 Marks)\n2. Participatory Democracy & Governance Pyramid: Local government forms the broad base of the pyramid because it is closest to the citizens, empowering everyday people (and even children in Bal Sabhas) to directly discuss, report, and solve local problems. (2.5 Marks)'
        },
        keywords: ['Mountains', 'Plateaus', 'Plains', 'terrace farming', 'minerals', 'alluvium', 'Local', 'State', 'National']
      },
      {
        id: 'ssc_secd_5', set: 'B', ch: 14,
        choiceA: {
          q: 'Using the case study of the AMUL Dairy Cooperative in Gujarat, explain how Primary, Secondary, and Tertiary economic sectors are deeply interdependent.',
          ans: '1. Primary Sector (Milk Production): Farmers in villages of Gujarat rear cows and buffaloes and collect fresh milk daily — a direct nature-based primary activity. (1.5 Marks)\n2. Secondary Sector (Processing & Value Addition): At AMUL dairy plants, raw liquid milk is pasteurised and processed into butter, ghee, cheese, milk powder, and ice cream. (1.5 Marks)\n3. Tertiary Sector (Transport, Banking & Retail): Refrigerated trucks, trains, and ships transport milk products nationwide and abroad; banks handle payments; retail shops sell products to consumers. (1 Mark)\n4. Interdependence: Without farmers (Primary), factories have no milk; without factories (Secondary), milk spoils; without transport and shops (Tertiary), products cannot reach buyers. (1 Mark)'
        },
        choiceB: {
          q: 'Compare the administrative structure and civic responsibilities of Rural Panchayati Raj Institutions with Urban Local Bodies in India.',
          ans: '1. Structure: Rural areas have a 3-tier Panchayati Raj (Gram Panchayat, Panchayat Samiti, Zila Parishad), whereas Urban areas have Nagar Panchayats, Municipal Councils, or Municipal Corporations divided into Wards. (2 Marks)\n2. Citizen Participation: In villages, all adult voters meet face-to-face in the Gram Sabha; in large cities, citizens participate through Ward Committees and elected Ward Councillors. (1.5 Marks)\n3. Common Goals & Services: Both represent decentralised grassroots democracy — maintaining clean water, sanitation, waste management, street lighting, local infrastructure, and collecting local taxes. (1.5 Marks)'
        },
        keywords: ['Primary', 'Secondary', 'Tertiary', 'pasteurised', 'AMUL', 'interdependent', 'Gram Sabha', 'Ward']
      },
      {
        id: 'ssc_secd_6', set: 'B', ch: 4,
        choiceA: {
          q: 'What are the major sources of history? Classify them into Archaeological, Literary, and Oral/Artistic sources with two examples of each.',
          ans: '1. Archaeological Sources (Excavated & Physical Remains):\n   • Monuments & Structures: Stupas, temples, forts, and Harappan cities.\n   • Inscriptions (Epigraphy) & Coins (Numismatics): Ashokan rock edicts, copper plates, and ancient gold/silver coins.\n   • Artefacts: Stone tools, painted pottery, beads, and seals. (2 Marks)\n2. Literary Sources (Written Records):\n   • Indigenous Texts: Vedas, Upanishads, epics (Ramayana, Mahabharata), Jataka tales, Sangam literature, and Kautilya\'s Arthashastra.\n   • Foreign Accounts: Travelogues of Chinese pilgrims like Xuanzang (Hiuen Tsang) and Greek ambassadors. (2 Marks)\n3. Oral & Artistic Sources: Folk songs, ballads, tribal lore, rock paintings (Bhimbetka), and sculptures. (1 Mark)'
        },
        choiceB: {
          q: 'Trace the major characteristics of the Indus-Sarasvatī Civilisation with respect to (a) Agriculture and Trade, (b) Seals and Script, and (c) Civic Administration.',
          ans: '1. Agriculture & Trade: First in Eurasia to grow cotton; cultivated barley, wheat, millets, and pulses. Traded carnelian beads, timber, and ivory with Mesopotamia (Susa/Oman) via Lothal dockyard using standardized stone weights. (2 Marks)\n2. Seals & Undeciphered Script: Small square steatite seals carved with animal figures (unicorn, bull, tiger) and a pictographic script (still undeciphered) were used to stamp clay tags on trade goods. (1.5 Marks)\n3. Peaceful Civic Administration: No weapons of war or royal palaces with armies were found; cities maintained uniform brick proportions, clean drains, and civic order through trade and cooperation. (1.5 Marks)'
        },
        keywords: ['Archaeological', 'Inscriptions', 'Manuscripts', 'Xuanzang', 'cotton', 'Lothal', 'steatite seals']
      }
    ],

    // =========================================================================
    // SECTION E: Q25–Q26 CASE-BASED / SOURCE-BASED UNITS (2 × 4 = 8 Marks)
    // =========================================================================
    sectionEPool: [
      {
        id: 'ssc_sece_1', set: 'A', ch: 6,
        passage: 'Read the source given below and answer the following questions:\n"The Harappans gave much importance to water management and cleanliness. They often had separate areas for bathing in their homes; these were connected to a larger network of drains, which generally ran below the streets and took the waste water away. In Mohenjo-daro, people drew water from hundreds of wells made of bricks. At Dholavira, at least six large reservoirs were built with stones or even cut into the rock. Most of them were connected through underground drains for efficient water harvesting and distribution."',
        q: '(a) What two things did the Harappans give much importance to? (1 Mark)\n(b) Where were the drains located that carried waste water away from houses? (1 Mark)\n(c) How did the people of Mohenjo-daro and Dholavira obtain and conserve water differently? (2 Marks)',
        keywords: ['water management', 'cleanliness', 'below the streets', 'brick wells', 'rock-cut reservoirs'],
        ans: '(a) Water management and cleanliness (civic sanitation). (1 Mark)\n(b) The drains ran below the streets (covered underground drains connected to house bathrooms). (1 Mark)\n(c) In Mohenjo-daro, people drew water from hundreds of brick-lined wells, whereas in arid Dholavira, they built at least six large stone and rock-cut reservoirs connected by underground drains for rainwater harvesting. (2 Marks)'
      },
      {
        id: 'ssc_sece_2', set: 'A', ch: 11,
        passage: 'Read the source given below and answer the following questions:\n"Hiware Bazar, a village in Ahmednagar district of Maharashtra, used to be affected by frequent droughts and poor agricultural yield. After Popatrao Baguji Pawar became its Sarpanch, he started applying Anna Hazare\'s model of rainwater harvesting, watershed conservation and massive tree planting of lakhs of trees, all of which contributed to the recharge of groundwater. With the collaboration of the villagers, Hiware Bazar became a green and prosperous village in a few years. Shri Popatrao Pawar was awarded the Padma Shri in 2020."',
        q: '(a) Which village in Maharashtra suffered from frequent droughts and poor agricultural yield? (1 Mark)\n(b) Who became the Sarpanch of this village and led its transformation? (1 Mark)\n(c) What three main measures were implemented to recharge the village\'s groundwater? (2 Marks)',
        keywords: ['Hiware Bazar', 'Popatrao', 'rainwater harvesting', 'watershed conservation', 'tree planting'],
        ans: '(a) Hiware Bazar (in Ahmednagar district of Maharashtra). (1 Mark)\n(b) Shri Popatrao Baguji Pawar (awarded the Padma Shri in 2020). (1 Mark)\n(c) The three main measures were:\n   1. Rainwater harvesting,\n   2. Watershed conservation, and\n   3. Massive tree plantation of lakhs of trees by villagers. (2 Marks)'
      },
      {
        id: 'ssc_sece_3', set: 'B', ch: 12,
        passage: 'Read the source given below and answer the following questions:\n"Indore in Madhya Pradesh has been awarded the cleanest city in India under the Swachh Survekshan government scheme for seven years in a row. As a large city with a population above 10 lakhs, it is governed by the Indore Municipal Corporation. Besides collecting property tax and water charges, the Corporation manages solid waste segregation, fire services, water tankers, and Citizen Relationship Management (CRM) grievance redressal — supported actively by citizens who segregate waste at source."',
        q: '(a) Which city has been awarded the cleanest city in India under Swachh Survekshan for seven years in a row? (1 Mark)\n(b) Why does Indore have a Municipal Corporation instead of a Municipal Council? (1 Mark)\n(c) Mention any two paid revenue sources and two civic services provided by the Indore Municipal Corporation, along with the role of citizens. (2 Marks)',
        keywords: ['Indore', '10 lakhs', 'property tax', 'solid waste', 'segregate'],
        ans: '(a) Indore (in Madhya Pradesh). (1 Mark)\n(b) Because Indore has a population above 10 lakhs (cities above 10 lakhs have a Municipal Corporation / Mahanagar Nigam). (1 Mark)\n(c) Revenue sources: Property tax, water charges, trade licenses. Services: Solid waste management, fire services, ambulance/water tankers. Citizens helped by segregating household waste and keeping streets clean. (2 Marks)'
      },
      {
        id: 'ssc_sece_4', set: 'B', ch: 14,
        passage: 'Read the source given below and answer the following questions:\n"These days, used paper is recycled to make new paper. Recycling just one tonne of paper saves 17 full-grown trees as well as 2.5 cubic metres of landfill space, where waste is dumped. It also takes 70 per cent less energy and water to recycle paper than to make new paper from fresh wood pulp. From extracting wood pulp in forests to manufacturing paper in mills and selling textbooks in bookshops, all three economic sectors work together."',
        q: '(a) How many trees and how much landfill space are saved by recycling one tonne of paper? (1 Mark)\n(b) By what percentage does recycling paper reduce energy and water consumption compared to using fresh wood pulp? (1 Mark)\n(c) Classify (i) felling trees for pulp, (ii) making paper in a paper mill, and (iii) transporting books by truck into their respective economic sectors. (2 Marks)',
        keywords: ['17 trees', '2.5 cubic metres', '70 per cent', 'Primary', 'Secondary', 'Tertiary'],
        ans: '(a) Recycling one tonne of paper saves 17 trees and 2.5 cubic metres of landfill space. (1 Mark)\n(b) It uses 70 per cent (70%) less energy and water. (1 Mark)\n(c) (i) Felling trees for pulp: Primary Sector; (ii) Making paper in a mill: Secondary Sector; (iii) Transporting books by truck: Tertiary (Service) Sector. (2 Marks)'
      },
      {
        id: 'ssc_sece_5_pa1', set: 'A', ch: 1,
        passage: 'Read the source given below and answer the following questions:\n"Because the Earth completes one full 360° rotation in 24 hours, it turns 15° of longitude every hour. The 0° meridian passing through Greenwich (London) is taken as the Prime Meridian for Greenwich Mean Time (GMT). India spans nearly 30° of longitude from Gujarat to Arunachal Pradesh, so it follows a single Standard Meridian at 82°30\' E for Indian Standard Time (IST)."',
        q: '(a) By how many degrees does the Earth rotate in 1 hour? (1 Mark)\n(b) Which meridian is used to calculate Indian Standard Time (IST)? (1 Mark)\n(c) If a cricket match starts at 9:00 AM GMT in London, what will be the time in India (IST, which is 5 hours 30 minutes ahead of GMT)? (2 Marks)',
        keywords: ['15°', '82°30', '2:30 PM', '5 hours 30 minutes'],
        ans: '(a) 15° of longitude per hour (360° ÷ 24 hours). (1 Mark)\n(b) 82°30\' E (82.5° E) longitude. (1 Mark)\n(c) 9:00 AM + 5 hours 30 minutes = 2:30 PM IST. (2 Marks)'
      }
    ],

    // =========================================================================
    // SECTION F: Q27 MAP SKILL BASED QUESTION (1 × 3 = 3 Marks)
    // =========================================================================
    sectionFPool: [
      {
        id: 'ssc_secf_1', set: 'A', ch: 6,
        diagramType: 'india_map_skill',
        q: 'On the given outline map of India (marked A, B, and C), identify, locate and label the following (1 × 3 = 3 Marks):\n(A) First city to be discovered and excavated in the Indus-Sarasvatī Civilisation (in Punjab region).\n(B) The major water body lying to the west of India.\n(C) The Harappan city in Gujarat where a 10-sign engraved signboard and six rock-cut water reservoirs were found.',
        keywords: ['Harappa', 'Arabian Sea', 'Dholavira'],
        ans: '(A) Harappa (First city excavated in 1920–21 in the Indus-Sarasvatī basin). (1 Mark)\n(B) Arabian Sea (Water body to the west of India). (1 Mark)\n(C) Dholavira (located in Khadir Bet, Rann of Kutch, Gujarat). (1 Mark)'
      },
      {
        id: 'ssc_secf_2', set: 'B', ch: 6,
        diagramType: 'india_map_skill',
        q: 'On the given outline map of India (marked A, B, and C), identify, locate and label the following (1 × 3 = 3 Marks):\n(A) The largest Harappan site located in Haryana.\n(B) The Harappan port town in Gujarat where a huge brick dockyard was excavated.\n(C) The Standard Meridian of India (82°30\' E) or the water body lying to the east of India.',
        keywords: ['Rakhigarhi', 'Lothal', 'Bay of Bengal', '82°30'],
        ans: '(A) Rakhigarhi (in Haryana — one of the largest Indus-Sarasvatī sites). (1 Mark)\n(B) Lothal (in Gujarat near the Gulf of Khambhat — famous for its brick dockyard). (1 Mark)\n(C) Bay of Bengal (to the east of India) / 82°30\' E IST Meridian. (1 Mark)'
      }
    ]
  };

  registerExamBlueprint('6', 'SSC', SSC_ANNUAL_BLUEPRINT);
})();
