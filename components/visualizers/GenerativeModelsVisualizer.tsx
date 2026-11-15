'use client';

import React, { useState, useMemo } from 'react';
import {
  computeAutoencoderPass,
  computeVaeLatentStep,
  computeGanObjectives,
  computeDiffusionClosedForm,
} from '@/lib/math/generativeModels';
import { Sparkles } from 'lucide-react';

export type GenerativeTab = 'autoencoder' | 'vae' | 'gan' | 'diffusion';

interface GenerativeModelsVisualizerProps {
  defaultTab?: GenerativeTab;
}

export function GenerativeModelsVisualizer({
  defaultTab = 'autoencoder',
}: GenerativeModelsVisualizerProps) {
  const [activeTab, setActiveTab] = useState<GenerativeTab>(defaultTab);

  // 7.1 Autoencoder state
  const [aeInput0, setAeInput0] = useState<number>(0.8);
  const [aeInput1, setAeInput1] = useState<number>(-0.5);
  const aeRes = useMemo(
    () =>
      computeAutoencoderPass(
        [aeInput0, aeInput1, 0.6, -0.3],
        [
          [0.7, -0.4, 0.5, -0.2],
          [-0.3, 0.8, -0.2, 0.6],
        ],
        [
          [0.8, -0.2],
          [-0.3, 0.7],
          [0.5, -0.1],
          [-0.2, 0.6],
        ]
      ),
    [aeInput0, aeInput1]
  );

  // 7.2 VAE state
  const [vaeMu, setVaeMu] = useState<number>(0.6);
  const [vaeLogVar, setVaeLogVar] = useState<number>(-0.4);
  const [vaeEps, setVaeEps] = useState<number>(0.5);
  const vaeRes = useMemo(
    () => computeVaeLatentStep(vaeMu, vaeLogVar, vaeEps, 0.18, 1.0),
    [vaeMu, vaeLogVar, vaeEps]
  );

  // 7.3 GAN state
  const [fakeLogit, setFakeLogit] = useState<number>(-1.5);
  const [realLogit, setRealLogit] = useState<number>(1.2);
  const ganRes = useMemo(
    () => computeGanObjectives(realLogit, fakeLogit, 0.5, 0.5),
    [realLogit, fakeLogit]
  );

  // 7.4 Diffusion state
  const [alphaBar, setAlphaBar] = useState<number>(0.64);
  const [epsPred, setEpsPred] = useState<number>(0.4);
  const diffRes = useMemo(
    () => computeDiffusionClosedForm(0.9, alphaBar, 0.5, epsPred),
    [alphaBar, epsPred]
  );

  const tabs: { id: GenerativeTab; label: string }[] = [
    { id: 'autoencoder', label: '7.1 Autoencoders' },
    { id: 'vae', label: '7.2 VAEs & KL' },
    { id: 'gan', label: '7.3 GAN Minimax' },
    { id: 'diffusion', label: '7.4 Diffusion DDPM' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 7 Generative Models &amp; Latent Synthesis Workbench
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
        {/* TAB 7.1: AUTOENCODERS */}
        {activeTab === 'autoencoder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg">
                  <div className="text-[#786970]">4D Suitcase Input (x)</div>
                  <div className="font-bold text-[#1D1819] mt-1">
                    [{aeInput0.toFixed(2)}, {aeInput1.toFixed(2)}, 0.60, -0.30]
                  </div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded-lg">
                  <div className="text-[#8E6523]">2D Bottleneck (z)</div>
                  <div className="font-bold text-[#7A1C30] mt-1">
                    [{aeRes.latentCode[0].toFixed(3)}, {aeRes.latentCode[1].toFixed(3)}]
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg">
                  <div className="text-[#786970]">Reconstruction MSE</div>
                  <div className="text-base font-bold text-[#7A1C30] mt-1">
                    {aeRes.mseLoss.toFixed(4)}
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num">
                Unpacked Reconstruction x̂ = [
                {aeRes.reconstructed.map(v => v.toFixed(3)).join(', ')}] (Compression Ratio:{' '}
                {aeRes.compressionRatio}:1)
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="ae-in0-slider" className="font-bold text-[#1D1819]">
                      Suitcase Item 1 / Feature (x₁)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{aeInput0.toFixed(2)}</span>
                  </div>
                  <input
                    id="ae-in0-slider"
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={aeInput0}
                    onChange={e => setAeInput0(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="ae-in1-slider" className="font-bold text-[#1D1819]">
                      Suitcase Item 2 / Feature (x₂)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{aeInput1.toFixed(2)}</span>
                  </div>
                  <input
                    id="ae-in1-slider"
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={aeInput1}
                    onChange={e => setAeInput1(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7.2: VAE */}
        {activeTab === 'vae' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Std Dev σ = exp(s/2)</div>
                  <div className="text-base font-bold text-[#1D1819]">{vaeRes.sigma.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Sample z = μ + σ·ε</div>
                  <div className="text-base font-bold text-[#7A1C30]">{vaeRes.zSample.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded">
                  <div className="text-[#8E6523]">KL Penalty D_KL</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {vaeRes.klDivergence.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Total Negative ELBO</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {vaeRes.totalElboLoss.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num flex flex-wrap justify-between gap-2">
                <span>Reparam Grad ∂z/∂μ = {vaeRes.dz_dMu.toFixed(2)}</span>
                <span>Reparam Grad ∂z/∂s = {vaeRes.dz_dLogVar.toFixed(3)}</span>
                <span>KL Grad ∂D_KL/∂μ = {vaeRes.dKl_dMu.toFixed(3)}</span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vae-mu-slider" className="font-bold text-[#1D1819]">
                      Base Recipe Center / Mean (μ)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{vaeMu.toFixed(2)}</span>
                  </div>
                  <input
                    id="vae-mu-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={vaeMu}
                    onChange={e => setVaeMu(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vae-logvar-slider" className="font-bold text-[#1D1819]">
                      Spice Variation / Log-Variance (s = log σ²)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{vaeLogVar.toFixed(2)}</span>
                  </div>
                  <input
                    id="vae-logvar-slider"
                    type="range"
                    min="-2.0"
                    max="1.5"
                    step="0.1"
                    value={vaeLogVar}
                    onChange={e => setVaeLogVar(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vae-eps-slider" className="font-bold text-[#1D1819]">
                      External Dice Roll / Noise (ε ~ N(0,1))
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{vaeEps.toFixed(2)}</span>
                  </div>
                  <input
                    id="vae-eps-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={vaeEps}
                    onChange={e => setVaeEps(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7.3: GAN */}
        {activeTab === 'gan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">D(Fake) Probability</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {(ganRes.dFakeProb * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Minimax Grad ∂L/∂z_fake</div>
                  <div className="text-base font-bold text-[#8E6523]">
                    {ganRes.dGenMinimax_dFakeLogit.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Non-Saturating Grad</div>
                  <div className="text-base font-bold text-[#166534]">
                    {ganRes.dGenNonSat_dFakeLogit.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FBF6EB] border border-[#E8D3A8] rounded-lg text-xs">
                When the Bank Officer easily spots the fake note (drag Fake Note Score down to -3.0),
                the original Minimax gradient vanishes toward 0, whereas the Non-Saturating loss{' '}
                <strong>-log D(G(z))</strong> provides a strong -0.95 gradient!
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="gan-fake-slider" className="font-bold text-[#1D1819]">
                      Counterfeiter Quality / Fake Note Logit (z_fake)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{fakeLogit.toFixed(1)}</span>
                  </div>
                  <input
                    id="gan-fake-slider"
                    type="range"
                    min="-4.0"
                    max="4.0"
                    step="0.2"
                    value={fakeLogit}
                    onChange={e => setFakeLogit(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="gan-real-slider" className="font-bold text-[#1D1819]">
                      Bank Officer Confidence on Real Note (z_real)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{realLogit.toFixed(1)}</span>
                  </div>
                  <input
                    id="gan-real-slider"
                    type="range"
                    min="-2.0"
                    max="4.0"
                    step="0.2"
                    value={realLogit}
                    onChange={e => setRealLogit(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7.4: DIFFUSION */}
        {activeTab === 'diffusion' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Signal Scale √ᾱ_t</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {diffRes.signalScale.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Noise Scale √(1-ᾱ_t)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {diffRes.noiseScale.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Smudged Pixel x_t</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {diffRes.xNoisy.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Restored Pixel x̂_0</div>
                  <div className="text-base font-bold text-[#166534]">
                    {diffRes.x0Reconstructed.toFixed(3)}
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num flex justify-between">
                <span>Clean Photo Pixel x_0 = 0.900 | True Noise ε = 0.500</span>
                <strong className="text-[#7A1C30]">
                  Denoising MSE Loss = {diffRes.scoreLossMse.toFixed(4)}
                </strong>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="diff-alpha-slider" className="font-bold text-[#1D1819]">
                      Remaining Clean Signal / Schedule (ᾱ_t)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{alphaBar.toFixed(2)}</span>
                  </div>
                  <input
                    id="diff-alpha-slider"
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={alphaBar}
                    onChange={e => setAlphaBar(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="diff-eps-slider" className="font-bold text-[#1D1819]">
                      Predicted Smudge / Denoiser Output (ε_θ)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{epsPred.toFixed(2)}</span>
                  </div>
                  <input
                    id="diff-eps-slider"
                    type="range"
                    min="-0.5"
                    max="1.0"
                    step="0.05"
                    value={epsPred}
                    onChange={e => setEpsPred(parseFloat(e.target.value))}
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
