'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import type { PublicPracticeChallenge } from '@/lib/lesson-data/practiceChallenges';
import { getShuffledOptionOrder } from './KnowledgeCheck';

interface VerifiedChallengeResult {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
}

export function PracticeClient({
  challenges,
}: {
  challenges: PublicPracticeChallenge[];
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [verified, setVerified] = useState<Record<string, VerifiedChallengeResult>>({});
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});

  const handleSelect = (challengeId: string, originalIndex: number) => {
    if (verified[challengeId]) return;
    setSelectedAnswers(prev => ({ ...prev, [challengeId]: originalIndex }));
  };

  const handleSubmit = async (challengeId: string) => {
    const selectedIndex = selectedAnswers[challengeId];
    if (selectedIndex === undefined || verifyingId === challengeId) return;

    setVerifyingId(challengeId);
    try {
      const res = await fetch('/api/quiz/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonSlug: '__practice__',
          questionId: challengeId,
          selectedIndex,
        }),
      });
      if (!res.ok) return;
      const result: VerifiedChallengeResult = await res.json();
      setVerified(prev => ({ ...prev, [challengeId]: result }));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReset = (challengeId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[challengeId];
      return copy;
    });
    setVerified(prev => {
      const copy = { ...prev };
      delete copy[challengeId];
      return copy;
    });
    setAttemptCounts(prev => ({
      ...prev,
      [challengeId]: (prev[challengeId] ?? 0) + 1,
    }));
  };

  const totalScore = challenges.filter(c => verified[c.id]?.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="border-b border-[#EAE2D5] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#7A1C30]">
            Interactive Concept Verification
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#EAE2D5] bg-[#FAF5EE] text-xs font-mono-num">
            <Award className="w-4 h-4 text-[#7A1C30]" />
            <span>Score:</span>
            <strong className="text-[#7A1C30]">
              {totalScore} / {challenges.length} Correct
            </strong>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1F191B] tracking-tight">
          Concept Challenges &amp; Diagnostic Tests
        </h1>
        <p className="text-sm text-[#54484E] max-w-2xl leading-relaxed">
          Put your deep learning intuition to the test with real mathematical situations. Evaluate forward outputs, diagnose optimization pathologies, and compute parameter updates.
        </p>
      </div>

      <div className="space-y-8">
        {challenges.map((challenge, idx) => {
          const isSelected = selectedAnswers[challenge.id] !== undefined;
          const result = verified[challenge.id];
          const isSub = Boolean(result);
          const isCorrect = result?.isCorrect ?? false;
          const displayOrder = getShuffledOptionOrder(
            `practice:${challenge.id}`,
            challenge.options.length,
            attemptCounts[challenge.id] ?? 0
          );

          return (
            <div
              key={challenge.id}
              className="bg-white border border-[#EAE2D5] rounded-lg p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FAF5EE] border border-[#EAE2D5] text-[11px] font-mono-num font-bold text-[#54484E] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono-num text-[#7A1C30] font-semibold uppercase tracking-wider">
                    {challenge.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1F191B]">{challenge.title}</h3>
              </div>

              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-3 text-xs text-[#1F191B] font-mono-num leading-relaxed">
                <span className="font-sans font-semibold text-[#54484E] uppercase text-[10px] tracking-wider block mb-1">
                  Scenario:
                </span>
                {challenge.scenario}
              </div>

              <p className="text-sm font-semibold text-[#1F191B]">{challenge.question}</p>

              <div className="space-y-2">
                {displayOrder.map(originalIdx => {
                  const option = challenge.options[originalIdx];
                  const selectedThis = selectedAnswers[challenge.id] === originalIdx;
                  let optStyle =
                    'border-[#EAE2D5] bg-[#FCFCFA] text-[#1F191B] hover:border-[#D1D1C7]';

                  if (isSub && result) {
                    if (originalIdx === result.correctIndex) {
                      optStyle = 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] font-medium';
                    } else if (selectedThis && originalIdx !== result.correctIndex) {
                      optStyle = 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]';
                    } else {
                      optStyle = 'border-[#EAE2D5] bg-white text-[#878E99] opacity-60';
                    }
                  } else if (selectedThis) {
                    optStyle = 'border-[#7A1C30] bg-[#FAF2E6] text-[#7A1C30] font-medium';
                  }

                  return (
                    <button
                      key={originalIdx}
                      type="button"
                      disabled={isSub}
                      onClick={() => handleSelect(challenge.id, originalIdx)}
                      className={`w-full text-left p-3 rounded text-xs border transition-colors flex items-center justify-between ${optStyle}`}
                    >
                      <span>{option}</span>
                      {isSub && result && originalIdx === result.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 ml-2" />
                      )}
                      {isSub && result && selectedThis && originalIdx !== result.correctIndex && (
                        <XCircle className="w-4 h-4 text-[#991B1B] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div>
                {!isSub ? (
                  <button
                    type="button"
                    disabled={!isSelected || verifyingId === challenge.id}
                    onClick={() => handleSubmit(challenge.id)}
                    className="text-xs font-semibold px-4 py-2 rounded bg-[#7A1C30] text-white hover:bg-[#5F1424] disabled:opacity-40 transition-colors"
                  >
                    {verifyingId === challenge.id ? 'Checking...' : 'Submit Answer'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                          : 'bg-[#FFFDF5] border-[#FCD34D] text-[#B8860B]'
                      }`}
                    >
                      <div className="font-bold mb-1">
                        {isCorrect ? '✓ Correct Solution' : 'Detailed Explanation:'}
                      </div>
                      <p>{result?.explanation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReset(challenge.id)}
                      className="text-xs text-[#54484E] hover:text-[#1F191B] underline"
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
