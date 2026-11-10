/**
 * Class VI Science (Curiosity) — key concepts, chapter by chapter.
 * Same shape as concepts.js. Loaded AFTER concepts.js and only fills chapters that have no concepts there. Written from the chapter summaries in ALL_CHAPTERS/CURIOSITY-SCIENCE.
 */
(function () {
  const extra = {
    1: [
      {
        id: 's1-method', section: 'Ch 1', title: 'How scientists find things out',
        idea: 'Science is a way of finding answers by observing, asking questions, guessing and testing.',
        explain: 'Scientists start with curiosity. They observe carefully, ask a question, suggest a possible explanation, then test it with an experiment. If the test does not support the guess, they change the guess and test again.',
        example: 'You notice wet clothes dry faster on sunny days → you guess heat helps drying → you test by drying two identical cloths, one in sun and one in shade.',
        check: [
          { q: 'What should a scientist do after suggesting a possible explanation?', options: ['Believe it', 'Test it with an experiment', 'Forget it', 'Ask a friend to agree'], correct: 1, why: 'A possible explanation must be tested before we accept it.' }
        ]
      },
      {
        id: 's1-everywhere', section: 'Ch 1', title: 'Science is all around us',
        idea: 'Science helps explain everyday things — food, weather, plants, machines and the sky.',
        explain: 'The subject connects to everything we see. Curiosity is the starting point: asking "why?" and "how?" about the world is the first step of doing science.',
        example: 'Why does a cut apple turn brown? Asking this is already the start of a science investigation.',
        check: [
          { q: 'The starting point of science is…', options: ['memorising', 'curiosity — asking questions', 'expensive labs', 'luck'], correct: 1, why: 'Science begins with curious questions about the world.' }
        ]
      }
    ],
    2: [
      {
        id: 's2-biodiversity', section: '2.1', title: 'Biodiversity',
        idea: 'The huge variety of plants and animals around us is called biodiversity.',
        explain: 'Different regions have different plants and animals because their conditions (temperature, water, land) are different. Damaging habitats makes plants and animals lose their homes and food, reducing biodiversity.',
        example: 'A desert, a forest and a pond near you each have very different living things.',
        check: [
          { q: 'Cutting down a forest mostly causes…', options: ['more biodiversity', 'loss of biodiversity', 'no change', 'more rainfall'], correct: 1, why: 'Plants and animals lose their homes, food and resources.' }
        ]
      },
      {
        id: 's2-plants', section: '2.2.1', title: 'Grouping plants',
        idea: 'Plants are grouped by height and stem (herbs, shrubs, trees) and by seeds (monocots, dicots).',
        explain: 'Herbs are short with soft green stems; shrubs are medium with hard woody stems branching near the base; trees are tall with thick woody trunks. Monocots have one cotyledon, parallel veins and fibrous roots. Dicots have two cotyledons, net-like (reticulate) veins and a taproot.',
        example: 'Wheat and grass are monocots; mustard and bean are dicots.',
        check: [
          { q: 'A plant with parallel veins in its leaves probably has…', options: ['a taproot', 'fibrous roots', 'no roots', 'two cotyledons'], correct: 1, why: 'Parallel venation goes with fibrous roots in monocots.' },
          { q: 'A rose plant — medium height, hard stem branching near the base — is a…', options: ['herb', 'shrub', 'tree', 'climber'], correct: 1, why: 'Shrubs are medium-sized with woody stems branching near the ground.' }
        ]
      },
      {
        id: 's2-animals', section: '2.2.2', title: 'Grouping animals',
        idea: 'Animals can be grouped by how they move and where they live.',
        explain: 'Some animals walk, some fly, some swim, some crawl or hop. Grouping means putting things together on the basis of shared features.',
        example: 'Fish and dolphins both swim; sparrows and bats both fly.',
        check: [
          { q: 'Grouping means arranging things by…', options: ['size only', 'common features', 'colour only', 'chance'], correct: 1, why: 'We group by similarities and differences.' }
        ]
      },
      {
        id: 's2-habitat', section: '2.3', title: 'Habitats and adaptations',
        idea: 'A habitat is where a living thing lives; adaptations are special features that help it survive there.',
        explain: 'Habitats can be terrestrial (on land) or aquatic (in water). Camels have long legs and can go without water for long; fish have gills and fins for life in water.',
        example: 'A cactus has spines instead of broad leaves to save water in the desert.',
        check: [
          { q: 'Fins and gills in a fish are examples of…', options: ['habitats', 'adaptations', 'biodiversity', 'germination'], correct: 1, why: 'They are special features that help fish survive in water.' }
        ]
      }
    ],
    3: [
      {
        id: 's3-nutrients', section: '3.2', title: 'Components of food (nutrients)',
        idea: 'Food contains carbohydrates, fats, proteins, vitamins and minerals, plus fibre and water.',
        explain: 'Carbohydrates and fats give energy. Proteins are body-building — they help growth and repair. Vitamins and minerals protect us from disease and keep the body healthy. Dietary fibre (roughage) helps digestion.',
        example: 'Rice and roti → carbohydrates; dal and paneer → protein; ghee → fat; fruits → vitamins.',
        check: [
          { q: 'Which nutrient is called "body-building"?', options: ['Carbohydrates', 'Fats', 'Proteins', 'Water'], correct: 2, why: 'Proteins help the body grow and repair itself.' }
        ]
      },
      {
        id: 's3-tests', section: '3.3', title: 'Testing food for nutrients',
        idea: 'Simple tests show whether a food contains starch, fat or protein.',
        explain: 'Starch: a few drops of iodine solution turn it blue-black. Fat: rubbing the food on paper leaves an oily patch. Protein: copper sulfate and caustic soda solutions turn it violet (shown by the teacher — these chemicals are harmful).',
        example: 'Iodine on a slice of potato turns blue-black → potato has starch.',
        check: [
          { q: 'Iodine turns a food blue-black. The food contains…', options: ['fat', 'protein', 'starch', 'vitamin C'], correct: 2, why: 'Blue-black with iodine is the test for starch.' }
        ]
      },
      {
        id: 's3-balanced', section: '3.4', title: 'Balanced diet and deficiency',
        idea: 'A balanced diet gives all nutrients in the right amounts, with roughage and water.',
        explain: 'Missing a nutrient for a long time can cause deficiency diseases. Junk food has lots of sugar and fat but little protein, vitamins, minerals and fibre, so it is unhealthy.',
        example: 'A plate of roti, dal, vegetables, curd and a fruit is close to balanced.',
        check: [
          { q: 'Junk food is unhealthy mainly because it has…', options: ['too much fibre', 'high sugar and fat but few other nutrients', 'too much protein', 'too many vitamins'], correct: 1, why: 'It lacks proteins, minerals, vitamins and fibre.' }
        ]
      },
      {
        id: 's3-millets', section: '3.5', title: 'Millets: nutri-cereals',
        idea: 'Millets are nutrient-rich cereals that grow easily in many climates.',
        explain: 'Millets such as ragi, jowar and bajra give most nutrients the body needs and can be grown with less water. Eating locally grown, plant-based food is good for health and the planet.',
        example: 'Ragi (finger millet) is rich in calcium.',
        check: [
          { q: 'Why are millets called nutri-cereals?', options: ['They are expensive', 'They provide most of the nutrients we need', 'They contain no carbohydrates', 'They grow only in cold places'], correct: 1, why: 'They are rich in many nutrients and grow in different climates.' }
        ]
      }
    ],
    4: [
      {
        id: 's4-materials', section: '4.1', title: 'Magnetic and non-magnetic materials',
        idea: 'Magnetic materials are attracted by a magnet; non-magnetic materials are not.',
        explain: 'Iron, nickel and cobalt are attracted by magnets. Wood, plastic, glass, paper and rubber are not.',
        example: 'A magnet picks up iron pins from a pile of plastic beads.',
        check: [
          { q: 'Which is attracted by a magnet?', options: ['Plastic scale', 'Iron nail', 'Wooden pencil', 'Glass marble'], correct: 1, why: 'Iron is a magnetic material.' }
        ]
      },
      {
        id: 's4-poles', section: '4.2, 4.5', title: 'Poles of a magnet',
        idea: 'Every magnet has a North and a South pole; like poles repel and unlike poles attract.',
        explain: 'Poles always come in pairs — breaking a magnet just makes two smaller magnets, each with N and S. North–North or South–South push apart; North–South pull together. Attraction is strongest at the poles.',
        example: 'Bringing the N ends of two bar magnets together makes them push away.',
        check: [
          { q: 'You break a bar magnet in half. Each piece has…', options: ['only N pole', 'only S pole', 'both N and S poles', 'no poles'], correct: 2, why: 'A single pole cannot exist; each piece becomes a full magnet.' },
          { q: 'North pole near North pole will…', options: ['attract', 'repel', 'do nothing', 'stick forever'], correct: 1, why: 'Like poles repel.' }
        ]
      },
      {
        id: 's4-compass', section: '4.3', title: 'Finding directions with a magnet',
        idea: 'A freely hanging magnet always comes to rest pointing north–south.',
        explain: 'A magnetic compass uses a small magnetised needle, so it shows the north–south direction. Travellers and sailors used this to find their way.',
        example: 'Hang a bar magnet by a thread; once it stops swinging, it lies north–south.',
        check: [
          { q: 'A compass needle rests along the…', options: ['east–west direction', 'north–south direction', 'any direction', 'up–down direction'], correct: 1, why: 'A freely suspended magnet aligns north–south.' }
        ]
      }
    ],
    5: [
      {
        id: 's5-units', section: '5.1–5.2', title: 'Standard units of length',
        idea: 'We need standard units so everyone gets the same measurement; the SI unit of length is the metre (m).',
        explain: 'Hand spans and footsteps differ from person to person, so they are not reliable. 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm.',
        example: '2.5 m = 250 cm.',
        check: [
          { q: '3 km = ? m', options: ['30', '300', '3,000', '30,000'], correct: 2, why: '1 km = 1000 m, so 3 km = 3000 m.' },
          { q: 'Why is a hand span not a good unit?', options: ['It is too long', 'It differs from person to person', 'It is metric', 'It is too accurate'], correct: 1, why: 'Different people get different results.' }
        ]
      },
      {
        id: 's5-measure', section: '5.3', title: 'Measuring length correctly',
        idea: 'Place the scale along the object and look straight down at the reading.',
        explain: 'Start from the zero mark (or from another full mark and subtract if the zero is broken). Keep your eye directly above the reading — looking from the side gives a wrong value.',
        example: 'If the object starts at 1.0 cm and ends at 13.5 cm, its length is 12.5 cm.',
        check: [
          { q: 'An object spans from the 2 cm mark to the 9.5 cm mark. Length?', options: ['9.5 cm', '11.5 cm', '7.5 cm', '7 cm'], correct: 2, why: '9.5 − 2 = 7.5 cm.' }
        ]
      },
      {
        id: 's5-motion', section: '5.5–5.7', title: 'Position, motion and its types',
        idea: 'An object is in motion if its position changes with time compared to a reference point.',
        explain: 'Linear motion: along a straight line. Circular motion: along a circular path. Oscillatory motion: moving to and fro about a fixed position.',
        example: 'A car on a straight road → linear; a fan blade → circular; a swing → oscillatory.',
        check: [
          { q: 'The motion of a pendulum or swing is…', options: ['linear', 'circular', 'oscillatory', 'no motion'], correct: 2, why: 'It moves to and fro about a fixed position.' }
        ]
      }
    ],
    6: [
      {
        id: 's6-classify', section: '6.1–6.2', title: 'Objects, materials and classification',
        idea: 'Objects are made from materials, and we group materials by their properties.',
        explain: 'One object may use several materials, and different materials can be used for the same job. Arranging things into groups based on similarities is called classification.',
        example: 'A chair can be made of wood, plastic or metal.',
        check: [
          { q: 'Arranging objects into groups by common properties is called…', options: ['classification', 'filtration', 'evaporation', 'germination'], correct: 0, why: 'That is the meaning of classification.' }
        ]
      },
      {
        id: 's6-properties', section: '6.3', title: 'Properties of materials',
        idea: 'Materials differ in shine, hardness, see-through-ness and solubility.',
        explain: 'Lustrous (shiny) vs non-lustrous; hard vs soft. Transparent (see clearly through), translucent (see partly), opaque (cannot see through). Soluble materials dissolve in water (sugar, salt); insoluble ones do not (sand, chalk).',
        example: 'Clear glass is transparent, butter paper is translucent, wood is opaque.',
        check: [
          { q: 'Frosted glass lets some light through but you cannot see clearly. It is…', options: ['transparent', 'translucent', 'opaque', 'lustrous'], correct: 1, why: 'Partly see-through materials are translucent.' },
          { q: 'Which is insoluble in water?', options: ['Sugar', 'Salt', 'Sand', 'Lemon juice'], correct: 2, why: 'Sand does not dissolve in water.' }
        ]
      },
      {
        id: 's6-matter', section: '6.4', title: 'What is matter?',
        idea: 'Matter is anything that has mass and occupies space.',
        explain: 'The space something occupies is its volume. Mass measures how much matter is in an object. Even air is matter — it fills a balloon and has mass.',
        example: 'A blown-up balloon takes up space, so air is matter.',
        check: [
          { q: 'Which is NOT matter?', options: ['Air', 'Water', 'A stone', 'Sunlight'], correct: 3, why: 'Light does not have mass or take up space the way matter does.' }
        ]
      }
    ],
    7: [
      {
        id: 's7-temp', section: '7.1–7.2', title: 'Temperature and its scales',
        idea: 'Temperature tells us how hot or cold something is; touch alone is unreliable.',
        explain: 'Three scales are used: Celsius (°C), Fahrenheit (°F) and Kelvin (K). The SI unit of temperature is the kelvin.',
        example: 'Put one hand in cold water and one in warm, then both in lukewarm water — each hand feels it differently.',
        check: [
          { q: 'The SI unit of temperature is…', options: ['degree Celsius', 'degree Fahrenheit', 'kelvin', 'metre'], correct: 2, why: 'Kelvin (K) is the SI unit.' }
        ]
      },
      {
        id: 's7-thermometers', section: '7.3', title: 'Clinical and laboratory thermometers',
        idea: 'A clinical thermometer measures body temperature; a laboratory thermometer measures other things.',
        explain: 'Normal body temperature of a healthy adult is about 37.0 °C (98.6 °F). A clinical thermometer has a small range around body temperature. A lab thermometer typically reads from −10 °C to 110 °C. Read with the eye level with the reading.',
        example: 'To check the temperature of boiling water, use a lab thermometer, not a clinical one.',
        check: [
          { q: 'Normal human body temperature is about…', options: ['27 °C', '37 °C', '47 °C', '100 °C'], correct: 1, why: '37.0 °C, or 98.6 °F.' },
          { q: 'Which thermometer should measure the temperature of hot tea?', options: ['Clinical', 'Laboratory', 'Either is fine', 'Neither'], correct: 1, why: 'Hot tea can be hotter than a clinical thermometer\'s range.' }
        ]
      }
    ],
    8: [
      {
        id: 's8-states', section: '8.3–8.4', title: 'States of water',
        idea: 'Water exists as solid (ice), liquid (water) and gas (water vapour), and changes state when heated or cooled.',
        explain: 'Heating ice melts it into water; heating water turns it to vapour. Cooling vapour gives water; cooling water further gives ice.',
        example: 'An ice cube left on a plate becomes water.',
        check: [
          { q: 'Water vapour is water in which state?', options: ['Solid', 'Liquid', 'Gas', 'None'], correct: 2, why: 'Vapour is the gaseous state.' }
        ]
      },
      {
        id: 's8-evap', section: '8.1, 8.6', title: 'Evaporation, condensation and cooling',
        idea: 'Evaporation turns liquid water into vapour; condensation turns vapour back into liquid.',
        explain: 'Evaporation is faster with a larger exposed area, more air movement and less humidity. Evaporation causes cooling — that is why sweat cools us and an earthen pot (matka) keeps water cool.',
        example: 'Droplets on the outside of a cold glass come from water vapour in the air condensing.',
        check: [
          { q: 'Clothes dry fastest when it is…', options: ['humid and still', 'sunny, windy and spread out', 'folded and indoors', 'cold and humid'], correct: 1, why: 'More area, air movement and low humidity speed evaporation.' },
          { q: 'Droplets on a cold glass of water form by…', options: ['evaporation', 'condensation', 'melting', 'leaking'], correct: 1, why: 'Water vapour in the air cools and becomes liquid.' }
        ]
      },
      {
        id: 's8-cycle', section: '8.7', title: 'Clouds, rain and the water cycle',
        idea: 'Water keeps circulating between the Earth\'s surface and the air — the water cycle.',
        explain: 'Water evaporates from oceans, rivers and plants. Higher up, the vapour cools and condenses into tiny droplets that form clouds. Droplets join and fall as rain, hail or snow.',
        example: 'Rainwater flows into rivers, rivers flow to the sea, and the sea water evaporates again.',
        check: [
          { q: 'Clouds are made of…', options: ['smoke', 'tiny water droplets', 'dust only', 'hot air only'], correct: 1, why: 'Condensed water vapour forms tiny droplets.' }
        ]
      }
    ],
    9: [
      {
        id: 's9-grains', section: 'Ch 9', title: 'Handpicking, threshing, winnowing, sieving',
        idea: 'Mixtures of solids are separated using differences in size, colour, shape or weight.',
        explain: 'Handpicking: pick out stones from grains by size/colour/shape. Threshing: beat stalks to free the grains. Winnowing: wind blows away lighter husk from heavier grain. Sieving: small particles pass through a sieve, big ones stay.',
        example: 'Sieving flour leaves the bran and larger bits behind.',
        check: [
          { q: 'Separating husk from grain using wind is…', options: ['threshing', 'winnowing', 'sieving', 'churning'], correct: 1, why: 'Wind carries away the lighter husk.' }
        ]
      },
      {
        id: 's9-liquids', section: 'Ch 9', title: 'Sedimentation, decantation and filtration',
        idea: 'Insoluble solids can be separated from liquids by letting them settle or by filtering.',
        explain: 'Sedimentation: heavy insoluble bits settle at the bottom. Decantation: pour off the clear liquid on top by tilting the vessel. Filtration: pass the liquid through a filter that traps the solid.',
        example: 'Muddy water left to stand → mud settles (sedimentation) → pour off the top water (decantation) → filter it.',
        check: [
          { q: 'Pouring off clear water after mud settles is called…', options: ['filtration', 'decantation', 'evaporation', 'winnowing'], correct: 1, why: 'Removing the top liquid by tilting is decantation.' }
        ]
      },
      {
        id: 's9-other', section: 'Ch 9', title: 'Evaporation, churning and magnetic separation',
        idea: 'Special methods separate dissolved solids, butter from curd and iron from other materials.',
        explain: 'Evaporation leaves a dissolved solid behind when the liquid turns to vapour (salt from sea water). Churning separates butter from curd. A magnet separates magnetic materials like iron filings from non-magnetic ones.',
        example: 'Salt is obtained by evaporating sea water in shallow pans.',
        check: [
          { q: 'How can iron filings be removed from sand?', options: ['Sieving', 'Using a magnet', 'Churning', 'Decantation'], correct: 1, why: 'Iron is magnetic; sand is not.' }
        ]
      }
    ],
    10: [
      {
        id: 's10-living', section: '10.1', title: 'Living vs non-living',
        idea: 'Living things move, eat, grow, breathe, excrete, respond, reproduce and die.',
        explain: 'If any of these features is missing, it is not a living being. A car moves and uses fuel but does not grow or reproduce, so it is non-living.',
        example: 'A plant bends towards light — it responds to a stimulus.',
        check: [
          { q: 'Which feature shows a seed is living?', options: ['It is hard', 'It can grow into a plant', 'It is small', 'It is brown'], correct: 1, why: 'Growth is a feature of living beings.' }
        ]
      },
      {
        id: 's10-germination', section: '10.2–10.3', title: 'Germination and plant growth',
        idea: 'Seeds need water, air and suitable conditions to germinate.',
        explain: 'During germination, roots generally grow downward and shoots grow upward. Seeds kept dry or without air do not sprout.',
        example: 'Moong seeds soaked in water sprout in a day or two; dry ones do not.',
        check: [
          { q: 'Which is needed for a seed to germinate?', options: ['Water and air', 'Only soil', 'Only sunlight', 'Salt'], correct: 0, why: 'Water and air are essential for germination.' }
        ]
      },
      {
        id: 's10-lifecycle', section: '10.4–10.5', title: 'Life cycles',
        idea: 'Every living being goes through stages from birth to death, and reproduction continues its kind.',
        explain: 'Plant: seed → germination → growth → flowering → seed. Mosquito: egg → larva → pupa → adult. Frog: egg → tadpole → froglet → adult. Mosquitoes and frogs change body shape and sometimes habitat between stages.',
        example: 'A tadpole lives in water and has a tail; the adult frog can live on land too.',
        check: [
          { q: 'Correct order for a mosquito:', options: ['egg → pupa → larva → adult', 'egg → larva → pupa → adult', 'larva → egg → adult → pupa', 'egg → tadpole → adult'], correct: 1, why: 'Egg, larva, pupa, adult.' }
        ]
      }
    ],
    11: [
      {
        id: 's11-resources', section: '11.1–11.6', title: 'Natural resources',
        idea: 'Resources provided by nature — air, water, sunlight, forests, soil, rocks, minerals, fossil fuels — are natural resources.',
        explain: 'All living beings depend on them. Things people make to meet their needs (buildings, roads, machines) are human-made resources.',
        example: 'Water from a river is natural; a dam is human-made.',
        check: [
          { q: 'Which is a human-made resource?', options: ['Sunlight', 'Forest', 'A bridge', 'Soil'], correct: 2, why: 'A bridge is made by people.' }
        ]
      },
      {
        id: 's11-renewable', section: '11.7–11.8', title: 'Renewable and non-renewable resources',
        idea: 'Renewable resources are replaced naturally in a reasonable time; non-renewable ones are limited.',
        explain: 'Sunlight, air, water and forests (if looked after) are renewable. Coal, petroleum and minerals take millions of years to form, so they are non-renewable. We must use all resources wisely.',
        example: 'Using solar energy instead of burning coal saves a non-renewable resource.',
        check: [
          { q: 'Which is non-renewable?', options: ['Sunlight', 'Wind', 'Coal', 'Air'], correct: 2, why: 'Coal takes millions of years to form.' }
        ]
      }
    ],
    12: [
      {
        id: 's12-stars', section: 'Ch 12', title: 'Stars, constellations and the Pole Star',
        idea: 'Constellations are groups of stars that seem to form patterns; the Pole Star shows north.',
        explain: 'The Pole Star appears almost still in the northern sky, so it helps find North in the Northern Hemisphere. The Sun is also a star — it makes its own heat and light.',
        example: 'The Big Dipper (Saptarishi) can be used to find the Pole Star.',
        check: [
          { q: 'The Pole Star helps us find which direction?', options: ['East', 'West', 'North', 'South'], correct: 2, why: 'It stays nearly fixed in the North.' }
        ]
      },
      {
        id: 's12-solar', section: '12.3', title: 'Our Solar System',
        idea: 'The Sun, eight planets, their moons, asteroids and comets form the Solar System.',
        explain: 'Planets in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Earth goes around the Sun in about one year. The Moon is Earth\'s natural satellite and goes around Earth in about 27 days.',
        example: 'Memory trick: "My Very Educated Mother Just Served Us Nuts".',
        check: [
          { q: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correct: 2, why: 'Mercury is first in order from the Sun.' },
          { q: 'The Moon is Earth\'s…', options: ['star', 'planet', 'natural satellite', 'comet'], correct: 2, why: 'Objects that go around planets are satellites.' }
        ]
      },
      {
        id: 's12-universe', section: '12.5', title: 'Galaxies and the Universe',
        idea: 'Our Solar System is part of the Milky Way Galaxy, one of countless galaxies in the Universe.',
        explain: 'A galaxy is a huge collection of stars, gas and dust. The Universe contains everything — all galaxies, stars, planets and space.',
        example: 'On a dark night away from city lights, the Milky Way looks like a faint band across the sky.',
        check: [
          { q: 'Our Solar System is part of the…', options: ['Andromeda Galaxy', 'Milky Way Galaxy', 'Moon', 'Pole Star'], correct: 1, why: 'We live in the Milky Way.' }
        ]
      }
    ]
  };

  // Fill gaps only: chapters that concepts.js already covers are left untouched.
  const data = CLASS_DATA['6'] = CLASS_DATA['6'] || {};
  data.concepts = data.concepts || {};
  const science = data.concepts.SCIENCE = data.concepts.SCIENCE || {};
  Object.keys(extra).forEach(ch => {
    if (!science[ch] || !science[ch].length) science[ch] = extra[ch];
  });
})();
