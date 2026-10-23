'use client';

import React, { useState, useMemo } from 'react';
import {
  simulateResNetGradientFlow,
  computeResidualBlock1D,
  compareResNetBlocks
} from '@/lib/math/resnet';
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Zap,
  BarChart3,
  GitFork,
  CheckCircle2
} from 'lucide-react';

export function ResNetVisualizer() {
  const [activeTab, setActiveTab] = useState<'architecture-diagram' | 'gradient-highway' | 'bottleneck-blocks'>('architecture-diagram');
  
  // Architecture diagram state
  const [diagramMode, setDiagramMode] = useState<'forward' | 'backward'>('forward');
  const [inputSignalX, setInputSignalX] = useState<number>(1.6);
  const [weightW1, setWeightW1] = useState<number>(0.8);
  const [weightW2, setWeightW2] = useState<number>(-0.5);

  // Gradient waterfall state
  const [totalLayers, setTotalLayers] = useState<number>(20);
  const [averageLocalGrad, setAverageLocalGrad] = useState<number>(0.75);

  // Simulate gradient flow across all layers
  const gradientSteps = useMemo(() => {
    return simulateResNetGradientFlow(totalLayers, averageLocalGrad, 1.0);
  }, [totalLayers, averageLocalGrad]);

  // Forward & backward residual block math
  const residualBlockSim = useMemo(() => {
    return computeResidualBlock1D(inputSignalX, weightW1, weightW2, 0.1, -0.05);
  }, [inputSignalX, weightW1, weightW2]);

  // Bottleneck comparison
  const blockComparison = useMemo(() => {
    return compareResNetBlocks(64, 56);
  }, []);

  const earliestPlainGrad = gradientSteps[0]?.plainGradientMagnitude || 0;
  const earliestResNetGrad = gradientSteps[0]?.resnetGradientMagnitude || 0;

  return (
    <div className="bg-[#FCFAF7] border border-[#E8E2D9] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6E1A2B] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B]">
              RESNET RESIDUAL WORKBENCH
            </span>
          </div>
          <p className="text-xs text-[#625956]">
            Interactive residual block architecture diagram, gradient highway simulation, and bottleneck efficiency
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1.5 bg-[#EFE9DF] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('architecture-diagram')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'architecture-diagram'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            1. Architecture Diagram [F(x) + x]
          </button>
          <button
            onClick={() => setActiveTab('gradient-highway')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'gradient-highway'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            2. Gradient Waterfall (Plain vs ResNet)
          </button>
          <button
            onClick={() => setActiveTab('bottleneck-blocks')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'bottleneck-blocks'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            3. Bottleneck Block Efficiency
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* TAB 1: ARCHITECTURE CIRCUIT DIAGRAM */}
        {activeTab === 'architecture-diagram' && (
          <div className="space-y-6">
            {/* Flow Mode Switcher & Explanation */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Signal Propagation Mode:
                </span>
                <div className="inline-flex rounded-lg bg-[#FAF5EE] p-0.5 border border-[#E8E2D9]">
                  <button
                    id="btn-forward-pass"
                    type="button"
                    onClick={() => setDiagramMode('forward')}
                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                      diagramMode === 'forward'
                        ? 'bg-[#6E1A2B] text-white shadow-2xs'
                        : 'text-[#54484E] hover:text-[#1D1819]'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Forward Pass: H(x) = F(x) + x
                  </button>
                  <button
                    id="btn-backward-pass"
                    type="button"
                    onClick={() => setDiagramMode('backward')}
                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                      diagramMode === 'backward'
                        ? 'bg-[#8E6523] text-white shadow-2xs'
                        : 'text-[#54484E] hover:text-[#1D1819]'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Backward Pass: ∂L/∂x = ∂L/∂H · (∂F/∂x + I)
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono-num text-[#8E6523] bg-[#FBF6EB] px-2.5 py-1 rounded border border-[#E8D3A8]">
                {diagramMode === 'forward'
                  ? `H(x) = ${residualBlockSim.hx.toFixed(3)}`
                  : `Highway Gain = +${residualBlockSim.gradientHighwayFactor.toFixed(3)} (unattenuated)`}
              </div>
            </div>

            {/* SVG Interactive Architecture Block Diagram */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-6 shadow-2xs overflow-x-auto">
              <div className="min-w-[700px]">
                <svg viewBox="0 0 740 280" className="w-full h-auto select-none">
                  <defs>
                    <marker
                      id="arrow-forward"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#6E1A2B" />
                    </marker>
                    <marker
                      id="arrow-highway"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#C28E38" />
                    </marker>
                    <marker
                      id="arrow-backward"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 8 1 L 0 5 L 8 9 z" fill="#8E6523" />
                    </marker>
                  </defs>

                  {/* 1. INPUT NODE */}
                  <g transform="translate(50, 110)">
                    <circle r="26" fill="#FAF8F5" stroke="#6E1A2B" strokeWidth="2.5" />
                    <text x="0" y="-3" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1D1819">x</text>
                    <text x="0" y="12" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6E1A2B" className="font-mono-num">
                      {inputSignalX.toFixed(2)}
                    </text>
                    <text x="0" y="38" textAnchor="middle" fontSize="11" fontWeight="600" fill="#625956">Input</text>
                  </g>

                  {/* BRANCH SPLIT POINT */}
                  <circle cx="105" cy="110" r="4.5" fill="#6E1A2B" />

                  {/* Line from Input to Split */}
                  <line x1="76" y1="110" x2="101" y2="110" stroke="#6E1A2B" strokeWidth="2.5" />

                  {/* RESIDUAL PATH: Line into Weight Layer 1 */}
                  <line
                    x1="105"
                    y1="110"
                    x2="140"
                    y2="110"
                    stroke="#6E1A2B"
                    strokeWidth="2.5"
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-forward)' : undefined}
                    markerStart={diagramMode === 'backward' ? 'url(#arrow-backward)' : undefined}
                  />

                  {/* 2. WEIGHT LAYER 1 */}
                  <g transform="translate(145, 80)">
                    <rect width="88" height="60" rx="6" fill="#FAF5EE" stroke="#E8E2D9" strokeWidth="1.5" />
                    <text x="44" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1D1819">Weight Layer</text>
                    <text x="44" y="42" textAnchor="middle" fontSize="10" fill="#625956" className="font-mono-num">
                      w₁ = {weightW1.toFixed(2)}
                    </text>
                    <text x="44" y="74" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8E6523">3×3 Conv / BN</text>
                  </g>

                  {/* Line from Weight 1 to ReLU 1 */}
                  <line
                    x1="233"
                    y1="110"
                    x2="263"
                    y2="110"
                    stroke="#6E1A2B"
                    strokeWidth="2.5"
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-forward)' : undefined}
                  />

                  {/* 3. RELU ACTIVATION */}
                  <g transform="translate(268, 88)">
                    <rect width="52" height="44" rx="6" fill="#FBF6EB" stroke="#E8D3A8" strokeWidth="1.5" />
                    <text x="26" y="26" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8E6523">ReLU</text>
                  </g>

                  {/* Line from ReLU to Weight Layer 2 */}
                  <line
                    x1="320"
                    y1="110"
                    x2="350"
                    y2="110"
                    stroke="#6E1A2B"
                    strokeWidth="2.5"
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-forward)' : undefined}
                  />

                  {/* 4. WEIGHT LAYER 2 */}
                  <g transform="translate(355, 80)">
                    <rect width="88" height="60" rx="6" fill="#FAF5EE" stroke="#E8E2D9" strokeWidth="1.5" />
                    <text x="44" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1D1819">Weight Layer</text>
                    <text x="44" y="42" textAnchor="middle" fontSize="10" fill="#625956" className="font-mono-num">
                      w₂ = {weightW2.toFixed(2)}
                    </text>
                    <text x="44" y="74" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8E6523">3×3 Conv / BN</text>
                  </g>

                  {/* Line from Weight 2 into Addition Node (Carrying F(x)) */}
                  <line
                    x1="443"
                    y1="110"
                    x2="526"
                    y2="110"
                    stroke="#6E1A2B"
                    strokeWidth="2.5"
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-forward)' : undefined}
                  />
                  <text x="485" y="96" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6E1A2B">
                    F(x) = {residualBlockSim.fx.toFixed(2)}
                  </text>

                  {/* 5. THE RESNET IDENTITY SHORTCUT HIGHWAY (Bypassing layers) */}
                  <path
                    d="M 105 110 C 105 235, 545 235, 545 133"
                    fill="none"
                    stroke={diagramMode === 'backward' ? '#8E6523' : '#C28E38'}
                    strokeWidth={diagramMode === 'backward' ? '3.5' : '3'}
                    strokeDasharray={diagramMode === 'backward' ? 'none' : '5 4'}
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-highway)' : undefined}
                  />

                  {/* Identity Highway Label Badge */}
                  <g transform="translate(325, 215)">
                    <rect x="-85" y="-14" width="170" height="28" rx="6" fill="#FBF6EB" stroke="#E8D3A8" strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8E6523">
                      Identity Shortcut x = {inputSignalX.toFixed(2)}
                    </text>
                  </g>

                  {/* 6. ELEMENT-WISE ADDITION NODE (⊕) */}
                  <g transform="translate(545, 110)">
                    <circle r="18" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2.5" className="shadow-2xs" />
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#6E1A2B" strokeWidth="2.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#6E1A2B" strokeWidth="2.5" />
                    <text x="0" y="-24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6E1A2B">
                      F(x) + x
                    </text>
                  </g>

                  {/* Line from Addition to Final ReLU */}
                  <line
                    x1="563"
                    y1="110"
                    x2="595"
                    y2="110"
                    stroke="#6E1A2B"
                    strokeWidth="2.5"
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-forward)' : undefined}
                  />

                  {/* 7. POST-ADDITION RELU & FINAL OUTPUT */}
                  <g transform="translate(600, 88)">
                    <rect width="48" height="44" rx="6" fill="#FBF6EB" stroke="#E8D3A8" strokeWidth="1.5" />
                    <text x="24" y="26" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8E6523">ReLU</text>
                  </g>

                  <line
                    x1="648"
                    y1="110"
                    x2="675"
                    y2="110"
                    stroke="#6E1A2B"
                    strokeWidth="2.5"
                    markerEnd={diagramMode === 'forward' ? 'url(#arrow-forward)' : undefined}
                  />

                  {/* Final Output Label */}
                  <g transform="translate(695, 110)">
                    <circle r="18" fill="#6E1A2B" />
                    <text x="0" y="-2" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFFFFF">H(x)</text>
                    <text x="0" y="10" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFFFFF" className="font-mono-num">
                      {residualBlockSim.hx.toFixed(2)}
                    </text>
                    <text x="0" y="34" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6E1A2B">Output</text>
                  </g>
                </svg>
              </div>

              {/* Legend & Mechanics */}
              <div className="pt-4 border-t border-[#E8E2D9] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-[#1D1819] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                    Forward Pass Intuition
                  </div>
                  <p className="text-[#625956] leading-relaxed">
                    The incoming feature signal <code>x</code> bifurcates: one branch computes a learned residual modification <code>F(x)</code> through two convolution layers, while the shortcut carries the undisturbed identity signal <code>x</code>. They sum together element-wise: <code>H(x) = F(x) + x</code>.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#1D1819] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#C28E38]" />
                    Backward Gradient Highway Intuition
                  </div>
                  <p className="text-[#625956] leading-relaxed">
                    During backpropagation, the gradient splits at the addition gate <code>⊕</code>. The term <code>∂L/∂H · 1.0</code> flows back unobstructed through the identity highway directly to the early layers, bypassing weight matrices and completely resolving the degradation problem.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Parameter Controls for Architecture Diagram */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                Interactive Signal & Weight Controls
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="res-x" className="font-semibold text-[#1D1819]">Input Signal x</label>
                    <span className="font-mono-num font-bold text-[#6E1A2B]">{inputSignalX.toFixed(2)}</span>
                  </div>
                  <input
                    id="res-x"
                    type="range"
                    min="-2.0"
                    max="3.0"
                    step="0.1"
                    value={inputSignalX}
                    onChange={e => setInputSignalX(parseFloat(e.target.value))}
                    className="w-full accent-[#6E1A2B] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="res-w1" className="font-semibold text-[#1D1819]">Weight Layer 1 (w₁)</label>
                    <span className="font-mono-num font-bold text-[#8E6523]">{weightW1.toFixed(2)}</span>
                  </div>
                  <input
                    id="res-w1"
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.1"
                    value={weightW1}
                    onChange={e => setWeightW1(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="res-w2" className="font-semibold text-[#1D1819]">Weight Layer 2 (w₂)</label>
                    <span className="font-mono-num font-bold text-[#8E6523]">{weightW2.toFixed(2)}</span>
                  </div>
                  <input
                    id="res-w2"
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.1"
                    value={weightW2}
                    onChange={e => setWeightW2(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WATERFALL GRADIENT HIGHWAY COMPARISON */}
        {activeTab === 'gradient-highway' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Waterfall Comparison Chart */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956] flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#6E1A2B]" />
                  Gradient Magnitude Waterfall across {totalLayers} Layers (Output → Input)
                </h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#C28E38]">
                    <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span> Plain Network
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-[#6E1A2B]">
                    <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span> ResNet Skip Highway
                  </span>
                </div>
              </div>

              {/* Waterfall SVG Chart */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-5 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-[#625956] font-mono-num border-b border-[#E8E2D9] pb-1">
                    <span>Layer 1 (Earliest Input Layer)</span>
                    <span>Layer {totalLayers} (Loss/Output)</span>
                  </div>

                  {/* Gradient Bars per sampled layer */}
                  <div className="space-y-1.5 pt-2">
                    {gradientSteps.filter((_, idx) => idx % Math.max(1, Math.floor(totalLayers / 12)) === 0 || idx === totalLayers - 1).map((step) => {
                      const plainWidthPct = Math.min(100, Math.max(1, step.plainGradientMagnitude * 100));
                      const resnetWidthPct = Math.min(100, Math.max(5, (step.resnetGradientMagnitude / 1.25) * 100));

                      return (
                        <div key={`step-${step.layerIndex}`} className="flex items-center gap-3 text-xs">
                          <span className="w-16 font-mono-num text-[11px] text-[#625956] text-right">
                            Layer {step.layerIndex}
                          </span>
                          <div className="flex-1 space-y-1">
                            {/* ResNet Bar */}
                            <div className="w-full bg-[#F3EBEF] h-3.5 rounded-full overflow-hidden flex">
                              <div
                                className="bg-[#6E1A2B] h-full transition-all duration-300 rounded-full flex items-center justify-end pr-1 text-[9px] text-white font-mono-num font-bold"
                                style={{ width: `${resnetWidthPct}%` }}
                              >
                                {step.resnetGradientMagnitude.toFixed(2)}
                              </div>
                            </div>

                            {/* Plain Network Bar */}
                            <div className="w-full bg-[#FAF5EE] h-3.5 rounded-full overflow-hidden flex">
                              <div
                                className="bg-[#C28E38] h-full transition-all duration-300 rounded-full flex items-center justify-end pr-1 text-[9px] text-white font-mono-num font-bold"
                                style={{ width: `${plainWidthPct}%` }}
                              >
                                {step.plainGradientMagnitude > 0.009 ? step.plainGradientMagnitude.toFixed(3) : '<0.001'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Diagnostic Banner */}
                <div className="mt-4 pt-3 border-t border-[#E8E2D9] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {earliestPlainGrad < 0.001 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FDF2F4] text-[#B91C1C] border border-[#FCA5A5] font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Vanishing Gradient in Plain Network (∇ = {earliestPlainGrad.toExponential(2)})
                      </span>
                    ) : (
                      <span className="text-[#625956]">Plain network gradient healthy at small depth</span>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ResNet Highway Intact (∇ = {earliestResNetGrad.toFixed(2)})
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Controls & Math Derivation */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Depth & Damping Controls
                </h4>

                {/* Depth Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#1D1819]">Network Depth (Layers)</span>
                    <span className="font-mono-num font-bold text-[#6E1A2B]">{totalLayers}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={totalLayers}
                    onChange={e => setTotalLayers(parseInt(e.target.value))}
                    className="w-full accent-[#6E1A2B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#625956] font-mono-num">
                    <span>5 layers</span>
                    <span>20 (VGG)</span>
                    <span>50 (ResNet-50)</span>
                  </div>
                </div>

                {/* Average Local Derivative */}
                <div className="space-y-1.5 pt-2 border-t border-[#E8E2D9]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#1D1819]">Local Layer Factor γ</span>
                    <span className="font-mono-num font-bold text-[#8E6523]">{averageLocalGrad.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="0.95"
                    step="0.05"
                    value={averageLocalGrad}
                    onChange={e => setAverageLocalGrad(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38] cursor-pointer"
                  />
                  <div className="text-[10px] text-[#625956]">
                    Represents local activation slope φ&apos;(z) × w. Values &lt; 1 cause compounding decay in plain networks.
                  </div>
                </div>

                {/* Mathematical Identity Highway Formulation */}
                <div className="pt-2 border-t border-[#E8E2D9] space-y-2 text-xs text-[#625956]">
                  <div className="font-bold text-[#1D1819] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#C28E38]" />
                    The Residual Gradient Highway
                  </div>
                  <div className="font-mono-num text-[11px] text-[#6E1A2B] bg-[#FAF8F5] p-2.5 rounded border border-[#E8E2D9] leading-relaxed">
                    ∂L/∂x = ∂L/∂H · (∂F/∂x + <strong>I</strong>)
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    The additive identity matrix <strong>+ I</strong> guarantees that even if the weight branch derivative ∂F/∂x vanishes completely to zero, the gradient flows directly through the addition gate with magnitude <strong>1.0</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOTTLENECK BLOCKS */}
        {activeTab === 'bottleneck-blocks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Block Card */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#1D1819]">
                    Basic Residual Block (ResNet-18 / 34)
                  </h4>
                  <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#FAF5EE] border border-[#E8E2D9] text-[#625956]">
                    2× (3×3 Conv)
                  </span>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg text-xs font-mono-num text-[#1D1819] space-y-1">
                  <div>Input: 64 channels</div>
                  <div>Conv1: 3×3 conv (64 → 64)</div>
                  <div>Conv2: 3×3 conv (64 → 64)</div>
                  <div>Addition: Output = F(x) + x</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                  <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E8E2D9]">
                    <div className="text-[10px] text-[#625956]">Parameters</div>
                    <div className="font-bold text-[#1D1819]">{blockComparison.basicBlock.parameters.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E8E2D9]">
                    <div className="text-[10px] text-[#625956]">FLOPs (56×56 map)</div>
                    <div className="font-bold text-[#1D1819]">{(blockComparison.basicBlock.flops / 1e6).toFixed(1)} M</div>
                  </div>
                </div>
              </div>

              {/* Bottleneck Block Card */}
              <div className="bg-white border-2 border-[#6E1A2B]/40 rounded-xl p-5 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#6E1A2B]">
                    Bottleneck Block (ResNet-50 / 101 / 152)
                  </h4>
                  <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#F9ECEF] border border-[#6E1A2B]/20 text-[#6E1A2B] font-semibold">
                    1×1 → 3×3 → 1×1
                  </span>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded-lg text-xs font-mono-num text-[#1D1819] space-y-1">
                  <div>Input: 256 channels (4× wider representation)</div>
                  <div>Conv1: 1×1 conv (256 → 64) <span className="text-[#8E6523]">[Squeeze]</span></div>
                  <div>Conv2: 3×3 conv (64 → 64)   <span className="text-[#8E6523]">[Spatial]</span></div>
                  <div>Conv3: 1×1 conv (64 → 256)  <span className="text-[#8E6523]">[Restore]</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                  <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E8E2D9]">
                    <div className="text-[10px] text-[#625956]">Parameters</div>
                    <div className="font-bold text-[#6E1A2B]">{blockComparison.bottleneckBlock.parameters.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E8E2D9]">
                    <div className="text-[10px] text-[#625956]">Parameter Savings</div>
                    <div className="font-bold text-[#15803D]">
                      {blockComparison.flavourSavingsPercent.toFixed(1)}% savings
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs text-[#625956] leading-relaxed space-y-2">
              <div className="font-bold text-[#1D1819] text-sm">
                Why Bottleneck Blocks Enable 152-Layer Deep Architectures
              </div>
              <p>
                In deep networks like ResNet-50 and ResNet-101, stacking 3×3 convolutions across wide 256-channel layers becomes computationally prohibitive. By using a 1×1 convolution to compress 256 channels down to 64, performing the spatial 3×3 convolution in the lightweight 64-channel subspace, and expanding back to 256 with another 1×1 convolution, ResNet-50 achieves vastly higher expressive capacity while consuming <strong>fewer FLOPs</strong> than a 34-layer network of basic blocks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
