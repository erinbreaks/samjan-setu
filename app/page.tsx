"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Award,
  ArrowRight,
  HelpCircle,
  Flame,
  Layers,
  Brain,
  Zap,
  Gauge,
  Users,
  Activity,
  ChevronRight,
  ShieldCheck,
  Eye,
  Sliders,
  Send,
  Vibrate,
  BarChart3
} from "lucide-react";
import confetti from "canvas-confetti";

// --- CURRICULUM & ISL DATA ---
const CLASSROOM_LESSONS = [
  {
    id: "l1",
    title: "Science: Water Cycle (જળ ચક્ર)",
    teacherEnglish: "When the hot sun shines, water evaporates and forms clouds.",
    studentGujarati: "જ્યારે ગરમ સૂર્યપ્રકાશ પડે છે, ત્યારે પાણીનું બાષ્પીભવન થાય છે અને વાદળો બને છે.",
    signTokens: [
      { text: "HOT SUN", guj: "ગરમ સૂર્ય", icon: "☀️", color: "from-amber-500/20 to-orange-500/20 border-amber-500/40" },
      { text: "WATER", guj: "પાણી", icon: "💧", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/40" },
      { text: "EVAPORATES", guj: "બાષ્પીભવન", icon: "♨️", color: "from-teal-500/20 to-emerald-500/20 border-teal-500/40" },
      { text: "CLOUDS", guj: "વાદળો", icon: "☁️", color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/40" }
    ],
    avatarGuide: "Wrist Elevation + 3-Finger Thermal Expansion Sign"
  }
];

const ADAPTIVE_QUIZ = [
  {
    id: 1,
    parameter: "1. Language (શબ્દભંડોળ)",
    category: "Vocabulary Sign Match",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    question: "Demonstrate the precise ISL gesture for 'Water' (પાણી).",
    gujaratiSub: "તમારા હાથથી 'પાણી' નો સાચો સંકેત દર્શાવો.",
    hint: "Make a 'W' shape using 3 fingers and tap twice near the chin.",
    gujaratiHint: "૩ આંગળીઓ ઊભી કરી દાઢી પાસે ૨ વાર અડકારો.",
    steps: [
      "પગલું ૧: અંગૂઠા અને નાની આંગળીને જોડો ('W' સાઇન બનાવો).",
      "પગલું ૨: ત્રણ આંગળીઓને હળવેથી દાઢી (Chin) પાસે ૨ વખત સ્પર્શ કરો."
    ],
    expectedSign: "Water (પાણી)"
  },
  {
    id: 2,
    parameter: "2. Recall (સ્મૃતિ / યાદશક્તિ)",
    category: "Memory & Sign Association",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    question: "Recall the upward spiral motion for 'Evaporation' (બાષ્પીભવન).",
    gujaratiSub: "બાષ્પીભવન માટે ઉપર તરફ જતી વરાળનો સંકેત યાદ કરો.",
    hint: "Start with flat palm down, then oscillate fingers upwards like steam.",
    gujaratiHint: "સપાટ હાથથી શરૂ કરી આંગળીઓ હલાવતા ઉપર તરફ લઈ જાઓ.",
    steps: [
      "પગલું ૧: નીચે હાથ સપાટ રાખી પાણીની સપાટી દર્શાવો.",
      "પગલું ૨: આંગળીઓ હલાવીને વરાળ આકાશમાં જતી હોય તેમ ઉપર લઈ જાઓ."
    ],
    expectedSign: "Evaporation (બાષ્પીભવન)"
  },
  {
    id: 3,
    parameter: "3. Concept (વૈજ્ઞાનિક સમજણ)",
    category: "Causal Understanding",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    question: "Explain why clouds form when hot vapor meets cool air.",
    gujaratiSub: "ગરમ વરાળ ઠંડી હવામાં ભળે ત્યારે વાદળ કેમ બને છે તે સમજાવો.",
    hint: "Combine 'Sun Heat' gesture with 'Gathering Cloud Puff' gesture.",
    gujaratiHint: "સૂર્યની ગરમી + ભેગા થતા વાદળનો સંકેત જોડો.",
    steps: [
      "પગલું ૧: સૂર્યની ગરમી દર્શાવો (Sun Radiation Sign).",
      "પગલું ૨: બંને હાથે વાદળનો ગોળાકાર આકાર ભેગો કરો (Cloud Condensation)."
    ],
    expectedSign: "Sun Radiation -> Condensation"
  },
  {
    id: 4,
    parameter: "4. Application (વાક્ય પ્રયોગ)",
    category: "Full Sentence Grammar",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    question: "Construct the full sentence: 'Rain falls from thick clouds'.",
    gujaratiSub: "સંપૂર્ણ વાક્ય સાઇન કરો: 'ઘાટા વાદળોમાંથી વરસાદ વરસે છે'.",
    hint: "Order: [Cloud - Heavy] ──► [Rain - Downward Pour].",
    gujaratiHint: "પહેલા ઘાટું વાદળ બનાવો, પછી નીચે વરસતો વરસાદ દર્શાવો.",
    steps: [
      "પગલું ૧: બંને હાથે ઘાટા વાદળો બનાવો.",
      "પગલું ૨: આંગળીઓને નીચે ઝુલાવી ભારે વરસાદ દર્શાવો."
    ],
    expectedSign: "Dense Clouds -> Rain Pour"
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"study" | "testing" | "analytics">("study");

  // --- STUDY PANEL STATES ---
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [teacherText, setTeacherText] = useState(CLASSROOM_LESSONS[0].teacherEnglish);
  const [gujaratiText, setGujaratiText] = useState(CLASSROOM_LESSONS[0].studentGujarati);
  const [avatarSpeed, setAvatarSpeed] = useState<number>(1.0);
  const [avatarAngle, setAvatarAngle] = useState<"front" | "side" | "top">("front");
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);

  // Student Webcam State
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [studentDetectedSign, setStudentDetectedSign] = useState("Namaste (નમસ્તે)");
  const [matchConfidence, setMatchConfidence] = useState(96);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- ADAPTIVE TESTING ENGINE STATES (Innovator Track) ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [breakdownMode, setBreakdownMode] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  // 4 Bloom Parameters Telemetry Scores
  const [scores, setScores] = useState({
    language: 94,
    recall: 88,
    concept: 62,
    application: 54
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live Webcam Initializer
  useEffect(() => {
    if (mounted && isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log("Webcam permission handled gracefully:", err);
        });
    }
  }, [mounted, isCameraActive]);

  // Telemetry Hesitation Clock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mounted && activeTab === "testing" && !testComplete) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          const nextVal = prev + 1;
          // AUTOMATIC BREAKDOWN TRIGGER
          if (nextVal >= 8 && !breakdownMode) {
            triggerBreakdownEngine();
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mounted, activeTab, testComplete, breakdownMode]);

  const triggerBreakdownEngine = () => {
    setBreakdownMode(true);
    setAvatarSpeed(0.5); // Auto slow-motion
    if (isHapticEnabled && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]); // Gentle dual pulse
    }
  };

  // Simulate Teacher Mic
  const handleTeacherMic = () => {
    if (!isTeacherSpeaking) {
      setIsTeacherSpeaking(true);
      setTimeout(() => {
        setTeacherText("Plants absorb water from soil through root osmosis.");
        setGujaratiText("છોડ મૂળ દ્વારા જમીનમાંથી પાણીનું શોષણ કરે છે.");
        setIsTeacherSpeaking(false);
      }, 2800);
    } else {
      setIsTeacherSpeaking(false);
    }
  };

  // Test Answer Submission
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      if (currentQIndex < ADAPTIVE_QUIZ.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setTimeElapsed(0);
        setMistakes(0);
        setAttempts(1);
        setBreakdownMode(false);
        setAvatarSpeed(1.0);
      } else {
        setTestComplete(true);
      }
    } else {
      setMistakes((m) => m + 1);
      setAttempts((a) => a + 1);
      triggerBreakdownEngine();
    }
  };

  // Judge Scenario Switcher
  const runJudgeScenario = (type: "confident" | "struggling") => {
    if (type === "confident") {
      setTimeElapsed(2);
      setMistakes(0);
      setAttempts(1);
      setBreakdownMode(false);
      setAvatarSpeed(1.0);
    } else {
      setTimeElapsed(9);
      setMistakes(2);
      setAttempts(3);
      triggerBreakdownEngine();
    }
  };

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  const currentQ = ADAPTIVE_QUIZ[currentQIndex];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col selection:bg-teal-500 selection:text-black">
      {/* ========================================================================= */}
      {/* 🚀 GLOWING STARTUP NAVBAR                                                 */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 py-3.5 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 p-[1.5px] shadow-lg shadow-teal-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                SamjanSetu
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-semibold font-mono">
                AI 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              સમજણ સેતુ • Gujarat Deaf & Mute Adaptive Learning Platform
            </p>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => setActiveTab("study")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "study"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            1. Classroom Hub
          </button>
          <button
            onClick={() => setActiveTab("testing")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "testing"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            2. Adaptive Testing Engine
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            3. Teacher Intelligence
          </button>
        </div>

        {/* Judge Live Simulator HUD */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-teal-400" /> Demo HUD:
          </span>
          <button
            onClick={() => runJudgeScenario("confident")}
            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-md font-semibold transition-all"
          >
            ✓ Confident
          </button>
          <button
            onClick={() => runJudgeScenario("struggling")}
            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-md font-semibold transition-all animate-pulse"
          >
            ⚠️ Trigger Struggle
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🌟 MAIN PRODUCT WORKSPACE                                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === "study" && (
          /* ========================================================================= */
          /* 📚 PANEL 1: CLASSROOM STUDY & BIDIRECTIONAL TRANSLATION                   */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Teacher Studio (Speech -> Gujarati & ISL) */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden shadow-2xl">
              {/* Background gradient flare */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-slate-100">
                        Teacher Speech Studio
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        English Voice $\leftrightarrow$ Gujarati Script
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Bhasha Sync
                  </span>
                </div>

                {/* English Speech Card */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    <span>Teacher Spoken English</span>
                    {isTeacherSpeaking && (
                      <span className="text-teal-400 font-mono animate-pulse">
                        Listening Waveform...
                      </span>
                    )}
                  </div>
                  <p className="text-slate-100 font-medium text-base leading-relaxed">
                    "{teacherText}"
                  </p>
                </div>

                {/* Gujarati Translation Card */}
                <div className="bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-time Gujarati Translation (ગુજરાતી અનુવાદ)</span>
                  </div>
                  <p className="text-teal-100 font-bold text-lg leading-relaxed">
                    "{gujaratiText}"
                  </p>
                </div>

                {/* Token Sequence Breakdown */}
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    ISL Linguistic Gloss Sequence:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CLASSROOM_LESSONS[0].signTokens.map((tok, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border bg-gradient-to-r ${tok.color} flex items-center gap-2.5`}
                      >
                        <span className="text-xl">{tok.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {tok.text}
                          </p>
                          <p className="text-[10px] text-slate-300 font-medium">
                            {tok.guj}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-5 border-t border-slate-800 mt-6 flex items-center justify-between">
                <button
                  onClick={handleTeacherMic}
                  className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 shadow-xl transition-all ${
                    isTeacherSpeaking
                      ? "bg-rose-600 text-white shadow-rose-600/30 animate-pulse"
                      : "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:opacity-95 shadow-teal-500/20"
                  }`}
                >
                  {isTeacherSpeaking ? (
                    <>
                      <MicOff className="w-4 h-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Speak New Lesson Concept
                    </>
                  )}
                </button>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isTeacherSpeaking ? "Translating live..." : "Click mic to speak"}
                </span>
              </div>
            </div>

            {/* Right: 3D Avatar & Student Recognition Viewports */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3D Skeletal Avatar Screen */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">
                        3D ISL Sign Avatar (દ્રશ્ય અવતાર એન્જિન)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Zero-Latency Biomechanical Rendering
                      </p>
                    </div>
                  </div>

                  {/* Speed & Angle Dial */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setAvatarSpeed((s) => (s === 1.0 ? 0.5 : s === 0.5 ? 0.75 : 1.0))
                      }
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-teal-300 font-mono font-bold rounded-lg border border-slate-700 transition-all"
                    >
                      Speed: {avatarSpeed}x
                    </button>
                    <button
                      onClick={() =>
                        setAvatarAngle((a) => (a === "front" ? "side" : "front"))
                      }
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3 h-3" /> Angle: {avatarAngle}
                    </button>
                  </div>
                </div>

                {/* 3D Avatar Viewport */}
                <div className="h-64 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 relative flex flex-col items-center justify-center overflow-hidden">
                  {/* Avatar Hologram Core */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-teal-500/10 border-2 border-teal-400/50 flex items-center justify-center text-5xl shadow-2xl shadow-teal-500/30 animate-pulse">
                      🤟
                    </div>
                    {/* Glowing Joint nodes */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-teal-400 animate-ping opacity-75" />
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-indigo-400" />
                  </div>

                  <div className="mt-4 text-center px-4">
                    <span className="text-xs px-3 py-1 bg-teal-950 text-teal-300 border border-teal-800 rounded-full font-bold">
                      Active: Water Evaporation & Condensation
                    </span>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">
                      Kinematic Focus: Dual-Wrist Elevation (0.68m)
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Webcam & Sign-To-Speech Mirror */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">
                        Student Camera Vision (વિદ્યાર્થી સંકેત ઓળખ)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        MediaPipe 21-Landmark Edge Detection
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-mono font-bold">
                    Match: {matchConfidence}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Live Video Feed */}
                  <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-teal-500/40 rounded-xl pointer-events-none flex flex-col justify-between p-2.5">
                      <span className="text-[10px] bg-slate-950/90 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-800 self-start">
                        ● Skeleton Tracking Live
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded self-center">
                        Keep hands inside bounding frame
                      </span>
                    </div>
                  </div>

                  {/* Recognition & Voice Feedback Output */}
                  <div className="space-y-3">
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        Detected Student ISL Sign:
                      </p>
                      <p className="text-base font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {studentDetectedSign}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        Voice Translation Generated for Teacher:
                      </p>
                      <p className="text-xs font-semibold text-indigo-300 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-indigo-400" /> "Hello Teacher, I understand the concept!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "testing" && (
          /* ========================================================================= */
          /* 🧠 PANEL 2: ADAPTIVE TESTING HUB (THE INNOVATOR TRACK CORE)               */
          /* ========================================================================= */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 4 Parameters Live Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "1. Language (શબ્દભંડોળ)", score: scores.language, color: "text-indigo-400", border: "border-indigo-500/30" },
                { label: "2. Recall (યાદશક્તિ)", score: scores.recall, color: "text-teal-400", border: "border-teal-500/30" },
                { label: "3. Concept (સમજણ)", score: scores.concept, color: "text-amber-400", border: "border-amber-500/30" },
                { label: "4. Application (ઉપયોગ)", score: scores.application, color: "text-rose-400", border: "border-rose-500/30" }
              ].map((param, i) => (
                <div
                  key={i}
                  className={`bg-slate-900/70 border ${param.border} p-4 rounded-xl backdrop-blur shadow-lg flex flex-col justify-between`}
                >
                  <p className="text-[11px] font-bold text-slate-400 truncate">
                    {param.label}
                  </p>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className={`text-2xl font-black font-mono ${param.color}`}>
                      {param.score}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Mastery</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Card Interface */}
            {!testComplete ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur space-y-6">
                {/* Header & Live Sensor Counters */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${currentQ.badgeColor}`}>
                      {currentQ.parameter}
                    </span>
                    <h2 className="text-xl font-bold text-slate-100 mt-2.5">
                      Question {currentQIndex + 1} of {ADAPTIVE_QUIZ.length}
                    </h2>
                  </div>

                  {/* Real-time Telemetry Indicators */}
                  <div className="flex items-center gap-2.5 text-xs font-mono">
                    <div className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                      timeElapsed >= 8
                        ? "bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse"
                        : "bg-slate-950 text-slate-300 border-slate-800"
                    }`}>
                      ⏱️ Latency: {timeElapsed}s
                    </div>
                    <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold">
                      ❌ Mistakes: {mistakes}
                    </div>
                    <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold">
                      🔄 Attempts: {attempts}
                    </div>
                  </div>
                </div>

                {/* The Question Prompt */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-1.5">
                  <p className="text-lg font-bold text-slate-100 leading-snug">
                    {currentQ.question}
                  </p>
                  <p className="text-sm font-semibold text-teal-300">
                    {currentQ.gujaratiSub}
                  </p>
                </div>

                {/* ========================================================================= */}
                {/* 🚨 DYNAMIC BREAKDOWN MODE: AUTO TRIGGERED UPON STRUGGLE                   */}
                {/* ========================================================================= */}
                {breakdownMode && (
                  <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/70 rounded-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-300 shadow-2xl shadow-amber-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 animate-bounce" />
                        <span>
                          🚨 BREAKDOWN MODE ACTIVATED (Triggered: Latency &gt; 8s or Mistakes &gt; 1)
                        </span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono font-bold">
                        Scaffolding Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      The AI identified struggle on this cognitive parameter. Morphing pedagogical delivery into <strong>micro-step Gujarati visual breakdown</strong> and slowing avatar playback speed.
                    </p>

                    {/* Step-by-Step Micro Lessons */}
                    <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/30 space-y-2.5">
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Micro-Action Sequence (પગલાંવાર સંકેત માર્ગદર્શિકા):
                      </p>
                      {currentQ.steps.map((st, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-slate-200">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-medium">{st}</span>
                        </div>
                      ))}
                    </div>

                    {/* Adaptation Metrics */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <span className="text-xs px-3 py-1 bg-amber-950 text-amber-200 rounded-lg font-bold border border-amber-800">
                        ⚡ Avatar Speed: 0.5x (Slow-Motion)
                      </span>
                      <span className="text-xs px-3 py-1 bg-teal-950 text-teal-200 rounded-lg font-bold border border-teal-800">
                        🟢 Joint Glowing Nodes: Active
                      </span>
                      <span className="text-xs px-3 py-1 bg-indigo-950 text-indigo-200 rounded-lg font-bold border border-indigo-800">
                        📳 Haptic Pulse Feedback: Ready
                      </span>
                    </div>
                  </div>
                )}

                {/* Interaction Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAnswer(false)}
                      className="px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/80 rounded-xl text-xs font-bold transition-all"
                    >
                      Simulate Incorrect Sign (Trigger Retry)
                    </button>
                    <button
                      onClick={() => setBreakdownMode(!breakdownMode)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      Toggle Scaffolding
                    </button>
                  </div>

                  <button
                    onClick={() => handleAnswer(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl text-sm font-extrabold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
                  >
                    Confirm Sign & Advance <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Performance Mastery Summary */
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-6 backdrop-blur shadow-2xl">
                <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto text-3xl border border-teal-500/30">
                  🏆
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Adaptive Assessment Complete!
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Telemetry automatically synchronized with Teacher Intelligence Hub
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto text-left">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-bold">1. Language</p>
                    <p className="text-lg font-black text-indigo-400 mt-1">94% (Mastered)</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-bold">2. Recall</p>
                    <p className="text-lg font-black text-teal-400 mt-1">88% (High)</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-bold">3. Concept</p>
                    <p className="text-lg font-black text-amber-400 mt-1">Scaffolded (62%)</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-bold">4. Application</p>
                    <p className="text-lg font-black text-rose-400 mt-1">Remedial Focus</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTestComplete(false);
                    setCurrentQIndex(0);
                    setTimeElapsed(0);
                    setMistakes(0);
                    setAttempts(1);
                    setBreakdownMode(false);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 rounded-xl font-bold text-sm"
                >
                  Restart Assessment Test
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          /* ========================================================================= */
          /* 📊 PANEL 3: TEACHER INTELLIGENCE & CLASSROOM STRUGGLE HEATMAP             */
          /* ========================================================================= */
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Live Classroom Heatmap & Struggle Diagnostic
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time cognitive telemetry stream from Class 5B (Ahmedabad Special School)
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full font-bold">
                12 Active Learners Connected
              </span>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Rahul Mehta", status: "🟢 Mastered", topic: "Water Cycle", latency: "2.4s", note: "Confident signing flow" },
                { name: "Ananya Patel", status: "🟢 Mastered", topic: "Plant Science", latency: "3.1s", note: "High recall accuracy" },
                { name: "Kavya Shah", status: "⚠️ Struggling", topic: "Evaporation Concept", latency: "9.2s", note: "Auto-Scaffolding active (0.5x speed)" },
                { name: "Meet Joshi", status: "🟡 Needs Review", topic: "Sentence Application", latency: "6.8s", note: "Incomplete finger-spread" },
                { name: "Pooja Vaghela", status: "🟢 Mastered", topic: "Water Cycle", latency: "2.8s", note: "Completed in 1st attempt" },
                { name: "Dev Trivedi", status: "🟢 Mastered", topic: "Solar Absorption", latency: "3.0s", note: "Excellent orientation" }
              ].map((st, i) => (
                <div key={i} className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl backdrop-blur space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm text-slate-100">{st.name}</p>
                    <span className="text-xs font-semibold">{st.status}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Current Topic: <span className="text-slate-200 font-medium">{st.topic}</span></p>
                    <p>Avg Latency: <span className="text-slate-200 font-mono font-semibold">{st.latency}</span></p>
                    <p className="text-[11px] text-teal-300/90 italic">{st.note}</p>
                  </div>
                  <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-bold rounded-lg border border-slate-700">
                    Send 1-on-1 Visual Card
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}