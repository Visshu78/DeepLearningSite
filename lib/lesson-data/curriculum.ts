export interface LessonMeta {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  moduleId: string;
  moduleName: string;
  moduleNumber: number;
  lessonNumber: number;
  duration: string;
  prerequisites: string[];
  status: 'available' | 'upcoming';
  keyTakeaways: string[];
}

export interface ModuleMeta {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: LessonMeta[];
  status: 'available' | 'upcoming';
}

export const CURRICULUM: ModuleMeta[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Foundations of Neural Networks',
    description: 'Explore the biological inspiration and mathematical formulation of the artificial neuron, linear combinations, and activation functions.',
    status: 'available',
    lessons: [
      {
        id: 'lesson-1',
        slug: 'what-is-an-artificial-neuron',
        title: 'What is an Artificial Neuron?',
        subtitle: 'The elementary building block of deep learning: inputs, weights, bias, summation, and activations.',
        moduleId: 'module-1',
        moduleName: 'Foundations of Neural Networks',
        moduleNumber: 1,
        lessonNumber: 1,
        duration: '10 min',
        prerequisites: [],
        status: 'available',
        keyTakeaways: [
          'A neuron computes a weighted sum of inputs plus a bias: z = Σ(wᵢxᵢ) + b',
          'Weights scale the sensitivity of the neuron to specific features',
          'Bias shifts the activation threshold independently of inputs',
          'The activation function introduces non-linearity: a = φ(z)'
        ]
      },
      {
        id: 'lesson-2',
        slug: 'activation-functions',
        title: 'How Activation Functions Work',
        subtitle: 'Introducing non-linearity: comparing Sigmoid, Tanh, ReLU, and Leaky ReLU with derivative curves.',
        moduleId: 'module-1',
        moduleName: 'Foundations of Neural Networks',
        moduleNumber: 1,
        lessonNumber: 2,
        duration: '15 min',
        prerequisites: ['what-is-an-artificial-neuron'],
        status: 'available',
        keyTakeaways: [
          'Without non-linear activations, multi-layer networks collapse into simple linear models',
          'Sigmoid and Tanh saturate at extreme inputs, leading to vanishing gradients',
          'ReLU avoids saturation for positive inputs and calculates in O(1) time',
          'Derivative magnitude directly governs the speed of learning during backpropagation'
        ]
      }
    ]
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Forward Propagation',
    description: 'Connect artificial neurons into layered architectures to transform raw input representations into predictions.',
    status: 'available',
    lessons: [
      {
        id: 'lesson-3',
        slug: 'forward-propagation',
        title: 'Forward Propagation in Multi-Layer Networks',
        subtitle: 'Tracing signals from input features through hidden representations to output predictions.',
        moduleId: 'module-2',
        moduleName: 'Forward Propagation',
        moduleNumber: 2,
        lessonNumber: 3,
        duration: '18 min',
        prerequisites: ['what-is-an-artificial-neuron', 'activation-functions'],
        status: 'available',
        keyTakeaways: [
          'Layers compute representations hierarchically: z^[l] = W^[l] · a^[l-1] + b^[l]',
          'Each layer acts as a learned coordinate transformation',
          'Intermediate pre-activations (z) and post-activations (a) are cached for backward propagation',
          'The final layer activation determines the prediction format (continuous value, probability, logits)'
        ]
      }
    ]
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Loss Functions and Gradient Descent',
    description: 'Formulate an objective error landscape and systematically descend towards the optimal parameters.',
    status: 'available',
    lessons: [
      {
        id: 'lesson-4',
        slug: 'loss-functions',
        title: 'Loss Functions & Error Landscapes',
        subtitle: 'Quantifying prediction discrepancies using Mean Squared Error and Cross-Entropy formulations.',
        moduleId: 'module-3',
        moduleName: 'Loss Functions and Gradient Descent',
        moduleNumber: 3,
        lessonNumber: 4,
        duration: '12 min',
        prerequisites: ['forward-propagation'],
        status: 'available',
        keyTakeaways: [
          'A loss function L(y, ŷ) evaluates error on an individual sample',
          'The cost function J(W, b) averages loss across the entire training dataset',
          'Squaring penalizes large deviations disproportionately compared to small errors',
          'The derivative ∂L/∂ŷ provides the initial gradient signal for backpropagation'
        ]
      },
      {
        id: 'lesson-5',
        slug: 'gradient-descent',
        title: 'Gradient Descent & Optimization Dynamics',
        subtitle: 'Iterative parameter optimization using analytical derivatives, step sizes, and stability bounds.',
        moduleId: 'module-3',
        moduleName: 'Loss Functions and Gradient Descent',
        moduleNumber: 3,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['loss-functions'],
        status: 'available',
        keyTakeaways: [
          'The negative gradient points in the direction of steepest local descent',
          'Parameter update rule: θ_next = θ_current - η · (dL/dθ)',
          'Too small learning rate η leads to crawling progress; too large causes oscillations or divergence',
          'Convex landscapes guarantee global minima; non-convex landscapes feature saddle points and local minima'
        ]
      }
    ]
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Backpropagation',
    description: 'Deconstruct the engine of modern deep learning: applying the multivariate chain rule across layers.',
    status: 'available',
    lessons: [
      {
        id: 'lesson-6',
        slug: 'backpropagation-fundamentals',
        title: 'Backpropagation & The Chain Rule',
        subtitle: 'Propagating errors backward through layered derivatives to compute exact parameter gradients.',
        moduleId: 'module-4',
        moduleName: 'Backpropagation',
        moduleNumber: 4,
        lessonNumber: 6,
        duration: '25 min',
        prerequisites: ['gradient-descent'],
        status: 'available',
        keyTakeaways: [
          'Backpropagation evaluates ∂L/∂w by decomposing it into local derivatives via the chain rule',
          'Errors propagate from the loss node backward toward the inputs: ∂L/∂z = ∂L/∂a · φ\'(z)',
          'Gradients for weights equal the upstream error multiplied by the corresponding incoming activation: ∂L/∂w = δ · a_in',
          'Numerical gradient checking with finite differences provides mathematical verification of analytical gradients'
        ]
      }
    ]
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Convolutional Neural Networks',
    description: 'Learn spatial feature extraction, 2D convolutions, receptive fields, and downsampling techniques.',
    status: 'upcoming',
    lessons: [
      {
        id: 'lesson-7',
        slug: 'convolutional-filters',
        title: 'Kernels, Strides, and Feature Maps',
        subtitle: 'Translational invariance and spatial filtering in visual recognition.',
        moduleId: 'module-5',
        moduleName: 'Convolutional Neural Networks',
        moduleNumber: 5,
        lessonNumber: 7,
        duration: '20 min',
        prerequisites: ['forward-propagation'],
        status: 'upcoming',
        keyTakeaways: []
      },
      {
        id: 'lesson-8',
        slug: 'pooling-and-receptive-fields',
        title: 'Pooling Layers & Receptive Fields',
        subtitle: 'Dimensionality reduction, max pooling, and spatial hierarchy construction.',
        moduleId: 'module-5',
        moduleName: 'Convolutional Neural Networks',
        moduleNumber: 5,
        lessonNumber: 8,
        duration: '15 min',
        prerequisites: ['convolutional-filters'],
        status: 'upcoming',
        keyTakeaways: []
      }
    ]
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Training and Generalization',
    description: 'Diagnose underfitting, overfitting, regularization methods, learning rate decay, and adaptive optimizers.',
    status: 'upcoming',
    lessons: [
      {
        id: 'lesson-9',
        slug: 'regularization-dropout',
        title: 'Overfitting, L2 Weight Decay & Dropout',
        subtitle: 'Techniques to improve out-of-sample generalization and network robustness.',
        moduleId: 'module-6',
        moduleName: 'Training and Generalization',
        moduleNumber: 6,
        lessonNumber: 9,
        duration: '20 min',
        prerequisites: ['backpropagation-fundamentals'],
        status: 'upcoming',
        keyTakeaways: []
      },
      {
        id: 'lesson-10',
        slug: 'adaptive-optimizers',
        title: 'Momentum, RMSprop, and Adam',
        subtitle: 'Adaptive learning rate algorithms and second-moment estimation.',
        moduleId: 'module-6',
        moduleName: 'Training and Generalization',
        moduleNumber: 6,
        lessonNumber: 10,
        duration: '25 min',
        prerequisites: ['gradient-descent'],
        status: 'upcoming',
        keyTakeaways: []
      }
    ]
  }
];

export const ALL_LESSONS = CURRICULUM.flatMap(m => m.lessons);

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return ALL_LESSONS.find(l => l.slug === slug);
}

export function getAdjacentLessons(currentSlug: string): {
  prev: LessonMeta | null;
  next: LessonMeta | null;
} {
  const availableLessons = ALL_LESSONS.filter(l => l.status === 'available');
  const index = availableLessons.findIndex(l => l.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? availableLessons[index - 1] : null,
    next: index < availableLessons.length - 1 ? availableLessons[index + 1] : null
  };
}
