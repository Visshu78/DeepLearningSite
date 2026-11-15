/**
 * Pure analytical mathematical engine for Track 8: Modern LLM Practice
 * (Lessons 8.1 to 8.4: BPE Tokenization & Sampling/Perplexity, LoRA Low-Rank
 * Adaptation, Retrieval-Augmented Generation (RAG), and RLHF / DPO).
 *
 * Every equation and backward derivative is verified via automated unit tests.
 */

const EPS = 1e-12;

// ============================================================================
// LESSON 8.1: TOKENIZATION, TEMPERATURE SAMPLING & PERPLEXITY
// ============================================================================

export interface SamplingAndPerplexityResult {
  scaledLogits: number[];
  probs: number[];
  topPFilteredProbs: number[];
  crossEntropyNats: number;
  perplexity: number;
  gradLogits: number[];
}

/**
 * Evaluates Temperature-scaled Softmax probabilities, Top-p (nucleus) filtering,
 * autoregressive Cross-Entropy loss L = -log p_target, Perplexity PPL = exp(L),
 * and exact analytical gradient w.r.t unscaled logits z_i:
 *   dL / dz_i = (p_i - 1_{i == target}) / T
 */
export function computeTokenSamplingAndPerplexity(
  logits: number[],
  temperature: number,
  topP: number,
  targetIndex: number = 0
): SamplingAndPerplexityResult {
  const safeTemp = Math.max(0.05, temperature);
  const scaledLogits = logits.map(z => z / safeTemp);
  const maxLogit = Math.max(...scaledLogits, 0);
  const exps = scaledLogits.map(s => Math.exp(s - maxLogit));
  const sumExp = exps.reduce((a, b) => a + b, 0) || 1;
  const probs = exps.map(e => e / sumExp);

  // Top-p (Nucleus) filtering
  const indexed = probs
    .map((p, idx) => ({ p, idx }))
    .sort((a, b) => b.p - a.p);
  let cumP = 0;
  const keptIndices = new Set<number>();
  for (let i = 0; i < indexed.length; i++) {
    keptIndices.add(indexed[i].idx);
    cumP += indexed[i].p;
    if (cumP >= topP) break;
  }

  const rawFiltered = probs.map((p, idx) => (keptIndices.has(idx) ? p : 0));
  const filteredSum = rawFiltered.reduce((a, b) => a + b, 0) || 1;
  const topPFilteredProbs = rawFiltered.map(p => p / filteredSum);

  const pTarget = Math.max(EPS, probs[targetIndex] ?? EPS);
  const crossEntropyNats = -Math.log(pTarget);
  const perplexity = Math.exp(crossEntropyNats);

  const gradLogits = probs.map(
    (p, idx) => (p - (idx === targetIndex ? 1 : 0)) / safeTemp
  );

  return {
    scaledLogits,
    probs,
    topPFilteredProbs,
    crossEntropyNats,
    perplexity,
    gradLogits,
  };
}

// ============================================================================
// LESSON 8.2: FINE-TUNING AND LOW-RANK ADAPTATION (LoRA)
// ============================================================================

export interface LoraLayerResult {
  baseParams: number;
  loraParams: number;
  compressionRatio: number;
  trainablePercentage: number;
  scaleFactor: number;
  mergedWeight00: number;
  yOut: number[];
  gradB: number[][];
  gradA: number[][];
}

/**
 * Evaluates a LoRA linear projection:
 *   h = (W_0 + (alpha / r) * (B * A)) * x
 * where W_0 in R^{dOut x dIn} is frozen, B in R^{dOut x r}, A in R^{r x dIn}.
 * Given upstream gradient dL/dh = dy in R^{dOut}, analytical gradients are:
 *   dL/dB = (alpha / r) * dy * (A * x)^T
 *   dL/dA = (alpha / r) * (B^T * dy) * x^T
 */
export function computeLoraForwardBackward(
  dOut: number,
  dIn: number,
  rank: number,
  alpha: number,
  w0: number[][],
  matB: number[][],
  matA: number[][],
  x: number[],
  upstreamDy: number[]
): LoraLayerResult {
  const safeRank = Math.max(1, rank);
  const baseParams = dOut * dIn;
  const loraParams = safeRank * (dOut + dIn);
  const compressionRatio = loraParams > 0 ? baseParams / loraParams : 1;
  const trainablePercentage = baseParams > 0 ? (loraParams / baseParams) * 100 : 0;
  const scaleFactor = alpha / safeRank;

  const rActual = matA.length;
  const dOutMat = w0.length;
  const dInMat = (w0[0] ?? []).length;

  // Compute z = A * x in R^{rActual}
  const ax: number[] = matA.map(row =>
    row.reduce((acc, aVal, j) => acc + aVal * (x[j] ?? 0), 0)
  );

  // Compute yOut[i] = (W_0 * x)[i] + scaleFactor * (B * ax)[i]
  const yOut: number[] = [];
  for (let i = 0; i < dOutMat; i++) {
    let baseDot = 0;
    for (let j = 0; j < dInMat; j++) {
      baseDot += (w0[i]?.[j] ?? 0) * (x[j] ?? 0);
    }
    let loraDot = 0;
    for (let k = 0; k < rActual; k++) {
      loraDot += (matB[i]?.[k] ?? 0) * (ax[k] ?? 0);
    }
    yOut.push(baseDot + scaleFactor * loraDot);
  }

  let delta00 = 0;
  for (let k = 0; k < rActual; k++) {
    delta00 += (matB[0]?.[k] ?? 0) * (matA[k]?.[0] ?? 0);
  }
  const mergedWeight00 = (w0[0]?.[0] ?? 0) + scaleFactor * delta00;

  // Analytical gradients dL/dB and dL/dA
  const gradB: number[][] = [];
  for (let i = 0; i < dOutMat; i++) {
    const dy_i = upstreamDy[i] ?? 0;
    gradB.push(ax.map(ax_k => scaleFactor * dy_i * ax_k));
  }

  const gradA: number[][] = [];
  for (let k = 0; k < rActual; k++) {
    let btDy_k = 0;
    for (let i = 0; i < dOutMat; i++) {
      btDy_k += (matB[i]?.[k] ?? 0) * (upstreamDy[i] ?? 0);
    }
    gradA.push(x.map(x_j => scaleFactor * btDy_k * x_j));
  }

  return {
    baseParams,
    loraParams,
    compressionRatio,
    trainablePercentage,
    scaleFactor,
    mergedWeight00,
    yOut,
    gradB,
    gradA,
  };
}

// ============================================================================
// LESSON 8.3: RETRIEVAL-AUGMENTED GENERATION (RAG CHUNKING & COSINE RETRIEVAL)
// ============================================================================

export interface RagRetrievalResult {
  numChunks: number;
  similarities: number[];
  rankedIndices: number[];
  topKIndices: number[];
}

/**
 * Computes sliding-window chunk count with overlap:
 *   N_chunks = max(1, ceil((docTokens - overlap) / (chunkSize - overlap)))
 * and ranks candidate chunks by exact Cosine Similarity to the query vector.
 */
export function computeRagChunkingAndRetrieval(
  docTokens: number,
  chunkSize: number,
  overlap: number,
  queryVec: number[],
  chunkVecs: number[][],
  topK: number = 2
): RagRetrievalResult {
  const safeChunk = Math.max(16, chunkSize);
  const safeOverlap = Math.max(0, Math.min(safeChunk - 1, overlap));
  const stride = safeChunk - safeOverlap;
  const numChunks =
    docTokens <= safeChunk
      ? 1
      : 1 + Math.ceil((docTokens - safeChunk) / stride);

  const qNorm =
    Math.sqrt(queryVec.reduce((acc, v) => acc + v * v, 0)) || 1;

  const similarities = chunkVecs.map(cVec => {
    let dot = 0;
    let cSq = 0;
    for (let i = 0; i < queryVec.length; i++) {
      const ci = cVec[i] ?? 0;
      dot += (queryVec[i] ?? 0) * ci;
      cSq += ci * ci;
    }
    const cNorm = Math.sqrt(cSq) || 1;
    return dot / (qNorm * cNorm);
  });

  const rankedIndices = similarities
    .map((sim, idx) => ({ sim, idx }))
    .sort((a, b) => b.sim - a.sim)
    .map(item => item.idx);

  return {
    numChunks,
    similarities,
    rankedIndices,
    topKIndices: rankedIndices.slice(0, Math.max(1, topK)),
  };
}

// ============================================================================
// LESSON 8.4: REINFORCEMENT LEARNING BASICS, RLHF & DPO
// ============================================================================

export interface RlhfDpoResult {
  rewardMargin: number;
  winProbability: number;
  rewardModelLoss: number;
  dLoss_dRewardChosen: number;
  dLoss_dRewardRejected: number;
  klregularizedObjective: number;
}

function sigmoid(z: number): number {
  if (z >= 0) {
    const ez = Math.exp(-z);
    return 1 / (1 + ez);
  }
  const ez = Math.exp(z);
  return ez / (1 + ez);
}

/**
 * Evaluates the Bradley-Terry Preference Reward Model loss and RLHF KL-penalized objective:
 *   P(y_w > y_l | x) = sigma(r_w - r_l)
 *   L_RM = -log sigma(r_w - r_l)
 * Analytical derivatives:
 *   d L_RM / d r_w = sigma(r_w - r_l) - 1 = -(1 - P(y_w > y_l))
 *   d L_RM / d r_l = 1 - sigma(r_w - r_l)
 * KL-regularized RLHF objective:
 *   J(pi_theta) = r_w - betaKl * D_KL(pi_theta || pi_ref)
 */
export function computeRlhfAndDpoStep(
  rewardChosen: number,
  rewardRejected: number,
  klDivergenceFromRef: number = 0.2,
  betaKl: number = 0.1
): RlhfDpoResult {
  const rewardMargin = rewardChosen - rewardRejected;
  const winProbability = sigmoid(rewardMargin);
  const rewardModelLoss = -Math.log(Math.max(EPS, winProbability));

  const dLoss_dRewardChosen = winProbability - 1;
  const dLoss_dRewardRejected = 1 - winProbability;
  const klregularizedObjective = rewardChosen - betaKl * klDivergenceFromRef;

  return {
    rewardMargin,
    winProbability,
    rewardModelLoss,
    dLoss_dRewardChosen,
    dLoss_dRewardRejected,
    klregularizedObjective,
  };
}
