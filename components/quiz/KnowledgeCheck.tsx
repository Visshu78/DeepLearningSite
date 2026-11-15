'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';

export interface PublicQuizQuestion {
  id: string;
  question: string;
  options: string[];
}

interface VerifiedResult {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
}

interface KnowledgeCheckProps {
  lessonSlug: string;
  questions: PublicQuizQuestion[];
  onAllCorrect?: () => void;
}

export function getShuffledOptionOrder(seedKey: string, length: number, attempt = 0): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  let seed = 2166136261 ^ (attempt * 16777619);
  for (let i = 0; i < seedKey.length; i++) {
    seed ^= seedKey.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const j = Math.abs(seed) % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function KnowledgeCheck({ lessonSlug, questions, onAllCorrect }: KnowledgeCheckProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [verifiedResults, setVerifiedResults] = useState<Record<string, VerifiedResult>>({});
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});

  const handleSelect = (qId: string, originalIndex: number) => {
    if (verifiedResults[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: originalIndex }));
  };

  const handleSubmit = async (qId: string) => {
    const selectedIndex = selectedAnswers[qId];
    if (selectedIndex === undefined || verifyingId === qId) return;

    setVerifyingId(qId);
    try {
      const res = await fetch('/api/quiz/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonSlug,
          questionId: qId,
          selectedIndex,
        }),
      });
      if (!res.ok) return;
      const result: VerifiedResult = await res.json();
      const nextVerified = { ...verifiedResults, [qId]: result };
      setVerifiedResults(nextVerified);

      if (onAllCorrect) {
        const allDone = questions.every(q => nextVerified[q.id]?.isCorrect);
        if (allDone) onAllCorrect();
      }
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReset = (qId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setVerifiedResults(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setAttemptCounts(prev => ({
      ...prev,
      [qId]: (prev[qId] ?? 0) + 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2.5 border-b border-[#EAE2D5]">
        <HelpCircle className="w-5 h-5 text-[#7A1C30]" aria-hidden="true" />
        <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#1F191B]">
          Interactive Knowledge Check
        </h3>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const verified = verifiedResults[q.id];
          const isSubmitted = Boolean(verified);
          const isCorrect = verified?.isCorrect ?? false;
          const displayOrder = getShuffledOptionOrder(
            `${lessonSlug}:${q.id}`,
            q.options.length,
            attemptCounts[q.id] ?? 0
          );

          return (
            <div
              key={q.id}
              className="bg-white border border-[#EAE2D5] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FAF2E6] border border-[#EEDAA2] text-xs font-mono-num font-bold text-[#7A1C30] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-base sm:text-lg font-bold text-[#1F191B] leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options (shuffled at render time) */}
              <div role="radiogroup" aria-label={q.question} className="space-y-2.5 pl-9">
                {displayOrder.map(originalIdx => {
                  const option = q.options[originalIdx];
                  const isSelected = selectedAnswers[q.id] === originalIdx;
                  let optionStyles = 'border-[#EAE2D5] hover:border-[#DFCDB6] bg-[#FDFBF7] text-[#1F191B]';

                  if (isSubmitted && verified) {
                    if (originalIdx === verified.correctIndex) {
                      optionStyles = 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] font-medium';
                    } else if (isSelected && originalIdx !== verified.correctIndex) {
                      optionStyles = 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]';
                    } else {
                      optionStyles = 'border-[#EAE2D5] bg-white text-[#786970] opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-[#7A1C30] bg-[#FDF2F4] text-[#7A1C30] font-semibold';
                  }

                  return (
                    <button
                      key={originalIdx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, originalIdx)}
                      className={`w-full text-left p-3.5 rounded-lg text-sm sm:text-base border transition-colors flex items-center justify-between ${optionStyles}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && verified && originalIdx === verified.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 ml-2" aria-hidden="true" />
                      )}
                      {isSubmitted && verified && isSelected && originalIdx !== verified.correctIndex && (
                        <XCircle className="w-4 h-4 text-[#991B1B] shrink-0 ml-2" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Actions & Feedback */}
              <div className="pl-9 pt-1">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={!isAnswered || verifyingId === q.id}
                    onClick={() => handleSubmit(q.id)}
                    className="text-sm font-bold px-5 py-2.5 rounded-lg bg-[#7A1C30] text-white hover:bg-[#611525] disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
                  >
                    {verifyingId === q.id ? 'Checking...' : 'Check Answer'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-4 rounded-lg text-sm sm:text-base leading-relaxed border flex items-start gap-2.5 ${
                        isCorrect
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                          : 'bg-[#FFFDF5] border-[#FCD34D] text-[#854D0E]'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="font-semibold block mb-0.5">
                          {isCorrect ? 'Correct!' : 'Not quite right.'}
                        </span>
                        {verified?.explanation}
                      </div>
                    </div>

                    {!isCorrect && (
                      <button
                        type="button"
                        onClick={() => handleReset(q.id)}
                        className="text-xs font-medium text-[#54484E] hover:text-[#1F191B] underline"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
