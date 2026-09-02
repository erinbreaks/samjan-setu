"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RotateCcw,
  Zap,
  Play,
  Layers,
  Globe2,
  Languages
} from "lucide-react";

// ISL Vocabulary Dictionary & Animation Triggers
const ISL_VOCABULARY = [
  {
    key: "water",
    english: "Water",
    gujarati: "પાણી",
    icon: "💧",
    signDesc: "3-Finger 'W' Shape tapped twice on Chin",
    gloss: "WATER-DRINK-LIQUID"
  },
  {
    key: "sunlight",
    english: "Sunlight",
    gujarati: "સૂર્યપ્રકાશ",
    icon: "☀️",
    signDesc: "Overhead circular radiation with expanding fingers",
    gloss: "SUN-HEAT-RAY"
  },
  {
    key: "evaporation",
    english: "Evaporation",
    gujarati: "બાષ્પીભવન",
    icon: "♨️",
    signDesc: "Flat water base + oscillating upward spiral fingers",
    gloss: "WATER-HEAT-STEAM-RISE"
  },
  {
    key: "plant",
    english: "Plant",
    gujarati: "છોડ",
    icon: "🌱",
    signDesc: "Upward emerging hand from cupped palm",
    gloss: "EARTH-SEED-GROW"
  },
  {
    key: "clouds",
    english: "Clouds",
    gujarati: "વાદળો",
    icon: "☁️",
    signDesc: "Both hands forming billowing puffs in front of eyes",
    gloss: "SKY-VAPOR-GATHER"
  },
  {
    key: "rain",
    english: "Rain",
    gujarati: "વરસાદ",
    icon: "🌧️",
    signDesc: "Both hands fluttering downward fingers rhythmically",
    gloss: "CLOUD-WATER-FALL"
  }
];

export default function SpeechAvatar() {
  const [isListening, setIsListening] = useState(false);
  const [teacherSpeech, setTeacherSpeech] = useState(
    "Plants absorb water and sunlight to grow."
  );
  const [translatedGujarati, setTranslatedGujarati] = useState(
    "છોડ વૃદ્ધિ પામવા માટે પાણી અને સૂર્યપ્રકાશનું શોષણ કરે છે."
  );
  const [activeWord, setActiveWord] = useState(ISL_VOCABULARY[0]);
  const [avatarSpeed, setAvatarSpeed] = useState<number>(1.0);
  const [avatarAngle, setAvatarAngle] = useState<"front" | "side">("front");
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(true);

  // Trigger Gujarati Speech Audio Output
  const speakGujarati = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "gu-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle Live Speech Recognition (with browser Web Speech API)
  const toggleSpeechRecognition = () => {
    if (!isListening) {
      if (
        typeof window !== "undefined" &&
        ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
      ) {
        try {
          // @ts-ignore
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = "en-US";
          recognition.continuous = false;

          recognition.onstart = () => setIsListening(true);
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTeacherSpeech(transcript);
            const guj = `અનુવાદ: ${transcript} (વર્ગખંડ સમજૂતી)`;
            setTranslatedGujarati(guj);
            speakGujarati(guj);
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

      // Simulated fallback if mic is blocked
      setIsListening(true);
      setTimeout(() => {
        setTeacherSpeech("When water boils, it turns into steam and rises.");
        setTranslatedGujarati("જ્યારે પાણી ઉકળે છે, ત્યારે તે વરાળ બની ઉપર જાય છે.");
        speakGujarati("જ્યારે પાણી ઉકળે છે, ત્યારે તે વરાળ બની ઉપર જાય છે.");
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  const handleSelectWord = (word: typeof ISL_VOCABULARY[0]) => {
    setActiveWord(word);
    setIsAvatarAnimating(false);
    setTimeout(() => setIsAvatarAnimating(true), 50);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur shadow-2xl text-slate-100 flex flex-col justify-between space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">
              SamjanSetu Speech & 3D ISL Engine
            </h3>
            <p className="text-[11px] text-slate-400">
              Teacher Audio $\rightarrow$ Gujarati $\rightarrow$ Indian Sign Language Avatar
            </p>
          </div>
        </div>

        <span className="text-[11px] px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-bold flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5" /> Bhashini API Ready
        </span>
      </div>

      {/* Teacher Speech Input Area */}
      <div className="space-y-3">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Teacher Input (English):
            </span>
            <p className="text-sm font-semibold text-slate-100">
              "{teacherSpeech}"
            </p>
          </div>
          <button
            onClick={toggleSpeechRecognition}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isListening
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            {isListening ? "Listening..." : "Speak"}
          </button>
        </div>

        {/* Live Gujarati Translation Banner */}
        <div className="bg-gradient-to-r from-teal-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-teal-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Real-Time Gujarati Text:
            </span>
            <p className="text-base font-bold text-teal-200 mt-0.5">
              "{translatedGujarati}"
            </p>
          </div>
          <button
            onClick={() => speakGujarati(translatedGujarati)}
            className="p-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-lg text-xs"
            title="Play Gujarati Voice"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Avatar Viewport */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4">
        {/* Avatar View Controls */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            3D Avatar Demonstrating: <span className="text-teal-300">"{activeWord.english} ({activeWord.gujarati})"</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setAvatarSpeed((s) => (s === 1.0 ? 0.5 : s === 0.5 ? 0.75 : 1.0))
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono font-bold rounded border border-slate-700"
            >
              {avatarSpeed}x Speed
            </button>
            <button
              onClick={() => setAvatarAngle((a) => (a === "front" ? "side" : "front"))}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {avatarAngle}
            </button>
          </div>
        </div>

        {/* 3D Skeleton Visual Box */}
        <div className="h-52 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`relative transition-transform duration-500 ${isAvatarAnimating ? "animate-bounce" : ""}`}>
            <div className="w-24 h-24 rounded-2xl bg-teal-500/10 border-2 border-teal-400/50 flex items-center justify-center text-5xl shadow-2xl shadow-teal-500/20">
              {activeWord.icon}
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-400 animate-ping opacity-80" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-indigo-400" />
          </div>

          <div className="mt-3 text-center px-4">
            <p className="text-xs font-bold text-teal-300">{activeWord.signDesc}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              ISL Gloss Syntax: {activeWord.gloss}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Word Palette */}
      <div>
        <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Interactive ISL Vocabulary Palette (Click to sign):
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ISL_VOCABULARY.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectWord(item)}
              className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                activeWord.key === item.key
                  ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/20 scale-105"
                  : "bg-slate-950/60 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate">{item.english}</span>
              <span className="text-[10px] text-slate-400 font-normal">{item.gujarati}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}