/**
 * Pure analytical mathematical functions for Track 5:
 * Sequence Models (Lessons 5.1 – 5.5)
 */

/**
 * 5.1 Word Embeddings: Cosine Similarity & Analogy Vector Arithmetic
 */
export function computeCosineSimilarity(u: number[], v: number[]): number {
  if (u.length === 0 || u.length !== v.length) return 0;
  let dot = 0;
  let normU = 0;
  let normV = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    normU += u[i] * u[i];
    normV += v[i] * v[i];
  }
  const denom = Math.sqrt(normU) * Math.sqrt(normV);
  return denom > 1e-12 ? dot / denom : 0;
}

export function computeWordAnalogyVector(
  vA: [number, number],
  vB: [number, number],
  vC: [number, number]
): [number, number] {
  // vB - vA + vC (e.g. King - Man + Woman = Queen)
  return [vB[0] - vA[0] + vC[0], vB[1] - vA[1] + vC[1]];
}

/**
 * 5.2 & 5.3 Vanilla 1D Recurrent Neural Network & BPTT Temporal Gradient Norm
 * h_t = tanh(w_hh * h_{t-1} + w_xh * x_t + b_h)
 * Local recurrent Jacobian: dh_t / dh_{t-1} = w_hh * (1 - h_t^2)
 */
export interface RnnTimestepState {
  t: number;
  x_t: number;
  preActivation: number;
  h_t: number;
  localRecurrentDeriv: number; // dh_t / dh_{t-1} = w_hh * (1 - h_t^2)
  upstreamGradFromEnd: number; // dL_T / dh_t
}

export function simulateScalarRnnAndBptt(
  inputs: number[],
  w_xh: number,
  w_hh: number,
  b_h: number,
  h0 = 0
): {
  steps: RnnTimestepState[];
  totalTemporalJacobian: number; // dh_T / dh_1
} {
  const T = inputs.length;
  const steps: RnnTimestepState[] = [];
  let hPrev = h0;

  for (let t = 0; t < T; t++) {
    const x_t = inputs[t];
    const z_t = w_hh * hPrev + w_xh * x_t + b_h;
    const h_t = Math.tanh(z_t);
    const localRecurrentDeriv = w_hh * (1 - h_t * h_t);
    steps.push({
      t: t + 1,
      x_t,
      preActivation: z_t,
      h_t,
      localRecurrentDeriv,
      upstreamGradFromEnd: 1.0,
    });
    hPrev = h_t;
  }

  // Backward pass from step T-1 down to 0 assuming dL/dh_T = 1.0
  let runningGrad = 1.0;
  for (let t = T - 1; t >= 0; t--) {
    steps[t].upstreamGradFromEnd = runningGrad;
    runningGrad = runningGrad * steps[t].localRecurrentDeriv;
  }

  const totalTemporalJacobian = T > 0 ? steps[0].upstreamGradFromEnd : 1.0;
  return { steps, totalTemporalJacobian };
}

/**
 * 5.4 Long Short-Term Memory (LSTM) Cell Step
 * f_t = σ(z_f), i_t = σ(z_i), C̃_t = tanh(z_c), o_t = σ(z_o)
 * C_t = f_t * C_{t-1} + i_t * C̃_t
 * h_t = o_t * tanh(C_t)
 */
export function sigmoidScalar(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export interface LstmCellOutput {
  forgetGate: number;
  inputGate: number;
  candidateCell: number;
  outputGate: number;
  cellState: number;
  hiddenState: number;
  dC_dCprev: number; // Exact additive highway gradient = f_t
}

export function computeLstmCellStep(params: {
  cPrev: number;
  forgetLogit: number;
  inputLogit: number;
  candidateLogit: number;
  outputLogit: number;
}): LstmCellOutput {
  const f_t = sigmoidScalar(params.forgetLogit);
  const i_t = sigmoidScalar(params.inputLogit);
  const cTilde = Math.tanh(params.candidateLogit);
  const o_t = sigmoidScalar(params.outputLogit);

  const c_t = f_t * params.cPrev + i_t * cTilde;
  const h_t = o_t * Math.tanh(c_t);

  return {
    forgetGate: f_t,
    inputGate: i_t,
    candidateCell: cTilde,
    outputGate: o_t,
    cellState: c_t,
    hiddenState: h_t,
    dC_dCprev: f_t,
  };
}

/**
 * 5.5 GRU Cell & Seq2Seq Dot-Product Cross-Attention
 * GRU:
 * z_t = σ(logit_z), r_t = σ(logit_r)
 * h_t = (1 - z_t) * h_{t-1} + z_t * h̃_t
 */
export function computeGruCellStep(
  hPrev: number,
  updateLogit: number,
  candidateVal: number
): {
  updateGate: number;
  retentionWeight: number;
  hNew: number;
} {
  const z_t = sigmoidScalar(updateLogit);
  const retentionWeight = 1 - z_t;
  const hNew = retentionWeight * hPrev + z_t * candidateVal;
  return { updateGate: z_t, retentionWeight, hNew };
}

export function computeSeq2SeqAttention(
  decoderState: [number, number],
  encoderStates: [number, number][]
): {
  scores: number[];
  weights: number[];
  contextVector: [number, number];
} {
  if (encoderStates.length === 0) {
    return { scores: [], weights: [], contextVector: [0, 0] };
  }
  const scores = encoderStates.map(
    h_s => decoderState[0] * h_s[0] + decoderState[1] * h_s[1]
  );
  const maxScore = Math.max(...scores);
  const exps = scores.map(s => Math.exp(s - maxScore));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const weights = exps.map(e => e / sumExp);

  let cx = 0;
  let cy = 0;
  for (let i = 0; i < encoderStates.length; i++) {
    cx += weights[i] * encoderStates[i][0];
    cy += weights[i] * encoderStates[i][1];
  }

  return {
    scores,
    weights,
    contextVector: [cx, cy],
  };
}
