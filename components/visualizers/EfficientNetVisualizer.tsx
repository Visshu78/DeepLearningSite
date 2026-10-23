'use client';

import React, { useState, useMemo } from 'react';
import {
  EFFICIENTNET_MODELS,
  computeCompoundScaling,
  compareSeparableConvolution,
  computeSqueezeExcitation,
  simulateMBConvBlock,
  EFFICIENTNET_B0_STAGES,
  EfficientNetStage
} from '@/lib/math/efficientnet';
import {
  Zap,
  Layers,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Cpu,
  BarChart2,
  Maximize2
} from 'lucide-react';

export function EfficientNetVisualizer() {
  const [activeTab, setActiveTab] = useState<'mbconv-circuit' | 'network-macro' | 'compound-scaling' | 'separable-conv'>('mbconv-circuit');
  
  // MBConv Circuit parameters
  const [expansionFactor, setExpansionFactor] = useState<number>(6); // t = 1 or 6
  const [kernelSize, setKernelSize] = useState<number>(3);           // 3 or 5
  const [stride, setStride] = useState<number>(1);                   // 1 or 2
  const [inChannels, setInChannels] = useState<number>(32);
  const [outChannels, setOutChannels] = useState<number>(32);
  const [seReductionRatio, setSeReductionRatio] = useState<number>(4);
  const [selectedChannelProbe, setSelectedChannelProbe] = useState<number>(1);

  // Macro-architecture pipeline selected stage
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(2); // Stage 3 by default

  // Compound scaling selected phi
  const [selectedPhi, setSelectedPhi] = useState<number>(0);

  // Separable Conv parameters
  const [sepInChannels, setSepInChannels] = useState<number>(64);
  const [sepOutChannels, setSepOutChannels] = useState<number>(128);
  const [sepKernelSize, setSepKernelSize] = useState<number>(3);

  // MBConv simulation result
  const mbconvSim = useMemo(() => {
    return simulateMBConvBlock({
      inChannels,
      outChannels,
      expansionFactor,
      kernelSize,
      stride,
      seReductionRatio,
      inputHeight: 28,
      inputWidth: 28
    });
  }, [inChannels, outChannels, expansionFactor, kernelSize, stride, seReductionRatio]);

  // Selected macro stage
  const selectedStage: EfficientNetStage = useMemo(() => {
    return EFFICIENTNET_B0_STAGES[selectedStageIndex] || EFFICIENTNET_B0_STAGES[0];
  }, [selectedStageIndex]);

  // Compound scaling stats for current phi
  const currentModel = useMemo(() => {
    const preset = EFFICIENTNET_MODELS.find(m => m.phi === selectedPhi);
    if (preset) return preset;
    return computeCompoundScaling(selectedPhi);
  }, [selectedPhi]);

  // Separable Conv comparison
  const separableComparison = useMemo(() => {
    return compareSeparableConvolution(sepInChannels, sepOutChannels, sepKernelSize, 28, 28);
  }, [sepInChannels, sepOutChannels, sepKernelSize]);

  return (
    <div className="bg-[#FCFAF7] border border-[#E8E2D9] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6E1A2B] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B]">
              EFFICIENTNET ARCHITECTURAL CIRCUIT & COMPOUND SCALING LAB
            </span>
          </div>
          <p className="text-xs text-[#625956]">
            Interactive MBConv block with Squeeze-and-Excitation, macro-architecture stages, and compound scaling
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-[#EFE9DF] p-1 rounded-lg">
          <button
            id="tab-mbconv-circuit"
            type="button"
            onClick={() => setActiveTab('mbconv-circuit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'mbconv-circuit'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            1. MBConv Architecture Circuit
          </button>
          <button
            id="tab-network-macro"
            type="button"
            onClick={() => setActiveTab('network-macro')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'network-macro'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            2. EfficientNet-B0 Macro Pipeline
          </button>
          <button
            id="tab-compound-scaling"
            type="button"
            onClick={() => setActiveTab('compound-scaling')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'compound-scaling'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            3. Compound Scaling (B0 - B7)
          </button>
          <button
            id="tab-separable-conv"
            type="button"
            onClick={() => setActiveTab('separable-conv')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'separable-conv'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            4. Depthwise Separable Conv
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* TAB 1: MBCONV & SE ARCHITECTURE CIRCUIT */}
        {activeTab === 'mbconv-circuit' && (
          <div className="space-y-6">
            {/* Control Bar: Configuration dials */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EAE1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C28E38]"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                    MBConv Block Configuration:
                  </span>
                  <span className="text-xs font-mono-num font-bold text-[#6E1A2B] bg-[#FBF6EB] px-2 py-0.5 rounded border border-[#E8D3A8]">
                    MBConv{expansionFactor} (k={kernelSize}×{kernelSize}, s={stride}, Cin={inChannels}, Cout={outChannels})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    mbconvSim.hasSkipConnection
                      ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                      : 'bg-[#F4EFEB] text-[#8C827A] border border-[#E8E2D9]'
                  }`}>
                    {mbconvSim.hasSkipConnection ? '✓ Identity Skip Active' : '✕ No Skip (Stride 2 or Cin ≠ Cout)'}
                  </span>
                </div>
              </div>

              {/* Dials grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Expansion Factor t */}
                <div className="space-y-1">
                  <label htmlFor="eff-expansion-btn" className="text-[11px] font-bold text-[#1D1819] block">
                    Expansion Factor (t)
                  </label>
                  <div className="flex rounded-md overflow-hidden border border-[#E8E2D9]">
                    <button
                      id="eff-expansion-btn-1"
                      type="button"
                      onClick={() => setExpansionFactor(1)}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        expansionFactor === 1 ? 'bg-[#6E1A2B] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      t=1 (MBConv1)
                    </button>
                    <button
                      id="eff-expansion-btn-6"
                      type="button"
                      onClick={() => setExpansionFactor(6)}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        expansionFactor === 6 ? 'bg-[#6E1A2B] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      t=6 (MBConv6)
                    </button>
                  </div>
                </div>

                {/* Kernel Size k */}
                <div className="space-y-1">
                  <label htmlFor="eff-kernel-btn" className="text-[11px] font-bold text-[#1D1819] block">
                    Filter Kernel (k)
                  </label>
                  <div className="flex rounded-md overflow-hidden border border-[#E8E2D9]">
                    <button
                      id="eff-kernel-btn-3"
                      type="button"
                      onClick={() => setKernelSize(3)}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        kernelSize === 3 ? 'bg-[#6E1A2B] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      3×3 Conv
                    </button>
                    <button
                      id="eff-kernel-btn-5"
                      type="button"
                      onClick={() => setKernelSize(5)}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        kernelSize === 5 ? 'bg-[#6E1A2B] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      5×5 Conv
                    </button>
                  </div>
                </div>

                {/* Stride s */}
                <div className="space-y-1">
                  <label htmlFor="eff-stride-btn" className="text-[11px] font-bold text-[#1D1819] block">
                    Stride & Downsampling (s)
                  </label>
                  <div className="flex rounded-md overflow-hidden border border-[#E8E2D9]">
                    <button
                      id="eff-stride-btn-1"
                      type="button"
                      onClick={() => {
                        setStride(1);
                        setOutChannels(inChannels);
                      }}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        stride === 1 ? 'bg-[#6E1A2B] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      s=1 (Preserve)
                    </button>
                    <button
                      id="eff-stride-btn-2"
                      type="button"
                      onClick={() => {
                        setStride(2);
                        setOutChannels(inChannels * 2);
                      }}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        stride === 2 ? 'bg-[#6E1A2B] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      s=2 (Downsample)
                    </button>
                  </div>
                </div>

                {/* Squeeze Ratio r */}
                <div className="space-y-1">
                  <label htmlFor="eff-se-ratio" className="text-[11px] font-bold text-[#1D1819] block">
                    SE Reduction Ratio (r)
                  </label>
                  <div className="flex rounded-md overflow-hidden border border-[#E8E2D9]">
                    <button
                      id="eff-se-ratio-4"
                      type="button"
                      onClick={() => setSeReductionRatio(4)}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        seReductionRatio === 4 ? 'bg-[#8E6523] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      r = 4 (Standard)
                    </button>
                    <button
                      id="eff-se-ratio-16"
                      type="button"
                      onClick={() => setSeReductionRatio(16)}
                      className={`flex-1 py-1 text-xs font-mono-num font-bold transition-colors cursor-pointer ${
                        seReductionRatio === 16 ? 'bg-[#8E6523] text-white' : 'bg-white text-[#54484E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      r = 16 (Lightweight)
                    </button>
                  </div>
                </div>

                {/* Channel Width Cin / Cout */}
                <div className="space-y-1">
                  <label htmlFor="eff-channels-preset" className="text-[11px] font-bold text-[#1D1819] block">
                    Channel Width (Cin → Cout)
                  </label>
                  <select
                    id="eff-channels-preset"
                    value={`${inChannels}-${outChannels}`}
                    onChange={(e) => {
                      const [cin, cout] = e.target.value.split('-').map(Number);
                      setInChannels(cin);
                      setOutChannels(cout);
                    }}
                    className="w-full text-xs font-mono-num bg-white border border-[#E8E2D9] rounded p-1 text-[#1D1819]"
                  >
                    <option value="32-32">32 → 32 (Residual Match)</option>
                    <option value="32-64">32 → 64 (Channel Expansion)</option>
                    <option value="64-64">64 → 64 (Residual Match)</option>
                    <option value="64-128">64 → 128 (Channel Expansion)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SVG Interactive Architecture Block Diagram */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-6 shadow-2xs overflow-x-auto">
              <div className="min-w-[860px]">
                <svg viewBox="0 0 920 330" className="w-full h-auto select-none">
                  <defs>
                    <marker
                      id="eff-arrow-maroon"
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
                      id="eff-arrow-amber"
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
                      id="eff-arrow-green"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#15803D" />
                    </marker>
                    <marker
                      id="eff-arrow-gray"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#A8A29E" />
                    </marker>

                    {/* Gradient for MBConv block container */}
                    <linearGradient id="mbconv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFDFB" />
                      <stop offset="100%" stopColor="#FAF7F2" />
                    </linearGradient>
                  </defs>

                  {/* Outer MBConv Block Bounding Outline */}
                  <rect
                    x="125"
                    y="100"
                    width="660"
                    height="195"
                    rx="14"
                    fill="url(#mbconv-bg)"
                    stroke="#D8CFBF"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="140" y="122" fontSize="11" fontWeight="700" fill="#8E6523" letterSpacing="0.05em">
                    MOBILE INVERTED BOTTLENECK (MBCONV BLOCK)
                  </text>
                  <text x="560" y="122" fontSize="10" fontWeight="600" fill="#625956">
                    FLOP Savings: ~{mbconvSim.expandedSavingsPercent}% vs standard conv
                  </text>

                  {/* Top Identity Skip Highway */}
                  {mbconvSim.hasSkipConnection ? (
                    <g>
                      <path
                        d="M 85 190 L 85 45 L 825 45 L 825 174"
                        fill="none"
                        stroke="#C28E38"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        markerEnd="url(#eff-arrow-amber)"
                      />
                      {/* Highway label badge */}
                      <rect x="350" y="32" width="220" height="26" rx="6" fill="#FAF5EE" stroke="#C28E38" strokeWidth="1.5" />
                      <text x="460" y="49" fontSize="10.5" fontWeight="700" fill="#8E6523" textAnchor="middle">
                        Identity Skip Highway (x unattenuated)
                      </text>
                    </g>
                  ) : (
                    <g>
                      <path
                        d="M 85 190 L 85 45 L 825 45 L 825 174"
                        fill="none"
                        stroke="#D5CEC2"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        markerEnd="url(#eff-arrow-gray)"
                      />
                      <rect x="340" y="32" width="240" height="26" rx="6" fill="#F4EFEB" stroke="#D5CEC2" strokeWidth="1" />
                      <text x="460" y="49" fontSize="10.5" fontWeight="600" fill="#8C827A" textAnchor="middle">
                        Skip Inactive: Stride=2 (Resolution {28}→{mbconvSim.outputHeight})
                      </text>
                    </g>
                  )}

                  {/* 1. INPUT NODE X */}
                  <g>
                    <rect x="15" y="155" width="70" height="70" rx="8" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
                    <text x="50" y="180" fontSize="13" fontWeight="800" fill="#6E1A2B" textAnchor="middle">X</text>
                    <text x="50" y="198" fontSize="10" fontWeight="700" fill="#1D1819" textAnchor="middle">Input</text>
                    <text x="50" y="214" fontSize="9" fontWeight="600" fill="#625956" textAnchor="middle">
                      {28}×{28}×{inChannels}
                    </text>

                    {/* Arrow to Expansion */}
                    <line x1="85" y1="190" x2="142" y2="190" stroke="#6E1A2B" strokeWidth="2.5" markerEnd="url(#eff-arrow-maroon)" />
                  </g>

                  {/* 2. EXPANSION: 1x1 CONV */}
                  <g>
                    <rect x="145" y="145" width="105" height="90" rx="8" fill="#FAF5EE" stroke="#6E1A2B" strokeWidth="2" />
                    <rect x="145" y="145" width="105" height="22" rx="8" fill="#6E1A2B" />
                    <text x="197" y="160" fontSize="10" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                      1. 1×1 EXPANSION
                    </text>
                    <text x="197" y="185" fontSize="11" fontWeight="700" fill="#1D1819" textAnchor="middle">
                      Factor t = {expansionFactor}
                    </text>
                    <text x="197" y="202" fontSize="9" fontWeight="600" fill="#6E1A2B" textAnchor="middle">
                      BN + Swish
                    </text>
                    <text x="197" y="222" fontSize="9.5" fontWeight="700" fill="#625956" textAnchor="middle">
                      {inChannels} → {mbconvSim.expandedChannels} ch
                    </text>

                    {/* Arrow to Depthwise */}
                    <line x1="250" y1="190" x2="282" y2="190" stroke="#6E1A2B" strokeWidth="2.5" markerEnd="url(#eff-arrow-maroon)" />
                  </g>

                  {/* 3. DEPTHWISE CONV */}
                  <g>
                    <rect x="285" y="145" width="115" height="90" rx="8" fill="#FAF5EE" stroke="#8E6523" strokeWidth="2" />
                    <rect x="285" y="145" width="115" height="22" rx="8" fill="#8E6523" />
                    <text x="342" y="160" fontSize="10" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                      2. DEPTHWISE CONV
                    </text>
                    <text x="342" y="185" fontSize="11" fontWeight="700" fill="#1D1819" textAnchor="middle">
                      {kernelSize}×{kernelSize} Spatial Filter
                    </text>
                    <text x="342" y="202" fontSize="9" fontWeight="600" fill="#8E6523" textAnchor="middle">
                      Stride = {stride} | BN + Swish
                    </text>
                    <text x="342" y="222" fontSize="9.5" fontWeight="700" fill="#625956" textAnchor="middle">
                      {mbconvSim.outputHeight}×{mbconvSim.outputWidth}×{mbconvSim.expandedChannels}
                    </text>

                    {/* Arrow to SE sub-network */}
                    <line x1="400" y1="190" x2="432" y2="190" stroke="#8E6523" strokeWidth="2.5" markerEnd="url(#eff-arrow-amber)" />
                  </g>

                  {/* 4. SQUEEZE & EXCITATION ATTENTION SUB-NETWORK */}
                  <g>
                    <rect x="435" y="132" width="195" height="116" rx="8" fill="#FDFBF7" stroke="#C28E38" strokeWidth="2" />
                    <rect x="435" y="132" width="195" height="20" rx="8" fill="#C28E38" />
                    <text x="532" y="146" fontSize="9.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                      3. SQUEEZE & EXCITING (SE ATTENTION)
                    </text>

                    {/* Squeeze GAP */}
                    <rect x="445" y="160" width="46" height="34" rx="4" fill="#FAF5EE" stroke="#D8CFBF" strokeWidth="1" />
                    <text x="468" y="174" fontSize="8.5" fontWeight="700" fill="#1D1819" textAnchor="middle">GAP</text>
                    <text x="468" y="187" fontSize="7.5" fontWeight="600" fill="#625956" textAnchor="middle">1×1×C</text>

                    <line x1="491" y1="177" x2="502" y2="177" stroke="#C28E38" strokeWidth="1.5" markerEnd="url(#eff-arrow-amber)" />

                    {/* FC Squeeze */}
                    <rect x="505" y="160" width="42" height="34" rx="4" fill="#FAF5EE" stroke="#D8CFBF" strokeWidth="1" />
                    <text x="526" y="174" fontSize="8.5" fontWeight="700" fill="#1D1819" textAnchor="middle">FC 1/r</text>
                    <text x="526" y="187" fontSize="7.5" fontWeight="600" fill="#8E6523" textAnchor="middle">Swish</text>

                    <line x1="547" y1="177" x2="558" y2="177" stroke="#C28E38" strokeWidth="1.5" markerEnd="url(#eff-arrow-amber)" />

                    {/* FC Excite + Sigmoid */}
                    <rect x="561" y="160" width="58" height="34" rx="4" fill="#FAF5EE" stroke="#D8CFBF" strokeWidth="1" />
                    <text x="590" y="174" fontSize="8.5" fontWeight="700" fill="#1D1819" textAnchor="middle">FC + σ</text>
                    <text x="590" y="187" fontSize="7.5" fontWeight="700" fill="#C28E38" textAnchor="middle">s ∈ (0,1)</text>

                    {/* Recalibrate Multiply node */}
                    <circle cx="532" cy="225" r="13" fill="#FAF5EE" stroke="#C28E38" strokeWidth="2" />
                    <text x="532" y="230" fontSize="15" fontWeight="800" fill="#8E6523" textAnchor="middle">⊗</text>
                    <text x="532" y="244" fontSize="8" fontWeight="600" fill="#625956" textAnchor="middle">Channel Scale</text>

                    {/* Line from Sigmoid down to multiply node */}
                    <path d="M 590 194 L 590 225 L 548 225" fill="none" stroke="#C28E38" strokeWidth="1.5" markerEnd="url(#eff-arrow-amber)" />

                    {/* Arrow to Linear Projection */}
                    <line x1="630" y1="190" x2="657" y2="190" stroke="#C28E38" strokeWidth="2.5" markerEnd="url(#eff-arrow-amber)" />
                  </g>

                  {/* 5. 1x1 LINEAR PROJECTION (BOTTLENECK) */}
                  <g>
                    <rect x="660" y="145" width="115" height="90" rx="8" fill="#FAF5EE" stroke="#15803D" strokeWidth="2" />
                    <rect x="660" y="145" width="115" height="22" rx="8" fill="#15803D" />
                    <text x="717" y="160" fontSize="10" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                      4. 1×1 PROJECTION
                    </text>
                    <text x="717" y="184" fontSize="10.5" fontWeight="700" fill="#1D1819" textAnchor="middle">
                      Linear Bottleneck
                    </text>
                    <text x="717" y="200" fontSize="8.5" fontWeight="700" fill="#15803D" textAnchor="middle">
                      (NO Non-Linearity)
                    </text>
                    <text x="717" y="222" fontSize="9.5" fontWeight="700" fill="#625956" textAnchor="middle">
                      {mbconvSim.expandedChannels} → {outChannels} ch
                    </text>

                    {/* Arrow to Addition Node */}
                    <line x1="775" y1="190" x2="805" y2="190" stroke="#15803D" strokeWidth="2.5" markerEnd="url(#eff-arrow-green)" />
                  </g>

                  {/* 6. ELEMENT-WISE ADDITION NODE (+) */}
                  <g>
                    <circle cx="825" cy="190" r="16" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2.5" />
                    <text x="825" y="196" fontSize="18" fontWeight="800" fill="#6E1A2B" textAnchor="middle">+</text>

                    {/* Arrow to Output */}
                    <line x1="841" y1="190" x2="865" y2="190" stroke="#6E1A2B" strokeWidth="2.5" markerEnd="url(#eff-arrow-maroon)" />
                  </g>

                  {/* 7. OUTPUT TENSOR Y */}
                  <g>
                    <rect x="868" y="155" width="45" height="70" rx="8" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
                    <text x="890" y="180" fontSize="13" fontWeight="800" fill="#6E1A2B" textAnchor="middle">Y</text>
                    <text x="890" y="198" fontSize="9.5" fontWeight="700" fill="#1D1819" textAnchor="middle">Output</text>
                    <text x="890" y="214" fontSize="8.5" fontWeight="600" fill="#625956" textAnchor="middle">
                      {mbconvSim.outputHeight}×{outChannels}
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* SE Channel Attention Interactive Probe Panel */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-bold text-[#1D1819] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C28E38]" />
                  Live Squeeze-and-Excitation Channel Attention Gating (Sigmoid Output s_c ∈ [0, 1])
                </span>
                <span className="text-[11px] font-mono-num text-[#8E6523] bg-[#FBF6EB] px-2.5 py-0.5 rounded border border-[#E8D3A8]">
                  Expanded Channels = {mbconvSim.expandedChannels} | Squeeze Bottleneck = {Math.max(1, Math.floor(mbconvSim.expandedChannels / seReductionRatio))}
                </span>
              </div>

              {/* 8-Channel Interactive Scale Inspector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {mbconvSim.channelProbes.map((probe) => {
                  const isSelected = selectedChannelProbe === probe.channelIndex;
                  return (
                    <button
                      key={`probe-${probe.channelIndex}`}
                      type="button"
                      onClick={() => setSelectedChannelProbe(probe.channelIndex)}
                      className={`p-3 text-center rounded-lg border transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF5EE] border-[#6E1A2B] ring-2 ring-[#6E1A2B]/20 shadow-xs'
                          : 'bg-[#FAF8F5] border-[#E8E2D9] hover:border-[#C28E38]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-[#625956] font-mono-num">
                        <span>Ch {probe.channelIndex}</span>
                        <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                          probe.state === 'amplified'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : probe.state === 'attenuated'
                            ? 'bg-[#FEE2E2] text-[#991B1B]'
                            : 'bg-[#FAF5EE] text-[#8E6523]'
                        }`}>
                          {probe.state === 'amplified' ? 'Boost' : probe.state === 'attenuated' ? 'Suppress' : 'Norm'}
                        </span>
                      </div>
                      <div className="text-sm font-bold font-mono-num text-[#6E1A2B] my-1">
                        s = {probe.seWeight.toFixed(2)}
                      </div>
                      <div className="w-full bg-[#E8E2D9] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            probe.state === 'amplified'
                              ? 'bg-[#15803D]'
                              : probe.state === 'attenuated'
                              ? 'bg-[#E11D48]'
                              : 'bg-[#C28E38]'
                          }`}
                          style={{ width: `${probe.seWeight * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-[#625956] font-mono-num mt-1.5">
                        GAP: {probe.gapValue.toFixed(2)} → {probe.recalibratedValue.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanatory takeaway */}
              <div className="p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-xs text-[#625956] leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#1D1819]">Why Squeeze-and-Excitation works:</strong> Standard convolutions only perform local spatial pooling and fixed channel correlations. Squeeze-and-Excitation uses global average pooling (GAP) to capture full-scene context, followed by a two-layer bottleneck MLP with Sigmoid activation to produce channel-specific attention scores $s_c \in (0, 1)$. This dynamically scales informative feature maps while extinguishing background clutter.
                </p>
              </div>
            </div>

            {/* Block Parameter & FLOP Efficiency Breakdown */}
            <div className="bg-white border-2 border-[#6E1A2B]/20 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#6E1A2B]" />
                  MBConv vs Standard Convolution Computational Efficiency
                </h4>
                <span className="text-xs font-bold font-mono-num text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded border border-[#86EFAC]">
                  {mbconvSim.expandedSavingsPercent}% Parameter & FLOP Savings vs Expanded Conv
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                  <div className="text-[11px] text-[#625956]">1×1 Expansion</div>
                  <div className="text-base font-bold font-mono-num text-[#1D1819]">
                    {mbconvSim.expansionParams.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#625956]">{inChannels} × {mbconvSim.expandedChannels}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                  <div className="text-[11px] text-[#625956]">Depthwise ({kernelSize}×{kernelSize})</div>
                  <div className="text-base font-bold font-mono-num text-[#8E6523]">
                    {mbconvSim.depthwiseParams.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#625956]">{kernelSize}² × {mbconvSim.expandedChannels}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                  <div className="text-[11px] text-[#625956]">Squeeze & Excite</div>
                  <div className="text-base font-bold font-mono-num text-[#C28E38]">
                    {mbconvSim.seParams.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#625956]">2 × ({mbconvSim.expandedChannels} × {Math.max(1, Math.floor(mbconvSim.expandedChannels / seReductionRatio))})</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                  <div className="text-[11px] text-[#625956]">1×1 Linear Projection</div>
                  <div className="text-base font-bold font-mono-num text-[#15803D]">
                    {mbconvSim.projectionParams.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#625956]">{mbconvSim.expandedChannels} × {outChannels}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF5EE] rounded-lg border border-[#E8D3A8] text-xs text-[#8E6523] flex justify-between items-center flex-wrap gap-2">
                <span>
                  <strong>Total MBConv Parameters:</strong> {mbconvSim.totalBlockParams.toLocaleString()} weights ({((mbconvSim.totalBlockFlops) / 1e6).toFixed(2)}M FLOPs)
                </span>
                <span>
                  <strong>Equivalent Expanded Conv:</strong> {mbconvSim.standardExpandedParams.toLocaleString()} weights ({((mbconvSim.standardExpandedFlops) / 1e6).toFixed(2)}M FLOPs)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NETWORK MACRO PIPELINE (B0 STAGES) */}
        {activeTab === 'network-macro' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  EfficientNet-B0 Baseline Macro-Architecture (Tan & Le, 2019)
                </h4>
                <p className="text-xs text-[#625956]">
                  Click on any stage in the 9-stage pipeline to inspect its resolution, receptive field, and block repetition
                </p>
              </div>
              <span className="text-xs font-mono-num font-bold text-[#6E1A2B] bg-[#FAF5EE] px-2.5 py-1 rounded border border-[#E8D3A8]">
                Total: 5.3M Parameters | 0.39B FLOPs | 77.1% Top-1
              </span>
            </div>

            {/* Stage Selector Horizontal Pipeline */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {EFFICIENTNET_B0_STAGES.map((stg, idx) => {
                const isSelected = selectedStageIndex === idx;
                return (
                  <button
                    key={`stg-${stg.stage}`}
                    type="button"
                    onClick={() => setSelectedStageIndex(idx)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6E1A2B] text-white border-[#6E1A2B] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-[#1D1819] hover:border-[#6E1A2B]'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-80">Stage {stg.stage}</div>
                    <div className="text-xs font-bold my-0.5 truncate">{stg.operator}</div>
                    <div className="text-[10px] font-mono-num opacity-90">{stg.resolution}</div>
                    <div className="text-[10px] font-mono-num font-semibold mt-1">
                      {stg.channels} ch
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stage Inspector Detail Box */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2 border-b border-[#F0EAE1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1D1819]">
                    Stage {selectedStage.stage}: {selectedStage.operator}
                  </span>
                  <span className="text-xs font-mono-num text-[#8E6523] bg-[#FBF6EB] px-2 py-0.5 rounded border border-[#E8D3A8]">
                    {selectedStage.numLayers} {selectedStage.numLayers === 1 ? 'layer' : 'layers (repeated)'}
                  </span>
                </div>
                <div className="text-xs text-[#625956]">
                  Spatial Resolution: <strong className="text-[#1D1819]">{selectedStage.resolution}</strong> | Channels: <strong className="text-[#1D1819]">{selectedStage.channels}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] space-y-1">
                  <div className="text-[11px] text-[#625956]">Kernel & Stride</div>
                  <div className="text-sm font-bold text-[#1D1819]">
                    {selectedStage.kernelSize}×{selectedStage.kernelSize} Kernel, Stride {selectedStage.stride}
                  </div>
                  <p className="text-[11px] text-[#625956]">
                    {selectedStage.stride === 2 ? 'Downsamples spatial grid by 2× while doubling receptive field.' : 'Preserves spatial resolution across repeated residual blocks.'}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] space-y-1">
                  <div className="text-[11px] text-[#625956]">SE Attention Ratio</div>
                  <div className="text-sm font-bold text-[#8E6523]">
                    {selectedStage.seRatio > 0 ? `r = ${selectedStage.seRatio} (1/${selectedStage.seRatio} channel compression)` : 'N/A (Standard Conv / Head)'}
                  </div>
                  <p className="text-[11px] text-[#625956]">
                    Global Average Pooling aggregates feature maps to compute dynamic gating coefficients.
                  </p>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] space-y-1">
                  <div className="text-[11px] text-[#625956]">Layer Function</div>
                  <div className="text-sm font-bold text-[#15803D]">Feature Representation</div>
                  <p className="text-[11px] text-[#625956]">{selectedStage.description}</p>
                </div>
              </div>

              {/* Architectural insight */}
              <div className="p-3 bg-[#FAF5EE] rounded-lg border border-[#E8D3A8] text-xs text-[#625956] leading-relaxed">
                <strong className="text-[#8E6523]">Macro-design insight:</strong> EfficientNet-B0 was discovered via Multi-Objective Neural Architecture Search (NAS) optimizing for both Top-1 accuracy and target FLOPs ($ACC(m) \times [FLOPS(m)/T]^w$). The resulting network uses larger $5\times5$ depthwise kernels in intermediate stages (Stages 4, 6, 7) to expand the receptive field without increasing parameter count quadratically.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPOUND SCALING LAB (B0 - B7) */}
        {activeTab === 'compound-scaling' && (
          <div className="space-y-6">
            {/* Model Variant Selector Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                Select Model Family Variant (Compound Coefficient φ)
              </span>
              <div className="flex flex-wrap gap-1">
                {EFFICIENTNET_MODELS.map((m) => (
                  <button
                    key={m.name}
                    id={`btn-phi-${m.phi}`}
                    type="button"
                    onClick={() => setSelectedPhi(m.phi)}
                    className={`px-3 py-1 text-xs font-mono-num font-bold rounded transition-all cursor-pointer ${
                      selectedPhi === m.phi
                        ? 'bg-[#6E1A2B] text-white shadow-2xs'
                        : 'bg-white border border-[#E8E2D9] text-[#54484E] hover:border-[#6E1A2B]'
                    }`}
                  >
                    B{m.phi}
                  </button>
                ))}
              </div>
            </div>

            {/* Compound Scaling Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Depth Card */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1D1819]">Depth Factor d = α^φ</span>
                  <span className="font-mono-num font-bold text-[#6E1A2B]">{currentModel.depthScale}×</span>
                </div>
                <div className="w-full bg-[#FAF5EE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#6E1A2B] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentModel.depthScale / 3.6) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#625956] leading-tight">
                  α = 1.2. Scales network layer depth gracefully to capture richer feature hierarchies without gradient vanishing.
                </p>
              </div>

              {/* Width Card */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1D1819]">Width Factor w = β^φ</span>
                  <span className="font-mono-num font-bold text-[#8E6523]">{currentModel.widthScale}×</span>
                </div>
                <div className="w-full bg-[#FAF5EE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C28E38] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentModel.widthScale / 2.0) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#625956] leading-tight">
                  β = 1.1. Scales channel capacity to capture fine-grained patterns and diverse visual features.
                </p>
              </div>

              {/* Resolution Card */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1D1819]">Resolution r = γ^φ</span>
                  <span className="font-mono-num font-bold text-[#15803D]">{currentModel.resolution}×{currentModel.resolution}</span>
                </div>
                <div className="w-full bg-[#FAF5EE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#15803D] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentModel.resolution / 600) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#625956] leading-tight">
                  γ = 1.15. Scales input image spatial resolution from 224px (B0) up to 600px (B7) for fine details.
                </p>
              </div>
            </div>

            {/* Performance Stats Panel */}
            <div className="bg-white border-2 border-[#6E1A2B]/30 rounded-xl p-5 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                <div className="text-[11px] text-[#625956]">Parameters</div>
                <div className="text-lg font-bold font-mono-num text-[#1D1819]">{currentModel.paramsMillion}M</div>
                <div className="text-[10px] text-[#625956]">vs 25.6M (ResNet-50)</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                <div className="text-[11px] text-[#625956]">Computation (FLOPs)</div>
                <div className="text-lg font-bold font-mono-num text-[#6E1A2B]">{currentModel.gflops}B</div>
                <div className="text-[10px] text-[#625956]">Doubles per unit φ</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                <div className="text-[11px] text-[#625956]">Top-1 Accuracy</div>
                <div className="text-lg font-bold font-mono-num text-[#15803D]">{currentModel.top1Accuracy}%</div>
                <div className="text-[10px] text-[#15803D]">ImageNet validation</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] text-center">
                <div className="text-[11px] text-[#625956]">Efficiency Rating</div>
                <div className="text-lg font-bold text-[#8E6523]">State of the Art</div>
                <div className="text-[10px] text-[#8E6523]">8.4× FLOP efficiency</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEPTHWISE SEPARABLE CONV */}
        {activeTab === 'separable-conv' && (
          <div className="space-y-6">
            {/* Interactive Inputs */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Depthwise Separable vs. Standard 2D Convolution Calculator
                </h4>
                <span className="text-xs font-mono-num font-bold text-[#15803D]">
                  {separableComparison.paramReductionPercent.toFixed(1)}% Parameter Reduction
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="eff-cin" className="text-xs font-semibold text-[#1D1819]">Input Channels (C_in)</label>
                  <select
                    id="eff-cin"
                    value={sepInChannels}
                    onChange={e => setSepInChannels(parseInt(e.target.value))}
                    className="w-full text-xs font-mono-num bg-white border border-[#E8E2D9] rounded p-2 text-[#1D1819]"
                  >
                    <option value={32}>32 channels</option>
                    <option value={64}>64 channels</option>
                    <option value={128}>128 channels</option>
                    <option value={256}>256 channels</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="eff-cout" className="text-xs font-semibold text-[#1D1819]">Output Channels (C_out)</label>
                  <select
                    id="eff-cout"
                    value={sepOutChannels}
                    onChange={e => setSepOutChannels(parseInt(e.target.value))}
                    className="w-full text-xs font-mono-num bg-white border border-[#E8E2D9] rounded p-2 text-[#1D1819]"
                  >
                    <option value={64}>64 channels</option>
                    <option value={128}>128 channels</option>
                    <option value={256}>256 channels</option>
                    <option value={512}>512 channels</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="eff-ksize" className="text-xs font-semibold text-[#1D1819]">Kernel Size (K × K)</label>
                  <select
                    id="eff-ksize"
                    value={sepKernelSize}
                    onChange={e => setSepKernelSize(parseInt(e.target.value))}
                    className="w-full text-xs font-mono-num bg-white border border-[#E8E2D9] rounded p-2 text-[#1D1819]"
                  >
                    <option value={3}>3×3 Filter</option>
                    <option value={5}>5×5 Filter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Standard Conv */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 space-y-3 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Standard 2D Convolution
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E2D9] font-mono-num text-xs space-y-1">
                  <div>Weights: K × K × C_in × C_out</div>
                  <div>= {sepKernelSize} × {sepKernelSize} × {sepInChannels} × {sepOutChannels}</div>
                  <div className="text-sm font-bold text-[#1D1819] pt-1">
                    {separableComparison.standardParams.toLocaleString()} parameters
                  </div>
                </div>
                <div className="text-xs text-[#625956]">
                  FLOPs (28×28 map): <strong>{(separableComparison.standardFlops / 1e6).toFixed(2)}M MACs</strong>
                </div>
              </div>

              {/* Depthwise Separable Conv */}
              <div className="bg-white border-2 border-[#15803D]/40 rounded-xl p-5 space-y-3 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#15803D] flex justify-between">
                  <span>Depthwise Separable Convolution</span>
                  <span>~8× Savings</span>
                </div>
                <div className="p-3 bg-[#DCFCE7]/30 rounded border border-[#86EFAC] font-mono-num text-xs space-y-1">
                  <div>1. Depthwise: {sepKernelSize}×{sepKernelSize}×{sepInChannels} = {(sepKernelSize * sepKernelSize * sepInChannels).toLocaleString()}</div>
                  <div>2. Pointwise (1×1): 1×1×{sepInChannels}×{sepOutChannels} = {(sepInChannels * sepOutChannels).toLocaleString()}</div>
                  <div className="text-sm font-bold text-[#15803D] pt-1">
                    {separableComparison.separableParams.toLocaleString()} parameters ({separableComparison.paramReductionPercent.toFixed(1)}% savings)
                  </div>
                </div>
                <div className="text-xs text-[#625956]">
                  FLOPs (28×28 map): <strong>{(separableComparison.separableFlops / 1e6).toFixed(2)}M MACs</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
