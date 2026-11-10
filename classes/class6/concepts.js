/**
 * Class VI — key concepts, chapter by chapter.
 *
 * Shape:  concepts[SUBJECT_ID][chapterNumber] = [ concept, ... ]
 * concept = {
 *   id:       unique within the class (e.g. 'm1-sequences')
 *   section:  textbook section number, so the student can find it in the PDF
 *   title:    name of the idea
 *   idea:     the big idea in one sentence
 *   explain:  2–3 sentences in simple words
 *   example:  a worked example
 *   check:    [{ q, options, correct (index), why }]  — getting all right marks the concept mastered
 * }
 * Written from the NCERT Ganita Prakash (2026–27 reprint) chapters in ALL_CHAPTERS/.
 * Add other subjects the same way, e.g. SCIENCE: { 1: [...] }.
 */
(function () {
  const concepts = {
    MATH: {
      1: [
        {
          id: 'm1-sequences', section: '1.2', title: 'Number sequences',
          idea: 'A sequence is a list of numbers that follows a rule.',
          explain: 'Counting numbers, odd numbers, even numbers, square numbers (1, 4, 9, 16…), cube numbers (1, 8, 27, 64…) and triangular numbers (1, 3, 6, 10…) are famous sequences. Once you find the rule, you can predict the next term.',
          example: 'Virahānka numbers: 1, 2, 3, 5, 8, 13, … — each term is the sum of the two before it, so the next is 8 + 13 = 21.',
          check: [
            { q: 'What comes next: 1, 3, 6, 10, 15, …?', options: ['18', '20', '21', '25'], correct: 2, why: 'Triangular numbers grow by 2, 3, 4, 5, … so next we add 6: 15 + 6 = 21.' },
            { q: 'What comes next: 1, 2, 4, 8, 16, …?', options: ['24', '32', '20', '30'], correct: 1, why: 'Each term doubles (powers of 2): 16 × 2 = 32.' }
          ]
        },
        {
          id: 'm1-visualise', section: '1.3', title: 'Seeing sequences as pictures',
          idea: 'Drawing a sequence with dots or shapes shows why it has its name.',
          explain: 'Square numbers make dot squares (1, 2×2, 3×3…). Triangular numbers make dot triangles. Cube numbers make stacks of small cubes. The picture explains the pattern.',
          example: '16 dots can be arranged as a 4 × 4 square, so 16 is a square number.',
          check: [
            { q: 'Which number can be drawn as a perfect dot square?', options: ['12', '18', '25', '30'], correct: 2, why: '25 = 5 × 5, so it makes a 5-by-5 dot square.' }
          ]
        },
        {
          id: 'm1-relations', section: '1.4', title: 'Links between sequences',
          idea: 'Different sequences are connected — adding one kind can give another.',
          explain: 'Adding consecutive odd numbers starting from 1 always gives a square number. Adding two consecutive triangular numbers also gives a square number. Pictures help prove why.',
          example: '1 + 3 + 5 + 7 = 16 = 4 × 4. Four odd numbers give the 4th square number.',
          check: [
            { q: '1 + 3 + 5 + 7 + 9 + 11 = ?', options: ['30', '36', '42', '49'], correct: 1, why: 'Six odd numbers from 1 add up to 6 × 6 = 36.' },
            { q: 'Adding the triangular numbers 6 and 10 gives…', options: ['a cube number', 'a square number (16)', 'an odd number', 'a triangular number'], correct: 1, why: '6 + 10 = 16 = 4 × 4, a square number.' }
          ]
        },
        {
          id: 'm1-shapes', section: '1.5–1.6', title: 'Patterns in shapes',
          idea: 'Shape sequences hide number sequences inside them.',
          explain: 'Regular polygons have 3, 4, 5, 6… sides (counting numbers). In complete graphs, where every pair of dots is joined, the number of lines is 0, 1, 3, 6, 10… (triangular numbers). In the Koch snowflake each step multiplies the number of sides by 4.',
          example: '5 dots, each joined to every other dot, need 10 lines — the 4th triangular number.',
          check: [
            { q: 'Koch snowflake: 3 sides, then 12, then 48. What comes next?', options: ['96', '144', '192', '60'], correct: 2, why: 'Each step multiplies the sides by 4: 48 × 4 = 192.' }
          ]
        }
      ],
      2: [
        {
          id: 'm2-point-line', section: '2.1–2.4', title: 'Point, line segment, line and ray',
          idea: 'Geometry starts with points; joining them gives segments, lines and rays.',
          explain: 'A point shows an exact location. A line segment joins two points and has two endpoints — it is the shortest path between them. A line goes on forever in both directions. A ray starts at one point and goes on forever in one direction.',
          example: 'A torch beam is like a ray: it starts at the torch and keeps going.',
          check: [
            { q: 'Which has exactly one endpoint?', options: ['Line', 'Line segment', 'Ray', 'Point'], correct: 2, why: 'A ray starts at one endpoint and extends without end in one direction.' }
          ]
        },
        {
          id: 'm2-angle', section: '2.5–2.7', title: 'What an angle is',
          idea: 'An angle is formed by two rays from one point, and measures the amount of turn.',
          explain: 'The common starting point is the vertex and the two rays are the arms. The size of an angle is how much one arm turns to reach the other — not how long the arms are drawn.',
          example: 'Opening a door from closed to half-open makes a bigger angle than opening it a little.',
          check: [
            { q: 'If you draw the arms of an angle longer, the angle…', options: ['gets bigger', 'gets smaller', 'stays the same', 'becomes 90°'], correct: 2, why: 'The angle measures turn between the arms, not their length.' }
          ]
        },
        {
          id: 'm2-measure', section: '2.8–2.10', title: 'Measuring angles in degrees',
          idea: 'A full turn is 360°; we measure angles with a protractor.',
          explain: 'A half turn (straight angle) is 180° and a quarter turn (right angle) is 90°. Place the protractor centre on the vertex, line up one arm with 0°, and read where the other arm crosses the scale.',
          example: 'The hands of a clock at 3 o\'clock make a right angle: 90°.',
          check: [
            { q: 'How many degrees in a straight angle?', options: ['90°', '180°', '270°', '360°'], correct: 1, why: 'A straight angle is half a full turn: 360° ÷ 2 = 180°.' }
          ]
        },
        {
          id: 'm2-types', section: '2.11', title: 'Types of angles',
          idea: 'Angles are named by their size compared with 90° and 180°.',
          explain: 'Acute: less than 90°. Right: exactly 90°. Obtuse: between 90° and 180°. Straight: exactly 180°. Reflex: more than 180° but less than 360°.',
          example: '120° is obtuse; 45° is acute; 200° is reflex.',
          check: [
            { q: 'An angle of 135° is…', options: ['acute', 'right', 'obtuse', 'reflex'], correct: 2, why: '135° is more than 90° and less than 180°, so it is obtuse.' }
          ]
        }
      ],
      3: [
        {
          id: 'm3-supercells', section: '3.1–3.2', title: 'Numbers tell us things — supercells',
          idea: 'Comparing a number with its neighbours lets us find patterns and solve puzzles.',
          explain: 'In a grid, a cell is a "supercell" if its number is larger than all its neighbouring cells (left, right, above, below). Puzzles ask you to arrange or find such cells by reasoning, not guessing.',
          example: 'In the row 200 | 577 | 626 | 345, the cell 626 is a supercell because it is bigger than 577 and 345.',
          check: [
            { q: 'In the row 4,120 | 7,800 | 3,560, which is a supercell?', options: ['4,120', '7,800', '3,560', 'none'], correct: 1, why: '7,800 is larger than both its neighbours.' }
          ]
        },
        {
          id: 'm3-digits', section: '3.4–3.6', title: 'Playing with digits: palindromes and Kaprekar',
          idea: 'Simple digit rules can create surprising patterns.',
          explain: 'A palindrome reads the same forwards and backwards (like 121). Reversing a number and adding often leads to a palindrome. Kaprekar\'s routine: take a 4-digit number (not all digits the same), subtract the smallest number from the largest you can make with its digits, and repeat — you always reach 6174.',
          example: '3524 → 5432 − 2345 = 3087 → 8730 − 0378 = 8352 → 8532 − 2358 = 6174.',
          check: [
            { q: 'Which number is a palindrome?', options: ['1231', '4554', '1020', '1201'], correct: 1, why: '4554 reads the same in both directions.' },
            { q: 'Kaprekar\'s routine on 4-digit numbers always ends at…', options: ['1089', '6174', '9999', '0'], correct: 1, why: '6174 is Kaprekar\'s constant: 7641 − 1467 = 6174 again.' }
          ]
        },
        {
          id: 'm3-collatz', section: '3.10', title: 'The Collatz conjecture',
          idea: 'Some number problems are easy to state but nobody has solved them yet.',
          explain: 'Start with any whole number. If it is even, halve it. If it is odd, multiply by 3 and add 1. Repeat. Every number anyone has tried reaches 1, but no one has proved it always happens.',
          example: '6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1.',
          check: [
            { q: 'Collatz: what comes after 7?', options: ['14', '22', '21', '3'], correct: 1, why: '7 is odd, so 3 × 7 + 1 = 22.' }
          ]
        },
        {
          id: 'm3-estimate', section: '3.8, 3.11', title: 'Mental maths and estimation',
          idea: 'Breaking numbers into friendly parts makes calculation and estimating quick.',
          explain: 'Split numbers by place value or round them to nearby friendly numbers. Estimation gives a sensible "about" answer, which helps check whether an exact answer makes sense.',
          example: '398 + 245: think 400 + 245 = 645, then subtract 2 → 643.',
          check: [
            { q: 'Best quick estimate of 49 × 21?', options: ['about 100', 'about 1,000', 'about 10,000', 'about 70'], correct: 1, why: '49 ≈ 50 and 21 ≈ 20; 50 × 20 = 1,000.' }
          ]
        },
        {
          id: 'm3-games', section: '3.12', title: 'Games and winning strategies',
          idea: 'Spotting the number pattern behind a game lets you plan a guaranteed win.',
          explain: 'In the game where players take turns adding 1 or 2 and whoever reaches 21 wins, the safe numbers to say are multiples of 3 (3, 6, 9, … 18, 21). Whatever your opponent adds, you can always reach the next multiple of 3.',
          example: 'If your friend says 10, you add 2 and say 12 — a multiple of 3.',
          check: [
            { q: 'In the reach-21 game, your friend says 14. What should you say?', options: ['15', '16', '17', '18'], correct: 0, why: 'Say 15, a multiple of 3. Then you can keep landing on 18 and 21.' }
          ]
        }
      ],
      4: [
        {
          id: 'm4-organise', section: '4.1', title: 'Collecting and organising data',
          idea: 'Raw data becomes useful once it is sorted and counted.',
          explain: 'We record observations, then organise them in a table. Tally marks (groups of five: four lines with a fifth crossing them) make counting easy. The count of each item is its frequency.',
          example: 'Favourite fruits: mango ||||  || means mango was chosen 7 times.',
          check: [
            { q: 'Tally marks |||| |||| ||| stand for…', options: ['3', '10', '13', '15'], correct: 2, why: 'Two groups of 5 plus 3 = 13.' }
          ]
        },
        {
          id: 'm4-pictograph', section: '4.2', title: 'Pictographs',
          idea: 'A pictograph shows data with pictures, using a key to say what one picture means.',
          explain: 'Always read the key first. If one picture stands for several items, half a picture stands for half that many.',
          example: 'Key: one book symbol = 10 books. 3½ symbols = 35 books.',
          check: [
            { q: 'Key: 1 symbol = 5 students. A row shows 4 symbols. How many students?', options: ['4', '9', '20', '45'], correct: 2, why: '4 × 5 = 20 students.' }
          ]
        },
        {
          id: 'm4-bargraph', section: '4.3–4.5', title: 'Reading and drawing bar graphs',
          idea: 'Bar graphs compare quantities using bars of equal width whose heights show values.',
          explain: 'Choose a sensible scale (e.g. 1 unit = 10 people), keep equal gaps between bars and label both axes. A clear, neat graph is easier to read — presentation matters too.',
          example: 'With scale 1 cm = 20 students, a bar 3 cm high means 60 students.',
          check: [
            { q: 'Scale: 1 unit = 50 km. A bar is 4 units long. It shows…', options: ['54 km', '200 km', '150 km', '450 km'], correct: 1, why: '4 × 50 = 200 km.' }
          ]
        }
      ],
      5: [
        {
          id: 'm5-common', section: '5.1', title: 'Common multiples and common factors',
          idea: 'A common multiple is in both times-tables; a common factor divides both numbers.',
          explain: 'In the Idli-Vada game, multiples of 3 say "idli", multiples of 5 say "vada", and common multiples of 3 and 5 (15, 30, 45…) say "idli-vada". Common factors of 12 and 18 are 1, 2, 3 and 6.',
          example: 'The smallest common multiple of 4 and 6 is 12.',
          check: [
            { q: 'In the Idli-Vada game (3 and 5), the first "idli-vada" is at…', options: ['8', '10', '15', '30'], correct: 2, why: '15 is the first number that is a multiple of both 3 and 5.' }
          ]
        },
        {
          id: 'm5-primes', section: '5.2', title: 'Prime and composite numbers',
          idea: 'A prime number has exactly two factors: 1 and itself.',
          explain: 'Numbers with more than two factors are composite. 1 has only one factor, so it is neither prime nor composite. The Sieve of Eratosthenes finds primes by crossing out multiples of 2, 3, 5, 7…',
          example: 'Primes below 20: 2, 3, 5, 7, 11, 13, 17, 19. 2 is the only even prime.',
          check: [
            { q: 'Which is a prime number?', options: ['21', '27', '29', '33'], correct: 2, why: '29 has only the factors 1 and 29. The others are 3×7, 3×9 and 3×11.' },
            { q: 'The number 1 is…', options: ['prime', 'composite', 'neither prime nor composite', 'both'], correct: 2, why: '1 has only one factor, so it fits neither definition.' }
          ]
        },
        {
          id: 'm5-coprime', section: '5.3', title: 'Co-prime numbers',
          idea: 'Two numbers are co-prime if their only common factor is 1.',
          explain: 'Co-prime numbers do not have to be prime themselves. 8 and 15 are both composite, but they share no factor other than 1, so they are co-prime.',
          example: '8 = 2×2×2 and 15 = 3×5 have no common prime factor → co-prime.',
          check: [
            { q: 'Which pair is co-prime?', options: ['12 and 18', '9 and 16', '10 and 15', '14 and 21'], correct: 1, why: '9 = 3×3 and 16 = 2×2×2×2 share no factor other than 1.' }
          ]
        },
        {
          id: 'm5-factorise', section: '5.4', title: 'Prime factorisation',
          idea: 'Every number greater than 1 can be written as a product of primes in exactly one way.',
          explain: 'Keep breaking the number into factors until all of them are prime (a factor tree helps). The order may change, but the primes are always the same.',
          example: '60 = 2 × 2 × 3 × 5.',
          check: [
            { q: 'Prime factorisation of 36 is…', options: ['4 × 9', '2 × 2 × 3 × 3', '6 × 6', '2 × 18'], correct: 1, why: 'Only 2 × 2 × 3 × 3 uses primes alone.' }
          ]
        },
        {
          id: 'm5-divisibility', section: '5.5', title: 'Divisibility tests',
          idea: 'You can check divisibility from the last digits without dividing.',
          explain: 'By 2: last digit even. By 5: last digit 0 or 5. By 10: last digit 0. By 4: the number formed by the last two digits is divisible by 4. By 8: the number formed by the last three digits is divisible by 8.',
          example: '7,316: last two digits 16 is divisible by 4, so 7,316 is divisible by 4.',
          check: [
            { q: 'Which number is divisible by 8?', options: ['5,124', '3,512', '2,340', '7,006'], correct: 1, why: 'Last three digits 512 = 8 × 64.' }
          ]
        }
      ],
      6: [
        {
          id: 'm6-perimeter', section: '6.1', title: 'Perimeter',
          idea: 'Perimeter is the total length of the boundary of a closed shape.',
          explain: 'Add up all the sides. For a rectangle: 2 × (length + breadth). For a square: 4 × side. For a regular shape, multiply one side by the number of sides.',
          example: 'Rectangle 8 m by 5 m: perimeter = 2 × (8 + 5) = 26 m.',
          check: [
            { q: 'Perimeter of a square with side 7 cm?', options: ['14 cm', '28 cm', '49 cm', '21 cm'], correct: 1, why: '4 × 7 = 28 cm.' }
          ]
        },
        {
          id: 'm6-area', section: '6.2', title: 'Area',
          idea: 'Area is the amount of surface a shape covers, counted in square units.',
          explain: 'Rectangle: length × breadth. Square: side × side. Area is in square units (cm², m²). Shapes with the same area can have different perimeters, and the other way round.',
          example: 'A 6 cm × 4 cm rectangle has area 24 cm² and perimeter 20 cm.',
          check: [
            { q: 'A 4 × 4 square and a 2 × 8 rectangle have…', options: ['same area, same perimeter', 'same area, different perimeters', 'different areas, same perimeter', 'nothing in common'], correct: 1, why: 'Both have area 16, but the perimeters are 16 and 20.' }
          ]
        },
        {
          id: 'm6-triangle', section: '6.3', title: 'Area of a triangle',
          idea: 'A triangle drawn across a rectangle\'s diagonal covers exactly half the rectangle.',
          explain: 'Cutting a rectangle along a diagonal gives two equal right triangles, so each has half the rectangle\'s area. This idea helps find the area of other triangles too.',
          example: 'Rectangle 10 cm × 6 cm has area 60 cm², so each triangle made by its diagonal is 30 cm².',
          check: [
            { q: 'A rectangle 8 cm × 5 cm is cut along a diagonal. Area of one triangle?', options: ['40 cm²', '20 cm²', '13 cm²', '26 cm²'], correct: 1, why: '8 × 5 = 40, and half of 40 is 20 cm².' }
          ]
        }
      ],
      7: [
        {
          id: 'm7-units', section: '7.1–7.2', title: 'Fractional units and equal shares',
          idea: 'A fraction like ¼ means one of 4 equal parts of a whole.',
          explain: 'The parts must be equal. 1/n is a fractional unit. ¾ means three ¼-units. The more equal parts the whole is cut into, the smaller each part.',
          example: 'Sharing 1 roti equally among 4 children gives each ¼ roti.',
          check: [
            { q: 'Which is larger: ⅓ or ⅕ of the same roti?', options: ['⅓', '⅕', 'they are equal', 'cannot tell'], correct: 0, why: 'Cutting into 3 parts gives bigger pieces than cutting into 5.' }
          ]
        },
        {
          id: 'm7-numberline', section: '7.3–7.5', title: 'Fractions on the number line and mixed fractions',
          idea: 'Fractions are numbers with their own place on the number line.',
          explain: 'To mark ⅗, split the gap from 0 to 1 into 5 equal parts and count 3. A fraction bigger than 1 can be written as a mixed fraction: 7/4 = 1¾ (one whole and three quarters).',
          example: '11/3 = 3⅔ because 11 = 3 × 3 + 2.',
          check: [
            { q: '9/4 as a mixed fraction is…', options: ['2¼', '1¾', '2¾', '4½'], correct: 0, why: '9 = 2 × 4 + 1, so 9/4 = 2¼.' }
          ]
        },
        {
          id: 'm7-equivalent', section: '7.6', title: 'Equivalent fractions',
          idea: 'Different-looking fractions can be the same amount.',
          explain: 'Multiplying (or dividing) the top and bottom by the same number gives an equivalent fraction. A fraction is in lowest terms when the top and bottom have no common factor except 1.',
          example: '½ = 2/4 = 3/6 = 4/8. And 12/18 in lowest terms is ⅔.',
          check: [
            { q: 'Which is equal to ⅗?', options: ['6/15', '9/15', '3/10', '5/3'], correct: 1, why: 'Multiply top and bottom by 3: ⅗ = 9/15.' }
          ]
        },
        {
          id: 'm7-compare-add', section: '7.7–7.8', title: 'Comparing, adding and subtracting fractions',
          idea: 'Make the denominators the same first, then compare, add or subtract the numerators.',
          explain: 'With the same denominator, just work with the numerators. With different denominators, change both fractions to equivalent ones with a common denominator first.',
          example: '½ + ⅓ = 3/6 + 2/6 = 5/6.',
          check: [
            { q: '¾ − ⅝ = ?', options: ['⅛', '2/8', '1/4', '⅜'], correct: 0, why: '¾ = 6/8, and 6/8 − 5/8 = ⅛.' },
            { q: 'Which is greater: ⅔ or ¾?', options: ['⅔', '¾', 'equal', 'cannot tell'], correct: 1, why: '⅔ = 8/12 and ¾ = 9/12, so ¾ is greater.' }
          ]
        }
      ],
      8: [
        {
          id: 'm8-circle', section: '8.1', title: 'Circles and the compass',
          idea: 'Every point on a circle is the same distance from its centre — the radius.',
          explain: 'A compass keeps this distance fixed: put the point on the centre and turn. Arcs (parts of circles) are used to build many designs and constructions.',
          example: 'A compass opened to 3 cm draws a circle of radius 3 cm.',
          check: [
            { q: 'All points of a circle are at the same distance from…', options: ['any point on it', 'its centre', 'its edge', 'the compass pencil'], correct: 1, why: 'That fixed distance from the centre is the radius.' }
          ]
        },
        {
          id: 'm8-rect', section: '8.2–8.3', title: 'Constructing squares and rectangles',
          idea: 'A rectangle has four right angles and equal opposite sides; a square also has all sides equal.',
          explain: 'Draw a rough sketch first to plan. Use a ruler for lengths and a protractor or set square for the 90° corners. A rectangle can be built from its two side lengths, or from one side and a diagonal.',
          example: 'For a 6 cm × 4 cm rectangle: draw 6 cm, make 90° at both ends, mark 4 cm up, join the tops.',
          check: [
            { q: 'Which is true for every rectangle?', options: ['all sides equal', 'all angles 90°', 'diagonals are perpendicular', 'only two right angles'], correct: 1, why: 'Every angle of a rectangle is a right angle.' }
          ]
        },
        {
          id: 'm8-diagonals', section: '8.4–8.5', title: 'Diagonals of rectangles and squares',
          idea: 'A rectangle\'s diagonals are equal and cut each other in half.',
          explain: 'In a square, the diagonals are also equal and bisect each other — and they cross at right angles. So the meeting point of the diagonals is the centre of the shape.',
          example: 'In a rectangle ABCD, AC = BD and they meet at their midpoints.',
          check: [
            { q: 'In which shape do the diagonals always cross at 90°?', options: ['every rectangle', 'a square', 'every triangle', 'none'], correct: 1, why: 'Square diagonals are perpendicular; in a non-square rectangle they are not.' }
          ]
        },
        {
          id: 'm8-equidistant', section: '8.6', title: 'Points equidistant from two points',
          idea: 'Points that are the same distance from A and B lie on one straight line between them.',
          explain: 'Draw arcs of the same radius from A and from B; where the arcs cross are points equally far from both. Joining such points gives the line that cuts AB in half at a right angle.',
          example: 'Arcs of 5 cm from A and B (AB = 6 cm) cross at two points; the line through them meets AB at its midpoint.',
          check: [
            { q: 'Two arcs of equal radius are drawn from A and B. Their crossing point is…', options: ['closer to A', 'closer to B', 'equally far from A and B', 'on AB'], correct: 2, why: 'It is one radius away from each, so the distances are equal.' }
          ]
        }
      ],
      9: [
        {
          id: 'm9-line', section: '9.1', title: 'Line of symmetry',
          idea: 'A line of symmetry folds a figure into two halves that match exactly.',
          explain: 'A figure can have no line of symmetry, one, or many. A square has 4, a rectangle (not a square) has 2, an equilateral triangle has 3, and a circle has infinitely many.',
          example: 'The letter A has one vertical line of symmetry.',
          check: [
            { q: 'How many lines of symmetry does a square have?', options: ['1', '2', '4', '8'], correct: 2, why: '2 through the midpoints of opposite sides + 2 along the diagonals = 4.' },
            { q: 'How many lines of symmetry does a non-square rectangle have?', options: ['0', '2', '4', '1'], correct: 1, why: 'Only the two lines through the midpoints of opposite sides; diagonals do not fold it evenly.' }
          ]
        },
        {
          id: 'm9-rotation', section: '9.2', title: 'Rotational symmetry',
          idea: 'A figure has rotational symmetry if it looks the same after turning by less than a full turn.',
          explain: 'The smallest such turn is the angle of symmetry. The number of times it looks the same during one full turn (360°) is the order of rotational symmetry.',
          example: 'A square looks the same after turning 90°, 180°, 270° and 360° — order 4, angle 90°.',
          check: [
            { q: 'Smallest angle of symmetry of an equilateral triangle?', options: ['60°', '90°', '120°', '180°'], correct: 2, why: '360° ÷ 3 = 120°.' }
          ]
        }
      ],
      10: [
        {
          id: 'm10-negative', section: '10.1', title: 'Numbers below zero',
          idea: 'Negative numbers describe amounts below zero — floors below ground, temperatures below 0°C, money owed.',
          explain: 'In Bela\'s building, the ground floor is 0, floors above are +1, +2, … and basement floors are −1, −2, …. Negative numbers sit to the left of 0 on the number line.',
          example: 'Going from floor +2 down 5 floors takes you to floor −3.',
          check: [
            { q: 'You are on floor −1 and go up 4 floors. Where are you?', options: ['−5', '+3', '+4', '−3'], correct: 1, why: '−1 + 4 = +3.' }
          ]
        },
        {
          id: 'm10-integers', section: '10.1, 10.3', title: 'Integers and ordering',
          idea: 'Integers are …, −3, −2, −1, 0, 1, 2, 3, …; numbers further right on the number line are greater.',
          explain: 'Positive integers are 1, 2, 3, …; negative integers are −1, −2, −3, …; 0 is neither. So −2 is greater than −7, because −2 is to the right of −7.',
          example: '−8 < −3 < 0 < 2 < 5.',
          check: [
            { q: 'Which is the greatest?', options: ['−10', '−2', '−5', '−20'], correct: 1, why: '−2 is closest to zero, so it is furthest right.' }
          ]
        },
        {
          id: 'm10-tokens', section: '10.2', title: 'Token model: adding and subtracting integers',
          idea: 'A positive token and a negative token cancel to make zero (a zero pair).',
          explain: 'Each number has an additive inverse that adds to make 0: the inverse of 7 is −7. Subtracting a number is the same as adding its inverse, so 5 − (−3) = 5 + 3 = 8.',
          example: '(+4) + (−6): 4 zero pairs cancel, leaving 2 negative tokens → −2.',
          check: [
            { q: '(−3) + (+7) = ?', options: ['−10', '+4', '−4', '+10'], correct: 1, why: '3 zero pairs cancel, leaving 4 positive tokens.' },
            { q: '6 − (−2) = ?', options: ['4', '8', '−8', '−4'], correct: 1, why: 'Subtracting −2 is adding +2: 6 + 2 = 8.' }
          ]
        }
      ]
    },

    SCIENCE: {
      // Chapters 1–12 are loaded from classes/class6/concepts-science.js
      13: [
        {
          id: 's13-light', section: '13.1–13.4', title: 'Rectilinear propagation of light and shadows',
          idea: 'Light travels in a straight line; when an opaque object blocks it, a dark shadow forms.',
          explain: 'Transparent materials let light pass clearly; translucent let some through; opaque block it completely. A pinhole camera forms an upside-down (inverted) image because light rays from top and bottom travel in straight lines through the tiny hole.',
          example: 'Looking through a bent rubber tube at a candle flame hides the flame because light cannot bend around the corner.',
          check: [
            { q: 'The image formed by a pinhole camera is…', options: ['erect and black-and-white', 'inverted (upside down) and coloured', 'bigger than the object always', 'a dark shadow'], correct: 1, why: 'Straight-line rays cross at the pinhole, flipping the coloured image upside down.' }
          ]
        }
      ]
    },

    SSC: {
      1: [
        {
          id: 'ssc1-grid', section: '1.1–1.3', title: 'Latitudes, longitudes and locating places',
          idea: 'Crossing lines of latitude (N/S) and longitude (E/W) form a grid to pinpoint any spot on Earth.',
          explain: 'The Equator (0° latitude) splits Earth into Northern and Southern hemispheres. The Prime Meridian (0° longitude at Greenwich) splits it into Eastern and Western hemispheres. Every 15° of longitude equals 1 hour of time difference.',
          example: 'Indian Standard Time (IST) uses 82°30\' E longitude, which is 5 hours 30 minutes ahead of GMT.',
          check: [
            { q: 'How much time difference corresponds to 15° of longitude?', options: ['15 minutes', '30 minutes', '1 hour', '4 hours'], correct: 2, why: '360° in 24 hours means 15° per hour (4 minutes per degree).' }
          ]
        }
      ],
      2: [
        {
          id: 'ssc2-oceans', section: '2.1–2.3', title: 'Continents and oceans of the world',
          idea: 'Earth\'s surface is about 71% water (5 oceans) and 29% land (7 continents).',
          explain: 'From largest to smallest continent: Asia, Africa, North America, South America, Antarctica, Europe, Australia. The five oceans (Pacific, Atlantic, Indian, Southern, Arctic) are all connected into one global ocean.',
          example: 'The Indian Ocean is the only ocean named after a country (India).',
          check: [
            { q: 'Which is the largest continent and largest ocean?', options: ['Africa & Atlantic', 'Asia & Pacific', 'Asia & Indian', 'Europe & Arctic'], correct: 1, why: 'Asia is the largest landmass and the Pacific is the largest and deepest ocean.' }
          ]
        }
      ],
      4: [
        {
          id: 'ssc4-timeline', section: '4.1–4.3', title: 'Reading historical timelines (BCE and CE)',
          idea: 'Years in BCE count backwards towards 1, and years in CE count forwards from 1.',
          explain: 'There is no "Year 0". To find how many years passed between a BCE date and a CE date, add the two numbers and subtract 1. Archaeologists, inscriptions (epigraphy), coins (numismatics) and manuscripts are key sources of history.',
          example: 'From 500 BCE to 2000 CE is 500 + 2000 − 1 = 2,499 years.',
          check: [
            { q: 'Which happened earlier in history?', options: ['300 BCE', '150 BCE', '100 CE', '500 CE'], correct: 0, why: 'In BCE, larger numbers are further back in time.' }
          ]
        }
      ],
      6: [
        {
          id: 'ssc6-harappa', section: '6.1–6.4', title: 'Harappan (Indus-Sarasvati) urban planning',
          idea: 'India\'s first cities had planned streets, covered brick drains, water reservoirs and wide trade networks.',
          explain: 'Cities like Harappa, Mohenjo-daro, Dholavira, Lothal and Rakhigarhi featured an upper Citadel and lower town, standardized baked bricks, household bathrooms connected to street drains, and dockyards for maritime trade with Mesopotamia.',
          example: 'Dholavira in Gujarat had giant rock-cut water reservoirs to harvest rainwater.',
          check: [
            { q: 'Which Harappan site in Gujarat is famous for its tidal dockyard?', options: ['Kalibangan', 'Lothal', 'Banawali', 'Ropar'], correct: 1, why: 'Lothal had a huge brick basin used as a dockyard for trade ships.' }
          ]
        }
      ],
      10: [
        {
          id: 'ssc10-democracy', section: '10.1–10.3', title: 'Three organs of government and grassroots democracy',
          idea: 'Rules keep society fair; power is shared between the Legislature, Executive and Judiciary across three tiers.',
          explain: 'The Legislature makes laws, the Executive implements them, and the Judiciary settles disputes and protects laws. India has Union (central), State and Local (Panchayati Raj / Municipal) levels of government.',
          example: 'In a village Gram Sabha, adult residents directly discuss and decide local priorities.',
          check: [
            { q: 'Which organ of government is responsible for making laws?', options: ['Judiciary', 'Executive', 'Legislature', 'Police'], correct: 2, why: 'The Legislature (Parliament / State Assembly) debates and passes laws.' }
          ]
        }
      ]
    },

    ENGLISH: {
      1: [
        {
          id: 'e1-dew', section: 'Unit 1', title: 'A Bottle of Dew — Hard work over magic',
          idea: 'True wealth comes from patient effort and perseverance, not magical shortcuts.',
          explain: 'Rama Natha searches for a magic potion to turn things into gold. The sage Mahipati makes him plant and tend banana trees for six years to collect dew. Meanwhile, his wife Madhumati sells the bananas — showing that his own honest labour created the gold coins.',
          example: 'Theme: Wisdom lies in realizing that diligence is the real "magic potion".',
          check: [
            { q: 'How did Rama Natha actually earn the stack of gold coins?', options: ['The sage\'s spell turned copper to gold', 'By six years of hard work growing bananas that Madhumati sold', 'He found buried treasure', 'He bought a magic bottle'], correct: 1, why: 'The sage tricked him into working hard on his plantation for six years.' }
          ]
        }
      ],
      2: [
        {
          id: 'e2-raven', section: 'Unit 1 Poem', title: 'The Raven and the Fox — Beware of flattery',
          idea: 'Pride and belief in hollow praise make us careless and cost us what we have.',
          explain: 'Reynard the Fox praises the Raven\'s feathers and begs to hear his "sweet voice". Swelling with pride, the Raven opens his beak to sing, drops his morsel of food, and the Fox laughs and takes it.',
          example: 'Poetic device: Alliteration and rhyme highlight the sly tone of the Fox.',
          check: [
            { q: 'What lesson does the Fox teach the Raven at the end?', options: ['Always sing loudly', 'Ignore sweet words that make you glow with pride', 'Never sit on trees', 'Share food with foxes'], correct: 1, why: 'Flattery is often a trap used by the cunning.' }
          ]
        }
      ]
    },

    HINDI: {
      1: [
        {
          id: 'h1-matribhumi', section: 'पाठ 1', title: 'मातृभूमि (सोहनलाल द्विवेदी) — देशभक्ति और प्रकृति',
          idea: 'कविता में भारत की प्राकृतिक सुंदरता, नदियों, पर्वतों और महापुरुषों की भूमि के प्रति गौरव का भाव है।',
          explain: 'हिमालय भारत के मुकुट के समान है और हिंद महासागर इसके चरण पखारता है। गंगा-यमुना की त्रिवेणी, अमराइयों में कोयल की कूक और गौतम बुद्ध, राम-कृष्ण की जन्मभूमि के रूप में मातृभूमि का वंदन किया गया है।',
          example: 'भावार्थ: "वह जन्मभूमि मेरी, वह मातृभूमि मेरी" — अपनी मिट्टी के प्रति अनन्य प्रेम।',
          check: [
            { q: 'कविता में भारत के चरण कौन पखारता है?', options: ['हिमालय', 'हिंद महासागर (सिंधु)', 'झरने', 'बादल'], correct: 1, why: 'दक्षिण में स्थित सिंधु (हिंद महासागर) भारत के चरणों को धोता है।' }
          ]
        }
      ]
    },

    SANSKRIT: {
      1: [
        {
          id: 'san1-basics', section: 'पाठ 1–3', title: 'लिङ्ग, वचन और पुरुष (Sanskrit Sentence Foundations)',
          idea: 'संस्कृत में तीन लिङ्ग (पुंलिङ्ग, स्त्रीलिङ्ग, नपुंसकलिङ्ग), तीन वचन (एकवचन, द्विवचन, बहुवचन) और तीन पुरुष होते हैं।',
          explain: 'कर्ता जिस पुरुष और वचन का होता है, क्रिया भी उसी पुरुष और वचन की लगती है। जैसे — बालकः पठति (एकवचन), बालकौ पठतः (द्विवचन), बालकाः पठन्ति (बहुवचन)।',
          example: 'सः गच्छति (वह जाता है), तौ गच्छतः (वे दोनों जाते हैं), ते गच्छन्ति (वे सब जाते हैं)।',
          check: [
            { q: '"बालकाः" के साथ कौन-सी क्रिया सही है?', options: ['पठति', 'पठतः', 'पठन्ति', 'पठसि'], correct: 2, why: '"बालकाः" प्रथम पुरुष बहुवचन है, इसलिए "पठन्ति" आएगा।' }
          ]
        }
      ]
    }
  };

  registerClassData('6', { concepts });
})();
