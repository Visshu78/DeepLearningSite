export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SceneMappingRow {
  scenePart: string;
  modelPart: string;
  symbol: string;
  role: string;
}

export interface DetailedLessonContent {
  slug: string;
  scene: {
    title: string;
    narrative: string;
  };
  mapping: SceneMappingRow[];
  playWithItPrompt: string;
  analogyBreaks: string;
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
  cheatSheet?: {
    title: string;
    rules: string[];
    pitfalls: string[];
    codeSnippet: string;
  };
}

export const LESSON_DETAILS: Record<string, DetailedLessonContent> = {
  // =========================================================================
  // LESSON 2.1: THE ARTIFICIAL NEURON
  // =========================================================================
  'what-is-an-artificial-neuron': {
    slug: 'what-is-an-artificial-neuron',
    scene: {
      title: 'Convincing Your Hostel Friend for a Late-Night Chai Run',
      narrative:
        'It is 11:30 PM during end-sem prep and you ask your roommate Rohan to walk to the tapri outside the hostel gate for masala chai. Before saying yes, Rohan mentally weighs two facts: how good the weather is outside (x₁) and how far the tapri is (x₂). Because Rohan loves cool breezes, weather gets a positive importance weight (w₁ = +0.80). Because he hates walking when tired, distance gets a negative weight (w₂ = -1.20). Add his baseline mood tonight (bias b = +0.20), and if the total convincing score (z) crosses zero, his enthusiasm (a) fires!'
    },
    mapping: [
      {
        scenePart: 'Weather pleasantness & tapri distance',
        modelPart: 'Input features',
        symbol: 'x₁, x₂',
        role: 'Raw numbers describing the current situation'
      },
      {
        scenePart: 'How much Rohan cares about each factor',
        modelPart: 'Synaptic weights',
        symbol: 'w₁, w₂',
        role: 'Dials that amplify (+ excitatory) or oppose (- inhibitory) each input'
      },
      {
        scenePart: 'Rohan\'s default mood before you even speak',
        modelPart: 'Bias offset',
        symbol: 'b',
        role: 'Baseline predisposition that shifts the decision threshold'
      },
      {
        scenePart: 'Net convincing score in Rohan\'s head',
        modelPart: 'Pre-activation sum',
        symbol: 'z = w·x + b',
        role: 'Weighted sum of all pros, cons, and baseline mood'
      },
      {
        scenePart: 'Final decision / enthusiasm to step out',
        modelPart: 'Post-activation output',
        symbol: 'a = φ(z)',
        role: 'Non-linear gate that turns the raw score into an outgoing signal'
      }
    ],
    playWithItPrompt:
      'Drag the Weather / Feature 1 slider (x₁) and Distance / Feature 2 slider (x₂), tweak how much your friend cares via Weights (w₁, w₂) and Default Mood / Bias (b), and watch the pre-activation score z and final enthusiasm a = φ(z) update live.',
    analogyBreaks:
      'A real friend\'s mood can flip unpredictably from a single text message or hunger pang, whereas an artificial neuron is strictly linear inside z = w·x + b before its fixed activation curve φ(z) and has no memory of yesterday\'s chai trip unless its weights are updated.',
    intuition: [
      'An artificial neuron (or perceptron) is inspired by the biological nerve cell. Biological dendrites receive incoming signals; the soma aggregates them; and if the total signal exceeds a threshold, the axon fires an outgoing impulse.',
      'In deep learning, an artificial neuron performs two fundamental operations in sequence: a linear aggregation of inputs followed by a non-linear activation.',
      'Inputs (x₁, x₂, …) represent numerical features of the data (such as weather score, trip distance, or pixel brightness).',
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
      scenario: 'Rohan evaluates two features: weather x₁ = 1.50 and distance factor x₂ = -0.80, with weights w₁ = 0.80, w₂ = -1.20, default mood bias b = 0.20, and ReLU activation (matching the workbench default).',
      steps: [
        { label: 'Step 1: Compute weighted inputs', math: 'w_1 x_1 = 0.80 \\times 1.50 = 1.20, \\quad w_2 x_2 = (-1.20) \\times (-0.80) = 0.96', note: 'Linear multiplication of each factor by its importance weight.' },
        { label: 'Step 2: Aggregate the sum', math: '\\sum (w_i x_i) = 1.20 + 0.96 = 2.16', note: 'Both terms contribute positively to convincing Rohan.' },
        { label: 'Step 3: Add the bias (default mood)', math: 'z = 2.16 + 0.20 = 2.36', note: 'Pre-activation convincing score before non-linear gating.' },
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
        question: 'In our hostel chai scene, suppose weather x₁ = 0 and distance x₂ = 0 (neutral conditions), but Rohan still agrees to go because his default mood b = +1.2. What is the mathematical role of the bias b in a neuron?',
        options: [
          'It normalizes the input features to zero mean and unit variance.',
          'It acts as the learning rate during backward propagation.',
          'It shifts the decision threshold independently of the input features.',
          'It forces the output of the neuron to remain between 0 and 1.'
        ],
        correctIndex: 2,
        explanation: 'Without a bias, the hyperplane formed by wᵀx = 0 is constrained to pass directly through the origin (0, 0, …). The bias shifts the activation threshold independently of x.'
      },
      {
        id: 'q2',
        question: 'Rohan gives exam stress a weight of w₁ = -2.0 and free samosas a weight of w₂ = +1.5. Today stress is x₁ = 1.0, samosas is x₂ = 2.0, and his baseline mood is b = -0.5. Using ReLU, what is his output a?',
        options: [
          'a = 0.0',
          'a = 0.5',
          'a = 1.0',
          'a = -0.5'
        ],
        correctIndex: 1,
        explanation: 'First compute z = (-2.0 × 1.0) + (1.5 × 2.0) + (-0.5) = -2.0 + 3.0 - 0.5 = +0.5. Applying ReLU(0.5) = max(0, 0.5) = 0.5.'
      }
    ],
    summary: [
      'The artificial neuron computes z = w · x + b and applies a non-linear activation a = φ(z).',
      'Weights control feature orientation and sensitivity; the bias controls the baseline threshold offset.',
      'Single neurons form the foundational computational atoms that compose deep neural networks.'
    ]
  },

  // =========================================================================
  // LESSON 2.2: ACTIVATION FUNCTIONS
  // =========================================================================
  'activation-functions': {
    slug: 'activation-functions',
    scene: {
      title: '"Convinced Enough to Say Yes?" — Soft Maybe vs Hard Threshold',
      narrative:
        'When you ask classmates to chip in for a birthday cake, different people respond differently to your persuasion score (z). One friend gives a smooth probability between 0% and 100% ("I am 73% in" — Sigmoid). Another swings from -100% ("dead against it") to +100% ("fully in" — Tanh). A third friend says flat ₹0 if unconvinced (z ≤ 0), but once convinced (z > 0), contributes in exact proportion to how excited they are (ReLU)!'
    },
    mapping: [
      {
        scenePart: 'Persuasion score before the reply',
        modelPart: 'Pre-activation input',
        symbol: 'z',
        role: 'Horizontal axis feeding into the activation function'
      },
      {
        scenePart: 'Smooth 0% to 100% "maybe" probability',
        modelPart: 'Sigmoid activation',
        symbol: 'σ(z)',
        role: 'Squashes (-∞, ∞) into (0, 1); saturates at extremes'
      },
      {
        scenePart: 'Zero until convinced, then proportional',
        modelPart: 'ReLU activation',
        symbol: 'max(0, z)',
        role: 'Outputs 0 for z ≤ 0 and passes z linearly with slope 1 for z > 0'
      },
      {
        scenePart: 'How much a tiny extra nudge changes the reply',
        modelPart: 'Local derivative / slope',
        symbol: 'φ\'(z)',
        role: 'Governs whether backward learning signals pass through or vanish'
      }
    ],
    playWithItPrompt:
      'Switch between Sigmoid, Tanh, ReLU, and Leaky ReLU tabs, then drag the Persuasion Score / Pre-Activation Probe slider (z) from -5 to +5. Watch how the dashed gold slope φ\'(z) collapses near the flat tails of Sigmoid/Tanh ("stubborn saturation") or hits zero for negative ReLU ("silent treatment").',
    analogyBreaks:
      'People change their response style depending on who is asking, whereas every neuron in a standard layer applies the exact same deterministic activation curve φ(z) to every scalar input.',
    intuition: [
      'Why do neural networks need activation functions at all? If every layer only calculated linear combinations (W · x + b), composing multiple layers would simply collapse into a single linear transformation: W₂ · (W₁ · x + b₁) + b₂ = W_new · x + b_new.',
      'Activation functions introduce non-linearity. This enables networks to approximate arbitrary continuous functions and fold high-dimensional decision boundaries.',
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
      scenario: 'Examine a strong persuasion score of z = 3.0 passing through Sigmoid vs. ReLU and compare their backward gradients.',
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
        question: 'Suppose a student builds a deep network with Sigmoid hidden units, and one neuron receives a very strong pre-activation z = 8.0 ("already 99.97% convinced"). What happens to its gradient during backpropagation?',
        options: [
          'The local derivative explodes rapidly toward positive infinity.',
          'The local derivative oscillates between positive and negative.',
          'The local derivative remains constant at 1.0 across all inputs.',
          'The local derivative shrinks to nearly zero (vanishing gradient).'
        ],
        correctIndex: 3,
        explanation: 'At z = 8.0, σ(8) ≈ 0.9997, and σ\'(8) ≈ 0.0003. When backpropagating, multiplying upstream gradients by 0.0003 practically annihilates the learning signal.'
      },
      {
        id: 'q2',
        question: 'If a large negative bias update pushes a standard ReLU neuron so that z < 0 for every training example in the dataset, what happens to that neuron and how does Leaky ReLU fix it?',
        options: [
          'It becomes a dead ReLU with zero gradient for negative inputs.',
          'It restricts all neuron activations to the interval [-1, +1].',
          'It doubles the matrix multiplication speed on the forward pass.',
          'It removes the need for learnable bias parameters in the layer.'
        ],
        correctIndex: 0,
        explanation: 'When a standard ReLU neuron gets stuck in the negative region, its derivative is 0, so no gradient ever updates its weights again ("dying ReLU"). Leaky ReLU keeps a small slope α > 0 when z < 0 to keep the neuron trainable.'
      }
    ],
    summary: [
      'Non-linear activation functions prevent multi-layer networks from collapsing into a single linear equation.',
      'Sigmoid and Tanh suffer from gradient vanishing due to asymptotic saturation at both tails.',
      'ReLU provides clean gradient propagation for positive values, and Leaky ReLU prevents inactive dead neurons.'
    ]
  },

  // =========================================================================
  // LESSON 2.3: FORWARD PROPAGATION
  // =========================================================================
  'forward-propagation': {
    slug: 'forward-propagation',
    scene: {
      title: 'Getting College Fest Budget Approval Through a Hierarchy',
      narrative:
        'Your cultural fest team submits two raw numbers—expected footfall (x₁) and sponsorship raised (x₂)—to the Faculty Coordinators (Hidden Layer, l = 1). Coordinator 1 focuses on crowd logistics and writes a summary score (a₁^[1]); Coordinator 2 focuses on finance and writes a second summary score (a₂^[1]). Crucially, the Dean (Output Layer, l = 2) never reads your raw spreadsheets—the Dean only reads the two Coordinators\' summary notes, weighs them, and signs the final approval probability (ŷ)!'
    },
    mapping: [
      {
        scenePart: 'Raw proposal numbers (footfall, sponsorship)',
        modelPart: 'Input feature vector',
        symbol: 'x = [x₁, x₂]ᵀ',
        role: 'Raw observations fed into Layer 0'
      },
      {
        scenePart: 'Faculty Coordinators\' evaluation rules',
        modelPart: 'Hidden layer weight matrix & bias',
        symbol: 'W^[1], b^[1]',
        role: 'Transforms raw inputs into intermediate hidden scores z^[1]'
      },
      {
        scenePart: 'Coordinators\' signed summary notes',
        modelPart: 'Hidden layer post-activations',
        symbol: 'a^[1] = φ(z^[1])',
        role: 'Learned intermediate features passed to the next layer (and saved for backprop)'
      },
      {
        scenePart: 'Dean\'s final approval score',
        modelPart: 'Output prediction',
        symbol: 'ŷ = a^[2]',
        role: 'Final network prediction synthesized from hidden representations'
      }
    ],
    playWithItPrompt:
      'Step through the 4 stages of the proposal (Step 0: Raw Inputs x → Step 1: Coordinator Scores z^[1] → Step 2: Coordinator Notes a^[1] → Step 3: Dean\'s Score z^[2] → Step 4: Final Approval ŷ), or switch between the 3D Wafer Stack and 2D Flat views while tweaking the weights.',
    analogyBreaks:
      'In a real college office, the Dean can call you directly to ask about a raw spreadsheet line or send the file back for clarification mid-review; in a standard feedforward MLP, Layer l only sees the activation vector a^[l-1] from the immediately preceding layer, with zero backward feedback during inference.',
    intuition: [
      'Forward propagation is the deterministic cascade of computations that transforms input data into an inference or prediction.',
      'In a multi-layer perceptron (MLP), neurons are organized into layers: an input layer, one or more hidden layers, and an output layer.',
      'Signals travel strictly left-to-right (feedforward). Each hidden neuron computes an intermediate feature by combining all activations from the preceding layer.',
      'The intermediate values—pre-activations z^[l] and post-activations a^[l]—are not just discarded after inference; they are cached in memory during training to be used immediately in the backward pass.'
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
      scenario: 'A 2-input network has proposal inputs x = [0.50, -0.40]. Coordinator 1 (hidden neuron 0) has weights [0.70, -0.50] and bias 0.10 with Sigmoid activation (matching workbench default).',
      steps: [
        { label: 'Step 1: Compute linear sum for hidden neuron 0', math: 'z_{h1} = (0.50 \\times 0.70) + (-0.40 \\times -0.50) + 0.10 = 0.35 + 0.20 + 0.10 = 0.65', note: 'Dot product of incoming weights and inputs + bias.' },
        { label: 'Step 2: Apply activation to hidden neuron 0', math: 'a_{h1} = \\sigma(0.65) = \\frac{1}{1 + e^{-0.65}} \\approx 0.6570', note: 'Post-activation summary note ready to feed into the Dean\'s layer.' },
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
        question: 'Your fest approval network takes 3 input metrics, passes them to 4 Faculty Coordinators (hidden layer), who report to 1 Dean (output neuron). How many total trainable parameters (weights + biases) exist in this network?',
        options: [
          '12 parameters',
          '21 parameters',
          '16 parameters',
          '8 parameters'
        ],
        correctIndex: 1,
        explanation: 'Hidden layer: 3 × 4 weights + 4 biases = 16 parameters. Output layer: 4 × 1 weights + 1 bias = 5 parameters. Total = 16 + 5 = 21 parameters.'
      },
      {
        id: 'q2',
        question: 'Why must a deep learning framework keep the intermediate values z^[1] and a^[1] in GPU memory during a training forward pass instead of throwing them away once ŷ is computed?',
        options: [
          'Because the loss function requires adding all hidden activations together.',
          'They are only kept during test-time inference, not during training.',
          'Because the optimizer requires sorting all hidden layer activations by magnitude.',
          'Because backpropagation needs cached a^[l-1] and z^[l] values to compute gradients.'
        ],
        correctIndex: 3,
        explanation: 'By the chain rule, ∂L/∂W^[l] = δ^[l] · (a^[l-1])ᵀ where δ^[l] depends on φ\'(z^[l]). Caching z^[l] and a^[l] during the forward pass is what makes reverse-mode autodiff fast.'
      }
    ],
    summary: [
      'Forward propagation flows layer-by-layer: Input → Hidden Linear Sum → Hidden Activation → Output Linear Sum → Prediction.',
      'Caching intermediate pre-activations z and activations a is required for computing analytical gradients during backpropagation.'
    ]
  },

  // =========================================================================
  // LESSON 2.4: LOSS FUNCTIONS AND ERROR LANDSCAPES
  // =========================================================================
  'loss-functions': {
    slug: 'loss-functions',
    scene: {
      title: 'Predicting Your Mid-Sem Marks and Feeling the Penalty',
      narrative:
        'Before the mid-sem results are posted, you predict your score (ŷ) out of a target benchmark (y). If you miss by just 0.1, you barely shrug. But if you miss by 2.0, the embarrassment feels four times worse than missing by 1.0! Squaring the residual gap (ŷ - y)² guarantees that under-predicting and over-predicting both hurt positively, and big blunders get punished disproportionately hard. Averaging that penalty across all subjects gives your semester-wide Cost J.'
    },
    mapping: [
      {
        scenePart: 'Actual marks scored on the paper',
        modelPart: 'Ground-truth target',
        symbol: 'y',
        role: 'The true label the model is trying to match'
      },
      {
        scenePart: 'Your predicted marks before seeing the sheet',
        modelPart: 'Model prediction',
        symbol: 'ŷ',
        role: 'Forward-pass output produced by the network'
      },
      {
        scenePart: 'Signed gap between prediction and reality',
        modelPart: 'Residual error',
        symbol: 'e = ŷ - y',
        role: 'Also equals the initial gradient ∂L/∂ŷ for scaled MSE'
      },
      {
        scenePart: 'Pain score for a single exam paper',
        modelPart: 'Single-sample loss',
        symbol: 'L(y, ŷ) = ½(ŷ - y)²',
        role: 'Non-negative penalty bowl centered at ŷ = y'
      },
      {
        scenePart: 'Average pain across all exams in the semester',
        modelPart: 'Dataset cost function',
        symbol: 'J(W, b)',
        role: 'Mean squared error across all N training examples'
      }
    ],
    playWithItPrompt:
      'Drag the Predicted Score slider (ŷ) away from the Actual Target Score (y) and watch the red dot climb the parabolic penalty bowl L = ½(ŷ - y)² while the dashed gold tangent slope ∂L/∂ŷ = ŷ - y tilts steeper. Edit individual exam rows in the Dataset Residuals Table below to see how one outlier inflates Avg MSE.',
    analogyBreaks:
      'In a real exam, over-predicting your score hurts your ego more than being pleasantly surprised by higher marks, whereas Mean Squared Error ½(ŷ - y)² is perfectly symmetric—predicting +0.6 too high or -0.6 too low yields the exact same 0.180 loss.',
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
      scenario: 'Your actual normalized exam target is y = 1.00, and your model predicts ŷ = 0.40 (matching workbench default). Let us compute the scaled single-sample loss and initial gradient signal.',
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
        question: 'Suppose the actual target score is y = 1.0, and your model over-predicts ŷ = 2.5. Under L = ½(ŷ - y)², what is the initial gradient ∂L/∂ŷ and which direction should ŷ move to reduce the loss?',
        options: [
          '∂L/∂ŷ = +2.25; ŷ must stay fixed.',
          '∂L/∂ŷ = -1.5; ŷ must increase.',
          '∂L/∂ŷ = +1.5; ŷ must decrease.',
          '∂L/∂ŷ = 0.75; ŷ must double.'
        ],
        correctIndex: 2,
        explanation: '∂L/∂ŷ = ŷ - y = 2.5 - 1.0 = +1.5. A positive gradient indicates that increasing ŷ increases the loss, so gradient descent steps in the negative direction (-1.5) to push ŷ down toward 1.0.'
      },
      {
        id: 'q2',
        question: 'Why does Mean Squared Error react much more strongly to a single corrupt outlier in a dataset than Mean Absolute Error |ŷ - y|?',
        options: [
          'Because squaring the residual amplifies large errors quadratically.',
          'Because Mean Squared Error ignores any residual smaller than 1.0.',
          'Because Mean Absolute Error has an undefined derivative everywhere.',
          'Because Mean Squared Error divides the total penalty by N squared.'
        ],
        correctIndex: 0,
        explanation: 'The derivative of ½(ŷ - y)² is proportional to the residual (ŷ - y), so a 10× larger outlier pulls the model parameters with 10× more gradient force.'
      }
    ],
    summary: [
      'The loss function maps prediction error into a single scalar penalty surface.',
      'The derivative of the loss function provides the anchor gradient signal for backpropagation.'
    ]
  },

  // =========================================================================
  // LESSON 2.5: GRADIENT DESCENT
  // =========================================================================
  'gradient-descent': {
    slug: 'gradient-descent',
    scene: {
      title: 'Walking Downhill to the Hostel Mess in Thick Winter Fog',
      narrative:
        'Imagine trekking back to your hill-station campus in thick December fog. You cannot see the warm hostel mess at the bottom of the valley (θ* = 2.0), but you can feel the tilt of the hillside under your shoes (the gradient dL/dθ). Since the slope points uphill, you step in the opposite direction (-dL/dθ). Your stride length is the learning rate (η): take baby steps (η = 0.02) and you freeze before dinner; leap too far (η = 2.20) and you jump clean across the valley onto the opposite cliff, higher than where you started!'
    },
    mapping: [
      {
        scenePart: 'Your current spot on the foggy hillside',
        modelPart: 'Current parameter value',
        symbol: 'θ_t',
        role: 'Weight or bias coordinate at iteration t'
      },
      {
        scenePart: 'Elevation above the valley floor',
        modelPart: 'Loss value',
        symbol: 'L(θ_t)',
        role: 'Error height we want to minimize'
      },
      {
        scenePart: 'Steepness of the ground under your shoes',
        modelPart: 'Gradient / derivative',
        symbol: '∇L(θ_t)',
        role: 'Points uphill; its negative (-∇L) points steepest downhill'
      },
      {
        scenePart: 'How bold your stride length is',
        modelPart: 'Learning rate',
        symbol: 'η',
        role: 'Hyperparameter scaling the step size Δθ = -η · ∇L'
      }
    ],
    playWithItPrompt:
      'Adjust your Stride Length / Learning Rate (η) and Starting Hillside Position (θ), then click "Take 1 Step" or "Auto Run". Try setting η = 0.20 for smooth descent, then crank η above 2.05 to watch the hiker overshoot the valley walls and diverge!',
    analogyBreaks:
      'A human hiker on a foggy hill only chooses left-or-right and forward-or-back (2 dimensions) and can peek a few meters ahead, whereas neural network gradient descent steps blindly across millions of weight dimensions simultaneously using only the strictly local first derivative at a single point.',
    intuition: [
      'Imagine standing on a hilly landscape in thick fog. You cannot see the lowest valley, but you can feel the slope of the ground beneath your boots.',
      'To reach the bottom, you take a step in the direction of the steepest downward slope. This is the core intuition of Gradient Descent.',
      'The gradient vector ∇L points in the direction of steepest ascent (where loss increases fastest). Therefore, stepping in the negative gradient direction (-∇L) guarantees moving toward lower loss for a sufficiently small step.',
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
      scenario: 'Optimize the valley L(θ) = 0.5(θ - 2)², starting at hillside position θ₀ = 5.0 with stride length / learning rate η = 0.20 (matching workbench default). The derivative is L\'(θ) = θ - 2.',
      steps: [
        { label: 'Step 1: Evaluate loss & gradient at θ₀ = 5.0', math: 'L(5.0) = 0.5(3.0)^2 = 4.50, \\quad L\'(5.0) = 5.0 - 2.0 = 3.00', note: 'Positive slope: moving right goes further uphill.' },
        { label: 'Step 2: Compute update Δθ', math: '\\Delta\\theta = -\\eta \\cdot L\'(5.0) = -0.20 \\times 3.00 = -0.60', note: 'Step moves left toward the valley minimum.' },
        { label: 'Step 3: Update parameter θ₁', math: '\\theta_1 = 5.0 - 0.60 = 4.40', note: 'Loss drops from 4.50 to 0.5(2.40)² = 2.88.' },
        { label: 'Step 4: Next step at θ₁ = 4.40', math: 'L\'(4.40) = 2.40, \\quad \\theta_2 = 4.40 - (0.20 \\times 2.40) = 3.92', note: 'Rapid geometric convergence toward true minimum at θ = 2.0.' }
      ],
      result: 'In just 2 steps, θ moved from 5.0 → 4.40 → 3.92, cutting loss from 4.50 down to 1.84.',
      params: { theta: 5.0, lr: 0.2, preset: 'convex_quadratic' }
    },
    quiz: [
      {
        id: 'q1',
        question: 'On the parabolic valley L(θ) = 0.5(θ - 2)² where curvature (second derivative) is 1.0, what happens if you set your stride length / learning rate to η = 2.30?',
        options: [
          'The hiker stops immediately because the gradient becomes 0.',
          'The weights freeze in place and stop updating after the first iteration.',
          'The parameter reaches the exact minimum θ = 2 in a single update step.',
          'Each step overshoots the valley minimum and diverges with growing oscillations.'
        ],
        correctIndex: 3,
        explanation: 'Because η = 2.30 exceeds the stability threshold 2 / curvature = 2.0, the distance to the minimum multiplies by |1 - 2.30| = 1.30 on every step, exploding to infinity.'
      },
      {
        id: 'q2',
        question: 'When switching the landscape to "Double-Well" (non-convex), why can two hikers with the exact same learning rate η end up at different final loss values?',
        options: [
          'Because first-order derivatives do not exist on non-convex loss surfaces.',
          'Because gradient descent follows local slopes and settles into nearby basins.',
          'Because the learning rate hyperparameter changes randomly at every epoch.',
          'Because non-convex functions never possess any stationary points or minima.'
        ],
        correctIndex: 1,
        explanation: 'At any local minimum, the first derivative dL/dθ = 0, so standard gradient descent stops even if a deeper global valley exists across a ridge.'
      }
    ],
    summary: [
      'Gradient descent updates parameters iteratively: θ ← θ - η · (dL/dθ).',
      'The learning rate is a critical hyperparameter that balances convergence speed against numerical stability.',
      'Watching the loss trajectory over time diagnoses whether the learning rate is optimal, sluggish, or divergent.'
    ]
  },

  // =========================================================================
  // LESSON 2.6: BACKPROPAGATION AND THE CHAIN RULE
  // =========================================================================
  'backpropagation-fundamentals': {
    slug: 'backpropagation-fundamentals',
    scene: {
      title: 'Tracing Credit and Blame After a Failed Group Project Demo',
      narrative:
        'Your 3-tier hackathon project loses marks during the final demo (Loss L). How do you figure out how much each teammate needs to adjust their work? First, the judge tells the Presenter (Output Layer) how far off the final pitch was (δ_out). The Presenter then passes blame backward to the two Backend coders (Hidden Layer) in exact proportion to how much the Presenter relied on each coder\'s module (w_out1, w_out2) AND how responsive that coder was (φ\'(z_h)). Finally, each connection updates its weight proportional to (blame received δ) × (input effort sent a)!'
    },
    mapping: [
      {
        scenePart: 'Judge\'s penalty on the final demo',
        modelPart: 'Initial loss gradient',
        symbol: '∂L/∂ŷ = ŷ - y',
        role: 'Anchor error signal at the output node'
      },
      {
        scenePart: 'Blame assigned to the Presenter',
        modelPart: 'Output error delta',
        symbol: 'δ_out = (∂L/∂ŷ) · φ\'(z_out)',
        role: 'Output error scaled by output activation slope'
      },
      {
        scenePart: 'Blame routed back to Hidden Coder j',
        modelPart: 'Hidden layer error delta',
        symbol: 'δ_h = (w_out · δ_out) · φ\'(z_h)',
        role: 'Upstream blame weighted by connection strength and local slope'
      },
      {
        scenePart: 'Adjustment to a specific handoff link',
        modelPart: 'Weight gradient',
        symbol: '∂L/∂w_ij = δ_j · a_i',
        role: 'Blame at receiving person j times signal sent by person i'
      }
    ],
    playWithItPrompt:
      'Click "Run Full Cycle" or step through Steps 0–6 to watch forward signals flow left-to-right and golden blame waves (δ) flow right-to-left. Check the "Finite-Difference Gradient Verification" box at the bottom-left to see the analytical chain-rule derivative match the numerical nudge test to 5 decimal places!',
    analogyBreaks:
      'In a real college group project, teammates argue, deflect blame, or rewrite their part from scratch; in backpropagation, blame (δ) is routed by exact, deterministic calculus derivatives through the transpose of the forward weights.',
    intuition: [
      'Backpropagation is the mathematical engine of deep learning. It answers one vital question: for every single weight and bias in the network, how much did that parameter contribute to the final loss?',
      'Because deep networks are compositions of functions (layer 2 depends on layer 1, which depends on layer 0), we compute partial derivatives using the multivariate Calculus Chain Rule.',
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
        question: 'In our group-project chain rule analogy, if Hidden Coder 1 sent an output of a₁ = 0.0 (contributed nothing during the forward pass), what is the weight gradient ∂L/∂w_out1 for the connection from Coder 1 to the Presenter?',
        options: [
          'It is strictly 0.0.',
          'It equals the learning rate η.',
          'It equals the bias b_out.',
          'It equals infinity.'
        ],
        correctIndex: 0,
        explanation: 'By the chain rule, ∂L/∂w_ij = δ_j · a_i. If the incoming activation a_i is 0, nudging weight w_ij has zero effect on z_j, so its gradient is 0.'
      },
      {
        id: 'q2',
        question: 'How do ML engineers mathematically verify that their analytical backpropagation code is 100% bug-free?',
        options: [
          'By running additional training epochs until validation accuracy improves.',
          'By temporarily removing all non-linear activation functions from the network.',
          'By comparing analytical gradients against centered finite-difference estimates.',
          'By setting the optimizer learning rate and weight decay parameters to zero.'
        ],
        correctIndex: 2,
        explanation: 'Central finite difference approximation [L(θ + ε) - L(θ - ε)] / (2ε) calculates numerical derivatives directly from forward loss evaluations. Matching within ~1e-5 verifies the backward code.'
      }
    ],
    summary: [
      'Backpropagation applies the calculus chain rule recursively from the loss layer backward to the input layer.',
      'Every weight gradient equals the product of the receiving neuron\'s error delta δ and the sending neuron\'s activation a.',
      'Numerical gradient checking provides mathematical assurance that analytical derivatives are correct.'
    ]
  },

  // =========================================================================
  // LESSON 3.3: OVERFITTING, L2 WEIGHT DECAY & DROPOUT
  // =========================================================================
  'regularization-dropout': {
    slug: 'regularization-dropout',
    scene: {
      title: 'Random Classmates Absent Each Day So Nobody Relies on One Topper',
      narrative:
        'Imagine a study group where one topper memorizes word-for-word answers to last year\'s leaked paper, including printing typos. On that exact old paper (Training Set), the group scores 100%, but on a fresh exam (Test Set) they crash! Two rules fix this: L2 Weight Decay fines anyone who makes an extreme, wild claim (λ·w²), forcing smoother reasoning; and Dropout randomly makes 30% of the study group absent each day (p = 0.30) while scaling up the remaining members\' voice by 1/(1-p), so every student has to learn the core concepts independently!'
    },
    mapping: [
      {
        scenePart: 'Memorizing past-paper typos vs core concepts',
        modelPart: 'Model capacity / polynomial degree',
        symbol: 'd',
        role: 'Too low = underfitting; too high without penalty = overfitting'
      },
      {
        scenePart: 'Fine on extreme, overly confident claims',
        modelPart: 'L2 weight decay strength',
        symbol: 'λ',
        role: 'Adds (λ/2)Σw² to loss, shrinking weights by (1 - ηλ) each step'
      },
      {
        scenePart: 'Chance a group member is absent today',
        modelPart: 'Dropout probability',
        symbol: 'p',
        role: 'Zeros each activation with probability p during training only'
      },
      {
        scenePart: 'Present members speaking louder to compensate',
        modelPart: 'Inverted dropout scaling',
        symbol: '1 / (1 - p)',
        role: 'Keeps expected activation sum constant between training and test time'
      }
    ],
    playWithItPrompt:
      'Set Model Capacity (Degree d = 9) with L2 Penalty λ = 0 to see wild polynomial overfitting, then slide L2 Penalty (λ) up to 0.015 to watch the curve smooth out and Test MSE drop. In the Inverted Dropout Simulator on the right, adjust Absentee Rate / Dropout (p) and click "Resample Mask".',
    analogyBreaks:
      'In a real classroom, absent students miss lessons and fall behind, whereas in Dropout all weights remain stored in the network and every surviving subset shares parameters across thousands of mini-batches.',
    intuition: [
      'A neural network with millions of parameters has sufficient expressive power to memorize individual training samples, including idiosyncratic noise.',
      'When a model fits training noise, its training loss reaches near-zero while test loss explodes—a state termed Overfitting or High Variance.',
      'L2 Regularization (Weight Decay) discourages large weights by penalizing their squared magnitudes, ensuring individual neurons cannot develop overly brittle sensitivities. Note that while L2 regularization and weight decay are identical under vanilla SGD, they differ under adaptive optimizers like Adam because L2 gradients get rescaled by the second-moment estimate—which is why AdamW (Loshchilov & Hutter, 2019) decouples weight decay from the gradient step.',
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
        question: 'In our study-group Dropout scene, if 50% of neurons are randomly absent during training (p = 0.5), why does Inverted Dropout multiply the surviving neurons\' outputs by 1 / (1 - 0.5) = 2.0 during training?',
        options: [
          'To ensure the gradients do not vanish at the output layer.',
          'To turn all negative activations into positive activations.',
          'So the expected total signal stays constant.',
          'To force half the weights to strictly equal zero.'
        ],
        correctIndex: 2,
        explanation: 'If 50% of neurons are zeroed (p=0.5), the total forward signal would drop by half. Scaling surviving nodes by 1/(1-0.5) = 2x preserves the expected sum E[ã] = a during training, so at test time dropout is simply turned off.'
      },
      {
        id: 'q2',
        question: 'In terms of model parameter distributions, what is the primary difference between L1 (Lasso) and L2 (Ridge) weight penalties?',
        options: [
          'L2 regularization forces all network weights to grow exponentially large.',
          'L1 regularization drives unimportant weights to exact zero for sparsity.',
          'L1 regularization can only be applied to 2D spatial convolutional layers.',
          'L2 regularization is mathematically incompatible with backpropagation.'
        ],
        correctIndex: 1,
        explanation: 'L1 penalty |w| has a constant gradient ±λ everywhere except zero, driving uninformative weights strictly to 0. L2 penalty (λ/2)w² has gradient λw, which shrinks large weights aggressively and small weights gently.'
      }
    ],
    summary: [
      'Overfitting is diagnosed when training loss continues decreasing while out-of-sample test error increases.',
      'L2 weight decay penalizes large weights, suppressing high-frequency function oscillations.',
      'Inverted dropout prevents co-adaptation by randomly masking activations and scaling survivors by 1/(1-p).'
    ]
  },

  // =========================================================================
  // LESSON 3.4: MOMENTUM, RMSPROP & ADAM
  // =========================================================================
  'adaptive-optimizers': {
    slug: 'adaptive-optimizers',
    scene: {
      title: 'A Rolling Cricket Ball vs Smart Trekking Shoes in a Narrow Gully',
      narrative:
        'Picture a long, narrow drainage gully on campus: the side walls are super steep (y-axis curvature = 16), while the floor slopes gently toward the drain (x-axis curvature = 1). Standard SGD is a memoryless walker who keeps ricocheting from wall to wall across the gully while barely inching forward. Momentum is a heavy leather cricket ball: its side-to-side bounces cancel out while its forward roll builds speed (v_t). RMSprop puts on smart shock-absorbing shoes that divide each coordinate\'s step by its recent bumpiness √(s_t). Adam combines the heavy ball\'s momentum AND the smart shoes!'
    },
    mapping: [
      {
        scenePart: 'Memoryless walker bouncing off steep gully walls',
        modelPart: 'Standard SGD',
        symbol: 'θ_{t+1} = θ_t - η g_t',
        role: 'Uses the same step multiplier η on both steep and flat axes'
      },
      {
        scenePart: 'Heavy ball building speed along the gully floor',
        modelPart: 'First moment (Momentum)',
        symbol: 'm_t = β₁ m_{t-1} + (1 - β₁) g_t',
        role: 'Exponentially weighted moving average of gradient directions'
      },
      {
        scenePart: 'Smart shoes measuring recent terrain bumpiness',
        modelPart: 'Second moment (RMSprop)',
        symbol: 'v_t = β₂ v_{t-1} + (1 - β₂) g_t²',
        role: 'Moving average of squared gradients per parameter'
      },
      {
        scenePart: 'Warming up from a cold start at step t = 1',
        modelPart: 'Adam bias correction',
        symbol: 'm̂_t = m_t / (1 - β₁^t)',
        role: 'Prevents early steps from being shrunk toward zero'
      }
    ],
    playWithItPrompt:
      'Click "Auto Run" or "Step +1" to race SGD (red), Momentum (gold), RMSprop (blue), and Adam (burgundy) down the narrow ravine. Tweak Stride / Learning Rate (η) and Momentum Inertia (β₁) to see how SGD zig-zags across the steep vertical walls while Adam glides straight to the minimum.',
    analogyBreaks:
      'A real physical ball rolling down a canyon has fixed mass and obeys conservation of energy, whereas Adam rescales every single coordinate\'s effective mass on every step using recent squared gradients and has no true physical inertia.',
    intuition: [
      'Standard gradient descent uses a single uniform learning rate for all parameters, which fails catastrophically when error surfaces have uneven curvature.',
      'In anisotropic ravines (valleys steep in one direction and gentle in another), SGD bounces back and forth across the steep canyon walls while making minimal progress along the valley floor.',
      'Momentum builds velocity along consistent gradient directions, averaging out orthogonal oscillations like a heavy ball rolling downhill.',
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
      scenario: 'In an anisotropic gully L(x, y) = 0.5x² + 8y² at point (-3, 1), gradient is gx = -3, gy = 16. Compare the step for SGD vs RMSprop (with running second moment sx=9, sy=256, lr=0.1).',
      steps: [
        { label: 'Step 1: Standard SGD step', math: '\\Delta x = -0.1 \\times (-3) = +0.30, \\quad \\Delta y = -0.1 \\times 16 = -1.60', note: 'SGD takes a huge leap in y (-1.6), overshooting the gully floor to y = -0.6.' },
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
        question: 'Why does Adam divide its moving averages m_t and v_t by (1 - β₁^t) and (1 - β₂^t) during the first few steps of training?',
        options: [
          'To prevent the learning rate from ever reaching zero.',
          'To replace the need for backpropagation.',
          'To ensure the gradients satisfy the Cauchy-Schwarz inequality.',
          'Because m₀ and v₀ start at 0.'
        ],
        correctIndex: 3,
        explanation: 'Because m₀ = 0 and v₀ = 0, at step t=1, m₁ = (1 - β₁)g₁. When β₁ = 0.9, m₁ is only 0.10 · g₁. Dividing by (1 - 0.9¹) = 0.10 un-biases the estimate back to g₁.'
      },
      {
        id: 'q2',
        question: 'In our narrow gully scene (steep y-walls, gentle x-floor), why is standard SGD forced to make agonizingly slow progress along the x-floor?',
        options: [
          'A single learning rate must stay tiny to avoid diverging on the steep axis.',
          'Vanilla SGD converges exponentially fast along both canyon axes at once.',
          'Vanilla SGD automatically computes the inverse Hessian matrix at each step.',
          'Vanilla SGD jumps straight to the global minimum in a single iteration.'
        ],
        correctIndex: 0,
        explanation: 'In ill-conditioned ravines, the maximum stable learning rate for SGD is dictated by the steepest direction η < 2/λ_max. That tiny η makes updates along the flat direction (small λ_min) crawl.'
      }
    ],
    summary: [
      'Momentum dampens oscillations in high-curvature directions while building velocity along shallow slopes.',
      'RMSprop normalizes gradient steps by the running root-mean-square of past gradients.',
      'Adam combines momentum and RMSprop with bias correction, making it the industry-standard default optimizer.'
    ]
  },

  // =========================================================================
  // LESSON 4.1: KERNELS, STRIDES AND FEATURE MAPS
  // =========================================================================
  'convolutional-filters': {
    slug: 'convolutional-filters',
    scene: {
      title: 'An Instagram Edge-Stencil Sliding Across a Photo',
      narrative:
        'Imagine holding a small 3×3 transparent stencil card (the Kernel K) over a grayscale photo (Input I). The left column of your stencil has -1 weights, the middle has 0s, and the right column has +1s. As you slide this exact same stencil across the photo step by step (Stride S), wherever a dark region on the left meets a bright region on the right—like the vertical pillar of your college building—the numbers multiply and add up to a huge bright spot on your output sheet (Feature Map)!'
    },
    mapping: [
      {
        scenePart: 'Original grayscale photo grid',
        modelPart: 'Input image matrix',
        symbol: 'I (H_in × W_in)',
        role: '2D grid of pixel intensities'
      },
      {
        scenePart: 'Small 3×3 transparent pattern stencil',
        modelPart: 'Convolutional kernel / filter',
        symbol: 'K (3 × 3)',
        role: 'Shared weight template that detects a specific local motif'
      },
      {
        scenePart: 'Extra blank border frame around the photo',
        modelPart: 'Zero-padding',
        symbol: 'P',
        role: 'Lets the stencil center on edge pixels and preserves output size'
      },
      {
        scenePart: 'How many pixels you hop the stencil each step',
        modelPart: 'Stride',
        symbol: 'S',
        role: 'Step size; S = 2 halves the output grid dimensions'
      },
      {
        scenePart: 'Heatmap of where the pattern lit up',
        modelPart: 'Output feature map',
        symbol: 'S(i, j)',
        role: 'Spatial map of dot-product responses across the image'
      }
    ],
    playWithItPrompt:
      'Pick a Photo Pattern and Stencil / Filter (try "Vertical Stripe" + "Sobel Vertical"), toggle Border Frame / Padding (P) and Hop Size / Stride (S), or edit the 3×3 stencil weights directly. Click "Auto Slide" or any cell on the Output Feature Map to inspect its 9 multiplications!',
    analogyBreaks:
      'A physical plastic stencil only looks at flat surface paint, whereas a deep CNN filter has depth matching all input channels (e.g. 3×3×64) and learns its own weights via backpropagation rather than being hand-carved.',
    intuition: [
      'Fully-connected networks treat every pixel independently, discarding the critical 2D spatial arrangement of visual data.',
      'A convolutional layer slides a compact matrix of learnable parameters (a kernel or filter) across an image, computing local dot-products.',
      'Weight sharing means the same filter is applied at every spatial position, providing translation equivariance: if a feature shifts in the photo, its activation in the feature map shifts identically.',
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
      scenario: 'Sliding a 3×3 Sobel Vertical Stencil [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] over a 3×3 photo patch [[10, 10, 90], [10, 10, 90], [10, 10, 90]] with zero bias.',
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
        question: 'Why does sliding a single shared 3×3 stencil across a 256×256 photo work vastly better than connecting every pixel to 100 dense neurons?',
        options: [
          'It forces every hidden neuron in the feature map to use a zero bias term.',
          'Weight sharing slashes parameter counts and detects features anywhere in space.',
          'It completely eliminates the need for non-linear activation functions like ReLU.',
          'It guarantees that the multi-layer convolutional loss surface is strictly convex.'
        ],
        correctIndex: 1,
        explanation: 'A dense layer on 256×256 with 100 units needs 6.55M weights and memorizes pixel positions. A 3×3 filter uses 10 parameters and provides translation equivariance.'
      },
      {
        id: 'q2',
        question: 'You scan a 32×32 image with a 5×5 stencil, adding a border frame of P = 2 zeros on each side and hopping by S = 1 pixel at a time. What is the output feature map size?',
        options: [
          '28 × 28',
          '30 × 30',
          '36 × 36',
          '32 × 32'
        ],
        correctIndex: 3,
        explanation: 'Using W_out = ⌊(W_in - K + 2P)/S⌋ + 1 = ⌊(32 - 5 + 4)/1⌋ + 1 = 31 + 1 = 32. Padding P = (K-1)/2 with stride S=1 preserves exact spatial dimensions ("Same" padding).'
      }
    ],
    summary: [
      'Convolutions apply local sliding filters to extract translation-equivariant visual patterns.',
      'Weight sharing enables deep networks to process high-resolution images with very few parameters.',
      'Output spatial dimensions are strictly governed by input size, kernel size, padding, and stride.'
    ]
  },

  // =========================================================================
  // LESSON 4.2: POOLING AND RECEPTIVE FIELDS
  // =========================================================================
  'pooling-and-receptive-fields': {
    slug: 'pooling-and-receptive-fields',
    scene: {
      title: 'Making a Photo Thumbnail & Looking Out a Train Window',
      narrative:
        'Imagine summarizing a 6×6 attendance grid into a 3×3 thumbnail by taking each 2×2 bench cluster and writing down only the loudest student\'s score (Max Pooling). Even if that student shifts one seat to the right inside the same 2×2 bench, the summary number stays identical! Meanwhile, think of Receptive Field like standing further back from a train window: close up (Layer 1) you only see a 3×3 patch of platform tiles, but after two thumbnail step-downs, a single cell in Layer 5 sees a 14×14 swath of the station!'
    },
    mapping: [
      {
        scenePart: '2×2 bench cluster being summarized',
        modelPart: 'Pooling window',
        symbol: 'Ω(i, j)',
        role: 'Local patch of activations reduced to a single number'
      },
      {
        scenePart: 'Recording only the loudest score in the cluster',
        modelPart: 'Max pooling',
        symbol: 'max(x_{p,q})',
        role: 'Preserves peak feature detection and gives local shift invariance'
      },
      {
        scenePart: 'How much of the raw photo one deep neuron sees',
        modelPart: 'Receptive field',
        symbol: 'RF_l',
        role: 'Width/height of original input pixels influencing layer l'
      }
    ],
    playWithItPrompt:
      'In Tab 1 ("Pooling Operations"), toggle between Loudest Feature / Max Pooling and Average Pooling, change the Window Size (2×2 vs 3×3) and Stride, and click any cell in the Downsampled Output Map to see which 2×2 input patch produced it. Then switch to Tab 2 ("Receptive Field Hierarchy") to see how RF expands from 1×1 to 14×14!',
    analogyBreaks:
      'A phone gallery thumbnail averages colors smoothly so the picture still looks pretty to human eyes, whereas CNN Max Pooling ruthlessly throws away 75% of the spatial positions in a 2×2 window, keeping only the single maximum activation.',
    intuition: [
      'Once a feature (such as an eye or corner edge) is detected, its exact sub-pixel coordinate is less important than its relative arrangement to other features.',
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
        question: 'Why is Max Pooling generally preferred over Average Pooling in early feature-extraction layers of a visual classifier?',
        options: [
          'Average pooling requires learnable weights, whereas max pooling uses none.',
          'Max pooling guarantees that every output feature map has odd spatial dimensions.',
          'Max pooling preserves strong peak activations instead of diluting them with zeros.',
          'Average pooling is mathematically incompatible with ReLU activation functions.'
        ],
        correctIndex: 2,
        explanation: 'Max pooling acts as a logical OR detector over a small patch. Average pooling washes out a strong edge activation by averaging it with three background zeros.'
      },
      {
        id: 'q2',
        question: 'How many learnable weight parameters are inside a 2×2 Max Pooling layer with stride 2?',
        options: [
          '0 learnable parameters',
          '4 weights + 1 bias = 5 parameters',
          '16 parameters',
          'It depends on the number of channels.'
        ],
        correctIndex: 0,
        explanation: 'Pooling layers perform a fixed mathematical reduction (max or mean) and introduce zero trainable parameters.'
      }
    ],
    summary: [
      'Pooling reduces spatial dimensions while providing local translation tolerance.',
      'Max pooling retains dominant features without introducing learnable parameters.',
      'Stacked pooling layers expand the effective receptive field exponentially across depth.'
    ]
  },

  // =========================================================================
  // LESSON 4.3: FULL CNN INFERENCE: PIXELS TO PREDICTIONS
  // =========================================================================
  'cnn-inference-pipeline': {
    slug: 'cnn-inference-pipeline',
    scene: {
      title: 'An Automated Bank Cheque-Deposit Machine Reading Handwritten Digits',
      narrative:
        'When you slip a cheque into an ATM, how does the scanner turn an 8×8 grid of ink smudges into the digit "0" in milliseconds? It runs a 7-stage assembly line with frozen weights: (1) scan the pixel grid, (2) slide 3 specialist stencils (Vertical, Horizontal, Loop) to create 3 feature maps, (3) zero out negative mismatches with ReLU, (4) shrink each map via 2×2 Max Pooling, (5) unroll the 3×3×3 cube into a single 27-number checklist (Flatten), (6) score the 4 candidate digits (Dense logits), and (7) convert scores into percentages that add to 100% (Softmax)!'
    },
    mapping: [
      {
        scenePart: 'Scanned 8×8 grayscale ink grid on the cheque',
        modelPart: 'Input tensor',
        symbol: 'X ∈ R^{1×8×8}',
        role: '64 normalized pixel brightness values in [0, 1]'
      },
      {
        scenePart: '3 specialist pattern stencils (Vertical, Horizontal, Loop)',
        modelPart: 'Conv2D filter bank + ReLU',
        symbol: 'A ∈ R^{3×6×6}',
        role: 'Extracts 3 channels of positive spatial feature activations'
      },
      {
        scenePart: 'Compressed 3×3 summary per specialist',
        modelPart: 'Max-pooled volume',
        symbol: 'P ∈ R^{3×3×3}',
        role: 'Downsamples spatial maps while keeping peak detections'
      },
      {
        scenePart: 'Single 27-item checklist handed to the clerk',
        modelPart: 'Flattened feature vector',
        symbol: 'f ∈ R^{27}',
        role: 'Unrolls the 3D volume into a 1D column vector for matrix multiplication'
      },
      {
        scenePart: 'Final confidence percentages (96.4% Digit 0)',
        modelPart: 'Dense logits + Softmax',
        symbol: 'P(y = c | x)',
        role: 'Exponentiates and normalizes logits into probabilities summing to 1'
      }
    ],
    playWithItPrompt:
      'Pick a handwritten digit preset ("Digit 0", "Digit 1", "Digit 4", "Digit 7") or click squares on the 8×8 ink grid to draw your own strokes! Step through Stages 1 to 7 using "Next Step" / "Prev Step", and toggle between the 3D Isometric Tensor View and 2D Planar Inspector.',
    analogyBreaks:
      'A human bank clerk reads a smudged digit by consciously guessing the whole number and re-checking context (like the written words "Rupees Five Thousand"), whereas a feed-forward CNN pipeline executes a single one-way pass from pixels to Softmax with zero top-down re-reading.',
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
      scenario: 'Tracing the complete inference lifecycle of an 8×8 cheque digit image through 3 filters (3×3), ReLU, 2×2 Max Pooling, Flattening (27 features), Dense projection, and Softmax to 4 classes (0, 1, 4, 7).',
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
        question: 'When the cheque-scanner CNN runs in production inference mode (as opposed to training mode), what changes?',
        options: [
          'Inference uses smaller convolutional kernels than training.',
          'Inference reverses the order of layers, computing Softmax first.',
          'Inference requires calculating second-order Hessian matrices.',
          'Inference only executes the forward pass with frozen weights.'
        ],
        correctIndex: 3,
        explanation: 'During inference, model weights are static and evaluation is purely feed-forward, saving memory and compute.'
      },
      {
        id: 'q2',
        question: 'In our cheque-scanner pipeline, what is the exact role of the Flatten stage between Max Pooling (3×3×3) and the Dense layer?',
        options: [
          'To average all spatial pixel intensities into a single scalar brightness value.',
          'To unroll the 3D feature maps into a 1D vector for the dense linear classifier.',
          'To prune away all zero activations produced by preceding ReLU layers.',
          'To normalize the backpropagated gradient magnitudes across all output classes.'
        ],
        correctIndex: 1,
        explanation: 'Dense layers expect a 1D feature vector per sample. Flatten reshapes (3, 3, 3) → (27,) without changing any numbers.'
      },
      {
        id: 'q3',
        question: 'If a colour cheque scanner uses 16 filters of size 5×5 on an RGB image (3 input channels), how many learnable weight parameters (excluding biases) are in that Conv2D layer?',
        options: [
          '1,200 weights',
          '400 weights',
          '75 weights',
          '16 weights'
        ],
        correctIndex: 0,
        explanation: 'Each 3D filter spans all 3 input channels: 5 × 5 × 3 = 75 weights per filter. Across 16 filters, total weights = 16 × 75 = 1,200.'
      }
    ],
    summary: [
      'CNN inference processes images through sequential stages: Conv2D → ReLU → Pooling → Flatten → Dense → Softmax.',
      'Convolutional filters extract spatial visual motifs with translational equivariance.',
      'Pooling achieves local translation invariance and reduces spatial dimensions.',
      'Flattening transitions spatial tensor representations into vector space for categorical classification.',
      'Inference is purely feed-forward with frozen weights and no computational graph overhead.'
    ]
  },

  // =========================================================================
  // LESSON 4.4: BACKPROPAGATION IN CNNs
  // =========================================================================
  'cnn-backpropagation': {
    slug: 'cnn-backpropagation',
    scene: {
      title: 'Tracing Which Stencil Square Caused a Misread Cheque',
      narrative:
        'Suppose our cheque scanner misreads a "7" as a "1". How do we fix the 2×2 stencil (K)? Because that same top-left stencil corner K[0,0] touched 4 different patches as it slid across the 3×3 photo, its total blame (∂L/∂K[0,0]) is the sum of (photo pixel it touched × error at that output spot) across all 4 stops! And what about Max Pooling, where only the loudest student in each 2×2 bench was recorded? During the blame pass, 100% of the error goes back to that single winning seat (argmax), while the other 3 seats get 0 blame!'
    },
    mapping: [
      {
        scenePart: 'Error map arriving from the next stage',
        modelPart: 'Upstream output gradient',
        symbol: 'δ_out = ∂L/∂Y',
        role: 'Spatial map of sensitivities at the convolution output'
      },
      {
        scenePart: 'Summing (pixel touched × output error) at every stop',
        modelPart: 'Filter weight gradient',
        symbol: '∂L/∂K = X ⋆ δ_out',
        role: '2D cross-correlation between input X and upstream error δ_out'
      },
      {
        scenePart: 'Flipping the stencil 180° to send error to earlier layers',
        modelPart: 'Input activation gradient',
        symbol: '∂L/∂X = δ_out *_full rot180(K)',
        role: 'Routes error back to the exact input pixel coordinates'
      },
      {
        scenePart: 'Blaming only the loudest seat in each 2×2 bench',
        modelPart: 'Max-pooling argmax routing',
        symbol: '∂L/∂X_pool',
        role: 'Winner takes all upstream error; non-max cells receive 0'
      }
    ],
    playWithItPrompt:
      'Switch between the 3 tabs: (1) click patches in "Kernel Gradients (∂L/∂K)" to see how shared weights accumulate error across positions, (2) inspect the 180°-rotated kernel in "Input Gradients (rot180)", and (3) check "Max-Pool Mask Routing" to see non-winning cells receive 0.00 gradient.',
    analogyBreaks:
      'When a human artist fixes a stamp, they only look at the one spot where the ink smudged, whereas a shared CNN kernel weight must compromise across every spatial patch in the entire batch simultaneously via summed gradients.',
    intuition: [
      'Backpropagation in convolutional networks follows the multivariate chain rule, but requires spatial transformations to account for weight sharing and 2D sliding operations.',
      'During the forward pass, a single kernel weight K(m, n) is multiplied by multiple patches across the entire input image. Consequently, by the multivariable chain rule, the gradient of the loss with respect to that kernel weight is the accumulation of errors across all those overlapping patch positions: a cross-correlation between input activations and upstream error deltas.',
      'To propagate errors backward to input activations (so preceding layers can learn), the upstream error tensor must be convolved with a spatially flipped (180°-rotated) kernel. This reversal properly routes error signals back to the exact input coordinates that generated them.',
      'Max-pooling layers contain no learnable weights, but their backward pass is critical: gradients are routed strictly to the winning neuron in each pooling window (the argmax location recorded during the forward pass). All non-winning neurons receive an exact gradient of zero because small perturbations to them would have had zero effect on the output.'
    ],
    mathFormulas: [
      {
        name: 'Kernel Weight Gradient (Cross-Correlation)',
        latex: '\\frac{\\partial L}{\\partial K(m, n)} = \\sum_{i} \\sum_{j} \\frac{\\partial L}{\\partial Y(i, j)} \\cdot X(i+m, j+n) = (X \\star \\boldsymbol{\\delta}_{out})(m, n)',
        explanation: 'The gradient for each filter weight equals the sum of products of upstream error deltas with overlapping input activations across all spatial positions.'
      },
      {
        name: 'Input Activation Gradient (180° Rotated Full Convolution)',
        latex: '\\frac{\\partial L}{\\partial X(r, c)} = (\\boldsymbol{\\delta}_{out} *_{\\text{full}} \\text{rot}_{180}(K))(r, c)',
        explanation: 'Upstream error deltas are padded and convolved with the kernel rotated by 180 degrees to compute the gradient w.r.t input features for earlier layers.'
      },
      {
        name: 'Max-Pooling Backward Mask Routing',
        latex: '\\frac{\\partial L}{\\partial X_{pool}(r, c)} = \\begin{cases} \\delta_{out}(pr, pc) & \\text{if } (r, c) = \\text{argmax}_{(p, q)} X(p, q) \\\\ 0 & \\text{otherwise} \\end{cases}',
        explanation: 'Only the coordinate that produced the maximum forward activation receives the upstream gradient signal; all other coordinates receive zero.'
      },
      {
        name: 'Bias Gradient',
        latex: '\\frac{\\partial L}{\\partial b} = \\sum_{i} \\sum_{j} \\delta_{out}(i, j)',
        explanation: 'Because a single bias scalar is added to every spatial position in the output feature map, its gradient is simply the sum of all upstream output errors.'
      }
    ],
    workedExample: {
      scenario: 'Computing the kernel weight gradient ∂L/∂K[0,0] for a 2×2 stencil sliding over a 3×3 input with 2×2 upstream error map δ_out = [[1.0, -0.5], [0.8, 2.0]].',
      steps: [
        { label: 'Step 1: Identify patch pixels multiplied by K[0,0]', math: 'X(0,0)=1.5, \\quad X(0,1)=0.8, \\quad X(1,0)=0.4, \\quad X(1,1)=2.5', note: 'Top-left element of each 2×2 sliding window.' },
        { label: 'Step 2: Multiply by corresponding upstream errors', math: '(1.5 \\times 1.0) + (0.8 \\times -0.5) + (0.4 \\times 0.8) + (2.5 \\times 2.0)', note: 'Summing contributions across all 4 spatial evaluations.' },
        { label: 'Step 3: Accumulate dot products', math: '1.50 - 0.40 + 0.32 + 5.00 = 6.42', note: 'Total accumulated gradient for K[0,0].' },
        { label: 'Step 4: Gradient descent parameter update', math: 'K_{new}[0,0] = K_{old}[0,0] - \\eta \\cdot 6.42', note: 'With learning rate η = 0.1, weight decreases by 0.642 to reduce loss.' }
      ],
      result: '∂L/∂K[0,0] = 6.420. Weight updates in the opposite direction of the gradient.',
      params: {
        kernelSize: '2x2',
        inputSize: '3x3',
        learningRate: 0.1
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Why must the convolutional kernel K be rotated by 180 degrees when computing the backward gradient with respect to the input image (∂L/∂X)?',
        options: [
          'Because gradient descent always moves in the reverse direction of the loss.',
          'To invert all negative weights into positive weights.',
          'Each weight K(m, n) multiplied shifted coordinates during forward pass.',
          'It is only needed when using ReLU activations.'
        ],
        correctIndex: 2,
        explanation: 'The mathematical adjoint (transpose) of discrete cross-correlation is full convolution with the kernel flipped 180°, routing each output error back to the exact input pixel that fed it.'
      },
      {
        id: 'q2',
        question: 'During backpropagation through a 2×2 Max-Pooling layer, what gradient is assigned to the 3 non-winning cells in each 2×2 window?',
        options: [
          'One-fourth of the upstream gradient (δ / 4).',
          'The negative of the maximum cell\'s gradient.',
          'Exactly 0 for all three non-winning cells.',
          'The average gradient of the surrounding feature map.'
        ],
        correctIndex: 2,
        explanation: 'Max pooling has local derivative ∂y/∂x = 1 for the argmax cell and ∂y/∂x = 0 for the other three cells.'
      }
    ],
    summary: [
      'Filter gradients are computed via cross-correlation between input activations and upstream errors: ∂L/∂K = X ⋆ δ_out.',
      'Input gradients are computed via full convolution with the 180°-rotated kernel: ∂L/∂X = δ_out * rot180(K).',
      'Max-pooling backpropagation routes gradients exclusively to the forward argmax indices.',
      'Weight sharing means gradients from every spatial position aggregate into a single parameter update.'
    ]
  },

  // =========================================================================
  // LESSON 4.6: RESNET AND SKIP CONNECTIONS
  // =========================================================================
  'resnet-architectures': {
    slug: 'resnet-architectures',
    scene: {
      title: 'An Express Hostel Lift That Skips Floors When Only a Small Tweak Is Needed',
      narrative:
        'Imagine a 50-floor building where every floor\'s clerk is forced to re-type an entire document from scratch: by Floor 50, typos multiply and feedback sent from the top floor vanishes before reaching Floor 1 (the Degradation Problem). ResNet installs an Express Lift (the Skip Connection +x): the original document rides straight through untouched on the express cable, while the floor clerks only write a sticky note of small edits F(x) to staple onto it: H(x) = F(x) + x. If a floor has nothing useful to add, it just writes F(x) = 0! Better yet, when the boss sends correction feedback backward, it rides the express cable (+I) all the way to Floor 1 without fading!'
    },
    mapping: [
      {
        scenePart: 'Original document entering the floor',
        modelPart: 'Block input tensor',
        symbol: 'x',
        role: 'Feature representation entering the residual block'
      },
      {
        scenePart: 'Small sticky-note edits written by the floor clerks',
        modelPart: 'Residual branch',
        symbol: 'F(x)',
        role: 'Stacked Conv-BN-ReLU layers learning only the change H(x) - x'
      },
      {
        scenePart: 'Express lift carrying the original document untouched',
        modelPart: 'Identity skip shortcut',
        symbol: '+ x',
        role: 'Adds input x directly to F(x) at the output addition gate ⊕'
      },
      {
        scenePart: 'Unblocked feedback line back to Floor 1',
        modelPart: 'Gradient highway term',
        symbol: '∂L/∂x = ∂L/∂H · (∂F/∂x + I)',
        role: 'The +I term guarantees gradients never vanish even if ∂F/∂x → 0'
      }
    ],
    playWithItPrompt:
      'In Tab 1 ("Architecture Diagram"), toggle between Forward Pass H(x) = F(x) + x and Backward Pass ∂L/∂x = ∂L/∂H · (∂F/∂x + I) while sliding Input Signal (x) and Weights (w₁, w₂). Then open Tab 2 ("Gradient Waterfall") and crank Network Depth to 50 layers to see the Plain Network gradient vanish to < 0.001 while ResNet stays strong!',
    analogyBreaks:
      'An elevator only moves people vertically without changing how many passengers fit in a corridor, whereas when a ResNet stage halves image height/width and doubles channels, the identity cable cannot just add x directly—it needs a 1×1 projection shortcut (W_s · x) to match tensor shapes.',
    intuition: [
      'In theory, adding more layers to a deep neural network should never decrease training performance: extra layers could simply learn the identity function f(x) = x.',
      'In practice, traditional deep feedforward networks (such as 56-layer plain networks) suffer from the "degradation problem": as depth increases, training error gets worse because gradients vanish or explode exponentially when multiplied through dozens of stacked weight matrices.',
      'Residual Networks (ResNet) resolve this by reformulating layer objectives: instead of trying to fit an underlying mapping H(x), the stacked layers fit a residual mapping F(x) = H(x) - x, giving the overall output H(x) = F(x) + x.',
      'If an identity mapping is optimal, driving the residual weights F(x) toward zero is vastly easier than learning identity transformations through stacked non-linear layers.',
      'Most importantly, the identity skip connection creates a "gradient highway": during backpropagation, the gradient flows directly through the addition gate with an additive identity term (+ I), allowing healthy gradient signals to propagate back through 100+ layers without vanishing.'
    ],
    mathFormulas: [
      {
        name: 'Residual Learning Formulation',
        latex: 'H(\\mathbf{x}) = F(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x}',
        explanation: 'The output H(x) is the sum of the residual transformation F(x) and the undisturbed input identity shortcut x.'
      },
      {
        name: 'The Gradient Highway Formulation',
        latex: '\\frac{\\partial L}{\\partial \\mathbf{x}} = \\frac{\\partial L}{\\partial H} \\cdot \\left( \\frac{\\partial F}{\\partial \\mathbf{x}} + \\mathbf{I} \\right) = \\frac{\\partial L}{\\partial H} \\frac{\\partial F}{\\partial \\mathbf{x}} + \\frac{\\partial L}{\\partial H}',
        explanation: 'The additive identity matrix + I guarantees that the gradient ∂L/∂H flows backward directly without being scaled by any weight matrices.'
      },
      {
        name: 'Bottleneck Block Complexity',
        latex: '\\text{Cost}_{\\text{bottleneck}} = 1\\times1(4C \\to C) + 3\\times3(C \\to C) + 1\\times1(C \\to 4C) = 17C^2',
        explanation: 'Compresses wide 4C-channel representations down to C for the expensive 3×3 convolution before restoring dimensions, saving >80% FLOPs.'
      },
      {
        name: 'Projection Shortcut (Dimension Matching)',
        latex: 'H(\\mathbf{x}) = F(\\mathbf{x}, \\{W_i\\}) + W_s \\mathbf{x}',
        explanation: 'When spatial dimensions halve or channel depth doubles, a 1×1 convolution with stride 2 matches tensor dimensions.'
      }
    ],
    workedExample: {
      scenario: 'Evaluating forward signal and backward gradient for a residual unit with input x = 2.0, where the floor clerks\' residual branch produces F(x) = 0.30 and local slope dF/dx = 0.15.',
      steps: [
        { label: 'Step 1: Compute residual branch (sticky-note edit)', math: 'F(x) = 0.30', note: 'Learned modification to the input signal.' },
        { label: 'Step 2: Add identity shortcut (express lift)', math: 'H(x) = F(x) + x = 0.30 + 2.00 = 2.30', note: 'Signal is preserved and augmented.' },
        { label: 'Step 3: Backpropagation gradient with upstream dL/dH = 1.0', math: '\\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial H} \\cdot \\left(\\frac{\\partial F}{\\partial x} + 1\\right) = 1.0 \\times (0.15 + 1.0) = 1.15', note: 'Identity term +1 prevents gradient from shrinking to 0.15.' },
        { label: 'Step 4: Comparison to plain network', math: '\\text{Plain gradient} = 1.0 \\times 0.15 = 0.15', note: 'Without skip connection, gradient would have decayed by 85% in a single layer!' }
      ],
      result: 'ResNet gradient remains 1.15 (healthy), whereas plain network gradient collapses to 0.15.',
      params: {
        x: 2.0,
        fx: 0.3,
        dF_dx: 0.15
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'What is the "degradation problem" discovered by He et al. (2015) that motivated ResNet?',
        options: [
          'Deeper networks consistently overfit the training dataset and fail only on test data.',
          'Adding more layers to a plain CNN caused the training error itself to worsen.',
          'Convolutional kernels degrade in quality due to GPU floating-point precision issues.',
          'Activation functions become linear after 10 layers.'
        ],
        correctIndex: 1,
        explanation: 'A 56-layer plain network had higher training error than a 20-layer network—not because of overfitting, but because optimization failed when gradients vanished across 56 multiplicative layers.'
      },
      {
        id: 'q2',
        question: 'In a ResNet block H(x) = F(x) + x, even if all weights inside the residual branch F(x) temporarily have zero gradient (∂F/∂x = 0), what happens to the upstream gradient ∂L/∂H flowing back to earlier layers?',
        options: [
          'It removes the need for running backward pass gradient updates entirely.',
          'The upstream gradient becomes strictly zero and earlier layers stop learning.',
          'It forces every convolutional weight in the residual block to stay positive.',
          'The upstream gradient ∂L/∂H flows unimpeded through the +I identity shortcut.'
        ],
        correctIndex: 3,
        explanation: 'The derivative of x with respect to x is the identity matrix I (+1), so the addition gate passes ∂L/∂H backward unimpeded.'
      }
    ],
    summary: [
      'The degradation problem causes plain deep networks to perform worse on training data than shallow models.',
      'Residual learning reformulates layers to learn F(x) = H(x) - x, making identity mappings trivially easy to optimize.',
      'The gradient highway formulation ∂L/∂x = ∂L/∂H · (∂F/∂x + I) guarantees gradient flow without vanishing.',
      'Bottleneck blocks (1×1 → 3×3 → 1×1) enable 50+ to 152+ layer architectures with extreme parameter efficiency.'
    ]
  },

  // =========================================================================
  // LESSON 4.7: EFFICIENTNET AND COMPOUND SCALING
  // =========================================================================
  'efficientnet-compound-scaling': {
    slug: 'efficientnet-compound-scaling',
    scene: {
      title: 'Balancing an IPL Cricket Squad on a Fixed Auction Budget',
      narrative:
        'Suppose your IPL franchise gets double the budget. Would you spend 100% of it only on 11 specialist batters (Depth d), or only on 30 all-rounders (Width w), or only on a bigger stadium (Resolution r)? No—if a high-resolution photo (bigger stadium) comes in, you need slightly deeper layers (batters to read long patterns) AND slightly wider channels (bowlers to catch fine details) together! EfficientNet links all three with one budget dial φ (d = α^φ, w = β^φ, r = γ^φ) so every +1 increase in φ doubles total compute FLOPs while keeping the squad balanced.'
    },
    mapping: [
      {
        scenePart: 'Single franchise budget dial',
        modelPart: 'Compound coefficient',
        symbol: 'φ',
        role: 'Single integer/float knob scaling B0 (φ=0) up to B7 (φ=7)'
      },
      {
        scenePart: 'Batting lineup length / specialist depth',
        modelPart: 'Network depth multiplier',
        symbol: 'd = α^φ',
        role: 'Scales number of repeated MBConv blocks per stage'
      },
      {
        scenePart: 'Squad variety / bowling options',
        modelPart: 'Channel width multiplier',
        symbol: 'w = β^φ',
        role: 'Scales number of feature channels in each layer'
      },
      {
        scenePart: 'Pitch & boundary field size',
        modelPart: 'Input image resolution',
        symbol: 'r = γ^φ',
        role: 'Scales pixel height and width (e.g. 224×224 up to 600×600)'
      },
      {
        scenePart: 'Captain boosting the hot bowler mid-over',
        modelPart: 'Squeeze-and-Excitation (SE)',
        symbol: 's = σ(W₂ δ(W₁ GAP(X)))',
        role: 'Dynamically weights each channel between 0 and 1'
      }
    ],
    playWithItPrompt:
      'Explore Tab 1 ("MBConv Architecture Circuit") to tweak Expansion (t), Kernel (k), and SE Ratio (r); check Tab 3 ("Compound Scaling B0–B7") and drag the Budget Dial / Compound Coefficient (φ) from 0 to 7 to watch Depth, Width, Resolution, and FLOPs scale in harmony; and inspect Tab 4 to see how Depthwise Separable Conv cuts parameters by 88%!',
    analogyBreaks:
      'In cricket, adding wider fielders does not automatically square the number of balls bowled per over, whereas in a 2D convolution, doubling both channel width (β) and image resolution (γ) multiplies computational FLOPs quadratically by β² · γ².',
    intuition: [
      'Traditionally, scaling convolutional networks involves arbitrarily tuning a single dimension: making the network deeper (like ResNet-101), wider (like WideResNet), or feeding higher resolution images.',
      'However, scaling any single dimension exhibits diminishing returns: extremely deep networks encounter optimization limits; extremely wide shallow networks struggle with complex hierarchical abstractions; and high-resolution images increase FLOPs quadratically without proportional accuracy gains.',
      'EfficientNet introduces Compound Model Scaling: systematically balancing network Depth (d), Width (w), and Resolution (r) using a principled compound scaling coefficient φ: d = α^φ, w = β^φ, r = γ^φ. In practice, EfficientNet B0–B7 follow these φ scaling equations approximately (due to integer rounding of layer counts and channel widths).',
      'Under the constraint α · β² · γ² ≈ 2, scaling by φ roughly doubles total FLOPs while preserving the optimal balance across all three dimensions.',
      'At the architectural level, EfficientNet utilizes Mobile Inverted Bottleneck Convolutions (MBConv) with Depthwise Separable Convolutions—cutting parameters and FLOPs by ~8× compared to standard 2D convolutions—combined with Squeeze-and-Excitation (SE) channel attention.'
    ],
    mathFormulas: [
      {
        name: 'Compound Scaling Formulation',
        latex: '\\text{Depth: } d = \\alpha^\\phi, \\quad \\text{Width: } w = \\beta^\\phi, \\quad \\text{Resolution: } r = \\gamma^\\phi',
        explanation: 'Balances depth, width, and resolution using compound coefficient φ with baseline constants α = 1.2, β = 1.1, γ = 1.15.'
      },
      {
        name: 'FLOPs Constraint',
        latex: '\\alpha \\cdot \\beta^2 \\cdot \\gamma^2 \\approx 2, \\quad \\text{subject to } \\alpha \\ge 1, \\beta \\ge 1, \\gamma \\ge 1',
        explanation: 'Ensures that for any compound scaling factor φ, total computational FLOPs scale by approximately 2^φ.'
      },
      {
        name: 'Depthwise Separable Convolution Cost Ratio',
        latex: '\\frac{\\text{Cost}_{\\text{sep}}}{\\text{Cost}_{\\text{std}}} = \\frac{K^2 \\cdot C_{in} + C_{in} \\cdot C_{out}}{K^2 \\cdot C_{in} \\cdot C_{out}} = \\frac{1}{C_{out}} + \\frac{1}{K^2}',
        explanation: 'For a 3×3 kernel (K=3) and 128 channels, the computational cost is only ~1/9 (an 88% reduction in parameters and FLOPs).'
      },
      {
        name: 'Squeeze-and-Excitation Channel Attention',
        latex: '\\mathbf{s} = \\sigma\\left( W_2 \\cdot \\text{ReLU}(W_1 \\cdot \\text{GAP}(\\mathbf{X})) \\right)',
        explanation: 'Computes a channel-wise recalibration weight vector s ∈ (0, 1) to dynamically amplify important feature maps and suppress uninformative ones.'
      }
    ],
    workedExample: {
      scenario: 'Comparing parameter count and FLOPs for a standard 3×3 convolution vs. a Depthwise Separable convolution with Cin = 64, Cout = 128, on a 28×28 feature map.',
      steps: [
        { label: 'Step 1: Standard convolution parameters', math: '3 \\times 3 \\times 64 \\times 128 = 73,728 \\text{ weights}', note: 'Full 4D tensor parameter matrix.' },
        { label: 'Step 2: Depthwise convolution parameters', math: '3 \\times 3 \\times 64 = 576 \\text{ weights}', note: 'One spatial 3×3 filter per input channel.' },
        { label: 'Step 3: Pointwise 1×1 convolution parameters', math: '1 \\times 1 \\times 64 \\times 128 = 8,192 \\text{ weights}', note: 'Mixes channels linearly.' },
        { label: 'Step 4: Total separable parameters and savings', math: '576 + 8,192 = 8,768 \\implies \\frac{73,728 - 8,768}{73,728} = 88.1\\% \\text{ savings}', note: '8.4× fewer parameters and FLOPs with virtually identical expressive power!' }
      ],
      result: 'Depthwise Separable Conv requires only 8,768 weights vs 73,728 for Standard Conv (88.1% reduction).',
      params: {
        kernelSize: 3,
        inChannels: 64,
        outChannels: 128
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'In EfficientNet\'s FLOPs constraint α · β² · γ² ≈ 2, why are the width multiplier β and resolution multiplier γ squared while the depth multiplier α has exponent 1?',
        options: [
          'Because doubling the number of layers (depth) doubles FLOPs linearly (α¹).',
          'Because GPUs cannot process images with odd numbers of channels.',
          'Because single-dimension scaling is incompatible with Adam optimizer.',
          'Because compound scaling eliminates the need for non-linear activations.'
        ],
        correctIndex: 0,
        explanation: 'Conv2D FLOPs are proportional to Depth × (Cin × Cout) × (H × W). Scaling width by β multiplies both Cin and Cout by β (factor β²), and scaling resolution by γ multiplies both H and W by γ (factor γ²).'
      },
      {
        id: 'q2',
        question: 'In the MBConv block used by EfficientNet, what does the Squeeze-and-Excitation (SE) sub-block do?',
        options: [
          'It downsamples the spatial height and width of every feature map by half.',
          'It pools each channel globally and learns a 0-to-1 sigmoid gate per channel.',
          'It replaces convolutional kernel weights with Gaussian noise during training.',
          'It computes the exact second-order Hessian derivatives of the classification loss.'
        ],
        correctIndex: 1,
        explanation: 'Squeeze-and-Excitation introduces lightweight channel attention: GAP squeezes H×W×C into 1×1×C, and a small MLP + Sigmoid excites the most informative channels for the current image.'
      }
    ],
    summary: [
      'Compound scaling systematically balances depth (d), width (w), and resolution (r) via a single coefficient φ.',
      'Depthwise Separable Convolutions separate spatial filtering from channel mixing, cutting computation by ~8×.',
      'MBConv inverted bottlenecks perform depthwise convolutions in an expanded high-dimensional space.',
      'Squeeze-and-Excitation (SE) attention dynamically recalibrates channel weights, maximizing feature selectivity.'
    ]
  },

  // =========================================================================
  // LESSON 6.1: SELF-ATTENTION AND SCALED DOT-PRODUCT
  // =========================================================================
  'self-attention-scaled-dot-product': {
    slug: 'self-attention-scaled-dot-product',
    scene: {
      title: 'Scanning a Noisy Hostel WhatsApp Group Chat to Reply to "it"',
      narrative:
        'Your WhatsApp group has 5 messages flying at once, and someone writes: "The robot saw the battery and charged it." When you read the word "it", what does "it" refer to? You mentally broadcast a search question (Query q_i: "looking for a rechargeable object"), compare it against the topic tag on every word in the chat (Key k_j), divide by a cooling factor (√d_k) so you don\'t overreact to one loud keyword, turn the match scores into percentages summing to 100% (Softmax), and blend the actual message contents (Value v_j)—pulling 82% of the meaning directly from "battery"!'
    },
    mapping: [
      {
        scenePart: 'What the current word "it" is searching for',
        modelPart: 'Query vector',
        symbol: 'q_i = x_i W_Q',
        role: 'Search probe emitted by token i'
      },
      {
        scenePart: 'Topic label on each candidate word in the chat',
        modelPart: 'Key vector',
        symbol: 'k_j = x_j W_K',
        role: 'Index tag matched against the query via dot product q_i · k_j'
      },
      {
        scenePart: 'Actual information carried by each word',
        modelPart: 'Value vector',
        symbol: 'v_j = x_j W_V',
        role: 'Content payload blended according to attention weights'
      },
      {
        scenePart: 'Cooling factor so one score doesn\'t drown out all others',
        modelPart: 'Dimension scaling',
        symbol: '1 / √d_k',
        role: 'Keeps dot-product variance at 1.0 so Softmax gradients don\'t vanish'
      }
    ],
    playWithItPrompt:
      'In Tab 1 ("Scaled Dot-Product [Q, K, V]"), click any Query Token button (try "it" at pos 3) to see which Key tokens light up with high attention weights. Then toggle the Cooling Scale (1/√d_k) between "√d_k = 2.0 (Standard)" and "Scale = 1.0 (Unscaled)" to watch Softmax saturate when unscaled!',
    analogyBreaks:
      'When you read a WhatsApp chat, you naturally know which message was sent first vs last by its position on screen; pure Scaled Dot-Product Attention Softmax(QKᵀ/√d_k)V has zero built-in sense of word order unless positional encodings are added first.',
    intuition: [
      'Prior to Transformers, sequence processing relied on Recurrent Neural Networks (RNNs) that passed hidden state sequentially step-by-step. This created a severe bottleneck: information had to traverse O(N) sequential steps, causing distant dependencies to fade or vanish.',
      'Self-Attention completely eliminates recurrence. Instead of passing state sequentially, every token in a sequence directly compares itself against every other token in parallel with O(1) path length.',
      'To enable dynamic information routing, each token is projected into three distinct vectors: a Query (Q, what am I looking for?), a Key (K, what information do I offer?), and a Value (V, what content do I communicate?).',
      'By taking the dot product between a query qᵢ and all keys kⱼ, the network computes compatibility scores. Scaling by 1/√d_k stabilizes the variance so the subsequent Softmax function does not saturate and cause vanishing gradients.',
      'The final representation for each token is a contextualized weighted sum of all value vectors: Attention(Q, K, V) = Softmax(QKᵀ / √d_k) · V.'
    ],
    mathFormulas: [
      {
        name: 'Scaled Dot-Product Attention',
        latex: '\\text{Attention}(Q, K, V) = \\text{Softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
        explanation: 'Computes pairwise attention weights between queries Q and keys K scaled by temperature 1/√d_k, then multiplies by values V.'
      },
      {
        name: 'Query, Key, Value Projections',
        latex: 'Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V',
        explanation: 'Input token representations X ∈ R^{N × d_model} are mapped into specialized matching subspaces via learned parameter matrices.'
      },
      {
        name: 'Softmax Row Normalization',
        latex: 'A_{i,j} = \\frac{\\exp\\left( \\frac{q_i \\cdot k_j}{\\sqrt{d_k}} \\right)}{\\sum_{m=1}^N \\exp\\left( \\frac{q_i \\cdot k_m}{\\sqrt{d_k}} \\right)}',
        explanation: 'Guarantees that attention weights across all key positions j sum to 1.0 for each query token i, forming a valid probability distribution.'
      },
      {
        name: 'Variance Scaling Theorem',
        latex: '\\text{Var}(q \\cdot k) = \\sum_{m=1}^{d_k} \\text{Var}(q_m k_m) = d_k \\implies \\text{Var}\\left( \\frac{q \\cdot k}{\\sqrt{d_k}} \\right) = 1.0',
        explanation: 'Assuming independent zero-mean unit-variance components, dividing by √d_k normalizes dot product variance back to unit variance.'
      }
    ],
    workedExample: {
      scenario: 'Computing the self-attention output for query token "it" with 2 candidate keys and d_k = 4, using scale factor √d_k = 2.0.',
      steps: [
        { label: 'Step 1: Compute raw dot products', math: 'q \\cdot k_1 = 4.0, \\quad q \\cdot k_2 = 1.0', note: 'Higher dot product indicates higher alignment.' },
        { label: 'Step 2: Apply 1/√d_k scaling', math: 's_1 = \\frac{4.0}{2.0} = 2.0, \\quad s_2 = \\frac{1.0}{2.0} = 0.5', note: 'Prevents extreme logits that saturate Softmax.' },
        { label: 'Step 3: Evaluate Softmax attention weights', math: 'e^{2.0} \\approx 7.389, \\quad e^{0.5} \\approx 1.649 \\implies a_1 = \\frac{7.389}{9.038} = 0.818, \\quad a_2 = 0.182', note: 'Token 1 receives 81.8% of the attention.' },
        { label: 'Step 4: Compute contextual output', math: 'z = 0.818 \\cdot v_1 + 0.182 \\cdot v_2', note: 'Weighted combination of value representations.' }
      ],
      result: 'The attention weight for token 1 is 81.8% and token 2 is 18.2%, aggregating a context-rich output vector.',
      params: {
        d_k: 4,
        scale: 2.0
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Why does Scaled Dot-Product Attention divide the raw dot products QKᵀ by √d_k before applying Softmax?',
        options: [
          'Because it reduces the computational complexity from O(N²) to O(N).',
          'Because GPUs cannot compute matrix multiplications without dividing by square roots.',
          'Because dividing by √d_k guarantees that all dot products are integers.',
          'Large d_k inflates dot-product variance and saturates the Softmax gradients.'
        ],
        correctIndex: 3,
        explanation: 'Vaswani et al. (2017) showed that when d_k is large, dot products grow in magnitude with standard deviation √d_k, pushing Softmax into near-one-hot saturation where ∂Softmax/∂z ≈ 0.'
      },
      {
        id: 'q2',
        question: 'In the sentence "The robot saw the battery and charged it", what allows self-attention to link "it" to "battery" in a single step?',
        options: [
          'Backpropagation permanently zeroes out all other token embeddings in the sentence.',
          'The network queries a hard-coded symbolic grammar lookup table stored on disk.',
          'The learned Query vector for "it" aligns strongly with the Key vector for "battery".',
          'Spatial max-pooling layers select the noun token with the longest character count.'
        ],
        correctIndex: 2,
        explanation: 'Learned projection matrices W_Q and W_K align the query vector of "it" with the key vector of its semantic antecedent, routing "battery"\'s value vector directly into "it".'
      }
    ],
    summary: [
      'Self-attention enables direct O(1) pairwise interaction between all tokens in a sequence.',
      'Projections Q = X·W_Q, K = X·W_K, V = X·W_V create specialized queries, keys, and values.',
      'Scaling by 1/√d_k maintains unit variance, protecting Softmax from gradient saturation.',
      'The output is a dynamically weighted convex combination of value vectors.'
    ]
  },

  // =========================================================================
  // LESSON 6.2: MULTI-HEAD ATTENTION AND THE TRANSFORMER BLOCK
  // =========================================================================
  'transformer-block-multihead-attention': {
    slug: 'transformer-block-multihead-attention',
    scene: {
      title: 'Four Friends Watching the Same Movie, Each Tracking a Different Clue',
      narrative:
        'When you and three friends watch a mystery thriller together, instead of all four staring at the exact same thing, you split up the job: Friend 1 tracks grammar ("who did the action?"), Friend 2 tracks pronouns ("who is \'it\'?"), Friend 3 tracks tone and emotion, and Friend 4 tracks adjacent words. Even though each friend only takes 1/4th of the notebook pages (d_k = d_model / h), when you staple all four notes together at the intermission and summarize them (Concat · W^O), the group catches four relationships at once for the exact same total notebook cost as one person writing everything!'
    },
    mapping: [
      {
        scenePart: 'Each friend\'s specialized lens on the movie',
        modelPart: 'Attention head i',
        symbol: 'head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)',
        role: 'Attends to a distinct representation subspace of size d_k = d_model / h'
      },
      {
        scenePart: 'Stapling all friends\' notes and writing a unified summary',
        modelPart: 'Concatenation & output projection',
        symbol: 'Concat(head_1, ..., head_h) W^O',
        role: 'Merges all h subspaces back into d_model dimensions'
      },
      {
        scenePart: 'Individual reflection after the group discussion',
        modelPart: 'Position-wise Feed-Forward Network',
        symbol: 'FFN(x)',
        role: '2-layer MLP applied to each token position independently'
      },
      {
        scenePart: 'Keeping the original storyline intact across scenes',
        modelPart: 'Pre-LN residual stream',
        symbol: 'x + Sublayer(LN(x))',
        role: 'Unblocked gradient highway through all Transformer blocks'
      }
    ],
    playWithItPrompt:
      'Open Tab 2 ("Multi-Head Attention") and click through the 4 specialist Heads (Syntactic, Pronoun Coreference, Semantic Action, Local Context) to see how each head attends to different words in the exact same sentence. Then switch to Tab 3 ("Transformer Block Circuit") to compare Pre-LN vs Post-LN gradient highways!',
    analogyBreaks:
      'Four human friends decide in English which person will track grammar vs emotion before the movie starts, whereas Multi-Head Attention heads are initialized with random matrices and discover their own subspaces purely from gradient descent—sometimes learning overlapping or redundant roles.',
    intuition: [
      'While a single attention head can focus on one type of relationship (e.g. resolving a pronoun), language and vision require attending to multiple diverse relationships simultaneously (e.g. syntactic structure, semantic role, positional adjacency).',
      'Multi-Head Attention (MHA) solves this by splitting the model dimension d_model into h parallel heads, where each head operates on dimension d_k = d_model / h. This allows the model to jointly attend to information from different representation subspaces at different positions.',
      'The outputs from all h heads are concatenated and linearly transformed: MHA(Q, K, V) = Concat(head₁, …, head_h) W^O. Crucially, because each head has reduced dimension d_k, total computational cost is identical to single-head attention with full dimensionality!',
      'The complete Transformer Encoder Block packages Multi-Head Attention with residual skip connections (x + Sublayer(x)), Layer Normalization, and a point-wise Feed-Forward Network (FFN).',
      'Modern architectures (like GPT-2/3, LLaMA, and ViT) utilize Pre-Layer Normalization (Pre-LN), applying LayerNorm before each sublayer so gradients can pass completely unattenuated through the residual stream.'
    ],
    mathFormulas: [
      {
        name: 'Multi-Head Attention Formulation',
        latex: '\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O',
        explanation: 'Each head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V) projects inputs into a distinct subspace before final projection W^O.'
      },
      {
        name: 'Subspace Dimension Split',
        latex: 'd_k = d_v = \\frac{d_{\\text{model}}}{h}',
        explanation: 'Splitting d_model across h heads keeps the total parameter count and FLOPs identical to full-rank single-head attention.'
      },
      {
        name: 'Position-Wise Feed-Forward Network (FFN)',
        latex: '\\text{FFN}(x) = \\sigma(x W_1 + b_1) W_2 + b_2',
        explanation: 'Applies two linear projections with an element-wise activation σ in between (ReLU in the original paper, GELU in many modern models), typically expanding to 4·d_model.'
      },
      {
        name: 'Pre-Layer Normalization (Pre-LN) Residual Stream',
        latex: 'x^{(1)} = x + \\text{MHA}(\\text{LN}(x)), \\quad x^{(2)} = x^{(1)} + \\text{FFN}(\\text{LN}(x^{(1)}))',
        explanation: 'Normalizing inputs before each sublayer creates an unimpeded gradient highway across all Transformer layers.'
      }
    ],
    workedExample: {
      scenario: 'Calculating dimensions and parameter counts for a Multi-Head Attention layer with d_model = 512 and h = 8 heads.',
      steps: [
        { label: 'Step 1: Compute head dimension d_k', math: 'd_k = \\frac{d_{\\text{model}}}{h} = \\frac{512}{8} = 64', note: 'Each head operates in a 64-dimensional subspace.' },
        { label: 'Step 2: Projection matrix parameters per head', math: 'W_i^Q, W_i^K, W_i^V \\in \\mathbb{R}^{512 \\times 64} \\implies 3 \\times (512 \\times 64) = 98,304 \\text{ weights}', note: 'Parameters for one attention head.' },
        { label: 'Step 3: Total projection parameters across all 8 heads', math: '8 \\times 98,304 = 786,432 \\text{ weights}', note: 'Exact equivalent to single-head matrices (3 × 512²).' },
        { label: 'Step 4: Output projection matrix W^O', math: 'W^O \\in \\mathbb{R}^{512 \\times 512} = 262,144 \\text{ weights}', note: 'Mixes concatenated head outputs back into d_model.' }
      ],
      result: 'Total MHA parameters = 786,432 + 262,144 = 1,048,576 (exactly 4 × d_model² weights).',
      params: {
        d_model: 512,
        h: 8,
        d_k: 64
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'In our 4-friends movie scene, why does splitting d_model = 512 into h = 8 heads of size d_k = 64 cost the exact same number of matrix-multiply parameters as 1 giant head of size 512?',
        options: [
          'Because 8 heads × (512 × 64) = 512 × 512.',
          'Because GPUs cannot process matrices larger than 64 columns.',
          'Because splitting into heads reduces training memory to zero.',
          'Because single-head attention cannot be trained with backpropagation.'
        ],
        correctIndex: 0,
        explanation: 'With a single attention head, one Softmax distribution averages over everything. Splitting d_model into h heads of width d_model/h lets h different attention patterns fire in parallel for the same parameter count.'
      },
      {
        id: 'q2',
        question: 'Why do modern foundation models (such as GPT-2/3 and LLaMA) prefer Pre-Layer Normalization x + Sublayer(LN(x)) over the original Post-LN LN(x + Sublayer(x))?',
        options: [
          'Pre-LN replaces all non-linear FFN activations with linear identity mappings.',
          'Pre-LN eliminates the need for query-key matrix multiplications during training.',
          'Post-LN normalization layers cannot be parallelized on modern GPU tensor cores.',
          'Pre-LN applies LayerNorm on the branch so the main residual highway stays unblocked.'
        ],
        correctIndex: 3,
        explanation: 'In Pre-LN, the identity shortcut connects directly from layer input to output (x_next = x + Sublayer(LN(x))), ensuring that dL/dx includes an unattenuated +1 term, just like ResNet.'
      }
    ],
    summary: [
      'Multi-Head Attention enables joint attention across h distinct linguistic and semantic subspaces.',
      'Splitting d_model into h heads of size d_k preserves computational efficiency identical to full-rank attention.',
      'The Transformer Encoder block couples MHA with point-wise FFNs, residual skip connections, and LayerNorm.',
      'Pre-LN architecture stabilizes gradient flow, enabling deep foundation models to train reliably.'
    ]
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.1: EXPLORING A DATASET BEFORE YOU TOUCH A MODEL (EDA)
  // =========================================================================
  'first-look-at-data-eda': {
    slug: 'first-look-at-data-eda',
    scene: {
      title: 'Looking Over a Used Scooter Before You Pay a Single Rupee',
      narrative:
        'Imagine buying a second-hand scooter outside your hostel. You would never hand over ₹35,000 just because the seller says "average mileage is 45 kmpl." You check the odometer, inspect the tyres, look for rust under the mat, and ask whether one highway trip skewed that average. Exploratory Data Analysis (EDA) is that exact inspection for a dataset: before you touch a neural network, you check distributions, spot skewed tails where the mean lies to you, compare median and IQR against standard deviation, and catch broken columns.'
    },
    mapping: [
      {
        scenePart: 'Seller\'s claimed "average" across all rides',
        modelPart: 'Sample Mean',
        symbol: 'μ = (1/N) Σ x_i',
        role: 'Center of mass of the feature—highly sensitive to a single extreme bill or ride'
      },
      {
        scenePart: 'The middle scooter ride when sorted from shortest to longest',
        modelPart: 'Sample Median (50th Percentile)',
        symbol: 'Q_2 = median(x)',
        role: 'Robust center that ignores extreme spikes in the tail'
      },
      {
        scenePart: 'Spread of the middle 50% of normal daily rides',
        modelPart: 'Interquartile Range (IQR)',
        symbol: 'IQR = Q_3 - Q_1',
        role: 'Robust spread between the 75th and 25th percentiles'
      },
      {
        scenePart: 'How lopsided the ride-length histogram looks',
        modelPart: 'Sample Skewness',
        symbol: 'γ_1',
        role: 'Measures tail asymmetry; γ_1 > 1 signals strong right-skew'
      }
    ],
    playWithItPrompt:
      'In Tab 9.1 ("EDA & Skew"), drag the "10th Student\'s Bill / Extreme Value (x₁₀)" slider from ₹24k up to ₹140k. Watch how the Mean (μ) and Std Dev (σ) get dragged across the chart while the green Median (Q₂) and gold IQR box barely budge!',
    analogyBreaks:
      'Inspecting a scooter checks one physical machine with your eyes, whereas real ML datasets often have 100+ columns and 100,000 rows—so visual inspection must be paired with automated programmatic assertions (schema checks, null-rate thresholds, and correlation matrices).',
    intuition: [
      'Most beginner ML failures happen before line 1 of the model is ever run: a column of numbers is silently stored as strings because of one blank space, a sensor glitch recorded -999 for missing temperatures, or a right-skewed income column has a mean three times larger than its median.',
      'When a distribution is symmetric (like student heights), the sample mean μ and sample standard deviation σ summarize the center and spread faithfully.',
      'When a distribution is heavily skewed (like monthly app spending, house prices, or hospital stays), a tiny fraction of extreme values pulls μ and inflates σ—making the median Q₂ and Interquartile Range (IQR = Q₃ - Q₁) far more honest descriptors.'
    ],
    mathFormulas: [
      {
        name: 'Sample Mean & Variance',
        latex: '\\mu = \\frac{1}{N}\\sum_{i=1}^{N} x_i, \\quad \\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2',
        explanation: 'Squared deviations weight extreme tail values quadratically, making μ and σ non-robust to outliers.'
      },
      {
        name: 'Interquartile Range (IQR)',
        latex: '\\text{IQR} = Q_3 - Q_1 = P_{75}(x) - P_{25}(x)',
        explanation: 'Measures the width of the middle 50% of sorted observations; has a 25% breakdown point against extreme corruption.'
      },
      {
        name: 'Sample Skewness (Fisher-Pearson)',
        latex: '\\gamma_1 = \\frac{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^3}{\\sigma^3}',
        explanation: 'Cubic central moment normalized by σ³. Positive γ₁ indicates a long right tail; negative γ₁ indicates a long left tail.'
      }
    ],
    workedExample: {
      scenario: 'Comparing Mean vs Median on 5 monthly hostel mess bills (in ₹ thousands): [12, 15, 16, 17, 90].',
      steps: [
        {
          label: 'Step 1: Compute Sample Mean μ',
          math: '\\mu = \\frac{12 + 15 + 16 + 17 + 90}{5} = \\frac{150}{5} = 30.0',
          note: 'Notice that 4 out of 5 students paid under ₹18k, yet the mean claims ₹30k!'
        },
        {
          label: 'Step 2: Find Median Q₂ and Quartiles Q₁, Q₃',
          math: 'Q_2 = 16.0, \\quad Q_1 = 15.0, \\quad Q_3 = 17.0',
          note: 'The sorted middle value is 16.0, reflecting typical student bills.'
        },
        {
          label: 'Step 3: Compute IQR',
          math: '\\text{IQR} = Q_3 - Q_1 = 17.0 - 15.0 = 2.0',
          note: 'The middle half of bills spans only ₹2k.'
        }
      ],
      result: 'Mean = ₹30.0k (distorted by the single ₹90k bill), whereas Median = ₹16.0k and IQR = ₹2.0k.',
      params: {}
    },
    quiz: [
      {
        id: 'eda-q1',
        question: 'You inspect a delivery-time column in an app dataset and find Mean = 48 minutes, Median = 24 minutes, and Skewness γ₁ = +4.2. What does this tell you immediately?',
        options: [
          'Exactly half of all customer food deliveries took 48 minutes or longer to arrive.',
          'Most orders arrive near 24 minutes, while a right tail of delays pulls the mean up.',
          'The dataset has zero outliers and follows a perfect bell curve.',
          'The median calculation is broken because median must always equal the mean.'
        ],
        correctIndex: 1,
        explanation: 'When Mean >> Median and skewness is strongly positive, a minority of large right-tail values is pulling the center of mass upward.'
      },
      {
        id: 'eda-q2',
        question: 'In Kaggle\'s Telco Customer Churn dataset, the TotalCharges column looks numeric in Excel, but pandas loads it as object/string dtype. Why must EDA catch this before modeling?',
        options: [
          'New customers with tenure = 0 have a blank space " " in TotalCharges.',
          'String columns train ten times faster than float32 tensors on modern GPUs.',
          'Neural networks automatically parse whitespace strings into median values.',
          'Object dtype columns always have zero statistical variance across rows.'
        ],
        correctIndex: 0,
        explanation: 'Real CSVs often encode missing values as whitespace, "?", or "-999". Auditing dtypes and unique non-numeric tokens is the first step of EDA.'
      }
    ],
    summary: [
      'Always audit column dtypes, missingness rates, and quantiles before writing any model code.',
      'Mean and standard deviation are sensitive to outliers because deviations are squared.',
      'Median and IQR (Q₃ - Q₁) remain stable even when up to 25% of values are extreme spikes.',
      'Strong positive skewness (γ₁ > 1) often benefits from log1p transformation or robust scaling.'
    ],
    cheatSheet: {
      title: '9.1 Quick EDA & Summary Stats Cheat Sheet',
      rules: [
        'Inspect df.info(), df.isna().mean(), and df.nunique() before writing any model.',
        'Use Median (Q₂) + IQR (Q₃ - Q₁) whenever skewness |γ₁| > 1; use Mean + Std only on symmetric distributions.',
        'Check object/string columns for hidden missing placeholders like " ", "?", or "-999".'
      ],
      pitfalls: [
        'Running EDA on the test split and tuning hyperparameters based on test distributions causes subtle overfitting.',
        'Assuming pandas float/object dtypes are clean without checking min/max quantiles.'
      ],
      codeSnippet: `df.info()\ndf.describe(percentiles=[0.05, 0.25, 0.5, 0.75, 0.95])\ndf.isna().mean().sort_values(ascending=False)`
    }
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.2: HANDLING MISSING DATA
  // =========================================================================
  'handling-missing-data': {
    slug: 'handling-missing-data',
    scene: {
      title: 'An Attendance Sheet with Blank Cells: Medical Leave vs Skipped Questions',
      narrative:
        'You are compiling lab marks and scholarship forms for 60 students. Three lab cells are blank because those students missed the test on medical leave, and 11 students left "Existing Credit Card Limit" blank because they do not own a credit card. If you delete every student with a blank cell, you throw away valuable data and bias your sample! Instead, you fill continuous blanks with a training-set median (or domain-specific 0 when absence means zero) AND add a binary "was_missing = 1" checkbox so the model learns when the blank itself carries signal.'
    },
    mapping: [
      {
        scenePart: 'Filling a blank test cell with the class median',
        modelPart: 'Median Imputation',
        symbol: 'x̂_i = Q_2(x_train)',
        role: 'Replaces NaN with a robust typical value computed strictly on the training split'
      },
      {
        scenePart: 'Adding a "value was blank" tick mark next to the filled cell',
        modelPart: 'Missingness Indicator Column',
        symbol: 'm_i ∈ {0, 1}',
        role: 'Lets the model learn when the fact that a value was missing is itself predictive (MNAR)'
      },
      {
        scenePart: 'Filling "Existing Credit Limit" with ₹0 for students without a card',
        modelPart: 'Domain-Specific Constant Imputation',
        symbol: 'x̂_i = 0, m_i = 1',
        role: 'Uses structural domain knowledge when NaN literally represents zero quantity'
      },
      {
        scenePart: 'Estimating a blank from the 5 most similar students',
        modelPart: 'KNN / Iterative Imputation',
        symbol: 'x̂_i = (1/k) Σ_{j∈N(i)} x_j',
        role: 'Uses correlated features from training neighbors to reconstruct missing entries'
      }
    ],
    playWithItPrompt:
      'Switch to Tab 9.2 ("Missing"). Toggle the Blank-Cell Fill Rule between Median and Mean on the income table—notice how one high earner (₹140k) pulls Mean imputation up to ₹42.2k while Median imputation stays anchored at ₹23.5k alongside the binary m_i = 1 indicator flag!',
    analogyBreaks:
      'In a small classroom you can call the student to ask why a box was left blank, whereas in production ML you must infer whether missingness is MCAR (random glitch), MAR (explained by other columns), or MNAR (informative absence) and preserve that signal with an indicator column.',
    intuition: [
      'Neural networks and linear models cannot multiply NaN: a single missing value propagates NaN through every weight dot-product and gradient update.',
      'Before filling blanks, diagnose the mechanism: Missing Completely At Random (MCAR, safe to drop if <5% of rows), Missing At Random (MAR, predictable from other observed columns via KNN/IterativeImputer), or Missing Not At Random (MNAR, where the blank itself is a strong clue).',
      'For categorical columns, fill missing entries with either the most frequent value (mode) or an explicit "Unknown" category so missingness becomes its own bucket.',
      'When a feature is structurally absent (such as "Existing Credit Card Limit" for an applicant who has never had a credit card), filling with 0 plus a binary indicator column m_i ∈ {0, 1} is far more accurate than filling with the median of cardholders.',
      'For general skewed numeric columns, median imputation (fitted on the training split only!) resists high-income spikes that distort mean imputation. Note that gradient boosted tree libraries—XGBoost, LightGBM, and CatBoost—handle missing values natively by learning the optimal split direction for NaN without manual imputation.'
    ],
    mathFormulas: [
      {
        name: 'Imputation with Missingness Indicator',
        latex: '\\hat{x}_i = \\begin{cases} x_i & \\text{if observed} \\\\ c_{\\text{fill}} & \\text{if missing} \\end{cases}, \\quad m_i = \\mathbb{I}(x_i \\text{ is missing})',
        explanation: 'Replaces missing entries with c_fill (training median, mode, or structural 0) while appending binary indicator m_i ∈ {0, 1}.'
      },
      {
        name: 'Linear Layer with Missingness Flag',
        latex: 'z_i = w_1 \\hat{x}_i + w_2 m_i + b',
        explanation: 'Allows a linear or neural layer to learn a dedicated baseline shift w_2 whenever a feature was originally missing.'
      }
    ],
    workedExample: {
      scenario: 'Comparing Median vs Mean imputation on observed training incomes [18, 21, 22, 25, 27, 140] (₹k) where Row 2 and Row 5 are NaN.',
      steps: [
        {
          label: 'Step 1: Compute Training Median vs Mean on the 6 observed values',
          math: '\\text{median} = \\frac{22 + 25}{2} = 23.5, \\quad \\text{mean} = \\frac{253}{6} = 42.17',
          note: 'Median (₹23.5k) reflects typical earners, whereas the mean (₹42.17k) is distorted by the ₹140k earner.'
        },
        {
          label: 'Step 2: Construct imputed feature and missingness indicator pair',
          math: '(\\hat{x}_2, m_2) = (23.5, 1), \\quad (\\hat{x}_1, m_1) = (18.0, 0)',
          note: 'Observed rows get m_i = 0; imputed rows get m_i = 1 so no information is lost.'
        }
      ],
      result: 'Missing rows are imputed to ₹23.5k (median) with indicator m_i = 1, keeping all rows valid for matrix multiplication.',
      params: {}
    },
    quiz: [
      {
        id: 'miss-q1',
        question: 'In a loan-default dataset, 18% of applicants left "Existing Credit Card Limit" blank because they have never owned a credit card. What is the best way to handle those blanks?',
        options: [
          'Fill the blanks with the maximum credit limit found in the training dataset so the model stays conservative.',
          'Drop all 18% of applicants without credit cards from the dataset so the model never encounters a blank cell.',
          'Fill the blanks with 0 AND add a binary indicator column credit_limit_was_missing ∈ {0, 1}.',
          'Leave raw NaN values inside the input feature tensor and rely on ReLU activations to zero them out.'
        ],
        correctIndex: 2,
        explanation: 'An applicant with no credit card has an actual credit limit of 0 (not the median limit of cardholders!), and adding credit_limit_was_missing = 1 lets the model distinguish "no card" from a card with zero limit.'
      },
      {
        id: 'miss-q2',
        question: 'When using Median Imputation or KNNImputer on a dataset, why must you fit the imputer ONLY on the training split (X_train) rather than on the full dataset before splitting?',
        options: [
          'Because fitting on the full dataset leaks test-set statistics into the training features.',
          'Because scikit-learn raises a syntax error if SimpleImputer is called on more than 1,000 rows at once.',
          'Because test sets in production never contain any missing values or blank cells.',
          'Because computing the median of the combined dataset always produces a negative number.'
        ],
        correctIndex: 0,
        explanation: 'Computing statistics across the combined train+test table leaks future test distribution information into training features (data leakage). Always fit on X_train and transform X_test.'
      }
    ],
    summary: [
      'Never blindly drop rows with missing values without checking if the absence itself is informative (MNAR).',
      'Fill numeric columns with the training median (+ binary m_i flag) or structural 0; fill categorical columns with the most frequent mode or an "Unknown" category.',
      'Drop a column altogether if more than ~60% of its values are missing and carry no special indicator signal; note that XGBoost, LightGBM, and CatBoost handle NaNs natively.',
      'Always fit imputers (Median, Mode, KNNImputer) strictly on the training split to prevent data leakage.'
    ],
    cheatSheet: {
      title: '9.2 Handling Missing Data Cheat Sheet',
      rules: [
        '<5% missing completely at random (MCAR): dropping rows is usually safe; >60% missing in a column: usually drop the column.',
        'Numeric column: fill with training Median (or Mean if symmetric) + add_indicator=True when missingness carries signal.',
        'Categorical column: fill with most_frequent (mode) or constant "Unknown" category.',
        'XGBoost, LightGBM, and CatBoost handle NaN values natively at split time.'
      ],
      pitfalls: [
        'Fitting SimpleImputer or KNNImputer before train_test_split leaks test medians into training.',
        'Filling structural zeros (e.g. credit limit for non-cardholders) with the median of cardholders.'
      ],
      codeSnippet: `SimpleImputer(strategy="median", add_indicator=True)\nSimpleImputer(strategy="constant", fill_value="Unknown")`
    }
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.3: OUTLIERS AND FEATURE SCALING
  // =========================================================================
  'outliers-and-feature-scaling': {
    slug: 'outliers-and-feature-scaling',
    scene: {
      title: 'One Typo or Billionaire in the List, and Comparing Marks Out of 100 with Income in Lakhs',
      narrative:
        'Suppose a scholarship dataset has two issues: first, one entry says "950/100" because a data-entry clerk\'s finger slipped, and one applicant\'s family income is ₹2.5 Crore while everyone else earns ₹2–5 Lakhs. Second, Entrance Score is measured in tens (0 to 100) while Family Income is measured in lakhs (₹1,00,000 to ₹50,00,000), making the income gradient 50,000× steeper! Tukey\'s IQR fences catch and Winsorize extreme outliers without getting fooled by inflated standard deviations, and Feature Scaling (StandardScaler, Min-Max, RobustScaler, or Log1p) puts every column on a fair yardstick.'
    },
    mapping: [
      {
        scenePart: 'Quartile boundaries that catch a 950/100 typo without getting fooled by it',
        modelPart: 'Tukey IQR Outlier Fences & Winsorization',
        symbol: '[Q_1 - 1.5·IQR, Q_3 + 1.5·IQR]',
        role: 'Flags and clips extreme values using order statistics immune to outlier masking'
      },
      {
        scenePart: 'Centering around the class average and measuring in standard-deviation steps',
        modelPart: 'Z-Score Standardization (StandardScaler)',
        symbol: 'x̃ = (x - μ_train) / σ_train',
        role: 'Gives every training feature mean 0 and unit variance 1'
      },
      {
        scenePart: 'Mapping the lowest training score to 0.0 and highest training score to 1.0',
        modelPart: 'Min-Max Normalization',
        symbol: 'x̃ = (x - x_min,tr) / (x_max,tr - x_min,tr)',
        role: 'Maps training data to [0, 1] (note: unseen test values outside train range can fall outside [0, 1]!)'
      },
      {
        scenePart: 'Measuring distance from the median in IQR units so one billionaire doesn\'t squash everyone else',
        modelPart: 'Robust Scaling (RobustScaler)',
        symbol: 'x̃ = (x - Q_2) / IQR',
        role: 'Scales heavy-tailed features without outlier compression'
      }
    ],
    playWithItPrompt:
      'Open Tab 9.3 ("Scaling"), select "Min-Max [0, 1]", and drag the "Penthouse Rent Outlier (x₇)" slider up to ₹250k. Watch how the first 6 normal rooms get squashed into [0.00, 0.08]! Now click "Robust (IQR)" and see how the normal rooms immediately spread back out cleanly.',
    analogyBreaks:
      'Rescaling exam marks and rupees makes gradient descent and distance-based models (KNN, SVM, Neural Nets) vastly happier, but tree-based models (Decision Trees, Random Forests, XGBoost) only split on rank thresholds (x > c)—so monotone feature scaling does not change a tree\'s splits at all!',
    intuition: [
      'For outlier detection, using a Z-score rule |x - μ| / σ > 3 often fails on small or skewed samples because a single huge outlier inflates σ in the denominator ("masking" its own Z-score!). Tukey\'s IQR fences [Q₁ - 1.5·IQR, Q₃ + 1.5·IQR] rely on quartiles that a single extreme typo cannot corrupt, and Winsorization clips values at [L, U] without throwing away the row.',
      'In a linear or neural layer z = w₁x₁ + w₂x₂ + b, the gradient ∂L/∂w_j is proportional to x_j. If x₁ ∈ [0, 1] and x₂ ∈ [0, 100000], the loss surface is an elongated ravine where gradient descent zig-zags violently.',
      'Z-Score Standardization (StandardScaler) centers each feature at 0 and divides by σ_train. Min-Max Scaling maps the training range [x_min,train, x_max,train] to [0, 1]—important note: Min-Max gives [0, 1] ONLY on training data! If an unseen test sample is smaller than x_min,train or larger than x_max,train, its Min-Max scaled value will be < 0 or > 1.',
      'When genuine outliers must be kept, RobustScaler ((x - median)/IQR) or Log1p compression ln(1 + x) prevents outliers from squashing normal data points into a tiny band.'
    ],
    mathFormulas: [
      {
        name: 'Tukey IQR Outlier Fences & Winsorization',
        latex: 'L = Q_1 - 1.5\\,\\text{IQR}, \\quad U = Q_3 + 1.5\\,\\text{IQR}, \\quad x_{\\text{clip}} = \\min(\\max(x, L), U)',
        explanation: 'Flags observations outside [L, U] using training quartiles and optionally clips (Winsorizes) extreme tails.'
      },
      {
        name: 'Z-Score Standardization & Min-Max Normalization',
        latex: '\\tilde{x}_{\\text{z}} = \\frac{x - \\mu_{\\text{train}}}{\\sigma_{\\text{train}}}, \\qquad \\tilde{x}_{\\text{mm}} = \\frac{x - x_{\\min,\\text{train}}}{x_{\\max,\\text{train}} - x_{\\min,\\text{train}}}',
        explanation: 'StandardScaler gives zero mean and unit variance on train; Min-Max gives [0, 1] on train (test values outside [x_min,train, x_max,train] map outside [0, 1]).'
      },
      {
        name: 'Robust Quartile Scaling & Log1p Compression',
        latex: '\\tilde{x}_{\\text{rob}} = \\frac{x - Q_2(x_{\\text{train}})}{\\text{IQR}(x_{\\text{train}})}, \\qquad \\tilde{x}_{\\log} = \\ln(1 + x)',
        explanation: 'RobustScaler scales by the Interquartile Range; log1p(x) compresses heavy right tails while safely mapping x = 0 to 0.'
      }
    ],
    workedExample: {
      scenario: 'Detecting outliers and comparing Min-Max vs RobustScaler on rents [10, 14, 18, 22, 26, 30, 150] (in ₹k).',
      steps: [
        {
          label: 'Step 1: Compute Tukey IQR Upper Fence (k = 1.5)',
          math: 'Q_1 = 16, \\; Q_2 = 22, \\; Q_3 = 28 \\implies \\text{IQR} = 12 \\implies U = 28 + 1.5(12) = 46',
          note: 'The ₹150k penthouse exceeds U = ₹46k and is immediately flagged as an outlier.'
        },
        {
          label: 'Step 2: Min-Max scaling of a ₹22k room (and a new ₹180k test room)',
          math: '\\tilde{x}_{\\text{mm}}(22) = \\frac{22 - 10}{150 - 10} = 0.0857, \\quad \\tilde{x}_{\\text{mm}}(180) = \\frac{180 - 10}{140} = 1.214 > 1',
          note: 'The ₹150k outlier crushes normal rooms into [0, 0.14], and an unseen ₹180k test room lands at 1.214 (outside [0, 1]!).'
        },
        {
          label: 'Step 3: RobustScaler of the ₹22k and ₹30k rooms',
          math: '\\tilde{x}_{\\text{robust}}(30) = \\frac{30 - 22}{12} = +0.667',
          note: 'Normal rooms span [-1.0, +0.67] with full resolution.'
        }
      ],
      result: 'Tukey fences flag 150 > 46, and RobustScaler preserves full separation among normal observations without outlier compression.',
      params: {}
    },
    quiz: [
      {
        id: 'scale-q1',
        question: 'Why does Tukey\'s IQR fence (Q₃ + 1.5·IQR) catch a single huge typo in a 10-row sample more reliably than a Z-score threshold (|z| > 3)?',
        options: [
          'Because IQR fences require training a deep neural network before inspecting the column.',
          'Because Z-scores can only be computed when every value in the column is a whole integer.',
          'Because a huge typo inflates the sample standard deviation σ and masks its own Z-score.',
          'Because the sample standard deviation σ automatically becomes zero whenever an outlier is present.'
        ],
        correctIndex: 2,
        explanation: 'In small samples, a single extreme outlier explodes σ in the denominator of (x - μ)/σ, capping the Z-score ("masking"). Quartiles are order statistics and remain uncorrupted.'
      },
      {
        id: 'scale-q2',
        question: 'Which family of models is completely invariant to monotone feature scaling (like Z-Score or Min-Max) and why?',
        options: [
          'Multi-Layer Perceptrons trained with SGD, because weights automatically invert any scale on step 1.',
          'Decision Trees and Random Forests, because rank-order split thresholds are scale-invariant.',
          'K-Nearest Neighbors (KNN), because Euclidean distance ignores the numeric magnitude of coordinates.',
          'Ridge and Lasso Regression, because L2 and L1 weight penalties are scale-invariant.'
        ],
        correctIndex: 1,
        explanation: 'Affine rescaling preserves order: if x_i ≤ t, then (x_i - μ)/σ ≤ (t - μ)/σ, yielding the exact same tree split and Gini impurity reduction.'
      }
    ],
    summary: [
      'Tukey IQR fences [Q₁ - 1.5·IQR, Q₃ + 1.5·IQR] detect outliers without suffering from Z-score standard-deviation masking.',
      'StandardScaler (Z-score) is the default for neural nets and linear models on clean distributions.',
      'Min-Max scaling maps training data to [0, 1], though unseen test values outside the training range can fall outside [0, 1].',
      'RobustScaler uses Median and IQR so extreme outliers cannot squash normal data points; Decision Trees and Random Forests do not require scaling.'
    ],
    cheatSheet: {
      title: '9.3 Outliers & Feature Scaling Cheat Sheet',
      rules: [
        'Linear models, SVMs, KNN, k-Means, PCA, and Neural Nets require scaling; Tree models (RF, XGBoost) do not.',
        'StandardScaler for clean features; RobustScaler (Median/IQR) or log1p when outliers exist.',
        'Min-Max gives [0, 1] only on training data; unseen test values outside [x_min,train, x_max,train] fall outside [0, 1].'
      ],
      pitfalls: [
        'Using |Z| > 3 on small/skewed samples—an extreme outlier inflates σ and masks its own Z-score.',
        'Forgetting to clip or use RobustScaler before Min-Max when a single outlier crushes normal points into [0, 0.05].'
      ],
      codeSnippet: `RobustScaler()\nStandardScaler()\nnp.clip(x, q1 - 1.5 * iqr, q3 + 1.5 * iqr)`
    }
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.4: ENCODING CATEGORICAL VARIABLES
  // =========================================================================
  'encoding-categorical-features': {
    slug: 'encoding-categorical-features',
    scene: {
      title: 'Turning City Names, Meal Sizes, and 19,000 PIN Codes into Numbers Without Lying',
      narrative:
        'A food-delivery model sees three text columns: T-Shirt/Meal Size ("Small", "Medium", "Large"), Payment Mode ("UPI", "Card", "Cash"), and Delivery PIN Code (19,000 unique codes across India). If you number Payment Modes 1, 2, 3, the model thinks "Card is halfway between UPI and Cash"! One-Hot Encoding gives UPI, Card, and Cash their own fair 0/1 switches. And for 19,000 PIN codes—where 19,000 One-Hot columns would explode—Smoothed Target Encoding summarizes each PIN code by its historical delivery rate, blended safely with the national average when a PIN code only has 1 or 2 orders.'
    },
    mapping: [
      {
        scenePart: 'Natural ranked sizes: Small (0) < Medium (1) < Large (2)',
        modelPart: 'Ordinal Encoding',
        symbol: 'c ∈ {0, 1, ..., K-1}',
        role: 'Preserves meaningful order in a single column'
      },
      {
        scenePart: 'Separate on/off switches for unordered categories (UPI, Card, Cash)',
        modelPart: 'One-Hot Encoding',
        symbol: 'e_k ∈ {0, 1}^K',
        role: 'Prevents false arithmetic ordering between nominal categories'
      },
      {
        scenePart: 'Historical success rate in a PIN code blended with the national average',
        modelPart: 'Smoothed Target Encoding',
        symbol: 'ŷ_c = (n_c ȳ_c + m ȳ_global) / (n_c + m)',
        role: 'Compresses high-cardinality categories into 1 feature without overfitting rare codes'
      },
      {
        scenePart: 'Minimum order count needed before trusting a new PIN code\'s own average',
        modelPart: 'Smoothing Prior Weight',
        symbol: 'm',
        role: 'Shrinks small-sample categories toward the global mean'
      }
    ],
    playWithItPrompt:
      'Switch to Tab 9.4 ("Encoding"). Look at "NewPinCode (n=1)" which had 1 order that happened to succeed (raw target mean = 1.000). Slide the "Skepticism Prior / Smoothing Weight (m)" from 0 to 15 and watch how its encoded value shrinks safely toward the global average!',
    analogyBreaks:
      'A human delivery manager knows two adjacent PIN codes (560001 and 560002) are physically next door in Bengaluru even if 560002 is brand new, whereas Target Encoding treats every PIN code string as an isolated island unless you add geographic latitude/longitude features.',
    intuition: [
      'Machine learning models only understand numbers, so how you translate text categories into numbers determines what geometry the model sees.',
      'Use Ordinal Encoding (0, 1, 2) ONLY when the spacing and order are genuinely meaningful (e.g. Cold < Warm < Hot). Using integers for unordered cities (Delhi=1, Mumbai=2, Chennai=3) forces a linear layer to assume w·Mumbai = 0.5·(w·Delhi + w·Chennai).',
      'Use One-Hot Encoding for low-cardinality nominal categories (K ≤ 15). Each category gets an orthogonal unit vector [1, 0, 0], [0, 1, 0].',
      'For high-cardinality categories (10,000 PIN codes or merchant IDs), One-Hot creates 10,000 sparse columns. Smoothed Out-of-Fold Target Encoding replaces each category with a shrinkage estimate between the category\'s training target average and the global prior, while Binary / Hashing Encoding maps categories into log2(K) bits or fixed hash buckets when memory is tightly capped (trading off interpretability and rare hash collisions).',
      'In deep neural networks with huge vocabularies (user IDs, item IDs), Learned Embeddings map each category index to a dense trainable vector trained via backpropagation. Meanwhile, CatBoost and LightGBM provide native categorical split handling without manual one-hot expansion.'
    ],
    mathFormulas: [
      {
        name: 'One-Hot Orthogonal Representation',
        latex: '\\text{OneHot}(c = k) = [0, \\dots, \\underbrace{1}_{k\\text{-th}}, \\dots, 0] \\in \\{0, 1\\}^K',
        explanation: 'Every pair of distinct categories has Euclidean distance √2 and dot product 0.'
      },
      {
        name: 'Additive Smoothed Target Encoding (Empirical Bayes Shrinkage)',
        latex: '\\hat{y}_c = \\frac{n_c \\bar{y}_c + m \\bar{y}_{\\text{global}}}{n_c + m}',
        explanation: 'When sample count n_c >> m, ŷ_c → ȳ_c. When n_c is tiny (e.g. n_c = 1), ŷ_c stays close to the safe global prior ȳ_global.'
      }
    ],
    workedExample: {
      scenario: 'Computing smoothed target encoding for a rare category with n_c = 2 orders (both positive, ȳ_c = 1.0), global conversion rate ȳ_global = 0.25, and smoothing weight m = 6.',
      steps: [
        {
          label: 'Step 1: Naive unsmoothed target mean',
          math: '\\bar{y}_c = \\frac{2}{2} = 1.000',
          note: 'Overconfident! Only 2 samples were observed.'
        },
        {
          label: 'Step 2: Apply Empirical Bayes smoothing with m = 6',
          math: '\\hat{y}_c = \\frac{2(1.0) + 6(0.25)}{2 + 6} = \\frac{2.0 + 1.5}{8} = \\frac{3.5}{8} = 0.4375',
          note: 'Pulled from 1.000 down to a realistic 0.4375.'
        }
      ],
      result: 'Smoothed target encoding assigns 0.4375 instead of memorizing 1.000.',
      params: {}
    },
    quiz: [
      {
        id: 'enc-q1',
        question: 'What happens if you compute unsmoothed Target Encoding on the entire training set (including each row\'s own target y_i) for a column like Customer_ID where every row is unique (n_c = 1)?',
        options: [
          'Catastrophic target leakage.',
          'The model underfits on the training set.',
          'One-Hot and Target Encoding become identical.',
          'The weights automatically regularize to zero.'
        ],
        correctIndex: 0,
        explanation: 'If n_c = 1 and m = 0 without out-of-fold computation, the feature is a direct copy of the label y_i—the textbook definition of target leakage.'
      },
      {
        id: 'enc-q2',
        question: 'When fitting a linear model with an intercept bias b and One-Hot Encoding a 3-category feature, why do statisticians often drop one column (drop="first") or use L2 regularization?',
        options: [
          'Because dropping a column doubles the number of categories.',
          'Because the 3 one-hot columns sum to [1, 1, ..., 1] for every row.',
          'Because neural networks cannot take binary 0/1 inputs.',
          'Because the third category never occurs in test data.'
        ],
        correctIndex: 1,
        explanation: 'Since Σ_k e_k = 1, the full one-hot matrix plus an intercept column is rank-deficient for unregularized Normal Equations (XᵀX)⁻¹.'
      }
    ],
    summary: [
      'Use Ordinal Encoding only when categories have a true monotonic rank order.',
      'Use One-Hot Encoding for nominal features with modest cardinality (K ≤ 15).',
      'Use Smoothed Out-of-Fold Target Encoding, Binary/Hashing Encoding (under strict memory limits), or Learned Embeddings (for neural nets with abundant data) on high-cardinality categories.',
      'CatBoost and LightGBM support categorical columns natively; always map unseen test categories to the global prior or an <UNK> bucket.'
    ],
    cheatSheet: {
      title: '9.4 Encoding Categorical Features Cheat Sheet',
      rules: [
        'Low cardinality unordered (K ≤ 15): OneHotEncoder(handle_unknown="ignore").',
        'True rank order (Small < Med < Large): OrdinalEncoder(categories=[...]).',
        'High cardinality (PIN codes, IDs): TargetEncoder (out-of-fold + smoothing), Binary/Hashing (tight RAM), or Learned Embeddings (neural nets).',
        'CatBoost / LightGBM: pass categorical columns natively.'
      ],
      pitfalls: [
        'Computing Target Encoding outside cross-validation leaks the label y into X.',
        'Using integer Label Encoding on unordered cities for linear models or MLPs.'
      ],
      codeSnippet: `OneHotEncoder(handle_unknown="ignore", sparse_output=False)\nTargetEncoder(smooth="auto", cv=5)`
    }
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.5: SPLITTING DATA AND PREVENTING DATA LEAKAGE
  // =========================================================================
  'splits-cross-validation-and-leakage': {
    slug: 'splits-cross-validation-and-leakage',
    scene: {
      title: 'Practicing on Tomorrow\'s Actual Final Exam Paper by Mistake',
      narrative:
        'Imagine a coaching class claims a 99% success rate—and then you discover their "mock test" was literally a photocopy of the final exam paper! Of course the students scored 99% on that mock, and of course they panicked when a real unseen exam arrived. In machine learning, Data Leakage is accidentally letting information from the test set (or the future) sneak into your training pipeline—whether by calling scaler.fit_transform(X) before train_test_split, or randomly shuffling time-series stock/weather rows so Tuesday\'s weather predicts Monday\'s!'
    },
    mapping: [
      {
        scenePart: 'Textbook practice problems used to learn',
        modelPart: 'Training Split',
        symbol: 'D_train',
        role: 'The ONLY data allowed to touch .fit() on scalers, imputers, encoders, and weights'
      },
      {
        scenePart: 'Timed mock tests used to pick study strategy',
        modelPart: 'Validation Split / K-Fold CV',
        symbol: 'D_val',
        role: 'Tunes hyperparameters, architectures, and probability thresholds'
      },
      {
        scenePart: 'The sealed final board exam opened once at the end',
        modelPart: 'Held-Out Test Split',
        symbol: 'D_test',
        role: 'Unbiased estimate of real-world generalization—only .transform() and .predict()'
      },
      {
        scenePart: 'Sealing all study notes inside each fold separately',
        modelPart: 'Pipeline + Cross-Validation',
        symbol: 'Pipeline([scaler, model])',
        role: 'Re-fits preprocessing strictly inside the training portion of every CV fold'
      }
    ],
    playWithItPrompt:
      'Open Tab 9.5 ("Leakage Audit"). Drag the "Unseen Exam Spike / Test Outlier Value (x_test)" slider up to 280 and compare the green Zero-Leakage card against the red Leaked Pipeline card to see how fitting before splitting distorts every coordinate!',
    analogyBreaks:
      'Even if you never touch D_test with .fit(), looking at D_test 50 times to pick the best model architecture still leaks 1-2 bits of information through human selection ("adaptive overfitting to the test set")—which is why competitions use a separate private leaderboard.',
    intuition: [
      'The Golden Rule of ML Preprocessing: fit() on X_train ONLY; transform() on X_train, X_val, and X_test.',
      'Why do we need three splits (Train / Validation / Test) instead of two? Because every time you tweak a learning rate, add a layer, or pick a threshold based on validation accuracy, you are fitting hyperparameters to the validation set! The test set must stay locked in a vault until the very end.',
      'For time-series or longitudinal data (stock prices, UPI transactions over months, patient visits), random train_test_split leaks the future into the past! You must use a temporal split (train < T_cutoff ≤ test) or GroupKFold by user_id so the same user\'s records don\'t straddle train and test.'
    ],
    mathFormulas: [
      {
        name: 'Zero-Leakage Transformation Invariant',
        latex: '\\hat{\\theta}_{\\text{prep}} = \\text{fit}(X_{\\text{train}}), \\quad \\tilde{X}_{\\text{test}} = \\text{transform}(X_{\\text{test}};\\, \\hat{\\theta}_{\\text{prep}})',
        explanation: 'All preprocessing statistics (μ, σ, medians, vocabulary, target encodings) are parameters θ_prep learned solely from X_train.'
      },
      {
        name: 'K-Fold Cross-Validation Estimator',
        latex: '\\text{CV}_{K} = \\frac{1}{K}\\sum_{k=1}^{K} \\mathcal{L}\\!\\left(f_{\\text{fit}(D \\setminus D_k)}(D_k)\\right)',
        explanation: 'In fold k, both the preprocessor and model are fit from scratch on the K-1 training folds D \\ D_k and evaluated on held-out fold D_k.'
      }
    ],
    workedExample: {
      scenario: 'Quantifying Z-score distortion when train = [50, 60, 70] and test = [60, 200].',
      steps: [
        {
          label: 'Step 1: Zero-leakage fit on train only',
          math: '\\mu_{\\text{train}} = 60.0, \\quad \\sigma_{\\text{train}} = 8.165 \\implies \\tilde{x}_{\\text{clean}}(60) = 0.000',
          note: 'A test score of 60 maps to 0.000 (right at the training average).'
        },
        {
          label: 'Step 2: Leaked fit on train + test combined',
          math: '\\mu_{\\text{full}} = 88.0, \\quad \\sigma_{\\text{full}} = 56.356 \\implies \\tilde{x}_{\\text{leaked}}(60) = \\frac{60 - 88}{56.356} = -0.497',
          note: 'The future test outlier shifted the mean by +28 points and inflated σ by 7×!'
        }
      ],
      result: 'Pre-split scaling shifted the test point by nearly 0.5 standard deviations using future information.',
      params: {}
    },
    quiz: [
      {
        id: 'leak-q1',
        question: 'A student writes: X_scaled = StandardScaler().fit_transform(X); cross_val_score(model, X_scaled, y, cv=5). Why is this code subtly buggy?',
        options: [
          'Because fit_transform can only be called on held-out test tensors in scikit-learn.',
          'Because cross_val_score requires at least 100 validation folds to estimate variance.',
          'Because StandardScaler randomly deletes 20% of rows when called before splitting.',
          'Fitting StandardScaler before splitting leaks validation fold statistics into training.'
        ],
        correctIndex: 3,
        explanation: 'Passing a Pipeline to cross_val_score guarantees that StandardScaler.fit() is called only on the 4 training folds inside each iteration.'
      },
      {
        id: 'leak-q2',
        question: 'You have 10,000 chest X-rays from 2,000 patients (5 X-rays per patient taken on different days). If you do a random image-level 80/20 split, why will your test accuracy be artificially inflated?',
        options: [
          'Because 2,000 validation images exceed standard GPU batch memory limits.',
          'Because random 80/20 splits are only valid on three-channel RGB images.',
          'Images from the same patient will appear in both train and test splits.',
          'Because random row shuffling inverts grayscale X-ray pixel intensities.'
        ],
        correctIndex: 2,
        explanation: 'Whenever multiple rows belong to the same entity (patient, customer, device), splitting must be grouped by entity ID to prevent entity-memorization leakage.'
      }
    ],
    summary: [
      'Call .fit() on X_train only; call .transform() on X_val and X_test.',
      'Wrap all imputers, encoders, and scalers inside a scikit-learn Pipeline so cross-validation never leaks.',
      'Use temporal splits for time-series data and GroupKFold for multi-record patient/user data.',
      'Never tune hyperparameters or thresholds on the final test split.'
    ],
    cheatSheet: {
      title: '9.5 Splits, Cross-Validation & Leakage Cheat Sheet',
      rules: [
        'Split first, preprocess second: .fit() only on X_train; .transform() on X_val and X_test.',
        'Use StratifiedKFold for classification, GroupKFold when one user/patient has multiple rows, and TimeSeriesSplit for temporal data.',
        'Always wrap preprocessing + estimator inside sklearn.pipeline.Pipeline before calling cross_val_score.'
      ],
      pitfalls: [
        'Fitting StandardScaler, SimpleImputer, or SMOTE before cross_val_score inflates CV metrics and collapses in production.',
        'Randomly splitting multi-visit patient scans puts the same patient in both train and test.'
      ],
      codeSnippet: `pipe = Pipeline([("prep", col_tx), ("clf", LogisticRegression())])\ncross_val_score(pipe, X_train, y_train, cv=StratifiedKFold(5))`
    }
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.6: CLASS IMBALANCE
  // =========================================================================
  'imbalanced-data-and-metrics': {
    slug: 'imbalanced-data-and-metrics',
    scene: {
      title: 'A Lazy Watchman Who Says "All Safe!" Every Night and Is Right 99.9% of the Time',
      narrative:
        'Suppose fraudulent UPI transactions happen on 1 out of every 1,000 payments (0.1%). If you build a "model" that literally prints "NOT FRAUD" for every single payment without even looking at the data, its Accuracy is 99.9%! Yet it catches 0% of actual thefts. When classes are heavily imbalanced, raw accuracy is a trap, unweighted Cross-Entropy ignores the rare class because 99.9% of gradient steps come from normal transactions, and you need Stratified Splits, Balanced Class Weights, or SMOTE synthetic interpolation.'
    },
    mapping: [
      {
        scenePart: 'Making sure both train and test sets have the exact same 0.1% fraud ratio',
        modelPart: 'Stratified Splitting',
        symbol: 'stratify = y',
        role: 'Prevents a random split from putting zero rare positives into validation'
      },
      {
        scenePart: 'Fining the watchman 50× more for missing a thief than for a false alarm',
        modelPart: 'Balanced Class-Weighted Loss',
        symbol: 'w_1 = N / (2 N_pos)',
        role: 'Multiplies the minority-class loss and gradient by the imbalance factor'
      },
      {
        scenePart: 'Creating realistic practice drills halfway between two real fraud cases',
        modelPart: 'SMOTE (Synthetic Minority Over-sampling)',
        symbol: 'x_new = x_i + λ(x_nn - x_i)',
        role: 'Interpolates new minority examples in feature space rather than duplicating exact rows'
      }
    ],
    playWithItPrompt:
      'Open Tab 9.6 ("Class Imbalance"). Slide "Rare Fraud Cases / Minority Count (N_pos)" down to 10 out of 1,000 and compare the Unweighted Fraud Miss Loss against the Balanced Weighted Loss (50× boost!). Then drag the SMOTE Interpolation slider λ to see how synthetic minority points are generated along the line segment between neighbors.',
    analogyBreaks:
      'Drawing a straight line between two fraud cases in SMOTE works well in low-dimensional continuous tables, but in high-dimensional spaces or across non-convex manifolds (like images), the midpoint between two minority points can land right in the middle of the majority class!',
    intuition: [
      'In standard Binary Cross-Entropy L = -(1/N) Σ [y_i ln(p_i) + (1 - y_i) ln(1 - p_i)], if 99% of examples have y_i = 0, then 99% of mini-batch gradient updates push the bias b toward -∞ so p_i → 0.',
      'Cost-Sensitive / Class-Weighted Loss (class_weight="balanced" or pos_weight in PyTorch BCEWithLogitsLoss) scales the positive term by w₁ = N / (2 N_pos) and the negative term by w₀ = N / (2 N_neg). Now the total gradient magnitude from all positive examples equals the total gradient magnitude from all negative examples!',
      'SMOTE (Synthetic Minority Over-sampling Technique) oversamples the minority class by picking a minority point x_i, finding one of its k-nearest minority neighbors x_nn, and generating x_new = x_i + λ(x_nn - x_i) with λ ~ Uniform(0, 1). Crucially, oversampling must ONLY be applied to X_train—never to validation or test!'
    ],
    mathFormulas: [
      {
        name: 'Weighted Binary Cross-Entropy Loss & Gradient',
        latex: '\\mathcal{L}_w = -\\big[ w_1 y \\ln(p) + w_0 (1 - y) \\ln(1 - p) \\big], \\quad \\frac{\\partial \\mathcal{L}_w}{\\partial z} = w_1 y (p - 1) + w_0 (1 - y) p',
        explanation: 'Setting w₁ = N/(2 N_pos) amplifies the restoring gradient when a minority positive example (y=1) is under-predicted.'
      },
      {
        name: 'SMOTE Convex Feature-Space Interpolation',
        latex: 'x_{\\text{new}} = x_i + \\lambda (x_{\\text{nn}} - x_i), \\quad \\lambda \\sim \\mathcal{U}(0, 1)',
        explanation: 'Synthesizes new minority examples along the line segment connecting minority sample x_i to its minority neighbor x_nn.'
      }
    ],
    workedExample: {
      scenario: 'Computing balanced class weights and fraud-miss gradient on N = 1,000 transactions (N_neg = 980, N_pos = 20) when model predicts p = 0.20 on a real fraud (y = 1).',
      steps: [
        {
          label: 'Step 1: Compute Balanced Class Weights',
          math: 'w_1 = \\frac{1000}{2 \\times 20} = 25.0, \\quad w_0 = \\frac{1000}{2 \\times 980} = 0.5102',
          note: 'Each fraud example receives 25× weight.'
        },
        {
          label: 'Step 2: Compare Unweighted vs Weighted Loss on y=1, p=0.20',
          math: '\\mathcal{L}_{\\text{unweighted}} = -\\ln(0.20) = 1.609, \\quad \\mathcal{L}_{\\text{weighted}} = -25 \\ln(0.20) = 40.236',
          note: 'The logit gradient jumps from (0.2 - 1) = -0.80 to 25(-0.80) = -20.0!'
        }
      ],
      result: 'Balanced weighting amplifies the corrective gradient on missed minority positives by 25×.',
      params: {}
    },
    quiz: [
      {
        id: 'imb-q1',
        question: 'What happens if you apply SMOTE oversampling to your full dataset (X, y) BEFORE calling train_test_split?',
        options: [
          'Synthetic points interpolated from test rows leak into training and inflate F1.',
          'The held-out evaluation test set shrinks to half of its original row count.',
          'The balanced loss class weights automatically flip from positive to negative.',
          'SMOTE stratifies the train and test splits cleanly without any data leakage.'
        ],
        correctIndex: 0,
        explanation: 'Oversampling (random or SMOTE) must ONLY happen inside the training split (or via imblearn.pipeline.Pipeline inside each CV fold); validation and test sets must reflect the real-world unmodified distribution.'
      },
      {
        id: 'imb-q2',
        question: 'When evaluating a classifier on a 99%-negative / 1%-positive dataset, why is the Precision-Recall Curve (PR-AUC) much more informative than raw Accuracy?',
        options: [
          'Because Precision completely ignores the number of False Positive alerts.',
          'Because the Area Under the PR Curve is guaranteed to equal 1.0 on any dataset.',
          'Because standard classification Accuracy is undefined on binary 0/1 targets.',
          'Because Precision and Recall focus on minority positives without TN dilution.'
        ],
        correctIndex: 3,
        explanation: 'Accuracy (TP + TN)/N is dominated by TN when negatives are 99% of the data. Precision TP/(TP+FP) and Recall TP/(TP+FN) do not include TN at all.'
      }
    ],
    summary: [
      'Raw accuracy is misleading on imbalanced datasets; track Precision, Recall, F1, and PR-AUC.',
      'Always pass stratify=y when splitting imbalanced classification datasets.',
      'Balanced class weights (w_c = N / (2 N_c)) re-balance gradient magnitudes without duplicating data.',
      'If using oversampling or SMOTE, apply it strictly to X_train inside each training fold—never to validation or test.'
    ],
    cheatSheet: {
      title: '9.6 Imbalanced Data & Metrics Cheat Sheet',
      rules: [
        'Never judge a 99:1 dataset by Accuracy; evaluate Precision, Recall, F1, and PR-AUC.',
        'Start with class_weight="balanced" (w_c = N / (2 * N_c)) and tune the decision threshold on validation probabilities.',
        'If using SMOTE, wrap it in imblearn.pipeline.Pipeline so synthetic points are only created inside training folds.'
      ],
      pitfalls: [
        'Running SMOTE before train_test_split leaks interpolated test points into training.',
        'Tuning probability thresholds on the test set instead of validation folds.'
      ],
      codeSnippet: `LogisticRegression(class_weight="balanced")\naverage_precision_score(y_val, y_prob)  # PR-AUC`
    }
  },

  // =========================================================================
  // TRACK 9 — LESSON 9.7: FEATURE ENGINEERING, SELECTION AND PIPELINES
  // =========================================================================
  'feature-engineering-and-pipelines': {
    slug: 'feature-engineering-and-pipelines',
    scene: {
      title: 'A 24-Hour Clock Where 11:59 PM Is One Minute Before Midnight, Not 23 Hours Away',
      narrative:
        'Suppose you are predicting late-night Zomato/Swiggy delivery surges using the hour of the day t ∈ {0, 1, ..., 23}. If you feed the raw integer t into a linear or neural model, it thinks 23:00 (11 PM) and 00:00 (Midnight) are 23 hours apart at opposite ends of the number line! By wrapping time around a clock face using (sin(2πt/24), cos(2πt/24)), 23:00 and 00:00 sit right next to each other. Combine domain ratios (like EMI-to-income) with a reproducible ColumnTransformer + Pipeline, and your entire recipe runs identically in cross-validation and production.'
    },
    mapping: [
      {
        scenePart: 'Wrapping the 24-hour clock onto a 2D circle',
        modelPart: 'Cyclical Trigonometric Encoding',
        symbol: '(sin(2πt/T), cos(2πt/T))',
        role: 'Makes t = T-1 and t = 0 adjacent in Euclidean space'
      },
      {
        scenePart: 'Monthly loan EMI divided by monthly salary',
        modelPart: 'Domain Interaction Ratio',
        symbol: 'r = x_1 / (x_2 + ε)',
        role: 'Exposes non-linear domain relationships directly to linear layers'
      },
      {
        scenePart: 'Separate prep stations for numbers vs text categories',
        modelPart: 'ColumnTransformer',
        symbol: 'ColumnTransformer([num, cat])',
        role: 'Routes numeric columns to Median+Scaler and categoricals to Encoder'
      },
      {
        scenePart: 'Locked step-by-step kitchen recipe card',
        modelPart: 'End-to-End Pipeline',
        symbol: 'Pipeline([prep, model])',
        role: 'Guarantees zero leakage in CV and single-call .predict() in production'
      }
    ],
    playWithItPrompt:
      'Open Tab 9.7 ("Pipelines"). Drag the "Order Timestamp / Hour of Day (t)" slider to 23:00 and compare the Raw Hour Gap (23 hrs!) against the Circle Distance to 00:00 (0.261)—then slide to 01:00 and verify that 23:00 and 01:00 are equidistant from Midnight!',
    analogyBreaks:
      'A kitchen recipe never changes once printed, whereas real production data drifts over months (inflation shifts salaries, new PIN codes appear)—so even a leak-free Pipeline must be monitored and periodically re-fitted.',
    intuition: [
      'Raw columns are rarely in the coordinates that make learning easiest. Two numbers (Monthly_EMI and Monthly_Income) are far more predictive when combined into a domain ratio Debt_to_Income = EMI / (Income + ε).',
      'Periodic features—hour of day (T = 24), day of week (T = 7), month (T = 12), or wind direction (T = 360°)—have a wrap-around boundary where T meets 0. Note that you need both sin(2πt/T) and cos(2πt/T): sin alone is not injective because sin(θ) = sin(π - θ) (for example, 3 AM and 9 AM both have sin(45°) = sin(135°) ≈ 0.707 and would collide without cos!).',
      'Finally, wiring every imputation, encoding, and scaling step into a single ColumnTransformer + Pipeline object prevents training-serving skew and eliminates cross-validation leakage.'
    ],
    mathFormulas: [
      {
        name: 'Cyclical Sine-Cosine Embedding',
        latex: 'x_{\\sin} = \\sin\\!\\left(\\frac{2\\pi t}{T}\\right), \\quad x_{\\cos} = \\cos\\!\\left(\\frac{2\\pi t}{T}\\right)',
        explanation: 'Embeds periodic variable t (with period T) onto the unit circle R² so Euclidean distance respects wrap-around adjacency.'
      },
      {
        name: 'Chord Distance on the Unit Circle',
        latex: '\\|(x_{\\sin}(t_1), x_{\\cos}(t_1)) - (x_{\\sin}(t_2), x_{\\cos}(t_2))\\|_2 = 2\\left|\\sin\\!\\left(\\frac{\\pi (t_1 - t_2)}{T}\\right)\\right|',
        explanation: 'Depends solely on the shortest angular difference modulo T.'
      }
    ],
    workedExample: {
      scenario: 'Encoding hour t = 23 (11 PM) and t = 1 (1 AM) with period T = 24 and comparing their distances to Midnight (t = 0).',
      steps: [
        {
          label: 'Step 1: Encode Midnight (t = 0)',
          math: '(\\sin(0), \\cos(0)) = (0.000, 1.000)',
          note: 'Top of the unit circle.'
        },
        {
          label: 'Step 2: Encode 23:00 (t = 23) and 01:00 (t = 1)',
          math: 't=23: (\\sin(345^\\circ), \\cos(345^\\circ)) = (-0.259, 0.966), \\quad t=1: (+0.259, 0.966)',
          note: 'Symmetric across the vertical axis!'
        },
        {
          label: 'Step 3: Euclidean distance to Midnight (0, 1)',
          math: 'd(23, 0) = \\sqrt{(-0.259)^2 + (0.966 - 1)^2} = 0.261 = d(1, 0)',
          note: 'Both 11 PM and 1 AM sit at exact distance 0.261 from Midnight.'
        }
      ],
      result: 'Cyclical encoding makes 23:00 and 01:00 equidistant (0.261) from 00:00.',
      params: {}
    },
    quiz: [
      {
        id: 'pipe-q1',
        question: 'Why must you include BOTH sin(2πt/24) and cos(2πt/24) when encoding the hour of the day, instead of only sin(2πt/24)?',
        options: [
          'Because sin only works for mornings and cos only works for evenings.',
          'Because sin(θ) = sin(π - θ) is symmetric on [0, 2π].',
          'Because neural networks require an even number of inputs.',
          'Because cos(2πt/24) is always equal to 1.'
        ],
        correctIndex: 1,
        explanation: 'A single sinusoid crosses every value in (-1, 1) twice per period. The pair (sin θ, cos θ) is a bijection onto the unit circle S¹.'
      },
      {
        id: 'pipe-q2',
        question: 'What is "training-serving skew" in production ML, and how does serializing a single fitted Pipeline prevent it?',
        options: [
          'Mismatch between training and production preprocessing; a saved Pipeline prevents it.',
          'Hardware latency gap where GPUs run faster during training than in production.',
          'Statistical third-moment skewness γ₁ of the regression target distribution.',
          'Numerical instability that occurs when production inference uses batch size 1.'
        ],
        correctIndex: 0,
        explanation: 'A single serialized Pipeline guarantees that raw production inputs undergo the exact same transformations and fitted parameters as training data.'
      }
    ],
    summary: [
      'Encode periodic variables (hour, day, month, angle) with both sin(2πt/T) and cos(2πt/T).',
      'Construct domain ratios and differences to give linear and shallow layers direct access to interactions.',
      'Use ColumnTransformer + Pipeline to bundle all numeric and categorical preprocessing with the estimator.',
      'Now put all 7 lessons of Track 9 into action in the Track 9 Project: Clean the Messy Dataset!'
    ],
    cheatSheet: {
      title: '9.7 Feature Engineering & Pipelines Cheat Sheet',
      rules: [
        'Encode cyclical features (hour, day, month) using BOTH sin(2πt/T) and cos(2πt/T).',
        'Create domain ratios (EMI / (Income + ε)) to expose non-linear interactions to linear layers.',
        'Serialize the full ColumnTransformer + model Pipeline with joblib so training and serving execute identical steps.'
      ],
      pitfalls: [
        'Using sin(2πt/T) alone causes collisions (e.g. 3 AM and 9 AM both have sin ≈ 0.707).',
        'Re-implementing scaling/imputation manually in production APIs causes training-serving skew.'
      ],
      codeSnippet: `ct = ColumnTransformer([("num", num_pipe, num_cols), ("cat", cat_pipe, cat_cols)])\nfull_pipe = Pipeline([("prep", ct), ("model", model)])`
    }
  },

  // =========================================================================
  // TRACK 5 — LESSON 5.1: EMBEDDINGS AND WORD VECTORS
  // =========================================================================
  'embeddings-and-word-vectors': {
    slug: 'embeddings-and-word-vectors',
    scene: {
      title: 'Google Maps Coordinates for Words: Why "Chai" Sits Right Next to "Coffee"',
      narrative:
        'Computers only understand numbers, not words like "Chai", "Coffee", or "Cricket". If you give each word in a 50,000-word dictionary a One-Hot ID card (a single 1 and 49,999 zeros), "Chai" and "Coffee" have a dot product of 0—the model thinks they have nothing in common! Instead, an Embedding Lookup Table (E) assigns every word a compact GPS coordinate on a map of meaning (say, a 2D [Savory/Spice, Sweetness] coordinate). Now "Masala Chai" and "Filter Coffee" sit in the exact same neighborhood with high cosine alignment, and vector offsets like v(King) - v(Man) + v(Woman) land right on v(Queen)!'
    },
    mapping: [
      {
        scenePart: '50,000-row phonebook of word GPS coordinates',
        modelPart: 'Embedding Lookup Matrix',
        symbol: 'E ∈ R^{|V| × d}',
        role: 'Learnable matrix where row i is the dense d-dimensional vector for token ID i'
      },
      {
        scenePart: 'Word coordinate on [Spice, Sweetness] axes',
        modelPart: 'Dense Word Vector',
        symbol: 'e_w = E[id(w)] ∈ R^d',
        role: 'Continuous representation learned via backpropagation from context'
      },
      {
        scenePart: 'How closely two words point in the same direction',
        modelPart: 'Cosine Similarity',
        symbol: 'cos(θ) = (a · b) / (||a|| ||b||)',
        role: 'Scale-invariant similarity in [-1, +1] measuring semantic alignment'
      },
      {
        scenePart: 'Stepping from "Man" to "Woman" starting at "King"',
        modelPart: 'Linear Analogy Offset',
        symbol: 'v_b - v_a + v_c ≈ v_d',
        role: 'Captures relational transformations as parallel vector displacements'
      }
    ],
    playWithItPrompt:
      'In Tab 5.1 ("Word Vectors"), drag the "Savory / Spice Coordinate (e₁)" and "Sweetness Coordinate (e₂)" sliders to move your query dish vector and watch its live Cosine Similarity to "Biryani" [0.9, 0.1] and "Jalebi" [0.1, 0.95] update!',
    analogyBreaks:
      'Real GPS coordinates only have 2 dimensions (latitude and longitude) that humans can easily name, whereas production LLM embeddings have 768 to 4,096 entangled dimensions where individual axes rarely correspond to a single neat label like "sweetness".',
    intuition: [
      'A one-hot vector of length |V| = 50,000 treats every word as an isolated orthogonal axis: the dot product between any two distinct words is 0, wasting memory and preventing generalization across synonyms.',
      'An Embedding Layer replaces one-hot multiplication with an O(1) row lookup into a learnable matrix E ∈ R^{|V| × d} (typically d ∈ [64, 4096]).',
      'By training on context prediction (Word2Vec Skip-gram or autoregressive next-token prediction), words that appear in similar sentence contexts receive similar gradients and migrate to nearby coordinates.',
      'Semantic similarity is measured via Cosine Similarity rather than raw Euclidean distance so that word frequency (which inflates vector length ||v||) does not distort meaning comparison.'
    ],
    mathFormulas: [
      {
        name: 'Embedding Lookup (One-Hot Equivalence)',
        latex: '\\mathbf{e}_i = \\mathbf{o}_i^\\top \\mathbf{E} = \\mathbf{E}[i, :] \\in \\mathbb{R}^d',
        explanation: 'Multiplying a one-hot row vector o_i by matrix E simply extracts the i-th row of E in O(1) time.'
      },
      {
        name: 'Cosine Similarity',
        latex: '\\text{sim}(\\mathbf{u}, \\mathbf{v}) = \\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{k=1}^d u_k v_k}{\\sqrt{\\sum u_k^2}\\sqrt{\\sum v_k^2}}',
        explanation: 'Normalizes the dot product by both L2 norms, returning +1 for identical directions, 0 for orthogonal vectors, and -1 for opposites.'
      },
      {
        name: 'Analogy Vector Arithmetic',
        latex: '\\hat{\\mathbf{v}}_d = \\mathbf{v}_{\\text{King}} - \\mathbf{v}_{\\text{Man}} + \\mathbf{v}_{\\text{Woman}}, \\quad d^* = \\arg\\max_{w} \\cos(\\hat{\\mathbf{v}}_d, \\mathbf{v}_w)',
        explanation: 'Relational differences (like gender, capital-of, or tense) form consistent displacement vectors in embedding space.'
      }
    ],
    workedExample: {
      scenario: 'Computing the Cosine Similarity between a query snack u = [0.8, 0.6] and "Biryani" v = [0.9, 0.1] in a 2D embedding space.',
      steps: [
        {
          label: 'Step 1: Compute Dot Product u · v',
          math: '\\mathbf{u} \\cdot \\mathbf{v} = (0.8)(0.9) + (0.6)(0.1) = 0.72 + 0.06 = 0.780',
          note: 'Sum of element-wise coordinate products.'
        },
        {
          label: 'Step 2: Compute Euclidean Norms ||u|| and ||v||',
          math: '\\|\\mathbf{u}\\|_2 = \\sqrt{0.8^2 + 0.6^2} = 1.000, \\quad \\|\\mathbf{v}\\|_2 = \\sqrt{0.9^2 + 0.1^2} = \\sqrt{0.82} \\approx 0.9055',
          note: 'Lengths of the two vectors from the origin.'
        },
        {
          label: 'Step 3: Divide Dot Product by Product of Norms',
          math: '\\cos(\\theta) = \\frac{0.780}{1.000 \\times 0.9055} \\approx 0.8614',
          note: 'Strong positive cosine alignment (+0.861).'
        }
      ],
      result: 'Cosine Similarity = +0.8614 (high semantic alignment).',
      params: {}
    },
    quiz: [
      {
        id: 'emb-q1',
        question: 'Why do we measure word similarity using Cosine Similarity (u · v)/(||u|| ||v||) instead of the unnormalized dot product u · v?',
        options: [
          'Because Cosine Similarity avoids performing any coordinate multiplications.',
          'Because raw dot products between word vectors are always negative numbers.',
          'Frequent words receive more gradient updates and grow larger vector norms ||u||.',
          'Because raw one-hot word vectors always have a pairwise cosine similarity of 1.'
        ],
        correctIndex: 2,
        explanation: 'Without L2 normalization, a common word with a huge norm ||u|| = 10 would have a large dot product with almost everything; dividing by ||u|| ||v|| isolates directional alignment.'
      },
      {
        id: 'emb-q2',
        question: 'How many learnable parameters are stored inside an Embedding layer for a vocabulary of |V| = 30,000 tokens with embedding dimension d = 256?',
        options: [
          '256 parameters',
          '30,256 parameters',
          '7,680,000 parameters',
          '0 learnable parameters'
        ],
        correctIndex: 2,
        explanation: 'An embedding lookup table is a dense matrix E ∈ R^{|V| × d}, containing |V| × d = 30,000 × 256 = 7,680,000 trainable weights.'
      }
    ],
    summary: [
      'One-hot vectors are high-dimensional and mutually orthogonal (zero similarity between synonyms).',
      'An Embedding matrix E ∈ R^{|V| × d} maps discrete token IDs to dense continuous vectors in O(1) lookup time.',
      'Cosine similarity measures directional alignment in [-1, +1] invariant to vector norm.',
      'Linear vector arithmetic captures semantic and syntactic analogies.'
    ]
  },

  // =========================================================================
  // TRACK 5 — LESSON 5.2: RECURRENT NEURAL NETWORKS
  // =========================================================================
  'recurrent-neural-networks': {
    slug: 'recurrent-neural-networks',
    scene: {
      title: 'Reading a Cricket Commentary Sentence Word by Word While Updating a Mental Notepad',
      narrative:
        'When you read "The food at the new hostel mess was NOT good", you don\'t judge each word in isolation—you maintain a running mental notepad (Hidden State h_t). As each new word x_t arrives, you blend your previous notepad summary (W_hh · h_{t-1}) with the new word\'s impact (W_xh · x_t) and squash it through tanh to keep the numbers bounded in (-1, +1). Critically, you use the exact same reading rule (shared weights W_xh, W_hh) at word 1, word 2, and word 50!'
    },
    mapping: [
      {
        scenePart: 'The word arriving at time step t',
        modelPart: 'Current Token Input',
        symbol: 'x_t ∈ R^d',
        role: 'Embedding vector of the t-th element in the sequence'
      },
      {
        scenePart: 'Running mental notepad carried from step t-1',
        modelPart: 'Recurrent Hidden State',
        symbol: 'h_t = tanh(W_hh h_{t-1} + W_xh x_t + b_h)',
        role: 'Summarizes all sequence history up to step t'
      },
      {
        scenePart: 'How strongly yesterday\'s note carries over',
        modelPart: 'Recurrent Transition Matrix',
        symbol: 'W_hh ∈ R^{H × H}',
        role: 'Shared weight matrix reused at every single time step'
      },
      {
        scenePart: 'How strongly the new word updates the notepad',
        modelPart: 'Input-to-Hidden Matrix',
        symbol: 'W_xh ∈ R^{H × d}',
        role: 'Projects the incoming token vector into hidden state space'
      }
    ],
    playWithItPrompt:
      'Switch to Tab 5.2 ("Recurrent Step"). Adjust "Memory Carryover / Recurrent Weight (W_hh)" and "New Word Impact / Input Weight (W_xh)" and trace how the hidden memory h_t evolves word-by-word from t = 1 to t = 8!',
    analogyBreaks:
      'A human reader keeps distinct bullet points on their mental notepad for important earlier words, whereas a vanilla RNN overwrites the entire vector h_t at every single time step through matrix multiplication and tanh squashing.',
    intuition: [
      'Standard feed-forward networks and MLPs require a fixed-size input vector and have no concept of temporal order.',
      'A Recurrent Neural Network (RNN) processes sequences of arbitrary length T by maintaining an internal hidden state vector h_t that acts as a lossy summary of past tokens (x_1, x_2, ..., x_t).',
      'Parameter sharing across time—using the exact same matrices W_xh, W_hh, and W_hy at every step t—means the model has the same parameter count whether a review is 5 words or 500 words long.',
      'Depending on the task, RNNs can operate in Many-to-One mode (sentiment classification from the final state h_T), Many-to-Many aligned mode (part-of-speech tagging at every step t), or Many-to-Many encoder-decoder mode (translation).'
    ],
    mathFormulas: [
      {
        name: 'Elman RNN Hidden State Update',
        latex: '\\mathbf{h}_t = \\tanh(\\mathbf{W}_{hh}\\mathbf{h}_{t-1} + \\mathbf{W}_{xh}\\mathbf{x}_t + \\mathbf{b}_h)',
        explanation: 'Combines the previous hidden state h_{t-1} and current input x_t, squashing activations into (-1, +1) via hyperbolic tangent.'
      },
      {
        name: 'Step Output Projection',
        latex: '\\hat{\\mathbf{y}}_t = \\text{Softmax}(\\mathbf{W}_{hy}\\mathbf{h}_t + \\mathbf{b}_y)',
        explanation: 'Projects the hidden state at step t (or final step T) into output class probabilities.'
      }
    ],
    workedExample: {
      scenario: 'Tracing 2 time steps of a scalar RNN with initial memory h_0 = 0, input weight W_xh = 0.5, recurrent weight W_hh = 0.8, bias b_h = 0, on inputs x_1 = 1.0 and x_2 = -0.5.',
      steps: [
        {
          label: 'Step 1: Compute hidden state h_1 at first token (x_1 = 1.0)',
          math: 'z_1 = (0.8)(0) + (0.5)(1.0) = 0.500 \\implies h_1 = \\tanh(0.500) = 0.4621',
          note: 'First word writes +0.4621 into the mental notepad.'
        },
        {
          label: 'Step 2: Compute pre-activation z_2 at second token (x_2 = -0.5)',
          math: 'z_2 = W_{hh}h_1 + W_{xh}x_2 = (0.8)(0.4621) + (0.5)(-0.5) = 0.3697 - 0.2500 = 0.1197',
          note: 'Previous positive memory (+0.3697) partially offsets the negative second token (-0.2500).'
        },
        {
          label: 'Step 3: Apply tanh activation for h_2',
          math: 'h_2 = \\tanh(0.1197) \\approx 0.1191',
          note: 'Updated notepad retains net context of both tokens.'
        }
      ],
      result: 'h_1 = 0.4621, h_2 = 0.1191.',
      params: {}
    },
    quiz: [
      {
        id: 'rnn-q1',
        question: 'Why does an RNN use the exact same weight matrices (W_xh, W_hh) at every time step t = 1, 2, ..., T instead of having a separate matrix for each word position?',
        options: [
          'Because GPU memory cannot store separate weight matrices for different time steps.',
          'Weight sharing generalizes across sequence lengths and positions with fixed parameters.',
          'Because the recurrent matrix W_hh is constrained to remain the identity matrix.',
          'To force the recurrent hidden state trajectory to remain strictly linear over time.'
        ],
        correctIndex: 1,
        explanation: 'Just as CNNs share weights across 2D space for translation equivariance, RNNs share weights across time steps for temporal invariance and variable-length generalization.'
      },
      {
        id: 'rnn-q2',
        question: 'Why is tanh(z) historically preferred over unbounded linear activation z inside a vanilla RNN recurrence h_t = φ(W_hh h_{t-1} + W_xh x_t)?',
        options: [
          'Because unbounded linear activations cannot be multiplied by weight matrices.',
          'Because the hyperbolic tangent has a constant derivative of 1.0 everywhere.',
          'Because the hyperbolic tangent outputs only non-negative integer activations.',
          'Repeated multiplication by W_hh across steps can blow up unbounded states.'
        ],
        correctIndex: 3,
        explanation: 'Squashing h_t into (-1, +1) prevents forward activations from exploding to ±∞ over long sequences.'
      }
    ],
    summary: [
      'Recurrent Neural Networks process sequences step-by-step via h_t = tanh(W_hh h_{t-1} + W_xh x_t + b_h).',
      'Sharing W_xh and W_hh across all time steps allows generalization to arbitrary sequence lengths.',
      'The hidden state h_t acts as a compressed memory of all preceding tokens x_1 ... x_t.'
    ]
  },

  // =========================================================================
  // TRACK 5 — LESSON 5.3: BPTT AND VANISHING GRADIENTS
  // =========================================================================
  'bptt-and-vanishing-gradients': {
    slug: 'bptt-and-vanishing-gradients',
    scene: {
      title: 'Chinese Whispers Down a Long Line of Students: Why Early Words Are Forgotten',
      narrative:
        'Imagine 20 students standing in a row playing Chinese Whispers (Backpropagation Through Time). Student 20 hears the final exam score error and whispers blame back to Student 19, who multiplies it by their local sensitivity (W_hh · (1 - h_t²)) and whispers it to Student 18. If each student speaks at 60% volume (0.6), by the time the whisper reaches Student 1 at the start of the sentence, its volume is 0.6¹⁹ = 0.00006—completely inaudible (Vanishing Gradients)! And if each student shouts at 150% volume (1.5), by Student 1 it\'s a deafening roar (1.5¹⁹ = 2,216, Exploding Gradients)!'
    },
    mapping: [
      {
        scenePart: 'Unrolling the whisper line from Student T back to Student 1',
        modelPart: 'Backpropagation Through Time (BPTT)',
        symbol: '∂L/∂W_hh = Σ_{t=1}^T ∂L_T/∂W_hh^{(t)}',
        role: 'Unrolls the recurrent loop into a deep feed-forward chain and sums gradients across steps'
      },
      {
        scenePart: 'Volume multiplier at a single student step k',
        modelPart: 'Single-step Temporal Jacobian',
        symbol: '∂h_k / ∂h_{k-1} = diag(1 - h_k²) · W_hh',
        role: 'Local chain-rule Jacobian combining tanh derivative and recurrent weight matrix'
      },
      {
        scenePart: 'Total whisper decay from step T back to step t',
        modelPart: 'Product of Jacobians',
        symbol: '∂h_T / ∂h_t = Π_{k=t+1}^T ∂h_k / ∂h_{k-1}',
        role: 'Decays exponentially to 0 if factor < 1; explodes if factor > 1'
      },
      {
        scenePart: 'Audio limiter capping a sudden deafening shout',
        modelPart: 'Gradient Norm Clipping',
        symbol: 'g ← g · (c / ||g||) if ||g|| > c',
        role: 'Rescales exploding gradient vectors to maximum norm c without changing direction'
      }
    ],
    playWithItPrompt:
      'Open Tab 5.3 ("BPTT Gradients"). First set "Memory Carryover / Recurrent Weight (W_hh)" to 0.50 and look at the "BPTT Signal ∂h_T/∂h_t" column at t=1 (it vanishes to ~10⁻⁴!). Then drag W_hh up to 1.60 to watch the gradient explode—showing why vanilla RNNs struggle with long-range dependencies.',
    analogyBreaks:
      'In human Chinese Whispers, people distort the words into funny new sentences, whereas in BPTT the gradient signal is a precise mathematical vector whose magnitude either shrinks exponentially toward 0.0000 or overflows to NaN.',
    intuition: [
      'Because the same matrix W_hh is applied at every time step during the forward pass (h_k = tanh(W_hh h_{k-1} + W_xh x_k + b_h)), the single-step Jacobian is ∂h_k / ∂h_{k-1} = diag(1 - h_k²) · W_hh.',
      'Across (T - t) steps, the temporal Jacobian ∂h_T / ∂h_t is the product of (T - t) matrices diag(1 - h_k²) · W_hh. Just like raising a scalar r to the power (T - t), if the largest singular value (spectral radius) is < 1, the product shrinks exponentially toward zero (Vanishing Gradients).',
      'Because tanh\'(z) = 1 - tanh²(z) ≤ 1 everywhere (and approaches 0 whenever activations saturate near ±1), vanilla RNN gradients almost always vanish over 15–30 steps—meaning early tokens in a paragraph receive near-zero gradient updates!',
      'Conversely, if W_hh has eigenvalues > 1, gradients can explode to infinity, destabilizing weights in a single step. Exploding gradients are cured easily with Gradient Norm Clipping, whereas vanishing gradients require architectural change (LSTMs, GRUs, or Self-Attention).'
    ],
    mathFormulas: [
      {
        name: 'Temporal Chain Rule Product (BPTT)',
        latex: '\\frac{\\partial \\mathbf{h}_T}{\\partial \\mathbf{h}_t} = \\prod_{k=t+1}^{T} \\frac{\\partial \\mathbf{h}_k}{\\partial \\mathbf{h}_{k-1}} = \\prod_{k=t+1}^{T} \\text{diag}(1 - \\mathbf{h}_k^2)\\,\\mathbf{W}_{hh}',
        explanation: 'Each single-step Jacobian is ∂h_k/∂h_{k-1} = diag(1 - h_k²) · W_hh; transporting sensitivity across (T - t) steps multiplies these (T - t) Jacobians together.'
      },
      {
        name: 'Global Gradient Norm Clipping',
        latex: '\\tilde{\\mathbf{g}} = \\begin{cases} \\mathbf{g} & \\text{if } \\|\\mathbf{g}\\|_2 \\le c \\\\ \\frac{c}{\\|\\mathbf{g}\\|_2}\\,\\mathbf{g} & \\text{if } \\|\\mathbf{g}\\|_2 > c \\end{cases}',
        explanation: 'Caps the L2 norm of the parameter gradient vector at threshold c while preserving its exact unit direction.'
      }
    ],
    workedExample: {
      scenario: 'Propagating an error gradient backward across 5 steps in a scalar RNN where each step has local derivative ∂h_k/∂h_{k-1} = 0.5, vs an exploding case where ∂h_k/∂h_{k-1} = 1.6.',
      steps: [
        {
          label: 'Step 1: Vanishing case (local factor = 0.5 across 5 steps)',
          math: '\\frac{\\partial h_6}{\\partial h_1} = (0.5)^5 = 0.03125',
          note: 'Over 20 steps, (0.5)²⁰ = 0.00000095 — early tokens stop learning!'
        },
        {
          label: 'Step 2: Exploding case (local factor = 1.6 across 5 steps)',
          math: '\\frac{\\partial h_6}{\\partial h_1} = (1.6)^5 = 10.4858',
          note: 'Over 20 steps, (1.6)²⁰ = 12,089.26 — causes catastrophic weight overflow!'
        },
        {
          label: 'Step 3: Apply Gradient Clipping with threshold c = 2.0 to gradient g = [6.0, 8.0]',
          math: '\\|\\mathbf{g}\\|_2 = \\sqrt{6^2 + 8^2} = 10.0 > 2.0 \\implies \\tilde{\\mathbf{g}} = \\frac{2.0}{10.0}[6.0, 8.0] = [1.2, 1.6]',
          note: 'Clipped vector has exact norm √(1.2² + 1.6²) = 2.0 and points in the same direction.'
        }
      ],
      result: 'Vanishing gradients require gated highways (LSTM/GRU); exploding gradients are stabilized via norm clipping.',
      params: {}
    },
    quiz: [
      {
        id: 'bptt-q1',
        question: 'When training an RNN, your loss suddenly jumps to NaN on batch 42 because the gradient norm spiked to 10⁵. What is the standard, lightweight fix for exploding gradients?',
        options: [
          'Gradient Norm Clipping.',
          'Set the learning rate to 100.',
          'Remove all activation functions.',
          'Initialize all weights to zero.'
        ],
        correctIndex: 0,
        explanation: 'Gradient norm clipping directly caps the step size when trajectory encounters a steep cliff wall in the recurrent loss surface.'
      },
      {
        id: 'bptt-q2',
        question: 'Why does Gradient Clipping NOT solve the Vanishing Gradient problem?',
        options: [
          'Because gradient norm clipping resets all parameter gradients to exact zero.',
          'Vanishing gradients already have tiny norms below threshold c and stay decayed.',
          'Because vanishing gradients only occur in single-layer linear regression models.',
          'Because the hyperbolic tangent derivative is strictly greater than 10 everywhere.'
        ],
        correctIndex: 1,
        explanation: 'Total parameter gradient ∂L/∂W_hh sums short-term and long-term contributions. When long-term terms vanish, ∂L/∂W_hh is dominated by the last 2–3 words regardless of global scaling.'
      }
    ],
    summary: [
      'BPTT unrolls the recurrent network across time and accumulates gradients over all steps.',
      'Repeated multiplication by the step Jacobian diag(1 - h_k²) · W_hh causes long-range gradients to vanish (when < 1) or explode (when > 1).',
      'Gradient Norm Clipping cures exploding gradients; additive gated memory (LSTM/GRU) cures vanishing gradients.'
    ]
  },

  // =========================================================================
  // TRACK 5 — LESSON 5.4: LSTM (LONG SHORT-TERM MEMORY)
  // =========================================================================
  'lstm-networks': {
    slug: 'lstm-networks',
    scene: {
      title: 'A Locker Whiteboard with Erase (Forget), Write (Input), and Peek (Output) Buttons',
      narrative:
        'Why did the vanilla RNN forget the start of a long sentence? Because it mashed its entire notepad through matrix multiplication and tanh at every single word! An LSTM adds a separate protected conveyor belt—the Cell State (C_t)—guarded by three smart gates in (0, 1): (1) the Forget Gate (f_t) decides how much of the old whiteboard to keep (set f_t = 1 to carry a memory untouched for 100 words!), (2) the Input Gate (i_t) decides how much of today\'s new note (C̃_t) to ADD onto the board, and (3) the Output Gate (o_t) decides what part of the board to show right now as h_t.'
    },
    mapping: [
      {
        scenePart: 'Protected whiteboard conveyor belt running across time',
        modelPart: 'Cell State Highway',
        symbol: 'C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t',
        role: 'Additive long-term memory track where ∂C_t/∂C_{t-1} = f_t'
      },
      {
        scenePart: 'Erase / Keep dial (0 = wipe clean, 1 = keep 100%)',
        modelPart: 'Forget Gate',
        symbol: 'f_t = σ(W_f [h_{t-1}, x_t] + b_f)',
        role: 'Controls fraction of previous cell memory C_{t-1} retained (added by Gers et al., 2000)'
      },
      {
        scenePart: 'Write button controlling how much new note is added',
        modelPart: 'Input Gate & Candidate',
        symbol: 'i_t = σ(z_i), C̃_t = tanh(z_C)',
        role: 'Selectively writes new information i_t ⊙ C̃_t onto the cell state'
      },
      {
        scenePart: 'Peek curtain deciding what to read out at step t',
        modelPart: 'Output Gate',
        symbol: 'h_t = o_t ⊙ tanh(C_t)',
        role: 'Filters long-term cell memory into the step\'s working hidden state h_t'
      }
    ],
    playWithItPrompt:
      'Open Tab 5.4 ("LSTM Gates"). Drag "Keep Old Whiteboard / Forget Logit (z_f)" up to +4.0 and notice that f_t ≈ 0.982—meaning the highway gradient ∂C_t / ∂C_{t-1} is 0.982! Then drag z_f down to -4.0 to see the LSTM intentionally wipe its whiteboard clean (f_t ≈ 0.018) when a topic finishes.',
    analogyBreaks:
      'A physical whiteboard has fixed square inches that fill up when you write too much, whereas an LSTM cell vector C_t ∈ R^H adds numbers coordinate-wise and uses continuous sigmoid gates rather than discrete on/off switches.',
    intuition: [
      'Hochreiter & Schmidhuber (1997) originally designed the Long Short-Term Memory (LSTM) around a Constant Error Carousel (C_t = C_{t-1} + i_t ⊙ C̃_t) with input and output gates, and Gers, Schmidhuber, & Cummins (2000) added the crucial Forget Gate (f_t) so the cell can also reset obsolete memories: C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t.',
      'Notice the structural parallel to ResNet skip connections! In a vanilla RNN, h_t overwrites h_{t-1} multiplicatively inside tanh. In an LSTM, new information i_t ⊙ C̃_t is added to f_t ⊙ C_{t-1}.',
      'Consequently, the direct backward derivative along the cell conveyor belt is ∂C_t / ∂C_{t-1} = f_t. Whenever the network learns to set the forget gate f_t ≈ 1 for an important token (like the word "NOT" at the start of a movie review), gradients travel backward across dozens of steps virtually unattenuated!',
      'Why do gates use Sigmoid σ(z) ∈ (0, 1) while candidate values use tanh(z) ∈ (-1, +1)? Because a gate acts as a valve percentage (between 0% closed and 100% open), whereas content updates need to be able to both increase (+) and decrease (-) cell state values.'
    ],
    mathFormulas: [
      {
        name: 'Forget, Input, and Output Sigmoid Gates',
        latex: '\\mathbf{f}_t = \\sigma(\\mathbf{z}_f), \\quad \\mathbf{i}_t = \\sigma(\\mathbf{z}_i), \\quad \\mathbf{o}_t = \\sigma(\\mathbf{z}_o) \\in (0, 1)^H',
        explanation: 'Each gate applies a logistic sigmoid to a linear projection of [h_{t-1}, x_t] to output a retention/writing mask in (0, 1).'
      },
      {
        name: 'Additive Cell State & Hidden State Update',
        latex: '\\mathbf{C}_t = \\mathbf{f}_t \\odot \\mathbf{C}_{t-1} + \\mathbf{i}_t \\odot \\tanh(\\mathbf{z}_C), \\quad \\mathbf{h}_t = \\mathbf{o}_t \\odot \\tanh(\\mathbf{C}_t)',
        explanation: 'Cell state updates additively via element-wise Hadamard products (⊙), preserving an unblocked gradient highway ∂C_t/∂C_{t-1} = f_t.'
      }
    ],
    workedExample: {
      scenario: 'Computing one scalar LSTM cell step with previous cell memory C_{t-1} = 1.50, forget gate f_t = 0.90, input gate i_t = 0.50, candidate C̃_t = 0.80, and output gate o_t = 0.70.',
      steps: [
        {
          label: 'Step 1: Retain previous cell memory via Forget Gate',
          math: 'f_t \\cdot C_{t-1} = 0.90 \\times 1.50 = 1.350',
          note: '90% of previous cell state survives on the conveyor belt.'
        },
        {
          label: 'Step 2: Add gated new candidate via Input Gate',
          math: 'C_t = 1.350 + i_t \\cdot \\tilde{C}_t = 1.350 + (0.50 \\times 0.80) = 1.750',
          note: 'Additive update produces new cell state C_t = 1.750.'
        },
        {
          label: 'Step 3: Compute exposed working hidden state h_t',
          math: 'h_t = o_t \\cdot \\tanh(C_t) = 0.70 \\times \\tanh(1.750) = 0.70 \\times 0.9414 = 0.6590',
          note: 'Highway derivative ∂C_t / ∂C_{t-1} = f_t = 0.900.'
        }
      ],
      result: 'C_t = 1.750, h_t = 0.6590, highway gradient ∂C_t/∂C_{t-1} = 0.900.',
      params: {}
    },
    quiz: [
      {
        id: 'lstm-q1',
        question: 'What is the fundamental mathematical reason an LSTM can propagate gradients across 100 time steps much better than a vanilla RNN?',
        options: [
          'The sigmoid forget gate f_t is permanently fixed at a constant value of 2.0.',
          'LSTM networks train via random search rather than backpropagation through time.',
          'An LSTM layer contains four times fewer trainable parameters than a vanilla RNN.',
          'The cell state C_t updates additively so gradients flow along an unblocked highway.'
        ],
        correctIndex: 3,
        explanation: 'Just like ResNet\'s H(x) = F(x) + x creates an additive spatial highway, the LSTM cell state creates an additive temporal highway controlled by f_t.'
      },
      {
        id: 'lstm-q2',
        question: 'If an input projection size is d and the hidden state size is H, how many times more weight parameters does an LSTM layer have compared to a vanilla RNN layer of the same dimensions?',
        options: [
          '10× as many parameters.',
          'The exact same number of parameters (1×).',
          '4× as many parameters.',
          'Half as many parameters (0.5×).'
        ],
        correctIndex: 2,
        explanation: 'Each of the 3 gates (f, i, o) plus the candidate cell update (C̃) has its own W_x ∈ R^{H×d}, W_h ∈ R^{H×H}, and bias b ∈ R^H, totaling 4(Hd + H² + H) parameters.'
      }
    ],
    summary: [
      'LSTMs introduce a dedicated Cell State conveyor belt C_t alongside the working hidden state h_t.',
      'Three sigmoid gates (Forget f_t, Input i_t, Output o_t) regulate information flow in (0, 1).',
      'Additive updates C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t prevent vanishing gradients when f_t ≈ 1.',
      'An LSTM layer contains 4× the parameters of an equivalent vanilla RNN layer.'
    ]
  },

  // =========================================================================
  // TRACK 5 — LESSON 5.5: GRU AND SEQ2SEQ
  // =========================================================================
  'gru-and-seq2seq': {
    slug: 'gru-and-seq2seq',
    scene: {
      title: 'A Bilingual Interpreter Who Listens First, Then Glances Back at Key Source Words While Speaking',
      narrative:
        'First, can we simplify the 4-gate LSTM? Cho et al. (2014) created the Gated Recurrent Unit (GRU): it merges the cell and hidden states into a single vector h_t, uses a Reset Gate r_t to decide how much past state h_{t-1} enters the new candidate h̃_t, and links erasing and writing with a single Update dial z_t: h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t (25% fewer parameters!). Second, how do we translate Hindi ("Main chai piyunga") to English ("I will drink tea") where word orders and lengths differ? A Seq2Seq Encoder reads the Hindi words, and as the Decoder speaks each English word, Cross-Attention lets it glance back at all Encoder states to focus on the exact Hindi word it is translating right now!'
    },
    mapping: [
      {
        scenePart: 'Filter deciding how much past context feeds into today\'s new draft note',
        modelPart: 'GRU Reset Gate & Candidate',
        symbol: 'r_t = σ(W_r[h_{t-1}, x_t]), h̃_t = tanh(W_h x_t + U_h(r_t ⊙ h_{t-1}))',
        role: 'Allows the candidate state h̃_t to ignore irrelevant prior history when r_t ≈ 0'
      },
      {
        scenePart: 'Single linked dial balancing old memory (1 - z_t) vs new note (z_t)',
        modelPart: 'GRU Coupled Update Gate',
        symbol: 'h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t',
        role: 'Replaces separate Forget and Input gates with a convex interpolation (note: PyTorch swaps z_t and 1 - z_t)'
      },
      {
        scenePart: 'Interpreter listening to the full Hindi sentence and speaking English word by word',
        modelPart: 'Seq2Seq Encoder–Decoder',
        symbol: '(h_1, ..., h_S) → s_t = Decoder(s_{t-1}, y_{t-1}, c_t)',
        role: 'Maps variable-length input sequence to variable-length output sequence'
      },
      {
        scenePart: 'Glancing back at specific source words while translating step t',
        modelPart: 'Luong / Bahdanau Attention Context',
        symbol: 'c_t = Σ_i α_{ti} h_i',
        role: 'Eliminates the single-vector bottleneck by dynamically weighting all source encoder states'
      }
    ],
    playWithItPrompt:
      'Open Tab 5.5 ("GRU & Seq2Seq"). Drag the "GRU Update Dial / Gate Logit (z_t)" slider to see how (1 - z_t) and z_t always sum to 100%! Then drag "Translator Focus / Decoder State (s_t)" from 0.0 to 1.0 to watch the Seq2Seq Cross-Attention weights shift across "Main", "Chai", and "Piyunga".',
    analogyBreaks:
      'A human interpreter understands cultural idioms and world knowledge from decades of life experience, whereas a Seq2Seq model only maps statistical patterns learned from parallel sentence pairs and can hallucinate fluent-sounding nonsense on out-of-domain text.',
    intuition: [
      'The Gated Recurrent Unit (GRU, Cho et al. 2014) streamlines the LSTM: it eliminates the separate cell state C_t and uses two gates—the Reset Gate r_t (which gates how much of h_{t-1} enters the candidate h̃_t = tanh(W_h x_t + U_h(r_t ⊙ h_{t-1}) + b_h)) and the Update Gate z_t (which couples forgetting and writing via h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t). Note that PyTorch\'s torch.nn.GRU implementation swaps the roles of z_t and (1 - z_t), writing h_t = (1 - z_t) ⊙ n_t + z_t ⊙ h_{t-1}. A GRU uses 3(Hd + H² + H) parameters instead of 4(Hd + H² + H) (25% smaller).',
      'For tasks where input and output sequences have different lengths—like Machine Translation, Summarization, or Speech-to-Text—Seq2Seq (Encoder-Decoder) pairs an Encoder RNN with a Decoder RNN.',
      'During training, Seq2Seq uses Teacher Forcing: feeding the ground-truth previous target token y_{t-1} into the decoder at step t (rather than the model\'s own noisy prediction ŷ_{t-1}) so the decoder learns rapidly without compounding early mistakes.',
      'Crucially, cramming an entire 40-word sentence into a single fixed encoder vector h_S creates an information bottleneck. Adding Attention lets the decoder compute a fresh context vector c_t = Σ α_{ti} h_i at every step—either via Bahdanau (2014) additive attention e_{ti} = v^T tanh(W_1 h_i + W_2 s_t) or Luong (2015) dot-product attention e_{ti} = s_t^T h_i, the direct bridge to Track 6 (Transformers)!'
    ],
    mathFormulas: [
      {
        name: 'GRU Reset Gate, Candidate, and Coupled Update (Cho et al. 2014)',
        latex: '\\mathbf{r}_t = \\sigma(\\mathbf{W}_r[\\mathbf{h}_{t-1}, \\mathbf{x}_t]), \\;\\; \\tilde{\\mathbf{h}}_t = \\tanh(\\mathbf{W}_h \\mathbf{x}_t + \\mathbf{U}_h(\\mathbf{r}_t \\odot \\mathbf{h}_{t-1})), \\;\\; \\mathbf{h}_t = (1 - \\mathbf{z}_t) \\odot \\mathbf{h}_{t-1} + \\mathbf{z}_t \\odot \\tilde{\\mathbf{h}}_t',
        explanation: 'Reset gate r_t filters past state inside the candidate h̃_t, and update gate z_t interpolates between h_{t-1} and h̃_t. (Note: PyTorch nn.GRU swaps z_t and 1 - z_t.)'
      },
      {
        name: 'Luong Dot-Product Attention & Context Vector (vs Bahdanau Additive Score)',
        latex: '\\alpha_{ti} = \\frac{\\exp(\\mathbf{s}_t^\\top \\mathbf{h}_i)}{\\sum_{k=1}^S \\exp(\\mathbf{s}_t^\\top \\mathbf{h}_k)}, \\quad \\mathbf{c}_t = \\sum_{i=1}^S \\alpha_{ti}\\,\\mathbf{h}_i',
        explanation: 'In Luong dot-product attention, decoder state s_t scores encoder state h_i via s_t^T h_i (whereas Bahdanau attention uses an additive MLP score v^T tanh(W_1 h_i + W_2 s_t)).'
      }
    ],
    workedExample: {
      scenario: 'Computing a scalar GRU step with h_{t-1} = 1.20, input term w_h x_t = -0.82, recurrent weight u_h = 0.50, reset gate r_t = 0.50, and update gate z_t = 0.60.',
      steps: [
        {
          label: 'Step 1: Apply Reset Gate r_t to compute candidate h̃_t',
          math: '\\tilde{h}_t = \\tanh(w_h x_t + u_h(r_t \\cdot h_{t-1})) = \\tanh(-0.82 + 0.50(0.50 \\times 1.20)) = \\tanh(-0.52) = -0.4777',
          note: 'Reset gate r_t = 0.50 halves the contribution of h_{t-1} inside the candidate nonlinearity.'
        },
        {
          label: 'Step 2: Compute retention weight (1 - z_t)',
          math: '1 - z_t = 1.00 - 0.60 = 0.40',
          note: '40% of old hidden state is preserved; 60% comes from the new candidate h̃_t.'
        },
        {
          label: 'Step 3: Interpolate old state and new candidate',
          math: 'h_t = (1 - z_t)h_{t-1} + z_t\\tilde{h}_t = (0.40)(1.20) + (0.60)(-0.4777) = 0.480 - 0.2866 = 0.1934',
          note: 'Under PyTorch\'s swapped convention (z_t on h_{t-1}), the same weights would correspond to z_t = 0.40.'
        }
      ],
      result: 'Candidate h̃_t = -0.4777 and updated GRU hidden state h_t = 0.1934.',
      params: {}
    },
    quiz: [
      {
        id: 'gru-q1',
        question: 'How does a GRU achieve long-term memory without using a separate Cell State vector C_t or separate Forget and Input gates?',
        options: [
          'It couples forgetting and writing with a single Update Gate z_t on hidden state h_t.',
          'It removes all non-linear activation functions from the recurrent state update.',
          'It expands the recurrence to use 8 independent sigmoid gates at every time step.',
          'It restricts the encoder to processing at most 2 input tokens per sentence.'
        ],
        correctIndex: 0,
        explanation: 'The convex combination (1 - z_t)h_{t-1} + z_t h̃_t creates an additive highway directly on h_t while cutting parameter count by 25%.'
      },
      {
        id: 'gru-q2',
        question: 'What was the core architectural limitation of vanilla Seq2Seq (without Attention) on long 50-word sentences that directly inspired the Attention mechanism?',
        options: [
          'Teacher forcing could not be applied during training without an attention matrix.',
          'Vanilla Seq2Seq decoders could only output continuous scalars rather than tokens.',
          'Vanilla Seq2Seq required source and target sentences to have identical lengths.',
          'Compressing the whole source sentence into one fixed vector h_S lost early words.'
        ],
        correctIndex: 3,
        explanation: 'Allowing the decoder to attend over all encoder states (h_1, ..., h_S) via dynamic weights α_{ti} removed the fixed-vector bottleneck and led directly to the Transformer.'
      }
    ],
    summary: [
      'GRUs merge cell and hidden states and use two gates (Update z_t, Reset r_t), saving 25% parameters vs LSTMs.',
      'Seq2Seq Encoder-Decoder models map variable-length input sequences to variable-length output sequences.',
      'Teacher forcing accelerates training by feeding ground-truth prior tokens into the decoder.',
      'Seq2Seq Cross-Attention overcomes the fixed-vector bottleneck and bridges directly into Track 6 (Attention and Transformers)!'
    ]
  },

  // =========================================================================
  // TRACK 7 — LESSON 7.1: AUTOENCODERS
  // =========================================================================
  'autoencoders': {
    slug: 'autoencoders',
    scene: {
      title: 'Packing a 4-Shelf Hostel Wardrobe into a Tiny 2-Slot Cabin Suitcase',
      narrative:
        'Suppose you are flying home for Diwali with a tiny cabin bag (Bottleneck z ∈ R^d) that only holds 2 summary slots, and when you land you must unpack and recreate your full 4-shelf wardrobe (Reconstruction x̂ ∈ R^D). You can\'t pack random lint or duplicate socks (noise)—the Encoder f_θ(x) is forced to discover the core patterns ("1 ethnic outfit + 1 casual outfit") so the Decoder g_ϕ(z) can reconstruct your wardrobe with minimum Mean Squared Error ||x - x̂||²!'
    },
    mapping: [
      {
        scenePart: 'Full 4-shelf hostel wardrobe before packing',
        modelPart: 'High-dimensional Input Vector',
        symbol: 'x ∈ R^D',
        role: 'Raw data vector (e.g. 784 pixels of an MNIST digit)'
      },
      {
        scenePart: 'Packing strategy squeezing items into the bag',
        modelPart: 'Encoder Network',
        symbol: 'z = f_θ(x) ∈ R^d (d ≪ D)',
        role: 'Maps high-dimensional input onto a low-dimensional latent manifold'
      },
      {
        scenePart: 'Tiny 2-slot cabin suitcase',
        modelPart: 'Latent Bottleneck Code',
        symbol: 'z ∈ R^d',
        role: 'Information bottleneck that forces compression and discards noise'
      },
      {
        scenePart: 'Unpacking at home and checking what went missing',
        modelPart: 'Decoder & Reconstruction Loss',
        symbol: 'L = (1/D) ||x - g_ϕ(z)||₂²',
        role: 'Self-supervised objective requiring zero human labels!'
      }
    ],
    playWithItPrompt:
      'In Tab 7.1 ("Autoencoders"), drag "Suitcase Item 1 / Feature (x₁)" and "Suitcase Item 2 / Feature (x₂)" to see how the 4D input vector is squeezed into a 2D Bottleneck Code z (2:1 compression) and unpacked into x̂ with live MSE loss!',
    analogyBreaks:
      'A physical suitcase can only hold a subset of physical clothes, whereas a non-linear neural autoencoder compresses correlated numbers into abstract continuous coordinates that reconstruct the whole image approximately.',
    intuition: [
      'An Undercomplete Autoencoder is a self-supervised neural network trained to copy its input to its output (x̂ ≈ x), but with a catch: the hidden layer in the middle (z ∈ R^d) is much narrower than the input (d ≪ D).',
      'If the encoder and decoder are purely linear (z = W_enc x, x̂ = W_dec z) and trained with Mean Squared Error, the bottleneck z learns to span the exact same principal subspace as PCA!',
      'Adding non-linear activation functions (like ReLU, GELU, or tanh) in the encoder and decoder enables the autoencoder to curve its coordinate system along non-linear data manifolds.',
      'In a Denoising Autoencoder (DAE), we intentionally corrupt the input (x̃ = x + ε) before feeding it to the encoder, but still demand the clean target x at the decoder output (||x - g(f(x̃))||²), forcing the bottleneck to strip away noise.'
    ],
    mathFormulas: [
      {
        name: 'Encoder-Decoder Bottleneck Mapping',
        latex: '\\mathbf{z} = f_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\phi(\\mathbf{W}_{\\text{enc}}\\mathbf{x} + \\mathbf{b}_{\\text{enc}}) \\in \\mathbb{R}^d, \\quad \\hat{\\mathbf{x}} = g_{\\boldsymbol{\\phi}}(\\mathbf{z}) \\in \\mathbb{R}^D',
        explanation: 'Compresses D-dimensional input into d-dimensional code z (with d < D) and decodes back to R^D.'
      },
      {
        name: 'Reconstruction Mean Squared Error',
        latex: '\\mathcal{L}_{\\text{AE}}(\\mathbf{x}, \\hat{\\mathbf{x}}) = \\frac{1}{D}\\sum_{i=1}^{D} (x_i - \\hat{x}_i)^2, \\quad \\frac{\\partial \\mathcal{L}}{\\partial W_{\\text{dec}, ij}} = \\frac{2}{D}(\\hat{x}_i - x_i)z_j',
        explanation: 'Penalizes pixel-wise squared reconstruction error without requiring external class labels.'
      }
    ],
    workedExample: {
      scenario: 'Compressing a 2D input x = [0.80, 0.40] into a 1D bottleneck z = 0.60 and reconstructing x̂ = [0.72, 0.48].',
      steps: [
        {
          label: 'Step 1: Compute coordinate reconstruction residuals (x̂_i - x_i)',
          math: 'e_1 = 0.72 - 0.80 = -0.08, \\quad e_2 = 0.48 - 0.40 = +0.08',
          note: 'Errors on each reconstructed dimension.'
        },
        {
          label: 'Step 2: Compute Mean Squared Error L_AE',
          math: '\\mathcal{L}_{\\text{AE}} = \\frac{(-0.08)^2 + (0.08)^2}{2} = \\frac{0.0064 + 0.0064}{2} = 0.0064',
          note: 'Average squared reconstruction error across D = 2 features.'
        },
        {
          label: 'Step 3: Compute Decoder Weight Gradient ∂L/∂W_dec[1,1]',
          math: '\\frac{\\partial \\mathcal{L}}{\\partial W_{\\text{dec}, 11}} = \\frac{2}{2}(-0.08)(0.60) = -0.048',
          note: 'Nudges W_dec[1,1] upward to raise x̂_1 closer to 0.80.'
        }
      ],
      result: 'Reconstruction MSE = 0.0064; decoder gradient ∂L/∂W_dec[1,1] = -0.048.',
      params: {}
    },
    quiz: [
      {
        id: 'ae-q1',
        question: 'What happens if you build an autoencoder where the hidden bottleneck dimension d is LARGER than the input dimension D (d ≥ D) without any regularization or noise?',
        options: [
          'The Mean Squared Error reconstruction loss immediately diverges to infinity.',
          'The network can memorize the trivial identity copy without learning features.',
          'The deterministic bottleneck automatically turns into a Variational Autoencoder.',
          'Backpropagation derivatives become undefined whenever latent size d exceeds D.'
        ],
        correctIndex: 1,
        explanation: 'Without a narrow bottleneck (d < D) or denoising/sparsity constraints, an overcomplete autoencoder simply memorizes the identity map I.'
      },
      {
        id: 'ae-q2',
        question: 'Why is a standard deterministic Autoencoder poor at generating brand-new realistic images when you sample a random point z ~ N(0, I) in its bottleneck space?',
        options: [
          'Unregularized latent spaces have empty gaps between clusters that decode poorly.',
          'The decoder network cannot execute a forward pass without the encoder present.',
          'Deterministic bottleneck coordinates are constrained to discrete integer values.',
          'Mean Squared Error reconstruction loss can only be optimized on discrete text.'
        ],
        correctIndex: 0,
        explanation: 'A standard autoencoder only cares that training points reconstruct well; it does not regularize the geometry of the space between training encodings.'
      }
    ],
    summary: [
      'Autoencoders compress inputs x ∈ R^D through a narrow bottleneck z ∈ R^d (d ≪ D) and reconstruct x̂ = g(f(x)).',
      'Linear autoencoders learn the exact same subspace as PCA; non-linear autoencoders learn curved manifolds.',
      'Denoising Autoencoders corrupt the input x̃ and train to reconstruct the clean x.',
      'Deterministic autoencoders leave gaps in latent space, motivating Variational Autoencoders (Lesson 7.2).'
    ]
  },

  // =========================================================================
  // TRACK 7 — LESSON 7.2: VARIATIONAL AUTOENCODERS (VAEs)
  // =========================================================================
  'variational-autoencoders': {
    slug: 'variational-autoencoders',
    scene: {
      title: 'A Chai Recipe Card with a Target Center (μ), a Pinch of Randomness (σ), and a House Rule (KL Penalty)',
      narrative:
        'In Lesson 7.1, our deterministic autoencoder packed each photo into a single rigid pin-prick z, leaving empty gaps in latent space. A Variational Autoencoder (VAE) encodes each input not as a single point, but as a soft Gaussian cloud N(μ(x), σ²(x))! To make sure no cloud drifts off to 1,000 or shrinks to a microscopic pin-prick, the KL Divergence penalty pulls every cloud gently toward the center bowl N(0, 1). And how do we backpropagate through a random sample? Using the Reparameterization Trick: roll a standard die ε ~ N(0, 1) outside the network and compute z = μ + σ · ε!'
    },
    mapping: [
      {
        scenePart: 'Target recipe center and allowed spice spread',
        modelPart: 'Encoder Mean & Log-Variance',
        symbol: 'μ(x), s(x) = log σ²(x)',
        role: 'Outputs parameters of the approximate posterior q_ϕ(z|x) = N(μ, σ²I)'
      },
      {
        scenePart: 'Rolling a separate standard die outside the kitchen',
        modelPart: 'Reparameterization Trick',
        symbol: 'z = μ + exp(0.5 s) ⊙ ε, ε ~ N(0, I)',
        role: 'Moves stochasticity into external input ε so ∂z/∂μ = 1 and ∂z/∂s = 0.5 σ ε are differentiable!'
      },
      {
        scenePart: 'House rule keeping all recipe clouds near the center bowl',
        modelPart: 'KL Divergence Regularizer',
        symbol: 'D_KL(q_ϕ(z|x) || N(0,I)) = -½ Σ(1 + s - μ² - e^s)',
        role: 'Prevents latent gaps and memorization; equals 0 iff μ = 0 and σ = 1'
      },
      {
        scenePart: 'Taste accuracy + House rule compliance',
        modelPart: 'Negative ELBO Loss',
        symbol: 'L_VAE = ||x - x̂||² + β · D_KL',
        role: 'Balances faithful reconstruction against smooth, sampleable latent geometry'
      }
    ],
    playWithItPrompt:
      'Switch to Tab 7.2 ("VAEs & KL"). First set "Base Recipe Center / Mean (μ)" to 0.0 and "Spice Variation / Log-Variance (s)" to 0.0: verify that KL Penalty D_KL = 0.0000! Then drag μ or s away from 0 to watch D_KL rise analytically, and slide "External Dice Roll (ε)" to see z = μ + σ·ε shift smoothly.',
    analogyBreaks:
      'Adding random noise to a real kitchen recipe usually ruins the dish, whereas in a VAE the decoder specifically trains to map every nearby point in the Gaussian cloud N(μ, σ²) back to a valid, coherent image.',
    intuition: [
      'A Variational Autoencoder maximizes the Evidence Lower Bound (ELBO) on the data log-likelihood log p(x). Minimizing the negative ELBO gives a two-part loss: Reconstruction Loss + KL Divergence.',
      'Why does the encoder output s = log(σ²) instead of σ directly? Because variance σ² must be strictly positive (> 0), whereas a neural linear layer outputs unconstrained real numbers s ∈ (-∞, +∞). Defining σ = exp(0.5 s) guarantees positivity without clipping!',
      'Why can\'t we backpropagate directly through z ~ N(μ, σ²)? Because a random sampling node has no derivative with respect to its distribution parameters! Kingma & Welling (2014) introduced the Reparameterization Trick: sample ε ~ N(0, I) independently, then form z = μ + σ ⊙ ε. Now z is a deterministic, differentiable function of μ and σ!',
      'Because KL divergence forces all encoded clouds N(μ(x), σ²(x)) to overlap inside the unit Gaussian N(0, I), you can throw away the encoder at test time, sample z ~ N(0, I), and decode brand-new digits or faces!'
    ],
    mathFormulas: [
      {
        name: 'Reparameterization Trick & Analytical Gradients',
        latex: '\\mathbf{z} = \\boldsymbol{\\mu} + \\exp\\!\\left(\\tfrac{1}{2}\\mathbf{s}\\right) \\odot \\boldsymbol{\\epsilon}, \\quad \\frac{\\partial z_i}{\\partial \\mu_i} = 1, \\quad \\frac{\\partial z_i}{\\partial s_i} = \\frac{1}{2}\\sigma_i \\epsilon_i',
        explanation: 'Isolates randomness in ε ~ N(0, I) so gradients flow cleanly through μ and s = log(σ²) into the encoder.'
      },
      {
        name: 'Closed-Form Gaussian KL Divergence',
        latex: 'D_{\\text{KL}}\\!\\left(\\mathcal{N}(\\boldsymbol{\\mu}, \\boldsymbol{\\sigma}^2\\mathbf{I}) \\,\\|\\, \\mathcal{N}(\\mathbf{0}, \\mathbf{I})\\right) = -\\frac{1}{2}\\sum_{i=1}^{d}\\left(1 + \\log(\\sigma_i^2) - \\mu_i^2 - \\sigma_i^2\\right)',
        explanation: 'Exact analytical integral measuring how far the encoder\'s Gaussian distribution deviates from N(0, I).'
      }
    ],
    workedExample: {
      scenario: 'Evaluating a 1D VAE latent step with encoder outputs μ = 1.0, log-variance s = 0.0 (so σ = 1.0), and external noise draw ε = 0.5.',
      steps: [
        {
          label: 'Step 1: Compute Reparameterized Latent Sample z',
          math: '\\sigma = e^{0.5(0)} = 1.000 \\implies z = \\mu + \\sigma \\epsilon = 1.0 + (1.0)(0.5) = 1.500',
          note: 'Differentiable w.r.t μ (∂z/∂μ = 1) and s (∂z/∂s = 0.25).'
        },
        {
          label: 'Step 2: Compute Closed-Form KL Divergence D_KL',
          math: 'D_{\\text{KL}} = -0.5 \\times (1 + 0.0 - 1.0^2 - e^{0.0}) = -0.5 \\times (1 - 1 - 1) = +0.500',
          note: 'KL penalty is +0.500 nats because μ shifted 1 unit away from 0.'
        },
        {
          label: 'Step 3: Compute KL Gradients w.r.t μ and s',
          math: '\\frac{\\partial D_{\\text{KL}}}{\\partial \\mu} = \\mu = +1.000, \\quad \\frac{\\partial D_{\\text{KL}}}{\\partial s} = \\frac{1}{2}(e^s - 1) = 0.000',
          note: 'Pushes μ back toward 0 while leaving s = 0 untouched.'
        }
      ],
      result: 'Sampled latent code z = 1.500; KL divergence = 0.500 nats.',
      params: {}
    },
    quiz: [
      {
        id: 'vae-q1',
        question: 'Why is the Reparameterization Trick (z = μ + σ ⊙ ε with ε ~ N(0, I)) essential for training a Variational Autoencoder?',
        options: [
          'To force the Kullback-Leibler divergence penalty term to grow toward infinity.',
          'To restrict the generative decoder network to purely linear transformations.',
          'It moves randomness into ε ~ N(0, I) so gradients flow deterministically to μ and σ.',
          'Because standard CPU and GPU hardware cannot sample Gaussian random numbers.'
        ],
        correctIndex: 2,
        explanation: 'Moving stochasticity to an input leaf node ε keeps the computational path from encoder weights through μ and σ to the decoder completely deterministic and differentiable.'
      },
      {
        id: 'vae-q2',
        question: 'In a β-VAE (L = L_recon + β · D_KL), what happens if you set β = 0?',
        options: [
          'The latent space becomes 100% disentangled.',
          'The model ignores reconstruction and outputs blank gray images.',
          'The KL regularization disappears.',
          'Training converges in 1 step.'
        ],
        correctIndex: 2,
        explanation: 'Without the KL penalty (β = 0), adding noise σ > 0 only hurts reconstruction loss, so the network drives σ → 0 and loses its smooth generative prior.'
      }
    ],
    summary: [
      'VAEs encode inputs into Gaussian distributions N(μ(x), σ²(x)) rather than isolated points.',
      'The ELBO loss combines Reconstruction accuracy with a closed-form KL Divergence penalty toward N(0, I).',
      'The Reparameterization Trick z = μ + σ ⊙ ε makes stochastic latent sampling differentiable.',
      'Try building your own in the Track 7 Project: VAE Digit Generator + Latent Space Explorer!'
    ]
  },

  // =========================================================================
  // TRACK 7 — LESSON 7.3: GANs (GENERATIVE ADVERSARIAL NETWORKS)
  // =========================================================================
  'generative-adversarial-networks': {
    slug: 'generative-adversarial-networks',
    scene: {
      title: 'A Counterfeiter (Generator) vs an RBI Bank Officer (Discriminator) in an Arms Race',
      narrative:
        'Why do VAEs sometimes produce slightly blurry edges? Because pixel-wise MSE averages over uncertainty! Goodfellow et al. (2014) replaced pixel MSE with a two-player game: a Counterfeiter (Generator G) takes random noise z and prints a fake banknote G(z), while an RBI Bank Officer (Discriminator D) inspects both real notes x and fake notes G(z) and outputs the probability D(·) ∈ (0, 1) that a note is genuine. As the Officer gets better at spotting fakes, the Counterfeiter uses D\'s exact gradients to print sharper, indistinguishable notes—until at Nash Equilibrium the Officer can only guess 50/50!'
    },
    mapping: [
      {
        scenePart: 'Counterfeiter printing a synthetic note from random seed',
        modelPart: 'Generator Network',
        symbol: 'x_fake = G_θ(z), z ~ N(0, I)',
        role: 'Maps latent noise vector z directly to a synthetic image'
      },
      {
        scenePart: 'Bank officer scoring whether a note is real (1) or fake (0)',
        modelPart: 'Discriminator Network',
        symbol: 'D_ϕ(x) ∈ (0, 1)',
        role: 'Binary classifier trained on real data x and generated fakes G(z)'
      },
      {
        scenePart: 'Two-player tug-of-war scoreboard',
        modelPart: 'Minimax Value Function',
        symbol: 'min_G max_D E[log D(x)] + E[log(1 - D(G(z)))]',
        role: 'D maximizes classification accuracy; G minimizes D\'s success'
      },
      {
        scenePart: 'Counterfeiter printing only ₹500 notes and ignoring ₹100 notes',
        modelPart: 'Mode Collapse',
        symbol: 'G(z) → single mode',
        role: 'Failure mode where G outputs one convincing template with zero diversity'
      }
    ],
    playWithItPrompt:
      'Open Tab 7.3 ("GAN Minimax"). Drag "Counterfeiter Quality / Fake Note Logit (z_fake)" down to -3.0 (early training when D easily catches fakes, D(Fake) = 4.7%). Compare the tiny Minimax Gradient (-0.047) against the strong Non-Saturating Gradient (-0.953) to see why -log D(G(z)) is used in practice!',
    analogyBreaks:
      'In real life, a bank officer and counterfeiter never share their internal brain wiring with each other, whereas in a GAN the Generator literally backpropagates through the frozen weights of the Discriminator (∂D(G(z))/∂θ_G) to learn how to improve!',
    intuition: [
      'A Generative Adversarial Network (GAN) pits two neural networks against each other in a zero-sum game: the Discriminator D tries to maximize binary classification log-likelihood on real vs fake samples, while the Generator G tries to make D(G(z)) approach 1.',
      'For a fixed Generator distribution p_g, the mathematically optimal Discriminator is D*(x) = p_data(x) / (p_data(x) + p_g(x)). When the Generator perfectly matches the real data distribution (p_g = p_data), D*(x) = 1/2 everywhere!',
      'Early in training, fakes look terrible so D(G(z)) ≈ 0. In the original minimax loss log(1 - D(G(z))), the derivative w.r.t the fake logit is -D(G(z)) ≈ 0—the Generator\'s gradient vanishes! Switching G\'s loss to the Non-Saturating Heuristic L_G = -log D(G(z)) gives gradient D(G(z)) - 1 ≈ -1, providing a strong update signal when G needs it most.',
      'Unlike VAEs or Diffusion models, GANs can suffer from Mode Collapse (generating only one or two realistic faces repeatedly) and unstable oscillating gradients because finding a saddle point (min_G max_D) is much harder than minimizing a single loss function.'
    ],
    mathFormulas: [
      {
        name: 'GAN Minimax Objective & Optimal Discriminator',
        latex: '\\min_G \\max_D V(D, G) = \\mathbb{E}_{\\mathbf{x}\\sim p_{\\text{data}}}[\\log D(\\mathbf{x})] + \\mathbb{E}_{\\mathbf{z}\\sim p_{\\mathbf{z}}}[\\log(1 - D(G(\\mathbf{z})))], \\quad D^*(\\mathbf{x}) = \\frac{p_{\\text{data}}(\\mathbf{x})}{p_{\\text{data}}(\\mathbf{x}) + p_g(\\mathbf{x})}',
        explanation: 'At global optimum p_g = p_data, D*(x) = 0.5 and V(D*, G) = -2 log 2.'
      },
      {
        name: 'Minimax vs Non-Saturating Generator Gradients',
        latex: '\\frac{\\partial \\log(1 - \\sigma(z_f))}{\\partial z_f} = -D(G(\\mathbf{z})), \\qquad \\frac{\\partial (-\\log \\sigma(z_f))}{\\partial z_f} = D(G(\\mathbf{z})) - 1',
        explanation: 'When D(G(z)) → 0 early in training, the minimax gradient vanishes to 0 while the non-saturating gradient stays near -1.'
      }
    ],
    workedExample: {
      scenario: 'Early in training, the Discriminator outputs fake logit z_f = -3.0 (so D(G(z)) = σ(-3.0) = 0.0474). Compare the Generator\'s gradient under Minimax vs Non-Saturating loss.',
      steps: [
        {
          label: 'Step 1: Compute Discriminator confidence on fake sample',
          math: 'D(G(z)) = \\sigma(-3.0) = \\frac{1}{1 + e^3} \\approx 0.0474',
          note: 'Discriminator is 95.3% sure the generated image is fake.'
        },
        {
          label: 'Step 2: Evaluate Minimax gradient ∂L_minimax / ∂z_f',
          math: '\\frac{\\partial \\log(1 - D)}{\\partial z_f} = -D(G(z)) = -0.0474',
          note: 'Weak gradient—Generator barely learns because log(1-D) is flat near D=0.'
        },
        {
          label: 'Step 3: Evaluate Non-Saturating gradient ∂L_nonsat / ∂z_f',
          math: '\\frac{\\partial (-\\log D)}{\\partial z_f} = D(G(z)) - 1 = 0.0474 - 1 = -0.9526',
          note: '20× stronger gradient pushing z_f upward toward realistic territory!'
        }
      ],
      result: 'Non-saturating gradient (-0.9526) is 20× stronger than minimax gradient (-0.0474) when D rejects fakes.',
      params: {}
    },
    quiz: [
      {
        id: 'gan-q1',
        question: 'In practice, why do we train the Generator to minimize -log D(G(z)) (the non-saturating loss) instead of minimizing log(1 - D(G(z)))?',
        options: [
          'Because the logarithmic term log(1 - D(G(z))) cannot be evaluated on GPUs.',
          'Early on D(G(z)) is near 0, where log(1 - D(G(z))) has a flat gradient.',
          'Because maximizing log D(G(z)) removes the need for a Discriminator network.',
          'Because it forces the Discriminator output D(x) to equal 1.0 at equilibrium.'
        ],
        correctIndex: 1,
        explanation: 'Flipping the target so G maximizes log D(G(z)) cures early gradient saturation while preserving the exact same fixed point p_g = p_data.'
      },
      {
        id: 'gan-q2',
        question: 'Your GAN generates super-sharp, realistic photos of the digit "1", but no matter what random noise vector z you pass in, it NEVER generates digits 0, 2, 3, ..., 9. What is this failure called?',
        options: [
          'Posterior Collapse: the encoder ignores latent code z and relies on the decoder.',
          'Dying ReLU Saturation: negative pre-activations zero out all generator gradients.',
          'Train-Test Leakage: validation images accidentally leaked into the training batch.',
          'Mode Collapse: the generator maps all noise vectors z to one repetitive output.'
        ],
        correctIndex: 3,
        explanation: 'Because the standard GAN loss does not directly penalize lack of diversity across a batch, G can exploit a blind spot in D by repeating one convincing sample.'
      }
    ],
    summary: [
      'GANs train a Generator G and Discriminator D in an adversarial minimax game.',
      'At Nash equilibrium, p_g = p_data and the optimal discriminator outputs D*(x) = 0.5 everywhere.',
      'The non-saturating generator loss -log D(G(z)) prevents vanishing gradients early in training.',
      'Mode collapse and training instability motivated Denoising Diffusion Models (Lesson 7.4).'
    ]
  },

  // =========================================================================
  // TRACK 7 — LESSON 7.4: DIFFUSION MODELS
  // =========================================================================
  'diffusion-models': {
    slug: 'diffusion-models',
    scene: {
      title: 'Restoring a Dust-Smudged Holi Photograph One Gentle Wipe at a Time',
      narrative:
        'Trying to paint a masterpiece from a blank canvas in one single brush-stroke (like a GAN) is hard and unstable. What if we break generation into 1,000 tiny, easy cleanup steps? In a Denoising Diffusion Probabilistic Model (DDPM), the Forward Process gradually dusts a clean photo x_0 with Gaussian noise step by step until at step T = 1000 it is pure static x_T ~ N(0, I). Because Gaussian sums are closed-form, we can jump straight to any noise level t in one formula: x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε! Then we train a U-Net ε_θ(x_t, t) with simple MSE loss ||ε - ε_θ(x_t, t)||² to predict the dust so we can subtract it step by step!'
    },
    mapping: [
      {
        scenePart: 'Original crisp photograph before dust is added',
        modelPart: 'Clean Data Sample',
        symbol: 'x_0 ~ q(x_0)',
        role: 'Ground-truth training image'
      },
      {
        scenePart: 'Fraction of original photo still visible at step t',
        modelPart: 'Cumulative Signal Schedule',
        symbol: 'ᾱ_t = Π_{s=1}^t (1 - β_s) ∈ (0, 1)',
        role: 'Starts near 1 at t=1 and decays toward 0 at t=T'
      },
      {
        scenePart: 'Jumping straight to smudged photo at step t in one formula',
        modelPart: 'Closed-Form Forward Marginal',
        symbol: 'x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε',
        role: 'Lets us sample any training timestep t in O(1) without running t steps!'
      },
      {
        scenePart: 'Restorer guessing the exact dust pattern to wipe away',
        modelPart: 'Noise Prediction U-Net & MSE Loss',
        symbol: 'L_simple = ||ε - ε_θ(x_t, t)||₂²',
        role: 'Stable regression objective with zero adversarial instability or mode collapse'
      }
    ],
    playWithItPrompt:
      'Open Tab 7.4 ("Diffusion DDPM"). Drag "Remaining Clean Signal / Schedule (ᾱ_t)" from 0.95 (almost clean) down to 0.05 (almost pure noise) to see √(ᾱ_t) and √(1 - ᾱ_t) trade off! Then drag "Predicted Smudge / Denoiser Output (ε_θ)" to 0.50 (matching True Noise ε = 0.50) and see Restored Pixel x̂_0 hit 0.900 with 0.0000 MSE!',
    analogyBreaks:
      'Wiping real physical dust off a glass frame only uncovers the one photo underneath, whereas starting a Diffusion model from different random Gaussian static patterns x_T ~ N(0, I) carves out brand-new, never-before-seen images every time!',
    intuition: [
      'Ho et al. (2020) showed that Denoising Diffusion Probabilistic Models (DDPM) achieve state-of-the-art image synthesis using a remarkably simple training objective: predict the Gaussian noise ε that was added to the image.',
      'Why don\'t we have to run 500 sequential loop steps during training just to create a noisy image x_500? Because the sum of independent Gaussians is still Gaussian! Defining α_t = 1 - β_t and cumulative product ᾱ_t = ∏_{s=1}^t α_s, the marginal distribution q(x_t | x_0) has the exact closed form x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε with ε ~ N(0, I). Notice that (√ᾱ_t)² + (√(1 - ᾱ_t))² = ᾱ_t + 1 - ᾱ_t = 1, preserving unit variance!',
      'During training, we randomly pick a timestep t ∈ {1, ..., T}, sample ε ~ N(0, I), form x_t in O(1), and train a time-conditioned U-Net (or Diffusion Transformer, DiT) to minimize ||ε - ε_θ(x_t, t)||².',
      'At generation time, we start from pure noise x_T ~ N(0, I) and iteratively apply the reverse denoising transition from t = T down to 1 (or use accelerated deterministic samplers like DDIM in 20–50 steps).'
    ],
    mathFormulas: [
      {
        name: 'Closed-Form Forward Diffusion Marginal q(x_t | x_0)',
        latex: '\\mathbf{x}_t = \\sqrt{\\bar{\\alpha}_t}\\,\\mathbf{x}_0 + \\sqrt{1 - \\bar{\\alpha}_t}\\,\\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}), \\quad \\bar{\\alpha}_t = \\prod_{s=1}^t (1 - \\beta_s)',
        explanation: 'Corrupts clean image x_0 to arbitrary noise level t in a single analytical step.'
      },
      {
        name: 'DDPM Noise-Prediction Objective & Clean Estimate',
        latex: '\\mathcal{L}_{\\text{simple}}(\\boldsymbol{\\theta}) = \\mathbb{E}_{t, \\mathbf{x}_0, \\boldsymbol{\\epsilon}}\\left[\\|\\boldsymbol{\\epsilon} - \\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}_t, t)\\|_2^2\\right], \\quad \\hat{\\mathbf{x}}_0 = \\frac{\\mathbf{x}_t - \\sqrt{1 - \\bar{\\alpha}_t}\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}_t, t)}{\\sqrt{\\bar{\\alpha}_t}}',
        explanation: 'Trains the network to predict the added standard normal noise ε; rearranging recovers the clean image estimate x̂_0.'
      }
    ],
    workedExample: {
      scenario: 'At timestep t where cumulative signal ᾱ_t = 0.64, corrupt a clean pixel x_0 = 0.90 with noise ε = 0.50, then evaluate the denoising loss when the U-Net predicts ε_θ = 0.40.',
      steps: [
        {
          label: 'Step 1: Compute Signal and Noise Scales',
          math: '\\sqrt{\\bar{\\alpha}_t} = \\sqrt{0.64} = 0.800, \\quad \\sqrt{1 - \\bar{\\alpha}_t} = \\sqrt{0.36} = 0.600',
          note: 'Notice 0.800² + 0.600² = 0.64 + 0.36 = 1.00 (variance-preserving).'
        },
        {
          label: 'Step 2: Compute Noisy Pixel x_t in Closed Form',
          math: 'x_t = (0.800)(0.90) + (0.600)(0.50) = 0.720 + 0.300 = 1.020',
          note: 'Single-step forward corruption.'
        },
        {
          label: 'Step 3: Compute Denoising MSE Loss and Clean Estimate x̂_0',
          math: '\\mathcal{L} = (0.40 - 0.50)^2 = 0.0100, \\quad \\hat{x}_0 = \\frac{1.020 - (0.600)(0.40)}{0.800} = 0.975',
          note: 'Gradient ∂L/∂ε_θ = 2(0.40 - 0.50) = -0.20 nudges ε_θ up toward 0.50.'
        }
      ],
      result: 'Noisy pixel x_t = 1.020; denoising loss = 0.0100; reconstructed x̂_0 = 0.975.',
      params: {}
    },
    quiz: [
      {
        id: 'diff-q1',
        question: 'Why can we train a 1,000-step Diffusion Model efficiently without running a 1,000-step loop on every training batch?',
        options: [
          'Gaussian noise steps combine into a closed-form marginal q(x_t | x_0).',
          'Diffusion model training only ever evaluates the first step t = 1.',
          'Diffusion models do not use neural network weights during training.',
          'The cumulative signal retention product ᾱ_t is always equal to zero.'
        ],
        correctIndex: 0,
        explanation: 'Closed-form Gaussian marginals let us sample random timesteps t independently across a mini-batch and optimize simple MSE loss.'
      },
      {
        id: 'diff-q2',
        question: 'What is the main trade-off of Diffusion Models compared to GANs at inference (generation) time?',
        options: [
          'Diffusion Models suffer from severe mode collapse and unstable adversarial training.',
          'GANs generate an image in a single forward pass G(z).',
          'Diffusion Models can only generate 8×8 grayscale images.',
          'GANs require 1,000 discriminator passes at inference time.'
        ],
        correctIndex: 1,
        explanation: 'Diffusion models trade multi-step iterative sampling at inference time for rock-solid MSE training stability and superior mode coverage.'
      }
    ],
    summary: [
      'Diffusion models corrupt data via a variance-preserving Gaussian schedule and learn the reverse denoising process.',
      'The closed-form formula x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε enables O(1) noisy sampling at any timestep t during training.',
      'The denoiser ε_θ(x_t, t) is trained with simple MSE loss ||ε - ε_θ(x_t, t)||², avoiding GAN instability and mode collapse.',
      'Now build your own generative model in the Track 7 Projects: VAE Digit Generator and Tiny Diffusion / GAN!'
    ]
  },

  // =========================================================================
  // TRACK 3 — LESSON 3.1: WEIGHT INITIALIZATION
  // =========================================================================
  'weight-initialization': {
    slug: 'weight-initialization',
    scene: {
      title: 'A 10-Leg Relay Race Where Every Runner Must Pass the Baton at Normal Volume',
      narrative:
        'Suppose 10 relay runners (10 layers, each with n_in = 64 incoming teammates) pass a signal forward. First, if every runner starts with the exact same weight W = 0 (Zero Initialization), every neuron in a layer computes the exact same output and receives the exact same gradient—they stay clones forever (Symmetry Problem)! Second, if random starting weights are too tiny (σ_w = 0.02), the signal shrinks to 0.0000 by Layer 10; if too huge (σ_w = 0.30), it explodes to 10⁶! Xavier Initialization sets σ_w = √(1/n_in) for Tanh/Linear layers, while Kaiming / He Initialization sets σ_w = √(2/n_in) to compensate for ReLU zeroing out negative half-waves!'
    },
    mapping: [
      {
        scenePart: 'Number of incoming teammates feeding one runner',
        modelPart: 'Layer Fan-In',
        symbol: 'n_in',
        role: 'Number of input connections per neuron in layer l'
      },
      {
        scenePart: 'All runners starting at 0 and doing identical moves forever',
        modelPart: 'Symmetry Failure (Zero Init)',
        symbol: 'W = 0 ⇒ ∂L/∂W_i = ∂L/∂W_j',
        role: 'Identical hidden units never specialize without random symmetry breaking'
      },
      {
        scenePart: 'Balanced starting spread for Tanh / Sigmoid layers',
        modelPart: 'Xavier / Glorot Initialization',
        symbol: 'Var(W) = 1 / n_in (or 2 / (n_in + n_out))',
        role: 'Preserves Var(z^(l)) = Var(z^(l-1)) for symmetric linear/tanh activations'
      },
      {
        scenePart: 'Doubled variance spread to offset ReLU cutting negatives',
        modelPart: 'Kaiming / He Initialization',
        symbol: 'Var(W) = 2 / n_in',
        role: 'Preserves Var(a^(l)) = Var(a^(l-1)) when ReLU zeroes half of pre-activations'
      }
    ],
    playWithItPrompt:
      'In Tab 3.1 ("Weight Init"), drag "Starting Weight Spread / Std Dev (σ_w)" to 0.05 (watches Layer 10 variance vanish to ~10⁻⁸!) and then to 0.25 (explodes!). Click "Snap to Xavier √(1/n_in)" and "Snap to Kaiming / He √(2/n_in)" to see Layer 10 variance lock onto 1.00e+0!',
    analogyBreaks:
      'Relay runners consciously adjust their grip if a baton is handed over too fast, whereas initial neural network layers blindly multiply by W^(l) before any gradient update has occurred.',
    intuition: [
      'Why Never Initialize Weights to Zero? If all weights W are initialized to 0 (or any identical constant), every hidden neuron in a layer receives the exact same pre-activation z and computes the exact same backward gradient ∂L/∂w. All neurons in that layer remain identical twins throughout training, reducing a 1,000-neuron layer to the capacity of 1 neuron! (Biases b, however, should be initialized to 0 since weights already break symmetry.)',
      'Variance Preservation (Xavier / Glorot, 2010): For a linear sum z = ∑_{i=1}^{n_in} w_i x_i with independent zero-mean inputs and weights, Var(z) = n_in · Var(w) · Var(x). To keep Var(z) = Var(x) across 50 layers, we must set n_in · Var(w) = 1, which gives Var(w) = 1 / n_in (σ_w = 1 / √n_in).',
      'Why ReLU Needs Kaiming / He Initialization (He et al., 2015): Because ReLU(z) = max(0, z) zeroes out the entire negative half of a symmetric zero-mean Gaussian distribution, the variance of the output is cut in half: Var(ReLU(z)) = ½ Var(z) = ½ n_in Var(w) Var(a). Setting ½ n_in Var(w) = 1 yields He Initialization: Var(w) = 2 / n_in (σ_w = √(2 / n_in)).'
    ],
    mathFormulas: [
      {
        name: 'Xavier / Glorot Initialization (Tanh / Sigmoid)',
        latex: 'W_{ij} \\sim \\mathcal{N}\\!\\left(0,\\, \\frac{1}{n_{\\text{in}}}\\right) \\quad \\text{or} \\quad \\mathcal{N}\\!\\left(0,\\, \\frac{2}{n_{\\text{in}} + n_{\\text{out}}}\\right)',
        explanation: 'Ensures n_in · Var(W) = 1 so activation variance neither vanishes nor explodes in symmetric activations.'
      },
      {
        name: 'Kaiming / He Initialization (ReLU / Leaky ReLU)',
        latex: 'W_{ij} \\sim \\mathcal{N}\\!\\left(0,\\, \\frac{2}{n_{\\text{in}}}\\right) \\implies \\text{Var}(a^{(l)}) = \\frac{1}{2}\\,n_{\\text{in}}\\,\\text{Var}(W)\\,\\text{Var}(a^{(l-1)}) = \\text{Var}(a^{(l-1)})',
        explanation: 'Doubles weight variance to 2 / n_in to compensate for the factor of 1/2 lost when ReLU zeroes negative values.'
      }
    ],
    workedExample: {
      scenario: 'A deep ReLU network has layer width n_in = 64. Compare activation variance at Layer 10 under Xavier initialization (Var(W) = 1/64) vs He initialization (Var(W) = 2/64).',
      steps: [
        {
          label: 'Step 1: Compute single-layer ReLU variance multiplier under Xavier',
          math: 'r_{\\text{Xavier}} = \\frac{1}{2}\\,n_{\\text{in}}\\,\\text{Var}(W) = \\frac{1}{2} \\times 64 \\times \\frac{1}{64} = 0.500',
          note: 'Each ReLU layer loses 50% of its signal variance under Xavier!'
        },
        {
          label: 'Step 2: Propagate across 10 ReLU layers under Xavier',
          math: '\\text{Var}(a^{(10)}) = (0.500)^{10}\\,\\text{Var}(x) = \\frac{1}{1024} \\approx 0.00098',
          note: 'Signal variance collapses by 1,000× in just 10 layers.'
        },
        {
          label: 'Step 3: Propagate across 10 ReLU layers under Kaiming / He (Var(W) = 2/64)',
          math: 'r_{\\text{He}} = \\frac{1}{2} \\times 64 \\times \\frac{2}{64} = 1.000 \\implies \\text{Var}(a^{(10)}) = (1.000)^{10} = 1.000',
          note: 'Exact unit variance preserved at Layer 10!'
        }
      ],
      result: 'He initialization σ_w = √(2/64) = 0.1768 preserves 100% of activation variance across 10 ReLU layers.',
      params: {}
    },
    quiz: [
      {
        id: 'init-q1',
        question: 'What happens if you initialize all weights W = 0 in a 5-layer neural network (even if the biases or inputs are non-zero)?',
        options: [
          'Weights automatically become random after 1 step of SGD.',
          'The network trains faster because 0 is close to regularized weights.',
          'Only the first layer fails; deeper layers learn normally.',
          'All neurons in a layer compute identical outputs and gradients forever.'
        ],
        correctIndex: 3,
        explanation: 'Without distinct initial weights W_ij, hidden units within a layer are permutation-identical and receive identical gradients at every step.'
      },
      {
        id: 'init-q2',
        question: 'Why does Kaiming / He Initialization set Var(W) = 2 / n_in instead of Xavier\'s 1 / n_in for ReLU networks?',
        options: [
          'Because ReLU networks require twice as many hidden layers as Tanh networks.',
          'Because the ReLU activation function has a slope of 2.0 for positive inputs.',
          'Because ReLU zeroes out negative half-waves, halving activation variance per layer.',
          'Because He initialization forces all sampled initial weights to be positive.'
        ],
        correctIndex: 2,
        explanation: 'For z ~ N(0, σ²), E[(max(0, z))²] = ½ σ². Multiplying weight variance by 2 cancels the ½ factor.'
      }
    ],
    summary: [
      'Never initialize weights to zero: random initialization is required to break symmetry between hidden neurons.',
      'Xavier/Glorot initialization sets Var(W) = 1 / n_in (or 2 / (n_in + n_out)) for Tanh and Sigmoid layers.',
      'Kaiming/He initialization sets Var(W) = 2 / n_in to compensate for ReLU zeroing out negative activations.'
    ]
  },

  // =========================================================================
  // TRACK 3 — LESSON 3.2: BATCH AND LAYER NORMALIZATION
  // =========================================================================
  'batch-and-layer-normalization': {
    slug: 'batch-and-layer-normalization',
    scene: {
      title: 'Grading on a Class Curve (BatchNorm) vs Standardizing Each Student\'s Own Portfolio (LayerNorm)',
      narrative:
        'Even with great weight initialization at step 0, as earlier layers update during training, the distribution of inputs arriving at Layer 5 keeps shifting around! Normalization fixes this right inside the network: first standardize activations to mean 0 and variance 1 (x̂ = (x - μ)/√(σ² + ε)), then let two learnable knobs—Scale (γ) and Shift (β)—curve the scores to whatever range the next layer prefers (y = γ x̂ + β). BatchNorm curves each subject across all students in the mini-batch (great for CNNs), whereas LayerNorm standardizes across all features within a single student\'s paper independently (the standard for Transformers and LLMs)!'
    },
    mapping: [
      {
        scenePart: 'Centering and scaling raw marks to zero mean and unit spread',
        modelPart: 'Standardized Activation',
        symbol: 'x̂_i = (x_i - μ) / √(σ² + ε)',
        role: 'Stabilizes activation magnitudes and smooths the loss landscape'
      },
      {
        scenePart: 'Professor\'s custom curve multiplier and grace-mark offset',
        modelPart: 'Learnable Affine Scale & Shift',
        symbol: 'y_i = γ x̂_i + β',
        role: 'Allows the layer to recover any mean β and variance γ² if beneficial'
      },
      {
        scenePart: 'Curving Question 1 across 32 students sitting in the room',
        modelPart: 'Batch Normalization (BatchNorm)',
        symbol: 'μ_B, σ_B² across batch axis N',
        role: 'Normalizes per channel across the batch; uses running EMA stats at inference'
      },
      {
        scenePart: 'Standardizing across all 768 answers on one student\'s sheet',
        modelPart: 'Layer Normalization (LayerNorm)',
        symbol: 'μ_L, σ_L² across feature axis C',
        role: 'Batch-size independent; identical computation in training and inference'
      }
    ],
    playWithItPrompt:
      'Switch to Tab 3.2 ("Batch & LayerNorm"). Drag "Student 1 Raw Marks (x₁)" and notice that even when raw marks shift wildly, the Standardized vector x̂ always stays centered at mean 0 with variance 1! Then adjust "Curved Spread Multiplier (γ)" and "Grace Marks Offset (β)" to see y = γ·x̂ + β.',
    analogyBreaks:
      'A school professor curves grades only once at the end of the semester, whereas BatchNorm/LayerNorm sits between every single block of a deep network and differentiates right through μ and σ² during backpropagation.',
    intuition: [
      'How Normalization Accelerates Training: Ioffe & Szegedy (2015) introduced Batch Normalization (BatchNorm), showing that standardizing intermediate pre-activations allows 5–10× larger learning rates, reduces sensitivity to initialization, and acts as a mild regularizer.',
      'Why Include Learnable γ and β? What if forcing inputs into mean 0 and variance 1 pushes a Sigmoid or Tanh layer strictly into its linear middle zone, robbing the network of non-linearity? By computing y = γ x̂ + β (initialized at γ = 1, β = 0), the network can learn to undo the normalization (γ = σ, β = μ) whenever raw activations are better!',
      'Training vs Inference in BatchNorm: During training, BatchNorm uses the mini-batch mean μ_B and variance σ_B² and updates an Exponential Moving Average (μ_running, σ²_running). At inference (model.eval()), a single user request has batch size B = 1 (where batch variance would be 0!), so BatchNorm freezes and uses the saved running population statistics.',
      'Why Transformers Use LayerNorm Instead of BatchNorm: In variable-length NLP sequences and autoregressive LLM decoding (generating 1 token at a time with batch size 1), Layer Normalization (Ba et al., 2016) normalizes across the d_model feature channels of each individual token independently—requiring no batch coupling and no running averages!'
    ],
    mathFormulas: [
      {
        name: 'Forward Normalization & Learnable Affine Transform',
        latex: '\\mu = \\frac{1}{N}\\sum_{i=1}^N x_i, \\quad \\sigma^2 = \\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2, \\quad \\hat{x}_i = \\frac{x_i - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta',
        explanation: 'Standardizes across N elements (batch axis for BatchNorm, feature axis for LayerNorm) and applies learnable γ, β.'
      },
      {
        name: 'Analytical Backward Gradient ∂L/∂x_i',
        latex: '\\frac{\\partial L}{\\partial x_i} = \\frac{\\gamma}{N\\sqrt{\\sigma^2 + \\epsilon}}\\left(N\\frac{\\partial L}{\\partial y_i} - \\sum_{j=1}^N \\frac{\\partial L}{\\partial y_j} - \\hat{x}_i \\sum_{j=1}^N \\frac{\\partial L}{\\partial y_j}\\hat{x}_j\\right)',
        explanation: 'Accounts for the fact that perturbing x_i also shifts the shared mean μ and variance σ².'
      }
    ],
    workedExample: {
      scenario: 'Applying 1D Normalization with γ = 2.0, β = 1.0, ε = 0 to the 2-element activation vector x = [10, 20].',
      steps: [
        {
          label: 'Step 1: Compute Mean μ and Variance σ²',
          math: '\\mu = \\frac{10 + 20}{2} = 15.0, \\quad \\sigma^2 = \\frac{(10-15)^2 + (20-15)^2}{2} = \\frac{25 + 25}{2} = 25.0 \\implies \\sigma = 5.0',
          note: 'Mean is 15.0 and standard deviation is 5.0.'
        },
        {
          label: 'Step 2: Standardize to x̂',
          math: '\\hat{x}_1 = \\frac{10 - 15}{5} = -1.000, \\quad \\hat{x}_2 = \\frac{20 - 15}{5} = +1.000',
          note: 'Zero mean and unit variance.'
        },
        {
          label: 'Step 3: Apply learnable scale γ = 2.0 and shift β = 1.0',
          math: 'y_1 = 2.0(-1.0) + 1.0 = -1.000, \\quad y_2 = 2.0(+1.0) + 1.0 = +3.000',
          note: 'Output has mean β = 1.0 and standard deviation γ = 2.0.'
        }
      ],
      result: 'Normalized output y = [-1.000, +3.000].',
      params: {}
    },
    quiz: [
      {
        id: 'norm-q1',
        question: 'Why must you call model.eval() before running single-image production inference on a CNN that contains Batch Normalization layers?',
        options: [
          'Eval mode uses frozen running statistics so single-sample batch variance is not zero.',
          'Calling model.eval() prunes away half of the trained convolutional filter kernels.',
          'BatchNorm layers can only execute on CPU threads during training mode forward passes.',
          'Evaluation mode resets the learned affine scale γ and shift β parameters to zero.'
        ],
        correctIndex: 0,
        explanation: 'Forgetting model.eval() is one of the top real-world PyTorch bugs: with batch size 1, batch variance is 0 and (x - μ) is 0!'
      },
      {
        id: 'norm-q2',
        question: 'If a Conv2D layer outputs 64 channels and is followed immediately by a BatchNorm2d(64) layer, why do we set bias=False in the Conv2D layer?',
        options: [
          'Omitting the bias doubles the effective spatial receptive field of the convolution.',
          'PyTorch Conv2d layers do not support learnable bias vectors on GPU devices.',
          'Additive bias vectors inside convolutional layers cause gradients to explode.',
          'BatchNorm subtracts the channel mean (canceling b) and adds its own shift β.'
        ],
        correctIndex: 3,
        explanation: 'Adding a constant b to x shifts μ_B by +b, so (x + b) - (μ_B + b) = x - μ_B — a Conv bias before BatchNorm has zero effect on the output and Zero gradient!'
      }
    ],
    summary: [
      'Normalization standardizes activations to zero mean and unit variance, then applies learnable γ and β.',
      'BatchNorm normalizes across the mini-batch per channel and uses running EMA statistics at test time.',
      'LayerNorm normalizes across features within each individual sample/token, making it ideal for Transformers.',
      'Omit redundant bias parameters in linear/conv layers immediately preceding BatchNorm.'
    ]
  },

  // =========================================================================
  // TRACK 3 — LESSON 3.5: LEARNING RATE SCHEDULES AND WARMUP
  // =========================================================================
  'learning-rate-schedules-and-warmup': {
    slug: 'learning-rate-schedules-and-warmup',
    scene: {
      title: 'Pulling Out of a Driveway Slowly (Warmup), Cruising on the Highway, and Parallel Parking Gently (Cosine Decay)',
      narrative:
        'When you drive a car, you don\'t stomp the accelerator to 100 km/h at millisecond zero while backing out of a tight gate, nor do you slam into your parking spot at full highway speed! Deep network training works the same way: (1) during Linear Warmup (the first 5–10% of steps), we ramp the learning rate η linearly from 0 up to η_max so Adam\'s second-moment variance estimates v_t calibrate before taking big steps; (2) then Cosine Annealing smoothly glides η down a half-cosine curve toward η_min so the optimizer settles cleanly into the bottom of a wide, generalizable valley instead of bouncing around the rim!'
    },
    mapping: [
      {
        scenePart: 'Easing out of the gate from 0 to cruising speed',
        modelPart: 'Linear Warmup Phase',
        symbol: 'η(t) = η_max · (t / W) for t ≤ W',
        role: 'Prevents early gradient spikes before Adam moments and LayerNorm stabilize'
      },
      {
        scenePart: 'Smooth deceleration into the final parking spot',
        modelPart: 'Cosine Annealing Schedule',
        symbol: 'η(t) = η_min + ½(η_max - η_min)(1 + cos(π (t-W)/(T-W)))',
        role: 'Gradually shrinks step size without sudden hyperparameter cliffs'
      },
      {
        scenePart: 'Shifting down a gear at fixed highway milestones',
        modelPart: 'Step Decay',
        symbol: 'η(t) = η_0 · γ^{⌊t / S⌋}',
        role: 'Drops η by a factor (e.g. 0.5× or 0.1×) at scheduled epoch milestones'
      }
    ],
    playWithItPrompt:
      'Open Tab 3.5 ("LR Warmup & Cosine"). Drag "Current Training Epoch / Step (t)" from 0 up to "Warmup Ramp Duration (W)" to watch η climb linearly to 0.01000, then slide from W to 100 to compare smooth Cosine Annealing against Step Decay and Exponential Decay!',
    analogyBreaks:
      'A car driver slows down because they can see the parking spot ahead with their eyes, whereas a learning rate schedule is a pre-programmed function of step count t that runs blindly unless paired with validation-plateau monitoring (ReduceLROnPlateau).',
    intuition: [
      'Why Fixed Learning Rates Fail at the End of Training: With a large constant learning rate η, stochastic mini-batch noise keeps kicking the weights around the walls of the minimum (θ_t orbits the valley floor without ever settling). Decaying η → η_min lets the parameters settle into the bottom of the basin.',
      'Why Transformers & ResNets Need Linear Warmup: At step t = 1, weights are freshly randomized, attention distributions are uniform, and Adam\'s running second moment v_t has only seen a single mini-batch (high variance!). Taking a full η_max stride on step 1 can hurl weights into saturated regions from which they never recover. Ramping η(t) = η_max · (t / W) over the first W steps lets v_t and early feature statistics stabilize first.',
      'Why Cosine Annealing Is the Modern Default: Unlike Step Decay (which requires tuning milestone epochs and drop multipliers), Cosine Annealing (Loshchilov & Hutter, 2016) needs only η_max, η_min, and total steps T, spending substantial time at productive mid-range learning rates before gently landing at η_min.'
    ],
    mathFormulas: [
      {
        name: 'Linear Warmup (0 ≤ t ≤ W)',
        latex: '\\eta(t) = \\eta_{\\max} \\cdot \\frac{t}{W}',
        explanation: 'Ramps learning rate linearly from 0 to η_max over W warmup steps.'
      },
      {
        name: 'Cosine Annealing Decay (W < t ≤ T)',
        latex: '\\eta(t) = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\!\\left(\\frac{\\pi(t - W)}{T - W}\\right)\\right)',
        explanation: 'Follows a smooth half-cosine curve from η_max at t = W down to η_min at t = T.'
      }
    ],
    workedExample: {
      scenario: 'A 100-step training run uses Linear Warmup for W = 20 steps up to η_max = 0.010, followed by Cosine Annealing down to η_min = 0.000 at T = 100. Compute η at t = 10, t = 20, and t = 60.',
      steps: [
        {
          label: 'Step 1: Halfway through Warmup (t = 10 ≤ 20)',
          math: '\\eta(10) = 0.010 \\times \\frac{10}{20} = 0.0050',
          note: 'Linearly ramped to 50% of peak learning rate.'
        },
        {
          label: 'Step 2: End of Warmup Peak (t = 20)',
          math: '\\eta(20) = 0.010 \\times \\frac{20}{20} = 0.0100',
          note: 'Reaches full cruising learning rate η_max.'
        },
        {
          label: 'Step 3: Halfway through Cosine Decay (t = 60, progress = (60-20)/(100-20) = 0.5)',
          math: '\\eta(60) = 0 + \\frac{1}{2}(0.010)\\left(1 + \\cos\\!\\left(\\frac{\\pi}{2}\\right)\\right) = 0.005(1 + 0) = 0.0050',
          note: 'At the midpoint of cosine decay, cos(π/2) = 0 so η is exactly the average of η_max and η_min.'
        }
      ],
      result: 'η(10) = 0.0050, η(20) = 0.0100, η(60) = 0.0050, η(100) = 0.0000.',
      params: {}
    },
    quiz: [
      {
        id: 'sched-q1',
        question: 'Why is Linear Warmup (ramping η from 0 to η_max over the first few hundred steps) critical when training Transformers with Adam?',
        options: [
          'Because GPUs need 5 minutes to warm up physically before multiplying matrices.',
          'Early Adam variance estimates v_t are noisy and can trigger destabilizing jumps.',
          'Because Linear Warmup increases the number of parameters.',
          'To force the training loss to increase during epoch 1.'
        ],
        correctIndex: 1,
        explanation: 'Warmup gives Adam\'s exponential moving averages (m_t, v_t) time to accumulate accurate second-moment statistics before full-sized parameter updates are applied.'
      },
      {
        id: 'sched-q2',
        question: 'In a Cosine Annealing schedule from η_max = 0.02 to η_min = 0.00 over 100 steps (with 0 warmup), what is the learning rate at step t = 50?',
        options: [
          '0.010',
          '0.020',
          '0.000',
          '0.005'
        ],
        correctIndex: 0,
        explanation: 'At 50% progress through the cosine schedule, the angle is π/2 where cos(π/2) = 0, yielding the exact midpoint ½(η_max + η_min).'
      }
    ],
    summary: [
      'Decaying the learning rate allows stochastic gradient descent to settle into narrow minimum basins.',
      'Linear warmup prevents early divergence in Transformers and large-batch training while Adam moments calibrate.',
      'Cosine annealing smoothly transitions from η_max to η_min without tuning step-drop milestones.'
    ]
  },

  // =========================================================================
  // TRACK 3 — LESSON 3.6: READING LOSS CURVES AND DEBUGGING TRAINING
  // =========================================================================
  'reading-loss-curves-and-debugging': {
    slug: 'reading-loss-curves-and-debugging',
    scene: {
      title: 'A Doctor Reading a Patient\'s Fever Chart to Diagnose the Exact Illness',
      narrative:
        'When your model fails to learn, the Training and Validation Loss Curves are your clinical fever chart! (1) If both Train and Val loss stay high and flat, the model is Underfitting (too small or learning rate too tiny); (2) if Train loss plunges near 0 while Val loss curves back UP like a fork, the model is Overfitting (memorizing training noise); (3) if loss spikes wildly or hits NaN, your learning rate is too high or gradients are exploding (cure with Gradient Clipping ||g|| ≤ c); and (4) before training on 100,000 samples, always run the Golden Sanity Check: can your code overfit a tiny 10-sample batch to 0.00 loss?'
    },
    mapping: [
      {
        scenePart: 'Gap between practice-test score and real-exam score',
        modelPart: 'Generalization Gap',
        symbol: 'ΔL = L_val - L_train',
        role: 'Large positive gap with rising L_val diagnoses overfitting'
      },
      {
        scenePart: 'Emergency fever cap preventing a fatal spike',
        modelPart: 'Global Gradient Norm Clipping',
        symbol: 'g ← g · min(1, c / ||g||₂)',
        role: 'Prevents a single steep batch cliff from blasting weights to NaN'
      },
      {
        scenePart: 'Neurons knocked unconscious that never wake up again',
        modelPart: 'Dead ReLU Units',
        symbol: 'z ≤ 0 ∀x ⇒ ReLU(z) = 0, ∂L/∂w = 0',
        role: 'Caused by an overly large learning rate pushing bias b strongly negative'
      },
      {
        scenePart: 'Testing the stove on 1 cup of water before cooking for 500 guests',
        modelPart: 'Overfit-One-Batch Sanity Check',
        symbol: 'L_train(10 samples) → 0',
        role: 'Fastest way to catch bugs in labels, loss sign, or zeroed gradients'
      }
    ],
    playWithItPrompt:
      'Open Tab 3.6 ("Loss Curves & Debug"). Slide "Model Capacity / Depth" from 1.5 ("Underfitting") to 4.0 ("Sweet Spot") to 8.0 ("Overfitting") and watch the Train vs Validation Loss gap! Then drag "Step Size / Learning Rate (η)" above 0.90 to trigger "Diverging / Unstable" and test the "Gradient Clip Ceiling (c)"!',
    analogyBreaks:
      'A human patient recovers with rest, whereas a neural network with a sign bug in its loss function or 90% dead ReLUs will never self-heal no matter how many GPU hours you wait.',
    intuition: [
      'Symptom 1 — Loss Explodes to NaN or Inf: Almost always caused by (a) learning rate η too high, (b) unclipped exploding gradients, or (c) numerical overflow in log(0) or exp(z) (fix: use combined BCEWithLogitsLoss / CrossEntropyLoss instead of manual softmax + log!).',
      'Symptom 2 — Dead ReLUs: If a large gradient step pushes a neuron\'s bias b strongly negative so that z = w·x + b < 0 for every sample in the dataset, ReLU(z) outputs 0 and its derivative is 0 forever—that neuron is permanently dead! Cure: lower η, use He initialization + warmup, or switch to Leaky ReLU / GELU / SiLU.',
      'Symptom 3 — Overfitting Fork (L_train ↓ while L_val ↑): The model has enough capacity to memorize the training set but fails to generalize. Cure: add more training data, data augmentation, L2 weight decay (AdamW), Dropout, or Early Stopping at the minimum of L_val.',
      'The Golden Debugging Rule (Karpathy\'s Recipe): Before running a 2-hour training job, take 1 single mini-batch of 8–16 examples and turn off regularization. Your model must be able to drive training loss on that tiny batch to ~0.000 within 100 steps. If it can\'t, you have a code bug (wrong label alignment, optimizer.zero_grad() missing, frozen weights, or inverted loss sign)!'
    ],
    mathFormulas: [
      {
        name: 'Generalization Gap Decomposition',
        latex: '\\Delta \\mathcal{L}(t) = \\mathcal{L}_{\\text{val}}(t) - \\mathcal{L}_{\\text{train}}(t)',
        explanation: 'Tracks divergence between out-of-sample validation risk and empirical training risk across epochs.'
      },
      {
        name: 'Dead ReLU Zero-Gradient Trap',
        latex: 'z_i(\\mathbf{x}) = \\mathbf{w}_i^\\top \\mathbf{x} + b_i \\le 0 \\;\\; \\forall \\mathbf{x} \\in \\mathcal{D} \\implies a_i = 0, \\;\\; \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{w}_i} = \\mathbf{0}, \\;\\; \\frac{\\partial \\mathcal{L}}{\\partial b_i} = 0',
        explanation: 'Once a ReLU unit is negative across the entire training set, its local derivative is 0 and SGD can never update it again.'
      }
    ],
    workedExample: {
      scenario: 'During a training step, a 2D parameter gradient spikes to g = [3.0, 4.0]. Apply Global Gradient Norm Clipping with ceiling c = 2.5.',
      steps: [
        {
          label: 'Step 1: Compute Raw L2 Gradient Norm ||g||₂',
          math: '\\|\\mathbf{g}\\|_2 = \\sqrt{3.0^2 + 4.0^2} = \\sqrt{9 + 16} = 5.000',
          note: 'Raw norm (5.0) exceeds the safe threshold c = 2.5.'
        },
        {
          label: 'Step 2: Compute Clipping Scale Factor',
          math: 's = \\min\\!\\left(1,\\, \\frac{c}{\\|\\mathbf{g}\\|_2}\\right) = \\frac{2.5}{5.0} = 0.500',
          note: 'Scales vector magnitude by 50% while preserving exact direction.'
        },
        {
          label: 'Step 3: Rescale Gradient Vector',
          math: '\\tilde{\\mathbf{g}} = 0.500 \\times [3.0, 4.0] = [1.500, 2.000], \\quad \\|\\tilde{\\mathbf{g}}\\|_2 = \\sqrt{1.5^2 + 2.0^2} = 2.500',
          note: 'Safe bounded update ready for optimizer step.'
        }
      ],
      result: 'Clipped gradient g̃ = [1.50, 2.00] with exact L2 norm 2.50.',
      params: {}
    },
    quiz: [
      {
        id: 'dbg-q1',
        question: 'You write a new neural network training script, and before running on all 50,000 images, you test it on a tiny batch of 8 images. Even after 500 steps on those 8 images, the training loss refuses to drop below 2.30. What does this tell you?',
        options: [
          'Strong Dropout and L2 weight decay are preventing the network from memorizing.',
          'The training dataset is too small and needs a million additional labeled images.',
          'There is a training pipeline bug (such as zero learning rate or detached gradients).',
          'The model has excessive capacity and is severely overfitting the validation split.'
        ],
        correctIndex: 2,
        explanation: 'Overfitting a tiny batch of 8–16 samples is the fastest unit test in deep learning: if the model cannot memorize 8 examples, adding more data or regularization will only hide the bug.'
      },
      {
        id: 'dbg-q2',
        question: 'After 5 epochs with a high learning rate, 70% of the neurons in your ReLU hidden layer output 0.000 for every single validation image and never change again. What happened, and how do you fix it?',
        options: [
          'Inverted Dropout masks are accidentally left enabled during validation inference.',
          'Those hidden neurons have already converged to the exact global loss minimum.',
          'Dying ReLU: a large step pushed pre-activations negative where slope is zero.',
          'L2 weight decay normalized all incoming dataset pixel intensities to exact zero.'
        ],
        correctIndex: 2,
        explanation: 'Because ReLU has a flat zero slope for z < 0, a large negative update traps the unit permanently unless a non-zero negative slope (Leaky ReLU / GELU) or smaller step size is used.'
      }
    ],
    summary: [
      'Always sanity-check new code by overfitting a single tiny batch of ~10 examples to near-zero loss.',
      'Both losses high = Underfitting; Train loss low & Val loss rising = Overfitting; Loss spiking/NaN = LR too high or unstable numerics.',
      'Dying ReLUs occur when large updates push pre-activations permanently negative (z ≤ 0); cure with warmup, lower LR, or GELU/Leaky ReLU.',
      'Put your diagnostic skills to the test in the Track 3 Projects: Training Debugging Lab and Optimizer Benchmark!'
    ]
  },

  // =========================================================================
  // TRACK 8 — LESSON 8.1: TOKENIZATION AND LLM PRETRAINING
  // =========================================================================
  'tokenization-and-llm-pretraining': {
    slug: 'tokenization-and-llm-pretraining',
    scene: {
      title: 'Lego Word Bricks (BPE), a Creativity Thermostat (Temperature), and Next-Word Guessing (Perplexity)',
      narrative:
        'How does ChatGPT read English, Hindi, and Python code using one fixed dictionary? If it split by single characters ("c", "h", "a", "i"), sequences would be 5× too long; if it stored every whole word in the world, the dictionary would need 5 million rows and still fail on new slang! Byte-Pair Encoding (BPE) starts with characters and iteratively glues the most frequent pairs together into Lego subword bricks (so common words like "chai" are 1 brick, while rare words like "unbelievable" split into ["un", "believ", "able"]). Then the LLM pretrains on trillions of bricks with one goal: predict the next brick, measured by Perplexity PPL = exp(L)!'
    },
    mapping: [
      {
        scenePart: 'Gluing frequent character pairs into reusable Lego subword bricks',
        modelPart: 'Byte-Pair Encoding (BPE)',
        symbol: 'V ∈ [32k, 128k] subwords',
        role: 'Zero out-of-vocabulary (<UNK>) failures with compact sequence length'
      },
      {
        scenePart: 'How surprised the model is by the true next brick',
        modelPart: 'Perplexity',
        symbol: 'PPL = exp(-1/T Σ log P(x_t | x_{<t}))',
        role: 'Effective branching factor: PPL = 4 means as uncertain as a 4-sided die'
      },
      {
        scenePart: 'Creativity thermostat flattening or sharpening choices',
        modelPart: 'Sampling Temperature',
        symbol: 'p_i = exp(z_i / T) / Σ exp(z_j / T)',
        role: 'T → 0 picks greedy argmax; T > 1 flattens distribution for creative variety'
      },
      {
        scenePart: 'Keeping only the top choices that add up to 90% probability',
        modelPart: 'Top-p (Nucleus) Sampling',
        symbol: 'Σ_{i ∈ V_p} p_i ≥ p',
        role: 'Cuts off the long tail of bizarre low-probability words dynamically'
      }
    ],
    playWithItPrompt:
      'In Tab 8.1 ("Tokens & Perplexity"), drag "Creativity / Sampling Temperature (T)" down to 0.15 (watch "chai" take 99.9% greedy probability and Perplexity drop to 1.00!) and up to 1.80 (probabilities flatten out). Then adjust "Nucleus Cutoff / Top-p Threshold (p)" to see low-probability tail tokens pruned to 0.0%!',
    analogyBreaks:
      'Physical Lego bricks have fixed shapes regardless of language, whereas a BPE tokenizer trained mostly on English splits non-Latin scripts like Devanagari into many more tiny byte tokens per word unless balanced multilingual training data is used.',
    intuition: [
      'Subword Tokenization (BPE / WordPiece / Unigram): Byte-Pair Encoding starts with raw UTF-8 bytes (256 base tokens) and repeatedly merges the most frequent adjacent pair (a, b) → ab until reaching vocabulary size |V| (e.g. 100,277 in GPT-4 cl100k_base or 128,256 in Llama-3).',
      'Autoregressive Pretraining Objective: Given a sequence of tokens (x_1, x_2, ..., x_T), a causal decoder Transformer outputs logits z_t ∈ R^{|V|} at each step and minimizes average Cross-Entropy (Negative Log-Likelihood): L = -(1/T) ∑_{t=1}^T log P(x_t | x_{<t}).',
      'What Is Perplexity (PPL)? PPL = exp(L). If a model assigns probability p = 0.50 to the true next token, L = -ln(0.5) = 0.693 nats, and PPL = exp(0.693) = 2.0—meaning the model is as uncertain as choosing uniformly between 2 tokens!',
      'Decoding Strategies (Temperature, Top-k, Top-p): Dividing logits by Temperature T before Softmax (z_i / T) controls entropy. Top-p (Nucleus) Sampling (Holtzman et al., 2020) sorts tokens by descending probability and keeps only the smallest prefix whose cumulative probability exceeds p (e.g. p = 0.90), dynamically adapting the candidate pool size based on model confidence.'
    ],
    mathFormulas: [
      {
        name: 'Autoregressive Cross-Entropy & Perplexity',
        latex: '\\mathcal{L} = -\\frac{1}{T}\\sum_{t=1}^{T} \\log P_{\\boldsymbol{\\theta}}(x_t \\mid x_{<t}), \\qquad \\text{PPL} = \\exp(\\mathcal{L}) = \\left(\\prod_{t=1}^T P_{\\boldsymbol{\\theta}}(x_t \\mid x_{<t})\\right)^{-1/T}',
        explanation: 'Perplexity exponentiates average cross-entropy loss; lower perplexity means sharper, more accurate next-token predictions.'
      },
      {
        name: 'Temperature-Scaled Softmax & Logit Gradient',
        latex: 'p_i(T) = \\frac{\\exp(z_i / T)}{\\sum_{j=1}^{|V|} \\exp(z_j / T)}, \\qquad \\frac{\\partial (-\\log p_y(T))}{\\partial z_i} = \\frac{p_i(T) - \\mathbf{1}_{[i = y]}}{T}',
        explanation: 'Dividing logits by T < 1 sharpens peaks toward argmax; T > 1 flattens the distribution toward uniform.'
      }
    ],
    workedExample: {
      scenario: 'At step t, an LLM assigns probability P(x_t | x_{<t}) = 0.25 to the true next token. Compute the Cross-Entropy loss (in nats) and the Perplexity.',
      steps: [
        {
          label: 'Step 1: Compute Negative Log-Likelihood L (in nats)',
          math: '\\mathcal{L} = -\\ln(0.25) = \\ln(4) \\approx 1.3863\\text{ nats}',
          note: 'Natural log penalty for assigning 25% probability to the true token.'
        },
        {
          label: 'Step 2: Exponentiate L to get Perplexity (PPL)',
          math: '\\text{PPL} = \\exp(1.3863) = \\frac{1}{0.25} = 4.000',
          note: 'PPL = 4.0 means the model\'s uncertainty is equivalent to rolling a fair 4-sided die.'
        }
      ],
      result: 'Cross-Entropy = 1.3863 nats; Perplexity PPL = 4.00.',
      params: {}
    },
    quiz: [
      {
        id: 'tok-q1',
        question: 'Why do modern LLMs use subword tokenization (Byte-Pair Encoding) instead of whole-word vocabularies or raw character-level vocabularies?',
        options: [
          'Because BPE requires zero embedding parameters.',
          'BPE hits the sweet spot.',
          'Because character-level models cannot use Softmax.',
          'Because BPE makes every sentence 1 token long.'
        ],
        correctIndex: 1,
        explanation: 'Whole-word vocabularies fail on out-of-vocabulary words, while character-level sequences are 4–5× longer (making O(N²) self-attention 16–25× slower).'
      },
      {
        id: 'tok-q2',
        question: 'When generating code or factual math answers from an LLM, why do engineers typically set Temperature T = 0.0 (or very low, e.g. T = 0.1) instead of T = 1.5?',
        options: [
          'Because lowering Temperature directly modifies the pretrained weight matrices.',
          'Because setting T = 0.0 causes the Transformer to execute ten times more layers.',
          'Because setting T = 1.5 drives all vocabulary logit values to positive infinity.',
          'Low T concentrates Softmax mass on the top token, avoiding random syntax errors.'
        ],
        correctIndex: 3,
        explanation: 'High temperature flattens the probability distribution and increases random exploration, which is fun for creative stories but harmful for deterministic syntax and math.'
      }
    ],
    summary: [
      'Byte-Pair Encoding (BPE) iteratively merges frequent byte/character pairs into a fixed subword vocabulary.',
      'Autoregressive pretraining minimizes next-token cross-entropy; Perplexity PPL = exp(L) measures branching uncertainty.',
      'Temperature T scales logits prior to Softmax; Top-p (nucleus) sampling dynamically prunes low-probability tail tokens.'
    ]
  },

  // =========================================================================
  // TRACK 8 — LESSON 8.2: FINE-TUNING AND LoRA
  // =========================================================================
  'finetuning-and-lora': {
    slug: 'finetuning-and-lora',
    scene: {
      title: 'Snapping a Tiny 2-Dial Equalizer Adapter onto a Studio Mixing Board Instead of Rebuilding It',
      narrative:
        'Suppose you want to fine-tune a 7-Billion parameter LLM on your college\'s medical or legal Q&A dataset. Updating all 7 billion weights (Full Fine-Tuning) requires 80+ GB of GPU VRAM just to store the Adam optimizer states (m_t, v_t) and produces a massive 14 GB checkpoint for every single task! Hu et al. (2021) noticed that when an LLM adapts to a new task, the weight change matrix ΔW ∈ R^{4096×4096} has very low intrinsic rank. Low-Rank Adaptation (LoRA) freezes the giant matrix W_0 completely and wires a tiny side-branch ΔW = (α/r) B · A where A ∈ R^{r×4096} and B ∈ R^{4096×r} with rank r = 8—cutting trainable parameters by 99.6% (256× fewer!) and merging back into W_0 at test time with ZERO extra latency!'
    },
    mapping: [
      {
        scenePart: 'Giant factory-sealed mixing board kept 100% locked',
        modelPart: 'Frozen Pretrained Weight Matrix',
        symbol: 'W_0 ∈ R^{d × k} (requires_grad = False)',
        role: 'Holds general language knowledge; requires zero optimizer state memory!'
      },
      {
        scenePart: 'Narrow r-wire adapter bottleneck (down-project A, up-project B)',
        modelPart: 'Low-Rank Adapter Matrices',
        symbol: 'A ∈ R^{r × k}, B ∈ R^{d × r} (r ≪ d)',
        role: 'Uses r(d + k) trainable parameters instead of d · k'
      },
      {
        scenePart: 'Starting with B = 0 so the adapter changes nothing on Step 0',
        modelPart: 'Zero-Delta Initialization',
        symbol: 'A ~ N(0, σ²), B = 0 ⇒ ΔW = B A = 0',
        role: 'Guarantees the fine-tuned model starts identically to the base LLM'
      },
      {
        scenePart: 'Soldering the finished adapter directly into the main board',
        modelPart: 'Inference Weight Merging',
        symbol: 'W_merged = W_0 + (α / r) B A',
        role: 'Adds zero latency overhead at production inference time!'
      }
    ],
    playWithItPrompt:
      'Open Tab 8.2 ("LoRA Adapters"). Drag "Adapter Bottleneck Rank (r)" from 2 to 64 and watch the LoRA parameter count and Trainable % against the 16.78M frozen W_0 (4096×4096) matrix! At r = 8, LoRA trains only 65,536 parameters (0.39% of W_0—a 256× reduction)!',
    analogyBreaks:
      'A physical plug-in audio adapter adds a millisecond of cable delay when plugged in, whereas LoRA\'s matrix product (α/r)B·A has the exact same shape (d × k) as W_0 and is added directly into W_0 before serving—resulting in literally zero extra matrix multiplications at inference time!',
    intuition: [
      'Why Full Fine-Tuning Is So Expensive: In FP16/BF16, a 7B parameter model takes 14 GB for weights, plus 14 GB for gradients, plus 28–56 GB for Adam optimizer states (m_t, v_t, master weights)—exceeding consumer GPUs!',
      'The LoRA Decomposition: For a weight matrix W_0 ∈ R^{d × k} (e.g. 4096 × 4096 = 16,777,216 weights), LoRA freezes W_0 and parameterizes the update as W = W_0 + (α / r) B A, where B ∈ R^{d × r} and A ∈ R^{r × k} with rank r ∈ {4, 8, 16, 32}. At r = 8, B and A together have only 8 × (4096 + 4096) = 65,536 parameters—256× fewer!',
      'Why Initialize A ~ N(0, σ²) and B = 0? If both A and B were zero, gradients would be zero (symmetry trap!). If both were random, B A would inject random noise into the pretrained LLM at step 0. Setting A random and B = 0 makes B A = 0 at step 0 while allowing ∂L/∂B = (α/r) dy (Ax)^T ≠ 0 on the very first backward pass!',
      'QLoRA (4-Bit Quantized Base + FP16 LoRA): Dettmers et al. (2023) showed you can quantize the frozen base matrix W_0 to 4-bit NormalFloat (NF4) while keeping the tiny LoRA adapters B, A in BF16—allowing a 7B or 13B LLM to be fine-tuned on a single free 16 GB Colab T4 GPU!'
    ],
    mathFormulas: [
      {
        name: 'LoRA Forward Pass & Parameter Count Savings',
        latex: '\\mathbf{h} = \\mathbf{W}_0\\mathbf{x} + \\frac{\\alpha}{r}\\mathbf{B}\\mathbf{A}\\mathbf{x}, \\qquad \\frac{|\\Theta_{\\text{LoRA}}|}{|\\Theta_{\\text{base}}|} = \\frac{r(d + k)}{d \\cdot k}',
        explanation: 'When d = k = 4096 and r = 8, ratio is 8(8192) / 16,777,216 = 1 / 256 (0.3906% trainable parameters).'
      },
      {
        name: 'Analytical LoRA Adapter Gradients',
        latex: '\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{B}} = \\frac{\\alpha}{r}\\,\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}}(\\mathbf{A}\\mathbf{x})^\\top, \\qquad \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{A}} = \\frac{\\alpha}{r}\\,\\mathbf{B}^\\top \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}}\\mathbf{x}^\\top',
        explanation: 'Gradients are only computed and stored for low-rank factors B and A; frozen W_0 requires zero gradient or Adam state memory.'
      }
    ],
    workedExample: {
      scenario: 'Compare the trainable parameter count of a 4096 × 4096 attention projection matrix under Full Fine-Tuning vs LoRA with rank r = 8 and scaling α = 16.',
      steps: [
        {
          label: 'Step 1: Full Fine-Tuning parameter count',
          math: 'N_{\\text{full}} = d \\times k = 4096 \\times 4096 = 16,777,216',
          note: 'Over 16.77 million weights in a single projection matrix.'
        },
        {
          label: 'Step 2: LoRA parameter count (A is 8×4096, B is 4096×8)',
          math: 'N_{\\text{LoRA}} = r(d + k) = 8 \\times (4096 + 4096) = 65,536',
          note: 'Only 65,536 trainable weights!'
        },
        {
          label: 'Step 3: Compression ratio and scaling factor α/r',
          math: '\\text{Ratio} = \\frac{16,777,216}{65,536} = 256\\times \\text{ reduction}, \\quad \\text{scale} = \\frac{\\alpha}{r} = \\frac{16}{8} = 2.0',
          note: 'Saves 99.61% of trainable parameters and merges into W_0 at inference.'
        }
      ],
      result: 'LoRA (r=8) trains 65,536 parameters vs 16,777,216 (256× reduction, 0.39% of base matrix).',
      params: {}
    },
    quiz: [
      {
        id: 'lora-q1',
        question: 'In LoRA (ΔW = B · A), why do we initialize A with random Gaussian noise and B = 0, instead of initializing both A and B with random noise?',
        options: [
          'Setting B = 0 makes ΔW = B·A = 0 at step 0 so fine-tuning starts from W_0 cleanly.',
          'Because matrix B is kept permanently frozen while only matrix A is updated.',
          'Because low-rank matrix multiplication requires one factor to be initialized to zero.',
          'To force the adapted linear layer to output zero activations throughout training.'
        ],
        correctIndex: 0,
        explanation: 'At step 0, B = 0 makes ΔW = 0 (identity preservation), while ∂L/∂B = (α/r) dy (Ax)^T is non-zero because A is non-zero!'
      },
      {
        id: 'lora-q2',
        question: 'How much extra inference latency does a LoRA adapter add once you deploy a single fine-tuned model to production?',
        options: [
          'It doubles production inference latency because every linear layer runs twice.',
          'Zero extra latency, since (α/r)B·A is added directly into W_0 before serving.',
          'It multiplies forward-pass latency by a factor of 8 whenever LoRA rank r = 8.',
          'It requires running an Adam optimizer gradient step on every inference query.'
        ],
        correctIndex: 1,
        explanation: 'By linearity of matrix multiplication, W_0 x + (α/r)B A x = (W_0 + (α/r)B A) x = W_merged x.'
      }
    ],
    summary: [
      'LoRA freezes pretrained weights W_0 ∈ R^{d×k} and trains low-rank matrices B ∈ R^{d×r} and A ∈ R^{r×k} (r ≪ d).',
      'Initializing A ~ N(0, σ²) and B = 0 ensures ΔW = 0 at step 0 with non-zero gradients.',
      'At inference time, W_merged = W_0 + (α/r)B A incurs zero additional latency.',
      'QLoRA quantizes frozen W_0 to 4-bit NF4 so billion-parameter LLMs can be fine-tuned on a single consumer GPU.'
    ]
  },

  // =========================================================================
  // TRACK 8 — LESSON 8.3: RETRIEVAL-AUGMENTED GENERATION (RAG)
  // =========================================================================
  'retrieval-augmented-generation-rag': {
    slug: 'retrieval-augmented-generation-rag',
    scene: {
      title: 'An Open-Book Exam Where You Look Up the Exact Textbook Paragraph Before Writing Your Answer',
      narrative:
        'Even a 70B LLM trained up to last year doesn\'t know your university\'s new 2026 exam rules or your company\'s private PDFs—and if forced to answer from memory (Closed-Book), it may hallucinate a confident-sounding fake rule! Retrieval-Augmented Generation (RAG) turns every query into an Open-Book Exam: (1) split your PDFs into overlapping 256-token chunks and store their Embedding vectors in a Vector Index; (2) when a user asks a question q, embed q and retrieve the Top-k chunks with highest Cosine Similarity; and (3) paste those exact paragraphs into the prompt so the LLM answers with verifiable citations!'
    },
    mapping: [
      {
        scenePart: 'Slicing a 50-page syllabus PDF into overlapping paragraph cards',
        modelPart: 'Sliding-Window Document Chunking',
        symbol: 'C_i of length L with overlap O',
        role: 'Overlap O prevents sentences at chunk boundaries from being cut in half'
      },
      {
        scenePart: 'Filing cabinet organized by meaning coordinates',
        modelPart: 'Dense Vector Index (FAISS / HNSW)',
        symbol: 'e_i = Embed(C_i) ∈ R^d',
        role: 'Stores normalized chunk vectors for sub-millisecond similarity search'
      },
      {
        scenePart: 'Pulling the top k cards closest to the student\'s question',
        modelPart: 'Top-k Cosine Retrieval',
        symbol: 'TopK_i cos(Embed(q), e_i)',
        role: 'Finds the most relevant evidence paragraphs before generation begins'
      },
      {
        scenePart: 'Answering strictly from the open textbook pages on the desk',
        modelPart: 'Grounded Context Conditioning',
        symbol: 'P(y | q, C_{i_1}, ..., C_{i_k})',
        role: 'Slashes hallucinations and allows instant knowledge updates without retraining'
      }
    ],
    playWithItPrompt:
      'Open Tab 8.3 ("RAG Retrieval"). Adjust "Passage Window / Chunk Size" and "Boundary Cushion / Overlap" to see how a 2,000-token PDF splits into chunks. Then drag "Student Question Topic Direction (q₁)" to see the live Cosine Similarity scores re-rank the top-k retrieved chunks!',
    analogyBreaks:
      'A human student in an open-book exam knows when a retrieved page is irrelevant and keeps flipping pages, whereas a naive RAG pipeline will blindly stuff whatever Top-k chunks had the highest cosine score into the prompt unless a cross-encoder reranker or relevance threshold filters them.',
    intuition: [
      'RAG vs Fine-Tuning — When to Use Which? Use LoRA Fine-Tuning when you want to change the model\'s *style, tone, output format, or domain skill*. Use RAG when you need the model to answer questions over *frequently updated, private, or citation-critical factual documents* (you can update a RAG vector database in 1 second by inserting new chunks, without any GPU training!).',
      'Why Chunk Overlap Matters: If a chunk boundary falls right between *"The final exam is moved to..."* and *"...November 24 in Hall B"*, zero overlap splits the subject from the date! Using a 15–25% overlap (e.g. chunkSize = 256, overlap = 64) ensures every sentence appears complete in at least one chunk.',
      'Hybrid Search (Dense Embeddings + BM25 Keyword Match) & Reranking: Dense cosine embeddings excel at semantic synonyms (*"automobile"* ≈ *"car"*), while sparse BM25 excels at exact part numbers, course codes (*"CS-402"*), and names. Production RAG systems combine both and pass the top 20 candidates through a Cross-Encoder Reranker to select the best 3–5 chunks.'
    ],
    mathFormulas: [
      {
        name: 'Sliding-Window Chunk Count with Overlap',
        latex: 'N_{\\text{chunks}} = 1 + \\left\\lceil \\frac{N_{\\text{tokens}} - L}{L - O} \\right\\rceil \\quad (\\text{for } N_{\\text{tokens}} > L)',
        explanation: 'With document length N_tokens, chunk size L, and overlap O, each new chunk advances by stride S = L - O tokens.'
      },
      {
        name: 'Top-k Dense Retrieval & Marginalized RAG Generation',
        latex: '\\mathcal{R}_k(q) = \\operatorname*{arg\\,top\\text{-}k}_{i \\in \\{1..M\\}} \\frac{\\mathbf{e}(q)^\\top \\mathbf{e}(C_i)}{\\|\\mathbf{e}(q)\\|_2 \\|\\mathbf{e}(C_i)\\|_2}, \\qquad y^* = \\arg\\max_y P_{\\text{LLM}}(y \\mid q, \\mathcal{R}_k(q))',
        explanation: 'Retrieves the k chunks with highest cosine similarity to the query embedding and conditions autoregressive generation on them.'
      }
    ],
    workedExample: {
      scenario: 'A syllabus document has N = 1,000 tokens. You split it using chunk size L = 200 tokens and overlap O = 50 tokens. How many chunks are created?',
      steps: [
        {
          label: 'Step 1: Compute Sliding Stride S = L - O',
          math: 'S = 200 - 50 = 150\\text{ tokens per step}',
          note: 'Each subsequent chunk starts 150 tokens after the previous one.'
        },
        {
          label: 'Step 2: Apply Ceiling Formula for Remaining Tokens (N - L)',
          math: 'N_{\\text{chunks}} = 1 + \\left\\lceil \\frac{1000 - 200}{150} \\right\\rceil = 1 + \\lceil 5.333 \\rceil = 1 + 6 = 7\\text{ chunks}',
          note: '7 overlapping chunks cover the entire 1,000-token document.'
        }
      ],
      result: '7 overlapping chunks are indexed.',
      params: {}
    },
    quiz: [
      {
        id: 'rag-q1',
        question: 'Your hospital updates its medicine inventory every 10 minutes and needs an LLM assistant that cites the exact current stock count without hallucinating. Should you use RAG or Full Fine-Tuning?',
        options: [
          'Increase the BPE vocabulary size.',
          'Full Fine-Tuning from scratch every 10 minutes.',
          'Set Temperature to 5.0.',
          'RAG (Retrieval-Augmented Generation).'
        ],
        correctIndex: 3,
        explanation: 'RAG decouples dynamic factual memory (stored in an instant-update index) from the LLM\'s reasoning weights.'
      },
      {
        id: 'rag-q2',
        question: 'Why do we include a 15–20% token overlap (e.g. 50 tokens of overlap for 256-token chunks) when splitting documents for a RAG pipeline?',
        options: [
          'Because cosine similarity is undefined unless document chunks share tokens.',
          'To compress the dense vector index so that it consumes 50% less system RAM.',
          'To keep sentences at chunk boundaries intact so semantic context is preserved.',
          'To force all boundary token embeddings to cancel out to the zero vector.'
        ],
        correctIndex: 2,
        explanation: 'Without overlap, a key subject at the end of Chunk i and its predicate at the start of Chunk i+1 get separated, hurting retrieval recall.'
      }
    ],
    summary: [
      'RAG turns closed-book generation into open-book synthesis by retrieving relevant chunks before generating.',
      'Sliding-window chunking with overlap preserves context across chunk boundaries.',
      'Combining dense cosine embeddings with keyword search (BM25) and cross-encoder reranking maximizes retrieval precision.',
      'Build your own end-to-end pipeline in the Track 8 Project: Chat With Your Syllabus / PDF (RAG)!'
    ]
  },

  // =========================================================================
  // TRACK 8 — LESSON 8.4: REINFORCEMENT LEARNING BASICS AND RLHF
  // =========================================================================
  'reinforcement-learning-and-rlhf': {
    slug: 'reinforcement-learning-and-rlhf',
    scene: {
      title: 'Comparing Two Delivery Replies (Bradley-Terry Reward) While Keeping a Safety Leash (KL Penalty)',
      narrative:
        'A base LLM pretrained on raw internet text only knows how to autocomplete—if you ask "How do I fix my code?", it might autocomplete with three more questions instead of a helpful answer! How do we align it with human preferences? First, Supervised Fine-Tuning (SFT) teaches the assistant format. Next, because humans are bad at assigning calibrated numeric scores ("is this essay a 7.3 or 7.8?") but great at pairwise comparisons ("Reply A is better than Reply B"), we train a Reward Model r_ϕ(x, y) using the Bradley-Terry loss -log σ(r(x, y_w) - r(x, y_l)). Finally, we optimize the LLM to maximize reward while keeping a KL Divergence leash β · D_KL(π_θ || π_ref) so it doesn\'t "reward-hack" into gibberish (or we optimize preferences directly via DPO)!'
    },
    mapping: [
      {
        scenePart: 'Human rater picking Winning Reply y_w over Losing Reply y_l',
        modelPart: 'Bradley-Terry Preference Probability',
        symbol: 'P(y_w ≻ y_l | x) = σ(r_ϕ(x, y_w) - r_ϕ(x, y_l))',
        role: 'Converts scalar reward difference into a win probability in (0, 1)'
      },
      {
        scenePart: 'Training the judge to score winning replies higher than losers',
        modelPart: 'Reward Model Loss',
        symbol: 'L_RM = -log σ(r_w - r_l)',
        role: 'Convex loss w.r.t the reward margin Δr = r_w - r_l'
      },
      {
        scenePart: 'Safety leash keeping the aligned model close to the SFT reference',
        modelPart: 'KL Divergence Penalty (PPO / RLHF)',
        symbol: 'J(θ) = E[r_ϕ(x, y)] - β D_KL(π_θ || π_ref)',
        role: 'Prevents the policy π_θ from exploiting blind spots in the reward model'
      },
      {
        scenePart: 'Aligning the LLM directly on preference pairs without a separate judge',
        modelPart: 'Direct Preference Optimization (DPO)',
        symbol: 'L_DPO(π_θ; π_ref)',
        role: 'Closed-form alignment objective requiring no separate reward model or PPO loop!'
      }
    ],
    playWithItPrompt:
      'Open Tab 8.4 ("RLHF & DPO"). Drag "Helpful Reply Score / Chosen Reward (r_w)" above "Unhelpful Reply Score / Rejected Reward (r_l)" to watch P(y_w ≻ y_l) climb toward 100% and Bradley-Terry Loss drop! Then slide "Leash to Base Model / KL Weight (β)" to see how the KL penalty regularizes the total RLHF objective.',
    analogyBreaks:
      'When you train a pet with treats, the pet cannot rewrite your brain\'s definition of a good trick, whereas an unregularized LLM (β = 0) will quickly discover adversarial string patterns ("reward hacking") that trick a neural Reward Model into outputting +999 for repetitive nonsense!',
    intuition: [
      'The 3-Stage Modern Alignment Pipeline: (1) Pretraining on trillions of tokens (next-token prediction) builds world knowledge; (2) Supervised Fine-Tuning (SFT) on high-quality (prompt, ideal_response) demonstrations teaches instruction-following; (3) Preference Alignment (RLHF / DPO) teaches helpfulness, harmlessness, and reasoning depth.',
      'Why Pairwise Comparisons (Bradley-Terry)? If 10 human annotators grade essays on a 1–10 scale, every annotator has a different internal baseline. Asking *"Which of these two responses (y_w, y_l) to prompt x is better?"* yields far higher inter-annotator agreement. The Bradley-Terry model defines P(y_w ≻ y_l | x) = σ(r(x, y_w) - r(x, y_l)).',
      'Why the KL Penalty β · D_KL(π_θ || π_ref) Is Mandatory: The Reward Model r_ϕ(x, y) is only an imperfect neural proxy for human judgment. By Goodhart\'s Law, if the policy π_θ drifts too far from the SFT reference π_ref, it finds out-of-distribution gibberish that scores artificially high reward (Reward Hacking).',
      'Direct Preference Optimization (DPO, Rafailov et al., 2023): By solving for the optimal KL-constrained policy analytically, DPO expresses the reward margin directly in terms of log-probability ratios β log(π_θ(y|x) / π_ref(y|x)), training the LLM on (x, y_w, y_l) pairs with simple binary cross-entropy—no separate Reward Model or PPO reinforcement loop required!'
    ],
    mathFormulas: [
      {
        name: 'Bradley-Terry Reward Model Objective & Gradients',
        latex: '\\mathcal{L}_{\\text{RM}}(\\boldsymbol{\\phi}) = -\\log \\sigma\\!\\left(r_{\\boldsymbol{\\phi}}(x, y_w) - r_{\\boldsymbol{\\phi}}(x, y_l)\\right), \\qquad \\frac{\\partial \\mathcal{L}_{\\text{RM}}}{\\partial r_w} = \\sigma(r_w - r_l) - 1 = -\\frac{\\partial \\mathcal{L}_{\\text{RM}}}{\\partial r_l}',
        explanation: 'Pushes chosen reward r_w up and rejected reward r_l down in equal and opposite measure proportional to error (1 - P(y_w ≻ y_l)).'
      },
      {
        name: 'KL-Regularized RLHF & Direct Preference Optimization (DPO)',
        latex: '\\mathcal{L}_{\\text{DPO}}(\\pi_{\\boldsymbol{\\theta}}; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l)}\\!\\left[\\log \\sigma\\!\\left(\\beta \\log \\frac{\\pi_{\\boldsymbol{\\theta}}(y_w\\mid x)}{\\pi_{\\text{ref}}(y_w\\mid x)} - \\beta \\log \\frac{\\pi_{\\boldsymbol{\\theta}}(y_l\\mid x)}{\\pi_{\\text{ref}}(y_l\\mid x)}\\right)\\right]',
        explanation: 'DPO optimizes the exact same KL-constrained preference objective as PPO-RLHF using only supervised log-probabilities.'
      }
    ],
    workedExample: {
      scenario: 'For a coding prompt x, a Reward Model scores the helpful reply r_w = 2.0 and the buggy reply r_l = 0.5. Compute the win probability P(y_w ≻ y_l), the Bradley-Terry loss L_RM, and the gradient ∂L_RM / ∂r_w.',
      steps: [
        {
          label: 'Step 1: Compute Reward Margin Δr and Win Probability',
          math: '\\Delta r = 2.0 - 0.5 = 1.500 \\implies P(y_w \\succ y_l) = \\sigma(1.500) = \\frac{1}{1 + e^{-1.5}} \\approx 0.8176',
          note: 'Reward model assigns 81.76% win probability to the chosen reply.'
        },
        {
          label: 'Step 2: Compute Bradley-Terry Loss L_RM',
          math: '\\mathcal{L}_{\\text{RM}} = -\\ln(0.8176) \\approx 0.2014',
          note: 'Low loss because r_w is already well above r_l.'
        },
        {
          label: 'Step 3: Compute Analytical Gradients w.r.t r_w and r_l',
          math: '\\frac{\\partial \\mathcal{L}_{\\text{RM}}}{\\partial r_w} = 0.8176 - 1 = -0.1824, \\quad \\frac{\\partial \\mathcal{L}_{\\text{RM}}}{\\partial r_l} = +0.1824',
          note: 'Gradient descent (-η · ∂L/∂r) nudges r_w higher and r_l lower.'
        }
      ],
      result: 'P(y_w ≻ y_l) = 81.76%, L_RM = 0.2014, ∂L/∂r_w = -0.1824.',
      params: {}
    },
    quiz: [
      {
        id: 'rlhf-q1',
        question: 'What happens during RLHF policy optimization if you remove the KL divergence penalty (setting β = 0) and let the LLM purely maximize the neural Reward Model score r_ϕ(x, y)?',
        options: [
          'Reward Hacking (Goodhart\'s Law).',
          'The LLM remains identical to the base pretrained model.',
          'Training finishes in 1 step with perfect grammar.',
          'The vocabulary size shrinks by half.'
        ],
        correctIndex: 0,
        explanation: 'Because r_ϕ is only an approximate proxy trained on finite comparisons, unconstrained optimization quickly steps outside the distribution where r_ϕ is valid.'
      },
      {
        id: 'rlhf-q2',
        question: 'Why has Direct Preference Optimization (DPO) become a popular alternative to PPO-based RLHF for aligning open-weights LLMs?',
        options: [
          'DPO removes the KL divergence reference model constraint completely (β = 0).',
          'DPO trains without requiring any human preference pairs (y_w, y_l) at all.',
          'DPO quantizes all policy network weights into discrete 4-bit integer values.',
          'DPO expresses the reward margin directly via policy and reference log-ratios.'
        ],
        correctIndex: 3,
        explanation: 'DPO achieves the exact same optimal policy as KL-regularized RLHF while requiring only 2 models in memory (π_θ and frozen π_ref) instead of 4 (Actor, Critic, Reward, Reference).'
      }
    ],
    summary: [
      'LLM alignment progresses through Pretraining → Supervised Fine-Tuning (SFT) → Preference Optimization (RLHF / DPO).',
      'The Bradley-Terry model converts pairwise human preferences (y_w ≻ y_l) into a differentiable loss -log σ(r_w - r_l).',
      'A KL divergence penalty β · D_KL(π_θ || π_ref) prevents reward hacking and language degeneration.',
      'Direct Preference Optimization (DPO) aligns policies directly from preference pairs without a separate reward model.'
    ]
  },

  // =========================================================================
  // TRACK 1 — LESSON 1.1: LINEAR REGRESSION
  // =========================================================================
  'linear-regression': {
    slug: 'linear-regression',
    scene: {
      title: 'Reverse-Engineering a Bengaluru Auto-Rickshaw Meter: Base Flag-Down Fare (b) + Per-Kilometer Rate (w)',
      narrative:
        'Suppose you take 5 auto-rickshaw rides of distances x = [1, 2, 4, 6, 8] km and pay fares y = [₹45, ₹60, ₹90, ₹120, ₹150]. Every meter follows a simple rule: Predicted Fare ŷ = w · x + b, where b is the Base Flag-Down Charge at 0 km and w is the Per-Kilometer Rate! Ordinary Least Squares (OLS) chooses the exact slope w* and intercept b* that minimize the Mean Squared Error (1/N) Σ(ŷ_i - y_i)²—which you can solve either in one shot via the Normal Equations or step-by-step via Gradient Descent!'
    },
    mapping: [
      {
        scenePart: 'Ride distance in kilometers',
        modelPart: 'Input Feature',
        symbol: 'x_i ∈ R',
        role: 'Independent explanatory variable'
      },
      {
        scenePart: 'Per-kilometer rate + Base meter flag-down charge',
        modelPart: 'Slope Weight & Intercept Bias',
        symbol: 'ŷ_i = w x_i + b',
        role: 'Learnable linear parameters defining the regression line'
      },
      {
        scenePart: 'Average squared rupee gap between meter and actual fare',
        modelPart: 'Mean Squared Error (MSE)',
        symbol: 'L(w, b) = (1/N) Σ (w x_i + b - y_i)²',
        role: 'Strictly convex bowl with a unique global minimum'
      },
      {
        scenePart: 'Fraction of fare variation explained by distance',
        modelPart: 'Coefficient of Determination',
        symbol: 'R² = 1 - SS_res / SS_tot',
        role: 'Equals 1.0 for a perfect linear fit and 0.0 for predicting the mean ȳ'
      }
    ],
    playWithItPrompt:
      'In Tab 1.1 ("Linear Regression"), drag "Per-Kilometer Rate / Slope (w)" and "Base Meter Flag-Down / Intercept (b)" to reduce MSE Loss and push R² toward 1.0000—or click "Snap to Closed-Form OLS Solution" to jump straight to w* = ₹15/km, b* = ₹30 where ∂L/∂w = 0 and ∂L/∂b = 0!',
    analogyBreaks:
      'An official auto meter has a fixed government tariff card with zero randomness, whereas real-world housing or salary datasets contain unmeasured factors and noise, and extrapolating a linear line to x = -10 km or x = 10,000 km produces absurd predictions.',
    intuition: [
      'Linear Regression Is a 1-Neuron Network with Identity Activation: The equation ŷ = w^T x + b is literally a single artificial neuron without a non-linear activation function!',
      'Why Square the Residuals ((ŷ_i - y_i)²)? (1) Squaring makes positive and negative errors both positive; (2) it is smoothly differentiable everywhere (unlike |ŷ_i - y_i|); and (3) under Gaussian target noise y = w^T x + b + ε with ε ~ N(0, σ²), minimizing Mean Squared Error is mathematically identical to Maximum Likelihood Estimation (MLE)!',
      'Closed-Form Normal Equation vs Gradient Descent: For D features, setting ∇_w L = 0 gives the analytical Normal Equation w* = (X^T X)^{-1} X^T y. When D ≤ 2,000, w* solves in milliseconds; when D = 100,000, inverting X^T X (O(D³)) is too slow, so we use Gradient Descent (O(N D) per step).'
    ],
    mathFormulas: [
      {
        name: 'MSE Loss & Analytical Parameter Gradients',
        latex: '\\mathcal{L}(w, b) = \\frac{1}{N}\\sum_{i=1}^N (wx_i + b - y_i)^2, \\qquad \\frac{\\partial \\mathcal{L}}{\\partial w} = \\frac{2}{N}\\sum_{i=1}^N (\\hat{y}_i - y_i)x_i, \\qquad \\frac{\\partial \\mathcal{L}}{\\partial b} = \\frac{2}{N}\\sum_{i=1}^N (\\hat{y}_i - y_i)',
        explanation: 'Setting both partial derivatives to zero yields the unique global OLS optimum.'
      },
      {
        name: 'Closed-Form 1D OLS & Matrix Normal Equation',
        latex: 'w^* = \\frac{\\sum_{i=1}^N (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum_{i=1}^N (x_i - \\bar{x})^2}, \\quad b^* = \\bar{y} - w^*\\bar{x}, \\qquad \\mathbf{w}^* = (\\mathbf{X}^\\top \\mathbf{X})^{-1}\\mathbf{X}^\\top \\mathbf{y}',
        explanation: 'Solves for optimal slope and intercept directly without iterative learning rates.'
      }
    ],
    workedExample: {
      scenario: 'Given 3 auto rides x = [1, 2, 3] km with fares y = [45, 60, 75] rupees, compute the exact OLS slope w* and base fare b*.',
      steps: [
        {
          label: 'Step 1: Compute sample means x̄ and ȳ',
          math: '\\bar{x} = \\frac{1 + 2 + 3}{3} = 2.0\\text{ km}, \\quad \\bar{y} = \\frac{45 + 60 + 75}{3} = 60.0\\text{ rupees}',
          note: 'The OLS regression line always passes directly through the centroid (x̄, ȳ) = (2, 60).'
        },
        {
          label: 'Step 2: Compute covariance numerator and variance denominator',
          math: '\\sum (x_i - \\bar{x})(y_i - \\bar{y}) = (-1)(-15) + (0)(0) + (1)(15) = 30, \\quad \\sum (x_i - \\bar{x})^2 = (-1)^2 + 0^2 + 1^2 = 2',
          note: 'Sum of cross-deviations is 30; sum of squared x-deviations is 2.'
        },
        {
          label: 'Step 3: Solve for w* and b*',
          math: 'w^* = \\frac{30}{2} = 15.0\\text{ Rs/km}, \\quad b^* = 60.0 - 15.0(2.0) = 30.0\\text{ Rs}',
          note: 'Exact fit with MSE = 0 and R² = 1.00.'
        }
      ],
      result: 'w* = ₹15/km, b* = ₹30 base fare, R² = 1.00.',
      params: {}
    },
    quiz: [
      {
        id: 'lin-q1',
        question: 'When is it better to train Linear Regression using iterative Gradient Descent (SGD) instead of the closed-form Normal Equation w* = (X^T X)^{-1} X^T y?',
        options: [
          'When the dataset has tiny dimensions such as N = 10 rows and D = 2 features.',
          'When feature count D is huge, because inverting the D×D matrix X^T X costs O(D³).',
          'Because the Normal Equation only works for classification.',
          'Because Gradient Descent does not require a learning rate.'
        ],
        correctIndex: 1,
        explanation: 'Matrix inversion scales cubically O(D³) with feature count D; first-order gradient methods scale linearly O(ND).'
      },
      {
        id: 'lin-q2',
        question: 'Your linear regression model achieves R² = 0.00 on the test set. What does R² = 0.00 mean?',
        options: [
          'The model performs no better than predicting the constant target mean ȳ.',
          'The model achieves zero Mean Squared Error on every training data point.',
          'Every learned regression slope weight w_j is exactly equal to positive one.',
          'The target variable y has zero variance across the entire evaluation dataset.'
        ],
        correctIndex: 0,
        explanation: 'Since R² = 1 - SS_res / SS_tot, R² = 0 means your model\'s squared error SS_res is just as large as predicting the constant mean ȳ.'
      }
    ],
    summary: [
      'Linear regression models continuous targets via ŷ = w^T x + b and minimizes Mean Squared Error.',
      'Closed-form OLS w* = (X^T X)^{-1} X^T y solves small/medium feature tables in one step; Gradient Descent scales to massive dimensions.',
      'R² = 1 - SS_res/SS_tot measures the fraction of target variance explained by the model.',
      'Apply this in the Track 1 Project: House Price Predictor (Indian Cities Edition)!'
    ]
  },

  // =========================================================================
  // TRACK 1 — LESSON 1.2: LOGISTIC REGRESSION
  // =========================================================================
  'logistic-regression': {
    slug: 'logistic-regression',
    scene: {
      title: 'Predicting the Probability of Bunking an 8 AM Lecture When Monsoon Rain Hits',
      narrative:
        'What if your target y isn\'t a rupee amount, but a Yes/No binary outcome y ∈ {0, 1}—like "Will a customer churn?" or "Will I bunk tomorrow\'s 8 AM class if it pours rain?" A straight line w·x + b outputs unbounded numbers like -4.2 or +9.7, which aren\'t valid probabilities! Logistic Regression computes a linear score z = w·x + b (the Log-Odds) and squashes it through the Sigmoid curve σ(z) = 1 / (1 + e^{-z}) into a clean probability p ∈ (0, 1). And instead of MSE, it optimizes Binary Cross-Entropy (BCE) so the loss bowl stays strictly convex!'
    },
    mapping: [
      {
        scenePart: 'Unbounded linear persuasion score for saying Yes',
        modelPart: 'Logit / Log-Odds',
        symbol: 'z = w^T x + b = log(p / (1 - p))',
        role: 'z = 0 means 50/50 odds; z > 0 favors class 1; z < 0 favors class 0'
      },
      {
        scenePart: 'Squashing any score z smoothly into 0%–100%',
        modelPart: 'Logistic Sigmoid Function',
        symbol: 'p = σ(z) = 1 / (1 + e^{-z}) ∈ (0, 1)',
        role: 'Maps (-∞, +∞) monotonically onto (0, 1) with derivative p(1 - p)'
      },
      {
        scenePart: 'Heavy penalty for being 99% confident and wrong',
        modelPart: 'Binary Cross-Entropy (Log Loss)',
        symbol: 'L_BCE = -[y log p + (1 - y) log(1 - p)]',
        role: 'Convex loss with clean gradient ∂L/∂w = (p - y) x'
      },
      {
        scenePart: 'Cutoff percentage where you officially stay in bed',
        modelPart: 'Decision Threshold',
        symbol: 'ŷ = 1 if p ≥ τ else 0',
        role: 'Default τ = 0.5; lowering τ increases Recall at the cost of Precision'
      }
    ],
    playWithItPrompt:
      'Open Tab 1.2 ("Logistic Regression"). Drag "Morning Rain Intensity / Feature (x)" and "Rain Sensitivity / Weight (w)" to see the Log-Odds z, Sigmoid Probability σ(z), and BCE Loss update! Then slide "Classification Cutoff / Threshold (τ)" to see when Decision flips between Class 0 and Class 1.',
    analogyBreaks:
      'A human student might suddenly change their mind based on a single WhatsApp message from a friend, whereas Logistic Regression can only draw a single flat linear boundary (w^T x + b = 0) in feature space unless interaction features are engineered.',
    intuition: [
      'Why Not Use Linear Regression + MSE for Binary Classification? (1) Linear predictions w^T x + b can be < 0 or > 1; (2) a single extreme outlier far on the right pulls the whole MSE line and shifts the 0.5 decision boundary; and (3) if you put Sigmoid σ(w^T x + b) inside Mean Squared Error (σ(z) - y)², the loss surface becomes non-convex with flat saturated plateaus!',
      'Why Binary Cross-Entropy + Sigmoid Is Magical: When you differentiate L_BCE = -[y ln σ(z) + (1 - y) ln(1 - σ(z))] with respect to z, the σ(z)(1 - σ(z)) numerator from the Sigmoid derivative cancels out the denominator completely, leaving the remarkably simple, linear-looking gradient: ∂L/∂z = σ(z) - y = p - y!',
      'Interpreting Weights as Odds Ratios: Because ln(p / (1 - p)) = w^T x + b, increasing feature x_j by +1 unit multiplies the odds p / (1 - p) by exp(w_j). This interpretability makes Logistic Regression the gold standard in credit scoring and clinical risk models.'
    ],
    mathFormulas: [
      {
        name: 'Log-Odds & Logistic Sigmoid',
        latex: 'p = \\sigma(z) = \\frac{1}{1 + e^{-z}}, \\qquad \\log\\!\\left(\\frac{p}{1 - p}\\right) = z = \\mathbf{w}^\\top \\mathbf{x} + b',
        explanation: 'The log of the odds ratio p/(1-p) is a strictly linear function of the inputs x.'
      },
      {
        name: 'Binary Cross-Entropy Loss & Exact Gradient Cancellation',
        latex: '\\mathcal{L}_{\\text{BCE}} = -\\big[y\\log p + (1 - y)\\log(1 - p)\\big], \\qquad \\frac{\\partial \\mathcal{L}_{\\text{BCE}}}{\\partial \\mathbf{w}} = (p - y)\\,\\mathbf{x}, \\qquad \\frac{\\partial \\mathcal{L}_{\\text{BCE}}}{\\partial b} = p - y',
        explanation: 'The chain rule cancels σ\'(z) = p(1-p) against the log denominators, yielding a convex loss with no saturation slowdown.'
      }
    ],
    workedExample: {
      scenario: 'For a student with rain intensity x = 2.0 and true label y = 1, evaluate Logistic Regression with w = 1.0, b = -1.0, and compute ∂L/∂w.',
      steps: [
        {
          label: 'Step 1: Compute Logit z and Probability p = σ(z)',
          math: 'z = (1.0)(2.0) - 1.0 = 1.000 \\implies p = \\frac{1}{1 + e^{-1}} \\approx 0.7311',
          note: '73.11% predicted probability of class 1.'
        },
        {
          label: 'Step 2: Compute Binary Cross-Entropy Loss (for y = 1)',
          math: '\\mathcal{L}_{\\text{BCE}} = -\\ln(0.7311) \\approx 0.3133',
          note: 'Loss is 0.3133 nats.'
        },
        {
          label: 'Step 3: Compute Analytical Weight Gradient ∂L/∂w',
          math: '\\frac{\\partial \\mathcal{L}}{\\partial w} = (p - y) x = (0.7311 - 1.0)(2.0) = -0.5379',
          note: 'Negative gradient means increasing w will raise p closer to 1.0 and reduce loss.'
        }
      ],
      result: 'p = 73.11%, L_BCE = 0.3133, ∂L/∂w = -0.5379.',
      params: {}
    },
    quiz: [
      {
        id: 'log-q1',
        question: 'Why do we train Logistic Regression with Binary Cross-Entropy (BCE) loss instead of Mean Squared Error (MSE) loss (σ(z) - y)²?',
        options: [
          'Because Binary Cross-Entropy turns the linear decision boundary into a curve.',
          'Because Mean Squared Error is mathematically undefined on values in (0, 1).',
          'Putting Sigmoid inside MSE creates non-convex vanishing-gradient plateaus.',
          'Because Mean Squared Error always evaluates to a negative loss on binary data.'
        ],
        correctIndex: 2,
        explanation: 'Under MSE, ∂L/∂z = 2(p - y)p(1 - p), which vanishes to 0 when p ≈ 0 even if y = 1! Under BCE, p(1 - p) cancels out so ∂L/∂z = p - y.'
      },
      {
        id: 'log-q2',
        question: 'What is the geometric shape of the decision boundary (where p = 0.50) of a Logistic Regression classifier in D-dimensional feature space?',
        options: [
          'A concentric circular boundary centered at the coordinate origin in R^D.',
          'A non-linear S-shaped decision curve winding through the input feature space.',
          'A flat linear hyperplane defined by w^T x + b = 0 where σ(z) equals 0.50.',
          'A staircase of axis-aligned rectangular boxes partitioning the input coordinates.'
        ],
        correctIndex: 2,
        explanation: 'While the probability surface p(x) is S-shaped, the level set p(x) = τ is w^T x + b = ln(τ/(1-τ)), which is a flat hyperplane!'
      }
    ],
    summary: [
      'Logistic Regression is a linear classifier that models log-odds z = w^T x + b and outputs p = σ(z) ∈ (0, 1).',
      'Binary Cross-Entropy loss is strictly convex and yields the clean gradient ∂L/∂w = (p - y)x.',
      'The decision boundary p = τ corresponds to the linear hyperplane w^T x + b = ln(τ / (1 - τ)).'
    ]
  },

  // =========================================================================
  // TRACK 1 — LESSON 1.3: BIAS-VARIANCE AND EVALUATION METRICS
  // =========================================================================
  'bias-variance-and-evaluation-metrics': {
    slug: 'bias-variance-and-evaluation-metrics',
    scene: {
      title: 'Rote-Memorizing Last Year\'s Question Paper (High Variance) vs Only Reading the 1-Page Syllabus Summary (High Bias)',
      narrative:
        'Imagine two students preparing for the GATE exam: Student A only reads a 3-bullet summary card and tries to guess every physics problem with a straight line (High Bias / Underfitting—misses the real curve even on practice sets). Student B memorizes every single number and typo in last year\'s paper using a degree-15 polynomial (High Variance / Overfitting—scores 100% on yesterday\'s paper, but crashes on tomorrow\'s exam whenever a single number changes!). Expected generalization error is the sum of three terms: Bias² + Variance + Irreducible Noise σ_ε²!'
    },
    mapping: [
      {
        scenePart: 'Systematic error from using a rule that is too rigid/simple',
        modelPart: 'Squared Bias',
        symbol: 'Bias² = (E[f̂(x)] - f(x))²',
        role: 'Decreases monotonically as model complexity / degree increases'
      },
      {
        scenePart: 'Wild swings in the fitted curve when training samples change',
        modelPart: 'Model Variance',
        symbol: 'Var = E[(f̂(x) - E[f̂(x)])²]',
        role: 'Increases as model flexibility grows; reduced by more training data N or regularization'
      },
      {
        scenePart: 'Inherent sensor/human noise no model can ever predict',
        modelPart: 'Irreducible Error',
        symbol: 'σ_ε²',
        role: 'Theoretical floor on test MSE for the given feature set'
      },
      {
        scenePart: 'U-shaped real-exam error curve across model complexity',
        modelPart: 'Total Expected Test Risk',
        symbol: 'E[(y - f̂(x))²] = Bias² + Var + σ_ε²',
        role: 'Minimum sits at the sweet spot balancing Bias² and Variance'
      }
    ],
    playWithItPrompt:
      'Switch to Tab 1.3 ("Bias-Variance"). Drag "Model Flexibility / Polynomial Degree (d)" from 1.0 ("Underfitting (High Bias)") through 3.5 ("Optimal Trade-off") up to 8.5 ("Overfitting (High Variance)") and watch how Bias² drops while Variance climbs to create the U-shaped Total Test Error!',
    analogyBreaks:
      'In classical polynomial regression with small datasets, test error follows a strict U-curve, whereas vastly overparameterized modern deep networks trained with SGD and weight decay can exhibit "Double Descent" where test error drops a second time past the interpolation threshold.',
    intuition: [
      'Exact Mathematical Decomposition: Suppose true targets are generated by y = f(x) + ε where E[ε] = 0 and Var(ε) = σ_ε². Across different random training sets D, our learning algorithm produces an estimator f̂_D(x). Expanding E_{D, ε}[(y - f̂_D(x))²] algebraically proves that cross-terms vanish and total expected MSE equals Bias² + Variance + Irreducible Noise!',
      'How to Cure High Bias (Underfitting): Increase model capacity (more layers/neurons, polynomial/interaction features), reduce regularization λ, or train longer. Note: adding more training rows N does NOT fix high bias if your model is a straight line trying to fit a sine wave!',
      'How to Cure High Variance (Overfitting): Add more training examples N (variance scales as ~1/N), apply L2/L1 regularization or Dropout, prune noisy features, or use Ensembles (Bagging / Random Forests).'
    ],
    mathFormulas: [
      {
        name: 'Bias-Variance Decomposition of Expected Squared Error',
        latex: '\\mathbb{E}_{\\mathcal{D}, \\epsilon}\\!\\left[(y - \\hat{f}_{\\mathcal{D}}(x))^2\\right] = \\underbrace{\\big(\\mathbb{E}_{\\mathcal{D}}[\\hat{f}_{\\mathcal{D}}(x)] - f(x)\\big)^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}_{\\mathcal{D}}\\!\\left[\\big(\\hat{f}_{\\mathcal{D}}(x) - \\mathbb{E}_{\\mathcal{D}}[\\hat{f}_{\\mathcal{D}}(x)]\\big)^2\\right]}_{\\text{Variance}} + \\underbrace{\\sigma_\\epsilon^2}_{\\text{Irreducible Noise}}',
        explanation: 'Decomposes out-of-sample generalization error into systematic approximation error (Bias²), estimation sensitivity (Variance), and noise floor (σ_ε²).'
      }
    ],
    workedExample: {
      scenario: 'At a test point x, the true function is f(x) = 10.0 with noise variance σ_ε² = 0.25. Across 100 bootstrap training runs, your model\'s average prediction is E[f̂(x)] = 9.0 with prediction variance Var(f̂(x)) = 0.40. Compute Total Expected Test MSE.',
      steps: [
        {
          label: 'Step 1: Compute Squared Bias',
          math: '\\text{Bias}^2 = (9.0 - 10.0)^2 = (-1.0)^2 = 1.000',
          note: 'On average, the model systematically underpredicts by 1.0 unit.'
        },
        {
          label: 'Step 2: Sum Bias² + Variance + Irreducible Noise',
          math: '\\text{MSE}_{\\text{test}} = 1.000 + 0.400 + 0.250 = 1.650',
          note: 'Exact expected squared test error.'
        }
      ],
      result: 'Bias² = 1.00, Variance = 0.40, Noise = 0.25 ⇒ Expected Test MSE = 1.65.',
      params: {}
    },
    quiz: [
      {
        id: 'bv-q1',
        question: 'Your linear model has High Bias (both training error and validation error are equally high at 32%). What happens if you collect 10× more training rows without changing the model features or architecture?',
        options: [
          'Validation error will drop all the way to 0% as N grows.',
          'Training and validation error will stay stuck near 32%.',
          'The linear model will begin severely overfitting the noise.',
          'The irreducible observation noise variance σ_ε² will hit 0.'
        ],
        correctIndex: 1,
        explanation: 'More training data shrinks Variance (O(1/N)), but does not reduce approximation Bias; to fix Underfitting you must increase model capacity or engineer better features.'
      },
      {
        id: 'bv-q2',
        question: 'When you increase the L2 regularization penalty λ in Ridge Regression, how do Bias and Variance change?',
        options: [
          'Neither Bias nor Variance changes when λ is increased.',
          'Both Bias and Variance decrease monotonically toward zero.',
          'Model Bias decreases while Estimator Variance increases.',
          'Bias increases slightly while Variance drops significantly.'
        ],
        correctIndex: 3,
        explanation: 'Shrinking weights toward zero restricts hypothesis flexibility (raising Bias slightly) while making predictions much less sensitive to noise in any single training sample (lowering Variance).'
      }
    ],
    summary: [
      'Expected test error decomposes into Bias² (underfitting) + Variance (overfitting) + Irreducible Noise σ_ε².',
      'High Bias is cured by increasing model capacity/features; High Variance is cured by more data, regularization, or bagging.',
      'ROC-AUC and PR-AUC evaluate classifier ranking quality across all possible decision thresholds τ.'
    ]
  },

  // =========================================================================
  // TRACK 1 — LESSON 1.4: DECISION TREES AND RANDOM FORESTS
  // =========================================================================
  'decision-trees-and-random-forests': {
    slug: 'decision-trees-and-random-forests',
    scene: {
      title: 'Playing 20 Questions to Separate Pure Groups (Decision Tree), Then Polling 100 Friends (Random Forest)',
      narrative:
        'A Decision Tree classifies data by playing a greedy game of 20 Yes/No Questions ("Is Monthly Tenure < 6 months?", "Is Support Calls > 3?"). At every node, it picks the exact feature and threshold that makes the left and right child groups as pure as possible—maximizing Information Gain (or Gini Impurity drop)! A single deep tree has very low bias but huge variance (memorizing every quirky training row). A Random Forest fixes this by training B = 100 trees on bootstrapped data samples and random feature subsets, then taking the majority vote—slashing variance without increasing bias!'
    },
    mapping: [
      {
        scenePart: 'How mixed up a group of Yes/No customers is',
        modelPart: 'Gini Impurity & Shannon Entropy',
        symbol: 'G = 1 - Σ p_k², H = -Σ p_k log₂ p_k',
        role: 'Equals 0 for a 100% pure node and reaches maximum (G=0.5, H=1 bit) at a 50/50 split'
      },
      {
        scenePart: 'How much cleaner the groups get after asking Question 1',
        modelPart: 'Information Gain / Gini Reduction',
        symbol: 'ΔI = I_parent - (N_L/N I_L + N_R/N I_R)',
        role: 'Greedy criterion maximized over all candidate features and split thresholds'
      },
      {
        scenePart: 'Polling B independent friends and averaging their answers',
        modelPart: 'Bagging + Feature Subsampling (Random Forest)',
        symbol: 'Var(f̄) = ρ σ² + ((1 - ρ) / B) σ²',
        role: 'Random feature subsets lower tree correlation ρ so averaging B trees slashes variance!'
      }
    ],
    playWithItPrompt:
      'Open Tab 1.4 ("Trees & Forests"). Drag "Left Branch Positives (out of 10)" to 10 (a 100% pure split where all 10 positives go left and all 10 negatives go right): watch Child Gini hit 0.000, Gini Gain hit +0.500, and Info Gain hit +1.000 bit! Then increase "Number of Friends Polled / Forest Trees (B)" to see the Forest Variance Multiplier shrink!',
    analogyBreaks:
      'A human playing 20 Questions can ask diagonal or relational questions ("Is salary higher than rent?"), whereas a standard CART Decision Tree only makes axis-aligned orthogonal cuts (x_j ≤ t), requiring a staircase of many splits to approximate a diagonal line.',
    intuition: [
      'How CART Picks a Split: At a node with N samples, a Decision Tree scans every feature j and every midpoint threshold t between sorted values, computing the weighted impurity of the resulting Left (x_j ≤ t) and Right (x_j > t) children. It greedily chooses the (j*, t*) that maximizes impurity reduction.',
      'Gini Impurity vs Shannon Entropy: For binary classification with positive fraction p, Gini(p) = 2p(1 - p) (peaks at 0.50 when p = 0.5) and Entropy(p) = -p log₂ p - (1-p) log₂(1-p) (peaks at 1.00 bit when p = 0.5). Both are 0 when the node is pure (p = 0 or p = 1).',
      'Why Random Forests Subsample Features (max_features = √D) at Every Split: If you only bootstrap rows (Bagging) and one feature (say, Credit_Score) is super strong, every single tree will pick Credit_Score at its root—making all B trees highly correlated (ρ ≈ 1), so averaging them barely reduces variance! By restricting each split to a random subset of √D candidate features, Random Forests (Breiman, 2001) decorrelate the trees (ρ ↓), driving ensemble variance (ρ + (1-ρ)/B) σ² way down!'
    ],
    mathFormulas: [
      {
        name: 'Gini Impurity & Shannon Entropy',
        latex: 'G(S) = 1 - \\sum_{k=1}^{K} p_k^2, \\qquad H(S) = -\\sum_{k=1}^{K} p_k \\log_2(p_k)',
        explanation: 'Quantifies class heterogeneity at node S; both equal 0 when all samples belong to a single class.'
      },
      {
        name: 'Information Gain & Random Forest Ensemble Variance',
        latex: '\\text{IG}(S, A) = H(S) - \\sum_{v \\in \\{L, R\\}} \\frac{|S_v|}{|S|} H(S_v), \\qquad \\text{Var}\\!\\left(\\frac{1}{B}\\sum_{b=1}^B T_b(x)\\right) = \\rho\\sigma^2 + \\frac{1 - \\rho}{B}\\sigma^2',
        explanation: 'As number of trees B → ∞, the second variance term vanishes and remaining variance is governed by inter-tree correlation ρ.'
      }
    ],
    workedExample: {
      scenario: 'A parent node has 10 Churners (+) and 10 Non-Churners (-). A split on "Tenure < 6 months" sends (8+, 2-) to the Left child and (2+, 8-) to the Right child. Compute the Gini Gain.',
      steps: [
        {
          label: 'Step 1: Compute Parent Gini Impurity (10+, 10-)',
          math: 'G_{\\text{parent}} = 1 - (0.5^2 + 0.5^2) = 1 - 0.50 = 0.500',
          note: 'Maximum binary Gini impurity at 50/50 mix.'
        },
        {
          label: 'Step 2: Compute Left (8+, 2-) and Right (2+, 8-) Child Gini',
          math: 'G_L = 1 - (0.8^2 + 0.2^2) = 1 - (0.64 + 0.04) = 0.320 = G_R',
          note: 'Each child is 80% pure, lowering Gini from 0.50 to 0.32.'
        },
        {
          label: 'Step 3: Compute Weighted Child Gini & Gini Gain',
          math: '\\Delta G = 0.500 - \\left(\\frac{10}{20}(0.320) + \\frac{10}{20}(0.320)\\right) = 0.500 - 0.320 = +0.180',
          note: 'Splitting on Tenure reduces Gini impurity by +0.180.'
        }
      ],
      result: 'Parent Gini = 0.500, Child Gini = 0.320, Gini Gain = +0.180.',
      params: {}
    },
    quiz: [
      {
        id: 'tree-q1',
        question: 'In a Random Forest, why do we restrict each node split to only consider a random subset of √D features instead of all D features?',
        options: [
          'To decorrelate the trees (lowering pairwise correlation ρ).',
          'Because Decision Trees cannot handle more than 3 features.',
          'To intentionally increase the Bias of each individual tree.',
          'Because Gini impurity is undefined for D features.'
        ],
        correctIndex: 0,
        explanation: 'By the variance formula ρ σ² + ((1-ρ)/B) σ², reducing inter-tree correlation ρ via random feature subspaces is what makes Random Forests outperform plain Bagging.'
      },
      {
        id: 'tree-q2',
        question: 'Can a Random Forest extrapolate a rising linear trend (like inflation-adjusted house prices in 2035) to feature values larger than anything seen in the training set?',
        options: [
          'Yes, Random Forests extrapolate linear trends more accurately than Linear Regression.',
          'No, leaf predictions average training targets and stay bounded in [y_min, y_max].',
          'Yes, provided the trees split using Shannon Entropy rather than Gini Impurity.',
          'Yes, whenever the forest ensemble contains more than B = 500 decision trees.'
        ],
        correctIndex: 1,
        explanation: 'Tree ensembles partition space into axis-aligned boxes with constant piecewise predictions; outside the training bounding box, they predict the outermost leaf constant.'
      }
    ],
    summary: [
      'Decision Trees recursively split feature space to maximize Information Gain / Gini reduction.',
      'Deep unpruned trees have low bias and high variance; Random Forests reduce variance via Bagging + random feature subsets.',
      'Tree models are invariant to monotonic feature scaling but cannot extrapolate beyond the range of training targets.',
      'Compare Logistic Regression vs Random Forest in the Track 1 Project: Telco Customer Churn!'
    ]
  },

  // =========================================================================
  // TRACK 1 — LESSON 1.5: k-MEANS AND PCA
  // =========================================================================
  'kmeans-and-pca': {
    slug: 'kmeans-and-pca',
    scene: {
      title: 'Seating Wedding Guests Around k Buffet Tables (k-Means) & Capturing the Best Camera Angle (PCA)',
      narrative:
        'What if your dataset has NO target labels y at all (Unsupervised Learning)? Two classic tasks arise: (1) Clustering (k-Means): seat N wedding guests around k buffet tables (Centroids μ_1..μ_k) by alternating two steps—assign every guest to their nearest table, then move each table to the exact center of its assigned guests—minimizing within-cluster Inertia! (2) Dimensionality Reduction (PCA): rotate your camera to find the orthogonal axes (Eigenvectors of the Covariance Matrix) along which the cloud of points spreads out the most, keeping the top principal components that capture 95%+ of the variance!'
    },
    mapping: [
      {
        scenePart: 'Center coordinates of the k buffet tables',
        modelPart: 'k-Means Cluster Centroids',
        symbol: 'μ_1, ..., μ_k ∈ R^D',
        role: 'Updated iteratively as the mean of points assigned to each cluster'
      },
      {
        scenePart: 'Total squared walking distance from guests to their tables',
        modelPart: 'Within-Cluster Sum of Squares (Inertia)',
        symbol: 'J = Σ_{i=1}^N ||x_i - μ_{c(i)}||₂²',
        role: 'Decreases monotonically at every Assignment and Update step'
      },
      {
        scenePart: 'Camera axis showing the widest spread of the crowd',
        modelPart: 'First Principal Component (PC1)',
        symbol: 'v_1 = argmax_{||v||=1} v^T Σ v',
        role: 'Top eigenvector of covariance matrix Σ = (1/(N-1)) X_c^T X_c'
      },
      {
        scenePart: 'Percentage of crowd spread captured by the first angle',
        modelPart: 'Explained Variance Ratio',
        symbol: 'EVR_1 = λ_1 / Σ_{j=1}^D λ_j',
        role: 'Eigenvalue λ_i equals the exact variance of data projected onto v_i'
      }
    ],
    playWithItPrompt:
      'Open Tab 1.5 ("k-Means & PCA"). Drag "Wedding Table 1 Center (μ₁_x)" and "Wedding Table 2 Center (μ₂_x)" to minimize the k-Means Inertia J! Also inspect the closed-form 2D PCA Eigenvalues λ₁, λ₂ and verify that PC1 captures 99.3%+ of the total variance along the diagonal!',
    analogyBreaks:
      'At a real wedding, tables can be arranged for long curved family groups, whereas standard k-Means uses isotropic Euclidean distance ||x - μ_k||² and can only carve out convex spherical/Voronoi blobs of similar radius.',
    intuition: [
      'Lloyd\'s Algorithm for k-Means: Alternates (1) Assignment Step: assign each point x_i to c(i) = argmin_k ||x_i - μ_k||₂², and (2) Update Step: set μ_k to the mean of points in cluster k (since the sample mean is the unique minimizer of sum of squared Euclidean distances!). Because both steps monotonically decrease the finite non-negative Inertia J, k-Means is guaranteed to converge—though to a local minimum, which is why k-Means++ smart initialization is used.',
      'How to Choose k in k-Means: Since Inertia J always drops as k increases (reaching 0 when k = N), we look for the Elbow Point on the J vs k curve or maximize the Silhouette Score (b - a) / max(a, b).',
      'Principal Component Analysis (PCA): Always center (and standardize!) features first (X_c = X - μ). The sample covariance matrix Σ = (1/(N-1)) X_c^T X_c is symmetric positive semi-definite, so its eigenvectors v_1, ..., v_D are mutually orthogonal (v_i^T v_j = 0), and its eigenvalues λ_1 ≥ λ_2 ≥ ... ≥ λ_D ≥ 0 equal the exact variance along each axis!'
    ],
    mathFormulas: [
      {
        name: 'k-Means Objective (Inertia) & Centroid Update',
        latex: 'J = \\sum_{i=1}^{N} \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_{c(i)}\\|_2^2, \\qquad \\boldsymbol{\\mu}_k = \\frac{1}{|C_k|}\\sum_{i \\in C_k} \\mathbf{x}_i',
        explanation: 'Setting ∂J/∂μ_k = 0 proves the optimal centroid for fixed assignments is the arithmetic mean of cluster C_k.'
      },
      {
        name: 'PCA Covariance Eigendecomposition & Explained Variance Ratio',
        latex: '\\boldsymbol{\\Sigma}\\mathbf{v}_i = \\lambda_i \\mathbf{v}_i, \\qquad \\text{EVR}_i = \\frac{\\lambda_i}{\\sum_{j=1}^{D} \\lambda_j} = \\frac{\\lambda_i}{\\text{Tr}(\\boldsymbol{\\Sigma})}',
        explanation: 'The sum of all eigenvalues equals the trace of the covariance matrix (total variance across all features).'
      }
    ],
    workedExample: {
      scenario: 'A centered 2D dataset has covariance matrix Σ = [[4.0, 0.0], [0.0, 1.0]]. Compute the eigenvalues, principal components, and the Explained Variance Ratio of PC1.',
      steps: [
        {
          label: 'Step 1: Read eigenvalues of the diagonal covariance matrix',
          math: '\\lambda_1 = 4.000, \\quad \\lambda_2 = 1.000',
          note: 'Eigenvectors are v_1 = [1, 0]^T (x-axis) and v_2 = [0, 1]^T (y-axis).'
        },
        {
          label: 'Step 2: Compute Total Variance Tr(Σ) = λ_1 + λ_2',
          math: '\\text{Total Variance} = 4.000 + 1.000 = 5.000',
          note: 'Sum of diagonal variances.'
        },
        {
          label: 'Step 3: Compute Explained Variance Ratio for PC1',
          math: '\\text{EVR}_1 = \\frac{4.000}{5.000} = 0.8000 \\;(80.0\\%)',
          note: 'Projecting 2D points onto the 1D x-axis retains 80% of total dataset variance.'
        }
      ],
      result: 'λ₁ = 4.0, λ₂ = 1.0, Explained Variance Ratio of PC1 = 80.0%.',
      params: {}
    },
    quiz: [
      {
        id: 'km-q1',
        question: 'What happens if you run PCA or k-Means on a table containing [Age (years: 20–60), Annual_Salary (Rupees: 3,00,000–50,00,000)] WITHOUT standardizing the features first?',
        options: [
          'The eigenvalues become negative.',
          'PCA automatically standardizes every column to unit variance.',
          'k-Means is invariant to feature scaling like Decision Trees.',
          'Annual_Salary has a variance ~10¹² times larger than Age.'
        ],
        correctIndex: 3,
        explanation: 'Both k-Means (Euclidean distance) and PCA (variance maximization) are scale-sensitive: always apply StandardScaler before running them on mixed-unit features.'
      },
      {
        id: 'km-q2',
        question: 'Why can\'t we choose the optimal number of clusters k in k-Means simply by picking the k that gives the lowest Inertia J?',
        options: [
          'Because the within-cluster Inertia objective J is always a negative number.',
          'Because within-cluster Inertia J increases monotonically as k grows larger.',
          'Because Inertia J drops monotonically with k and hits 0 trivially at k = N.',
          'Because Lloyd\'s k-Means algorithm is only mathematically defined for k = 2.'
        ],
        correctIndex: 2,
        explanation: 'Adding more centroids can only reduce or keep equal each point\'s distance to its nearest centroid; thus we use the Elbow method or Silhouette score instead of raw minimum J.'
      }
    ],
    summary: [
      'k-Means partitions unlabeled data into k clusters by alternating nearest-centroid assignment and mean updates to minimize Inertia.',
      'PCA projects centered data onto the top orthogonal eigenvectors of the covariance matrix Σ.',
      'The Explained Variance Ratio λ_i / Σλ_j quantifies how much information survives dimensionality reduction.',
      'Always standardize mixed-unit features before running k-Means or PCA!'
    ]
  },

  // =========================================================================
  // TRACK 0 — LESSON 0.1: VECTORS, MATRICES AND DOT PRODUCTS
  // =========================================================================
  'vectors-matrices-and-dot-products': {
    slug: 'vectors-matrices-and-dot-products',
    scene: {
      title: 'Computing a "Taste Match" Score Between Your Music Playlist and a Friend\'s Playlist',
      narrative:
        'Suppose you rate your music taste on two axes: a = [Indie, Classical]. Your friend rates theirs as b = [Indie, Classical]. How do we measure how well your tastes align in a single number? Multiply matching coordinates and add them up: the Dot Product a · b = a₁b₁ + a₂b₂ = ||a|| ||b|| cos(θ)! When both playlists point in the same direction (θ = 0°), cos(θ) = +1; when perpendicular (θ = 90°), a · b = 0; when opposite (θ = 180°), cos(θ) = -1. And what is a Matrix Multiplication W · a? Just a stack of rows where every row computes its own dot product with a in parallel!'
    },
    mapping: [
      {
        scenePart: 'Ordered list of feature numbers [Indie, Classical]',
        modelPart: 'Column Vector',
        symbol: 'a ∈ R^d',
        role: 'Represents a data sample, word embedding, or weight array as a point/arrow in R^d'
      },
      {
        scenePart: 'Raw taste-match sum of coordinate products',
        modelPart: 'Dot Product (Inner Product)',
        symbol: 'a · b = a^T b = Σ_{i=1}^d a_i b_i',
        role: 'Fundamental similarity operation inside every neuron, CNN kernel, and Attention head'
      },
      {
        scenePart: 'Direction-only match score ignoring playlist length',
        modelPart: 'Cosine Similarity',
        symbol: 'cos(θ) = (a · b) / (||a||₂ ||b||₂)',
        role: 'Normalizes dot product by Euclidean lengths ||a||₂ = √(Σ a_i²)'
      },
      {
        scenePart: 'Checking taste match against M friends simultaneously',
        modelPart: 'Matrix-Vector Multiplication',
        symbol: 'y = W a ∈ R^M (where W ∈ R^{M × d})',
        role: 'Row i of W computes w_i^T a; geometrically rotates/stretches space'
      }
    ],
    playWithItPrompt:
      'In Tab 0.1 ("Vectors & Dot Product"), drag "Your Playlist Indie Score (a₁)" and "Your Playlist Classical Score (a₂)" to see the live Dot Product a · b, Cosine Similarity cos(θ), Angle θ in degrees, and Matrix-transformed vector W · a!',
    analogyBreaks:
      'We can draw 2D and 3D arrows on paper with a ruler and protractor, whereas deep learning vectors live in 512 to 4,096 dimensions—where human visual intuition fails, yet the exact same algebraic formula Σ a_i b_i and Cauchy-Schwarz bound |cos θ| ≤ 1 hold unchanged!',
    intuition: [
      'Every Neural Layer Is Built on the Dot Product: Whether it is an artificial neuron (w^T x + b), a 2D convolution patch (⟨X_patch, K⟩), or Transformer Self-Attention (q_i^T k_j / √d_k), 95% of deep learning computation is taking dot products to measure alignment between an input pattern and a learned template!',
      'Algebraic vs Geometric Equivalence: By the Law of Cosines, a · b = ∑ a_i b_i = ||a||₂ ||b||₂ cos(θ). Therefore, if two non-zero vectors are orthogonal (θ = 90°), their dot product is strictly 0.',
      'Matrix Multiplication as Parallel Dot Products & Space Transformation: Multiplying W ∈ R^{M × d} by x ∈ R^d requires that the inner dimensions match (d = d) and produces an M-dimensional vector where entry i is the dot product of row i of W with x. Geometrically, a matrix W shears, scales, and rotates the coordinate grid, scaling areas/volumes by |det(W)|.'
    ],
    mathFormulas: [
      {
        name: 'Euclidean Norm, Dot Product & Cosine Similarity',
        latex: '\\|\\mathbf{a}\\|_2 = \\sqrt{\\sum_{i=1}^d a_i^2}, \\qquad \\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^d a_i b_i = \\|\\mathbf{a}\\|_2\\|\\mathbf{b}\\|_2\\cos(\\theta)',
        explanation: 'Connects algebraic coordinate multiplication with geometric length and angle.'
      },
      {
        name: 'Matrix-Matrix Product (C = A B)',
        latex: 'C_{ij} = (\\mathbf{A}\\mathbf{B})_{ij} = \\sum_{k=1}^{d} A_{ik} B_{kj} = \\text{row}_i(\\mathbf{A}) \\cdot \\text{col}_j(\\mathbf{B}) \\quad (\\mathbf{A}\\in\\mathbb{R}^{m\\times d},\\; \\mathbf{B}\\in\\mathbb{R}^{d\\times n})',
        explanation: 'Entry (i, j) of the product matrix is the dot product of the i-th row of A with the j-th column of B.'
      }
    ],
    workedExample: {
      scenario: 'Given vectors a = [3, 4] and b = [4, 3], compute ||a||₂, ||b||₂, a · b, and cos(θ).',
      steps: [
        {
          label: 'Step 1: Compute Dot Product a · b',
          math: '\\mathbf{a} \\cdot \\mathbf{b} = (3)(4) + (4)(3) = 12 + 12 = 24.0',
          note: 'Sum of coordinate products.'
        },
        {
          label: 'Step 2: Compute Euclidean Norms ||a||₂ and ||b||₂',
          math: '\\|\\mathbf{a}\\|_2 = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5.0, \\quad \\|\\mathbf{b}\\|_2 = \\sqrt{4^2 + 3^2} = 5.0',
          note: 'Both vectors have length 5.0.'
        },
        {
          label: 'Step 3: Compute Cosine Similarity cos(θ)',
          math: '\\cos(\\theta) = \\frac{24.0}{5.0 \\times 5.0} = \\frac{24}{25} = 0.9600 \\implies \\theta \\approx 16.26^\\circ',
          note: 'High positive alignment (only 16.26° apart).'
        }
      ],
      result: 'a · b = 24.0, ||a||₂ = ||b||₂ = 5.0, cos(θ) = 0.9600.',
      params: {}
    },
    quiz: [
      {
        id: 'vec-q1',
        question: 'If matrix A has shape (32 × 768) (a batch of 32 token embeddings of dimension 768) and weight matrix W has shape (768 × 256), what is the shape of the matrix product Y = A · W?',
        options: [
          '(768 × 768)',
          '(32 × 768)',
          '(32 × 256)',
          '(256 × 32)'
        ],
        correctIndex: 2,
        explanation: 'Multiplying (m × d) by (d × n) contracts the matching inner dimension d = 768 via dot products and outputs shape (m × n) = (32 × 256).'
      },
      {
        id: 'vec-q2',
        question: 'Two non-zero feature vectors u and v have a dot product u · v = 0. What does this tell you about the angle θ between them?',
        options: [
          'They are parallel and point in the same direction (θ = 0°).',
          'They are orthogonal and perpendicular to each other (θ = 90°).',
          'They are antiparallel and point in opposite directions (θ = 180°).',
          'They are separated by a diagonal acute angle (θ = 45°).'
        ],
        correctIndex: 1,
        explanation: 'Since u · v = ||u|| ||v|| cos(θ) and ||u||, ||v|| > 0, u · v = 0 implies cos(θ) = 0, so θ = 90° (orthogonal, sharing zero linear correlation).'
      }
    ],
    summary: [
      'The dot product a · b = Σ a_i b_i = ||a|| ||b|| cos(θ) measures directional alignment and projection.',
      'Orthogonal vectors satisfy a · b = 0; parallel unit vectors satisfy a · b = 1.',
      'Matrix multiplication Y = X W computes a batch of dot products in parallel, transforming R^d → R^m.'
    ]
  },

  // =========================================================================
  // TRACK 0 — LESSON 0.2: DERIVATIVES AND GRADIENTS
  // =========================================================================
  'derivatives-and-gradients': {
    slug: 'derivatives-and-gradients',
    scene: {
      title: 'Feeling the Slope of a Hill Under Your Feet in Two Compass Directions',
      narrative:
        'Imagine standing on a grassy hillside at coordinates (x, y) where x is East and y is North, and your altitude is f(x, y). If you freeze your North-South foot and take a tiny step Δx East, the steepness you feel is the Partial Derivative ∂f/∂x. If you freeze your East-West foot and step North, the steepness is ∂f/∂y. Pack both slopes into a single 2D arrow ∇f = [∂f/∂x, ∂f/∂y]^T and you have the Gradient Vector—which ALWAYS points in the direction of steepest uphill climb! To walk straight down to the valley floor, just step in the opposite direction: -η ∇f!'
    },
    mapping: [
      {
        scenePart: 'Slope felt when stepping along a single axis while holding others fixed',
        modelPart: 'Partial Derivative',
        symbol: '∂f / ∂x_i = lim_{h→0} (f(x + h e_i) - f(x)) / h',
        role: 'Measures local sensitivity of loss to parameter i alone'
      },
      {
        scenePart: 'Compass arrow pointing straight up the steepest slope',
        modelPart: 'Gradient Vector',
        symbol: '∇f(x) = [∂f/∂x_1, ..., ∂f/∂x_d]^T',
        role: 'Orthogonal to contour lines; points in direction of maximum increase'
      },
      {
        scenePart: 'Flat valley bottom (or saddle pass) where ground is level',
        modelPart: 'Stationary / Critical Point',
        symbol: '∇f(x*) = 0',
        role: 'Necessary condition for a local/global minimum in unconstrained optimization'
      },
      {
        scenePart: 'Checking a formula slope by taking a tiny step +h and -h',
        modelPart: 'Central Finite Difference Check',
        symbol: '(f(x + h) - f(x - h)) / (2h)',
        role: 'O(h²) numerical verification used to unit-test analytical gradients'
      }
    ],
    playWithItPrompt:
      'Open Tab 0.2 ("Derivatives & Gradients"). Drag "Hill East-West Coordinate (x)" and "Hill North-South Coordinate (y)" to inspect the live Partial Derivatives ∂f/∂x and ∂f/∂y and verify that taking a -0.1·∇f step strictly lowers Elevation f(x, y)!',
    analogyBreaks:
      'On a physical hill you can look around with your eyes to see the valley 500 meters away, whereas the gradient ∇f(x) is purely local—it only knows the slope at the exact millimeter under your boots.',
    intuition: [
      'What a Derivative Really Means in ML: If ∂L/∂w = +3.0, nudging weight w by +0.001 will change the loss L by approximately (+3.0)(+0.001) = +0.003. Therefore, to reduce the loss, we nudge w in the opposite sign of its derivative!',
      'Why the Gradient ∇f Points Steepest Uphill: For any unit direction vector u (||u||₂ = 1), the directional derivative is D_u f = ∇f · u = ||∇f||₂ ||u||₂ cos(θ). This dot product is maximized when cos(θ) = +1 (u points along +∇f) and minimized (-||∇f||₂) when cos(θ) = -1 (u points along -∇f)!',
      'Always Verify Analytical Gradients with Central Differences: The centered difference (f(x + h) - f(x - h)) / (2h) cancels even-order Taylor error terms, achieving O(h²) accuracy (~10⁻¹⁰ precision at h = 10⁻⁶). Every single math module in NeuroPlay is tested this way!'
    ],
    mathFormulas: [
      {
        name: 'Partial Derivatives & The Gradient Vector',
        latex: '\\nabla f(\\mathbf{x}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} & \\frac{\\partial f}{\\partial x_2} & \\cdots & \\frac{\\partial f}{\\partial x_d} \\end{bmatrix}^\\top, \\qquad D_{\\mathbf{u}} f(\\mathbf{x}) = \\nabla f(\\mathbf{x}) \\cdot \\mathbf{u}',
        explanation: 'Collects all partial derivatives into a vector pointing in the direction of steepest local ascent.'
      },
      {
        name: 'Central Finite-Difference Approximation',
        latex: '\\frac{\\partial f}{\\partial x_i} = \\frac{f(\\mathbf{x} + h\\mathbf{e}_i) - f(\\mathbf{x} - h\\mathbf{e}_i)}{2h} + \\mathcal{O}(h^2)',
        explanation: 'Gold-standard numerical gradient check for verifying backpropagation code.'
      }
    ],
    workedExample: {
      scenario: 'For the 2D bowl f(x, y) = x² + 3y² at point (x, y) = (2, 1), compute the gradient ∇f(2, 1) and the new position after one steepest descent step with learning rate η = 0.1.',
      steps: [
        {
          label: 'Step 1: Differentiate w.r.t x and y analytically',
          math: '\\frac{\\partial f}{\\partial x} = 2x = 2(2) = 4.0, \\qquad \\frac{\\partial f}{\\partial y} = 6y = 6(1) = 6.0',
          note: 'Gradient vector is ∇f(2, 1) = [4.0, 6.0]^T, and current elevation is f(2, 1) = 4 + 3 = 7.0.'
        },
        {
          label: 'Step 2: Take steepest descent step (x, y)_new = (x, y) - η ∇f',
          math: 'x_{\\text{new}} = 2.0 - 0.1(4.0) = 1.60, \\qquad y_{\\text{new}} = 1.0 - 0.1(6.0) = 0.40',
          note: 'Stepping opposite to the gradient.'
        },
        {
          label: 'Step 3: Verify new elevation f(1.60, 0.40)',
          math: 'f(1.60, 0.40) = (1.60)^2 + 3(0.40)^2 = 2.56 + 0.48 = 3.04 < 7.00',
          note: 'Elevation dropped from 7.00 down to 3.04 in a single step!'
        }
      ],
      result: '∇f(2, 1) = [4.0, 6.0]^T; after step, f drops from 7.00 to 3.04.',
      params: {}
    },
    quiz: [
      {
        id: 'grad-q1',
        question: 'At your current weight vector w, the gradient of the loss is ∇L(w) = [0, 0, ..., 0]^T. What does this geometric condition mean?',
        options: [
          'The objective loss value L(w) must be equal to zero.',
          'The parameter vector is at a stationary critical point.',
          'Every weight coordinate w_i must be equal to zero.',
          'The optimizer learning rate hyperparameter η is zero.'
        ],
        correctIndex: 1,
        explanation: 'A zero gradient means the first-order slope in every direction is zero (a minimum, maximum, or saddle point).'
      },
      {
        id: 'grad-q2',
        question: 'Why do we use the Central Difference formula (f(x+h) - f(x-h)) / (2h) instead of the One-Sided Forward Difference (f(x+h) - f(x)) / h when unit-testing neural network gradients?',
        options: [
          'Symmetric Taylor expansions cancel the O(h) error, giving O(h²) accuracy.',
          'Forward difference approximations require complex-valued step sizes.',
          'Central difference approximations only evaluate the function f(x) once.',
          'Forward difference approximations always return negative slope values.'
        ],
        correctIndex: 0,
        explanation: 'f(x+h) - f(x-h) = 2h f\'(x) + (h³/3) f\'\'\'(x) + ..., so dividing by 2h leaves an O(h²) error instead of O(h).'
      }
    ],
    summary: [
      'A partial derivative ∂f/∂x_i measures the rate of change along coordinate i with all other coordinates held fixed.',
      'The gradient vector ∇f points in the direction of steepest ascent; -∇f points in the direction of steepest descent.',
      'Central finite differences provide O(h²) numerical verification of analytical derivatives.'
    ]
  },

  // =========================================================================
  // TRACK 0 — LESSON 0.3: THE CHAIN RULE
  // =========================================================================
  'the-chain-rule': {
    slug: 'the-chain-rule',
    scene: {
      title: 'Converting Rupees to Dollars to Euros: Multiplying Exchange Rates Along a Path (and Summing Parallel Paths)',
      narrative:
        'Suppose 1 Euro costs 1.10 US Dollars (dz/du = 1.10), and 1 US Dollar costs 84 Indian Rupees (du/dx = 84). How many Rupees does 1 Euro cost? You simply multiply the rates along the chain: dz/dx = (dz/du) · (du/dx) = 1.10 × 84 = 92.40! And what if changing x affects the final output z through TWO parallel routes in a computational graph—Route 1 via u(x) and Route 2 via v(x)? The Multivariate Chain Rule says: multiply the local rates along each route, then ADD the routes together: dz/dx = (∂z/∂u)(du/dx) + (∂z/∂v)(dv/dx)! That single rule is the entire engine of Backpropagation and Autodiff!'
    },
    mapping: [
      {
        scenePart: 'Intermediate currency / intermediate node in the graph',
        modelPart: 'Intermediate Activation',
        symbol: 'u = g(x)',
        role: 'Caches its forward value during the forward pass'
      },
      {
        scenePart: 'Multiplying exchange rates along a single series pipeline',
        modelPart: 'Single-Path Chain Rule',
        symbol: 'dz/dx = (dz/du) · (du/dx)',
        role: 'Propagates sensitivity backward through stacked layers'
      },
      {
        scenePart: 'Summing sensitivities when a variable feeds two branches (like ResNet +x)',
        modelPart: 'Multivariate Total Derivative',
        symbol: 'dz/dx = (∂z/∂u)(du/dx) + (∂z/∂v)(dv/dx)',
        role: 'Whenever a node fans out in forward pass, its gradients ADD in backward pass!'
      }
    ],
    playWithItPrompt:
      'Open Tab 0.3 ("The Chain Rule"). Adjust "Input Amount / Variable (x)" and "Exchange Rate Multiplier (w₁)" to see how Path 1 (∂z/∂u · du/dx) and Path 2 (∂z/∂v · dv/dx) multiply locally and sum into Total dz/dx!',
    analogyBreaks:
      'Currency exchange rates stay fixed regardless of how many rupees you convert, whereas in a non-linear neural network the local derivative ∂z/∂u changes depending on the exact forward activation value u cached during the forward pass.',
    intuition: [
      'Series Composition = Multiply Local Derivatives: If z = f(u) and u = g(x), a tiny nudge Δx produces Δu ≈ (du/dx) Δx, which in turn produces Δz ≈ (dz/du) Δu ≈ (dz/du)(du/dx) Δx.',
      'Parallel Fan-Out = Sum Across Branches: Whenever a variable x feeds into multiple downstream operations (for example, a shared CNN kernel weight touching 9 image patches, or a ResNet input x splitting into residual branch F(x) and identity shortcut +x), the total derivative dz/dx is the sum of the derivatives along every path from x to z!',
      'Why Reverse-Mode Autodiff (Backpropagation) Is O(1) Passes Instead of O(P): If a neural network has P = 1,000,000 weights and 1 scalar loss L, forward-mode differentiation would require 1,000,000 passes (one per weight). Reverse-mode differentiation starts at the single output L (∂L/∂L = 1) and sweeps backward once, computing the gradient for all 1,000,000 weights in a single backward pass!'
    ],
    mathFormulas: [
      {
        name: 'Univariate & Multivariate Chain Rule',
        latex: '\\frac{dz}{dx} = \\frac{dz}{du}\\cdot\\frac{du}{dx}, \\qquad \\frac{dz}{dx} = \\sum_{k=1}^{m} \\frac{\\partial z}{\\partial u_k}\\cdot\\frac{\\partial u_k}{\\partial x}',
        explanation: 'Multiplies local Jacobians along sequential edges and sums across parallel fan-out branches.'
      }
    ],
    workedExample: {
      scenario: 'Given the 2-branch computational graph u = 2x, v = x², and output z = u + 3v, compute the total derivative dz/dx at x = 4.',
      steps: [
        {
          label: 'Step 1: Evaluate local derivatives along Path 1 (through u = 2x)',
          math: '\\frac{\\partial z}{\\partial u} = 1, \\quad \\frac{du}{dx} = 2 \\implies \\text{Path}_1 = 1 \\times 2 = 2.0',
          note: 'Path 1 contributes +2.0 to the total derivative.'
        },
        {
          label: 'Step 2: Evaluate local derivatives along Path 2 (through v = x² at x = 4)',
          math: '\\frac{\\partial z}{\\partial v} = 3, \\quad \\frac{dv}{dx} = 2x = 8 \\implies \\text{Path}_2 = 3 \\times 8 = 24.0',
          note: 'Path 2 contributes +24.0 to the total derivative.'
        },
        {
          label: 'Step 3: Sum both paths',
          math: '\\frac{dz}{dx} = \\text{Path}_1 + \\text{Path}_2 = 2.0 + 24.0 = 26.0',
          note: 'Matches direct differentiation of z = 2x + 3x² ⇒ dz/dx = 2 + 6(4) = 26.0!'
        }
      ],
      result: 'Total derivative dz/dx = 26.0.',
      params: {}
    },
    quiz: [
      {
        id: 'cr-q1',
        question: 'In a computational graph, node x splits into two branches u = f(x) and v = g(x) that both feed into the final loss L(u, v). During backpropagation, if branch u sends back gradient δ_u = 3.5 and branch v sends back gradient δ_v = -1.5 to node x, what is the total gradient ∂L/∂x?',
        options: [
          'max(δ_u, δ_v) = 3.5',
          'δ_u × δ_v = -5.25',
          'δ_u + δ_v = +2.0',
          'δ_u - δ_v = +5.0'
        ],
        correctIndex: 2,
        explanation: 'By the multivariate chain rule, when a variable feeds multiple consumers in the forward graph, its total sensitivity is the sum of sensitivities from each consumer.'
      },
      {
        id: 'cr-q2',
        question: 'For a multiply gate z = x · y where forward inputs were x = 3.0 and y = -4.0, and the upstream gradient arriving at z is ∂L/∂z = 2.0, what are the backward gradients (∂L/∂x, ∂L/∂y)?',
        options: [
          '∂L/∂x = 2.0 and ∂L/∂y = 2.0',
          '∂L/∂x = 6.0 and ∂L/∂y = -8.0',
          '∂L/∂x = -8.0 and ∂L/∂y = +6.0',
          '∂L/∂x = -12.0 and ∂L/∂y = -12.0'
        ],
        correctIndex: 2,
        explanation: 'Since ∂(xy)/∂x = y and ∂(xy)/∂y = x, a multiplication node caches x and y during the forward pass so it can multiply upstream δ by y (for x) and by x (for y).'
      }
    ],
    summary: [
      'The Chain Rule differentiates composite functions by multiplying local derivatives along each path: dz/dx = (dz/du)(du/dx).',
      'When a variable fans out to multiple paths in the forward pass, its gradients sum in the backward pass.',
      'Reverse-mode automatic differentiation computes gradients for all parameters in a single backward sweep from the scalar loss.',
      'Build your own Karpathy-style micrograd engine in the Track 0 Project: Autodiff Engine From Scratch!'
    ]
  },

  // =========================================================================
  // TRACK 0 — LESSON 0.4: PROBABILITY AND DISTRIBUTIONS
  // =========================================================================
  'probability-and-distributions': {
    slug: 'probability-and-distributions',
    scene: {
      title: 'Forecasting Monsoon Rain (Bernoulli) & Measurement Bell Curves (Gaussian): Why Loss Functions Are Negative Log-Likelihoods!',
      narrative:
        'Where do Mean Squared Error (MSE) and Binary Cross-Entropy (BCE) actually come from? Did someone just make them up? No—both come directly from Probability! When a weather app predicts a coin-flip rain probability p ∈ (0, 1) for a binary event y ∈ {0, 1} (a Bernoulli Distribution), maximizing the log-probability of the observed weather is literally minimizing Binary Cross-Entropy! And when a model predicts a continuous number with Gaussian bell-curve noise N(μ, σ²), maximizing the log-likelihood of the data is literally minimizing Mean Squared Error (x - μ)² / (2σ²)!'
    },
    mapping: [
      {
        scenePart: 'Weighted coin-flip distribution for binary Yes/No outcomes',
        modelPart: 'Bernoulli Distribution',
        symbol: 'P(Y = y) = p^y (1 - p)^{1 - y}',
        role: 'Negative log-likelihood -log P(Y=y) is Binary Cross-Entropy!'
      },
      {
        scenePart: 'Bell curve centered at mean μ with spread σ',
        modelPart: 'Gaussian (Normal) Distribution',
        symbol: 'N(x; μ, σ²) = (1 / √(2πσ²)) exp(-(x - μ)² / (2σ²))',
        role: 'Negative log-likelihood wrt μ is Mean Squared Error!'
      },
      {
        scenePart: 'Average surprise (in bits) of a weather forecast',
        modelPart: 'Shannon Entropy',
        symbol: 'H(P) = -Σ P(x) log₂ P(x)',
        role: 'Peaks at 1.0 bit for a 50/50 coin; equals 0 bits when p = 0 or p = 1'
      },
      {
        scenePart: 'Picking model parameters θ that make observed data most probable',
        modelPart: 'Maximum Likelihood Estimation (MLE)',
        symbol: 'θ* = argmin_θ Σ -log P_θ(y_i | x_i)',
        role: 'Unifies classification cross-entropy and regression MSE under one principle'
      }
    ],
    playWithItPrompt:
      'Open Tab 0.4 ("Probability & Likelihood"). Drag "Forecast Rain Probability (p)" to 0.50 and verify that Bernoulli Entropy hits its maximum of 1.000 bit! Then drag "Gaussian Center / Mean (μ)" toward the observed point x = 1.80 to see Gaussian PDF peak, NLL hit its minimum, and ∂NLL/∂μ hit 0.000!',
    analogyBreaks:
      'A textbook coin has a permanently fixed physical probability p, whereas a machine learning model predicts a conditional probability distribution P_θ(y | x) that shifts dynamically for every input sample x.',
    intuition: [
      'Why Take the Logarithm of Likelihood? For N independent training examples, the joint probability is a product of N numbers in (0, 1): ∏_{i=1}^N P_θ(y_i | x_i). Multiplying 10,000 probabilities like 0.5¹⁰⁰⁰⁰ immediately underflows floating-point numbers to 0.0! Taking the logarithm turns the product into a numerically stable sum: log ∏ P_i = ∑ log P_i.',
      'Bernoulli MLE = Binary Cross-Entropy: Taking -log(p^y (1 - p)^{1-y}) gives -[y log p + (1 - y) log(1 - p)]—the exact BCE loss!',
      'Gaussian MLE = Mean Squared Error: Taking -log N(y; ŷ, σ²) gives ½ log(2πσ²) + (y - ŷ)² / (2σ²). Minimizing this over ŷ is identical to minimizing (y - ŷ)² (MSE)!'
    ],
    mathFormulas: [
      {
        name: 'Bernoulli Likelihood & Binary Cross-Entropy Equivalence',
        latex: 'P(y \\mid p) = p^y(1 - p)^{1-y} \\implies -\\log P(y \\mid p) = -\\big[y\\log p + (1 - y)\\log(1 - p)\\big]',
        explanation: 'Proves that Binary Cross-Entropy is the exact Negative Log-Likelihood of a Bernoulli distribution.'
      },
      {
        name: 'Gaussian Density & Squared Error Equivalence',
        latex: 'p(x \\mid \\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}}\\exp\\!\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right) \\implies -\\log p(x \\mid \\mu, \\sigma^2) = \\frac{1}{2}\\log(2\\pi\\sigma^2) + \\frac{(x - \\mu)^2}{2\\sigma^2}',
        explanation: 'Proves that Mean Squared Error is the exact Negative Log-Likelihood of a Gaussian distribution with constant variance.'
      }
    ],
    workedExample: {
      scenario: 'Evaluate the Gaussian Negative Log-Likelihood (NLL) and its derivative ∂NLL/∂μ for an observation x = 3.0 under N(μ = 1.0, σ = 1.0).',
      steps: [
        {
          label: 'Step 1: Compute squared z-score term (x - μ)² / (2σ²)',
          math: '\\frac{(3.0 - 1.0)^2}{2(1.0)^2} = \\frac{4.0}{2.0} = 2.000',
          note: 'Observation x = 3.0 is 2 standard deviations above μ = 1.0.'
        },
        {
          label: 'Step 2: Add normalization constant ½ ln(2πσ²)',
          math: '\\text{NLL} = 0.5\\ln(2\\pi) + 2.000 \\approx 0.9189 + 2.000 = 2.9189\\text{ nats}',
          note: 'Total negative log-likelihood.'
        },
        {
          label: 'Step 3: Compute Analytical Derivative ∂NLL/∂μ',
          math: '\\frac{\\partial \\text{NLL}}{\\partial \\mu} = \\frac{\\mu - x}{\\sigma^2} = \\frac{1.0 - 3.0}{1.0} = -2.000',
          note: 'Negative gradient tells gradient descent to increase μ toward x = 3.0!'
        }
      ],
      result: 'NLL = 2.9189 nats; gradient ∂NLL/∂μ = -2.000.',
      params: {}
    },
    quiz: [
      {
        id: 'prob-q1',
        question: 'Why do we maximize the SUM of log-probabilities Σ log P(y_i | x_i) instead of directly maximizing the PRODUCT of probabilities Π P(y_i | x_i)?',
        options: [
          'Because individual likelihood probabilities P(y_i | x_i) are often negative.',
          'Multiplying thousands of values in (0, 1) underflows floating-point numbers.',
          'Because the natural logarithm reverses the location of the global maximum.',
          'Because taking the logarithm reduces the number of rows in the training set.'
        ],
        correctIndex: 1,
        explanation: 'Since log(·) is strictly increasing, argmax_θ log L(θ) = argmax_θ L(θ), while avoiding floating-point underflow and turning product-rule derivatives into simple sums.'
      },
      {
        id: 'prob-q2',
        question: 'Minimizing Mean Squared Error (MSE) on a regression target y is mathematically equivalent to Maximum Likelihood Estimation under what noise assumption?',
        options: [
          'Deterministic targets that contain zero random observation noise anywhere.',
          'Binary Bernoulli coin-flip noise attached to discrete classification labels.',
          'Discrete Uniform noise distributed across finitely many integer categories.',
          'Additive zero-mean Gaussian noise y = f_θ(x) + ε with constant variance σ².'
        ],
        correctIndex: 3,
        explanation: 'The exponent of the Gaussian density is -(y - f_θ(x))² / (2σ²), whose negative log is proportional to squared error (y - f_θ(x))².'
      }
    ],
    summary: [
      'Expected value E[X] and variance Var(X) = E[(X - μ)²] summarize the center and spread of random variables.',
      'Maximum Likelihood Estimation (MLE) chooses parameters that minimize Negative Log-Likelihood (NLL) over the training set.',
      'Bernoulli NLL yields Binary Cross-Entropy; Gaussian NLL yields Mean Squared Error.'
    ]
  },

  // =========================================================================
  // TRACK 2 — LESSON 2.7: UNIVERSAL APPROXIMATION AND NETWORK DEPTH
  // =========================================================================
  'universal-approximation-and-depth': {
    slug: 'universal-approximation-and-depth',
    scene: {
      title: 'Approximating a Winding Hill Road Using Hinged Wooden Ruler Segments (Shallow) vs Folding Paper (Deep)',
      narrative:
        'Why can a neural network fit almost any continuous curve in the universe? Think of a single ReLU neuron v_i · max(0, w_i x + b_i) as a hinged wooden ruler: it stays flat at 0 until the hinge point x = -b_i/w_i, where it bends with slope v_i w_i! Snap N hinged rulers together in 1 wide layer and you can trace any curvy road to arbitrary precision (the Universal Approximation Theorem)! Even better: why go Deep instead of just 1 giant wide layer? Because stacking L layers folds space like folding a sheet of paper L times—creating (N + 1)^L linear regions exponentially instead of just 1 + LN!'
    },
    mapping: [
      {
        scenePart: 'Single hinged ruler bending at a specific road milestone',
        modelPart: 'ReLU Hinge Unit',
        symbol: 'h_i(x) = v_i max(0, w_i x + b_i)',
        role: 'Activates at knot location x_i = -b_i / w_i and adds slope Δm = v_i w_i'
      },
      {
        scenePart: 'Snapping N rulers end-to-end in a single flat chain',
        modelPart: '1-Hidden-Layer Universal Approximator',
        symbol: 'f(x) = Σ_{i=1}^N v_i ReLU(w_i x + b_i) + c',
        role: 'Approximates any continuous function on a compact domain (Cybenko / Hornik)'
      },
      {
        scenePart: 'Folding a paper sheet L times to multiply creases exponentially',
        modelPart: 'Compositional Depth Advantage',
        symbol: 'R_deep = (N + 1)^L vs R_shallow = 1 + L N',
        role: 'Depth creates exponentially more piecewise-linear regions per parameter!'
      }
    ],
    playWithItPrompt:
      'In Tab 2.7 ("ReLU Depth"), drag "Road Position / Input (x)" across the hinge points to see the piecewise-linear output f(x) and exact slope df/dx jump as hinges switch on! Then drag "Network Depth / Stacked Layers (L)" from 1 to 6 to compare 1-Layer Regions vs L-Layer Regions!',
    analogyBreaks:
      'The mathematical Universal Approximation Theorem guarantees that a wide 1-layer network exists that fits your function, but it does NOT guarantee that SGD will easily find those weights or generalize well on finite data—which is why deep compositional hierarchies win in practice.',
    intuition: [
      'How ReLU Builds Arbitrary Curves Out of Straight Lines: A single ReLU unit max(0, w_i x + b_i) is 0 for x < -b_i/w_i and linear with slope w_i for x > -b_i/w_i. Summing N such units creates a continuous piecewise-linear spline with N knots where the slope changes by v_i w_i at each knot.',
      'The Universal Approximation Theorem (Cybenko 1989, Hornik 1991, Leshno 1993): A feed-forward network with a single hidden layer containing a finite number of neurons and any non-polynomial activation function (like Sigmoid, Tanh, or ReLU) can approximate any continuous function f: [0, 1]^d → R to within any desired error ε > 0.',
      'Why Depth Beats Width (Montúfar et al., 2014; Telgarsky, 2016): If 1 hidden layer can approximate anything, why do we build 50-layer ResNets and 96-layer Transformers? Because a 1-hidden-layer network may require an exponentially huge width 2^L to represent a function that an L-layer network represents with just O(L) neurons! Each deeper layer composes features of features (edges → parts → objects).'
    ],
    mathFormulas: [
      {
        name: 'Piecewise-Linear ReLU Spline Expansion & Derivative',
        latex: 'f(x) = \\sum_{i=1}^{N} v_i \\max(0, w_i x + b_i), \\qquad \\frac{df}{dx} = \\sum_{i=1}^{N} v_i w_i \\,\\mathbf{1}_{[w_i x + b_i > 0]}',
        explanation: 'At any input x, the derivative df/dx is simply the sum of slopes v_i w_i of all currently active ReLU hinges.'
      },
      {
        name: '1D Linear Regions: Shallow vs Deep (Montúfar Bound)',
        latex: 'R_{\\text{shallow}}(L\\cdot N) = 1 + LN, \\qquad R_{\\text{deep}}(L, N) = (N + 1)^L',
        explanation: 'With L = 4 layers of N = 8 units (32 units total), a shallow layer creates 33 regions while a 4-layer network can fold up to 9⁴ = 6,561 regions!'
      }
    ],
    workedExample: {
      scenario: 'Evaluate f(x) = 2 ReLU(x) - 3 ReLU(x - 1) at x = 0.5 and x = 2.0, along with df/dx.',
      steps: [
        {
          label: 'Step 1: Evaluate at x = 0.5 (only Hinge 1 is active)',
          math: 'f(0.5) = 2(0.5) - 3(0) = 1.000, \\qquad f\'(0.5) = 2.0',
          note: 'Between x = 0 and x = 1, the function rises with slope +2.0.'
        },
        {
          label: 'Step 2: Evaluate at x = 2.0 (both Hinge 1 and Hinge 2 are active)',
          math: 'f(2.0) = 2(2.0) - 3(2.0 - 1.0) = 4.0 - 3.0 = 1.000, \\qquad f\'(2.0) = 2.0 - 3.0 = -1.0',
          note: 'At knot x = 1, Hinge 2 switches on and bends the slope from +2.0 down to -1.0!'
        }
      ],
      result: 'f(0.5) = 1.0 (slope +2.0); f(2.0) = 1.0 (slope -1.0).',
      params: {}
    },
    quiz: [
      {
        id: 'uat-q1',
        question: 'If the Universal Approximation Theorem proves that a single wide hidden layer can approximate any continuous function, why do we use deep multi-layer networks in practice?',
        options: [
          'Shallow networks can need exponentially many units to match deep hierarchy.',
          'Single-hidden-layer networks cannot be trained using backpropagation.',
          'Rectified Linear Units only activate when stacked at least 10 layers deep.',
          'Single-hidden-layer networks contain zero trainable weight parameters.'
        ],
        correctIndex: 0,
        explanation: 'Depth provides exponential parameter efficiency through function composition f_L(f_{L-1}(...f_1(x))).'
      },
      {
        id: 'uat-q2',
        question: 'Can a 10-layer neural network with NO non-linear activation functions (i.e. purely linear layers h^(l) = W^(l) h^(l-1)) be a Universal Approximator?',
        options: [
          'Yes, provided each hidden layer contains at least N = 1,000 linear units.',
          'No, multiplying linear matrices collapses into one linear matrix W_eff.',
          'Yes, when the weights are optimized using Adam with cosine annealing.',
          'Yes, but only for one-dimensional scalar regression problems on [-1, 1].'
        ],
        correctIndex: 1,
        explanation: 'Non-polynomial activation functions (like ReLU, GELU, Tanh) are mandatory to bend space and prevent multi-layer collapse.'
      }
    ],
    summary: [
      'Each ReLU neuron acts as a piecewise-linear hinge; summing N hinges approximates any continuous curve.',
      'The Universal Approximation Theorem guarantees existence of a 1-layer approximator for any continuous function on a bounded domain.',
      'Deep networks compose hinges across layers, generating exponentially more linear regions than shallow networks of the same size.'
    ]
  },

  // =========================================================================
  // TRACK 4 — LESSON 4.5: FROM LENET TO VGG
  // =========================================================================
  'from-lenet-to-vgg': {
    slug: 'from-lenet-to-vgg',
    scene: {
      title: 'Why Two Small 3×3 Magnifying Glasses Beat One Heavy 5×5 Lens: The VGG Design Revolution',
      narrative:
        'Early CNNs matched bigger objects by using huge kernels: LeNet-5 (1998) used 5×5 filters on bank cheques, and AlexNet (2012) used massive 11×11 filters on ImageNet! Then Simonyan & Zisserman (VGG, 2014) asked a brilliant question: if you stack TWO 3×3 convolutional layers one after another, how wide a patch of the original image does each output cell see? Exactly 5×5! And three stacked 3×3 layers see a 7×7 patch! Better yet, two 3×3 layers use 2 × (3² C²) = 18C² weights instead of 5² C² = 25C² (28% fewer parameters!) and pack TWO ReLU non-linearities instead of one!'
    },
    mapping: [
      {
        scenePart: 'Two 3×3 lenses stacked in series',
        modelPart: 'Stacked 3×3 Convolution Block',
        symbol: 'RF = 1 + 2N (N=2 ⇒ 5×5, N=3 ⇒ 7×7)',
        role: 'Replaces large 5×5 and 7×7 kernels everywhere in VGG-16 / VGG-19'
      },
      {
        scenePart: 'Weight budget of N stacked 3×3 layers vs one (2N+1)×(2N+1) layer',
        modelPart: 'Parameter Savings Ratio',
        symbol: '9 N C² vs (2N + 1)² C²',
        role: 'Saves 28% weights for 5×5 (18C² vs 25C²) and 45% for 7×7 (27C² vs 49C²)'
      },
      {
        scenePart: 'Doubling channel count C whenever spatial size H×W is halved by pooling',
        modelPart: 'VGG Pyramid Rule',
        symbol: 'H/2 × W/2 × 2C',
        role: 'Keeps FLOPs per layer constant across spatial downsampling stages'
      }
    ],
    playWithItPrompt:
      'Open Tab 4.5 ("LeNet to VGG"). Slide "Stacked 3×3 Layers (N)" from 1 to 4 and "Feature Channels (C)" from 32 to 256: verify that N = 2 gives a 5×5 Effective Receptive Field with -28.0% fewer parameters, and N = 3 gives a 7×7 Receptive Field with -44.9% fewer parameters!',
    analogyBreaks:
      'Stacking physical glass lenses makes the image dimmer due to light reflection, whereas stacking 3×3 CNN layers increases representational richness by inserting a ReLU non-linearity after every single 3×3 convolution.',
    intuition: [
      'Historical Evolution (1998 → 2014): LeNet-5 (LeCun, 1998) pioneered Conv → Pool → Conv → Pool → Dense on 32×32 grayscale digits (~60K params). AlexNet (Krizhevsky, 2012) scaled CNNs to 224×224 RGB ImageNet using GPUs, ReLU (instead of Tanh), Dropout, and Data Augmentation (~60M params). VGG-16 (2014) replaced ad-hoc kernel sizes (11×11, 7×7, 5×5) with a uniform, modular recipe: 3×3 convolutions (stride 1, pad 1) + 2×2 max-pooling (stride 2), doubling channels after each pool (64 → 128 → 256 → 512).',
      'Why 3×3 Kernels Win Doubly: Stacking N = 3 layers of 3×3 convolutions achieves the exact same 7×7 receptive field as a single 7×7 layer, but (1) inserts 3 ReLU non-linearities instead of 1 (making features much more discriminative), and (2) requires only 3 × 9C² = 27C² weights instead of 49C² (44.9% fewer parameters!).',
      'Where Most Parameters Hide in VGG-16: Out of VGG-16\'s 138 million parameters, over 102 million (74%!) sit in the very first Dense layer (7 × 7 × 512 = 25,088 flattened features connected to 4,096 neurons!). Modern architectures (ResNet, EfficientNet, ConvNeXt) eliminate this bottleneck using Global Average Pooling (GAP), averaging each 7×7 channel into 1 number (512 features total) before the final linear classifier!'
    ],
    mathFormulas: [
      {
        name: 'Effective Receptive Field of N Stacked 3×3 Convolutions (Stride 1)',
        latex: '\\text{RF}(N) = 1 + N \\cdot (3 - 1) = 2N + 1',
        explanation: 'Each additional 3×3 layer expands the receptive field by +2 pixels in height and width.'
      },
      {
        name: 'Parameter Count Comparison (C Input & Output Channels)',
        latex: 'P_{N\\times (3\\times 3)} = 9 N C^2, \\qquad P_{(2N+1)\\times(2N+1)} = (2N + 1)^2 C^2',
        explanation: 'For N = 2 (5×5 RF), 18C² vs 25C² saves 28%; for N = 3 (7×7 RF), 27C² vs 49C² saves 44.9%.'
      }
    ],
    workedExample: {
      scenario: 'Compare the weight parameter count (excluding biases) of three stacked 3×3 Conv layers vs one 7×7 Conv layer when input and output channels are C = 64.',
      steps: [
        {
          label: 'Step 1: Compute parameters for 3 stacked 3×3 layers',
          math: 'P_{3\\times(3\\times 3)} = 3 \\times (3 \\times 3 \\times 64 \\times 64) = 27 \\times 4096 = 110,592',
          note: 'Includes 3 sequential ReLU activations.'
        },
        {
          label: 'Step 2: Compute parameters for 1 single 7×7 layer (same 7×7 receptive field)',
          math: 'P_{7\\times 7} = 7 \\times 7 \\times 64 \\times 64 = 49 \\times 4096 = 200,704',
          note: 'Includes only 1 ReLU activation.'
        },
        {
          label: 'Step 3: Compute percentage savings',
          math: '\\text{Savings} = \\frac{200,704 - 110,592}{200,704} = \\frac{22}{49} \\approx 44.90\\%',
          note: 'Saves 90,112 parameters in a single block while increasing depth!'
        }
      ],
      result: 'Three 3×3 layers use 110,592 weights vs 200,704 for one 7×7 layer (44.9% savings).',
      params: {}
    },
    quiz: [
      {
        id: 'vgg-q1',
        question: 'Why did VGG replace every 5×5 convolutional filter with a stack of two 3×3 convolutional filters?',
        options: [
          'To eliminate the need for spatial max-pooling layers between blocks.',
          'Because modern GPU tensor cores cannot multiply 5×5 filter matrices.',
          'Because a single 5×5 kernel has a smaller receptive field than a 3×3 kernel.',
          'Two 3×3 layers match a 5×5 receptive field with fewer weights and two ReLUs.'
        ],
        correctIndex: 3,
        explanation: 'Stacking smaller 3×3 kernels is strictly more expressive (more ReLUs) and more parameter-efficient (18C² < 25C²) for the same spatial context.'
      },
      {
        id: 'vgg-q2',
        question: 'In VGG-16, flattening the final 7×7×512 feature map into a 4096-unit Dense layer created 102 million parameters. How do ResNet and modern CNNs avoid this massive Dense parameter explosion?',
        options: [
          'They use 1×1 images.',
          'They crop the input image to 8×8 pixels.',
          'Global Average Pooling (GAP).',
          'They remove the final classification layer.'
        ],
        correctIndex: 2,
        explanation: 'Global Average Pooling reduces (7, 7, 512) → (512,) with zero learnable parameters, cutting over 100M prone-to-overfit dense weights.'
      }
    ],
    summary: [
      'LeNet-5 (1998) introduced Conv-Pool hierarchies; AlexNet (2012) added ReLU, Dropout, and GPU scaling.',
      'VGG (2014) standardized on stacked 3×3 convolutions, achieving 5×5 and 7×7 receptive fields with 28%–45% fewer weights and more non-linearities.',
      'Replacing Flatten+Dense with Global Average Pooling eliminates ~75% of legacy CNN parameter bloat.'
    ]
  },

  // =========================================================================
  // TRACK 4 — LESSON 4.8: TRANSFER LEARNING
  // =========================================================================
  'transfer-learning': {
    slug: 'transfer-learning',
    scene: {
      title: 'Hiring an Experienced Master Photographer (Pretrained Backbone) and Teaching Them Your 5 Crop Diseases (New Head)',
      narrative:
        'Suppose you only have 800 photos of diseased tomato leaves from a farm in Maharashtra. If you train a 25-million-parameter ResNet-50 from random noise on 800 photos, it will hopelessly memorize those 800 images in 3 epochs! Instead, you download a ResNet-50 already pretrained on 1.2 million ImageNet photos—its early layers already know how to detect edges, leaf veins, color spots, and textures! First, you FREEZE the 23.5M backbone weights (requires_grad = False) and replace only the final Linear Head (2048 × 5 = 10,245 weights) to train fast on your 800 photos. Then, optionally unfreeze the top backbone stage with a 10× smaller learning rate (Fine-Tuning)!'
    },
    mapping: [
      {
        scenePart: 'Master photographer\'s universal eye for edges, textures, and shapes',
        modelPart: 'Pretrained Convolutional Backbone',
        symbol: 'f_θ_pre(x) ∈ R^{2048}',
        role: 'Extracts rich general-purpose visual representations learned on millions of images'
      },
      {
        scenePart: 'Locking the photographer\'s core instincts while training the new checklist',
        modelPart: 'Feature Extraction (Frozen Backbone)',
        symbol: 'requires_grad = False on θ_backbone',
        role: 'Trains only the new K-class linear head W_head ∈ R^{K × 2048}'
      },
      {
        scenePart: 'Gently adjusting high-level instincts at 1/10th speed after the head warms up',
        modelPart: 'Fine-Tuning with Differential Learning Rates',
        symbol: 'η_backbone = 0.1 · η_head',
        role: 'Adapts deep semantic filters to the target domain without catastrophic forgetting'
      }
    ],
    playWithItPrompt:
      'Open Tab 4.8 ("Transfer Learning"). Start with "Unfrozen Backbone Stages" at 0 (pure Feature Extraction) and "New Task Target Classes (K)" at 5: notice you only train 10,245 parameters (0.04% of ResNet-50)! Then slide "Unfrozen Backbone Stages" from 1 to 4 to see how gradual unfreezing scales the trainable budget.',
    analogyBreaks:
      'A human photographer never forgets how to see edges even if you shout instructions at them, whereas unfrozen pretrained weights updated with a huge learning rate before the random new head is warmed up will be destroyed in 2 steps by large random gradients ("catastrophic forgetting").',
    intuition: [
      'Why Early CNN Layers Are Universal: Visualizing Layer 1 and Layer 2 filters of any CNN trained on ImageNet, CIFAR, or medical scans reveals the exact same Gabor edge detectors, color-opponent blobs, and corner filters. You almost never need to relearn edge detectors from scratch!',
      'The 2-Phase Transfer Learning Recipe: Phase 1 (Linear Probing / Feature Extraction): Freeze the entire backbone (for p in model.parameters(): p.requires_grad = False), replace model.fc = nn.Linear(2048, K), and train the new head for 5–10 epochs at η = 10⁻³. Phase 2 (Fine-Tuning): Unfreeze the top 1–2 stages of the backbone and train with a 10× smaller learning rate (η = 10⁻⁴) so pretrained weights aren\'t blasted away.',
      'Crucial Preprocessing Rule: When using an ImageNet-pretrained backbone, you must normalize your target images using the exact same ImageNet channel mean μ = [0.485, 0.456, 0.406] and std σ = [0.229, 0.224, 0.225] that the backbone expects!'
    ],
    mathFormulas: [
      {
        name: 'Linear Head Replacement & Parameter Budget',
        latex: '\\hat{\\mathbf{y}} = \\text{Softmax}(\\mathbf{W}_{\\text{head}}\\, f_{\\boldsymbol{\\theta}_{\\text{frozen}}}(\\mathbf{x}) + \\mathbf{b}_{\\text{head}}), \\qquad |\\Theta_{\\text{head}}| = d_{\\text{feat}}\\cdot K + K',
        explanation: 'For ResNet-50 (d_feat = 2048) and K = 5 classes, the new head has only 2048 × 5 + 5 = 10,245 trainable parameters.'
      },
      {
        name: 'Differential Learning Rate Update',
        latex: '\\boldsymbol{\\theta}_{\\text{head}} \\leftarrow \\boldsymbol{\\theta}_{\\text{head}} - \\eta_{\\text{head}}\\nabla_{\\text{head}}\\mathcal{L}, \\qquad \\boldsymbol{\\theta}_{\\text{top}} \\leftarrow \\boldsymbol{\\theta}_{\\text{top}} - (0.1\\,\\eta_{\\text{head}})\\nabla_{\\text{top}}\\mathcal{L}',
        explanation: 'Uses a 10× smaller step size on unfrozen pretrained layers to prevent catastrophic forgetting.'
      }
    ],
    workedExample: {
      scenario: 'You adapt a pretrained ResNet-50 (23,500,000 backbone parameters, 2048-dim Global Average Pooled feature vector) to a 5-class plant disease dataset in Feature Extraction mode.',
      steps: [
        {
          label: 'Step 1: Compute trainable parameters in the new Linear Head',
          math: 'P_{\\text{head}} = (2048 \\times 5) + 5 = 10,240 + 5 = 10,245',
          note: '2048 weights per class plus 5 biases.'
        },
        {
          label: 'Step 2: Compute percentage of total model parameters trained',
          math: '\\frac{10,245}{23,500,000 + 10,245} \\times 100\\% \\approx 0.0436\\%',
          note: 'Trains 2,290× fewer parameters, preventing overfitting on small datasets!'
        }
      ],
      result: 'Only 10,245 parameters (0.044% of the network) are trained during Feature Extraction.',
      params: {}
    },
    quiz: [
      {
        id: 'tl-q1',
        question: 'Why should you ALWAYS freeze the pretrained backbone and warm up the newly attached random classification head for a few epochs BEFORE unfreezing the backbone for fine-tuning?',
        options: [
          'Random initial head weights create large gradients that distort backbone features.',
          'Deep learning frameworks do not permit unfreezing backbone layers at epoch zero.',
          'Frozen convolutional layers execute much slower than unfrozen layers on GPUs.',
          'Freezing the backbone forces all linear classification head weights to stay zero.'
        ],
        correctIndex: 0,
        explanation: 'Warming up the linear head aligns its weights with the pretrained feature space first, so subsequent fine-tuning gradients are small and constructive.'
      },
      {
        id: 'tl-q2',
        question: 'You have only 300 labeled chest X-ray images (very small dataset, domain somewhat different from natural photos). Which transfer learning strategy is safest against overfitting?',
        options: [
          'Remove all spatial pooling layers and train a single linear matrix on raw pixels.',
          'Re-initialize all 25 million ResNet weights randomly and train from scratch.',
          'Unfreeze all 50 layers immediately and train with a large learning rate η = 1.0.',
          'Freeze early/middle conv blocks and train the new linear head on top.'
        ],
        correctIndex: 3,
        explanation: 'On 300 images, training 25M parameters from scratch or with high LR rapidly memorizes the training set; freezing early universal features is essential.'
      }
    ],
    summary: [
      'Early CNN layers learn domain-agnostic edge, color, and texture detectors.',
      'Feature Extraction freezes the pretrained backbone and trains only the new K-class linear head.',
      'Fine-Tuning unfreezes top backbone blocks using a 10× smaller differential learning rate after head warmup.',
      'Try this hands-on in the Track 4 Projects: Plant Disease Classifier and Chest X-Ray Pneumonia Classifier!'
    ]
  },

  // =========================================================================
  // TRACK 4 — LESSON 4.9: OBJECT DETECTION (YOLO)
  // =========================================================================
  'object-detection-yolo': {
    slug: 'object-detection-yolo',
    scene: {
      title: 'A Campus Gate CCTV Guard Who Divides the View into a Grid, Scores Box Overlap (IoU), and Erases Duplicate Labels (NMS)',
      narrative:
        'Image classification only gives one label for the whole photo ("Bike"). What if there are 12 bikes and 5 pedestrians at the college gate and we need a Bounding Box (x, y, w, h) around every single one in real time (60 FPS)? Redmon et al. created YOLO ("You Only Look Once"): divide the image into an S×S grid where each grid cell predicts bounding boxes and class probabilities in a SINGLE forward pass! To measure how well a predicted box matches the true box, we divide their Overlap Area by their Total Combined Footprint: Intersection over Union (IoU). And when 3 adjacent grid cells all draw slightly shifted boxes around the same bike, Non-Maximum Suppression (NMS) keeps the highest-confidence box and deletes any overlapping box with IoU ≥ τ_NMS!'
    },
    mapping: [
      {
        scenePart: 'Dividing the CCTV screen into an S × S checkerboard',
        modelPart: 'YOLO Spatial Grid',
        symbol: 'S × S × (B · 5 + C) tensor',
        role: 'Cell containing an object\'s center (x_c, y_c) is responsible for detecting it'
      },
      {
        scenePart: 'Shared overlap area divided by total combined box footprint',
        modelPart: 'Intersection over Union (IoU)',
        symbol: 'IoU(A, B) = |A ∩ B| / (|A| + |B| - |A ∩ B|)',
        role: 'Scale-invariant accuracy metric in [0, 1]; IoU ≥ 0.50 is a standard hit'
      },
      {
        scenePart: 'Keeping the sharpest box and erasing overlapping duplicates',
        modelPart: 'Non-Maximum Suppression (NMS)',
        symbol: 'Suppress B_j if IoU(B_max, B_j) ≥ τ_NMS',
        role: 'Post-processing step that eliminates redundant multi-cell detections'
      }
    ],
    playWithItPrompt:
      'Open Tab 4.9 ("YOLO & IoU"). Drag "Predicted Box Horizontal Shift (Δx)" from 0.0 (perfect alignment, IoU = 1.000) to 10.0 (zero overlap, IoU = 0.000) and watch Intersection Area, Union Area, and IoU update! Then adjust "NMS Suppression Cutoff (τ_NMS)" to see when NMS suppresses vs keeps the second box!',
    analogyBreaks:
      'A human guard naturally sees each physical bike as a single object, whereas a convolutional detector evaluates thousands of dense anchor/grid locations in parallel and relies on Non-Maximum Suppression (NMS) to clean up duplicate boxes.',
    intuition: [
      'Two-Stage (R-CNN) vs Single-Stage (YOLO) Detectors: Older Two-Stage detectors (Faster R-CNN) first proposed ~2,000 candidate regions and then classified each region separately (accurate but slow). YOLO frames detection as a single regression pass from image pixels straight to an S × S grid of bounding boxes (x, y, w, h, confidence, class_probs), running at 60–150+ FPS on video streams!',
      'Why We Use IoU Instead of Raw Coordinate L2 Error: A 2-pixel error on a tiny distant helmet (10×10 pixels) is huge, whereas a 2-pixel error on a close-up bus (400×400 pixels) is negligible! Intersection over Union (IoU ∈ [0, 1]) is completely scale-invariant.',
      'How Non-Maximum Suppression (NMS) Works: For each class: (1) sort all predicted boxes by confidence score above p_min; (2) pick the highest-scoring box B* and add it to final detections; (3) delete every remaining box B_j whose overlap with B* exceeds IoU(B*, B_j) ≥ τ_NMS (e.g. 0.50); (4) repeat until no boxes remain!'
    ],
    mathFormulas: [
      {
        name: 'Intersection over Union (IoU / Jaccard Index)',
        latex: '\\text{IoU}(A, B) = \\frac{\\text{Area}(A \\cap B)}{\\text{Area}(A \\cup B)} = \\frac{\\max(0, \\min(x_{2A}, x_{2B}) - \\max(x_{1A}, x_{1B}))\\cdot\\max(0, \\min(y_{2A}, y_{2B}) - \\max(y_{1A}, y_{1B}))}{\\text{Area}(A) + \\text{Area}(B) - \\text{Area}(A \\cap B)}',
        explanation: 'Equals 1.0 when boxes A and B are identical, and 0.0 when they do not overlap.'
      }
    ],
    workedExample: {
      scenario: 'Ground-truth box A spans [0, 0] to [10, 10] (Area = 100). Predicted box B is shifted right by 5 pixels, spanning [5, 0] to [15, 10] (Area = 100). Compute IoU(A, B).',
      steps: [
        {
          label: 'Step 1: Compute Intersection rectangle coordinates and area',
          math: 'x_{\\text{inter}} \\in [\\max(0,5), \\min(10,15)] = [5, 10] \\implies \\text{Area}(A \\cap B) = (10 - 5) \\times (10 - 0) = 50',
          note: 'The two 10×10 squares overlap in a 5×10 rectangle of area 50.'
        },
        {
          label: 'Step 2: Compute Union area via Inclusion-Exclusion',
          math: '\\text{Area}(A \\cup B) = \\text{Area}(A) + \\text{Area}(B) - \\text{Area}(A \\cap B) = 100 + 100 - 50 = 150',
          note: 'Subtracting intersection once avoids double-counting the shared region.'
        },
        {
          label: 'Step 3: Divide Intersection by Union',
          math: '\\text{IoU}(A, B) = \\frac{50}{150} = \\frac{1}{3} \\approx 0.3333',
          note: 'IoU is 0.3333.'
        }
      ],
      result: 'Intersection = 50, Union = 150, IoU = 0.3333.',
      params: {}
    },
    quiz: [
      {
        id: 'yolo-q1',
        question: 'Why is Non-Maximum Suppression (NMS) needed at the end of a YOLO object detection pass?',
        options: [
          'To resize arbitrary camera images to a fixed 224×224 spatial resolution.',
          'Neighboring anchors fire on the same object and require deduplication.',
          'To replace non-differentiable ReLU activations during the backward pass.',
          'Because single-stage detectors can only output one bounding box per image.'
        ],
        correctIndex: 1,
        explanation: 'Without NMS, a single motorcycle at the gate would have 4–6 slightly shifted bounding boxes drawn on top of it.'
      },
      {
        id: 'yolo-q2',
        question: 'What happens in Non-Maximum Suppression if two genuinely DIFFERENT pedestrians are standing right next to each other in a crowded queue such that their true bounding boxes overlap with IoU = 0.70 (above τ_NMS = 0.50)?',
        options: [
          'Greedy NMS suppresses the second pedestrian box due to high IoU overlap.',
          'Greedy NMS automatically splits the two overlapping boxes into four boxes.',
          'The Intersection over Union metric becomes negative whenever boxes overlap.',
          'Greedy NMS deletes both the highest-scoring and second-highest boxes at once.'
        ],
        correctIndex: 0,
        explanation: 'Hard NMS cannot distinguish between a duplicate box on the same person and a real box on an occluded second person right behind them.'
      }
    ],
    summary: [
      'YOLO performs real-time single-stage object detection by predicting bounding boxes and classes across an S×S grid in one pass.',
      'Intersection over Union (IoU = Area(A ∩ B) / Area(A ∪ B)) measures scale-invariant localization accuracy.',
      'Non-Maximum Suppression (NMS) filters out overlapping duplicate detections.',
      'Build your own live detector in the Track 4 Project: College Gate Bike / Helmet Counter (YOLO)!'
    ]
  },

  // =========================================================================
  // TRACK 4 — LESSON 4.10: IMAGE SEGMENTATION (U-NET)
  // =========================================================================
  'image-segmentation-unet': {
    slug: 'image-segmentation-unet',
    scene: {
      title: 'Coloring Every Single Pixel of a Medical Scan Using an Hourglass Encoder-Decoder with Skip Bridges (U-Net)',
      narrative:
        'Object detection only draws a coarse rectangle around a tumor or road lane. What if a surgeon needs the exact pixel-by-pixel boundary (Semantic Segmentation)? If you only downsample an image through a CNN Encoder, you know what is in the photo (semantic context), but the feature map is shrunk to 14×14 so you lost where the crisp pixel borders were! Ronneberger et al. (2015) solved this with U-Net: a U-shaped Encoder-Decoder where every upsampling stage in the Decoder receives a direct high-resolution Skip Concatenation bridge from the matching Encoder stage—combining deep semantic context with crisp pixel-level edges, optimized with the Dice Coefficient!'
    },
    mapping: [
      {
        scenePart: 'Left side of the U: zooming out to understand global context ("what")',
        modelPart: 'Contracting Encoder Path',
        symbol: 'Conv-ReLU-MaxPool stages',
        role: 'Doubles channels while halving spatial resolution H×W at each level'
      },
      {
        scenePart: 'Right side of the U: zooming back in to full H×W pixel resolution',
        modelPart: 'Expanding Decoder Path',
        symbol: 'Transposed Conv / Upsampling stages',
        role: 'Restores spatial dimensions up to the original input H×W'
      },
      {
        scenePart: 'Horizontal bridges copying sharp border lines across the U',
        modelPart: 'Channel-Wise Skip Concatenation',
        symbol: 'Concat(E_l, D_l) along channel axis',
        role: 'Re-injects fine-grained spatial coordinates lost during Max Pooling'
      },
      {
        scenePart: 'Measuring overlap between predicted pixel mask and true organ mask',
        modelPart: 'Soft Dice Coefficient & Dice Loss',
        symbol: 'Dice = 2 Σ p_i g_i / (Σ p_i + Σ g_i)',
        role: 'Immune to 99% background pixel imbalance; directly maximizes mask overlap'
      }
    ],
    playWithItPrompt:
      'Open Tab 4.10 ("U-Net & Dice"). Drag "Foreground Pixel Probability (p_fg)" toward 0.99 and "Background False-Alarm Probability (p_bg)" toward 0.01 to watch the Soft Dice Coefficient climb toward 1.0000 and Dice Loss drop toward 0.0000, with live analytical gradient ∂L_Dice / ∂p_fg!',
    analogyBreaks:
      'A coloring book already has black outlines printed on the page, whereas U-Net receives raw continuous pixels and must infer both the object boundaries and the interior class labels simultaneously.',
    intuition: [
      'The "What" vs "Where" Trade-off in Vision: Max-pooling and strided convolutions give deep layers a wide receptive field (so they know what organ is present), but discard exact pixel coordinates. U-Net bridges this gap by concatenating the high-resolution feature maps from each Encoder stage directly onto the upsampled Decoder maps at the same resolution!',
      'ResNet Addition (+) vs U-Net Concatenation (Concat): ResNet adds [C, H, W] + [C, H, W] → [C, H, W] across consecutive blocks to aid gradient flow. U-Net concatenates encoder features and upsampled decoder features along the channel axis [C, H, W] || [C, H, W] → [2C, H, W] across the entire U-shape so the subsequent 3×3 conv can fuse low-level edge coordinates with high-level semantic classes!',
      'Why Dice Loss Beats Pixel Cross-Entropy on Small Foreground Objects: If a tumor occupies only 1% of the pixels in an MRI scan (99% background), standard pixel-wise cross-entropy is dominated by the 99% easy background pixels. The Soft Dice Loss L_Dice = 1 - (2 ∑ p_i g_i) / (∑ p_i + ∑ g_i) ignores True Negative background pixels completely and directly optimizes the F1 overlap of the foreground mask!'
    ],
    mathFormulas: [
      {
        name: 'Soft Dice Coefficient & Dice Loss',
        latex: '\\text{Dice}(\\mathbf{p}, \\mathbf{g}) = \\frac{2\\sum_{i=1}^N p_i g_i + \\epsilon}{\\sum_{i=1}^N p_i + \\sum_{i=1}^N g_i + \\epsilon}, \\qquad \\mathcal{L}_{\\text{Dice}} = 1 - \\text{Dice}(\\mathbf{p}, \\mathbf{g})',
        explanation: 'Differentiable relaxation of the F1 / Sørensen-Dice score over pixel probabilities p_i ∈ (0, 1) and binary mask g_i ∈ {0, 1}.'
      },
      {
        name: 'Analytical Gradient of Soft Dice Loss w.r.t Pixel Probability p_k',
        latex: '\\frac{\\partial \\mathcal{L}_{\\text{Dice}}}{\\partial p_k} = -\\frac{2 g_k \\left(\\sum_i p_i + \\sum_i g_i + \\epsilon\\right) - \\left(2\\sum_i p_i g_i + \\epsilon\\right)}{\\left(\\sum_i p_i + \\sum_i g_i + \\epsilon\\right)^2}',
        explanation: 'Exact quotient-rule derivative pushing foreground probabilities (g_k=1) toward 1 and background probabilities (g_k=0) toward 0.'
      }
    ],
    workedExample: {
      scenario: 'On a 4-pixel patch with true binary mask g = [1, 1, 0, 0], U-Net predicts probabilities p = [0.8, 0.8, 0.2, 0.2] (with ε = 0). Compute the Soft Dice Coefficient and Dice Loss.',
      steps: [
        {
          label: 'Step 1: Compute Intersection sum Σ p_i g_i',
          math: '\\sum_{i=1}^4 p_i g_i = (0.8)(1) + (0.8)(1) + (0.2)(0) + (0.2)(0) = 1.600',
          note: 'Only foreground pixels (g_i = 1) contribute to the numerator.'
        },
        {
          label: 'Step 2: Compute Denominator sum Σ p_i + Σ g_i',
          math: '\\sum p_i + \\sum g_i = (0.8 + 0.8 + 0.2 + 0.2) + (1 + 1 + 0 + 0) = 2.0 + 2.0 = 4.000',
          note: 'Background false alarms (0.2 + 0.2) inflate ∑ p_i in the denominator!'
        },
        {
          label: 'Step 3: Compute Soft Dice and Dice Loss',
          math: '\\text{Dice} = \\frac{2(1.600)}{4.000} = 0.8000, \\qquad \\mathcal{L}_{\\text{Dice}} = 1 - 0.8000 = 0.2000',
          note: 'Dice score is 80.0%; Dice loss is 0.2000.'
        }
      ],
      result: 'Soft Dice Coefficient = 0.8000; Dice Loss = 0.2000.',
      params: {}
    },
    quiz: [
      {
        id: 'unet-q1',
        question: 'What happens to a U-Net\'s segmentation masks if you sever (delete) all the horizontal Skip Connections between the Encoder and the Decoder?',
        options: [
          'The network can no longer compute Softmax.',
          'The output image becomes 1×1 pixel.',
          'The output masks become blurry blobs.',
          'Dice Loss becomes negative.'
        ],
        correctIndex: 2,
        explanation: 'Skip connections carry high-spatial-frequency boundary details from early encoder layers directly to the decoder upsampling stages.'
      },
      {
        id: 'unet-q2',
        question: 'Why is Dice Loss (or Combo BCE + Dice Loss) strongly preferred over plain pixel-wise Accuracy when segmenting tiny retinal blood vessels that cover only 2% of the image?',
        options: [
          'Because standard pixel-wise accuracy always evaluates to 0% on medical scans.',
          'Because the Dice coefficient loss can be optimized without computing gradients.',
          'Predicting all background gives 98% pixel accuracy while missing all vessels.',
          'Because U-Net segmentation decoders can only output discrete integer logits.'
        ],
        correctIndex: 2,
        explanation: 'Dice Coefficient is mathematically identical to the harmonic F1 score at the pixel level, making it insensitive to massive True Negative background counts.'
      }
    ],
    summary: [
      'Semantic segmentation assigns a class label to every individual pixel (H × W × K output tensor).',
      'U-Net pairs a contracting Encoder with an expanding Decoder linked by channel-wise Skip Concatenations.',
      'Soft Dice Loss 1 - (2 Σ p_i g_i)/(Σ p_i + Σ g_i) directly optimizes foreground mask overlap and resists class imbalance.'
    ]
  },

  // =========================================================================
  // TRACK 6 — LESSON 6.3: POSITIONAL ENCODING
  // =========================================================================
  'positional-encoding': {
    slug: 'positional-encoding',
    scene: {
      title: 'Stamping Train Coach Seat Numbers Onto Every Passenger Ticket So Order Matters',
      narrative:
        'Look closely at the Self-Attention equation Softmax(Q K^T / √d_k) V: if you scramble the words "Dog bites man" into "Man bites dog", every token\'s dot product with every other token is 100% identical—without position labels, a Transformer is just a fancy bag-of-words! To tell the model where each word sits without bringing back slow sequential recurrence, Vaswani et al. (2017) added a geometric clock vector—Sinusoidal Positional Encoding PE(pos)—to each token embedding, while modern LLMs (Llama, Mistral, Qwen) use Rotary Position Embedding (RoPE), rotating Q and K by angle pos · θ so their dot product depends purely on relative word distance (m - n)!'
    },
    mapping: [
      {
        scenePart: 'Scrambling seats without ticket numbers gives the exact same scores',
        modelPart: 'Permutation Equivariance of Raw Self-Attention',
        symbol: 'Attn(P X) = P · Attn(X)',
        role: 'Proves raw attention has zero built-in awareness of word order'
      },
      {
        scenePart: 'Multi-hand clock with fast second-hand and slow hour-hand waves',
        modelPart: 'Sinusoidal Positional Encoding',
        symbol: 'PE(pos, 2i) = sin(pos / 10000^{2i/d}), cos(...)',
        role: 'Unique multi-frequency coordinate added to input embeddings X + PE'
      },
      {
        scenePart: 'Rotating Query by angle m·θ and Key by n·θ so their angle gap is (m-n)·θ',
        modelPart: 'Rotary Position Embedding (RoPE)',
        symbol: '(R_m q)^T (R_n k) = q^T R_{n-m} k',
        role: 'Modern LLM standard: attention score depends strictly on relative offset m - n!'
      }
    ],
    playWithItPrompt:
      'Open Tab 6.3 ("Pos Encoding"). Set "Seat Number A (pos_A)" to 2 and "Seat Number B (pos_B)" to 5 (relative offset Δ = -3) and note the RoPE Relative Dot Product (0.4357). Now shift BOTH seats by +10 to pos_A = 12 and pos_B = 15 (same offset Δ = -3): verify that the RoPE Relative Dot Product stays at the exact same 0.4357!',
    analogyBreaks:
      'A printed train seat number is a single integer (Seat 42) that grows huge on long trains, whereas Sinusoidal and RoPE encodings use bounded trigonometric waves in [-1, +1] across multiple wavelengths so values never blow up at token 8,192.',
    intuition: [
      'Why Raw Self-Attention Is Order-Blind: In an RNN, token t is processed after token t-1 via W_hh. In Self-Attention, all tokens are multiplied in parallel via Q K^T. If you swap row 1 and row 3 of X, the output simply swaps row 1 and row 3—the representation of each word is unchanged!',
      'Why Not Just Add Raw Integer Position pos ∈ {1, 2, ..., 4096}? Because at pos = 4000, adding +4000 to an embedding vector whose entries are in [-1, +1] completely drowns out the word\'s meaning! Using [sin(ω_k pos), cos(ω_k pos)] with wavelengths ranging from 2π to 10000 · 2π keeps every coordinate bounded in [-1, +1].',
      'The Trigonometric Identity Behind Sinusoidal & RoPE Encodings: Because cos(α - β) = cos α cos β + sin α sin β, rotating a 2D query vector q by m θ and a key vector k by n θ (RoPE, Su et al., 2021) makes their inner product (R_m q)^T (R_n k) depend exclusively on the relative distance (m - n) between the two words!'
    ],
    mathFormulas: [
      {
        name: 'Sinusoidal Positional Encoding (Vaswani et al., 2017)',
        latex: '\\text{PE}_{(pos, 2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right), \\qquad \\text{PE}_{(pos, 2i+1)} = \\cos\\!\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right)',
        explanation: 'For any fixed offset k, PE(pos + k) is a linear 2×2 rotation matrix applied to each frequency pair of PE(pos).'
      },
      {
        name: 'Rotary Position Embedding (RoPE) Relative Invariance',
        latex: '\\langle \\mathbf{R}_m \\mathbf{q},\\, \\mathbf{R}_n \\mathbf{k} \\rangle = \\mathbf{q}^\\top \\mathbf{R}_m^\\top \\mathbf{R}_n \\mathbf{k} = \\mathbf{q}^\\top \\mathbf{R}_{n - m} \\mathbf{k}',
        explanation: 'Because orthogonal 2D rotation matrices satisfy R_m^T R_n = R_{n-m}, the attention logit depends strictly on relative token distance (n - m).'
      }
    ],
    workedExample: {
      scenario: 'Verify that rotating 2D vectors q = [1, 0]^T at position m = 10 and k = [1, 0]^T at position n = 12 by angle θ = 0.5 rad/token produces the exact same dot product as at positions m = 0 and n = 2.',
      steps: [
        {
          label: 'Step 1: Rotate q at m = 10 (angle = 5.0 rad) and k at n = 12 (angle = 6.0 rad)',
          math: '\\mathbf{R}_{10}\\mathbf{q} = [\\cos 5,\\, \\sin 5]^\\top, \\qquad \\mathbf{R}_{12}\\mathbf{k} = [\\cos 6,\\, \\sin 6]^\\top',
          note: 'Each vector is rotated on the unit circle by its absolute position angle.'
        },
        {
          label: 'Step 2: Compute Dot Product using cos(α - β) = cos α cos β + sin α sin β',
          math: '(\\mathbf{R}_{10}\\mathbf{q}) \\cdot (\\mathbf{R}_{12}\\mathbf{k}) = \\cos(5)\\cos(6) + \\sin(5)\\sin(6) = \\cos(6 - 5) = \\cos(1.0) \\approx 0.5403',
          note: 'Depends ONLY on the difference (12 - 10) × 0.5 = 1.0 rad—identical to positions m=0 and n=2!'
        }
      ],
      result: 'RoPE dot product = cos(1.0) = 0.5403 for any pair separated by Δ = 2 tokens.',
      params: {}
    },
    quiz: [
      {
        id: 'pe-q1',
        question: 'What happens if you train a Transformer classifier on sentences WITHOUT any Positional Encoding (and without causal masking)?',
        options: [
          'The Transformer raises a matrix dimension mismatch error.',
          'The Transformer becomes invariant to token word order.',
          'All scaled dot-product attention weights collapse to zero.',
          'The attention layer automatically reverts to an RNN loop.'
        ],
        correctIndex: 1,
        explanation: 'Without positional encodings (or causal masks), Self-Attention is permutation-equivariant: permuting input tokens simply permutes output rows identically.'
      },
      {
        id: 'pe-q2',
        question: 'Why do modern LLMs (like Llama-3, Mistral, and Qwen) use Rotary Position Embedding (RoPE) applied directly to Q and K in every attention layer instead of Learned Absolute Positional Embeddings?',
        options: [
          'Because absolute learned position embeddings cannot be differentiated.',
          'Because Rotary Position Embedding doubles the tokenizer vocabulary size.',
          'Because Rotary Position Embedding removes the need for Value vectors V.',
          'Because RoPE encodes relative distance (n - m) via 2D query-key rotations.'
        ],
        correctIndex: 3,
        explanation: 'RoPE preserves exact relative distance invariants at every attention layer and supports context-window extension.'
      }
    ],
    summary: [
      'Self-Attention is permutation-equivariant by default and requires explicit Positional Encoding to distinguish word order.',
      'Sinusoidal encodings use geometric frequencies so relative shifts correspond to linear 2D rotations.',
      'Rotary Position Embedding (RoPE) rotates Q and K directly so q_m^T k_n depends strictly on relative offset (n - m).'
    ]
  },

  // =========================================================================
  // TRACK 6 — LESSON 6.4: BERT VS GPT
  // =========================================================================
  'bert-vs-gpt': {
    slug: 'bert-vs-gpt',
    scene: {
      title: 'Solving a Crossword Fill-in-the-Blank Using Both Clues (BERT Encoder) vs Typing Next-Word Autocomplete Without Peeking Ahead (GPT Decoder)',
      narrative:
        'Why did the original Transformer split into two famous families: BERT and GPT? Imagine two different language tasks: (1) Fill-in-the-Blank (BERT — Bidirectional Encoder): "The bank of the [MASK] overflowed after monsoon rain." To know that [MASK] is "river" and not "SBI ATM", you MUST look ahead at the future word "overflowed"! So BERT lets every token attend to both left AND right tokens (Bidirectional Attention). (2) Autoregressive Generation (GPT — Causal Decoder): generating a story one word at a time from left to right. If Token 2 could peek ahead at Token 3 during training, it would just copy the answer and learn nothing! So GPT adds an upper-triangular Causal Mask of -∞ before Softmax so exp(-∞) = 0 for all future words!'
    },
    mapping: [
      {
        scenePart: 'Reading both before and after a blank to understand context',
        modelPart: 'BERT Bidirectional Encoder + Masked LM (MLM)',
        symbol: 'Full N × N attention matrix (no mask)',
        role: 'Masks 15% of input tokens and reconstructs them using full left+right context'
      },
      {
        scenePart: 'Cardboard blinder covering future words while predicting the next word',
        modelPart: 'GPT Causal Look-Ahead Mask',
        symbol: 'M_{ij} = 0 if j ≤ i else -∞',
        role: 'Added to QK^T/√d_k before Softmax so α_{ij} = 0 for all future positions j > i'
      },
      {
        scenePart: 'Training on all N next-word predictions in one parallel matrix pass',
        modelPart: 'Parallel Causal Teacher Forcing',
        symbol: 'L = -Σ_{t=1}^N log P(x_t | x_{≤t-1})',
        role: 'Lets GPT train on all positions simultaneously without leaking future tokens!'
      }
    ],
    playWithItPrompt:
      'Open Tab 6.4 ("BERT vs GPT"). Slide "Current Query Word Index (i ∈ 0..3)" from Token 0 to Token 3 and compare the BERT Bidirectional Weights (all 4 words have non-zero attention at every step) against the GPT Causal Look-Ahead Masked Weights (every future word j > i is strictly 0.0% while weights ≤ i sum to 100.0%)!',
    analogyBreaks:
      'A human writer can go back and erase a sentence they wrote 2 minutes ago, whereas standard autoregressive GPT decoding commits to each emitted token left-to-right so past tokens\' KV-cache states are never recomputed when later tokens are generated.',
    intuition: [
      'How the Causal Mask Works Mathematically: Why do we add -∞ (or -10⁹ in float32) to the upper triangle (j > i) of the score matrix S = Q K^T / √d_k before Softmax, instead of zeroing out weights after Softmax? Because if you zeroed out weights after Softmax, the remaining weights in row i wouldn\'t sum to 1.0! Adding -∞ before Softmax makes exp(-∞) = 0.0, so Softmax automatically normalizes only over the valid past/present tokens j ≤ i!',
      'When to Choose BERT (Encoder) vs GPT (Decoder): BERT-style Encoders (RoBERTa, DeBERTa, BGE Embeddings) see bidirectional context at every layer, making them compact powerhouses for Embedding extraction (RAG), Sentiment Classification, and Named Entity Recognition (NER). GPT-style Causal Decoders (GPT-4, Claude, Gemini, Llama) excel at open-ended text generation, coding, and few-shot reasoning.'
    ],
    mathFormulas: [
      {
        name: 'Causal Masked Scaled Dot-Product Attention (GPT Decoder)',
        latex: '\\text{Attention}_{\\text{causal}}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{Softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt{d_k}} + \\mathbf{M}\\right)\\mathbf{V}, \\qquad M_{ij} = \\begin{cases} 0 & \\text{if } j \\le i \\\\ -\\infty & \\text{if } j > i \\end{cases}',
        explanation: 'Since exp(-∞) = 0, position i assigns zero attention weight to any future position j > i.'
      }
    ],
    workedExample: {
      scenario: 'At query position i = 1 (the 2nd word in a 3-word sequence), raw scaled dot-product scores are s = [1.0, 1.0, 4.0]. Compare the attention weights α under BERT (bidirectional) vs GPT (causal mask).',
      steps: [
        {
          label: 'Step 1: BERT Bidirectional Softmax over [1.0, 1.0, 4.0]',
          math: 'e^1 \\approx 2.718, \\; e^4 \\approx 54.598 \\implies \\boldsymbol{\\alpha}_{\\text{BERT}} = \\frac{[2.718, 2.718, 54.598]}{60.034} \\approx [0.045, 0.045, 0.909]',
          note: 'BERT attends 90.9% to future word j = 2!'
        },
        {
          label: 'Step 2: Apply GPT Causal Mask at i = 1 (mask j = 2 > 1 with -∞)',
          math: '\\mathbf{s}_{\\text{masked}} = [1.0,\\; 1.0,\\; -\\infty] \\implies \\exp(\\mathbf{s}_{\\text{masked}}) = [e^1,\\; e^1,\\; 0]',
          note: 'Future token score 4.0 is masked to -∞ before Softmax.'
        },
        {
          label: 'Step 3: Normalize GPT Causal Weights',
          math: '\\boldsymbol{\\alpha}_{\\text{GPT}} = \\left[\\frac{e^1}{2e^1},\\; \\frac{e^1}{2e^1},\\; 0\\right] = [0.500,\\; 0.500,\\; 0.000]',
          note: 'Future weight is strictly 0.000 and visible weights sum to 1.000!'
        }
      ],
      result: 'BERT weights = [4.5%, 4.5%, 90.9%]; GPT causal weights = [50.0%, 50.0%, 0.0%].',
      params: {}
    },
    quiz: [
      {
        id: 'bg-q1',
        question: 'In a GPT causal decoder, why do we add -∞ to future positions (j > i) BEFORE applying Softmax, instead of simply multiplying the post-Softmax attention matrix by a binary 0/1 mask?',
        options: [
          'Because exp(-∞) = 0 in Softmax, giving future tokens 0 weight while rows sum to 1.',
          'Because multiplying attention weights by zero after Softmax produces NaN values.',
          'Because filling the upper triangle with -∞ reduces matrix memory footprint by 50%.',
          'Because adding -∞ allows the decoder to attend to future tokens during training.'
        ],
        correctIndex: 0,
        explanation: 'Zeroing after Softmax leaves rows summing to < 1.0 and leaks the magnitude of future logits through the Softmax denominator!'
      },
      {
        id: 'bg-q2',
        question: 'Why is a BERT-style Bidirectional Encoder typically preferred over a causal decoder for computing dense document chunk embeddings in a RAG vector database?',
        options: [
          'Because BERT replaces all self-attention layers with fixed keyword lookup tables.',
          'Because bidirectional attention lets every token attend to both left and right context.',
          'Because autoregressive causal decoders cannot output continuous vector embeddings.',
          'Because BERT encoders contain zero trainable weight matrices during fine-tuning.'
        ],
        correctIndex: 1,
        explanation: 'In a causal model, token 1 only sees token 1; in a bidirectional encoder, every token integrates context from the entire passage.'
      }
    ],
    summary: [
      'BERT is a bidirectional Transformer Encoder trained with Masked Language Modeling (MLM) to excel at representation and classification.',
      'GPT is a causal Transformer Decoder trained with next-token prediction using an upper-triangular -∞ look-ahead mask.',
      'Adding -∞ before Softmax ensures zero information leakage from future tokens while keeping row probabilities summing to 1.',
      'Build your own causal decoder in the Track 6 Project: Tiny ChatGPT From Scratch!'
    ]
  },

  // =========================================================================
  // TRACK 6 — LESSON 6.5: VISION TRANSFORMER (ViT)
  // =========================================================================
  'vision-transformer-vit': {
    slug: 'vision-transformer-vit',
    scene: {
      title: 'Cutting a 224×224 Photograph into 196 Jigsaw Puzzle Tiles (16×16 Patches) and Feeding Them to a Standard Transformer',
      narrative:
        'For 20 years, Computer Vision meant Convolutional Neural Networks (Track 4), while NLP meant Transformers (Track 6). Couldn\'t we feed an image directly into a Transformer? If you treated every single pixel of a 224×224 photo as a token, sequence length would be N = 50,176 tokens—and self-attention\'s N² matrix would have 2.5 BILLION entries per layer (impossible on any GPU)! Dosovitskiy et al. (2020) solved this with a brilliantly simple idea in the Vision Transformer (ViT): slice the 224×224×3 image into a 14×14 grid of non-overlapping 16×16 jigsaw tiles (N = 196 patches!), flatten each 16×16×3 tile into a 768-number vector, prepend 1 learnable [CLS] summary token (total length L = 197), add 1D positional embeddings, and pass it through a standard Transformer Encoder!'
    },
    mapping: [
      {
        scenePart: 'Slicing a 224×224 photo into 16×16 square jigsaw tiles',
        modelPart: 'Non-Overlapping Patch Tokenization',
        symbol: 'N = (H · W) / P² = (224 / 16)² = 196 patches',
        role: 'Reduces sequence length from 50,176 pixels down to 196 manageable tokens!'
      },
      {
        scenePart: 'Unrolling each 16×16×3 RGB tile into a 768-number list',
        modelPart: 'Linear Patch Projection (Conv2d stride=P)',
        symbol: 'z_p = E · vec(x_p) ∈ R^{d_model}',
        role: 'Implemented in 1 line as Conv2d(in=3, out=768, kernel_size=16, stride=16)'
      },
      {
        scenePart: 'Extra blank summary card prepended at index 0',
        modelPart: 'Learnable [CLS] Token + Position Embeddings',
        symbol: 'Z_0 = [x_class; z_1; ...; z_N] + E_pos ∈ R^{(N+1) × d}',
        role: 'Final layer state of [CLS] aggregates global image context for classification'
      }
    ],
    playWithItPrompt:
      'Open Tab 6.5 ("Vision Transformer"). Slide "Jigsaw Tile / Patch Size (P × P pixels)" between 8×8, 16×16, and 32×32 on a 224×224 image: watch how P = 16 gives 14×14 = 196 patches (197 tokens with [CLS] and 38,809 attention pairs), whereas shrinking P to 8×8 quadruples tokens to 785 and explodes Attention Pairs L² by 16× to 616,225!',
    analogyBreaks:
      'When you solve a physical jigsaw puzzle, you only match adjacent touching edges first, whereas a Vision Transformer allows the top-left corner patch (Patch 1) and the bottom-right corner patch (Patch 196) to attend to each other directly in Layer 1!',
    intuition: [
      'How Patchification Works in Practice: A 224 × 224 × 3 image sliced into P × P = 16 × 16 patches yields N = (224/16) × (224/16) = 14 × 14 = 196 patches. Each patch contains 16 × 16 × 3 = 768 raw pixel values, which is linearly projected to d_model = 768. In PyTorch, slicing and projecting is a single strided convolution: nn.Conv2d(3, 768, kernel_size=16, stride=16)!',
      'Inductive Bias Trade-off (CNN vs ViT): A CNN has strong built-in spatial inductive biases (locality via 3×3 kernels and 2D translation equivariance via weight sharing), so it learns well even on small datasets (1k–50k images). A Vision Transformer (ViT) has almost no spatial inductive bias—it must learn from data how the 2D grid fits together, but its global self-attention from Layer 1 allows it to surpass CNNs when pretrained on massive datasets (14M–300M images) or via self-supervised CLIP / DINOv2!',
      'Why Halving Patch Size P Costs 16× More Attention Compute: Because the number of patches scales as N = H W / P² and Self-Attention complexity scales as O(N²), halving P from 16 to 8 multiplies N by 4× and multiplies the N × N attention matrix by 4² = 16×!'
    ],
    mathFormulas: [
      {
        name: 'ViT Patch Count & Sequence Length',
        latex: 'N = \\frac{H \\cdot W}{P^2}, \\qquad L = N + 1, \\qquad \\mathbf{x}_p \\in \\mathbb{R}^{N \\times (P^2 \\cdot C)}',
        explanation: 'Reshapes image X ∈ R^{H × W × C} into N flattened patches of dimension P²C, plus 1 prepended [CLS] token.'
      },
      {
        name: 'ViT Input Embedding & Quadratic Patch-Scaling Law',
        latex: '\\mathbf{Z}_0 = \\big[\\mathbf{x}_{\\text{class}};\\, \\mathbf{x}_p^1\\mathbf{E};\\, \\dots;\\, \\mathbf{x}_p^N\\mathbf{E}\\big] + \\mathbf{E}_{\\text{pos}}, \\qquad \\text{Attention Complexity} = \\mathcal{O}\\!\\left(\\frac{H^2 W^2}{P^4}\\right)',
        explanation: 'Self-attention pairwise cost scales inversely with the fourth power of patch size P!'
      }
    ],
    workedExample: {
      scenario: 'For a ViT-Base/16 model receiving a 224 × 224 × 3 RGB image with patch size P = 16 and hidden dimension d_model = 768, compute the patch count N, sequence length L, and flattened patch dimension.',
      steps: [
        {
          label: 'Step 1: Compute Patch Grid and Number of Patches N',
          math: 'N = \\frac{224}{16} \\times \\frac{224}{16} = 14 \\times 14 = 196\\text{ patches}',
          note: '14 rows by 14 columns of jigsaw tiles.'
        },
        {
          label: 'Step 2: Add [CLS] token for Total Sequence Length L',
          math: 'L = N + 1 = 196 + 1 = 197\\text{ tokens}',
          note: 'Each self-attention head computes a 197 × 197 attention matrix.'
        },
        {
          label: 'Step 3: Compute Flattened Patch Vector Dimension',
          math: 'D_{\\text{patch}} = P^2 \\cdot C = 16 \\times 16 \\times 3 = 768\\text{ values per patch}',
          note: 'Matches d_model = 768 directly!'
        }
      ],
      result: 'N = 196 patches, L = 197 tokens (with [CLS]), D_patch = 768.',
      params: {}
    },
    quiz: [
      {
        id: 'vit-q1',
        question: 'Why does a Vision Transformer (ViT) split a 224×224 image into 16×16 patches (N = 196) instead of treating every individual pixel as a token (N = 50,176)?',
        options: [
          'Splitting into patches removes the need for positional encodings.',
          'Transformer encoders are hard-coded to accept at most 196 tokens.',
          'Individual image pixels do not possess RGB color channel values.',
          'Self-Attention scales quadratically O(N²) in sequence length N.'
        ],
        correctIndex: 3,
        explanation: 'Patch tokenization reduces sequence length N by a factor of P² = 256×, which reduces quadratic O(N²) attention cost by 256² = 65,536×!'
      },
      {
        id: 'vit-q2',
        question: 'When training from scratch on a small dataset of only 3,000 images (without pretraining), why does a standard ResNet CNN usually outperform a Vision Transformer (ViT) trained from scratch?',
        options: [
          'Because Vision Transformers cannot be trained with backpropagation.',
          'Because Vision Transformers contain zero learnable weight matrices.',
          'Because CNNs have built-in locality and translation equivariance biases.',
          'Because ResNet architectures tokenize images into 16×16 pixel patches.'
        ],
        correctIndex: 2,
        explanation: 'Inductive bias acts as prior knowledge on small datasets; at large scale (or when fine-tuning a pretrained ViT/CLIP checkpoint), ViT\'s flexible global attention excels.'
      }
    ],
    summary: [
      'Vision Transformer (ViT) slices an H×W×C image into N = (HW)/P² flattened patches of dimension P²C.',
      'A learnable [CLS] token is prepended (L = N + 1) and 1D positional embeddings are added before the Transformer Encoder.',
      'ViT trades CNN locality bias for global Layer-1 self-attention, dominating modern multimodal and foundation vision models.',
      'Compare them head-to-head in the Track 6 Project: Vision Transformer vs CNN on CIFAR-10!'
    ]
  }
};
