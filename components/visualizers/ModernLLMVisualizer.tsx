'use client';

import React, { useState, useMemo } from 'react';
import {
  computeTokenSamplingAndPerplexity,
  computeLoraForwardBackward,
  computeRagChunkingAndRetrieval,
  computeRlhfAndDpoStep,
} from '@/lib/math/modernLlm';
import { Bot } from 'lucide-react';

export type ModernLlmTab = 'tokenization' | 'lora' | 'rag' | 'rlhf' | 'quantization-kv';

interface ModernLLMVisualizerProps {
  defaultTab?: ModernLlmTab;
}

export function ModernLLMVisualizer({
  defaultTab = 'tokenization',
}: ModernLLMVisualizerProps) {
  const [activeTab, setActiveTab] = useState<ModernLlmTab>(defaultTab);

  // 8.1 Tokenization & Sampling state
  const [temperature, setTemperature] = useState<number>(0.8);
  const [topP, setTopP] = useState<number>(0.9);
  const sampRes = useMemo(
    () => computeTokenSamplingAndPerplexity([2.6, 1.5, 0.6, -0.4], temperature, topP, 0),
    [temperature, topP]
  );

  // 8.2 LoRA state
  const [loraRank, setLoraRank] = useState<number>(8);
  const [loraAlpha, setLoraAlpha] = useState<number>(16);
  const loraRes = useMemo(
    () =>
      computeLoraForwardBackward(
        4096,
        4096,
        loraRank,
        loraAlpha,
        [
          [0.5, -0.2],
          [0.1, 0.7],
        ],
        [[0.3], [-0.4]],
        [[0.5, 0.2]],
        [1.0, 0.5],
        [1.0, -0.5]
      ),
    [loraRank, loraAlpha]
  );

  // 8.3 RAG state
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [overlap, setOverlap] = useState<number>(64);
  const [queryFocus, setQueryFocus] = useState<number>(0.85);
  const ragRes = useMemo(
    () =>
      computeRagChunkingAndRetrieval(
        2000,
        chunkSize,
        overlap,
        [queryFocus, 1 - queryFocus],
        [
          [0.95, 0.15], // Chunk 1: Backprop syllabus
          [0.5, 0.5], // Chunk 2: Optimizer notes
          [0.1, 0.95], // Chunk 3: Exam schedule
        ],
        2
      ),
    [chunkSize, overlap, queryFocus]
  );

  // 8.4 RLHF state
  const [rewardChosen, setRewardChosen] = useState<number>(2.0);
  const [rewardRejected, setRewardRejected] = useState<number>(0.5);
  const [betaKl, setBetaKl] = useState<number>(0.15);
  const rlhfRes = useMemo(
    () => computeRlhfAndDpoStep(rewardChosen, rewardRejected, 0.8, betaKl),
    [rewardChosen, rewardRejected, betaKl]
  );

  // 9.6 Quantization & KV Cache state
  const [paramsB, setParamsB] = useState<number>(7);
  const [weightBits, setWeightBits] = useState<4 | 8 | 16>(4);
  const [ctxSeqLen, setCtxSeqLen] = useState<number>(4096);
  const [kvLayers, setKvLayers] = useState<number>(32);
  const quantKvRes = useMemo(() => {
    const bytesPerParam = weightBits / 8;
    const weightVramGb = paramsB * bytesPerParam;
    // KV cache for batch=1, n_kv_heads=8 (GQA), d_head=128, FP16 (2 bytes)
    const kvCacheBytes = 2 * kvLayers * 8 * 128 * ctxSeqLen * 2;
    const kvCacheGb = kvCacheBytes / 1e9;
    const totalVramGb = weightVramGb + kvCacheGb;
    const fp16WeightGb = paramsB * 2;
    const savingsRatio = fp16WeightGb / weightVramGb;
    return { weightVramGb, kvCacheGb, totalVramGb, fp16WeightGb, savingsRatio };
  }, [paramsB, weightBits, ctxSeqLen, kvLayers]);

  const tabs: { id: ModernLlmTab; label: string }[] = [
    { id: 'tokenization', label: '9.1 Tokens & Perplexity' },
    { id: 'lora', label: '9.2 LoRA Adapters' },
    { id: 'rag', label: '9.3 RAG Retrieval' },
    { id: 'rlhf', label: '9.4 RLHF & DPO' },
    { id: 'quantization-kv', label: '9.6 Quantization & KV' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 8 Modern LLM Engineering: BPE, LoRA, RAG &amp; RLHF Workbench
          </span>
        </div>

        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-[#EAE2D5]">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === t.id
                  ? 'bg-[#7A1C30] text-white'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* TAB 8.1: TOKENIZATION & PERPLEXITY */}
        {activeTab === 'tokenization' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                {['"chai"', '"coffee"', '"water"', '"juice"'].map((tok, i) => (
                  <div key={tok} className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                    <div className="text-[#786970]">{tok}</div>
                    <div className="text-sm font-bold text-[#7A1C30]">
                      {(sampRes.probs[i] * 100).toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-[#166534]">
                      Top-p: {(sampRes.topPFilteredProbs[i] * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num flex justify-between">
                <span>NLL Loss L = {sampRes.crossEntropyNats.toFixed(4)} nats</span>
                <strong className="text-[#7A1C30]">
                  Perplexity PPL = exp(L) = {sampRes.perplexity.toFixed(3)}
                </strong>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="llm-temp-slider" className="font-bold text-[#1D1819]">
                      Creativity / Sampling Temperature (T)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    id="llm-temp-slider"
                    type="range"
                    min="0.10"
                    max="2.00"
                    step="0.05"
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="llm-topp-slider" className="font-bold text-[#1D1819]">
                      Nucleus Cutoff / Top-p Threshold (p)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{topP.toFixed(2)}</span>
                  </div>
                  <input
                    id="llm-topp-slider"
                    type="range"
                    min="0.50"
                    max="1.00"
                    step="0.05"
                    value={topP}
                    onChange={e => setTopP(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8.2: LORA */}
        {activeTab === 'lora' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Frozen W_0 (4096²)</div>
                  <div className="text-sm font-bold text-[#1D1819]">16.78M</div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">LoRA B+A Params</div>
                  <div className="text-sm font-bold text-[#166534]">
                    {loraRes.loraParams.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Trainable %</div>
                  <div className="text-sm font-bold text-[#7A1C30]">
                    {loraRes.trainablePercentage.toFixed(2)}%
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Scale (α / r)</div>
                  <div className="text-sm font-bold text-[#C28E38]">
                    {loraRes.scaleFactor.toFixed(2)}×
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num">
                Merged Weight W_merged[0,0] = W_0[0,0] + (α/r)(B·A)[0,0] ={' '}
                <strong>{loraRes.mergedWeight00.toFixed(4)}</strong> (0 extra inference latency!)
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lora-rank-slider" className="font-bold text-[#1D1819]">
                      Adapter Bottleneck Rank (r)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{loraRank}</span>
                  </div>
                  <input
                    id="lora-rank-slider"
                    type="range"
                    min="2"
                    max="64"
                    step="2"
                    value={loraRank}
                    onChange={e => setLoraRank(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lora-alpha-slider" className="font-bold text-[#1D1819]">
                      LoRA Scaling Knob (α)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{loraAlpha}</span>
                  </div>
                  <input
                    id="lora-alpha-slider"
                    type="range"
                    min="4"
                    max="64"
                    step="4"
                    value={loraAlpha}
                    onChange={e => setLoraAlpha(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8.3: RAG */}
        {activeTab === 'rag' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-2.5 text-xs font-mono-num">
                {[
                  'Chunk 0: Backprop Math',
                  'Chunk 1: Adam Optimizer',
                  'Chunk 2: Exam Dates',
                ].map((title, idx) => (
                  <div
                    key={title}
                    className={`p-3 rounded border ${
                      ragRes.topKIndices.includes(idx)
                        ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                        : 'bg-[#FAF8F5] border-[#E8E2D9]'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{title}</div>
                    <div className="text-sm font-bold text-[#7A1C30] mt-1">
                      cos = {ragRes.similarities[idx].toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num">
                2,000-Token PDF split with Chunk Size {chunkSize} &amp; Overlap {overlap} →{' '}
                <strong>{ragRes.numChunks} chunks</strong> indexed in Vector DB.
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rag-chunk-slider" className="font-bold text-[#1D1819]">
                      Passage Window / Chunk Size (tokens)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{chunkSize}</span>
                  </div>
                  <input
                    id="rag-chunk-slider"
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={chunkSize}
                    onChange={e => setChunkSize(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rag-overlap-slider" className="font-bold text-[#1D1819]">
                      Boundary Cushion / Overlap (tokens)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{overlap}</span>
                  </div>
                  <input
                    id="rag-overlap-slider"
                    type="range"
                    min="0"
                    max="128"
                    step="16"
                    value={overlap}
                    onChange={e => setOverlap(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rag-query-slider" className="font-bold text-[#1D1819]">
                      Student Question Topic Direction (q₁)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{queryFocus.toFixed(2)}</span>
                  </div>
                  <input
                    id="rag-query-slider"
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={queryFocus}
                    onChange={e => setQueryFocus(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8.4: RLHF */}
        {activeTab === 'rlhf' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">P(y_w ≻ y_l)</div>
                  <div className="text-base font-bold text-[#166534]">
                    {(rlhfRes.winProbability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Bradley-Terry Loss</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {rlhfRes.rewardModelLoss.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Grad ∂L/∂r_w</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {rlhfRes.dLoss_dRewardChosen.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">KL-Penalized J</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {rlhfRes.klregularizedObjective.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rlhf-rw-slider" className="font-bold text-[#1D1819]">
                      Helpful Reply Score / Chosen Reward (r_w)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{rewardChosen.toFixed(1)}</span>
                  </div>
                  <input
                    id="rlhf-rw-slider"
                    type="range"
                    min="-2.0"
                    max="4.0"
                    step="0.2"
                    value={rewardChosen}
                    onChange={e => setRewardChosen(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rlhf-rl-slider" className="font-bold text-[#1D1819]">
                      Unhelpful Reply Score / Rejected Reward (r_l)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{rewardRejected.toFixed(1)}</span>
                  </div>
                  <input
                    id="rlhf-rl-slider"
                    type="range"
                    min="-2.0"
                    max="4.0"
                    step="0.2"
                    value={rewardRejected}
                    onChange={e => setRewardRejected(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rlhf-beta-slider" className="font-bold text-[#1D1819]">
                      Leash to Base Model / KL Weight (β)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{betaKl.toFixed(2)}</span>
                  </div>
                  <input
                    id="rlhf-beta-slider"
                    type="range"
                    min="0.00"
                    max="1.00"
                    step="0.05"
                    value={betaKl}
                    onChange={e => setBetaKl(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.6: QUANTIZATION & KV CACHE */}
        {activeTab === 'quantization-kv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Weights ({weightBits}-bit)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {quantKvRes.weightVramGb.toFixed(2)} GB
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">KV Cache (FP16)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {quantKvRes.kvCacheGb.toFixed(2)} GB
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Total Inference VRAM</div>
                  <div className="text-base font-bold text-[#166534]">
                    {quantKvRes.totalVramGb.toFixed(2)} GB
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">vs FP16 Weights</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {quantKvRes.savingsRatio.toFixed(1)}× smaller
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg text-xs font-mono-num text-[#5C4E4F] space-y-1">
                <div>
                  <strong>Weight Formula:</strong> {paramsB}B × ({weightBits}/8) B = {quantKvRes.weightVramGb.toFixed(2)} GB (FP16 = {quantKvRes.fp16WeightGb.toFixed(1)} GB)
                </div>
                <div>
                  <strong>KV-Cache Formula (batch=1, 8 KV heads, d=128, FP16):</strong> 2 × {kvLayers} × 8 × 128 × {ctxSeqLen} × 2 B = {quantKvRes.kvCacheGb.toFixed(3)} GB
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#1D1819]">Weight Precision</span>
                    <span className="font-mono-num font-bold text-[#7A1C30]">INT{weightBits === 16 ? ' / FP16' : weightBits}</span>
                  </div>
                  <div className="flex gap-2">
                    {([16, 8, 4] as const).map(bits => (
                      <button
                        key={bits}
                        type="button"
                        onClick={() => setWeightBits(bits)}
                        className={`flex-1 py-1.5 rounded text-xs font-bold border cursor-pointer ${
                          weightBits === bits
                            ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                            : 'bg-white text-[#5C4E4F] border-[#E8E2D9]'
                        }`}
                      >
                        {bits === 16 ? 'FP16' : `INT${bits}`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="qkv-params-slider" className="font-bold text-[#1D1819]">
                      Model Size (Billion Params)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{paramsB}B</span>
                  </div>
                  <input
                    id="qkv-params-slider"
                    type="range"
                    min="1"
                    max="70"
                    step="1"
                    value={paramsB}
                    onChange={e => setParamsB(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="qkv-seq-slider" className="font-bold text-[#1D1819]">
                      Context Length (Tokens S)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{ctxSeqLen}</span>
                  </div>
                  <input
                    id="qkv-seq-slider"
                    type="range"
                    min="512"
                    max="32768"
                    step="512"
                    value={ctxSeqLen}
                    onChange={e => setCtxSeqLen(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="qkv-layers-slider" className="font-bold text-[#1D1819]">
                      Transformer Layers (L)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{kvLayers}</span>
                  </div>
                  <input
                    id="qkv-layers-slider"
                    type="range"
                    min="16"
                    max="64"
                    step="8"
                    value={kvLayers}
                    onChange={e => setKvLayers(parseInt(e.target.value, 10))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
