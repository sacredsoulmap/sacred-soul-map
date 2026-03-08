import { useState } from "react";

// ─── CONFIG ───────────────────────────────────────────────
const CFG = {
  EMAILJS_SERVICE_ID:  "service_8wvh9nx",
  EMAILJS_TEMPLATE_ID: "template_hqle32c",
  EMAILJS_PUBLIC_KEY:  "dkHFmGFcO68nWPpAc",
  PRACTITIONER_EMAIL:  "sacredsoulmap@gmail.com",
};

// ─── NUMEROLOGY ENGINE (David A. Phillips — Complete Book of Numerology) ──────
const LV = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const BASE_VOWELS = new Set(["A","E","I","O","U"]);
const VOWELS = BASE_VOWELS;
const lv = c => LV[c.toUpperCase()] || 0;

// Phillips: Y is a vowel when it carries a vowel sound (e.g. COURTNEY, MARY)
// Y = vowel if NOT first letter AND not followed by another base vowel
function isVowelPhillips(c, idx, arr) {
  const u = c.toUpperCase();
  if (BASE_VOWELS.has(u)) return true;
  if (u !== "Y") return false;
  if (idx === 0) return false;
  const next = arr[idx + 1] ? arr[idx + 1].toUpperCase() : "";
  return !BASE_VOWELS.has(next);
}

function nameSum(name, filter) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  return letters.reduce((s, c, idx) => {
    const vowel = isVowelPhillips(c, idx, letters);
    if (filter === "v" && !vowel) return s;
    if (filter === "c" && vowel) return s;
    return s + lv(c);
  }, 0);
}

function reduce(n, keepMaster = true) {
  if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n < 10) return n;
  const sum = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return reduce(sum, keepMaster);
}

function digitSum(str) {
  return String(str).split("").reduce((s, d) => s + Number(d), 0);
}

// ─── ARROWS OF PYTHAGORAS ─────────────────────────────────
// 3x3 grid: numbers 1–9 placed as:
//   3 | 6 | 9
//   2 | 5 | 8
//   1 | 4 | 7
const ARROW_DEFS = [
  { id:"det",   name:"Arrow of Determination",  nums:[1,5,9], desc:"Strong will, laser focus, able to see things through to completion" },
  { id:"comp",  name:"Arrow of Compassion",      nums:[3,5,7], desc:"Deep empathy, heightened sensitivity, spiritual awareness" },
  { id:"plan",  name:"Arrow of the Planner",     nums:[1,2,3], desc:"Orderly mind, strong memory, ability to organize thought into action" },
  { id:"will",  name:"Arrow of Will/Practicality",nums:[4,5,6], desc:"Exceptional willpower, physical endurance, determination in material world" },
  { id:"act",   name:"Arrow of Activity",         nums:[7,8,9], desc:"High physical energy, restlessness, strong drive for achievement" },
  { id:"prac",  name:"Arrow of Practicality",     nums:[1,4,7], desc:"Disciplined, methodical, strong in physical and material realms" },
  { id:"emot",  name:"Arrow of Emotional Balance",nums:[2,5,8], desc:"Emotional intelligence, sensitivity in balance with strength" },
  { id:"intel", name:"Arrow of the Intellect",    nums:[3,6,9], desc:"High mental capacity, creative intelligence, love of learning" },
];

// ─── MAIN CALCULATOR ──────────────────────────────────────
function calcNums(p) {
  const full = [p.legalFirst, p.legalMiddle, p.legalLast].filter(Boolean).join(" ");
  const hasCurrent = p.currentFirst || p.currentMiddle || p.currentLast;
  const currentFull = hasCurrent
    ? [p.currentFirst || p.legalFirst, p.currentMiddle || p.legalMiddle, p.currentLast || p.legalLast].filter(Boolean).join(" ")
    : null;
  const m = Number(p.bMonth), d = Number(p.bDay), y = Number(p.bYear);
  const today = new Date();
  const curY = today.getFullYear();
  const curM = today.getMonth() + 1;
  const curD = today.getDate();

  // ── Core numbers ──
  const mR = reduce(m, false), dR = reduce(d, false), yR = reduce(digitSum(y), false);
  const lifePath = reduce(mR + dR + yR);
  const expression = reduce(nameSum(full));
  const soulUrge = reduce(nameSum(full, "v"));
  const personality = reduce(nameSum(full, "c"));
  const birthday = reduce(d);
  const personalYear = reduce(reduce(m,false) + reduce(d,false) + reduce(digitSum(curY),false));
  const maturity = reduce(lifePath + expression);

  // ── Personal Month & Day ──
  const personalMonth = reduce(personalYear + reduce(curM, false));
  const personalDay = reduce(personalMonth + reduce(curD, false));

  // ── Bridge Numbers (the gap between paired numbers — what to work on) ──
  const lpExpBridge = Math.abs((lifePath > 9 ? lifePath % 10 : lifePath) - (expression > 9 ? expression % 10 : expression));
  const suPersBridge = Math.abs((soulUrge > 9 ? soulUrge % 10 : soulUrge) - (personality > 9 ? personality % 10 : personality));
  const bridgeLifeExp = reduce(lpExpBridge, false);
  const bridgeSoulPers = reduce(suPersBridge, false);

  // ── Subconscious Self (9 minus missing number count — natural response under pressure) ──
  const allLetters = full.toUpperCase().replace(/[^A-Z]/g,"").split("");
  const present = new Set(allLetters.map(lv).filter(Boolean));
  const missing = [1,2,3,4,5,6,7,8,9].filter(n => !present.has(n));
  const subconsciousSelf = 9 - missing.length;

  // ── Intensity Table (number frequency in name — overemphasized traits) ──
  const intensity = {};
  for (let i = 1; i <= 9; i++) intensity[i] = 0;
  allLetters.forEach(c => { const v = lv(c); if (v) intensity[v]++; });
  const intensityPeak = Object.entries(intensity).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k,v]) => k+"(×"+v+")").join(", ");
  const intensityAbsent = Object.entries(intensity).filter(([,v]) => v === 0).map(([k]) => k).join(", ");

  // ── First Vowel (primary soul motivation key per Phillips) ──
  const firstVowel = allLetters.find((c, idx) => isVowelPhillips(c, idx, allLetters)) || "";

  // ── Planes of Expression ──
  const planes = { Physical:0, Mental:0, Emotional:0, Intuitive:0 };
  allLetters.forEach(c => { const pl = PLANE_MAP[c]; if (pl) planes[pl]++; });
  const dominantPlane = Object.entries(planes).sort((a,b) => b[1]-a[1])[0]?.[0] || "";

  // ── 4 Challenges (Phillips: the inner tests of each life stage) ──
  const ch1 = reduce(Math.abs(mR - dR), false);
  const ch2 = reduce(Math.abs(dR - yR), false);
  const ch3 = reduce(Math.abs(ch1 - ch2), false);
  const ch4 = reduce(Math.abs(mR - yR), false);

  // ── 4 Pinnacles ──
  const pin1 = reduce(mR + dR);
  const pin2 = reduce(dR + yR);
  const pin3 = reduce(pin1 + pin2);
  const pin4 = reduce(mR + yR);
  const lpR = reduce(lifePath, false);
  const p1end = 36 - lpR;
  const p2end = p1end + 9;
  const p3end = p2end + 9;
  const curAge = curY - y;
  let activePinnacle = pin4, activePinnacleNum = 4, activeChallenge = ch4;
  if (curAge < p1end) { activePinnacle = pin1; activePinnacleNum = 1; activeChallenge = ch1; }
  else if (curAge < p2end) { activePinnacle = pin2; activePinnacleNum = 2; activeChallenge = ch2; }
  else if (curAge < p3end) { activePinnacle = pin3; activePinnacleNum = 3; activeChallenge = ch3; }

  // ── Karmic Lessons (missing numbers = soul lessons not yet mastered) ──
  const KARMIC_DEBT_NUMS = { 13: "13/4", 14: "14/5", 16: "16/7", 19: "19/1" };
  const rawNums = [nameSum(full), nameSum(full,"v"), nameSum(full,"c"), mR+dR+yR];
  const karmicDebts = rawNums.filter(r => KARMIC_DEBT_NUMS[r]).map(r => KARMIC_DEBT_NUMS[r]);

  // ── Arrows of Pythagoras ──
  const dobDigits = new Set(
    (String(p.bMonth).padStart(2,"0") + String(p.bDay).padStart(2,"0") + String(p.bYear))
      .split("").map(Number).filter(n => n >= 1 && n <= 9)
  );
  const arrowsPresent = ARROW_DEFS.filter(a => a.nums.every(n => dobDigits.has(n))).map(a => a.name + ": " + a.desc);
  const arrowsMissing = ARROW_DEFS.filter(a => a.nums.every(n => !dobDigits.has(n))).map(a => a.name + " (ABSENT): soul lesson — " + a.desc);

  // ── Chinese Zodiac (Year + Inner + True animal) ──
  const animals = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  const czElements = ["Metal","Metal","Water","Water","Wood","Wood","Fire","Fire","Earth","Earth"];
  const polarity = ["Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin"];
  const ai = ((y - 4) % 12 + 12) % 12;
  // Inner animal = birth month animal (approx by month)
  const monthAnimalIdx = ((m - 1 + 12) % 12);
  // True/Secret animal = birth hour animal (from bHour if known)
  let secretAnimalIdx = null;
  if (p.bHour) {
    const hr = parseInt(p.bHour, 10);
    // Each animal rules a 2-hour period: Rat=23-1, Ox=1-3, etc.
    secretAnimalIdx = Math.floor(((hr + 1) % 24) / 2) % 12;
  }
  const chinese = {
    animal: animals[ai],
    element: czElements[y % 10],
    polarity: polarity[ai],
    innerAnimal: animals[monthAnimalIdx],
    secretAnimal: secretAnimalIdx !== null ? animals[secretAnimalIdx] : "Unknown (birth time required)",
    fixedElement: ["Wood","Fire","Earth","Metal","Water","Wood","Fire","Earth","Metal","Water","Wood","Fire"][ai],
  };

  // ── Sun sign ──
  const SIGNS = [["Capricorn",12,22],["Aquarius",1,20],["Pisces",2,19],["Aries",3,21],
    ["Taurus",4,20],["Gemini",5,21],["Cancer",6,21],["Leo",7,23],
    ["Virgo",8,23],["Libra",9,23],["Scorpio",10,23],["Sagittarius",11,22]];
  let sunSign = "Capricorn";
  for (let i = 0; i < SIGNS.length; i++) {
    const [name, sm, sd] = SIGNS[i];
    const next = SIGNS[(i+1) % 12];
    if (m === sm && d >= sd) { sunSign = name; break; }
    if (m === next[1] && d < next[2]) { sunSign = name; break; }
  }

  // ── Current name comparison ──
  const currentExpression = currentFull ? reduce(nameSum(currentFull)) : null;
  const currentSoulUrge    = currentFull ? reduce(nameSum(currentFull, "v")) : null;
  const currentPersonality = currentFull ? reduce(nameSum(currentFull, "c")) : null;

  // ── Master number awareness ──
  const masterNumbers = [];
  [lifePath, expression, soulUrge, personality, personalYear, maturity, activePinnacle].forEach(n => {
    if ([11,22,33].includes(n) && !masterNumbers.includes(n)) masterNumbers.push(n);
  });

  return {
    fullName: full, lifePath, expression, soulUrge, personality, birthday,
    personalYear, personalMonth, personalDay, maturity,
    bridgeLifeExp, bridgeSoulPers,
    subconsciousSelf, intensityPeak, intensityAbsent, intensity,
    firstVowel, planes, dominantPlane,
    missing, karmicDebts, masterNumbers,
    challenges: [ch1, ch2, ch3, ch4], activeChallenge,
    pinnacles: [pin1, pin2, pin3, pin4],
    pinnacleAges: [p1end, p2end, p3end],
    activePinnacle, activePinnacleNum,
    arrowsPresent, arrowsMissing,
    chinese, sunSign,
    currentFull, currentExpression, currentSoulUrge, currentPersonality,
    hasCurrent: !!currentFull,
  };
}

// ─── PROMPT BUILDER ───────────────────────────────────────
function buildPrompt(p, tier) {
  const n = calcNums(p);
  const name = p.preferredName || p.legalFirst || "this soul";
  const isFull = tier !== "soul-spark";

  const lines = [
    "You are a master numerologist trained in David A. Phillips' Complete Book of Numerology, a Western natal chart astrologer, a Chinese metaphysics scholar, and a shadow integration guide.",
    "",
    "════════════════════════════════════════════════════",
    "ABSOLUTE RULES — violating any of these invalidates the reading:",
    "1. Return ONLY a raw JSON object. No markdown. No backticks. No preamble. Start with { end with }.",
    "2. Every JSON field listed in the schema MUST be present and contain real content — not placeholder text.",
    "3. Every numerology section MUST reference the actual numbers provided (e.g. Life Path " + n.lifePath + ", not a generic description).",
    "4. Every astrology section MUST name the actual placements provided (e.g. 'Moon in Taurus at 29°').",
    "5. SHADOW WORK RULE: You may ONLY reference personal history, wounds, or biographical details that were EXPLICITLY written in the form fields below. Do NOT infer, assume, or extrapolate any life events, relationships, family history, or traumas that were not directly stated. If no personal context was shared, base shadow work entirely on the numbers and chart.",
    "6. Missing numbers CANNOT also be core numbers. If a number appears in 'Missing Numbers' it cannot also be the Soul Urge or any other core number — check for contradictions before writing.",
    "7. The Arrows of Pythagoras section is REQUIRED and must specifically name which arrows are present and which are absent.",
    "8. The Planes of Expression section is REQUIRED and must reference the actual distribution: Physical=" + n.planes.Physical + " Mental=" + n.planes.Mental + " Emotional=" + n.planes.Emotional + " Intuitive=" + n.planes.Intuitive + ".",
    "════════════════════════════════════════════════════",
    "",
    "══════════════════════════════════════════",
    "PERSON: " + name,
    "Full birth name: " + n.fullName,
    "DOB: " + p.bMonth + "/" + p.bDay + "/" + p.bYear,
    "Birth location: " + [p.bCity, p.bState, p.bCountry].filter(Boolean).join(", ") || "Not provided",
    "",
    "── CORE NUMBERS (Phillips) ──",
    "Life Path: " + n.lifePath + (n.masterNumbers.includes(n.lifePath) ? " [MASTER NUMBER]" : ""),
    "Expression (Destiny): " + n.expression,
    "Soul Urge (Heart's Desire): " + n.soulUrge,
    "Personality: " + n.personality,
    "Birthday Number: " + n.birthday,
    "Maturity Number: " + n.maturity,
    "",
    "── TIMING ──",
    "Personal Year: " + n.personalYear,
    "Personal Month: " + n.personalMonth,
    "Personal Day: " + n.personalDay,
    "Active Pinnacle: " + n.activePinnacle + " (Pinnacle " + n.activePinnacleNum + ")",
    "Active Challenge: " + n.activeChallenge,
    "Pinnacle sequence: " + n.pinnacles.join(" → ") + " (ages: <" + n.pinnacleAges[0] + ", " + n.pinnacleAges[0] + "–" + n.pinnacleAges[1] + ", " + n.pinnacleAges[1] + "–" + n.pinnacleAges[2] + ", " + n.pinnacleAges[2] + "+)",
    "Challenge sequence: " + n.challenges.join(" → "),
    "",
    "── DEPTH NUMBERS (Phillips advanced system) ──",
    "Bridge (Life Path ↔ Expression): " + n.bridgeLifeExp + " — the gap to integrate between outer purpose and inner drive",
    "Bridge (Soul Urge ↔ Personality): " + n.bridgeSoulPers + " — the gap between authentic desire and how others see you",
    "Subconscious Self: " + n.subconsciousSelf + "/9 — natural response under pressure (9 = fully resourced; lower = fewer instinctive tools)",
    "First Vowel of birth name: " + n.firstVowel + " — primary soul motivation key",
    "Master Numbers present: " + (n.masterNumbers.length ? n.masterNumbers.join(", ") : "None"),
    "",
    "── INTENSITY TABLE (name letter frequency) ──",
    "Peak intensities (overemphasized traits): " + (n.intensityPeak || "None"),
    "Absent intensities (underdeveloped traits): " + (n.intensityAbsent || "None"),
    "Full breakdown: " + Object.entries(n.intensity).map(([k,v]) => k+"="+v).join(", "),
    "",
    "── PLANES OF EXPRESSION ──",
    "Physical: " + n.planes.Physical + " letters | Mental: " + n.planes.Mental + " | Emotional: " + n.planes.Emotional + " | Intuitive: " + n.planes.Intuitive,
    "Dominant plane: " + n.dominantPlane,
    "",
    "── MISSING NUMBERS (karmic lessons) ──",
    "Missing: " + (n.missing.join(", ") || "None — all numbers present"),
    "Karmic Debts: " + (n.karmicDebts.join(", ") || "None"),
    "",
    "── ARROWS OF PYTHAGORAS (birth date grid) ──",
    "Arrows PRESENT (gifts/strengths): " + (n.arrowsPresent.length ? n.arrowsPresent.join("; ") : "None"),
    "Arrows ABSENT (soul lessons/challenges): " + (n.arrowsMissing.length ? n.arrowsMissing.join("; ") : "None"),
    "",
    "── CHINESE METAPHYSICS ──",
    "Year animal (public self): " + n.chinese.element + " " + n.chinese.animal + " (" + n.chinese.polarity + ")",
    "Fixed element: " + n.chinese.fixedElement,
    "Inner animal / True nature (birth month): " + n.chinese.innerAnimal,
    "Secret animal (birth hour): " + n.chinese.secretAnimal,
    "",
    "── WESTERN ASTROLOGY ──",
    "Sun: " + (p.natalSun || n.sunSign) + (p.natalSunDeg ? " " + p.natalSunDeg + "°" : ""),
    "Moon: " + (p.natalMoon || "Not provided") + (p.natalMoonDeg ? " " + p.natalMoonDeg + "°" : "") + (p.natalMoonDeg === "29" ? " [ANARETIC DEGREE — heightened urgency, completing a soul cycle in this sign]" : ""),
    "Rising/ASC: " + (p.natalRising || "Not provided") + (p.natalRisingDeg ? " " + p.natalRisingDeg + "°" : ""),
    "Mercury: " + (p.natalMercury || "Not provided"),
    "Venus: " + (p.natalVenus || "Not provided"),
    "Mars: " + (p.natalMars || "Not provided"),
    "Jupiter: " + (p.natalJupiter || "Not provided"),
    "Saturn: " + (p.natalSaturn || "Not provided"),
    "Uranus: " + (p.natalUranus || "Not provided"),
    "Neptune: " + (p.natalNeptune || "Not provided"),
    "Pluto: " + (p.natalPluto || "Not provided"),
    "Chiron: " + (p.natalChiron || "Not provided"),
    "North Node: " + (p.natalNorthNode || "Not provided"),
    "South Node: " + (p.natalSouthNode || "Not provided"),
    "MC/10th: " + (p.natalHouse10 || "Not provided"),
    "IC/4th: " + (p.natalHouse4 || "Not provided"),
    "DSC/7th: " + (p.natalHouse7 || "Not provided"),
    "ASC/1st: " + (p.natalHouse1 || "Not provided"),
    "Part of Fortune: " + (p.natalPartFortune || "Not provided"),
    "Vertex: " + (p.natalVertex || "Not provided"),
    "Notable aspects/patterns: " + (p.natalAspects || "Not provided"),
    "",
    "── SHADOW & PERSONAL CONTEXT ──",
    "Shadow themes: " + (Array.isArray(p.shadowThemes) ? p.shadowThemes.join(", ") : p.shadowThemes || "Not specified"),
    "Shadow goal: " + (p.shadowGoal || "Not specified"),
    "Shadow depth readiness: " + (p.shadowDepth || 5) + "/10",
    "Childhood wound: " + (p.childhoodWound || "Not shared"),
    "Chakra focus: " + (p.chakraFocus && p.chakraFocus.length ? p.chakraFocus.join(", ") : "Not specified"),
    "Intentions: " + (p.goals || "Not specified"),
    "══════════════════════════════════════════",
    "",
  ];

  if (n.hasCurrent) {
    lines.push("NAME EVOLUTION — BIRTH vs CURRENT:");
    lines.push("Birth name: " + n.fullName);
    lines.push("Current name: " + n.currentFull);
    lines.push("Expression: " + n.expression + " → " + n.currentExpression + (n.expression === n.currentExpression ? " [unchanged]" : " [SHIFTED]"));
    lines.push("Soul Urge:   " + n.soulUrge + " → " + n.currentSoulUrge + (n.soulUrge === n.currentSoulUrge ? " [unchanged]" : " [SHIFTED]"));
    lines.push("Personality: " + n.personality + " → " + n.currentPersonality + (n.personality === n.currentPersonality ? " [unchanged]" : " [SHIFTED]"));
    lines.push("");
  }

  if (tier === "soul-spark") {
    lines.push("Generate ONLY these JSON fields: cosmicSnapshot, lifePath, expression, soulUrge, personalYear, chineseZodiac, soulMessage");
    lines.push("STRICT LENGTH LIMITS — exceed these and the JSON will be rejected:");
    lines.push(JSON.stringify({
      cosmicSnapshot: "2 sentences max. Theme + Life Path " + n.lifePath + " reference.",
      lifePath: { number: n.lifePath, title: "3-word title", essence: "1 sentence", reading: "3 sentences on soul purpose. Name " + name + ".", shadow: "1 sentence on ego trap" },
      expression: { number: n.expression, title: "3-word title", reading: "2 sentences on talents" },
      soulUrge: { number: n.soulUrge, title: "3-word title", reading: "2 sentences on inner desire" },
      personalYear: { number: n.personalYear, reading: "2 sentences on Personal Year " + n.personalYear },
      chineseZodiac: { sign: n.chinese.element + " " + n.chinese.animal, reading: "2 sentences" },
      soulMessage: "4 sentences to " + name + ". End with 1 sentence of pure truth."
    }));
  } else {
    lines.push("MANDATORY: Generate ALL JSON fields in the schema below. Every single field must contain real, specific content referencing the actual numbers and placements above. NEVER write placeholder text. NEVER leave a field as just a description of what it should contain. Write the actual reading.");
    lines.push("VERIFY BEFORE WRITING: Soul Urge=" + n.soulUrge + ", Expression=" + n.expression + ", Personality=" + n.personality + ", Missing=" + (n.missing.join(",") || "none") + ". These are the ONLY correct values. Do not recalculate.");
    lines.push(JSON.stringify({
      cosmicSnapshot: "3 sentences. Weave Life Path " + n.lifePath + ", Personal Year " + n.personalYear + ", and dominant plane (" + n.dominantPlane + ") into a single thematic arc for " + name + ".",

      numerology: {
        lifePath: {
          number: n.lifePath,
          title: "3-word evocative title",
          essence: "1 sentence on soul blueprint",
          reading: "4 sentences on purpose, gifts, soul contract. Use name " + name + ". Reference Phillips master number status if applicable.",
          shadow: "2 sentences on the ego trap and unconscious pattern",
          gifts: "1 sentence listing core gifts"
        },
        expression: { number: n.expression, title: "3-word title", reading: "3 sentences on natural talents and destiny role", shadow: "1 sentence" },
        soulUrge: { number: n.soulUrge, title: "3-word title", reading: "3 sentences on deepest heart desire and soul fuel", shadow: "1 sentence" },
        personality: { number: n.personality, title: "3-word title", reading: "2 sentences on how the world perceives them" },
        birthday: { number: n.birthday, title: "2-word title", reading: "2 sentences on the special gift of this birthday" },
        maturity: { number: n.maturity, reading: "2 sentences on what this soul is growing into after age 45" },

        bridgeNumbers: {
          lifeExpBridge: n.bridgeLifeExp,
          soulPersBridge: n.bridgeSoulPers,
          reading: "3 sentences on what gaps these bridges reveal — what needs integration between outer purpose and inner world"
        },

        subconsciousSelf: {
          number: n.subconsciousSelf,
          reading: "2 sentences on how " + name + " responds under pressure and what instinctive tools they naturally draw on"
        },

        firstVowel: {
          vowel: n.firstVowel,
          reading: "2 sentences on how this first vowel (" + n.firstVowel + ") shapes the primary motivation and approach to life per Phillips"
        },

        intensityTable: {
          peaks: n.intensityPeak,
          absences: n.intensityAbsent,
          reading: "3 sentences on the overemphasized energy patterns and what's missing from the name — what this creates in behavior and blind spots"
        },

        planesOfExpression: {
          physical: n.planes.Physical,
          mental: n.planes.Mental,
          emotional: n.planes.Emotional,
          intuitive: n.planes.Intuitive,
          dominant: n.dominantPlane,
          reading: "3 sentences on how this person processes and expresses life — are they driven by feeling, thinking, doing, or knowing? What does this distribution reveal about how they operate?"
        },

        arrowsOfPythagoras: {
          present: n.arrowsPresent.length ? n.arrowsPresent : ["None"],
          absent: n.arrowsMissing.length ? n.arrowsMissing : ["None"],
          reading: "4 sentences weaving together the active arrows (strengths) and absent arrows (soul lessons) into a coherent picture of this person's energetic gifts and growth edges"
        },

        missing: {
          numbers: n.missing,
          reading: "2 sentences on the karmic lessons embedded in " + (n.missing.join(", ") || "none — a rare, complete set")
        },

        karmicDebts: n.karmicDebts.length ? n.karmicDebts.join(", ") : null,
        karmicReading: n.karmicDebts.length ? "3 sentences on the karmic debt patterns of " + n.karmicDebts.join(", ") + " — origin, pattern, and path to resolution" : null,

        challenges: {
          sequence: n.challenges.join(" → "),
          active: n.activeChallenge,
          reading: "3 sentences on the 4-challenge arc and what the current challenge " + n.activeChallenge + " is demanding from " + name + " right now"
        },

        pinnacles: {
          sequence: n.pinnacles.join(" → "),
          active: n.activePinnacle,
          reading: "3 sentences on the pinnacle arc — past peaks, current pinnacle " + n.activePinnacle + " and its theme, what's coming next"
        },

        timing: {
          personalYear: n.personalYear,
          personalMonth: n.personalMonth,
          reading: "3 sentences on the convergence of Personal Year " + n.personalYear + " + Personal Month " + n.personalMonth + " + Pinnacle " + n.activePinnacle + " + Challenge " + n.activeChallenge + " — what is this exact moment calling for?"
        }
      },

      astrology: {
        sunReading: "3 sentences. " + (p.natalSun || n.sunSign) + " Sun — identity, vitality, conscious self. Cross-reference with Life Path " + n.lifePath,
        moonReading: "3 sentences. " + (p.natalMoon || "Moon") + " Moon — emotional body, instinctive reactions, inner child, what the soul craves for nourishment",
        risingReading: "3 sentences. " + (p.natalRising || "Rising") + " Rising — the mask, how this person enters rooms, first impressions, the body's lens on the world",
        innerPlanets: "3 sentences. Mercury " + (p.natalMercury||"?") + " (mind/communication) + Venus " + (p.natalVenus||"?") + " (love/values) + Mars " + (p.natalMars||"?") + " (drive/desire) — how do these shape how " + name + " thinks, loves, and acts?",
        socialPlanets: "2 sentences. Jupiter " + (p.natalJupiter||"?") + " (expansion/blessings) + Saturn " + (p.natalSaturn||"?") + " (structure/karma) — where does life open up and where does it demand mastery?",
        outerPlanets: "2 sentences. Uranus " + (p.natalUranus||"?") + " + Neptune " + (p.natalNeptune||"?") + " + Pluto " + (p.natalPluto||"?") + " — generational soul signature and collective mission layer",
        northNodeReading: "3 sentences. North Node " + (p.natalNorthNode||"?") + " / South Node " + (p.natalSouthNode||"?") + " — the soul's evolutionary direction and the comfortable past patterns to release",
        chironReading: "3 sentences. Chiron " + (p.natalChiron||"?") + " — the core wound, how it shows up, and the master healer gift hidden inside it",
        mc: p.natalHouse10 ? "2 sentences. MC " + p.natalHouse10 + " — public legacy, career calling, how the world is meant to know " + name : null,
        ic: p.natalHouse4 ? "2 sentences. IC " + p.natalHouse4 + " — ancestral roots, private self, the foundation everything is built on" : null,
        synthesis: "3 sentences weaving the whole chart into a unified soul story — what is the astrology saying in one clear voice?"
      },

      chineseZodiac: {
        yearAnimal: n.chinese.element + " " + n.chinese.animal + " (" + n.chinese.polarity + ")",
        innerAnimal: n.chinese.innerAnimal,
        secretAnimal: n.chinese.secretAnimal,
        fixedElement: n.chinese.fixedElement,
        reading: "3 sentences on the Year animal's core nature, strengths, and challenges for " + name,
        threeAnimals: "2 sentences weaving the year (public self), inner (emotional/private self), and secret (subconscious drive) animals into a three-layered portrait",
        crossReference: "2 sentences. How does the " + n.chinese.element + " " + n.chinese.animal + " interact with Life Path " + n.lifePath + " and the " + n.dominantPlane + " dominant plane?"
      },

      shadowWork: {
        coreWound: "3 sentences. Draw ONLY from the numbers (Life Path " + n.lifePath + ", missing " + (n.missing.join(",")||"none") + ", arrows), astrology, and ONLY what was explicitly shared in the form. Name the specific number or placement driving this pattern.",
        origin: "2 sentences on likely origin — draw from the numerology and chart data. Only reference biographical details if they were explicitly shared in the form.",
        theGold: "3 sentences on what integrating this shadow unlocks — name the specific superpower hidden in Life Path " + n.lifePath + " and the chart.",
        soulInvitation: "2 sentences — what is life specifically inviting " + name + " to stop doing and start embodying, based on Personal Year " + n.personalYear + " and active Challenge " + n.activeChallenge + "?",
        prompts: ["5 journal prompts. Each must reference specific data: a number, a placement, an arrow, or something explicitly shared. No generic prompts. Make each one crack something open for this specific soul."]
      },

      holisticSynthesis: {
        corePattern: "4 sentences — the single thread running through Life Path " + n.lifePath + ", Expression " + n.expression + ", missing numbers, arrows, astrology, and Chinese zodiac. What is the universe asking of " + name + "?",
        greatestGift: "3 sentences on the rarest most specific gift this combination produces",
        deepestChallenge: "3 sentences on the recurring friction that shows up across ALL systems",
        soulSignature: "1 unforgettable sentence that defines " + name + " at soul level",
        thisChapter: "2 sentences — what is the specific invitation of Personal Year " + n.personalYear + " in Pinnacle " + n.activePinnacle + " right now?"
      },

      soulMessage: "5 sentences written directly to " + name + ". Weave Life Path " + n.lifePath + ", the arrows, the active timing, and what you most need them to hear. End with one sentence of irreducible truth.",

      ...(n.hasCurrent ? { nameEvolution: {
        birthName: n.fullName,
        currentName: n.currentFull,
        expressionShift: n.expression + " → " + n.currentExpression,
        soulUrgeShift: n.soulUrge + " → " + n.currentSoulUrge,
        personalityShift: n.personality + " → " + n.currentPersonality,
        whatYouLeftBehind: "2 sentences",
        whatYouSteppedInto: "2 sentences",
        alignment: "2 sentences — was this name change soul-aligned expansion or a contraction?",
        integration: "1 sentence on what to reclaim from the birth name while honoring the current name"
      }} : {})
    }));
  }

  return lines.join("\n");
}

// ─── API ──────────────────────────────────────────────────
async function generateReading(p, tier, onProgress) {
  const prompt = buildPrompt(p, tier);
  const res = await fetch("/api/reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      system: "You are a numerology and astrology reading generator trained in David A. Phillips' Complete Book of Numerology. RULES: (1) Respond with ONLY a valid JSON object — no markdown, no backticks, no preamble. Start with { end with }. (2) Every field in the schema must contain actual reading content, not placeholder descriptions. (3) Only reference personal history explicitly shared in the form. (4) Verify numbers match exactly: do not recalculate or override the provided values.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error("Server error: " + res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const evt = JSON.parse(line.slice(6));
        if (evt.type === "delta") {
          accumulated += evt.text;
          onProgress && onProgress(accumulated.length);
        } else if (evt.type === "error") {
          throw new Error(evt.error);
        }
      } catch (e) {
        if (e.message && e.message !== "Stream error") continue;
        throw e;
      }
    }
  }

  let clean = accumulated.trim();
  clean = clean.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  const first = clean.indexOf("{");
  const last = clean.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    clean = clean.slice(first, last + 1);
  }
  try {
    return JSON.parse(clean);
  } catch (e) {
    const fixed = clean.replace(/,\s*([}\]])/g, "$1");
    try { return JSON.parse(fixed); } catch {}
    throw new Error("Reading complete but JSON failed. Please try again.");
  }
}

// ─── EMAIL ────────────────────────────────────────────────
function readingToText(r, name) {
  const lines = ["YOUR SACRED SOUL MAP — " + name.toUpperCase() + "\n" + "═".repeat(50) + "\n"];
  if (r.cosmicSnapshot) lines.push("COSMIC SNAPSHOT\n" + r.cosmicSnapshot + "\n");
  const N = r.numerology || {};
  if (N.lifePath) lines.push("LIFE PATH " + N.lifePath.number + " — " + (N.lifePath.title || "") + "\n" + (N.lifePath.reading || "") + "\n" + (N.lifePath.shadow ? "Shadow: " + N.lifePath.shadow : "") + "\n");
  if (N.expression) lines.push("EXPRESSION " + N.expression.number + "\n" + (N.expression.reading || "") + "\n");
  if (N.soulUrge) lines.push("SOUL URGE " + N.soulUrge.number + "\n" + (N.soulUrge.reading || "") + "\n");
  if (N.bridgeNumbers) lines.push("BRIDGE NUMBERS\n" + N.bridgeNumbers.reading + "\n");
  if (N.arrowsOfPythagoras) lines.push("ARROWS OF PYTHAGORAS\n" + N.arrowsOfPythagoras.reading + "\n");
  if (N.timing) lines.push("YOUR TIMING NOW\n" + N.timing.reading + "\n");
  if (N.personalYear) lines.push("PERSONAL YEAR " + (N.personalYear.personalYear || N.personalYear.number) + "\n" + (N.personalYear.reading || "") + "\n");
  if (r.lifePath) lines.push("LIFE PATH " + r.lifePath.number + " — " + (r.lifePath.title || "") + "\n" + (r.lifePath.reading || "") + "\n");
  if (r.expression) lines.push("EXPRESSION " + r.expression.number + "\n" + (r.expression.reading || "") + "\n");
  if (r.soulUrge) lines.push("SOUL URGE " + r.soulUrge.number + "\n" + (r.soulUrge.reading || "") + "\n");
  if (r.personalYear) lines.push("PERSONAL YEAR " + r.personalYear.number + "\n" + (r.personalYear.reading || "") + "\n");
  if (r.chineseZodiac) lines.push("CHINESE ZODIAC — " + r.chineseZodiac.sign + "\n" + (r.chineseZodiac.reading || "") + "\n");
  if (r.astrology) {
    lines.push("ASTROLOGY\n");
    ["sunReading","moonReading","risingReading","innerPlanets","northNodeReading","chironReading","synthesis"].forEach(k => {
      if (r.astrology[k]) lines.push(r.astrology[k] + "\n");
    });
  }
  if (r.shadowWork) {
    lines.push("SHADOW WORK\n" + (r.shadowWork.coreWound || "") + "\n" + (r.shadowWork.theGold || "") + "\n");
    if (r.shadowWork.prompts) lines.push("Journal Prompts:\n" + r.shadowWork.prompts.map((q, i) => (i+1) + ". " + q).join("\n") + "\n");
  }
  if (r.holisticSynthesis) lines.push("HOLISTIC SYNTHESIS\n" + (r.holisticSynthesis.corePattern || "") + "\n" + (r.holisticSynthesis.soulSignature || "") + "\n");
  if (r.soulMessage) lines.push("═".repeat(50) + "\nA MESSAGE FOR " + name.toUpperCase() + "\n" + r.soulMessage);
  return lines.join("\n");
}

async function sendEmail(toEmail, toName, tierName, reading) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: CFG.EMAILJS_SERVICE_ID,
      template_id: CFG.EMAILJS_TEMPLATE_ID,
      user_id: CFG.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_name: toName, to_email: toEmail,
        subject: "Your " + tierName + " Reading — " + toName,
        reading_text: readingToText(reading, toName),
        tier_name: tierName, reply_to: CFG.PRACTITIONER_EMAIL
      }
    })
  });
  if (!res.ok) throw new Error("EmailJS " + res.status);
}

// ─── TIERS ────────────────────────────────────────────────
const TIERS = [
  { id: "soul-spark", name: "Soul Spark", price: "$47", color: "#C8A96E",
    desc: "6 core numbers · Chinese zodiac · Soul message",
    includes: ["Life Path · Expression · Soul Urge", "Personal Year", "Chinese Zodiac", "Soul Message"] },
  { id: "cosmic-self", name: "Cosmic Self", price: "$97", color: "#9B7ED4", popular: true,
    desc: "Complete Phillips system · Natal chart · Shadow work · Holistic synthesis",
    includes: ["Everything in Soul Spark", "All Phillips depth numbers", "Arrows of Pythagoras", "Natal astrology deep dive", "Shadow Work + 5 Prompts", "Holistic Synthesis"] },
  { id: "soul-connections", name: "Soul Connections", price: "$197", color: "#D47E9B",
    desc: "Full reading for you + one other + compatibility",
    includes: ["Full Cosmic Self for both", "Compatibility analysis", "Soul contract reading", "Shared shadow patterns"] },
  { id: "full-realm", name: "Full Realm", price: "$397", color: "#7EC4D4",
    desc: "Up to 5 people · Full readings + group dynamics",
    includes: ["Full Cosmic Self for up to 5", "Group arrow analysis", "Collective shadow", "Missing group energies"] },
];

// ─── FORM OPTIONS ─────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"].map((l,i) => ({ v: String(i+1), l }));
const DAYS = Array.from({length:31}, (_,i) => ({ v: String(i+1), l: String(i+1) }));
const CY = new Date().getFullYear();
const YEARS = Array.from({length:110}, (_,i) => ({ v: String(CY-i), l: String(CY-i) }));
const ZODIAC = [{v:"",l:"— Select —"},{v:"Aries",l:"♈ Aries"},{v:"Taurus",l:"♉ Taurus"},{v:"Gemini",l:"♊ Gemini"},{v:"Cancer",l:"♋ Cancer"},{v:"Leo",l:"♌ Leo"},{v:"Virgo",l:"♍ Virgo"},{v:"Libra",l:"♎ Libra"},{v:"Scorpio",l:"♏ Scorpio"},{v:"Sagittarius",l:"♐ Sagittarius"},{v:"Capricorn",l:"♑ Capricorn"},{v:"Aquarius",l:"♒ Aquarius"},{v:"Pisces",l:"♓ Pisces"}];
const SHADOW_THEMES = ["Abandonment & fear of being left","Worthiness & not feeling enough","Control & trust issues","People-pleasing & losing self","Anger & unexpressed emotion","Scarcity & money wounds","Intimacy avoidance","Perfectionism & fear of failure","Visibility fear & playing small","Grief & unprocessed loss","Codependency & enmeshment","Identity confusion","Generational & ancestral patterns","Self-sabotage & repeating cycles","Shame & inner critic","Boundary issues"];
const CHAKRAS = [{name:"Root",color:"#C0392B",desc:"Safety · Grounding"},{name:"Sacral",color:"#E67E22",desc:"Creativity · Emotion"},{name:"Solar Plexus",color:"#F1C40F",desc:"Power · Identity"},{name:"Heart",color:"#27AE60",desc:"Love · Connection"},{name:"Throat",color:"#2980B9",desc:"Expression · Truth"},{name:"Third Eye",color:"#8E44AD",desc:"Intuition · Vision"},{name:"Crown",color:"#BDC3C7",desc:"Oneness · Purpose"}];

function MP({label, items, selected, onChange, color="#9B7ED4", cols=2}) {
  return <div style={{marginBottom:18}}>
    {label && <Lbl c={label} />}
    <div style={{display:"grid",gridTemplateColumns:"repeat("+cols+",1fr)",gap:6}}>
      {items.map(item => {
        const val = typeof item === "string" ? item : (item.id || item);
        const lbl = typeof item === "string" ? item : (item.label || item.id);
        const icon = item.icon || null;
        const on = selected.includes(val);
        return <div key={val} onClick={() => onChange(on ? selected.filter(x => x !== val) : [...selected, val])} style={{padding:"8px 10px",borderRadius:5,cursor:"pointer",border:on?"1px solid "+color+"66":"1px solid rgba(255,255,255,.07)",background:on?color+"14":"rgba(255,255,255,.02)",display:"flex",alignItems:"center",gap:7,transition:"all .18s"}}>
          {icon && <span style={{fontSize:13}}>{icon}</span>}
          <span style={{fontSize:11,color:on?"#fff":"rgba(255,255,255,.4)",flex:1,lineHeight:1.4}}>{lbl}</span>
          {on && <span style={{color,fontSize:10}}>✦</span>}
        </div>;
      })}
    </div>
  </div>;
}

function ChakraPicker({selected, onChange}) {
  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:7,marginBottom:16}}>
    {CHAKRAS.map(c => {
      const on = selected.includes(c.name);
      return <div key={c.name} onClick={() => onChange(on ? selected.filter(x => x !== c.name) : [...selected, c.name])} style={{padding:"10px 8px",borderRadius:6,cursor:"pointer",border:on?"1px solid "+c.color+"77":"1px solid rgba(255,255,255,.06)",background:on?c.color+"14":"rgba(255,255,255,.02)",textAlign:"center",transition:"all .18s"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:c.color,margin:"0 auto 5px"}} />
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:on?"#fff":"rgba(255,255,255,.42)",marginBottom:2}}>{c.name}</div>
        <div style={{fontSize:9,color:on?c.color:"rgba(255,255,255,.2)",lineHeight:1.4}}>{c.desc}</div>
      </div>;
    })}
  </div>;
}

const emptyP = () => ({
  preferredName:"", legalFirst:"", legalMiddle:"", legalLast:"",
  currentFirst:"", currentMiddle:"", currentLast:"",
  bMonth:"", bDay:"", bYear:"", timeKnown:"", bHour:"", bMinute:"",
  bCity:"", bState:"", bCountry:"",
  natalSunDeg:"", natalMoonDeg:"", natalRisingDeg:"",
  natalSun:"", natalMoon:"", natalRising:"", natalMercury:"", natalVenus:"", natalMars:"",
  natalJupiter:"", natalSaturn:"", natalUranus:"", natalNeptune:"", natalPluto:"",
  natalChiron:"", natalNorthNode:"", natalSouthNode:"",
  natalHouse1:"", natalHouse4:"", natalHouse7:"", natalHouse10:"",
  natalPartFortune:"", natalVertex:"",
  natalAspects:"", natalSource:"",
  shadowThemes:[], recurringPatterns:"", childhoodWound:"", shadowDepth:5, shadowGoal:"",
  meditationFocus:[], meditationExp:"", currentPractice:"", chakraFocus:[], freqInterest:[], binauralInterest:[],
  goals:""
});

// ─── UI PRIMITIVES ────────────────────────────────────────
const bs = { width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(200,169,110,0.2)", borderRadius:4, padding:"10px 14px", color:"#fff", fontSize:14, fontFamily:"'Lora',serif", outline:"none" };
const foc = e => { e.target.style.border = "1px solid rgba(200,169,110,0.6)"; };
const blr = e => { e.target.style.border = "1px solid rgba(200,169,110,0.2)"; };

function Lbl({ c, r }) {
  return <label style={{ display:"block", fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#C8A96E", marginBottom:5 }}>{c}{r && <span style={{ color:"#D47E9B" }}> *</span>}</label>;
}
function TI({ l, t="text", v, s, p, r }) {
  return <div style={{ marginBottom:16 }}><Lbl c={l} r={r} /><input type={t} value={v} onChange={e => s(e.target.value)} placeholder={p} style={bs} onFocus={foc} onBlur={blr} /></div>;
}
function TS({ l, v, s, opts, r }) {
  return <div style={{ marginBottom:16 }}>{l && <Lbl c={l} r={r} />}<select value={v} onChange={e => s(e.target.value)} style={{ ...bs, background:"rgba(14,8,30,.95)", cursor:"pointer", color:v?"#fff":"rgba(255,255,255,.3)" }}><option value="" disabled hidden>Select…</option>{opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
}
function TTA({ l, v, s, p, rows=3 }) {
  return <div style={{ marginBottom:16 }}>{l && <Lbl c={l} />}<textarea value={v} onChange={e => s(e.target.value)} placeholder={p} rows={rows} style={{ ...bs, resize:"vertical" }} onFocus={foc} onBlur={blr} /></div>;
}
function GD({ label }) {
  return <div style={{ display:"flex", alignItems:"center", gap:10, margin:"22px 0 16px" }}>
    <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(200,169,110,0.3))" }} />
    <span style={{ color:"#C8A96E", fontSize:10, fontFamily:"'Cinzel',serif", letterSpacing:"0.18em", textTransform:"uppercase", whiteSpace:"nowrap", opacity:.7 }}>{label || "✦"}</span>
    <div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,rgba(200,169,110,0.3))" }} />
  </div>;
}

// ─── READING DISPLAY ──────────────────────────────────────
function Card({ title, number, subtitle, text, shadow, gifts, color="#C8A96E" }) {
  const [open, setOpen] = useState(false);
  return <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid " + color + "1a", borderRadius:7, marginBottom:9, overflow:"hidden" }}>
    <div onClick={() => setOpen(!open)} style={{ padding:"12px 15px", cursor:"pointer", display:"flex", alignItems:"center", gap:11 }}>
      {number != null && <div style={{ minWidth:34, height:34, borderRadius:"50%", background:color+"16", border:"1px solid "+color+"44", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel',serif", color, fontSize:15, fontWeight:600 }}>{number}</div>}
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color, marginBottom:1 }}>{title}</div>
        {subtitle && <div style={{ fontSize:11, color:"rgba(255,255,255,.38)", fontStyle:"italic" }}>{subtitle}</div>}
      </div>
      <span style={{ color, fontSize:13, transition:"transform .2s", display:"inline-block", transform:open?"rotate(90deg)":"none" }}>›</span>
    </div>
    {open && <div style={{ padding:"0 15px 15px", borderTop:"1px solid "+color+"14" }}>
      {text && <p style={{ fontSize:13, color:"rgba(255,255,255,.72)", lineHeight:1.88, marginTop:12, whiteSpace:"pre-wrap" }}>{text}</p>}
      {gifts && <div style={{ marginTop:10, padding:"9px 13px", background:"rgba(200,169,110,.05)", borderRadius:4 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color, textTransform:"uppercase", marginBottom:4 }}>Gifts</div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.55)", lineHeight:1.8 }}>{gifts}</p>
      </div>}
      {shadow && <div style={{ marginTop:9, padding:"9px 13px", background:"rgba(0,0,0,.2)", borderLeft:"2px solid "+color+"44", borderRadius:"0 4px 4px 0" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color, textTransform:"uppercase", marginBottom:4 }}>Shadow</div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.48)", lineHeight:1.8, fontStyle:"italic" }}>{shadow}</p>
      </div>}
    </div>}
  </div>;
}

function Sec({ icon, title, color="#C8A96E", badge, children }) {
  return <div style={{ background:"rgba(255,255,255,.015)", border:"1px solid "+color+"18", borderRadius:9, padding:"20px 20px 16px", marginBottom:18, position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,"+color+",transparent)" }} />
    <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:".15em", textTransform:"uppercase", color, flex:1 }}>{title}</h3>
      {badge && <span style={{ fontSize:9, fontFamily:"'Cinzel',serif", background:color+"22", color, border:"1px solid "+color+"44", borderRadius:20, padding:"2px 9px", letterSpacing:".1em" }}>{badge}</span>}
    </div>
    {children}
  </div>;
}

function InfoBlock({ label, text, color="#C8A96E" }) {
  if (!text || text === "null" || text === null) return null;
  return <div style={{ marginBottom:14 }}>
    <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color, marginBottom:5, opacity:.8 }}>{label}</div>
    <p style={{ fontSize:13, color:"rgba(255,255,255,.68)", lineHeight:1.88 }}>{text}</p>
  </div>;
}

function ReadingView({ reading: r, name, onEmail, emailSt }) {
  const [copied, setCopied] = useState(false);
  if (!r) return null;

  const N = r.numerology || {};
  const LP = N.lifePath || r.lifePath;
  const EX = N.expression || r.expression;
  const SU = N.soulUrge || r.soulUrge;
  const PE = N.personality || r.personality;
  const BD = N.birthday || r.birthday;
  const PY = N.personalYear || r.personalYear;

  const copy = () => {
    navigator.clipboard.writeText(readingToText(r, name)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  return <div>
    {r.cosmicSnapshot && <div style={{ textAlign:"center", padding:"24px 18px", background:"linear-gradient(135deg,rgba(200,169,110,.06),rgba(155,126,212,.06))", border:"1px solid rgba(200,169,110,.2)", borderRadius:10, marginBottom:20 }}>
      <div style={{ fontSize:26, marginBottom:10 }}>✦</div>
      <p style={{ fontSize:14, color:"rgba(255,255,255,.78)", lineHeight:2, fontStyle:"italic", maxWidth:620, margin:"0 auto" }}>{r.cosmicSnapshot}</p>
    </div>}

    {(LP || EX || SU) && <Sec icon="🔢" title="Numerology — David A. Phillips System" color="#C8A96E">
      {LP && <Card title="Life Path" number={LP.number} subtitle={LP.title} text={LP.reading} shadow={LP.shadow} gifts={LP.gifts} color="#C8A96E" />}
      {EX && <Card title="Expression / Destiny" number={EX.number} subtitle={EX.title} text={EX.reading} shadow={EX.shadow} color="#C8A96E" />}
      {SU && <Card title="Soul Urge / Heart's Desire" number={SU.number} subtitle={SU.title} text={SU.reading} shadow={SU.shadow} color="#C8A96E" />}
      {PE && <Card title="Personality" number={PE.number} subtitle={PE.title} text={PE.reading} color="#7EC4D4" />}
      {BD && <Card title="Birthday Number" number={BD.number} subtitle={BD.title} text={BD.reading} color="#7EC4D4" />}
      {N.maturity && <Card title="Maturity Number" number={N.maturity.number} text={N.maturity.reading} color="#7EC4D4" />}
    </Sec>}

    {N.firstVowel && <Sec icon="🔡" title="First Vowel · Subconscious Self · Bridge Numbers" color="#D47E9B">
      {N.firstVowel && <InfoBlock label={"First Vowel — " + N.firstVowel.vowel} text={N.firstVowel.reading} color="#D47E9B" />}
      {N.subconsciousSelf && <InfoBlock label={"Subconscious Self — " + N.subconsciousSelf.number + "/9"} text={N.subconsciousSelf.reading} color="#D47E9B" />}
      {N.bridgeNumbers && <InfoBlock label="Bridge Numbers" text={N.bridgeNumbers.reading} color="#D47E9B" />}
    </Sec>}

    {N.intensityTable && <Sec icon="📊" title="Intensity Table — Name Letter Frequency" color="#9B7ED4">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <div style={{ background:"rgba(155,126,212,.06)", border:"1px solid rgba(155,126,212,.2)", borderRadius:5, padding:"10px 12px" }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"#9B7ED4", letterSpacing:".12em", textTransform:"uppercase", marginBottom:5 }}>Peak Intensities</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.7)" }}>{N.intensityTable.peaks || "—"}</div>
        </div>
        <div style={{ background:"rgba(212,126,155,.06)", border:"1px solid rgba(212,126,155,.2)", borderRadius:5, padding:"10px 12px" }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, color:"#D47E9B", letterSpacing:".12em", textTransform:"uppercase", marginBottom:5 }}>Absent Numbers</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.7)" }}>{N.intensityTable.absences || "None"}</div>
        </div>
      </div>
      <InfoBlock label="What This Reveals" text={N.intensityTable.reading} color="#9B7ED4" />
    </Sec>}

    {N.planesOfExpression && <Sec icon="🌊" title="Planes of Expression" color="#7EC4D4">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
        {[["Physical","#E67E22"],["Mental","#3498DB"],["Emotional","#E74C3C"],["Intuitive","#9B59B6"]].map(([plane, col]) => (
          <div key={plane} style={{ background:"rgba(255,255,255,.03)", border:"1px solid "+col+"33", borderRadius:5, padding:"9px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontFamily:"'Cinzel',serif", color:col, fontWeight:600 }}>{N.planesOfExpression[plane.toLowerCase()] || 0}</div>
            <div style={{ fontSize:9, fontFamily:"'Cinzel',serif", color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:".1em", marginTop:3 }}>{plane}</div>
            {N.planesOfExpression.dominant === plane && <div style={{ fontSize:8, color:col, marginTop:2 }}>✦ dominant</div>}
          </div>
        ))}
      </div>
      <InfoBlock label="What This Means" text={N.planesOfExpression.reading} color="#7EC4D4" />
    </Sec>}

    {N.arrowsOfPythagoras && <Sec icon="⟶" title="Arrows of Pythagoras — Birth Date Grid" color="#C8A96E" badge="Phillips System">
      {N.arrowsOfPythagoras.present && N.arrowsOfPythagoras.present[0] !== "None" && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:"#C8A96E", marginBottom:7, opacity:.8 }}>✦ Arrows of Strength</div>
          {N.arrowsOfPythagoras.present.map((a, i) => <div key={i} style={{ fontSize:12, color:"rgba(255,255,255,.6)", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>{a}</div>)}
        </div>
      )}
      {N.arrowsOfPythagoras.absent && N.arrowsOfPythagoras.absent[0] !== "None" && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:"#9B7ED4", marginBottom:7, opacity:.8 }}>◌ Absent Arrows (Soul Lessons)</div>
          {N.arrowsOfPythagoras.absent.map((a, i) => <div key={i} style={{ fontSize:12, color:"rgba(155,126,212,.7)", padding:"4px 0", borderBottom:"1px solid rgba(155,126,212,.07)" }}>{a}</div>)}
        </div>
      )}
      <InfoBlock label="Reading" text={N.arrowsOfPythagoras.reading} color="#C8A96E" />
    </Sec>}

    {(N.challenges || N.pinnacles) && <Sec icon="⏳" title="Life Arc — Pinnacles & Challenges" color="#9B7ED4">
      {N.challenges && <InfoBlock label={"Challenge Arc · Active: " + N.challenges.active} text={N.challenges.reading} color="#D47E9B" />}
      {N.pinnacles && <InfoBlock label={"Pinnacle Arc · Active: " + N.pinnacles.active} text={N.pinnacles.reading} color="#9B7ED4" />}
      {N.timing && <div style={{ marginTop:10, padding:"12px 14px", background:"rgba(126,196,212,.05)", border:"1px solid rgba(126,196,212,.18)", borderRadius:6 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:"#7EC4D4", marginBottom:6 }}>✦ Your Exact Timing Right Now</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.72)", lineHeight:1.88 }}>{N.timing.reading}</p>
      </div>}
    </Sec>}

    {(N.missing || N.karmicReading) && <Sec icon="🔓" title="Missing Numbers & Karmic Debts" color="#D47E9B">
      {N.missing && N.missing.reading && <InfoBlock label={"Missing Numbers — " + (N.missing.numbers || []).join(", ") || "None"} text={N.missing.reading} color="#9B7ED4" />}
      {N.karmicReading && N.karmicReading !== "null" && <div style={{ padding:"11px 14px", background:"rgba(212,126,155,.06)", border:"1px solid rgba(212,126,155,.2)", borderRadius:6 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#D47E9B", marginBottom:5 }}>⚠ Karmic Debt — {N.karmicDebts}</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.85 }}>{N.karmicReading}</p>
      </div>}
    </Sec>}

    {r.astrology && <Sec icon="🌙" title="Astrology — Natal Chart Reading" color="#7EC4D4">
      <InfoBlock label="☀️ Sun — Identity & Purpose" text={r.astrology.sunReading} color="#7EC4D4" />
      <InfoBlock label="🌙 Moon — Emotional World" text={r.astrology.moonReading} color="#7EC4D4" />
      <InfoBlock label="↑ Rising — How You Appear" text={r.astrology.risingReading} color="#7EC4D4" />
      <InfoBlock label="☿ ♀ ♂ Inner Planets" text={r.astrology.innerPlanets} color="#7EC4D4" />
      <InfoBlock label="♃ ♄ Social Planets" text={r.astrology.socialPlanets} color="#7EC4D4" />
      <InfoBlock label="♅ ♆ ♇ Outer Planets — Generational" text={r.astrology.outerPlanets} color="#9B7ED4" />
      <InfoBlock label="☊ North Node / South Node — Soul Direction" text={r.astrology.northNodeReading} color="#C8A96E" />
      <InfoBlock label="⚷ Chiron — The Sacred Wound" text={r.astrology.chironReading} color="#D47E9B" />
      <InfoBlock label="MC — Public Calling" text={r.astrology.mc} color="#7EC4D4" />
      <InfoBlock label="IC — Ancestral Foundation" text={r.astrology.ic} color="#7EC4D4" />
      {r.astrology.synthesis && <div style={{ marginTop:12, padding:"12px 14px", background:"rgba(126,196,212,.05)", border:"1px solid rgba(126,196,212,.18)", borderRadius:6 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:"#7EC4D4", marginBottom:6 }}>✦ Chart Synthesis</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.72)", lineHeight:1.88 }}>{r.astrology.synthesis}</p>
      </div>}
    </Sec>}

    {r.chineseZodiac && <Sec icon="🐉" title={"Chinese Zodiac — Three Animal System"} color="#D47E9B">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
        {[["Year Animal","Public Self",r.chineseZodiac.yearAnimal,"#D47E9B"],["Inner Animal","True Nature",r.chineseZodiac.innerAnimal,"#C8A96E"],["Secret Animal","Hidden Drive",r.chineseZodiac.secretAnimal,"#9B7ED4"]].map(([role,desc,val,col]) => val && (
          <div key={role} style={{ background:col+"0a", border:"1px solid "+col+"33", borderRadius:5, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:9, fontFamily:"'Cinzel',serif", color:col+"99", textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>{role}</div>
            <div style={{ fontSize:11, color:"#fff", fontFamily:"'Cinzel',serif", marginBottom:2 }}>{val}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.35)" }}>{desc}</div>
          </div>
        ))}
      </div>
      <InfoBlock label="Reading" text={r.chineseZodiac.reading} color="#D47E9B" />
      <InfoBlock label="Three Animals Portrait" text={r.chineseZodiac.threeAnimals} color="#D47E9B" />
      <InfoBlock label="Cross-Reference with Numerology" text={r.chineseZodiac.crossReference} color="#C8A96E" />
    </Sec>}

    {r.nameEvolution && <Sec icon="✦" title={"Name Evolution: " + r.nameEvolution.birthName + " → " + r.nameEvolution.currentName} color="#C8A96E">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
        {[["Expression",r.nameEvolution.expressionShift],["Soul Urge",r.nameEvolution.soulUrgeShift],["Personality",r.nameEvolution.personalityShift]].map(([label,shift]) => {
          const parts = (shift||"").split(" → ");
          const changed = parts[0] !== parts[1];
          return <div key={label} style={{background:"rgba(200,169,110,.07)",border:"1px solid rgba(200,169,110,.2)",borderRadius:5,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".12em",color:"rgba(200,169,110,.6)",textTransform:"uppercase",marginBottom:6}}>{label}</div>
            <div style={{fontSize:16,color:"#C8A96E",fontFamily:"'Cinzel',serif"}}>{shift}</div>
            <div style={{fontSize:10,color:changed?"#7EC4D4":"rgba(255,255,255,.3)",marginTop:4}}>{changed ? "✦ Shifted" : "Unchanged"}</div>
          </div>;
        })}
      </div>
      <InfoBlock label="What You Left Behind" text={r.nameEvolution.whatYouLeftBehind} color="rgba(200,169,110,.7)" />
      <InfoBlock label="What You Stepped Into" text={r.nameEvolution.whatYouSteppedInto} color="rgba(126,196,212,.7)" />
      <InfoBlock label="Soul Alignment" text={r.nameEvolution.alignment} color="rgba(155,126,212,.7)" />
      <InfoBlock label="Integration" text={r.nameEvolution.integration} color="rgba(126,196,212,.6)" />
    </Sec>}

    {r.shadowWork && <Sec icon="🌑" title="Shadow Work & Integration" color="#9B7ED4">
      <InfoBlock label="Core Wound" text={r.shadowWork.coreWound} color="#9B7ED4" />
      <InfoBlock label="Origin" text={r.shadowWork.origin} color="#9B7ED4" />
      <InfoBlock label="The Gold — What Integrating Unlocks" text={r.shadowWork.theGold} color="#C8A96E" />
      <InfoBlock label="Soul Invitation" text={r.shadowWork.soulInvitation} color="#D47E9B" />
      {r.shadowWork.prompts && r.shadowWork.prompts.length > 0 && <div style={{ background:"rgba(155,126,212,.05)", border:"1px solid rgba(155,126,212,.18)", borderRadius:7, padding:"14px 16px" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#9B7ED4", marginBottom:11 }}>Journal Prompts</div>
        {r.shadowWork.prompts.map((prompt, i) => (
          <div key={i} style={{ display:"flex", gap:9, marginBottom:9 }}>
            <span style={{ color:"#9B7ED4", fontSize:11, marginTop:2, flexShrink:0 }}>{i+1}.</span>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.8, fontStyle:"italic" }}>{prompt}</p>
          </div>
        ))}
      </div>}
    </Sec>}

    {r.holisticSynthesis && <Sec icon="🌐" title="Holistic Synthesis — All Systems United" color="#C8A96E">
      <InfoBlock label="Core Pattern — The Single Thread" text={r.holisticSynthesis.corePattern} color="#C8A96E" />
      {r.holisticSynthesis.greatestGift && <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(200,169,110,.06)", borderRadius:6, border:"1px solid rgba(200,169,110,.15)" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#C8A96E", textTransform:"uppercase", marginBottom:6 }}>✦ Greatest Gift</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.88 }}>{r.holisticSynthesis.greatestGift}</p>
      </div>}
      {r.holisticSynthesis.deepestChallenge && <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(155,126,212,.06)", borderRadius:6, border:"1px solid rgba(155,126,212,.15)" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#9B7ED4", textTransform:"uppercase", marginBottom:6 }}>◌ Deepest Challenge</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.88 }}>{r.holisticSynthesis.deepestChallenge}</p>
      </div>}
      {r.holisticSynthesis.thisChapter && <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(126,196,212,.06)", borderRadius:6, border:"1px solid rgba(126,196,212,.15)" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#7EC4D4", textTransform:"uppercase", marginBottom:6 }}>↳ This Chapter — Right Now</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.88 }}>{r.holisticSynthesis.thisChapter}</p>
      </div>}
      {r.holisticSynthesis.soulSignature && <div style={{ textAlign:"center", padding:"14px", background:"rgba(200,169,110,.04)", borderRadius:6 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#C8A96E", textTransform:"uppercase", marginBottom:6 }}>Soul Signature</div>
        <p style={{ fontSize:15, color:"rgba(255,255,255,.9)", lineHeight:1.88, fontStyle:"italic" }}>{r.holisticSynthesis.soulSignature}</p>
      </div>}
    </Sec>}

    {r.soulMessage && <div style={{ textAlign:"center", padding:"26px 20px", background:"linear-gradient(135deg,rgba(155,126,212,.08),rgba(200,169,110,.08))", border:"1px solid rgba(200,169,110,.22)", borderRadius:10, marginBottom:20 }}>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".25em", textTransform:"uppercase", color:"#C8A96E", marginBottom:13, opacity:.7 }}>A Message for {name}</div>
      <p style={{ fontSize:14, color:"rgba(255,255,255,.82)", lineHeight:2.1, fontStyle:"italic", maxWidth:600, margin:"0 auto" }}>{r.soulMessage}</p>
    </div>}

    <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
      <button onClick={onEmail} style={{ padding:"12px 26px", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:".18em", textTransform:"uppercase", cursor:"pointer", borderRadius:4, transition:"all .3s", background:emailSt==="sent"?"rgba(39,174,96,.2)":emailSt==="error"?"rgba(192,57,43,.2)":"linear-gradient(135deg,rgba(200,169,110,.2),rgba(200,169,110,.35))", border:emailSt==="sent"?"1px solid #27ae60":emailSt==="error"?"1px solid #c0392b":"1px solid #C8A96E", color:emailSt==="sent"?"#27ae60":emailSt==="error"?"#e74c3c":"#C8A96E" }}>
        {emailSt==="sending" ? "Sending…" : emailSt==="sent" ? "✓ Sent!" : emailSt==="error" ? "⚠ Failed" : "✉ Email Reading"}
      </button>
      <button onClick={copy} style={{ padding:"12px 26px", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:".18em", textTransform:"uppercase", cursor:"pointer", borderRadius:4, background:"transparent", border:"1px solid rgba(255,255,255,.12)", color:"rgba(255,255,255,.42)" }}>
        {copied ? "✓ Copied" : "⎘ Copy Text"}
      </button>
    </div>
  </div>;
}

// ─── STARS ────────────────────────────────────────────────
function Stars() {
  return <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 20% 50%,#1a0a2e 0%,#0d0d1a 60%,#000 100%)" }}>
    {Array.from({ length:85 }, (_, i) => (
      <div key={i} style={{ position:"absolute", width:((i%3)*0.7+0.5)+"px", height:((i%3)*0.7+0.5)+"px", borderRadius:"50%", background:"rgba(255,255,255,"+(((i%5)*0.1)+0.15)+")", top:((i*17.3)%100)+"%", left:((i*23.7)%100)+"%", animation:"tw "+((i%4)+2)+"s ease-in-out infinite", animationDelay:(i*0.09)+"s" }} />
    ))}
  </div>;
}

// ─── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("tier");
  const [tierId, setTierId] = useState(null);
  const [person, setPerson] = useState(emptyP());
  const [email, setEmail] = useState("");
  const [legalConsent, setLegalConsent] = useState(false);
  const [reading, setReading] = useState(null);
  const [genMsg, setGenMsg] = useState("");
  const [streamChars, setStreamChars] = useState(0);
  const [emailSt, setEmailSt] = useState("");
  const [err, setErr] = useState("");

  const tier = TIERS.find(t => t.id === tierId);
  const isFull = tierId && tierId !== "soul-spark";

  const pickTier = id => { setTierId(id); setStep("form"); window.scrollTo({ top:0, behavior:"smooth" }); };

  const submit = async () => {
    if (!email) { alert("Please enter your email."); return; }
    setStep("gen"); setErr("");
    const msgs = ["Calculating your sacred numbers…","Building the Arrows of Pythagoras…","Reading the natal chart…","Weaving your complete reading…","Almost ready…"];
    let mi = 0; setGenMsg(msgs[0]);
    const iv = setInterval(() => { mi = (mi+1) % msgs.length; setGenMsg(msgs[mi]); }, 2800);
    try {
      const r = await generateReading(person, tierId, count => setStreamChars(count));
      clearInterval(iv); setReading(r); setStep("results");
      window.scrollTo({ top:0, behavior:"smooth" });
    } catch (e) {
      clearInterval(iv); setErr("Generation failed: " + e.message); setStep("form");
    }
  };

  const sendMail = async () => {
    const name = person.preferredName || person.legalFirst || "Friend";
    setEmailSt("sending");
    try { await sendEmail(email, name, tier && tier.name || "Cosmic", reading); setEmailSt("sent"); }
    catch (e) { console.error(e); setEmailSt("error"); }
  };

  const reset = () => { setStep("tier"); setTierId(null); setPerson(emptyP()); setReading(null); setEmail(""); setEmailSt(""); setErr(""); };
  const upd = u => setPerson(p => ({ ...p, ...u }));

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cinzel+Decorative:wght@400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      @keyframes tw{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.85;transform:scale(1.4)}}
      @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d0d1a}::-webkit-scrollbar-thumb{background:rgba(200,169,110,.3);border-radius:2px}
      select option{background:#14082a!important;color:#fff}
    `}</style>
    <Stars />
    <div style={{ position:"relative", zIndex:1, minHeight:"100vh", fontFamily:"'Lora',serif", color:"#fff", padding:"0 16px 80px" }}>

      {/* Header */}
      <div style={{ textAlign:"center", paddingTop:44, paddingBottom:24, animation:"fu .9s ease both" }}>
        <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:9, letterSpacing:".4em", color:"#C8A96E", textTransform:"uppercase", marginBottom:10, opacity:.7 }}>Ancient Wisdom · Modern Clarity</div>
        <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(22px,4.5vw,40px)", fontWeight:400, lineHeight:1.2, background:"linear-gradient(135deg,#fff 0%,#C8A96E 50%,#fff 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:10 }}>Your Cosmic Blueprint</h1>
        <p style={{ color:"rgba(255,255,255,.35)", maxWidth:560, margin:"0 auto", fontSize:12, lineHeight:2, fontStyle:"italic" }}>Complete Numerology (David A. Phillips) · Natal Chart · Chinese Zodiac · Arrows of Pythagoras · Shadow Work</p>
      </div>

      <div style={{ maxWidth:880, margin:"0 auto" }}>
        {err && <div style={{ background:"rgba(192,57,43,.1)", border:"1px solid rgba(192,57,43,.3)", borderRadius:7, padding:"11px 15px", marginBottom:18, fontSize:12, color:"rgba(231,76,60,.9)" }}>⚠️ {err}</div>}

        {/* TIER SELECTION */}
        {step === "tier" && <div style={{ animation:"fu .6s ease both" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:14, letterSpacing:".18em", color:"#C8A96E", textTransform:"uppercase", marginBottom:7 }}>Choose Your Level of Depth</h2>
            <p style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>Fill in the form → your complete reading is generated → delivered to your inbox.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, marginBottom:44 }}>
            {TIERS.map((t, i) => (
              <div key={t.id} onClick={() => pickTier(t.id)}
                style={{ background:t.popular?"linear-gradient(160deg,rgba(155,126,212,.1),rgba(0,0,0,.3))":"rgba(255,255,255,.02)", border:t.popular?"1px solid "+t.color+"55":"1px solid rgba(255,255,255,.06)", borderRadius:9, padding:20, cursor:"pointer", position:"relative", transition:"all .3s", animation:"fu .5s ease "+(i*.08)+"s both" }}
                onMouseEnter={e => { e.currentTarget.style.border = "1px solid "+t.color+"88"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = t.popular?"1px solid "+t.color+"55":"1px solid rgba(255,255,255,.06)"; e.currentTarget.style.transform = "none"; }}>
                {t.popular && <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:t.color, color:"#0d0d1a", fontFamily:"'Cinzel',serif", fontSize:8, letterSpacing:".15em", textTransform:"uppercase", padding:"3px 11px", borderRadius:20 }}>Most Popular</div>}
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:17, color:"#fff", marginBottom:3 }}>{t.name}</div>
                <div style={{ fontSize:22, fontFamily:"'Cinzel',serif", color:t.color, marginBottom:8 }}>{t.price}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.34)", fontStyle:"italic", marginBottom:13, lineHeight:1.6 }}>{t.desc}</div>
                <div style={{ borderTop:"1px solid rgba(255,255,255,.04)", paddingTop:11 }}>
                  {t.includes.map((item, j) => (
                    <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:6, marginBottom:5 }}>
                      <span style={{ color:t.color, fontSize:8, marginTop:4, flexShrink:0 }}>✦</span>
                      <span style={{ fontSize:10, color:"rgba(255,255,255,.45)", lineHeight:1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14, paddingTop:11, borderTop:"1px solid "+t.color+"22", textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".15em", color:t.color, textTransform:"uppercase" }}>Begin →</div>
              </div>
            ))}
          </div>
        </div>}

        {/* FORM */}
        {step === "form" && tier && <div style={{ animation:"fu .5s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:10 }}>
            <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:19, color:"#fff" }}>{tier.name} <span style={{ color:tier.color, fontSize:17 }}>{tier.price}</span></h2>
            <button onClick={() => setStep("tier")} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.4)", padding:"7px 13px", borderRadius:4, cursor:"pointer", fontSize:11, fontFamily:"'Cinzel',serif" }}>← Change</button>
          </div>

          <div style={{ background:"rgba(255,255,255,.015)", border:"1px solid "+tier.color+"22", borderRadius:9, padding:"22px 20px", marginBottom:18, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,"+tier.color+",transparent)" }} />

            <TI l="Preferred Name" v={person.preferredName} s={v => upd({preferredName:v})} p="What you go by" />

            <GD label="Full Legal Birth Name" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              <TI l="First Name" v={person.legalFirst} s={v => upd({legalFirst:v})} p="Birth certificate" r />
              <TI l="Middle Name" v={person.legalMiddle} s={v => upd({legalMiddle:v})} p="Leave blank if none" />
              <TI l="Last Name" v={person.legalLast} s={v => upd({legalLast:v})} p="Birth surname" r />
            </div>

            <GD label="Date of Birth" />
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 2fr", gap:10 }}>
              <TS l="Month" v={person.bMonth} s={v => upd({bMonth:v})} opts={MONTHS} r />
              <TS l="Day" v={person.bDay} s={v => upd({bDay:v})} opts={DAYS} r />
              <TS l="Year" v={person.bYear} s={v => upd({bYear:v})} opts={YEARS} r />
            </div>

            <GD label="Time & Place of Birth — Unlocks Rising Sign + Secret Animal" />
            <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:12, fontStyle:"italic" }}>Birth time calculates your Rising sign and Chinese Secret Animal. If unknown, leave blank.</div>
            <TS l="Birth Time Known?" v={person.timeKnown} s={v => upd({timeKnown:v})} opts={[{v:"exact",l:"Yes — exact"},{v:"approximate",l:"Approximate"},{v:"unknown",l:"Don't know"}]} />
            {(person.timeKnown === "exact" || person.timeKnown === "approximate") && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <TS l="Hour" v={person.bHour} s={v => upd({bHour:v})} opts={Array.from({length:24},(_,h)=>({v:String(h).padStart(2,"0"),l:h===0?"12:00 AM":h<12?h+":00 AM":h===12?"12:00 PM":(h-12)+":00 PM"}))} />
              <TS l="Minute" v={person.bMinute} s={v => upd({bMinute:v})} opts={["00","05","10","15","20","25","30","35","40","45","50","55"].map(m=>({v:m,l:":"+m}))} />
            </div>}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:10 }}>
              <TI l="City of Birth" v={person.bCity} s={v => upd({bCity:v})} p="e.g. Dallas" />
              <TI l="State" v={person.bState} s={v => upd({bState:v})} p="TX" />
              <TI l="Country" v={person.bCountry} s={v => upd({bCountry:v})} p="USA" />
            </div>

            {isFull && <>
              <GD label="Current Name (if different from birth)" />
              <div style={{background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.12)",borderRadius:6,padding:"10px 14px",marginBottom:12,fontSize:11,color:"rgba(255,255,255,.38)",fontStyle:"italic",lineHeight:1.8}}>
                ✦ If your name has changed — married name, chosen name, legally changed — your reading will include a <strong style={{color:"rgba(200,169,110,.7)"}}>then vs now comparison</strong> showing what numerological energies shifted.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TI l="Current First Name" v={person.currentFirst} s={v => upd({currentFirst:v})} p="If different from birth" />
                <TI l="Current Middle Name" v={person.currentMiddle} s={v => upd({currentMiddle:v})} p="If applicable" />
                <TI l="Current Last Name" v={person.currentLast} s={v => upd({currentLast:v})} p="Married / chosen name" />
              </div>

              <GD label="Natal Chart Placements — Optional but Powerful" />


              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"rgba(200,169,110,.5)",textTransform:"uppercase",marginBottom:10}}>Personal Planets</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Sun Sign" v={person.natalSun} s={v => upd({natalSun:v})} opts={ZODIAC} />
                <TS l="Moon Sign" v={person.natalMoon} s={v => upd({natalMoon:v})} opts={ZODIAC} />
                <TS l="Rising / Ascendant" v={person.natalRising} s={v => upd({natalRising:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:4}}>
                <TI l="Sun Degree (optional)" v={person.natalSunDeg} s={v => upd({natalSunDeg:v})} p="e.g. 20" />
                <TI l="Moon Degree (optional)" v={person.natalMoonDeg} s={v => upd({natalMoonDeg:v})} p="e.g. 29 = anaretic" />
                <TI l="Rising Degree (optional)" v={person.natalRisingDeg} s={v => upd({natalRisingDeg:v})} p="e.g. 13" />
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginBottom:12,fontStyle:"italic"}}>Degree shown on astro.com next to each placement — e.g. "Moon 29°55' Taurus" → enter 29. The 29th degree (anaretic) is especially significant.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Mercury" v={person.natalMercury} s={v => upd({natalMercury:v})} opts={ZODIAC} />
                <TS l="Venus" v={person.natalVenus} s={v => upd({natalVenus:v})} opts={ZODIAC} />
                <TS l="Mars" v={person.natalMars} s={v => upd({natalMars:v})} opts={ZODIAC} />
              </div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"rgba(126,196,212,.5)",textTransform:"uppercase",margin:"10px 0"}}>Social & Outer Planets</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Jupiter" v={person.natalJupiter} s={v => upd({natalJupiter:v})} opts={ZODIAC} />
                <TS l="Saturn" v={person.natalSaturn} s={v => upd({natalSaturn:v})} opts={ZODIAC} />
                <TS l="Uranus" v={person.natalUranus} s={v => upd({natalUranus:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Neptune" v={person.natalNeptune} s={v => upd({natalNeptune:v})} opts={ZODIAC} />
                <TS l="Pluto" v={person.natalPluto} s={v => upd({natalPluto:v})} opts={ZODIAC} />
                <TS l="Chiron" v={person.natalChiron} s={v => upd({natalChiron:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <TS l="North Node" v={person.natalNorthNode} s={v => upd({natalNorthNode:v})} opts={ZODIAC} />
                <TS l="South Node" v={person.natalSouthNode} s={v => upd({natalSouthNode:v})} opts={ZODIAC} />
              </div>
              <GD label="Key House Cusps — Optional" />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
                <TS l="1st House (Self)" v={person.natalHouse1} s={v => upd({natalHouse1:v})} opts={ZODIAC} />
                <TS l="4th House (Roots)" v={person.natalHouse4} s={v => upd({natalHouse4:v})} opts={ZODIAC} />
                <TS l="7th House (Partners)" v={person.natalHouse7} s={v => upd({natalHouse7:v})} opts={ZODIAC} />
                <TS l="10th House (Career)" v={person.natalHouse10} s={v => upd({natalHouse10:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <TS l="Part of Fortune" v={person.natalPartFortune} s={v => upd({natalPartFortune:v})} opts={ZODIAC} />
                <TS l="Vertex (Fated Encounters)" v={person.natalVertex} s={v => upd({natalVertex:v})} opts={ZODIAC} />
              </div>
              <TTA l="Major Aspects or Chart Patterns — Optional" v={person.natalAspects} s={v => upd({natalAspects:v})} p="e.g. Sun conjunct Saturn, T-square in cardinal signs, stellium in 8th house, grand trine…" rows={2} />

              <GD label="Shadow Work" />
              <p style={{fontSize:12,color:"rgba(255,255,255,.32)",marginBottom:14,fontStyle:"italic",lineHeight:1.8}}>🌑 The shadow is not what is wrong with you — it is what has been unwitnessed. Your selections shape the depth of this section.</p>
              <MP label="Shadow themes active in your life right now" items={SHADOW_THEMES} selected={person.shadowThemes} onChange={v => upd({shadowThemes:v})} color="#9B7ED4" />
              <TTA l="Earliest wound that still echoes — Optional" v={person.childhoodWound} s={v => upd({childhoodWound:v})} p="A few words is enough. Only what feels safe to share." rows={2} />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16,alignItems:"end"}}>
                <TS l="Primary shadow goal" v={person.shadowGoal} s={v => upd({shadowGoal:v})} opts={[{v:"",l:"— Select —"},{v:"patterns",l:"Understand repeating patterns"},{v:"release",l:"Release what no longer serves"},{v:"child",l:"Heal the inner child"},{v:"reclaim",l:"Reclaim disowned parts"},{v:"integrate",l:"Integrate light and shadow"},{v:"beginning",l:"Just beginning"}]} />
                <div>
                  <Lbl c={"Depth readiness: " + (person.shadowDepth||5) + " / 10"} />
                  <p style={{fontSize:10,color:"rgba(255,255,255,.25)",marginBottom:8,fontStyle:"italic"}}>Calibrates tone of shadow section</p>
                  <input type="range" min={1} max={10} value={person.shadowDepth||5} onChange={e => upd({shadowDepth:Number(e.target.value)})} style={{width:"100%",accentColor:"#9B7ED4"}} />
                </div>
              </div>

              <GD label="Energetic Focus" />
              <p style={{fontSize:11,color:"rgba(255,255,255,.32)",marginBottom:10,fontStyle:"italic"}}>Select chakra centers calling for attention</p>
              <ChakraPicker selected={person.chakraFocus} onChange={v => upd({chakraFocus:v})} />
            </>}

            <GD label="Intentions" />
            <TTA l="What are you most hoping to understand or receive from this reading?" v={person.goals} s={v => upd({goals:v})} p="What feels most alive, stuck, or calling right now…" rows={3} />
          </div>

          <div style={{ background:"rgba(255,255,255,.015)", border:"1px solid rgba(200,169,110,.1)", borderRadius:8, padding:20, marginBottom:20 }}>
            <TI l="Email Address" t="email" v={email} s={setEmail} p="Where to send your reading" r />
          </div>

          {/* Legal */}
          <div style={{ background:"rgba(200,169,110,.04)", border:"1px solid rgba(200,169,110,.12)", borderRadius:7, padding:"16px 18px", marginBottom:20, fontSize:11, color:"rgba(255,255,255,.38)", lineHeight:1.9 }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".15em", color:"rgba(200,169,110,.6)", textTransform:"uppercase", marginBottom:8 }}>Important — Please Read</div>
            Sacred Soul Map readings are provided for educational, spiritual, and personal growth purposes only. They do not constitute professional psychological, medical, financial, or legal advice. By submitting you acknowledge that readings are interpretive in nature and you retain full personal responsibility for any decisions made.
            <div style={{ marginTop:10, display:"flex", alignItems:"flex-start", gap:8 }}>
              <input type="checkbox" id="consent" checked={legalConsent} onChange={e => setLegalConsent(e.target.checked)} style={{ marginTop:3, accentColor:"#C8A96E", cursor:"pointer" }} />
              <label htmlFor="consent" style={{ cursor:"pointer", color:"rgba(255,255,255,.5)", fontSize:11 }}>I understand this reading is for spiritual and personal growth. I am 18+. I agree to the terms above.</label>
            </div>
          </div>

          <div style={{ textAlign:"center" }}>
            <button onClick={() => legalConsent && setStep("confirm")} disabled={!legalConsent} style={{ opacity:legalConsent?1:.4, cursor:legalConsent?"pointer":"not-allowed", background:"linear-gradient(135deg,"+tier.color+"22,"+tier.color+"40)", border:"1px solid "+tier.color, color:tier.color, fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:".2em", textTransform:"uppercase", padding:"15px 46px", borderRadius:4, transition:"all .3s" }}>
              Review &amp; Confirm →
            </button>
            <p style={{ marginTop:10, fontSize:11, color:"rgba(255,255,255,.2)", fontStyle:"italic" }}>You'll confirm your details before we calculate.</p>
          </div>
        </div>}

        {/* CONFIRM */}
        {step === "confirm" && tier && <div style={{ animation:"fu .5s ease both", maxWidth:560, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".3em", color:"#C8A96E", textTransform:"uppercase", marginBottom:8, opacity:.7 }}>Before We Calculate</div>
            <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:20, color:"#fff", marginBottom:6 }}>Confirm Your Details</h2>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.35)", fontStyle:"italic" }}>Numerology is precise — a single digit difference changes everything. Please verify each field below is exactly correct.</p>
          </div>

          <div style={{ background:"rgba(255,255,255,.015)", border:"1px solid rgba(200,169,110,.18)", borderRadius:10, padding:"22px 24px", marginBottom:20 }}>

            {/* Birth Name */}
            <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:"#C8A96E", textTransform:"uppercase", marginBottom:8 }}>Full Legal Birth Name</div>
              <div style={{ fontSize:17, color:"#fff", letterSpacing:".04em" }}>
                {[person.legalFirst, person.legalMiddle, person.legalLast].filter(Boolean).join(" ") || <span style={{color:"rgba(255,255,255,.25)",fontStyle:"italic"}}>Not entered</span>}
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", marginTop:4, fontStyle:"italic" }}>Exactly as it appears on your birth certificate</div>
            </div>

            {/* Current Name */}
            {(person.currentFirst || person.currentLast) && <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:"#C8A96E", textTransform:"uppercase", marginBottom:8 }}>Current Name</div>
              <div style={{ fontSize:17, color:"#fff", letterSpacing:".04em" }}>
                {[person.currentFirst || person.legalFirst, person.currentMiddle || person.legalMiddle, person.currentLast || person.legalLast].filter(Boolean).join(" ")}
              </div>
            </div>}

            {/* Date of Birth */}
            <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:"#C8A96E", textTransform:"uppercase", marginBottom:8 }}>Date of Birth</div>
              <div style={{ fontSize:17, color:"#fff", letterSpacing:".04em" }}>
                {person.bMonth && person.bDay && person.bYear
                  ? person.bMonth + " / " + person.bDay + " / " + person.bYear
                  : <span style={{color:"rgba(255,255,255,.25)",fontStyle:"italic"}}>Incomplete</span>}
              </div>
            </div>

            {/* Birth Time */}
            <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:"#C8A96E", textTransform:"uppercase", marginBottom:8 }}>Birth Time</div>
              <div style={{ fontSize:17, color:"#fff", letterSpacing:".04em" }}>
                {person.timeKnown === "exact" || person.timeKnown === "approximate"
                  ? (person.bHour ? person.bHour + ":" + (person.bMinute || "00") : "Time not selected") + (person.timeKnown === "approximate" ? " (approximate)" : "")
                  : <span style={{color:"rgba(255,255,255,.35)",fontStyle:"italic"}}>Not known — Rising sign will not be calculated</span>}
              </div>
            </div>

            {/* Birth Location */}
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:"#C8A96E", textTransform:"uppercase", marginBottom:8 }}>Birth Location</div>
              <div style={{ fontSize:17, color:"#fff", letterSpacing:".04em" }}>
                {[person.bCity, person.bState, person.bCountry].filter(Boolean).join(", ") || <span style={{color:"rgba(255,255,255,.25)",fontStyle:"italic"}}>Not entered</span>}
              </div>
            </div>

          </div>

          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => setStep("form")} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.15)", color:"rgba(255,255,255,.45)", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:".15em", textTransform:"uppercase", padding:"13px 28px", borderRadius:4, cursor:"pointer" }}>
              ← Edit Details
            </button>
            <button onClick={submit} style={{ background:"linear-gradient(135deg,"+tier.color+"22,"+tier.color+"40)", border:"1px solid "+tier.color, color:tier.color, fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:".2em", textTransform:"uppercase", padding:"13px 36px", borderRadius:4, cursor:"pointer", transition:"all .3s" }}>
              ✦ This is Correct — Generate My Reading
            </button>
          </div>
          <p style={{ textAlign:"center", marginTop:12, fontSize:11, color:"rgba(255,255,255,.2)", fontStyle:"italic" }}>~45–60 seconds for the complete reading.</p>
        </div>}

        {/* GENERATING */}
        {step === "gen" && <div style={{ textAlign:"center", paddingTop:50, animation:"fu .5s ease both", maxWidth:560, margin:"0 auto" }}>
          <div style={{ position:"relative", width:80, height:80, margin:"0 auto 32px" }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(200,169,110,.15)", borderTop:"1px solid #C8A96E", animation:"spin 2s linear infinite" }} />
            <div style={{ position:"absolute", inset:8, borderRadius:"50%", border:"1px solid rgba(155,126,212,.1)", borderTop:"1px solid #9B7ED4", animation:"spin 3.2s linear infinite reverse" }} />
            <div style={{ position:"absolute", inset:18, borderRadius:"50%", border:"1px solid rgba(126,196,212,.1)", borderTop:"1px solid #7EC4D4", animation:"spin 1.6s linear infinite" }} />
            <div style={{ position:"absolute", inset:"50%", transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:"#C8A96E", boxShadow:"0 0 12px rgba(200,169,110,.6)" }} />
          </div>
          <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:20, color:"#C8A96E", marginBottom:8 }}>Reading the Stars…</h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.4)", marginBottom:16, fontStyle:"italic" }}>{genMsg}</p>
          {streamChars > 0 && <p style={{ fontSize:10, color:"rgba(255,255,255,.2)", fontFamily:"'Cinzel',serif", letterSpacing:".1em" }}>{streamChars.toLocaleString()} characters received</p>}
        </div>}

        {/* RESULTS */}
        {step === "results" && reading && <div style={{ animation:"fu .6s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:(tier && tier.color), textTransform:"uppercase", marginBottom:3 }}>Your Reading</div>
              <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:19, color:"#fff" }}>{tier && tier.name} — {person.preferredName || person.legalFirst || "Your Reading"}</h2>
            </div>
            <button onClick={reset} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.38)", padding:"7px 13px", borderRadius:4, cursor:"pointer", fontSize:11, fontFamily:"'Cinzel',serif" }}>← New Reading</button>
          </div>
          <ReadingView reading={reading} name={person.preferredName || person.legalFirst || "Friend"} onEmail={sendMail} emailSt={emailSt} />
        </div>}

      </div>
    </div>
  </>;
}
