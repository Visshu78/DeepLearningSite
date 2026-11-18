export interface LessonMeta {
  id: string;
  lessonCode: string;
  slug: string;
  title: string;
  subtitle: string;
  everydayScene: string;
  isFreePreview: boolean;
  moduleId: string;
  moduleName: string;
  moduleNumber: number;
  lessonNumber: number;
  duration: string;
  prerequisites: string[];
  status: 'available' | 'upcoming';
  relatedProjectSlug: string;
  keyTakeaways: string[];
}

export interface ModuleMeta {
  id: string;
  number: number;
  learningOrder: number;
  title: string;
  description: string;
  lessons: LessonMeta[];
  status: 'available' | 'upcoming';
  projectSlugs: string[];
}

/**
 * 10-Track Curriculum in Official Learning Order (PRD v2.1 Section 6):
 * Track 0 -> Track 9 (Data Preparation) -> Tracks 1 to 8.
 * Track numbers are fixed identifiers for URLs and code.
 */
export const CURRICULUM: ModuleMeta[] = [
  // =========================================================================
  // TRACK 0: Math Toolkit (Learning Order #1)
  // =========================================================================
  {
    id: 'track-0',
    number: 0,
    learningOrder: 1,
    title: 'Math Toolkit',
    description:
      'Build rock-solid intuition for linear algebra, derivatives, the chain rule, and probability before training your first model.',
    status: 'available',
    projectSlugs: ['autodiff-engine-from-scratch'],
    lessons: [
      {
        id: 'lesson-0-1',
        lessonCode: '0.1',
        slug: 'vectors-matrices-and-dot-products',
        title: 'Vectors, Matrices and Dot Products',
        subtitle: 'Measuring similarity and transforming feature spaces with dot products and matrix multiplication.',
        everydayScene: 'A "taste match" score between you and a friend\'s playlist',
        isFreePreview: true,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 1,
        duration: '15 min',
        prerequisites: [],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'The dot product a · b = Σ aᵢbᵢ measures alignment between two feature vectors',
          'Cosine similarity normalizes dot products by vector lengths to compare direction',
          'Matrix multiplication W · x computes a batch of dot products in parallel'
        ]
      },
      {
        id: 'lesson-0-2',
        lessonCode: '0.2',
        slug: 'derivatives-and-gradients',
        title: 'Derivatives and Gradients',
        subtitle: 'Rates of change, partial derivatives, and why the gradient points uphill.',
        everydayScene: 'Feeling the slope of a hill under your feet',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 2,
        duration: '15 min',
        prerequisites: ['vectors-matrices-and-dot-products'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'A derivative df/dx measures the instantaneous sensitivity of output f to a tiny nudge in x',
          'Partial derivatives ∂f/∂xᵢ hold all other inputs constant while varying a single coordinate',
          'The gradient vector ∇f collects all partial derivatives and points in the direction of steepest ascent'
        ]
      },
      {
        id: 'lesson-0-3',
        lessonCode: '0.3',
        slug: 'the-chain-rule',
        title: 'The Chain Rule',
        subtitle: 'Differentiating composite functions by multiplying local rates of change along computational graphs.',
        everydayScene: 'Converting rupees to dollars to euros, each step multiplies',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 3,
        duration: '18 min',
        prerequisites: ['derivatives-and-gradients'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'For nested functions z = f(g(x)), the overall derivative is dz/dx = (dz/dg) · (dg/dx)',
          'When multiple paths connect a variable to the output, total derivative sums over all paths',
          'Computational graphs cache forward intermediates so backward local derivatives multiply in O(1) per edge'
        ]
      },
      {
        id: 'lesson-0-4',
        lessonCode: '0.4',
        slug: 'probability-and-distributions',
        title: 'Probability and Distributions',
        subtitle: 'Expectation, variance, Bernoulli, Gaussian, and log-likelihood in machine learning.',
        everydayScene: 'Predicting the chance of rain, expectation and variance',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 4,
        duration: '18 min',
        prerequisites: ['vectors-matrices-and-dot-products'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'Expected value E[X] = Σ xᵢ P(xᵢ) represents the probability-weighted center of mass',
          'Variance Var(X) = E[(X - μ)²] quantifies spread around the mean',
          'Maximizing log-likelihood is mathematically equivalent to minimizing cross-entropy or squared error loss'
        ]
      },
      {
        id: 'lesson-0-5',
        lessonCode: '0.5',
        slug: 'matrix-operations-and-linear-transformations',
        title: 'Matrix Operations & Linear Transformations',
        subtitle: 'Matrix multiplication, transpose, inverse, determinants, and the geometric meaning of linear maps.',
        everydayScene: 'Rotating, stretching, and shearing a sheet of graph paper without bending its grid lines',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['vectors-matrices-and-dot-products'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'Matrix multiplication A·B combines linear maps; order matters because in general A·B ≠ B·A',
          'Transpose Aᵀ flips rows and columns, and (A·B)ᵀ = Bᵀ·Aᵀ',
          'The inverse A⁻¹ undoes A (A·A⁻¹ = I) and exists only when det(A) ≠ 0 (non-singular)'
        ]
      },
      {
        id: 'lesson-0-6',
        lessonCode: '0.6',
        slug: 'norms-distances-and-eigenvalues-pca',
        title: 'Norms, Distances & Eigenvalues (PCA Intuition)',
        subtitle: 'L1 vs L2 norms, Euclidean distance, eigenvectors, and how PCA finds maximum-variance directions.',
        everydayScene: 'Walking city blocks (L1) vs flying straight (L2), and finding the longest shadow of a tilted football',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 6,
        duration: '20 min',
        prerequisites: ['matrix-operations-and-linear-transformations'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'L1 norm sums absolute coordinates (encouraging sparsity); L2 norm is Euclidean straight-line length',
          'Eigenvectors satisfy Av = λv: directions that only stretch by eigenvalue λ without rotating',
          'PCA projects data onto the top eigenvectors of the covariance matrix to preserve maximum variance'
        ]
      },
      {
        id: 'lesson-0-7',
        lessonCode: '0.7',
        slug: 'partial-derivatives-jacobian-and-hessian',
        title: 'Partial Derivatives, Jacobian & Hessian',
        subtitle: 'Multivariable slicing, vector-valued Jacobians for backprop, and Hessian curvature in optimization.',
        everydayScene: 'Mapping how every lever on a soundboard shifts every speaker (Jacobian) and feeling bowl vs saddle curvature (Hessian)',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 7,
        duration: '22 min',
        prerequisites: ['derivatives-and-gradients', 'the-chain-rule'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'Partial derivatives ∂f/∂xᵢ slice a multivariable surface along one coordinate axis at a time',
          'The Jacobian J collects all ∂fᵢ/∂xⱼ for vector-valued layers; backprop multiplies by Jᵀ',
          'The Hessian H captures second-order curvature: positive eigenvalues mean a minimum, mixed signs mean a saddle point'
        ]
      },
      {
        id: 'lesson-0-8',
        lessonCode: '0.8',
        slug: 'conditional-probability-bayes-covariance-distributions',
        title: 'Conditional Probability, Bayes, Covariance & Distributions',
        subtitle: 'Updating beliefs with Bayes’ theorem, measuring variable relationships, and Bernoulli, Binomial, Gaussian & Uniform distributions.',
        everydayScene: 'Re-evaluating a medical test result after checking how rare the disease actually is',
        isFreePreview: false,
        moduleId: 'track-0',
        moduleName: 'Math Toolkit',
        moduleNumber: 0,
        lessonNumber: 8,
        duration: '22 min',
        prerequisites: ['probability-and-distributions'],
        status: 'available',
        relatedProjectSlug: 'autodiff-engine-from-scratch',
        keyTakeaways: [
          'Bayes’ theorem P(H|E) = P(E|H)P(H)/P(E) updates prior beliefs with new evidence while respecting base rates',
          'Covariance measures joint directional spread; correlation ρ normalizes it to [-1, +1]',
          'Bernoulli, Binomial, Gaussian, and Uniform form the core building blocks for classification, counts, noise, and initialization'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 9: Data Preparation and Feature Engineering (Learning Order #2)
  // =========================================================================
  {
    id: 'track-9',
    number: 9,
    learningOrder: 2,
    title: 'Data Preparation and Feature Engineering',
    description:
      'Clean messy real-world tables, impute missing values, scale features, encode categories, and build leak-free pipelines before touching any model.',
    status: 'available',
    projectSlugs: ['clean-the-messy-dataset'],
    lessons: [
      {
        id: 'lesson-9-1',
        lessonCode: '9.1',
        slug: 'first-look-at-data-eda',
        title: 'First Look at Data (Types, Summary Stats, Quick EDA)',
        subtitle: 'Distinguishing numeric, categorical, ordinal, and timestamp columns; mean vs median and skewness.',
        everydayScene: 'Inspecting a fruit basket before making juice',
        isFreePreview: false,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 1,
        duration: '15 min',
        prerequisites: [],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'Always inspect column types, cardinality, and missing counts before modeling',
          'Median and IQR are robust to skewed distributions where the mean gets pulled by extremes',
          'Visualizing distributions catches data-entry bugs (like negative ages or 9999 placeholders) early'
        ]
      },
      {
        id: 'lesson-9-2',
        lessonCode: '9.2',
        slug: 'handling-missing-data',
        title: 'Handling Missing Data',
        subtitle: 'Dropping rows, mean/median imputation, missingness indicator flags, and KNN imputation.',
        everydayScene: 'Blank answers on a form, and what to do with them',
        isFreePreview: true,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 2,
        duration: '18 min',
        prerequisites: ['first-look-at-data-eda'],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'Drop rows only when <5% are missing completely at random; drop columns over ~60% empty',
          'Impute numeric columns with the median (or mean when symmetric) and add a "was_missing" flag when missingness is informative',
          'Fit imputers strictly on the training split to prevent test-set leakage'
        ]
      },
      {
        id: 'lesson-9-3',
        lessonCode: '9.3',
        slug: 'outliers-and-feature-scaling',
        title: 'Outliers and Feature Scaling',
        subtitle: 'Z-score standardization, Min-Max scaling, Robust IQR scaling, and when tree models skip scaling.',
        everydayScene: 'One billionaire in a tea stall\'s customer list; comparing centimeters with kilometers',
        isFreePreview: false,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 3,
        duration: '18 min',
        prerequisites: ['handling-missing-data'],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'Tukey IQR fences [Q₁ - 1.5·IQR, Q₃ + 1.5·IQR] detect outliers without the masking effect that inflates Z-score standard deviations',
          'Standardization z = (x - μ)/σ centers features for linear models, SVMs, k-means, PCA, and neural networks; RobustScaler uses median and IQR to resist outliers',
          'Min-Max scaling maps training values into [0, 1] (though unseen test values outside the training range can fall outside [0, 1]), while tree models do not require scaling'
        ]
      },
      {
        id: 'lesson-9-4',
        lessonCode: '9.4',
        slug: 'encoding-categorical-features',
        title: 'Encoding Categorical Features',
        subtitle: 'One-hot, ordinal, frequency, and smoothed cross-validated target encoding without leakage.',
        everydayScene: 'Turning city names into numbers without implying Mumbai is "greater" than Delhi',
        isFreePreview: false,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 4,
        duration: '20 min',
        prerequisites: ['outliers-and-feature-scaling'],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'Use One-Hot encoding for low-cardinality unordered categories (<15 values) and Ordinal encoding only when true order exists',
          'Never feed arbitrary integer label encodings of unordered categories into linear models or neural networks',
          'High-cardinality features (pincode, city) use smoothed target encoding computed strictly inside cross-validation folds'
        ]
      },
      {
        id: 'lesson-9-5',
        lessonCode: '9.5',
        slug: 'splits-cross-validation-and-leakage',
        title: 'Train/Validation/Test Split, Cross-Validation and Data Leakage',
        subtitle: 'K-fold cross-validation, time-based splits, and catching subtle preprocessing and target leakage.',
        everydayScene: 'Seeing the exam paper beforehand',
        isFreePreview: false,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['encoding-categorical-features'],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'Fit every imputer, scaler, and encoder on the training split only, then transform validation and test splits',
          'K-Fold cross-validation reduces evaluation variance by rotating the validation fold across all samples',
          'Fitting preprocessing on the full dataset before splitting leaks test statistics and produces fake, inflated accuracy'
        ]
      },
      {
        id: 'lesson-9-6',
        lessonCode: '9.6',
        slug: 'imbalanced-data-and-metrics',
        title: 'Imbalanced Data (SMOTE, Class Weights, Right Metrics)',
        subtitle: 'Why 99.9% accuracy can be useless; Precision, Recall, F1, PR-AUC, class weighting, and SMOTE.',
        everydayScene: 'Finding one thief among 10,000 visitors',
        isFreePreview: false,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 6,
        duration: '18 min',
        prerequisites: ['splits-cross-validation-and-leakage'],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'On 99:1 imbalanced data, a dummy classifier scores 99% accuracy while catching 0% of minority cases',
          'Precision measures how many flagged alerts are real; Recall measures how many real positives were caught; F1 is their harmonic mean',
          'Apply inverse class weights in the loss function or synthesize minority training points via SMOTE (on the training fold only)'
        ]
      },
      {
        id: 'lesson-9-7',
        lessonCode: '9.7',
        slug: 'feature-engineering-and-pipelines',
        title: 'Feature Engineering, Selection and Pipelines',
        subtitle: 'Interaction ratios, cyclical date features, mutual information selection, and reproducible pipelines.',
        everydayScene: 'Cooking a recipe in a repeatable order',
        isFreePreview: false,
        moduleId: 'track-9',
        moduleName: 'Data Preparation and Feature Engineering',
        moduleNumber: 9,
        lessonNumber: 7,
        duration: '20 min',
        prerequisites: ['imbalanced-data-and-metrics'],
        status: 'available',
        relatedProjectSlug: 'clean-the-messy-dataset',
        keyTakeaways: [
          'Domain ratios (like EMI-to-income) and sin/cos cyclical time encodings expose linear relationships to simple models',
          'Feature selection via variance thresholds, L1 sparsity, and permutation importance prunes noisy columns',
          'Wrapping all steps in a single Pipeline guarantees identical, leak-free execution during cross-validation and production inference'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 1: Classical ML (Learning Order #3)
  // =========================================================================
  {
    id: 'track-1',
    number: 1,
    learningOrder: 3,
    title: 'Classical ML',
    description:
      'Master the workhorse algorithms of tabular data: Linear and Logistic Regression, Bias-Variance, Random Forests, k-Means, and PCA.',
    status: 'available',
    projectSlugs: ['house-price-predictor', 'telco-customer-churn'],
    lessons: [
      {
        id: 'lesson-1-1',
        lessonCode: '1.1',
        slug: 'linear-regression',
        title: 'Linear Regression',
        subtitle: 'Fitting lines and hyperplanes via Ordinary Least Squares and analytical normal equations.',
        everydayScene: 'Predicting an auto fare from distance',
        isFreePreview: true,
        moduleId: 'track-1',
        moduleName: 'Classical ML',
        moduleNumber: 1,
        lessonNumber: 1,
        duration: '15 min',
        prerequisites: [],
        status: 'available',
        relatedProjectSlug: 'house-price-predictor',
        keyTakeaways: [
          'Linear regression models continuous targets as ŷ = w · x + b (base meter charge + per-kilometer rate)',
          'Minimizing sum of squared residuals yields closed-form normal equations and convex gradient descent',
          'R² and RMSE quantify the proportion of variance explained and average prediction error in target units'
        ]
      },
      {
        id: 'lesson-1-2',
        lessonCode: '1.2',
        slug: 'logistic-regression',
        title: 'Logistic Regression',
        subtitle: 'Squashing linear log-odds through the Sigmoid function and optimizing Binary Cross-Entropy.',
        everydayScene: '"Will I bunk tomorrow\'s class?" as a probability',
        isFreePreview: false,
        moduleId: 'track-1',
        moduleName: 'Classical ML',
        moduleNumber: 1,
        lessonNumber: 2,
        duration: '18 min',
        prerequisites: ['linear-regression'],
        status: 'available',
        relatedProjectSlug: 'telco-customer-churn',
        keyTakeaways: [
          'Logistic regression models log-odds linearly and maps them to probabilities via p = σ(w · x + b)',
          'Binary Cross-Entropy heavily penalizes confident wrong predictions and keeps the loss surface strictly convex',
          'Shifting the decision threshold τ trades off Precision against Recall along the ROC curve'
        ]
      },
      {
        id: 'lesson-1-3',
        lessonCode: '1.3',
        slug: 'bias-variance-and-evaluation-metrics',
        title: 'Bias-Variance and Evaluation Metrics',
        subtitle: 'Decomposing generalization error into Bias², Variance, and irreducible noise.',
        everydayScene: 'Memorizing past papers vs understanding concepts',
        isFreePreview: false,
        moduleId: 'track-1',
        moduleName: 'Classical ML',
        moduleNumber: 1,
        lessonNumber: 3,
        duration: '18 min',
        prerequisites: ['logistic-regression'],
        status: 'available',
        relatedProjectSlug: 'telco-customer-churn',
        keyTakeaways: [
          'Expected test error decomposes into Bias² (underfitting) + Variance (overfitting) + σ² (irreducible noise)',
          'Confusion matrices break classification outcomes into TP, FP, TN, and FN',
          'ROC-AUC measures ranking quality across all thresholds'
        ]
      },
      {
        id: 'lesson-1-4',
        lessonCode: '1.4',
        slug: 'decision-trees-and-random-forests',
        title: 'Decision Trees and Random Forests',
        subtitle: 'Gini impurity, entropy information gain, axis-aligned splits, and bagging ensembles.',
        everydayScene: '20 questions, then asking 100 friends and taking the majority',
        isFreePreview: false,
        moduleId: 'track-1',
        moduleName: 'Classical ML',
        moduleNumber: 1,
        lessonNumber: 4,
        duration: '20 min',
        prerequisites: ['bias-variance-and-evaluation-metrics'],
        status: 'available',
        relatedProjectSlug: 'telco-customer-churn',
        keyTakeaways: [
          'Decision trees greedily pick feature thresholds that maximize Information Gain (or Gini reduction)',
          'Deep unpruned trees have low bias but high variance',
          'Random Forests average B trees trained on bootstrapped samples and random feature subsets, slashing variance by 1/B'
        ]
      },
      {
        id: 'lesson-1-5',
        lessonCode: '1.5',
        slug: 'kmeans-and-pca',
        title: 'k-Means and PCA',
        subtitle: 'Unsupervised centroid clustering and variance-maximizing orthogonal projections.',
        everydayScene: 'Seating wedding guests at tables; summarizing a story in 3 lines',
        isFreePreview: false,
        moduleId: 'track-1',
        moduleName: 'Classical ML',
        moduleNumber: 1,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['linear-regression'],
        status: 'available',
        relatedProjectSlug: 'house-price-predictor',
        keyTakeaways: [
          'k-Means alternates between assigning points to nearest centroids and recomputing centroid means to minimize inertia',
          'Principal Component Analysis (PCA) projects data onto the top eigenvectors of the covariance matrix',
          'The explained variance ratio λᵢ / Σλⱼ tells you how much signal survives dimensionality compression'
        ]
      },
      {
        id: 'lesson-1-6',
        lessonCode: '1.6',
        slug: 'knn-svm-and-naive-bayes',
        title: 'k-NN, Support Vector Machines (SVM) & Naive Bayes',
        subtitle: 'Distance-based voting, maximum-margin hyperplanes with the kernel trick, and probabilistic Bayes classification.',
        everydayScene: 'Asking your 5 closest neighbors (k-NN), widening the road median between lanes (SVM), and scoring spam clues independently (Naive Bayes)',
        isFreePreview: false,
        moduleId: 'track-1',
        moduleName: 'Classical Machine Learning Foundations',
        moduleNumber: 1,
        lessonNumber: 6,
        duration: '20 min',
        prerequisites: ['logistic-regression', 'norms-distances-and-eigenvalues-pca'],
        status: 'available',
        relatedProjectSlug: 'titanic-or-churn-classifier',
        keyTakeaways: [
          'k-NN is non-parametric and sensitive to feature scaling and the curse of dimensionality',
          'SVMs maximize the geometric margin 2/||w||₂ using support vectors and can separate non-linear data via kernels K(x, x′)',
          'Naive Bayes applies Bayes’ theorem assuming conditional independence of features given the class label'
        ]
      },
      {
        id: 'lesson-1-7',
        lessonCode: '1.7',
        slug: 'gradient-boosting-and-xgboost',
        title: 'Gradient Boosting & XGBoost',
        subtitle: 'Sequential residual fitting, learning-rate shrinkage, and second-order Newton tree leaf weights.',
        everydayScene: 'A relay team of coaches where each new coach focuses strictly on fixing the previous coach’s mistakes',
        isFreePreview: false,
        moduleId: 'track-1',
        moduleName: 'Classical Machine Learning Foundations',
        moduleNumber: 1,
        lessonNumber: 7,
        duration: '20 min',
        prerequisites: ['decision-trees-and-random-forests'],
        status: 'available',
        relatedProjectSlug: 'titanic-or-churn-classifier',
        keyTakeaways: [
          'Bagging (Random Forests) trains deep trees in parallel to cut variance; Boosting trains shallow trees sequentially to cut bias',
          'Gradient Boosting fits each new tree to the negative gradient (pseudo-residuals) of the loss function',
          'XGBoost uses both first-order gradients gᵢ and second-order Hessians hᵢ with L2 leaf regularization λ'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 2: Neural Network Foundations (Learning Order #4)
  // =========================================================================
  {
    id: 'track-2',
    number: 2,
    learningOrder: 4,
    title: 'Neural Network Foundations',
    description:
      'See how artificial neurons, non-linear activations, forward passes, loss landscapes, gradient descent, and backpropagation work from first principles.',
    status: 'available',
    projectSlugs: ['mnist-in-pure-numpy'],
    lessons: [
      {
        id: 'lesson-2-1',
        lessonCode: '2.1',
        slug: 'what-is-an-artificial-neuron',
        title: 'The Artificial Neuron',
        subtitle: 'The elementary building block of deep learning: inputs, weights, bias, summation, and activations.',
        everydayScene: 'A friend deciding whether to join a plan: weather, distance, who is going',
        isFreePreview: true,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 1,
        duration: '10 min',
        prerequisites: [],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'A neuron computes a weighted sum of inputs plus a bias: z = Σ(wᵢxᵢ) + b',
          'Weights scale the sensitivity of the neuron to specific features',
          'Bias shifts the activation threshold independently of inputs',
          'The activation function introduces non-linearity: a = φ(z)'
        ]
      },
      {
        id: 'lesson-2-2',
        lessonCode: '2.2',
        slug: 'activation-functions',
        title: 'Activation Functions',
        subtitle: 'Introducing non-linearity: comparing Sigmoid, Tanh, ReLU, and Leaky ReLU with derivative curves.',
        everydayScene: '"Convinced enough to say yes?" threshold vs soft maybe',
        isFreePreview: false,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 2,
        duration: '15 min',
        prerequisites: ['what-is-an-artificial-neuron'],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'Without non-linear activations, multi-layer networks collapse into simple linear models',
          'Sigmoid and Tanh saturate at extreme inputs, leading to vanishing gradients',
          'ReLU avoids saturation for positive inputs and calculates in O(1) time',
          'Derivative magnitude directly governs the speed of learning during backpropagation'
        ]
      },
      {
        id: 'lesson-2-3',
        lessonCode: '2.3',
        slug: 'forward-propagation',
        title: 'Forward Propagation',
        subtitle: 'Tracing signals from input features through hidden representations to output predictions.',
        everydayScene: 'A message passing through a company hierarchy',
        isFreePreview: false,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 3,
        duration: '18 min',
        prerequisites: ['what-is-an-artificial-neuron', 'activation-functions'],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'Layers compute representations hierarchically: z^[l] = W^[l] · a^[l-1] + b^[l]',
          'Each layer acts as a learned coordinate transformation',
          'Intermediate pre-activations (z) and post-activations (a) are cached for backward propagation',
          'The final layer activation determines the prediction format (continuous value, probability, logits)'
        ]
      },
      {
        id: 'lesson-2-4',
        lessonCode: '2.4',
        slug: 'loss-functions',
        title: 'Loss Functions and Error Landscapes',
        subtitle: 'Quantifying prediction discrepancies using Mean Squared Error and Cross-Entropy formulations.',
        everydayScene: 'Marks lost in an exam, and what each wrong answer costs',
        isFreePreview: false,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 4,
        duration: '12 min',
        prerequisites: ['forward-propagation'],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'A loss function L(y, ŷ) evaluates error on an individual sample',
          'The cost function J(W, b) averages loss across the entire training dataset',
          'Squaring penalizes large deviations disproportionately compared to small errors',
          'The derivative ∂L/∂ŷ provides the initial gradient signal for backpropagation'
        ]
      },
      {
        id: 'lesson-2-5',
        lessonCode: '2.5',
        slug: 'gradient-descent',
        title: 'Gradient Descent',
        subtitle: 'Iterative parameter optimization using analytical derivatives, step sizes, and stability bounds.',
        everydayScene: 'Walking downhill in thick fog',
        isFreePreview: false,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['loss-functions'],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'The negative gradient points in the direction of steepest local descent',
          'Parameter update rule: θ_next = θ_current - η · (dL/dθ)',
          'Too small learning rate η leads to crawling progress; too large causes oscillations or divergence',
          'Convex landscapes guarantee global minima; non-convex landscapes feature saddle points and local minima'
        ]
      },
      {
        id: 'lesson-2-6',
        lessonCode: '2.6',
        slug: 'backpropagation-fundamentals',
        title: 'Backpropagation and the Chain Rule',
        subtitle: 'Propagating errors backward through layered derivatives to compute exact parameter gradients.',
        everydayScene: 'After a failed group project, working out who contributed how much to the failure',
        isFreePreview: false,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 6,
        duration: '25 min',
        prerequisites: ['gradient-descent'],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'Backpropagation evaluates ∂L/∂w by decomposing it into local derivatives via the chain rule',
          'Errors propagate from the loss node backward toward the inputs: ∂L/∂z = ∂L/∂a · φ\'(z)',
          'Gradients for weights equal the upstream error multiplied by the corresponding incoming activation: ∂L/∂w = δ · a_in',
          'Numerical gradient checking with finite differences provides mathematical verification of analytical gradients'
        ]
      },
      {
        id: 'lesson-2-7',
        lessonCode: '2.7',
        slug: 'universal-approximation-and-depth',
        title: 'Universal Approximation and Network Depth',
        subtitle: 'How piecewise linear ReLU hinges fold space to approximate any continuous function.',
        everydayScene: 'Many small ruler pieces approximating a curvy road',
        isFreePreview: false,
        moduleId: 'track-2',
        moduleName: 'Neural Network Foundations',
        moduleNumber: 2,
        lessonNumber: 7,
        duration: '18 min',
        prerequisites: ['backpropagation-fundamentals'],
        status: 'available',
        relatedProjectSlug: 'mnist-in-pure-numpy',
        keyTakeaways: [
          'A single hidden layer of N ReLU units creates up to N piecewise linear hinges that approximate any continuous 1D curve',
          'Depth composes hinges exponentially, creating far more linear regions than a single wide layer with the same parameter budget'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 3: Training Neural Networks Well (Learning Order #5)
  // =========================================================================
  {
    id: 'track-3',
    number: 3,
    learningOrder: 5,
    title: 'Training Neural Networks Well',
    description:
      'Diagnose and stabilize deep network training with weight initialization, normalization, L2 & Dropout, adaptive optimizers, schedules, and loss curve debugging.',
    status: 'available',
    projectSlugs: ['training-debugging-lab', 'optimizer-benchmark'],
    lessons: [
      {
        id: 'lesson-3-1',
        lessonCode: '3.1',
        slug: 'weight-initialization',
        title: 'Weight Initialization',
        subtitle: 'Symmetry breaking, variance preservation across layers, Xavier/Glorot, and He initialization.',
        everydayScene: 'Where runners start in a race',
        isFreePreview: true,
        moduleId: 'track-3',
        moduleName: 'Training Neural Networks Well',
        moduleNumber: 3,
        lessonNumber: 1,
        duration: '18 min',
        prerequisites: ['backpropagation-fundamentals'],
        status: 'available',
        relatedProjectSlug: 'training-debugging-lab',
        keyTakeaways: [
          'Zero initialization fails because identical neurons compute identical gradients and never break symmetry',
          'Xavier initialization Var(W) = 1/n_in preserves activation variance for Tanh/Sigmoid networks',
          'He initialization Var(W) = 2/n_in compensates for ReLU zeroing out half of the distribution'
        ]
      },
      {
        id: 'lesson-3-2',
        lessonCode: '3.2',
        slug: 'batch-and-layer-normalization',
        title: 'Batch and Layer Normalization',
        subtitle: 'Standardizing activations across batch vs feature dimensions with learnable scale γ and shift β.',
        everydayScene: 'Grading on a curve when exams differ in difficulty',
        isFreePreview: false,
        moduleId: 'track-3',
        moduleName: 'Training Neural Networks Well',
        moduleNumber: 3,
        lessonNumber: 2,
        duration: '20 min',
        prerequisites: ['weight-initialization'],
        status: 'available',
        relatedProjectSlug: 'training-debugging-lab',
        keyTakeaways: [
          'BatchNorm normalizes each channel across the mini-batch and maintains running statistics for inference',
          'LayerNorm normalizes across the feature dimension within each single sample, making it independent of batch size',
          'Learnable parameters γ and β allow normalized layers to restore any mean and variance if needed'
        ]
      },
      {
        id: 'lesson-3-3',
        lessonCode: '3.3',
        slug: 'regularization-dropout',
        title: 'Overfitting, L2 and Dropout',
        subtitle: 'Techniques to improve out-of-sample generalization and network robustness.',
        everydayScene: 'Random classmates absent each day so nobody relies on one topper',
        isFreePreview: false,
        moduleId: 'track-3',
        moduleName: 'Training Neural Networks Well',
        moduleNumber: 3,
        lessonNumber: 3,
        duration: '20 min',
        prerequisites: ['backpropagation-fundamentals'],
        status: 'available',
        relatedProjectSlug: 'training-debugging-lab',
        keyTakeaways: [
          'Overfitting occurs when a high-capacity model fits sample-specific noise rather than true underlying relationships',
          'L2 regularization (weight decay) penalizes large squared weights: L_reg = L + (λ/2)Σw², shrinking parameter magnitudes',
          'Dropout randomly zeroes activations with probability p during training, preventing neurons from co-adapting',
          'Inverted dropout scales surviving activations by 1/(1-p) during training so no scaling is required at test time'
        ]
      },
      {
        id: 'lesson-3-4',
        lessonCode: '3.4',
        slug: 'adaptive-optimizers',
        title: 'Momentum, RMSprop and Adam',
        subtitle: 'Adaptive learning rate algorithms and second-moment estimation.',
        everydayScene: 'A rolling ball, then a ball with smart shoes',
        isFreePreview: false,
        moduleId: 'track-3',
        moduleName: 'Training Neural Networks Well',
        moduleNumber: 3,
        lessonNumber: 4,
        duration: '25 min',
        prerequisites: ['gradient-descent'],
        status: 'available',
        relatedProjectSlug: 'optimizer-benchmark',
        keyTakeaways: [
          'Standard SGD struggles in ravines where surface curvature is ill-conditioned (much steeper along one dimension)',
          'Momentum adds an exponentially decaying moving average of past gradients to maintain directional velocity',
          'RMSprop scales individual parameter updates inversely by the root mean square of recent gradients',
          'Adam combines first moments (momentum) and second moments (RMSprop) with bias corrections for robust training across deep architectures'
        ]
      },
      {
        id: 'lesson-3-5',
        lessonCode: '3.5',
        slug: 'learning-rate-schedules-and-warmup',
        title: 'Learning Rate Schedules and Warmup',
        subtitle: 'Linear warmup, step decay, exponential decay, and cosine annealing schedules.',
        everydayScene: 'Parking a car: big steps first, tiny steps at the end',
        isFreePreview: false,
        moduleId: 'track-3',
        moduleName: 'Training Neural Networks Well',
        moduleNumber: 3,
        lessonNumber: 5,
        duration: '18 min',
        prerequisites: ['adaptive-optimizers'],
        status: 'available',
        relatedProjectSlug: 'optimizer-benchmark',
        keyTakeaways: [
          'Linear warmup ramps η from 0 to η_max over early steps so Adam moment estimates stabilize before large updates occur',
          'Cosine annealing smoothly decays η along a half-cosine curve to settle into wide, flat minima'
        ]
      },
      {
        id: 'lesson-3-6',
        lessonCode: '3.6',
        slug: 'reading-loss-curves-and-debugging',
        title: 'Reading Loss Curves and Debugging Training',
        subtitle: 'Diagnosing diverging loss, dead ReLUs, overfitting forks, and gradient clipping.',
        everydayScene: 'A doctor reading a fever chart',
        isFreePreview: false,
        moduleId: 'track-3',
        moduleName: 'Training Neural Networks Well',
        moduleNumber: 3,
        lessonNumber: 6,
        duration: '20 min',
        prerequisites: ['regularization-dropout', 'adaptive-optimizers'],
        status: 'available',
        relatedProjectSlug: 'training-debugging-lab',
        keyTakeaways: [
          'If a model cannot overfit a tiny 10-sample batch to near-zero loss, there is a bug in the architecture, gradients, or learning rate',
          'Training loss dropping while validation loss rises diagnoses overfitting; both plateauing high diagnoses underfitting'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 4: Computer Vision (Learning Order #6)
  // =========================================================================
  {
    id: 'track-4',
    number: 4,
    learningOrder: 6,
    title: 'Computer Vision',
    description:
      'Understand spatial filtering, receptive fields, CNN inference, backpropagation through kernels, ResNet, EfficientNet, Transfer Learning, YOLO, and U-Net.',
    status: 'available',
    projectSlugs: ['plant-disease-resnet-gradcam', 'chest-xray-classifier', 'college-gate-bike-counter-yolo'],
    lessons: [
      {
        id: 'lesson-4-1',
        lessonCode: '4.1',
        slug: 'convolutional-filters',
        title: 'Kernels, Strides and Feature Maps',
        subtitle: 'Translational invariance and spatial filtering in visual recognition.',
        everydayScene: 'An Instagram filter sliding across a photo',
        isFreePreview: true,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 1,
        duration: '20 min',
        prerequisites: ['forward-propagation'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'A 2D convolution slides a small matrix of weights (kernel) across an input to detect local spatial patterns',
          'Weight sharing dramatically reduces parameter count compared to fully-connected layers',
          'Output dimensions depend on input size, kernel size, padding P, and stride S: W_out = ⌊(W_in - K + 2P)/S⌋ + 1',
          'Feature maps represent the spatial excitation intensity of learned visual detectors (edges, textures, motifs)'
        ]
      },
      {
        id: 'lesson-4-2',
        lessonCode: '4.2',
        slug: 'pooling-and-receptive-fields',
        title: 'Pooling and Receptive Fields',
        subtitle: 'Dimensionality reduction, max pooling, and spatial hierarchy construction.',
        everydayScene: 'Thumbnail view; how much of a room a window shows',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 2,
        duration: '15 min',
        prerequisites: ['convolutional-filters'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'Max pooling extracts the most salient local feature while reducing spatial dimensions and computational load',
          'Pooling provides local translational invariance, making feature detection robust to minor spatial shifts',
          'Receptive field (RF) measures the pixel region in the raw input image that directly influences a given deep neuron',
          'Successive convolutions and strided poolings expand receptive fields hierarchically, enabling deep neurons to perceive global context'
        ]
      },
      {
        id: 'lesson-4-3',
        lessonCode: '4.3',
        slug: 'cnn-inference-pipeline',
        title: 'Full CNN Inference: Pixels to Predictions',
        subtitle: 'How multi-channel filters, pooling, flattening, and dense softmax layers produce real-time predictions.',
        everydayScene: 'A bank machine reading a cheque',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 3,
        duration: '25 min',
        prerequisites: ['pooling-and-receptive-fields'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'CNN inference is a deterministic forward cascade: Conv2D → ReLU → Pooling → Flattening → Dense → Softmax',
          'Multiple kernels produce a multi-channel 3D feature volume where each channel specializes in detecting distinct spatial motifs',
          'Flattening vectorizes spatial feature maps into a 1D column vector suitable for dense matrix multiplication',
          'The Softmax activation normalizes final unconstrained logits into an interpretable categorical probability distribution'
        ]
      },
      {
        id: 'lesson-4-4',
        lessonCode: '4.4',
        slug: 'cnn-backpropagation',
        title: 'Backpropagation in CNNs',
        subtitle: 'Computing filter gradients via cross-correlation and input gradients with rotated transposed convolutions.',
        everydayScene: 'Tracing which filter caused a mistake',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 4,
        duration: '25 min',
        prerequisites: ['cnn-inference-pipeline'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'The gradient w.r.t filter weights is the cross-correlation between input activations and output error: ∂L/∂K = X ⋆ δ_out',
          'The gradient w.r.t input activations requires full convolution with the 180°-rotated kernel: ∂L/∂X = δ_out ⋆ rot180(K)',
          'Max-pooling backward pass performs mask routing: only the winning argmax neuron receives the upstream error, others receive 0',
          'Convolutional weight updates follow the standard gradient descent rule: K_new = K - η · (∂L/∂K)'
        ]
      },
      {
        id: 'lesson-4-5',
        lessonCode: '4.5',
        slug: 'from-lenet-to-vgg',
        title: 'From LeNet to VGG',
        subtitle: 'Why two stacked 3×3 kernels beat one 5×5 kernel in receptive field, non-linearity, and parameter count.',
        everydayScene: 'Phones getting better each year',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 5,
        duration: '18 min',
        prerequisites: ['cnn-backpropagation'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'Two stacked 3×3 convolutions cover the exact same 5×5 receptive field using 18C² instead of 25C² weights (28% fewer parameters)',
          'Three stacked 3×3 convolutions cover a 7×7 receptive field with 27C² vs 49C² weights (45% savings) and 3 ReLU non-linearities'
        ]
      },
      {
        id: 'lesson-4-6',
        lessonCode: '4.6',
        slug: 'resnet-architectures',
        title: 'ResNet and Skip Connections',
        subtitle: 'Breaking the depth barrier: identity mappings, gradient highways, and bottleneck blocks.',
        everydayScene: 'A lift that skips floors when only a small change is needed',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 6,
        duration: '22 min',
        prerequisites: ['cnn-backpropagation'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'The degradation problem causes plain deep networks (e.g. 56 layers) to perform worse than shallow networks due to vanishing gradients',
          'ResNet reformulates layers to learn residual mappings: H(x) = F(x) + x',
          'The gradient highway formulation ∂L/∂x = ∂L/∂H · (∂F/∂x + I) guarantees that gradients flow back unattenuated through the additive identity term I',
          'Bottleneck residual blocks (1×1 → 3×3 → 1×1) reduce parameter count and FLOPs by >80% while enabling networks beyond 100 layers'
        ]
      },
      {
        id: 'lesson-4-7',
        lessonCode: '4.7',
        slug: 'efficientnet-compound-scaling',
        title: 'EfficientNet and Compound Scaling',
        subtitle: 'Systematically balancing depth, width, and resolution with MBConv and Squeeze-and-Excitation.',
        everydayScene: 'Balancing a cricket team: batters, bowlers, fielders',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 7,
        duration: '25 min',
        prerequisites: ['resnet-architectures'],
        status: 'available',
        relatedProjectSlug: 'plant-disease-resnet-gradcam',
        keyTakeaways: [
          'Arbitrarily scaling depth, width, or resolution in isolation quickly hits diminishing accuracy returns',
          'Compound scaling uses a single coefficient φ to balance depth (α^φ), width (β^φ), and resolution (γ^φ) subject to α·β²·γ² ≈ 2',
          'Depthwise Separable Convolutions separate spatial filtering from channel mixing, reducing computational cost by ~8x to 9x',
          'MBConv inverted bottleneck blocks incorporate Squeeze-and-Excitation (SE) channel attention to dynamically recalibrate feature importances'
        ]
      },
      {
        id: 'lesson-4-8',
        lessonCode: '4.8',
        slug: 'transfer-learning',
        title: 'Transfer Learning',
        subtitle: 'Freezing pretrained backbones, replacing classification heads, and gradual unfreezing with differential learning rates.',
        everydayScene: 'Hiring an experienced engineer and training them for your company',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 8,
        duration: '18 min',
        prerequisites: ['resnet-architectures'],
        status: 'available',
        relatedProjectSlug: 'chest-xray-classifier',
        keyTakeaways: [
          'Early CNN layers learn universal Gabor edges and color blobs transferable across visual domains',
          'Feature extraction freezes the backbone and trains only the new linear classification head on small datasets',
          'Fine-tuning unfreezes top blocks with a 10× smaller learning rate to adapt high-level features without catastrophic forgetting'
        ]
      },
      {
        id: 'lesson-4-9',
        lessonCode: '4.9',
        slug: 'object-detection-yolo',
        title: 'Object Detection (YOLO)',
        subtitle: 'Single-stage grid detection, bounding box coordinates, Intersection over Union (IoU), and Non-Maximum Suppression (NMS).',
        everydayScene: 'A CCTV guard who spots and labels everything in one glance',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 9,
        duration: '22 min',
        prerequisites: ['cnn-inference-pipeline'],
        status: 'available',
        relatedProjectSlug: 'college-gate-bike-counter-yolo',
        keyTakeaways: [
          'YOLO divides the image into an S×S grid where each cell predicts bounding boxes (x, y, w, h, confidence) and class probabilities in one pass',
          'Intersection over Union (IoU) measures overlap area divided by union area between predicted and ground-truth boxes',
          'Non-Maximum Suppression (NMS) iteratively keeps the highest-scoring box and suppresses overlapping duplicates with IoU > threshold'
        ]
      },
      {
        id: 'lesson-4-10',
        lessonCode: '4.10',
        slug: 'image-segmentation-unet',
        title: 'Image Segmentation (U-Net)',
        subtitle: 'Encoder-decoder segmentation, transposed convolutions, skip concatenations, and Dice loss.',
        everydayScene: 'A coloring book where every pixel gets a color',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 10,
        duration: '22 min',
        prerequisites: ['resnet-architectures'],
        status: 'available',
        relatedProjectSlug: 'chest-xray-classifier',
        keyTakeaways: [
          'Semantic segmentation classifies every individual pixel, requiring both global semantic context and fine spatial boundaries',
          'U-Net pairs a contracting encoder with an expanding decoder linked by channel-wise skip concatenations',
          'Dice coefficient 2|P ∩ G| / (|P| + |G|) directly optimizes pixel overlap even when foreground objects are tiny'
        ]
      },
      {
        id: 'lesson-4-11',
        lessonCode: '4.11',
        slug: 'cv-augmentation-explainability-and-domain-shift',
        title: 'Image Preprocessing, Augmentation, Grad-CAM & Domain Shift',
        subtitle: 'Channel normalization, CutMix/MixUp augmentation, Grad-CAM visual saliency, and handling out-of-distribution domain shift.',
        everydayScene: 'Training a radiologist on rotated/brightened scans, highlighting which lung region drove the diagnosis, and testing on a new hospital’s X-ray machine',
        isFreePreview: false,
        moduleId: 'track-4',
        moduleName: 'Computer Vision',
        moduleNumber: 4,
        lessonNumber: 11,
        duration: '20 min',
        prerequisites: ['transfer-learning', 'image-segmentation-unet'],
        status: 'available',
        relatedProjectSlug: 'chest-xray-classifier',
        keyTakeaways: [
          'ImageNet channel normalization and label-preserving augmentations (flips, RandAugment, MixUp/CutMix) dramatically boost generalization',
          'Grad-CAM weights the final conv feature maps by global-average-pooled class gradients to localize what the CNN actually looked at',
          'Domain shift occurs when P_test(X) ≠ P_train(X) (different camera, lighting, or scanner), often causing silent overconfident failures'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 5: Sequence Models (Learning Order #7)
  // =========================================================================
  {
    id: 'track-5',
    number: 5,
    learningOrder: 7,
    title: 'Sequence Models',
    description:
      'Represent words as dense vectors and process sequential text and time-series with RNNs, BPTT, LSTMs, GRUs, and Seq2Seq.',
    status: 'available',
    projectSlugs: ['lstm-food-review-sentiment', 'character-level-author-generator'],
    lessons: [
      {
        id: 'lesson-5-1',
        lessonCode: '5.1',
        slug: 'embeddings-and-word-vectors',
        title: 'Embeddings and Word Vectors',
        subtitle: 'Mapping discrete token IDs into continuous geometric spaces where semantic similarity equals cosine alignment.',
        everydayScene: 'Google Maps coordinates for words: chai sits near coffee',
        isFreePreview: true,
        moduleId: 'track-5',
        moduleName: 'Sequence Models',
        moduleNumber: 5,
        lessonNumber: 1,
        duration: '18 min',
        prerequisites: ['forward-propagation'],
        status: 'available',
        relatedProjectSlug: 'lstm-food-review-sentiment',
        keyTakeaways: [
          'One-hot vectors are orthogonal and high-dimensional; an embedding matrix E ∈ R^{|V|×d} maps each token ID to a dense vector',
          'Distributional hypothesis: words appearing in similar contexts converge to nearby coordinates (e.g. chai and coffee)',
          'Vector arithmetic captures relational analogies via linear offsets in embedding space'
        ]
      },
      {
        id: 'lesson-5-2',
        lessonCode: '5.2',
        slug: 'recurrent-neural-networks',
        title: 'Recurrent Neural Networks',
        subtitle: 'Processing variable-length sequences step-by-step with shared recurrent state matrices.',
        everydayScene: 'Reading a sentence word by word while keeping notes',
        isFreePreview: false,
        moduleId: 'track-5',
        moduleName: 'Sequence Models',
        moduleNumber: 5,
        lessonNumber: 2,
        duration: '20 min',
        prerequisites: ['embeddings-and-word-vectors'],
        status: 'available',
        relatedProjectSlug: 'lstm-food-review-sentiment',
        keyTakeaways: [
          'An RNN updates its hidden state at each time step t via h_t = tanh(W_hh · h_{t-1} + W_xh · x_t + b_h)',
          'The exact same weights (W_xh, W_hh, W_hy) are reused at every time step, enabling generalization across sequence lengths'
        ]
      },
      {
        id: 'lesson-5-3',
        lessonCode: '5.3',
        slug: 'bptt-and-vanishing-gradients',
        title: 'BPTT and Vanishing Gradients',
        subtitle: 'Unrolling recurrence across time steps and why repeated matrix multiplication causes gradients to vanish or explode.',
        everydayScene: 'Chinese whispers: the message fades down the line',
        isFreePreview: false,
        moduleId: 'track-5',
        moduleName: 'Sequence Models',
        moduleNumber: 5,
        lessonNumber: 3,
        duration: '22 min',
        prerequisites: ['recurrent-neural-networks', 'backpropagation-fundamentals'],
        status: 'available',
        relatedProjectSlug: 'lstm-food-review-sentiment',
        keyTakeaways: [
          'Backpropagation Through Time (BPTT) unrolls the RNN and sums parameter gradients across all time steps',
          'Each recurrent Jacobian step is ∂h_k/∂h_{k-1} = diag(1 - h_k²) · W_hh, so transporting gradients across (T-1) steps multiplies these matrices repeatedly',
          'When the spectral radius is <1, long-range gradients vanish exponentially; when >1, they explode (cured via gradient norm clipping)'
        ]
      },
      {
        id: 'lesson-5-4',
        lessonCode: '5.4',
        slug: 'lstm-networks',
        title: 'LSTM (Long Short-Term Memory)',
        subtitle: 'Forget, Input, and Output gates protecting an additive cell-state conveyor belt across long sequences.',
        everydayScene: 'A notebook with write, forget and read buttons',
        isFreePreview: false,
        moduleId: 'track-5',
        moduleName: 'Sequence Models',
        moduleNumber: 5,
        lessonNumber: 4,
        duration: '25 min',
        prerequisites: ['bptt-and-vanishing-gradients'],
        status: 'available',
        relatedProjectSlug: 'lstm-food-review-sentiment',
        keyTakeaways: [
          'The LSTM cell state c_t = f_t ⊙ c_{t-1} + i_t ⊙ g_t updates additively rather than multiplicatively',
          'When the forget gate f_t ≈ 1, gradients flow backward across dozens of time steps without exponential decay'
        ]
      },
      {
        id: 'lesson-5-5',
        lessonCode: '5.5',
        slug: 'gru-and-seq2seq',
        title: 'GRU and Seq2Seq',
        subtitle: 'Streamlined Gated Recurrent Units and Encoder-Decoder architectures with teacher forcing.',
        everydayScene: 'A translator who listens first, then speaks',
        isFreePreview: false,
        moduleId: 'track-5',
        moduleName: 'Sequence Models',
        moduleNumber: 5,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['lstm-networks'],
        status: 'available',
        relatedProjectSlug: 'character-level-author-generator',
        keyTakeaways: [
          'GRU merges cell and hidden states using just two gates (Update z_t and Reset r_t), matching LSTM accuracy with 25% fewer parameters',
          'Seq2Seq encodes a source sequence into a context vector and decodes target tokens autoregressively, exposing the fixed-vector bottleneck that motivated Attention'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 6: Attention and Transformers (Learning Order #8)
  // =========================================================================
  {
    id: 'track-6',
    number: 6,
    learningOrder: 8,
    title: 'Attention and Transformers',
    description:
      'Master the architectural revolution behind modern AI: Scaled Dot-Product Attention, Multi-Head Attention, Positional Encoding, BERT vs GPT, and Vision Transformers.',
    status: 'available',
    projectSlugs: ['tiny-chatgpt-from-scratch', 'vision-transformer-vs-cnn'],
    lessons: [
      {
        id: 'lesson-6-1',
        lessonCode: '6.1',
        slug: 'self-attention-scaled-dot-product',
        title: 'Self-Attention and Scaled Dot-Product',
        subtitle: 'Queries, Keys, and Values: how pairwise dot products dynamically route information across sequence positions.',
        everydayScene: 'In a noisy group chat, deciding whose message matters for your reply',
        isFreePreview: true,
        moduleId: 'track-6',
        moduleName: 'Attention and Transformers',
        moduleNumber: 6,
        lessonNumber: 1,
        duration: '22 min',
        prerequisites: ['forward-propagation'],
        status: 'available',
        relatedProjectSlug: 'tiny-chatgpt-from-scratch',
        keyTakeaways: [
          'Self-attention enables each token in a sequence to attend directly to every other token with O(1) sequential path length',
          'Projections Q = X·W_Q, K = X·W_K, V = X·W_V map input tokens into specialized matching and representation spaces',
          'Scaling dot products by 1/√d_k prevents numerical saturation of the Softmax function and avoids vanishing gradients',
          'The output is a convex combination of value vectors weighted by pairwise Softmax affinities: Attention(Q, K, V) = Softmax(QKᵀ / √d_k) · V'
        ]
      },
      {
        id: 'lesson-6-2',
        lessonCode: '6.2',
        slug: 'transformer-block-multihead-attention',
        title: 'Multi-Head Attention and the Transformer Block',
        subtitle: 'Subspace projections, residual highways, Layer Normalization, and Feed-Forward Networks.',
        everydayScene: 'Five friends watching the same movie, each noticing different things',
        isFreePreview: false,
        moduleId: 'track-6',
        moduleName: 'Attention and Transformers',
        moduleNumber: 6,
        lessonNumber: 2,
        duration: '25 min',
        prerequisites: ['self-attention-scaled-dot-product', 'resnet-architectures'],
        status: 'available',
        relatedProjectSlug: 'tiny-chatgpt-from-scratch',
        keyTakeaways: [
          'Multi-Head Attention splits d_model into h heads (d_k = d_model / h), enabling joint attention across distinct linguistic subspaces',
          'Outputs of all heads are concatenated and linearly projected back: MHA(Q,K,V) = Concat(head_1, ..., head_h) · W^O',
          'The Transformer block alternates Multi-Head Attention and a 2-layer point-wise FFN with Layer Normalization and residual connections',
          'Pre-LN applies LayerNorm prior to MHA/FFN, allowing gradients to flow unattenuated through the residual highway for 100+ layer stability'
        ]
      },
      {
        id: 'lesson-6-3',
        lessonCode: '6.3',
        slug: 'positional-encoding',
        title: 'Positional Encoding',
        subtitle: 'Why self-attention is permutation-equivariant and how sinusoidal and rotary (RoPE) encodings inject token order.',
        everydayScene: 'Seat numbers: same people, different order, different meaning',
        isFreePreview: false,
        moduleId: 'track-6',
        moduleName: 'Attention and Transformers',
        moduleNumber: 6,
        lessonNumber: 3,
        duration: '18 min',
        prerequisites: ['self-attention-scaled-dot-product'],
        status: 'available',
        relatedProjectSlug: 'tiny-chatgpt-from-scratch',
        keyTakeaways: [
          'Without positional information, self-attention treats a sentence as an unordered bag of words',
          'Sinusoidal encodings use geometric wavelengths so relative offsets PE(pos+k) can be represented as linear rotations of PE(pos)'
        ]
      },
      {
        id: 'lesson-6-4',
        lessonCode: '6.4',
        slug: 'bert-vs-gpt',
        title: 'BERT vs GPT',
        subtitle: 'Bidirectional masked language modeling (encoders) vs causal look-ahead masked autoregression (decoders).',
        everydayScene: 'Fill-in-the-blank vs keyboard autocomplete',
        isFreePreview: false,
        moduleId: 'track-6',
        moduleName: 'Attention and Transformers',
        moduleNumber: 6,
        lessonNumber: 4,
        duration: '20 min',
        prerequisites: ['transformer-block-multihead-attention'],
        status: 'available',
        relatedProjectSlug: 'tiny-chatgpt-from-scratch',
        keyTakeaways: [
          'BERT uses bidirectional self-attention to reconstruct masked tokens from both left and right context',
          'GPT applies an upper-triangular -∞ causal mask before Softmax so position i can only attend to positions j ≤ i'
        ]
      },
      {
        id: 'lesson-6-5',
        lessonCode: '6.5',
        slug: 'vision-transformer-vit',
        title: 'Vision Transformer (ViT)',
        subtitle: 'Splitting images into 16×16 patch tokens, linear patch projections, and the [CLS] classification token.',
        everydayScene: 'Cutting a photo into jigsaw pieces',
        isFreePreview: false,
        moduleId: 'track-6',
        moduleName: 'Attention and Transformers',
        moduleNumber: 6,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['transformer-block-multihead-attention', 'convolutional-filters'],
        status: 'available',
        relatedProjectSlug: 'vision-transformer-vs-cnn',
        keyTakeaways: [
          'ViT reshapes an H×W×C image into N = (HW)/P² flattened patches and projects each patch into d_model dimensions',
          'Unlike CNNs with local 3×3 receptive fields, ViT layers can attend globally across the entire image from Layer 1'
        ]
      },
      {
        id: 'lesson-6-6',
        lessonCode: '6.6',
        slug: 'text-generation-decoding-and-llm-evaluation',
        title: 'Text Generation Decoding & LLM Evaluation',
        subtitle: 'Greedy decoding, Beam Search, Temperature, Top-k & Top-p (Nucleus) sampling, plus Perplexity, BLEU/ROUGE & LLM-as-a-Judge.',
        everydayScene: 'Choosing between the safest word, the top-k creative phrases, or judging an essay with a rubric',
        isFreePreview: false,
        moduleId: 'track-6',
        moduleName: 'Attention and Transformers',
        moduleNumber: 6,
        lessonNumber: 6,
        duration: '20 min',
        prerequisites: ['bert-vs-gpt'],
        status: 'available',
        relatedProjectSlug: 'mini-gpt-shakespeare',
        keyTakeaways: [
          'Temperature T scales logits z/T before softmax; Top-k keeps the k highest-probability tokens and Top-p keeps the smallest set summing to p',
          'Beam search tracks top-B sequences for translation/summarization, whereas Top-p nucleus sampling avoids repetitive text in open generation',
          'Perplexity measures next-token surprise; n-gram metrics (BLEU/ROUGE) miss semantics, motivating benchmark suites and LLM-as-a-Judge'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 7: Generative Models (Learning Order #9)
  // =========================================================================
  {
    id: 'track-7',
    number: 7,
    learningOrder: 9,
    title: 'Generative Models',
    description:
      'Compress data into latent manifolds and synthesize realistic new images with Autoencoders, VAEs, GANs, and Denoising Diffusion Models.',
    status: 'available',
    projectSlugs: ['vae-digit-generator', 'anime-gan-or-tiny-diffusion'],
    lessons: [
      {
        id: 'lesson-7-1',
        lessonCode: '7.1',
        slug: 'autoencoders',
        title: 'Autoencoders',
        subtitle: 'Encoder compression, latent bottleneck manifolds, and reconstruction loss minimization.',
        everydayScene: 'Packing a suitcase: what survives the squeeze?',
        isFreePreview: true,
        moduleId: 'track-7',
        moduleName: 'Generative Models',
        moduleNumber: 7,
        lessonNumber: 1,
        duration: '18 min',
        prerequisites: ['backpropagation-fundamentals'],
        status: 'available',
        relatedProjectSlug: 'vae-digit-generator',
        keyTakeaways: [
          'An autoencoder compresses input x ∈ R^D into a low-dimensional bottleneck code z ∈ R^d (d ≪ D) and reconstructs x̂ = g(f(x))',
          'Linear autoencoders span the exact same subspace as PCA; non-linear autoencoders learn curved manifolds'
        ]
      },
      {
        id: 'lesson-7-2',
        lessonCode: '7.2',
        slug: 'variational-autoencoders',
        title: 'Variational Autoencoders (VAEs)',
        subtitle: 'Probabilistic latent spaces, the ELBO objective, KL divergence regularization, and the reparameterization trick.',
        everydayScene: 'A recipe card with a little randomness',
        isFreePreview: false,
        moduleId: 'track-7',
        moduleName: 'Generative Models',
        moduleNumber: 7,
        lessonNumber: 2,
        duration: '22 min',
        prerequisites: ['autoencoders'],
        status: 'available',
        relatedProjectSlug: 'vae-digit-generator',
        keyTakeaways: [
          'VAEs encode each input as a Gaussian distribution N(μ(x), σ²(x)) regularized toward the standard normal prior N(0, I) via KL divergence',
          'The reparameterization trick z = μ + σ ⊙ ε (where ε ~ N(0, I)) makes sampling differentiable for backpropagation'
        ]
      },
      {
        id: 'lesson-7-3',
        lessonCode: '7.3',
        slug: 'generative-adversarial-networks',
        title: 'GANs (Generative Adversarial Networks)',
        subtitle: 'Two-player minimax games, generator vs discriminator dynamics, and mode collapse.',
        everydayScene: 'A fake-note maker vs a bank officer, both improving',
        isFreePreview: false,
        moduleId: 'track-7',
        moduleName: 'Generative Models',
        moduleNumber: 7,
        lessonNumber: 3,
        duration: '22 min',
        prerequisites: ['variational-autoencoders'],
        status: 'available',
        relatedProjectSlug: 'anime-gan-or-tiny-diffusion',
        keyTakeaways: [
          'The Discriminator D(x) maximizes log D(x) + log(1 - D(G(z))) while the Generator G(z) tries to fool D',
          'At Nash equilibrium p_g = p_data and D*(x) = 1/2 everywhere'
        ]
      },
      {
        id: 'lesson-7-4',
        lessonCode: '7.4',
        slug: 'diffusion-models',
        title: 'Diffusion Models',
        subtitle: 'Forward Gaussian noise schedules, closed-form noisy sampling, and iterative reverse denoising.',
        everydayScene: 'Restoring a smudged photo one cleanup step at a time',
        isFreePreview: false,
        moduleId: 'track-7',
        moduleName: 'Generative Models',
        moduleNumber: 7,
        lessonNumber: 4,
        duration: '25 min',
        prerequisites: ['variational-autoencoders'],
        status: 'available',
        relatedProjectSlug: 'anime-gan-or-tiny-diffusion',
        keyTakeaways: [
          'The forward process gradually corrupts x_0 into pure noise via x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε in closed form',
          'A U-Net or Transformer is trained with simple MSE loss ||ε - ε_θ(x_t, t)||² to predict and subtract the added noise step by step'
        ]
      }
    ]
  },

  // =========================================================================
  // TRACK 8: Modern LLM Practice (Learning Order #10)
  // =========================================================================
  {
    id: 'track-8',
    number: 8,
    learningOrder: 10,
    title: 'Modern LLM Practice',
    description:
      'Go from Transformer theory to real-world LLM engineering: BPE tokenization, LoRA fine-tuning, Retrieval-Augmented Generation (RAG), and RLHF.',
    status: 'available',
    projectSlugs: ['chat-with-syllabus-rag', 'lora-finetuning-open-llm'],
    lessons: [
      {
        id: 'lesson-8-1',
        lessonCode: '8.1',
        slug: 'tokenization-and-llm-pretraining',
        title: 'Tokenization and LLM Pretraining',
        subtitle: 'Byte-Pair Encoding (BPE), subword vocabularies, next-token cross-entropy, and perplexity.',
        everydayScene: 'Lego bricks; SMS shorthand splitting words',
        isFreePreview: true,
        moduleId: 'track-8',
        moduleName: 'Modern LLM Practice',
        moduleNumber: 8,
        lessonNumber: 1,
        duration: '18 min',
        prerequisites: ['self-attention-scaled-dot-product'],
        status: 'available',
        relatedProjectSlug: 'chat-with-syllabus-rag',
        keyTakeaways: [
          'BPE iteratively merges the most frequent adjacent byte/character pairs to balance vocabulary size against sequence length',
          'Autoregressive pretraining minimizes average negative log-likelihood; Perplexity PPL = exp(L) measures effective branching factor'
        ]
      },
      {
        id: 'lesson-8-2',
        lessonCode: '8.2',
        slug: 'finetuning-and-lora',
        title: 'Fine-Tuning and LoRA',
        subtitle: 'Low-Rank Adaptation W = W_0 + (α/r) B·A, rank selection, and 99% trainable parameter reduction.',
        everydayScene: 'Tuning a radio knob instead of rebuilding the radio',
        isFreePreview: false,
        moduleId: 'track-8',
        moduleName: 'Modern LLM Practice',
        moduleNumber: 8,
        lessonNumber: 2,
        duration: '20 min',
        prerequisites: ['tokenization-and-llm-pretraining'],
        status: 'available',
        relatedProjectSlug: 'lora-finetuning-open-llm',
        keyTakeaways: [
          'LoRA freezes pretrained weights W_0 ∈ R^{d×k} and injects trainable low-rank matrices B ∈ R^{d×r}, A ∈ R^{r×k} with r ≪ min(d, k)',
          'Initializing B = 0 guarantees ΔW = 0 at step 0, and B·A merges into W_0 at inference for zero latency overhead'
        ]
      },
      {
        id: 'lesson-8-3',
        lessonCode: '8.3',
        slug: 'retrieval-augmented-generation-rag',
        title: 'Retrieval-Augmented Generation (RAG)',
        subtitle: 'Document chunking, dense vector indexing, top-k cosine retrieval, and grounded prompt synthesis.',
        everydayScene: 'An open-book exam: look it up before you answer',
        isFreePreview: false,
        moduleId: 'track-8',
        moduleName: 'Modern LLM Practice',
        moduleNumber: 8,
        lessonNumber: 3,
        duration: '20 min',
        prerequisites: ['tokenization-and-llm-pretraining'],
        status: 'available',
        relatedProjectSlug: 'chat-with-syllabus-rag',
        keyTakeaways: [
          'RAG embeds document chunks and user queries into a shared vector space, retrieving the top-k chunks with highest cosine similarity',
          'Conditioning generation on retrieved context grounds answers in verifiable sources and slashes hallucinations without retraining weights'
        ]
      },
      {
        id: 'lesson-8-4',
        lessonCode: '8.4',
        slug: 'reinforcement-learning-and-rlhf',
        title: 'Reinforcement Learning Basics and RLHF',
        subtitle: 'Bradley-Terry reward modeling, KL-regularized policy optimization, and Direct Preference Optimization (DPO).',
        everydayScene: 'Training a dog with treats; rating a delivery partner',
        isFreePreview: false,
        moduleId: 'track-8',
        moduleName: 'Modern LLM Practice',
        moduleNumber: 8,
        lessonNumber: 4,
        duration: '22 min',
        prerequisites: ['finetuning-and-lora'],
        status: 'available',
        relatedProjectSlug: 'lora-finetuning-open-llm',
        keyTakeaways: [
          'Human preference pairs (y_w ≻ y_l) train a Reward Model via L_RM = -log σ(r(x, y_w) - r(x, y_l))',
          'KL penalty β · D_KL(π_θ || π_ref) prevents the policy from reward-hacking into degenerate text'
        ]
      },
      {
        id: 'lesson-8-5',
        lessonCode: '8.5',
        slug: 'advanced-rag-reranking-and-retrieval-eval',
        title: 'Reranking & Retrieval Evaluation (Recall@k, MRR, NDCG)',
        subtitle: 'Two-stage retrieval (Bi-Encoder + Cross-Encoder Reranking), hybrid BM25+dense search, and measuring RAG quality.',
        everydayScene: 'Scanning 1,000 library books by title first, then reading the top 20 tables of contents carefully',
        isFreePreview: false,
        moduleId: 'track-8',
        moduleName: 'Modern LLM Practice',
        moduleNumber: 8,
        lessonNumber: 5,
        duration: '20 min',
        prerequisites: ['retrieval-augmented-generation-rag'],
        status: 'available',
        relatedProjectSlug: 'chat-with-syllabus-rag',
        keyTakeaways: [
          'Bi-encoders embed query and document separately for fast ANN lookup; Cross-encoders attend jointly over (query, doc) for accurate reranking',
          'Recall@k checks whether the right chunk appeared in the top k; MRR and NDCG reward placing the best chunk at rank #1',
          'Evaluating RAG separates Retrieval quality (Context Recall/Precision) from Generation quality (Faithfulness & Answer Relevance)'
        ]
      },
      {
        id: 'lesson-8-6',
        lessonCode: '8.6',
        slug: 'llm-quantization-kv-cache-and-inference',
        title: 'Quantization, KV Cache & Inference Optimization',
        subtitle: 'FP16/INT8/INT4 weight quantization, autoregressive KV caching, memory bandwidth bottlenecks, and continuous batching.',
        everydayScene: 'Writing down the notes from earlier chapters so you don’t re-read the whole book for every new word',
        isFreePreview: false,
        moduleId: 'track-8',
        moduleName: 'Modern LLM Practice',
        moduleNumber: 8,
        lessonNumber: 6,
        duration: '22 min',
        prerequisites: ['finetuning-and-lora', 'transformer-block-multihead-attention'],
        status: 'available',
        relatedProjectSlug: 'lora-finetuning-open-llm',
        keyTakeaways: [
          'Without a KV cache, generating T tokens recomputes Keys and Values in O(T²) per step; caching past K,V tensors cuts step cost to O(T)',
          'Quantization maps FP16 weights to INT8/INT4 (e.g., AWQ/GPTQ), slashing VRAM by 2–4× and accelerating memory-bound decoding',
          'PagedAttention, FlashAttention, and speculative decoding maximize GPU utilization in production serving'
        ]
      }
    ]
  }
];

export const ALL_LESSONS = CURRICULUM.flatMap(m => m.lessons);

export function getTrackStageLabel(trackNumber: number): string {
  switch (trackNumber) {
    case 0:
      return 'Stage 1: Foundations';
    case 9:
      return 'Stage 2: Data Preparation';
    case 1:
      return 'Stage 3: Classical ML';
    case 2:
    case 3:
    case 4:
      return 'Stage 4: Deep Learning';
    default:
      return 'Stage 5: Advanced AI';
  }
}

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return ALL_LESSONS.find(l => l.slug === slug);
}

export function getTrackByNumber(trackNumber: number): ModuleMeta | undefined {
  return CURRICULUM.find(m => m.number === trackNumber);
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
