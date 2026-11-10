/** Class VI — practice quiz questions, keyed by subject id. */
(function () {
  const quiz = {
    MATH: [
      {
        id: "m1",
        chapter: "Chapter 1 - Patterns in Mathematics / Numbers",
        question: "What is the place value of 5 in the number 45,672?",
        options: ["50", "500", "5,000", "50,000"],
        correct: 2,
        explanation: "In 45,672, the digit 5 is in the thousands place, so its value is 5,000."
      },
      {
        id: "m2",
        chapter: "Chapter 2 - Lines and Angles",
        question: "An angle measuring exactly 90 degrees is called a:",
        options: ["Acute angle", "Obtuse angle", "Right angle", "Straight angle"],
        correct: 2,
        explanation: "A right angle measures exactly 90°."
      },
      {
        id: "m3",
        chapter: "Chapter 3 - Number Play",
        question: "Which of the following numbers is prime?",
        options: ["12", "15", "17", "21"],
        correct: 2,
        explanation: "17 has only two factors: 1 and 17, making it a prime number."
      },
      {
        id: "m4",
        chapter: "Chapter 4 - Data Handling",
        question: "What is the average (mean) of numbers 4, 8, 12, and 16?",
        options: ["8", "10", "12", "40"],
        correct: 1,
        explanation: "Sum = 4 + 8 + 12 + 16 = 40. Mean = 40 ÷ 4 = 10."
      },
      {
        id: "m5",
        chapter: "Fractions & Decimals",
        question: "What is 3/4 converted into a percentage?",
        options: ["25%", "50%", "75%", "80%"],
        correct: 2,
        explanation: "(3 / 4) * 100 = 75%."
      }
    ],
    SCIENCE: [
      {
        id: "s1",
        chapter: "Chapter 1 - Components of Food",
        question: "Which vitamin deficiency causes Rickets in children?",
        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
        correct: 3,
        explanation: "Vitamin D deficiency leads to weak bones and rickets in children."
      },
      {
        id: "s2",
        chapter: "Chapter 2 - Diversity in the Living World",
        question: "Plants with green and tender stems are called:",
        options: ["Trees", "Herbs", "Shrubs", "Climbers"],
        correct: 1,
        explanation: "Herbs are small plants with soft green stems."
      },
      {
        id: "s3",
        chapter: "Chapter 3 - Mindful Eating",
        question: "Which nutrient primarily provides energy to our body?",
        options: ["Carbohydrates", "Proteins", "Vitamins", "Minerals"],
        correct: 0,
        explanation: "Carbohydrates and fats are the primary energy providers."
      },
      {
        id: "s4",
        chapter: "Chapter 4 - Magnetism",
        question: "Where is the magnetic force strongest in a bar magnet?",
        options: ["At the center", "At the poles", "Uniform everywhere", "Outside"],
        correct: 1,
        explanation: "Magnetic force is concentrated and strongest at the North and South poles."
      },
      {
        id: "s5",
        chapter: "Chapter 5 - Light and Shadows",
        question: "An object that does not allow light to pass through it is called:",
        options: ["Transparent", "Translucent", "Opaque", "Reflective"],
        correct: 2,
        explanation: "Opaque materials block all light and cast distinct shadows."
      }
    ],
    ENGLISH: [
      {
        id: "e1",
        chapter: "Chapter 1 - A Bottle of Dew",
        question: "What is the noun form of the adjective 'Honest'?",
        options: ["Honestly", "Honesty", "Honestness", "Dishonest"],
        correct: 1,
        explanation: "'Honesty' is the abstract noun of 'honest'."
      },
      {
        id: "e2",
        chapter: "Grammar & Vocabulary",
        question: "Choose the correct antonym of the word 'Ancient':",
        options: ["Old", "Modern", "Historic", "Traditional"],
        correct: 1,
        explanation: "'Modern' means new, which is the exact opposite of 'Ancient'."
      },
      {
        id: "e3",
        chapter: "Poetry - The Rainbow",
        question: "Who is the poet of the famous poem 'The Rainbow'?",
        options: ["Christina Rossetti", "Robert Frost", "William Wordsworth", "Sarojini Naidu"],
        correct: 0,
        explanation: "Christina Rossetti wrote the famous poem 'The Rainbow'."
      }
    ],
    HINDI: [
      {
        id: "h1",
        chapter: "Chapter 1 - मल्हार",
        question: "'सूर्य' शब्द का सही पर्यायवाची शब्द कौन सा है?",
        options: ["निशाकर", "रवि", "जलद", "पवन"],
        correct: 1,
        explanation: "'रवि' सूर्य का प्रसिद्ध पर्यायवाची शब्द है।"
      },
      {
        id: "h2",
        chapter: "व्याकरण",
        question: "संज्ञा के स्थान पर प्रयोग होने वाले शब्दों को क्या कहते हैं?",
        options: ["विशेषण", "क्रिया", "सर्वनाम", "अव्यय"],
        correct: 2,
        explanation: "जो शब्द संज्ञा के स्थान पर बोले या लिखे जाते हैं, उन्हें सर्वनाम कहते हैं।"
      }
    ],
    SSC: [
      {
        id: "ssc1",
        chapter: "Chapter 1 - Locating Places on the Earth",
        question: "The 0° Latitude line passing horizontally around the Earth is known as:",
        options: ["Equator", "Prime Meridian", "Tropic of Cancer", "Arctic Circle"],
        correct: 0,
        explanation: "The Equator divides the Earth into Northern and Southern Hemispheres at 0° latitude."
      },
      {
        id: "ssc2",
        chapter: "Chapter 2 - Oceans and Continents",
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correct: 2,
        explanation: "The Pacific Ocean is the world's largest and deepest ocean."
      },
      {
        id: "ssc3",
        chapter: "Chapter 3 - Landforms and Life",
        question: "Which landform is known as a 'Plateau'?",
        options: ["Low land between hills", "Flat-topped elevated landform", "Vast water body", "Steep mountain peak"],
        correct: 1,
        explanation: "A plateau is a flat-topped tableland elevated above surrounding areas."
      }
    ],
    SANSKRIT: [
      {
        id: "san1",
        chapter: "Chapter 1 - दीपकम",
        question: "'बालकः पठति' वाक्यस्य हिन्दी भाषायां अर्थः कः?",
        options: ["बालक खेलता है", "बालक पढ़ता है", "बालक सोता है", "बालक दौड़ता है"],
        correct: 1,
        explanation: "'पठति' इत्यस्य अर्थः 'पढ़ता है' भवति।"
      }
    ],
    FRENCH: [
      {
        id: "fr1",
        chapter: "Basic Expressions",
        question: "How do you say 'Good morning' or 'Hello' in French?",
        options: ["Bonjour", "Bonsoir", "Merci", "Au revoir"],
        correct: 0,
        explanation: "'Bonjour' is the standard French greeting for Good morning/Hello."
      }
    ]
  };

  registerClassData('6', { quiz });
})();
