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

function numReduce(n, keepMaster = true) {
  if (keepMaster && (n === 11 || n === 22 || n === 33 || n === 44)) return n;
  if (n < 10) return n;
  const sum = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return numReduce(sum, keepMaster);
}


function formatNum(n) {
  if (n === 11) return "11/2";
  if (n === 22) return "22/4";
  if (n === 33) return "33/6";
  if (n === 44) return "44/8";
  return String(n);
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


function calcSunSign(month, day) {
  const m = Number(month), d = Number(day);
  if (!m || !d) return "";
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Taurus";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Gemini";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Scorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagittarius";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricorn";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Aquarius";
  if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return "Pisces";
  return "";
}

// ─── PLANES OF EXPRESSION MAP (David A. Phillips) ───────
// Each letter maps to one of four planes of expression
const PLANE_MAP = {
  A:"Mental",  B:"Emotional", C:"Intuitive", D:"Physical",
  E:"Emotional",F:"Intuitive", G:"Mental",   H:"Mental",
  I:"Emotional",J:"Mental",   K:"Intuitive", L:"Mental",
  M:"Emotional",N:"Mental",   O:"Emotional", P:"Mental",
  Q:"Intuitive",R:"Emotional",S:"Emotional", T:"Emotional",
  U:"Intuitive",V:"Intuitive",W:"Physical",  X:"Physical",
  Y:"Intuitive",Z:"Emotional"
};

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
  const mR = numReduce(m, false), dR = numReduce(d, false), yR = numReduce(digitSum(y), false);
  const lifePath = numReduce(mR + dR + yR);
  const expression = numReduce(nameSum(full));
  const soulUrge = numReduce(nameSum(full, "v"));
  const personality = numReduce(nameSum(full, "c"));
  const birthday = numReduce(d);
  const personalYear = numReduce(numReduce(m,false) + numReduce(d,false) + numReduce(digitSum(curY),false));
  const maturity = numReduce(lifePath + expression);

  // ── Personal Month & Day ──
  const personalMonth = numReduce(personalYear + numReduce(curM, false));
  const personalDay = numReduce(personalMonth + numReduce(curD, false));

  // ── Bridge Numbers (the gap between paired numbers — what to work on) ──
  const lpExpBridge = Math.abs((lifePath > 9 ? lifePath % 10 : lifePath) - (expression > 9 ? expression % 10 : expression));
  const suPersBridge = Math.abs((soulUrge > 9 ? soulUrge % 10 : soulUrge) - (personality > 9 ? personality % 10 : personality));
  const bridgeLifeExp = numReduce(lpExpBridge, false);
  const bridgeSoulPers = numReduce(suPersBridge, false);

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
  const ch1 = numReduce(Math.abs(mR - dR), false);
  const ch2 = numReduce(Math.abs(dR - yR), false);
  const ch3 = numReduce(Math.abs(ch1 - ch2), false);
  const ch4 = numReduce(Math.abs(mR - yR), false);

  // ── 4 Pinnacles ──
  const pin1 = numReduce(mR + dR);
  const pin2 = numReduce(dR + yR);
  const pin3 = numReduce(pin1 + pin2);
  const pin4 = numReduce(mR + yR);
  const lpR = numReduce(lifePath, false);
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
  const currentExpression = currentFull ? numReduce(nameSum(currentFull)) : null;
  const currentSoulUrge    = currentFull ? numReduce(nameSum(currentFull, "v")) : null;
  const currentPersonality = currentFull ? numReduce(nameSum(currentFull, "c")) : null;

  // ── Master number awareness ──
  const masterNumbers = [];
  [lifePath, expression, soulUrge, personality, personalYear, maturity, activePinnacle].forEach(n => {
    if ([11,22,33,44].includes(n) && !masterNumbers.includes(n)) masterNumbers.push(n);
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
  const name = p.legalFirst || "this soul";
  const isFull = tier !== "soul-spark";

  // ── Additional people numerology ──
  const peopleData = (p.people || []).filter(p2 => p2.firstName && p2.bMonth && p2.bDay && p2.bYear).map(p2 => {
    const m2 = Number(p2.bMonth), d2 = Number(p2.bDay), y2 = Number(p2.bYear);
    const lp2 = numReduce(numReduce(m2,false) + numReduce(d2,false) + numReduce(digitSum(y2),false));
    const fullName = [p2.firstName, p2.middleName, p2.lastName].filter(Boolean).join(" ");
    return { name: fullName, lifePath: lp2, dob: p2.bMonth+"/"+p2.bDay+"/"+p2.bYear, relationship: p2.relationship || "Other" };
  });

  const lines = [];

  if (tier === "soul-spark") {
    lines.push("You are a numerologist trained in David A. Phillips' Complete Book of Numerology.");
    lines.push("OUTPUT: Return ONLY a raw JSON object. No markdown, no backticks, no preamble. Start with { end with }. No newlines inside string values. Use single quotes inside strings, never double quotes.");
    lines.push("");
    lines.push("Person: " + name + " | DOB: " + p.bMonth+"/"+p.bDay+"/"+p.bYear);
    lines.push("Life Path: " + formatNum(n.lifePath) + " | Expression: " + formatNum(n.expression) + " | Soul Urge: " + formatNum(n.soulUrge) + " | Personal Year: " + n.personalYear);
    lines.push("");
    lines.push("Return this JSON:");
    lines.push(JSON.stringify({
      cosmicSnapshot: "2 vivid sentences capturing " + name + "'s Life Path " + formatNum(n.lifePath) + " energy and current Personal Year " + n.personalYear + " theme",
      lifePath: { number: formatNum(n.lifePath), title: "3-word title", reading: "3 sentences on soul purpose and Phillips master number meaning if applicable", shadow: "1 sentence on the core ego trap" },
      expression: { number: formatNum(n.expression), title: "3-word title", reading: "2 sentences on natural talents and destiny role" },
      soulUrge: { number: formatNum(n.soulUrge), title: "3-word title", reading: "2 sentences on deepest heart desire" },
      timing: "2 sentences on what Personal Year " + n.personalYear + " is calling for right now",
      soulMessage: "3 sentences written directly to " + name + " — end with one irreducible truth"
    }));
    return lines.join("\n");
  }

  lines.push("You are a master numerologist trained in David A. Phillips' Complete Book of Numerology, a Chinese metaphysics scholar, and a shadow integration guide.");
  lines.push("OUTPUT: Return ONLY a raw JSON object. No markdown, no backticks, no preamble. Start with { end with }. No newlines or literal line breaks inside string values. Use single quotes inside strings, never double quotes inside strings.");
  lines.push("");
  lines.push("VERIFY: Life Path=" + formatNum(n.lifePath) + " | Expression=" + formatNum(n.expression) + " | Soul Urge=" + formatNum(n.soulUrge) + " | Personality=" + formatNum(n.personality) + " | Missing=" + (n.missing.join(",") || "none") + ". Do not recalculate or override.");
  lines.push("");
  lines.push("PERSON: " + name + " | DOB: " + p.bMonth+"/"+p.bDay+"/"+p.bYear + " | Born: " + [p.bCity,p.bState,p.bCountry].filter(Boolean).join(", "));
  lines.push("Full birth name: " + n.fullName);
  if (n.hasCurrent) lines.push("Current name: " + n.currentFull);
  lines.push("");
  lines.push("NUMEROLOGY DATA:");
  lines.push("Life Path: " + formatNum(n.lifePath) + (n.masterNumbers.includes(n.lifePath) ? " [MASTER NUMBER]" : ""));
  lines.push("Expression: " + formatNum(n.expression) + " | Soul Urge: " + formatNum(n.soulUrge) + " | Personality: " + formatNum(n.personality));
  lines.push("Birthday Number: " + formatNum(n.birthday) + " | Maturity Number: " + formatNum(n.maturity));
  lines.push("Personal Year: " + n.personalYear + " | Personal Month: " + n.personalMonth + " | Personal Day: " + n.personalDay);
  lines.push("Active Pinnacle: " + n.activePinnacle + " (Pinnacle " + n.activePinnacleNum + ") | Active Challenge: " + n.activeChallenge);
  lines.push("Pinnacle sequence: " + n.pinnacles.join(" -> ") + " | Challenge sequence: " + n.challenges.join(" -> "));
  lines.push("Bridge LP-Exp: " + n.bridgeLifeExp + " | Bridge SU-Pers: " + n.bridgeSoulPers);
  lines.push("Subconscious Self: " + n.subconsciousSelf + "/9 | First Vowel: " + n.firstVowel);
  lines.push("Missing numbers: " + (n.missing.join(", ") || "None — complete set") + " | Karmic debts: " + (n.karmicDebts.join(", ") || "None"));
  lines.push("Intensity peaks: " + n.intensityPeak + " | Absent: " + n.intensityAbsent);
  lines.push("Planes — Physical: " + n.planes.Physical + " Mental: " + n.planes.Mental + " Emotional: " + n.planes.Emotional + " Intuitive: " + n.planes.Intuitive + " | Dominant: " + n.dominantPlane);
  lines.push("Arrows present: " + (n.arrowsPresent.length ? n.arrowsPresent.join(", ") : "None") + " | Absent: " + (n.arrowsMissing.length ? n.arrowsMissing.join(", ") : "None"));
  lines.push("Chinese Zodiac: " + n.chinese.element + " " + n.chinese.animal + " (" + n.chinese.polarity + ") | Inner: " + n.chinese.innerAnimal + " | Secret: " + n.chinese.secretAnimal);
  if (n.sunSign) lines.push("Sun Sign: " + n.sunSign);
  lines.push("");
  // Marriage date numerology
  let marriageLP = null;
  if (p.marriageMonth && p.marriageDay && p.marriageYear) {
    const mm = Number(p.marriageMonth), md = Number(p.marriageDay), my = Number(p.marriageYear);
    marriageLP = numReduce(numReduce(mm,false) + numReduce(md,false) + numReduce(digitSum(my),false));
  }

  if (peopleData.length) {
    lines.push("");
    lines.push("ADDITIONAL PEOPLE FOR COMPATIBILITY:");
    peopleData.forEach(pd => lines.push(pd.name + " | Relationship: " + pd.relationship + " | DOB: " + pd.dob + " | Life Path: " + pd.lifePath));
  }
  if (marriageLP !== null) {
    lines.push("");
    lines.push("MARRIAGE / UNION DATE: " + p.marriageMonth + "/" + p.marriageDay + "/" + p.marriageYear + " | Union Life Path: " + formatNum(marriageLP));
  }
  lines.push("");
  lines.push("Return this exact JSON structure with all fields populated with real content:");
  lines.push(JSON.stringify({
    cosmicSnapshot: "3 vivid sentences — weave Life Path " + formatNum(n.lifePath) + ", Personal Year " + n.personalYear + ", and dominant plane (" + n.dominantPlane + ") into the soul theme of this chapter for " + name,

    lifePath: {
      number: formatNum(n.lifePath),
      title: "evocative 3-word title",
      essence: "1 sentence soul contract",
      reading: "5 sentences — Phillips depth on purpose, master number significance if applicable, how this Life Path operates, what it came to learn, and its highest expression in " + name + "'s life",
      shadow: "2 sentences — the ego trap, the unconscious pattern, the shadow side of this Life Path",
      gifts: "2 sentences listing the rarest gifts this Life Path carries"
    },

    expression: {
      number: formatNum(n.expression),
      title: "3-word title",
      reading: "3 sentences on natural talents, destiny role, and how this Expression shapes the outer life",
      shadow: "1 sentence on where this energy creates friction"
    },

    soulUrge: {
      number: formatNum(n.soulUrge),
      title: "3-word title",
      reading: "3 sentences on the deepest heart desire, soul fuel, what this number craves to feel whole",
      shadow: "1 sentence on what this Soul Urge looks like when unfulfilled"
    },

    personality: {
      number: formatNum(n.personality),
      title: "3-word title",
      reading: "2 sentences on how the world perceives " + name + " before they speak, and how the Personality mask relates to the Soul Urge beneath it"
    },

    birthday: {
      number: formatNum(n.birthday),
      title: "2-word title",
      reading: "2 sentences on the special talent and gift embedded in this birthday number per Phillips"
    },

    maturity: {
      number: formatNum(n.maturity),
      reading: "2 sentences on what " + name + " is growing toward after age 45 — the final flowering"
    },

    bridgeNumbers: {
      reading: "3 sentences on Bridge " + n.bridgeLifeExp + " (Life Path to Expression) and Bridge " + n.bridgeSoulPers + " (Soul Urge to Personality) — what gaps need integration, what this reveals about inner vs outer misalignment"
    },

    subconsciousSelf: {
      number: n.subconsciousSelf,
      reading: "2 sentences on how " + name + " responds instinctively under pressure with " + n.subconsciousSelf + "/9 active responses"
    },

    firstVowel: {
      vowel: n.firstVowel,
      reading: "2 sentences on how the first vowel " + n.firstVowel + " shapes the primary motivation and approach to all of life"
    },

    intensityTable: {
      peaks: n.intensityPeak,
      absences: n.intensityAbsent,
      reading: "3 sentences on overemphasized energies, what the absent numbers create as blind spots, and how this intensity pattern plays out"
    },

    planesOfExpression: {
      distribution: "Physical=" + n.planes.Physical + " Mental=" + n.planes.Mental + " Emotional=" + n.planes.Emotional + " Intuitive=" + n.planes.Intuitive,
      dominant: n.dominantPlane,
      reading: "3 sentences on how this distribution shapes the way " + name + " processes life — their primary intelligence, what comes naturally, and what requires conscious cultivation"
    },

    arrowsOfPythagoras: {
      present: n.arrowsPresent.length ? n.arrowsPresent.join(", ") : "None",
      absent: n.arrowsMissing.length ? n.arrowsMissing.join(", ") : "None",
      reading: "4 sentences — weave the active arrows (instinctive strengths) and absent arrows (the gifts earned through conscious effort) into a coherent picture of " + name + "'s energetic architecture"
    },

    missingNumbers: {
      numbers: n.missing.join(", ") || "None — complete set",
      reading: "3 sentences on the karmic lesson of missing " + (n.missing.join(" and ") || "no numbers") + " — what the soul came to consciously develop this lifetime"
    },

    ...(n.karmicDebts.length ? { karmicDebts: { debts: n.karmicDebts.join(", "), reading: "2 sentences on the karmic debt pattern and path to resolution" } } : {}),

    timing: {
      personalYear: n.personalYear,
      personalMonth: n.personalMonth,
      activePinnacle: n.activePinnacle,
      activeChallenge: n.activeChallenge,
      reading: "4 sentences on the convergence of Personal Year " + n.personalYear + " + Personal Month " + n.personalMonth + " + Pinnacle " + n.activePinnacle + " + Challenge " + n.activeChallenge + " — what is this exact season asking of " + name + "?"
    },

    pinnacles: {
      sequence: n.pinnacles.join(" -> "),
      active: n.activePinnacle,
      reading: "2 sentences on the pinnacle arc — what has been and what the current pinnacle " + n.activePinnacle + " is here to teach"
    },

    chineseZodiac: {
      yearAnimal: n.chinese.element + " " + n.chinese.animal,
      innerAnimal: n.chinese.innerAnimal,
      secretAnimal: n.chinese.secretAnimal,
      reading: "3 sentences on the three-layer animal portrait — year animal (public self), inner animal (private nature), secret animal (subconscious drive) and how they work together"
    },

    ...(n.sunSign ? { sunSign: { sign: n.sunSign, reading: "2 sentences on how " + n.sunSign + " Sun energy interplays with Life Path " + formatNum(n.lifePath) + " — where they harmonize or create productive tension" } } : {}),

    shadowWork: {
      coreWound: "3 sentences — read the shadow DIRECTLY from the numbers. Life Path " + formatNum(n.lifePath) + " shadow, missing " + (n.missing.join(" and ") || "no numbers") + " as karmic blind spot, and how the dominant plane (" + n.dominantPlane + ") creates the unconscious pattern. Name it precisely.",
      theGold: "3 sentences on the gold hidden in the shadow — what Life Path " + formatNum(n.lifePath) + " unlocks when the ego trap is integrated, and what the absent arrows reveal as the soul's earned gifts",
      soulInvitation: "2 sentences — Personal Year " + n.personalYear + " + Challenge " + n.activeChallenge + " are creating a specific pressure point right now. Name exactly what " + name + " is being asked to release and what to step into.",
      prompts: "5 shadow journal prompts derived entirely from the numbers — Life Path, missing numbers, absent arrows, karmic debts. Each prompt names a specific number. Separate with | character."
    },

    ...(n.hasCurrent ? { nameEvolution: {
      birthName: n.fullName,
      currentName: n.currentFull,
      shifts: "Expression " + formatNum(n.expression) + " to " + formatNum(n.currentExpression) + ", Soul Urge " + formatNum(n.soulUrge) + " to " + formatNum(n.currentSoulUrge),
      reading: "3 sentences on what shifted numerologically with this name change and whether it represents expansion or contraction of soul alignment"
    }} : {}),

    ...(peopleData.length ? { compatibility: peopleData.map(pd => ({
      name: pd.name,
      relationship: pd.relationship,
      lifePath: String(pd.lifePath),
      harmony: "1 sentence on the natural resonance between Life Path " + formatNum(n.lifePath) + " and Life Path " + pd.lifePath,
      tension: "1 sentence on the friction or growth edge in this " + pd.relationship + " dynamic",
      soulLesson: "1 sentence on what this connection is here to teach " + name
    }))} : {}),

    ...(marriageLP !== null ? { marriageUnion: {
      date: p.marriageMonth + "/" + p.marriageDay + "/" + p.marriageYear,
      unionLifePath: formatNum(marriageLP),
      reading: "4 sentences — the Life Path " + formatNum(marriageLP) + " is the soul mission of this union itself. What did these two Life Paths agree to build together? How does the union number interact with each person's individual Life Path? What is the highest potential and the core challenge of this marriage vibration?"
    }} : {}),

    holisticSynthesis: {
      corePattern: "3 sentences — the single thread running through all the numbers for " + name,
      soulSignature: "1 unforgettable sentence that defines " + name + " at soul level"
    },

    soulMessage: "4 sentences written directly to " + name + ". Weave Life Path " + formatNum(n.lifePath) + " and the shadow invitation. End with one irreducible truth."
  }));

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
      system: "You are a sacred numerology and astrology reading generator. OUTPUT FORMAT: You must respond with ONLY a raw JSON object. NO markdown. NO backticks. NO explanations. NO preamble. Your ENTIRE response must be valid JSON starting with { and ending with }. CONTENT RULES: (1) Every field must contain real reading content. (2) Never use double-quotes inside string values — use single quotes or rephrase. (3) Never add line breaks inside string values. (4) Do not recalculate or override the exact numbers provided.",
      messages: [{ role: "user", content: prompt }, { role: "assistant", content: "{" }]
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
  // Strip markdown fences
  clean = clean.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  // Extract JSON object bounds
  const first = clean.indexOf("{");
  if (first !== -1) clean = clean.slice(first);
  const last = clean.lastIndexOf("}");
  if (last !== -1) clean = clean.slice(0, last + 1);

  // Helper: repair and attempt parse
  const tryParse = str => {
    // Remove trailing commas
    let f = str.replace(/,\s*([}\]])/g, "$1");
    // Fix unescaped newlines/tabs inside strings
    f = f.replace(/"((?:[^"\\]|\\.)*)"/g, (m, inner) => {
      return '"' + inner.replace(/\n/g, " ").replace(/\r/g, "").replace(/\t/g, " ") + '"';
    });
    return JSON.parse(f);
  };

  // Attempt 1: direct parse
  try { return tryParse(clean); } catch {}

  // Attempt 2: auto-close truncated JSON
  // Walk the string tracking open structures, then close them all
  try {
    const closeJSON = str => {
      const stack = [];
      let inStr = false, escape = false;
      let lastGoodIdx = 0;
      for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (escape) { escape = false; continue; }
        if (c === "\\" && inStr) { escape = true; continue; }
        if (c === '"') { inStr = !inStr; if (!inStr) lastGoodIdx = i; continue; }
        if (inStr) continue;
        if (c === "{" || c === "[") { stack.push(c === "{" ? "}" : "]"); }
        else if (c === "}" || c === "]") {
          if (stack.length && stack[stack.length-1] === c) { stack.pop(); lastGoodIdx = i; }
        } else if (c !== " " && c !== "\n" && c !== "\t" && c !== ",") {
          lastGoodIdx = i;
        }
      }
      // If we're inside a string, cut back to last completed value
      let truncated = inStr ? str.slice(0, lastGoodIdx + 1) : str;
      // Remove trailing partial key or comma
      truncated = truncated.replace(/,\s*"[^"]*$/, "").replace(/,\s*$/, "");
      // Close all open structures
      return truncated + stack.reverse().join("");
    };
    return tryParse(closeJSON(clean));
  } catch {}

  // Attempt 3: regex-extract every completed top-level field
  try {
    const partial = {};
    const fieldRe = /"(\w+)"\s*:\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|"(?:[^"\\]|\\.)*"|\[(?:[^\[\]]|\[(?:[^\[\]])*\])*\]|-?\d+(?:\.\d+)?|true|false|null)/g;
    let m;
    while ((m = fieldRe.exec(clean)) !== null) {
      try { partial[m[1]] = JSON.parse(m[2]); } catch { partial[m[1]] = m[2].replace(/^"|"$/g, ""); }
    }
    if (Object.keys(partial).length > 2) return partial;
  } catch {}

  // Attempt 4: minimum rescue
  try {
    const partial = {};
    const snap = clean.match(/"cosmicSnapshot"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (snap) partial.cosmicSnapshot = snap[1];
    const msg = clean.match(/"soulMessage"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (msg) partial.soulMessage = msg[1];
    if (Object.keys(partial).length > 0) { partial._partial = true; return partial; }
  } catch {}

  throw new Error("Reading complete but JSON failed. Please try again.");
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
  if (r.sunSign) lines.push("SUN SIGN — " + (r.sunSign.sign||"") + "\n" + (r.sunSign.reading||"") + "\n");
  if (r.marriageUnion) {
    lines.push("\n── MARRIAGE / UNION DATE: " + r.marriageUnion.date + " (Life Path " + r.marriageUnion.unionLifePath + ") ──");
    if (r.marriageUnion.reading) lines.push(r.marriageUnion.reading);
  }
  if (r.compatibility && r.compatibility.length) {
    lines.push("COMPATIBILITY\n");
    r.compatibility.forEach(c => lines.push(c.name + " (" + (c.relationship||"") + " · Life Path " + c.lifePath + "):\n" + [c.harmony, c.tension, c.soulLesson, c.reading].filter(Boolean).join("\n") + "\n"));
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
    includes: ["Life Path · Expression · Soul Urge", "Personal Year timing", "Chinese Zodiac", "Soul Message"],
    maxPeople: 0 },
  { id: "cosmic-self", name: "Cosmic Self", price: "$97", color: "#9B7ED4", popular: true,
    desc: "Complete Phillips system · Shadow work · Holistic synthesis",
    includes: ["Everything in Soul Spark", "All Phillips depth numbers", "Arrows of Pythagoras", "Chinese Zodiac 3-layer portrait", "Shadow Work + 5 prompts", "Holistic Synthesis + Soul Message"],
    maxPeople: 0 },
  { id: "soul-connections", name: "Soul Connections", price: "$197", color: "#D47E9B",
    desc: "Full reading for you + 1 other person + compatibility",
    includes: ["Full Cosmic Self for both people", "Numerology compatibility reading", "Relationship dynamic analysis", "Soul contract between the two"],
    maxPeople: 1 },
  { id: "full-realm", name: "Full Realm", price: "$397", color: "#7EC4D4",
    desc: "Up to 5 people · Full readings + group dynamics",
    includes: ["Full Cosmic Self for all 5 people", "Individual numerology for each person", "Compatibility reading for every pair", "Group energy + collective shadow"],
    maxPeople: 4 },
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
  legalFirst:"", legalMiddle:"", legalLast:"",
  currentFirst:"", currentMiddle:"", currentLast:"",
  bMonth:"", bDay:"", bYear:"", timeKnown:"", bHour:"", bMinute:"",
  bCity:"", bState:"", bCountry:"",
  marriageMonth:"", marriageDay:"", marriageYear:"",

  people:[]
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

    {r.sunSign && <Sec icon="☀️" title={"Sun Sign — " + r.sunSign.sign} color="#7EC4D4">
      <InfoBlock label={r.sunSign.sign + " Sun"} text={r.sunSign.reading} color="#7EC4D4" />
    </Sec>}
    {r.marriageUnion && <Sec icon="💍" title={"Marriage / Union — Life Path " + r.marriageUnion.unionLifePath} color="#D47E9B">
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14,padding:"10px 14px",background:"rgba(212,126,155,.06)",border:"1px solid rgba(212,126,155,.2)",borderRadius:6}}>
        <div style={{textAlign:"center",minWidth:54}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#D47E9B",fontWeight:700}}>{r.marriageUnion.unionLifePath}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:".1em",textTransform:"uppercase"}}>Union LP</div>
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontStyle:"italic"}}>Marriage date: {r.marriageUnion.date} — the soul purpose and destiny of this union</div>
      </div>
      <InfoBlock label="The Soul Mission of This Union" text={r.marriageUnion.reading} color="#D47E9B" />
    </Sec>}
    {r.compatibility && r.compatibility.length > 0 && <Sec icon="✦" title="Compatibility — Numerology Relationship Reading" color="#9B7ED4">
      {r.compatibility.map((c, i) => (
        <div key={i} style={{background:"rgba(155,126,212,.04)",border:"1px solid rgba(155,126,212,.18)",borderRadius:7,padding:"14px 16px",marginBottom:10}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",color:"#9B7ED4",textTransform:"uppercase",marginBottom:8}}>{c.relationship ? c.relationship + " — " : ""}{c.name} · Life Path {c.lifePath}</div>
          {c.harmony && <div style={{marginBottom:6}}><span style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(200,169,110,.7)",textTransform:"uppercase",letterSpacing:".1em"}}>Harmony · </span><span style={{fontSize:13,color:"rgba(255,255,255,.72)",lineHeight:1.8}}>{c.harmony}</span></div>}
          {c.tension && <div style={{marginBottom:6}}><span style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(212,126,155,.7)",textTransform:"uppercase",letterSpacing:".1em"}}>Growth Edge · </span><span style={{fontSize:13,color:"rgba(255,255,255,.72)",lineHeight:1.8}}>{c.tension}</span></div>}
          {c.soulLesson && <div><span style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"rgba(126,196,212,.7)",textTransform:"uppercase",letterSpacing:".1em"}}>Soul Lesson · </span><span style={{fontSize:13,color:"rgba(255,255,255,.72)",lineHeight:1.8}}>{c.soulLesson}</span></div>}
          {c.reading && <p style={{fontSize:13,color:"rgba(255,255,255,.72)",lineHeight:1.88,marginTop:8}}>{c.reading}</p>}
        </div>
      ))}
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
  const maxPeople = tier ? (tier.maxPeople || 0) : 0;
  const hasPeople = maxPeople > 0;

  const pickTier = id => { setTierId(id); setStep("form"); window.scrollTo({ top:0, behavior:"smooth" }); };

  const submit = async () => {
    if (!email) { alert("Please enter your email."); return; }
    setStep("gen"); setErr("");
    const msgs = ["Calculating your sacred numbers…","Building the Arrows of Pythagoras…","Weaving your cosmic portrait…","Weaving your complete reading…","Almost ready…"];
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
    const name = person.legalFirst || "Friend";
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
        <p style={{ color:"rgba(255,255,255,.35)", maxWidth:560, margin:"0 auto", fontSize:12, lineHeight:2, fontStyle:"italic" }}>Complete Numerology (David A. Phillips) · Chinese Zodiac · Arrows of Pythagoras · Shadow Work</p>
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

            <GD label="Full Legal Birth Name" />
            <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginBottom:10,fontStyle:"italic",lineHeight:1.7}}>Your birth certificate name is the foundation of your numerology. Every letter carries a frequency. Middle name included if you have one.</div>
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

            <GD label="Time & Place of Birth — For Chinese Zodiac Secret Animal" />
            <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:12, fontStyle:"italic" }}>Birth time unlocks your Chinese Secret Animal (subconscious drive). If unknown, leave blank.</div>
            <TS l="Birth Time Known?" v={person.timeKnown} s={v => upd({timeKnown:v})} opts={[{v:"exact",l:"Yes — exact"},{v:"approximate",l:"Approximate"},{v:"unknown",l:"Don't know"}]} />
            {(person.timeKnown === "exact" || person.timeKnown === "approximate") && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <TS l="Hour" v={person.bHour} s={v => upd({bHour:v})} opts={Array.from({length:24},(_,h)=>({v:String(h).padStart(2,"0"),l:h===0?"12:00 AM":h<12?h+":00 AM":h===12?"12:00 PM":(h-12)+":00 PM"}))} />
              <TS l="Minute" v={person.bMinute} s={v => upd({bMinute:v})} opts={["00","05","10","15","20","25","30","35","40","45","50","55"].map(m=>({v:m,l:":"+m}))} />
            </div>}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:10 }}>
              <TI l="City of Birth" v={person.bCity} s={v => upd({bCity:v})} p="e.g. Dallas" />
              <TI l="State / Region" v={person.bState} s={v => upd({bState:v})} p="TX" />
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
            </>}



            {hasPeople && <>
              <GD label="Additional People — Compatibility Reading" />
              <p style={{fontSize:11,color:"rgba(255,255,255,.32)",marginBottom:14,fontStyle:"italic",lineHeight:1.8}}>
                {tierId === "soul-connections"
                ? "Add the 1 person you want a compatibility reading with — partner, child, parent, or close friend."
                : "Add up to 4 additional people (5 total including you). Each receives their own numerology + a compatibility reading with you."}
              </p>
              {(person.people||[]).length === 0 && <div style={{textAlign:"center",padding:"18px",border:"1px dashed rgba(155,126,212,.2)",borderRadius:7,marginBottom:12,color:"rgba(255,255,255,.25)",fontSize:12,fontStyle:"italic"}}>No people added yet — use the button below to add {tierId === "soul-connections" ? "1 person" : "up to 4 people"}</div>}
              {(person.people||[]).map((p2, i) => (
                <div key={i} style={{background:"rgba(155,126,212,.04)",border:"1px solid rgba(155,126,212,.15)",borderRadius:7,padding:"14px 16px",marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",color:"#9B7ED4",textTransform:"uppercase"}}>
                      {tierId === "soul-connections" ? "Other Person" : "Person " + (i + 2)}
                    </div>
                    <button onClick={() => upd({people:(person.people||[]).filter((_,j)=>j!==i)})} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.25)",cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>✕ Remove</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                    <TI l="First Name" v={p2.firstName} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],firstName:v}; upd({people:arr}); }} p="First" />
                    <TI l="Middle Name" v={p2.middleName||""} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],middleName:v}; upd({people:arr}); }} p="Middle (optional)" />
                    <TI l="Last Name" v={p2.lastName} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],lastName:v}; upd({people:arr}); }} p="Last (optional)" />
                  </div>
                  <TS l="Relationship to You" v={p2.relationship} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],relationship:v}; upd({people:arr}); }} opts={[{v:"",l:"— Select —"},{v:"Romantic Partner",l:"💑 Romantic Partner"},{v:"Spouse",l:"💍 Spouse"},{v:"Ex Partner",l:"💔 Ex Partner"},{v:"Child",l:"👶 Child"},{v:"Parent",l:"👪 Parent"},{v:"Sibling",l:"🤝 Sibling"},{v:"Best Friend",l:"✨ Best Friend"},{v:"Close Friend",l:"🌟 Close Friend"},{v:"Business Partner",l:"💼 Business Partner"},{v:"Colleague",l:"🏢 Colleague"},{v:"Other",l:"Other"}]} />
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:10,marginTop:6}}>
                    <TS l="Birth Month" v={p2.bMonth} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],bMonth:v}; upd({people:arr}); }} opts={MONTHS} />
                    <TS l="Day" v={p2.bDay} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],bDay:v}; upd({people:arr}); }} opts={DAYS} />
                    <TS l="Year" v={p2.bYear} s={v => { const arr=[...(person.people||[])]; arr[i]={...arr[i],bYear:v}; upd({people:arr}); }} opts={YEARS} />
                  </div>
                </div>
              ))}
              {(person.people||[]).length < maxPeople && <button onClick={() => upd({people:[...(person.people||[]),{firstName:"",lastName:"",bMonth:"",bDay:"",bYear:"",relationship:""}]})} style={{background:"transparent",border:"1px dashed rgba(155,126,212,.35)",color:"rgba(155,126,212,.6)",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",padding:"10px 20px",borderRadius:5,cursor:"pointer",width:"100%",marginBottom:4}}>+ Add {tierId === "soul-connections" ? "This Person" : "Another Person"}</button>}

              <GD label="Marriage / Union Date — Optional" />
              <div style={{background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.12)",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11,color:"rgba(255,255,255,.45)",fontStyle:"italic",lineHeight:1.8}}>
                ✦ Your marriage or commitment date carries its own Life Path — the soul purpose and destiny of the union itself. Leave blank if not applicable.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:10}}>
                <TS l="Month" v={person.marriageMonth} s={v => upd({marriageMonth:v})} opts={MONTHS} />
                <TS l="Day" v={person.marriageDay} s={v => upd({marriageDay:v})} opts={DAYS} />
                <TS l="Year" v={person.marriageYear} s={v => upd({marriageYear:v})} opts={YEARS} />
              </div>
            </>}


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
              <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:19, color:"#fff" }}>{tier && tier.name} — {person.legalFirst || "Your Reading"}</h2>
            </div>
            <button onClick={reset} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.38)", padding:"7px 13px", borderRadius:4, cursor:"pointer", fontSize:11, fontFamily:"'Cinzel',serif" }}>← New Reading</button>
          </div>
          <ReadingView reading={reading} name={person.legalFirst || "Friend"} onEmail={sendMail} emailSt={emailSt} />
        </div>}

      </div>
    </div>
  </>;
}
