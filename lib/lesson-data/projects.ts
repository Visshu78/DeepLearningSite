export interface ProjectDatasetBlock {
  name: string;
  url: string;
  secondaryUrl?: string;
  secondaryName?: string;
  loaderSnippet: string;
  size: string;
  license: string;
  downloadTime: string;
  liteSubsetNote: string;
  sampleColumnsOrShape: string;
}

export interface ProjectMilestone {
  number: number;
  title: string;
  expectedOutput: string;
}

export interface TrackProject {
  slug: string;
  trackNumber: number;
  trackTitle: string;
  title: string;
  funTitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCapstone?: boolean;
  medicalDisclaimer?: string;
  problemStatement: string;
  learningGoals: string[];
  colabStarterUrl: string;
  dataset: ProjectDatasetBlock;
  milestones: ProjectMilestone[];
  rubricQuestions: string[];
  resumeBulletTemplate: string;
  stretchGoals: string[];
}

export const TRACK_PROJECTS: TrackProject[] = [
  // =========================================================================
  // TRACK 0 PROJECT
  // =========================================================================
  {
    slug: 'autodiff-engine-from-scratch',
    trackNumber: 0,
    trackTitle: 'Math Toolkit',
    title: 'Reverse-Mode Autodiff Engine from Scratch',
    funTitle: 'Autodiff Engine from Scratch',
    difficulty: 'Beginner',
    problemStatement:
      'Build a scalar and small-tensor reverse-mode automatic differentiation engine (like Karpathy\'s micrograd) that records a dynamic computation graph and computes exact analytical gradients via the chain rule, verified against PyTorch autograd and finite differences.',
    learningGoals: [
      'Represent mathematical expressions as a Directed Acyclic Graph (DAG) of Value nodes',
      'Implement forward evaluation and local backward derivative closures for +, ×, tanh, exp, and ReLU',
      'Topologically sort computation graphs to propagate gradients backward in a single O(E) pass',
      'Verify every analytical gradient against central finite differences within 1e-6 tolerance'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'scikit-learn make_moons synthetic 2D classification benchmark',
      url: 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_moons.html',
      loaderSnippet: 'from sklearn.datasets import make_moons\nX, y = make_moons(n_samples=200, noise=0.1, random_state=42)',
      size: '< 10 KB (generated in memory)',
      license: 'BSD-3-Clause (scikit-learn)',
      downloadTime: 'Instant (0 sec)',
      liteSubsetNote: 'Already lightweight (200 points in R²); runs on CPU in < 2 seconds.',
      sampleColumnsOrShape: 'X: (200, 2) float64 coordinates, y: (200,) binary labels {0, 1}'
    },
    milestones: [
      {
        number: 1,
        title: 'Scalar Value Node & Forward Arithmetic',
        expectedOutput: 'Expressions like c = (a * b) + a.relu() evaluate and record parent pointers.'
      },
      {
        number: 2,
        title: 'Topological Sort & Reverse Chain Rule',
        expectedOutput: 'Calling loss.backward() populates .grad on all leaf nodes matching torch.autograd within 1e-6.'
      },
      {
        number: 3,
        title: '2-Layer MLP Training on make_moons',
        expectedOutput: 'Decision boundary separates the two moons with >= 95% accuracy and loss < 0.08.'
      }
    ],
    rubricQuestions: [
      'Why must we accumulate gradients with += instead of overwriting with = when a variable is used twice in an expression?',
      'Why is reverse-mode autodiff O(1) passes for a scalar loss with N parameters, whereas forward-mode requires O(N) passes?',
      'How did you choose step size ε for your finite-difference gradient check so floating-point roundoff did not corrupt the check?'
    ],
    resumeBulletTemplate:
      'Built a reverse-mode automatic differentiation engine from scratch in Python with topological graph traversal, achieving 100% gradient parity (< 1e-6 max diff) against PyTorch autograd and [__]% accuracy on non-linear 2D classification.',
    stretchGoals: [
      'Extend scalar Value nodes to 2D NumPy matrix nodes with broadcasting backward rules',
      'Add a Graphviz visualizer that renders forward values and backward gradients on each edge'
    ]
  },

  // =========================================================================
  // TRACK 9 PROJECT
  // =========================================================================
  {
    slug: 'clean-the-messy-dataset',
    trackNumber: 9,
    trackTitle: 'Data Preparation and Feature Engineering',
    title: 'Leak-Free Preprocessing & Feature Engineering Pipeline',
    funTitle: 'Clean the messy dataset',
    difficulty: 'Intermediate',
    problemStatement:
      'Take a messy real-world tabular dataset with missing values, extreme income outliers, mixed categorical columns, and class imbalance, and build a reproducible, zero-leakage scikit-learn ColumnTransformer + Pipeline that measurably improves cross-validated ROC-AUC.',
    learningGoals: [
      'Audit column types, missingness patterns (MCAR vs informative missingness), and skewness before modeling',
      'Compare median imputation + missing-indicator flags against naive row dropping',
      'Combine One-Hot, Ordinal, and smoothed cross-validated Target Encoding without leaking validation targets',
      'Demonstrate the exact accuracy inflation caused by fitting scalers/imputers before train/test splitting'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Titanic Survival & Telco Customer Churn Datasets',
      url: 'https://www.kaggle.com/c/titanic',
      secondaryUrl: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
      secondaryName: 'Telco Customer Churn (Kaggle)',
      loaderSnippet: 'import seaborn as sns\ndf = sns.load_dataset("titanic")  # Or load WA_Fn-UseC_-Telco-Customer-Churn.csv',
      size: 'Titanic: 60 KB (891 rows) · Telco Churn: 950 KB (7,043 rows, 21 columns)',
      license: 'CC0 Public Domain / Open Community Dataset',
      downloadTime: '< 3 seconds',
      liteSubsetNote: 'Both datasets fit comfortably in RAM and run 5-fold cross-validation in under 5 seconds.',
      sampleColumnsOrShape: '(7043, 21): tenure, MonthlyCharges, TotalCharges (with blank strings!), Contract, PaymentMethod, Churn'
    },
    milestones: [
      {
        number: 1,
        title: 'EDA & Data Quality Audit Report',
        expectedOutput: 'Summary table identifying hidden missing values (e.g. blank strings in TotalCharges), outlier IQR bounds, and class ratio.'
      },
      {
        number: 2,
        title: 'Leakage vs Zero-Leakage Experiment',
        expectedOutput: 'Side-by-side table showing inflated CV score when scaling/imputing pre-split vs true out-of-fold Pipeline score.'
      },
      {
        number: 3,
        title: 'End-to-End ColumnTransformer Pipeline',
        expectedOutput: 'Serializable Pipeline achieving >= 0.84 ROC-AUC on held-out test split with zero NaN or unseen-category crashes.'
      }
    ],
    rubricQuestions: [
      'Which columns in your dataset had informative missingness, and how much did adding a "was_missing" indicator change validation F1?',
      'Why did you choose One-Hot vs Target Encoding for each categorical column, and how did you prevent target leakage?',
      'Why did fitting StandardScaler on the full dataset before train_test_split alter your validation metrics?'
    ],
    resumeBulletTemplate:
      'Engineered a leak-free scikit-learn ColumnTransformer preprocessing pipeline (median + indicator imputation, RobustScaler, smoothed CV target encoding) on [__]k customer records, boosting 5-fold ROC-AUC from [__] to [__].',
    stretchGoals: [
      'Benchmark KNNImputer and IterativeImputer against median imputation',
      'Export the fitted pipeline with joblib and wrap it in a 20-line FastAPI validation endpoint'
    ]
  },

  // =========================================================================
  // TRACK 1 PROJECTS
  // =========================================================================
  {
    slug: 'house-price-predictor',
    trackNumber: 1,
    trackTitle: 'Classical ML',
    title: 'House & Rent Price Predictor from Scratch',
    funTitle: 'What should my rent be?',
    difficulty: 'Beginner',
    problemStatement:
      'Implement multivariate Linear and Ridge Regression using both closed-form Normal Equations and vectorized Gradient Descent, then benchmark your custom implementation against scikit-learn and Random Forests on real housing data.',
    learningGoals: [
      'Implement vectorized MSE loss and analytical weight gradients (2/N) Xᵀ(Xw + b - y)',
      'Observe how unscaled features slow gradient descent into a zig-zag ravine and fix it with standardization',
      'Compare L2 Ridge regularization across log-spaced λ values to tame multicollinearity',
      'Interpret feature coefficients and residual plots to spot non-linear price patterns'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'California Housing (scikit-learn) & Ames Housing (Kaggle)',
      url: 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html',
      secondaryUrl: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques',
      secondaryName: 'Ames Housing Dataset (Kaggle)',
      loaderSnippet: 'from sklearn.datasets import fetch_california_housing\ndata = fetch_california_housing(as_frame=True)',
      size: 'California Housing: 1.8 MB (20,640 rows, 8 features) · Ames: 900 KB (1,460 rows, 79 features)',
      license: 'BSD-3-Clause / Public Research License',
      downloadTime: '< 5 seconds via sklearn loader',
      liteSubsetNote: 'Use a 5,000-row random sample of California Housing for instant interactive grid searches.',
      sampleColumnsOrShape: '(20640, 8): MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude -> MedHouseVal'
    },
    milestones: [
      {
        number: 1,
        title: 'Vectorized NumPy Linear Regression',
        expectedOutput: 'Custom Gradient Descent and Normal Equation weights match sklearn LinearRegression within 1e-4.'
      },
      {
        number: 2,
        title: 'Feature Scaling & Regularization Sweep',
        expectedOutput: 'Validation RMSE curve across λ ∈ [1e-4, 1e2] identifying the optimal Ridge penalty.'
      },
      {
        number: 3,
        title: 'Tree Ensemble Comparison',
        expectedOutput: 'Random Forest captures non-linear spatial latitude/longitude interactions, reducing test RMSE by >= 18%.'
      }
    ],
    rubricQuestions: [
      'Why did gradient descent diverge or crawl before you standardized the input features?',
      'When would you prefer closed-form Normal Equations (XᵀX)⁻¹Xᵀy over iterative Gradient Descent, and at what feature count D does matrix inversion become a bottleneck?',
      'Which engineered interaction feature reduced your housing RMSE the most, and why?'
    ],
    resumeBulletTemplate:
      'Implemented vectorized Ridge Regression from scratch in NumPy and benchmarked against Random Forests on 20,640 housing records, reducing out-of-sample RMSE to [__] (R² = [__]) with zero-leakage cross-validation.',
    stretchGoals: [
      'Add log-transformation on skewed target prices and verify metric calculation in original currency units',
      'Plot a 2D geographic heatmap of model residuals to discover pricey neighborhood clusters'
    ]
  },
  {
    slug: 'telco-customer-churn',
    trackNumber: 1,
    trackTitle: 'Classical ML',
    title: 'Customer Churn Early-Warning System',
    funTitle: 'Will this customer ditch their plan?',
    difficulty: 'Intermediate',
    problemStatement:
      'Build a calibrated customer churn classifier reusing your Track 9 preprocessing pipeline, comparing Logistic Regression against Random Forests and tuning the decision threshold to maximize business retention ROI.',
    learningGoals: [
      'Implement Binary Cross-Entropy loss and Sigmoid gradient descent from scratch',
      'Compare Accuracy vs Precision, Recall, F1, ROC-AUC, and PR-AUC on imbalanced churn data',
      'Sweep the probability decision threshold τ ∈ [0.1, 0.9] to optimize expected retention cost',
      'Extract feature importances to explain why month-to-month contracts churn faster'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Telco Customer Churn Dataset (Kaggle)',
      url: 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn',
      loaderSnippet: 'import pandas as pd\ndf = pd.read_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")',
      size: '950 KB (7,043 rows, 21 columns)',
      license: 'Apache 2.0 / IBM Sample Dataset',
      downloadTime: '< 3 seconds',
      liteSubsetNote: 'Full dataset is under 1 MB and trains in < 3 seconds on CPU.',
      sampleColumnsOrShape: '(7043, 21): customerID, tenure, InternetService, Contract, MonthlyCharges, TotalCharges, Churn (26.5% positive)'
    },
    milestones: [
      {
        number: 1,
        title: 'Custom Logistic Regression Baseline',
        expectedOutput: 'NumPy Logistic Regression converges and matches sklearn LogisticRegression ROC-AUC within 0.005.'
      },
      {
        number: 2,
        title: 'Precision-Recall & Threshold Optimization',
        expectedOutput: 'Plot of Precision, Recall, and F1 vs threshold τ, picking τ* that achieves >= 0.80 Recall on churners.'
      },
      {
        number: 3,
        title: 'Random Forest & Permutation Importance Report',
        expectedOutput: 'Ranked bar chart of top 5 churn drivers with confusion matrix at the business-optimal threshold.'
      }
    ],
    rubricQuestions: [
      'Why is a false negative (missing a customer who churns) more expensive than a false positive (sending a discount coupon to a loyal customer), and how did that shape your threshold τ*?',
      'How did class_weight="balanced" affect Precision and Recall compared to un-weighted Logistic Regression?',
      'Why did Random Forest overfit when max_depth was left unconstrained, and how did you pick the optimal depth?'
    ],
    resumeBulletTemplate:
      'Built an end-to-end customer churn classifier on 7,043 telecom accounts achieving [__] ROC-AUC and [__]% Recall on at-risk subscribers by optimizing probability thresholds for retention ROI.',
    stretchGoals: [
      'Plot a calibration curve (reliability diagram) comparing Logistic Regression vs Random Forest probabilities'
    ]
  },

  // =========================================================================
  // TRACK 2 PROJECT
  // =========================================================================
  {
    slug: 'mnist-in-pure-numpy',
    trackNumber: 2,
    trackTitle: 'Neural Network Foundations',
    title: 'Multi-Layer Neural Network in Pure NumPy (MNIST)',
    funTitle: 'Be the cheque scanner',
    difficulty: 'Intermediate',
    problemStatement:
      'Build, verify, and train a 3-layer Neural Network (784 → 128 → 64 → 10) using only NumPy matrix operations—no PyTorch or TensorFlow autograd—to classify handwritten digits with 97%+ test accuracy.',
    learningGoals: [
      'Implement vectorized forward passes for Linear layers, ReLU activations, and numerically stable log-sum-exp Softmax',
      'Derive and code analytical backward passes computing ∂L/∂W, ∂L/∂b, and ∂L/∂A for every layer',
      'Verify your analytical backward pass with finite-difference gradient checking on a tiny 5-unit network',
      'Train with mini-batch SGD and plot live training vs validation accuracy and confusion matrices'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'MNIST Handwritten Digits (OpenML / torchvision / keras)',
      url: 'https://www.openml.org/d/554',
      loaderSnippet: 'from sklearn.datasets import fetch_openml\nX, y = fetch_openml("mnist_784", version=1, return_X_y=True, as_frame=False)',
      size: '11 MB compressed (70,000 grayscale 28×28 images)',
      license: 'CC BY-SA 3.0',
      downloadTime: '5–10 seconds via OpenML / keras.datasets.mnist',
      liteSubsetNote: 'Lite subset: use first 10,000 train + 2,000 test digits (or sklearn load_digits 8×8) for 2-second iterations.',
      sampleColumnsOrShape: 'X: (70000, 784) uint8 pixels in [0, 255] -> scaled to float32 [0.0, 1.0]; y: (70000,) labels 0..9'
    },
    milestones: [
      {
        number: 1,
        title: 'Numerically Stable Softmax + Cross-Entropy & Gradient Check',
        expectedOutput: 'Relative error between analytical and finite-difference gradients is < 1e-6 across all weights.'
      },
      {
        number: 2,
        title: 'Mini-Batch Training Loop',
        expectedOutput: 'Training loss drops smoothly from ~2.30 (random 10-class guessing) below 0.10 within 15 epochs.'
      },
      {
        number: 3,
        title: '97%+ Held-Out Test Accuracy & Error Analysis',
        expectedOutput: 'Test accuracy >= 97.0% on the 10,000 MNIST test digits, plus a visual grid of the top 10 misclassified digits.'
      }
    ],
    rubricQuestions: [
      'Why does computing exp(z) directly overflow for large logits, and how does subtracting max(z) fix Softmax without changing its output?',
      'Show how the combined derivative of Softmax + Cross-Entropy simplifies cleanly to (ŷ - y).',
      'What happened to your training speed and accuracy when you forgot to divide pixel values by 255.0?'
    ],
    resumeBulletTemplate:
      'Implemented a 3-layer deep neural network from scratch in pure NumPy (analytical backpropagation, He initialization, mini-batch SGD, finite-difference gradient verification), achieving [__]% test accuracy on 70,000 MNIST handwritten digits.',
    stretchGoals: [
      'Visualize the learned 28×28 weight templates of the first hidden layer',
      'Add an interactive canvas widget in Colab where you draw a digit with your mouse and run your NumPy forward pass'
    ]
  },

  // =========================================================================
  // TRACK 3 PROJECTS
  // =========================================================================
  {
    slug: 'training-debugging-lab',
    trackNumber: 3,
    trackTitle: 'Training Neural Networks Well',
    title: 'Neural Network Training Debugging Lab (5 Broken Runs)',
    funTitle: 'Training Debugging Lab (5 broken runs)',
    difficulty: 'Intermediate',
    problemStatement:
      'Step into the shoes of an ML engineer on call: you are given 5 broken Fashion-MNIST training scripts (diverging loss, zero-initialized symmetry lock, 99% dead ReLUs, severe overfitting, and frozen saturated sigmoids). Diagnose each pathology from its loss and activation histograms and fix all 5.',
    learningGoals: [
      'Diagnose training failures systematically by inspecting loss curves, activation distributions, and gradient norms per layer',
      'Fix vanishing/saturating activations by switching to He initialization + Batch/Layer Normalization',
      'Eliminate overfitting gaps using Inverted Dropout and L2 weight decay',
      'Pass the "overfit a single batch of 16 examples to 0.001 loss" sanity check before full training'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Fashion-MNIST (Zalando Research)',
      url: 'https://github.com/zalandoresearch/fashion-mnist',
      loaderSnippet: 'import torchvision.datasets as dsets\ntrain_set = dsets.FashionMNIST(root="./data", train=True, download=True)',
      size: '30 MB (60,000 train + 10,000 test 28×28 grayscale apparel images, 10 classes)',
      license: 'MIT License',
      downloadTime: '5–8 seconds',
      liteSubsetNote: 'Lite mode uses 12,000 training images so all 5 broken runs execute in under 60 seconds total.',
      sampleColumnsOrShape: '(60000, 1, 28, 28) uint8 images across 10 classes (T-shirt, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Boot)'
    },
    milestones: [
      {
        number: 1,
        title: 'Pathology Diagnosis Table',
        expectedOutput: 'For each of the 5 broken runs, record the exact symptom (e.g. "98% of layer 3 ReLU activations are 0") and root cause.'
      },
      {
        number: 2,
        title: 'Surgical Fixes & Before/After Loss Curves',
        expectedOutput: '5 paired before-and-after training/validation curves demonstrating stable convergence on every run.'
      },
      {
        number: 3,
        title: '89%+ Fashion-MNIST Validation Accuracy',
        expectedOutput: 'Combined best configuration (He init + BatchNorm + Dropout + Cosine LR) reaches >= 89% test accuracy.'
      }
    ],
    rubricQuestions: [
      'In Broken Run #2 (all weights initialized to 0.0), why did the bias parameters still update while every hidden neuron learned the exact same feature?',
      'How can you tell from the training and validation loss curves alone whether a model needs more capacity vs stronger regularization?',
      'Why must model.eval() be called before validation when your network contains Dropout and BatchNorm layers?'
    ],
    resumeBulletTemplate:
      'Diagnosed and resolved 5 deep learning training pathologies (symmetry lock, dead ReLUs, gradient explosion, internal covariate shift, high-variance overfitting) on Fashion-MNIST, lifting validation accuracy from [__]% to [__]%.',
    stretchGoals: [
      'Log per-layer gradient-to-weight ratios (||η·∇W|| / ||W|| ≈ 1e-3) across epochs to verify balanced learning speed'
    ]
  },
  {
    slug: 'optimizer-benchmark',
    trackNumber: 3,
    trackTitle: 'Training Neural Networks Well',
    title: 'Optimizer & Learning Rate Schedule Benchmark Suite',
    funTitle: 'Optimizer Benchmark',
    difficulty: 'Intermediate',
    problemStatement:
      'Implement SGD, SGD + Momentum, RMSprop,Adam, and AdamW from scratch, then run a controlled benchmark across 2D ill-conditioned ravines and Fashion-MNIST with Step, Cosine Annealing, and Linear Warmup schedules.',
    learningGoals: [
      'Implement exact first-moment (m_t) and second-moment (v_t) updates with (1 - β^t) bias correction',
      'Compare coupled L2 regularization against decoupled weight decay (AdamW)',
      'Measure wall-clock time and epochs-to-target-accuracy across 4 optimizers and 3 LR schedules',
      'Visualize 2D parameter trajectories on a high-curvature ravine contour plot'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Fashion-MNIST (Zalando Research)',
      url: 'https://github.com/zalandoresearch/fashion-mnist',
      loaderSnippet: 'import torchvision.datasets as dsets\ntrain_set = dsets.FashionMNIST(root="./data", train=True, download=True)',
      size: '30 MB (70,000 28×28 grayscale images)',
      license: 'MIT License',
      downloadTime: '5–8 seconds',
      liteSubsetNote: 'Use 15,000 subset for rapid 10-epoch optimizer sweeps.',
      sampleColumnsOrShape: '(60000, 1, 28, 28) images, 10 apparel classes'
    },
    milestones: [
      {
        number: 1,
        title: 'From-Scratch Optimizer Verification',
        expectedOutput: 'Custom SGD, Momentum, RMSprop, and Adam classes match torch.optim parameter trajectories within 1e-5.'
      },
      {
        number: 2,
        title: 'Ravine Trajectory Contour Plot',
        expectedOutput: '2D plot showing SGD oscillating across canyon walls while Momentum and Adam glide to the minimum.'
      },
      {
        number: 3,
        title: 'Fashion-MNIST Schedule Ablation Table',
        expectedOutput: 'Benchmark table comparing final test accuracy and convergence epoch across Constant, Warmup+Cosine, and Step Decay.'
      }
    ],
    rubricQuestions: [
      'What happens in the first 3 steps of Adam if you remove the 1/(1 - β₁^t) and 1/(1 - β₂^t) bias correction terms?',
      'Why does decoupled weight decay (AdamW) generalize better than adding (λ/2)||w||² inside the adaptive gradient of Adam?',
      'In your benchmark, how did final test generalization compare between well-tuned SGD+Momentum+Cosine vs default Adam?'
    ],
    resumeBulletTemplate:
      'Implemented SGD+Momentum, RMSprop, and AdamW from scratch and benchmarked 12 optimizer-schedule combinations on Fashion-MNIST, cutting epochs-to-88%-accuracy by [__]% using linear warmup and cosine annealing.',
    stretchGoals: [
      'Add a Learning Rate Range Test (Smith LR finder) that sweeps η from 1e-6 to 10 in one epoch to pick η_max automatically'
    ]
  },

  // =========================================================================
  // TRACK 4 PROJECTS
  // =========================================================================
  {
    slug: 'plant-disease-resnet-gradcam',
    trackNumber: 4,
    trackTitle: 'Computer Vision',
    title: 'Plant Disease Classifier with ResNet & Grad-CAM Explainability',
    funTitle: 'Crop doctor for farmers',
    difficulty: 'Intermediate',
    problemStatement:
      'Fine-tune a residual convolutional network on leaf photographs to classify healthy vs diseased crops, and implement Grad-CAM activation heatmaps to verify the model is looking at leaf lesions rather than background soil.',
    learningGoals: [
      'Compare a plain custom 4-layer CNN baseline against a pretrained ResNet-18 with skip connections',
      'Apply data augmentation (random flips, rotations, color jitter) to improve field generalization',
      'Implement Grad-CAM by weighting final convolutional feature maps by global-average-pooled class gradients',
      'Spot and fix "Clever Hans" background shortcuts using heatmap overlays'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'PlantVillage Leaf Disease Dataset (Kaggle)',
      url: 'https://www.kaggle.com/datasets/emmarex/plantdisease',
      loaderSnippet: '# Load via Kaggle API or 3-class Tomato/Potato subset (3,000 images)',
      size: 'Full: 650 MB (54,000 RGB leaf images, 38 classes) · Lite 5-class subset: 45 MB (2,500 images)',
      license: 'CC0 / Public Research Dataset (Penn State PlantVillage)',
      downloadTime: '15 seconds for Lite subset; ~1 min for full dataset on Colab',
      liteSubsetNote: 'Use the 5-class Potato & Tomato subset (2,500 images at 128×128) for fast 3-minute training on Colab T4 GPU.',
      sampleColumnsOrShape: 'RGB leaf images (224×224×3) across classes: Healthy, Early Blight, Late Blight, Leaf Mold, Bacterial Spot'
    },
    milestones: [
      {
        number: 1,
        title: 'Custom CNN Baseline vs Pretrained ResNet-18',
        expectedOutput: 'Comparison table of parameter count, training time per epoch, and validation macro-F1.'
      },
      {
        number: 2,
        title: 'Grad-CAM Heatmap Implementation',
        expectedOutput: 'Grid of 6 test leaves showing raw image, Grad-CAM heatmap, and superimposed lesion localization.'
      },
      {
        number: 3,
        title: '96%+ Validation Accuracy & Per-Class Confusion Matrix',
        expectedOutput: 'Fine-tuned ResNet achieves >= 96% accuracy on the held-out test split with per-disease Precision/Recall.'
      }
    ],
    rubricQuestions: [
      'In Grad-CAM, why do we apply ReLU to the linear combination Σ α_k A^k of feature maps?',
      'Which two plant diseases were most frequently confused in your confusion matrix, and what did their Grad-CAM heatmaps reveal?',
      'How much did freezing the early ResNet stages vs fine-tuning all layers change your validation accuracy and training speed?'
    ],
    resumeBulletTemplate:
      'Fine-tuned a ResNet-18 computer vision classifier on [__]k PlantVillage crop leaf images achieving [__]% macro-F1, and implemented Grad-CAM visual attribution heatmaps to localize foliar disease lesions.',
    stretchGoals: [
      'Export the trained model to ONNX / TorchScript and measure single-image CPU inference latency (< 30 ms)'
    ]
  },
  {
    slug: 'chest-xray-classifier',
    trackNumber: 4,
    trackTitle: 'Computer Vision',
    title: 'Chest X-Ray Transfer Learning & Calibration Study',
    funTitle: 'Chest X-ray classifier (learning only, not diagnosis)',
    difficulty: 'Intermediate',
    medicalDisclaimer:
      'FOR EDUCATIONAL AND LEARNING PURPOSES ONLY — NOT FOR CLINICAL OR MEDICAL DIAGNOSIS. This student project demonstrates transfer learning, class-imbalance metrics, and Grad-CAM pitfalls on a public research dataset and must never be used for medical decision-making.',
    problemStatement:
      'Explore transfer learning on grayscale chest radiographs while learning why high raw accuracy on medical datasets can be misleading due to class imbalance, threshold sensitivity, and hospital-scanner shortcuts.',
    learningGoals: [
      'Adapt a 3-channel RGB pretrained backbone (ResNet / EfficientNet) to single-channel radiographs',
      'Handle severe train/test class imbalance using weighted cross-entropy and Precision-Recall curves',
      'Audit model failure modes and shortcut learning (e.g. portable scanner text markers) with Grad-CAM',
      'Document model limitations, false-negative risks, and calibration gaps honestly'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Chest X-Ray Images (Pneumonia) — Kaggle / Kermany et al.',
      url: 'https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia',
      loaderSnippet: '# Kaggle dataset: paultimothymooney/chest-xray-pneumonia (5,863 images)',
      size: '1.15 GB full · Lite subset: 80 MB (1,000 balanced 224×224 images)',
      license: 'CC BY 4.0 (Kermany et al., Cell 2018)',
      downloadTime: '20 seconds on Colab via kagglehub',
      liteSubsetNote: 'Use the 1,000-image resized 224×224 subset for fast 4-minute experimentation.',
      sampleColumnsOrShape: '5,863 anterior-posterior chest radiographs (Normal vs Pneumonia) split into train/val/test'
    },
    milestones: [
      {
        number: 1,
        title: 'Class Imbalance & Validation Split Audit',
        expectedOutput: 'Create a stratified validation split (the default folder only has 16 val images!) and compute class weights.'
      },
      {
        number: 2,
        title: 'Frozen Head vs Differential Fine-Tuning',
        expectedOutput: 'ROC-AUC and PR-AUC curves comparing linear probing against top-block unfreezing.'
      },
      {
        number: 3,
        title: 'Grad-CAM Shortcut Audit & Limitations Card',
        expectedOutput: 'Model Card documenting Sensitivity (Recall), Specificity, and 4 Grad-CAM overlays showing where the model focuses outside the lung fields.'
      }
    ],
    rubricQuestions: [
      'Why was the original 16-image validation folder in this Kaggle dataset statistically unreliable for early stopping?',
      'When Grad-CAM highlights the corner "L/R" hospital marker instead of the lung opacity, what does that tell you about dataset bias?',
      'Why must both Sensitivity (Recall) and Specificity be reported alongside PR-AUC rather than raw accuracy?'
    ],
    resumeBulletTemplate:
      'Conducted an educational transfer-learning and explainability study on 5,863 chest radiographs using EfficientNet-B0 and Grad-CAM, achieving [__] ROC-AUC while auditing shortcut learning and threshold calibration.',
    stretchGoals: [
      'Apply lung-field bounding masks before classification to prevent corner-marker shortcut learning'
    ]
  },
  {
    slug: 'college-gate-bike-counter-yolo',
    trackNumber: 4,
    trackTitle: 'Computer Vision',
    title: 'Real-Time Vehicle & Bike Detector with YOLO',
    funTitle: 'Count the bikes at your college gate',
    difficulty: 'Advanced',
    problemStatement:
      'Implement Intersection over Union (IoU) and Non-Maximum Suppression (NMS) from scratch in Python, then fine-tune a lightweight YOLO detector to detect and count two-wheelers, autos, and cars crossing a virtual gate line.',
    learningGoals: [
      'Write vectorized IoU and greedy Non-Maximum Suppression (NMS) functions and test them on overlapping boxes',
      'Understand anchor-free / grid-based bounding box regression losses (CIoU + focal classification loss)',
      'Evaluate object detection using Precision-Recall curves and mAP@0.5 / mAP@0.5:0.95',
      'Build a virtual tripwire counter that tracks bounding-box centroids across video frames'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'COCO 128 / COCO Vehicle Subset',
      url: 'https://cocodataset.org',
      loaderSnippet: '# Ultralytics COCO128 (6 MB) auto-downloads in 2 seconds for instant training & testing',
      size: 'COCO128 Lite: 6.8 MB (128 annotated scenes) · Full COCO val2017: 780 MB (5,000 images)',
      license: 'CC BY 4.0 (COCO Consortium)',
      downloadTime: '2 seconds for COCO128; 45 seconds for val2017 on Colab',
      liteSubsetNote: 'Start with COCO128 (6.8 MB) to verify your IoU/NMS code and pipeline in under 2 minutes.',
      sampleColumnsOrShape: 'Normalized YOLO labels: [class_id, x_center, y_center, width, height] in [0.0, 1.0]'
    },
    milestones: [
      {
        number: 1,
        title: 'From-Scratch IoU & NMS Verification',
        expectedOutput: 'Custom numpy_iou and numpy_nms functions match torchvision.ops.nms exactly on 50 test boxes.'
      },
      {
        number: 2,
        title: 'Detector Fine-Tuning & mAP Evaluation',
        expectedOutput: 'Per-class mAP@0.5 and Precision-Confidence curves for bicycle, motorcycle, car, and bus classes.'
      },
      {
        number: 3,
        title: 'Gate Line Crossing Counter',
        expectedOutput: 'Annotated output clip / frame sequence with live vehicle counts and FPS latency benchmark.'
      }
    ],
    rubricQuestions: [
      'What happens to duplicate detections of the same bike when you set the NMS IoU threshold too high (0.9) vs too low (0.2)?',
      'Why does mAP@0.5:0.95 penalize sloppy bounding box edges much more heavily than mAP@0.5?',
      'Why can standard IoU have zero gradient when two boxes do not overlap at all, and how does GIoU/CIoU fix that?'
    ],
    resumeBulletTemplate:
      'Implemented vectorized IoU and Non-Maximum Suppression from scratch and fine-tuned a real-time YOLO vehicle detector achieving [__] mAP@0.5 at [__] FPS for automated gate traffic counting.',
    stretchGoals: [
      'Add simple IoU-based multi-frame centroid tracking (SORT style) so a stopped bike at the gate is not double-counted'
    ]
  },

  // =========================================================================
  // TRACK 5 PROJECTS
  // =========================================================================
  {
    slug: 'lstm-food-review-sentiment',
    trackNumber: 5,
    trackTitle: 'Sequence Models',
    title: 'LSTM Sentiment Classifier vs Bag-of-Words Baseline',
    funTitle: 'Is this food review angry or happy?',
    difficulty: 'Intermediate',
    problemStatement:
      'Build a sequence sentiment classifier that learns word embeddings and processes reviews through a Recurrent Neural Network and an LSTM, comparing where recurrent gating beats a classic TF-IDF + Logistic Regression baseline (especially on negations like "not bad at all").',
    learningGoals: [
      'Build a vocabulary tokenizer with <PAD> and <UNK> tokens and batch variable-length reviews',
      'Compare a vanilla RNN against a gated LSTM across review lengths (short vs 300+ words)',
      'Inspect learned word embeddings using nearest-neighbor cosine similarity',
      'Test negation and sarcasm contrast sets where bag-of-words fails'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'IMDB Review Sentiment (Hugging Face) & Sentiment140 (Kaggle)',
      url: 'https://huggingface.co/datasets/stanfordnlp/imdb',
      secondaryUrl: 'https://www.kaggle.com/datasets/kazanova/sentiment140',
      secondaryName: 'Sentiment140 (Kaggle)',
      loaderSnippet: 'from datasets import load_dataset\nds = load_dataset("stanfordnlp/imdb")',
      size: 'IMDB: 80 MB (50,000 reviews) · Lite subset: 5,000 balanced reviews (8 MB)',
      license: 'Apache 2.0 / Academic Research License (Maas et al.)',
      downloadTime: '5 seconds via Hugging Face datasets',
      liteSubsetNote: 'Use a 5,000-review stratified subset with max_len=200 to train in < 90 seconds on Colab.',
      sampleColumnsOrShape: 'text: string review, label: {0: negative, 1: positive}'
    },
    milestones: [
      {
        number: 1,
        title: 'TF-IDF Baseline & Negation Stress Test',
        expectedOutput: 'Baseline accuracy on test set plus a 10-sentence negation test set ("The biryani was not bad, actually great").'
      },
      {
        number: 2,
        title: 'Vanilla RNN vs LSTM Gradient & Length Comparison',
        expectedOutput: 'Plot of gradient norm and accuracy on long (>250 word) reviews showing vanilla RNN degradation vs LSTM stability.'
      },
      {
        number: 3,
        title: 'Embedding Nearest-Neighbor Explorer',
        expectedOutput: 'Table of top-5 cosine neighbors for words like "delicious", "stale", "spicy", and "overpriced".'
      }
    ],
    rubricQuestions: [
      'Why did feeding zero-padded sequences into the vanilla RNN without packing/masking corrupt the final hidden state h_T?',
      'How does the LSTM forget gate f_t allow gradients to travel across 200 tokens without vanishing like (W_hh)^200?',
      'On what types of reviews did your TF-IDF baseline beat or tie the LSTM, and where did the LSTM win decisively?'
    ],
    resumeBulletTemplate:
      'Built a bidirectional LSTM sentiment analyzer with learned 128-D word embeddings on 50,000 reviews, achieving [__]% test accuracy and outperforming TF-IDF baselines by [__]% on multi-clause negation benchmarks.',
    stretchGoals: [
      'Plot per-word cell-state activation heatmaps across a review to watch sentiment flip after the word "however"'
    ]
  },
  {
    slug: 'character-level-author-generator',
    trackNumber: 5,
    trackTitle: 'Sequence Models',
    title: 'Character-Level Autoregressive Language Model',
    funTitle: 'Write like your favorite author',
    difficulty: 'Intermediate',
    problemStatement:
      'Train a character-level recurrent language model (inspired by Karpathy\'s char-rnn) that predicts the next character one step at a time and generates novel Shakespearean dialogue or classic literature with controllable temperature sampling.',
    learningGoals: [
      'Frame text generation as autoregressive next-token classification with Cross-Entropy loss',
      'Implement Truncated Backpropagation Through Time (TBPTT) and gradient norm clipping',
      'Implement temperature-scaled Softmax sampling and Top-k filtering from scratch',
      'Observe how validation bits-per-character (BPC) and generated structure evolve from random gibberish to words to valid dialogue'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Tiny Shakespeare (1 MB) & Project Gutenberg Classics',
      url: 'https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt',
      secondaryUrl: 'https://www.gutenberg.org',
      secondaryName: 'Project Gutenberg Public Domain Books',
      loaderSnippet: 'import urllib.request\ntext = urllib.request.urlopen("https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt").read().decode("utf-8")',
      size: '1.1 MB (1,115,394 characters, 65 unique characters)',
      license: 'Public Domain',
      downloadTime: '< 1 second',
      liteSubsetNote: '1.1 MB plain text file downloads in 1 second and trains in 2 minutes.',
      sampleColumnsOrShape: '1,115,394 characters; vocabulary size |V| = 65; sliding windows of length T = 128'
    },
    milestones: [
      {
        number: 1,
        title: 'Character Vocabulary & Sliding Window Loader',
        expectedOutput: 'Encode/decode functions and batch loader where target y is input x shifted right by 1 character.'
      },
      {
        number: 2,
        title: 'LSTM/GRU Training with Gradient Clipping',
        expectedOutput: 'Validation loss drops below 1.48 nats/char; generation checkpoints saved at steps 100, 1000, and 3000.'
      },
      {
        number: 3,
        title: 'Temperature τ ∈ {0.3, 0.8, 1.5} Sampling Comparison',
        expectedOutput: 'Generated samples at low, medium, and high temperatures illustrating repetition vs creativity vs chaos.'
      }
    ],
    rubricQuestions: [
      'Mathematically, why does dividing logits by temperature τ → 0 turn Softmax sampling into greedy argmax, while τ → ∞ approaches a uniform distribution?',
      'What happened to your training loss when you removed gradient norm clipping on long sequence windows?',
      'Did any single hidden unit in your LSTM learn to track line lengths, quotation marks, or speaker names?'
    ],
    resumeBulletTemplate:
      'Trained an autoregressive character-level GRU/LSTM language model on 1.1M characters of literature, reaching [__] validation perplexity and implementing temperature and top-k decoding from scratch.',
    stretchGoals: [
      'Visualize the activation of individual hidden neurons overlaid on text color-coded from blue (-1) to red (+1)'
    ]
  },

  // =========================================================================
  // TRACK 6 PROJECTS
  // =========================================================================
  {
    slug: 'tiny-chatgpt-from-scratch',
    trackNumber: 6,
    trackTitle: 'Attention and Transformers',
    title: 'Decoder-Only Mini-GPT Transformer from Scratch',
    funTitle: 'Build your own tiny ChatGPT',
    difficulty: 'Advanced',
    problemStatement:
      'Build a complete Decoder-Only Transformer (Causal Masked Multi-Head Self-Attention, Positional Embeddings, Pre-LayerNorm, Residual Highways, and GELU Feed-Forward blocks) from scratch and train it to generate coherent stories.',
    learningGoals: [
      'Implement Scaled Dot-Product Attention with an upper-triangular -∞ causal look-ahead mask',
      'Reshape tensors cleanly for Multi-Head Attention (B, T, C) → (B, h, T, d_k) and concatenate head outputs',
      'Combine Pre-LayerNorm, residual connections, and linear warmup + cosine learning rate decay',
      'Visualize attention head heatmaps to see induction heads and previous-token heads emerge'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Tiny Shakespeare (1 MB) & TinyStories (Hugging Face)',
      url: 'https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt',
      secondaryUrl: 'https://huggingface.co/datasets/roneneldan/TinyStories',
      secondaryName: 'TinyStories Dataset (Hugging Face)',
      loaderSnippet: 'from datasets import load_dataset\nds = load_dataset("roneneldan/TinyStories", split="train[:20000]")',
      size: 'Tiny Shakespeare: 1.1 MB · TinyStories 20k Lite slice: 18 MB',
      license: 'Public Domain / CDLA-Sharing-1.0',
      downloadTime: '1–5 seconds',
      liteSubsetNote: 'Use Tiny Shakespeare (1.1 MB) or the first 20,000 stories of TinyStories for a 5-minute Colab GPU run.',
      sampleColumnsOrShape: 'Tokenized sequences of context length T = 256, model dimension d_model = 192, heads h = 6, layers L = 4'
    },
    milestones: [
      {
        number: 1,
        title: 'Causal Masked Multi-Head Attention Unit Test',
        expectedOutput: 'Unit test proving that changing future token x_{t+1} has strictly 0.0 effect on output representation at position ≤ t.'
      },
      {
        number: 2,
        title: '4-Layer Pre-LN Transformer Training',
        expectedOutput: 'Parameter count matches analytical formula; validation loss beats the Track 5 LSTM at the same parameter budget.'
      },
      {
        number: 3,
        title: 'Attention Heatmap Inspection & Story Generation',
        expectedOutput: 'Plot of 6 attention heads on a sample sentence plus 3 generated story completions.'
      }
    ],
    rubricQuestions: [
      'Why must the causal mask set future positions to -∞ BEFORE Softmax rather than zeroing weights AFTER Softmax?',
      'Why does dividing QKᵀ by √d_k prevent Softmax gradients from vanishing when d_k is large?',
      'What happened when you switched your 4-layer Transformer from Pre-LN to Post-LN without learning rate warmup?'
    ],
    resumeBulletTemplate:
      'Implemented a [__]M-parameter Decoder-Only GPT Transformer from scratch (causal multi-head self-attention, Pre-LayerNorm, cosine warmup schedule), achieving [__] validation loss and outperforming an equivalent LSTM by [__]%.',
    stretchGoals: [
      'Implement KV-Caching during autoregressive decoding and benchmark tokens/sec speedup for 256-token generations'
    ]
  },
  {
    slug: 'vision-transformer-vs-cnn',
    trackNumber: 6,
    trackTitle: 'Attention and Transformers',
    title: 'Vision Transformer (ViT) vs ResNet on CIFAR-10',
    funTitle: 'Vision Transformer vs CNN',
    difficulty: 'Intermediate',
    problemStatement:
      'Implement a Vision Transformer that slices 32×32 CIFAR-10 images into 4×4 patches, adds learnable 1D positional embeddings and a [CLS] token, and compare its inductive bias, data-hunger, and attention maps against a ResNet baseline.',
    learningGoals: [
      'Convert an image tensor (B, C, H, W) into a sequence of N = (HW)/P² flattened patch embeddings',
      'Prepend a learnable [CLS] token and add 1D positional embeddings before Transformer encoder blocks',
      'Compare sample efficiency (training on 20% vs 100% of CIFAR-10) between ViT and CNNs',
      'Visualize [CLS]-to-patch attention maps overlaid on test images'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'CIFAR-10 Object Recognition Benchmark (Toronto / torchvision)',
      url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
      loaderSnippet: 'import torchvision.datasets as dsets\ntrain_set = dsets.CIFAR10(root="./data", train=True, download=True)',
      size: '170 MB (50,000 train + 10,000 test 32×32 RGB images across 10 classes)',
      license: 'MIT / Public Academic Benchmark (Krizhevsky)',
      downloadTime: '10 seconds via torchvision',
      liteSubsetNote: 'Use a 10,000-image stratified subset for quick ablation runs.',
      sampleColumnsOrShape: '(50000, 3, 32, 32) RGB images -> 64 patches of size 4×4×3 (48 dims per patch)'
    },
    milestones: [
      {
        number: 1,
        title: 'Patchify & Positional Embedding Layer',
        expectedOutput: '32×32×3 image cleanly maps to (64 + 1, d_model) token sequence with verified shapes.'
      },
      {
        number: 2,
        title: 'Data-Efficiency Ablation (20% vs 100% Data)',
        expectedOutput: 'Table showing CNN winning in the low-data regime due to spatial inductive bias, and ViT closing the gap with augmentation.'
      },
      {
        number: 3,
        title: '[CLS] Attention Map Visualization',
        expectedOutput: '8×8 attention heatmaps from the final layer highlighting the foreground airplane, frog, or ship.'
      }
    ],
    rubricQuestions: [
      'If you double the image resolution from 32×32 to 64×64 while keeping patch size P=4 fixed, by what factor does the self-attention matrix QKᵀ grow?',
      'Why did the CNN beat the Vision Transformer when trained on only 5,000 images without heavy data augmentation?',
      'What happens to ViT test accuracy if you zero out the positional embeddings at inference time?'
    ],
    resumeBulletTemplate:
      'Implemented a Vision Transformer (ViT) from scratch and benchmarked against ResNet on 60,000 CIFAR-10 images, analyzing spatial inductive bias across data regimes and visualizing [CLS] token attention maps.',
    stretchGoals: [
      'Implement 2D sinusoidal positional encodings and compare against learned 1D positional embeddings'
    ]
  },

  // =========================================================================
  // TRACK 7 PROJECTS
  // =========================================================================
  {
    slug: 'vae-digit-generator',
    trackNumber: 7,
    trackTitle: 'Generative Models',
    title: 'Variational Autoencoder (VAE) with 2D Latent Space Explorer',
    funTitle: 'Digit generator with latent-space explorer (VAE)',
    difficulty: 'Intermediate',
    problemStatement:
      'Build both a deterministic Autoencoder and a probabilistic Variational Autoencoder (VAE) with a 2D latent space (z ∈ R²), implementing the reparameterization trick and ELBO loss to smoothly morph one digit or garment into another.',
    learningGoals: [
      'Implement the reparameterization trick z = μ + exp(0.5 · log σ²) ⊙ ε so gradients flow through stochastic sampling',
      'Balance Reconstruction Loss against the analytical KL Divergence penalty β · D_KL(q(z|x) || N(0, I))',
      'Compare the "Swiss-cheese" gaps in a standard Autoencoder latent space against the smooth Gaussian manifold of a VAE',
      'Render a 20×20 grid of decoded images across z₁, z₂ ∈ [-3, +3]'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'MNIST & Fashion-MNIST',
      url: 'https://github.com/zalandoresearch/fashion-mnist',
      secondaryUrl: 'https://www.openml.org/d/554',
      secondaryName: 'MNIST (OpenML)',
      loaderSnippet: 'import torchvision.datasets as dsets\nds = dsets.MNIST(root="./data", train=True, download=True)',
      size: '11 MB (MNIST) / 30 MB (Fashion-MNIST)',
      license: 'MIT / CC BY-SA 3.0',
      downloadTime: '5 seconds',
      liteSubsetNote: 'Trains to clean latent manifolds in < 90 seconds on CPU or 15 seconds on Colab GPU.',
      sampleColumnsOrShape: '(60000, 1, 28, 28) normalized to [0, 1] -> Encoder -> μ ∈ R², log σ² ∈ R² -> Decoder -> x̂ ∈ [0, 1]^{28×28}'
    },
    milestones: [
      {
        number: 1,
        title: 'Reparameterization & Analytical KL Loss',
        expectedOutput: 'Unit test verifying KL divergence equals 0.0 when μ = 0 and log_var = 0, and is strictly > 0 otherwise.'
      },
      {
        number: 2,
        title: '2D Latent Scatter Plot (AE vs VAE)',
        expectedOutput: 'Side-by-side color-coded scatter plots of 10 digit classes in R² for standard AE vs VAE.'
      },
      {
        number: 3,
        title: '20×20 Latent Manifold Grid & Linear Interpolation',
        expectedOutput: 'Continuous 20×20 image grid plus a 10-step latent interpolation morphing a "1" into an "8" into a "0".'
      }
    ],
    rubricQuestions: [
      'Why does sampling z = torch.normal(mu, sigma) directly break backpropagation, and how does z = mu + sigma * eps fix it?',
      'What happens to your generated digits and latent scatter plot when β in β-VAE is set to 0 vs 1 vs 20 (posterior collapse)?',
      'Why did decoding random points from the gaps between clusters in a standard Autoencoder produce garbled static?'
    ],
    resumeBulletTemplate:
      'Built a Variational Autoencoder (VAE) from scratch with the reparameterization trick and β-ELBO objective, mapping 60,000 images onto a continuous 2D Gaussian manifold for smooth latent interpolation.',
    stretchGoals: [
      'Upgrade the VAE to a Conditional VAE (cVAE) by concatenating a one-hot class label to both encoder and decoder inputs'
    ]
  },
  {
    slug: 'anime-gan-or-tiny-diffusion',
    trackNumber: 7,
    trackTitle: 'Generative Models',
    title: 'Tiny Denoising Diffusion (DDPM) or DCGAN Image Synthesizer',
    funTitle: 'Anime face GAN or tiny diffusion model',
    difficulty: 'Advanced',
    problemStatement:
      'Choose your generative path: either train a Deep Convolutional GAN (DCGAN) while documenting adversarial mode-collapse and discriminator dominance, OR build a Denoising Diffusion Probabilistic Model (DDPM) with a time-conditioned U-Net that denoises pure Gaussian static into images step by step.',
    learningGoals: [
      'For DDPM: implement the closed-form forward noise schedule x_t = √(ᾱ_t) x_0 + √(1 - ᾱ_t) ε and reverse Langevin sampling loop',
      'For GAN: balance Generator and Discriminator minimax updates with spectral norm / label smoothing',
      'Document training instabilities (mode collapse in GANs vs slow sampling steps in Diffusion)',
      'Track sample quality progression across training epochs'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'CIFAR-10, CelebA, or Anime Face Dataset',
      url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
      secondaryUrl: 'https://www.kaggle.com/datasets/splcher/animefacedataset',
      secondaryName: 'Anime Face Dataset (Kaggle)',
      loaderSnippet: '# Start with MNIST/Fashion-MNIST or CIFAR-10 Single-Class (e.g. Horses/Cars, 5,000 images) for 5-min training',
      size: 'Single-class CIFAR-10 Lite: 17 MB (5,000 32×32 images) · Anime Faces: 390 MB (63,000 64×64 images)',
      license: 'MIT / Public Research Dataset',
      downloadTime: '5–20 seconds on Colab',
      liteSubsetNote: 'Use Fashion-MNIST or a single CIFAR-10 class (5,000 32×32 images) so DDPM/DCGAN converges in < 8 minutes on a free Colab T4.',
      sampleColumnsOrShape: 'Images scaled to [-1.0, +1.0]; Diffusion steps T = 300; U-Net with sinusoidal time embeddings'
    },
    milestones: [
      {
        number: 1,
        title: 'Forward Corruption Schedule / Adversarial Loss Setup',
        expectedOutput: 'Visual strip showing a clean image progressively corrupted at t ∈ {0, 50, 100, 200, 300} (or D/G loss curves).'
      },
      {
        number: 2,
        title: 'Reverse Denoising / Generator Training',
        expectedOutput: '64-image generated sample grid showing recognizable shapes emerging from pure N(0, I) noise.'
      },
      {
        number: 3,
        title: 'Stability & Failure-Mode Engineering Report',
        expectedOutput: 'Documented experiment intentionally triggering and fixing a stability failure (e.g. GAN mode collapse or broken noise schedule).'
      }
    ],
    rubricQuestions: [
      'In DDPM, how does the closed-form property of Gaussians let us jump directly from x_0 to x_t in one step during training instead of running a 300-step loop?',
      'Why does predicting the noise ε_θ(x_t, t) work much better than forcing the U-Net to directly predict the clean image x_0 at high noise levels?',
      'If you trained a GAN and the Discriminator loss dropped to 0.0001 in epoch 2, what happened to the Generator\'s gradients?'
    ],
    resumeBulletTemplate:
      'Implemented a [DDPM Denoising Diffusion U-Net / DCGAN] from scratch with sinusoidal timestep embeddings and linear β-schedules, generating diverse synthetic images and documenting stability trade-offs.',
    stretchGoals: [
      'Implement DDIM deterministic sampling to cut reverse generation from 300 steps down to 30 steps'
    ]
  },

  // =========================================================================
  // TRACK 8 PROJECTS
  // =========================================================================
  {
    slug: 'chat-with-syllabus-rag',
    trackNumber: 8,
    trackTitle: 'Modern LLM Practice',
    title: 'Retrieval-Augmented Generation (RAG) over Course Notes with Eval Suite',
    funTitle: 'Chat with your own syllabus and notes',
    difficulty: 'Intermediate',
    problemStatement:
      'Build a transparent, zero-framework-magic RAG pipeline in Python (chunking with overlap, dense vector embedding, cosine similarity top-k retrieval, and grounded prompt construction with inline citations) and evaluate it quantitatively on a 25-question test set.',
    learningGoals: [
      'Compare fixed-character chunking against paragraph/heading-aware chunking with overlap',
      'Implement exact cosine-similarity vector search in NumPy and measure Recall@k and Mean Reciprocal Rank (MRR)',
      'Construct strict system prompts that enforce "[Source #]" citations and refuse out-of-context questions',
      'Measure hallucination reduction compared to prompting the base LLM without retrieval'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Your Own Course PDFs / Markdown Notes + SQuAD Retrieval Benchmark',
      url: 'https://rajpurkar.github.io/SQuAD-explorer/',
      loaderSnippet: '# Load 500 passages from SQuAD v2 or upload your own syllabus PDFs/Markdown notes',
      size: 'SQuAD dev slice: 4.5 MB · Custom notes: < 2 MB',
      license: 'CC BY-SA 4.0 (Stanford SQuAD)',
      downloadTime: '< 3 seconds',
      liteSubsetNote: '200 passages (or 3 lecture PDFs) embed in < 10 seconds on CPU using a 384-D sentence embedding model.',
      sampleColumnsOrShape: 'Chunks: (N_chunks, 384) L2-normalized float32 embeddings + metadata {doc_id, page, text}'
    },
    milestones: [
      {
        number: 1,
        title: 'Chunking & Vector Index in Pure NumPy',
        expectedOutput: 'Cosine similarity search matrix returning top-k chunks with similarity scores in < 5 ms.'
      },
      {
        number: 2,
        title: 'Retrieval Evaluation (Recall@3 & MRR)',
        expectedOutput: 'Benchmark table comparing chunk_size ∈ {128, 384, 1024} and overlap ∈ {0, 64} on 25 ground-truth questions.'
      },
      {
        number: 3,
        title: 'Cited Answer Generation & Unanswerable Refusal Test',
        expectedOutput: 'Side-by-side table showing base LLM vs RAG answers, plus 5 trick questions not in the notes where RAG cleanly abstains.'
      }
    ],
    rubricQuestions: [
      'What failed when your chunk size was too small (e.g. 50 characters) vs too large (e.g. 3,000 characters)?',
      'Why does L2-normalizing every embedding vector reduce cosine similarity search to a single matrix multiplication Q · Dᵀ?',
      'Give one example from your evaluation set where top-3 dense retrieval fetched a misleading chunk, and explain how hybrid BM25 + dense search helps.'
    ],
    resumeBulletTemplate:
      'Built a Retrieval-Augmented Generation (RAG) system over [__] technical documents with a 25-question evaluation harness, improving Recall@3 from [__]% to [__]% via overlap-tuned chunking and grounded citation prompting.',
    stretchGoals: [
      'Add Reciprocal Rank Fusion (RRF) combining keyword BM25 scores with dense cosine similarity'
    ]
  },
  {
    slug: 'lora-finetuning-open-llm',
    trackNumber: 8,
    trackTitle: 'Modern LLM Practice',
    title: 'Parameter-Efficient LoRA Fine-Tuning of an Open LLM',
    funTitle: 'LoRA fine-tuning on a small open model',
    difficulty: 'Advanced',
    problemStatement:
      'Implement a custom LoRALinear layer W = W₀ + (α/r) B·A from scratch to verify parameter savings and zero-overhead weight merging, then fine-tune a small open instruction model with LoRA on a domain dataset and evaluate before-vs-after outputs.',
    learningGoals: [
      'Implement a drop-in PyTorch LoRALinear wrapper with frozen W₀, Gaussian-initialized A, and zero-initialized B',
      'Verify mathematically that merging W_merged = W₀ + (α/r) B·A produces identical logits with zero extra inference FLOPs',
      'Fine-tune an open model (e.g. Qwen-0.5B / SmolLM-360M / TinyLlama) across ranks r ∈ {4, 16, 64}',
      'Measure trainable parameter percentage (< 1%), GPU VRAM footprint, and held-out validation perplexity'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Databricks Dolly-15k & Stanford Alpaca Instruction Datasets',
      url: 'https://huggingface.co/datasets/databricks/databricks-dolly-15k',
      secondaryUrl: 'https://huggingface.co/datasets/tatsu-lab/alpaca',
      secondaryName: 'Stanford Alpaca (Hugging Face)',
      loaderSnippet: 'from datasets import load_dataset\nds = load_dataset("databricks/databricks-dolly-15k", split="train[:1500]")',
      size: 'Dolly-15k: 13 MB (15,011 instruction-response pairs) · Lite slice: 1,500 examples (1.3 MB)',
      license: 'CC BY-SA 3.0 (Databricks)',
      downloadTime: '< 3 seconds',
      liteSubsetNote: 'Use 1,500 examples on a 360M–500M model so fine-tuning finishes in 4 minutes on a free Colab T4 GPU.',
      sampleColumnsOrShape: '{instruction: string, context: string, response: string, category: string}'
    },
    milestones: [
      {
        number: 1,
        title: 'From-Scratch LoRALinear & Weight-Merge Unit Test',
        expectedOutput: 'Unit test proving ΔW = 0 at initialization and max(|unmerged(x) - merged(x)|) < 1e-6 after training.'
      },
      {
        number: 2,
        title: 'Rank Ablation Table (r = 4 vs 16 vs 64)',
        expectedOutput: 'Table reporting trainable parameters, % of base model, VRAM used, and validation loss for each rank.'
      },
      {
        number: 3,
        title: 'Before vs After Blind Evaluation on 15 Held-Out Prompts',
        expectedOutput: 'Side-by-side comparison of Base Model vs LoRA Fine-Tuned responses on 15 unseen test instructions.'
      }
    ],
    rubricQuestions: [
      'Why do we initialize matrix A with random Gaussian noise and matrix B with exact zeros instead of initializing both A and B to zero or both to random noise?',
      'What is the purpose of the scaling factor α/r in LoRA when you change the rank r from 8 to 32?',
      'Why must cross-entropy loss be masked (ignore_index = -100) on the user prompt tokens during instruction fine-tuning?'
    ],
    resumeBulletTemplate:
      'Implemented Low-Rank Adaptation (LoRA) from scratch and fine-tuned a [__]-parameter LLM on [__]k instruction pairs, updating only [__]% of weights while reducing domain validation perplexity by [__]%.',
    stretchGoals: [
      'Compare applying LoRA only to (W_Q, W_V) vs applying it to all attention and MLP projections at the same total parameter budget'
    ]
  },

  // =========================================================================
  // 3 CAPSTONE PROJECTS (Section 7)
  // =========================================================================
  {
    slug: 'capstone-solve-own-life-problem',
    trackNumber: 10,
    trackTitle: 'Capstone Projects',
    title: 'Capstone 1: End-to-End ML Product ("Solve a Problem in Your Own Life")',
    funTitle: 'Solve a problem in your own life',
    difficulty: 'Advanced',
    isCapstone: true,
    problemStatement:
      'Identify a real problem from campus, hostel, commute, sports, or public civic data; curate a leak-free dataset; train and benchmark a classical baseline against a deep learning model; deploy a live interactive demo or API; and write a rigorous engineering report.',
    learningGoals: [
      'Scope an ambiguous real-world problem into a measurable ML objective and business/user metric',
      'Execute a leak-free Track 9 data pipeline and compare a simple baseline against a deep architecture',
      'Ship a reproducible GitHub repository with automated tests, a live Gradio/FastAPI demo, and a failure-mode audit'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'Open Public Datasets (Kaggle, Hugging Face, UCI, or Open Government Data India)',
      url: 'https://huggingface.co/datasets',
      secondaryUrl: 'https://www.kaggle.com/datasets',
      secondaryName: 'Kaggle Datasets',
      loaderSnippet: '# Document dataset provenance, license, and zero-leakage split in your README.md',
      size: 'User-selected (must include a < 50 MB reproducible sample slice)',
      license: 'Must verify and cite open license in project repository',
      downloadTime: 'Varies by dataset',
      liteSubsetNote: 'Include a 1,000-row or 500-image lite sample script so reviewers can verify your pipeline in < 3 minutes.',
      sampleColumnsOrShape: 'Defined by student problem specification'
    },
    milestones: [
      {
        number: 1,
        title: 'Problem Spec, Dataset Audit & Classical Baseline',
        expectedOutput: 'README defining the metric, data license, leakage prevention, and baseline benchmark.'
      },
      {
        number: 2,
        title: 'Deep Model Training, Ablation & Error Analysis',
        expectedOutput: 'Ablation table across at least 3 architectural/hyperparameter choices plus analysis of 10 worst errors.'
      },
      {
        number: 3,
        title: 'Live Deployment & Technical Report',
        expectedOutput: 'Public GitHub repo + working Colab/Space demo + 2-page engineering writeup.'
      }
    ],
    rubricQuestions: [
      'What was your simplest non-deep-learning baseline, and did the deep learning model justify its extra complexity and latency?',
      'How did you guarantee zero data leakage between your training data and your evaluation split?',
      'What is the single biggest failure mode of your deployed model on edge-case inputs?'
    ],
    resumeBulletTemplate:
      'Designed, trained, and deployed an end-to-end [__] system on [__] samples, outperforming classical baselines by [__]% on [metric] and serving real-time predictions at [__] ms latency.',
    stretchGoals: [
      'Add input drift monitoring and an automated pytest suite running in GitHub Actions'
    ]
  },
  {
    slug: 'capstone-paper-reproduction',
    trackNumber: 10,
    trackTitle: 'Capstone Projects',
    title: 'Capstone 2: Landmark Paper Reproduction & Ablation Study',
    funTitle: 'Paper Reproduction',
    difficulty: 'Advanced',
    isCapstone: true,
    problemStatement:
      'Reproduce the core architectural mechanism and main empirical finding of a landmark deep learning paper (e.g. ResNet, Attention Is All You Need, LoRA, DDPM, or BatchNorm) at a compute-friendly scale, and document where reality diverged from the paper.',
    learningGoals: [
      'Translate mathematical equations and architectural diagrams from a primary research paper into clean, tested code',
      'Design a compute-scaled experiment that isolates the paper\'s key claim against a control baseline',
      'Document undocumented hyperparameter sensitivities and reproduction gaps honestly'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'CIFAR-10, Fashion-MNIST, or Tiny Shakespeare (Compute-Scaled Benchmark)',
      url: 'https://www.cs.toronto.edu/~kriz/cifar.html',
      secondaryUrl: 'https://github.com/zalandoresearch/fashion-mnist',
      secondaryName: 'Fashion-MNIST',
      loaderSnippet: '# Use CIFAR-10 or Tiny Shakespeare for single-GPU reproducible ablations',
      size: '1.1 MB – 170 MB',
      license: 'Open Academic Benchmarks',
      downloadTime: '< 10 seconds',
      liteSubsetNote: 'Scale depth/width so the control and treatment runs both finish within 15 minutes on Colab.',
      sampleColumnsOrShape: 'Standard benchmark splits matching the paper\'s experimental setup'
    },
    milestones: [
      {
        number: 1,
        title: 'Core Mechanism Unit Tests',
        expectedOutput: 'Automated tests verifying tensor shapes, forward invariants, and backward gradient flow of the paper\'s module.'
      },
      {
        number: 2,
        title: 'Control vs Treatment Reproduction Plot',
        expectedOutput: 'Plot replicating the paper\'s central figure (e.g. ResNet 20 vs 56 plain vs skip-connected training curves).'
      },
      {
        number: 3,
        title: 'Reproduction Report & Hyperparameter Gap Analysis',
        expectedOutput: 'Written report detailing matched results, discrepancies, and one new ablation not in the original paper.'
      }
    ],
    rubricQuestions: [
      'Which implementation detail was omitted or ambiguous in the original paper, and how did you resolve it?',
      'Which single hyperparameter had the largest impact on reproducing the authors\' main claim?',
      'In your custom ablation, under what condition did the paper\'s proposed method fail or lose its advantage?'
    ],
    resumeBulletTemplate:
      'Reproduced the core architecture and ablation experiments of [Paper Name] in PyTorch, validating [key claim] within [__]% of reported benchmarks and publishing an open-source reproduction report.',
    stretchGoals: [
      'Test the paper\'s technique on a second modality (e.g. applying Vision patches to audio spectrograms)'
    ]
  },
  {
    slug: 'capstone-open-source-contribution',
    trackNumber: 10,
    trackTitle: 'Capstone Projects',
    title: 'Capstone 3: Open-Source Interactive Visualizer & Math Engine',
    funTitle: 'Open-Source Contribution',
    difficulty: 'Intermediate',
    isCapstone: true,
    problemStatement:
      'Design and build a brand-new interactive deep learning visualizer and pure TypeScript analytical math module for NeuroPlay, complete with Vitest unit tests, finite-difference derivative checks, an everyday scene, and a Quick Check quiz.',
    learningGoals: [
      'Implement a zero-dependency TypeScript math module with exact analytical forward and backward equations',
      'Write comprehensive Vitest unit tests including edge cases and numerical gradient checks',
      'Build a responsive, keyboard-accessible React + SVG interactive visualizer with scene-relabeled controls'
    ],
    colabStarterUrl: 'https://colab.research.google.com/',
    dataset: {
      name: 'In-Browser Deterministic Synthetic Tensors (Zero External Dependencies)',
      url: 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.make_moons.html',
      loaderSnippet: '// Pure TypeScript math in lib/math/<topic>.ts verified by Vitest in tests/math/<topic>.test.ts',
      size: '0 KB external download',
      license: 'MIT Open Source',
      downloadTime: 'Instant (in-browser)',
      liteSubsetNote: 'Runs at 60 FPS in the browser on mobile and desktop.',
      sampleColumnsOrShape: 'Typed TypeScript interfaces with deterministic seeds'
    },
    milestones: [
      {
        number: 1,
        title: 'Pure Math Module & Vitest Suite',
        expectedOutput: 'lib/math/<topic>.ts passing 100% of analytical and finite-difference unit tests.'
      },
      {
        number: 2,
        title: 'Interactive Visualizer Component',
        expectedOutput: 'React component with SVG diagram, keyboard-accessible sliders, and zero horizontal overflow at 375px mobile width.'
      },
      {
        number: 3,
        title: 'Full Lesson Spec (Scene, Mapping, Math, Analogy Break, Quiz)',
        expectedOutput: 'Complete lesson passing npm test, npm run lint, npm run build, and Playwright E2E checks.'
      }
    ],
    rubricQuestions: [
      'How did you verify that every curve and number displayed in your SVG comes from an analytical formula rather than hardcoded coordinates?',
      'Where does your everyday scene analogy break down mathematically?',
      'How did you ensure your visualizer remains usable on a 375px mobile screen and via keyboard navigation?'
    ],
    resumeBulletTemplate:
      'Authored an open-source interactive deep learning visualizer and verified TypeScript calculus engine for [Topic], backed by automated finite-difference derivative tests and Playwright E2E accessibility checks.',
    stretchGoals: [
      'Add a "Load Worked Example" button that synchronizes the visualizer state with the step-by-step numerical trace'
    ]
  }
];

export function getProjectBySlug(slug: string): TrackProject | undefined {
  return TRACK_PROJECTS.find(p => p.slug === slug);
}

export function getProjectsByTrack(trackNumber: number): TrackProject[] {
  return TRACK_PROJECTS.filter(p => p.trackNumber === trackNumber);
}
