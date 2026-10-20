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
  },
  'convolutional-filters': {
    slug: 'convolutional-filters',
    intuition: [
      'Fully-connected networks treat every pixel independently, discarding the critical 2D spatial arrangement of visual data.',
      'A convolutional layer slides a compact matrix of learnable parameters (a kernel or filter) across an image, computing local dot-products.',
      'Weight sharing means the same filter is applied at every spatial position, providing translation equivariance: if a feature shifts, its representation in the feature map shifts identically.',
      'Padding allows preserving image border dimensions, while stride controls how many pixels the filter hops between evaluations.'
    ],
    mathFormulas: [
      {
        name: 'Discrete 2D Cross-Correlation / Convolution',
        latex: 'S(i, j) = (I * K)(i, j) = \\sum_m \\sum_n I(i + m, j + n) K(m, n) + b',
        explanation: 'At each spatial coordinate (i, j), the kernel elements K(m, n) are multiplied by the overlapping input patch I(i+m, j+n) and summed with a bias b.'
      },
      {
        name: 'Output Dimension Formula',
        latex: 'W_{out} = \\left\\lfloor \\frac{W_{in} - K + 2P}{S} \\right\\rfloor + 1',
        explanation: 'Output spatial width depends on input width W_in, kernel width K, zero-padding P on each side, and stride S.'
      }
    ],
    workedExample: {
      scenario: 'Convolving a 3×3 patch of pixels [[10, 10, 90], [10, 10, 90], [10, 10, 90]] with a Sobel Vertical Filter [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] and zero bias.',
      steps: [
        { label: 'Step 1: Top row product', math: '(10 \\times -1) + (10 \\times 0) + (90 \\times 1) = -10 + 0 + 90 = 80', note: 'Strong contrast across column boundary.' },
        { label: 'Step 2: Center row product', math: '(10 \\times -2) + (10 \\times 0) + (90 \\times 2) = -20 + 0 + 180 = 160', note: 'Center row receives double weight in Sobel.' },
        { label: 'Step 3: Bottom row product', math: '(10 \\times -1) + (10 \\times 0) + (90 \\times 1) = -10 + 0 + 90 = 80', note: 'Symmetric vertical boundary contribution.' },
        { label: 'Step 4: Sum and bias', math: 'S = 80 + 160 + 80 + 0 = 320', note: 'Large positive output indicates an intense vertical dark-to-bright edge.' }
      ],
      result: 'Output feature value = 320.0',
      params: {
        kernel: 'Sobel Vertical',
        stride: 1,
        padding: 0
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary architectural advantage of weight sharing in convolutional layers compared to dense layers?',
        options: [
          'It forces every neuron to have zero bias.',
          'It dramatically reduces the number of learnable parameters while establishing translation equivariance.',
          'It eliminates the need for non-linear activation functions.',
          'It guarantees the loss surface is strictly convex.'
        ],
        correctIndex: 1,
        explanation: 'In a fully connected layer for a 256x256 image with 100 hidden units, there would be 6.5 million weights. A 3x3 convolution has only 9 weights plus a bias regardless of image size, drastically reducing overfitting while encoding the inductive bias that visual features can appear anywhere in the image.'
      },
      {
        id: 'q2',
        question: 'Given an input of size 32×32, a 5×5 filter, padding P=2, and stride S=1, what is the output spatial size?',
        options: [
          '28 × 28',
          '30 × 30',
          '32 × 32',
          '36 × 36'
        ],
        correctIndex: 2,
        explanation: 'Using W_out = ⌊(W_in - K + 2P)/S⌋ + 1 = ⌊(32 - 5 + 4)/1⌋ + 1 = 31 + 1 = 32. Padding P = (K-1)/2 with stride S=1 perfectly preserves spatial resolution ("Same" padding).'
      }
    ],
    summary: [
      'Convolutions apply local sliding filters to extract translation-invariant visual patterns.',
      'Weight sharing enables deep networks to process high-resolution images with very few parameters.',
      'Output spatial dimensions are strictly governed by input size, kernel size, padding, and stride.'
    ]
  },
  'pooling-and-receptive-fields': {
    slug: 'pooling-and-receptive-fields',
    intuition: [
      'Once a feature (such as an eye or edge) is detected, its exact sub-pixel coordinate is less important than its relative arrangement to other features.',
      'Pooling downsamples feature maps by summarizing local neighborhoods into a single representative value (typically via Max or Average).',
      'Max pooling introduces local translational invariance: small shifts in the input do not alter the maximum response.',
      'Crucially, pooling accelerates receptive field expansion: downstream neurons cover progressively wider swaths of the original image.'
    ],
    mathFormulas: [
      {
        name: 'Max Pooling Operation',
        latex: 'y_{i, j} = \\max_{(p, q) \\in \\Omega(i, j)} x_{p, q}',
        explanation: 'Computes the maximum activation value across all coordinates (p, q) inside window neighborhood Ω.'
      },
      {
        name: 'Receptive Field Recurrence Formula',
        latex: 'RF_l = RF_{l-1} + (k_l - 1) \\cdot S_{cumulative, l-1}',
        explanation: 'The receptive field of layer l grows as a function of previous receptive field RF_{l-1}, kernel size k_l, and cumulative stride through previous layers.'
      }
    ],
    workedExample: {
      scenario: 'Applying 2×2 Max Pooling with stride S=2 to a 4×4 patch [[12, 20, 30, 0], [8, 12, 2, 0], [34, 70, 37, 4], [112, 100, 25, 12]].',
      steps: [
        { label: 'Step 1: Top-Left 2×2 window', math: '\\max(12, 20, 8, 12) = 20', note: 'Picks dominant local excitation.' },
        { label: 'Step 2: Top-Right 2×2 window', math: '\\max(30, 0, 2, 0) = 30', note: 'Captures peak edge presence.' },
        { label: 'Step 3: Bottom-Left 2×2 window', math: '\\max(34, 70, 112, 100) = 112', note: 'Highest activation in lower corner.' },
        { label: 'Step 4: Bottom-Right 2×2 window', math: '\\max(37, 4, 25, 12) = 37', note: 'Downsampled 2×2 result obtained.' }
      ],
      result: 'Downsampled 2×2 map: [[20, 30], [112, 37]]',
      params: {
        poolSize: 2,
        stride: 2,
        type: 'max'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Why is Max Pooling generally preferred over Average Pooling for feature extraction in modern convolutional classification networks?',
        options: [
          'Average pooling requires learnable weights, while max pooling has none.',
          'Max pooling preserves sharp, high-contrast salient features, whereas average pooling blurs and attenuates strong activations.',
          'Max pooling guarantees the output matrix has odd dimensions.',
          'Average pooling cannot be used with ReLU activations.'
        ],
        correctIndex: 1,
        explanation: 'Max pooling acts as an existential check ("did this feature occur in this patch?"). Average pooling dilutes strong feature signals by averaging them with surrounding zero/background activations.'
      },
      {
        id: 'q2',
        question: 'What happens to the receptive field of subsequent convolutional layers when a 2×2 max pooling layer with stride 2 is inserted?',
        options: [
          'It stays constant at 1 pixel.',
          'It shrinks by 50%.',
          'It doubles the cumulative stride, causing all downstream filters to expand their receptive field twice as quickly.',
          'It removes all positional information permanently.'
        ],
        correctIndex: 2,
        explanation: 'Because cumulative stride multiplies by 2, every unit of step in downstream filters spans twice as many original pixels in the input space, rapidly broadening the neuron\'s contextual view.'
      }
    ],
    summary: [
      'Pooling reduces spatial dimensions while providing local translation tolerance.',
      'Max pooling retains dominant features without introducing learnable parameters.',
      'Stacked pooling layers expand the effective receptive field exponentially across depth.'
    ]
  },
  'regularization-dropout': {
    slug: 'regularization-dropout',
    intuition: [
      'A neural network with millions of parameters has sufficient expressive power to memorize individual training samples, including idiosyncratic noise.',
      'When a model fits training noise, its training loss reaches near-zero while test loss explodes—a state termed Overfitting or High Variance.',
      'L2 Regularization (Weight Decay) discourages large weights by penalizing their squared magnitudes, ensuring individual neurons cannot develop overly brittle sensitivities.',
      'Dropout temporarily disables random subsets of neurons during each training step, breaking co-dependencies and acting like an ensemble of exponentially many thinned networks.'
    ],
    mathFormulas: [
      {
        name: 'L2 Regularized Loss Objective',
        latex: 'L_{reg}(\\mathbf{w}) = L_0(\\mathbf{w}) + \\frac{\\lambda}{2} \\sum_{j} w_j^2 = L_0(\\mathbf{w}) + \\frac{\\lambda}{2} \\|\\mathbf{w}\\|^2_2',
        explanation: 'The standard data loss L_0 is penalized by the sum of squared weights scaled by hyperparameter λ.'
      },
      {
        name: 'Weight Decay Gradient Update',
        latex: '\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta \\left( \\nabla L_0(\\mathbf{w}_t) + \\lambda \\mathbf{w}_t \\right) = (1 - \\eta \\lambda) \\mathbf{w}_t - \\eta \\nabla L_0(\\mathbf{w}_t)',
        explanation: 'At each update, the weight is multiplied by a decay factor (1 - ηλ) < 1 before subtracting the ordinary data gradient.'
      },
      {
        name: 'Inverted Dropout Scaling',
        latex: '\\tilde{a}_i = \\frac{m_i}{1 - p} a_i, \\quad m_i \\sim \\text{Bernoulli}(1 - p)',
        explanation: 'During training, surviving activations are scaled by 1/(1-p) so expected activation values match between training and inference.'
      }
    ],
    workedExample: {
      scenario: 'A weight w = 2.0 with data gradient ∂L_0/∂w = 0.4, learning rate η = 0.1, and L2 regularization strength λ = 0.05.',
      steps: [
        { label: 'Step 1: Compute weight decay penalty', math: '\\lambda w = 0.05 \\times 2.0 = 0.10', note: 'Directly proportional to current weight magnitude.' },
        { label: 'Step 2: Total gradient', math: 'g_{total} = \\nabla L_0 + \\lambda w = 0.40 + 0.10 = 0.50', note: 'Regularization pushes weight toward zero.' },
        { label: 'Step 3: Update weight', math: 'w_{new} = 2.0 - (0.10 \\times 0.50) = 2.0 - 0.05 = 1.95', note: 'Without regularization, w would have been 2.0 - 0.04 = 1.96.' },
        { label: 'Step 4: Long-term shrinkage', math: '(1 - \\eta \\lambda) = (1 - 0.005) = 0.995', note: 'In the absence of data signal, the parameter decays exponentially to zero.' }
      ],
      result: 'Updated weight w = 1.95 (regularization restrained parameter growth)',
      params: {
        weight: 2.0,
        lr: 0.1,
        lambda: 0.05
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Why does "Inverted Dropout" scale surviving activations by 1 / (1 - p) during the training phase?',
        options: [
          'To ensure the gradients do not vanish at the output layer.',
          'So that the expected value of the activation remains identical, requiring no modification or scaling during evaluation/test time.',
          'To turn all negative activations into positive activations.',
          'To force half the weights to strictly equal zero.'
        ],
        correctIndex: 1,
        explanation: 'If 50% of neurons are zeroed (p=0.5), the total forward signal would drop by half. Scaling surviving nodes by 1/(1-0.5) = 2x preserves the expected sum E[a] = a. At inference time, dropout is simply disabled and no scaling operations are needed.'
      },
      {
        id: 'q2',
        question: 'In terms of model parameter distributions, what is the primary visual difference between L1 (Lasso) and L2 (Ridge) regularization?',
        options: [
          'L1 forces many parameter weights to become strictly zero (sparsity), while L2 shrinks weights smoothly toward zero without exact sparsity.',
          'L2 causes weights to grow exponentially large.',
          'L1 can only be applied to convolutional layers.',
          'L2 is incompatible with backpropagation.'
        ],
        correctIndex: 0,
        explanation: 'L1 penalty |w| has a constant gradient ±λ everywhere except zero, driving uninformative weights strictly to 0 (feature selection). L2 penalty (λ/2)w² has gradient λw, which becomes infinitesimally small as w approaches 0, producing small diffuse non-zero weights.'
      }
    ],
    summary: [
      'Overfitting is diagnosed when training loss continues decreasing while out-of-sample test error increases.',
      'L2 weight decay penalizes large weights, suppressing high-frequency function oscillations.',
      'Inverted dropout prevents co-adaptation by randomly masking activations and scaling survivors by 1/(1-p).'
    ]
  },
  'adaptive-optimizers': {
    slug: 'adaptive-optimizers',
    intuition: [
      'Standard gradient descent uses a single uniform learning rate for all parameters, which fails catastrophically when error surfaces have uneven curvature.',
      'In anisotropic ravines (valleys steep in one direction and gentle in another), SGD bounces back and forth across the steep canyon walls while making minimal progress along the valley floor.',
      'Momentum builds physical velocity along consistent gradient directions, averaging out orthogonal oscillations like a heavy ball rolling downhill.',
      'RMSprop and Adam compute per-parameter adaptive learning rates by tracking moving averages of squared gradients, taking larger strides along gentle slopes and cautious steps along steep cliffs.'
    ],
    mathFormulas: [
      {
        name: 'Momentum Vector Update',
        latex: '\\mathbf{v}_t = \\beta \\mathbf{v}_{t-1} + (1 - \\beta) \\mathbf{g}_t, \\quad \\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\eta \\mathbf{v}_t',
        explanation: 'Velocity vector v_t accumulates past gradients with momentum discount coefficient β (typically 0.9).'
      },
      {
        name: 'RMSprop Moving Second Moment',
        latex: '\\mathbf{s}_t = \\beta \\mathbf{s}_{t-1} + (1 - \\beta) \\mathbf{g}_t^2, \\quad \\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\frac{\\eta}{\\sqrt{\\mathbf{s}_t} + \\epsilon} \\odot \\mathbf{g}_t',
        explanation: 'Maintains an exponential average of squared gradients s_t and divides step sizes by its root.'
      },
      {
        name: 'Adam (Adaptive Moment Estimation)',
        latex: '\\hat{\\mathbf{m}}_t = \\frac{\\mathbf{m}_t}{1 - \\beta_1^t}, \\quad \\hat{\\mathbf{v}}_t = \\frac{\\mathbf{v}_t}{1 - \\beta_2^t}, \\quad \\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\frac{\\eta}{\\sqrt{\\hat{\\mathbf{v}}_t} + \\epsilon} \\hat{\\mathbf{m}}_t',
        explanation: 'Combines first moments (momentum) with second moments (RMSprop), corrected for zero-initialization bias via (1 - β^t).'
      }
    ],
    workedExample: {
      scenario: 'In an anisotropic ravine L(x, y) = 0.5x² + 8y² at point (-3, 1), gradient is gx = -3, gy = 16. Compare the step for SGD vs RMSprop (with running second moment sx=9, sy=256, lr=0.1).',
      steps: [
        { label: 'Step 1: Standard SGD step', math: '\\Delta x = -0.1 \\times (-3) = +0.30, \\quad \\Delta y = -0.1 \\times 16 = -1.60', note: 'SGD takes a huge leap in y (-1.6), overshooting the valley floor to y = -0.6.' },
        { label: 'Step 2: RMSprop scaling factors', math: '\\sqrt{s_x} = \\sqrt{9} = 3.0, \\quad \\sqrt{s_y} = \\sqrt{256} = 16.0', note: 'Quantifies magnitude of recent variations per axis.' },
        { label: 'Step 3: RMSprop normalized update', math: '\\Delta x = -0.1 \\times \\frac{-3}{3} = +0.10, \\quad \\Delta y = -0.1 \\times \\frac{16}{16} = -0.10', note: 'Both axes receive balanced, stable unit updates.' },
        { label: 'Step 4: Convergence trajectory', math: 'y_{new} = 1.0 - 0.10 = 0.90', note: 'RMSprop avoids destructive oscillations and navigates cleanly down the ravine.' }
      ],
      result: 'RMSprop auto-scales the steep coordinate to prevent oscillation, ensuring steady progress.',
      params: {
        x: -3,
        y: 1,
        lr: 0.1
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Why does Adam include the bias correction terms (1 - β₁ᵗ) and (1 - β₂ᵗ) in its formulation?',
        options: [
          'To prevent the learning rate from ever reaching zero.',
          'Because the moment vectors m₀ and v₀ are initialized at zero, causing early estimates to be severely biased toward zero during the initial training steps.',
          'To ensure the gradients satisfy the Cauchy-Schwarz inequality.',
          'To replace the need for backpropagation.'
        ],
        correctIndex: 1,
        explanation: 'Because m₀ = 0 and v₀ = 0, at step t=1, m₁ = (1 - β₁)g₁. When β₁ = 0.9, m₁ would be only 0.10 · g₁, artificially tiny. Dividing by (1 - 0.9¹) = 0.10 un-biases the estimate back to g₁.'
      },
      {
        id: 'q2',
        question: 'What happens to standard SGD in a narrow ravine with high condition number (eigenvalues of Hessian differ by orders of magnitude)?',
        options: [
          'It converges exponentially fast.',
          'It is forced to take tiny learning rates to avoid exploding in the steep direction, resulting in agonizingly slow progress along the flat direction.',
          'It automatically computes second derivatives like Newton\'s method.',
          'It immediately finds the global optimum.'
        ],
        correctIndex: 1,
        explanation: 'In ill-conditioned ravines, the maximum stable learning rate is limited by the maximum curvature η < 2/λ_max. Because λ_max is huge, η must be tiny, so updates along the gentle direction (small λ_min) stall almost completely.'
      }
    ],
    summary: [
      'Momentum dampens oscillations in high-curvature directions while building velocity along shallow slopes.',
      'RMSprop normalizes gradient steps by the running root-mean-square of past gradients.',
      'Adam combines momentum and RMSprop with bias correction, making it the industry standard default optimizer for deep learning.'
    ]
  },
  'cnn-inference-pipeline': {
    slug: 'cnn-inference-pipeline',
    intuition: [
      'Inference in a convolutional neural network is a deterministic, purely feed-forward numerical pipeline: raw pixel matrices are progressively transformed into semantic feature maps, compressed through pooling, flattened into high-level concept vectors, and projected into a categorical probability distribution.',
      'Unlike training mode—which computes loss, creates backward computational graphs, and updates parameters via gradient descent—inference mode freezes all weights and biases. Dropout layers are disabled, and Batch Normalization uses fixed running population statistics.',
      'Feature extraction begins when multi-channel filter banks slide across the input image. Each kernel acts as an analytical pattern detector: when the input patch aligns with the filter template (such as an edge, corner, or curve), the Frobenius inner product yields a large positive activation.',
      'Element-wise ReLU non-linearities zero out negative pre-activations, preserving sparse, highly selective representations of visual features while eliminating non-responsive areas.',
      'Spatial pooling downsamples feature map dimensions by selecting the most dominant activation in each local neighborhood. This provides local translation invariance: an edge or loop detected in the top-left will still be registered even if the object shifts slightly.',
      'Finally, flattening unrolls the multi-channel 3D volume into a 1D feature vector, allowing dense fully-connected layers to compute class logits z = W · f + b, which Softmax normalizes into interpretable probabilities that sum to 100%.'
    ],
    mathFormulas: [
      {
        name: 'Multi-Channel Convolution (3D Kernel Inner Product)',
        latex: 'Y_k(r, c) = \\sum_{ch=1}^{C_{in}} \\sum_{i=0}^{K-1} \\sum_{j=0}^{K-1} X_{ch}(r+i, c+j) \\cdot W_{k, ch}(i, j) + b_k',
        explanation: 'Each output channel k slides a 3D kernel of depth C_in across spatial positions (r, c), aggregating local dot products with bias b_k.'
      },
      {
        name: 'Element-Wise Non-Linear Rectification',
        latex: 'A_k(r, c) = \\max(0, Y_k(r, c))',
        explanation: 'Suppresses negative values to zero, enforcing sparsity and ensuring that absent features do not contribute negative signals to downstream layers.'
      },
      {
        name: 'Spatial Max Pooling Downsampling',
        latex: 'P_k(pr, pc) = \\max_{i, j \\in \\{0, 1\\}} A_k(2pr + i, 2pc + j)',
        explanation: 'A 2×2 window with stride 2 extracts the maximum activation in each quad, halving spatial dimensions from H×W to (H/2)×(W/2).'
      },
      {
        name: 'Tensor Vectorization (Flattening)',
        latex: '\\mathbf{f} = \\text{vec}(\\mathbf{P}) \\in \\mathbb{R}^{C_{out} \\cdot H_{pool} \\cdot W_{pool}}',
        explanation: 'Reshapes the 3D tensor volume of pooled activations into a 1D column vector without modifying any underlying numerical values.'
      },
      {
        name: 'Softmax Categorical Normalization',
        latex: 'P(y = c \\mid \\mathbf{x}) = \\frac{e^{z_c}}{\\sum_{k=1}^{K} e^{z_k}}, \\quad \\text{where } \\mathbf{z} = \\mathbf{W}_{fc} \\mathbf{f} + \\mathbf{b}_{fc}',
        explanation: 'Converts unconstrained real-valued dense logits z into a valid probability distribution where each probability is in (0, 1) and their sum equals 1.'
      }
    ],
    workedExample: {
      scenario: 'Tracing the complete inference lifecycle of an 8×8 digit image through 3 filters (3×3), ReLU, 2×2 Max Pooling, Flattening (27 features), Dense projection, and Softmax to 4 classes (0, 1, 4, 7).',
      steps: [
        { label: 'Step 1: Input Tensor Ingestion', math: '\\mathbf{X} \\in \\mathbb{R}^{1 \\times 8 \\times 8} \\implies 64 \\text{ grayscale pixels}', note: 'Pixel brightness values scaled between 0.0 (background) and 1.0 (ink).' },
        { label: 'Step 2: 3D Convolution Feature Extraction', math: '\\mathbf{Y} = \\text{Conv2D}(\\mathbf{X}, \\mathbf{W}_{conv}) \\in \\mathbb{R}^{3 \\times 6 \\times 6}', note: '3 filters (Vertical edge, Horizontal bar, Enclosed loop) produce 3 spatial maps of size (8 - 3 + 1) = 6×6.' },
        { label: 'Step 3: ReLU Rectification', math: '\\mathbf{A} = \\max(0, \\mathbf{Y}) \\in \\mathbb{R}^{3 \\times 6 \\times 6}', note: 'Negative pre-activations are zeroed out; positive edge matches pass uninhibited.' },
        { label: 'Step 4: Max Pooling Downsampling', math: '\\mathbf{P} = \\text{MaxPool}_{2\\times2}(\\mathbf{A}) \\in \\mathbb{R}^{3 \\times 3 \\times 3}', note: 'Reduces each 6×6 map to 3×3 by taking local quad maxima (total 27 activations).' },
        { label: 'Step 5: Vector Flattening', math: '\\mathbf{f} = \\text{vec}(\\mathbf{P}) \\in \\mathbb{R}^{27}', note: 'Unrolls 3D feature volume into a 1D column vector suitable for matrix multiplication.' },
        { label: 'Step 6: Dense Layer Logits', math: '\\mathbf{z} = \\mathbf{W}_{fc} \\mathbf{f} + \\mathbf{b}_{fc} \\in \\mathbb{R}^{4}', note: 'Evaluates linear compatibility scores for digits 0, 1, 4, and 7.' },
        { label: 'Step 7: Softmax Probability Distribution', math: 'P(y=c) = \\frac{e^{z_c}}{\\sum_{k} e^{z_k}} \\implies [0.964, 0.012, 0.015, 0.009]', note: 'Exponentiation and normalization yield final classification confidence (e.g. 96.4% Digit 0).' }
      ],
      result: 'The network deterministically classifies the digit as "0" with 96.4% confidence in a single forward pass.',
      params: {
        inputSize: '1x8x8',
        convFilters: 3,
        kernelSize: '3x3',
        poolSize: '2x2',
        denseClasses: 4
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'What is the key difference between CNN inference mode and CNN training mode?',
        options: [
          'Inference uses smaller convolutional kernels than training.',
          'Inference only performs the forward pass with frozen weights; no loss gradient computation or backpropagation graph is stored, and dropout is disabled.',
          'Inference requires calculating second-order Hessian matrices.',
          'Inference reverses the order of layers, computing Softmax first.'
        ],
        correctIndex: 1,
        explanation: 'During inference, the model weights are static and evaluation is purely feed-forward. Because no parameter updates occur, gradient histories are not retained, reducing memory and computation dramatically.'
      },
      {
        id: 'q2',
        question: 'In a CNN for image classification, what is the exact function of the "Flatten" layer?',
        options: [
          'To average all pixel values into a single scalar brightness.',
          'To unroll a multi-dimensional spatial tensor [Channels, Height, Width] into a 1D vector so standard fully-connected matrix multiplication W · x + b can be performed.',
          'To remove all zero activations created by ReLU.',
          'To normalize the gradient magnitudes during backpropagation.'
        ],
        correctIndex: 1,
        explanation: 'Dense (fully-connected) layers expect a 1D vector of features. The Flatten layer reshapes the 3D volume (e.g. 3 × 3 × 3 = 27) into a 1D column vector without changing any numerical values.'
      },
      {
        id: 'q3',
        question: 'If a convolutional layer has 16 filters of size 5×5 operating on an RGB image (3 channels), how many learnable weight parameters (excluding biases) are in this layer?',
        options: [
          '400 weights (16 × 5 × 5)',
          '1,200 weights (16 filters × 5 × 5 × 3 channels)',
          '75 weights (5 × 5 × 3)',
          '16 weights'
        ],
        correctIndex: 1,
        explanation: 'Each filter must span the entire depth of the input volume (3 channels for RGB). Thus, one filter has 5 × 5 × 3 = 75 weights. With 16 parallel filters, the layer contains 16 × 75 = 1,200 weights.'
      }
    ],
    summary: [
      'CNN inference processes images through sequential stages: Conv2D → ReLU → Pooling → Flatten → Dense → Softmax.',
      'Convolutional filters extract spatial visual motifs with translational equivariance.',
      'Pooling achieves local translation invariance and reduces spatial dimensions.',
      'Flattening transitions spatial tensor representations into vector space for categorical classification.',
      'Inference is purely feed-forward with frozen weights and no computational graph overhead.'
    ]
  }
};

