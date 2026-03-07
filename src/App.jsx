import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// ⚙️  CONFIG  — replace before deploying
// ═══════════════════════════════════════════════════════════
const CFG = {
  EMAILJS_SERVICE_ID:  "service_8wvh9nx",
EMAILJS_TEMPLATE_ID: "template_hqle32c",
EMAILJS_PUBLIC_KEY:  "dkHFmGFcO68nWPpAc",
PRACTITIONER_EMAIL:  "sacredsoulmap@gmail.com",
};

// ═══════════════════════════════════════════════════════════
// 🔢  COMPLETE DAVID A. PHILIPS NUMEROLOGY ENGINE
// ═══════════════════════════════════════════════════════════

// ── Philips: Isolated Number Remedies ────────────────────────────────────────
const ISOLATED_REMEDIES={
  1:{title:"The Lone Pioneer",neighbors:[2,4],
    challenge:"Leadership and independence feel cut off from grounded action (4) and emotional connection (2).",
    remedy:"Develop routine and physical follow-through (4 energy). Practice vulnerability and asking for help (2 energy). The isolated 1 becomes powerful when it learns to receive as well as initiate.",
    practices:["Daily journaling to bridge inner knowing to outer expression","Choose one commitment and follow it fully to completion","Practice asking for help once per week — notice the resistance"],
    affirmation:"I lead from wholeness, not isolation."},
  2:{title:"The Sensitive Island",neighbors:[1,3,5],
    challenge:"Emotional sensitivity and intuition feel marooned — hard to assert (1), express creatively (3), or speak freely (5).",
    remedy:"Name and speak feelings before they calcify into resentment. Practice stating needs clearly (1 energy) and finding creative outlets for emotional life (3 energy).",
    practices:["Name your emotional state out loud each morning","Write or create something purely for emotional expression weekly","Practice one clear boundary statement per week"],
    affirmation:"My sensitivity is a gift I am learning to voice, not bury."},
  3:{title:"The Unexpressed Creator",neighbors:[2,6],
    challenge:"Creative ability and joy lack emotional grounding (2) and a nurturing support system (6).",
    remedy:"Cultivate safe emotional containers (2) and reciprocal nurturing relationships (6) — these are the soil creativity grows in.",
    practices:["Create something privately with no audience — purely for joy","Identify one relationship where you feel truly held and invest in it","Practice receiving compliments without deflecting"],
    affirmation:"I create from overflow, not performance."},
  4:{title:"The Stranded Builder",neighbors:[1,5,7],
    challenge:"Order and hard work disconnected from will and initiative (1), freedom (5), and inner wisdom (7).",
    remedy:"Reconnect to WHY (7 energy), allow spontaneity (5 energy), and lead from choice rather than obligation (1 energy).",
    practices:["Weekly ask: why does this work matter to my soul","Build in one unstructured hour per week with no task","Read or contemplate something purely philosophical"],
    affirmation:"I build with purpose. Structure serves my soul."},
  5:{title:"The Untethered Seeker",neighbors:[2,4,6,8],
    challenge:"Freedom and curiosity completely surrounded by absence — no emotional roots, practical structure, relational warmth, or material engagement.",
    remedy:"Choose ONE commitment and stay — not because you must, but to discover what depth feels like. Create a daily rhythm (not a rigid schedule).",
    practices:["Commit to one area of life for 90 days — observe what arises","Create a simple daily rhythm","Practice presence in the body: walks, breathwork, grounding"],
    affirmation:"I am free AND rooted. Depth is the adventure I have not yet tried."},
  6:{title:"The Isolated Nurturer",neighbors:[3,5,9],
    challenge:"Love and service cut off from creative expression (3), flexibility (5), and spiritual understanding (9).",
    remedy:"Self-care and boundaries ARE the most loving act. Learn that tending yourself first is how you truly serve.",
    practices:["One creative practice weekly that is purely for yourself","Study a spiritual tradition that resonates","Practice saying I need time before agreeing to new responsibilities"],
    affirmation:"I love from fullness. Tending myself first is how I truly serve."},
  7:{title:"The Withdrawn Mystic",neighbors:[4,8],
    challenge:"Inner knowing and spiritual depth isolated from practical action (4) and material engagement (8).",
    remedy:"Insights must be brought INTO the body and material world. Structure (4) and focused output (8) are the medicine.",
    practices:["Write or record your inner knowing — give it a container","Choose one practical project that expresses your deepest values","Engage with money or material reality without shame"],
    affirmation:"My wisdom belongs in the world. I translate spirit into form."},
  8:{title:"The Isolated Authority",neighbors:[5,7,9],
    challenge:"Power and achievement cut off from freedom (5), spiritual depth (7), and wisdom of completion (9).",
    remedy:"Reconnect to meaning beyond accomplishment through spirit (7/9) and inner freedom (5).",
    practices:["Define what success means to your soul — not your ego","Incorporate a spiritual practice unrelated to productivity","Give without needing acknowledgment once per week"],
    affirmation:"I build with soul. My power is in service to something larger."},
  9:{title:"The Unreachable Sage",neighbors:[6,8],
    challenge:"Humanitarian vision and compassion isolated from relational (6) and material (8) worlds.",
    remedy:"Compassion without engagement is sentiment. The work is intimacy — with real people, real needs, real circumstances.",
    practices:["Choose one person and give them your full undivided presence","Find one tangible way your vision creates material value","Practice being moved by the specific, not just the universal"],
    affirmation:"I bring heaven to earth. My love is real because it is specific."},
};

// ── Philips: Personal Year Themes (complete 9-year cycle) ─────────────────────
const PERSONAL_YEAR_THEMES={
  1:{title:"Year of New Beginnings",theme:"Initiation · Independence · Planting Seeds",
    essence:"The first year of a brand new 9-year cycle. Everything is fresh. What you initiate now sets the trajectory for the entire cycle. Year 1 carries enormous creative power — but it requires courage, because you are stepping into unknown territory.",
    embrace:["Begin the project or chapter you have been postponing","Trust your own instincts and leadership capacity","Make bold decisions without waiting for permission","Plant seeds even if you cannot see the harvest yet"],
    release:["Clinging to what ended in the previous Year 9","Waiting for others to validate your direction","Fear of being seen or taking up space"],
    watchFor:"Impulsive starts without follow-through. Channel the electric 1 energy deliberately.",
    monthlyFocus:"The first three months are the most potent window for launching.",
    affirmation:"I begin. I am the source of my own new chapter."},
  2:{title:"Year of Partnership and Patience",theme:"Cooperation · Sensitivity · Slow Growth",
    essence:"Year 2 asks you to slow down after Year 1s launch. This is a year of tending, not building. The seeds planted in Year 1 are underground now. Do not dig them up. Trust the process.",
    embrace:["Deepen existing relationships rather than starting new ones","Develop patience as a spiritual practice","Trust intuition over logic this year","Collaborate and seek harmony"],
    release:["Forcing outcomes before they are ready","Confrontation that could be diplomacy","Comparing your pace to others"],
    watchFor:"Over-sensitivity and taking things personally. Your emotional permeability is heightened.",
    monthlyFocus:"Mid-year is ideal for partnerships, contracts, and agreements.",
    affirmation:"I trust the timing. What is meant for me is growing beneath the surface."},
  3:{title:"Year of Expression and Joy",theme:"Creativity · Communication · Expansion",
    essence:"Year 3 is the most socially and creatively alive year of the cycle. What was planted and tended is beginning to show itself. This is a year of joy, self-expression, and visibility — where your light wants to be seen.",
    embrace:["Create, communicate, and share your gifts openly","Social connection, fun, and celebration","Speaking, writing, performing, or teaching","Allowing yourself to be seen"],
    release:["Isolation and playing small","Excessive self-criticism that kills creative flow","Scattering energy across too many projects"],
    watchFor:"Superficiality — the Year 3 energy is so pleasurable it can become avoidance.",
    monthlyFocus:"Begin creative projects in the first half, complete them in the second.",
    affirmation:"I express. I am worthy of being seen, heard, and celebrated."},
  4:{title:"Year of Foundation and Work",theme:"Structure · Discipline · Building",
    essence:"Year 4 calls you into serious, sustained effort. This is the year of the builder — unglamorous but essential. What you construct now lasts decades.",
    embrace:["Systems, routines, and organizational structures","Hard work without needing immediate results","Health, finances, and practical life foundations","Slow, steady, consistent progress"],
    release:["Impatience and desire for shortcuts","Chaos and procrastination","Resisting the discipline this year requires"],
    watchFor:"Rigidity and workaholism. Structure should serve your life — not imprison it.",
    monthlyFocus:"The second half of the year produces the most visible results of your effort.",
    affirmation:"I build. Every brick I lay now supports everything I am becoming."},
  5:{title:"Year of Freedom and Change",theme:"Liberation · Adventure · Transformation",
    essence:"Year 5 is the pivot point of the 9-year cycle. Change is not just likely — it is required. Resistance to change this year creates suffering.",
    embrace:["Travel, new experiences, and expanding your world","Releasing what no longer fits","Saying yes to unexpected opportunities","Freedom in choices, expression, and lifestyle"],
    release:["Trying to control outcomes and maintain the status quo","Stagnant situations, relationships, or patterns"],
    watchFor:"Recklessness and over-indulgence. Make changes consciously, not reactively.",
    monthlyFocus:"The most significant changes often arrive mid-year. Stay flexible throughout.",
    affirmation:"I release and I expand. Change is not loss — it is liberation."},
  6:{title:"Year of Responsibility and Love",theme:"Home · Family · Service · Healing",
    essence:"After Year 5s disruption, Year 6 calls you home — to relationships, family, and the life you are responsible for. Love in its most practical form: showing up, caring, and creating beauty in your immediate world.",
    embrace:["Deepening family and community bonds","Home, beauty, and nurturing environments","Service, healing, and supporting others","Taking responsibility for your closest relationships"],
    release:["Self-neglect in the name of serving others","Perfectionism in relationships","Avoiding the healing conversations that need to happen"],
    watchFor:"Martyrdom — giving so much you have nothing left.",
    monthlyFocus:"Spring and autumn bring the most significant relationship developments.",
    affirmation:"I love and am loved. Responsibility is an act of devotion."},
  7:{title:"Year of Reflection and Wisdom",theme:"Inner Work · Solitude · Spiritual Growth",
    essence:"Year 7 is the most interior year of the cycle. This is not a year for external achievement — it is a year for going deep within. Rest, study, meditation, and inner inquiry are the work.",
    embrace:["Solitude, reflection, and inner inquiry","Spiritual study and contemplative practice","Research, analysis, and developing expertise","Trusting your own inner knowing"],
    release:["Forcing external results that are not ready","Shallow socializing that drains rather than nourishes","Dismissing your inner world for outer busyness"],
    watchFor:"Isolation becoming depression. Solitude is productive — withdrawal is avoidance.",
    monthlyFocus:"The entire year favors inner work. External results will come in Year 8.",
    affirmation:"I go within to find what cannot be found anywhere else."},
  8:{title:"Year of Power and Abundance",theme:"Achievement · Recognition · Material Mastery",
    essence:"Year 8 is the harvest year — where the inner work of Year 7 becomes outer achievement. Business, career, finances, and recognition are all amplified. Step into your authority.",
    embrace:["Bold career and business moves","Financial planning, investment, and material goals","Stepping into leadership and authority","Receiving recognition and abundance"],
    release:["Self-sabotage and shrinking when success appears","Fear of power or visibility","Undervaluing your work and time"],
    watchFor:"Becoming all work and no soul. Keep tending your inner life.",
    monthlyFocus:"The first half of the year carries the most powerful momentum for business moves.",
    affirmation:"I claim my power. Abundance is my natural state and I receive it fully."},
  9:{title:"Year of Completion and Release",theme:"Endings · Forgiveness · Completion",
    essence:"Year 9 closes the entire 9-year cycle. This is the most significant year for letting go — of relationships, patterns, beliefs, and chapters that have run their course.",
    embrace:["Completion — finishing what was started","Forgiveness — of yourself and others","Releasing gracefully what no longer serves","Reflecting on the full 9-year cycle with gratitude"],
    release:["Starting major new projects that belong in Year 1","Clinging to situations that have clearly completed","Bitterness and unforgiveness"],
    watchFor:"Forcing new beginnings before this year is complete. What you do not complete follows you into the next cycle.",
    monthlyFocus:"The final quarter is the most powerful for release and completion rituals.",
    affirmation:"I release with grace. Every ending is making space for the life waiting for me."},
  11:{title:"Year of Illumination — Master Year",theme:"Spiritual Awakening · Heightened Sensitivity · Visionary Purpose",
    essence:"Year 11 is a Master Year — carrying both the 11 vibration AND Year 2 sensitivity. The soul is ready to be used as a vessel for something larger. Spiritual downloads, sudden clarity, and heightened intuition are hallmarks.",
    embrace:["Spiritual practice, meditation, and intuitive development","Visionary thinking and inspired creative work","Trust in what you sense but cannot yet prove","Being a light in your presence, work, and relationships"],
    release:["Dimming your sensitivity because it feels like too much","Choosing comfort over the higher calling nudging you","Doubt that undermines your inner knowing"],
    watchFor:"Nervous system overwhelm. Ground daily. Sleep. Nourish the body.",
    monthlyFocus:"Breakthrough moments can arrive suddenly throughout the year. Stay open.",
    affirmation:"I am a channel for light. My sensitivity is my superpower."},
  22:{title:"Year of the Master Builder — Master Year",theme:"Large-Scale Vision · Legacy · Manifestation",
    essence:"Year 22 is the rarest and most powerful Master Year. You are ready to build something that outlasts you — a legacy project, a movement, a system that serves humanity.",
    embrace:["Thinking and building at the largest scale you can imagine","Projects with lasting impact beyond personal gain","Disciplined sustained effort toward a significant vision","Collaboration with others who share the mission"],
    release:["Small thinking and playing it safe","Fear of the scale of what wants to come through you","Grind without vision"],
    watchFor:"Collapse under the pressure. Learn to hold vision while delegating execution.",
    monthlyFocus:"Every month carries significance. Nothing in a Year 22 is accidental.",
    affirmation:"I build for the ages. My work is a gift to the future."},
};

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
  // Life Path — Philips: reduce each component to single digit FIRST, then sum
  const rawLP=reduce(+bMonth,false)+reduce(+bDay,false)+reduce(digitSum(bYear),false);
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
  // Balance Number = initials of full name (first letter of each name part) — Philips
  const initials=[f,m,l].filter(Boolean).map(n=>n.toUpperCase().replace(/[^A-Z]/g,"")[0]).filter(Boolean);
  const balance=reduce(initials.reduce((s,c)=>s+lv(c),0));
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

  // Pinnacle ages — use REDUCED LP (no master numbers) per Philips
  const lpReduced=reduce(lifePath,false);
  const pin1End=36-lpReduced;
  const pin2End=pin1End+9;
  const pin3End=pin2End+9;

  // Cornerstone (first letter of first name) — approach to life & new beginnings
  const firstClean=(f||"").toUpperCase().replace(/[^A-Z]/g,"");
  const cornerstoneChar=firstClean[0]||"";
  const cornerstone=cornerstoneChar?{char:cornerstoneChar,value:lv(cornerstoneChar)}:null;

  // Capstone (last letter of first name) — ability to complete & follow through
  const capstoneChar=firstClean[firstClean.length-1]||"";
  const capstone=capstoneChar?{char:capstoneChar,value:lv(capstoneChar)}:null;

  // First Vowel — the innermost urge, secret desire beneath all expression
  const firstVowelChar=firstClean.split("").find(c=>VOWELS.has(c))||"";
  const firstVowel=firstVowelChar?{char:firstVowelChar,value:lv(firstVowelChar)}:null;

  // Three Life Cycles/Period Cycles (Philips) — 3 great life periods
  // First Cycle = reduced birth month (birth through end of Pinnacle 1)
  // Second Cycle = reduced birth day (Pinnacles 2 & 3)
  // Third Cycle = reduced birth year (Pinnacle 4 onward)
  const lifeCycles={
    first:{number:mRed,span:"Birth — Age "+pin1End},
    second:{number:dRed,span:"Age "+pin1End+" — Age "+pin3End},
    third:{number:yRed,span:"Age "+pin3End+"+"},
  };

  // Karmic debts — check raw values before reduction
  const karmicDebts=[];
  [rawLP,rawExpr,rawSoul,rawPers].forEach(raw=>{
    const k=getKarmic(raw);
    if(k)karmicDebts.push(k);
  });

  // Master numbers — check ALL core numbers AND pinnacles per Philips
  // Each master number carries BOTH the higher vibration AND its reduced base (11=2, 22=4, 33=6)
  const isMaster=n=>n===11||n===22||n===33;
  const masterEntries=[];
  const checkMaster=(num,label)=>{if(isMaster(num))masterEntries.push({num,label,base:reduce(num,false)});};
  checkMaster(lifePath,"Life Path");
  checkMaster(expression,"Expression");
  checkMaster(soulUrge,"Soul Urge");
  checkMaster(personality,"Personality");
  checkMaster(birthday,"Birthday");
  checkMaster(personalYear,"Personal Year");
  checkMaster(maturity,"Maturity");
  checkMaster(balance,"Balance");
  checkMaster(pin1,"Pinnacle 1");
  checkMaster(pin2,"Pinnacle 2");
  checkMaster(pin3,"Pinnacle 3");
  checkMaster(pin4,"Pinnacle 4");
  const masterNums=masterEntries.map(e=>e.num);

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

  // Karmic Accumulation — 3+ repetitions = over-developed past-life traits (Philips)
  const karmicAccumulation=Object.entries(numCount).filter(([n,c])=>+c>=3).map(([n,c])=>({num:+n,count:+c}));

  // Isolated numbers — present but no filled neighbors in combined grid
  const GRID_NEIGHBORS={1:[2,4],2:[1,3,5],3:[2,6],4:[1,5,7],5:[2,4,6,8],6:[3,5,9],7:[4,8],8:[5,7,9],9:[6,8]};
  const isolatedNums=[1,2,3,4,5,6,7,8,9].filter(n=>combined[n]>0&&GRID_NEIGHBORS[n].every(nb=>combined[nb]===0));

  // Active Challenge (which of 4 is currently operating)
  const curAge=curY-+bYear;
  let activeChallenge=ch4;
  if(curAge<pin1End)activeChallenge=ch1;
  else if(curAge<pin2End)activeChallenge=ch2;
  else if(curAge<pin3End)activeChallenge=ch3;

  // Active Pinnacle
  let activePinnacle=pin4,activePinnacleNum=4;
  if(curAge<pin1End){activePinnacle=pin1;activePinnacleNum=1;}
  else if(curAge<pin2End){activePinnacle=pin2;activePinnacleNum=2;}
  else if(curAge<pin3End){activePinnacle=pin3;activePinnacleNum=3;}

  // Personal Year phase within 9-year cycle
  const pyPhase=personalYear<=3?"Foundation (years 1-3: planting seeds)":personalYear<=6?"Building (years 4-6: growing and developing)":"Completion (years 7-9: harvesting and releasing)";
  const pyTheme=PERSONAL_YEAR_THEMES[personalYear]||PERSONAL_YEAR_THEMES[reduce(personalYear,false)]||null;

  // Full name comparison — birth vs current
  const nameChanged=!!(curName&&curName.trim()&&curName.toLowerCase().trim()!==fullName.toLowerCase().trim());
  const birthNameNums=fullName?{expression,soulUrge,personality}:null;
  const currentNameNums=nameChanged?{
    expression:reduce(nameLetterSum(curName)),
    soulUrge:reduce(nameLetterSum(curName,"v")),
    personality:reduce(nameLetterSum(curName,"c")),
  }:null;
  const nameShiftSummary=nameChanged&&birthNameNums&&currentNameNums?
    [birthNameNums.expression!==currentNameNums.expression?`Expression ${birthNameNums.expression}→${currentNameNums.expression}`:"Expression unchanged ("+expression+")",
     birthNameNums.soulUrge!==currentNameNums.soulUrge?`Soul Urge ${birthNameNums.soulUrge}→${currentNameNums.soulUrge}`:"Soul Urge unchanged ("+soulUrge+")",
     birthNameNums.personality!==currentNameNums.personality?`Personality ${birthNameNums.personality}→${currentNameNums.personality}`:"Personality unchanged ("+personality+")",
    ].join(" | "):null;

  return{
    fullName,lifePath,expression,soulUrge,personality,birthday,
    personalYear,personalMonth,personalDay,
    maturity,balance,subconsciousSelf,missing,
    pinnacles:[pin1,pin2,pin3,pin4],
    pinnacleAges:[pin1End,pin2End,pin3End],
    challenges:[ch1,ch2,ch3,ch4],
    karmicDebts,masterNums,masterEntries,
    birthGrid,nameGrid,combinedGrid:combined,
    birthArrows,combinedArrows,
    planes,intensityNums,
    curNameAnalysis,
    cornerstone,capstone,firstVowel,lifeCycles,
    karmicAccumulation,isolatedNums,
    activeChallenge,activePinnacle,activePinnacleNum,
    pyPhase,pyTheme,nameChanged,nameShiftSummary,
    birthNameNums,currentNameNums,
  };
}

function chineseZodiac(year){
  const A=["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  const E=["Metal","Metal","Water","Water","Wood","Wood","Fire","Fire","Earth","Earth"];
  const P=["Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin"];
  const y=+year, ai=((y-4)%12+12)%12, ei=y%10;
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
  Grid counts [3 6 9 / 2 5 8 / 1 4 7]: ${[3,6,9,2,5,8,1,4,7].map(n=>`${n}×${n.birthGrid?.[n]||0}`).join(" ")}
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
- holisticSynthesis: full cross-system synthesis — the one pattern visible across ALL layers
- returnToSelfGuide: 5-step personalized guide back to alignment with monthly rhythm and realignment anchor
- soulMessage`,

    "soul-connections":`
TIER: Soul Connections — You + One Other
RELATIONSHIP TYPE: ${persons[1]?.relationship||"not specified"} | CONTEXT: ${persons[1]?.relationshipContext||"not specified"}
Generate EVERYTHING from Cosmic Self tier for BOTH people, PLUS a full compatibility section.
The compatibility analysis MUST be calibrated to the relationship type:
- romantic-partner/spouse: focus on attraction patterns, emotional needs, conflict styles, long-term compatibility, intimacy shadows
- business-partner/colleague/creative-collaborator: focus on working styles, decision-making, communication under pressure, complementary strengths, friction points, shared vision alignment
- child/parent/sibling/family-extended: focus on karmic family contracts, inherited patterns, generational healing, teaching/learning dynamics, triggers
- mentor/mentee: focus on growth catalysts, teaching vs enabling, soul mission alignment, timing of the connection
- close-friend/friendship/soul-group: focus on mirror dynamics, soul recognition, growth through challenge, why these two souls found each other
- ex-partner: focus on what the relationship taught, karmic completion, what is unresolved, the gift and the wound
Compatibility sections to include:
- numerologyCompatibility: Life Path interaction, Expression clash or harmony, shared and missing numbers
- relationshipDynamic: specifically framed for the relationship TYPE (not generic)
- communicationStyles: how each person's numbers shape how they talk, listen, argue, repair
- sharedShadow: what shadow patterns they trigger in each other and why (karmic mirror)
- strengthsOfThisUnion: what this specific combination does WELL together
- growthEdges: where the friction lives and what it is asking both people to develop
- soulContract: what is the deeper purpose of this connection — what did these souls agree to work out together?
- soulMessage for the relationship itself`,

    "full-realm":`
TIER: Full Realm — Up to 5 People
GROUP COMPOSITION: ${persons.slice(1).map(p=>p.relationship||"unspecified").join(", ")}
Generate full Cosmic Self for each person. Then generate group dynamics calibrated to the GROUP TYPE:
- If primarily family: focus on ancestral patterns, generational karma, family soul contracts, inherited shadows, who is the healer/scapegoat/golden child energetically
- If primarily business/work: focus on team numerology, leadership numbers, decision-making styles, missing energies in the team, how to leverage each person's arrows
- If mixed or friend group: focus on soul tribe dynamics, group shadow, collective mission, what this group is here to create or heal together
Group dynamics sections:
- groupProfile: overview of the collective numerological fingerprint
- dominantNumbers: what numbers dominate the group and what this means
- missingGroupEnergies: what numbers are absent and what blind spots this creates collectively
- arrowPatterns: shared strengths and shared weaknesses across all charts
- keyRelationships: 2-3 most significant pairings within the group and their dynamic
- groupShadow: the collective shadow — what this group tends to avoid, project, or repeat
- collectiveFrequency: the vibrational signature of this group together
- soulMessage for the collective — what is this group here to do or heal together?`,
  };

  return `You are a master numerologist deeply trained in David A. Philips' Complete Book of Numerology, a Western astrologer, Chinese zodiac scholar, Jungian shadow work guide, and sound healing practitioner. Your readings are precise, personal, and transformative — never generic.

${tierInstructions[tierId]||tierInstructions["soul-spark"]}

═══════════ PERSON DATA FOR ${name.toUpperCase()} ═══════════

IDENTITY:
  Name: ${name} | Pronouns: ${p.pronouns||"not specified"}
  Relationship to Person 1: ${p.relationship||"primary person"} ${p.relationshipContext?"| Context: "+p.relationshipContext:""}
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
  Cornerstone (1st letter of first name = ${n.cornerstone?.char||"N/A"}): value ${n.cornerstone?.value||"N/A"} — how they approach new beginnings
  Capstone (last letter of first name = ${n.capstone?.char||"N/A"}): value ${n.capstone?.value||"N/A"} — how they complete things
  First Vowel (${n.firstVowel?.char||"N/A"}): value ${n.firstVowel?.value||"N/A"} — the innermost secret desire
  Life Cycles: 1st=${n.lifeCycles?.first?.number} (${n.lifeCycles?.first?.span}) | 2nd=${n.lifeCycles?.second?.number} (${n.lifeCycles?.second?.span}) | 3rd=${n.lifeCycles?.third?.number} (${n.lifeCycles?.third?.span})
  Pinnacles: ${n.pinnacles[0]} (birth–age${n.pinnacleAges[0]}) → ${n.pinnacles[1]} (age${n.pinnacleAges[0]}–${n.pinnacleAges[1]}) → ${n.pinnacles[2]} (age${n.pinnacleAges[1]}–${n.pinnacleAges[2]}) → ${n.pinnacles[3]} (age${n.pinnacleAges[2]}+)
  Challenges: ${n.challenges[0]}, ${n.challenges[1]}, ${n.challenges[2]} (main), ${n.challenges[3]}
  Karmic Debts: ${n.karmicDebts.length?n.karmicDebts.join(" | "):"None detected"}
  Master Numbers present: ${n.masterEntries?.length?n.masterEntries.map(e=>e.num+"/"+e.base+" in "+e.label).join(" | "):"None detected"}
  NOTE: Each master number carries BOTH its higher vibration AND its base number's shadow (11 lives as both 11 AND 2, etc.)
  Birth Name Numbers: Expression=${n.expression} | Soul Urge=${n.soulUrge} | Personality=${n.personality}
  Current Name Numbers: ${n.nameChanged?`Expression=${n.currentNameNums?.expression} | Soul Urge=${n.currentNameNums?.soulUrge} | Personality=${n.currentNameNums?.personality}`:"Same as birth name"}
  NAME SHIFT: ${n.nameChanged?n.nameShiftSummary:"No name change — birth name blueprint fully active"}
  Karmic Accumulation (3+ repetitions in name): ${n.karmicAccumulation?.length?n.karmicAccumulation.map(x=>x.num+"(×"+x.count+")").join(", "):"None — balanced"}
  Isolated numbers (present but no grid neighbors): ${n.isolatedNums?.length?n.isolatedNums.join(", "):"None"}
  Active Pinnacle NOW: ${n.activePinnacle} (Pinnacle ${n.activePinnacleNum})
  Active Challenge NOW: ${n.activeChallenge}
  Personal Year Phase: ${n.pyPhase}
  Personal Year Title: ${n.pyTheme?.title||""}
  Personal Year Theme: ${n.pyTheme?.theme||""}
  Essence: ${n.pyTheme?.essence||""}
  Embrace this year: ${n.pyTheme?.embrace?.join(" · ")||""}
  Release this year: ${n.pyTheme?.release?.join(" · ")||""}
  Watch for: ${n.pyTheme?.watchFor||""}
  Isolated Number Remedies: ${n.isolatedNums?.length?n.isolatedNums.map(x=>x+": "+ISOLATED_REMEDIES[x]?.title+" — "+ISOLATED_REMEDIES[x]?.remedy).join(" | "):"None"}

${isFull?arrowsBlock:""}
${isFull?planesBlock:""}

ASTROLOGY:
  DOB: ${p.bMonth}/${p.bDay}/${p.bYear} | Time: ${p.bHour?(p.bHour+":"+(p.bMinute||"00")):"Unknown"} | Place: ${[p.bCity,p.bState,p.bCountry].filter(Boolean).join(", ")||"Not provided"}
  Sun Sign: ${p.natalSun||sun} ${p.natalSun&&p.natalSun!==sun?"(calculated: "+sun+")":""}
  Moon Sign: ${p.natalMoon||"Not provided"}
  Rising / Ascendant: ${p.natalRising||"Not provided — birth time needed"}
  Mercury: ${p.natalMercury||"Not provided"} | Venus: ${p.natalVenus||"Not provided"} | Mars: ${p.natalMars||"Not provided"}
  Jupiter: ${p.natalJupiter||"Not provided"} | Saturn: ${p.natalSaturn||"Not provided"} | Chiron: ${p.natalChiron||"Not provided"}
  North Node: ${p.natalNorthNode||"Not provided"} | South Node: ${p.natalSouthNode||"Not provided"}
  Key House Cusps: 1st=${p.natalHouse1||"?"} | 4th=${p.natalHouse4||"?"} | 7th=${p.natalHouse7||"?"} | 10th=${p.natalHouse10||"?"}
  Major Aspects/Patterns: ${p.natalAspects||"Not provided"}

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
    "personalYear": {
      "number": ${n.personalYear},
      "title": "${n.pyTheme?.title||'Personal Year '+n.personalYear}",
      "theme": "${n.pyTheme?.theme||''}",
      "reading": "5-6 sentences weaving the Personal Year ${n.personalYear} energy (${n.pyTheme?.essence||''}) specifically into ${name}'s chart — their Life Path ${n.lifePath}, active Pinnacle ${n.activePinnacle}, and active challenge ${n.activeChallenge}. This is THIS person in THIS year, not a generic year reading.",
      "embrace": ${JSON.stringify(n.pyTheme?.embrace||[])},
      "release": ${JSON.stringify(n.pyTheme?.release||[])},
      "watchFor": "${n.pyTheme?.watchFor||''}",
      "monthlyFocus": "${n.pyTheme?.monthlyFocus||''}",
      "personalMonthInsight": "3-4 sentences on Personal Month ${n.personalMonth} within Personal Year ${n.personalYear} — what this specific month asks, what energy it carries, what ${name} should focus on right now",
      "affirmation": "${n.pyTheme?.affirmation||''}"
    },
    "maturity": { "number": ${n.maturity}, "reading": "3 sentences on the energy that fully emerges after 40. How does this number reshape the second half of life?" },
    "balance": { "number": ${n.balance}, "reading": "3 sentences on how ${name} responds instinctively under stress and what helps them return to center" },
    "subconsciousSelf": { "number": ${n.subconsciousSelf}, "reading": "3 sentences on what they do naturally and automatically in crisis situations" },
    "missing": { "numbers": ${JSON.stringify(n.missing)}, "reading": "3-4 sentences on the karmic lessons these missing numbers represent — what they came to consciously develop. Be specific about each number." },
    "cornerstone": "2-3 sentences on the Cornerstone letter (${n.cornerstone?.char||'N/A'}) — how ${name} starts new chapters and approaches beginnings",
    "capstone": "2-3 sentences on the Capstone letter (${n.capstone?.char||'N/A'}) — how ${name} finishes what they start and how they wrap up life chapters",
    "firstVowel": "2-3 sentences on the First Vowel (${n.firstVowel?.char||'N/A'}) — the hidden inner drive that pulses beneath everything",
    "lifeCycles": "3-4 sentences weaving all three Life Cycles (${n.lifeCycles?.first?.number}, ${n.lifeCycles?.second?.number}, ${n.lifeCycles?.third?.number}) into the arc of ${name}'s three great life periods. Which cycle are they in now and what does it ask?",
    "isolatedNumbers": "${n.isolatedNums?.length?
      'ISOLATED NUMBERS: '+n.isolatedNums.join(', ')+'. For EACH isolated number provide: (1) what this energy represents that feels hard to access for '+name+', (2) the specific Philips remedy — which neighboring numbers to develop and why, (3) 2-3 concrete integration practices, (4) what becomes available when integrated. Use the specific remedy data provided in the prompt.'
      :'null'}","Numbers "${n.isolatedNums?.join(', ')}" are present in the combined grid but have no filled neighbors — talents and traits that exist but feel disconnected. Write 2-3 sentences on what it means for ${name} to have these isolated energies and how they might access them more consciously.":"null"}",
    "activeTiming": "Write 4-5 sentences on the precise current moment: ${name} is in Pinnacle ${n.activePinnacleNum} (${n.activePinnacle}), their active challenge is ${n.activeChallenge}, Personal Year ${n.personalYear} in the ${n.pyPhase}. What specific convergence is happening RIGHT NOW at the intersection of these three timing layers? What is being asked, what is completing, what new door is opening?",
    "intensityNumbers": "2-3 sentences on the intensity numbers (${n.intensityNums.map(x=>x.num).join(",")}) and what their high frequency in the name chart means for personality and drive",
    "pinnacles": "4-5 sentences weaving all four pinnacles (${n.pinnacles.join(",")}) into a narrative arc of ${name}'s life chapters. Which pinnacle are they in now? What does it ask of them?",
    "challenges": "3-4 sentences on the challenges (${n.challenges.join(",")}) as initiations — not obstacles but invitations to grow. What is the main challenge (${n.challenges[2]}) really asking for?",
    "karmicDebts": ${JSON.stringify(n.karmicDebts.length?n.karmicDebts:null)},
    "karmicReading": "${n.karmicDebts.length?"3-4 sentences on the specific karmic debt(s) present, what was unlearned in past lives, and how this life is structured to complete that lesson":"null"}",
    "karmicAccumulation": "${n.karmicAccumulation?.length?"Numbers "${n.karmicAccumulation?.map(x=>x.num+'(×'+x.count+')').join(', ')}" appear excessively in the birth name. Write 3-4 sentences: these are over-developed past-life energies now showing as compulsions, defaults, or blind spots. What is the shadow of having too much of this number energy? How does it serve as a crutch? What does growth look like when ${name} consciously chooses beyond this default pattern?":"null"}",
    "masterNumbers": "${n.masterEntries?.length?"5-6 sentences on the master number(s) present: "+n.masterEntries.map(e=>e.num+"/"+e.base+" in the "+e.label).join(", ")+". For EACH master number: name it, describe the highest calling of the master vibration, then describe the tension and tendency to collapse into its base number ("+n.masterEntries.map(e=>e.num+" collapses into "+e.base).join(", ")+"). Master numbers are not gifts freely given — they are earned through pressure. What specific pressure or initiation does this master number configuration create for "+name+"? How do they know when they are living the master vibration vs. the base number?": "null"}",
    "currentNameShift": "${n.nameChanged?"FULL SIDE-BY-SIDE COMPARISON: Birth name ("${n.fullName}") vs current name ("${[p.currentFirst,p.currentLast].filter(Boolean).join(' ')}"). Birth name Expression=${n.birthNameNums?.expression}, Soul Urge=${n.birthNameNums?.soulUrge}, Personality=${n.birthNameNums?.personality}. Current name Expression=${n.currentNameNums?.expression}, Soul Urge=${n.currentNameNums?.soulUrge}, Personality=${n.currentNameNums?.personality}. Write 5-6 sentences: what shifted, what doors opened, what closed. Per Philips the birth name is the soul blueprint — the current name creates an overlay. Is this overlay harmonious with Life Path ${n.lifePath}? What is now amplified vs suppressed for ${name}?":"Name unchanged — the birth name IS the complete vibrational blueprint. All numbers apply with full force."}"
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
    "sunSign": "${p.natalSun||sun}",
    "moonSign": "${p.natalMoon||'Not provided'}",
    "rising": "${p.natalRising||'Not provided'}",
    "sunReading": "4-5 sentences — how their ${p.natalSun||sun} Sun interplays specifically with Life Path ${n.lifePath} and Expression ${n.expression}. Where do these energies amplify each other? Where do they create productive tension?",
    "moonReading": "4-5 sentences on ${p.natalMoon||'the Moon placement'} — the emotional body, instinctive reactions, childhood conditioning, what the soul needs to feel safe. How does this Moon sign interact with the Life Path ${n.lifePath} and shadow themes? If Moon not provided, speak to the numerological emotional blueprint (Arrow of Emotion, planes of expression) instead.",
    "risingReading": "${p.natalRising?'4-5 sentences on the '+p.natalRising+' Rising — the mask worn, the first impression given, the body's approach to life, and how this Ascendant shapes how the world experiences them vs. who they truly are inside (compared to Sun/Moon). Connect to Cornerstone and Personality Number '+n.personality+'.':'The Rising was not provided. Speak to what we can know from the Personality Number '+n.personality+' and Cornerstone instead.'}",
    "northNodeReading": "${p.natalNorthNode?'3-4 sentences on the North Node in '+p.natalNorthNode+' — the soul's evolutionary direction, the spiritual assignment of this lifetime, the territory that feels uncomfortable but is exactly where growth lives. Cross-reference with Life Path '+n.lifePath+' and missing numbers '+JSON.stringify(n.missing)+'.':'North Node not provided — speak to evolutionary themes from LP and karmic debt context instead.'}",
    "chironReading": "${p.natalChiron?'3-4 sentences on Chiron in '+p.natalChiron+' — the sacred wound and the healer's gift. Where does this person carry pain they haven't claimed as power yet? How does Chiron in this sign map to the shadow work themes and missing numbers?':'Chiron not provided — interpret the core wound from shadow data and missing numbers.'}",
    "innerPlanets": "${[p.natalMercury,p.natalVenus,p.natalMars].some(Boolean)?'4-5 sentences weaving Mercury in '+p.natalMercury+', Venus in '+p.natalVenus+', Mars in '+p.natalMars+' into how this person thinks, loves, and acts. Cross-reference with Expression Number '+n.expression+', Soul Urge '+n.soulUrge+', and dominant arrows.':'Inner planets not provided — draw from Expression, Soul Urge, Personality and dominant plane instead.'}",
    "chartThemes": "3-4 sentences weaving birth location, season, time if known into the overall energy signature. If Rising is known, describe the Ascendant ruler and its condition. Identify any stellia, dominant elements, or modal signatures visible from provided placements.",
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

  "holisticSynthesis": {
    "corePattern": "5-6 sentences identifying the single most important pattern that emerges when you look at EVERYTHING together — Life Path ${n.lifePath}, Expression ${n.expression}, Soul Urge ${n.soulUrge}, dominant arrows, Chinese zodiac ${cz.element} ${cz.animal}, natal chart placements, Personal Year ${n.personalYear}, and shadow themes. Not a list — a synthesis. What is the one thread that runs through every layer of this chart? What does the whole picture say that no single number says alone?",
    "greatestGift": "3-4 sentences on the most exceptional gift visible in this chart — the thing ${name} is most uniquely built to bring to the world. Synthesize from: strongest arrow, highest expression number, natal placements if provided, and Life Path purpose.",
    "deepestChallenge": "3-4 sentences on the central tension in this chart — not a single number but the friction BETWEEN key energies. Where do the numbers pull against each other? Where does the natal chart create tension with the numerology? What is this person's most recurring internal conflict?",
    "soulSignature": "2-3 sentences — if you had to describe the essence of ${name}'s soul in a handful of words, what would they be? Not what they do — who they ARE at soul level.",
    "convergencePoint": "3-4 sentences on where multiple systems AGREE — where numerology, astrology, Chinese zodiac, and shadow data all point to the same truth. These convergence points are the most reliable indicators of soul truth."
  },

  "returnToSelfGuide": {
    "overview": "3-4 sentences framing this guide — what getting back to yourself means for ${name} specifically, given everything in their chart. What does self-alignment actually look and feel like for a Life Path ${n.lifePath} in a Personal Year ${n.personalYear}?",
    "step1": {
      "title": "Evocative 4-5 word title for Step 1",
      "timeframe": "e.g. This week / Days 1-7",
      "focus": "Which number, arrow, or theme this step addresses",
      "practice": "3-4 sentences describing exactly what to do and why — specific, somatic, actionable. Not generic self-help. Connected to the actual data in their chart.",
      "signYoureAligned": "1-2 sentences on how they will know this step is working — what they will feel or notice"
    },
    "step2": {
      "title": "Step 2 title",
      "timeframe": "e.g. Week 2 / Days 8-14",
      "focus": "Focus area from chart",
      "practice": "3-4 sentences — specific, chart-connected practice",
      "signYoureAligned": "1-2 sentences"
    },
    "step3": {
      "title": "Step 3 title",
      "timeframe": "e.g. Week 3 / Days 15-21",
      "focus": "Focus area — address the primary shadow or weakness arrow",
      "practice": "3-4 sentences",
      "signYoureAligned": "1-2 sentences"
    },
    "step4": {
      "title": "Step 4 title",
      "timeframe": "e.g. Week 4 / Days 22-30",
      "focus": "Integration — how the previous steps weave together",
      "practice": "3-4 sentences on the integration practice and daily ritual",
      "signYoureAligned": "1-2 sentences"
    },
    "step5": {
      "title": "Step 5 title — The Ongoing Practice",
      "timeframe": "Ongoing / Month 2+",
      "focus": "The North Star practice — the one thing they return to when they lose their way",
      "practice": "4-5 sentences — this is the keystone practice derived from the deepest truth in their chart. Make it personal, memorable, non-negotiable.",
      "signYoureAligned": "2-3 sentences — what fully embodied alignment looks and feels like for ${name}"
    },
    "monthlyRhythm": "3-4 sentences on a simple monthly check-in ritual — how to use their Personal Month number each month to stay calibrated",
    "whenYouLoseYourWay": "3-4 sentences — the specific signs that ${name} is out of alignment (based on their shadow patterns and weak arrows), and the single fastest path back to center for THIS chart"
  },

  "soulMessage": "8-10 sentences written directly to ${name}. This is the final synthesis — weave together Life Path ${n.lifePath}, Expression ${n.expression}, Personal Year ${n.personalYear}, the core pattern from holisticSynthesis, their deepest challenge, their greatest gift, the North Star from the returnToSelfGuide. Speak to the soul, not the ego. Acknowledge exactly what they carry and what they are capable of. Reference something specific from their chart that no generic reading would know. End with ONE sentence — not advice, not instruction — just truth. The sentence that stays."
}`;
}

// ═══════════════════════════════════════════════════════════
// 📡  CLAUDE API
// ═══════════════════════════════════════════════════════════
// Section labels shown to user as reading streams in
const SECTION_LABELS={
  cosmicSnapshot:"✦ Cosmic Snapshot",
  numerology:"🔢 Numerology",
  lifePath:"✦ Life Path",
  expression:"✦ Expression",
  soulUrge:"✦ Soul Urge",
  personalYear:"✦ Personal Year",
  arrows:"⬆ Arrows of Pythagoras",
  loShu:"◉ Lo Shu Grid",
  planes:"◈ Planes of Expression",
  chineseZodiac:"☯ Chinese Zodiac",
  astrology:"🌙 Astrology",
  shadowWork:"🌑 Shadow Work",
  meditation:"◎ Frequency & Meditation",
  holisticSynthesis:"🌐 Holistic Synthesis",
  returnToSelfGuide:"🗺 Return to Self Guide",
  soulMessage:"✉ Soul Message",
  compatibility:"♾ Compatibility",
  relationships:"♾ Relationships",
  groupProfile:"⬡ Group Profile",
};

async function generateReading(formData, onProgress){
  const prompt=buildPrompt(formData);
  const res=await fetch("/api/reading",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:16000,
      messages:[{role:"user",content:prompt}]
    })
  });
  if(!res.ok) throw new Error(`Server error: ${res.status}`);

  const reader=res.body.getReader();
  const decoder=new TextDecoder();
  let buffer="";
  let accumulated="";
  let lastSection="";

  // Detect which section is currently being written from partial JSON
  const detectSection=(text)=>{
    const keys=Object.keys(SECTION_LABELS);
    for(let i=keys.length-1;i>=0;i--){
      const k=keys[i];
      if(text.includes(`"${k}"`))return k;
    }
    return null;
  };

  while(true){
    const{done,value}=await reader.read();
    if(done)break;
    buffer+=decoder.decode(value,{stream:true});
    const lines=buffer.split("
");
    buffer=lines.pop();

    for(const line of lines){
      if(!line.startsWith("data: "))continue;
      const raw=line.slice(6).trim();
      try{
        const evt=JSON.parse(raw);
        if(evt.type==="delta"){
          accumulated+=evt.text;
          // Detect section from accumulated text and report progress
          const sec=detectSection(accumulated);
          if(sec&&sec!==lastSection){
            lastSection=sec;
            onProgress&&onProgress({type:"section",label:SECTION_LABELS[sec]||sec});
          }
          onProgress&&onProgress({type:"chars",count:accumulated.length});
        } else if(evt.type==="error"){
          throw new Error(evt.error||"Stream error");
        }
      }catch(parseErr){
        if(parseErr.message&&parseErr.message!=="Stream error")continue;
        throw parseErr;
      }
    }
  }

  // Parse the complete accumulated JSON
  const clean=accumulated.replace(/```json|```/g,"").trim();
  try{
    return JSON.parse(clean);
  }catch(e){
    // Try to salvage partial JSON
    const lastBrace=clean.lastIndexOf("}");
    if(lastBrace>100){
      try{return JSON.parse(clean.slice(0,lastBrace+1)+"}");}catch{}
    }
    throw new Error("Reading complete but JSON parsing failed. Please try again.");
  }
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
  // Holistic Synthesis
  const HS=r.holisticSynthesis;
  if(HS){lines.push(`${"═".repeat(55)}\nHOLISTIC SYNTHESIS\n${"─".repeat(30)}`);[
    ["CORE PATTERN",HS.corePattern],["GREATEST GIFT",HS.greatestGift],["DEEPEST CHALLENGE",HS.deepestChallenge],
    ["SOUL SIGNATURE",HS.soulSignature],["CONVERGENCE POINT",HS.convergencePoint]
  ].forEach(([k,v])=>{if(v)lines.push(`${k}\n${v}\n`);});}
  // Return to Self Guide
  const RG=r.returnToSelfGuide;
  if(RG){
    lines.push(`${"═".repeat(55)}\nYOUR RETURN TO SELF GUIDE\n${"─".repeat(30)}\n${RG.overview||""}`)
    ;["step1","step2","step3","step4","step5"].forEach(k=>{
      const s=RG[k];if(s)lines.push(`\nSTEP ${k.slice(-1)}: ${s.title||""} — ${s.timeframe||""} | Focus: ${s.focus||""}\n${s.practice||""}\n✓ You will know it is working when: ${s.signYoureAligned||""}`);
    });
    if(RG.monthlyRhythm)lines.push(`\nMONTHLY RHYTHM\n${RG.monthlyRhythm}`);
    if(RG.whenYouLoseYourWay)lines.push(`\nWHEN YOU LOSE YOUR WAY\n${RG.whenYouLoseYourWay}`);
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
      {r.holisticSynthesis&&<Sec icon="🌐" title="Holistic Synthesis — The Complete Picture" color="#C8A96E">
  {r.holisticSynthesis.corePattern&&<div style={{marginBottom:16}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#C8A96E",textTransform:"uppercase",marginBottom:6}}>Core Pattern</div><p style={{fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.88}}>{r.holisticSynthesis.corePattern}</p></div>}
  {r.holisticSynthesis.greatestGift&&<div style={{marginBottom:16,padding:"12px 16px",background:"rgba(200,169,110,.06)",borderRadius:6,border:"1px solid rgba(200,169,110,.15)"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#C8A96E",textTransform:"uppercase",marginBottom:6}}>✦ Greatest Gift</div><p style={{fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.88}}>{r.holisticSynthesis.greatestGift}</p></div>}
  {r.holisticSynthesis.deepestChallenge&&<div style={{marginBottom:16,padding:"12px 16px",background:"rgba(155,126,212,.06)",borderRadius:6,border:"1px solid rgba(155,126,212,.15)"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#9B7ED4",textTransform:"uppercase",marginBottom:6}}>◌ Deepest Challenge</div><p style={{fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.88}}>{r.holisticSynthesis.deepestChallenge}</p></div>}
  {r.holisticSynthesis.soulSignature&&<div style={{marginBottom:16,textAlign:"center",padding:"14px",background:"rgba(200,169,110,.04)",borderRadius:6}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#C8A96E",textTransform:"uppercase",marginBottom:6}}>Soul Signature</div><p style={{fontSize:15,color:"rgba(255,255,255,.9)",lineHeight:1.88,fontStyle:"italic"}}>{r.holisticSynthesis.soulSignature}</p></div>}
  {r.holisticSynthesis.convergencePoint&&<div style={{marginBottom:6}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#7EC4D4",textTransform:"uppercase",marginBottom:6}}>Where All Systems Agree</div><p style={{fontSize:13,color:"rgba(255,255,255,.68)",lineHeight:1.88}}>{r.holisticSynthesis.convergencePoint}</p></div>}
</Sec>}

{r.returnToSelfGuide&&<Sec icon="🗺️" title="Your Return to Self Guide" color="#7EC4D4">
  {r.returnToSelfGuide.overview&&<p style={{fontSize:13,color:"rgba(255,255,255,.68)",lineHeight:1.88,marginBottom:20,fontStyle:"italic"}}>{r.returnToSelfGuide.overview}</p>}
  {["step1","step2","step3","step4","step5"].map((k,i)=>{
    const s=r.returnToSelfGuide[k];if(!s)return null;
    return(<div key={k} style={{marginBottom:16,padding:"14px 16px",background:i===4?"rgba(200,169,110,.08)":"rgba(255,255,255,.02)",border:i===4?"1px solid rgba(200,169,110,.25)":"1px solid rgba(255,255,255,.06)",borderRadius:7,borderLeft:`3px solid ${["#C8A96E","#9B7ED4","#D47E9B","#7EC4D4","#C8A96E"][i]}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:4}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:["#C8A96E","#9B7ED4","#D47E9B","#7EC4D4","#C8A96E"][i],letterSpacing:".1em"}}>STEP {i+1}: {s.title||""}</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontStyle:"italic"}}>{s.timeframe||""}</div>
      </div>
      {s.focus&&<div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:8,fontStyle:"italic"}}>Focus: {s.focus}</div>}
      <p style={{fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.88,marginBottom:s.signYoureAligned?8:0}}>{s.practice||""}</p>
      {s.signYoureAligned&&<div style={{fontSize:11,color:"rgba(126,196,212,.7)",fontStyle:"italic",paddingTop:6,borderTop:"1px solid rgba(255,255,255,.04)"}}>✓ {s.signYoureAligned}</div>}
    </div>);
  })}
  {r.returnToSelfGuide.monthlyRhythm&&<div style={{marginTop:16,padding:"12px 16px",background:"rgba(126,196,212,.05)",borderRadius:6,border:"1px solid rgba(126,196,212,.15)"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#7EC4D4",textTransform:"uppercase",marginBottom:6}}>Monthly Rhythm</div><p style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.88}}>{r.returnToSelfGuide.monthlyRhythm}</p></div>}
  {r.returnToSelfGuide.whenYouLoseYourWay&&<div style={{marginTop:12,padding:"12px 16px",background:"rgba(155,126,212,.05)",borderRadius:6,border:"1px solid rgba(155,126,212,.15)"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".14em",color:"#9B7ED4",textTransform:"uppercase",marginBottom:6}}>When You Lose Your Way</div><p style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.88}}>{r.returnToSelfGuide.whenYouLoseYourWay}</p></div>}
</Sec>}

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

const ZODIAC_SIGNS_O=[{v:"",l:"— Select —"},{v:"Aries",l:"♈ Aries"},{v:"Taurus",l:"♉ Taurus"},{v:"Gemini",l:"♊ Gemini"},{v:"Cancer",l:"♋ Cancer"},{v:"Leo",l:"♌ Leo"},{v:"Virgo",l:"♍ Virgo"},{v:"Libra",l:"♎ Libra"},{v:"Scorpio",l:"♏ Scorpio"},{v:"Sagittarius",l:"♐ Sagittarius"},{v:"Capricorn",l:"♑ Capricorn"},{v:"Aquarius",l:"♒ Aquarius"},{v:"Pisces",l:"♓ Pisces"}];

const emptyP=()=>({relationship:"",relationshipContext:"",preferredName:"",legalFirst:"",legalMiddle:"",legalLast:"",currentFirst:"",currentLast:"",bMonth:"",bDay:"",bYear:"",timeKnown:"",bHour:"",bMinute:"",bCity:"",bState:"",bCountry:"",pronouns:"",shadowThemes:[],recurringPatterns:"",childhoodWound:"",shadowDepth:5,shadowGoal:"",meditationFocus:[],meditationExp:"",currentPractice:"",chakraFocus:[],freqInterest:[],binauralInterest:[],goals:"",natalMoon:"",natalRising:"",natalMercury:"",natalVenus:"",natalMars:"",natalJupiter:"",natalSaturn:"",natalNorthNode:"",natalSouthNode:"",natalChiron:"",natalSun:"",natalHouse1:"",natalHouse4:"",natalHouse7:"",natalHouse10:"",natalAspects:"",natalSource:""});

const PersonForm=({p,pi,upd,color,withFull})=>(
  <div style={{background:"rgba(255,255,255,.015)",border:`1px solid ${color}22`,borderRadius:9,padding:"22px 20px",marginBottom:18,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${color},transparent)`}}/>
    <h3 style={{fontFamily:"'Cinzel',serif",color,fontSize:12,letterSpacing:".14em",marginBottom:18,textTransform:"uppercase"}}>{pi===0?"✦ Your Information":`✦ Person ${pi+1}`}</h3>

    {pi>0&&<>
<TS l="Relationship to You" v={p.relationship} s={v=>upd({relationship:v})} opts={[{v:"romantic-partner",l:"💑 Romantic Partner"},{v:"spouse",l:"💍 Spouse / Life Partner"},{v:"child",l:"👶 Child"},{v:"parent",l:"🌳 Parent"},{v:"sibling",l:"👯 Sibling"},{v:"close-friend",l:"💛 Close Friend"},{v:"friendship",l:"🤝 Friendship (general)"},{v:"business-partner",l:"🤝 Business Partner"},{v:"colleague",l:"💼 Colleague / Coworker"},{v:"mentor",l:"🌟 Mentor / Teacher"},{v:"mentee",l:"🌱 Mentee / Student"},{v:"creative-collaborator",l:"🎨 Creative Collaborator"},{v:"soul-group",l:"✨ Soul Group Member"},{v:"ex-partner",l:"🌀 Ex / Past Partner"},{v:"family-extended",l:"🌿 Extended Family"},{v:"other",l:"🔮 Other / Complex"}]} r/>}
{pi>0&&p.relationship&&<TI l="What brings you to explore this relationship?" v={p.relationshipContext} s={v=>upd({relationshipContext:v})} p="e.g. We keep having the same conflict / We're starting a business together / Need to understand our dynamic…" sub="Optional — shapes the focus of the compatibility reading"/>}
</>

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

      <GD label="Natal Chart Placements — Optional but Powerful"/>
      <div style={{background:"rgba(126,196,212,.04)",border:"1px solid rgba(126,196,212,.12)",borderRadius:4,padding:"9px 13px",marginBottom:12,fontSize:11,color:"rgba(255,255,255,.42)",fontStyle:"italic",lineHeight:1.8}}>
        🌙 Get your free chart at <strong style={{color:"rgba(126,196,212,.7)"}}>astro.com</strong> → Extended Chart Selection. The more placements you provide, the deeper your reading. If you have a reading from Co-Star, TimePassages, or Cafe Astrology — use those too.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <TS l="Sun Sign" v={p.natalSun} s={v=>upd({natalSun:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="Moon Sign" v={p.natalMoon} s={v=>upd({natalMoon:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="Rising / Ascendant" v={p.natalRising} s={v=>upd({natalRising:v})} opts={ZODIAC_SIGNS_O}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <TS l="Mercury" v={p.natalMercury} s={v=>upd({natalMercury:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="Venus" v={p.natalVenus} s={v=>upd({natalVenus:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="Mars" v={p.natalMars} s={v=>upd({natalMars:v})} opts={ZODIAC_SIGNS_O}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <TS l="Jupiter" v={p.natalJupiter} s={v=>upd({natalJupiter:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="Saturn" v={p.natalSaturn} s={v=>upd({natalSaturn:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="Chiron" v={p.natalChiron} s={v=>upd({natalChiron:v})} opts={ZODIAC_SIGNS_O}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <TS l="North Node" v={p.natalNorthNode} s={v=>upd({natalNorthNode:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="South Node" v={p.natalSouthNode} s={v=>upd({natalSouthNode:v})} opts={ZODIAC_SIGNS_O}/>
      </div>
      <GD label="Key House Cusps (optional)"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
        <TS l="1st House (Self)" v={p.natalHouse1} s={v=>upd({natalHouse1:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="4th House (Home)" v={p.natalHouse4} s={v=>upd({natalHouse4:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="7th House (Partnership)" v={p.natalHouse7} s={v=>upd({natalHouse7:v})} opts={ZODIAC_SIGNS_O}/>
        <TS l="10th House (Career)" v={p.natalHouse10} s={v=>upd({natalHouse10:v})} opts={ZODIAC_SIGNS_O}/>
      </div>
      <TTA l="Major Aspects or Patterns (optional)" v={p.natalAspects} s={v=>upd({natalAspects:v})} p="e.g. Sun conjunct Saturn, T-square in cardinal signs, stellium in 8th house..." rows={2}/>
      <TS l="Where did you get your chart?" v={p.natalSource} s={v=>upd({natalSource:v})} opts={[{v:"astro.com",l:"Astro.com"},{v:"costar",l:"Co-Star"},{v:"timepassages",l:"TimePassages"},{v:"cafeastrology",l:"Cafe Astrology"},{v:"astrodienst",l:"Astrodienst"},{v:"practitioner",l:"From a practitioner"},{v:"other",l:"Other / Unknown"}]}/>

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
  const[legalConsent,setLegalConsent]=useState(false);
  const[reading,setReading]=useState(null);
  const[genMsg,setGenMsg]=useState("");
  const[streamSection,setStreamSection]=useState("");
  const[streamChars,setStreamChars]=useState(0);
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
      const r=await generateReading({persons,tierId},(progress)=>{
        if(progress.type==="section"){
          clearInterval(iv);
          setStreamSection(progress.label);
          setGenMsg(progress.label);
        } else if(progress.type==="chars"){
          setStreamChars(progress.count);
        }
      });
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
            {/* Legal Disclaimer */}
            <div style={{background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.12)",borderRadius:7,padding:"16px 18px",marginBottom:20,fontSize:11,color:"rgba(255,255,255,.38)",lineHeight:1.9}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".15em",color:"rgba(200,169,110,.6)",textTransform:"uppercase",marginBottom:8}}>Important — Please Read</div>
              Sacred Soul Map readings are provided for <strong style={{color:"rgba(255,255,255,.5)"}}>educational, spiritual, and personal growth purposes only</strong>. They do not constitute — and are not a substitute for — professional psychological, medical, financial, or legal advice. By submitting this form you acknowledge that: (1) all readings are based on numerological and astrological traditions and are interpretive in nature; (2) you retain full personal responsibility for any decisions made in connection with this reading; (3) Sacred Soul Map and Courtney Dodd are not liable for outcomes related to actions taken based on reading content; (4) this reading does not create a therapeutic, medical, or fiduciary relationship of any kind; (5) all personal data entered is used solely to generate your reading and is not sold or shared with third parties.
              <div style={{marginTop:10,display:"flex",alignItems:"flex-start",gap:8}}>
                <input type="checkbox" id="legalConsent" checked={legalConsent} onChange={e=>setLegalConsent(e.target.checked)} style={{marginTop:3,accentColor:"#C8A96E",cursor:"pointer"}}/>
                <label htmlFor="legalConsent" style={{cursor:"pointer",color:"rgba(255,255,255,.5)",fontSize:11}}>I understand this reading is for spiritual and personal growth purposes. I am 18 years of age or older (or have parental/guardian consent). I agree to the above terms.</label>
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <button onClick={submit} disabled={!legalConsent} style={{opacity:legalConsent?1:.4,cursor:legalConsent?"pointer":"not-allowed",...{}}}{{background:`linear-gradient(135deg,${tier.color}22,${tier.color}40)`,border:`1px solid ${tier.color}`,color:tier.color,fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:".2em",textTransform:"uppercase",padding:"15px 46px",borderRadius:4,cursor:"pointer",transition:"all .3s"}}
                onMouseEnter={e=>{e.target.style.background=`linear-gradient(135deg,${tier.color}44,${tier.color}66)`;e.target.style.color="#fff";}}
                onMouseLeave={e=>{e.target.style.background=`linear-gradient(135deg,${tier.color}22,${tier.color}40)`;e.target.style.color=tier.color;}}>
                Generate My Reading →
              </button>
              <p style={{marginTop:10,fontSize:11,color:"rgba(255,255,255,.2)",fontStyle:"italic"}}>Claude calculates all numbers, builds the Lo Shu grid, runs all 8 arrows, and generates your complete reading. ~30–45 seconds.</p>
            </div>
          </div>}

          {/* GENERATING */}
          {step==="gen"&&<div style={{textAlign:"center",paddingTop:50,animation:"fu .5s ease both",maxWidth:560,margin:"0 auto"}}>
            {/* Animated orbital rings */}
            <div style={{position:"relative",width:80,height:80,margin:"0 auto 32px"}}>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(200,169,110,.15)",borderTop:"1px solid #C8A96E",animation:"spin 2s linear infinite"}}/>
              <div style={{position:"absolute",inset:8,borderRadius:"50%",border:"1px solid rgba(155,126,212,.1)",borderTop:"1px solid #9B7ED4",animation:"spin 3.2s linear infinite reverse"}}/>
              <div style={{position:"absolute",inset:18,borderRadius:"50%",border:"1px solid rgba(126,196,212,.1)",borderTop:"1px solid #7EC4D4",animation:"spin 1.6s linear infinite"}}/>
              <div style={{position:"absolute",inset:"50%",transform:"translate(-50%,-50%)",width:10,height:10,borderRadius:"50%",background:"#C8A96E",boxShadow:"0 0 12px rgba(200,169,110,.6)"}}/>
            </div>
            <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:20,color:"#C8A96E",marginBottom:8}}>Reading the Stars…</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,.3)",marginBottom:28,fontStyle:"italic"}}>Streaming your complete cosmic blueprint in real-time</p>
            {/* Section progress */}
            <div style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(200,169,110,.12)",borderRadius:8,padding:"18px 20px",textAlign:"left",marginBottom:20}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:".18em",color:"rgba(200,169,110,.5)",textTransform:"uppercase",marginBottom:14}}>Currently Writing</div>
              {[
                {key:"cosmicSnapshot",label:"✦ Cosmic Snapshot"},
                {key:"numerology",label:"🔢 Core Numbers"},
                {key:"arrows",label:"⬆ Arrows of Pythagoras"},
                {key:"chineseZodiac",label:"☯ Chinese Zodiac"},
                {key:"astrology",label:"🌙 Astrology"},
                {key:"shadowWork",label:"🌑 Shadow Work"},
                {key:"meditation",label:"◎ Frequencies"},
                {key:"holisticSynthesis",label:"🌐 Holistic Synthesis"},
                {key:"returnToSelfGuide",label:"🗺 Return to Self"},
                {key:"soulMessage",label:"✉ Soul Message"},
              ].map((s,i)=>{
                const sectionLabels=Object.values(SECTION_LABELS);
                const currentIdx=sectionLabels.indexOf(streamSection);
                const myLabel=s.label;
                const myIdx=sectionLabels.indexOf(myLabel);
                const done=streamSection&&myIdx<currentIdx;
                const active=streamSection===myLabel||(!streamSection&&i===0);
                return(
                  <div key={s.key} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,opacity:done?0.9:active?1:0.25,transition:"opacity .4s"}}>
                    <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,
                      background:done?"#C8A96E":active?"rgba(200,169,110,.2)":"rgba(255,255,255,.04)",
                      border:done?"none":active?"1px solid #C8A96E":"1px solid rgba(255,255,255,.08)",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {done&&<span style={{fontSize:7,color:"#0d0d1a"}}>✓</span>}
                      {active&&<div style={{width:5,height:5,borderRadius:"50%",background:"#C8A96E",animation:"pulse 1s ease infinite"}}/>}
                    </div>
                    <span style={{fontSize:11,fontFamily:"'Cinzel',serif",color:done?"rgba(200,169,110,.8)":active?"#fff":"rgba(255,255,255,.3)"}}>{s.label}</span>
                    {active&&<div style={{marginLeft:"auto",display:"flex",gap:3}}>
                      {[0,1,2].map(d=><div key={d} style={{width:3,height:3,borderRadius:"50%",background:"#C8A96E",animation:`pulse 1.2s ease ${d*.2}s infinite`}}/>)}
                    </div>}
                  </div>
                );
              })}
            </div>
            {/* Character counter */}
            {streamChars>0&&<div style={{fontSize:10,color:"rgba(255,255,255,.2)",fontFamily:"'Cinzel',serif",letterSpacing:".1em"}}>
              {streamChars.toLocaleString()} WORDS OF WISDOM RECEIVED
            </div>}
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
