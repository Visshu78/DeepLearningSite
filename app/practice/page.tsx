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
  },
  {
    id: 'c6',
    category: 'Convolutional Arithmetic',
    title: 'Calculate 2D Convolution Output Spatial Grid',
    scenario: 'An input image of spatial dimension 32×32 is passed into a 2D convolution layer with kernel size K = 5, padding P = 2, and stride S = 2.',
    question: 'What is the spatial width and height of the resulting output feature map?',
    options: [
      '14×14',
      '16×16',
      '15×15',
      '28×28'
    ],
    correctIndex: 1,
    explanation: 'Output formula: W_out = ⌊(W_in - K + 2P)/S⌋ + 1 = ⌊(32 - 5 + 2(2))/2⌋ + 1 = ⌊(31)/2⌋ + 1 = 15 + 1 = 16. The output spatial grid is 16×16.'
  },
  {
    id: 'c7',
    category: 'ResNet Dynamics',
    title: 'Verify Residual Highway Gradient Flow',
    scenario: 'In a deep ResNet residual block H(x) = F(x) + x, the upstream gradient ∂L/∂H = 0.85 arrives at the output addition node. The local gradient through the parameterized convolutional path is ∂F/∂x = -0.15.',
    question: 'What is the exact gradient ∂L/∂x flowing backward to the preceding layer?',
    options: [
      '∂L/∂x = -0.1275',
      '∂L/∂x = 0.7225',
      '∂L/∂x = 0.85',
      '∂L/∂x = 0.0000'
    ],
    correctIndex: 1,
    explanation: 'Gradient highway theorem: ∂L/∂x = ∂L/∂H · (∂F/∂x + I) = 0.85 × (-0.15 + 1.0) = 0.85 × 0.85 = 0.7225. Because of the additive identity term +1, the signal cannot vanish even if ∂F/∂x is small or zero!'
  },
  {
    id: 'c8',
    category: 'Compound Model Scaling',
    title: 'Evaluate EfficientNet FLOPs Scaling Factor',
    scenario: 'EfficientNet scales depth by α^φ, width by β^φ, and resolution by γ^φ under the principled constraint α · β² · γ² ≈ 2.',
    question: 'If you scale the compound coefficient from φ = 0 (B0) to φ = 3 (B3), by approximately what factor do the computational FLOPs increase?',
    options: [
      'FLOPs increase by approximately 2³ = 8×',
      'FLOPs increase linearly by 3×',
      'FLOPs increase quadratically by 9×',
      'FLOPs remain constant'
    ],
    correctIndex: 0,
    explanation: 'By constraining α · β² · γ² ≈ 2, scaling by compound coefficient φ doubles FLOPs for every unit increase. Moving from φ = 0 to φ = 3 multiplies total FLOPs by 2³ = 8× (e.g. B0 ~0.39B to B3 ~1.8B FLOPs).'
  },
  {
    id: 'c9',
    category: 'Transformer Attention',
    title: 'Identify Purpose of √d_k Attention Temperature',
    scenario: 'A researcher designs a self-attention model with head dimension d_k = 64. When computing Attention(Q, K, V), they omit the 1/√d_k divisor.',
    question: 'What mathematical pathology will emerge during training?',
    options: [
      'The dot products QKᵀ grow large in variance (Var = 64), driving Softmax into saturated extremes where gradients vanish to 0.',
      'The output context vector becomes negative.',
      'The attention matrix becomes non-invertible.',
      'Token representations collapse into identity matrices.'
    ],
    correctIndex: 0,
    explanation: 'For independent zero-mean unit-variance components, Var(q · k) = d_k. When d_k = 64, standard deviation is 8. Extreme dot product values cause Softmax to output near-one-hot probabilities (e.g. 0.9999 and 0.0001), where the derivative σ\'(z) ≈ 0, arresting gradient backpropagation.'
  },
  {
    id: 'c10',
    category: 'Regularization',
    title: 'Calculate Inverted Dropout Scaling Factor',
    scenario: 'During training of a dense layer, you set dropout rate p = 0.40 (40% probability of dropping any unit). The surviving 60% of activations are scaled by an inverted dropout factor.',
    question: 'What is the required inverted scaling factor applied to surviving activations during training?',
    options: [
      'Scale by 1 / (1 - 0.40) = 1 / 0.60 ≈ 1.667',
      'Scale by 0.40',
      'Scale by 0.60',
      'Scale by 1.0 (no scaling needed)'
    ],
    correctIndex: 0,
    explanation: 'Inverted dropout scales surviving activations by 1/(1-p) = 1/0.60 ≈ 1.667 during training so that the expected sum of activations remains identical between training and test time without requiring any scaling at inference.'
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
      <div className="border-b border-[#EAE2D5] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#7A1C30]">
            Interactive Concept Verification
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#EAE2D5] bg-[#FAF5EE] text-xs font-mono-num">
            <Award className="w-4 h-4 text-[#7A1C30]" />
            <span>Score:</span>
            <strong className="text-[#7A1C30]">{totalScore} / {CHALLENGES.length} Correct</strong>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1F191B] tracking-tight">
          Concept Challenges & Diagnostic Tests
        </h1>
        <p className="text-sm text-[#54484E] max-w-2xl leading-relaxed">
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
                <h3 className="text-sm font-bold text-[#1F191B]">
                  {challenge.title}
                </h3>
              </div>

              {/* Scenario */}
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-3 text-xs text-[#1F191B] font-mono-num leading-relaxed">
                <span className="font-sans font-semibold text-[#54484E] uppercase text-[10px] tracking-wider block mb-1">
                  Scenario:
                </span>
                {challenge.scenario}
              </div>

              {/* Question */}
              <p className="text-sm font-semibold text-[#1F191B]">
                {challenge.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {challenge.options.map((option, optIdx) => {
                  const selectedThis = selectedAnswers[challenge.id] === optIdx;
                  let optStyle = 'border-[#EAE2D5] bg-[#FCFCFA] text-[#1F191B] hover:border-[#D1D1C7]';

                  if (isSub) {
                    if (optIdx === challenge.correctIndex) {
                      optStyle = 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] font-medium';
                    } else if (selectedThis && optIdx !== challenge.correctIndex) {
                      optStyle = 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]';
                    } else {
                      optStyle = 'border-[#EAE2D5] bg-white text-[#878E99] opacity-60';
                    }
                  } else if (selectedThis) {
                    optStyle = 'border-[#7A1C30] bg-[#FAF2E6] text-[#7A1C30] font-medium';
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
                    className="text-xs font-semibold px-4 py-2 rounded bg-[#7A1C30] text-white hover:bg-[#5F1424] disabled:opacity-40 transition-colors"
                  >
                    Submit Answer
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
                      <p>{challenge.explanation}</p>
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
