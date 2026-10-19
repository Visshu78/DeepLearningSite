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
      <div className="flex items-center gap-2 pb-2 border-b border-[#E6E6E0]">
        <HelpCircle className="w-4 h-4 text-[#0D6E6E]" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#18191B]">
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
              className="bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E6E6E0] text-[11px] font-mono-num font-bold text-[#5C626B] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold text-[#18191B] leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div role="radiogroup" aria-label={q.question} className="space-y-2 pl-8">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  let optionStyles = 'border-[#E6E6E0] hover:border-[#D1D1C7] bg-[#FCFCFA] text-[#18191B]';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyles = 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] font-medium';
                    } else if (isSelected && optIdx !== q.correctIndex) {
                      optionStyles = 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]';
                    } else {
                      optionStyles = 'border-[#E6E6E0] bg-white text-[#878E99] opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-[#0D6E6E] bg-[#EEF7F7] text-[#0D6E6E] font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded text-xs border transition-colors flex items-center justify-between ${optionStyles}`}
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
              <div className="pl-8 pt-1">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={!isAnswered}
                    onClick={() => handleSubmit(q.id)}
                    className="text-xs font-semibold px-4 py-2 rounded bg-[#0D6E6E] text-white hover:bg-[#085252] disabled:opacity-40 transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                          : 'bg-[#FFFDF5] border-[#FCD34D] text-[#B45309]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" aria-hidden="true" />
                            <span>Correct Concept Application</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" aria-hidden="true" />
                            <span>Explanation & Correction</span>
                          </>
                        )}
                      </div>
                      <p>{q.explanation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReset(q.id)}
                      className="text-xs text-[#5C626B] hover:text-[#18191B] underline"
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
