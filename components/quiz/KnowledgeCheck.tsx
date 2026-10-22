'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/lib/lesson-data/lessonContent';
import { CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface KnowledgeCheckProps {
  questions: QuizQuestion[];
  onAllCorrect?: () => void;
}

export function KnowledgeCheck({ questions, onAllCorrect }: KnowledgeCheckProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSelect = (qId: string, optIndex: number) => {
    if (submitted[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmit = (qId: string) => {
    if (selectedAnswers[qId] === undefined) return;
    const nextSubmitted = { ...submitted, [qId]: true };
    setSubmitted(nextSubmitted);

    // Check if all questions are now submitted and correct
    if (onAllCorrect) {
      const allDone = questions.every(q => {
        return nextSubmitted[q.id] && selectedAnswers[q.id] === q.correctIndex;
      });
      if (allDone) onAllCorrect();
    }
  };

  const handleReset = (qId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setSubmitted(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
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
          const isSubmitted = submitted[q.id];
          const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctIndex;

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

              {/* Options */}
              <div role="radiogroup" aria-label={q.question} className="space-y-2.5 pl-9">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  let optionStyles = 'border-[#EAE2D5] hover:border-[#DFCDB6] bg-[#FDFBF7] text-[#1F191B]';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyles = 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] font-medium';
                    } else if (isSelected && optIdx !== q.correctIndex) {
                      optionStyles = 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]';
                    } else {
                      optionStyles = 'border-[#EAE2D5] bg-white text-[#786970] opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-[#7A1C30] bg-[#FDF2F4] text-[#7A1C30] font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-lg text-sm sm:text-base border transition-colors flex items-center justify-between ${optionStyles}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 ml-2" aria-hidden="true" />
                      )}
                      {isSubmitted && isSelected && optIdx !== q.correctIndex && (
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
                    disabled={!isAnswered}
                    onClick={() => handleSubmit(q.id)}
                    className="text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg bg-[#7A1C30] text-white hover:bg-[#5F1424] disabled:opacity-40 transition-colors shadow-2xs border border-[#9B2242]"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-3.5 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                        isCorrect
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                          : 'bg-[#FEF9EE] border-[#EEDAA2] text-[#996515]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-sm sm:text-base">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#166534]" aria-hidden="true" />
                            <span>Correct Concept Application</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-[#B8860B]" aria-hidden="true" />
                            <span>Explanation & Correction</span>
                          </>
                        )}
                      </div>
                      <p>{q.explanation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReset(q.id)}
                      className="text-xs sm:text-sm font-medium text-[#786970] hover:text-[#7A1C30] underline transition-colors"
                    >
                      Try Again
                    </button>
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
