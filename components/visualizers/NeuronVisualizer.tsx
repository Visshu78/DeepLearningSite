'use client';

import React, { useState, useMemo } from 'react';
import { ActivationType } from '@/lib/math/activations';
import { computeSingleNeuron } from '@/lib/math/neuron';
import { RotateCcw, BookOpen } from 'lucide-react';

export function NeuronVisualizer() {
  const [inputs, setInputs] = useState<[number, number]>([1.5, -0.8]);
  const [weights, setWeights] = useState<[number, number]>([0.8, -1.2]);
  const [bias, setBias] = useState<number>(0.2);
  const [activation, setActivation] = useState<ActivationType>('relu');

  const neuronResult = useMemo(() => {
    return computeSingleNeuron({
      inputs: [inputs[0], inputs[1]],
      weights: [weights[0], weights[1]],
      bias,
      activation
    });
  }, [inputs, weights, bias, activation]);

  const loadWorkedExample = () => {
    setInputs([1.5, -0.8]);
    setWeights([0.8, -1.2]);
    setBias(0.2);
    setActivation('relu');
  };

  const applyPreset = (preset: 'excitatory' | 'inhibitory' | 'threshold') => {
    if (preset === 'excitatory') {
      setInputs([1.0, 2.0]);
      setWeights([1.2, 0.7]);
      setBias(0.1);
      setActivation('relu');
    } else if (preset === 'inhibitory') {
      setInputs([2.0, 1.5]);
      setWeights([-1.5, -0.8]);
      setBias(0.5);
      setActivation('relu');
    } else {
      setInputs([0.5, 0.5]);
      setWeights([1.0, 1.0]);
      setBias(-1.5); // high threshold offset
      setActivation('sigmoid');
    }
  };

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-2xs overflow-hidden">
      {/* Visualizer Header Toolbar */}
      <div className="border-b border-[#EAE2D5] bg-[#FAF5EE] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#7A1C30]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F191B]">
            Neuron Workbench
          </span>
          <span className="text-xs text-[#54484E] hidden sm:inline">
            — Real-time forward pass & local gradients
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#54484E]">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('excitatory')}
              className="px-2 py-0.5 rounded border border-[#EAE2D5] bg-white text-xs hover:border-[#7A1C30] hover:text-[#7A1C30] text-[#1F191B] transition-colors"
            >
              Excitatory
            </button>
            <button
              type="button"
              onClick={() => applyPreset('inhibitory')}
              className="px-2 py-0.5 rounded border border-[#EAE2D5] bg-white text-xs hover:border-[#B8860B] hover:text-[#B8860B] text-[#1F191B] transition-colors"
            >
              Inhibitory
            </button>
            <button
              type="button"
              onClick={() => applyPreset('threshold')}
              className="px-2 py-0.5 rounded border border-[#EAE2D5] bg-white text-xs hover:border-[#786970] text-[#54484E] transition-colors"
            >
              Threshold
            </button>
          </div>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#7A1C30] hover:text-[#5F1424] px-2 py-1 rounded border border-[#EEDAA2] bg-[#FAF2E6] transition-colors shadow-2xs"
            title="Load the exact parameters from the worked example"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Load Example</span>
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#54484E] hover:text-[#1F191B] px-2 py-1 rounded border border-[#EAE2D5] bg-white transition-colors"
            title="Reset parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* SVG Diagram with dual visual encoding (color + dashed lines) */}
        <div className="lg:col-span-7 p-4 bg-[#FDFBF7] flex flex-col items-center justify-center relative min-h-[340px]">
          <svg
            viewBox="0 0 520 280"
            className="w-full max-w-[520px] h-auto select-none"
            role="img"
            aria-label="Interactive single neuron diagram illustrating inputs, weights, summation, bias, and activation"
          >
            <title>Single Artificial Neuron Architecture</title>
            <desc>
              Diagram showing inputs x1 and x2 connected via weighted connections to a summation node, where bias is added to yield z, which passes through activation function phi to produce output a.
            </desc>

            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#786970" />
              </marker>
            </defs>

            {/* Connection 1: Input 0 -> Summation */}
            <path
              d="M 100 80 C 160 80, 180 140, 225 140"
              fill="none"
              stroke={weights[0] >= 0 ? '#7A1C30' : '#B8860B'}
              strokeWidth={Math.max(1.5, Math.min(6, Math.abs(weights[0]) * 3))}
              strokeDasharray={weights[0] >= 0 ? undefined : '5,3'}
              strokeOpacity="0.85"
            />
            {/* Weight 0 Pill Label */}
            <g transform="translate(145, 95)">
              <rect x="-26" y="-10" width="52" height="20" rx="3" fill="#FFFFFF" stroke="#EAE2D5" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" className="font-mono-num font-medium" fill="#1F191B">
                w₁={weights[0] >= 0 ? `+${weights[0].toFixed(2)}` : weights[0].toFixed(2)}
              </text>
            </g>

            {/* Connection 2: Input 1 -> Summation */}
            <path
              d="M 100 200 C 160 200, 180 140, 225 140"
              fill="none"
              stroke={weights[1] >= 0 ? '#7A1C30' : '#B8860B'}
              strokeWidth={Math.max(1.5, Math.min(6, Math.abs(weights[1]) * 3))}
              strokeDasharray={weights[1] >= 0 ? undefined : '5,3'}
              strokeOpacity="0.85"
            />
            {/* Weight 1 Pill Label */}
            <g transform="translate(145, 185)">
              <rect x="-26" y="-10" width="52" height="20" rx="3" fill="#FFFFFF" stroke="#EAE2D5" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" className="font-mono-num font-medium" fill="#1F191B">
                w₂={weights[1] >= 0 ? `+${weights[1].toFixed(2)}` : weights[1].toFixed(2)}
              </text>
            </g>

            {/* Connection: Summation -> Activation Block */}
            <line x1="285" y1="140" x2="340" y2="140" stroke="#54484E" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <g transform="translate(312, 126)">
              <text x="0" y="0" textAnchor="middle" fontSize="11" className="font-mono-num font-semibold" fill="#7A1C30">
                z={neuronResult.z.toFixed(2)}
              </text>
            </g>

            {/* Connection: Activation Block -> Output */}
            <line x1="400" y1="140" x2="445" y2="140" stroke="#54484E" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Input Node 1 */}
            <g transform="translate(70, 80)">
              <circle r="26" fill="#FFFFFF" stroke="#7A1C30" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1F191B">x₁</text>
              <text x="0" y="12" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#54484E">
                {inputs[0].toFixed(2)}
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#786970">Feature 1</text>
            </g>

            {/* Input Node 2 */}
            <g transform="translate(70, 200)">
              <circle r="26" fill="#FFFFFF" stroke="#7A1C30" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1F191B">x₂</text>
              <text x="0" y="12" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#54484E">
                {inputs[1].toFixed(2)}
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#786970">Feature 2</text>
            </g>

            {/* Bias Inflow */}
            <g transform="translate(255, 60)">
              <circle r="18" fill="#FEF9EE" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="0" y="-2" textAnchor="middle" fontSize="10" fontWeight="600" fill="#B8860B">+b</text>
              <text x="0" y="9" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#B8860B">
                {bias.toFixed(2)}
              </text>
              <line x1="0" y1="18" x2="0" y2="48" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrowhead)" />
            </g>

            {/* Summation Node (Sigma) */}
            <g transform="translate(255, 140)">
              <circle r="30" fill="#FFFFFF" stroke="#1F191B" strokeWidth="2" />
              <text x="0" y="-6" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1F191B">∑</text>
              <text x="0" y="12" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#54484E">
                w·x+b
              </text>
              <text x="0" y="44" textAnchor="middle" fontSize="10" fill="#54484E">Linear Sum</text>
            </g>

            {/* Activation Function Block */}
            <g transform="translate(370, 140)">
              <rect x="-30" y="-30" width="60" height="60" rx="4" fill="#FAF5EE" stroke="#B8860B" strokeWidth="1.5" />
              <text x="0" y="-8" textAnchor="middle" fontSize="11" fontWeight="600" fill="#7A1C30">φ(z)</text>
              <text x="0" y="8" textAnchor="middle" fontSize="9" fontWeight="500" fill="#1F191B" className="capitalize">
                {activation}
              </text>
              <text x="0" y="22" textAnchor="middle" fontSize="8" className="font-mono-num" fill="#54484E">
                φ&apos;={neuronResult.activationDerivative.toFixed(2)}
              </text>
              <text x="0" y="44" textAnchor="middle" fontSize="10" fill="#54484E">Non-linearity</text>
            </g>

            {/* Output Node */}
            <g transform="translate(475, 140)">
              <circle r="28" fill="#FDF2F4" stroke="#7A1C30" strokeWidth="2.5" />
              <text x="0" y="-4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7A1C30">Output a</text>
              <text x="0" y="12" textAnchor="middle" fontSize="12" className="font-mono-num font-bold" fill="#1F191B">
                {neuronResult.a.toFixed(3)}
              </text>
              <text x="0" y="44" textAnchor="middle" fontSize="10" fill="#54484E">Activation</text>
            </g>
          </svg>

          {/* Accessible Legend: color + line style */}
          <div className="flex items-center gap-4 mt-2 text-xs text-[#54484E]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#7A1C30] inline-block"></span>
              Positive weight (solid burgundy)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-[#B8860B] inline-block"></span>
              Negative weight (dashed gold)
            </span>
          </div>
        </div>


        {/* Right: Controls & Trace */}
        <div className="lg:col-span-5 p-4 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#54484E]">
              Parameters
            </h4>

            {/* Inputs & Weights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAF5EE] p-2.5 rounded border border-[#EAE2D5]">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-x1" className="text-xs font-medium text-[#1F191B]">Input x₁</label>
                  <span className="text-xs font-mono-num font-semibold text-[#7A1C30]">{inputs[0].toFixed(2)}</span>
                </div>
                <input
                  id="neuron-x1"
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={inputs[0]}
                  onChange={e => setInputs([parseFloat(e.target.value), inputs[1]])}
                  className="w-full"
                />
              </div>

              <div className="bg-[#FAF5EE] p-2.5 rounded border border-[#EAE2D5]">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-w1" className="text-xs font-medium text-[#1F191B]">Weight w₁</label>
                  <span className="text-xs font-mono-num font-semibold text-[#7A1C30]">{weights[0].toFixed(2)}</span>
                </div>
                <input
                  id="neuron-w1"
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={weights[0]}
                  onChange={e => setWeights([parseFloat(e.target.value), weights[1]])}
                  className="w-full"
                />
              </div>

              <div className="bg-[#FAF5EE] p-2.5 rounded border border-[#EAE2D5]">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-x2" className="text-xs font-medium text-[#1F191B]">Input x₂</label>
                  <span className="text-xs font-mono-num font-semibold text-[#7A1C30]">{inputs[1].toFixed(2)}</span>
                </div>
                <input
                  id="neuron-x2"
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={inputs[1]}
                  onChange={e => setInputs([inputs[0], parseFloat(e.target.value)])}
                  className="w-full"
                />
              </div>

              <div className="bg-[#FAF5EE] p-2.5 rounded border border-[#EAE2D5]">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-w2" className="text-xs font-medium text-[#1F191B]">Weight w₂</label>
                  <span className="text-xs font-mono-num font-semibold text-[#7A1C30]">{weights[1].toFixed(2)}</span>
                </div>
                <input
                  id="neuron-w2"
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={weights[1]}
                  onChange={e => setWeights([weights[0], parseFloat(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Bias & Activation */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FEF9EE] p-2.5 rounded border border-[#EEDAA2]">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-bias" className="text-xs font-medium text-[#996515]">Bias b</label>
                  <span className="text-xs font-mono-num font-semibold text-[#B8860B]">{bias.toFixed(2)}</span>
                </div>
                <input
                  id="neuron-bias"
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={bias}
                  onChange={e => setBias(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="bg-[#FAF5EE] p-2.5 rounded border border-[#EAE2D5] flex flex-col justify-between">
                <label htmlFor="neuron-activation" className="text-xs font-medium text-[#1F191B] mb-1">Activation φ</label>
                <select
                  id="neuron-activation"
                  value={activation}
                  onChange={e => setActivation(e.target.value as ActivationType)}
                  className="w-full text-xs bg-white border border-[#DFCDB6] rounded px-2 py-1 text-[#1F191B] focus:border-[#7A1C30]"
                >
                  <option value="relu">ReLU (max(0, z))</option>
                  <option value="sigmoid">Sigmoid (σ)</option>
                  <option value="tanh">Tanh</option>
                  <option value="leaky_relu">Leaky ReLU (α=0.01)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Arithmetic Trace */}
          <div className="space-y-2 pt-2 border-t border-[#EAE2D5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#54484E]">
              Arithmetic Trace
            </h4>
            
            <div className="space-y-1.5 text-xs font-mono-num bg-[#FAF2E6] border border-[#EEDAA2] rounded p-2.5 shadow-2xs">
              <div className="flex justify-between text-[#1F191B]">
                <span className="text-[#54484E]">Products:</span>
                <span>
                  ({inputs[0].toFixed(2)} × {weights[0].toFixed(2)}) + ({inputs[1].toFixed(2)} × {weights[1].toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between text-[#1F191B]">
                <span className="text-[#54484E]">Sum:</span>
                <span>
                  {neuronResult.products[0].toFixed(3)} + {neuronResult.products[1].toFixed(3)} = {neuronResult.sumProducts.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between text-[#B8860B] font-medium">
                <span>Pre-activation z:</span>
                <span>
                  {neuronResult.sumProducts.toFixed(3)} + {bias.toFixed(2)} = <strong>{neuronResult.z.toFixed(3)}</strong>
                </span>
              </div>
              <div className="flex justify-between text-[#7A1C30] font-bold pt-1 border-t border-[#DFCDB6]">
                <span>Activation a = φ(z):</span>
                <span className="text-sm">{neuronResult.a.toFixed(4)}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#54484E] leading-relaxed">
              <span className="font-semibold text-[#1F191B]">Local Derivative:</span> ∂a/∂z = {neuronResult.activationDerivative.toFixed(4)}.
              {neuronResult.a === 0 && activation === 'relu' && (
                <span className="text-[#B8860B] ml-1">
                  (Dead neuron regime: gradient will be exactly zero during backpropagation).
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
