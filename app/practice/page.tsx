'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

interface PracticeChallenge {
  id: string;
  category: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHALLENGES: PracticeChallenge[] = [
  {
    id: 'c1',
    category: 'Neuron Computation',
    title: 'Predict Neuron Activation Output',
    scenario: 'A neuron has inputs x = [3.0, -1.0], weights w = [0.5, 2.0], bias b = 0.5, and uses the ReLU activation function.',
    question: 'What is the exact post-activation output a of this neuron?',
    options: [
      'a = 0.0',
      'a = 1.0',
      'a = -0.5',
      'a = 0.5'
    ],
    correctIndex: 0,
    explanation: 'Calculation: z = (3.0 × 0.5) + (-1.0 × 2.0) + 0.5 = 1.5 - 2.0 + 0.5 = 0.0. Applying ReLU(0.0) = max(0, 0.0) = 0.0.'
  },
  {
    id: 'c2',
    category: 'Optimization Dynamics',
    title: 'Predict Learning Rate Pathology',
    scenario: 'You are training a neural network using Mean Squared Error on a standard parabolic loss bowl. After setting learning rate η = 2.5, you observe the loss values across the first 4 iterations: 2.1 → 5.8 → 18.4 → 72.0.',
    question: 'What is occurring during training, and what is the corrective action?',
    options: [
      'The model is underfitting; you should increase the learning rate to 5.0.',
      'The learning rate exceeds the stability bound (η > 2/L_max), causing overshooting and numerical divergence. Decrease η.',
      'The weights are vanishing; you should replace ReLU with Sigmoid.',
      'This is normal initial exploration before convergence; continue training.'
    ],
    correctIndex: 1,
    explanation: 'Rapidly multiplying loss values (2.1 → 5.8 → 18.4 → 72.0) is the classic hallmark of step overshoot and mathematical divergence. When η is too large, each update lands further up the opposite side of the bowl. The solution is to reduce η.'
  },
  {
    id: 'c3',
    category: 'Activation Functions',
    title: 'Diagnose Activation by Empirical Characteristics',
    scenario: 'An engineer inspects intermediate outputs of a hidden layer and notes that every neuron activation strictly lies within the interval (-1.0, +1.0), and the mean activation across a balanced dataset is approximately 0.0.',
    question: 'Which activation function is the network using?',
    options: [
      'Sigmoid (σ)',
      'Rectified Linear Unit (ReLU)',
      'Hyperbolic Tangent (Tanh)',
      'Binary Step Function'
    ],
    correctIndex: 2,
    explanation: 'Tanh maps all real inputs into the range (-1.0, 1.0) and is zero-centered (tanh(0) = 0). In contrast, Sigmoid maps strictly into (0, 1) and is not zero-centered.'
  },
  {
    id: 'c4',
    category: 'Backpropagation & Chain Rule',
    title: 'Calculate Single Weight Update',
    scenario: 'In a single-neuron regression model, the current weight is w = 1.40. An error signal backpropagates and yields a weight gradient of ∂L/∂w = +0.60. The learning rate is η = 0.50.',
    question: 'What will be the new weight w_new after one gradient descent step?',
    options: [
      'w_new = 1.70',
      'w_new = 1.10',
      'w_new = 0.80',
      'w_new = 2.00'
    ],
    correctIndex: 1,
    explanation: 'Gradient descent update rule: w_new = w_old - η · (∂L/∂w) = 1.40 - (0.50 × 0.60) = 1.40 - 0.30 = 1.10.'
  },
  {
    id: 'c5',
    category: 'Network Architecture',
    title: 'Analyze Vanishing Gradient Vulnerability',
    scenario: 'A network has 8 consecutive hidden layers, all equipped with standard Sigmoid activations. During backpropagation, the gradients reaching the first hidden layer are virtually 0.00001.',
    question: 'Why did the gradient vanish, and how does ReLU resolve this?',
    options: [
      'Sigmoid maximum derivative is only 0.25; chaining 8 layers shrinks gradients by (0.25)⁸ ≈ 1.5e-5. ReLU has a constant derivative of 1.0 for positive inputs.',
      'The learning rate was accidentally set to zero.',
      'Sigmoid outputs negative values that cancel out positive gradients.',
      'The bias parameters were initialized with numbers that were too small.'
    ],
    correctIndex: 0,
    explanation: 'Because σ\'(z) ≤ 0.25 for all z, multiplying derivatives across 8 layers causes exponential decay: 0.25⁸ ≈ 0.000015! ReLU has slope = 1 for positive values, enabling gradients to flow through deep networks without diminishing.'
  }
];

export default function PracticePage() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSelect = (challengeId: string, optIndex: number) => {
    if (submitted[challengeId]) return;
    setSelectedAnswers(prev => ({ ...prev, [challengeId]: optIndex }));
  };

  const handleSubmit = (challengeId: string) => {
    if (selectedAnswers[challengeId] === undefined) return;
    setSubmitted(prev => ({ ...prev, [challengeId]: true }));
  };

  const handleReset = (challengeId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[challengeId];
      return copy;
    });
    setSubmitted(prev => {
      const copy = { ...prev };
      delete copy[challengeId];
      return copy;
    });
  };

  const totalScore = CHALLENGES.filter(
    c => submitted[c.id] && selectedAnswers[c.id] === c.correctIndex
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E6E6E0] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#0D6E6E]">
            Interactive Concept Verification
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#E6E6E0] bg-[#FAF8F5] text-xs font-mono-num">
            <Award className="w-4 h-4 text-[#0D6E6E]" />
            <span>Score:</span>
            <strong className="text-[#0D6E6E]">{totalScore} / {CHALLENGES.length} Correct</strong>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#18191B] tracking-tight">
          Concept Challenges & Diagnostic Tests
        </h1>
        <p className="text-sm text-[#5C626B] max-w-2xl leading-relaxed">
          Put your deep learning intuition to the test with real mathematical situations. Evaluate forward outputs, diagnose optimization pathologies, and compute parameter updates.
        </p>
      </div>

      {/* Challenges List */}
      <div className="space-y-8">
        {CHALLENGES.map((challenge, idx) => {
          const isSelected = selectedAnswers[challenge.id] !== undefined;
          const isSub = submitted[challenge.id];
          const isCorrect = isSub && selectedAnswers[challenge.id] === challenge.correctIndex;

          return (
            <div
              key={challenge.id}
              className="bg-white border border-[#E6E6E0] rounded-lg p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E6E0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E6E6E0] text-[11px] font-mono-num font-bold text-[#5C626B] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono-num text-[#0D6E6E] font-semibold uppercase tracking-wider">
                    {challenge.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#18191B]">
                  {challenge.title}
                </h3>
              </div>

              {/* Scenario */}
              <div className="bg-[#FAF8F5] border border-[#E6E6E0] rounded p-3 text-xs text-[#18191B] font-mono-num leading-relaxed">
                <span className="font-sans font-semibold text-[#5C626B] uppercase text-[10px] tracking-wider block mb-1">
                  Scenario:
                </span>
                {challenge.scenario}
              </div>

              {/* Question */}
              <p className="text-sm font-semibold text-[#18191B]">
                {challenge.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {challenge.options.map((option, optIdx) => {
                  const selectedThis = selectedAnswers[challenge.id] === optIdx;
                  let optStyle = 'border-[#E6E6E0] bg-[#FCFCFA] text-[#18191B] hover:border-[#D1D1C7]';

                  if (isSub) {
                    if (optIdx === challenge.correctIndex) {
                      optStyle = 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] font-medium';
                    } else if (selectedThis && optIdx !== challenge.correctIndex) {
                      optStyle = 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]';
                    } else {
                      optStyle = 'border-[#E6E6E0] bg-white text-[#878E99] opacity-60';
                    }
                  } else if (selectedThis) {
                    optStyle = 'border-[#0D6E6E] bg-[#EEF7F7] text-[#0D6E6E] font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSub}
                      onClick={() => handleSelect(challenge.id, optIdx)}
                      className={`w-full text-left p-3 rounded text-xs border transition-colors flex items-center justify-between ${optStyle}`}
                    >
                      <span>{option}</span>
                      {isSub && optIdx === challenge.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 ml-2" />
                      )}
                      {isSub && selectedThis && optIdx !== challenge.correctIndex && (
                        <XCircle className="w-4 h-4 text-[#991B1B] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action / Result */}
              <div>
                {!isSub ? (
                  <button
                    type="button"
                    disabled={!isSelected}
                    onClick={() => handleSubmit(challenge.id)}
                    className="text-xs font-semibold px-4 py-2 rounded bg-[#0D6E6E] text-white hover:bg-[#085252] disabled:opacity-40 transition-colors"
                  >
                    Submit Answer
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
                      <div className="font-bold mb-1">
                        {isCorrect ? '✓ Correct Solution' : 'Detailed Explanation:'}
                      </div>
                      <p>{challenge.explanation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReset(challenge.id)}
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
