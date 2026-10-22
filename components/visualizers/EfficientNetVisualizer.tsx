'use client';

import React, { useState, useMemo } from 'react';
import {
  EFFICIENTNET_MODELS,
  computeCompoundScaling,
  compareSeparableConvolution,
  computeSqueezeExcitation
} from '@/lib/math/efficientnet';
import { Zap, Layers, Sparkles, TrendingUp, Sliders, CheckCircle2 } from 'lucide-react';

export function EfficientNetVisualizer() {
  const [activeTab, setActiveTab] = useState<'compound-scaling' | 'separable-conv' | 'mbconv-se'>('compound-scaling');
  const [selectedPhi, setSelectedPhi] = useState<number>(0);

  // Separable Conv parameters
  const [inChannels, setInChannels] = useState<number>(64);
  const [outChannels, setOutChannels] = useState<number>(128);
  const [kernelSize, setKernelSize] = useState<number>(3);

  // Compound scaling stats for current phi
  const currentModel = useMemo(() => {
    const preset = EFFICIENTNET_MODELS.find(m => m.phi === selectedPhi);
    if (preset) return preset;
    return computeCompoundScaling(selectedPhi);
  }, [selectedPhi]);

  // Separable Conv comparison
  const separableComparison = useMemo(() => {
    return compareSeparableConvolution(inChannels, outChannels, kernelSize, 28, 28);
  }, [inChannels, outChannels, kernelSize]);

  // Squeeze and Excitation simulation
  const seResult = useMemo(() => {
    const sampleActivations = [0.85, 0.20, 1.40, 0.35, 0.95, 0.15, 1.10, 0.65];
    return computeSqueezeExcitation(sampleActivations, 4);
  }, []);

  return (
    <div className="bg-[#FCFAF7] border border-[#E8E2D9] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6E1A2B] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B]">
              EFFICIENTNET & COMPOUND SCALING LAB
            </span>
          </div>
          <p className="text-xs text-[#625956]">
            Systematically balancing depth, width, and resolution with MBConv and Squeeze-and-Excitation
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1.5 bg-[#EFE9DF] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('compound-scaling')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'compound-scaling'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            1. Compound Scaling (B0 - B7)
          </button>
          <button
            onClick={() => setActiveTab('separable-conv')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'separable-conv'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            2. Depthwise Separable Conv
          </button>
          <button
            onClick={() => setActiveTab('mbconv-se')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'mbconv-se'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            3. MBConv & SE Attention
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
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
                    onClick={() => setSelectedPhi(m.phi)}
                    className={`px-2.5 py-1 text-xs font-mono-num font-bold rounded transition-all ${
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
                    value={inChannels}
                    onChange={e => setInChannels(parseInt(e.target.value))}
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
                    value={outChannels}
                    onChange={e => setOutChannels(parseInt(e.target.value))}
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
                    value={kernelSize}
                    onChange={e => setKernelSize(parseInt(e.target.value))}
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
                  <div>= {kernelSize} × {kernelSize} × {inChannels} × {outChannels}</div>
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
                  <div>1. Depthwise: {kernelSize}×{kernelSize}×{inChannels} = {(kernelSize * kernelSize * inChannels).toLocaleString()}</div>
                  <div>2. Pointwise (1×1): 1×1×{inChannels}×{outChannels} = {(inChannels * outChannels).toLocaleString()}</div>
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

        {activeTab === 'mbconv-se' && (
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
              Inside the Mobile Inverted Bottleneck (MBConv) with Squeeze-and-Excitation
            </h4>

            {/* 5-Stage Pipeline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-white border border-[#E8E2D9] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#6E1A2B]">Stage 1</span>
                <div className="text-xs font-bold text-[#1D1819]">1×1 Expansion</div>
                <p className="text-[11px] text-[#625956]">Expands channels by factor t=6 into high-dimensional space.</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#8E6523]">Stage 2</span>
                <div className="text-xs font-bold text-[#1D1819]">Depthwise Conv</div>
                <p className="text-[11px] text-[#625956]">3×3 or 5×5 spatial filter applied per channel independently.</p>
              </div>

              <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded-lg space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-[#C28E38]">Stage 3</span>
                <div className="text-xs font-bold text-[#8E6523]">Squeeze & Excite</div>
                <p className="text-[11px] text-[#625956]">GAP + FC + Sigmoid gates channels dynamically.</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#15803D]">Stage 4</span>
                <div className="text-xs font-bold text-[#1D1819]">1×1 Projection</div>
                <p className="text-[11px] text-[#625956]">Compresses back down to bottleneck representation.</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D9] rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-[#6E1A2B]">Stage 5</span>
                <div className="text-xs font-bold text-[#1D1819]">Residual Add</div>
                <p className="text-[11px] text-[#625956]">Adds identity skip connection if dimensions match.</p>
              </div>
            </div>

            {/* Squeeze & Excitation Channel Weights Interactive View */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1D1819] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C28E38]" />
                  Live Squeeze-and-Excitation Channel Attention Gating (Sigmoid Output Scale s ∈ [0, 1])
                </span>
                <span className="text-[10px] font-mono-num text-[#8E6523] bg-[#FBF6EB] px-2 py-0.5 rounded border border-[#E8D3A8]">
                  8 Expanded Channels
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {seResult.excitationScale.map((scale, idx) => (
                  <div
                    key={`se-ch-${idx}`}
                    className="p-3 text-center rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] space-y-1.5"
                  >
                    <div className="text-[10px] text-[#625956] font-mono-num">Ch {idx + 1}</div>
                    <div className="text-sm font-bold font-mono-num text-[#6E1A2B]">{scale.toFixed(2)}</div>
                    <div className="w-full bg-[#E8E2D9] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#6E1A2B] h-full rounded-full"
                        style={{ width: `${scale * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#625956] leading-relaxed pt-2">
                Squeeze-and-Excitation dynamically computes which feature channels are most informative for the current image. Channels with low relevance are scaled down toward zero, while critical feature channels are emphasized with full unit gain.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
