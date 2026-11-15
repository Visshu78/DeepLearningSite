'use client';

import React, { useState, useMemo } from 'react';
import {
  computeUniversalApproxHinges,
  computeVggKernelComparison,
  computeTransferLearningBudget,
  computeYoloIouAndNms,
  computeUnetDiceLossAndGrad,
  computePositionalEncodingAndRope,
  computeBertVsGptAttentionRow,
  computeVitPatchGeometry,
} from '@/lib/math/advancedVisionAndTransformers';
import { Layers } from 'lucide-react';

export type ExtendedArchitectureTab =
  | 'universal'
  | 'vgg'
  | 'transfer'
  | 'yolo'
  | 'unet'
  | 'pos-encoding'
  | 'bert-gpt'
  | 'vit';

interface VisionAndTransformerExtendedVisualizerProps {
  defaultTab?: ExtendedArchitectureTab;
}

export function VisionAndTransformerExtendedVisualizer({
  defaultTab = 'universal',
}: VisionAndTransformerExtendedVisualizerProps) {
  const [activeTab, setActiveTab] = useState<ExtendedArchitectureTab>(defaultTab);

  // 2.7 Universal Approximation State
  const [probeX, setProbeX] = useState<number>(0.4);
  const [depthLayers, setDepthLayers] = useState<number>(4);
  const uatRes = useMemo(
    () =>
      computeUniversalApproxHinges(
        probeX,
        [
          { v: 1.2, w: 1.5, b: 0.5 },
          { v: -0.9, w: 2.0, b: -0.2 },
          { v: 0.8, w: -1.2, b: 0.7 },
        ],
        8,
        depthLayers
      ),
    [probeX, depthLayers]
  );

  // 4.5 VGG State
  const [numStacked3x3, setNumStacked3x3] = useState<number>(2);
  const [vggChannels, setVggChannels] = useState<number>(64);
  const vggRes = useMemo(
    () => computeVggKernelComparison(numStacked3x3, vggChannels),
    [numStacked3x3, vggChannels]
  );

  // 4.8 Transfer Learning State
  const [unfrozenStages, setUnfrozenStages] = useState<number>(0);
  const [numClasses, setNumClasses] = useState<number>(5);
  const tlRes = useMemo(
    () => computeTransferLearningBudget(23500000, 2048, numClasses, unfrozenStages),
    [numClasses, unfrozenStages]
  );

  // 4.9 YOLO State
  const [boxOffsetX, setBoxOffsetX] = useState<number>(2.0);
  const [nmsThreshold, setNmsThreshold] = useState<number>(0.5);
  const yoloRes = useMemo(
    () =>
      computeYoloIouAndNms(
        { x1: 0, y1: 0, x2: 10, y2: 10 },
        { x1: boxOffsetX, y1: 0, x2: 10 + boxOffsetX, y2: 10 },
        nmsThreshold
      ),
    [boxOffsetX, nmsThreshold]
  );

  // 4.10 U-Net State
  const [fgConfidence, setFgConfidence] = useState<number>(0.85);
  const [bgNoise, setBgNoise] = useState<number>(0.15);
  const unetRes = useMemo(
    () =>
      computeUnetDiceLossAndGrad(
        [fgConfidence, fgConfidence, bgNoise, bgNoise],
        [1, 1, 0, 0]
      ),
    [fgConfidence, bgNoise]
  );

  // 6.3 Positional Encoding State
  const [posA, setPosA] = useState<number>(2);
  const [posB, setPosB] = useState<number>(5);
  const peRes = useMemo(
    () => computePositionalEncodingAndRope(posA, posB),
    [posA, posB]
  );

  // 6.4 BERT vs GPT State
  const [queryIdx, setQueryIdx] = useState<number>(1);
  const maskRes = useMemo(
    () => computeBertVsGptAttentionRow([1.4, 0.8, 1.9, 0.4], queryIdx),
    [queryIdx]
  );

  // 6.5 ViT State
  const [patchSizeP, setPatchSizeP] = useState<number>(16);
  const vitRes = useMemo(
    () => computeVitPatchGeometry(224, patchSizeP, 3, 768),
    [patchSizeP]
  );

  const tabs: { id: ExtendedArchitectureTab; label: string }[] = [
    { id: 'universal', label: '2.7 ReLU Depth' },
    { id: 'vgg', label: '4.5 LeNet to VGG' },
    { id: 'transfer', label: '4.8 Transfer Learning' },
    { id: 'yolo', label: '4.9 YOLO & IoU' },
    { id: 'unet', label: '4.10 U-Net & Dice' },
    { id: 'pos-encoding', label: '6.3 Pos Encoding' },
    { id: 'bert-gpt', label: '6.4 BERT vs GPT' },
    { id: 'vit', label: '6.5 Vision Transformer' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Deep Architectures, Vision Detection/Segmentation &amp; Transformer Workbench
          </span>
        </div>

        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-[#EAE2D5]">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
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
        {/* TAB 2.7: UNIVERSAL APPROXIMATION */}
        {activeTab === 'universal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">f(x) Output</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {uatRes.yApprox.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Slope df/dx</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {uatRes.dy_dx.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">1-Layer Regions</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {uatRes.shallowLinearRegions}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">{depthLayers}-Layer Regions</div>
                  <div className="text-base font-bold text-[#166534]">
                    {uatRes.deepLinearRegions.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="uat-x-slider" className="font-bold text-[#1D1819]">
                      Road Position / Input (x)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{probeX.toFixed(2)}</span>
                  </div>
                  <input
                    id="uat-x-slider"
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.05"
                    value={probeX}
                    onChange={e => setProbeX(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="uat-depth-slider" className="font-bold text-[#1D1819]">
                      Network Depth / Stacked Layers (L)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{depthLayers}</span>
                  </div>
                  <input
                    id="uat-depth-slider"
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={depthLayers}
                    onChange={e => setDepthLayers(parseInt(e.target.value, 10))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4.5: VGG */}
        {activeTab === 'vgg' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Effective RF</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {vggRes.effectiveReceptiveField}×{vggRes.effectiveReceptiveField}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Stacked 3×3 Params</div>
                  <div className="text-sm font-bold text-[#166534]">
                    {vggRes.stacked3x3Params.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">
                    Single {vggRes.effectiveReceptiveField}×{vggRes.effectiveReceptiveField} Params
                  </div>
                  <div className="text-sm font-bold text-[#7A1C30]">
                    {vggRes.singleLargeKernelParams.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded">
                  <div className="text-[#8E6523]">Weight Savings</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    -{vggRes.paramSavingsPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vgg-stack-slider" className="font-bold text-[#1D1819]">
                      Stacked 3×3 Layers (N)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{numStacked3x3}</span>
                  </div>
                  <input
                    id="vgg-stack-slider"
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={numStacked3x3}
                    onChange={e => setNumStacked3x3(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vgg-c-slider" className="font-bold text-[#1D1819]">
                      Feature Channels (C)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{vggChannels}</span>
                  </div>
                  <input
                    id="vgg-c-slider"
                    type="range"
                    min="32"
                    max="256"
                    step="32"
                    value={vggChannels}
                    onChange={e => setVggChannels(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4.8: TRANSFER LEARNING */}
        {activeTab === 'transfer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">New Linear Head Params</div>
                  <div className="text-base font-bold text-[#166534]">
                    {tlRes.headParams.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Total Trainable Params</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {tlRes.totalTrainableParams.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Trainable % of ResNet50</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {tlRes.trainablePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="tl-stages-slider" className="font-bold text-[#1D1819]">
                      Unfrozen Backbone Stages (0 = Feature Extraction)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{unfrozenStages} / 4</span>
                  </div>
                  <input
                    id="tl-stages-slider"
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={unfrozenStages}
                    onChange={e => setUnfrozenStages(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="tl-classes-slider" className="font-bold text-[#1D1819]">
                      New Task Target Classes (K)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{numClasses}</span>
                  </div>
                  <input
                    id="tl-classes-slider"
                    type="range"
                    min="2"
                    max="50"
                    step="1"
                    value={numClasses}
                    onChange={e => setNumClasses(parseInt(e.target.value, 10))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4.9: YOLO & IoU */}
        {activeTab === 'yolo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Intersection Area</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {yoloRes.intersectionArea.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Union Area</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {yoloRes.unionArea.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">IoU Overlap</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {yoloRes.iou.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded">
                  <div className="text-[#8E6523]">NMS Decision</div>
                  <div className="text-xs font-bold text-[#7A1C30] mt-1">
                    {yoloRes.suppressedByNms ? 'Suppress Duplicate' : 'Keep Distinct Box'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="yolo-dx-slider" className="font-bold text-[#1D1819]">
                      Predicted Box Horizontal Shift (Δx)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{boxOffsetX.toFixed(1)}</span>
                  </div>
                  <input
                    id="yolo-dx-slider"
                    type="range"
                    min="0.0"
                    max="10.0"
                    step="0.5"
                    value={boxOffsetX}
                    onChange={e => setBoxOffsetX(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="yolo-nms-slider" className="font-bold text-[#1D1819]">
                      NMS Suppression Cutoff (τ_NMS)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{nmsThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    id="yolo-nms-slider"
                    type="range"
                    min="0.20"
                    max="0.90"
                    step="0.05"
                    value={nmsThreshold}
                    onChange={e => setNmsThreshold(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4.10: U-NET & DICE */}
        {activeTab === 'unet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Dice Coefficient</div>
                  <div className="text-base font-bold text-[#166534]">
                    {unetRes.diceCoefficient.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Dice Loss (1 - Dice)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {unetRes.diceLoss.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Grad ∂L/∂p_fg</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {unetRes.gradPreds[0].toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="unet-fg-slider" className="font-bold text-[#1D1819]">
                      Foreground Pixel Probability (p_fg)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{fgConfidence.toFixed(2)}</span>
                  </div>
                  <input
                    id="unet-fg-slider"
                    type="range"
                    min="0.10"
                    max="0.99"
                    step="0.05"
                    value={fgConfidence}
                    onChange={e => setFgConfidence(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="unet-bg-slider" className="font-bold text-[#1D1819]">
                      Background False-Alarm Probability (p_bg)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{bgNoise.toFixed(2)}</span>
                  </div>
                  <input
                    id="unet-bg-slider"
                    type="range"
                    min="0.01"
                    max="0.80"
                    step="0.05"
                    value={bgNoise}
                    onChange={e => setBgNoise(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6.3: POSITIONAL ENCODING */}
        {activeTab === 'pos-encoding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg text-xs font-mono-num space-y-1">
                <div>
                  PE(posA={posA}) = [{peRes.pePosA.map(v => v.toFixed(3)).join(', ')}]
                </div>
                <div>
                  PE(posB={posB}) = [{peRes.pePosB.map(v => v.toFixed(3)).join(', ')}]
                </div>
                <div className="text-[#7A1C30] font-bold pt-1">
                  RoPE Relative Dot Product (offset Δ = {posA - posB}):{' '}
                  {peRes.ropeRelativeDotProduct.toFixed(4)}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="pe-a-slider" className="font-bold text-[#1D1819]">
                      Seat Number A / Token Position (pos_A)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{posA}</span>
                  </div>
                  <input
                    id="pe-a-slider"
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={posA}
                    onChange={e => setPosA(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="pe-b-slider" className="font-bold text-[#1D1819]">
                      Seat Number B / Token Position (pos_B)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{posB}</span>
                  </div>
                  <input
                    id="pe-b-slider"
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={posB}
                    onChange={e => setPosB(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6.4: BERT VS GPT */}
        {activeTab === 'bert-gpt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded text-xs font-mono-num">
                <div className="font-bold text-[#1D1819] mb-1">
                  BERT Bidirectional Weights at Token {queryIdx}:
                </div>
                <div>
                  [{maskRes.bertWeightsRow.map(w => `${(w * 100).toFixed(1)}%`).join(', ')}]
                </div>
              </div>
              <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded text-xs font-mono-num">
                <div className="font-bold text-[#7A1C30] mb-1">
                  GPT Causal Look-Ahead Masked Weights at Token {queryIdx}:
                </div>
                <div>
                  [{maskRes.gptCausalWeightsRow.map(w => `${(w * 100).toFixed(1)}%`).join(', ')}]
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="bg-q-slider" className="font-bold text-[#1D1819]">
                      Current Query Word Index (i ∈ 0..3)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">Token {queryIdx}</span>
                  </div>
                  <input
                    id="bg-q-slider"
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={queryIdx}
                    onChange={e => setQueryIdx(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6.5: VISION TRANSFORMER */}
        {activeTab === 'vit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Patch Grid</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {vitRes.gridWidth}×{vitRes.gridWidth} = {vitRes.numPatches}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Seq Length (+CLS)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {vitRes.sequenceLengthWithCls}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Patch Dim 3P²</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {vitRes.patchVectorDim}
                  </div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded">
                  <div className="text-[#8E6523]">Attention Pairs L²</div>
                  <div className="text-sm font-bold text-[#7A1C30]">
                    {vitRes.selfAttentionPairs.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vit-p-slider" className="font-bold text-[#1D1819]">
                      Jigsaw Tile / Patch Size (P × P pixels)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">
                      {patchSizeP}×{patchSizeP}
                    </span>
                  </div>
                  <input
                    id="vit-p-slider"
                    type="range"
                    min="8"
                    max="32"
                    step="8"
                    value={patchSizeP}
                    onChange={e => setPatchSizeP(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
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
