/**
 * Class VI Science (Curiosity) — Reproducible Annual Examination Sample Paper Engine
 * Aligned strictly with:
 *   1. Bloom Public School, C-8 Vasant Kunj, New Delhi — Sample Paper Pattern (2026–27)
 *      - Time: 2.30 Hours | Max Marks: 60 | Total Questions: 31 across 5 Sections (A–E)
 *      - Section A: Q1–Q17 (17 Objective Questions × 1 mark = 17 Marks; Q1–Q15 MCQ, Q16–Q17 Assertion-Reason)
 *      - Section B: Q18–Q22 (5 Very Short Answer × 2 marks = 10 Marks; 30–50 words; Internal OR in Q19 & Q21)
 *      - Section C: Q23–Q27 (5 Short Answer × 3 marks = 15 Marks; 50–80 words; Q23 Match Column A & B)
 *      - Section D: Q28–Q29 (2 Long Answer × 5 marks = 10 Marks; 80–120 words; Internal OR in Q29)
 *      - Section E: Q30–Q31 (2 Source/Case-Based Units × 4 marks = 8 Marks; Internal OR in Q31)
 *   2. Official Final Examination Syllabus (Page 3 of Science_Curiosity_Syllabus.pdf):
 *      - Assessed Chapters (8): Ch 2, Ch 3, Ch 4, Ch 5, Ch 7, Ch 9, Ch 10, Ch 12
 *      - Excluded / CBE-Only (4): Ch 1 (Discussion only), Ch 6 (CBE), Ch 8 (CBE), Ch 11 (CBE)
 */
(function () {
  const SCIENCE_ANNUAL_BLUEPRINT = {
    schoolName: 'BLOOM PUBLIC SCHOOL',
    schoolAddress: 'C-8 Vasant Kunj, New Delhi',
    examTitle: 'ANNUAL EXAMINATION SAMPLE PAPER (2026–27)',
    subject: 'SCIENCE (CURIOSITY)',
    classLabel: 'CLASS VI',
    duration: '2.30 Hr',
    maxMarks: 60,
    totalQuestions: 31,
    assessedChapters: [
      { num: 2, title: 'Diversity in the Living World', weightMarks: 8 },
      { num: 3, title: 'Mindful Eating: A Path to a Healthy Body', weightMarks: 8 },
      { num: 4, title: 'Exploring Magnets', weightMarks: 7 },
      { num: 5, title: 'Measurement of Length and Motion', weightMarks: 8 },
      { num: 7, title: 'Temperature and its Measurement', weightMarks: 8 },
      { num: 9, title: 'Methods of Separation in Everyday Life', weightMarks: 7 },
      { num: 10, title: 'Living Creatures: Exploring their Characteristics', weightMarks: 7 },
      { num: 12, title: 'Beyond Earth', weightMarks: 7 }
    ],
    excludedChapters: [
      { num: 1, title: 'The Wonderful World of Science', reason: 'Discussion only — not to be assessed' },
      { num: 6, title: 'Materials Around Us', reason: 'CBE Activity only — excluded from Final Exam' },
      { num: 8, title: 'A Journey through States of Water', reason: 'CBE Activity only — excluded from Final Exam' },
      { num: 11, title: "Nature's Treasures", reason: 'CBE Activity only — excluded from Final Exam' }
    ],
    instructions: [
      'i. This question paper consists of 31 questions in 5 sections.',
      'ii. All questions are compulsory. However, an internal choice is provided in some questions. A student is expected to attempt only one of these questions.',
      'iii. Section A consists of 17 objective type questions carrying 1 mark each.',
      'iv. Section B consists of 5 Very Short questions carrying 02 marks each. Answers to these questions should be in the range of 30 to 50 words.',
      'v. Section C consists of 5 Short Answer type questions carrying 03 marks each. Answers to these questions should be in the range of 50 to 80 words.',
      'vi. Section D consists of 2 Long Answer type questions carrying 05 marks each. Answers to these questions should be in the range of 80 to 120 words.',
      'vii. Section E consists of 2 source-based/case-based units of assessment of 04 marks each with sub-parts.'
    ],

    // =========================================================================
    // SECTION A POOL: MCQs (15 picked per paper) + Assertion-Reason (2 picked)
    // =========================================================================
    sectionAMcqPool: [
      // --- SET A CORE (15 MCQs across Ch 2, 3, 4, 5, 7, 9, 10, 12) ---
      {
        id: 'sa_mcq_1', set: 'A', ch: 2,
        q: 'A student observes a plant in the school garden that has soft, green, tender stems and parallel venation in its leaves. What type of root system and seed will this plant most likely have?',
        options: [
          'A. Taproot system and dicot seed',
          'B. Fibrous root system and monocot seed',
          'C. Taproot system and monocot seed',
          'D. Fibrous root system and dicot seed'
        ],
        correct: 1,
        ans: 'B. Fibrous root system and monocot seed (Plants with parallel venation have fibrous roots and monocotyledonous seeds, e.g., grass, wheat, maize).'
      },
      {
        id: 'sa_mcq_2', set: 'A', ch: 2,
        q: 'Deodar and pine trees growing in snowy mountain regions have cone-shaped crowns and sloping branches primarily to:',
        options: [
          'A. Absorb maximum sunlight during short summer days',
          'B. Allow rainwater and heavy snow to slide off easily without breaking branches',
          'C. Store extra water in their thick stems like desert cacti',
          'D. Prevent herbivores from eating their needles'
        ],
        correct: 1,
        ans: 'B. Allow rainwater and heavy snow to slide off easily without breaking branches.'
      },
      {
        id: 'sa_mcq_3', set: 'A', ch: 3,
        q: 'When two drops of copper sulphate solution and ten drops of caustic soda solution are added to a crushed food sample in a test tube, the mixture turns violet. This confirms the presence of:',
        options: [
          'A. Starch',
          'B. Fats',
          'C. Proteins',
          'D. Dietary fibre (Roughage)'
        ],
        correct: 2,
        ans: 'C. Proteins (Copper sulphate + caustic soda turns violet/purple in the presence of proteins).'
      },
      {
        id: 'sa_mcq_4', set: 'A', ch: 3,
        q: 'Consider the following statements regarding Millets (Shree Anna) like Jowar, Bajra, and Ragi:\n1. They are rich sources of dietary fibre, iron, and calcium.\n2. They require very little water to grow compared to refined grains.\n3. Consuming only millets without any vegetables or pulses forms a complete balanced diet.\nWhich of the above statements are correct?',
        options: [
          'A. 1 and 2 only',
          'B. 2 and 3 only',
          'C. 1 and 3 only',
          'D. 1, 2 and 3'
        ],
        correct: 0,
        ans: 'A. 1 and 2 only (No single food item alone can provide all nutrients in required proportions for a balanced diet).'
      },
      {
        id: 'sa_mcq_5', set: 'A', ch: 4,
        q: 'When a bar magnet is rolled over a heap of iron filings and lifted up, where do the maximum number of iron filings stick?',
        options: [
          'A. Uniformly along the entire length of the magnet',
          'B. Only at the exact centre of the magnet',
          'C. Near the two ends (North and South poles) of the magnet',
          'D. Only at the North pole of the magnet'
        ],
        correct: 2,
        ans: 'C. Near the two ends (North and South poles) of the magnet, where magnetic strength is strongest.'
      },
      {
        id: 'sa_mcq_6', set: 'A', ch: 4,
        q: 'Which of the following actions can cause a permanent bar magnet to lose its magnetic properties?',
        options: [
          'A. Storing it in pairs with soft iron keepers across opposite poles',
          'B. Suspending it freely with a cotton thread',
          'C. Heating it strongly over a flame or hammering it repeatedly',
          'D. Dipping it in water during a science activity'
        ],
        correct: 2,
        ans: 'C. Heating it strongly, hammering it, or dropping it repeatedly from a height destroys magnetism.'
      },
      {
        id: 'sa_mcq_7', set: 'A', ch: 5,
        q: 'While travelling inside a moving bus, Aarav looks at his friend sitting beside him and then looks at the trees outside the window. With respect to Aarav:',
        options: [
          'A. Both his friend and the trees are in motion',
          'B. His friend is at rest, while the trees outside are in motion',
          'C. His friend is in motion, while the trees outside are at rest',
          'D. Both his friend and the trees are at rest'
        ],
        correct: 1,
        ans: 'B. His friend is at rest (distance does not change with time), while the trees outside are in motion relative to Aarav.'
      },
      {
        id: 'sa_mcq_8', set: 'A', ch: 5,
        q: 'Which of the following exhibits BOTH rectilinear motion and rotational (circular) motion at the same time?',
        options: [
          'A. The pendulum of a wall clock',
          'B. The blades of a ceiling fan switched on',
          'C. The wheel of a bicycle moving forward on a straight road',
          'D. An apple falling vertically from a tree branch'
        ],
        correct: 2,
        ans: 'C. The wheel of a bicycle moving on a straight road rotates around its axle (circular) while advancing forward (rectilinear).'
      },
      {
        id: 'sa_mcq_9', set: 'A', ch: 7,
        q: 'Normal human body temperature on the Celsius scale is 37.0 °C. What is its equivalent value on the Fahrenheit scale and the Kelvin scale respectively?',
        options: [
          'A. 98.6 °F and 273.15 K',
          'B. 98.6 °F and 310.15 K',
          'C. 100 °F and 310.15 K',
          'D. 96.8 °F and 300.15 K'
        ],
        correct: 1,
        ans: 'B. 98.6 °F and 310.15 K (Since T(K) = T(°C) + 273.15 = 37 + 273.15 = 310.15 K).'
      },
      {
        id: 'sa_mcq_10', set: 'A', ch: 7,
        q: 'In a laboratory thermometer, there are 50 equal small divisions between the 0 °C mark and the 100 °C mark. What is the least count (smallest reading) of this thermometer?',
        options: [
          'A. 0.5 °C',
          'B. 1.0 °C',
          'C. 2.0 °C',
          'D. 5.0 °C'
        ],
        correct: 2,
        ans: 'C. 2.0 °C (Least count = (100 − 0) / 50 = 2.0 °C per division).'
      },
      {
        id: 'sa_mcq_11', set: 'A', ch: 9,
        q: 'A farmer wants to separate lighter husk particles from heavier wheat grains after threshing. Which method of separation and natural agent will help him most effectively?',
        options: [
          'A. Sieving using a metal mesh',
          'B. Winnowing with the help of blowing wind',
          'C. Sedimentation and decantation in water',
          'D. Handpicking each husk particle'
        ],
        correct: 1,
        ans: 'B. Winnowing with the help of blowing wind separates lighter husk from heavier grain.'
      },
      {
        id: 'sa_mcq_12', set: 'A', ch: 9,
        q: 'During the preparation of paneer (cottage cheese) at home, lemon juice is added to boiling milk, and the solid paneer is separated from the liquid whey by pouring it through a muslin cloth. This process is an example of:',
        options: [
          'A. Churning',
          'B. Decantation',
          'C. Filtration',
          'D. Evaporation'
        ],
        correct: 2,
        ans: 'C. Filtration (the muslin cloth acts as a filter with fine pores).'
      },
      {
        id: 'sa_mcq_13', set: 'A', ch: 10,
        q: 'Which of the following is the correct sequence of stages in the life cycle of a mosquito?',
        options: [
          'A. Egg → Tadpole → Froglet → Adult',
          'B. Egg → Pupa → Larva → Adult mosquito',
          'C. Egg → Larva → Pupa → Adult mosquito',
          'D. Larva → Egg → Pupa → Adult mosquito'
        ],
        correct: 2,
        ans: 'C. Egg → Larva → Pupa → Adult mosquito.'
      },
      {
        id: 'sa_mcq_14', set: 'A', ch: 12,
        q: 'Why does the Pole Star (Dhruva Tara) appear stationary at almost the same position in the night sky while other stars appear to move from east to west?',
        options: [
          'A. Because the Pole Star is the brightest star in the entire universe',
          'B. Because the Pole Star lies almost directly aligned with the northern axis of rotation of the Earth',
          'C. Because the Pole Star revolves around the Earth at the same speed',
          'D. Because the Pole Star is part of the Orion constellation'
        ],
        correct: 1,
        ans: 'B. Because the Pole Star lies almost directly along the Earth’s axis of rotation in the northern sky.'
      },
      {
        id: 'sa_mcq_15', set: 'A', ch: 12,
        q: 'Which planet in our Solar System is known as the "Morning Star" or "Evening Star" and is the brightest planet seen from Earth?',
        options: [
          'A. Mercury (Budha)',
          'B. Mars (Mangala)',
          'C. Venus (Shukra)',
          'D. Jupiter (Brihaspati)'
        ],
        correct: 2,
        ans: 'C. Venus (Shukra) is the brightest planet and is seen near dawn or dusk.'
      },

      // --- SET B CORE (15 Additional MCQs across Ch 2, 3, 4, 5, 7, 9, 10, 12) ---
      {
        id: 'sb_mcq_1', set: 'B', ch: 2,
        q: 'Which of the following pairs of plants correctly matches the plant with its type of root and leaf venation?',
        options: [
          'A. Chickpea (Chana) — Fibrous root and Parallel venation',
          'B. Maize (Corn) — Taproot and Reticulate venation',
          'C. Tulsi — Taproot and Reticulate venation',
          'D. Wheat — Taproot and Parallel venation'
        ],
        correct: 2,
        ans: 'C. Tulsi is a dicot shrub having a taproot system and reticulate leaf venation.'
      },
      {
        id: 'sb_mcq_2', set: 'B', ch: 2,
        q: 'Camels living in the hot desert of Rajasthan (Thar) differ from camels living in the cold desert of Ladakh because Ladakh camels have:',
        options: [
          'A. Very long legs, a single hump, and short hair',
          'B. Shorter legs, two humps, and long coat hair to survive freezing winters',
          'C. Webbed feet for swimming in lakes',
          'D. Gills for breathing thin mountain air'
        ],
        correct: 1,
        ans: 'B. Shorter legs (easier to walk in mountainous cold deserts), two humps, and long hair for insulation.'
      },
      {
        id: 'sb_mcq_3', set: 'B', ch: 3,
        q: 'A patient visits a doctor with symptoms of spongy and bleeding gums, and slow healing of wounds. Which deficiency disease and missing nutrient is the patient suffering from?',
        options: [
          'A. Rickets — Vitamin D',
          'B. Scurvy — Vitamin C',
          'C. Beriberi — Vitamin B1',
          'D. Night blindness — Vitamin A'
        ],
        correct: 1,
        ans: 'B. Scurvy caused by deficiency of Vitamin C.'
      },
      {
        id: 'sb_mcq_4', set: 'B', ch: 3,
        q: 'Why does eating locally grown seasonal fruits and vegetables help reduce "Food Miles"?',
        options: [
          'A. Local foods contain zero carbohydrates',
          'B. It reduces the total distance food travels from farm to plate, cutting transport fuel and pollution',
          'C. Local foods do not need washing before cooking',
          'D. It increases the packaging plastic used in supermarkets'
        ],
        correct: 1,
        ans: 'B. Food miles is the distance food travels from production to consumer; local produce minimizes transport emissions and keeps food fresh.'
      },
      {
        id: 'sb_mcq_5', set: 'B', ch: 4,
        q: 'You are given two identical-looking metal bars P and Q. One is a permanent magnet and the other is an ordinary iron bar. Which observation conclusively proves which one is which?',
        options: [
          'A. Attraction between one end of P and one end of Q',
          'B. Repulsion between one end of P and one end of Q',
          'C. Both bars are able to attract iron pins when touching each other',
          'D. Both bars feel equally heavy in the hand'
        ],
        correct: 1,
        ans: 'B. Repulsion is the sure test of magnetism (note: between a magnet and an unmagnetized iron bar, both ends of the magnet attract the iron bar, whereas touching the centre of the magnet to the iron bar shows zero attraction).'
      },
      {
        id: 'sb_mcq_6', set: 'B', ch: 4,
        q: 'If a bar magnet is placed under a sheet of white paper and iron filings are sprinkled gently on top while tapping the paper, the filings arrange themselves:',
        options: [
          'A. In a thick heap only in the middle of the paper',
          'B. In curved patterns crowded densely near the two poles',
          'C. In four corners of the rectangular sheet',
          'D. Completely at random without any pattern'
        ],
        correct: 1,
        ans: 'B. Iron filings align along magnetic field lines, crowding most densely near the North and South poles.'
      },
      {
        id: 'sb_mcq_7', set: 'B', ch: 5,
        q: 'A carpenter measures the length of a wooden block using a scale whose zero end is broken. He places one end of the block at the 3.4 cm mark and the other end reads 19.2 cm. The true length of the wooden block is:',
        options: [
          'A. 22.6 cm',
          'B. 19.2 cm',
          'C. 15.8 cm',
          'D. 16.2 cm'
        ],
        correct: 2,
        ans: 'C. 15.8 cm (True length = Final reading − Initial reading = 19.2 cm − 3.4 cm = 15.8 cm).'
      },
      {
        id: 'sb_mcq_8', set: 'B', ch: 5,
        q: 'Which of the following lengths is arranged in strictly INCREASING order of magnitude?',
        options: [
          'A. 1 m < 100 cm < 1 km < 10 mm',
          'B. 15 mm < 2 cm < 1 m < 1 km',
          'C. 1 km < 500 m < 200 cm < 50 mm',
          'D. 10 cm < 50 mm < 1 m < 1 km'
        ],
        correct: 1,
        ans: 'B. 15 mm (1.5 cm) < 2 cm < 1 m (100 cm) < 1 km (1000 m).'
      },
      {
        id: 'sb_mcq_9', set: 'B', ch: 7,
        q: 'Why can a clinical thermometer NOT be used to measure the temperature of boiling water (100 °C)?',
        options: [
          'A. Boiling water is transparent and cannot be seen on the scale',
          'B. Its measuring range is only 35 °C to 42 °C, so high temperature will expand mercury excessively and break the thermometer',
          'C. A clinical thermometer only measures in Kelvin',
          'D. Boiling water cools down immediately when touched by glass'
        ],
        correct: 1,
        ans: 'B. A clinical thermometer has a small range (35 °C to 42 °C) and will crack/break if placed in boiling water.'
      },
      {
        id: 'sb_mcq_10', set: 'B', ch: 9,
        q: 'To obtain both pure common salt and pure water from a salt-water solution in a science lab, which pair of processes should be carried out in sequence?',
        options: [
          'A. Filtration followed by Sieving',
          'B. Handpicking followed by Winnowing',
          'C. Evaporation (heating) accompanied by Condensation on a cold plate',
          'D. Magnetic separation followed by Decantation'
        ],
        correct: 2,
        ans: 'C. Evaporation vaporizes the water (leaving salt behind) and condensation cools the steam back into liquid water.'
      },
      {
        id: 'sb_mcq_11', set: 'B', ch: 9,
        q: 'Why do construction workers pass sand through a large倾斜 wire mesh before mixing it with cement?',
        options: [
          'A. To dry the sand in sunlight',
          'B. To separate larger pebbles and stones from fine sand by sieving',
          'C. To magnetize the iron particles in sand',
          'D. To dissolve the sand in water'
        ],
        correct: 1,
        ans: 'B. Sieving separates fine sand particles (which pass through the mesh) from larger pebbles and stones.'
      },
      {
        id: 'sb_mcq_12', set: 'B', ch: 10,
        q: 'When a potted plant is kept inside a dark room near an open window through which sunlight enters, its shoot bends towards the window. This characteristic of living beings is:',
        options: [
          'A. Excretion of waste products',
          'B. Response to stimulus (Phototropism — growth towards light)',
          'C. Seed germination in the absence of air',
          'D. Magnetic attraction of leaves'
        ],
        correct: 1,
        ans: 'B. Response to stimulus (plants respond to light stimulus; shoots grow towards light).'
      },
      {
        id: 'sb_mcq_13', set: 'B', ch: 10,
        q: 'Why are people advised to pour a thin layer of kerosene oil over stagnant water in coolers and puddles during the monsoon season?',
        options: [
          'A. Kerosene serves as food for fish in puddles',
          'B. Oil forms a surface film that cuts off oxygen supply to mosquito larvae and pupae, preventing them from breeding',
          'C. Kerosene turns stagnant water into drinking water',
          'D. It makes the water evaporate ten times faster'
        ],
        correct: 1,
        ans: 'B. Kerosene oil floats on water and blocks air supply to breathing tubes of mosquito larvae and pupae.'
      },
      {
        id: 'sb_mcq_14', set: 'B', ch: 12,
        q: 'The Asteroid Belt in our Solar System is a region populated by numerous rocky irregular objects revolving around the Sun between the orbits of:',
        options: [
          'A. Mercury and Venus',
          'B. Earth and Mars',
          'C. Mars and Jupiter',
          'D. Saturn and Uranus'
        ],
        correct: 2,
        ans: 'C. Mars and Jupiter (separating the four inner rocky planets from the four outer gas/ice giants).'
      },
      {
        id: 'sb_mcq_15', set: 'B', ch: 12,
        q: 'Which constellation is easily identified in the winter evening sky by three bright stars in a straight line forming a "Hunter’s Belt", and which bright star is located by extending that belt line?',
        options: [
          'A. Ursa Major (Saptarishi) and Pole Star',
          'B. Orion and Sirius (Lubdhaka)',
          'C. Cassiopeia and Proxima Centauri',
          'D. Taurus (Vrishabha) and Pleiades (Krittika)'
        ],
        correct: 1,
        ans: 'B. Orion has three middle stars representing the hunter’s belt; extending that line leads to Sirius, the brightest star in the night sky.'
      }
    ],

    // =========================================================================
    // SECTION A ASSERTION-REASON POOL (Q16 & Q17 — 2 picked per paper)
    // =========================================================================
    sectionAAssertionPool: [
      {
        id: 'sa_ar_1', set: 'A', ch: 7,
        assertion: 'A laboratory thermometer must be read while its bulb is still immersed in the liquid whose temperature is being measured.',
        reason: 'Unlike a clinical thermometer, a laboratory thermometer does not have a kink (constriction) near its bulb, so the liquid column falls immediately once removed.',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true, and Reason (R) is the correct explanation of Assertion (A).'
      },
      {
        id: 'sa_ar_2', set: 'A', ch: 10,
        assertion: 'Dry bean seeds kept in an airtight container filled completely with boiled, cooled water and covered with an oil layer do not germinate even at room temperature.',
        reason: 'Air (oxygen) dissolved in water is an essential condition required by seeds for respiration during germination.',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true, and Reason (R) is the correct explanation of Assertion (A).'
      },
      {
        id: 'sb_ar_1', set: 'B', ch: 4,
        assertion: 'If a bar magnet is broken into three smaller pieces, we obtain three separate magnets, each having both a North pole and a South pole.',
        reason: 'Magnetic poles always exist in pairs (dipoles) and a single isolated North or South pole cannot exist.',
        correct: 0,
        ans: 'A. Both Assertion (A) and Reason (R) are true, and Reason (R) is the correct explanation of Assertion (A).'
      },
      {
        id: 'sb_ar_2', set: 'B', ch: 12,
        assertion: 'The Sun appears much larger and brighter than all other stars in the sky.',
        reason: 'The Sun is the biggest and hottest star in the entire Milky Way galaxy.',
        correct: 2,
        ans: 'C. Assertion (A) is true, but Reason (R) is false (The Sun is a medium-sized star; it looks larger and brighter only because it is much closer to Earth than other stars).'
      }
    ],

    // =========================================================================
    // SECTION B POOL: 5 Very Short Answer Questions (2 Marks each, 30–50 words)
    // Q18, Q19 (has OR), Q20, Q21 (has OR), Q22
    // =========================================================================
    sectionBPool: [
      // --- SET A (5 Questions: Q18–Q22) ---
      {
        id: 'sb_q18_a', set: 'A', ch: 2,
        q: 'State any two structural adaptations of a desert cactus plant that help it survive in hot, dry regions with scarce water.',
        marks: 2,
        ans: '1. Leaves are modified into sharp spines to minimize water loss through transpiration (1 mark).\n2. The stem is thick, fleshy, and green to store water and perform photosynthesis, and has a thick waxy coating to retain moisture (1 mark).'
      },
      {
        id: 'sb_q19_a', set: 'A', ch: 3,
        marks: 2,
        choiceA: {
          q: 'Nutrients P and Q both provide energy to our body, but equal quantities of P provide almost twice as much energy as Q. Another component R provides no nutrients at all, yet doctors advise eating R daily to prevent constipation.\n(a) Identify nutrient P and give one plant source of it.\n(b) Identify component R and state one source of it.',
          ans: '(a) Nutrient P is Fats (Lipids); plant source: Groundnut / Mustard oil / Almonds (1 mark).\n(b) Component R is Dietary Fibre (Roughage); source: Whole grains / Fresh fruits / Green leafy vegetables (1 mark).'
        },
        choiceB: {
          q: 'People living in certain mountainous regions where soil and drinking water lack mineral X often suffer from a swollen neck (disease Y), whereas coastal residents eating seafood rarely suffer from it.\n(a) Name the mineral X and the deficiency disease Y.\n(b) How is mineral X easily supplied in every household kitchen today?',
          ans: '(a) Mineral X is Iodine; Deficiency disease Y is Goitre (1 mark).\n(b) It is supplied daily by using Iodised salt in cooking (1 mark).'
        }
      },
      {
        id: 'sb_q20_a', set: 'A', ch: 4,
        q: 'Why does a freely suspended bar magnet always come to rest in the geographical North–South direction? Which pole of the magnet points towards geographical North?',
        marks: 2,
        ans: '1. The Earth itself behaves like a giant magnet with its magnetic poles aligned near the geographical poles (1 mark).\n2. Therefore, the North-seeking pole (North pole) of a freely suspended magnet points towards the geographical North direction, and the South pole points South (1 mark).'
      },
      {
        id: 'sb_q21_a', set: 'A', ch: 7,
        marks: 2,
        choiceA: {
          q: 'Give scientific reasons for the following:\n(a) We should never rely solely on our sense of touch to judge whether a person has a fever.\n(b) A clinical digital thermometer is preferred over a mercury thermometer nowadays.',
          ans: '(a) Our skin only senses relative hotness or coldness depending on the prior temperature of our hand, so touch is subjective and unreliable (1 mark).\n(b) Mercury is a toxic substance and difficult to dispose of safely if the glass bulb breaks, whereas digital thermometers use safe heat sensors and display exact numbers on an LCD screen (1 mark).'
        },
        choiceB: {
          q: 'In a laboratory thermometer, there are 10 small divisions between the 10 °C mark and the 20 °C mark.\n(a) Calculate the least count of this thermometer.\n(b) If the red alcohol column stands 4 small divisions above the 20 °C mark, what is the temperature reading?',
          ans: '(a) Difference between marks = 20 °C − 10 °C = 10 °C. Number of divisions = 10. Least count = 10 / 10 = 1.0 °C (1 mark).\n(b) Reading = 20 °C + (4 × 1.0 °C) = 24.0 °C (1 mark).'
        }
      },
      {
        id: 'sb_q22_a', set: 'A', ch: 5,
        q: 'A 15 cm plastic ruler has its zero edge chipped off and starts clearly from the 2.0 cm mark.\n(a) How will you use this ruler to measure the length of an eraser?\n(b) If one end of a pencil is placed at the 2.5 cm mark and the other end reaches the 14.0 cm mark, find the exact length of the pencil.',
        marks: 2,
        ans: '(a) Place one end of the eraser at a clear full mark (such as 2.0 cm or 3.0 cm), note the reading at the other end, and subtract the initial mark from the final reading (1 mark).\n(b) Exact length of pencil = 14.0 cm − 2.5 cm = 11.5 cm (1 mark).'
      },

      // --- SET B (5 Questions: Q18–Q22) ---
      {
        id: 'sb_q18_b', set: 'B', ch: 9,
        q: 'Differentiate between Sedimentation and Decantation with the help of a kitchen example such as washing rice or pulses before cooking.',
        marks: 2,
        ans: '1. Sedimentation is the process in which heavier insoluble components (rice grains) settle down at the bottom of the vessel when water is added (1 mark).\n2. Decantation is gently pouring out the upper dusty water without disturbing the settled rice grains at the bottom (1 mark).'
      },
      {
        id: 'sb_q19_b', set: 'B', ch: 10,
        marks: 2,
        choiceA: {
          q: 'A toy robot car can move on wheels and make sounds, yet it is classified as non-living, while a mango tree fixed in one spot is living. State any four characteristics shown by the mango tree that prove it is a living organism.',
          ans: 'The mango tree shows:\n1. Growth (grows from a seedling into a tree)\n2. Respiration (exchanges gases continuously)\n3. Reproduction (produces flowers, fruits, and seeds)\n4. Response to stimuli & nutrition (synthesizes food and grows towards light) (4 × 0.5 = 2 marks).'
        },
        choiceB: {
          q: 'How do plants show movement even though they are rooted in one place? Give two examples of movements seen in plants.',
          ans: '1. Plants show movement of their parts in response to external stimuli such as light, gravity, or touch (1 mark).\n2. Examples: (i) Folding of leaves of Touch-me-not (Chhui-mui / Mimosa) when touched; (ii) Bending of sunflower / plant shoot towards sunlight (1 mark).'
        }
      },
      {
        id: 'sb_q20_b', set: 'B', ch: 12,
        q: 'Why do stars twinkle in the night sky whereas planets shine with a steady light? Also state one key difference between stars and planets regarding light emission.',
        marks: 2,
        ans: '1. Stars have their own heat and light (self-luminous), whereas planets do not have their own light and shine by reflecting sunlight (1 mark).\n2. Stars are extremely far away (point sources), so their light wavers through Earth’s atmosphere and appears to twinkle, while planets are much closer and shine steadily (1 mark).'
      },
      {
        id: 'sb_q21_b', set: 'B', ch: 4,
        marks: 2,
        choiceA: {
          q: 'How should two bar magnets be stored safely in a science laboratory box so that they do not lose their magnetism over time?',
          ans: '1. Bar magnets should be stored in pairs with their unlike poles (North and South) on the same side, separated by a piece of wood (1 mark).\n2. Two pieces of soft iron (called magnetic keepers) should be placed across both ends (1 mark).'
        },
        choiceB: {
          q: 'A tailor accidentally drops a few steel sewing needles into a box containing plastic buttons and wooden beads. Describe the quickest method to recover all the needles without hurting his fingers.',
          ans: '1. Move a bar magnet over the mixture of buttons, beads, and needles (1 mark).\n2. Steel needles are magnetic materials and get attracted to the magnet immediately, while plastic buttons and wooden beads (non-magnetic) remain behind (1 mark).'
        }
      },
      {
        id: 'sb_q22_b', set: 'B', ch: 3,
        q: 'Why is Vitamin D called the "Sunshine Vitamin"? Which mineral works together with Vitamin D to keep our bones and teeth strong?',
        marks: 2,
        ans: '1. Vitamin D is called the Sunshine Vitamin because our skin synthesizes it naturally when exposed to morning sunlight (1 mark).\n2. Vitamin D helps our body absorb the mineral Calcium, which is essential for strong bones and teeth (1 mark).'
      }
    ],

    // =========================================================================
    // SECTION C POOL: 5 Short Answer Questions (3 Marks each, 50–80 words)
    // Q23 (Match Column A & B — 6 items × 0.5 = 3m), Q24, Q25, Q26, Q27
    // =========================================================================
    sectionCPool: [
      // --- SET A (5 Questions: Q23–Q27) ---
      {
        id: 'sc_q23_a', set: 'A', ch: 5, type: 'match',
        q: 'Match the items in Column A with their correct scientific description or example in Column B:',
        marks: 3,
        colA: [
          '1. SI unit of temperature',
          '2. Oscillatory motion',
          '3. Winnowing',
          '4. Reticulate venation',
          '5. Dhruva Tara (Pole Star)',
          '6. Churning'
        ],
        colB: [
          '(A) Separating butter from curd / buttermilk',
          '(B) Kelvin (K)',
          '(C) Motion of a child on a park swing',
          '(D) Stationary star aligned with Earth’s axis',
          '(E) Separating lighter husk from heavy grain using wind',
          '(F) Net-like vein pattern seen in mango & peepal leaves'
        ],
        ans: '1 → (B) Kelvin (K)\n2 → (C) Motion of a child on a park swing\n3 → (E) Separating lighter husk from heavy grain using wind\n4 → (F) Net-like vein pattern seen in mango & peepal leaves\n5 → (D) Stationary star aligned with Earth’s axis\n6 → (A) Separating butter from curd / buttermilk\n(6 × 0.5 = 3 marks)'
      },
      {
        id: 'sc_q24_a', set: 'A', ch: 2,
        q: '(a) Differentiate between Creepers and Climbers with one plant example of each.\n(b) Why are frogs called amphibians? Mention two adaptations that help a frog live both on land and in water.',
        marks: 3,
        ans: '(a) Creepers have weak stems that cannot stand upright and spread horizontally on the ground (e.g., Pumpkin, Watermelon), whereas Climbers have weak stems that climb up a neighbouring support using tendrils (e.g., Money plant, Pea plant) (1.5 marks).\n(b) Frogs live both on land and in water (amphibians). Adaptations: (i) Webbed hind feet for swimming in water, and (ii) Strong muscular hind legs for leaping on land + moist skin for breathing in water (1.5 marks).'
      },
      {
        id: 'sc_q25_a', set: 'A', ch: 4,
        q: 'Describe the step-by-step "Single Touch Method" to convert a flat iron strip (or iron sewing needle) into an artificial magnet using a permanent bar magnet. How will you verify that the iron strip has become magnetized?',
        marks: 3,
        ans: '1. Place the flat iron strip on a wooden table. Hold one pole (say North pole) of a bar magnet at one end of the iron strip (1 mark).\n2. Move the magnet firmly along the length of the iron strip to the other end without lifting it, then lift it high and bring the same pole back to the starting end (1 mark).\n3. Repeat this stroking in the same direction 30–40 times. Test it by bringing iron pins near its ends—if they stick, the strip is magnetized (1 mark).'
      },
      {
        id: 'sc_q26_a', set: 'A', ch: 9,
        q: 'You are given a mixture containing iron filings, sand, and common salt. Explain the three-step scientific sequence you will use in the laboratory to separate all three components from each other.',
        marks: 3,
        ans: 'Step 1 (Magnetic Separation): Roll a wrapped bar magnet over the dry mixture; iron filings stick to the magnet and are separated first (1 mark).\nStep 2 (Dissolution & Filtration): Add water to the remaining sand + salt mixture, stir well so salt dissolves, and pour through a filter paper cone. Sand remains on the filter paper as residue (1 mark).\nStep 3 (Evaporation): Heat the clear salty filtrate in a china dish; water evaporates, leaving pure common salt behind (1 mark).'
      },
      {
        id: 'sc_q27_a', set: 'A', ch: 7,
        q: 'State any three important precautions that must be followed while measuring the temperature of warm water using a laboratory thermometer to ensure an accurate reading.',
        marks: 3,
        ans: '1. The thermometer should be held vertically upright and never tilted (1 mark).\n2. The bulb must be completely surrounded by the liquid from all sides without touching the bottom or walls of the beaker (1 mark).\n3. The temperature reading must be noted while the bulb is still immersed in water, keeping the eye level horizontally aligned with the top of the liquid column (1 mark).'
      },

      // --- SET B (5 Questions: Q23–Q27) ---
      {
        id: 'sc_q23_b', set: 'B', ch: 3, type: 'match',
        q: 'Match the items in Column A with their correct scientific description or example in Column B:',
        marks: 3,
        colA: [
          '1. Blue-black colour with Iodine',
          '2. Vitamin A deficiency',
          '3. Sieving',
          '4. Circular motion',
          '5. Tadpole',
          '6. Red Planet (Mangala)'
        ],
        colB: [
          '(A) Larval stage of a frog that breathes with gills',
          '(B) Presence of Starch in food',
          '(C) Mars — rich in iron oxide (rust) soil',
          '(D) Loss of vision / Night blindness',
          '(E) Separating wheat bran from flour using a sieve',
          '(F) Tip of the second hand of a clock'
        ],
        ans: '1 → (B) Presence of Starch in food\n2 → (D) Loss of vision / Night blindness\n3 → (E) Separating wheat bran from flour using a sieve\n4 → (F) Tip of the second hand of a clock\n5 → (A) Larval stage of a frog that breathes with gills\n6 → (C) Mars — rich in iron oxide (rust) soil\n(6 × 0.5 = 3 marks)'
      },
      {
        id: 'sc_q24_b', set: 'B', ch: 3,
        q: '(a) Compare traditional culinary practices (such as grinding on a sil-batta and slow cooking in iron/clay pots) with modern ultra-processed cooking practices.\n(b) Why can washing vegetables AFTER cutting or peeling them reduce their nutritional value?',
        marks: 3,
        ans: '(a) Traditional methods preserve natural fibre and micronutrients (and iron utensils add dietary iron), whereas excessive modern refining and high-heat frying can destroy heat-sensitive vitamins like Vitamin C (1.5 marks).\n(b) Water-soluble vitamins (Vitamin B-complex and Vitamin C) and minerals dissolve in water and get washed away when cut vegetables are rinsed (1.5 marks).'
      },
      {
        id: 'sc_q25_b', set: 'B', ch: 10,
        q: 'Anushka set up four bowls of gram seeds to investigate seed germination:\n• Bowl 1: Dry seeds in open air at room temperature\n• Bowl 2: Seeds on moist cotton in open air at room temperature\n• Bowl 3: Seeds submerged under boiled water covered with oil at room temperature\n• Bowl 4: Seeds on moist cotton kept inside a freezing refrigerator\nIn which bowl(s) will the seeds germinate? Explain why seeds fail to germinate in the other bowls.',
        marks: 3,
        ans: '• Seeds will germinate ONLY in Bowl 2 because they receive all three essential conditions: water (moisture), air (oxygen), and suitable warmth (1.5 marks).\n• Bowl 1 lacks water; Bowl 3 lacks air/oxygen (blocked by oil layer); Bowl 4 lacks warmth/optimum temperature required for enzyme activity (1.5 marks).'
      },
      {
        id: 'sc_q26_b', set: 'B', ch: 12,
        q: '(a) What is a constellation? How can you locate the Pole Star (Dhruva Tara) in the night sky using the Saptarishi (Ursa Major) constellation?\n(b) Why is Pluto no longer classified as one of the eight major planets of our Solar System?',
        marks: 3,
        ans: '(a) A group of stars forming a recognizable pattern in the night sky is a constellation (1 mark). Locate the 7 bright stars of Saptarishi, identify the two "pointer stars" at the front of the bowl, and extend an imaginary straight line northwards about 5 times the distance between them to reach the Pole Star (1 mark).\n(b) In 2006, the IAU reclassified Pluto as a "Dwarf Planet" because it has not cleared its neighbouring orbital region of other objects (1 mark).'
      },
      {
        id: 'sc_q27_b', set: 'B', ch: 5,
        q: 'How will you measure the length of a curved line AB drawn on a chart paper using a cotton thread and a metre scale? Write the three clear steps and state one precaution.',
        marks: 3,
        ans: '1. Tie a knot near one end of the cotton thread and place the knot exactly on point A of the curved line (1 mark).\n2. Carefully lay the thread along small portions of the curved line using your fingers until it reaches the other end B, and mark point B on the thread with ink (1 mark).\n3. Stretch the thread taut (without over-stretching) along a metre scale and measure the distance between the knot and the ink mark (1 mark).'
      }
    ],

    // =========================================================================
    // SECTION D POOL: 2 Long Answer Questions (5 Marks each, 80–120 words)
    // Q28 (Compulsory 5m with diagram) & Q29 (Attempt A or B — 5m)
    // =========================================================================
    sectionDPool: [
      {
        id: 'sd_q28_a', set: 'A', ch: 2,
        marks: 5,
        diagramType: 'seeds_venation',
        q: 'Hema soaked two kinds of seeds—Gram (Chana, Seed A) and Maize (Corn, Seed B)—overnight and observed their internal structure and the plants they grow into.\n(a) Identify which seed (A or B) is a Dicot seed and which is a Monocot seed. Define cotyledons. (1.5)\n(b) What type of root system will plant A and plant B develop respectively? (1.5)\n(c) What type of leaf venation is associated with Seed A and Seed B? Give one more plant example of each group. (2)',
        ans: '(a) Seed A (Gram/Chana) is a Dicot seed (two cotyledons); Seed B (Maize) is a Monocot seed (single cotyledon). Cotyledons are seed leaves that store food for the growing embryo (1.5 marks).\n(b) Plant A (Dicot) develops a Taproot system (one main primary root with lateral branches). Plant B (Monocot) develops a Fibrous root system (cluster of thin roots from the stem base) (1.5 marks).\n(c) Seed A has Reticulate (net-like) leaf venation (e.g., Mango, Rose, Peepal). Seed B has Parallel leaf venation (e.g., Wheat, Rice, Grass, Banana) (2 marks).'
      },
      {
        id: 'sd_q29_a', set: 'A', ch: 5,
        marks: 5,
        diagramType: 'motion_balls',
        choiceA: {
          q: 'Observe the position diagram of two balls P and Q recorded along a straight track XZ at 10:00 AM and 10:15 AM, and answer the questions below:\n(a) Which ball (P or Q) is at rest and which is in motion? Justify your answer using the concept of a reference point. (2)\n(b) When a carpenter turns a metal screw into a wooden plank using a screwdriver, the screw undergoes two types of motion simultaneously. Name both motions and justify why. (2)\n(c) Why could ancient body-part units like "Handspan" (Balisht) or "Cubit" (Haath) not be accepted as standard international units of length? (1)',
          ans: '(a) Taking point X as the reference point, Ball P remains at the same distance from X at both 10:00 AM and 10:15 AM, so Ball P is at rest. Ball Q changes its position relative to X over time, so Ball Q is in motion (2 marks).\n(b) The screw undergoes (i) Rotational / Circular motion (as its head turns in a circle) and (ii) Rectilinear motion (as its tip advances straight into the wood) (2 marks).\n(c) Body parts vary in size from person to person, leading to inconsistent measurements; hence uniform SI units (metre) are needed (1 mark).'
        },
        choiceB: {
          q: 'Compare the motion of a swinging pendulum and the revolution of the Earth around the Sun:\n(a) State one similarity and one difference between the motion of a pendulum and the motion of the Earth around the Sun. (2)\n(b) Convert the following measurements showing full steps: (i) 4.65 km into metres (m), and (ii) 380 mm into centimetres (cm). (2)\n(c) What error occurs if your eye is positioned to the left or right instead of vertically above the mark while reading a scale? (1)',
          ans: '(a) Similarity: Both are Periodic motions (repeat after fixed time intervals). Difference: The pendulum executes Oscillatory (to-and-fro) motion about a mean position, whereas the Earth executes Circular/Revolutionary motion along an orbit (2 marks).\n(b) (i) 1 km = 1000 m → 4.65 km = 4.65 × 1000 = 4650 m (1 mark).\n    (ii) 10 mm = 1 cm → 380 mm = 380 / 10 = 38 cm (1 mark).\n(c) Parallax error occurs, giving an inaccurate reading (1 mark).'
        }
      },

      // --- SET B (Q28 & Q29) ---
      {
        id: 'sd_q28_b', set: 'B', ch: 10,
        marks: 5,
        diagramType: 'frog_lifecycle',
        q: 'Observe the life cycle of a frog in a pond ecosystem and answer the following questions:\n(a) Write the four distinct stages in the life cycle of a frog in proper sequence starting from the jelly-like cluster of eggs (spawn). (2)\n(b) How does a young tadpole differ from an adult frog in terms of: (i) organ of breathing, and (ii) organ of locomotion? (2)\n(c) How does the life cycle of a frog or mosquito illustrate the characteristic of "growth and development" in living beings? (1)',
        ans: '(a) Sequence: 1. Egg (Spawn) → 2. Early Tadpole (with tail & gills) → 3. Froglet (with hind & fore legs, shrinking tail) → 4. Adult Frog (2 marks).\n(b) (i) Breathing: Tadpole breathes dissolved oxygen in water through gills, whereas an adult frog breathes through lungs on land and moist skin in water (1 mark).\n    (ii) Locomotion: Tadpole swims using its fin-like tail, whereas an adult frog jumps and swims using muscular hind legs and webbed feet (1 mark).\n(c) It shows how a hatched young organism undergoes permanent structural changes (metamorphosis) and increases in size/complexity to become a mature adult (1 mark).'
      },
      {
        id: 'sd_q29_b', set: 'B', ch: 12,
        marks: 5,
        diagramType: 'saptarishi_polestar',
        choiceA: {
          q: 'Study the diagram of the northern night sky showing the Saptarishi (Big Dipper / Ursa Major) constellation and Star X:\n(a) Identify Star X. Why do travellers and sailors in the Northern Hemisphere use Star X for navigation at night? (2)\n(b) Differentiate between the four Inner Planets and the four Outer Planets of our Solar System (any two points with examples). (2)\n(c) What are Comets? Why does a comet develop a bright tail when it approaches the Sun? (1)',
          ans: '(a) Star X is the Pole Star (Dhruva Tara / Polaris). Because it lies directly above Earth’s North Pole axis, it remains fixed in the North direction all night, helping travellers find geographical North (2 marks).\n(b) Inner Planets (Mercury, Venus, Earth, Mars) are closer to the Sun, smaller, and made of rock/metal. Outer Planets (Jupiter, Saturn, Uranus, Neptune) are far from the Sun, giant in size, made mostly of gases/ice, and have ring systems (2 marks).\n(c) Comets are icy-rocky celestial bodies with highly elliptical orbits; when near the Sun, solar heat vaporizes their ice into glowing gas and dust, forming a tail pointing away from the Sun (1 mark).'
        },
        choiceB: {
          q: 'Answer the following questions about our Solar System and Night Sky:\n(a) Why is Earth called a unique "Goldilocks / Living Planet" in the Solar System? State any two factors. (2)\n(b) What are natural satellites? Name Earth’s natural satellite and explain why we see different phases of it over a month. (2)\n(c) What is the Milky Way (Akash Ganga)? (1)',
          ans: '(a) Earth is at an optimum distance from the Sun so water exists in liquid form, and it has a protective atmosphere containing oxygen and an ozone layer (2 marks).\n(b) Celestial bodies revolving around planets are natural satellites. Earth’s satellite is the Moon; we see phases because we view different sunlit portions of the Moon as it revolves around Earth (2 marks).\n(c) The Milky Way (Akash Ganga) is our home spiral galaxy containing billions of stars, including our Solar System (1 mark).'
        }
      }
    ],

    // =========================================================================
    // SECTION E POOL: 2 Case-Based / Source-Based Units (4 Marks each)
    // Q30 (Compulsory 4m) & Q31 (Attempt A or B — 4m with diagram)
    // =========================================================================
    sectionEPool: [
      {
        id: 'se_q30_a', set: 'A', ch: 3,
        marks: 4,
        passage: 'Rohan comes back from school feeling exhausted. As soon as he gets home, he fills a large plate with fried potato chips and sugary soda, turns on his favourite cartoon show on TV, and sits on the couch. Eating quickly while watching TV, he finishes everything in under five minutes. Over the next few months of eating mostly refined fast food and skipping fruits and green vegetables, he starts feeling tired during sports period and notices his gums bleed while brushing.',
        q: '(a) Identify two habits in Rohan’s routine that show "mindless eating" and explain how they harm digestion. (1.5)\n(b) Which vitamin deficiency is causing Rohan’s bleeding gums? Name two citrus fruits he should include in his daily diet. (1.5)\n(c) Why are potato chips and sugary sodas called "Junk Food / Empty Calories"? (1)',
        ans: '(a) Habits: (i) Eating rapidly in under 5 minutes without chewing properly, and (ii) Eating while distracted by TV, which leads to overeating and indigestion (1.5 marks).\n(b) Vitamin C deficiency (Scurvy). Citrus sources: Amla (Indian gooseberry), Lemon, Orange (1.5 marks).\n(c) They are high in refined sugar, fat, and salt (calories) but contain almost no essential proteins, vitamins, minerals, or dietary fibre (1 mark).'
      },
      {
        id: 'se_q31_a', set: 'A', ch: 7,
        marks: 4,
        diagramType: 'thermometer_scale',
        choiceA: {
          passage: 'During a science practical, Meera is given the thermometer scale shown in the figure below, where the major markings are −10 °C, 0 °C, 10 °C, 20 °C, and 30 °C, with 10 equal subdivisions between 0 °C and 10 °C. The arrow points to the liquid meniscus between 20 °C and 30 °C.',
          q: '(a) What type of thermometer is depicted in the image (Clinical or Laboratory)? Justify your answer from its scale range. (1)\n(b) What is the least count of this thermometer? (1)\n(c) What is the exact temperature reading indicated by the arrow at the 4th mark past 20 °C? (1)\n(d) Can we accurately measure human body temperature using this thermometer after taking it out of the mouth? Give a reason. (1)',
          ans: '(a) Laboratory thermometer, because its scale includes negative temperatures (−10 °C) and goes beyond 42 °C (whereas a clinical thermometer only reads 35 °C to 42 °C) (1 mark).\n(b) Least count = (10 − 0) / 10 = 1.0 °C (1 mark).\n(c) Temperature reading = 20 °C + (4 × 1.0 °C) = 24 °C (1 mark).\n(d) No, because it has no kink, so the liquid column drops immediately as soon as it is taken out of the mouth (1 mark).'
        },
        choiceB: {
          passage: 'Observe two laboratory thermometers A and B in a school lab:\n• Thermometer A has 10 small divisions between 0 °C and 10 °C.\n• Thermometer B has 5 small divisions between 0 °C and 10 °C.',
          q: '(a) Calculate the smallest value (least count) that Thermometer A can measure. (1)\n(b) Calculate the smallest value (least count) that Thermometer B can measure. (1)\n(c) Which of the two thermometers (A or B) can accurately measure a temperature of 17 °C, and why? (1)\n(d) Convert 17 °C into the Kelvin (K) scale. (1)',
          ans: '(a) Least count of Thermometer A = 10 °C / 10 = 1 °C (1 mark).\n(b) Least count of Thermometer B = 10 °C / 5 = 2 °C (markings are 0, 2, 4, 6, 8, 10...) (1 mark).\n(c) Thermometer A can measure 17 °C accurately because its least count is 1 °C (7 divisions above 10 °C), whereas Thermometer B only has even-numbered markings (16 °C and 18 °C) (1 mark).\n(d) T(K) = 17 + 273.15 = 290.15 K (1 mark).'
        }
      },

      // --- SET B (Q30 & Q31) ---
      {
        id: 'se_q30_b', set: 'B', ch: 9,
        marks: 4,
        passage: 'During a visit to the Sabarmati coastal salt pans in Gujarat and a nearby village farm, Class 6 students observed how natural mixtures are separated in daily life. At the salt pans, shallow pits were filled with seawater and left open under the hot sun and wind for several days until white heaps of salt crystals remained. At the village farm, women were pouring muddy river water through a funnel lined with folded filter paper to get clear water.',
        q: '(a) Name the separation process taking place in the shallow seawater pits and state two natural factors that speed it up. (1.5)\n(b) Why is Decantation alone not sufficient to make muddy river water completely clear, and why is Filtration superior? (1.5)\n(c) In the filtration setup, what are the scientific terms for (i) the mud left on the filter paper, and (ii) the clear water collected in the flask below? (1)',
        ans: '(a) Evaporation. Factors that speed it up: High temperature (sunlight), large surface area of shallow pits, and blowing wind (1.5 marks).\n(b) Fine clay particles remain suspended in water even after sedimentation/decantation; filter paper has microscopic pores that trap even fine insoluble clay particles (1.5 marks).\n(c) (i) Mud on filter paper: Residue; (ii) Clear liquid in flask: Filtrate (1 mark).'
      },
      {
        id: 'se_q31_b', set: 'B', ch: 4,
        marks: 4,
        diagramType: 'magnet_poles',
        choiceA: {
          passage: 'Kabir has two bar magnets. On Magnet 1, the North (N) and South (S) poles are clearly marked. On Magnet 2, the paint has worn off, so its poles X and Y are unmarked. He suspends Magnet 2 horizontally from a wooden stand using a thread and brings the North pole of Magnet 1 close to end X of Magnet 2. He observes that end X moves sharply away from the North pole of Magnet 1.',
          q: '(a) Identify the magnetic polarity of end X and end Y of Magnet 2. Give the scientific law behind your identification. (1.5)\n(b) Why would mere "attraction" between end X and a bar not be a conclusive proof that Magnet 2 is magnetized? (1.5)\n(c) What happens if Kabir brings a plastic ruler near end X of the suspended Magnet 2? (1)',
          ans: '(a) End X is the North Pole and End Y is the South Pole. Law: Like poles repel each other (since North pole of Magnet 1 repelled X, X must also be a North pole) (1.5 marks).\n(b) Attraction can occur both between unlike poles of two magnets AND between a magnet and an unmagnetized piece of iron; hence repulsion is the only sure test of polarity/magnetism (1.5 marks).\n(c) Nothing happens (no attraction or repulsion) because plastic is a non-magnetic material (1 mark).'
        },
        choiceB: {
          passage: 'During an outdoor treasure hunt, a group of scouts carries a small circular pocket device with a glass top and a rotating magnetized needle painted red at one end.',
          q: '(a) Name this navigation device and state the principle on which it works. (1.5)\n(b) Why is the outer casing of this device made of brass or aluminium rather than iron or steel? (1.5)\n(c) If a scout stands facing the direction pointed by the red (North-seeking) tip of the needle, which direction is to his right hand and which is behind him? (1)',
          ans: '(a) Magnetic Compass. It works on the principle that a freely pivoted magnetic needle always aligns itself along the Earth’s North–South magnetic field (1.5 marks).\n(b) Iron or steel is a magnetic material that would attract the needle and deflect it from pointing true North; brass and aluminium are non-magnetic (1.5 marks).\n(c) To his right hand: East; Behind him: South (1 mark).'
        }
      }
    ]
  };

  window.SCIENCE_ANNUAL_BLUEPRINT = SCIENCE_ANNUAL_BLUEPRINT;
})();
