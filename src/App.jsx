import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// ⚙️  CONFIG  — replace before deploying
// ═══════════════════════════════════════════════════════════
const CFG = {
  EMAILJS_SERVICE_ID:  "service_kw55hqi",
EMAILJS_TEMPLATE_ID: "template_hqle32c",
EMAILJS_PUBLIC_KEY:  "dkHFmGFcO68nWPpAc",
PRACTITIONER_EMAIL:  "sacredsoulmap@gmail.com",
};

// ═══════════════════════════════════════════════════════════
// 🔢  COMPLETE DAVID A. PHILIPS NUMEROLOGY ENGINE
// ═══════════════════════════════════════════════════════════

// Letter → number (Pythagorean)
const LV={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const VOWELS=new Set(["A","E","I","O","U"]);
const lv=c=>LV[c.toUpperCase()]||0;

function reduce(n,keepMaster=true){
  if(keepMaster&&(n===11||n===22||n===33))return n;
  if(n<10)return n;
  return reduce(String(n).split("").reduce((s,d)=>s+ +d,0),keepMaster);
}
function digitSum(str){return str.split("").reduce((s,d)=>s+ +d,0);}
function nameLetterSum(name,filter=null){
  return name.toUpperCase().replace(/[^A-Z]/g,"").split("").reduce((s,c)=>{
    if(filter==="v"&&!VOWELS.has(c))return s;
    if(filter==="c"&&VOWELS.has(c))return s;
    return s+lv(c);
  },0);
}

// ── Karmic Debt detection ──────────────────────────────────
const KARMIC_DEBT={13:"13/4 — The number of transformation. Past laziness requires discipline and hard work this lifetime.",14:"14/5 — Freedom misused. Requires building structure and avoiding over-indulgence.",16:"16/7 — Ego and pride brought low. Spiritual humility and surrender are the lesson.",19:"19/1 — Independence misused. Learning to receive help and collaborate with others."};
function getKarmic(rawNum){return KARMIC_DEBT[rawNum]||null;}

// ── Lo Shu / Pythagorean Birth Chart Grid ─────────────────
// Grid positions: 3 6 9 / 2 5 8 / 1 4 7
function buildGrid(digits){
  const g={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  digits.forEach(d=>{const n=+d; if(n>=1&&n<=9)g[n]++;});
  return g;
}
function dateDigits(m,d,y){
  return (String(+m)+String(+d)+String(+y)).split("").filter(c=>c!=="0");
}
function nameDigits(name){
  return name.toUpperCase().replace(/[^A-Z]/g,"").split("").map(c=>String(lv(c))).filter(c=>c!=="0");
}

// ── Arrows of Pythagoras ───────────────────────────────────
const ARROW_DEFS=[
  {nums:[3,6,9],label:"3-6-9",plane:"Mind",
   s:{name:"Arrow of the Intellect",desc:"A razor-sharp mind with exceptional memory and mental clarity. Natural learner, teacher, or communicator. Can struggle with overthinking or living in the head."},
   w:{name:"Arrow of Poor Memory",desc:"Memory and concentration require conscious effort. The mind is capable but needs structured learning tools. Can compensate through repetition, writing things down, and mindfulness practices."}},
  {nums:[2,5,8],label:"2-5-8",plane:"Emotion",
   s:{name:"Arrow of Emotional Balance",desc:"Strong intuition and emotional intelligence. Deeply feeling yet stable. Natural counselor or healer energy. Must guard against absorbing others' emotions."},
   w:{name:"Arrow of Emotional Sensitivity / Imbalance",desc:"Emotional life is amplified — prone to extreme sensitivity, mood fluctuation, or emotional shutdown as protection. The central healing ground of this lifetime. Profound empathy when integrated."}},
  {nums:[1,4,7],label:"1-4-7",plane:"Physical",
   s:{name:"Arrow of Physical Activity",desc:"High physical energy, strong vitality, and natural drive. Thrives in action-oriented environments. Needs physical outlets to stay grounded and healthy."},
   w:{name:"Arrow of Inactivity / Disorder",desc:"Physical energy requires deliberate cultivation. Tendency toward procrastination or difficulty completing physical tasks. Benefits enormously from routine, movement, and structured environments."}},
  {nums:[1,2,3],label:"1-2-3",plane:"Will",
   s:{name:"Arrow of Will / Determination",desc:"Extraordinary willpower and the ability to see things through. When committed, nearly unstoppable. Must guard against stubbornness and using will to overpower others."},
   w:{name:"Arrow of Weak Will",desc:"Goals can be set but not sustained. Easily swayed by others' opinions or circumstances. Building daily commitments and small wins is the path to developing this quality."}},
  {nums:[4,5,6],label:"4-5-6",plane:"Logic",
   s:{name:"Arrow of the Practical Planner",desc:"Exceptional organizational ability, logical thinking, and structured creativity. Can build systems from scratch. May struggle with spontaneity or trusting intuition over logic."},
   w:{name:"Arrow of Disorder / Frustration",desc:"Planning and follow-through feel effortful. Tendency to start without structure leads to frustration. Learning systems, lists, and practical frameworks transforms this weakness into a superpower."}},
  {nums:[7,8,9],label:"7-8-9",plane:"Activity",
   s:{name:"Arrow of Activity / Enquiry",desc:"Enormous drive, curiosity, and energy. Natural researcher, creator, or entrepreneur. Life is lived at full speed. Rest must be scheduled or burnout follows."},
   w:{name:"Arrow of Passivity / Inactivity",desc:"Energy can be low or scattered. Difficulty sustaining momentum or initiating action. Regular physical practices, sleep discipline, and purpose clarity are transformative here."}},
  {nums:[1,5,9],label:"1-5-9",plane:"Determination",
   s:{name:"Arrow of Determination",desc:"The most powerful arrow. Relentless drive and laser focus toward goals. Natural leadership and ambition. Shadow: steamrolling others or difficulty accepting limits."},
   w:{name:"Arrow of Scattered Energy",desc:"Difficulty maintaining direction when obstacles arise. Energy disperses across too many projects. Developing one primary focus for a sustained period creates breakthrough results."}},
  {nums:[3,5,7],label:"3-5-7",plane:"Compassion",
   s:{name:"Arrow of Compassion / Sensitivity",desc:"Deep empathy, spiritual sensitivity, and natural healing ability. Feels what others feel. Must protect energy carefully. Often drawn to service, healing, or spiritual work."},
   w:{name:"Arrow of Insensitivity / Emotional Extremes",desc:"Either difficulty reading emotional undercurrents (appearing cold) OR extreme hypersensitivity that overwhelms. Learning the middle path of compassionate boundaries is the lifetime work."}},
];

function calcArrows(grid){
  const strength=[],weakness=[];
  ARROW_DEFS.forEach(a=>{
    const present=a.nums.filter(n=>grid[n]>0).length;
    if(present===3)strength.push(a);
    else if(present===0)weakness.push(a);
  });
  return{strength,weakness};
}

// ── Planes of Expression (Philips classification) ─────────
// Physical: 4(D,M,V) 5(E,N,W) 7(G,P,Y) — earthy, material
// Mental:   1(A,J,S) 8(H,Q,Z) — mind, thought
// Emotional:2(B,K,T) 3(C,L,U) 6(F,O,X) — feeling, heart
// Intuitive:9(I,R) — spiritual, higher knowing
const PLANE_MAP={1:"mental",2:"emotional",3:"emotional",4:"physical",5:"physical",6:"emotional",7:"physical",8:"mental",9:"intuitive"};
function calcPlanes(name){
  const planes={physical:0,mental:0,emotional:0,intuitive:0};
  name.toUpperCase().replace(/[^A-Z]/g,"").split("").forEach(c=>{
    const v=lv(c); const p=PLANE_MAP[v];
    if(p)planes[p]++;
  });
  return planes;
}

// ── Main Numerology Calculator ────────────────────────────
function calcAll(person){
  const{legalFirst:f="",legalMiddle:m="",legalLast:l="",bMonth,bDay,bYear,currentFirst,currentLast}=person;
  const fullName=[f,m,l].filter(Boolean).join(" ");
  const curName=[currentFirst,currentLast].filter(Boolean).join(" ");
  const curY=new Date().getFullYear();

  // Core numbers
  const rawLP=reduce(+bMonth)+reduce(+bDay)+reduce(digitSum(bYear));
  const lifePath=reduce(rawLP);
  const rawExpr=nameLetterSum(fullName);
  const expression=reduce(rawExpr);
  const rawSoul=nameLetterSum(fullName,"v");
  const soulUrge=reduce(rawSoul);
  const rawPers=nameLetterSum(fullName,"c");
  const personality=reduce(rawPers);
  const birthday=reduce(+bDay);
  const pyRaw=reduce(+bMonth)+reduce(+bDay)+reduce(digitSum(String(curY)));
  const personalYear=reduce(pyRaw);
  const maturity=reduce(lifePath+expression);
  const balance=reduce(lv((f||"a")[0]));
  const subconscious=reduce(nameLetterSum(fullName));
  
  // Subconscious self = 9 minus count of missing numbers
  const presentNums=new Set(fullName.toUpperCase().replace(/[^A-Z]/g,"").split("").map(lv).filter(Boolean));
  const missing=[1,2,3,4,5,6,7,8,9].filter(n=>!presentNums.has(n));
  const subconsciousSelf=9-missing.length;

  // Pinnacles (4 life chapters)
  const mRed=reduce(+bMonth), dRed=reduce(+bDay), yRed=reduce(digitSum(bYear));
  const pin1=reduce(mRed+dRed);
  const pin2=reduce(dRed+yRed);
  const pin3=reduce(pin1+pin2);
  const pin4=reduce(mRed+yRed);

  // Challenges
  const ch1=Math.abs(mRed-dRed);
  const ch2=Math.abs(dRed-yRed);
  const ch3=Math.abs(ch1-ch2);
  const ch4=Math.abs(mRed-yRed);

  // Pinnacle ages (based on LP)
  const pin1End=36-lifePath;
  const pin2End=pin1End+9;
  const pin3End=pin2End+9;

  // Karmic debts — check raw values before reduction
  const karmicDebts=[];
  [rawLP,rawExpr,rawSoul,rawPers].forEach(raw=>{
    const k=getKarmic(raw);
    if(k)karmicDebts.push(k);
  });

  // Master numbers present
  const masterNums=[lifePath,expression,soulUrge,personality,personalYear].filter(n=>n===11||n===22||n===33);

  // Lo Shu / Birth Grid (birth date only)
  const bDigits=dateDigits(bMonth,bDay,bYear);
  const birthGrid=buildGrid(bDigits);
  const birthArrows=calcArrows(birthGrid);

  // Name Grid (name letter values)
  const nDigits=nameDigits(fullName);
  const nameGrid=buildGrid(nDigits);

  // Combined Grid
  const combined={};
  [1,2,3,4,5,6,7,8,9].forEach(n=>{combined[n]=(birthGrid[n]||0)+(nameGrid[n]||0);});
  const combinedArrows=calcArrows(combined);

  // Planes of Expression
  const planes=calcPlanes(fullName);

  // Current name analysis (if changed)
  const curNameAnalysis=curName?{
    expression:reduce(nameLetterSum(curName)),
    soulUrge:reduce(nameLetterSum(curName,"v")),
    personality:reduce(nameLetterSum(curName,"c")),
  }:null;

  // Personal Month & Day
  const now=new Date();
  const personalMonth=reduce(personalYear+reduce(now.getMonth()+1));
  const personalDay=reduce(personalMonth+reduce(now.getDate()));

  // Intensity / Dominant numbers from name
  const numCount={};
  fullName.toUpperCase().replace(/[^A-Z]/g,"").split("").forEach(c=>{
    const v=lv(c); if(v){numCount[v]=(numCount[v]||0)+1;}
  });
  const intensityNums=Object.entries(numCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n,c])=>({num:+n,count:c}));

  return{
    fullName,lifePath,expression,soulUrge,personality,birthday,
    personalYear,personalMonth,personalDay,
    maturity,balance,subconsciousSelf,missing,
    pinnacles:[pin1,pin2,pin3,pin4],
    pinnacleAges:[pin1End,pin2End,pin3End],
    challenges:[ch1,ch2,ch3,ch4],
    karmicDebts,masterNums,
    birthGrid,nameGrid,combinedGrid:combined,
    birthArrows,combinedArrows,
    planes,intensityNums,
    curNameAnalysis,
  };
}

function chineseZodiac(year){
  const A=["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  const E=["Metal","Metal","Water","Water","Wood","Wood","Fire","Fire","Earth","Earth"];
  const P=["Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin"];
  const y=+year, ai=((y-4)%12+12)%12, ei=((y-4)%10+10)%10;
  return{animal:A[ai],element:E[ei],polarity:P[ai]};
}
function sunSign(m,d){
  const S=[["Capricorn",12,22],["Aquarius",1,20],["Pisces",2,19],["Aries",3,21],["Taurus",4,20],["Gemini",5,21],["Cancer",6,21],["Leo",7,23],["Virgo",8,23],["Libra",9,23],["Scorpio",10,23],["Sagittarius",11,22]];
  const mi=+m,di=+d;
  for(let i=0;i<S.length;i++){const[name,sm,sd]=S[i],next=S[(i+1)%12];if(mi===sm&&di>=sd)return name;if(mi===next[1]&&di<next[2])return name;}
  return"Capricorn";
}

// ═══════════════════════════════════════════════════════════
// 🧠  TIERED CLAUDE PROMPT BUILDER
// ═══════════════════════════════════════════════════════════
function buildPrompt(formData){
  const{persons,tierId}=formData;
  const p=persons[0];
  const n=calcAll(p);
  const cz=chineseZodiac(p.bYear);
  const sun=sunSign(p.bMonth,p.bDay);
  const name=p.preferredName||p.legalFirst||"this soul";
  const isFull=tierId!=="soul-spark";
  const hasShadow=isFull;

  const arrowsBlock=`
BIRTH DATE GRID (Lo Shu — birth date digits only):
  ${p.bMonth}/${p.bDay}/${p.bYear} → digits: ${dateDigits(p.bMonth,p.bDay,p.bYear).join(",")}
  Grid counts: ${[9,6,3,8,5,2,7,4,1].map(n=>`${n}(${n.birthGrid||"·"})`)}
  Arrows of STRENGTH from birth chart: ${n.birthArrows.strength.map(a=>`${a.label} ${a.s.name}`).join(" | ")||"None"}
  Arrows of WEAKNESS from birth chart: ${n.birthArrows.weakness.map(a=>`${a.label} ${a.w.name}`).join(" | ")||"None"}

COMBINED CHART ARROWS (birth date + full name):
  Arrows of STRENGTH: ${n.combinedArrows.strength.map(a=>`${a.label} ${a.s.name}`).join(" | ")||"None"}
  Arrows of WEAKNESS: ${n.combinedArrows.weakness.map(a=>`${a.label} ${a.w.name}`).join(" | ")||"None"}`;

  const planesBlock=`
PLANES OF EXPRESSION (from full name):
  Physical (4s,5s,7s — earthy/material): ${n.planes.physical} letters
  Mental (1s,8s — mind/thought): ${n.planes.mental} letters
  Emotional (2s,3s,6s — feeling/heart): ${n.planes.emotional} letters
  Intuitive (9s — spiritual): ${n.planes.intuitive} letters
  Dominant plane: ${Object.entries(n.planes).sort((a,b)=>b[1]-a[1])[0][0]}
  Intensity numbers (most frequent in name): ${n.intensityNums.map(x=>`${x.num}(×${x.count})`).join(", ")}`;

  const shadowBlock=hasShadow?`
SHADOW WORK DATA:
  Themes flagged: ${p.shadowThemes?.join("; ")||"None selected"}
  Recurring patterns: ${p.recurringPatterns||"Not shared"}
  Earliest wound: ${p.childhoodWound||"Not shared"}
  Readiness scale: ${p.shadowDepth||5}/10
  Shadow goal: ${p.shadowGoal||"Not specified"}`:"";

  const freqBlock=hasShadow?`
MEDITATION & SOUND HEALING:
  Meditation focus: ${p.meditationFocus?.join(", ")||"Not selected"}
  Chakras flagged: ${p.chakraFocus?.join(", ")||"None"}
  Frequencies drawn to: ${p.freqInterest?.join("; ")||"None"}
  Binaural interests: ${p.binauralInterest?.join("; ")||"None"}
  Current practice: ${p.currentPractice||"None"}
  Experience: ${p.meditationExp||"Not specified"}`:"";

  const tierInstructions={
    "soul-spark":`
TIER: Soul Spark — Core Reading Only
Generate ONLY these sections in your JSON:
- cosmicSnapshot (3-4 sentences)
- numerology: lifePath, expression, soulUrge, personality, birthday, personalYear
- chineseZodiac
- soulMessage
Do NOT include: arrows, planes, shadow work, astrology, frequencies, pinnacles/challenges`,

    "cosmic-self":`
TIER: Cosmic Self — Full Complete Reading
Generate ALL sections fully:
- cosmicSnapshot
- numerology: ALL numbers including maturity, balance, subconsciousSelf, missing, pinnacles, challenges, karmicDebts, masterNums, personalMonth, personalDay, curNameAnalysis
- arrows: full birth and combined chart arrow analysis
- planesOfExpression
- astrology
- chineseZodiac
- shadowWork (full — 5 journal prompts)
- meditation (full frequency + binaural protocol)
- soulMessage`,

    "soul-connections":`
TIER: Soul Connections — You + One Other
Generate EVERYTHING from Cosmic Self tier for BOTH people, PLUS:
- compatibility: numerologyCompatibility, synastryThemes, sharedShadow, communicationStyles, soulContract
- soulMessage for the relationship itself`,

    "full-realm":`
TIER: Full Realm — Up to 5 People
Generate full Cosmic Self for each person, PLUS:
- groupDynamics: dominantNumbers, missingGroupEnergies, arrowPatterns, groupShadow, collectiveFrequency
- soulMessage for the collective`,
  };

  return `You are a master numerologist deeply trained in David A. Philips' Complete Book of Numerology, a Western astrologer, Chinese zodiac scholar, Jungian shadow work guide, and sound healing practitioner. Your readings are precise, personal, and transformative — never generic.

${tierInstructions[tierId]||tierInstructions["soul-spark"]}

═══════════ PERSON DATA FOR ${name.toUpperCase()} ═══════════

IDENTITY:
  Name: ${name} | Pronouns: ${p.pronouns||"not specified"}
  Full Legal Birth Name: ${n.fullName}
  Current Name: ${[p.currentFirst,p.currentLast].filter(Boolean).join(" ")||"Same as birth name"}

CORE NUMEROLOGY (Pythagorean — David Philips):
  Life Path: ${n.lifePath}${n.karmicDebts.some(k=>k.startsWith(String(reduce(reduce(+p.bMonth)+reduce(+p.bDay)+reduce(digitSum(p.bYear)),false))))?" (KARMIC DEBT)":""}
  Expression: ${n.expression}
  Soul Urge (Heart's Desire): ${n.soulUrge}
  Personality: ${n.personality}
  Birthday Number: ${n.birthday}
  Personal Year (${new Date().getFullYear()}): ${n.personalYear}
  Personal Month (current): ${n.personalMonth}
  Personal Day (today): ${n.personalDay}
  Maturity Number: ${n.maturity}
  Balance Number: ${n.balance}
  Subconscious Self: ${n.subconsciousSelf}
  Missing Numbers: ${n.missing.join(",")||"None — all nine energies present"}
  Intensity Numbers (most in name): ${n.intensityNums.map(x=>`${x.num}(×${x.count})`).join(", ")}
  Pinnacles: ${n.pinnacles[0]} (birth–age${n.pinnacleAges[0]}) → ${n.pinnacles[1]} (age${n.pinnacleAges[0]}–${n.pinnacleAges[1]}) → ${n.pinnacles[2]} (age${n.pinnacleAges[1]}–${n.pinnacleAges[2]}) → ${n.pinnacles[3]} (age${n.pinnacleAges[2]}+)
  Challenges: ${n.challenges[0]}, ${n.challenges[1]}, ${n.challenges[2]} (main), ${n.challenges[3]}
  Karmic Debts: ${n.karmicDebts.length?n.karmicDebts.join(" | "):"None detected"}
  Master Numbers present: ${n.masterNums.length?n.masterNums.join(", "):"None"}
  Current name analysis: ${n.curNameAnalysis?`Expression ${n.curNameAnalysis.expression}, Soul Urge ${n.curNameAnalysis.soulUrge}, Personality ${n.curNameAnalysis.personality}`:"N/A — name unchanged"}

${isFull?arrowsBlock:""}
${isFull?planesBlock:""}

ASTROLOGY:
  DOB: ${p.bMonth}/${p.bDay}/${p.bYear} | Time: ${p.bHour?(p.bHour+":"+(p.bMinute||"00")):"Unknown"} | Place: ${[p.bCity,p.bState,p.bCountry].filter(Boolean).join(", ")||"Not provided"}
  Sun Sign: ${sun}

CHINESE ZODIAC:
  ${cz.element} ${cz.animal} (${cz.polarity})

${shadowBlock}
${freqBlock}

INTENTIONS:
  ${p.goals||"Not specified"}

═══════════ REQUIRED JSON OUTPUT ═══════════
Return ONLY a valid JSON object — no markdown, no backticks, no explanation. Use this schema (omit sections not required for this tier):

{
  "cosmicSnapshot": "3-4 sentence poetic but grounded opening. What is the central theme of this entire chart? What lifetime is this? Reference ${name} by name and their Life Path ${n.lifePath}.",

  "numerology": {
    "lifePath": {
      "number": ${n.lifePath},
      "title": "evocative 3-word title",
      "essence": "one-sentence core essence",
      "reading": "5-6 deeply personal sentences. What is the soul's purpose with this Life Path? What are the highest expressions? Reference ${name} directly. Weave in their current Personal Year ${n.personalYear}.",
      "shadow": "3-4 sentences on the shadow side, ego traps, and where this number tends to self-sabotage",
      "gifts": "2-3 sentences on the unique gifts this number carries into the world"
    },
    "expression": { "number": ${n.expression}, "title": "title", "reading": "4-5 sentences on natural talents, destiny, and what they were built to DO in the world" },
    "soulUrge": { "number": ${n.soulUrge}, "title": "title", "reading": "4-5 sentences on the deepest private desire — what motivates beneath all the noise" },
    "personality": { "number": ${n.personality}, "title": "title", "reading": "3-4 sentences on how others perceive them, the first impression they make, the mask they wear" },
    "birthday": { "number": ${n.birthday}, "title": "title", "reading": "3 sentences on this special talent and how it flavors the whole chart" },
    "personalYear": { "number": ${n.personalYear}, "title": "title", "reading": "4-5 sentences on the exact energy and invitation of this personal year. What to embrace, release, build, and avoid. Mention current Personal Month ${n.personalMonth} and how this week/month feels." },
    "maturity": { "number": ${n.maturity}, "reading": "3 sentences on the energy that fully emerges after 40. How does this number reshape the second half of life?" },
    "balance": { "number": ${n.balance}, "reading": "3 sentences on how ${name} responds instinctively under stress and what helps them return to center" },
    "subconsciousSelf": { "number": ${n.subconsciousSelf}, "reading": "3 sentences on what they do naturally and automatically in crisis situations" },
    "missing": { "numbers": ${JSON.stringify(n.missing)}, "reading": "3-4 sentences on the karmic lessons these missing numbers represent — what they came to consciously develop. Be specific about each number." },
    "intensityNumbers": "2-3 sentences on the intensity numbers (${n.intensityNums.map(x=>x.num).join(",")}) and what their high frequency in the name chart means for personality and drive",
    "pinnacles": "4-5 sentences weaving all four pinnacles (${n.pinnacles.join(",")}) into a narrative arc of ${name}'s life chapters. Which pinnacle are they in now? What does it ask of them?",
    "challenges": "3-4 sentences on the challenges (${n.challenges.join(",")}) as initiations — not obstacles but invitations to grow. What is the main challenge (${n.challenges[2]}) really asking for?",
    "karmicDebts": ${JSON.stringify(n.karmicDebts.length?n.karmicDebts:null)},
    "karmicReading": "${n.karmicDebts.length?"3-4 sentences on the specific karmic debt(s) present, what was unlearned in past lives, and how this life is structured to complete that lesson":"null"}",
    "masterNumbers": "${n.masterNums.length?"3-4 sentences on the master number(s) "+n.masterNums.join(",")+" present in the chart, the higher calling they represent, and the tension between the master vibration and its reduced form":"null"}",
    "currentNameShift": "${n.curNameAnalysis?"3 sentences on how the current name differs vibrationally from the birth name and what energies have been activated or suppressed by the change":"null"}"
  },

  "arrows": {
    "overview": "3-4 sentences on what the Lo Shu grid reveals overall — the pattern of presence and absence, what this says about how ${name} is naturally equipped vs. where they are being called to develop",
    "strengthArrows": [${n.combinedArrows.strength.map(a=>`{"label":"${a.label}","name":"${a.s.name}","personalReading":"3-4 sentences applying this arrow specifically to ${name}'s chart — how it expresses alongside their Life Path ${n.lifePath} and current life themes"}`).join(",")}],
    "weaknessArrows": [${n.combinedArrows.weakness.map(a=>`{"label":"${a.label}","name":"${a.w.name}","personalReading":"3-4 sentences on how this missing arrow likely shows up in ${name}'s life, the gift hidden in the absence, and the specific practices that develop this quality","practice":"1-2 sentence concrete practice recommendation"}`).join(",")}],
    "gridInsight": "2-3 sentences on the overall pattern — which planes are lit up, which are empty, and what this means for how ${name} moves through the world"
  },

  "planesOfExpression": {
    "overview": "3-4 sentences on the dominant plane (${Object.entries(n.planes).sort((a,b)=>b[1]-a[1])[0][0]}) and what this means for how ${name} naturally expresses themselves",
    "physical": { "count": ${n.planes.physical}, "reading": "2-3 sentences" },
    "mental": { "count": ${n.planes.mental}, "reading": "2-3 sentences" },
    "emotional": { "count": ${n.planes.emotional}, "reading": "2-3 sentences" },
    "intuitive": { "count": ${n.planes.intuitive}, "reading": "2-3 sentences" }
  },

  "astrology": {
    "sunSign": "${sun}",
    "sunReading": "4-5 sentences — how their ${sun} Sun interplays specifically with Life Path ${n.lifePath} and Expression ${n.expression}. Where do these energies amplify each other? Where do they create productive tension?",
    "chartThemes": "3-4 sentences weaving birth location, season, time if known into the overall energy signature",
    "currentSky": "3-4 sentences on what the current ${new Date().getFullYear()} astrological climate means for their Personal Year ${n.personalYear}"
  },

  "chineseZodiac": {
    "sign": "${cz.element} ${cz.animal} (${cz.polarity})",
    "reading": "4-5 sentences on this specific ${cz.element} ${cz.animal} — the gifts, the shadow, the unique flavor this brings. How does the ${cz.element} element shape the ${cz.animal}'s typical energy?",
    "crossReference": "3-4 sentences on how the Chinese zodiac energy intersects or conflicts with the Life Path ${n.lifePath} and the dominant arrow patterns"
  },

  "shadowWork": {
    "coreWound": "4-5 sentences identifying the central shadow thread — the pattern beneath all other patterns. Be specific and precise, not generic. Connect it directly to numbers and arrows.",
    "origin": "4-5 sentences on where this wound likely originated and why it was adaptive. Compassionate, not clinical. Reference the karmic or numerological context.",
    "howItShows": "4-5 sentences on specific ways this shadow likely operates — in relationships, work, self-talk, body. Based on everything in the data.",
    "theGold": "3-4 sentences on what becomes available when this shadow integrates. What is the superpower on the other side of this wound?",
    "integrationPath": "4-5 sentences on a specific integration path for a ${n.lifePath} Life Path with these arrow patterns and shadow themes",
    "prompts": ["Deeply specific journal prompt 1 — references their actual data", "Prompt 2", "Prompt 3 — the body/somatic one", "Prompt 4 — the relationship one", "Prompt 5 — the hardest and most important one, the one they will want to skip"]
  },

  "meditation": {
    "overview": "3-4 sentences on their overall energetic makeup and why certain practices serve them specifically",
    "primaryPractice": { "name": "Practice name", "description": "4-5 sentences — exactly why this for THIS person, how to do it, what it addresses in their specific chart" },
    "secondaryPractice": { "name": "Practice name", "description": "3 sentences" },
    "frequencies": [
      { "hz": "xxx Hz", "name": "name", "why": "2-3 sentences — WHY this frequency maps to their specific Life Path, shadow themes, and arrows. Make it feel inevitable.", "use": "Practical 1-sentence instruction" },
      { "hz": "xxx Hz", "name": "name", "why": "2-3 sentences", "use": "instruction" },
      { "hz": "xxx Hz", "name": "name", "why": "2-3 sentences", "use": "instruction" }
    ],
    "binauralProtocol": "4-5 sentences: specific sequence — which state first, how long, what for, which state second, total session. Design this specifically for their shadow work goals and practice level.",
    "chakraPriority": "3-4 sentences on which chakra(s) are most urgent based on arrow weaknesses + shadow themes + numbers, and why",
    "dailyRitual": "5-6 sentence morning or evening ritual that weaves their numbers, shadow focus, and sound protocol into something simple and sustainable"
  },

  "soulMessage": "6-8 sentences written directly to ${name}. Use their name. Reference their Life Path ${n.lifePath}, their current Personal Year ${n.personalYear}, their strongest arrow and most significant weakness arrow. Acknowledge what they came here for. Tell them what this season is specifically asking of them. End with one sentence that will stay with them for years."
}`;
}

// ═══════════════════════════════════════════════════════════
// 📡  CLAUDE API
// ═══════════════════════════════════════════════════════════
async function generateReading(formData){
  const prompt=buildPrompt(formData);
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:5000,messages:[{role:"user",content:prompt}]})
  });
  const data=await res.json();
  const text=data.content?.[0]?.text||"";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

// ═══════════════════════════════════════════════════════════
// 📧  EMAILJS
// ═══════════════════════════════════════════════════════════
function readingToText(r,name,tierName){
  if(!r)return "";
  const lines=[`YOUR ${tierName.toUpperCase()} READING — ${name.toUpperCase()}\n${"═".repeat(55)}\n`];
  if(r.cosmicSnapshot)lines.push(`COSMIC SNAPSHOT\n${r.cosmicSnapshot}\n`);
  const N=r.numerology||{};
  if(Object.keys(N).length){
    lines.push(`NUMEROLOGY\n${"─".repeat(30)}`);
    ["lifePath","expression","soulUrge","personality","birthday","personalYear","maturity","balance","subconsciousSelf"].forEach(k=>{
      if(N[k])lines.push(`${k.toUpperCase()} ${N[k].number||""} ${N[k].title?`— ${N[k].title}`:""}\n${N[k].essence||""}\n${N[k].reading||""}\n${N[k].shadow?"Shadow: "+N[k].shadow:""}\n`);
    });
    if(N.missing?.reading)lines.push(`MISSING NUMBERS: ${(N.missing.numbers||[]).join(",")}\n${N.missing.reading}\n`);
    if(N.pinnacles)lines.push(`PINNACLES & CHALLENGES\n${N.pinnacles}\n${N.challenges||""}\n`);
    if(N.karmicReading&&N.karmicReading!=="null")lines.push(`KARMIC DEBT\n${N.karmicReading}\n`);
    if(N.masterNumbers&&N.masterNumbers!=="null")lines.push(`MASTER NUMBERS\n${N.masterNumbers}\n`);
  }
  const AR=r.arrows;
  if(AR){
    lines.push(`ARROWS OF PYTHAGORAS\n${"─".repeat(30)}\n${AR.overview}\n`);
    (AR.strengthArrows||[]).forEach(a=>lines.push(`✦ STRENGTH: ${a.label} — ${a.name}\n${a.personalReading}\n`));
    (AR.weaknessArrows||[]).forEach(a=>lines.push(`◌ WEAKNESS: ${a.label} — ${a.name}\n${a.personalReading}\nPractice: ${a.practice}\n`));
  }
  if(r.planesOfExpression)lines.push(`PLANES OF EXPRESSION\n${"─".repeat(30)}\n${r.planesOfExpression.overview}\n`);
  if(r.astrology)lines.push(`ASTROLOGY — ${r.astrology.sunSign}\n${"─".repeat(30)}\n${r.astrology.sunReading}\n${r.astrology.currentSky||""}\n`);
  if(r.chineseZodiac)lines.push(`CHINESE ZODIAC — ${r.chineseZodiac.sign}\n${"─".repeat(30)}\n${r.chineseZodiac.reading}\n${r.chineseZodiac.crossReference||""}\n`);
  const SW=r.shadowWork;
  if(SW){
    lines.push(`SHADOW WORK\n${"─".repeat(30)}`);
    ["coreWound","origin","howItShows","theGold","integrationPath"].forEach(k=>{ if(SW[k])lines.push(`${k.toUpperCase().replace(/([A-Z])/g," $1").trim()}\n${SW[k]}\n`); });
    if(SW.prompts?.length)lines.push(`JOURNAL PROMPTS\n${SW.prompts.map((p,i)=>`${i+1}. ${p}`).join("\n")}\n`);
  }
  const ME=r.meditation;
  if(ME){
    lines.push(`MEDITATION & FREQUENCY PROTOCOL\n${"─".repeat(30)}\n${ME.overview}\n`);
    if(ME.primaryPractice)lines.push(`Primary Practice: ${ME.primaryPractice.name}\n${ME.primaryPractice.description}\n`);
    (ME.frequencies||[]).forEach(f=>lines.push(`${f.hz} — ${f.name}: ${f.why} ${f.use}\n`));
    if(ME.binauralProtocol)lines.push(`Binaural Protocol\n${ME.binauralProtocol}\n`);
    if(ME.dailyRitual)lines.push(`Daily Ritual\n${ME.dailyRitual}\n`);
  }
  if(r.soulMessage)lines.push(`${"═".repeat(55)}\nA MESSAGE FOR ${name.toUpperCase()}\n${r.soulMessage}`);
  return lines.join("\n");
}

async function sendEmail(toEmail,toName,tierName,reading){
  const res=await fetch("https://api.emailjs.com/api/v1.0/email/send",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      service_id:CFG.EMAILJS_SERVICE_ID,
      template_id:CFG.EMAILJS_TEMPLATE_ID,
      user_id:CFG.EMAILJS_PUBLIC_KEY,
      template_params:{to_name:toName,to_email:toEmail,subject:`Your ${tierName} Reading — ${toName}`,reading_text:readingToText(reading,toName,tierName),tier_name:tierName,reply_to:CFG.PRACTITIONER_EMAIL}
    })
  });
  if(!res.ok)throw new Error(`EmailJS ${res.status}`);
}

// ═══════════════════════════════════════════════════════════
// 🎨  TIER DEFINITIONS
// ═══════════════════════════════════════════════════════════
const TIERS=[
  {id:"soul-spark",name:"Soul Spark",price:"$47",color:"#C8A96E",people:1,
   desc:"Core blueprint — 6 essential numbers, Chinese zodiac & 1 frequency recommendation",
   includes:["Life Path · Expression · Soul Urge","Personality · Birthday · Personal Year","Chinese Zodiac + Element","Shadow Themes Overview","1 Frequency Recommendation"]},
  {id:"cosmic-self",name:"Cosmic Self",price:"$97",color:"#9B7ED4",people:1,popular:true,
   desc:"Complete Philips system — every number, all 8 arrows, planes of expression, natal chart, shadow & full frequency protocol",
   includes:["Everything in Soul Spark","ALL Arrows of Pythagoras (Strength + Weakness)","Lo Shu Birth Chart Grid","Planes of Expression","Maturity · Balance · Subconscious Self","Pinnacles · Challenges · Missing Numbers","Karmic Debts + Master Numbers","Current Name Shift Analysis","Personal Month & Day","Natal Astrology + Chinese Zodiac","Full Shadow Work + 5 Prompts","Complete Frequency + Binaural Protocol","Daily Ritual Design"]},
  {id:"soul-connections",name:"Soul Connections",price:"$197",color:"#D47E9B",people:2,
   desc:"Full Cosmic Self for you + one other — compatibility, soul contract & shared protocol",
   includes:["Full Cosmic Self for both people","Arrow Compatibility Analysis","Numerology + Synastry Compatibility","Shared Shadow Patterns","Soul Contract Reading","Communication Style Map","Shared Frequency Protocol","Chinese Zodiac Compatibility"]},
  {id:"full-realm",name:"Full Realm",price:"$397",color:"#7EC4D4",people:5,
   desc:"Your entire inner circle — up to 5 complete readings + group grid analysis",
   includes:["Full Cosmic Self for up to 5 people","Full Compatibility Matrix","Group Arrow Pattern Analysis","Collective Shadow Dynamics","Missing Group Energies Report","Collective Frequency Map","Dominant Number Analysis","Sacred Geometry of Your Circle"]},
];

// ═══════════════════════════════════════════════════════════
// 🎛️  UI PRIMITIVES
// ═══════════════════════════════════════════════════════════
const Stars=()=>(
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 20% 50%,#1a0a2e 0%,#0d0d1a 60%,#000 100%)"}}>
    {Array.from({length:85},(_,i)=>(
      <div key={i} style={{position:"absolute",width:((i%3)*0.7+0.5)+"px",height:((i%3)*0.7+0.5)+"px",borderRadius:"50%",background:`rgba(255,255,255,${(i%5)*0.1+0.15})`,top:((i*17.3)%100)+"%",left:((i*23.7)%100)+"%",animation:`tw ${(i%4)+2}s ease-in-out infinite`,animationDelay:(i*0.09)+"s"}}/>
    ))}
  </div>
);
const GD=({label})=>(
  <div style={{display:"flex",alignItems:"center",gap:10,margin:"22px 0 16px"}}>
    <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(200,169,110,0.3))"}}/>
    <span style={{color:"#C8A96E",fontSize:10,fontFamily:"'Cinzel',serif",letterSpacing:"0.18em",textTransform:"uppercase",whiteSpace:"nowrap",opacity:.7}}>{label||"✦"}</span>
    <div style={{flex:1,height:1,background:"linear-gradient(to left,transparent,rgba(200,169,110,0.3))"}}/>
  </div>
);
const bs={width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(200,169,110,0.2)",borderRadius:4,padding:"10px 14px",color:"#fff",fontSize:14,fontFamily:"'Lora',serif",outline:"none"};
const fi=e=>{e.target.style.border="1px solid rgba(200,169,110,0.6)";};
const fb=e=>{e.target.style.border="1px solid rgba(200,169,110,0.2)";};
const Lbl=({c,r})=><label style={{display:"block",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#C8A96E",marginBottom:5}}>{c}{r&&<span style={{color:"#D47E9B"}}> *</span>}</label>;
const TI=({l,t="text",v,s,p,r,sub})=>(<div style={{marginBottom:16}}><Lbl c={l} r={r}/>{sub&&<p style={{fontSize:11,color:"rgba(255,255,255,.33)",marginBottom:5,fontStyle:"italic"}}>{sub}</p>}<input type={t} value={v} onChange={e=>s(e.target.value)} placeholder={p} style={bs} onFocus={fi} onBlur={fb}/></div>);
const TS=({l,v,s,opts,r,sub})=>(<div style={{marginBottom:16}}>{l&&<Lbl c={l} r={r}/>}{sub&&<p style={{fontSize:11,color:"rgba(255,255,255,.33)",marginBottom:5,fontStyle:"italic"}}>{sub}</p>}<select value={v} onChange={e=>s(e.target.value)} style={{...bs,background:"rgba(14,8,30,.95)",cursor:"pointer",color:v?"#fff":"rgba(255,255,255,.3)"}}><option value="" disabled hidden>Select…</option>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>);
const TTA=({l,v,s,p,rows=3,sub})=>(<div style={{marginBottom:16}}>{l&&<Lbl c={l}/>}{sub&&<p style={{fontSize:11,color:"rgba(255,255,255,.33)",marginBottom:5,fontStyle:"italic"}}>{sub}</p>}<textarea value={v} onChange={e=>s(e.target.value)} placeholder={p} rows={rows} style={{...bs,resize:"vertical"}} onFocus={fi} onBlur={fb}/></div>);
const MP=({label,items,selected,onChange,color="#9B7ED4",cols=2})=>(
  <div style={{marginBottom:18}}>
    {label&&<Lbl c={label}/>}
    <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:6}}>
      {items.map(item=>{
        const val=typeof item==="string"?item:(item.id||item);
        const lbl=typeof item==="string"?item:(item.label||item.id);
        const icon=item.icon||null;
        const on=selected.includes(val);
        return <div key={val} onClick={()=>onChange(on?selected.filter(x=>x!==val):[...selected,val])} style={{padding:"8px 10px",borderRadius:5,cursor:"pointer",border:on?`1px solid ${color}66`:"1px solid rgba(255,255,255,.07)",background:on?`${color}14`:"rgba(255,255,255,.02)",display:"flex",alignItems:"center",gap:7,transition:"all .18s"}}>
          {icon&&<span style={{fontSize:13}}>{icon}</span>}
          <span style={{fontSize:11,color:on?"#fff":"rgba(255,255,255,.4)",flex:1,lineHeight:1.4}}>{lbl}</span>
          {on&&<span style={{color,fontSize:10}}>✦</span>}
        </div>;
      })}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// 🔲  LO SHU GRID VISUALIZER
// ═══════════════════════════════════════════════════════════
const LoShuGrid=({grid,arrows,label,color="#C8A96E"})=>{
  const layout=[[3,6,9],[2,5,8],[1,4,7]];
  const strengthNums=new Set(arrows.strength.flatMap(a=>a.nums));
  const weakRows=[],weakCols=[],weakDiags=[];
  arrows.weakness.forEach(a=>{
    const{nums}=a;
    if(JSON.stringify(nums)===JSON.stringify([3,6,9]))weakRows.push(0);
    if(JSON.stringify(nums)===JSON.stringify([2,5,8]))weakRows.push(1);
    if(JSON.stringify(nums)===JSON.stringify([1,4,7]))weakRows.push(2);
  });

  return(
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color,marginBottom:10,opacity:.75}}>{label}</div>
      <div style={{display:"inline-grid",gridTemplateColumns:"repeat(3,52px)",gap:3}}>
        {layout.flatMap((row,ri)=>row.map((num,ci)=>{
          const count=grid[num]||0;
          const active=count>0;
          const bright=strengthNums.has(num)&&active;
          return(
            <div key={num} style={{
              width:52,height:52,borderRadius:5,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              border:bright?`1px solid ${color}88`:active?"1px solid rgba(255,255,255,.18)":"1px solid rgba(255,255,255,.05)",
              background:bright?`${color}20`:active?"rgba(255,255,255,.05)":"rgba(0,0,0,.2)",
              transition:"all .2s",cursor:"default",
            }}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:16,color:bright?color:active?"rgba(255,255,255,.75)":"rgba(255,255,255,.15)",fontWeight:600}}>{num}</span>
              {count>0&&<span style={{fontSize:9,color:bright?color:"rgba(255,255,255,.3)",marginTop:1}}>{"•".repeat(Math.min(count,4))}</span>}
            </div>
          );
        }))}
      </div>
      <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
        {arrows.strength.map(a=>(
          <div key={a.label} style={{fontSize:10,color:color,fontFamily:"'Cinzel',serif",letterSpacing:".1em"}}><span style={{opacity:.6}}>✦ </span>{a.label} {a.s.name.split(" ").slice(2).join(" ")}</div>
        ))}
        {arrows.weakness.map(a=>(
          <div key={a.label} style={{fontSize:10,color:"rgba(212,126,155,.7)",fontFamily:"'Cinzel',serif",letterSpacing:".1em"}}><span style={{opacity:.6}}>◌ </span>{a.label} {a.w.name.split(" ").slice(2,5).join(" ")}…</div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📖  READING DISPLAY COMPONENTS
// ═══════════════════════════════════════════════════════════
const Card=({title,number,subtitle,text,shadow,gifts,color="#C8A96E"})=>{
  const[open,setOpen]=useState(false);
  return(
    <div style={{background:"rgba(255,255,255,.02)",border:`1px solid ${color}1a`,borderRadius:7,marginBottom:9,overflow:"hidden"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"12px 15px",cursor:"pointer",display:"flex",alignItems:"center",gap:11}}>
        {number!=null&&<div style={{minWidth:34,height:34,borderRadius:"50%",background:`${color}16`,border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",color,fontSize:15,fontWeight:600}}>{number}</div>}
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color,marginBottom:1}}>{title}</div>
          {subtitle&&<div style={{fontSize:11,color:"rgba(255,255,255,.38)",fontStyle:"italic"}}>{subtitle}</div>}
        </div>
        <span style={{color,fontSize:13,transition:"transform .2s",display:"inline-block",transform:open?"rotate(90deg)":"none"}}>›</span>
      </div>
      {open&&<div style={{padding:"0 15px 15px",borderTop:`1px solid ${color}14`}}>
        {text&&<p style={{fontSize:13,color:"rgba(255,255,255,.72)",lineHeight:1.88,marginTop:12,whiteSpace:"pre-wrap"}}>{text}</p>}
        {gifts&&<div style={{marginTop:10,padding:"9px 13px",background:"rgba(200,169,110,.05)",borderRadius:4}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color,textTransform:"uppercase",marginBottom:4}}>Gifts</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.55)",lineHeight:1.8}}>{gifts}</p>
        </div>}
        {shadow&&<div style={{marginTop:9,padding:"9px 13px",background:"rgba(0,0,0,.2)",borderLeft:`2px solid ${color}44`,borderRadius:"0 4px 4px 0"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color,textTransform:"uppercase",marginBottom:4}}>Shadow</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.48)",lineHeight:1.8,fontStyle:"italic"}}>{shadow}</p>
        </div>}
      </div>}
    </div>
  );
};

const Sec=({icon,title,color="#C8A96E",children})=>(
  <div style={{background:"rgba(255,255,255,.015)",border:`1px solid ${color}18`,borderRadius:9,padding:"20px 20px 16px",marginBottom:18,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${color},transparent)`}}/>
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
      <span style={{fontSize:18}}>{icon}</span>
      <h3 style={{fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:".15em",textTransform:"uppercase",color}}>{title}</h3>
    </div>
    {children}
  </div>
);

const ReadingView=({reading:r,name,onEmail,emailSt})=>{
  const[copied,setCopied]=useState(false);
  if(!r)return null;
  const copyIt=()=>{navigator.clipboard.writeText(readingToText(r,name,"Reading")).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});};

  return(
    <div>
      {/* Snapshot */}
      {r.cosmicSnapshot&&<div style={{textAlign:"center",padding:"24px 18px",background:"linear-gradient(135deg,rgba(200,169,110,.06),rgba(155,126,212,.06))",border:"1px solid rgba(200,169,110,.2)",borderRadius:10,marginBottom:20}}>
        <div style={{fontSize:26,marginBottom:10}}>✦</div>
        <p style={{fontSize:14,color:"rgba(255,255,255,.78)",lineHeight:2,fontStyle:"italic",maxWidth:620,margin:"0 auto"}}>{r.cosmicSnapshot}</p>
      </div>}

      {/* Numerology */}
      {r.numerology&&<Sec icon="🔢" title="Numerology — Complete Philips System" color="#C8A96E">
        {["lifePath","expression","soulUrge","personality","birthday","personalYear"].map(k=>r.numerology[k]&&(
          <Card key={k} title={k.replace(/([A-Z])/g," $1").trim()} number={r.numerology[k].number} subtitle={r.numerology[k].title} text={r.numerology[k].reading} shadow={r.numerology[k].shadow} gifts={r.numerology[k].gifts} color="#C8A96E"/>
        ))}
        {r.numerology.maturity&&<Card title="Maturity Number" number={r.numerology.maturity.number} text={r.numerology.maturity.reading} color="#7EC4D4"/>}
        {r.numerology.balance&&<Card title="Balance Number" number={r.numerology.balance.number} text={r.numerology.balance.reading} color="#7EC4D4"/>}
        {r.numerology.subconsciousSelf&&<Card title="Subconscious Self" number={r.numerology.subconsciousSelf.number} text={r.numerology.subconsciousSelf.reading} color="#7EC4D4"/>}
        {r.numerology.missing?.reading&&<div style={{padding:"11px 14px",background:"rgba(155,126,212,.06)",border:"1px solid rgba(155,126,212,.18)",borderRadius:6,marginBottom:9}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#9B7ED4",marginBottom:5}}>Missing Numbers — {(r.numerology.missing.numbers||[]).join(", ")||"None"}</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85}}>{r.numerology.missing.reading}</p>
        </div>}
        {r.numerology.intensityNumbers&&<div style={{padding:"11px 14px",background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.12)",borderRadius:6,marginBottom:9}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#C8A96E",marginBottom:5}}>Intensity Numbers</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85}}>{r.numerology.intensityNumbers}</p>
        </div>}
        {r.numerology.pinnacles&&<div style={{padding:"11px 14px",background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.1)",borderRadius:6,marginBottom:9}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#C8A96E",marginBottom:5}}>Pinnacles & Life Chapters</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85}}>{r.numerology.pinnacles}</p>
          {r.numerology.challenges&&<p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85,marginTop:8}}>{r.numerology.challenges}</p>}
        </div>}
        {r.numerology.karmicReading&&r.numerology.karmicReading!=="null"&&<div style={{padding:"11px 14px",background:"rgba(212,126,155,.06)",border:"1px solid rgba(212,126,155,.2)",borderRadius:6,marginBottom:9}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#D47E9B",marginBottom:5}}>⚠ Karmic Debt</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85}}>{r.numerology.karmicReading}</p>
        </div>}
        {r.numerology.masterNumbers&&r.numerology.masterNumbers!=="null"&&<div style={{padding:"11px 14px",background:"rgba(126,196,212,.06)",border:"1px solid rgba(126,196,212,.2)",borderRadius:6,marginBottom:9}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#7EC4D4",marginBottom:5}}>✦ Master Numbers</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85}}>{r.numerology.masterNumbers}</p>
        </div>}
        {r.numerology.currentNameShift&&r.numerology.currentNameShift!=="null"&&<div style={{padding:"11px 14px",background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.1)",borderRadius:6,marginBottom:9}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#C8A96E",marginBottom:5}}>Current Name Shift Analysis</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.85}}>{r.numerology.currentNameShift}</p>
        </div>}
      </Sec>}

      {/* Arrows of Pythagoras */}
      {r.arrows&&<Sec icon="↗" title="Arrows of Pythagoras — Lo Shu Chart" color="#C8A96E">
        <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88,marginBottom:16}}>{r.arrows.overview}</p>
        {r.arrows.strengthArrows?.map(a=>(
          <div key={a.label} style={{padding:"12px 14px",background:"rgba(200,169,110,.05)",border:"1px solid rgba(200,169,110,.18)",borderRadius:6,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <span style={{color:"#C8A96E",fontSize:13}}>✦</span>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".13em",textTransform:"uppercase",color:"#C8A96E"}}>{a.label} — {a.name}</div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.85}}>{a.personalReading}</p>
          </div>
        ))}
        {r.arrows.weaknessArrows?.map(a=>(
          <div key={a.label} style={{padding:"12px 14px",background:"rgba(155,126,212,.05)",border:"1px solid rgba(155,126,212,.18)",borderRadius:6,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <span style={{color:"#9B7ED4",fontSize:13}}>◌</span>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".13em",textTransform:"uppercase",color:"#9B7ED4"}}>{a.label} — {a.name}</div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.85}}>{a.personalReading}</p>
            {a.practice&&<div style={{marginTop:8,padding:"7px 10px",background:"rgba(155,126,212,.08)",borderRadius:4,fontSize:12,color:"rgba(126,196,212,.8)",fontStyle:"italic"}}>Practice: {a.practice}</div>}
          </div>
        ))}
        {r.arrows.gridInsight&&<p style={{fontSize:12,color:"rgba(255,255,255,.45)",lineHeight:1.8,fontStyle:"italic",marginTop:10}}>{r.arrows.gridInsight}</p>}
      </Sec>}

      {/* Planes */}
      {r.planesOfExpression&&<Sec icon="⊞" title="Planes of Expression" color="#C8A96E">
        <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88,marginBottom:14}}>{r.planesOfExpression.overview}</p>
        {["physical","mental","emotional","intuitive"].map(plane=>{
          const pd=r.planesOfExpression[plane];
          const colors={physical:"#C0392B",mental:"#2980B9",emotional:"#E67E22",intuitive:"#8E44AD"};
          const c=colors[plane];
          return pd&&<div key={plane} style={{display:"flex",gap:12,padding:"9px 0",borderTop:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{minWidth:70,fontFamily:"'Cinzel',serif",fontSize:10,color:c,letterSpacing:".1em",textTransform:"capitalize",paddingTop:2}}>{plane}<br/><span style={{fontSize:13}}>{pd.count} letters</span></div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.6)",lineHeight:1.8}}>{pd.reading}</p>
          </div>;
        })}
      </Sec>}

      {/* Astrology */}
      {r.astrology&&<Sec icon="♑" title={`Astrology — ${r.astrology.sunSign}`} color="#7EC4D4">
        {["sunReading","chartThemes","currentSky"].filter(k=>r.astrology[k]).map(k=>(
          <p key={k} style={{fontSize:13,color:"rgba(255,255,255,.68)",lineHeight:1.88,marginBottom:12}}>{r.astrology[k]}</p>
        ))}
      </Sec>}

      {/* Chinese Zodiac */}
      {r.chineseZodiac&&<Sec icon="🐉" title={`Chinese Zodiac — ${r.chineseZodiac.sign}`} color="#D47E9B">
        <p style={{fontSize:13,color:"rgba(255,255,255,.68)",lineHeight:1.88,marginBottom:10}}>{r.chineseZodiac.reading}</p>
        {r.chineseZodiac.crossReference&&<p style={{fontSize:13,color:"rgba(255,255,255,.68)",lineHeight:1.88}}>{r.chineseZodiac.crossReference}</p>}
      </Sec>}

      {/* Shadow */}
      {r.shadowWork&&<Sec icon="🌑" title="Shadow Work" color="#9B7ED4">
        {[["coreWound","Core Wound"],["origin","Origin Story"],["howItShows","How It Shows Up"],["theGold","The Gold in the Shadow"],["integrationPath","Path to Integration"]].map(([k,label])=>r.shadowWork[k]&&(
          <div key={k} style={{marginBottom:14}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#9B7ED4",marginBottom:5}}>{label}</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88}}>{r.shadowWork[k]}</p>
          </div>
        ))}
        {r.shadowWork.prompts?.length>0&&<div style={{background:"rgba(155,126,212,.05)",border:"1px solid rgba(155,126,212,.18)",borderRadius:7,padding:"14px 16px"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#9B7ED4",marginBottom:11}}>Journal Prompts</div>
          {r.shadowWork.prompts.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:9,marginBottom:9}}>
              <span style={{color:"#9B7ED4",fontSize:11,marginTop:2,flexShrink:0}}>{i+1}.</span>
              <p style={{fontSize:13,color:"rgba(255,255,255,.62)",lineHeight:1.8,fontStyle:"italic"}}>{p}</p>
            </div>
          ))}
        </div>}
      </Sec>}

      {/* Meditation & Frequencies */}
      {r.meditation&&<Sec icon="🎧" title="Meditation & Frequency Protocol" color="#7EC4D4">
        <p style={{fontSize:13,color:"rgba(255,255,255,.68)",lineHeight:1.88,marginBottom:14}}>{r.meditation.overview}</p>
        {r.meditation.primaryPractice&&<div style={{background:"rgba(126,196,212,.05)",border:"1px solid rgba(126,196,212,.18)",borderRadius:7,padding:"13px 15px",marginBottom:12}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#7EC4D4",marginBottom:5}}>Primary Practice — {r.meditation.primaryPractice.name}</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88}}>{r.meditation.primaryPractice.description}</p>
        </div>}
        {r.meditation.frequencies?.map((f,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderTop:"1px solid rgba(255,255,255,.04)"}}>
            <div style={{minWidth:56,fontFamily:"'Cinzel',serif",fontSize:11,color:"#C8A96E",paddingTop:1}}>{f.hz}</div>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#C8A96E",letterSpacing:".1em",marginBottom:3}}>{f.name}</div>
              <p style={{fontSize:12,color:"rgba(255,255,255,.52)",lineHeight:1.75}}>{f.why}</p>
              <p style={{fontSize:11,color:"rgba(126,196,212,.7)",marginTop:3,fontStyle:"italic"}}>{f.use}</p>
            </div>
          </div>
        ))}
        {r.meditation.binauralProtocol&&<div style={{marginTop:14}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#D47E9B",marginBottom:5}}>Binaural Protocol</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88}}>{r.meditation.binauralProtocol}</p>
        </div>}
        {r.meditation.chakraPriority&&<div style={{marginTop:12}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#C8A96E",marginBottom:5}}>Chakra Priority</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88}}>{r.meditation.chakraPriority}</p>
        </div>}
        {r.meditation.dailyRitual&&<div style={{marginTop:14,padding:"13px 15px",background:"rgba(200,169,110,.05)",border:"1px solid rgba(200,169,110,.16)",borderRadius:7}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#C8A96E",marginBottom:5}}>Daily Ritual</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.88}}>{r.meditation.dailyRitual}</p>
        </div>}
      </Sec>}

      {/* Soul Message */}
      {r.soulMessage&&<div style={{textAlign:"center",padding:"26px 20px",background:"linear-gradient(135deg,rgba(155,126,212,.08),rgba(200,169,110,.08))",border:"1px solid rgba(200,169,110,.22)",borderRadius:10,marginBottom:20}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".25em",textTransform:"uppercase",color:"#C8A96E",marginBottom:13,opacity:.7}}>A Message for {name}</div>
        <p style={{fontSize:14,color:"rgba(255,255,255,.82)",lineHeight:2.1,fontStyle:"italic",maxWidth:600,margin:"0 auto"}}>{r.soulMessage}</p>
      </div>}

      {/* Actions */}
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={onEmail} style={{padding:"12px 26px",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer",borderRadius:4,transition:"all .3s",background:emailSt==="sent"?"rgba(39,174,96,.2)":emailSt==="error"?"rgba(192,57,43,.2)":"linear-gradient(135deg,rgba(200,169,110,.2),rgba(200,169,110,.35))",border:emailSt==="sent"?"1px solid #27ae60":emailSt==="error"?"1px solid #c0392b":"1px solid #C8A96E",color:emailSt==="sent"?"#27ae60":emailSt==="error"?"#e74c3c":"#C8A96E"}}>
          {emailSt==="sending"?"Sending…":emailSt==="sent"?"✓ Sent!":emailSt==="error"?"⚠ Failed":"✉ Email Reading"}
        </button>
        <button onClick={copyIt} style={{padding:"12px 26px",fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer",borderRadius:4,background:"transparent",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.42)"}}>
          {copied?"✓ Copied":"⎘ Copy Text"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📋  INTAKE FORM
// ═══════════════════════════════════════════════════════════
const MONTHS_O=["January","February","March","April","May","June","July","August","September","October","November","December"].map((l,i)=>({v:String(i+1),l}));
const DAYS_O=Array.from({length:31},(_,i)=>({v:String(i+1),l:String(i+1)}));
const CY=new Date().getFullYear();
const YEARS_O=Array.from({length:110},(_,i)=>({v:String(CY-i),l:String(CY-i)}));
const HRS_O=Array.from({length:24},(_,h)=>({v:String(h).padStart(2,"0"),l:h===0?"12:00 AM":h<12?`${h}:00 AM`:h===12?"12:00 PM":`${h-12}:00 PM`}));
const MIN_O=["00","05","10","15","20","25","30","35","40","45","50","55"].map(m=>({v:m,l:`:${m}`}));

const SHADOW_THEMES=["Abandonment & fear of being left","Worthiness & not feeling enough","Control & trust issues","People-pleasing & losing self","Anger & unexpressed emotion","Scarcity & money wounds","Intimacy avoidance","Perfectionism & fear of failure","Visibility fear & playing small","Grief & unprocessed loss","Codependency & enmeshment","Identity confusion","Generational & ancestral patterns","Self-sabotage & repeating cycles","Shame & inner critic","Boundary issues"];
const MED_FOCUS=[{id:"inner-child",label:"Inner Child Healing",icon:"🌱"},{id:"shadow",label:"Shadow Integration",icon:"🌑"},{id:"nervous",label:"Nervous System Regulation",icon:"🌊"},{id:"grief",label:"Grief & Release",icon:"💧"},{id:"worth",label:"Self-Worth",icon:"☀️"},{id:"abundance",label:"Abundance",icon:"✨"},{id:"purpose",label:"Purpose & Direction",icon:"🧭"},{id:"relationships",label:"Relationship Healing",icon:"💞"},{id:"ancestral",label:"Ancestral Clearing",icon:"🌿"},{id:"intuition",label:"Intuition Development",icon:"🔮"},{id:"somatic",label:"Somatic & Body",icon:"🌺"},{id:"sleep",label:"Sleep & Restoration",icon:"🌙"}];
const SOLFEGGIO_O=["174 Hz — Foundation: Pain relief · Grounding","285 Hz — Restoration: Cellular healing","396 Hz — Liberation: Release guilt & fear","417 Hz — Transmutation: Facilitate change","432 Hz — Natural Harmony: Calm · Coherence","528 Hz — Love Frequency: DNA repair · Miracles","639 Hz — Connection: Heal relationships","741 Hz — Awakening: Intuition · Expression","852 Hz — Spiritual Order: Third eye opening","963 Hz — Divine Connection: Crown activation"];
const BINAURAL_O=["Delta (0.5–4 Hz) — Deep Healing: Sleep · Trauma release","Theta (4–8 Hz) — Gateway: Shadow work · Inner child","Alpha (8–14 Hz) — Relaxed Presence: Daily meditation","Beta (14–30 Hz) — Active Mind: Focus · Processing","Gamma (30–100 Hz) — Higher Consciousness: Breakthroughs"];
const CHAKRA_DEF=[{name:"Root",color:"#C0392B",desc:"Safety · Grounding",hz:"396 Hz"},{name:"Sacral",color:"#E67E22",desc:"Creativity · Emotion",hz:"417 Hz"},{name:"Solar Plexus",color:"#F1C40F",desc:"Power · Identity",hz:"528 Hz"},{name:"Heart",color:"#27AE60",desc:"Love · Connection",hz:"639 Hz"},{name:"Throat",color:"#2980B9",desc:"Expression · Truth",hz:"741 Hz"},{name:"Third Eye",color:"#8E44AD",desc:"Intuition · Vision",hz:"852 Hz"},{name:"Crown",color:"#BDC3C7",desc:"Oneness · Purpose",hz:"963 Hz"}];

const ChakraPicker=({selected,onChange})=>(
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:7,marginBottom:16}}>
    {CHAKRA_DEF.map(c=>{const on=selected.includes(c.name);return(
      <div key={c.name} onClick={()=>onChange(on?selected.filter(x=>x!==c.name):[...selected,c.name])} style={{padding:"10px 8px",borderRadius:6,cursor:"pointer",border:on?`1px solid ${c.color}77`:"1px solid rgba(255,255,255,.06)",background:on?`${c.color}14`:"rgba(255,255,255,.02)",textAlign:"center",transition:"all .18s"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:c.color,margin:"0 auto 5px"}}/>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:on?"#fff":"rgba(255,255,255,.42)",marginBottom:2}}>{c.name}</div>
        <div style={{fontSize:9,color:on?c.color:"rgba(255,255,255,.2)",lineHeight:1.4}}>{c.desc}</div>
        <div style={{fontSize:8,color:"rgba(255,255,255,.15)",marginTop:2}}>{c.hz}</div>
      </div>
    );})}
  </div>
);

const emptyP=()=>({relationship:"",preferredName:"",legalFirst:"",legalMiddle:"",legalLast:"",currentFirst:"",currentLast:"",bMonth:"",bDay:"",bYear:"",timeKnown:"",bHour:"",bMinute:"",bCity:"",bState:"",bCountry:"",pronouns:"",shadowThemes:[],recurringPatterns:"",childhoodWound:"",shadowDepth:5,shadowGoal:"",meditationFocus:[],meditationExp:"",currentPractice:"",chakraFocus:[],freqInterest:[],binauralInterest:[],goals:""});

const PersonForm=({p,pi,upd,color,withFull})=>(
  <div style={{background:"rgba(255,255,255,.015)",border:`1px solid ${color}22`,borderRadius:9,padding:"22px 20px",marginBottom:18,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${color},transparent)`}}/>
    <h3 style={{fontFamily:"'Cinzel',serif",color,fontSize:12,letterSpacing:".14em",marginBottom:18,textTransform:"uppercase"}}>{pi===0?"✦ Your Information":`✦ Person ${pi+1}`}</h3>

    {pi>0&&<TS l="Relationship to You" v={p.relationship} s={v=>upd({relationship:v})} opts={[{v:"romantic",l:"Romantic Partner"},{v:"spouse",l:"Spouse"},{v:"child",l:"Child"},{v:"parent",l:"Parent"},{v:"sibling",l:"Sibling"},{v:"friend",l:"Close Friend"},{v:"business",l:"Business Partner"},{v:"other",l:"Other"}]} r/>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <TS l="Pronouns" v={p.pronouns} s={v=>upd({pronouns:v})} opts={[{v:"she/her",l:"She / Her"},{v:"he/him",l:"He / Him"},{v:"they/them",l:"They / Them"},{v:"prefer-not",l:"Prefer not to say"}]}/>
      <TI l="Preferred Name" v={p.preferredName} s={v=>upd({preferredName:v})} p="What you go by"/>
    </div>

    <GD label="Full Legal Birth Name — Required for All Numbers"/>
    <div style={{background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.1)",borderRadius:4,padding:"9px 13px",marginBottom:12,fontSize:11,color:"rgba(255,255,255,.38)",fontStyle:"italic",lineHeight:1.75}}>
      💡 Name exactly as on your birth certificate unlocks Expression, Soul Urge, Personality, Planes of Expression, Intensity Numbers, and all Arrow calculations (David Philips Pythagorean system).
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
      <TI l="First Name" v={p.legalFirst} s={v=>upd({legalFirst:v})} p="Birth certificate" r/>
      <TI l="Middle Name(s)" v={p.legalMiddle} s={v=>upd({legalMiddle:v})} p="Leave blank if none"/>
      <TI l="Last Name" v={p.legalLast} s={v=>upd({legalLast:v})} p="Birth surname" r/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <TI l="Current First Name" v={p.currentFirst} s={v=>upd({currentFirst:v})} p="If different from birth" sub="Used for name-change vibrational shift analysis"/>
      <TI l="Current Last Name" v={p.currentLast} s={v=>upd({currentLast:v})} p="Married / chosen name"/>
    </div>

    <GD label="Date of Birth"/>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:10}}>
      <TS l="Month" v={p.bMonth} s={v=>upd({bMonth:v})} opts={MONTHS_O} r/>
      <TS l="Day" v={p.bDay} s={v=>upd({bDay:v})} opts={DAYS_O} r/>
      <TS l="Year" v={p.bYear} s={v=>upd({bYear:v})} opts={YEARS_O} r/>
    </div>

    {withFull&&<>
      <GD label="Time & Place — For Natal Chart"/>
      <TS l="Birth time known?" v={p.timeKnown} s={v=>upd({timeKnown:v})} opts={[{v:"exact",l:"Yes — exact"},{v:"approximate",l:"Approximate"},{v:"unknown",l:"Don't know"}]}/>
      {(p.timeKnown==="exact"||p.timeKnown==="approximate")&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <TS l="Hour" v={p.bHour} s={v=>upd({bHour:v})} opts={HRS_O}/>
        <TS l="Minute" v={p.bMinute} s={v=>upd({bMinute:v})} opts={MIN_O}/>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10}}>
        <TI l="City of Birth" v={p.bCity} s={v=>upd({bCity:v})} p="e.g. Dallas" r/>
        <TI l="State" v={p.bState} s={v=>upd({bState:v})} p="TX"/>
        <TI l="Country" v={p.bCountry} s={v=>upd({bCountry:v})} p="USA" r/>
      </div>

      <GD label="Shadow Work"/>
      <p style={{fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:12,fontStyle:"italic",lineHeight:1.7}}>🌑 The shadow is not what is wrong with you — it is what has been unwitnessed. These selections directly shape the shadow work and frequency protocol in your reading.</p>
      <MP label="Shadow themes active in your life" items={SHADOW_THEMES} selected={p.shadowThemes} onChange={v=>upd({shadowThemes:v})} color="#9B7ED4"/>
      <TTA l="Recurring patterns or cycles" v={p.recurringPatterns} s={v=>upd({recurringPatterns:v})} p="e.g. always attracting unavailable people, self-sabotage right before success…" sub="The more specific, the more accurate your reading" rows={3}/>
      <TTA l="Earliest wound that still echoes (optional)" v={p.childhoodWound} s={v=>upd({childhoodWound:v})} p="A few words is enough — only what feels safe" rows={2}/>
      <div style={{marginBottom:16}}>
        <Lbl c="Readiness to look at harder material (1–10)"/>
        <p style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:8,fontStyle:"italic"}}>Calibrates depth and tone of the shadow section</p>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <input type="range" min={1} max={10} value={p.shadowDepth||5} onChange={e=>upd({shadowDepth:+e.target.value})} style={{flex:1,accentColor:"#9B7ED4"}}/>
          <div style={{minWidth:32,height:32,borderRadius:"50%",background:"rgba(155,126,212,.2)",border:"1px solid rgba(155,126,212,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",color:"#9B7ED4",fontSize:13}}>{p.shadowDepth||5}</div>
        </div>
      </div>
      <TS l="Shadow work goal" v={p.shadowGoal} s={v=>upd({shadowGoal:v})} opts={[{v:"patterns",l:"Understand why I keep repeating patterns"},{v:"release",l:"Release what no longer serves"},{v:"child",l:"Heal the inner child"},{v:"reclaim",l:"Reclaim disowned parts of myself"},{v:"integrate",l:"Fully integrate light and shadow"},{v:"beginning",l:"Just beginning — not sure yet"}]}/>

      <GD label="Meditation & Practice"/>
      <MP label="Meditation focus areas" items={MED_FOCUS} selected={p.meditationFocus} onChange={v=>upd({meditationFocus:v})} color="#7EC4D4"/>
      <TS l="Experience level" v={p.meditationExp} s={v=>upd({meditationExp:v})} opts={[{v:"none",l:"None — completely new"},{v:"curious",l:"Tried a few times"},{v:"beginner",l:"Occasional practice"},{v:"intermediate",l:"Regular practice"},{v:"advanced",l:"Deep daily practice"}]}/>
      <TTA l="Current practice (if any)" v={p.currentPractice} s={v=>upd({currentPractice:v})} p="Journaling, breathwork, yoga, prayer, cold plunge, ritual…" rows={2}/>

      <GD label="Chakra Focus"/>
      <p style={{fontSize:11,color:"rgba(255,255,255,.32)",marginBottom:10,fontStyle:"italic"}}>Select centers that feel blocked, overactive, or calling for attention — these cross-reference with your arrow weaknesses</p>
      <ChakraPicker selected={p.chakraFocus} onChange={v=>upd({chakraFocus:v})}/>

      <GD label="Sound Healing"/>
      <div style={{background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.1)",borderRadius:5,padding:"11px 14px",marginBottom:14,fontSize:12,color:"rgba(255,255,255,.4)",fontStyle:"italic",lineHeight:1.85}}>
        〰 Your Life Path, arrow weaknesses, and shadow themes map directly to specific solfeggio frequencies and brainwave states. These selections refine the personalized protocol in your reading.
      </div>
      <MP label="Solfeggio frequencies you're drawn to" items={SOLFEGGIO_O} selected={p.freqInterest} onChange={v=>upd({freqInterest:v})} color="#C8A96E" cols={1}/>
      <MP label="Binaural brainwave states" items={BINAURAL_O} selected={p.binauralInterest} onChange={v=>upd({binauralInterest:v})} color="#D47E9B" cols={1}/>
    </>}

    <GD label="Intentions"/>
    <TTA l={pi===0?"What are you most hoping to understand or shift in your life right now?":"What do you most want to understand about this relationship?"} v={p.goals} s={v=>upd({goals:v})} p="Share anything — patterns, questions, what feels stuck, what you're moving toward, what you most want to feel…" rows={4}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// 🏠  MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App(){
  const[step,setStep]=useState("tier");
  const[tierId,setTierId]=useState(null);
  const[persons,setPersons]=useState([emptyP()]);
  const[email,setEmail]=useState("");
  const[phone,setPhone]=useState("");
  const[howHeard,setHowHeard]=useState("");
  const[reading,setReading]=useState(null);
  const[genMsg,setGenMsg]=useState("");
  const[emailSt,setEmailSt]=useState("");
  const[err,setErr]=useState("");

  const tier=TIERS.find(t=>t.id===tierId);
  const withFull=tierId&&tierId!=="soul-spark";
  const configured=CFG.EMAILJS_SERVICE_ID!=="YOUR_SERVICE_ID";
  const upd=(i,u)=>setPersons(ps=>{const n=[...ps];n[i]={...n[i],...u};return n;});

  const pickTier=id=>{
    const t=TIERS.find(t=>t.id===id);
    setPersons(Array.from({length:t.people===5?1:t.people},emptyP));
    setTierId(id);setStep("form");window.scrollTo({top:0,behavior:"smooth"});
  };

  const submit=async()=>{
    if(!email){alert("Please enter your email.");return;}
    setStep("gen");setErr("");
    const msgs=["Calculating your numerology numbers…","Building the Lo Shu chart…","Computing the Arrows of Pythagoras…","Reading the planetary positions…","Mapping shadow themes to your numbers…","Building your frequency protocol…","Weaving it all together…"];
    let mi=0;setGenMsg(msgs[0]);
    const iv=setInterval(()=>{mi=(mi+1)%msgs.length;setGenMsg(msgs[mi]);},2600);
    try{
      const r=await generateReading({persons,tierId});
      clearInterval(iv);setReading(r);setStep("results");window.scrollTo({top:0,behavior:"smooth"});
    }catch(e){
      clearInterval(iv);setErr("Reading generation failed: "+e.message);setStep("form");
    }
  };

  const sendMail=async()=>{
    const name=persons[0].preferredName||persons[0].legalFirst||"Friend";
    setEmailSt("sending");
    try{await sendEmail(email,name,tier?.name||"Cosmic",reading);setEmailSt("sent");}
    catch(e){console.error(e);setEmailSt("error");}
  };

  const reset=()=>{setStep("tier");setTierId(null);setPersons([emptyP()]);setReading(null);setEmail("");setEmailSt("");setErr("");};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cinzel+Decorative:wght@400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        @keyframes tw{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.85;transform:scale(1.4)}}
        @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d0d1a}::-webkit-scrollbar-thumb{background:rgba(200,169,110,.3);border-radius:2px}
        select option{background:#14082a!important;color:#fff}
        input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;background:rgba(255,255,255,.1);outline:none;width:100%}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;cursor:pointer;background:#C8A96E}
      `}</style>
      <Stars/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",fontFamily:"'Lora',serif",color:"#fff",padding:"0 16px 80px"}}>

        {/* Header */}
        <div style={{textAlign:"center",paddingTop:44,paddingBottom:24,animation:"fu .9s ease both"}}>
          <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:9,letterSpacing:".4em",color:"#C8A96E",textTransform:"uppercase",marginBottom:10,opacity:.7}}>Ancient Wisdom · Modern Clarity</div>
          <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(22px,4.5vw,40px)",fontWeight:400,lineHeight:1.2,background:"linear-gradient(135deg,#fff 0%,#C8A96E 50%,#fff 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:10}}>Your Cosmic Blueprint</h1>
          <p style={{color:"rgba(255,255,255,.35)",maxWidth:560,margin:"0 auto",fontSize:12,lineHeight:2,fontStyle:"italic"}}>Complete Numerology (David Philips) · Arrows of Pythagoras · Astrology · Chinese Zodiac · Shadow Work · Sound Healing</p>
        </div>

        <div style={{maxWidth:880,margin:"0 auto"}}>
          {!configured&&step!=="gen"&&<div style={{background:"rgba(247,185,36,.07)",border:"1px solid rgba(247,185,36,.28)",borderRadius:7,padding:"11px 15px",marginBottom:18,fontSize:12,color:"rgba(247,185,36,.78)",lineHeight:1.75}}>⚙️ <strong>Email setup:</strong> Fill in <code style={{background:"rgba(0,0,0,.3)",padding:"1px 4px",borderRadius:3}}>CFG.EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY</code> at the top of the file. Free at <strong>emailjs.com</strong>. Readings generate fine without it.</div>}
          {err&&<div style={{background:"rgba(192,57,43,.1)",border:"1px solid rgba(192,57,43,.3)",borderRadius:7,padding:"11px 15px",marginBottom:18,fontSize:12,color:"rgba(231,76,60,.9)",lineHeight:1.75,whiteSpace:"pre-wrap"}}>⚠️ {err}</div>}

          {/* TIER SELECTION */}
          {step==="tier"&&<div style={{animation:"fu .6s ease both"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <h2 style={{fontFamily:"'Cinzel',serif",fontSize:14,letterSpacing:".18em",color:"#C8A96E",textTransform:"uppercase",marginBottom:7}}>Choose Your Level of Depth</h2>
              <p style={{color:"rgba(255,255,255,.3)",fontSize:12}}>Fill in the form → Claude calculates every number + all 8 arrows → generates your full reading → delivered to your inbox.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginBottom:44}}>
              {TIERS.map((t,i)=>(
                <div key={t.id} onClick={()=>pickTier(t.id)}
                  style={{background:t.popular?"linear-gradient(160deg,rgba(155,126,212,.1),rgba(0,0,0,.3))":"rgba(255,255,255,.02)",border:t.popular?`1px solid ${t.color}55`:"1px solid rgba(255,255,255,.06)",borderRadius:9,padding:20,cursor:"pointer",position:"relative",transition:"all .3s",animation:`fu .5s ease ${i*.08}s both`}}
                  onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${t.color}88`;e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.border=t.popular?`1px solid ${t.color}55`:"1px solid rgba(255,255,255,.06)";e.currentTarget.style.transform="none";}}>
                  {t.popular&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:t.color,color:"#0d0d1a",fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",padding:"3px 11px",borderRadius:20}}>Most Popular</div>}
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:".2em",color:t.color,textTransform:"uppercase",marginBottom:4,opacity:.7}}>{t.people===1?"1 Person":`Up to ${t.people} People`}</div>
                  <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:17,color:"#fff",marginBottom:3}}>{t.name}</div>
                  <div style={{fontSize:22,fontFamily:"'Cinzel',serif",color:t.color,marginBottom:8}}>{t.price}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.34)",fontStyle:"italic",marginBottom:13,lineHeight:1.6}}>{t.desc}</div>
                  <div style={{borderTop:"1px solid rgba(255,255,255,.04)",paddingTop:11}}>
                    {t.includes.map((item,j)=>(
                      <div key={j} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:5}}>
                        <span style={{color:t.color,fontSize:8,marginTop:4,flexShrink:0}}>✦</span>
                        <span style={{fontSize:10,color:"rgba(255,255,255,.45)",lineHeight:1.5}}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:14,paddingTop:11,borderTop:`1px solid ${t.color}22`,textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".15em",color:t.color,textTransform:"uppercase"}}>Begin →</div>
                </div>
              ))}
            </div>

            {/* Arrow reference panel */}
            <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(200,169,110,.1)",borderRadius:9,padding:24,marginBottom:20}}>
              <h3 style={{fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:".18em",color:"#C8A96E",textTransform:"uppercase",marginBottom:18,textAlign:"center"}}>The 8 Arrows of Pythagoras — Included in Cosmic Self & Above</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                {ARROW_DEFS.map(a=>(
                  <div key={a.label} style={{padding:"10px 12px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:6}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#C8A96E",letterSpacing:".12em",marginBottom:4}}>{a.label} — {a.plane} Plane</div>
                    <div style={{fontSize:10,color:"rgba(200,169,110,.8)",marginBottom:3}}>✦ {a.s.name}</div>
                    <div style={{fontSize:10,color:"rgba(212,126,155,.7)"}}>◌ {a.w.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>}

          {/* FORM */}
          {step==="form"&&tier&&<div style={{animation:"fu .5s ease both"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:10}}>
              <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:19,color:"#fff"}}>{tier.name} <span style={{color:tier.color,fontSize:17}}>{tier.price}</span></h2>
              <button onClick={()=>setStep("tier")} style={{background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.4)",padding:"7px 13px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"'Cinzel',serif"}}>← Change</button>
            </div>
            {persons.map((p,pi)=>(
              <PersonForm key={pi} p={p} pi={pi} upd={u=>upd(pi,u)} color={tier.color} withFull={withFull}/>
            ))}
            {tier.id==="full-realm"&&persons.length<5&&<button onClick={()=>setPersons([...persons,emptyP()])} style={{width:"100%",padding:"12px",background:"transparent",border:`1px dashed ${tier.color}33`,borderRadius:7,color:tier.color,fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",marginBottom:16}}>+ Add Another Person ({persons.length}/5)</button>}

            <GD label="Contact"/>
            <div style={{background:"rgba(255,255,255,.015)",border:"1px solid rgba(200,169,110,.1)",borderRadius:8,padding:20,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <TI l="Email Address" t="email" v={email} s={setEmail} p="Where to send your reading" r/>
                <TI l="Phone / WhatsApp" t="tel" v={phone} s={setPhone} p="Optional"/>
              </div>
              <TS l="How did you find us?" v={howHeard} s={setHowHeard} opts={[{v:"referral",l:"Friend / Family"},{v:"instagram",l:"Instagram"},{v:"tiktok",l:"TikTok"},{v:"facebook",l:"Facebook"},{v:"google",l:"Google"},{v:"podcast",l:"Podcast"},{v:"returning",l:"Returning Client"},{v:"other",l:"Other"}]}/>
            </div>
            <div style={{textAlign:"center"}}>
              <button onClick={submit} style={{background:`linear-gradient(135deg,${tier.color}22,${tier.color}40)`,border:`1px solid ${tier.color}`,color:tier.color,fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:".2em",textTransform:"uppercase",padding:"15px 46px",borderRadius:4,cursor:"pointer",transition:"all .3s"}}
                onMouseEnter={e=>{e.target.style.background=`linear-gradient(135deg,${tier.color}44,${tier.color}66)`;e.target.style.color="#fff";}}
                onMouseLeave={e=>{e.target.style.background=`linear-gradient(135deg,${tier.color}22,${tier.color}40)`;e.target.style.color=tier.color;}}>
                Generate My Reading →
              </button>
              <p style={{marginTop:10,fontSize:11,color:"rgba(255,255,255,.2)",fontStyle:"italic"}}>Claude calculates all numbers, builds the Lo Shu grid, runs all 8 arrows, and generates your complete reading. ~30–45 seconds.</p>
            </div>
          </div>}

          {/* GENERATING */}
          {step==="gen"&&<div style={{textAlign:"center",paddingTop:60,animation:"fu .5s ease both"}}>
            <div style={{width:56,height:56,borderRadius:"50%",border:"1px solid rgba(200,169,110,.25)",borderTop:"1px solid #C8A96E",animation:"spin 2s linear infinite",margin:"0 auto 28px"}}/>
            <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:20,color:"#C8A96E",marginBottom:10}}>Reading the Stars…</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,.42)",fontStyle:"italic",animation:"pulse 1.5s ease infinite"}}>{genMsg}</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,.18)",marginTop:16}}>Calculating your numbers · Building the Lo Shu grid · Running all 8 arrows · Generating your reading</p>
          </div>}

          {/* RESULTS */}
          {step==="results"&&reading&&<div style={{animation:"fu .6s ease both"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".2em",color:tier?.color,textTransform:"uppercase",marginBottom:3}}>Your Reading</div>
                <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:19,color:"#fff"}}>{tier?.name} — {persons[0].preferredName||persons[0].legalFirst||"Your Reading"}</h2>
              </div>
              <button onClick={reset} style={{background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.38)",padding:"7px 13px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"'Cinzel',serif"}}>← New Reading</button>
            </div>
            <ReadingView reading={reading} name={persons[0].preferredName||persons[0].legalFirst||"Friend"} onEmail={sendMail} emailSt={emailSt}/>
          </div>}

        </div>
      </div>
    </>
  );
}
