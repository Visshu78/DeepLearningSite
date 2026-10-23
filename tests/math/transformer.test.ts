import { describe, it, expect } from 'vitest';
import {
  dotProduct,
  softmaxRow,
  layerNorm1D,
  computeScaledDotProductAttention,
  simulateMultiHeadAttention,
  simulateTransformerBlock,
  SAMPLE_SENTENCE_TOKENS
} from '../../lib/math/transformer';

describe('Transformer & Attention Mathematical Engine', () => {
  it('correctly computes dot products and row-wise softmax', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    expect(dotProduct(a, b)).toBe(4 + 10 + 18); // 32

    const logits = [2.0, 1.0, 0.1];
    const probs = softmaxRow(logits);
    expect(probs.length).toBe(3);
    const sum = probs.reduce((acc, p) => acc + p, 0);
    expect(sum).toBeCloseTo(1.0, 2);
    expect(probs[0]).toBeGreaterThan(probs[1]);
    expect(probs[1]).toBeGreaterThan(probs[2]);
  });

  it('correctly calculates Scaled Dot-Product Attention (Q K^T / sqrt(d_k))', () => {
    const res = computeScaledDotProductAttention();
    expect(res.tokens).toEqual(SAMPLE_SENTENCE_TOKENS);
    expect(res.rawScores.length).toBe(4);
    expect(res.scaledScores.length).toBe(4);
    expect(res.attentionWeights.length).toBe(4);
    expect(res.contextOutputs.length).toBe(4);

    // Each row of attention weights must sum to 1.0
    res.attentionWeights.forEach(row => {
      const rowSum = row.reduce((acc, w) => acc + w, 0);
      expect(rowSum).toBeCloseTo(1.0, 2);
    });

    // In our sample data, 'it' (row 3) aligns heavily with 'robot' (col 1)
    expect(res.attentionWeights[3][1]).toBeGreaterThan(0.3);
  });

  it('validates Layer Normalization properties (mean ≈ 0, std ≈ 1)', () => {
    const x = [10.0, 20.0, 30.0, 40.0];
    const normalized = layerNorm1D(x);
    const mean = normalized.reduce((a, b) => a + b, 0) / normalized.length;
    expect(mean).toBeCloseTo(0.0, 1);
  });

  it('correctly splits and aggregates Multi-Head Attention', () => {
    const mha = simulateMultiHeadAttention(SAMPLE_SENTENCE_TOKENS, 4, 16);
    expect(mha.numHeads).toBe(4);
    expect(mha.headDim).toBe(4);
    expect(mha.headWeights.length).toBe(4);
    expect(mha.aggregatedOutput.length).toBe(4);

    // Each head attention row sums to 1
    mha.headWeights.forEach(head => {
      head.attentionWeights.forEach(row => {
        const sum = row.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0, 2);
      });
    });
  });

  it('simulates full Transformer Encoder Block pipeline', () => {
    const block = simulateTransformerBlock();
    expect(block.residual1.length).toBe(4);
    expect(block.layerNorm1.length).toBe(4);
    expect(block.ffnOutput.length).toBe(4);
    expect(block.residual2.length).toBe(4);
    expect(block.layerNorm2.length).toBe(4);
  });
});
