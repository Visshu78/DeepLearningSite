import { describe, it, expect } from 'vitest';
import {
  computeTokenSamplingAndPerplexity,
  computeLoraForwardBackward,
  computeRagChunkingAndRetrieval,
  computeRlhfAndDpoStep,
} from '../../lib/math/modernLlm';

describe('Track 8: Modern LLM Practice Analytical Math Engine', () => {
  it('8.1 Temperature-scaled Softmax, Perplexity PPL = exp(L), and logit gradients match finite differences', () => {
    const logits = [2.4, 1.1, -0.5, 0.2];
    const temp = 0.8;
    const res = computeTokenSamplingAndPerplexity(logits, temp, 0.9, 0);

    // Perplexity equals 1 / p_target
    expect(res.perplexity).toBeCloseTo(1 / res.probs[0], 8);
    const sumTopP = res.topPFilteredProbs.reduce((a, b) => a + b, 0);
    expect(sumTopP).toBeCloseTo(1.0, 8);

    const h = 1e-6;
    for (let i = 0; i < logits.length; i++) {
      const lPlus = logits.map((v, idx) => (idx === i ? v + h : v));
      const lMinus = logits.map((v, idx) => (idx === i ? v - h : v));
      const fd =
        (computeTokenSamplingAndPerplexity(lPlus, temp, 0.9, 0).crossEntropyNats -
          computeTokenSamplingAndPerplexity(lMinus, temp, 0.9, 0).crossEntropyNats) /
        (2 * h);
      expect(res.gradLogits[i]).toBeCloseTo(fd, 6);
    }
  });

  it('8.2 LoRA parameter savings and analytical gradients dL/dB and dL/dA match finite differences', () => {
    const w0 = [
      [1.0, -0.5],
      [0.2, 0.8],
    ];
    const matB = [[0.4], [-0.3]]; // 2 x 1
    const matA = [[0.6, -0.2]]; // 1 x 2
    const x = [1.2, -0.7];
    const dy = [0.9, -0.4];

    const res = computeLoraForwardBackward(4096, 4096, 8, 16, w0, matB, matA, x, dy);
    expect(res.baseParams).toBe(16777216);
    expect(res.loraParams).toBe(65536);
    expect(res.compressionRatio).toBe(256);

    const lossFn = (bMat: number[][], aMat: number[][]) => {
      const out = computeLoraForwardBackward(4096, 4096, 8, 16, w0, bMat, aMat, x, dy);
      return out.yOut.reduce((acc, yVal, idx) => acc + yVal * dy[idx], 0);
    };

    const h = 1e-6;
    const fdB00 =
      (lossFn([[matB[0][0] + h], [matB[1][0]]], matA) -
        lossFn([[matB[0][0] - h], [matB[1][0]]], matA)) /
      (2 * h);
    const fdA01 =
      (lossFn(matB, [[matA[0][0], matA[0][1] + h]]) -
        lossFn(matB, [[matA[0][0], matA[0][1] - h]])) /
      (2 * h);

    expect(res.gradB[0][0]).toBeCloseTo(fdB00, 6);
    expect(res.gradA[0][1]).toBeCloseTo(fdA01, 6);
  });

  it('8.3 RAG sliding-window chunk count and top-k cosine ranking', () => {
    const rag = computeRagChunkingAndRetrieval(
      1000,
      200,
      50,
      [1.0, 0.0],
      [
        [0.1, 0.99],
        [0.95, 0.1],
        [-0.8, 0.2],
      ],
      1
    );
    // (1000 - 200) / (200 - 50) = 800 / 150 = 5.33 -> 1 + 6 = 7 chunks
    expect(rag.numChunks).toBe(7);
    expect(rag.topKIndices[0]).toBe(1);
  });

  it('8.4 Bradley-Terry RLHF reward loss derivatives match finite differences', () => {
    const rW = 1.8;
    const rL = 0.5;
    const res = computeRlhfAndDpoStep(rW, rL, 0.3, 0.1);

    const h = 1e-6;
    const fdChosen =
      (computeRlhfAndDpoStep(rW + h, rL).rewardModelLoss -
        computeRlhfAndDpoStep(rW - h, rL).rewardModelLoss) /
      (2 * h);
    const fdRejected =
      (computeRlhfAndDpoStep(rW, rL + h).rewardModelLoss -
        computeRlhfAndDpoStep(rW, rL - h).rewardModelLoss) /
      (2 * h);

    expect(res.dLoss_dRewardChosen).toBeCloseTo(fdChosen, 6);
    expect(res.dLoss_dRewardRejected).toBeCloseTo(fdRejected, 6);
  });
});
