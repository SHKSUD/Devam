/**
 * Class VI Mathematics (Ganita Prakash) — Reproducible Annual Examination Sample Paper Engine
 * Aligned strictly with:
 *   1. Bloom Public School, Vasant Kunj, New Delhi — Mathematics Sample Question Paper (2026–27)
 *      - Time Allowed: 2.5 Hours | Max Marks: 60 | Total Questions: 29 across 5 Sections (A–E)
 *      - Section A (16 Marks, Q1–Q16):
 *          • Q1–Q8: 8 Multiple Choice Questions (1 mark each)
 *          • Q9–Q10: 2 Assertion–Reason Questions (1 mark each)
 *          • Q11–Q16: 6 Fill in the Blanks (1 mark each)
 *      - Section B (8 Marks, Q17–Q20): 4 Very Short Answer questions × 2 marks each (Internal OR in Q18)
 *      - Section C (9 Marks, Q21–Q23): 3 Short Answer questions × 3 marks each (Internal OR in Q23)
 *      - Section D (15 Marks, Q24–Q26): 3 Long Answer questions × 5 marks each (Internal OR in Q26)
 *      - Section E (12 Marks, Q27–Q29): 3 Case-Based Integrated Units × 4 marks each (1 + 1 + 2 marks with internal OR in (iii))
 *   2. Official Annual Exam Syllabus (Page 2 of Ganit_Prakash_Syllabus.pdf):
 *      - All 10 Chapters Assessed: Ch 1 to Ch 10
 */
(function () {
  const MATH_ANNUAL_BLUEPRINT = {
    schoolName: 'BLOOM PUBLIC SCHOOL',
    schoolAddress: 'Vasant Kunj, New Delhi',
    examTitle: 'Sample Question Paper — Annual Examination (2026–27)',
    subject: 'Mathematics (Ganita Prakash)',
    classLabel: 'Class – VI',
    duration: '2.5 hours',
    maxMarks: 60,
    totalQuestions: 29,
    assessedChapters: [
      { num: 1, title: 'Patterns in Mathematics', weightMarks: 6 },
      { num: 2, title: 'Lines and Angles', weightMarks: 6 },
      { num: 3, title: 'Number Play', weightMarks: 6 },
      { num: 4, title: 'Data Handling and Presentation', weightMarks: 6 },
      { num: 5, title: 'Prime Time', weightMarks: 6 },
      { num: 6, title: 'Perimeter and Area', weightMarks: 7 },
      { num: 7, title: 'Fractions', weightMarks: 7 },
      { num: 8, title: 'Playing with Constructions', weightMarks: 4 },
      { num: 9, title: 'Symmetry', weightMarks: 5 },
      { num: 10, title: 'The Other Side of Zero (Integers)', weightMarks: 7 }
    ],
    excludedChapters: [],
    termSyllabi: {
      PA1: { label: 'PA-1', title: 'Periodic Assessment – I (2026–27)', chapters: [1, 2, 3], maxMarks: 25, duration: '1 Hour', durationSec: 3600 },
      MIDTERM: { label: 'Mid-Term', title: 'Sample Question Paper — Mid-Term Examination (2026–27)', chapters: [1, 2, 3, 4, 5], maxMarks: 60, duration: '2.5 hours', durationSec: 9000 },
      PA2: { label: 'PA-2', title: 'Periodic Assessment – II (2026–27)', chapters: [6, 7], maxMarks: 25, duration: '1 Hour', durationSec: 3600 },
      ANNUAL: { label: 'Annual', title: 'Sample Question Paper — Annual Examination (2026–27)', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], maxMarks: 60, duration: '2.5 hours', durationSec: 9000 }
    },
    instructions: [
      '1. This Question Paper has 5 Sections A, B, C, D and E.',
      '2. Section A has 10 MCQs (including 2 Assertion-Reason) and 6 Fill in the blanks carrying 1 mark each (from Q1 – Q16).',
      '3. Section B has 4 questions carrying 02 marks each (from Q17 – Q20).',
      '4. Section C has 3 questions carrying 03 marks each (from Q21 – Q23).',
      '5. Section D has 3 questions carrying 05 marks each (from Q24 – Q26).',
      '6. Section E has 3 case-based integrated units of assessment (04 marks each) with sub-parts of the values of 1, 1 and 2 marks each respectively (from Q27 – Q29).',
      '7. All Questions are compulsory. However, an internal choice of 1 Question of 5 marks, 1 Question of 3 marks and 1 Question of 2 marks has been provided. An internal choice has also been provided in the 2-marks questions of Section E.'
    ],

    // =========================================================================
    // SECTION A PART 1: Q1–Q8 MCQs (8 picked per paper)
    // =========================================================================
    sectionAMcqPool: [
      // --- SET A (8 MCQs across Ch 1–10) ---
      {
        id: 'ma_mcq_1', set: 'A', ch: 1,
        q: 'Which number sequence is obtained by adding consecutive odd numbers starting from 1 (i.e., 1, 1+3, 1+3+5, 1+3+5+7, ...)?',
        options: ['(a) Triangular numbers', '(b) Square numbers', '(c) Virahanka numbers', '(d) Cube numbers'],
        correct: 1,
        hint: 'Calculate the sums: 1 = 1, 1+3 = 4, 1+3+5 = 9, 1+3+5+7 = 16. What kind of numbers are 1, 4, 9, 16?',
        ans: '(b) Square numbers (1, 4, 9, 16, 25... are squares of natural numbers).'
      },
      {
        id: 'ma_mcq_2', set: 'A', ch: 2,
        q: 'When the hands of a clock show 3:00 PM, and then move to 6:00 PM, what are the types of angles formed at 3:00 PM and 6:00 PM respectively?',
        options: ['(a) Acute angle and Right angle', '(b) Right angle (90°) and Straight angle (180°)', '(c) Obtuse angle and Reflex angle', '(d) Straight angle and Complete angle'],
        correct: 1,
        hint: 'A quarter turn on a clock face (3 hours) is 90°, and a half turn (6 hours) is 180°.',
        ans: '(b) Right angle (90°) at 3:00 PM and Straight angle (180°) at 6:00 PM.'
      },
      {
        id: 'ma_mcq_3', set: 'A', ch: 5,
        q: 'Which of the following numbers is divisible by BOTH 3 and 9?',
        options: ['(a) 4,215', '(b) 7,326', '(c) 5,114', '(d) 8,024'],
        correct: 1,
        hint: 'Add the digits of each number. A number is divisible by 9 (and 3) if the sum of its digits is a multiple of 9.',
        ans: '(b) 7,326 (Sum of digits = 7 + 3 + 2 + 6 = 18, which is divisible by both 3 and 9).'
      },
      {
        id: 'ma_mcq_4', set: 'A', ch: 6,
        q: 'If the perimeter of a regular hexagon is 48 cm, what is the length of each of its sides?',
        options: ['(a) 6 cm', '(b) 8 cm', '(c) 12 cm', '(d) 9 cm'],
        correct: 1,
        hint: 'A regular hexagon has 6 equal sides. Divide the total perimeter by 6.',
        ans: '(b) 8 cm (Side = Perimeter ÷ 6 = 48 ÷ 6 = 8 cm).'
      },
      {
        id: 'ma_mcq_5', set: 'A', ch: 7,
        q: 'Which of the following fractions is in its simplest (lowest) form?',
        options: ['(a) 14/21', '(b) 15/28', '(c) 18/24', '(d) 25/35'],
        correct: 1,
        hint: 'Check which numerator and denominator are co-prime (share no common factor other than 1).',
        ans: '(b) 15/28 (Factors of 15 are 1, 3, 5, 15; factors of 28 are 1, 2, 4, 7, 14, 28 — HCF is 1).'
      },
      {
        id: 'ma_mcq_6', set: 'A', ch: 8,
        q: 'In any rectangle ABCD, which of the following statements about its diagonals AC and BD is ALWAYS true?',
        options: ['(a) They are unequal in length', '(b) They are equal in length and bisect each other', '(c) They never intersect each other', '(d) They lie outside the rectangle'],
        correct: 1,
        hint: 'Draw a rectangle and measure both diagonals from corner to opposite corner.',
        ans: '(b) In a rectangle, both diagonals are equal in length (AC = BD) and bisect each other at the centre.'
      },
      {
        id: 'ma_mcq_7', set: 'A', ch: 9,
        q: 'How many lines of symmetry does an equilateral triangle have?',
        options: ['(a) 1', '(b) 2', '(c) 3', '(d) 6'],
        correct: 2,
        hint: 'An equilateral triangle has 3 equal sides and 3 equal vertices. A line from each vertex to the opposite midpoint folds it evenly.',
        ans: '(c) 3 lines of symmetry.'
      },
      {
        id: 'ma_mcq_8', set: 'A', ch: 10,
        q: 'What is the value of (−15) + (+23) − (−7)?',
        options: ['(a) +1', '(b) +15', '(c) −31', '(d) −15'],
        correct: 1,
        hint: 'Remember that subtracting (−7) is the same as adding (+7): (−15) + 23 + 7.',
        ans: '(b) +15 (Since −15 + 23 = +8, and 8 − (−7) = 8 + 7 = +15).'
      },

      // --- SET B (8 MCQs across Ch 1–10) ---
      {
        id: 'mb_mcq_1', set: 'B', ch: 1,
        q: 'In the Virahanka–Fibonacci sequence 1, 2, 3, 5, 8, 13, 21, ___, what is the next term?',
        options: ['(a) 29', '(b) 34', '(c) 32', '(d) 42'],
        correct: 1,
        hint: 'Each term in the Virahanka sequence is the sum of the two preceding terms.',
        ans: '(b) 34 (Since 13 + 21 = 34).'
      },
      {
        id: 'mb_mcq_2', set: 'B', ch: 3,
        q: 'Which of the following 4-digit numbers is a palindrome whose digit sum is 14?',
        options: ['(a) 3443', '(b) 2552', '(c) 4343', '(d) 1661'],
        correct: 0,
        hint: 'A palindrome reads the same forwards and backwards; also check 3 + 4 + 4 + 3 AND 2 + 5 + 5 + 2.',
        ans: '(a) 3443 (Reads 3443 both ways, and 3 + 4 + 4 + 3 = 14; note 2552 & 1661 also sum to 14, with 3443 as option a).'
      },
      {
        id: 'mb_mcq_3', set: 'B', ch: 4,
        q: 'In a bar graph showing fruit sales, if 1 unit length represents 15 kg of apples, what height of the bar will represent 90 kg of apples?',
        options: ['(a) 5 units', '(b) 6 units', '(c) 7 units', '(d) 9 units'],
        correct: 1,
        hint: 'Divide the total quantity (90 kg) by the scale value of 1 unit (15 kg).',
        ans: '(b) 6 units (90 ÷ 15 = 6 units).'
      },
      {
        id: 'mb_mcq_4', set: 'B', ch: 6,
        q: 'A square park and a rectangular park have the exact same perimeter of 40 m. If the rectangular park has length 14 m and breadth 6 m, which park has the larger area?',
        options: ['(a) Rectangular park (84 sq m)', '(b) Square park (100 sq m)', '(c) Both have equal area', '(d) Cannot be determined'],
        correct: 1,
        hint: 'Side of square = 40 ÷ 4 = 10 m → Area = 10 × 10 = 100 sq m. Area of rectangle = 14 × 6 = 84 sq m.',
        ans: '(b) Square park has a larger area (100 sq m vs 84 sq m).'
      },
      {
        id: 'mb_mcq_5', set: 'B', ch: 7,
        q: 'What is the improper fraction equivalent to the mixed fraction 4 3/7?',
        options: ['(a) 19/7', '(b) 31/7', '(c) 28/7', '(d) 15/7'],
        correct: 1,
        hint: 'Multiply the whole number by the denominator and add the numerator: (4 × 7 + 3) / 7.',
        ans: '(b) 31/7 (Since 4 × 7 + 3 = 28 + 3 = 31).'
      },
      {
        id: 'mb_mcq_6', set: 'B', ch: 8,
        q: 'Which geometric instrument is best used to transfer an exact distance or draw a circle of given radius r = 4.5 cm?',
        options: ['(a) Protractor', '(b) Set square', '(c) Pair of compasses', '(d) Unmarked straightedge'],
        correct: 2,
        hint: 'Think of the tool with a sharp metal pointer on one arm and a pencil holder on the other.',
        ans: '(c) Pair of compasses.'
      },
      {
        id: 'mb_mcq_7', set: 'B', ch: 9,
        q: 'What is the smallest angle of rotational symmetry of a regular square?',
        options: ['(a) 45°', '(b) 60°', '(c) 90°', '(d) 180°'],
        correct: 2,
        hint: 'A square matches itself 4 times during a full 360° turn. Divide 360° by 4.',
        ans: '(c) 90° (Order of rotational symmetry = 4; Angle = 360° ÷ 4 = 90°).'
      },
      {
        id: 'mb_mcq_8', set: 'B', ch: 10,
        q: 'Which of the following integers lies farthest to the LEFT on a standard horizontal number line?',
        options: ['(a) −3', '(b) 0', '(c) −19', '(d) −11'],
        correct: 2,
        hint: 'Smaller (more negative) numbers lie farther to the left on a horizontal number line.',
        ans: '(c) −19 is the smallest integer among the options and lies farthest to the left.'
      },
      {
        id: 'm_mid_mcq_9', set: 'A', ch: 2,
        q: 'How many right angles does the minute hand of a clock turn through when it moves from 12 to 9 clockwise?',
        options: ['(a) 1 right angle', '(b) 2 right angles', '(c) 3 right angles', '(d) 4 right angles'],
        correct: 2,
        hint: 'Each quarter of a clock (3 hours) equals 1 right angle (90°).',
        ans: '(c) 3 right angles (270°).'
      },
      {
        id: 'm_mid_mcq_10', set: 'B', ch: 4,
        q: 'In a pictograph, if 1 symbol ★ represents 8 students, how many symbols are needed to represent 36 students?',
        options: ['(a) 4 full symbols', '(b) 4 full and 1 half symbol', '(c) 5 full symbols', '(d) 6 full symbols'],
        correct: 1,
        hint: '4 × 8 = 32, and half of 8 is 4 (32 + 4 = 36).',
        ans: '(b) 4 full symbols and 1 half symbol (4.5 × 8 = 36).'
      },
      {
        id: 'm_pa2_mcq_11', set: 'A', ch: 6,
        q: 'If the side of a square garden is doubled from 5 m to 10 m, its area becomes how many times the original area?',
        options: ['(a) 2 times', '(b) 3 times', '(c) 4 times', '(d) 8 times'],
        correct: 2,
        hint: 'Compare 5 × 5 = 25 sq m with 10 × 10 = 100 sq m.',
        ans: '(c) 4 times (100 ÷ 25 = 4).'
      }
    ],

    // =========================================================================
    // SECTION A PART 2: Q9–Q10 Assertion–Reason (2 picked per paper)
    // =========================================================================
    sectionAAssertionPool: [
      {
        id: 'ma_ar_9', set: 'A', ch: 5,
        assertion: '2 is the only even prime number in mathematics.',
        reason: 'Every even number greater than 2 is divisible by 1, 2, and itself, so it has at least three factors.',
        correct: 0,
        hint: 'Check the definition of prime numbers (exactly two factors: 1 and itself) and test even numbers 4, 6, 8...',
        ans: 'a) Both A and R are true and R is the correct explanation of A.'
      },
      {
        id: 'ma_ar_10', set: 'A', ch: 7,
        assertion: 'Among the fractions 5/8 and 5/11, the fraction 5/8 is greater than 5/11.',
        reason: 'When two positive fractions have the same numerator, the fraction with the smaller denominator represents larger parts of the whole.',
        correct: 0,
        hint: 'Imagine sharing 5 pizzas among 8 friends vs sharing 5 pizzas among 11 friends.',
        ans: 'a) Both A and R are true and R is the correct explanation of A.'
      },
      {
        id: 'ma_ar_pa1', set: 'A', ch: 2,
        assertion: 'A reflex angle always measures strictly greater than 180° and less than 360°.',
        reason: 'A straight angle measures 180° and a complete revolution around a point measures 360°.',
        correct: 0,
        hint: 'Reflex angles lie between a straight line (180°) and a full circle (360°).',
        ans: 'a) Both A and R are true and R is the correct explanation of A.'
      },
      {
        id: 'mb_ar_9', set: 'B', ch: 6,
        assertion: 'If the side of a square is doubled, its area becomes four times the original area.',
        reason: 'Area of a square = side × side, so (2s) × (2s) = 4s².',
        correct: 0,
        hint: 'Test with side = 3 cm (Area = 9) and doubled side = 6 cm (Area = 36).',
        ans: 'a) Both A and R are true and R is the correct explanation of A.'
      },
      {
        id: 'mb_ar_10', set: 'B', ch: 10,
        assertion: 'The additive inverse of (−42) is (−42).',
        reason: 'The sum of an integer and its additive inverse is always zero (0).',
        correct: 3,
        hint: 'What number added to (−42) gives 0? It is (+42), not (−42)!',
        ans: 'd) Assertion (A) is false (additive inverse of −42 is +42), but Reason (R) is true.'
      }
    ],

    // =========================================================================
    // SECTION A PART 3: Q11–Q16 Fill in the Blanks (6 picked per paper, 1M each)
    // =========================================================================
    sectionAFillPool: [
      {
        id: 'ma_fill_11', set: 'A', ch: 3,
        q: 'The 4-digit Kaprekar constant (magic number) reached by repeatedly subtracting the smallest 4-digit arrangement from the largest is __________.',
        keywords: ['6174'],
        hint: 'Try scrambling 7641 − 1467! What famous 4-digit number does it give?',
        ans: '6174'
      },
      {
        id: 'ma_fill_12', set: 'A', ch: 3,
        diagramType: 'supercells_row',
        q: 'In the number grid [ 240 | 315 | 198 | 412 | 390 | 501 | 480 ], the supercell numbers (numbers strictly greater than their immediate left and right neighbours) are __________.',
        keywords: ['315', '412', '501'],
        hint: 'Check each cell against its immediate left and right neighbours: is 315 > 240 and 198? Is 412 > 198 and 390? Is 501 > 390 and 480?',
        ans: '315, 412, and 501 (3 × 1/3 = 1 mark)'
      },
      {
        id: 'ma_fill_13', set: 'A', ch: 1,
        q: 'The 6th triangular number in the sequence 1, 3, 6, 10, 15, ___ is __________.',
        keywords: ['21'],
        hint: 'Add 6 to the 5th triangular number (15 + 6), or use n(n+1)/2 for n = 6.',
        ans: '21 (Since 1 + 2 + 3 + 4 + 5 + 6 = 21)'
      },
      {
        id: 'ma_fill_14', set: 'A', ch: 5,
        q: 'A pair of prime numbers that differ by 2 (such as 11 and 13, or 17 and 19) are called __________ primes.',
        keywords: ['twin'],
        hint: 'Primes with a difference of 2 have a special two-word name starting with "twin".',
        ans: 'Twin primes'
      },
      {
        id: 'ma_fill_15', set: 'A', ch: 9,
        q: 'A regular rectangle (that is not a square) has ______ lines of symmetry and rotational symmetry of order ______.',
        keywords: ['2'],
        hint: 'Fold a rectangular sheet of paper: only the horizontal and vertical midlines match (not the diagonals!).',
        ans: '2 lines of symmetry, and rotational symmetry of order 2'
      },
      {
        id: 'ma_fill_16', set: 'A', ch: 10,
        q: 'The integer that is neither positive nor negative is __________.',
        keywords: ['0', 'zero'],
        hint: 'It sits at the exact reference boundary between positive and negative integers.',
        ans: '0 (Zero)'
      },

      // --- SET B (6 Fill in the blanks) ---
      {
        id: 'mb_fill_11', set: 'B', ch: 2,
        q: 'An angle whose measure is greater than 180° but less than 360° is called a __________ angle.',
        keywords: ['reflex'],
        hint: 'Acute (<90°), Right (90°), Obtuse (90°–180°), Straight (180°), and between 180° and 360° is...',
        ans: 'Reflex angle'
      },
      {
        id: 'mb_fill_12', set: 'B', ch: 5,
        q: 'Two numbers that have only 1 as their common factor (such as 8 and 15) are called __________ numbers.',
        keywords: ['co-prime', 'coprime'],
        hint: 'Even though 8 and 15 are composite individually, their HCF is 1.',
        ans: 'Co-prime numbers'
      },
      {
        id: 'mb_fill_13', set: 'B', ch: 6,
        q: 'The area of a right-angled triangle with base 12 cm and height 8 cm is __________ sq cm.',
        keywords: ['48'],
        hint: 'Area of triangle = ½ × base × height = ½ × 12 × 8.',
        ans: '48 sq cm'
      },
      {
        id: 'mb_fill_14', set: 'B', ch: 7,
        q: 'The sum of 3/11 + 5/11 + 6/11 expressed as a mixed fraction is __________.',
        keywords: ['1 3/11'],
        hint: 'Add the numerators: (3 + 5 + 6)/11 = 14/11. Now convert 14/11 to a mixed fraction.',
        ans: '1 3/11 (or 14/11)'
      },
      {
        id: 'mb_fill_15', set: 'B', ch: 9,
        q: 'A circle has __________ lines of symmetry.',
        keywords: ['infinite', 'infinitely many', 'countless'],
        hint: 'Every diameter passing through the centre of a circle is a line of symmetry.',
        ans: 'Infinite (Infinitely many)'
      },
      {
        id: 'mb_fill_16', set: 'B', ch: 10,
        q: 'The predecessor of (−29) on the number line is __________.',
        keywords: ['-30', '−30'],
        hint: 'Predecessor means 1 step to the left: (−29) − 1.',
        ans: '−30'
      }
    ],

    // =========================================================================
    // SECTION B POOL: Q17–Q20 (4 Very Short Questions × 2 Marks = 8 Marks; OR in Q18)
    // =========================================================================
    sectionBPool: [
      {
        id: 'mb_q17_a', set: 'A', ch: 2, marks: 2,
        q: 'Classify the following angles as Acute, Obtuse, Right, Straight, or Reflex:\n(i) 135°   (ii) 215°   (iii) 68°   (iv) 180°',
        keywords: ['obtuse', 'reflex', 'acute', 'straight'],
        hint: 'Compare each angle with 90°, 180°, and 360°.',
        ans: '(i) 135° → Obtuse angle (0.5m)\n(ii) 215° → Reflex angle (0.5m)\n(iii) 68° → Acute angle (0.5m)\n(iv) 180° → Straight angle (0.5m)'
      },
      {
        id: 'mb_q18_a', set: 'A', ch: 3, marks: 2,
        choiceA: {
          q: 'Start with the 2-digit number 48. Reverse its digits and add it to the original number repeatedly until you obtain a palindrome. Show all steps.',
          keywords: ['84', '132', '231', '363'],
          hint: 'Step 1: 48 + 84 = 132. Step 2: Reverse 132 to get 231, and add 132 + 231.',
          ans: 'Step 1: Reverse of 48 is 84 → 48 + 84 = 132 (1 mark).\nStep 2: Reverse of 132 is 231 → 132 + 231 = 363, which is a 3-digit palindrome! (1 mark).'
        },
        choiceB: {
          q: 'Verify the Collatz Conjecture starting with the number 12 until the sequence reaches 1. (Rule: if even, divide by 2; if odd, multiply by 3 and add 1).',
          keywords: ['6', '3', '10', '5', '16', '8', '4', '2', '1'],
          hint: 'Start at 12 (even → 6 → 3). Since 3 is odd, 3×3+1 = 10, then keep halving/applying the rule!',
          ans: 'Sequence starting at 12:\n12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1.\nSince it reaches 1 in 9 steps, the Collatz Conjecture holds for 12 (2 marks).'
        }
      },
      {
        id: 'mb_q19_a', set: 'A', ch: 5, marks: 2,
        q: 'Construct a factor tree for the number 144 and write its prime factorisation in exponential / product form.',
        keywords: ['2', '3', '16', '9'],
        hint: 'Split 144 = 12 × 12, then split each 12 = 4 × 3 = 2 × 2 × 3.',
        ans: '144 = 12 × 12 = (2 × 2 × 3) × (2 × 2 × 3).\nPrime factorisation of 144 = 2 × 2 × 2 × 2 × 3 × 3 (or 2⁴ × 3²) (2 marks).'
      },
      {
        id: 'mb_q20_a', set: 'A', ch: 9, marks: 2,
        q: 'Write any two English capital letters that have BOTH horizontal and vertical lines of symmetry, and any two capital letters that have NO line of symmetry.',
        keywords: ['H', 'I', 'O', 'X', 'F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'],
        hint: 'Think of letters like H, I, O, X for both symmetries, and F, G, J, L, P, R, S, Z for zero lines of symmetry.',
        ans: '• Both horizontal & vertical lines of symmetry: H, I, O, X (any two = 1 mark).\n• Zero lines of symmetry: F, G, J, L, N, P, R, S, Z (any two = 1 mark).'
      },

      // --- SET B (4 Questions × 2 Marks) ---
      {
        id: 'mb_q17_b', set: 'B', ch: 7, marks: 2,
        q: 'Arrange the fractions 2/3, 5/6, 1/2, and 7/12 in ascending order (smallest to largest) by converting them to a common denominator.',
        keywords: ['12', '1/2', '7/12', '2/3', '5/6'],
        hint: 'The LCM of denominators 3, 6, 2, 12 is 12. Convert each fraction to /12.',
        ans: 'LCM of 3, 6, 2, 12 = 12.\n2/3 = 8/12,  5/6 = 10/12,  1/2 = 6/12,  7/12 = 7/12 (1 mark).\nAscending order: 6/12 < 7/12 < 8/12 < 10/12  ⇒  1/2 < 7/12 < 2/3 < 5/6 (1 mark).'
      },
      {
        id: 'mb_q18_b', set: 'B', ch: 6, marks: 2,
        choiceA: {
          q: 'Find the cost of fencing a rectangular garden of length 35 m and breadth 25 m at the rate of ₹18 per metre.',
          keywords: ['120', '2160'],
          hint: 'First find Perimeter = 2 × (L + B) = 2 × (35 + 25), then multiply by ₹18.',
          ans: 'Perimeter of garden = 2 × (35 + 25) = 2 × 60 = 120 m (1 mark).\nTotal cost of fencing = 120 × ₹18 = ₹2,160 (1 mark).'
        },
        choiceB: {
          q: 'A floor of length 5 m and breadth 4 m is to be covered completely with square tiles of side 50 cm (0.5 m). How many tiles are required?',
          keywords: ['20', '80'],
          hint: 'Divide the Area of the floor (500 cm × 400 cm) by the Area of 1 tile (50 cm × 50 cm).',
          ans: 'Area of floor = 500 cm × 400 cm = 2,00,000 sq cm. Area of 1 tile = 50 × 50 = 2,500 sq cm (1 mark).\nNumber of tiles = 2,00,000 ÷ 2,500 = 80 tiles (1 mark).'
        }
      },
      {
        id: 'mb_q19_b', set: 'B', ch: 8, marks: 2,
        q: 'Write the steps to construct a square PQRS of side 5 cm using a ruler and a protractor/compass.',
        keywords: ['5 cm', '90', 'perpendicular', 'PQRS'],
        hint: 'Draw base PQ = 5 cm, construct 90° perpendiculars at P and Q, mark 5 cm on each to get S and R, and join SR.',
        ans: '1. Draw a line segment PQ = 5 cm using a ruler (0.5m).\n2. At points P and Q, draw perpendicular rays (90°) PX and QY (0.5m).\n3. Using a compass of radius 5 cm, mark PS = 5 cm on PX and QR = 5 cm on QY (0.5m).\n4. Join S to R to complete the square PQRS (0.5m).'
      },
      {
        id: 'mb_q20_b', set: 'B', ch: 10, marks: 2,
        q: 'Evaluate the following integer expressions:\n(a) (−34) + (−16) + (+50)\n(b) (+28) − (−12) − (+15)',
        keywords: ['0', '25'],
        hint: 'In (a), (−34) + (−16) = −50. In (b), 28 − (−12) = 28 + 12 = 40.',
        ans: '(a) (−34) + (−16) + 50 = (−50) + 50 = 0 (1 mark).\n(b) 28 − (−12) − 15 = 28 + 12 − 15 = 40 − 15 = 25 (1 mark).'
      },
      {
        id: 'mb_q20_c_mid', set: 'A', ch: 4, marks: 2,
        q: 'In a pictograph of books read in a month, 1 book icon represents 4 books.\n(a) How many books does 5.5 icons represent? (1)\n(b) How many icons are needed to represent 28 books? (1)',
        keywords: ['22', '7'],
        hint: 'Multiply 5.5 × 4 for (a), and divide 28 ÷ 4 for (b).',
        ans: '(a) 5.5 × 4 = 22 books (1 mark).\n(b) 28 ÷ 4 = 7 icons (1 mark).'
      }
    ],

    // =========================================================================
    // SECTION C POOL: Q21–Q23 (3 Short Answer Questions × 3 Marks = 9 Marks; OR in Q23)
    // =========================================================================
    sectionCPool: [
      {
        id: 'mc_q21_a', set: 'A', ch: 1, marks: 3,
        q: 'The first five terms of a geometric number pattern are: 5, 10, 20, 40, 80.\n(i) State the rule used to get each next term in this pattern. (1)\n(ii) Write the next two terms after 80. (1)\n(iii) If the first term is changed to 6 and the same rule is followed, find the 4th term. (1)',
        keywords: ['multiply by 2', 'double', '160', '320', '48'],
        hint: 'Notice 5×2=10, 10×2=20. For part (iii), write 4 terms starting with 6: 6, 12, 24, ...',
        ans: '(i) Rule: Multiply each term by 2 (double the previous term) (1 mark).\n(ii) Next two terms: 80 × 2 = 160, and 160 × 2 = 320 (1 mark).\n(iii) Starting with 6: 1st = 6, 2nd = 12, 3rd = 24, 4th term = 48 (1 mark).'
      },
      {
        id: 'mc_q22_a', set: 'A', ch: 7, marks: 3,
        q: 'Meera bought 3 1/2 kg of apples and 2 3/4 kg of oranges. She gave 1 5/8 kg of fruits to her neighbour.\n(i) Find the total weight of fruits Meera bought initially. (1.5)\n(ii) Find the weight of fruits left with her as a mixed fraction. (1.5)',
        keywords: ['25/4', '6 1/4', '37/8', '4 5/8'],
        hint: 'Convert to improper fractions: 3 1/2 = 7/2 = 14/4, and 2 3/4 = 11/4. Then subtract 1 5/8 = 13/8 using LCM 8.',
        ans: '(i) Total bought = 3 1/2 + 2 3/4 = 7/2 + 11/4 = (14 + 11)/4 = 25/4 kg = 6 1/4 kg (1.5 marks).\n(ii) Fruits left = 25/4 − 1 5/8 = 50/8 − 13/8 = 37/8 kg = 4 5/8 kg (1.5 marks).'
      },
      {
        id: 'mc_q23_a', set: 'A', ch: 5, marks: 3,
        choiceA: {
          q: 'Use prime factorisation to check whether the numbers 35 and 84 are co-prime or not. Also find their Highest Common Factor (HCF).',
          keywords: ['5', '7', 'not co-prime'],
          hint: 'Factorise 35 = 5 × 7 and 84 = 2 × 2 × 3 × 7. Do they share a prime factor?',
          ans: '• Prime factorisation of 35 = 5 × 7 (1 mark).\n• Prime factorisation of 84 = 2 × 2 × 3 × 7 (1 mark).\n• Since they share the common prime factor 7 (HCF = 7 ≠ 1), 35 and 84 are NOT co-prime (1 mark).'
        },
        choiceB: {
          q: 'Find the prime factorisation of the product 56 × 75 WITHOUT multiplying the two numbers together first. Then state how many trailing zeros this product will end with.',
          keywords: ['2', '7', '3', '5', '4200', 'two zeros', '2 zeros'],
          hint: 'Factorise 56 = 2×2×2×7 and 75 = 3×5×5. Each pair of (2 × 5) produces one trailing zero!',
          ans: '• 56 = 2 × 2 × 2 × 7 and 75 = 3 × 5 × 5 (1 mark).\n• Combined prime factorisation: 56 × 75 = 2 × 2 × 2 × 3 × 5 × 5 × 7 (1 mark).\n• Since there are two pairs of (2 × 5), the product ends with 2 trailing zeros (4,200) (1 mark).'
        }
      },

      // --- SET B (3 Questions × 3 Marks) ---
      {
        id: 'mc_q21_b', set: 'B', ch: 4, marks: 3,
        q: 'The marks (out of 10) obtained by 20 students in a Math quiz are:\n7, 9, 8, 6, 8, 10, 7, 8, 9, 6, 8, 7, 10, 8, 9, 7, 8, 6, 9, 8.\nConstruct a neat Frequency Distribution Table and answer: (i) Which mark has the highest frequency? (ii) How many students scored 8 or more?',
        keywords: ['8', '7', '13'],
        hint: 'Count how many times 6, 7, 8, 9, and 10 appear: 6(3), 7(4), 8(7), 9(4), 10(2). Total = 20.',
        ans: 'Frequency Table:\n• 6 marks → 3 students\n• 7 marks → 4 students\n• 8 marks → 7 students\n• 9 marks → 4 students\n• 10 marks → 2 students (Total = 20) (1.5 marks).\n(i) Mark 8 has the highest frequency (7 students) (0.75m).\n(ii) Students scoring 8 or more = 7 + 4 + 2 = 13 students (0.75m).'
      },
      {
        id: 'mc_q22_b', set: 'B', ch: 6, marks: 3,
        q: 'A wire of total length 60 cm is first bent to form a regular pentagon, and then straightened and re-bent to form a rectangle of length 18 cm.\n(i) Find the side length of the regular pentagon. (1)\n(ii) Find the breadth and area of the rectangle. (2)',
        keywords: ['12', '216'],
        hint: 'A pentagon has 5 equal sides (60 ÷ 5). For the rectangle, 2(18 + B) = 60 → 18 + B = 30.',
        ans: '(i) Side of regular pentagon = 60 ÷ 5 = 12 cm (1 mark).\n(ii) For rectangle: 2 × (18 + Breadth) = 60 ⇒ 18 + Breadth = 30 ⇒ Breadth = 12 cm (1 mark).\nArea of rectangle = 18 cm × 12 cm = 216 sq cm (1 mark).'
      },
      {
        id: 'mc_q23_b', set: 'B', ch: 10, marks: 3,
        choiceA: {
          q: 'In Leh (Ladakh), the temperature at 2:00 PM was +5 °C. By midnight, it dropped by 9 °C, and by 6:00 AM the next morning it dropped by another 4 °C. At noon, it rose by 6 °C. Find the temperature at midnight, 6:00 AM, and noon.',
          keywords: ['-4', '-8', '-2'],
          hint: 'Start at +5: Midnight = 5 − 9; 6:00 AM = (−4) − 4; Noon = (−8) + 6.',
          ans: '• Temperature at midnight = (+5) − 9 = −4 °C (1 mark).\n• Temperature at 6:00 AM = (−4) − 4 = −8 °C (1 mark).\n• Temperature at noon = (−8) + 6 = −2 °C (1 mark).'
        },
        choiceB: {
          q: 'Using the Integer Token Model (where each Green token = +1 and each Red token = −1, and one Green + one Red = 0 "Zero Pair"), explain how to find:\n(i) (+4) + (−7)\n(ii) (−3) − (−5)',
          keywords: ['-3', '+2', '2', 'zero pair'],
          hint: 'Four green and seven red tokens form 4 zero pairs, leaving 3 red tokens (−3).',
          ans: '(i) 4 Green (+4) and 7 Red (−7) form 4 zero pairs, leaving 3 Red tokens = −3 (1.5 marks).\n(ii) To take away 5 Red tokens from 3 Red tokens, add 2 zero pairs (2 Green + 2 Red); removing 5 Red leaves 2 Green tokens = +2 (1.5 marks).'
        }
      },
      {
        id: 'mc_q23_pa1', set: 'B', ch: 2, marks: 3,
        q: 'Classify each angle below as acute, right, obtuse, straight, or reflex, and find the complement of 38°:\n(i) 90° and 142° (1)\n(ii) 215° and 47° (1)\n(iii) Complement of 38° (1)',
        keywords: ['right', 'obtuse', 'reflex', 'acute', '52'],
        hint: 'Complement of an angle x is 90° − x.',
        ans: '(i) 90° = Right angle, 142° = Obtuse angle (1 mark).\n(ii) 215° = Reflex angle, 47° = Acute angle (1 mark).\n(iii) Complement of 38° = 90° − 38° = 52° (1 mark).'
      }
    ],

    // =========================================================================
    // SECTION D POOL: Q24–Q26 (3 Long Answer Questions × 5 Marks = 15 Marks; OR in Q26)
    // =========================================================================
    sectionDPool: [
      {
        id: 'md_q24_a', set: 'A', ch: 3, marks: 5,
        q: 'Answer the following number-sense problems:\n(i) Write the smallest 3-digit palindrome and the largest 4-digit palindrome, and find their sum. (2)\n(ii) Write one 5-digit number and two 3-digit numbers such that their sum is exactly 24,530. (1.5)\n(iii) Express 432 as a product of its prime factors. (1.5)',
        keywords: ['101', '9999', '10100', '24530', '432'],
        hint: 'Smallest 3-digit palindrome is 101; largest 4-digit palindrome is 9999. For 432, keep dividing by 2 and 3.',
        ans: '(i) Smallest 3-digit palindrome = 101; Largest 4-digit palindrome = 9,999. Sum = 101 + 9,999 = 10,100 (2 marks).\n(ii) Example: 24,000 (5-digit) + 300 (3-digit) + 230 (3-digit) = 24,530 (1.5 marks).\n(iii) 432 = 2 × 2 × 2 × 2 × 3 × 3 × 3 (or 2⁴ × 3³) (1.5 marks).'
      },
      {
        id: 'md_q25_a', set: 'A', ch: 6, marks: 5,
        diagramType: 'l_shape_area',
        q: 'An L-shaped community hall can be split into two rectangles: Rectangle A of dimensions 12 m × 4 m and Rectangle B of dimensions 8 m × 5 m.\n(i) Calculate the area of Rectangle A and Rectangle B separately, and find the total floor area of the hall. (2)\n(ii) What will be the total cost of polishing the floor at ₹45 per sq m? (1.5)\n(iii) Give an example of two different rectangles that have the same area of 36 sq m but different perimeters. (1.5)',
        keywords: ['48', '40', '88', '3960', '36'],
        hint: 'Area A = 12×4 = 48 sq m; Area B = 8×5 = 40 sq m; Total = 88 sq m. Multiply 88 by ₹45.',
        ans: '(i) Area of A = 12 × 4 = 48 sq m. Area of B = 8 × 5 = 40 sq m. Total Area = 48 + 40 = 88 sq m (2 marks).\n(ii) Cost of polishing = 88 × ₹45 = ₹3,960 (1.5 marks).\n(iii) Rectangle 1 (9 m × 4 m): Area = 36 sq m, Perimeter = 2(9+4) = 26 m.\n      Rectangle 2 (12 m × 3 m): Area = 36 sq m, Perimeter = 2(12+3) = 30 m (1.5 marks).'
      },
      {
        id: 'md_q26_a', set: 'A', ch: 5, marks: 5,
        choiceA: {
          q: 'Answer the following questions on Prime Time:\n(i) Find all the common factors of 72 and 150, and write their HCF. (2)\n(ii) Without actual division, test whether 1,368 is divisible by 8 and by 9. Show the rule clearly. (2)\n(iii) What is the smallest natural number whose prime factorisation consists of three different prime numbers? (1)',
          keywords: ['1, 2, 3, 6', '1368', '30'],
          hint: 'For (iii), multiply the three smallest different primes: 2 × 3 × 5.',
          ans: '(i) 72 = 2³ × 3²; 150 = 2 × 3 × 5². Common factors are 1, 2, 3, and 6. HCF = 6 (2 marks).\n(ii) Divisibility by 8: Last 3 digits are 368; 368 ÷ 8 = 46 (exact), so 1,368 is divisible by 8. Divisibility by 9: Sum of digits = 1+3+6+8 = 18 (divisible by 9), so divisible by 9 (2 marks).\n(iii) Smallest number with 3 distinct prime factors = 2 × 3 × 5 = 30 (1 mark).'
        },
        choiceB: {
          q: 'Answer the following:\n(i) Find the smallest number that is divisible by 12, 15, and 20 (LCM). (2)\n(ii) The prime factorisation of a mystery number has three 2s, two 5s, and one 3. Find the mystery number. (1.5)\n(iii) Write all prime numbers between 20 and 50. (1.5)',
          keywords: ['60', '600', '23', '29', '31', '37', '41', '43', '47'],
          hint: 'In (ii), compute 2 × 2 × 2 × 5 × 5 × 3 = 8 × 25 × 3.',
          ans: '(i) 12 = 2²×3, 15 = 3×5, 20 = 2²×5 ⇒ LCM = 2² × 3 × 5 = 60 (2 marks).\n(ii) Number = 2 × 2 × 2 × 5 × 5 × 3 = 8 × 25 × 3 = 600 (1.5 marks).\n(iii) Primes between 20 and 50: 23, 29, 31, 37, 41, 43, 47 (7 primes) (1.5 marks).'
        }
      },
      {
        id: 'md_q26_mid', set: 'B', ch: 4, marks: 5,
        q: 'The number of saplings planted by five houses of a school during Van Mahotsav is: Ashoka = 40, Tagore = 55, Raman = 35, Gandhi = 50, Nehru = 45.\n(i) Find the total number of saplings planted by all five houses. (1)\n(ii) Which house planted the maximum saplings and by how many more than Raman house? (2)\n(iii) If each bar in a bar graph uses a scale of 1 unit = 5 saplings, find the bar heights for Ashoka and Gandhi houses. (2)',
        keywords: ['225', 'tagore', '20', '8', '10'],
        hint: 'Add all five numbers for (i); divide 40 and 50 by 5 for bar heights in (iii).',
        ans: '(i) Total = 40 + 55 + 35 + 50 + 45 = 225 saplings (1 mark).\n(ii) Tagore planted the maximum (55), which is 55 − 35 = 20 more than Raman house (2 marks).\n(iii) At 1 unit = 5 saplings: Ashoka = 40 ÷ 5 = 8 units; Gandhi = 50 ÷ 5 = 10 units (2 marks).'
      }
    ],

    // =========================================================================
    // SECTION E POOL: Q27–Q29 (3 Case-Based Units × 4 Marks = 12 Marks)
    // Sub-parts: (i) 1M, (ii) 1M, (iii) (A) or (B) 2M
    // =========================================================================
    sectionEPool: [
      {
        id: 'me_q27_a', set: 'A', ch: 2, marks: 4,
        diagramType: 'clock_angles',
        passage: 'Case Study-I (Clock Angles): Kabir organized a fun classroom challenge during the mathematics exhibition where students had to calculate the exact angle formed between the hour hand and the minute hand of a 12-hour wall clock at different exact hours without using a protractor. (Hint: Complete circle = 360° across 12 hours).',
        q: '(i) What is the exact angle formed between the hands at 2:00 PM? [1]\n(ii) Find the exact angle formed between the hands at 5:00 PM. [1]\n(iii) (A) Classify the angles formed at 2:00 PM and 5:00 PM, and state how many degrees the minute hand turns in 20 minutes. [2]\n      OR\n      (B) Find the reflex angle corresponding to the angle formed at 5:00 PM. [2]',
        keywords: ['60', '150', 'acute', 'obtuse', '120', '210'],
        hint: '360° ÷ 12 hours = 30° per hour mark! So at 2:00 it is 2 × 30°, and at 5:00 it is 5 × 30°.',
        ans: '(i) 1 hour division = 360° ÷ 12 = 30°. At 2:00 PM, angle = 2 × 30° = 60° (1 mark).\n(ii) At 5:00 PM, angle = 5 × 30° = 150° (1 mark).\n(iii) (A) 60° is an Acute angle; 150° is an Obtuse angle. In 20 minutes (4 divisions), minute hand turns 4 × 30° = 120° (2 marks).\n      OR (B) Reflex angle at 5:00 PM = 360° − 150° = 210° (2 marks).'
      },
      {
        id: 'me_q28_a', set: 'A', ch: 3, marks: 4,
        passage: 'Case Study-II (The Kaprekar Scramble): An archaeologist finds an inscription describing Indian mathematician D.R. Kaprekar’s 4-digit scramble process. The tablet shows the 4-digit key 3087 is chosen for the scramble.',
        q: '(i) Using the digits of 3087, write the largest 4-digit number that can be formed. [1]\n(ii) Using all four digits of 3087 (including 0 in the thousands place), write the smallest arrangement. [1]\n(iii) (A) What is the stable 4-digit "Kaprekar constant" that this process always converges to? Perform the first subtraction round for 3087. [2]\n      OR\n      (B) Perform the Kaprekar scramble starting with the number 2026 for two full steps. [2]',
        keywords: ['8730', '0378', '378', '6174', '8352'],
        hint: 'Largest arrangement of 3,0,8,7 is 8730; smallest is 0378. Subtract 8730 − 0378.',
        ans: '(i) Largest 4-digit arrangement = 8730 (1 mark).\n(ii) Smallest 4-digit arrangement = 0378 (or 378) (1 mark).\n(iii) (A) Kaprekar’s constant = 6174. First round subtraction: 8730 − 0378 = 8352 (2 marks).\n      OR (B) For 2026: Step 1: 6220 − 0226 = 5994; Step 2: 9954 − 4599 = 5355 (2 marks).'
      },
      {
        id: 'me_q29_a', set: 'A', ch: 4, marks: 4,
        diagramType: 'books_bargraph',
        passage: 'Case Study-III (Reading Club Bar Graph): Observe the bar graph showing the number of books read by five Class 6 students in one month: Anu (6 books), Riya (8 books), Mohit (4 books), Sameer (10 books), and Kavya (7 books).',
        q: '(i) Find the total number of books read by all five students combined. [1]\n(ii) How many students read more than 6 books in the month? [1]\n(iii) (A) How many books did Riya and Kavya read together, and what fraction of the total books is that? [2]\n      OR\n      (B) Find the difference between the books read by Sameer and Mohit, and find the average (mean) number of books read per student. [2]',
        keywords: ['35', '3', '15', '3/7', '6', '7'],
        hint: 'Total = 6 + 8 + 4 + 10 + 7 = 35 books. Students with >6 books are Riya (8), Sameer (10), Kavya (7).',
        ans: '(i) Total books = 6 + 8 + 4 + 10 + 7 = 35 books (1 mark).\n(ii) 3 students (Riya = 8, Sameer = 10, Kavya = 7) read more than 6 books (1 mark).\n(iii) (A) Riya + Kavya = 8 + 7 = 15 books. Fraction = 15/35 = 3/7 (2 marks).\n      OR (B) Sameer − Mohit = 10 − 4 = 6 books. Average = 35 ÷ 5 = 7 books per student (2 marks).'
      },
      {
        id: 'me_q30_pa2', set: 'B', ch: 6, marks: 4,
        diagramType: 'l_shape_area',
        passage: 'Case Study (School Courtyard Paving): A school decides to tile an L-shaped courtyard formed by joining Rectangle A (12 m × 4 m) and Rectangle B (8 m × 5 m). Each square tile has side 1 m and costs ₹45.',
        q: '(i) Find the area of Rectangle A. [1]\n(ii) Find the area of Rectangle B. [1]\n(iii) (A) Find the total area of the L-shaped courtyard and the total cost of tiling it at ₹45 per sq m. [2]\n      OR\n      (B) If the courtyard is fenced along its outer boundary of perimeter 42 m at ₹60 per metre, find the fencing cost. [2]',
        keywords: ['48', '40', '88', '3960', '2520'],
        hint: 'Area of Rectangle = Length × Breadth. Total Area = 48 + 40 = 88 sq m.',
        ans: '(i) Area A = 12 × 4 = 48 sq m (1 mark).\n(ii) Area B = 8 × 5 = 40 sq m (1 mark).\n(iii) (A) Total area = 88 sq m; Cost = 88 × ₹45 = ₹3,960 (2 marks).\n      OR (B) Fencing cost = 42 × ₹60 = ₹2,520 (2 marks).'
      }
    ]
  };

  registerExamBlueprint('6', 'MATH', MATH_ANNUAL_BLUEPRINT);
})();
