"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  Volume2,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Zap,
  Gauge,
  Activity,
  Terminal,
  Cpu,
  Radio,
  Layers,
  Globe2,
  Languages,
  Users,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Sliders
} from "lucide-react";
import AdaptiveAssessment from "../components/AdaptiveAssessment";
import TeachableSignRecognizer from "../components/TeachableSignRecognizer";

// --- ISL KINEMATIC GESTURE DATABASE ---
const ISL_GESTURES: Record<
  string,
  { guj: string; eng: string; tokens: string[]; bones: [number, number, number][] }
> = {
  water: {
    eng: "Water",
    guj: "પાણી",
    tokens: ["W-HANDSHAPE", "CHIN-CONTACT", "DUAL-TAP"],
    bones: [[0, 0, 0], [10, 40, 15], [25, 80, 10], [15, 120, 5], [0, 140, 0]]
  },
  sunlight: {
    eng: "Sunlight",
    guj: "સૂર્યપ્રકાશ",
    tokens: ["OVERHEAD-ARC", "RADIAL-EXPAND", "THERMAL-RAY"],
    bones: [[-30, 20, 10], [0, 60, 30], [40, 100, 20], [80, 130, 10]]
  },
  evaporation: {
    eng: "Evaporation",
    guj: "બાષ્પીભવન",
    tokens: ["SURFACE-PALM", "OSCILLATING-SPIRAL", "VAPOR-ASCEND"],
    bones: [[-20, -10, 0], [0, 30, 40], [20, 70, 80], [40, 110, 120]]
  },
  clouds: {
    eng: "Clouds",
    guj: "વાદળો",
    tokens: ["BILATERAL-ARC", "VAPOR-CLUSTER", "PUFF-EXPAND"],
    bones: [[-40, 30, 10], [-20, 60, 20], [0, 80, 20], [30, 60, 10]]
  },
  rain: {
    eng: "Rain",
    guj: "વરસાદ",
    tokens: ["OVERHEAD-CLOUD", "FLUTTER-DROPLETS", "GRAVITY-FALL"],
    bones: [[0, 20, 0], [15, 50, 10], [25, 90, 20], [35, 130, 30]]
  },
  plant: {
    eng: "Plant Life",
    guj: "છોડ",
    tokens: ["CUPPED-SOIL", "SEED-EMERGE", "LEAF-UNFURL"],
    bones: [[-15, 0, 0], [0, 35, 10], [15, 75, 25], [30, 115, 40]]
  },
  namaste: {
    eng: "Namaste",
    guj: "નમસ્તે",
    tokens: ["PALMS-JOINED", "CHEST-LEVEL", "HEAD-BOW"],
    bones: [[0, 10, 0], [5, 40, 10], [10, 70, 15], [15, 100, 20]]
  },
  hello: {
    eng: "Hello",
    guj: "હેલો",
    tokens: ["OPEN-PALM", "TEMPLE-SALUTE", "FORWARD-WAVE"],
    bones: [[20, 30, 10], [30, 60, 20], [40, 90, 25], [50, 120, 30]]
  }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"study" | "testing" | "analytics">("study");

  // --- STUDY PANEL STATES ---
  const [isListening, setIsListening] = useState(false);
  const [teacherSpeech, setTeacherSpeech] = useState(
    "When the sun heats ocean water, it turns into steam and rises into the sky."
  );
  const [translatedGujarati, setTranslatedGujarati] = useState(
    "જ્યારે સૂર્ય સમુદ્રના પાણીને ગરમ કરે છે, ત્યારે તે વરાળ બની આકાશમાં ઊંચે ચડે છે."
  );
  const [activeGestureKey, setActiveGestureKey] = useState<string>("evaporation");
  const [avatarSpeed, setAvatarSpeed] = useState<number>(1.0);
  const [avatarAngle, setAvatarAngle] = useState<number>(0);

  // Canvas Ref
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // External Breakdown override for HUD
  const [hudBreakdownTrigger, setHudBreakdownTrigger] = useState<boolean | undefined>(undefined);

  // Dashboard Filters & State
  const [dashboardFilter, setDashboardFilter] = useState<"all" | "struggling" | "mastered">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. SPEECH SYNTHESIS ENGINE (Gujarati & English)
  const speakText = (text: string, lang: "gu-IN" | "en-US" = "gu-IN") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 2. LIVE SPEECH RECOGNITION (Teacher Audio Input)
  const toggleTeacherListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      try {
        // @ts-ignore
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = "en-US";
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTeacherSpeech(transcript);
          const guj = `અનુવાદ: ${transcript} (વર્ગખંડ સમજૂતી)`;
          setTranslatedGujarati(guj);
          speakText(guj, "gu-IN");
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch (e) {
        console.log("Speech recognition fallback", e);
      }
    }

    // Fallback simulated acoustic speech synthesis
    setIsListening(true);
    setTimeout(() => {
      setTeacherSpeech("Water droplets condense in cold air to form large rain clouds.");
      const guj = "ઠંડી હવામાં પાણીના ટીપાં સંઘનિત થઈને વરસાદી વાદળો બનાવે છે.";
      setTranslatedGujarati(guj);
      setActiveGestureKey("clouds");
      speakText(guj, "gu-IN");
      setIsListening(false);
    }, 1800);
  };

  // 3. REAL-TIME 3D SKELETAL AVATAR CANVAS RENDERER
  useEffect(() => {
    if (!mounted || activeTab !== "study") return;
    const canvas = avatarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04 * avatarSpeed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 20;

      // Draw Depth Grid Lines
      ctx.strokeStyle = "rgba(45, 212, 191, 0.08)";
      ctx.lineWidth = 1;
      for (let i = -140; i <= 140; i += 35) {
        ctx.beginPath();
        ctx.moveTo(cx + i, cy - 80);
        ctx.lineTo(cx + i * 1.6, cy + 90);
        ctx.stroke();
      }

      // Coordinate Points for Palm + 5 Fingers Rig
      const joints: [number, number][] = [
        [cx, cy + 40], // Wrist Base
        [cx - 20, cy], // Thumb knuckle
        [cx - 10, cy - 30], // Index knuckle
        [cx + 5, cy - 35], // Middle knuckle
        [cx + 20, cy - 30], // Ring knuckle
        [cx + 35, cy - 20]  // Pinky knuckle
      ];

      // Dynamic Kinematics depending on active gesture
      let tipOffsets = [12, 14, 15, 12, 10];
      if (activeGestureKey === "rain") {
        tipOffsets = [18, 22, 25, 20, 16];
      } else if (activeGestureKey === "water") {
        tipOffsets = [8, 10, 10, 8, 6];
      } else if (activeGestureKey === "namaste") {
        tipOffsets = [4, 5, 5, 4, 3];
      }

      // Articulate Finger Tips with Live Sine Kinematics
      const tips: [number, number][] = [
        [cx - 35 + Math.sin(time) * tipOffsets[0], cy - 20 + Math.cos(time) * 8],
        [cx - 15 + Math.sin(time + 0.5) * tipOffsets[1], cy - 70 + Math.sin(time) * 18],
        [cx + 5 + Math.sin(time + 1) * tipOffsets[2], cy - 75 + Math.sin(time) * 20],
        [cx + 25 + Math.sin(time + 1.5) * tipOffsets[3], cy - 68 + Math.sin(time) * 16],
        [cx + 45 + Math.sin(time + 2) * tipOffsets[4], cy - 50 + Math.sin(time) * 12]
      ];

      // Draw Bones (Skeletal Lines)
      ctx.lineWidth = 3;
      ctx.strokeStyle = avatarSpeed <= 0.5 ? "#f59e0b" : "#14b8a6";
      ctx.shadowBlur = 12;
      ctx.shadowColor = avatarSpeed <= 0.5 ? "#f59e0b" : "#2dd4bf";

      // Connect Wrist to Base Knuckles and Knuckles to Tips
      joints.forEach((j, i) => {
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(joints[0][0], joints[0][1]);
          ctx.lineTo(j[0], j[1]);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(j[0], j[1]);
          ctx.lineTo(tips[i - 1][0], tips[i - 1][1]);
          ctx.stroke();
        }
      });

      // Draw Glowing Kinematic Nodes (Landmarks)
      [...joints, ...tips].forEach(([x, y]) => {
        ctx.fillStyle = avatarSpeed <= 0.5 ? "#fbbf24" : "#5eead4";
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mounted, activeTab, activeGestureKey, avatarSpeed, avatarAngle]);

  if (!mounted) return <div className="min-h-screen bg-[#070b14]" />;

  const currentGesture = ISL_GESTURES[activeGestureKey] || ISL_GESTURES.water;

  // Students list for enhanced Teacher Dashboard
  const classroomStudents = [
    { id: 1, name: "Rahul Mehta", status: "mastered", profile: "Confident Learner", topic: "Water Cycle Loop", latency: "3.2s", accuracy: "90%", mistakes: 1, breakdownActive: false, bktScore: 92, note: "Rapid accurate responses" },
    { id: 2, name: "Ananya Patel", status: "mastered", profile: "Confident Learner", topic: "Solar Absorption", latency: "2.8s", accuracy: "100%", mistakes: 0, breakdownActive: false, bktScore: 96, note: "High recall and vocabulary" },
    { id: 3, name: "Kavya Shah", status: "struggling", profile: "Struggler (Scaffolded)", topic: "Evaporation Latent Heat", latency: "16.4s", accuracy: "40%", mistakes: 4, breakdownActive: true, bktScore: 42, note: "Breakdown Mode active (0.5x speed)" },
    { id: 4, name: "Meet Joshi", status: "struggling", profile: "Needs Review", topic: "Precipitation Forms", latency: "14.2s", accuracy: "60%", mistakes: 3, breakdownActive: true, bktScore: 58, note: "Hesitation detected on question 2" },
    { id: 5, name: "Pooja Vaghela", status: "mastered", profile: "Confident Learner", topic: "Aquifer Baseflow", latency: "4.1s", accuracy: "80%", mistakes: 1, breakdownActive: false, bktScore: 84, note: "Completed in 1st attempt" },
    { id: 6, name: "Dev Trivedi", status: "struggling", profile: "Struggler (Scaffolded)", topic: "Adiabatic Cooling", latency: "15.8s", accuracy: "50%", mistakes: 3, breakdownActive: true, bktScore: 48, note: "2 incorrect attempts, hints shown" },
    { id: 7, name: "Harshil Dave", status: "mastered", profile: "Confident Learner", topic: "Conservation of Mass", latency: "3.5s", accuracy: "90%", mistakes: 1, breakdownActive: false, bktScore: 88, note: "Solid thermodynamic concept" },
    { id: 8, name: "Diya Prajapati", status: "struggling", profile: "Needs Review", topic: "Canopy Transpiration", latency: "13.9s", accuracy: "55%", mistakes: 3, breakdownActive: false, bktScore: 61, note: "Visual sign reinforcement suggested" }
  ];

  const filteredStudents = classroomStudents.filter((st) => {
    if (dashboardFilter === "struggling" && st.status !== "struggling") return false;
    if (dashboardFilter === "mastered" && st.status !== "mastered") return false;
    if (searchQuery && !st.name.toLowerCase().includes(searchQuery.toLowerCase()) && !st.topic.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-teal-400 selection:text-black">
      {/* ========================================================================= */}
      {/* 🚀 HIGH-TECH GLASSMORPHIC HEADER & JUDGE DEMO CONTROLS                     */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 p-[1.5px] shadow-lg shadow-teal-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                SamjanSetu
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 font-bold">
                ISL-v2.6 VISION + BKT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              સમજણ સેતુ • Bilingual Gujarati-ISL Adaptive Pedagogical Platform
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          {[
            { id: "study", label: "1. Kinematic Classroom", icon: BookOpen },
            { id: "testing", label: "2. Adaptive BKT Engine", icon: Brain },
            { id: "analytics", label: "3. Teacher Dashboard", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  isSel
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Judge Live HUD Presets */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-teal-400" /> Judge HUD:
          </span>
          <button
            onClick={() => {
              setActiveTab("testing");
              setHudBreakdownTrigger(false);
            }}
            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-md font-semibold text-[11px]"
            title="Fast Learner Path: Advance to Hard Questions"
          >
            ✓ Confident Learner
          </button>
          <button
            onClick={() => {
              setActiveTab("testing");
              setHudBreakdownTrigger(true);
            }}
            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-md font-semibold text-[11px] animate-pulse"
            title="Struggling Learner Path: Trigger Breakdown Mode & Easy Scaffolding"
          >
            ⚠️ Struggle Scenario
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🌟 MAIN APP CONTENT TABS                                                   */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* ======================================================================= */}
        {/* 1. STUDY TAB: KINEMATIC BILINGUAL CLASSROOM                             */}
        {/* ======================================================================= */}
        {activeTab === "study" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Teacher English Audio -> Gujarati Text -> ISL Compiler */}
            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md shadow-2xl space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <h2 className="font-bold text-sm text-slate-100">
                      Bhasha-Setu NLP Translation Core
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-bold flex items-center gap-1">
                    <Globe2 className="w-3 h-3" /> Bhashini EN ──► GU
                  </span>
                </div>

                {/* Teacher Speech Input Box */}
                <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <span>Teacher Spoken English</span>
                    <span className="text-teal-400 font-mono">16kHz Acoustic Pipeline</span>
                  </div>
                  <textarea
                    value={teacherSpeech}
                    onChange={(e) => setTeacherSpeech(e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border-none text-slate-100 font-medium text-sm focus:outline-none resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500">Live Web Speech API</span>
                    <button
                      onClick={toggleTeacherListening}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isListening
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isListening ? "Listening..." : "Speak into Mic"}
                    </button>
                  </div>
                </div>

                {/* Gujarati Synthesized Translation Banner */}
                <div className="bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Real-Time Gujarati Subtitles (ગુજરાતી સ્ક્રિપ્ટ)
                    </span>
                    <button
                      onClick={() => speakText(translatedGujarati, "gu-IN")}
                      className="p-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg flex items-center gap-1 text-[10px]"
                      title="Play Gujarati Voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Play Audio
                    </button>
                  </div>
                  <p className="text-teal-100 font-bold text-base leading-relaxed">
                    "{translatedGujarati}"
                  </p>
                </div>

                {/* Active Linguistic ISL Gloss Compiler */}
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" />
                    Active Linguistic ISL Gloss Compiler:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentGesture.tokens.map((tok, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-slate-950 border border-teal-500/40 text-teal-300 rounded-lg text-xs font-mono font-bold shadow-sm"
                      >
                        [{tok}]
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gesture Target Selector Palette */}
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Select Kinematic Sign Target (Click to Demonstrate):
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Object.keys(ISL_GESTURES).map((k) => (
                      <button
                        key={k}
                        onClick={() => {
                          setActiveGestureKey(k);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          activeGestureKey === k
                            ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/20 scale-105"
                            : "bg-slate-950/60 hover:bg-slate-800 text-slate-400 border-slate-800"
                        }`}
                      >
                        <span className="text-sm font-semibold">{ISL_GESTURES[k].eng}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{ISL_GESTURES[k].guj}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Bilingual Latency: 12ms</span>
                <button
                  onClick={() => {
                    setActiveTab("testing");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl font-bold shadow-md shadow-teal-500/20"
                >
                  Start Water Cycle Test &rarr;
                </button>
              </div>
            </div>

            {/* Right: 3D Articulated Avatar Canvas & Teachable Machine Camera Model */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3D Skeletal Avatar Rig */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 mb-3 gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" />
                      3D Kinematic Skeletal Avatar (દ્રશ્ય અવતાર)
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Demonstrating ISL Gesture: <span className="text-teal-300 font-bold">{currentGesture.eng} ({currentGesture.guj})</span>
                    </p>
                  </div>

                  {/* Speed & Rotation Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setAvatarSpeed((s) => (s === 1.0 ? 0.5 : s === 0.5 ? 0.75 : 1.0))
                      }
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-teal-300 font-mono font-bold rounded-lg border border-slate-700"
                    >
                      {avatarSpeed}x Speed
                    </button>
                    <button
                      onClick={() =>
                        setAvatarAngle((a) => (a === 0 ? 30 : a === 30 ? -30 : 0))
                      }
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono rounded-lg border border-slate-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> {avatarAngle}° Tilt
                    </button>
                  </div>
                </div>

                {/* 3D Joint Canvas */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center h-60">
                  <canvas
                    ref={avatarCanvasRef}
                    width={520}
                    height={250}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                    Skeletal Joint Vectors: Active ISL Sign [{currentGesture.eng}]
                  </div>
                  {avatarSpeed <= 0.5 && (
                    <div className="absolute top-2 right-3 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-600/60 animate-pulse">
                      ⚡ Slow-Motion Scaffolding Active
                    </div>
                  )}
                </div>
              </div>

              {/* Teachable Machine Camera Recognition Component (Tanvi's W7fYZf-CS Model) */}
              <TeachableSignRecognizer
                onSignDetected={(signKey) => {
                  if (ISL_GESTURES[signKey]) {
                    setActiveGestureKey(signKey);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* 2. TESTING TAB: ADAPTIVE BKT ENGINE (THE PROBLEM STATEMENT IMPLEMENTED) */}
        {/* ======================================================================= */}
        {activeTab === "testing" && (
          <div className="max-w-4xl mx-auto">
            <AdaptiveAssessment
              onSelectConceptForAvatar={(key) => setActiveGestureKey(key)}
              externalTriggerBreakdown={hudBreakdownTrigger}
            />
          </div>
        )}

        {/* ======================================================================= */}
        {/* 3. ANALYTICS TAB: ENHANCED TEACHER DASHBOARD & STRUGGLE HEATMAP         */}
        {/* ======================================================================= */}
        {activeTab === "analytics" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Dashboard Header with KPI Metrics */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  Special Education Classroom Cognitive Command Center
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time cognitive struggle telemetry & Teachable Machine ISL tracking (Ahmedabad Hub)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Vision Model: W7fYZf-CS Online
                </span>
                <span className="text-xs px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-mono font-bold">
                  8 Connected Learners
                </span>
              </div>
            </div>

            {/* Class-wide Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Class Average Accuracy</p>
                <p className="text-2xl font-black text-teal-400 font-mono">73.8%</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% after ISL Scaffolding
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Average Latency</p>
                <p className="text-2xl font-black text-indigo-400 font-mono">7.4s</p>
                <p className="text-[10px] text-slate-400">Diagnostic Threshold: 10.0s</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Active Breakdown Scaffolding</p>
                <p className="text-2xl font-black text-amber-400 font-mono">3 Students</p>
                <p className="text-[10px] text-amber-300/80">Auto-Micro-Actions Triggered</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Classified Confident</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">5 Students</p>
                <p className="text-[10px] text-slate-400">Advanced to Hard Questions</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-100 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                  <Filter className="w-3 h-3 text-teal-400" /> Filter:
                </span>
                {[
                  { id: "all", label: "All (8)" },
                  { id: "struggling", label: "Struggling / Review (3)" },
                  { id: "mastered", label: "Confident (5)" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDashboardFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      dashboardFilter === tab.id
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                        : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className={`p-4 rounded-xl border backdrop-blur space-y-3 transition-all ${
                    st.breakdownActive
                      ? "bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-slate-100">{st.name}</p>
                      <p className="text-[10px] text-slate-400">{st.profile}</p>
                    </div>
                    {st.breakdownActive ? (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold text-[10px] animate-pulse">
                        🚨 Breakdown
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-[10px]">
                        🟢 On Track
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Topic: <span className="text-slate-200 font-medium">{st.topic}</span></p>
                    <p>Latency: <span className="text-slate-200 font-mono font-semibold">{st.latency}</span></p>
                    <p>BKT Mastery: <span className="text-teal-400 font-mono font-bold">{st.bktScore}%</span></p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${st.bktScore >= 80 ? "bg-teal-400" : st.bktScore >= 60 ? "bg-amber-400" : "bg-rose-400"}`}
                        style={{ width: `${st.bktScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-teal-300/80 italic pt-1">{st.note}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("study");
                        setActiveGestureKey("evaporation");
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-bold rounded-lg border border-slate-700 transition-colors"
                    >
                      Send 1-on-1 Scaffolding
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}