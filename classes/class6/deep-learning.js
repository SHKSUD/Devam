/**
 * Class VI Frontier Deep Learning Lab
 * Bridges NCERT Class 6 Science, Maths & Social Science chapters to
 * first-principles engineering, SpaceX/ISRO physics, YC compounding & startups,
 * biomimicry design, and ancient scientific civilizations.
 */
(function () {
  const verticals = [
    {
      id: 'spacex',
      icon: '🚀',
      label: 'SpaceX & ISRO Orbital Lab',
      accent: '#38BDF8',
      tagline: 'Rocket staging, thermal physics, magnetospheres & orbital geometry'
    },
    {
      id: 'yc',
      icon: '⚡',
      label: 'YC Startup & Systems Lab',
      accent: '#A855F7',
      tagline: 'Exponential compounding, prime-number cryptography & unit economics'
    },
    {
      id: 'biodesign',
      icon: '🧬',
      label: 'Bio-Design & Nature Tech',
      accent: '#34D399',
      tagline: 'Biomimicry engineering, closed-loop life support & geometric efficiency'
    },
    {
      id: 'civilizations',
      icon: '🏛️',
      label: 'Civilizations & Algorithms',
      accent: '#FBBF24',
      tagline: 'Ancient planetary measurement, Harappan binary weights & governance design'
    }
  ];

  const missions = [
    // =========================================================================
    // VERTICAL 1: SPACEX & ISRO ORBITAL LAB
    // =========================================================================
    {
      id: 'dl_spacex_staging',
      vertical: 'spacex',
      title: 'Why Rockets Drop Stages & Thrust-to-Weight Ratio',
      subtitle: 'Turn Science Ch 5 (Measurement, Mass & Force) into Starship liftoff physics',
      difficulty: 'Level 3 · First Principles',
      ncert: { subjectId: 'SCIENCE', chapterNum: 5, label: 'Science Ch 5 · Measurement of Length & Motion' },
      whyItMatters: 'Every gram on a launchpad must be lifted against Earth gravity (9.81 m/s²). Carrying empty steel tanks to orbit steals fuel you need for speed—that is why SpaceX boosters return and relight while upper stages fly on.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'You must push harder than Earth pulls',
          body: 'Gravity pulls every kilogram downward with 9.81 Newtons of force. If your rocket weighs 3,680 tonnes, Earth pulls down with ~36.1 Meganewtons (MN). Pushing with 35 MN looks huge, yet the rocket sits still on the pad.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Thrust-to-Weight Ratio (T/W)',
          body: 'Engineers compute T/W = Thrust_MN / (TotalMass_tonnes × 0.00981). You only lift off when T/W > 1.0, and orbital rockets aim for T/W ≈ 1.3–1.8 at liftoff so they do not waste propellant hovering against gravity ("gravity loss").'
        },
        {
          step: '03 · Frontier Application',
          title: 'Super Heavy 33 Raptors + Stage Separation',
          body: 'Instead of hauling 200+ tonnes of empty Super Heavy stainless steel all the way to orbit, SpaceX detaches the booster 2.5 minutes after liftoff, cutting dead dry mass dramatically—and lands it back at Starbase to fly again.'
        }
      ],
      sim: {
        type: 'rocket_twr',
        title: 'Starship Liftoff & T/W Physics Simulator',
        controls: [
          { key: 'thrustMN', label: 'Total Engine Thrust', min: 20, max: 90, step: 1, default: 75, unit: 'MN' },
          { key: 'fuelTonnes', label: 'Propellant Load', min: 1000, max: 4000, step: 50, default: 3400, unit: 't' },
          { key: 'dryTonnes', label: 'Dry Tank + Payload Mass', min: 150, max: 500, step: 10, default: 280, unit: 't' }
        ]
      },
      challenge: {
        q: 'A rocket on the launchpad has total mass 4,000 tonnes (weight = 39.24 MN) and fires engines producing 38 MN of thrust. What happens in the first second?',
        options: [
          'It lifts off slowly at half speed',
          'It stays stuck on the pad because Thrust < Weight (T/W < 1)',
          'It goes sideways instead of up',
          'Half the fuel floats upward'
        ],
        correct: 1,
        hint: 'Compare downward Weight (39.24 MN) vs upward Thrust (38 MN). What is the net upward force?',
        explain: 'When T/W < 1.0 (38 / 39.24 = 0.97), downward gravity beats upward thrust. Real rockets actually hold clamps locked until computers verify full T/W > 1.2!'
      },
      builderPrompt: 'Design Brief: If a reusable 2-stage rocket cuts Upper Stage dry mass by 40 tonnes, how does that improve payload mass or fuel margin on Earth → LEO missions?'
    },
    {
      id: 'dl_spacex_heatshield',
      vertical: 'spacex',
      title: 'From −162°C Cryo-Methane to +1,400°C Plasma Re-entry',
      subtitle: 'Scale Science Ch 7 & 8 (Temperature, Kelvin & States of Matter) to thermal protection',
      difficulty: 'Level 3 · First Principles',
      ncert: { subjectId: 'SCIENCE', chapterNum: 7, label: 'Science Ch 7 · Temperature & Its Measurement' },
      whyItMatters: 'A spacecraft holds super-cold liquid fuel (−162°C) inside its tanks, then hits the upper atmosphere at 28,000 km/h—compressing air into glowing plasma hotter than molten lava.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'Air compression, not friction, bakes spacecraft',
          body: 'Moving faster than 7 km/s slams into air molecules so fast they cannot get out of the way. The squeezed air shockwave heats up violently—turning gases into ionized plasma.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Kelvin Span & Insulator Conduction',
          body: 'Cryo liquid methane sits at −162°C (111 K) while re-entry shock air reaches ~1,400°C+ (~1,673 K)—over a 1,560°C temperature gradient across inches of hull! Trapped air pockets inside porous silica ceramic tiles block heat conduction because gas barely conducts heat.'
        },
        {
          step: '03 · Frontier Application',
          title: '18,000 Hexagonal Ceramic Tiles',
          body: 'SpaceX mounts ~18,000 identical hexagonal black tiles across Starship belly. Even when the glowing outer face exceeds 1,350°C, the inner steel hull stays cool enough that an aluminum structural frame will not melt.'
        }
      ],
      sim: {
        type: 'heat_shield',
        title: 'Orbital Re-entry & Ceramic Tile Thermal Drop Lab',
        controls: [
          { key: 'entrySpeedKms', label: 'Atmosphere Entry Speed', min: 4, max: 11, step: 0.2, default: 7.8, unit: 'km/s' },
          { key: 'tileThicknessMm', label: 'Silica Tile Thickness', min: 20, max: 80, step: 2, default: 45, unit: 'mm' }
        ]
      },
      challenge: {
        q: 'Why can an astronaut hold the corner of a white-hot ceramic heat-shield tile seconds after it leaves a 1,200°C furnace?',
        options: [
          'The tile turns heat directly into sound',
          'Silica fiber is ~90% trapped air pockets, so heat conducts very slowly to your fingers',
          'The tile has magnets repelling hot molecules',
          'It freezes below 0°C at its corners'
        ],
        correct: 1,
        hint: 'Think about why wool sweaters and thermos flasks keep heat from traveling fast: trapped still air is a terrible conductor.',
        explain: 'Heat-shield tiles are mostly porous silica fibers full of trapped air pockets—giving ultra-low thermal conductivity. Heat escapes outward fast by radiation, while almost none travels inward!'
      },
      builderPrompt: 'Physics Note: Express liquid oxygen (−183°C) and re-entry plasma (+1,427°C) on the Kelvin scale (K = °C + 273), and explain why a single missing tile near steel welds is dangerous.'
    },
    {
      id: 'dl_spacex_mars_angle',
      vertical: 'spacex',
      title: 'The 44° Mars Launch Window & Planetary Angles',
      subtitle: 'Connect Maths Ch 2 (Angles) + Science Ch 4 & 12 (Earth Shield & Orbits)',
      difficulty: 'Level 2 · Systems',
      ncert: { subjectId: 'SCIENCE', chapterNum: 12, label: 'Science Ch 12 · Beyond Earth' },
      whyItMatters: 'Rockets never fly in a straight line toward where Mars is today—Earth and Mars orbit the Sun at different angular speeds, so you must aim months ahead like throwing a pass to a running teammate.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'Aim for where Mars WILL BE in ~250 days',
          body: 'Earth takes 365 days per 360° orbit (~0.99°/day), while outer Mars takes 687 days (~0.52°/day). By the time a Hohmann transfer ellipse carries Starship across the Sun, Mars has swept roughly 136° around its track.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Acute 44° Phase Angle Alignment',
          body: 'Because the spacecraft sweeps 180° around its half-ellipse while Mars sweeps ~136°, Mars must be 180° − 136° = 44° AHEAD of Earth at liftoff! Miss that acute angle by 20° and your ship arrives in empty deep space.'
        },
        {
          step: '03 · Frontier Application',
          title: 'Every 26 Months + Magnetic Radiation Shield',
          body: 'Earth overtakes Mars in angle only once every 26 months (when the Earth–Sun–Mars phase angle hits ~44°). Outside Earth’s geomagnetic shield (Ch 4), interplanetary ships also face solar particle storms.'
        }
      ],
      sim: {
        type: 'mars_window',
        title: 'Hohmann Transfer Window & Phase Angle Simulator',
        controls: [
          { key: 'phaseAngleDeg', label: 'Mars Lead Angle Ahead of Earth', min: 0, max: 180, step: 1, default: 44, unit: '°' }
        ]
      },
      challenge: {
        q: 'Why can SpaceX and ISRO (Mangalyaan) launch fuel-efficient Mars missions only once every 26 months instead of any weekend?',
        options: [
          'Solar panels only work in odd-numbered years',
          'Earth and Mars only return to the exact ~44° phase-angle alignment every 26 months',
          'Gravity disappears between orbits in other months',
          'Mars stops spinning every two years'
        ],
        correct: 1,
        hint: 'Earth laps Mars on the inner lane. How often do two runners return to the exact 44° lead angle?',
        explain: 'Earth orbits faster (~1°/day) than Mars (~0.52°/day), closing ~0.46° of angle per day. Returning to the optimal ~44° acute Hohmann launch geometry takes 360° / 0.46° ≈ 780 days (~26 months).'
      },
      builderPrompt: 'Orbital Sketch: If Earth sweeps 0.99°/day and Mars sweeps 0.52°/day, estimate why a spacecraft launched at 0° alignment misses Mars cleanly after 259 days.'
    },

    // =========================================================================
    // VERTICAL 2: YC STARTUP & SYSTEMS LAB
    // =========================================================================
    {
      id: 'dl_yc_compounding',
      vertical: 'yc',
      title: "Paul Graham's Compounding Law: Linear vs. Exponential Sequences",
      subtitle: 'Turn Maths Ch 1 (Patterns & Sequences) into Y Combinator startup growth math',
      difficulty: 'Level 3 · First Principles',
      ncert: { subjectId: 'MATH', chapterNum: 1, label: 'Maths Ch 1 · Patterns in Mathematics' },
      whyItMatters: 'Almost every great company looks tiny on Day 1—often starting with just 100 users. Yet Y Combinator measures startups by weekly percentage compounding because geometric sequences overtake linear growth explosively.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'Adding +10 looks bigger at first; ×1.07 wins later',
          body: 'In Week 1, growing 100 users by +7 linear users gives 107, and growing by 7% also gives 107. Most kids think both grow almost the same. Wait 36 weeks and watch what happens.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Rule of 70 & Geometric Sequences',
          body: 'Linear growth follows a + n×d (constant addition). Compounding follows a × (1 + r)^n (powers of the growth factor, like Ganita Prakash’s 2, 4, 8, 16 sequence!). Quick mental rule: Doubling Time ≈ 70 ÷ Weekly % Growth.'
        },
        {
          step: '03 · Frontier Application',
          title: 'Why YC Founders Track Weekly % Growth',
          body: 'Paul Graham taught YC founders that 5–7% weekly compounding doubles a product every 10–14 weeks—turning 100 early users into ~5,000+ within one year, and millions within 3 years.'
        }
      ],
      sim: {
        type: 'yc_compounding',
        title: 'Linear (+ Users) vs. YC Compounding (% Weekly) Visualizer',
        controls: [
          { key: 'weeklyRatePct', label: 'Weekly Compounding Rate', min: 1, max: 12, step: 1, default: 7, unit: '%' },
          { key: 'weeks', label: 'Horizon (Starting from 100 Users)', min: 4, max: 52, step: 2, default: 36, unit: 'wks' }
        ]
      },
      challenge: {
        q: 'An app has 100 users and doubles every 10 weeks (100 → 200 → 400 → 800...). Roughly how many users will it have after 50 weeks?',
        options: ['500 users', '1,600 users', '3,200 users', '10,000 users'],
        correct: 2,
        hint: '50 weeks = 5 doublings! Compute 100 × 2 × 2 × 2 × 2 × 2.',
        explain: 'After 50 weeks you double 5 times: 100 × 2⁵ = 100 × 32 = 3,200 users—while linear growth (+10/week) would only reach 600!'
      },
      builderPrompt: 'Founder Exercise: Think of a tiny skill you can improve by 1% every day (or 7% per week). Using Doubling Time ≈ 70 ÷ rate, how many weeks to double your problem-solving speed?'
    },
    {
      id: 'dl_yc_prime_crypto',
      vertical: 'yc',
      title: 'How Prime Numbers Lock Every UPI & Stripe Payment',
      subtitle: 'Turn Maths Ch 5 (Prime Time & Factorisation) into internet encryption',
      difficulty: 'Level 4 · Olympiad',
      ncert: { subjectId: 'MATH', chapterNum: 5, label: 'Maths Ch 5 · Prime Time' },
      whyItMatters: 'Every WhatsApp message, HTTPS padlock, and UPI/Stripe card checkout stays secret because of one Class 6 trick: multiplying two primes is instant, while factoring the product back apart is astronomically slow.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'One-Way Trapdoor Math',
          body: 'Ask a friend what 17 × 23 is: you can multiply it in 3 seconds (391). Now ask them to find which two primes multiply to 4,891 without a calculator—they have to test dozens of divisions!'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Unique Prime Factorisation (RSA Lock)',
          body: 'Because every number has ONE unique prime factorisation (Fundamental Theorem of Arithmetic), N = p × q locks the safe publicly, while φ(N) = (p−1)(q−1) creates the private key that only someone knowing p and q can compute fast.'
        },
        {
          step: '03 · Frontier Application',
          title: '300-Digit Primes Power FinTech',
          body: 'Modern payment APIs (Stripe, Razorpay, banks) pick two giant 300-digit primes. Multiplying takes microseconds; all supercomputers on Earth working together would need longer than the age of the universe to factor N!'
        }
      ],
      sim: {
        type: 'prime_lock',
        title: 'RSA Trapdoor Public Lock N = p × q Builder',
        controls: [
          { key: 'primeIndexA', label: 'Secret Prime p', min: 0, max: 9, step: 1, default: 2, unit: '' },
          { key: 'primeIndexB', label: 'Secret Prime q', min: 0, max: 9, step: 1, default: 6, unit: '' }
        ]
      },
      challenge: {
        q: 'Why does internet encryption choose N = p × q using two LARGE PRIMES instead of two random composite numbers?',
        options: [
          'Composite numbers cannot be multiplied on computers',
          'Primes have NO smaller factors to split easily, making factoring N uniquely hard',
          'Prime numbers always end in zero',
          'Even numbers crash Wi-Fi routers'
        ],
        correct: 1,
        hint: 'If N = 15 × 20, anyone immediately notices 5 and 2 divide it! What makes p × q hard to crack?',
        explain: 'Small primes like 2, 3, or 5 quickly divide random composite numbers. When N is the product of just TWO giant primes p and q, there are NO small divisors anywhere below p.'
      },
      builderPrompt: 'Crypto Puzzle: Find the prime factorisation of 2,021 = p × q (Hint: 2,021 is 2,025 − 4 = 45² − 2²!). Verify your two factors are prime.'
    },
    {
      id: 'dl_yc_unit_economics',
      vertical: 'yc',
      title: 'Startup Unit Economics & Primary → Secondary → Tertiary Value Leap',
      subtitle: 'Connect Social Science Ch 14 + Maths Ch 4 & 7 (Fractions & Data)',
      difficulty: 'Level 2 · Systems',
      ncert: { subjectId: 'SSC', chapterNum: 14, label: 'Social Science Ch 14 · Economic Activities Around Us' },
      whyItMatters: 'Why does a ₹10 raw tomato sell as ₹400 gourmet pasta sauce or a ₹2,000 restaurant dish? Understanding how value multiplies from Primary → Secondary → Tertiary sectors is how founders design profitable businesses.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'Selling 1 item at a loss never scales with volume',
          body: 'Many beginners think "We lose ₹5 per delivery right now, we will make it up in volume!" That just loses ₹5 × 1,000 times faster. First, make 1 transaction healthy.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Gross Margin Fraction & Repeat Multiplier',
          body: 'Unit Profit = Price − Cost. Gross Margin = (Price − Cost) / Price. When customers come back repeatedly (Repeat Rate), your Customer Lifetime Value (LTV) multiplies dramatically without paying marketing costs again.'
        },
        {
          step: '03 · Frontier Application',
          title: 'Turning Commodities into Trusted Software & Brands',
          body: 'Just like Amul turned fragmented raw dairy farming (Primary) into pasteurised packaging (Secondary) and nationwide cold-chain distribution (Tertiary), high-margin startups build trusted quality and repeat habit.'
        }
      ],
      sim: {
        type: 'unit_economics',
        title: 'YC Unit Margin & Repeat Cohort Calculator',
        controls: [
          { key: 'priceRs', label: 'Selling Price per Order', min: 20, max: 150, step: 5, default: 60, unit: '₹' },
          { key: 'costRs', label: 'Direct Making + Delivery Cost', min: 10, max: 120, step: 5, default: 25, unit: '₹' },
          { key: 'repeatOrders', label: 'Avg Orders per Customer', min: 1, max: 12, step: 1, default: 5, unit: 'x' }
        ]
      },
      challenge: {
        q: 'A lemonade startup sells cups for ₹40, spends ₹15 on lemons/cups/ice, and pays ₹30 per customer in ad flyers. How many cups must ONE customer buy just to break even?',
        options: ['1 cup', '2 cups', '5 cups', 'It never breaks even'],
        correct: 1,
        hint: 'Profit per cup = ₹40 − ₹15 = ₹25. Compare ₹25 per cup vs the ₹30 one-time flyer cost.',
        explain: 'Each cup yields ₹25 gross profit. On 1 cup, ₹25 − ₹30 = −₹5 (loss!). On the 2nd repeat cup, total profit reaches ₹50 − ₹30 = +₹20!'
      },
      builderPrompt: 'Founder Sketch: Design a school or neighbourhood micro-business across Primary (inputs), Secondary (making/packing), and Tertiary (service/delivery), listing its price, cost, and why buyers repeat.'
    },

    // =========================================================================
    // VERTICAL 3: BIO-DESIGN & NATURE TECH
    // =========================================================================
    {
      id: 'dl_bio_hexagon',
      vertical: 'biodesign',
      title: 'Shinkansen Kingfisher Beak & Why Bees Chose Hexagons',
      subtitle: 'Merge Maths Ch 6 & 9 (Area, Perimeter, Symmetry) with Science Ch 2 (Biodiversity)',
      difficulty: 'Level 3 · First Principles',
      ncert: { subjectId: 'MATH', chapterNum: 6, label: 'Maths Ch 6 · Perimeter and Area' },
      whyItMatters: 'Nature spent 3.8 billion years running experiments. When engineers copy biological shapes—like the bullet-train nose modeled after a diving kingfisher or hexagonal satellite mirrors like honeycombs—they unlock giant leaps in efficiency.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'Bees have to eat honey to make beeswax',
          body: 'Making 1 gram of beeswax costs bees roughly 8 grams of precious honey energy! So bees want honeycomb storage cells that hold maximum honey using the MINIMUM wall perimeter.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'The Honeycomb Conjecture (Isoperimetric Geometry)',
          body: 'Only 3 regular polygons tile a flat wall with zero wasted gaps: Triangles, Squares, and Hexagons. For the exact SAME enclosed Area (e.g. 36 cm²), a Circle has lowest perimeter but leaves gaps; among gap-free tiles, the Regular Hexagon beats both Triangle and Square!'
        },
        {
          step: '03 · Frontier Application',
          title: 'JWST Gold Mirrors & Rocket Grid Fins',
          body: 'The James Webb Space Telescope uses 18 hexagonal mirror segments that pack seamlessly with minimum seam loss, while Eiji Nakatsu cured Shinkansen tunnel sonic booms by reshaping the train nose after a kingfisher beak.'
        }
      ],
      sim: {
        type: 'biomimicry_hex',
        title: 'Same-Area Wall Efficiency: Triangle vs. Square vs. Hexagon',
        controls: [
          { key: 'cellAreaCm2', label: 'Target Honeycomb Cell Area', min: 10, max: 100, step: 2, default: 36, unit: 'cm²' }
        ]
      },
      challenge: {
        q: 'Why does the James Webb Space Telescope pack 18 hexagonal mirrors together instead of 18 circular mirrors?',
        options: [
          'Circles cannot reflect infrared light',
          'Hexagons tile flat space with ZERO wasted gaps while minimizing total edge length',
          'Hexagons weigh 10 times more than circles',
          'Stars look hexagonal in space'
        ],
        correct: 1,
        hint: 'Imagine placing pennies side by side on a table: notice the empty triangles between circles. Can hexagons touch edge-to-edge with zero gaps?',
        explain: 'Circles leave ~9% dead gap space when packed tightly. Hexagons tile completely with 0% gap AND need less perimeter wall material than squares or triangles for equal area!'
      },
      builderPrompt: 'Biomimicry Log: Pick 1 animal adaptation from Science Ch 2 (e.g. lotus water-repelling leaf, gecko foot hairs, camel nostrils) and propose a product humans could invent from it.'
    },
    {
      id: 'dl_bio_water_loop',
      vertical: 'biodesign',
      title: 'ISS 98% Closed-Loop Water Recovery Lab',
      subtitle: 'Scale Science Ch 9 (Separation Methods) to orbital life-support engineering',
      difficulty: 'Level 2 · Systems',
      ncert: { subjectId: 'SCIENCE', chapterNum: 9, label: 'Science Ch 9 · Methods of Separation in Everyday Life' },
      whyItMatters: 'Sending just 1 litre of drinking water from Earth to the International Space Station costs roughly $10,000 in rocket launch mass. Instead, astronauts drink yesterday’s purified sweat and wastewater—recycled cleaner than bottled water.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'You cannot throw dirty water away in orbit',
          body: 'On Earth, rain naturally runs the distillation cycle (evaporation → clouds → rain). Inside a sealed metal spacecraft, astronauts must build an artificial rain-and-filter loop inside cabinets.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Multi-Stage Separation Pipeline (Ch 9 IRL)',
          body: 'Step 1: Fine mechanical Filtration traps solids/lint. Step 2: Vacuum Distillation (evaporation + condensation at low pressure without gravity settling!). Step 3: Catalytic Oxidation & Ion beds purify trace molecules, recovering up to 98% of every drop.'
        },
        {
          step: '03 · Frontier Application',
          title: '98% Recovery Saves Millions & Inspires Desert Cities',
          body: 'Recycling 98% instead of 50% cuts resupply rocket mass by 25×! That same closed-loop water engineering now powers drought-proof cities like Singapore (NEWater).'
        }
      ],
      sim: {
        type: 'water_loop',
        title: 'Space Station Water Recovery & Launch Cost Simulator',
        controls: [
          { key: 'crewCount', label: 'Astronaut Crew Size', min: 2, max: 8, step: 1, default: 4, unit: 'crew' },
          { key: 'recycleEffPct', label: 'Separation Loop Recovery %', min: 50, max: 98, step: 2, default: 98, unit: '%' }
        ]
      },
      challenge: {
        q: 'Why does standard gravity "Sedimentation & Decantation" FAIL aboard the orbiting International Space Station?',
        options: [
          'Water turns into solid ice in cabins',
          'Astronauts and water are in continuous free-fall (microgravity), so heavier solids never sink to the bottom',
          'Soap dissolves steel tanks in space',
          'Airplanes steal the gravity'
        ],
        correct: 1,
        hint: 'Sedimentation needs gravity to pull heavier particles downward. What happens to floating droplets inside the ISS?',
        explain: 'In microgravity, heavier impurities stay suspended evenly instead of settling! NASA uses spinning centrifuges (artificial gravity) + vacuum distillation + membrane filtration instead.'
      },
      builderPrompt: 'Lab Design: Draw the 3-step sequence (Filtration → Distillation/Condensation → Trace Polish) to rescue clean drinking water from muddy salty pond water.'
    },

    // =========================================================================
    // VERTICAL 4: CIVILIZATIONS & ALGORITHMS
    // =========================================================================
    {
      id: 'dl_civ_eratosthenes',
      vertical: 'civilizations',
      title: 'Measuring a Planet with One Stick & Shadow Geometry (240 BCE)',
      subtitle: 'Connect Social Science Ch 1 (Latitudes & Earth) + Maths Ch 2 (Angles & Circles)',
      difficulty: 'Level 4 · Olympiad',
      ncert: { subjectId: 'SSC', chapterNum: 1, label: 'Social Science Ch 1 · Locating Places on the Earth' },
      whyItMatters: 'Over 2,250 years before satellites or airplanes, Greek mathematician Eratosthenes measured the circumference of the entire Earth to within ~1% accuracy—using only noon shadows and a camel-measured road.',
      firstPrinciples: [
        {
          step: '01 · Intuition',
          title: 'A shadow appears in Alexandria while Syene has NONE',
          body: 'At solar noon on June 21 in Syene (near the Tropic of Cancer!), sunlight fell straight down to the bottom of a deep well with zero shadow. At the exact same minute 800 km north in Alexandria, an obelisk cast a 7.2° shadow.'
        },
        {
          step: '02 · Hidden Rule / Math',
          title: 'Parallel Sun Rays + Alternate Angles (Maths Ch 2!)',
          body: 'Because the Sun is huge and far away, its rays hit both cities nearly parallel. That means the 7.2° shadow angle equals the central angle at Earth’s core! Since 7.2° is 1/50th of a full 360° circle, full Earth circumference = 50 × 800 km = 40,000 km!'
        },
        {
          step: '03 · Frontier Application',
          title: 'Same Geometry Powers GPS & Harappan Standardization',
          body: 'Just as Eratosthenes turned local shadow angles into a global Earth grid (Ch 1 latitudes!), ancient Harappans standardized ratios (Ch 6: 1 : 2 : 4 bricks and binary weights) so entire cities and trade networks synced reliably.'
        }
      ],
      sim: {
        type: 'eratosthenes',
        title: "Eratosthenes' Shadow-to-Planet Circumference Calculator",
        controls: [
          { key: 'shadowAngleDeg', label: 'Noon Stick Shadow Angle θ', min: 3, max: 15, step: 0.2, default: 7.2, unit: '°' },
          { key: 'cityDistKm', label: 'North-South City Distance', min: 400, max: 1400, step: 25, default: 800, unit: 'km' }
        ]
      },
      challenge: {
        q: 'On the June solstice at solar noon, a vertical stick 600 km north of the Tropic of Cancer casts a 5.4° shadow (where 5.4° is 1/66.7 of 360°). Wait: if θ = 6° and distance = 667 km, what is the planet’s circumference?',
        options: ['4,002 km', '20,010 km', '40,020 km', '80,040 km'],
        correct: 2,
        hint: 'How many 6° slices fit inside a full 360° circle? Multiply 667 km by (360° ÷ 6°).',
        explain: '360° ÷ 6° = 60 slices around the full sphere. Multiplying 60 × 667 km gives 40,020 km—matching modern satellite measurements of Earth (~40,075 km)!'
      },
      builderPrompt: 'Field Experiment: How could you repeat Eratosthenes’ trick with a friend in another Indian city along roughly the same longitude (like Delhi and Bengaluru) at local solar noon?'
    }
  ];

  registerClassData('6', {
    deepLearning: { verticals, missions }
  });
})();
