import { describe, it, expect } from 'vitest';
import {
  computeCosineSimilarity,
  computeWordAnalogyVector,
  simulateScalarRnnAndBptt,
  computeLstmCellStep,
  computeGruCellStep,
  computeSeq2SeqAttention,
} from '../../lib/math/sequenceModels';

describe('Track 5 Math Engine: Sequence Models (RNN, BPTT, LSTM, GRU, Seq2Seq)', () => {
  it('computes exact cosine similarity and word analogy vectors', () => {
    expect(computeCosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1.0, 6);
    expect(computeCosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0.0, 6);
    expect(computeCosineSimilarity([1, 1], [-1, -1])).toBeCloseTo(-1.0, 6);

    const queen = computeWordAnalogyVector([1, 1], [1, 4], [3, 1]);
    expect(queen).toEqual([3, 4]);
  });

  it('verifies analytical BPTT temporal Jacobian against central finite differences', () => {
    const inputs = [0.4, -0.2, 0.5, 0.1, -0.3];
    const w_xh = 0.6;
    const w_hh = 0.75;
    const b_h = 0.05;

    const base = simulateScalarRnnAndBptt(inputs, w_xh, w_hh, b_h);
    // Perturb h_1 by Perturbing x_1 so we verify dh_T / dh_1 via finite differences
    const eps = 1e-6;
    const h1 = base.steps[0].h_t;
    const forwardFromH1 = (hStart: number) => {
      let h = hStart;
      for (let t = 1; t < inputs.length; t++) {
        h = Math.tanh(w_hh * h + w_xh * inputs[t] + b_h);
      }
      return h;
    };
    const numDhT_dh1 = (forwardFromH1(h1 + eps) - forwardFromH1(h1 - eps)) / (2 * eps);
    expect(base.totalTemporalJacobian).toBeCloseTo(numDhT_dh1, 6);
  });

  it('verifies LSTM additive cell highway derivative dC_t / dC_{t-1} = f_t', () => {
    const params = {
      cPrev: 1.5,
      forgetLogit: 2.0,
      inputLogit: -1.0,
      candidateLogit: 0.5,
      outputLogit: 1.2,
    };
    const res = computeLstmCellStep(params);
    const eps = 1e-6;
    const cPlus = computeLstmCellStep({ ...params, cPrev: params.cPrev + eps }).cellState;
    const cMinus = computeLstmCellStep({ ...params, cPrev: params.cPrev - eps }).cellState;
    const numGrad = (cPlus - cMinus) / (2 * eps);
    expect(res.dC_dCprev).toBeCloseTo(numGrad, 6);
    expect(res.forgetGate).toBeGreaterThan(0.85);
  });

  it('verifies GRU convex interpolation and Seq2Seq Softmax attention normalization', () => {
    const gru = computeGruCellStep(2.0, 0.0, -2.0);
    // sigmoid(0) = 0.5 -> average of 2.0 and -2.0 is 0.0
    expect(gru.updateGate).toBeCloseTo(0.5, 6);
    expect(gru.hNew).toBeCloseTo(0.0, 6);

    const attn = computeSeq2SeqAttention(
      [1, 0],
      [
        [2, 0],
        [0, 2],
        [-1, 0],
      ]
    );
    const weightSum = attn.weights.reduce((a, b) => a + b, 0);
    expect(weightSum).toBeCloseTo(1.0, 6);
    expect(attn.weights[0]).toBeGreaterThan(attn.weights[1]);
  });
});
