(function () {
  /**
   * Master Study App — Class VI Academic Suite
   * Reference Data: Quick Formulas, Grammar Tables, and Curated Chapter Videos
   */
  
  const formulas = [
    // ---------------- MATHEMATICS ----------------
    {
      id: 'math_perimeter_area',
      subject: 'MATH',
      subjectName: 'Mathematics',
      category: 'Mensuration',
      title: 'Perimeter & Area Formulas',
      summary: 'Core formulas for calculating perimeter and area of 2D geometric shapes.',
      content: [
        { label: 'Perimeter of Rectangle', formula: '2 × (Length + Breadth)', note: 'P = 2(l + b)' },
        { label: 'Area of Rectangle', formula: 'Length × Breadth', note: 'A = l × b' },
        { label: 'Perimeter of Square', formula: '4 × Side', note: 'P = 4s' },
        { label: 'Area of Square', formula: 'Side × Side', note: 'A = s²' },
        { label: 'Perimeter of Equilateral Triangle', formula: '3 × Side', note: 'P = 3a' },
        { label: 'Perimeter of Regular Hexagon', formula: '6 × Side', note: 'P = 6s' }
      ]
    },
    {
      id: 'math_divisibility',
      subject: 'MATH',
      subjectName: 'Mathematics',
      category: 'Number Play',
      title: 'Divisibility Rules (2 to 11)',
      summary: 'Quick mental tests to check if a number divides evenly without long division.',
      content: [
        { label: 'Divisible by 2', formula: 'Last digit is even (0, 2, 4, 6, 8)', note: 'e.g. 4,598' },
        { label: 'Divisible by 3', formula: 'Sum of all digits is a multiple of 3', note: 'e.g. 729 → 7+2+9=18 (divisible)' },
        { label: 'Divisible by 4', formula: 'Number formed by last 2 digits is divisible by 4', note: 'e.g. 1,324 → 24 ÷ 4 = 6' },
        { label: 'Divisible by 5', formula: 'Last digit is 0 or 5', note: 'e.g. 845, 12,390' },
        { label: 'Divisible by 6', formula: 'Divisible by both 2 AND 3', note: 'Must be even & digit sum multiple of 3' },
        { label: 'Divisible by 8', formula: 'Number formed by last 3 digits is divisible by 8', note: 'e.g. 5,128 → 128 ÷ 8 = 16' },
        { label: 'Divisible by 9', formula: 'Sum of all digits is a multiple of 9', note: 'e.g. 8,118 → 8+1+1+8=18 (divisible)' },
        { label: 'Divisible by 10', formula: 'Last digit is exactly 0', note: 'e.g. 4,320' },
        { label: 'Divisible by 11', formula: '|Sum of odd place digits - Sum of even place digits| = 0 or multiple of 11', note: 'e.g. 1,331 → (1+3)-(3+1)=0' }
      ]
    },
    {
      id: 'math_integers',
      subject: 'MATH',
      subjectName: 'Mathematics',
      category: 'Integers',
      title: 'Integers & Number Line Rules',
      summary: 'Sign rules for addition, subtraction, and absolute values.',
      content: [
        { label: 'Addition (Same Signs)', formula: '(+) + (+) = (+),  (-) + (-) = (-)', note: 'Add values and keep the common sign' },
        { label: 'Addition (Opposite Signs)', formula: 'Subtract smaller from larger, keep sign of larger absolute value', note: 'e.g. (-8) + 5 = -3,  8 + (-5) = +3' },
        { label: 'Subtraction Rule', formula: 'a - b = a + (-b)', note: 'Subtracting a number is adding its additive inverse' },
        { label: 'Subtracting Negative', formula: 'a - (-b) = a + b', note: 'Two consecutive minuses turn into plus: 7 - (-3) = 10' },
        { label: 'Absolute Value', formula: '|x| ≥ 0 always', note: 'Distance from 0 on number line: |-7| = 7, |7| = 7' }
      ]
    },
    {
      id: 'math_fractions_decimals',
      subject: 'MATH',
      subjectName: 'Mathematics',
      category: 'Fractions',
      title: 'Fractions & Decimals Conversion',
      summary: 'Equivalent fractions, benchmarks, and percentage conversions.',
      content: [
        { label: '1/2', formula: '0.5 = 50%', note: 'Half' },
        { label: '1/4', formula: '0.25 = 25%', note: 'Quarter' },
        { label: '3/4', formula: '0.75 = 75%', note: 'Three-quarters' },
        { label: '1/5', formula: '0.2 = 20%', note: 'One-fifth' },
        { label: '1/10', formula: '0.1 = 10%', note: 'One-tenth' },
        { label: 'Mixed to Improper', formula: 'a b/c = (a × c + b) / c', note: 'e.g. 2 3/4 = (2×4 + 3)/4 = 11/4' }
      ]
    },
    {
      id: 'math_angles',
      subject: 'MATH',
      subjectName: 'Mathematics',
      category: 'Geometry',
      title: 'Angle Classifications',
      summary: 'Measurement bounds for angles in geometry.',
      content: [
        { label: 'Acute Angle', formula: '0° < θ < 90°', note: 'Sharper than a square corner' },
        { label: 'Right Angle', formula: 'θ = 90°', note: 'Exact square corner' },
        { label: 'Obtuse Angle', formula: '90° < θ < 180°', note: 'Wider than a right angle' },
        { label: 'Straight Angle', formula: 'θ = 180°', note: 'Exact straight line' },
        { label: 'Reflex Angle', formula: '180° < θ < 360°', note: 'Greater than half turn' },
        { label: 'Complete Turn', formula: 'θ = 360°', note: 'Full circle rotation' }
      ]
    },
  
    // ---------------- SCIENCE ----------------
    {
      id: 'sci_vitamins',
      subject: 'SCIENCE',
      subjectName: 'Science',
      category: 'Nutrition',
      title: 'Vitamins & Deficiency Diseases Table',
      summary: 'Essential dietary nutrients, deficiency syndromes, and major symptoms.',
      content: [
        { label: 'Vitamin A', formula: 'Loss of Vision / Night Blindness', note: 'Poor vision in darkness, complete vision loss' },
        { label: 'Vitamin B1', formula: 'Beriberi', note: 'Weak muscles and very little energy to work' },
        { label: 'Vitamin C', formula: 'Scurvy', note: 'Bleeding gums, wounds take longer time to heal' },
        { label: 'Vitamin D', formula: 'Rickets', note: 'Bones become soft and bent' },
        { label: 'Calcium', formula: 'Bone and Tooth Decay', note: 'Weak bones, tooth decay' },
        { label: 'Iodine', formula: 'Goitre', note: 'Glands in the neck appear swollen, mental disability in children' },
        { label: 'Iron', formula: 'Anaemia', note: 'General fatigue and weakness' }
      ]
    },
    {
      id: 'sci_magnetism',
      subject: 'SCIENCE',
      subjectName: 'Science',
      category: 'Physics',
      title: 'Magnetism Laws & Properties',
      summary: 'Fundamental rules of magnetic materials and poles.',
      content: [
        { label: 'Magnetic Poles', formula: 'Every magnet has two poles: North (N) and South (S)', note: 'Magnetic force is strongest at the poles' },
        { label: 'Law of Attraction', formula: 'Opposite poles attract: N ↔ S', note: 'Unlike poles pull together' },
        { label: 'Law of Repulsion', formula: 'Similar poles repel: N ⇆ N,  S ⇆ S', note: 'Repulsion is the sure test of magnetism' },
        { label: 'Freely Suspended Magnet', formula: 'Always points North-South direction', note: 'Basis of the magnetic compass' },
        { label: 'Magnetic Materials', formula: 'Iron, Cobalt, Nickel', note: 'Attracted by magnets' },
        { label: 'Demagnetization', formula: 'Heating, hammering, or dropping from height', note: 'Causes a magnet to lose properties' }
      ]
    },
    {
      id: 'sci_si_units',
      subject: 'SCIENCE',
      subjectName: 'Science',
      category: 'Measurement',
      title: 'SI Units & Metric Prefixes',
      summary: 'Standard International units of measurement for length, mass, and time.',
      content: [
        { label: 'Length (SI Unit)', formula: 'Meter (m)', note: '1 km = 1,000 m,  1 m = 100 cm,  1 cm = 10 mm' },
        { label: 'Mass / Weight (SI Unit)', formula: 'Kilogram (kg)', note: '1 kg = 1,000 grams (g),  1 g = 1,000 milligrams (mg)' },
        { label: 'Time (SI Unit)', formula: 'Second (s)', note: '1 hour = 60 minutes = 3,600 seconds' },
        { label: 'Temperature (SI Unit)', formula: 'Kelvin (K) / Celsius (°C)', note: 'Water freezes at 0°C, boils at 100°C' },
        { label: 'Rectilinear Motion', formula: 'Motion along a straight line', note: 'e.g. Sprinter in 100m race' },
        { label: 'Periodic Motion', formula: 'Repeats after regular interval', note: 'e.g. Pendulum, hands of a clock' }
      ]
    },
    {
      id: 'sci_separation',
      subject: 'SCIENCE',
      subjectName: 'Science',
      category: 'Chemistry',
      title: 'Separation of Substances Cheat Sheet',
      summary: 'Techniques used to separate mixtures in everyday life.',
      content: [
        { label: 'Handpicking', formula: 'Separating larger impurities by hand', note: 'e.g. Stones from rice or wheat' },
        { label: 'Threshing', formula: 'Beating stalks to free grain seeds', note: 'Done manually or with bullocks/machines' },
        { label: 'Winnowing', formula: 'Wind separation of heavier & lighter components', note: 'Separates husk from grains' },
        { label: 'Sieving', formula: 'Separation based on particle size difference', note: 'Flour sieve removes bran' },
        { label: 'Sedimentation & Decantation', formula: 'Heavier solid settles down, clear liquid poured off', note: 'Muddy water settling' },
        { label: 'Filtration', formula: 'Passing liquid through a fine filter paper or cloth', note: 'Tea leaves, paneer separation' },
        { label: 'Evaporation', formula: 'Liquid turning into vapor leaving dissolved solids', note: 'Obtaining salt from sea water' }
      ]
    },
  
    // ---------------- SANSKRIT & HINDI ----------------
    {
      id: 'san_karak',
      subject: 'SANSKRIT',
      subjectName: 'Sanskrit & Hindi',
      category: 'Grammar',
      title: 'कारक एवं विभक्ति सारणी (Karak & Vibhakti)',
      summary: 'Eight cases, case endings (विभक्तियाँ), and case markers (कारक चिह्न).',
      content: [
        { label: 'प्रथमा विभक्ति', formula: 'कर्ता (Subject) — चिह्न: "ने"', note: 'रामः (राम ने)' },
        { label: 'द्वितीया विभक्ति', formula: 'कर्म (Object) — चिह्न: "को"', note: 'रामम् (राम को)' },
        { label: 'तृतीया विभक्ति', formula: 'करण (Instrument) — चिह्न: "से / के द्वारा"', note: 'रामेण (राम से/द्वारा)' },
        { label: 'चतुर्थी विभक्ति', formula: 'सम्प्रदान (Recipient) — चिह्न: "के लिए"', note: 'रामाय (राम के लिए)' },
        { label: 'पञ्चमी विभक्ति', formula: 'अपादान (Separation) — चिह्न: "से (अलग होना)"', note: 'रामात् (राम से अलग)' },
        { label: 'षष्ठी विभक्ति', formula: 'सम्बन्ध (Possessive) — चिह्न: "का, के, की"', note: 'रामस्य (राम का/के/की)' },
        { label: 'सप्तमी विभक्ति', formula: 'अधिकरण (Locative) — चिह्न: "में, पर"', note: 'रामे (राम में/पर)' },
        { label: 'सम्बोधन', formula: 'सम्बोधन (Vocative) — चिह्न: "हे!, अरे!"', note: 'हे राम! (हे राम!)' }
      ]
    },
    {
      id: 'san_dhatu_path',
      subject: 'SANSKRIT',
      subjectName: 'Sanskrit',
      category: 'Dhatu Roop',
      title: 'पठ् धातु रूप (लट् लकार — वर्तमान काल)',
      summary: 'Present tense conjugations for root verb पठ् (to read).',
      content: [
        { label: 'प्रथम पुरुष (Third Person)', formula: 'पठति (एकवचन) | पठतः (द्विवचन) | पठन्ति (बहुवचन)', note: 'सः पठति / तौ पठतः / ते पठन्ति' },
        { label: 'मध्यम पुरुष (Second Person)', formula: 'पठसि (एकवचन) | पठथः (द्विवचन) | पठथ (बहुवचन)', note: 'त्वम् पठसि / युवाम् पठथः / यूयम् पठथ' },
        { label: 'उत्तम पुरुष (First Person)', formula: 'पठामि (एकवचन) | पठावः (द्विवचन) | पठामः (बहुवचन)', note: 'अहम् पठामि / आवाम् पठावः / वयम् पठामः' }
      ]
    },
  
    // ---------------- SOCIAL SCIENCE ----------------
    {
      id: 'ssc_lat_long',
      subject: 'SSC',
      subjectName: 'Social Science',
      category: 'Geography',
      title: 'Important Latitudes & Earth Grid',
      summary: 'Key parallels of latitude and heat zones of the Earth.',
      content: [
        { label: 'Equator', formula: '0° Latitude', note: 'Divides Earth into Northern and Southern Hemispheres' },
        { label: 'Tropic of Cancer', formula: '23½° N (23.5° North)', note: 'Passes through center of India' },
        { label: 'Tropic of Capricorn', formula: '23½° S (23.5° South)', note: 'Southern tropical limit' },
        { label: 'Arctic Circle', formula: '66½° N (66.5° North)', note: 'Northern polar circle' },
        { label: 'Antarctic Circle', formula: '66½° S (66.5° South)', note: 'Southern polar circle' },
        { label: 'Torrid Zone', formula: 'Between Tropic of Cancer & Capricorn', note: 'Receives maximum heat' },
        { label: 'Frigid Zone', formula: 'Beyond 66½° to Poles (90°)', note: 'Extremely cold; sun never rises high' },
        { label: 'Prime Meridian', formula: '0° Longitude (Greenwich, London)', note: 'Standard reference for world time zones' }
      ]
    },
    {
      id: 'ssc_continents_oceans',
      subject: 'SSC',
      subjectName: 'Social Science',
      category: 'Geography',
      title: '7 Continents & 5 Oceans (By Size)',
      summary: 'World physical landmasses and water bodies in descending order.',
      content: [
        { label: '1. Asia (Largest)', formula: 'One-third of Earth land area', note: 'Surrounded by Arctic, Pacific, Indian Oceans' },
        { label: '2. Africa', formula: 'Second largest continent', note: 'Equator, Tropic of Cancer & Capricorn all pass through' },
        { label: '3. North America', formula: 'Third largest', note: 'Linked to South America by Isthmus of Panama' },
        { label: '4. South America', formula: 'Home to Amazon & Andes', note: 'World longest mountain range' },
        { label: '5. Antarctica', formula: 'Permanently frozen south pole', note: 'Indian stations: Maitri and Bharati' },
        { label: '6. Europe & 7. Australia', formula: 'Australia is an Island Continent', note: 'Smallest continent, entirely in Southern hemisphere' },
        { label: 'Pacific Ocean (Largest)', formula: 'Almost circular; Mariana Trench', note: 'Deepest point on Earth (11,022 meters)' },
        { label: 'Atlantic Ocean', formula: 'S-shaped; busiest ocean for trade', note: 'Indented natural coastline for ports' },
        { label: 'Indian Ocean', formula: 'Only ocean named after a country', note: 'Almost triangular in shape' }
      ]
    }
  ];
  
  // Curated Educational Video Playlist Database (Class 6 NCERT)
  const videos = [
    // MATHEMATICS
    {
      id: 'vid_math_ch1',
      subjectId: 'MATH',
      subjectName: 'Mathematics',
      chapterNum: 1,
      chapterTitle: 'Patterns in Mathematics / Numbers',
      title: 'Patterns in Math & Place Value Masterclass',
      duration: '18 min',
      source: 'NCERT / Khan Academy',
      embedId: '', // unavailable on YouTube — app opens a YouTube search instead
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8744y2K0Uq2eQ2LzR1Kq7u1Q',
      khanQuery: 'class 6 math patterns in mathematics ncert',
      description: 'Visual breakdown of numerical sequences, spatial arrangements, and number patterns.'
    },
    {
      id: 'vid_math_ch2',
      subjectId: 'MATH',
      subjectName: 'Mathematics',
      chapterNum: 2,
      chapterTitle: 'Lines and Angles',
      title: 'Complete Geometry: Points, Rays, Lines & Angles',
      duration: '22 min',
      source: 'Khan Academy',
      embedId: '', // unavailable on YouTube — app opens a YouTube search instead
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8753X3zZc2UvO5L7r3vXf9_A',
      khanQuery: 'class 6 lines and angles ncert ganita prakash',
      description: 'Master acute, right, obtuse, and reflex angles with real-life architectural examples.'
    },
    {
      id: 'vid_math_ch3',
      subjectId: 'MATH',
      subjectName: 'Mathematics',
      chapterNum: 3,
      chapterTitle: 'Number Play & Prime Numbers',
      title: 'Prime, Composite & Divisibility Rules Made Easy',
      duration: '25 min',
      source: 'Manocha Academy',
      embedId: '9vKqVkMQHKk',
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8763BvK6mZ_xV5k8_p2bX9Q',
      khanQuery: 'class 6 prime numbers and divisibility rules',
      description: 'Sieve of Eratosthenes, prime factorisation, and speed tricks for divisibility.'
    },
    {
      id: 'vid_math_ch4',
      subjectId: 'MATH',
      subjectName: 'Mathematics',
      chapterNum: 4,
      chapterTitle: 'Data Handling',
      title: 'Data Handling: Tally Marks, Pictographs & Bar Graphs',
      duration: '20 min',
      source: 'NCERT PM e-VIDYA',
      embedId: '', // unavailable on YouTube — app opens a YouTube search instead
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8778XvX9k_p2bX8Q1mZ_xV5k',
      khanQuery: 'class 6 data handling bar graphs ncert',
      description: 'Organising unstructured information into readable frequency charts and visual bars.'
    },
    {
      id: 'vid_math_ch6',
      subjectId: 'MATH',
      subjectName: 'Mathematics',
      chapterNum: 6,
      chapterTitle: 'Perimeter and Area',
      title: 'Perimeter & Area of Rectangles, Squares & Polygons',
      duration: '24 min',
      source: 'Khan Academy India',
      embedId: 'rSVMrPu0__U',
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8749XvX9k_p2bX8Q1mZ_xV5k',
      khanQuery: 'class 6 perimeter and area formulas and word problems',
      description: 'Understand the difference between perimeter boundary and enclosed surface area.'
    },
    {
      id: 'vid_math_ch7',
      subjectId: 'MATH',
      subjectName: 'Mathematics',
      chapterNum: 7,
      chapterTitle: 'Fractions',
      title: 'Fractions Visualised: Proper, Improper & Mixed Numbers',
      duration: '21 min',
      source: 'Khan Academy',
      embedId: '', // unavailable on YouTube — app opens a YouTube search instead
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8758XvX9k_p2bX8Q1mZ_xV5k',
      khanQuery: 'class 6 fractions ncert ganita prakash',
      description: 'Fraction number line representations, equivalent fractions, and simplest forms.'
    },
  
    // SCIENCE — All 13 NCERT Curiosity Chapters Stitched with Khan Academy Topic Sequences
    {
      id: 'vid_sci_ch1',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 1,
      chapterTitle: 'The Wonderful World of Science',
      title: 'How Scientists Think: Curiosity, Observation & The Scientific Method',
      duration: '14 min • 2 Stitched Topics',
      source: 'Khan Academy',
      embedId: '4YdPXRPpZFk',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 science the wonderful world of science scientific method',
      description: 'Stitched masterclass covering how everyday curiosity turns into hypotheses, fair tests, and scientific discovery.',
      topics: [
        { title: '1. The Scientific Method: Observation to Hypothesis', embedId: '4YdPXRPpZFk', duration: '7 min', section: '§ 1.1–1.2' },
        { title: '2. Exploring the Living & Non-Living World Around Us', embedId: 'tMfaKTBH6d8', duration: '7 min', section: '§ 1.3' }
      ]
    },
    {
      id: 'vid_sci_ch2',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 2,
      chapterTitle: 'Diversity in the Living World',
      title: 'Plant Diversity, Leaf Venation, Root Systems & Habitat Adaptations',
      duration: '18 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'qpDOWitPKUY',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 diversity in the living world plants adaptations khan academy',
      description: 'How to group herbs, shrubs, and trees, link leaf venation to taproots vs. fibrous roots, and compare desert & mountain adaptations.',
      topics: [
        { title: '1. Diversity in Plants: Herbs, Shrubs, Trees & Roots', embedId: 'qpDOWitPKUY', duration: '9 min', section: '§ 2.1–2.2' },
        { title: '2. Adaptations in Plants & Habitats (Desert, Mountain, Aquatic)', embedId: '_HD8WimMjBw', duration: '9 min', section: '§ 2.3–2.5' }
      ]
    },
    {
      id: 'vid_sci_ch3',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 3,
      chapterTitle: 'Mindful Eating: A Path to a Healthy Body',
      title: 'Macronutrients, Vitamins, Balanced Diet & Deficiency Diseases',
      duration: '16 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'tZB6qj_AcZ0',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 science mindful eating components of food deficiency diseases',
      description: 'Complete nutrition masterclass: energy-giving vs. body-building nutrients, starch/protein/fat lab tests, and vitamin deficiency syndromes.',
      topics: [
        { title: '1. Macronutrients: Carbohydrates, Proteins & Fats', embedId: 'tZB6qj_AcZ0', duration: '8 min', section: '§ 3.1–3.2' },
        { title: '2. Vitamins, Minerals & Deficiency Diseases (Scurvy, Rickets, Goitre)', embedId: 'mMAgwglfH5U', duration: '8 min', section: '§ 3.3–3.5' }
      ]
    },
    {
      id: 'vid_sci_ch4',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 4,
      chapterTitle: 'Exploring Magnets',
      title: 'Magnetic Materials, Poles, Attraction/Repulsion & Compass Directions',
      duration: '21 min • 3 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'X931qHVvrJ4',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 exploring magnets poles compass khan academy',
      description: 'Three-part Khan Academy sequence covering magnetic vs. non-magnetic materials, magnetic field effects, and freely suspended magnets.',
      topics: [
        { title: '1. Magnetic and Non-Magnetic Substances', embedId: 'X931qHVvrJ4', duration: '7 min', section: '§ 4.1' },
        { title: '2. Freely Suspended Magnet, Poles & Finding Directions', embedId: '-dKV5LVGoJs', duration: '7 min', section: '§ 4.2–4.3' },
        { title: '3. Magnetic Effect Through Non-Magnetic Materials', embedId: '' /* unavailable on YouTube — app opens a search */, duration: '7 min', section: '§ 4.4–4.5' }
      ]
    },
    {
      id: 'vid_sci_ch5',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 5,
      chapterTitle: 'Measurement of Length and Motion',
      title: 'Reference Points, SI Units of Length & Types of Motion',
      duration: '22 min • 3 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'Hz9MqliHG5U',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 measurement of length and motion types of motion khan academy',
      description: 'Why we need standard SI units, how reference points define motion, and comparing linear, circular, rotational, and oscillatory motion.',
      topics: [
        { title: '1. Reference Point & Measurement of Length (SI Units)', embedId: 'Hz9MqliHG5U', duration: '7 min', section: '§ 5.1–5.4' },
        { title: '2. Linear, Circular and Rotational Motion', embedId: 'cMa726kli84', duration: '8 min', section: '§ 5.5' },
        { title: '3. Periodic and Oscillatory Motion', embedId: 'e62NaIyuljg', duration: '7 min', section: '§ 5.5' }
      ]
    },
    {
      id: 'vid_sci_ch6',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 6,
      chapterTitle: 'Materials Around Us',
      title: 'Sorting Materials: Lustre, Hardness, Solubility & Transparency',
      duration: '16 min • 3 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'JOb9xcq0EL4',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 materials around us sorting materials properties khan academy',
      description: 'Classifying everyday objects by physical properties: appearance, hardness, soluble vs. insoluble in water, and transparent/translucent/opaque.',
      topics: [
        { title: '1. Introduction to Objects & Material Classification', embedId: 'JOb9xcq0EL4', duration: '6 min', section: '§ 6.1–6.2' },
        { title: '2. Dissolution & Solubility of Solids and Gases in Water', embedId: 'cj96k_BG2Rs', duration: '5 min', section: '§ 6.3.4' },
        { title: '3. Transparent, Translucent & Opaque Materials', embedId: 'f6_kp6jcdIM', duration: '5 min', section: '§ 6.3.3' }
      ]
    },
    {
      id: 'vid_sci_ch7',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 7,
      chapterTitle: 'Temperature and its Measurement',
      title: 'Thermometers: Clinical vs. Laboratory & Temperature Scales (°C, °F, K)',
      duration: '14 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'reI5_Eyecxk',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 temperature and its measurement clinical laboratory thermometer',
      description: 'How clinical, digital, and laboratory thermometers work, reading scales accurately, and converting between Celsius, Fahrenheit, and Kelvin.',
      topics: [
        { title: '1. Measuring Temperature: Clinical & Laboratory Thermometers', embedId: 'reI5_Eyecxk', duration: '8 min', section: '§ 7.1–7.3' },
        { title: '2. Thermal Energy, Temperature & Heat Effects', embedId: 'bL-NoRyJalY', duration: '6 min', section: '§ 7.4' }
      ]
    },
    {
      id: 'vid_sci_ch8',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 8,
      chapterTitle: 'A Journey through States of Water',
      title: 'Evaporation, Condensation, Cooling Effect & The Water Cycle',
      duration: '16 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'r2dnUvP1JgM',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 a journey through states of water evaporation condensation water cycle',
      description: 'Investigating ice, liquid water, and water vapour, factors speeding up evaporation, earthenware pot cooling, and cloud formation.',
      topics: [
        { title: '1. Factors Affecting Evaporation & Cooling Effect', embedId: 'bL-NoRyJalY', duration: '8 min', section: '§ 8.1–8.3' },
        { title: '2. Condensation, Cloud Formation & The Water Cycle', embedId: 'r2dnUvP1JgM', duration: '8 min', section: '§ 8.4–8.5' }
      ]
    },
    {
      id: 'vid_sci_ch9',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 9,
      chapterTitle: 'Methods of Separation in Everyday Life',
      title: 'Complete Separation Toolkit: Threshing, Winnowing, Sieving & Filtration',
      duration: '26 min • 4 Stitched Topics',
      source: 'Khan Academy India',
      embedId: '-FIxZ9fNftA',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 methods of separation in everyday life khan academy',
      description: 'Four-part stitched Khan Academy series covering every separation method from grain harvesting to laboratory filtration.',
      topics: [
        { title: '1. Threshing: Separating Grain Seeds from Stalks', embedId: 'DUycwn5y-K8', duration: '6 min', section: '§ 9.1' },
        { title: '2. Winnowing: Wind Separation of Husk & Grain', embedId: 'v2skK5_JXWU', duration: '6 min', section: '§ 9.1' },
        { title: '3. Handpicking & Sieving by Particle Size', embedId: '-FIxZ9fNftA', duration: '7 min', section: '§ 9.1' },
        { title: '4. Sedimentation, Decantation & Filtration', embedId: 'FOOt9JvS8H8', duration: '7 min', section: '§ 9.2' }
      ]
    },
    {
      id: 'vid_sci_ch10',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 10,
      chapterTitle: 'Living Creatures: Exploring their Characteristics',
      title: 'What Makes Something Living? Growth, Respiration, Stimulus & Life Cycles',
      duration: '15 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'tMfaKTBH6d8',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 living creatures exploring their characteristics germination life cycle',
      description: 'Distinguishing living from non-living things, seed germination conditions, plant phototropism, and life cycles of frogs and mosquitoes.',
      topics: [
        { title: '1. What Makes Something Living? Core Characteristics', embedId: 'tMfaKTBH6d8', duration: '8 min', section: '§ 10.1–10.2' },
        { title: '2. Plant Growth, Seed Germination & Life Cycles', embedId: 'qpDOWitPKUY', duration: '7 min', section: '§ 10.3–10.5' }
      ]
    },
    {
      id: 'vid_sci_ch11',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 11,
      chapterTitle: "Nature's Treasures",
      title: 'Natural Resources: Air, Water, Soil, Forests & Renewable Energy',
      duration: '16 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'Dozbgnftdao',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 natures treasures air water soil forests fossil fuels khan academy',
      description: 'Exploring Earth’s vital resources: atmosphere composition, rainwater harvesting, soil formation from rocks, and renewable vs. non-renewable resources.',
      topics: [
        { title: '1. Water: Freshwater Scarcity, Conservation & Harvesting', embedId: 'Dozbgnftdao', duration: '8 min', section: '§ 11.2' },
        { title: '2. Soil, Rocks, Minerals & Forest Ecosystems', embedId: 'JdDOv0HXDpw', duration: '8 min', section: '§ 11.4–11.6' }
      ]
    },
    {
      id: 'vid_sci_ch12',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 12,
      chapterTitle: 'Beyond Earth',
      title: 'The Night Sky: Stars, Constellations, The Solar System & Milky Way',
      duration: '17 min • 2 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'wTyqO-tfs7Q',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 beyond earth solar system constellations moon khan academy',
      description: 'Journey from night-sky constellations (Saptarishi, Orion, Pole Star) through the 8 planets of our Solar System, the Moon, and the Milky Way galaxy.',
      topics: [
        { title: '1. The Solar System: Sun, Inner/Outer Planets & Asteroids', embedId: 'wTyqO-tfs7Q', duration: '9 min', section: '§ 12.2' },
        { title: '2. The Moon, Phases & Night Sky Observation', embedId: 'PEplWMXI1YQ', duration: '8 min', section: '§ 12.1, 12.3' }
      ]
    },
    {
      id: 'vid_sci_ch13',
      subjectId: 'SCIENCE',
      subjectName: 'Science',
      chapterNum: 13,
      chapterTitle: 'Light, Shadows and Reflections',
      title: 'Sources of Light, Shadow Formation, Umbra/Penumbra & Mirrors',
      duration: '21 min • 3 Stitched Topics',
      source: 'Khan Academy India',
      embedId: 'krVJWL5DyrM',
      khanUnitUrl: 'https://www.khanacademy.org/science/ncert-science-class-6',
      khanQuery: 'class 6 light shadows and reflections pinhole camera khan academy',
      description: 'Three-part Khan Academy physics module on luminous bodies, rectilinear propagation of light, shadow geometry, pinhole cameras, and plane mirrors.',
      topics: [
        { title: '1. Sources of Light & Rectilinear Propagation', embedId: 'krVJWL5DyrM', duration: '7 min', section: '§ 13.1' },
        { title: '2. How Shadows Are Formed (Opaque, Translucent, Transparent)', embedId: 'f6_kp6jcdIM', duration: '7 min', section: '§ 13.2' },
        { title: '3. Umbra, Penumbra, Pinhole Camera & Reflections', embedId: 'oWozL4TqjiQ', duration: '7 min', section: '§ 13.3–13.4' }
      ]
    },
  
    // SOCIAL SCIENCE
    {
      id: 'vid_ssc_ch1',
      subjectId: 'SSC',
      subjectName: 'Social Science',
      chapterNum: 1,
      chapterTitle: 'Locating Places on the Earth',
      title: 'Globe: Latitudes, Longitudes & Prime Meridian Grid',
      duration: '25 min',
      source: 'National Geographic / NCERT',
      embedId: '', // unavailable on YouTube — app opens a YouTube search instead
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8738XvX9k_p2bX8Q1mZ_xV5k',
      khanQuery: 'class 6 geography latitudes and longitudes globe',
      description: 'Understand coordinate systems, heat zones, and how longitude determines local standard time.'
    },
    {
      id: 'vid_ssc_ch2',
      subjectId: 'SSC',
      subjectName: 'Social Science',
      chapterNum: 2,
      chapterTitle: 'Oceans and Continents',
      title: 'Major Domains of the Earth: Lithosphere & Hydrosphere',
      duration: '22 min',
      source: 'NCERT Social Science',
      embedId: 'rSVMrPu0__U',
      embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PL4wbsp29g8728XvX9k_p2bX8Q1mZ_xV5k',
      khanQuery: 'class 6 oceans and continents exploring society',
      description: 'Tectonic plates, 7 continents, 5 ocean trenches, and the biosphere.'
    }
  ];

  registerClassData('6', { formulas, videos });
})();
