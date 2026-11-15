export interface PracticeChallenge {
  id: string;
  category: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type PublicPracticeChallenge = Omit<
  PracticeChallenge,
  'correctIndex' | 'explanation'
>;

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'c1',
    category: 'Neuron Computation',
    title: 'Predict Neuron Activation Output',
    scenario:
      'A neuron has inputs x = [3.0, -1.0], weights w = [0.5, 2.0], bias b = 0.5, and uses the ReLU activation function.',
    question: 'What is the exact post-activation output a of this neuron?',
    options: ['a = 1.0', 'a = -0.5', 'a = 0.0', 'a = 0.5'],
    correctIndex: 2,
    explanation:
      'Calculation: z = (3.0 × 0.5) + (-1.0 × 2.0) + 0.5 = 1.5 - 2.0 + 0.5 = 0.0. Applying ReLU(0.0) = max(0, 0.0) = 0.0.',
  },
  {
    id: 'c2',
    category: 'Optimization Dynamics',
    title: 'Predict Learning Rate Pathology',
    scenario:
      'You are training a neural network using Mean Squared Error on a standard parabolic loss bowl. After setting learning rate η = 2.5, you observe the loss values across the first 4 iterations: 2.1 → 5.8 → 18.4 → 72.0.',
    question: 'What is occurring during training, and what is the corrective action?',
    options: [
      'The model is underfitting; increase the learning rate η to 5.0.',
      'The step size exceeds the stability bound; reduce learning rate η.',
      'The weights are vanishing; replace ReLU activations with Sigmoid.',
      'This is normal warm-up exploration before convergence; continue.',
    ],
    correctIndex: 1,
    explanation:
      'Rapidly multiplying loss values (2.1 → 5.8 → 18.4 → 72.0) is the classic hallmark of step overshoot and mathematical divergence when η > 2/L_max. The solution is to reduce η.',
  },
  {
    id: 'c3',
    category: 'Activation Functions',
    title: 'Diagnose Activation by Empirical Characteristics',
    scenario:
      'An engineer inspects intermediate outputs of a hidden layer and notes that every neuron activation strictly lies within the interval (-1.0, +1.0), and the mean activation across a balanced dataset is approximately 0.0.',
    question: 'Which activation function is the network using?',
    options: [
      'Logistic Sigmoid (σ)',
      'Rectified Linear Unit (ReLU)',
      'Hyperbolic Tangent (Tanh)',
      'Heaviside Binary Step Function',
    ],
    correctIndex: 2,
    explanation:
      'Tanh maps all real inputs into the range (-1.0, 1.0) and is zero-centered (tanh(0) = 0). In contrast, Sigmoid maps strictly into (0, 1) and is not zero-centered.',
  },
  {
    id: 'c4',
    category: 'Backpropagation & Chain Rule',
    title: 'Calculate Single Weight Update',
    scenario:
      'In a single-neuron regression model, the current weight is w = 1.40. An error signal backpropagates and yields a weight gradient of ∂L/∂w = +0.60. The learning rate is η = 0.50.',
    question: 'What will be the new weight w_new after one gradient descent step?',
    options: ['w_new = 1.70', 'w_new = 1.10', 'w_new = 0.80', 'w_new = 2.00'],
    correctIndex: 1,
    explanation:
      'Gradient descent update rule: w_new = w_old - η · (∂L/∂w) = 1.40 - (0.50 × 0.60) = 1.40 - 0.30 = 1.10.',
  },
  {
    id: 'c5',
    category: 'Network Architecture',
    title: 'Analyze Vanishing Gradient Vulnerability',
    scenario:
      'A network has 8 consecutive hidden layers, all equipped with standard Sigmoid activations. During backpropagation, the gradients reaching the first hidden layer are virtually 0.00001.',
    question: 'Why did the gradient vanish, and how does ReLU resolve this?',
    options: [
      'The optimizer learning rate was accidentally initialized to zero.',
      'Sigmoid outputs negative activations that cancel positive gradients.',
      ' Layer bias vectors were initialized with magnitudes that were too small.',
      'Sigmoid slopes are at most 0.25, whereas ReLU has slope 1.0 for z > 0.',
    ],
    correctIndex: 3,
    explanation:
      'Because σ′(z) ≤ 0.25 for all z, multiplying derivatives across 8 layers causes exponential decay: 0.25⁸ ≈ 0.000015. ReLU has slope = 1 for positive values, enabling gradients to flow without diminishing.',
  },
  {
    id: 'c6',
    category: 'Convolutional Arithmetic',
    title: 'Calculate 2D Convolution Output Spatial Grid',
    scenario:
      'An input image of spatial dimension 32×32 is passed into a 2D convolution layer with kernel size K = 5, padding P = 2, and stride S = 2.',
    question: 'What is the spatial width and height of the resulting output feature map?',
    options: ['14×14', '16×16', '15×15', '28×28'],
    correctIndex: 1,
    explanation:
      'Output formula: W_out = ⌊(W_in - K + 2P)/S⌋ + 1 = ⌊(32 - 5 + 2(2))/2⌋ + 1 = ⌊31/2⌋ + 1 = 15 + 1 = 16. The output spatial grid is 16×16.',
  },
  {
    id: 'c7',
    category: 'ResNet Dynamics',
    title: 'Verify Residual Highway Gradient Flow',
    scenario:
      'In a deep ResNet residual block H(x) = F(x) + x, the upstream gradient ∂L/∂H = 0.85 arrives at the output addition node. The local gradient through the parameterized convolutional path is ∂F/∂x = -0.15.',
    question: 'What is the exact gradient ∂L/∂x flowing backward to the preceding layer?',
    options: [
      '∂L/∂x = -0.1275',
      '∂L/∂x = 0.7225',
      '∂L/∂x = 0.8500',
      '∂L/∂x = 0.0000',
    ],
    correctIndex: 1,
    explanation:
      'Gradient highway theorem: ∂L/∂x = ∂L/∂H · (∂F/∂x + I) = 0.85 × (-0.15 + 1.0) = 0.85 × 0.85 = 0.7225. Because of the additive identity term +1, the signal cannot vanish.',
  },
  {
    id: 'c8',
    category: 'Compound Model Scaling',
    title: 'Evaluate EfficientNet FLOPs Scaling Factor',
    scenario:
      'EfficientNet scales depth by α^φ, width by β^φ, and resolution by γ^φ under the principled constraint α · β² · γ² ≈ 2.',
    question:
      'If you scale the compound coefficient from φ = 0 (B0) to φ = 3 (B3), by approximately what factor do the computational FLOPs increase?',
    options: [
      'FLOPs increase by approximately 2³ = 8×',
      'FLOPs increase linearly by a factor of 3×',
      'FLOPs increase quadratically by a factor of 9×',
      'FLOPs remain constant across all φ values',
    ],
    correctIndex: 0,
    explanation:
      'By constraining α · β² · γ² ≈ 2, scaling by compound coefficient φ doubles FLOPs for every unit increase. Moving from φ = 0 to φ = 3 multiplies total FLOPs by approximately 2³ = 8×.',
  },
  {
    id: 'c9',
    category: 'Transformer Attention',
    title: 'Identify Purpose of √d_k Attention Temperature',
    scenario:
      'A researcher designs a self-attention model with head dimension d_k = 64. When computing Attention(Q, K, V), they omit the 1/√d_k divisor.',
    question: 'What mathematical pathology will emerge during training?',
    options: [
      'The output context vectors become strictly negative numbers.',
      'The square attention weight matrix becomes non-invertible.',
      'Large dot-product variance saturates Softmax and vanishes gradients.',
      'All token representations collapse into fixed identity matrices.',
    ],
    correctIndex: 2,
    explanation:
      'For independent zero-mean unit-variance components, Var(q · k) = d_k = 64. Extreme dot product values cause Softmax to saturate near 1 and 0, where the derivative approaches 0.',
  },
  {
    id: 'c10',
    category: 'Regularization',
    title: 'Calculate Inverted Dropout Scaling Factor',
    scenario:
      'During training of a dense layer, you set dropout rate p = 0.40 (40% probability of dropping any unit). The surviving 60% of activations are scaled by an inverted dropout factor.',
    question:
      'What is the required inverted scaling factor applied to surviving activations during training?',
    options: [
      'Scale by 1 / (1 - 0.40) ≈ 1.667',
      'Scale by p = 0.400 during training',
      'Scale by (1 - p) = 0.600 during training',
      'Scale by 1.000 (no scaling needed)',
    ],
    correctIndex: 0,
    explanation:
      'Inverted dropout scales surviving activations by 1/(1-p) = 1/0.60 ≈ 1.667 during training so that the expected sum of activations matches between training and test time.',
  },
];
