export interface LossResult {
  loss: number;
  derivative: number; // dL / d(prediction)
}

/**
 * Mean Squared Error for a single example:
 * L(y, y_hat) = 0.5 * (y_hat - y)^2
 * Derivative: dL / d(y_hat) = (y_hat - y)
 */
export function mseLoss(target: number, prediction: number): LossResult {
  const diff = prediction - target;
  const loss = 0.5 * diff * diff;
  const derivative = diff;
  return { loss, derivative };
}

/**
 * Standard unscaled squared error: (y_hat - y)^2
 */
export function standardSquaredError(target: number, prediction: number): number {
  const diff = prediction - target;
  return diff * diff;
}

/**
 * Mean Squared Error over a dataset of pairs (target, prediction)
 */
export function datasetMse(dataset: Array<{ target: number; prediction: number }>): {
  totalMse: number;
  itemErrors: number[];
} {
  if (dataset.length === 0) return { totalMse: 0, itemErrors: [] };
  const itemErrors = dataset.map(item => Math.pow(item.prediction - item.target, 2));
  const totalMse = itemErrors.reduce((sum, err) => sum + err, 0) / dataset.length;
  return { totalMse, itemErrors };
}

/**
 * Binary Cross-Entropy Loss:
 * L(y, y_hat) = - [y * ln(y_hat) + (1 - y) * ln(1 - y_hat)]
 * Derivative: dL / d(y_hat) = (y_hat - y) / (y_hat * (1 - y_hat))
 */
export function binaryCrossEntropy(target: number, prediction: number, eps: number = 1e-12): LossResult {
  const p = Math.max(eps, Math.min(1 - eps, prediction));
  const loss = -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
  const derivative = (p - target) / (p * (1 - p));
  return { loss, derivative };
}
