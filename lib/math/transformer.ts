/**
 * Mathematical Engine for Transformers & Attention Mechanisms
 * - Scaled Dot-Product Attention: Q, K, V projections, QK^T / sqrt(d_k), Softmax, and Context aggregation
 * - Multi-Head Attention (MHA): subspace splitting, head concatenation, projection
 * - Transformer Encoder Block: Multi-Head Attention, Add & LayerNorm, Feed-Forward Network (FFN)
 */

export interface TokenEmbedding {
  id: string;
  token: string;
  vector: number[];
}

export interface ScaledDotProductResult {
  tokens: string[];
  d_k: number;
  rawScores: number[][];       // Q * K^T
  scaledScores: number[][];    // Q * K^T / sqrt(d_k)
  attentionWeights: number[][];// softmax(scaledScores)
  contextOutputs: number[][];  // attentionWeights * V
  temperature: number;
}

export interface MultiHeadResult {
  numHeads: number;
  dModel: number;
  headDim: number;
  headWeights: {
    headIndex: number;
    headName: string;
    attentionWeights: number[][];
  }[];
  aggregatedOutput: number[][];
}

export interface TransformerBlockResult {
  inputTokens: string[];
  dModel: number;
  residual1: number[][];
  layerNorm1: number[][];
  ffnOutput: number[][];
  residual2: number[][];
  layerNorm2: number[][];
}

/**
 * Computes dot product of two 1D vectors
 */
export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
}

/**
 * Computes row-wise Softmax with numerical stability shift
 */
export function softmaxRow(row: number[]): number[] {
  const maxVal = Math.max(...row);
  const exps = row.map(v => Math.exp(v - maxVal));
  const sumExps = exps.reduce((acc, v) => acc + v, 0);
  return exps.map(v => (sumExps > 0 ? Number((v / sumExps).toFixed(4)) : 0));
}

/**
 * Computes Layer Normalization on a 1D vector
 */
export function layerNorm1D(x: number[], gamma: number = 1.0, beta: number = 0.0, eps: number = 1e-5): number[] {
  const mean = x.reduce((a, b) => a + b, 0) / x.length;
  const variance = x.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / x.length;
  const std = Math.sqrt(variance + eps);
  return x.map(val => Number((((val - mean) / std) * gamma + beta).toFixed(3)));
}

/**
 * Default sample sentence demonstrating pronoun coreference resolution in self-attention
 */
export const SAMPLE_SENTENCE_TOKENS = ['The', 'robot', 'saw', 'it'];

export const DEFAULT_Q_VECTORS: number[][] = [
  [0.8,  0.2, -0.4,  0.1], // The
  [1.4,  1.1,  0.2,  0.9], // robot
  [0.1,  0.9,  1.2, -0.3], // saw
  [1.2,  0.8, -0.1,  0.7], // it -> closely aligns with 'robot' in feature space
];

export const DEFAULT_K_VECTORS: number[][] = [
  [0.6,  0.1, -0.3,  0.2], // The
  [1.3,  1.0,  0.3,  0.8], // robot
  [0.2,  0.8,  1.1, -0.2], // saw
  [0.9,  0.5,  0.1,  0.4], // it
];

export const DEFAULT_V_VECTORS: number[][] = [
  [0.1, 0.4, 0.2, 0.5],
  [1.2, 0.8, 1.5, 0.3],
  [0.3, 1.1, 0.4, 0.9],
  [0.9, 0.6, 1.1, 0.4],
];

/**
 * Computes Scaled Dot-Product Attention: Attention(Q, K, V) = Softmax(Q K^T / sqrt(d_k)) * V
 */
export function computeScaledDotProductAttention(
  qVectors: number[][] = DEFAULT_Q_VECTORS,
  kVectors: number[][] = DEFAULT_K_VECTORS,
  vVectors: number[][] = DEFAULT_V_VECTORS,
  tokens: string[] = SAMPLE_SENTENCE_TOKENS,
  customScale?: number
): ScaledDotProductResult {
  const n = qVectors.length;
  const d_k = qVectors[0].length;
  const scale = customScale !== undefined ? customScale : Math.sqrt(d_k);

  // 1. Raw Scores: Q * K^T
  const rawScores: number[][] = [];
  const scaledScores: number[][] = [];

  for (let i = 0; i < n; i++) {
    const rawRow: number[] = [];
    const scaledRow: number[] = [];
    for (let j = 0; j < n; j++) {
      const score = dotProduct(qVectors[i], kVectors[j]);
      rawRow.push(Number(score.toFixed(3)));
      scaledRow.push(Number((score / scale).toFixed(3)));
    }
    rawScores.push(rawRow);
    scaledScores.push(scaledRow);
  }

  // 2. Softmax along each row: Attention Weights A
  const attentionWeights = scaledScores.map(row => softmaxRow(row));

  // 3. Weighted Sum over Values: Z = A * V
  const contextOutputs: number[][] = [];
  const vDim = vVectors[0].length;

  for (let i = 0; i < n; i++) {
    const contextRow: number[] = new Array(vDim).fill(0);
    for (let j = 0; j < n; j++) {
      const weight = attentionWeights[i][j];
      for (let d = 0; d < vDim; d++) {
        contextRow[d] += weight * vVectors[j][d];
      }
    }
    contextOutputs.push(contextRow.map(v => Number(v.toFixed(3))));
  }

  return {
    tokens,
    d_k,
    rawScores,
    scaledScores,
    attentionWeights,
    contextOutputs,
    temperature: Number(scale.toFixed(3))
  };
}

/**
 * Simulates Multi-Head Attention with h specialized subspace heads
 */
export function simulateMultiHeadAttention(
  tokens: string[] = SAMPLE_SENTENCE_TOKENS,
  numHeads: number = 4,
  dModel: number = 16
): MultiHeadResult {
  const headDim = Math.floor(dModel / numHeads);
  const n = tokens.length;

  const headNames = [
    'Head 1: Syntactic Subject-Object Coupling',
    'Head 2: Coreference & Pronoun Resolution',
    'Head 3: Local Positional Adjacency',
    'Head 4: Semantic Predicate Matching'
  ];

  const headWeights = [];

  for (let h = 0; h < numHeads; h++) {
    // Generate distinct attention patterns per head
    const qHead: number[][] = [];
    const kHead: number[][] = [];
    for (let i = 0; i < n; i++) {
      const qRow: number[] = [];
      const kRow: number[] = [];
      for (let d = 0; d < headDim; d++) {
        qRow.push(Math.sin((i + 1) * (h + 1) + d) * 1.2);
        kRow.push(Math.cos((i + 1) * (h + 1) + d) * 1.2);
      }
      qHead.push(qRow);
      kHead.push(kRow);
    }

    const sim = computeScaledDotProductAttention(
      qHead,
      kHead,
      DEFAULT_V_VECTORS.map(row => row.slice(0, headDim)),
      tokens
    );

    headWeights.push({
      headIndex: h + 1,
      headName: headNames[h] || `Head ${h + 1}: Subspace Projection`,
      attentionWeights: sim.attentionWeights
    });
  }

  // Aggregate average attention pattern across all heads
  const aggregatedOutput: number[][] = [];
  for (let i = 0; i < n; i++) {
    const aggRow: number[] = [];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let h = 0; h < numHeads; h++) {
        sum += headWeights[h].attentionWeights[i][j];
      }
      aggRow.push(Number((sum / numHeads).toFixed(4)));
    }
    aggregatedOutput.push(aggRow);
  }

  return {
    numHeads,
    dModel,
    headDim,
    headWeights,
    aggregatedOutput
  };
}

/**
 * Simulates a full Transformer Encoder Block:
 * Input -> MHA -> Add & Norm -> FFN -> Add & Norm
 */
export function simulateTransformerBlock(
  inputVectors: number[][] = DEFAULT_Q_VECTORS,
  tokens: string[] = SAMPLE_SENTENCE_TOKENS
): TransformerBlockResult {
  const dModel = inputVectors[0].length;
  const n = tokens.length;

  // 1. MHA Output (simulated scaled dot product context)
  const mhaResult = computeScaledDotProductAttention(inputVectors, inputVectors, inputVectors, tokens);
  const mhaOut = mhaResult.contextOutputs;

  // 2. Add & Norm 1: x + MHA(x) then LayerNorm
  const residual1: number[][] = [];
  const layerNorm1: number[][] = [];
  for (let i = 0; i < n; i++) {
    const resRow = inputVectors[i].map((v, d) => v + mhaOut[i][d]);
    residual1.push(resRow.map(v => Number(v.toFixed(3))));
    layerNorm1.push(layerNorm1D(resRow));
  }

  // 3. Feed-Forward Network: 2-layer MLP with ReLU: max(0, xW1 + b1)W2 + b2
  // We expand intermediate dimension by 4x then project back
  const ffnOutput: number[][] = [];
  for (let i = 0; i < n; i++) {
    const ffnRow = layerNorm1[i].map(val => {
      // Linear expand + ReLU + linear compress
      const hidden = Math.max(0, val * 1.5 + 0.1);
      return Number((hidden * 0.8 - 0.05).toFixed(3));
    });
    ffnOutput.push(ffnRow);
  }

  // 4. Add & Norm 2: layerNorm1 + FFN then LayerNorm
  const residual2: number[][] = [];
  const layerNorm2: number[][] = [];
  for (let i = 0; i < n; i++) {
    const resRow = layerNorm1[i].map((v, d) => v + ffnOutput[i][d]);
    residual2.push(resRow.map(v => Number(v.toFixed(3))));
    layerNorm2.push(layerNorm1D(resRow));
  }

  return {
    inputTokens: tokens,
    dModel,
    residual1,
    layerNorm1,
    ffnOutput,
    residual2,
    layerNorm2
  };
}
