'use client';

import React, { useState, useMemo } from 'react';
import {
  computeCosineSimilarity,
  computeWordAnalogyVector,
  simulateScalarRnnAndBptt,
  computeLstmCellStep,
  computeGruCellStep,
  computeSeq2SeqAttention,
} from '@/lib/math/sequenceModels';
import { GitCommitHorizontal } from 'lucide-react';

export type SequenceTab = 'embeddings' | 'rnn' | 'bptt' | 'lstm' | 'gru-seq2seq';

interface SequenceModelsVisualizerProps {
  defaultTab?: SequenceTab;
}

export function SequenceModelsVisualizer({
  defaultTab = 'embeddings',
}: SequenceModelsVisualizerProps) {
  const [activeTab, setActiveTab] = useState<SequenceTab>(defaultTab);

  // 5.1 Embeddings State
  const [spiceDim, setSpiceDim] = useState<number>(0.8);
  const [sweetDim, setSweetDim] = useState<number>(0.2);
  const biryaniVec: [number, number] = [0.9, 0.1];
  const jalebiVec: [number, number] = [0.1, 0.95];
  const simBiryani = useMemo(
    () => computeCosineSimilarity([spiceDim, sweetDim], biryaniVec),
    [spiceDim, sweetDim]
  );
  const simJalebi = useMemo(
    () => computeCosineSimilarity([spiceDim, sweetDim], jalebiVec),
    [spiceDim, sweetDim]
  );
  const analogyTarget = useMemo(
    () => computeWordAnalogyVector([0.2, 0.2], [0.2, 0.9], [0.85, 0.2]),
    []
  );

  // 5.2 & 5.3 RNN & BPTT State
  const [wHh, setWHh] = useState<number>(0.65);
  const [wXh, setWXh] = useState<number>(0.5);
  const sampleTokens = useMemo(() => [1.0, 0.4, -0.3, 0.8, -0.5, 0.2, 0.7, -0.4], []);
  const rnnSim = useMemo(
    () => simulateScalarRnnAndBptt(sampleTokens, wXh, wHh, 0.0),
    [sampleTokens, wXh, wHh]
  );

  // 5.4 LSTM State
  const [forgetLogit, setForgetLogit] = useState<number>(2.2);
  const [inputLogit, setInputLogit] = useState<number>(0.8);
  const [candidateLogit, setCandidateLogit] = useState<number>(1.0);
  const [cPrev, setCPrev] = useState<number>(1.4);
  const lstmOut = useMemo(
    () =>
      computeLstmCellStep({
        cPrev,
        forgetLogit,
        inputLogit,
        candidateLogit,
        outputLogit: 1.5,
      }),
    [cPrev, forgetLogit, inputLogit, candidateLogit]
  );

  // 5.5 GRU & Seq2Seq State
  const [gruUpdateLogit, setGruUpdateLogit] = useState<number>(0.4);
  const [decoderQueryX, setDecoderQueryX] = useState<number>(0.9);
  const gruOut = useMemo(
    () => computeGruCellStep(1.2, gruUpdateLogit, -0.8),
    [gruUpdateLogit]
  );
  const seq2seqOut = useMemo(
    () =>
      computeSeq2SeqAttention(
        [decoderQueryX, 1 - decoderQueryX],
        [
          [1.2, 0.1], // Source word 1 ("Main")
          [0.2, 1.3], // Source word 2 ("Chai")
          [-0.5, 0.8], // Source word 3 ("Piyunga")
        ]
      ),
    [decoderQueryX]
  );

  const tabs: { id: SequenceTab; label: string }[] = [
    { id: 'embeddings', label: '5.1 Word Vectors' },
    { id: 'rnn', label: '5.2 Recurrent Step' },
    { id: 'bptt', label: '5.3 BPTT Gradients' },
    { id: 'lstm', label: '5.4 LSTM Gates' },
    { id: 'gru-seq2seq', label: '5.5 GRU & Seq2Seq' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCommitHorizontal className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 5 Sequence Models &amp; Temporal Memory Workbench
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
        {/* TAB 5.1: EMBEDDINGS */}
        {activeTab === 'embeddings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-num">
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-1">
                  <div className="text-[#786970]">Cosine Sim to &quot;Biryani&quot; [0.9, 0.1]</div>
                  <div className="text-lg font-bold text-[#7A1C30]">{simBiryani.toFixed(4)}</div>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-1">
                  <div className="text-[#786970]">Cosine Sim to &quot;Jalebi&quot; [0.1, 0.95]</div>
                  <div className="text-lg font-bold text-[#C28E38]">{simJalebi.toFixed(4)}</div>
                </div>
              </div>

              <div className="p-4 bg-[#FBF6EB] border border-[#E8D3A8] rounded-lg text-xs space-y-1">
                <div className="font-bold text-[#7A1C30]">
                  Vector Analogy Parallelogram: v(King) - v(Man) + v(Woman) ≈ v(Queen)
                </div>
                <div className="font-mono-num text-[#1D1819]">
                  [0.20, 0.90] - [0.20, 0.20] + [0.85, 0.20] ={' '}
                  <strong>[{analogyTarget[0].toFixed(2)}, {analogyTarget[1].toFixed(2)}]</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="emb-spice-slider" className="font-bold text-[#1D1819]">
                      Savory / Spice Coordinate (e₁)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{spiceDim.toFixed(2)}</span>
                  </div>
                  <input
                    id="emb-spice-slider"
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={spiceDim}
                    onChange={e => setSpiceDim(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="emb-sweet-slider" className="font-bold text-[#1D1819]">
                      Sweetness Coordinate (e₂)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{sweetDim.toFixed(2)}</span>
                  </div>
                  <input
                    id="emb-sweet-slider"
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={sweetDim}
                    onChange={e => setSweetDim(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5.2 & 5.3: RNN & BPTT */}
        {(activeTab === 'rnn' || activeTab === 'bptt') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-x-auto border border-[#E8E2D9] rounded-lg">
                <table className="w-full text-left text-xs border-collapse font-mono-num">
                  <thead>
                    <tr className="bg-[#FAF5EE] border-b border-[#E8E2D9] text-[#6E1A2B]">
                      <th className="py-2 px-3">Step t</th>
                      <th className="py-2 px-3">Token Input x_t</th>
                      <th className="py-2 px-3">Hidden Memory h_t</th>
                      <th className="py-2 px-3">Local ∂h_t/∂h_{'{t-1}'}</th>
                      <th className="py-2 px-3">BPTT Signal ∂h_T/∂h_t</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFEAE2]">
                    {rnnSim.steps.map(st => (
                      <tr key={st.t}>
                        <td className="py-2 px-3 font-bold">t={st.t}</td>
                        <td className="py-2 px-3">{st.x_t.toFixed(2)}</td>
                        <td className="py-2 px-3 font-bold text-[#7A1C30]">{st.h_t.toFixed(3)}</td>
                        <td className="py-2 px-3">{st.localRecurrentDeriv.toFixed(3)}</td>
                        <td className="py-2 px-3 font-bold text-[#8E6523]">
                          {st.upstreamGradFromEnd.toExponential(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FBF6EB] border border-[#E8D3A8] text-xs flex justify-between items-center font-mono-num">
                <span>End-to-Start Gradient Ratio (∂h_8 / ∂h_1):</span>
                <strong className="text-sm text-[#7A1C30]">
                  {rnnSim.totalTemporalJacobian.toExponential(3)}
                </strong>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rnn-whh-slider" className="font-bold text-[#1D1819]">
                      Memory Carryover / Recurrent Weight (W_hh)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{wHh.toFixed(2)}</span>
                  </div>
                  <input
                    id="rnn-whh-slider"
                    type="range"
                    min="0.10"
                    max="1.80"
                    step="0.05"
                    value={wHh}
                    onChange={e => setWHh(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="rnn-wxh-slider" className="font-bold text-[#1D1819]">
                      New Word Impact / Input Weight (W_xh)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{wXh.toFixed(2)}</span>
                  </div>
                  <input
                    id="rnn-wxh-slider"
                    type="range"
                    min="0.10"
                    max="1.50"
                    step="0.05"
                    value={wXh}
                    onChange={e => setWXh(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5.4: LSTM */}
        {activeTab === 'lstm' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Forget Gate f_t</div>
                  <div className="text-base font-bold text-[#7A1C30]">{lstmOut.forgetGate.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Input Gate i_t</div>
                  <div className="text-base font-bold text-[#C28E38]">{lstmOut.inputGate.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">New Cell C_t</div>
                  <div className="text-base font-bold text-[#166534]">{lstmOut.cellState.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Hidden Out h_t</div>
                  <div className="text-base font-bold text-[#1D1819]">{lstmOut.hiddenState.toFixed(3)}</div>
                </div>
              </div>

              <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs text-[#166534] space-y-1">
                <div className="font-bold">
                  Unbroken Cell Highway Gradient: ∂C_t / ∂C_{'{t-1}'} = f_t = {lstmOut.dC_dCprev.toFixed(3)}
                </div>
                <p>
                  Because C_t = f_t · C_{'{t-1}'} + i_t · C̃_t is an ADDITIVE update (like ResNet!), when the Forget Gate f_t ≈ 1, gradients flow across 100+ words without vanishing!
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lstm-forget-slider" className="font-bold text-[#1D1819]">
                      Keep Old Whiteboard / Forget Logit (z_f)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{forgetLogit.toFixed(1)}</span>
                  </div>
                  <input
                    id="lstm-forget-slider"
                    type="range"
                    min="-4.0"
                    max="4.0"
                    step="0.2"
                    value={forgetLogit}
                    onChange={e => setForgetLogit(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lstm-input-slider" className="font-bold text-[#1D1819]">
                      Write New Note / Input Gate Logit (z_i)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{inputLogit.toFixed(1)}</span>
                  </div>
                  <input
                    id="lstm-input-slider"
                    type="range"
                    min="-4.0"
                    max="4.0"
                    step="0.2"
                    value={inputLogit}
                    onChange={e => setInputLogit(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lstm-cprev-slider" className="font-bold text-[#1D1819]">
                      Previous Cell Memory (C_{'{t-1}'})
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{cPrev.toFixed(1)}</span>
                  </div>
                  <input
                    id="lstm-cprev-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={cPrev}
                    onChange={e => setCPrev(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5.5: GRU & SEQ2SEQ */}
        {activeTab === 'gru-seq2seq' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-2 text-xs font-mono-num">
                <div className="font-bold text-[#1D1819]">
                  GRU Coupled Interpolation: h_t = (1 - z_t) h_{'{t-1}'} + z_t h̃_t
                </div>
                <div className="flex justify-between">
                  <span>Keep Old Weight (1 - z_t) = {gruOut.retentionWeight.toFixed(3)}</span>
                  <span>Write New Weight z_t = {gruOut.updateGate.toFixed(3)}</span>
                  <strong className="text-[#7A1C30]">h_t = {gruOut.hNew.toFixed(3)}</strong>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#E8E2D9] rounded-lg space-y-2 text-xs">
                <div className="font-bold text-[#1D1819]">
                  Seq2Seq Cross-Attention Alignment Weights (α_ts)
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono-num text-center">
                  {['"Main" (I)', '"Chai" (Tea)', '"Piyunga" (Will Drink)'].map((word, idx) => (
                    <div key={word} className="p-2.5 rounded bg-[#FAF5EE] border border-[#EAE2D5]">
                      <div className="text-[11px] text-[#54484E]">{word}</div>
                      <div className="text-sm font-bold text-[#7A1C30]">
                        {(seq2seqOut.weights[idx] * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="gru-z-slider" className="font-bold text-[#1D1819]">
                      GRU Update Dial / Gate Logit (z_t)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{gruUpdateLogit.toFixed(1)}</span>
                  </div>
                  <input
                    id="gru-z-slider"
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.2"
                    value={gruUpdateLogit}
                    onChange={e => setGruUpdateLogit(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="seq-query-slider" className="font-bold text-[#1D1819]">
                      Translator Focus / Decoder State (s_t)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{decoderQueryX.toFixed(2)}</span>
                  </div>
                  <input
                    id="seq-query-slider"
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={decoderQueryX}
                    onChange={e => setDecoderQueryX(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
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
