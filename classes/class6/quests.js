/**
 * Class VI — Daily Curiosity Quests.
 *
 * One quest per day, the same for everyone (picked from this list by date), so friends can compare.
 * quest = {
 *   id, title,
 *   tags:    any of 'science' | 'math' | 'creativity'
 *   story:   the curious situation
 *   task:    what to work out or make
 *   type:    'number'  → answer (number), unit (optional)
 *            'choice'  → options[], correct (index)
 *            'open'    → checklist[] the student ticks before submitting (creative, no single answer)
 *   hints:   3 hints, from gentle to strong — they guide, they never give the answer
 *   explain: shown after solving (or after every hint and 3 tries)
 *   link:    { subject, chapter } — opens the related chapter page
 * }
 * Add more quests at the end; the daily rotation picks them up automatically.
 */
(function () {
  const quests = [
    {
      id: 'q-shadow-tree', title: 'How tall is the tree?', tags: ['math', 'science'],
      story: 'At 4 pm, a 1 m stick standing straight up casts a 2 m shadow. At the same moment, a tree nearby casts a 10 m shadow.',
      task: 'How tall is the tree, in metres?', type: 'number', answer: 5, unit: 'm',
      hints: [
        'The Sun is at the same angle for the stick and the tree, because it is the same moment.',
        'Compare: the stick\'s shadow is how many times as long as the stick itself?',
        'The tree\'s shadow is longer than the tree by that same "times". Undo it.'
      ],
      explain: 'The shadow is 2 times the height for anything at that moment (2 m shadow for a 1 m stick). The tree\'s shadow is 10 m, so the tree is 10 ÷ 2 = 5 m tall. People measured pyramids this way thousands of years ago!',
      link: { subject: 'MATH', chapter: 1 }
    },
    {
      id: 'q-handshakes', title: 'The handshake party', tags: ['math'],
      story: 'Six friends meet at a party. Every friend shakes hands with every other friend exactly once.',
      task: 'How many handshakes happen in total?', type: 'number', answer: 15,
      hints: [
        'Draw 6 dots and join every pair of dots with a line. Each line is one handshake.',
        'Start small: 2 friends → 1 handshake, 3 friends → 3, 4 friends → 6. Do you see a pattern?',
        'Those numbers (1, 3, 6, …) are the triangular numbers. Keep the pattern going to 6 friends.'
      ],
      explain: 'The first friend shakes 5 hands, the next 4 new hands, then 3, 2, 1: 5 + 4 + 3 + 2 + 1 = 15. It is a triangular number — the same as the lines in a complete graph with 6 dots.',
      link: { subject: 'MATH', chapter: 1 }
    },
    {
      id: 'q-which-magnet', title: 'Which bar is the magnet?', tags: ['science'],
      story: 'You have two iron bars that look exactly the same. One is a magnet; the other is plain iron. You have nothing else — no compass, no pins.',
      task: 'Which test tells you which bar is the magnet?', type: 'choice',
      options: [
        'Hold them side by side — the heavier one is the magnet',
        'Touch the END of bar A to the MIDDLE of bar B. If they pull strongly, A is the magnet',
        'Drop both — the magnet falls faster',
        'It is impossible to tell without another object'
      ],
      correct: 1,
      hints: [
        'A magnet does not pull equally hard everywhere along its length.',
        'Where is a bar magnet\'s pull strongest — at the ends or in the middle?',
        'Use one bar\'s END against the other bar\'s MIDDLE, then swap. Which way pulls strongly?'
      ],
      explain: 'A magnet\'s pull is strongest at its poles (the ends) and weakest in the middle. If the end of A strongly attracts the middle of B, A must be the magnet — plain iron has no strong ends to pull with.',
      link: { subject: 'SCIENCE', chapter: 4 }
    },
    {
      id: 'q-drying-race', title: 'The drying race', tags: ['science'],
      story: 'You pour the same amount of water into: (A) a glass kept in the shade, (B) a glass kept in the sun, (C) a wide plate kept in the sun with a fan blowing over it.',
      task: 'Which one dries up first?', type: 'choice',
      options: ['A — glass in the shade', 'B — glass in the sun', 'C — plate in the sun with a fan', 'All dry at the same time'],
      correct: 2,
      hints: [
        'Water "disappears" by evaporation. Think about what speeds evaporation up.',
        'Heat is one thing. What about how much water surface touches the air?',
        'Moving air carries water vapour away. Which setup has heat + big surface + moving air?'
      ],
      explain: 'Evaporation is faster with more heat, a larger exposed area and moving air. The plate gives a large surface, the sun gives heat and the fan moves the air — so C dries first.',
      link: { subject: 'SCIENCE', chapter: 8 }
    },
    {
      id: 'q-millet-snack', title: 'Invent a millet snack', tags: ['creativity', 'science'],
      story: 'Your school canteen wants a new healthy snack made with millets (ragi, jowar or bajra) — and kids must actually want to eat it!',
      task: 'Invent the snack. Give it a fun name, say what goes in it, and explain which nutrients it gives.', type: 'open',
      checklist: ['I named my snack', 'I used at least one millet', 'I named at least 2 nutrients it gives (e.g. carbohydrates, protein, minerals, fibre)'],
      hints: [
        'Millets are rich in carbohydrates, fibre and minerals. Ragi is famous for calcium.',
        'Add something for protein — dal, peanuts, curd or sprouts — to make it more balanced.',
        'Think about taste and fun: shape, colour, crunch, a catchy name.'
      ],
      explain: 'A good answer combines a millet (energy, fibre, minerals) with a protein source and keeps sugar and oil low. Millets are called nutri-cereals because they give most nutrients the body needs and grow with little water.',
      link: { subject: 'SCIENCE', chapter: 3 }
    },
    {
      id: 'q-collatz-7', title: 'The long trip of 7', tags: ['math'],
      story: 'Collatz rule: if a number is even, halve it. If it is odd, multiply by 3 and add 1. Keep going until you reach 1.',
      task: 'Starting from 7, how many steps does it take to reach 1?', type: 'number', answer: 16,
      hints: [
        'Write each number on a new line so you can count the steps (arrows) at the end.',
        'The first step: 7 is odd, so 3 × 7 + 1 = 22. Then 22 is even…',
        'You will pass through 52 and 16 on the way. Count the arrows, not the numbers.'
      ],
      explain: '7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1. That is 16 steps. Nobody has ever proved that every number reaches 1 — it is still an unsolved mystery!',
      link: { subject: 'MATH', chapter: 3 }
    },
    {
      id: 'q-hexagon-symmetry', title: 'The honeycomb mirror', tags: ['math', 'science'],
      story: 'Bees build their honeycomb out of regular hexagons — six equal sides and six equal angles.',
      task: 'How many lines of symmetry does a regular hexagon have?', type: 'number', answer: 6,
      hints: [
        'Draw a hexagon (or trace a nut or a pencil end). Try folding lines.',
        'Some lines go from one corner to the opposite corner. How many of those?',
        'Other lines go from the middle of one side to the middle of the opposite side. Add both kinds.'
      ],
      explain: 'A regular hexagon has 3 lines joining opposite corners and 3 lines joining midpoints of opposite sides: 6 lines of symmetry. A regular polygon always has as many lines of symmetry as sides.',
      link: { subject: 'MATH', chapter: 9 }
    },
    {
      id: 'q-garden-fence', title: 'The cheapest fence', tags: ['math'],
      story: 'You want a rectangular vegetable patch with an area of exactly 24 square metres. Each side must be a whole number of metres. Fencing is expensive!',
      task: 'What is the SMALLEST perimeter (in metres) your patch can have?', type: 'number', answer: 20, unit: 'm',
      hints: [
        'List all the whole-number rectangles with area 24: 1 × 24, 2 × 12, …',
        'Perimeter of a rectangle = 2 × (length + breadth). Work it out for each one.',
        'Notice what happens as the rectangle gets closer to a square.'
      ],
      explain: '1×24 → 50 m, 2×12 → 28 m, 3×8 → 22 m, 4×6 → 20 m. The most square-like rectangle needs the least fence: 20 m. Same area can have very different perimeters!',
      link: { subject: 'MATH', chapter: 6 }
    },
    {
      id: 'q-mirror-prime', title: 'The mirror prime', tags: ['math'],
      story: 'I am a two-digit prime number less than 50. My digits add up to 10. If you swap my digits, you get another prime number.',
      task: 'Who am I?', type: 'number', answer: 37,
      hints: [
        'List the two-digit numbers whose digits add up to 10: 19, 28, 37, 46.',
        'Cross out the ones that are not prime.',
        'Swap the digits of each one left and check whether the new number is prime too.'
      ],
      explain: '19, 28, 37, 46 have digit sum 10. 28 and 46 are even, so not prime. 19 is prime but 91 = 7 × 13 is not. 37 is prime and 73 is prime too — so the answer is 37.',
      link: { subject: 'MATH', chapter: 5 }
    },
    {
      id: 'q-my-constellation', title: 'Make your own constellation', tags: ['creativity', 'science'],
      story: 'Long ago people joined stars into pictures and told stories about them. Constellations helped travellers find their way at night.',
      task: 'Invent a constellation of 5–7 stars. Describe its shape, give it a name, and write a 2–3 sentence story about it.', type: 'open',
      checklist: ['My constellation has 5 to 7 stars', 'I gave it a name', 'I wrote a short story about it'],
      hints: [
        'Look at the night sky (or dots on paper) and imagine shapes — an animal, a tool, a hero.',
        'Saptarishi (the Big Dipper) points towards the Pole Star. Could your constellation help someone find a direction?',
        'A story can explain why it is in the sky: what did the character do?'
      ],
      explain: 'Constellations are groups of stars that seem to form patterns. Real stars in a constellation can be very far from each other — they only look close from Earth.',
      link: { subject: 'SCIENCE', chapter: 12 }
    },
    {
      id: 'q-salt-sand-iron', title: 'Rescue the salt', tags: ['science'],
      story: 'Oops! Salt, sand and iron filings got mixed up in one bowl. You need to get all three back separately.',
      task: 'Which order of steps works?', type: 'choice',
      options: [
        'Add water → filter → use a magnet → evaporate',
        'Use a magnet → add water and stir → filter → evaporate the water',
        'Evaporate → use a magnet → filter',
        'Use a sieve → winnow → add water'
      ],
      correct: 1,
      hints: [
        'Which of the three is attracted to a magnet? It is easiest to take that out while everything is dry.',
        'Which one dissolves in water and which one does not?',
        'After filtering, the salt is hiding in the water. How do you get a dissolved solid back?'
      ],
      explain: 'Magnet first (iron filings, while dry). Then add water: salt dissolves, sand does not. Filter to catch the sand. Finally evaporate the water to get the salt back.',
      link: { subject: 'SCIENCE', chapter: 9 }
    },
    {
      id: 'q-pizza-fraction', title: 'The leftover pizza', tags: ['math'],
      story: '¾ of a pizza is left in the box. You eat ⅓ of what is left.',
      task: 'What fraction of the WHOLE pizza is still in the box?', type: 'choice',
      options: ['¼', '½', '⅓', '⅝'],
      correct: 1,
      hints: [
        'Careful: you ate ⅓ of the LEFTOVER, not ⅓ of the whole pizza.',
        'Imagine the pizza cut into 4 equal slices. How many slices are left? What is ⅓ of those?',
        'Three slices are left; you eat one of them. How many of the 4 slices remain?'
      ],
      explain: '¾ is 3 slices out of 4. ⅓ of 3 slices is 1 slice, so 2 slices remain: 2/4 = ½ of the whole pizza.',
      link: { subject: 'MATH', chapter: 7 }
    },
    {
      id: 'q-lift-floors', title: 'Bela\'s lift ride', tags: ['math'],
      story: 'Bela gets into the lift at floor −2 (a basement parking level). She goes up 7 floors, then down 3 floors.',
      task: 'Which floor is she on now?', type: 'number', answer: 2,
      hints: [
        'Draw a number line or a building with floors … −3, −2, −1, 0, 1, 2, 3 …',
        'Going up 7 from −2: count up one floor at a time — you will pass 0 (the ground floor).',
        'After going up you are on floor 5. Now go down 3.'
      ],
      explain: '−2 + 7 = 5, then 5 − 3 = 2. Bela is on floor 2.',
      link: { subject: 'MATH', chapter: 10 }
    },
    {
      id: 'q-thermometer', title: 'The wrong thermometer', tags: ['science'],
      story: 'Riya wants to measure the temperature of boiling water, so she grabs the clinical thermometer from the medicine box.',
      task: 'Why is that a bad idea?', type: 'choice',
      options: [
        'Clinical thermometers only work in the mouth',
        'Its scale only goes up to about 42 °C, far below boiling water',
        'It measures in Fahrenheit only',
        'Boiling water has no temperature'
      ],
      correct: 1,
      hints: [
        'A clinical thermometer is made for one job: measuring body temperature.',
        'Normal body temperature is about 37 °C. What range does such a thermometer need?',
        'Water boils at about 100 °C. Compare that with the highest number on a clinical thermometer.'
      ],
      explain: 'A clinical thermometer reads only about 35 °C to 42 °C — around body temperature. Boiling water (about 100 °C) is far beyond that, so it could break. Use a laboratory thermometer (about −10 °C to 110 °C).',
      link: { subject: 'SCIENCE', chapter: 7 }
    },
    {
      id: 'q-seed-light', title: 'Do seeds need light?', tags: ['creativity', 'science'],
      story: 'Your friend says seeds need sunlight to sprout. You are not sure. Time to be a scientist!',
      task: 'Plan a fair experiment to find out. What will you do, what will you keep the same, and what will you look for?', type: 'open',
      checklist: ['I used two groups of seeds', 'Only ONE thing is different between the groups (light)', 'I said what I will observe and for how many days'],
      hints: [
        'A fair test changes only one thing. Here, that one thing is light.',
        'Keep everything else the same: same seeds, same water, same amount of air, same temperature.',
        'Put one group in a dark box or cupboard. Check both every day and write down what you see.'
      ],
      explain: 'Seeds need water and air to germinate; many seeds do not need light to sprout at first. A fair test keeps water, seeds and temperature the same and changes only light — that is exactly how scientists find answers.',
      link: { subject: 'SCIENCE', chapter: 10 }
    },
    {
      id: 'q-pictograph-mango', title: 'Read the pictograph', tags: ['math'],
      story: 'In a pictograph about favourite fruits, the key says: one 🥭 picture = 4 students. The mango row has 3 whole pictures and half a picture.',
      task: 'How many students chose mango?', type: 'number', answer: 14,
      hints: [
        'Read the key first — every picture stands for more than one student.',
        'Three whole pictures stand for 3 × 4 students.',
        'Half a picture stands for half of 4 students.'
      ],
      explain: '3 × 4 = 12, and half a picture = 2 students. 12 + 2 = 14 students chose mango.',
      link: { subject: 'MATH', chapter: 4 }
    },
    {
      id: 'q-clock-angle', title: 'The 4 o\'clock angle', tags: ['math'],
      story: 'It is exactly 4:00. The minute hand points at 12 and the hour hand points at 4.',
      task: 'What is the smaller angle between the two hands, in degrees?', type: 'number', answer: 120, unit: '°',
      hints: [
        'A full turn of the clock face is 360°.',
        'There are 12 numbers on the clock. How many degrees from one number to the next?',
        'From 12 to 4 is 4 of those gaps.'
      ],
      explain: '360° ÷ 12 = 30° between neighbouring numbers. From 12 to 4 is 4 gaps: 4 × 30° = 120° — an obtuse angle.',
      link: { subject: 'MATH', chapter: 2 }
    },
    {
      id: 'q-bicycle-motion', title: 'Two motions at once', tags: ['science'],
      story: 'Arjun rides his bicycle along a straight road.',
      task: 'Which describes the motion of a point on the bicycle\'s wheel?', type: 'choice',
      options: ['Only linear motion', 'Only circular motion', 'Circular motion around the axle while the whole bicycle moves in a straight line', 'Oscillatory motion'],
      correct: 2,
      hints: [
        'Think about the wheel by itself: how does it move around its centre?',
        'Now think about the whole bicycle: where is it going along the road?',
        'Can one object do two kinds of motion at the same time?'
      ],
      explain: 'The wheel spins around its axle (circular motion) while the whole bicycle moves forward along the road (linear motion). Many objects combine more than one type of motion.',
      link: { subject: 'SCIENCE', chapter: 5 }
    },
    {
      id: 'q-air-is-matter', title: 'Is air really "something"?', tags: ['science'],
      story: 'Your little cousin says, "Air is nothing — you can\'t even see it!"',
      task: 'Which observation best shows that air is matter?', type: 'choice',
      options: [
        'Air is invisible',
        'A balloon gets bigger when you blow air into it — air takes up space',
        'Air is cold in winter',
        'Birds fly in air'
      ],
      correct: 1,
      hints: [
        'Matter is anything that has mass and takes up space.',
        'Which choice shows air taking up space?',
        'Something must fill the balloon to make it grow.'
      ],
      explain: 'Matter has mass and takes up space (volume). A balloon grows because air fills the space inside it. A blown-up balloon even weighs a tiny bit more than an empty one — air has mass too.',
      link: { subject: 'SCIENCE', chapter: 6 }
    },
    {
      id: 'q-water-cycle-poem', title: 'Water cycle poem', tags: ['creativity', 'science'],
      story: 'Poets have written about rain for thousands of years. Now it is your turn — with real science inside.',
      task: 'Write a 4-line poem about the water cycle that uses the words evaporation, condensation and rain (or precipitation).', type: 'open',
      checklist: ['My poem has 4 lines', 'I used "evaporation" and "condensation"', 'I used "rain" or "precipitation"', 'The order of events is scientifically correct'],
      hints: [
        'First decide the order: water warms and rises → cools into clouds → falls back.',
        'Each line can describe one stage. The last line can bring the water back to the start.',
        'Rhyming pairs: sky/high, sea/free, cloud/proud, ground/round.'
      ],
      explain: 'The water cycle: the Sun heats water so it evaporates into vapour; high up the vapour cools and condenses into tiny droplets that form clouds; droplets join and fall as rain, hail or snow; the water flows back to rivers and seas.',
      link: { subject: 'SCIENCE', chapter: 8 }
    },
    {
      id: 'q-odd-sum', title: 'The square secret', tags: ['math'],
      story: '1 = 1, 1 + 3 = 4, 1 + 3 + 5 = 9, 1 + 3 + 5 + 7 = 16 …',
      task: 'What is the sum of the first 10 odd numbers (1 + 3 + 5 + … + 19)?', type: 'number', answer: 100,
      hints: [
        'Look at the answers so far: 1, 4, 9, 16. What kind of numbers are these?',
        'Adding 2 odd numbers gives 2 × 2. Adding 3 gives 3 × 3. Adding 4 gives …?',
        'So adding 10 odd numbers gives …?'
      ],
      explain: 'The sum of the first n odd numbers is n × n. For 10 odd numbers: 10 × 10 = 100. You can see why by building squares out of L-shaped dot layers.',
      link: { subject: 'MATH', chapter: 1 }
    },
    {
      id: 'q-missing-digit', title: 'The missing digit', tags: ['math'],
      story: 'A secret locker code is the three-digit number 5 2 _ . The number is divisible by both 4 and 5.',
      task: 'What is the missing digit?', type: 'number', answer: 0,
      hints: [
        'Divisible by 5 means the last digit can only be one of two digits.',
        'Divisible by 4 depends only on the number made by the last two digits.',
        'Test 2_ with each of the two possible digits: is it divisible by 4?'
      ],
      explain: 'Divisible by 5 → last digit is 0 or 5. Divisible by 4 → the last two digits must make a multiple of 4: 20 works (20 = 4 × 5), 25 does not. So the code is 520.',
      link: { subject: 'MATH', chapter: 5 }
    },
    {
      id: 'q-run-out-first', title: 'Which will run out?', tags: ['science'],
      story: 'A town uses sunlight, wind, coal and river water for its energy and daily needs.',
      task: 'If everyone keeps using them heavily, which one could run out for good?', type: 'choice',
      options: ['Sunlight', 'Wind', 'Coal', 'River water (in a rainy region)'],
      correct: 2,
      hints: [
        'Some resources are replaced by nature quickly; others are not.',
        'Think about how each one is formed. Which takes a very, very long time?',
        'Coal formed from plants buried millions of years ago.'
      ],
      explain: 'Coal is a non-renewable resource — it takes millions of years to form, so once used it is gone. Sunlight and wind are renewable, and river water is renewed by the water cycle (if we do not pollute or waste it).',
      link: { subject: 'SCIENCE', chapter: 11 }
    },
    {
      id: 'q-rangoli', title: 'Design a symmetric rangoli', tags: ['creativity', 'math'],
      story: 'For a festival you want to draw a rangoli on a 6 × 6 grid of dots.',
      task: 'Design a rangoli with EXACTLY 2 lines of symmetry (not 1, not 4). Describe or sketch it, and say where the 2 lines are.', type: 'open',
      checklist: ['I designed my rangoli on a grid', 'It has exactly 2 lines of symmetry', 'I said where the lines are (e.g. one up-down, one across)'],
      hints: [
        'A rectangle that is not a square has exactly 2 lines of symmetry. Start from that shape.',
        'Whatever you draw on the left must be mirrored on the right, and top must mirror bottom.',
        'Avoid making it the same when turned by a quarter turn — then it might get 4 lines.'
      ],
      explain: 'A design has exactly 2 lines of symmetry if it mirrors left↔right and top↔bottom but is longer one way than the other (like a rectangle or an eye shape). A square design would usually have 4.',
      link: { subject: 'MATH', chapter: 9 }
    },
    {
      id: 'q-candle-alive', title: 'Is a flame alive?', tags: ['science'],
      story: 'A candle flame "eats" wax, "breathes" air, grows bigger and even moves. Your friend says it must be alive.',
      task: 'Which is the best reason a flame is NOT a living thing?', type: 'choice',
      options: [
        'It is too hot to be alive',
        'It cannot reproduce or grow from within like living things, and it does not respond like them',
        'It is orange',
        'It does not make sound'
      ],
      correct: 1,
      hints: [
        'Living things share a set of features: they move, eat, grow, breathe, excrete, respond, reproduce and die.',
        'A thing that has only some of those features is not necessarily living.',
        'Does a flame make baby flames by itself? Does it respond to its surroundings like an animal or plant?'
      ],
      explain: 'A flame uses up fuel and air, but it does not reproduce, grow from within, or respond to stimuli the way living things do. Missing even one essential feature means it is not living.',
      link: { subject: 'SCIENCE', chapter: 10 }
    },
    {
      id: 'q-heartbeats', title: 'Heartbeats in a day', tags: ['math', 'science'],
      story: 'Your heart beats about 72 times every minute — even while you sleep.',
      task: 'Roughly how many times does it beat in one whole day?', type: 'choice',
      options: ['About 1,000', 'About 10,000', 'About 1,00,000 (one lakh)', 'About 10,00,000 (ten lakh)'],
      correct: 2,
      hints: [
        'First work out beats in one hour: 72 beats × 60 minutes. Round 72 to 70 to make it easier.',
        '70 × 60 is about 4,000 beats per hour.',
        'Now multiply by the hours in a day (round 24 to 25).'
      ],
      explain: '72 × 60 × 24 = 1,03,680 — about one lakh beats every day. Estimating with friendly numbers (70 × 60 × 25 ≈ 1,05,000) gets you very close quickly.',
      link: { subject: 'MATH', chapter: 3 }
    },
    {
      id: 'q-triangle-half', title: 'Half a garden', tags: ['math'],
      story: 'A rectangular garden is 12 m long and 8 m wide. A straight path is built from one corner to the opposite corner, splitting the garden into two triangles.',
      task: 'What is the area of ONE triangle, in square metres?', type: 'number', answer: 48, unit: 'm²',
      hints: [
        'First find the area of the whole rectangle.',
        'The diagonal path cuts the rectangle into two triangles. Are they the same size?',
        'Fold a rectangular paper along its diagonal — the two halves match exactly.'
      ],
      explain: 'The rectangle has area 12 × 8 = 96 m². The diagonal cuts it into two identical triangles, so each is 96 ÷ 2 = 48 m².',
      link: { subject: 'MATH', chapter: 6 }
    },
    {
      id: 'q-leaf-roots', title: 'Guess the roots', tags: ['science'],
      story: 'You find a plant leaf with veins running side by side, in parallel lines — like a blade of grass.',
      task: 'Without digging, what kind of roots does this plant most likely have?', type: 'choice',
      options: ['A taproot', 'Fibrous roots', 'No roots', 'Roots only above the ground'],
      correct: 1,
      hints: [
        'Leaf veins come in two patterns: parallel and net-like (reticulate).',
        'Each vein pattern usually goes together with a particular kind of root.',
        'Think about grass and wheat — when you pull them out, what do their roots look like?'
      ],
      explain: 'Parallel veins usually go with fibrous roots (monocots like grass, wheat, maize). Net-like veins usually go with a taproot (dicots like mustard and bean).',
      link: { subject: 'SCIENCE', chapter: 2 }
    },
    {
      id: 'q-race-to-20', title: 'Race to 20', tags: ['math', 'creativity'],
      story: 'Two players take turns adding 1, 2 or 3 to a running total that starts at 0. Whoever says exactly 20 wins.',
      task: 'Which numbers should you try to say to make sure you win?', type: 'choice',
      options: ['Multiples of 3: 3, 6, 9 … 18', 'Multiples of 4: 4, 8, 12, 16, 20', 'Odd numbers', 'Any number above 10'],
      correct: 1,
      hints: [
        'Work backwards from 20. If you say 16, can your friend reach 20 on their turn?',
        'From 16, your friend can say 17, 18 or 19. Can you then always reach 20?',
        'What number before 16 works the same way? Keep going backwards.'
      ],
      explain: 'Whatever your friend adds (1, 2 or 3), you add the rest to make 4. So if you say 16, then 20 is yours — and the same logic gives 12, 8 and 4. Saying multiples of 4 guarantees a win. (Bonus: since 0 is a multiple of 4, the SECOND player can always win!)',
      link: { subject: 'MATH', chapter: 3 }
    },
    {
      id: 'q-new-habitat', title: 'Design an animal', tags: ['creativity', 'science'],
      story: 'Scientists discover a new place: a very cold, very windy island where food is mostly fish under the ice.',
      task: 'Invent an animal that could live there. Describe at least 3 adaptations and explain how each helps it survive.', type: 'open',
      checklist: ['I named and described my animal', 'I listed at least 3 adaptations', 'I explained how each adaptation helps'],
      hints: [
        'Think about the problems: cold, wind, and getting fish from under ice.',
        'Real cold-place animals have thick fur or fat, small ears, and white colour for hiding.',
        'How will it break the ice or swim? Think of beaks, claws, webbed feet or flippers.'
      ],
      explain: 'Adaptations are special features that help a living thing survive in its habitat — like a thick fat layer against cold, a streamlined body for swimming, or white colour for camouflage on snow.',
      link: { subject: 'SCIENCE', chapter: 2 }
    }
  ];

  registerClassData('6', { quests });
})();
