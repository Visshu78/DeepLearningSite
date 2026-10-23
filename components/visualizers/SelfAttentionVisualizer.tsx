'use client';

import React, { useState, useMemo } from 'react';
import {
  computeScaledDotProductAttention,
  simulateMultiHeadAttention,
  simulateTransformerBlock,
  SAMPLE_SENTENCE_TOKENS,
  DEFAULT_Q_VECTORS,
  DEFAULT_K_VECTORS,
  DEFAULT_V_VECTORS
} from '@/lib/math/transformer';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  GitBranch,
  Sliders,
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export function SelfAttentionVisualizer() {
  const [activeTab, setActiveTab] = useState<'scaled-dot-product' | 'multi-head' | 'transformer-block'>('scaled-dot-product');

  // Scaled Dot Product state
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(3); // 'it'
  const [temperatureMode, setTemperatureMode] = useState<'standard' | 'unscaled' | 'high'>('standard');
  const [tokens, setTokens] = useState<string[]>(SAMPLE_SENTENCE_TOKENS);

  // Temperature scale
  const customScale = useMemo(() => {
    if (temperatureMode === 'unscaled') return 1.0;
    if (temperatureMode === 'high') return 6.0;
    return 2.0; // sqrt(d_k) = sqrt(4) = 2.0
  }, [temperatureMode]);

  // Self-attention calculation
  const attentionResult = useMemo(() => {
    return computeScaledDotProductAttention(
      DEFAULT_Q_VECTORS,
      DEFAULT_K_VECTORS,
      DEFAULT_V_VECTORS,
      tokens,
      customScale
    );
  }, [tokens, customScale]);

  // Multi-Head Attention state
  const [selectedHeadIdx, setSelectedHeadIdx] = useState<number>(0);
  const mhaResult = useMemo(() => {
    return simulateMultiHeadAttention(tokens, 4, 16);
  }, [tokens]);

  // Transformer block simulation state
  const [normStyle, setNormStyle] = useState<'post-ln' | 'pre-ln'>('pre-ln');
  const blockResult = useMemo(() => {
    return simulateTransformerBlock(DEFAULT_Q_VECTORS, tokens);
  }, [tokens]);

  // Selected row attention weights
  const selectedRowWeights = attentionResult.attentionWeights[selectedTokenIdx] || [];
  const selectedQueryVector = DEFAULT_Q_VECTORS[selectedTokenIdx] || [];

  return (
    <div className="bg-[#FCFAF7] border border-[#E8E2D9] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6E1A2B] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B]">
              TRANSFORMER & ATTENTION MECHANISM WORKBENCH
            </span>
          </div>
          <p className="text-xs text-[#625956]">
            Interactive Scaled Dot-Product Attention (Q, K, V), Multi-Head Subspaces, and Transformer Block Architecture
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-[#EFE9DF] p-1 rounded-lg">
          <button
            id="tab-scaled-dot-product"
            type="button"
            onClick={() => setActiveTab('scaled-dot-product')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'scaled-dot-product'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            1. Scaled Dot-Product [Q, K, V]
          </button>
          <button
            id="tab-multi-head"
            type="button"
            onClick={() => setActiveTab('multi-head')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'multi-head'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            2. Multi-Head Attention (MHA)
          </button>
          <button
            id="tab-transformer-block"
            type="button"
            onClick={() => setActiveTab('transformer-block')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'transformer-block'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            3. Transformer Block Circuit
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* TAB 1: SCALED DOT-PRODUCT ATTENTION */}
        {activeTab === 'scaled-dot-product' && (
          <div className="space-y-6">
            {/* Control Bar: Token Selection & Temperature Switcher */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                    Select Query Token to Inspect (q_i):
                  </span>
                  <div className="inline-flex rounded-lg bg-[#FAF5EE] p-0.5 border border-[#E8E2D9]">
                    {tokens.map((token, idx) => (
                      <button
                        key={`tok-${idx}`}
                        id={`btn-token-${idx}`}
                        type="button"
                        onClick={() => setSelectedTokenIdx(idx)}
                        className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                          selectedTokenIdx === idx
                            ? 'bg-[#6E1A2B] text-white shadow-2xs'
                            : 'text-[#54484E] hover:text-[#1D1819]'
                        }`}
                      >
                        &quot;{token}&quot; (pos {idx})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature Scaling Dial */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#625956] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#C28E38]" />
                    Scale 1/√d_k:
                  </span>
                  <div className="inline-flex rounded-lg bg-[#FAF5EE] p-0.5 border border-[#E8E2D9]">
                    <button
                      id="btn-scale-standard"
                      type="button"
                      onClick={() => setTemperatureMode('standard')}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                        temperatureMode === 'standard'
                          ? 'bg-[#15803D] text-white shadow-2xs'
                          : 'text-[#54484E] hover:text-[#1D1819]'
                      }`}
                    >
                      √d_k = 2.0 (Standard)
                    </button>
                    <button
                      id="btn-scale-unscaled"
                      type="button"
                      onClick={() => setTemperatureMode('unscaled')}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                        temperatureMode === 'unscaled'
                          ? 'bg-[#8E6523] text-white shadow-2xs'
                          : 'text-[#54484E] hover:text-[#1D1819]'
                      }`}
                    >
                      Scale = 1.0 (Unscaled)
                    </button>
                    <button
                      id="btn-scale-high"
                      type="button"
                      onClick={() => setTemperatureMode('high')}
                      className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer ${
                        temperatureMode === 'high'
                          ? 'bg-[#6E1A2B] text-white shadow-2xs'
                          : 'text-[#54484E] hover:text-[#1D1819]'
                      }`}
                    >
                      Scale = 6.0 (High)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Equation Flow: Q × K^T → Scaled → Softmax → Weighted V */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Pairwise Attention Heatmap Matrix (N x N) */}
              <div className="lg:col-span-6 bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                    Attention Affinity Heatmap: Softmax(Q K^T / √d_k)
                  </h4>
                  <span className="text-[11px] font-mono-num font-bold text-[#6E1A2B] bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#E8D3A8]">
                    Scale = {attentionResult.temperature}
                  </span>
                </div>

                {/* Heatmap Grid Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-[11px] font-bold text-[#625956] border-b border-[#E8E2D9] text-left">
                          Query \ Key
                        </th>
                        {tokens.map((tok, j) => (
                          <th key={`th-${j}`} className="p-2 text-[11px] font-bold text-[#1D1819] border-b border-[#E8E2D9]">
                            {tok}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((qTok, i) => {
                        const isQuerySelected = selectedTokenIdx === i;
                        return (
                          <tr
                            key={`row-${i}`}
                            className={`transition-colors ${
                              isQuerySelected ? 'bg-[#FAF5EE]/80 font-bold' : 'hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <td className="p-2.5 text-xs text-left text-[#1D1819] border-b border-[#F0EAE1] flex items-center gap-1.5">
                              {isQuerySelected && <span className="w-1.5 h-1.5 rounded-full bg-[#6E1A2B]"></span>}
                              <span className={isQuerySelected ? 'text-[#6E1A2B] font-bold' : ''}>{qTok}</span>
                            </td>
                            {tokens.map((kTok, j) => {
                              const weight = attentionResult.attentionWeights[i][j];
                              const intensity = Math.round(weight * 100);
                              return (
                                <td
                                  key={`cell-${i}-${j}`}
                                  className="p-2 text-xs font-mono-num border-b border-[#F0EAE1]"
                                  style={{
                                    backgroundColor: isQuerySelected
                                      ? `rgba(110, 26, 43, ${Math.max(0.08, weight * 0.75)})`
                                      : `rgba(194, 142, 56, ${Math.max(0.04, weight * 0.5)})`,
                                    color: weight > 0.45 ? (isQuerySelected ? '#FFFFFF' : '#1D1819') : '#1D1819'
                                  }}
                                >
                                  {weight.toFixed(3)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-[#625956] leading-relaxed pt-1">
                  Notice how row 3 (&quot;it&quot;) directs its highest attention weight ({attentionResult.attentionWeights[3][1].toFixed(3)}) toward &quot;robot&quot;. In high-dimensional embedding space, the learned query for &quot;it&quot; matches the key for its antecedent &quot;robot&quot;, performing syntactic coreference resolution!
                </p>
              </div>

              {/* Right Column: Step-by-Step Mathematical Derivation for Selected Query */}
              <div className="lg:col-span-6 bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-[#F0EAE1] pb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C28E38]" />
                    Step-by-Step for Token: &quot;{tokens[selectedTokenIdx]}&quot; (q_{selectedTokenIdx})
                  </h4>
                  <span className="text-[11px] font-mono-num text-[#625956]">d_k = 4 dimensions</span>
                </div>

                {/* Steps Accordion */}
                <div className="space-y-3 font-mono-num text-xs">
                  {/* Step 1: Query Vector */}
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#625956]">1. Query Projection (q_{selectedTokenIdx})</div>
                    <div className="text-xs text-[#1D1819]">
                      [{selectedQueryVector.map(v => v.toFixed(2)).join(', ')}]
                    </div>
                  </div>

                  {/* Step 2: Dot Products & Softmax Weights */}
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D9] space-y-2">
                    <div className="text-[10px] uppercase font-bold text-[#625956]">
                      2. Raw Dot Product (q · k) → Scaled (/ {attentionResult.temperature}) → Softmax Weight (a)
                    </div>
                    <div className="space-y-1.5">
                      {tokens.map((kTok, j) => {
                        const raw = attentionResult.rawScores[selectedTokenIdx][j];
                        const scaled = attentionResult.scaledScores[selectedTokenIdx][j];
                        const weight = selectedRowWeights[j];
                        return (
                          <div key={`calc-${j}`} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded border border-[#E8E2D9]">
                            <span className="font-sans font-bold text-[#1D1819] w-20">with &quot;{kTok}&quot;:</span>
                            <span className="text-[#625956]">raw = {raw.toFixed(2)}</span>
                            <span className="text-[#8E6523]">scaled = {scaled.toFixed(2)}</span>
                            <span className="font-bold text-[#6E1A2B]">a = {weight.toFixed(3)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Context Output Vector Z */}
                  <div className="p-3 bg-[#FAF5EE] rounded-lg border border-[#E8D3A8] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#8E6523]">
                      3. Value Aggregation: z_{selectedTokenIdx} = ∑ a_j · v_j
                    </div>
                    <div className="text-xs font-bold text-[#1D1819]">
                      [{attentionResult.contextOutputs[selectedTokenIdx].map(v => v.toFixed(3)).join(', ')}]
                    </div>
                    <p className="text-[10px] font-sans text-[#625956] leading-tight pt-1">
                      The output vector is a weighted mixture dominated by the value vector of &quot;robot&quot;.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Scaled Dot Product Matters: Gradient Vanishing Explanation */}
            <div className="bg-white border-2 border-[#6E1A2B]/20 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6E1A2B]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1819]">
                  Why Divide by √d_k? (The Vaswani et al. 2017 Scaling Theorem)
                </h4>
              </div>
              <p className="text-xs text-[#625956] leading-relaxed">
                Assume components of q and k are independent random variables with zero mean and unit variance. Their dot product has mean 0 and variance d_k (since Var(q · k) = d_k). For large dimensions (such as d_k = 64 or 128), raw dot products grow very large in magnitude. Large positive logits push the Softmax function into saturated regions where its derivative approaches 0, leading to catastrophic gradient vanishing during backpropagation. Dividing by √d_k stabilizes the variance to 1.0, guaranteeing healthy gradient flow.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-HEAD ATTENTION (MHA) */}
        {activeTab === 'multi-head' && (
          <div className="space-y-6">
            {/* Header & Head Selector */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                    Multi-Head Attention (h = 4 Heads, d_model = 16, d_k = 4)
                  </h4>
                  <p className="text-xs text-[#625956]">
                    Instead of performing a single attention function, Multi-Head Attention linearly projects Queries, Keys, and Values $h$ times into distinct representation subspaces.
                  </p>
                </div>
                <span className="text-xs font-mono-num font-bold text-[#8E6523] bg-[#FAF5EE] px-2.5 py-1 rounded border border-[#E8D3A8]">
                  MHA(Q,K,V) = Concat(head_1, ..., head_h) W^O
                </span>
              </div>

              {/* Head Selector Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {mhaResult.headWeights.map((head, idx) => (
                  <button
                    key={`head-${idx}`}
                    id={`btn-head-${idx}`}
                    type="button"
                    onClick={() => setSelectedHeadIdx(idx)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedHeadIdx === idx
                        ? 'bg-[#FAF5EE] border-[#6E1A2B] ring-2 ring-[#6E1A2B]/20 shadow-xs'
                        : 'bg-white border-[#E8E2D9] hover:border-[#C28E38]'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[#6E1A2B]">Head {head.headIndex}</div>
                    <div className="text-xs font-bold text-[#1D1819] mt-0.5 truncate">{head.headName.split(':')[1]}</div>
                    <div className="text-[10px] text-[#625956] mt-1">Subspace dim: {mhaResult.headDim}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Head Matrix & Aggregated Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selected Head Attention Pattern */}
              <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1D1819]">
                    {mhaResult.headWeights[selectedHeadIdx].headName}
                  </span>
                  <span className="text-[10px] font-mono-num text-[#6E1A2B] bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#E8D3A8]">
                    Active Subspace
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-[10px] font-bold text-[#625956] border-b border-[#E8E2D9] text-left">Q \ K</th>
                        {tokens.map((tok, j) => (
                          <th key={`mh-th-${j}`} className="p-2 text-[10px] font-bold text-[#1D1819] border-b border-[#E8E2D9]">
                            {tok}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((qTok, i) => (
                        <tr key={`mh-row-${i}`} className="hover:bg-[#FAF8F5]">
                          <td className="p-2 text-xs font-bold text-left text-[#1D1819] border-b border-[#F0EAE1]">
                            {qTok}
                          </td>
                          {tokens.map((kTok, j) => {
                            const weight = mhaResult.headWeights[selectedHeadIdx].attentionWeights[i][j];
                            return (
                              <td
                                key={`mh-cell-${i}-${j}`}
                                className="p-2 text-xs font-mono-num border-b border-[#F0EAE1]"
                                style={{
                                  backgroundColor: `rgba(110, 26, 43, ${Math.max(0.05, weight * 0.7)})`,
                                  color: weight > 0.5 ? '#FFFFFF' : '#1D1819'
                                }}
                              >
                                {weight.toFixed(3)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aggregated Multi-Head Attention (Ensemble Representation) */}
              <div className="bg-white border-2 border-[#C28E38]/30 rounded-xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#8E6523]">
                    Ensemble Attention (Mean over all 4 Heads)
                  </span>
                  <span className="text-[10px] font-mono-num text-[#8E6523] bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#E8D3A8]">
                    Full Context
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-[10px] font-bold text-[#625956] border-b border-[#E8E2D9] text-left">Q \ K</th>
                        {tokens.map((tok, j) => (
                          <th key={`agg-th-${j}`} className="p-2 text-[10px] font-bold text-[#1D1819] border-b border-[#E8E2D9]">
                            {tok}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((qTok, i) => (
                        <tr key={`agg-row-${i}`} className="hover:bg-[#FAF8F5]">
                          <td className="p-2 text-xs font-bold text-left text-[#1D1819] border-b border-[#F0EAE1]">
                            {qTok}
                          </td>
                          {tokens.map((kTok, j) => {
                            const weight = mhaResult.aggregatedOutput[i][j];
                            return (
                              <td
                                key={`agg-cell-${i}-${j}`}
                                className="p-2 text-xs font-mono-num border-b border-[#F0EAE1]"
                                style={{
                                  backgroundColor: `rgba(194, 142, 56, ${Math.max(0.05, weight * 0.7)})`,
                                  color: weight > 0.5 ? '#FFFFFF' : '#1D1819'
                                }}
                              >
                                {weight.toFixed(3)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSFORMER BLOCK CIRCUIT */}
        {activeTab === 'transformer-block' && (
          <div className="space-y-6">
            {/* Control Bar: Pre-LN vs Post-LN */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Layer Normalization Placement:
                </span>
                <div className="inline-flex rounded-lg bg-[#FAF5EE] p-0.5 border border-[#E8E2D9]">
                  <button
                    id="btn-pre-ln"
                    type="button"
                    onClick={() => setNormStyle('pre-ln')}
                    className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                      normStyle === 'pre-ln'
                        ? 'bg-[#6E1A2B] text-white shadow-2xs'
                        : 'text-[#54484E] hover:text-[#1D1819]'
                    }`}
                  >
                    Pre-LN (Modern: GPT-3, LLaMA, ViT)
                  </button>
                  <button
                    id="btn-post-ln"
                    type="button"
                    onClick={() => setNormStyle('post-ln')}
                    className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                      normStyle === 'post-ln'
                        ? 'bg-[#8E6523] text-white shadow-2xs'
                        : 'text-[#54484E] hover:text-[#1D1819]'
                    }`}
                  >
                    Post-LN (Original: Vaswani et al. 2017)
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono-num text-[#8E6523] bg-[#FBF6EB] px-2.5 py-1 rounded border border-[#E8D3A8]">
                {normStyle === 'pre-ln'
                  ? 'x_{l+1} = x_l + FFN(LN(x_l + MHA(LN(x_l))))'
                  : 'x_{l+1} = LN(x_l + FFN(LN(x_l + MHA(x_l))))'}
              </div>
            </div>

            {/* Interactive SVG Architecture Circuit Diagram of Transformer Block */}
            <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-6 shadow-2xs overflow-x-auto">
              <div className="min-w-[800px]">
                <svg viewBox="0 0 860 380" className="w-full h-auto select-none">
                  <defs>
                    <marker
                      id="tf-arrow-maroon"
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
                      id="tf-arrow-amber"
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
                      id="tf-arrow-green"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#15803D" />
                    </marker>
                  </defs>

                  {/* Outer Transformer Encoder Block Container */}
                  <rect
                    x="130"
                    y="70"
                    width="620"
                    height="260"
                    rx="14"
                    fill="#FAF8F5"
                    stroke="#D8CFBF"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="145" y="92" fontSize="11" fontWeight="700" fill="#8E6523" letterSpacing="0.05em">
                    TRANSFORMER ENCODER BLOCK (d_model = 16, h = 4 heads)
                  </text>

                  {/* 1. INPUT TOKEN EMBEDDINGS (X) */}
                  <g>
                    <rect x="25" y="165" width="75" height="70" rx="8" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
                    <text x="62" y="190" fontSize="13" fontWeight="800" fill="#6E1A2B" textAnchor="middle">X</text>
                    <text x="62" y="208" fontSize="9.5" fontWeight="700" fill="#1D1819" textAnchor="middle">Input Tokens</text>
                    <text x="62" y="222" fontSize="8.5" fontWeight="600" fill="#625956" textAnchor="middle">+ Position Enc</text>

                    {/* Arrow to Block */}
                    <line x1="100" y1="200" x2="145" y2="200" stroke="#6E1A2B" strokeWidth="2.5" markerEnd="url(#tf-arrow-maroon)" />
                  </g>

                  {/* SUB-BLOCK 1: MULTI-HEAD ATTENTION + RESIDUAL 1 */}
                  {/* Highway Skip 1 (arcs over MHA) */}
                  <path
                    d="M 120 200 L 120 120 L 375 120 L 375 182"
                    fill="none"
                    stroke="#C28E38"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd="url(#tf-arrow-amber)"
                  />
                  <text x="245" y="112" fontSize="9.5" fontWeight="700" fill="#8E6523" textAnchor="middle">
                    Residual Highway 1: x unattenuated
                  </text>

                  {/* MHA Box */}
                  <rect x="150" y="160" width="135" height="80" rx="8" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
                  <rect x="150" y="160" width="135" height="20" rx="8" fill="#6E1A2B" />
                  <text x="217" y="174" fontSize="9.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                    Multi-Head Attention
                  </text>
                  <text x="217" y="198" fontSize="10" fontWeight="700" fill="#1D1819" textAnchor="middle">
                    h = 4 Heads (Q, K, V)
                  </text>
                  <text x="217" y="214" fontSize="8.5" fontWeight="600" fill="#625956" textAnchor="middle">
                    Concat + Linear W^O
                  </text>

                  {/* Arrow from MHA to Add & Norm 1 */}
                  <line x1="285" y1="200" x2="315" y2="200" stroke="#6E1A2B" strokeWidth="2.5" markerEnd="url(#tf-arrow-maroon)" />

                  {/* Add & Norm 1 Box */}
                  <rect x="320" y="160" width="105" height="80" rx="8" fill="#FAF5EE" stroke="#8E6523" strokeWidth="2" />
                  <rect x="320" y="160" width="105" height="20" rx="8" fill="#8E6523" />
                  <text x="372" y="174" fontSize="9.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                    Add &amp; LayerNorm
                  </text>
                  <circle cx="372" cy="198" r="10" fill="#FFFFFF" stroke="#8E6523" strokeWidth="1.5" />
                  <text x="372" y="202" fontSize="12" fontWeight="800" fill="#8E6523" textAnchor="middle">+</text>
                  <text x="372" y="224" fontSize="9" fontWeight="700" fill="#1D1819" textAnchor="middle">
                    LayerNorm(x + MHA)
                  </text>

                  {/* Arrow from Add&Norm 1 to FFN */}
                  <line x1="425" y1="200" x2="455" y2="200" stroke="#8E6523" strokeWidth="2.5" markerEnd="url(#tf-arrow-amber)" />

                  {/* SUB-BLOCK 2: FEED-FORWARD NETWORK + RESIDUAL 2 */}
                  {/* Highway Skip 2 (arcs over FFN) */}
                  <path
                    d="M 440 200 L 440 120 L 690 120 L 690 182"
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd="url(#tf-arrow-green)"
                  />
                  <text x="565" y="112" fontSize="9.5" fontWeight="700" fill="#15803D" textAnchor="middle">
                    Residual Highway 2: post-MHA unattenuated
                  </text>

                  {/* FFN Box */}
                  <rect x="460" y="160" width="140" height="80" rx="8" fill="#FFFFFF" stroke="#15803D" strokeWidth="2" />
                  <rect x="460" y="160" width="140" height="20" rx="8" fill="#15803D" />
                  <text x="530" y="174" fontSize="9.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                    Feed-Forward Network
                  </text>
                  <text x="530" y="198" fontSize="10" fontWeight="700" fill="#1D1819" textAnchor="middle">
                    Linear (d_model → 4d_model)
                  </text>
                  <text x="530" y="214" fontSize="8.5" fontWeight="600" fill="#15803D" textAnchor="middle">
                    ReLU / GELU → Linear
                  </text>

                  {/* Arrow from FFN to Add & Norm 2 */}
                  <line x1="600" y1="200" x2="635" y2="200" stroke="#15803D" strokeWidth="2.5" markerEnd="url(#tf-arrow-green)" />

                  {/* Add & Norm 2 Box */}
                  <rect x="640" y="160" width="105" height="80" rx="8" fill="#FAF5EE" stroke="#8E6523" strokeWidth="2" />
                  <rect x="640" y="160" width="105" height="20" rx="8" fill="#8E6523" />
                  <text x="692" y="174" fontSize="9.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                    Add &amp; LayerNorm
                  </text>
                  <circle cx="692" cy="198" r="10" fill="#FFFFFF" stroke="#8E6523" strokeWidth="1.5" />
                  <text x="692" y="202" fontSize="12" fontWeight="800" fill="#8E6523" textAnchor="middle">+</text>
                  <text x="692" y="224" fontSize="9" fontWeight="700" fill="#1D1819" textAnchor="middle">
                    LayerNorm(x + FFN)
                  </text>

                  {/* Arrow to Block Output */}
                  <line x1="745" y1="200" x2="775" y2="200" stroke="#6E1A2B" strokeWidth="2.5" markerEnd="url(#tf-arrow-maroon)" />

                  {/* OUTPUT REPRESENTATION Z */}
                  <rect x="780" y="165" width="60" height="70" rx="8" fill="#FFFFFF" stroke="#6E1A2B" strokeWidth="2" />
                  <text x="810" y="192" fontSize="13" fontWeight="800" fill="#6E1A2B" textAnchor="middle">Z</text>
                  <text x="810" y="210" fontSize="9.5" fontWeight="700" fill="#1D1819" textAnchor="middle">Output</text>
                  <text x="810" y="222" fontSize="8.5" fontWeight="600" fill="#625956" textAnchor="middle">Tokens</text>
                </svg>
              </div>
            </div>

            {/* Architecture Comparison: Pre-LN vs Post-LN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#E8E2D9] rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6E1A2B]"></span>
                  <span className="text-xs font-bold text-[#1D1819]">Pre-LN (LLaMA, GPT-3, Mistral)</span>
                </div>
                <p className="text-xs text-[#625956] leading-relaxed">
                  LayerNorm is applied <em>before</em> the Multi-Head Attention and FFN sub-layers. Gradients can pass completely unattenuated directly through the residual stream, enabling stable training of 100+ layer transformers without delicate learning rate warmup schedules.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E8E2D9] rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8E6523]"></span>
                  <span className="text-xs font-bold text-[#1D1819]">Post-LN (Original Transformer, BERT)</span>
                </div>
                <p className="text-xs text-[#625956] leading-relaxed">
                  LayerNorm is applied <em>after</em> the residual addition. While mathematically expressive, gradients at early layers vanish exponentially without extensive warmup, limiting network depth unless carefully regularized.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
