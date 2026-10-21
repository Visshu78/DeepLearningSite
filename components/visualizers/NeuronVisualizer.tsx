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
    <div className="neuron-workbench-card">
      {/* Visualizer Header Toolbar */}
      <div className="workbench-header flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6E1A2B]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D1819]">
            Neuron Workbench
          </span>
          <span className="text-xs text-[#625956] hidden sm:inline">
            — Real-time forward pass & local gradients
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#625956]">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('excitatory')}
              className="px-2 py-0.5 rounded border border-[#E8E2D9] bg-white text-xs hover:border-[#6E1A2B] hover:text-[#6E1A2B] text-[#1D1819] transition-colors"
            >
              Excitatory
            </button>
            <button
              type="button"
              onClick={() => applyPreset('inhibitory')}
              className="px-2 py-0.5 rounded border border-[#E8E2D9] bg-white text-xs hover:border-[#C28E38] hover:text-[#C28E38] text-[#1D1819] transition-colors"
            >
              Inhibitory
            </button>
            <button
              type="button"
              onClick={() => applyPreset('threshold')}
              className="px-2 py-0.5 rounded border border-[#E8E2D9] bg-white text-xs hover:border-[#968A86] text-[#625956] transition-colors"
            >
              Threshold
            </button>
          </div>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#6E1A2B] hover:text-[#54111F] px-2 py-1 rounded border border-[#E8D3A8] bg-[#FBF6EB] transition-colors shadow-2xs"
            title="Load the exact parameters from the worked example"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C28E38]" />
            <span>Load Example</span>
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#625956] hover:text-[#1D1819] px-2 py-1 rounded border border-[#E8E2D9] bg-white transition-colors"
            title="Reset parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E2D9]">
        {/* SVG Diagram with dual visual encoding (color + dashed lines) */}
        <div className="lg:col-span-7 p-4 bg-[#FAF8F5] flex flex-col items-center justify-center relative min-h-[340px]">
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
                <polygon points="0 0, 6 3, 0 6" fill="#625956" />
              </marker>
            </defs>

            {/* Connection 1: Input 0 -> Summation */}
            <path
              d="M 100 80 C 160 80, 180 140, 225 140"
              fill="none"
              stroke={weights[0] >= 0 ? '#6E1A2B' : '#C28E38'}
              strokeWidth={Math.max(1.5, Math.min(6, Math.abs(weights[0]) * 3))}
              strokeDasharray={weights[0] >= 0 ? undefined : '5,3'}
              strokeOpacity="0.85"
            />
            {/* Animated Signal Flow Overlay Path 1 */}
            <path
              d="M 100 80 C 160 80, 180 140, 225 140"
              fill="none"
              stroke="#C28E38"
              strokeWidth="2"
              strokeDasharray="4, 16"
              strokeOpacity="0.8"
              className="animate-signal-flow"
            />
            {/* Weight 0 Pill Label */}
            <g transform="translate(145, 95)">
              <rect x="-26" y="-10" width="52" height="20" rx="4" fill="#FFFFFF" stroke="#E8E2D9" strokeWidth="1" className="shadow-2xs" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" className="font-mono-num font-semibold" fill="#1D1819">
                w₁={weights[0] >= 0 ? `+${weights[0].toFixed(2)}` : weights[0].toFixed(2)}
              </text>
            </g>

            {/* Connection 2: Input 1 -> Summation */}
            <path
              d="M 100 200 C 160 200, 180 140, 225 140"
              fill="none"
              stroke={weights[1] >= 0 ? '#6E1A2B' : '#C28E38'}
              strokeWidth={Math.max(1.5, Math.min(6, Math.abs(weights[1]) * 3))}
              strokeDasharray={weights[1] >= 0 ? undefined : '5,3'}
              strokeOpacity="0.85"
            />
            {/* Animated Signal Flow Overlay Path 2 */}
            <path
              d="M 100 200 C 160 200, 180 140, 225 140"
              fill="none"
              stroke="#C28E38"
              strokeWidth="2"
              strokeDasharray="4, 16"
              strokeOpacity="0.8"
              className="animate-signal-flow"
            />
            {/* Weight 1 Pill Label */}
            <g transform="translate(145, 185)">
              <rect x="-26" y="-10" width="52" height="20" rx="4" fill="#FFFFFF" stroke="#E8E2D9" strokeWidth="1" className="shadow-2xs" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" className="font-mono-num font-semibold" fill="#1D1819">
                w₂={weights[1] >= 0 ? `+${weights[1].toFixed(2)}` : weights[1].toFixed(2)}
              </text>
            </g>

            {/* Connection: Summation -> Activation Block */}
            <line x1="285" y1="140" x2="340" y2="140" stroke="#625956" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <g transform="translate(312, 126)">
              <text x="0" y="0" textAnchor="middle" fontSize="11" className="font-mono-num font-bold" fill="#6E1A2B">
                z={neuronResult.z.toFixed(2)}
              </text>
            </g>

            {/* Connection: Activation Block -> Output */}
            <line x1="400" y1="140" x2="445" y2="140" stroke="#625956" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Input Node 1 */}
            <g transform="translate(70, 80)">
              <circle r="26" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1D1819">x₁</text>
              <text x="0" y="12" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#625956">
                {inputs[0].toFixed(2)}
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#968A86">Feature 1</text>
            </g>

            {/* Input Node 2 */}
            <g transform="translate(70, 200)">
              <circle r="26" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1D1819">x₂</text>
              <text x="0" y="12" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#625956">
                {inputs[1].toFixed(2)}
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#968A86">Feature 2</text>
            </g>

            {/* Bias Inflow */}
            <g transform="translate(255, 60)">
              <circle r="18" fill="#FBF6EB" stroke="#C28E38" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="0" y="-2" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8E6523">+b</text>
              <text x="0" y="9" textAnchor="middle" fontSize="9" className="font-mono-num font-semibold" fill="#C28E38">
                {bias.toFixed(2)}
              </text>
              <line x1="0" y1="18" x2="0" y2="48" stroke="#C28E38" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrowhead)" />
            </g>

            {/* Summation Node (Sigma) */}
            <g transform="translate(255, 140)">
              <circle r="30" fill="#FFFFFF" stroke="#1D1819" strokeWidth="2" />
              <text x="0" y="-6" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1D1819">∑</text>
              <text x="0" y="12" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#625956">
                w·x+b
              </text>
              <text x="0" y="44" textAnchor="middle" fontSize="10" fill="#625956">Linear Sum</text>
            </g>

            {/* Activation Function Block */}
            <g transform="translate(370, 140)">
              <rect x="-30" y="-30" width="60" height="60" rx="6" fill="#FAF8F5" stroke="#C28E38" strokeWidth="1.5" />
              <text x="0" y="-8" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6E1A2B">φ(z)</text>
              <text x="0" y="8" textAnchor="middle" fontSize="9" fontWeight="600" fill="#1D1819" className="capitalize">
                {activation}
              </text>
              <text x="0" y="22" textAnchor="middle" fontSize="8" className="font-mono-num" fill="#625956">
                φ&apos;={neuronResult.activationDerivative.toFixed(2)}
              </text>
              <text x="0" y="44" textAnchor="middle" fontSize="10" fill="#625956">Non-linearity</text>
            </g>

            {/* Output Node with Dynamic Activation Glow */}
            <g transform="translate(475, 140)">
              <circle
                r="28"
                fill={neuronResult.a > 0 ? '#F9EFF1' : '#F4EFEB'}
                stroke={neuronResult.a > 0 ? '#6E1A2B' : '#D6CCC0'}
                strokeWidth={neuronResult.a > 0 ? 2.5 : 1.5}
                strokeDasharray={neuronResult.a > 0 ? undefined : '4,3'}
              />
              <text x="0" y="-4" textAnchor="middle" fontSize="11" fontWeight="bold" fill={neuronResult.a > 0 ? '#6E1A2B' : '#625956'}>
                Output a
              </text>
              <text x="0" y="12" textAnchor="middle" fontSize="12" className="font-mono-num font-bold" fill="#1D1819">
                {neuronResult.a.toFixed(3)}
              </text>
              <text x="0" y="44" textAnchor="middle" fontSize="10" fill="#625956">Activation</text>
            </g>
          </svg>

          {/* Accessible Legend: color + line style */}
          <div className="flex items-center gap-4 mt-2 text-xs text-[#625956]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#6E1A2B] inline-block"></span>
              Positive weight (solid wine)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-[#C28E38] inline-block"></span>
              Negative weight (dashed gold)
            </span>
          </div>
        </div>


        {/* Right: Controls & Trace */}
        <div className="lg:col-span-5 p-4 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#625956]">
              Parameters
            </h4>

            {/* Inputs & Weights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="param-card">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-x1" className="label">Input x₁</label>
                  <span className="value font-mono-num">{inputs[0].toFixed(2)}</span>
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

              <div className="param-card">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-w1" className="label">Weight w₁</label>
                  <span className="value font-mono-num">{weights[0].toFixed(2)}</span>
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

              <div className="param-card">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-x2" className="label">Input x₂</label>
                  <span className="value font-mono-num">{inputs[1].toFixed(2)}</span>
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

              <div className="param-card">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-w2" className="label">Weight w₂</label>
                  <span className="value font-mono-num">{weights[1].toFixed(2)}</span>
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
              <div className="param-card is-bias">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="neuron-bias" className="label text-[#8E6523]">Bias b</label>
                  <span className="value text-[#C28E38] font-mono-num">{bias.toFixed(2)}</span>
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

              <div className="param-card flex flex-col justify-between">
                <label htmlFor="neuron-activation" className="label mb-1">Activation φ</label>
                <select
                  id="neuron-activation"
                  value={activation}
                  onChange={e => setActivation(e.target.value as ActivationType)}
                  className="w-full text-xs bg-white border border-[#D6CCC0] rounded px-2 py-1 text-[#1D1819] focus:border-[#6E1A2B]"
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
          <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#625956]">
              Arithmetic Trace
            </h4>
            
            <div className="arithmetic-trace-box space-y-1.5 shadow-xs">
              <div className="flex justify-between">
                <span className="text-[#625956]">Products:</span>
                <span>
                  ({inputs[0].toFixed(2)} × {weights[0].toFixed(2)}) + ({inputs[1].toFixed(2)} × {weights[1].toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#625956]">Sum:</span>
                <span>
                  {neuronResult.products[0].toFixed(3)} + {neuronResult.products[1].toFixed(3)} = {neuronResult.sumProducts.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between text-[#8E6523] font-medium">
                <span>Pre-activation z:</span>
                <span>
                  {neuronResult.sumProducts.toFixed(3)} + {bias.toFixed(2)} = <strong>{neuronResult.z.toFixed(3)}</strong>
                </span>
              </div>
              <div className="flex justify-between highlight pt-1 border-t border-[#E8D3A8]">
                <span>Activation a = φ(z):</span>
                <span className="text-sm font-bold">{neuronResult.a.toFixed(4)}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#625956] leading-relaxed">
              <span className="font-semibold text-[#1D1819]">Local Derivative:</span> ∂a/∂z = {neuronResult.activationDerivative.toFixed(4)}.
              {neuronResult.a === 0 && activation === 'relu' && (
                <span className="text-[#C28E38] ml-1">
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
