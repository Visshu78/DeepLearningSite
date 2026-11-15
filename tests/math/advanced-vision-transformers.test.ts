import { describe, it, expect } from 'vitest';
import {
  computeUniversalApproxHinges,
  computeVggKernelComparison,
  computeTransferLearningBudget,
  computeYoloIouAndNms,
  computeUnetDiceLossAndGrad,
  computePositionalEncodingAndRope,
  computeBertVsGptAttentionRow,
  computeVitPatchGeometry,
} from '../../lib/math/advancedVisionAndTransformers';

describe('Extended Track 2, Track 4, and Track 6 Analytical Math Engine', () => {
  it('2.7 ReLU piecewise-linear universal approximation derivative matches finite differences', () => {
    const hinges = [
      { v: 1.5, w: 2.0, b: -0.5 },
      { v: -0.8, w: 1.0, b: 0.4 },
      { v: 0.6, w: -1.5, b: 1.2 },
    ];
    const x = 0.55;
    const res = computeUniversalApproxHinges(x, hinges, 8, 4);
    expect(res.deepLinearRegions).toBeGreaterThan(res.shallowLinearRegions);

    const h = 1e-6;
    const fd =
      (computeUniversalApproxHinges(x + h, hinges).yApprox -
        computeUniversalApproxHinges(x - h, hinges).yApprox) /
      (2 * h);
    expect(res.dy_dx).toBeCloseTo(fd, 6);
  });

  it('4.5 VGG stacked 3x3 kernels cover 5x5 and 7x7 receptive fields with 28% and 44.9% fewer weights', () => {
    const two3x3 = computeVggKernelComparison(2, 64);
    expect(two3x3.effectiveReceptiveField).toBe(5);
    expect(two3x3.paramSavingsPercent).toBeCloseTo(28.0, 5);

    const three3x3 = computeVggKernelComparison(3, 64);
    expect(three3x3.effectiveReceptiveField).toBe(7);
    expect(three3x3.paramSavingsPercent).toBeCloseTo(((49 - 27) / 49) * 100, 5);
  });

  it('4.8 Transfer Learning frozen backbone vs trainable head budget', () => {
    const res = computeTransferLearningBudget(23500000, 2048, 5, 0, 1e-3, 0.1);
    expect(res.headParams).toBe(2048 * 5 + 5);
    expect(res.unfrozenBackboneParams).toBe(0);
    expect(res.totalTrainableParams).toBe(10245);
  });

  it('4.9 YOLO IoU and NMS suppression threshold', () => {
    const identical = computeYoloIouAndNms(
      { x1: 0, y1: 0, x2: 10, y2: 10 },
      { x1: 0, y1: 0, x2: 10, y2: 10 },
      0.5
    );
    expect(identical.iou).toBeCloseTo(1.0, 8);
    expect(identical.suppressedByNms).toBe(true);

    const partial = computeYoloIouAndNms(
      { x1: 0, y1: 0, x2: 10, y2: 10 },
      { x1: 5, y1: 0, x2: 15, y2: 10 },
      0.5
    );
    // Intersection = 5x10 = 50, Union = 100 + 100 - 50 = 150 -> IoU = 1/3
    expect(partial.iou).toBeCloseTo(1 / 3, 8);
    expect(partial.suppressedByNms).toBe(false);
  });

  it('4.10 U-Net Soft Dice Loss analytical gradients match finite differences', () => {
    const preds = [0.85, 0.2, 0.9, 0.1];
    const targets = [1, 0, 1, 0];
    const res = computeUnetDiceLossAndGrad(preds, targets);

    const h = 1e-6;
    for (let i = 0; i < preds.length; i++) {
      const pPlus = preds.map((v, idx) => (idx === i ? v + h : v));
      const pMinus = preds.map((v, idx) => (idx === i ? v - h : v));
      const fd =
        (computeUnetDiceLossAndGrad(pPlus, targets).diceLoss -
          computeUnetDiceLossAndGrad(pMinus, targets).diceLoss) /
        (2 * h);
      expect(res.gradPreds[i]).toBeCloseTo(fd, 6);
    }
  });

  it('6.3 RoPE relative dot product is strictly invariant to absolute position shift +k', () => {
    const pair1 = computePositionalEncodingAndRope(2, 5);
    const pair2 = computePositionalEncodingAndRope(12, 15); // Same relative offset -3
    expect(pair1.ropeRelativeDotProduct).toBeCloseTo(
      pair2.ropeRelativeDotProduct,
      8
    );
  });

  it('6.4 GPT causal mask sets future token attention weights strictly to 0 while summing to 1', () => {
    const row = computeBertVsGptAttentionRow([1.2, 0.5, 2.4, -0.3], 1);
    expect(row.gptCausalWeightsRow[2]).toBe(0);
    expect(row.gptCausalWeightsRow[3]).toBe(0);
    expect(
      row.gptCausalWeightsRow.reduce((a, b) => a + b, 0)
    ).toBeCloseTo(1.0, 8);
  });

  it('6.5 Vision Transformer ViT 224x224 with 16x16 patches produces 196 patches + 1 [CLS] = 197 tokens', () => {
    const vit = computeVitPatchGeometry(224, 16, 3, 768);
    expect(vit.gridWidth).toBe(14);
    expect(vit.numPatches).toBe(196);
    expect(vit.sequenceLengthWithCls).toBe(197);
    expect(vit.patchVectorDim).toBe(768);
  });
});
