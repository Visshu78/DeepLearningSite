export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DetailedLessonContent {
  slug: string;
  intuition: string[];
  mathFormulas: Array<{
    name: string;
    latex: string;
    explanation: string;
  }>;
  workedExample: {
    scenario: string;
    steps: Array<{ label: string; math: string; note: string }>;
    result: string;
    params?: Record<string, unknown>;
  };
  quiz: QuizQuestion[];
  summary: string[];
}

export const LESSON_DETAILS: Record<string, DetailedLessonContent> = {
  'what-is-an-artificial-neuron': {
    slug: 'what-is-an-artificial-neuron',
    intuition: [
      'An artificial neuron (or perceptron) is inspired by the biological nerve cell. Biological dendrites receive incoming signals; the soma aggregates them; and if the total signal exceeds a threshold, the axon fires an outgoing impulse.',
      'In deep learning, an artificial neuron performs two fundamental operations in sequence: a linear aggregation of inputs followed by a non-linear activation.',
      'Inputs (x₁, x₂, …) represent features of the data (such as house square footage or pixel brightness).',
      'Weights (w₁, w₂, …) act as dials controlling how much each feature influences the neuron. A positive weight excites the neuron; a negative weight inhibits it.',
      'The bias (b) is an offset that shifts the activation threshold independently of any input features. It allows the neuron to activate even when all inputs are zero.'
    ],
    mathFormulas: [
      {
        name: 'Pre-Activation Linear Combination',
        latex: 'z = \\sum_{i=1}^{n} w_i x_i + b = \\mathbf{w}^T \\mathbf{x} + b',
        explanation: 'Each input feature is multiplied by its corresponding weight parameter, summed together, and adjusted by the bias scalar b.'
      },
      {
        name: 'Post-Activation Output',
        latex: 'a = \\phi(z)',
        explanation: 'The scalar z passes through an activation function φ (such as ReLU or Sigmoid) to introduce non-linearity and produce the neuron’s output activation.'
      }
    ],
    workedExample: {
      scenario: 'A neuron evaluates two features: x₁ = 1.50 and x₂ = -0.80, with weights w₁ = 0.80, w₂ = -1.20, bias b = 0.20, and ReLU activation (matching the workbench default).',
      steps: [
        { label: 'Step 1: Compute weighted inputs', math: 'w_1 x_1 = 0.80 \\times 1.50 = 1.20, \\quad w_2 x_2 = (-1.20) \\times (-0.80) = 0.96', note: 'Linear multiplication of each feature by weight.' },
        { label: 'Step 2: Aggregate the sum', math: '\\sum (w_i x_i) = 1.20 + 0.96 = 2.16', note: 'Both inputs contribute positively to the excitation.' },
        { label: 'Step 3: Add the bias', math: 'z = 2.16 + 0.20 = 2.36', note: 'Pre-activation value before non-linear gating.' },
        { label: 'Step 4: Apply activation φ(z) = ReLU(z)', math: 'a = \\max(0, 2.36) = 2.36', note: 'Because z is positive, ReLU passes the signal uninhibited with local slope φ\'(z) = 1.0.' }
      ],
      result: 'Final neuron output a = 2.360',
      params: {
        inputs: [1.5, -0.8],
        weights: [0.8, -1.2],
        bias: 0.2,
        activation: 'relu'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'What is the role of the bias parameter b in a neuron?',
        options: [
          'It normalizes the input features to zero mean and unit variance.',
          'It allows the neuron to shift its activation threshold independently of the inputs.',
          'It acts as the learning rate during backward propagation.',
          'It forces the output of the neuron to remain between 0 and 1.'
        ],
        correctIndex: 1,
        explanation: 'Without a bias, the hyperplane formed by wᵀx = 0 is constrained to pass directly through the origin (0, 0, …). The bias allows the decision boundary to shift arbitrarily in the feature space.'
      },
      {
        id: 'q2',
        question: 'If all input features xᵢ = 0, what is the pre-activation z of the neuron?',
        options: [
          'z = 0',
          'z = Σ(wᵢ)',
          'z = b',
          'z = 1'
        ],
        correctIndex: 2,
        explanation: 'Because Σ(wᵢ · 0) = 0, the sum simplifies to z = 0 + b = b. The neuron’s activation is solely dictated by φ(b).'
      }
    ],
    summary: [
      'The artificial neuron computes z = w · x + b and applies a non-linear activation a = φ(z).',
      'Weights control feature orientation and sensitivity; the bias controls the threshold offset.',
      'Single neurons form the foundational computational atoms that compose deep neural networks.'
    ]
  },

  'activation-functions': {
    slug: 'activation-functions',
    intuition: [
      'Why do neural networks need activation functions at all? If every layer only calculated linear combinations (W · x + b), composing multiple layers would simply equal another single linear transformation: W₂ · (W₁ · x + b₁) + b₂ = W_new · x + b_new.',
      'Activation functions introduce non-linearity. This enables networks to approximate arbitrary continuous functions (Universal Approximation Theorem) and fold high-dimensional decision boundaries.',
      'However, not all activation functions behave equally. Sigmoid and Tanh squash inputs into bounded ranges, but their derivatives become virtually zero when inputs are very large or very negative. This causes the famous vanishing gradient problem.',
      'ReLU (Rectified Linear Unit) solves this by maintaining a constant unit derivative (slope = 1) for all positive inputs, allowing gradients to flow unimpeded through hundreds of layers.'
    ],
    mathFormulas: [
      {
        name: 'Sigmoid Function & Derivative',
        latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))',
        explanation: 'Maps (-∞, ∞) to (0, 1). Maximum derivative occurs at z = 0 with value 0.25, meaning gradient shrinks by at least 4x each layer!'
      },
      {
        name: 'Hyperbolic Tangent (Tanh)',
        latex: '\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}, \\quad \\tanh\'(z) = 1 - \\tanh^2(z)',
        explanation: 'Zero-centered with range (-1, 1). Maximum derivative is 1.0 at z = 0, but rapidly approaches 0 when |z| > 2.'
      },
      {
        name: 'Rectified Linear Unit (ReLU)',
        latex: '\\text{ReLU}(z) = \\max(0, z), \\quad \\text{ReLU}\'(z) = \\begin{cases} 1 & \\text{if } z > 0 \\\\ 0 & \\text{if } z \\le 0 \\end{cases}',
        explanation: 'Piecewise linear. Constant gradient of 1 for positive signals; zero for negative signals.'
      }
    ],
    workedExample: {
      scenario: 'Examine a pre-activation of z = 3.0 passing through Sigmoid vs. ReLU and compare their backward gradients.',
      steps: [
        { label: 'Step 1: Calculate Sigmoid activation', math: '\\sigma(3.0) = \\frac{1}{1 + e^{-3}} \\approx 0.9526', note: 'Close to upper saturation ceiling.' },
        { label: 'Step 2: Calculate Sigmoid derivative', math: "\\sigma'(3.0) = 0.9526 \\times (1 - 0.9526) = 0.0451", note: 'Gradient is severely squashed (under 5% remaining).' },
        { label: 'Step 3: Calculate ReLU activation', math: '\\text{ReLU}(3.0) = \\max(0, 3.0) = 3.000', note: 'Unbounded linear transmission.' },
        { label: 'Step 4: Calculate ReLU derivative', math: "\\text{ReLU}'(3.0) = 1.000", note: 'Full 100% gradient transmission without decay.' }
      ],
      result: 'ReLU transmits a gradient 22× larger than Sigmoid at z = 3.0, explaining why deep networks train substantially faster with ReLU.',
      params: { zProbe: 3.0 }
    },
    quiz: [
      {
        id: 'q1',
        question: 'What happens to the gradient during backpropagation when a neuron using Sigmoid receives a large pre-activation like z = 8.0?',
        options: [
          'The gradient explodes towards infinity.',
          'The gradient becomes nearly zero (vanishing gradient).',
          'The gradient remains exactly 1.0.',
          'The gradient oscillates between positive and negative.'
        ],
        correctIndex: 1,
        explanation: 'At z = 8.0, σ(8) ≈ 0.9997, and σ\'(8) ≈ 0.0003. When backpropagating, multiplying upstream gradients by 0.0003 practically annihilates the learning signal.'
      },
      {
        id: 'q2',
        question: 'Why is Leaky ReLU sometimes preferred over standard ReLU?',
        options: [
          'It is faster to calculate than simple multiplication.',
          'It restricts all outputs strictly between -1 and 1.',
          'It avoids "dying neurons" by allowing a small gradient (e.g. 0.01) for negative inputs.',
          'It eliminates the need for bias parameters.'
        ],
        correctIndex: 2,
        explanation: 'When a standard ReLU neuron gets stuck in the negative region, its derivative is 0, so no gradient ever updates its weights again ("dying ReLU"). Leaky ReLU keeps a small slope α > 0 when z < 0 to keep the neuron trainable.'
      }
    ],
    summary: [
      'Non-linear activation functions prevent multi-layer networks from collapsing into linear algebra.',
      'Sigmoid and Tanh suffer from gradient vanishing due to asymptotic saturation at both tails.',
      'ReLU provides clean gradient propagation for positive values, and Leaky ReLU prevents inactive dead neurons.'
    ]
  },

  'forward-propagation': {
    slug: 'forward-propagation',
    intuition: [
      'Forward propagation is the deterministic cascade of computations that transforms input data into an inference or prediction.',
      'In a multi-layer perceptron (MLP), neurons are organized into layers: an input layer, one or more hidden layers, and an output layer.',
      'Signals travel strictly left-to-right (feedforward). Each hidden neuron computes an intermediate feature by combining all activations from the preceding layer.',
      'The intermediate values—pre-activations z^[l] and post-activations a^[l]—are not just discarded after inference; they are stored in memory during training to be used immediately in the backward pass.'
    ],
    mathFormulas: [
      {
        name: 'Layer Pre-Activation Vector',
        latex: '\\mathbf{z}^{[l]} = \\mathbf{W}^{[l]} \\mathbf{a}^{[l-1]} + \\mathbf{b}^{[l]}',
        explanation: 'W^[l] is the weight matrix of shape (n_current × n_previous), multiplied by the previous layer activation vector a^[l-1] and added to bias vector b^[l].'
      },
      {
        name: 'Layer Post-Activation Vector',
        latex: '\\mathbf{a}^{[l]} = \\phi(\\mathbf{z}^{[l]})',
        explanation: 'Element-wise application of the activation function φ across each pre-activation in layer l.'
      }
    ],
    workedExample: {
      scenario: 'A 2-input network has inputs x = [0.50, -0.40]. Hidden neuron 0 has weights [0.70, -0.50] and bias 0.10 with Sigmoid activation (matching workbench default).',
      steps: [
        { label: 'Step 1: Compute linear sum for hidden neuron 0', math: 'z_{h1} = (0.50 \\times 0.70) + (-0.40 \\times -0.50) + 0.10 = 0.35 + 0.20 + 0.10 = 0.65', note: 'Dot product of incoming weights and inputs + bias.' },
        { label: 'Step 2: Apply activation to hidden neuron 0', math: 'a_{h1} = \\sigma(0.65) = \\frac{1}{1 + e^{-0.65}} \\approx 0.6570', note: 'Post-activation ready to feed into the next layer.' },
        { label: 'Step 3: Combine hidden representations at output', math: 'z_{out} = (w_{out1} \\cdot a_{h1}) + (w_{out2} \\cdot a_{h2}) + b_{out}', note: 'Higher-level feature synthesis.' },
        { label: 'Step 4: Output prediction', math: '\\hat{y} = \\sigma(z_{out})', note: 'Produces bounded scalar prediction between 0 and 1.' }
      ],
      result: 'Each layer progressively extracts more abstract, non-linear representations of the raw input.',
      params: {
        inputs: [0.5, -0.4],
        wHidden: [[0.7, -0.5], [-0.4, 0.8]],
        bHidden: [0.1, -0.2],
        wOutput: [0.9, -0.6],
        bOutput: 0.2,
        activation: 'sigmoid'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'If a network has 3 input features, a hidden layer of 4 neurons, and an output layer of 1 neuron, how many total trainable parameters (weights + biases) exist?',
        options: [
          '12 parameters',
          '17 parameters (12 hidden weights + 4 hidden biases + 4 output weights + 1 output bias)',
          '21 parameters (12 hidden weights + 4 hidden biases + 4 output weights + 1 output bias)',
          '8 parameters'
        ],
        correctIndex: 2,
        explanation: 'Hidden layer: 3 × 4 weights + 4 biases = 16 parameters. Output layer: 4 × 1 weights + 1 bias = 5 parameters. Total = 16 + 5 = 21 parameters.'
      }
    ],
    summary: [
      'Forward propagation flows layer-by-layer: Input → Hidden Linear Sum → Hidden Activation → Output Linear Sum → Prediction.',
      'Caching intermediate pre-activations z and activations a is required for computing analytical gradients during backpropagation.'
    ]
  },

  'loss-functions': {
    slug: 'loss-functions',
    intuition: [
      'To train a neural network, we must quantify how wrong its predictions are. This metric is defined by the loss function (also called objective or cost function).',
      'The loss function outputs a non-negative scalar: a loss of 0 represents a perfect prediction, while larger numbers denote worse performance.',
      'For continuous regression problems, Mean Squared Error (MSE) is standard: it measures the squared difference between the network prediction ŷ and the ground truth target y.',
      'Note on conventions: In mathematical derivations, single-sample loss is often scaled by 1/2: L = 1/2(ŷ - y)². This ensures the derivative cancels out cleanly: ∂L/∂ŷ = ŷ - y. For reporting dataset metrics, the unscaled average MSE = 1/N Σ(ŷ - y)² is typically cited.'
    ],
    mathFormulas: [
      {
        name: 'Single-Sample Scaled Squared Error',
        latex: 'L(y, \\hat{y}) = \\frac{1}{2}(\\hat{y} - y)^2',
        explanation: 'The factor 1/2 cancels cleanly when taking the derivative with respect to ŷ, leaving exactly (ŷ - y).'
      },
      {
        name: 'Loss Derivative (Gradient Signal)',
        latex: '\\frac{\\partial L}{\\partial \\hat{y}} = \\hat{y} - y',
        explanation: 'If the prediction is too high (ŷ > y), the derivative is positive, instructing the optimizer to decrease parameters. If ŷ < y, it instructs an increase.'
      },
      {
        name: 'Dataset Cost Function (Unscaled Average MSE)',
        latex: 'J(\\mathbf{W}, \\mathbf{b}) = \\frac{1}{N} \\sum_{i=1}^{N} (\\hat{y}^{(i)} - y^{(i)})^2',
        explanation: 'Averages individual sample squared errors across the entire training dataset to quantify general model fit.'
      }
    ],
    workedExample: {
      scenario: 'A target value is y = 1.00. The neural network predicts ŷ = 0.40 (matching workbench default). Let us compute the scaled single-sample loss and initial gradient signal.',
      steps: [
        { label: 'Step 1: Calculate error residual', math: 'e = \\hat{y} - y = 0.40 - 1.00 = -0.60', note: 'Model underpredicted the target.' },
        { label: 'Step 2: Calculate squared loss L', math: 'L = \\frac{1}{2}(-0.60)^2 = 0.50 \\times 0.36 = 0.180', note: 'Non-negative penalty.' },
        { label: 'Step 3: Compute initial gradient ∂L/∂ŷ', math: '\\frac{\\partial L}{\\partial \\hat{y}} = \\hat{y} - y = -0.600', note: 'Negative gradient points backward, instructing model to increase ŷ.' }
      ],
      result: 'Loss is 0.180; gradient signal is -0.600, which propagates backward through the network to update all weights.',
      params: { target: 1.0, prediction: 0.4 }
    },
    quiz: [
      {
        id: 'q1',
        question: 'If a model predicts ŷ = 2.5 for a target y = 1.0, what is the gradient ∂L/∂ŷ under L = 0.5(ŷ - y)²?',
        options: [
          '+1.5',
          '-1.5',
          '2.25',
          '0.75'
        ],
        correctIndex: 0,
        explanation: '∂L/∂ŷ = ŷ - y = 2.5 - 1.0 = +1.5. A positive gradient indicates that increasing ŷ increases the loss, so gradient descent will step in the negative direction (-1.5) to push ŷ down.'
      }
    ],
    summary: [
      'The loss function maps prediction error into a single scalar reward/penalty surface.',
      'The derivative of the loss function provides the anchor gradient signal for backpropagation.'
    ]
  },

  'gradient-descent': {
    slug: 'gradient-descent',
    intuition: [
      'Imagine standing on a hilly landscape in thick fog. You cannot see the lowest valley, but you can feel the slope of the ground beneath your boots.',
      'To reach the bottom, you take a step in the direction of the steepest downward slope. This is the core intuition of Gradient Descent.',
      'The gradient vector ∇L points in the direction of steepest ascent (where loss increases fastest). Therefore, stepping in the negative gradient direction (-∇L) guarantees moving toward lower loss.',
      'The learning rate η (eta) controls the step size. If η is too small, convergence takes thousands of iterations. If η exceeds the mathematical stability limit (η > 2/L_max for quadratic bowls), updates will overshoot the valley, bounce wildly, and diverge to infinity!'
    ],
    mathFormulas: [
      {
        name: 'Gradient Descent Parameter Update Rule',
        latex: '\\theta_{t+1} = \\theta_t - \\eta \\cdot \\nabla_\\theta L(\\theta_t)',
        explanation: 'The new parameter θ_{t+1} is obtained by subtracting the scaled gradient (learning rate η times derivative dL/dθ) from the current parameter θ_t.'
      },
      {
        name: 'Learning Rate Stability Condition',
        latex: '\\eta < \\frac{2}{L_{\\max}}',
        explanation: 'For quadratic surfaces with curvature L_max, if η exceeds 2/L_max, oscillations grow unboundedly and gradient descent diverges.'
      }
    ],
    workedExample: {
      scenario: 'Optimize L(θ) = 0.5(θ - 2)², starting at θ₀ = 5.0 with learning rate η = 0.20 (matching workbench default). The derivative is L\'(θ) = θ - 2.',
      steps: [
        { label: 'Step 1: Evaluate loss & gradient at θ₀ = 5.0', math: 'L(5.0) = 0.5(3.0)^2 = 4.50, \\quad L\'(5.0) = 5.0 - 2.0 = 3.00', note: 'Positive slope: moving right increases loss.' },
        { label: 'Step 2: Compute update Δθ', math: '\\Delta\\theta = -\\eta \\cdot L\'(5.0) = -0.20 \\times 3.00 = -0.60', note: 'Step moves left toward minimum.' },
        { label: 'Step 3: Update parameter θ₁', math: '\\theta_1 = 5.0 - 0.60 = 4.40', note: 'Loss drops from 4.50 to 0.5(2.40)² = 2.88.' },
        { label: 'Step 4: Next step at θ₁ = 4.40', math: 'L\'(4.40) = 2.40, \\quad \\theta_2 = 4.40 - (0.20 \\times 2.40) = 3.92', note: 'Rapid geometric convergence toward true minimum at θ = 2.0.' }
      ],
      result: 'In just 2 steps, θ moved from 5.0 → 4.40 → 3.92, cutting loss from 4.50 down to 1.84.',
      params: { theta: 5.0, lr: 0.2, preset: 'convex_quadratic' }
    },
    quiz: [
      {
        id: 'q1',
        question: 'What happens when the learning rate η is set significantly too high on a curved loss bowl?',
        options: [
          'The optimizer stops immediately because gradient becomes 0.',
          'The updates overshoot the minimum, leading to growing oscillations and numerical divergence.',
          'The optimizer finds the global minimum in fewer steps.',
          'The weights freeze and stop changing.'
        ],
        correctIndex: 1,
        explanation: 'When the step size -η·gradient is larger than the distance across the valley, each step lands further up the opposite wall, causing the loss to explode.'
      }
    ],
    summary: [
      'Gradient descent updates parameters iteratively: θ ← θ - η · (dL/dθ).',
      'The learning rate is a critical hyperparameter that balances convergence speed against numerical stability.',
      'Watching the loss trajectory over time diagnoses whether the learning rate is optimal, sluggish, or divergent.'
    ]
  },

  'backpropagation-fundamentals': {
    slug: 'backpropagation-fundamentals',
    intuition: [
      'Backpropagation is the mathematical engine of deep learning. It answers one vital question: for every single weight and bias in the network, how much did that parameter contribute to the final loss?',
      'Because deep networks are compositions of functions (layer 3 depends on layer 2, which depends on layer 1), we compute partial derivatives using the multivariate Calculus Chain Rule.',
      'Instead of recomputing derivatives from scratch for every parameter, backpropagation works backward from the output loss toward the inputs, reusing intermediate error terms (δ = ∂L/∂z).',
      'This dynamic programming approach turns what would be an exponential complexity problem into an efficient O(N) calculation proportional to the number of connections in the network.'
    ],
    mathFormulas: [
      {
        name: 'Output Layer Error Term (Delta)',
        latex: '\\delta^{[out]} = \\frac{\\partial L}{\\partial z^{[out]}} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\phi\'(z^{[out]})',
        explanation: 'Combines the initial loss gradient (how much the loss changes with prediction) with the output neuron’s activation slope.'
      },
      {
        name: 'Weight Gradient Rule',
        latex: '\\frac{\\partial L}{\\partial w_{ij}} = \\delta_j \\cdot a_i',
        explanation: 'The gradient of any weight connecting neuron i to neuron j is simply the error term δ of receiving neuron j multiplied by the incoming activation of sending neuron i!'
      },
      {
        name: 'Hidden Layer Error Propagation',
        latex: '\\delta_j^{[l]} = \\left( \\sum_k w_{kj}^{[l+1]} \\delta_k^{[l+1]} \\right) \\cdot \\phi\'(z_j^{[l]})',
        explanation: 'Error signals flow backward across the transpose of the weight matrix and are scaled by the hidden activation derivative.'
      }
    ],
    workedExample: {
      scenario: 'In our 2-2-1 network with inputs [0.60, -0.30] and target y = 0.90 (matching workbench default), forward inference yields ŷ ≈ 0.600 and loss L ≈ 0.045. Let us trace the output weight gradient.',
      steps: [
        { label: 'Step 1: Compute loss gradient ∂L/∂ŷ', math: '\\frac{\\partial L}{\\partial \\hat{y}} = \\hat{y} - y = 0.600 - 0.900 = -0.300', note: 'Initial prediction error.' },
        { label: 'Step 2: Compute output delta δ_out = ∂L/∂z_out', math: '\\delta_{out} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\sigma\'(z_{out}) = -0.300 \\times 0.240 = -0.072', note: 'Scaled by activation derivative.' },
        { label: 'Step 3: Compute weight gradient ∂L/∂w_out1', math: '\\frac{\\partial L}{\\partial w_{out1}} = \\delta_{out} \\cdot a_{h1} = -0.072 \\times 0.627 \\approx -0.045', note: 'Product of upstream delta and incoming activation.' },
        { label: 'Step 4: Update weight with lr = 0.50', math: 'w_{new} = w_{old} - (0.50 \\times -0.045) = w_{old} + 0.0225', note: 'Weight increases, nudging prediction closer to 0.90 and reducing loss.' }
      ],
      result: 'The analytical derivative directly quantifies the exact adjustment needed for every individual parameter.',
      params: {
        inputs: [0.6, -0.3],
        target: 0.9,
        lr: 0.5
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Under the chain rule, what two terms make up the gradient of a weight ∂L/∂w_ij connecting activation a_i to pre-activation z_j?',
        options: [
          'The learning rate η and the target y.',
          'The upstream error delta δ_j = ∂L/∂z_j and the incoming activation a_i.',
          'The bias b_j and the loss L.',
          'The input feature x_i and the weight w_ij.'
        ],
        correctIndex: 1,
        explanation: 'By the chain rule, ∂L/∂w_ij = (∂L/∂z_j) · (∂z_j/∂w_ij). Because z_j = Σ(w_ik · a_k) + b_j, the derivative ∂z_j/∂w_ij is simply the incoming activation a_i. Thus, ∂L/∂w_ij = δ_j · a_i.'
      },
      {
        id: 'q2',
        question: 'How do researchers and engineers mathematically verify that an analytical backpropagation algorithm is free of bugs?',
        options: [
          'By running more training epochs until accuracy improves.',
          'By comparing analytical gradients to numerical gradients computed using finite differences (gradient checking).',
          'By removing all non-linear activation functions.',
          'By setting the learning rate to zero.'
        ],
        correctIndex: 1,
        explanation: 'Finite difference approximation [L(θ + ε) - L(θ - ε)] / (2ε) calculates numerical derivatives directly from the loss. If the analytical gradient matches the numerical gradient to within 1e-4 relative tolerance, the backpropagation code is verified mathematically!'
      }
    ],
    summary: [
      'Backpropagation applies the calculus chain rule recursively from the loss layer backward to the input layer.',
      'Every weight gradient equals the product of the receiving neuron\'s error delta δ and the sending neuron\'s activation a.',
      'Numerical gradient checking provides mathematical assurance that analytical derivatives are correct.'
    ]
  }
};
