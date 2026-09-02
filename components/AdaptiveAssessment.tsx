"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Clock,
  HelpCircle,
  TrendingUp,
  Activity,
  Award,
  ChevronRight,
  Flame,
  Layers,
  MousePointerClick
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  DIAGNOSTIC_QUESTIONS,
  EASY_QUESTIONS,
  HARD_QUESTIONS,
  WaterCycleQuestion,
  CognitiveParameter
} from "../data/waterCycleQuestions";

interface QuestionRecord {
  questionId: string;
  questionEn: string;
  difficulty: "easy" | "medium" | "hard";
  parameter: CognitiveParameter;
  selectedOptionId: string;
  isCorrect: boolean;
  latencySec: number;
  hesitationScore: number;
  mistakesCount: number;
  breakdownTriggered: boolean;
}

interface AdaptiveAssessmentProps {
  onSelectConceptForAvatar?: (conceptKey: string) => void;
  externalTriggerBreakdown?: boolean;
}

export default function AdaptiveAssessment({
  onSelectConceptForAvatar,
  externalTriggerBreakdown
}: AdaptiveAssessmentProps) {
  // Question Queue (Starts with 3 Diagnostic Medium questions)
  const [questionQueue, setQuestionQueue] = useState<WaterCycleQuestion[]>(DIAGNOSTIC_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active Question Telemetry
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [perQuestionErrors, setPerQuestionErrors] = useState(0);
  const [cumulativeErrors, setCumulativeErrors] = useState(0);
  const [latencySec, setLatencySec] = useState(0);
  const [hesitationScore, setHesitationScore] = useState(0);
  const [breakdownActive, setBreakdownActive] = useState(false);
  const [breakdownHistory, setBreakdownHistory] = useState(false);

  // Classification & Test State
  const [learnerProfile, setLearnerProfile] = useState<"unclassified" | "confident" | "struggler">("unclassified");
  const [testCompleted, setTestCompleted] = useState(false);
  const [assessmentRecords, setAssessmentRecords] = useState<QuestionRecord[]>([]);

  // Bayesian Knowledge Tracing Probability Meters: P(L_t)
  const [bktProbabilities, setBktProbabilities] = useState<Record<CognitiveParameter, number>>({
    language: 0.85,
    recall: 0.80,
    concept: 0.65,
    application: 0.60
  });

  const currentQ: WaterCycleQuestion | undefined = questionQueue[currentIndex];

  // Sync external breakdown trigger from Judge HUD
  useEffect(() => {
    if (externalTriggerBreakdown !== undefined) {
      setBreakdownActive(externalTriggerBreakdown);
    }
  }, [externalTriggerBreakdown]);

  // Sync Avatar Concept when Question changes
  useEffect(() => {
    if (currentQ && onSelectConceptForAvatar) {
      onSelectConceptForAvatar(currentQ.signConceptKey);
    }
  }, [currentQ, onSelectConceptForAvatar]);

  // 1. COGNITIVE CLOCK & AUTOMATIC BREAKDOWN TRIGGER
  useEffect(() => {
    if (testCompleted || isAnswerRevealed) return;

    const timer = setInterval(() => {
      setLatencySec((prev) => {
        const next = prev + 1;
        // Automated Breakdown Mode Trigger 1: Response time > 15 seconds
        if (next >= 15 && !breakdownActive) {
          triggerBreakdown("Response time exceeded 15s");
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testCompleted, isAnswerRevealed, breakdownActive]);

  // Trigger Breakdown Mode
  const triggerBreakdown = (reason?: string) => {
    setBreakdownActive(true);
    setBreakdownHistory(true);
    setBktProbabilities((prev) => ({
      ...prev,
      concept: Math.max(0.25, prev.concept - 0.08),
      recall: Math.max(0.25, prev.recall - 0.05)
    }));
  };

  // 2. CURSOR HESITATION DETECTOR
  const handleOptionMouseEnter = () => {
    if (!isAnswerRevealed) {
      setHesitationScore((h) => h + 1);
    }
  };

  const handleContainerMouseMove = () => {
    if (!isAnswerRevealed && latencySec > 4) {
      setHesitationScore((h) => (h < 50 ? h + 0.2 : h));
    }
  };

  // 3. SUBMIT / CHECK MCQ ANSWER
  const handleCheckAnswer = () => {
    if (!selectedOptionId || !currentQ) return;

    const isCorrect = selectedOptionId === currentQ.correctOptionId;

    if (isCorrect) {
      // Confetti burst on correct
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Update BKT probability positively
      setBktProbabilities((prev) => ({
        ...prev,
        [currentQ.parameter]: Math.min(0.98, prev[currentQ.parameter] + 0.09)
      }));

      setIsAnswerRevealed(true);
    } else {
      // Mistake made
      const nextQErrors = perQuestionErrors + 1;
      const nextTotalErrors = cumulativeErrors + 1;
      setPerQuestionErrors(nextQErrors);
      setCumulativeErrors(nextTotalErrors);

      // Decrease BKT probability for this parameter
      setBktProbabilities((prev) => ({
        ...prev,
        [currentQ.parameter]: Math.max(0.2, prev[currentQ.parameter] - 0.1)
      }));

      // Automated Breakdown Mode Trigger 2: Picked incorrect answer twice
      // Automated Breakdown Mode Trigger 3: 3 or more errors throughout test
      if (nextQErrors >= 2 || nextTotalErrors >= 3) {
        triggerBreakdown("Multiple errors detected");
        setIsAnswerRevealed(true);
      }
    }
  };

  // 4. ADVANCE TO NEXT QUESTION / ADAPTIVE BRANCHING
  const handleNextQuestion = () => {
    if (!currentQ) return;

    // Record performance for this question
    const isCorrect = selectedOptionId === currentQ.correctOptionId;
    const record: QuestionRecord = {
      questionId: currentQ.id,
      questionEn: currentQ.questionEn,
      difficulty: currentQ.difficulty,
      parameter: currentQ.parameter,
      selectedOptionId: selectedOptionId || "",
      isCorrect,
      latencySec,
      hesitationScore: Math.round(hesitationScore),
      mistakesCount: perQuestionErrors,
      breakdownTriggered: breakdownHistory
    };

    const updatedRecords = [...assessmentRecords, record];
    setAssessmentRecords(updatedRecords);

    // CHECK IF DIAGNOSTIC PHASE (Q1-Q3) IS COMPLETE
    if (currentIndex === 2 && learnerProfile === "unclassified") {
      // Evaluate Diagnostic Performance across Q1, Q2, Q3
      const first3 = updatedRecords.slice(0, 3);
      const totalDiagnosticTime = first3.reduce((acc, r) => acc + r.latencySec, 0);
      const avgLatency = totalDiagnosticTime / 3;
      const wrongAttempts = first3.filter((r) => !r.isCorrect).length;
      const avgHesitation = first3.reduce((acc, r) => acc + r.hesitationScore, 0) / 3;

      // Classification Logic:
      // STRUGGLER if: avg latency > 10s OR >1 wrong OR high hesitation (>18)
      // CONFIDENT if: avg latency <= 10s AND <= 1 wrong
      const isStruggler = avgLatency > 10 || wrongAttempts > 1 || avgHesitation > 18;

      if (isStruggler) {
        setLearnerProfile("struggler");
        // Decreases difficulty level: Branch remaining 7 questions to EASY
        setQuestionQueue([...DIAGNOSTIC_QUESTIONS, ...EASY_QUESTIONS]);
      } else {
        setLearnerProfile("confident");
        // Increases difficulty level: Branch remaining 7 questions to HARD
        setQuestionQueue([...DIAGNOSTIC_QUESTIONS, ...HARD_QUESTIONS]);
      }
    }

    // Advance index or complete test
    if (currentIndex < 9) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      setIsAnswerRevealed(false);
      setPerQuestionErrors(0);
      setLatencySec(0);
      setHesitationScore(0);
      // Reset breakdown for next question unless overall struggle is high
      setBreakdownActive(false);
      setBreakdownHistory(false);
    } else {
      setTestCompleted(true);
    }
  };

  // 5. RESTART TEST
  const handleRestart = () => {
    setQuestionQueue(DIAGNOSTIC_QUESTIONS);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    setPerQuestionErrors(0);
    setCumulativeErrors(0);
    setLatencySec(0);
    setHesitationScore(0);
    setBreakdownActive(false);
    setBreakdownHistory(false);
    setLearnerProfile("unclassified");
    setTestCompleted(false);
    setAssessmentRecords([]);
    setBktProbabilities({
      language: 0.85,
      recall: 0.80,
      concept: 0.65,
      application: 0.60
    });
  };

  // 6. SIMULATION SHORTCUTS (For Hackathon Demonstration)
  const simulateConfidentLearner = () => {
    handleRestart();
    setLearnerProfile("confident");
    setQuestionQueue([...DIAGNOSTIC_QUESTIONS, ...HARD_QUESTIONS]);
    setLatencySec(4);
    setHesitationScore(2);
    setPerQuestionErrors(0);
    setBreakdownActive(false);
    setBktProbabilities({
      language: 0.96,
      recall: 0.92,
      concept: 0.88,
      application: 0.84
    });
  };

  const simulateStruggler = () => {
    handleRestart();
    setLearnerProfile("struggler");
    setQuestionQueue([...DIAGNOSTIC_QUESTIONS, ...EASY_QUESTIONS]);
    setLatencySec(16);
    setHesitationScore(24);
    setPerQuestionErrors(2);
    setCumulativeErrors(3);
    setBreakdownActive(true);
    setBreakdownHistory(true);
    setBktProbabilities({
      language: 0.65,
      recall: 0.58,
      concept: 0.42,
      application: 0.38
    });
  };

  // Color & Badge for Question Difficulty (Visible to student)
  const renderDifficultyBadge = (diff: "easy" | "medium" | "hard") => {
    if (diff === "easy") {
      return (
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          🟢 EASY (સરળ કક્ષા)
        </span>
      );
    }
    if (diff === "medium") {
      return (
        <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          🟡 MEDIUM (મધ્યમ કક્ષા - Diagnostic)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
        🔴 HARD (કઠિન કક્ષા - Advanced)
      </span>
    );
  };

  // ANALYSIS REPORT CALCULATION
  const totalCorrect = assessmentRecords.filter((r) => r.isCorrect).length;
  const overallAccuracy = assessmentRecords.length > 0 ? Math.round((totalCorrect / assessmentRecords.length) * 100) : 0;
  const totalTimeTaken = assessmentRecords.reduce((acc, r) => acc + r.latencySec, 0);
  const avgTimePerQ = assessmentRecords.length > 0 ? (totalTimeTaken / assessmentRecords.length).toFixed(1) : "0.0";

  // Identify Problem Areas
  const problemAreas: { parameter: CognitiveParameter; label: string; mistakes: number; noteGu: string; noteEn: string }[] = [];
  (["concept", "application", "recall", "language"] as CognitiveParameter[]).forEach((p) => {
    const questionsInParam = assessmentRecords.filter((r) => r.parameter === p);
    const mistakesInParam = questionsInParam.filter((r) => !r.isCorrect).length;
    if (mistakesInParam > 0 || bktProbabilities[p] < 0.65) {
      const labels: Record<CognitiveParameter, { en: string; gu: string }> = {
        language: { en: "ISL Linguistic Syntax", gu: "સંકેત ભાષા શબ્દભંડોળ" },
        recall: { en: "Memory & Fact Recall", gu: "સ્મૃતિ અને પ્રક્રિયા ક્રમ" },
        concept: { en: "Thermodynamic Causality", gu: "બાષ્પીભવન અને ઘનીભવન વૈજ્ઞાનિક સમજણ" },
        application: { en: "Environmental Application", gu: "જળચક્ર પર્યાવરણીય પ્રયોગ" }
      };
      problemAreas.push({
        parameter: p,
        label: labels[p].en,
        mistakes: mistakesInParam,
        noteEn: `Detected cognitive struggle in ${labels[p].en}. Recommending visual 3D avatar repetition.`,
        noteGu: `${labels[p].gu} માં સહાયની જરૂર છે. 3D અવતારના દ્રશ્ય સંકેતોનું પુનરાવર્તન કરો.`
      });
    }
  });

  return (
    <div className="space-y-6" onMouseMove={handleContainerMouseMove}>
      {/* 1. TOP BKT PROBABILITY METERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: "language", label: "1. Language (શબ્દભંડોળ)", prob: bktProbabilities.language, color: "text-indigo-400", bar: "bg-indigo-500" },
          { key: "recall", label: "2. Recall (સ્મૃતિ)", prob: bktProbabilities.recall, color: "text-teal-400", bar: "bg-teal-500" },
          { key: "concept", label: "3. Concept (સમજણ)", prob: bktProbabilities.concept, color: "text-amber-400", bar: "bg-amber-500" },
          { key: "application", label: "4. Application (પ્રયોગ)", prob: bktProbabilities.application, color: "text-rose-400", bar: "bg-rose-500" }
        ].map((item) => (
          <div
            key={item.key}
            className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur space-y-1.5 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-bold text-slate-400 truncate">{item.label}</p>
              <span className="text-[9px] font-mono text-slate-500 uppercase">P(Mastery)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-black font-mono ${item.color}`}>
                {(item.prob * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-400">
                {item.prob >= 0.8 ? "Mastered" : item.prob >= 0.5 ? "In Progress" : "Needs Scaffolding"}
              </span>
            </div>
            <div className="w-full bg-slate-800/90 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.bar} transition-all duration-500`}
                style={{ width: `${item.prob * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 2. ACTIVE MCQ CARD OR COMPLETED ANALYSIS REPORT */}
      {!testCompleted && currentQ ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur space-y-6 relative overflow-hidden">
          {/* Header Row: Question Counter, Visible Difficulty, and Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-800 text-teal-300 border border-slate-700 rounded-full">
                Question {currentIndex + 1} of 10
              </span>
              {renderDifficultyBadge(currentQ.difficulty)}
              <span className="text-xs font-mono px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-semibold">
                {currentQ.parameterLabel.en}
              </span>
            </div>

            {/* Real-Time Telemetry Counters */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                  latencySec >= 15
                    ? "bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse shadow-lg shadow-rose-900/30"
                    : latencySec >= 10
                    ? "bg-amber-950/80 text-amber-300 border-amber-600"
                    : "bg-slate-950 text-slate-300 border-slate-800"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Response Time: {latencySec}s
              </div>

              <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-teal-400" />
                Hesitation: {Math.round(hesitationScore)}
              </div>

              <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold">
                Mistakes: <span className={perQuestionErrors > 0 ? "text-rose-400 font-bold" : ""}>{perQuestionErrors}</span>
              </div>
            </div>
          </div>

          {/* Bilingual Question Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentQ.questionEn}
            </h2>
            <p className="text-sm sm:text-base font-medium text-teal-300 leading-relaxed">
              ગુજરાતી પ્રશ્ન: {currentQ.questionGu}
            </p>
          </div>

          {/* 🚨 DYNAMIC BREAKDOWN MODE SCAFFOLDING (AUTO-TRIGGERED OR ACTIVE) */}
          {breakdownActive && (
            <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 space-y-4 shadow-2xl shadow-amber-500/10 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 animate-bounce text-amber-400" />
                  <span>
                    🚨 BREAKDOWN MODE ACTIVE (સહાયક મોડ સક્રિય)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                  {latencySec >= 15 ? "Trigger: Latency > 15s" : perQuestionErrors >= 2 ? "Trigger: 2 Incorrect Attempts" : "Pedagogical Scaffolding"}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Adaptive cognitive engine detected hesitation or struggle. Simplifying scientific concepts into <strong>Micro-Step Action Scaffolding</strong> and highlighting core vocabulary.
              </p>

              {/* Step-by-Step Text Hints in Gujarati */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/40 space-y-2.5">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  પગલાંવાર સંકેત માર્ગદર્શન (Step-by-Step Gujarati Hints):
                </p>
                <div className="space-y-1.5">
                  {currentQ.breakdownHintsGu.map((hint, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight Core Keywords */}
              <div>
                <p className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider mb-2">
                  મુખ્ય શબ્દો (Core Highlighted Keywords):
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentQ.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      {kw.en} ({kw.gu})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4 BILINGUAL MCQ OPTIONS */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select the correct answer (ચારમાંથી સાચો વિકલ્પ પસંદ કરો):
            </p>
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrectOption = option.id === currentQ.correctOptionId;

                let optionStyles = "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900";

                if (isAnswerRevealed) {
                  if (isCorrectOption) {
                    optionStyles = "bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/20";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyles = "bg-rose-950/60 border-rose-500 text-rose-100";
                  } else {
                    optionStyles = "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyles = "bg-teal-500/20 border-teal-400 text-teal-100 shadow-md shadow-teal-500/20";
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (!isAnswerRevealed) {
                        setSelectedOptionId(option.id);
                      }
                    }}
                    onMouseEnter={handleOptionMouseEnter}
                    disabled={isAnswerRevealed}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${optionStyles}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                        isAnswerRevealed && isCorrectOption
                          ? "bg-emerald-500 text-slate-950 border-emerald-400"
                          : isAnswerRevealed && isSelected && !isCorrectOption
                          ? "bg-rose-500 text-white border-rose-400"
                          : isSelected
                          ? "bg-teal-400 text-slate-950 border-teal-300 font-black"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {option.id}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <p className="font-semibold text-sm leading-snug">{option.textEn}</p>
                      <p className="text-xs text-slate-400 font-medium">{option.textGu}</p>
                    </div>

                    {isAnswerRevealed && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                    )}
                    {isAnswerRevealed && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* POST-ATTEMPT DETAILED SOLUTION CARD */}
          {isAnswerRevealed && (
            <div className="bg-slate-950 border border-teal-500/40 rounded-xl p-5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>વિસ્તૃત વૈજ્ઞાનિક સમજૂતી (Detailed Solution & Mechanism):</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-slate-100 font-medium">
                  <strong>English:</strong> {currentQ.solutionEn}
                </p>
                <p className="text-teal-200">
                  <strong>ગુજરાતી:</strong> {currentQ.solutionGu}
                </p>
              </div>
            </div>
          )}

          {/* BOTTOM CONTROLS & NEXT BUTTON */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerBreakdown("Manual Scaffolding Request")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  breakdownActive
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                {breakdownActive ? "Breakdown Mode Active" : "Trigger Breakdown Mode"}
              </button>
            </div>

            {!isAnswerRevealed ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOptionId}
                className={`px-6 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg ${
                  selectedOptionId
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 shadow-teal-500/20 scale-[1.02]"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                Submit Answer (જવાબ ચકાસો) <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-teal-500/20 scale-[1.02]"
              >
                {currentIndex === 9 ? "Finish Assessment (પરિણામ જુઓ)" : "Next Question (આગળનો પ્રશ્ન)"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 📊 COMPREHENSIVE END-OF-ASSESSMENT ANALYSIS REPORT                        */
        /* ========================================================================= */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur space-y-8 animate-in fade-in duration-300">
          {/* Report Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Adaptive BKT Assessment Report
                </h2>
                <p className="text-xs text-slate-400">
                  જળચક્ર અનુકૂલિત મૂલ્યાંકન અહેવાલ • Individual Cognitive Telemetry
                </p>
              </div>
            </div>

            {/* Learner Classification Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Classified Profile:</span>
              {learnerProfile === "confident" ? (
                <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  🌟 Confident Learner (આત્મવિશ્વાસુ વિદ્યાર્થી)
                </span>
              ) : (
                <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  🛡️ Scaffolded Learner (સહાયક માર્ગદર્શન જરૂરી)
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Total Score</p>
              <p className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
                {totalCorrect} / 10
              </p>
              <p className="text-[10px] text-slate-400">{overallAccuracy}% Accuracy</p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Total Assessment Time</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                {totalTimeTaken}s
              </p>
              <p className="text-[10px] text-slate-400">Avg {avgTimePerQ}s / question</p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Total Mistakes</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                {cumulativeErrors}
              </p>
              <p className="text-[10px] text-slate-400">Across 10 Questions</p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Breakdown Triggered</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {assessmentRecords.filter((r) => r.breakdownTriggered).length}
              </p>
              <p className="text-[10px] text-slate-400">Times Auto-Scaffolded</p>
            </div>
          </div>

          {/* 4-Parameter Cognitive Mastery Heatmap */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Cognitive Parameter Mastery (4 પરિમાણોનું વિશ્લેષણ):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { param: "language", label: "1. Language (શબ્દભંડોળ - ISL Mapping)", prob: bktProbabilities.language, desc: "Ability to connect sign morphology with English/Gujarati terms" },
                { param: "recall", label: "2. Recall (સ્મૃતિ - Fact Retrieval)", prob: bktProbabilities.recall, desc: "Retention of cycle stages, terms, and sequence ordering" },
                { param: "concept", label: "3. Concept (સમજણ - Causality & Physics)", prob: bktProbabilities.concept, desc: "Understanding thermodynamic phase transitions and latent heat" },
                { param: "application", label: "4. Application (પ્રયોગ - Real World)", prob: bktProbabilities.application, desc: "Applying hydrological cycles to weather, aquifers, and ecosystems" }
              ].map((item) => (
                <div key={item.param} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold text-slate-200">{item.label}</p>
                    <span className="text-base font-black font-mono text-teal-400">
                      {(item.prob * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${item.prob * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Areas Diagnostic */}
          {problemAreas.length > 0 && (
            <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Problem Areas & Remediation (નબળા મુદ્દાઓ અને સુધારણા માર્ગદર્શન):
              </h3>
              <div className="space-y-2.5">
                {problemAreas.map((pa, idx) => (
                  <div key={idx} className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-amber-200">
                      {idx + 1}. {pa.label} ({pa.mistakes} mistakes detected)
                    </p>
                    <p className="text-slate-300">{pa.noteEn}</p>
                    <p className="text-teal-300/90 italic">{pa.noteGu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question-by-Question Audit Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              10-Question Diagnostic Audit Trail:
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Cognitive Area</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Hesitation</th>
                    <th className="p-3">Breakdown</th>
                    <th className="p-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {assessmentRecords.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold">{i + 1}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            rec.difficulty === "easy"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : rec.difficulty === "medium"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {rec.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 capitalize font-medium text-slate-200">{rec.parameter}</td>
                      <td className="p-3 font-mono">{rec.latencySec}s</td>
                      <td className="p-3 font-mono">{rec.hesitationScore}</td>
                      <td className="p-3">
                        {rec.breakdownTriggered ? (
                          <span className="text-amber-400 font-bold">Yes (🚨)</span>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </td>
                      <td className="p-3">
                        {rec.isCorrect ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Missed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={simulateConfidentLearner}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold"
              >
                Simulate Confident Profile
              </button>
              <button
                onClick={simulateStruggler}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold"
              >
                Simulate Struggler Profile
              </button>
            </div>

            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <RotateCcw className="w-4 h-4" /> Restart Assessment (ફરી પરીક્ષા શરૂ કરો)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
