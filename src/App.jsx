import { useState } from "react";

// ─── CONFIG ───────────────────────────────────────────────
const CFG = {
  EMAILJS_SERVICE_ID:  "service_8wvh9nx",
  EMAILJS_TEMPLATE_ID: "template_hqle32c",
  EMAILJS_PUBLIC_KEY:  "dkHFmGFcO68nWPpAc",
  PRACTITIONER_EMAIL:  "sacredsoulmap@gmail.com",
};

// ─── NUMEROLOGY ENGINE ────────────────────────────────────
const LV = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
const VOWELS = new Set(["A","E","I","O","U"]);
const lv = c => LV[c.toUpperCase()] || 0;

function reduce(n, keepMaster = true) {
  if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n < 10) return n;
  const sum = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return reduce(sum, keepMaster);
}

function nameSum(name, filter) {
  return name.toUpperCase().replace(/[^A-Z]/g, "").split("").reduce((s, c) => {
    if (filter === "v" && !VOWELS.has(c)) return s;
    if (filter === "c" && VOWELS.has(c)) return s;
    return s + lv(c);
  }, 0);
}

function digitSum(str) {
  return String(str).split("").reduce((s, d) => s + Number(d), 0);
}

function calcNums(p) {
  const full = [p.legalFirst, p.legalMiddle, p.legalLast].filter(Boolean).join(" ");
  const m = Number(p.bMonth), d = Number(p.bDay), y = Number(p.bYear);
  const curY = new Date().getFullYear();

  const lifePath = reduce(reduce(m, false) + reduce(d, false) + reduce(digitSum(y), false));
  const expression = reduce(nameSum(full));
  const soulUrge = reduce(nameSum(full, "v"));
  const personality = reduce(nameSum(full, "c"));
  const birthday = reduce(d);
  const pyRaw = reduce(m) + reduce(d) + reduce(digitSum(curY));
  const personalYear = reduce(pyRaw);
  const maturity = reduce(lifePath + expression);

  // Pinnacles
  const mR = reduce(m, false), dR = reduce(d, false), yR = reduce(digitSum(y), false);
  const pin1 = reduce(mR + dR);
  const pin2 = reduce(dR + yR);
  const pin3 = reduce(pin1 + pin2);
  const pin4 = reduce(mR + yR);
  const lpR = reduce(lifePath, false);
  const p1end = 36 - lpR;
  const p2end = p1end + 9;
  const p3end = p2end + 9;

  const curAge = curY - y;
  let activePinnacle = pin4, activePinnacleNum = 4;
  if (curAge < p1end) { activePinnacle = pin1; activePinnacleNum = 1; }
  else if (curAge < p2end) { activePinnacle = pin2; activePinnacleNum = 2; }
  else if (curAge < p3end) { activePinnacle = pin3; activePinnacleNum = 3; }

  // Missing numbers
  const present = new Set(full.toUpperCase().replace(/[^A-Z]/g,"").split("").map(lv).filter(Boolean));
  const missing = [1,2,3,4,5,6,7,8,9].filter(n => !present.has(n));

  // Karmic debts
  const KARMIC = { 13: "13/4", 14: "14/5", 16: "16/7", 19: "19/1" };
  const karmicDebts = [nameSum(full), nameSum(full,"v"), nameSum(full,"c"),
    reduce(m,false)+reduce(d,false)+reduce(digitSum(y),false)]
    .filter(r => KARMIC[r]).map(r => KARMIC[r]);

  // Chinese zodiac
  const animals = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  const elements = ["Metal","Metal","Water","Water","Wood","Wood","Fire","Fire","Earth","Earth"];
  const polarity = ["Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin","Yang","Yin"];
  const ai = ((y - 4) % 12 + 12) % 12;
  const chinese = { animal: animals[ai], element: elements[y % 10], polarity: polarity[ai] };

  // Sun sign
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

  return {
    fullName: full, lifePath, expression, soulUrge, personality, birthday,
    personalYear, maturity, missing, karmicDebts,
    pinnacles: [pin1, pin2, pin3, pin4],
    pinnacleAges: [p1end, p2end, p3end],
    activePinnacle, activePinnacleNum,
    chinese, sunSign,
  };
}

// ─── PROMPT BUILDER ───────────────────────────────────────
function buildPrompt(p, tier) {
  const n = calcNums(p);
  const name = p.preferredName || p.legalFirst || "this soul";
  const isFull = tier !== "soul-spark";

  const lines = [
    "You are a master numerologist trained in David A. Philips Complete Book of Numerology, Western astrologer, Chinese zodiac scholar, and shadow work guide. Your readings are precise, personal, and transformative.",
    "",
    "CRITICAL: Return ONLY a raw JSON object. No markdown. No backticks. No explanation. No text before or after. Start your response with { and end with }.",
    "",
    "PERSON: " + name,
    "Full birth name: " + n.fullName,
    "DOB: " + p.bMonth + "/" + p.bDay + "/" + p.bYear,
    "Life Path: " + n.lifePath,
    "Expression: " + n.expression,
    "Soul Urge: " + n.soulUrge,
    "Personality: " + n.personality,
    "Birthday Number: " + n.birthday,
    "Personal Year: " + n.personalYear,
    "Maturity: " + n.maturity,
    "Missing Numbers: " + (n.missing.join(", ") || "None"),
    "Karmic Debts: " + (n.karmicDebts.join(", ") || "None"),
    "Active Pinnacle: " + n.activePinnacle + " (Pinnacle " + n.activePinnacleNum + ")",
    "Chinese Zodiac: " + n.chinese.element + " " + n.chinese.animal + " (" + n.chinese.polarity + ")",
    "Sun Sign: " + (p.natalSun || n.sunSign),
    "Moon Sign: " + (p.natalMoon || "Not provided"),
    "Rising: " + (p.natalRising || "Not provided"),
    "North Node: " + (p.natalNorthNode || "Not provided"),
    "Chiron: " + (p.natalChiron || "Not provided"),
    "Shadow themes: " + (p.shadowThemes || "Not specified"),
    "Goals: " + (p.goals || "Not specified"),
    "",
  ];

  if (tier === "soul-spark") {
    lines.push("Generate ONLY these JSON fields: cosmicSnapshot, lifePath, expression, soulUrge, personalYear, chineseZodiac, soulMessage");
    lines.push("");
    lines.push("JSON schema:");
    lines.push(JSON.stringify({
      cosmicSnapshot: "3-4 sentence poetic opening. Name the central theme of this chart. Reference " + name + " and Life Path " + n.lifePath + ".",
      lifePath: { number: n.lifePath, title: "evocative 3-word title", essence: "one-sentence core essence", reading: "5-6 deeply personal sentences on soul purpose, highest expressions, shadow side. Reference " + name + " directly.", shadow: "2-3 sentences on ego traps" },
      expression: { number: n.expression, title: "title", reading: "4-5 sentences on natural talents and destiny" },
      soulUrge: { number: n.soulUrge, title: "title", reading: "4-5 sentences on the deepest private desire" },
      personalYear: { number: n.personalYear, reading: "4-5 sentences on what Personal Year " + n.personalYear + " means for " + name + " specifically" },
      chineseZodiac: { sign: n.chinese.element + " " + n.chinese.animal, reading: "3-4 sentences on this specific sign and how it intersects with Life Path " + n.lifePath },
      soulMessage: "8-10 sentences written directly to " + name + ". Weave Life Path " + n.lifePath + ", Expression " + n.expression + ", Personal Year " + n.personalYear + ". Speak to the soul. End with one sentence of pure truth."
    }));
  } else {
    lines.push("Generate ALL of these JSON fields with full depth:");
    lines.push(JSON.stringify({
      cosmicSnapshot: "3-4 sentence poetic opening naming the central theme. Reference " + name + " and Life Path " + n.lifePath + ".",
      numerology: {
        lifePath: { number: n.lifePath, title: "title", essence: "one sentence", reading: "5-6 sentences", shadow: "3-4 sentences on ego traps", gifts: "2-3 sentences on unique gifts" },
        expression: { number: n.expression, title: "title", reading: "4-5 sentences on natural talents" },
        soulUrge: { number: n.soulUrge, title: "title", reading: "4-5 sentences on deepest desire" },
        personality: { number: n.personality, title: "title", reading: "3-4 sentences on first impression" },
        birthday: { number: n.birthday, title: "title", reading: "3 sentences on this special talent" },
        personalYear: { number: n.personalYear, reading: "5-6 sentences on Personal Year " + n.personalYear + " for " + name + " — their specific Active Pinnacle " + n.activePinnacle + " and what this year is asking" },
        maturity: { number: n.maturity, reading: "3 sentences on the energy emerging after age 40" },
        missing: { numbers: n.missing, reading: "3-4 sentences on karmic lessons of missing numbers: " + n.missing.join(", ") },
        karmicDebts: n.karmicDebts.length ? n.karmicDebts.join(", ") : null,
        karmicReading: n.karmicDebts.length ? "3-4 sentences on karmic debt " + n.karmicDebts.join(", ") + " — what was unlearned and how this life completes it" : null,
        pinnacles: "4-5 sentences weaving all four pinnacles " + n.pinnacles.join(", ") + " into a life arc. Which is active now? What does it ask?",
        activeTiming: "4-5 sentences on THIS exact moment — Pinnacle " + n.activePinnacle + ", Personal Year " + n.personalYear + ". What is converging right now for " + name + "?",
      },
      astrology: {
        sunReading: "4-5 sentences on " + (p.natalSun || n.sunSign) + " Sun and how it interplays with Life Path " + n.lifePath,
        moonReading: "4-5 sentences on " + (p.natalMoon || "the Moon placement") + " — emotional body, instinctive reactions, what the soul needs to feel safe",
        risingReading: "3-4 sentences on Rising sign " + (p.natalRising || "not provided") + " and Personality Number " + n.personality,
        northNodeReading: "3-4 sentences on North Node in " + (p.natalNorthNode || "not provided") + " — soul evolutionary direction cross-referenced with Life Path " + n.lifePath,
        chironReading: "3-4 sentences on Chiron in " + (p.natalChiron || "not provided") + " — the sacred wound and healer gift",
      },
      chineseZodiac: {
        sign: n.chinese.element + " " + n.chinese.animal + " (" + n.chinese.polarity + ")",
        reading: "4-5 sentences on this specific " + n.chinese.element + " " + n.chinese.animal,
        crossReference: "3-4 sentences on how this Chinese zodiac energy intersects with Life Path " + n.lifePath,
      },
      shadowWork: {
        coreWound: "4-5 sentences on the central shadow thread. Specific and precise. Connect to their numbers.",
        origin: "4-5 sentences on where this wound originated and why it was adaptive",
        theGold: "3-4 sentences on what becomes available when this shadow integrates",
        prompts: ["Journal prompt 1 specific to their data", "Prompt 2", "Prompt 3 — somatic", "Prompt 4 — relationship", "Prompt 5 — the hardest one they will want to skip"]
      },
      holisticSynthesis: {
        corePattern: "5-6 sentences — the ONE thread running through every layer of this chart. Not a list — a synthesis.",
        greatestGift: "3-4 sentences on the most exceptional gift in this chart",
        deepestChallenge: "3-4 sentences on the central tension between key energies",
        soulSignature: "2-3 sentences — the essence of " + name + " at soul level",
      },
      soulMessage: "8-10 sentences written directly to " + name + ". Weave Life Path " + n.lifePath + ", Expression " + n.expression + ", Personal Year " + n.personalYear + ", core pattern, deepest challenge, greatest gift. Speak to the soul. End with one sentence of pure truth."
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

  // Aggressively extract JSON from the response
  let clean = accumulated.trim();
  // Strip markdown code fences
  clean = clean.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  // Find first { and last }
  const first = clean.indexOf("{");
  const last = clean.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    clean = clean.slice(first, last + 1);
  }
  try {
    return JSON.parse(clean);
  } catch (e) {
    // Try to fix common issues - trailing commas
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
  if (N.lifePath) lines.push("LIFE PATH " + N.lifePath.number + " — " + (N.lifePath.title || "") + "\n" + (N.lifePath.reading || "") + "\n");
  if (N.expression) lines.push("EXPRESSION " + N.expression.number + "\n" + (N.expression.reading || "") + "\n");
  if (N.soulUrge) lines.push("SOUL URGE " + N.soulUrge.number + "\n" + (N.soulUrge.reading || "") + "\n");
  if (N.personalYear) lines.push("PERSONAL YEAR " + N.personalYear.number + "\n" + (N.personalYear.reading || "") + "\n");
  if (r.lifePath) lines.push("LIFE PATH " + r.lifePath.number + " — " + (r.lifePath.title || "") + "\n" + (r.lifePath.reading || "") + "\n");
  if (r.expression) lines.push("EXPRESSION " + r.expression.number + "\n" + (r.expression.reading || "") + "\n");
  if (r.soulUrge) lines.push("SOUL URGE " + r.soulUrge.number + "\n" + (r.soulUrge.reading || "") + "\n");
  if (r.personalYear) lines.push("PERSONAL YEAR " + r.personalYear.number + "\n" + (r.personalYear.reading || "") + "\n");
  if (r.chineseZodiac) lines.push("CHINESE ZODIAC — " + r.chineseZodiac.sign + "\n" + (r.chineseZodiac.reading || "") + "\n");
  if (r.astrology) {
    lines.push("ASTROLOGY\n");
    if (r.astrology.sunReading) lines.push(r.astrology.sunReading + "\n");
    if (r.astrology.moonReading) lines.push(r.astrology.moonReading + "\n");
  }
  if (r.shadowWork) {
    lines.push("SHADOW WORK\n" + (r.shadowWork.coreWound || "") + "\n");
    if (r.shadowWork.prompts) lines.push("Journal Prompts:\n" + r.shadowWork.prompts.map((p, i) => (i+1) + ". " + p).join("\n") + "\n");
  }
  if (r.holisticSynthesis) lines.push("HOLISTIC SYNTHESIS\n" + (r.holisticSynthesis.corePattern || "") + "\n");
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
    includes: ["Life Path · Expression · Soul Urge", "Personality · Birthday · Personal Year", "Chinese Zodiac", "Soul Message"] },
  { id: "cosmic-self", name: "Cosmic Self", price: "$97", color: "#9B7ED4", popular: true,
    desc: "Complete Philips system · Natal chart · Shadow work · Holistic synthesis",
    includes: ["Everything in Soul Spark", "All core + advanced numbers", "Pinnacles & Challenges", "Natal Astrology deep dive", "Shadow Work + 5 Prompts", "Holistic Synthesis"] },
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
const HRS = Array.from({length:24},(_,h)=>({v:String(h).padStart(2,"0"),l:h===0?"12:00 AM":h<12?h+":00 AM":h===12?"12:00 PM":(h-12)+":00 PM"}));
const MINS = ["00","05","10","15","20","25","30","35","40","45","50","55"].map(m=>({v:m,l:":"+m}));
const SHADOW_THEMES = ["Abandonment & fear of being left","Worthiness & not feeling enough","Control & trust issues","People-pleasing & losing self","Anger & unexpressed emotion","Scarcity & money wounds","Intimacy avoidance","Perfectionism & fear of failure","Visibility fear & playing small","Grief & unprocessed loss","Codependency & enmeshment","Identity confusion","Generational & ancestral patterns","Self-sabotage & repeating cycles","Shame & inner critic","Boundary issues"];
const MED_FOCUS = [{id:"inner-child",label:"Inner Child Healing",icon:"🌱"},{id:"shadow",label:"Shadow Integration",icon:"🌑"},{id:"nervous",label:"Nervous System Regulation",icon:"🌊"},{id:"grief",label:"Grief & Release",icon:"💧"},{id:"worth",label:"Self-Worth",icon:"☀️"},{id:"abundance",label:"Abundance",icon:"✨"},{id:"purpose",label:"Purpose & Direction",icon:"🧭"},{id:"relationships",label:"Relationship Healing",icon:"💞"},{id:"ancestral",label:"Ancestral Clearing",icon:"🌿"},{id:"intuition",label:"Intuition Development",icon:"🔮"},{id:"somatic",label:"Somatic & Body",icon:"🌺"},{id:"sleep",label:"Sleep & Restoration",icon:"🌙"}];
const SOLFEGGIO = ["174 Hz — Foundation & Grounding","285 Hz — Cellular Restoration","396 Hz — Release Guilt & Fear","417 Hz — Facilitate Change","432 Hz — Natural Harmony","528 Hz — Love & DNA Repair","639 Hz — Heal Relationships","741 Hz — Intuition & Expression","852 Hz — Third Eye Opening","963 Hz — Crown Activation"];
const BINAURAL = ["Delta (0.5–4 Hz) — Deep Healing & Sleep","Theta (4–8 Hz) — Shadow Work & Inner Child","Alpha (8–14 Hz) — Relaxed Daily Meditation","Beta (14–30 Hz) — Active Focus & Processing","Gamma (30–100 Hz) — Higher Consciousness"];
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
  pronouns:"", preferredName:"", legalFirst:"", legalMiddle:"", legalLast:"",
  currentFirst:"", currentLast:"",
  bMonth:"", bDay:"", bYear:"", timeKnown:"", bHour:"", bMinute:"",
  bCity:"", bState:"", bCountry:"",
  natalSun:"", natalMoon:"", natalRising:"", natalMercury:"", natalVenus:"", natalMars:"",
  natalJupiter:"", natalSaturn:"", natalChiron:"", natalNorthNode:"", natalSouthNode:"",
  natalHouse1:"", natalHouse4:"", natalHouse7:"", natalHouse10:"", natalAspects:"", natalSource:"",
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

function Sec({ icon, title, color="#C8A96E", children }) {
  return <div style={{ background:"rgba(255,255,255,.015)", border:"1px solid "+color+"18", borderRadius:9, padding:"20px 20px 16px", marginBottom:18, position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,"+color+",transparent)" }} />
    <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:".15em", textTransform:"uppercase", color }}>{title}</h3>
    </div>
    {children}
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

    {(LP || EX || SU) && <Sec icon="🔢" title="Numerology" color="#C8A96E">
      {LP && <Card title="Life Path" number={LP.number} subtitle={LP.title} text={LP.reading} shadow={LP.shadow} gifts={LP.gifts} color="#C8A96E" />}
      {EX && <Card title="Expression" number={EX.number} subtitle={EX.title} text={EX.reading} color="#C8A96E" />}
      {SU && <Card title="Soul Urge" number={SU.number} subtitle={SU.title} text={SU.reading} color="#C8A96E" />}
      {PE && <Card title="Personality" number={PE.number} subtitle={PE.title} text={PE.reading} color="#7EC4D4" />}
      {BD && <Card title="Birthday Number" number={BD.number} subtitle={BD.title} text={BD.reading} color="#7EC4D4" />}
      {PY && <Card title="Personal Year" number={PY.number} text={PY.reading} color="#9B7ED4" />}
      {N.maturity && <Card title="Maturity Number" number={N.maturity.number} text={N.maturity.reading} color="#7EC4D4" />}
      {N.missing && N.missing.reading && <div style={{ padding:"11px 14px", background:"rgba(155,126,212,.06)", border:"1px solid rgba(155,126,212,.18)", borderRadius:6, marginBottom:9 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#9B7ED4", marginBottom:5 }}>Missing Numbers — {(N.missing.numbers || []).join(", ") || "None"}</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.85 }}>{N.missing.reading}</p>
      </div>}
      {N.karmicReading && N.karmicReading !== "null" && <div style={{ padding:"11px 14px", background:"rgba(212,126,155,.06)", border:"1px solid rgba(212,126,155,.2)", borderRadius:6, marginBottom:9 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#D47E9B", marginBottom:5 }}>⚠ Karmic Debt</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.85 }}>{N.karmicReading}</p>
      </div>}
      {N.pinnacles && <div style={{ padding:"11px 14px", background:"rgba(200,169,110,.04)", border:"1px solid rgba(200,169,110,.1)", borderRadius:6, marginBottom:9 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#C8A96E", marginBottom:5 }}>Pinnacles</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.85 }}>{N.pinnacles}</p>
      </div>}
      {N.activeTiming && <div style={{ padding:"11px 14px", background:"rgba(126,196,212,.04)", border:"1px solid rgba(126,196,212,.12)", borderRadius:6, marginBottom:9 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#7EC4D4", marginBottom:5 }}>Your Timing Right Now</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.62)", lineHeight:1.85 }}>{N.activeTiming}</p>
      </div>}
    </Sec>}

    {r.astrology && <Sec icon="🌙" title="Astrology" color="#7EC4D4">
      {["sunReading","moonReading","risingReading","northNodeReading","chironReading"].map(k => r.astrology[k] && (
        <p key={k} style={{ fontSize:13, color:"rgba(255,255,255,.68)", lineHeight:1.88, marginBottom:12 }}>{r.astrology[k]}</p>
      ))}
    </Sec>}

    {(r.chineseZodiac) && <Sec icon="🐉" title={"Chinese Zodiac — " + (r.chineseZodiac.sign || "")} color="#D47E9B">
      <p style={{ fontSize:13, color:"rgba(255,255,255,.68)", lineHeight:1.88, marginBottom:10 }}>{r.chineseZodiac.reading}</p>
      {r.chineseZodiac.crossReference && <p style={{ fontSize:13, color:"rgba(255,255,255,.68)", lineHeight:1.88 }}>{r.chineseZodiac.crossReference}</p>}
    </Sec>}

    {r.shadowWork && <Sec icon="🌑" title="Shadow Work" color="#9B7ED4">
      {[["coreWound","Core Wound"],["origin","Origin"],["theGold","The Gold"]].map(([k,label]) => r.shadowWork[k] && (
        <div key={k} style={{ marginBottom:14 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#9B7ED4", marginBottom:5 }}>{label}</div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.65)", lineHeight:1.88 }}>{r.shadowWork[k]}</p>
        </div>
      ))}
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

    {r.holisticSynthesis && <Sec icon="🌐" title="Holistic Synthesis" color="#C8A96E">
      {r.holisticSynthesis.corePattern && <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#C8A96E", textTransform:"uppercase", marginBottom:6 }}>Core Pattern</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.88 }}>{r.holisticSynthesis.corePattern}</p>
      </div>}
      {r.holisticSynthesis.greatestGift && <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(200,169,110,.06)", borderRadius:6, border:"1px solid rgba(200,169,110,.15)" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#C8A96E", textTransform:"uppercase", marginBottom:6 }}>✦ Greatest Gift</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.88 }}>{r.holisticSynthesis.greatestGift}</p>
      </div>}
      {r.holisticSynthesis.deepestChallenge && <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(155,126,212,.06)", borderRadius:6, border:"1px solid rgba(155,126,212,.15)" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".14em", color:"#9B7ED4", textTransform:"uppercase", marginBottom:6 }}>◌ Deepest Challenge</div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.88 }}>{r.holisticSynthesis.deepestChallenge}</p>
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
    const msgs = ["Calculating your numbers…","Building your chart…","Reading the planets…","Weaving your reading…"];
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
    try { await sendEmail(email, name, tier?.name || "Cosmic", reading); setEmailSt("sent"); }
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
        <p style={{ color:"rgba(255,255,255,.35)", maxWidth:560, margin:"0 auto", fontSize:12, lineHeight:2, fontStyle:"italic" }}>Complete Numerology · Natal Chart · Chinese Zodiac · Shadow Work</p>
      </div>

      <div style={{ maxWidth:880, margin:"0 auto" }}>
        {err && <div style={{ background:"rgba(192,57,43,.1)", border:"1px solid rgba(192,57,43,.3)", borderRadius:7, padding:"11px 15px", marginBottom:18, fontSize:12, color:"rgba(231,76,60,.9)" }}>⚠️ {err}</div>}

        {/* TIER SELECTION */}
        {step === "tier" && <div style={{ animation:"fu .6s ease both" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:14, letterSpacing:".18em", color:"#C8A96E", textTransform:"uppercase", marginBottom:7 }}>Choose Your Level of Depth</h2>
            <p style={{ color:"rgba(255,255,255,.3)", fontSize:12 }}>Fill in the form → Claude generates your complete reading → delivered to your inbox.</p>
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

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <TI l="Preferred Name" v={person.preferredName} s={v => upd({preferredName:v})} p="What you go by" />
              <TS l="Pronouns" v={person.pronouns} s={v => upd({pronouns:v})} opts={[{v:"she/her",l:"She / Her"},{v:"he/him",l:"He / Him"},{v:"they/them",l:"They / Them"}]} />
            </div>

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

            <GD label="Time & Place of Birth — Optional" />
            <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:12, fontStyle:"italic" }}>Birth time calculates your Rising sign. If unknown, leave blank.</div>
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
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <TI l="Current First Name" v={person.currentFirst} s={v => upd({currentFirst:v})} p="If different from birth" />
                <TI l="Current Last Name" v={person.currentLast} s={v => upd({currentLast:v})} p="Married / chosen name" />
              </div>

              <GD label="Time and Place of Birth — Optional" />
              <TS l="Birth time known?" v={person.timeKnown} s={v => upd({timeKnown:v})} opts={[{v:"exact",l:"Yes — exact"},{v:"approximate",l:"Approximate"},{v:"unknown",l:"Don't know"}]} />
              {(person.timeKnown === "exact" || person.timeKnown === "approximate") && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <TS l="Hour" v={person.bHour} s={v => upd({bHour:v})} opts={HRS} />
                <TS l="Minute" v={person.bMinute} s={v => upd({bMinute:v})} opts={MINS} />
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10}}>
                <TI l="City of Birth" v={person.bCity} s={v => upd({bCity:v})} p="e.g. Dallas" />
                <TI l="State" v={person.bState} s={v => upd({bState:v})} p="TX" />
                <TI l="Country" v={person.bCountry} s={v => upd({bCountry:v})} p="USA" />
              </div>

              <GD label="Natal Chart Placements — Optional but Powerful" />
              <div style={{background:"rgba(126,196,212,.04)",border:"1px solid rgba(126,196,212,.12)",borderRadius:4,padding:"9px 13px",marginBottom:12,fontSize:11,color:"rgba(255,255,255,.42)",fontStyle:"italic",lineHeight:1.8}}>
                🌙 Get your free chart at <strong style={{color:"rgba(126,196,212,.7)"}}>astro.com</strong> → Extended Chart Selection. More placements = deeper reading.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Sun Sign" v={person.natalSun} s={v => upd({natalSun:v})} opts={ZODIAC} />
                <TS l="Moon Sign" v={person.natalMoon} s={v => upd({natalMoon:v})} opts={ZODIAC} />
                <TS l="Rising / Ascendant" v={person.natalRising} s={v => upd({natalRising:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Mercury" v={person.natalMercury} s={v => upd({natalMercury:v})} opts={ZODIAC} />
                <TS l="Venus" v={person.natalVenus} s={v => upd({natalVenus:v})} opts={ZODIAC} />
                <TS l="Mars" v={person.natalMars} s={v => upd({natalMars:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <TS l="Jupiter" v={person.natalJupiter} s={v => upd({natalJupiter:v})} opts={ZODIAC} />
                <TS l="Saturn" v={person.natalSaturn} s={v => upd({natalSaturn:v})} opts={ZODIAC} />
                <TS l="Chiron" v={person.natalChiron} s={v => upd({natalChiron:v})} opts={ZODIAC} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <TS l="North Node" v={person.natalNorthNode} s={v => upd({natalNorthNode:v})} opts={ZODIAC} />
                <TS l="South Node" v={person.natalSouthNode} s={v => upd({natalSouthNode:v})} opts={ZODIAC} />
              </div>
              <GD label="Key House Cusps — Optional" />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
                <TS l="1st House (Self)" v={person.natalHouse1} s={v => upd({natalHouse1:v})} opts={ZODIAC} />
                <TS l="4th House (Home)" v={person.natalHouse4} s={v => upd({natalHouse4:v})} opts={ZODIAC} />
                <TS l="7th House (Partnership)" v={person.natalHouse7} s={v => upd({natalHouse7:v})} opts={ZODIAC} />
                <TS l="10th House (Career)" v={person.natalHouse10} s={v => upd({natalHouse10:v})} opts={ZODIAC} />
              </div>
              <TTA l="Major Aspects or Patterns — Optional" v={person.natalAspects} s={v => upd({natalAspects:v})} p="e.g. Sun conjunct Saturn, T-square in cardinal signs, stellium in 8th house…" rows={2} />

              <GD label="Shadow Work" />
              <p style={{fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:12,fontStyle:"italic",lineHeight:1.7}}>🌑 The shadow is not what is wrong with you — it is what has been unwitnessed. These selections directly shape the shadow work section of your reading.</p>
              <MP label="Shadow themes active in your life" items={SHADOW_THEMES} selected={person.shadowThemes} onChange={v => upd({shadowThemes:v})} color="#9B7ED4" />
              <TTA l="Recurring patterns or cycles" v={person.recurringPatterns} s={v => upd({recurringPatterns:v})} p="e.g. always attracting unavailable people, self-sabotage right before success…" rows={3} />
              <TTA l="Earliest wound that still echoes — Optional" v={person.childhoodWound} s={v => upd({childhoodWound:v})} p="A few words is enough — only what feels safe" rows={2} />
              <div style={{marginBottom:16}}>
                <Lbl c="Readiness to look at harder material (1–10)" />
                <p style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:8,fontStyle:"italic"}}>Calibrates depth and tone of the shadow section</p>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="range" min={1} max={10} value={person.shadowDepth||5} onChange={e => upd({shadowDepth:Number(e.target.value)})} style={{flex:1,accentColor:"#9B7ED4"}} />
                  <div style={{minWidth:32,height:32,borderRadius:"50%",background:"rgba(155,126,212,.2)",border:"1px solid rgba(155,126,212,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",color:"#9B7ED4",fontSize:13}}>{person.shadowDepth||5}</div>
                </div>
              </div>
              <TS l="Shadow work goal" v={person.shadowGoal} s={v => upd({shadowGoal:v})} opts={[{v:"patterns",l:"Understand why I keep repeating patterns"},{v:"release",l:"Release what no longer serves"},{v:"child",l:"Heal the inner child"},{v:"reclaim",l:"Reclaim disowned parts of myself"},{v:"integrate",l:"Fully integrate light and shadow"},{v:"beginning",l:"Just beginning — not sure yet"}]} />

              <GD label="Meditation and Sound Healing" />
              <MP label="Meditation focus areas" items={MED_FOCUS} selected={person.meditationFocus} onChange={v => upd({meditationFocus:v})} color="#7EC4D4" />
              <TS l="Experience level" v={person.meditationExp} s={v => upd({meditationExp:v})} opts={[{v:"none",l:"None — completely new"},{v:"curious",l:"Tried a few times"},{v:"beginner",l:"Occasional practice"},{v:"intermediate",l:"Regular practice"},{v:"advanced",l:"Deep daily practice"}]} />
              <TTA l="Current practice — Optional" v={person.currentPractice} s={v => upd({currentPractice:v})} p="Journaling, breathwork, yoga, prayer, cold plunge, ritual…" rows={2} />

              <GD label="Chakra Focus" />
              <p style={{fontSize:11,color:"rgba(255,255,255,.32)",marginBottom:10,fontStyle:"italic"}}>Select centers that feel blocked, overactive, or calling for attention</p>
              <ChakraPicker selected={person.chakraFocus} onChange={v => upd({chakraFocus:v})} />

              <GD label="Sound Healing Frequencies" />
              <MP label="Solfeggio frequencies you are drawn to" items={SOLFEGGIO} selected={person.freqInterest} onChange={v => upd({freqInterest:v})} color="#C8A96E" cols={1} />
              <MP label="Binaural brainwave states" items={BINAURAL} selected={person.binauralInterest} onChange={v => upd({binauralInterest:v})} color="#D47E9B" cols={1} />
            </>}

            <GD label="Intentions" />
            <TTA l="What are you most hoping to understand or shift?" v={person.goals} s={v => upd({goals:v})} p="Share anything — patterns, questions, what feels stuck, what you're moving toward…" rows={4} />
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
            <button onClick={submit} disabled={!legalConsent} style={{ opacity:legalConsent?1:.4, cursor:legalConsent?"pointer":"not-allowed", background:"linear-gradient(135deg,"+tier.color+"22,"+tier.color+"40)", border:"1px solid "+tier.color, color:tier.color, fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:".2em", textTransform:"uppercase", padding:"15px 46px", borderRadius:4, transition:"all .3s" }}>
              Generate My Reading →
            </button>
            <p style={{ marginTop:10, fontSize:11, color:"rgba(255,255,255,.2)", fontStyle:"italic" }}>~30–45 seconds to generate your complete reading.</p>
          </div>
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
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:".2em", color:tier?.color, textTransform:"uppercase", marginBottom:3 }}>Your Reading</div>
              <h2 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:19, color:"#fff" }}>{tier?.name} — {person.preferredName || person.legalFirst || "Your Reading"}</h2>
            </div>
            <button onClick={reset} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.38)", padding:"7px 13px", borderRadius:4, cursor:"pointer", fontSize:11, fontFamily:"'Cinzel',serif" }}>← New Reading</button>
          </div>
          <ReadingView reading={reading} name={person.preferredName || person.legalFirst || "Friend"} onEmail={sendMail} emailSt={emailSt} />
        </div>}

      </div>
    </div>
  </>;
}
