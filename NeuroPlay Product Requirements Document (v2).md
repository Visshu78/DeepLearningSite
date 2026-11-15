# NeuroPlay: Product Requirements Document (v2)

Version 2.1 · November 14, 2026 · Owner: Vishal · Site: deepgroundhub.vercel.app

Changes from v1: standalone email capture removed (signup opt-in instead); points and leaderboard added; project verification pipeline added; collaboration board added; community features moved to a new Phase 6. v2.1 adds Track 9 (Data Preparation and Feature Engineering) with 7 lessons and a project.

## 1. Overview

NeuroPlay is an interactive, visual-first deep learning platform for college students in CS, ML and AI. Today it has 16 lessons, a playground and a practice section, all free and without accounts. This PRD defines the next version: a restructured 57-lesson curriculum, hands-on projects with datasets, a fun daily-life teaching style, a paid tier with free previews, and community features (points, leaderboard, project collaboration).

**Product promise:** understand deep learning by seeing it work, with rigorous verified math, taught through scenes from everyday life, proven by projects you can put on your resume, and built alongside other learners.

## 2. Goals and Non-Goals

### Goals

- Reorganize existing content into a clear 10-track learning path with more models and topics.
- Make every lesson more interactive and tie it to a relatable daily-life scene.
- Add 1-2 projects per track plus 3 capstones, each with a dataset, starter notebook and resume bullet template.
- Introduce a paid tier (accounts, payments, gated content) with free preview lessons.
- Motivate learners with points, badges and an opt-in leaderboard based on completed lessons and verified projects.
- Let learners find teammates through a collaboration board for project ideas.
- Build a sustainable traffic engine (SEO, short demo clips).

### Non-Goals (v1 to v2)

- Mobile app, live classes, certificates, or a marketplace for other creators.
- Open discussion forum or in-platform chat or direct messaging (collaboration uses a request-to-join flow and external contact).
- Hosting or re-distributing third-party datasets (we link out only).
- A standalone email newsletter system (launch emails use the signup opt-in only).
- Medical, legal or financial advice of any kind.

## 3. Target Users

| User | Need | How NeuroPlay helps |
| --- | --- | --- |
| Undergrad CS/AI/ML student (primary) | Understand concepts for exams and interviews | Visual lessons, practice, scenes that stick |
| Placement and internship aspirant | Resume-worthy projects | Guided, verified projects with bullet templates |
| Self-learner / career switcher | Structured path from zero | Math toolkit to LLM practice track order |
| Builder looking for teammates | People to build a project with | Collaboration board with request-to-join |
| Educator (secondary) | Classroom demos | Interactive visualizers to show live |

## 4. Product Principles

1. **Correctness first.** All visuals come from analytical equations with tested derivatives. A wrong derivation costs more trust than any feature can earn.
2. **Scene first, math second.** Every lesson opens with a daily-life scene, then the rigorous math follows.
3. **Learn by doing.** Every lesson has something to drag, tweak or step through.
4. **Honest analogies.** Each lesson states where its analogy breaks.
5. **Indian context by default.** Chai, cricket, UPI, auto fares, exams, hostel life.
6. **Earned, not clicked.** Points come from passing checks and verified work, never from just opening pages.
7. **Safe by default.** Community features are opt-in and share no personal contact details without consent.

## 5. Lesson Template (applies to all 50 lessons)

1. **The Scene** (about 30 seconds): a daily-life situation the student recognizes.
2. **The Mapping**: a small table linking scene parts to model parts (for example, "friend's mood = bias").
3. **Play With It**: the interactive visualizer, with controls labeled in scene language next to the math symbol.
4. **The Math**: formulas, step-by-step arithmetic trace, derivatives.
5. **Where the Analogy Breaks**: one honest line on the scene's limits.
6. **Quick Check**: a situation-based question with instant explanatory feedback. Passing it awards the lesson's points.

Supporting elements per lesson: estimated time, prerequisites, a one-page cheat sheet (paid), and a link to the related project.

**Style rules:** a recurring mascot or cast is an open decision (Section 15). Humor lives in button labels, loading messages and quiz feedback, never in the math.

## 6. Content Map: 10 Tracks, 57 Lessons

Legend: ✅ exists today (to be restructured and made more interactive) · 🆕 new · **F** = proposed free preview lesson.

**Learning order:** Track 0, then Track 9 (Data Preparation), then Tracks 1 to 8. Track numbers are fixed identifiers for URLs and code; the site navigation shows the tracks in this learning order.

### Track 0: Math Toolkit

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 0.1 | Vectors, Matrices and Dot Products | 🆕 | F | A "taste match" score between you and a friend's playlist |
| 0.2 | Derivatives and Gradients | 🆕 |  | Feeling the slope of a hill under your feet |
| 0.3 | The Chain Rule | 🆕 |  | Converting rupees to dollars to euros, each step multiplies |
| 0.4 | Probability and Distributions | 🆕 |  | Predicting the chance of rain, expectation and variance |

### Track 9: Data Preparation and Feature Engineering

Learned right after Track 0 and before Track 1. Every later project depends on these skills.

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 9.1 | First Look at Data (types, summary stats, quick EDA) | 🆕 |  | Inspecting a fruit basket before making juice |
| 9.2 | Handling Missing Data | 🆕 | F | Blank answers on a form, and what to do with them |
| 9.3 | Outliers and Feature Scaling | 🆕 |  | One billionaire in a tea stall's customer list; comparing centimeters with kilometers |
| 9.4 | Encoding Categorical Features | 🆕 |  | Turning city names into numbers without implying Mumbai is "greater" than Delhi |
| 9.5 | Train/Validation/Test Split, Cross-Validation and Data Leakage | 🆕 |  | Seeing the exam paper beforehand |
| 9.6 | Imbalanced Data (SMOTE, class weights, right metrics) | 🆕 |  | Finding one thief among 10,000 visitors |
| 9.7 | Feature Engineering, Selection and Pipelines | 🆕 |  | Cooking a recipe in a repeatable order |

**Track 9 content notes (what the lessons must teach)**

**Missing data: what to do**

| Situation | Action |
| --- | --- |
| Very few rows missing (under about 5%) and missing at random | Drop the rows |
| Numeric column | Fill with the median (mean if there are no outliers) |
| Categorical column | Fill with the most frequent value, or a new "Unknown" category |
| Missingness itself carries meaning (for example, income left blank) | Fill, and add a "was missing" flag column |
| Important feature with a lot missing | KNN or iterative imputation |
| Using XGBoost, LightGBM or CatBoost | They handle missing values natively |
| A column is over about 60% empty | Usually drop it |

**Which encoder for what**

| Encoder | Use it when | Watch out for |
| --- | --- | --- |
| One-hot | Unordered categories with few values (payment mode, gender; under about 15 values) | Column count explodes with many categories |
| Ordinal | Categories with a real order (small, medium, large; education level) | Never use on unordered categories for linear models or neural nets |
| Label encoding | Target labels, or tree models with unordered categories | Implies a fake order for linear models |
| Frequency / count | High-cardinality columns, quick baseline | Different categories with the same count get the same number |
| Target (mean) encoding | High-cardinality columns (pincode, city, product ID) | Leaks the target unless done inside cross-validation, with smoothing |
| Binary / hashing | Very high cardinality with memory limits | Less interpretable; hash collisions |
| Learned embeddings | Neural nets with huge category sets (user ID, item ID) | Needs a lot of data |
| Native categorical (CatBoost, LightGBM) | You are using those libraries | Library-specific |

**Scaling and leakage rules**

- Standardization for linear models, SVMs, k-means, PCA and neural nets. Min-max for bounded inputs such as pixels. Robust scaling when outliers exist. Tree-based models do not need scaling.
- Fit every imputer, scaler and encoder on training data only, then apply it to validation and test data. Fitting on the full dataset leaks information.
- Target encoding must be computed inside cross-validation folds, with smoothing.

**Interactive requirements for Track 9**

- Missing-data lab: the student picks a strategy per column and watches model accuracy change.
- Encoding lab: one-hot makes the column count explode, while target encoding stays compact and shows a leakage warning.
- Leakage demo: the same model scored with and without leakage, so the inflated result is visible.
- Quick-check questions phrased as situations (for example, "Which encoder fits a pincode column?").

### Track 1: Classical ML

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 1.1 | Linear Regression | 🆕 | F | Predicting an auto fare from distance |
| 1.2 | Logistic Regression | 🆕 |  | "Will I bunk tomorrow's class?" as a probability |
| 1.3 | Bias-Variance and Evaluation Metrics | 🆕 |  | Memorizing past papers vs understanding concepts |
| 1.4 | Decision Trees and Random Forests | 🆕 |  | 20 questions, then asking 100 friends and taking the majority |
| 1.5 | k-Means and PCA | 🆕 |  | Seating wedding guests at tables; summarizing a story in 3 lines |

### Track 2: Neural Network Foundations

| f# | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 2.1 | The Artificial Neuron | ✅ | F | A friend deciding whether to join a plan: weather, distance, who is going |
| 2.2 | Activation Functions | ✅ |  | "Convinced enough to say yes?" threshold vs soft maybe |
| 2.3 | Forward Propagation | ✅ |  | A message passing through a company hierarchy |
| 2.4 | Loss Functions and Error Landscapes | ✅ |  | Marks lost in an exam, and what each wrong answer costs |
| 2.5 | Gradient Descent | ✅ |  | Walking downhill in thick fog |
| 2.6 | Backpropagation and the Chain Rule | ✅ |  | After a failed group project, working out who contributed how much to the failure |
| 2.7 | Universal Approximation and Network Depth | 🆕 |  | Many small ruler pieces approximating a curvy road |

### Track 3: Training Neural Networks Well

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 3.1 | Weight Initialization | 🆕 | F | Where runners start in a race |
| 3.2 | Batch and Layer Normalization | 🆕 |  | Grading on a curve when exams differ in difficulty |
| 3.3 | Overfitting, L2 and Dropout | ✅ |  | Random classmates absent each day so nobody relies on one topper |
| 3.4 | Momentum, RMSprop and Adam | ✅ |  | A rolling ball, then a ball with smart shoes |
| 3.5 | Learning Rate Schedules and Warmup | 🆕 |  | Parking a car: big steps first, tiny steps at the end |
| 3.6 | Reading Loss Curves and Debugging Training | 🆕 |  | A doctor reading a fever chart |

### Track 4: Computer Vision

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 4.1 | Kernels, Strides and Feature Maps | ✅ | F | An Instagram filter sliding across a photo |
| 4.2 | Pooling and Receptive Fields | ✅ |  | Thumbnail view; how much of a room a window shows |
| 4.3 | Full CNN Inference: Pixels to Predictions | ✅ |  | A bank machine reading a cheque |
| 4.4 | Backpropagation in CNNs | ✅ |  | Tracing which filter caused a mistake |
| 4.5 | From LeNet to VGG | 🆕 |  | Phones getting better each year |
| 4.6 | ResNet and Skip Connections | ✅ |  | A lift that skips floors when only a small change is needed |
| 4.7 | EfficientNet and Compound Scaling | ✅ |  | Balancing a cricket team: batters, bowlers, fielders |
| 4.8 | Transfer Learning | 🆕 |  | Hiring an experienced engineer and training them for your company |
| 4.9 | Object Detection (YOLO) | 🆕 |  | A CCTV guard who spots and labels everything in one glance |
| 4.10 | Image Segmentation (U-Net) | 🆕 |  | A coloring book where every pixel gets a color |

### Track 5: Sequence Models

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 5.1 | Embeddings and Word Vectors | 🆕 | F | Google Maps coordinates for words: chai sits near coffee |
| 5.2 | Recurrent Neural Networks | 🆕 |  | Reading a sentence word by word while keeping notes |
| 5.3 | BPTT and Vanishing Gradients | 🆕 |  | Chinese whispers: the message fades down the line |
| 5.4 | LSTM | 🆕 |  | A notebook with write, forget and read buttons |
| 5.5 | GRU and Seq2Seq | 🆕 |  | A translator who listens first, then speaks |

### Track 6: Attention and Transformers

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 6.1 | Self-Attention and Scaled Dot-Product | ✅ | F | In a noisy group chat, deciding whose message matters for your reply |
| 6.2 | Multi-Head Attention and the Transformer Block | ✅ |  | Five friends watching the same movie, each noticing different things |
| 6.3 | Positional Encoding | 🆕 |  | Seat numbers: same people, different order, different meaning |
| 6.4 | BERT vs GPT | 🆕 |  | Fill-in-the-blank vs keyboard autocomplete |
| 6.5 | Vision Transformer (ViT) | 🆕 |  | Cutting a photo into jigsaw pieces |

### Track 7: Generative Models

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 7.1 | Autoencoders | 🆕 | F | Packing a suitcase: what survives the squeeze? |
| 7.2 | Variational Autoencoders | 🆕 |  | A recipe card with a little randomness |
| 7.3 | GANs | 🆕 |  | A fake-note maker vs a bank officer, both improving |
| 7.4 | Diffusion Models | 🆕 |  | Restoring a smudged photo one cleanup step at a time |

### Track 8: Modern LLM Practice

| # | Lesson | Status | Free | Everyday scene |
| --- | --- | --- | --- | --- |
| 8.1 | Tokenization and LLM Pretraining | 🆕 | F | Lego bricks; SMS shorthand splitting words |
| 8.2 | Fine-Tuning and LoRA | 🆕 |  | Tuning a radio knob instead of rebuilding the radio |
| 8.3 | Retrieval-Augmented Generation (RAG) | 🆕 |  | An open-book exam: look it up before you answer |
| 8.4 | Reinforcement Learning Basics and RLHF | 🆕 |  | Training a dog with treats; rating a delivery partner |

**Totals:** 57 lessons, 16 existing (to restructure) and 41 new. Proposed free previews: 10 (one per track). The alternative of only 1-2 free lessons is an open decision.

## 7. Hands-On Projects

Each track has 1-2 projects, plus 3 capstones. Difficulty: Beginner, Intermediate, Advanced.

| Track | Project (fun title) | Difficulty | Dataset (link out, do not re-host) | Resume bullet theme |
| --- | --- | --- | --- | --- |
| 0 | Autodiff Engine from Scratch | Beginner | None; test with sklearn make\_moons | Built a reverse-mode autodiff engine; verified against PyTorch |
| 1 | "What should my rent be?" (house price predictor) | Beginner | California Housing via sklearn fetch\_california\_housing; Ames: https://www.kaggle.com/c/house-prices-advanced-regression-techniques | Regression from scratch, RMSE close to scikit-learn |
| 1 | "Will this customer ditch their plan?" (churn) | Intermediate | https://www.kaggle.com/datasets/blastchar/telco-customer-churn | Churn models with precision/recall/ROC report |
| 2 | "Be the cheque scanner" (MNIST in pure NumPy) | Intermediate | MNIST via torchvision or tf.keras; https://www.openml.org/d/554 | Neural net from scratch reaching 97%+ on MNIST |
| 3 | Training Debugging Lab (5 broken runs) | Intermediate | MNIST or Fashion-MNIST: https://github.com/zalandoresearch/fashion-mnist | Diagnosed and fixed training instabilities |
| 3 | Optimizer Benchmark | Intermediate | Fashion-MNIST (link above) | Benchmarked SGD, Momentum, RMSprop, Adam |
| 4 | "Crop doctor for farmers" (plant disease, ResNet and Grad-CAM) | Intermediate | https://www.kaggle.com/datasets/emmarex/plantdisease | Fine-tuned ResNet with Grad-CAM explainability |
| 4 | Chest X-ray classifier (learning only, not diagnosis) | Intermediate | https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia | Transfer learning on medical images, with limits stated |
| 4 | "Count the bikes at your college gate" (YOLO) | Advanced | COCO https://cocodataset.org or custom set from https://universe.roboflow.com | Real-time detector trained on a custom dataset |
| 5 | "Is this food review angry or happy?" (LSTM) | Intermediate | IMDB https://ai.stanford.edu/\~amaas/data/sentiment/ or Sentiment140 https://www.kaggle.com/datasets/kazanova/sentiment140 | LSTM sentiment model vs baseline |
| 5 | "Write like your favorite author" (char-level generator) | Intermediate | Tiny Shakespeare https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt or https://www.gutenberg.org | Character-level text generator |
| 6 | "Build your own tiny ChatGPT" (mini-GPT) | Advanced | Tiny Shakespeare (link above) or TinyStories https://huggingface.co/datasets/roneneldan/TinyStories | Decoder-only Transformer implemented from scratch |
| 6 | Vision Transformer vs CNN | Intermediate | CIFAR-10 https://www.cs.toronto.edu/\~kriz/cifar.html | Compared ViT and CNN on CIFAR-10 |
| 7 | Digit generator with latent-space explorer (VAE) | Intermediate | MNIST or Fashion-MNIST | VAE with interactive latent exploration |
| 7 | Anime face GAN or tiny diffusion model | Advanced | CelebA https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html, anime faces https://www.kaggle.com/datasets/splcher/animefacedataset, or CIFAR-10 | Trained a generative model; documented stability issues |
| 8 | "Chat with your own syllabus and notes" (RAG) | Intermediate | Student's own PDFs; SQuAD for retrieval eval https://rajpurkar.github.io/SQuAD-explorer/ | RAG system with a hand-built evaluation set |
| 8 | LoRA fine-tuning on a small open model | Advanced | https://huggingface.co/datasets/databricks/databricks-dolly-15k or https://huggingface.co/datasets/tatsu-lab/alpaca | Fine-tuned an LLM; compared before vs after |
| 9 | "Clean the messy dataset" (full preprocessing pipeline: missing data, encoding, scaling, no leakage) | Intermediate | Titanic https://www.kaggle.com/c/titanic and Telco Churn https://www.kaggle.com/datasets/blastchar/telco-customer-churn (the churn project in Track 1 reuses this pipeline) | Built a reusable preprocessing pipeline (imputation, encoding, scaling) and measured its effect on model accuracy without data leakage |

### Capstones

1. **"Solve a problem in your own life":** end-to-end ML product with training, API, deployment and short report (Advanced). Datasets from https://www.kaggle.com/datasets, https://huggingface.co/datasets, https://archive.ics.uci.edu or https://data.gov.in.
2. **Paper Reproduction:** reproduce the main result of a well-known paper and document gaps (Advanced).
3. **Open-Source Contribution:** contribute a new lesson or visualizer to NeuroPlay (Intermediate).

### Project package (every project ships with)

1. Problem statement and learning goals
2. Starter notebook on Colab (no local setup)
3. Dataset block: link, size, license, download time, sample preview, and a "lite" subset for heavy datasets
4. 3-5 milestones with expected outputs (these feed the automatic checks in Section 9)
5. Rubric, including "explain why you chose X" interview-style questions
6. Resume bullet template with blanks for the student's own numbers
7. Stretch goals

### Dataset rules

- Link out only; never re-host. Respect each dataset's license and login requirements.
- Prefer library loaders (torchvision, sklearn, Hugging Face datasets) where possible.
- All links must be verified before launch and re-checked monthly by an automated script.
- The chest X-ray project must show a prominent "for learning only, not for diagnosis" notice.
- Rent, food review and vehicle-count style projects need datasets selected and checked for license and quality before they are advertised.

## 8. Points, Badges and Leaderboard

### Earning points (proposed values, to tune after launch)

| Action | Points | Rule |
| --- | --- | --- |
| Pass a lesson's quick-check | 10 | Awarded once per lesson, only on passing the check, not on opening the page |
| Complete a track | +50 bonus | All lessons in the track passed |
| Verified project, Beginner | 50 | After verification (Section 9) |
| Verified project, Intermediate | 100 | After verification |
| Verified project, Advanced | 200 | After verification |
| Verified capstone | 300 | After verification |

### Rules

- Points come from passing checks and verified work only. Opening or skipping through lessons earns nothing.
- Retaking a quick-check never awards points twice.
- Points from a submission are removed if it is later flagged as fake or plagiarized.
- Badges: track completion, first verified project, 5 verified projects, streaks. Badges are cosmetic.

### Leaderboard

- Opt-in. Users who opt in choose a display name; real names and emails are never shown.
- Two boards: weekly (resets, so late joiners can compete) and all-time.
- Optional per-track board and a "verified projects" count shown beside each name.
- Users can leave the leaderboard at any time and their entry is removed.

## 9. Project Submission and Verification

Verification must stay light on Vishal's time, so it is mostly automatic.

| Stage | What happens | Who |
| --- | --- | --- |
| 1. Submit | Student submits a GitHub repo link and Colab notebook link, plus answers to 3 rubric questions ("why did you choose X?") | Student |
| 2. Automatic checks | Links valid and public; notebook runs; outputs meet the project's milestone thresholds (for example, accuracy range); basic similarity check against other submissions | System |
| 3. Status: Auto-verified | Project is shown as submitted and earns provisional points | System |
| 4. Spot-check | Random sample of submissions, plus every submission from users entering the weekly or all-time top 10, reviewed against the rubric | Vishal or a trusted reviewer |
| 5. Verified or Flagged | Verified keeps the points and shows a badge; flagged removes points and may block further submissions | Reviewer |

Requirements: review queue with sample rate setting, a short checklist per project, student-visible status (Pending, Auto-verified, Verified, Flagged), and an appeal option.

## 10. Collaboration Board

A place to post a project idea and find teammates. It does not host chat; contact happens only after the poster accepts a request.

### Post fields

Title, the idea (short description), skills needed, desired team size, preferred contact method (email or other, chosen by the poster), status (Open, Full, Closed).

### Flow

1. Poster publishes an idea (login required).
2. Interested users tap **Request to join** and add a short message.
3. Poster sees requests and accepts or declines.
4. On accept, the platform reveals the poster's chosen contact method to that person only.

### Safety and quality guardrails

- Contact details are never shown publicly; they are shared only on acceptance.
- Access limited to logged-in users; restricting it to paid users is an open decision (it cuts spam and adds value to the paid tier).
- Report and block buttons on every post and request; a short code of conduct shown before posting.
- Limits: a few active posts per user; posts auto-close after a set period (proposed 60 days); rate-limit join requests.
- Admin tools to hide posts and suspend users.
- Users can link a finished collaboration to a project submission so the team's verified work is recognized.

## 11. Monetization

| Tier | Includes | Price (to confirm) |
| --- | --- | --- |
| Free | Preview lessons, limited playground, one beginner project, leaderboard participation for free content | ₹0 |
| Track pass | All lessons, practice, notebooks and projects in one track | ₹199-299 |
| All-access (lifetime) | Everything, including future lessons and the collaboration board (if paid-only) | ₹799-999 |
| Add-ons | Cheat-sheet packs; checklist-based project review | ₹499-999 |

Launch offer for the first 50 buyers in exchange for testimonials. Launch announcements go to users who ticked the opt-in box at signup; there is no separate email capture system.

## 12. Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F1 | User accounts with login (Clerk, Supabase Auth or NextAuth); signup includes an opt-in checkbox for launch emails | P0 |
| F2 | Razorpay checkout; webhook marks the user as paid | P0 |
| F3 | Server-side access control on lesson, notebook and project routes (no client-only hiding) | P0 |
| F4 | Per-user progress tracking, with "continue where you left off" | P0 |
| F5 | Track pages as landing pages with syllabus, preview lesson and pricing | P0 |
| F6 | Restructured navigation by track; existing lessons remapped | P0 |
| F7 | SEO: unique title, meta description and written intro for every lesson | P0 |
| F8 | Project pages with dataset block, notebook link, milestones, rubric, resume bullets | P1 |
| F9 | Quiz engine with scene-based questions; passing records lesson completion | P1 |
| F10 | Simple analytics: visitors, preview-to-paid conversion, lesson completion | P1 |
| F11 | Points engine (awards only on passed checks and verified projects, with audit log) | P1 |
| F12 | Opt-in leaderboard (weekly and all-time) with display names | P1 |
| F13 | Project submission form and automatic checks | P1 |
| F14 | Reviewer queue for spot-checks, flags and appeals | P1 |
| F15 | Collaboration board with request-to-join and contact reveal on accept | P2 |
| F16 | Moderation tools: report, block, hide post, suspend user | P2 |
| F17 | Cheat-sheet PDF download for paid users | P2 |
| F18 | Dataset link health-check script and monthly report | P2 |

## 13. Non-Functional Requirements

- Free tiers only for hosting, auth and email at launch (Vercel and equivalents).
- Page load under 3 seconds on a mid-range phone; visualizers must work on mobile.
- Accessible: keyboard controls for sliders, sufficient contrast, text alternatives for diagrams.
- Privacy: store the minimum data (email, progress, payment status, optional display name); no card data on our servers; leaderboard and collaboration visibility are opt-in; users can delete their account and data.
- Abuse resistance: rate limits on submissions, join requests and quiz attempts.
- Every formula and derivative covered by automated tests (kept from the current platform).

## 14. Phases and Milestones

| Phase | Scope | Outcome |
| --- | --- | --- |
| 1: Restructure | Track-based navigation, remap 16 existing lessons, add scene intros and relabeled controls, SEO text | New structure live, still free |
| 2: Paywall | Auth, Razorpay, server-side gating, progress, quiz completion, pricing page, signup opt-in | Can accept first payment |
| 3: New content, wave 1 | Track 9 (Data Preparation), Track 5 (Sequence Models) and Track 7 (Generative Models), first projects | Highest-demand new topics |
| 4: New content, wave 2 | Track 3, Track 8, Track 1, Track 0 | Fuller curriculum |
| 5: New content, wave 3 | Remaining Track 4 and Track 6 lessons, capstones | All 50 lessons complete |
| 6: Community | Points engine, leaderboard, project submission and verification, collaboration board, moderation tools | Retention and sharing features live |
| Ongoing | One teaser or demo clip per week on LinkedIn and Medium; monthly dataset link check | Traffic and credibility |

Phase 6 is last on purpose: these features only feel alive once there are enough users and enough content.

## 15. Open Decisions

1. **Free lessons:** 1-2 only, or one preview per track (proposed, better for search traffic and sharing).
2. **Mascot and recurring cast** vs standalone scenes.
3. **Final pricing** and launch offer.
4. **Auth provider** (Clerk, Supabase or NextAuth).
5. **Order of new content waves** (proposed order above).
6. **Project review add-on:** offer it, or skip to protect your time.
7. **Point values** and whether badges carry any perks.
8. **Spot-check rate** and who reviews besides Vishal.
9. **Collaboration board access:** paid users only, or all logged-in users.

## 16. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Little traffic after launch | SEO text on every lesson, free previews per track, weekly demo clips |
| Analogies teach wrong intuition | Mandatory "where the analogy breaks" block; Vishal reviews all math |
| Broken dataset links or license problems | Link out only, monthly health check, license shown on each project page |
| Workload of 34 new lessons | Per-lesson spec template; wave-based releases; Shikhar and Antigravity implement from specs |
| Paywall bypass | Server-side gating only |
| Medical-data misuse | Learning-only notice on the chest X-ray project |
| Fake or copied project submissions | Automatic checks, similarity check, rubric questions, spot-checks, point removal |
| Points gamed by clicking through | Points only on passed quick-checks and verified projects |
| Review workload kills the passive model | Mostly automatic verification; sample-based spot-checks; trusted reviewers later |
| Spam, harassment or contact misuse on collaboration board | Request-to-join, contact reveal on accept only, report/block, rate limits, moderation tools |
| Leaderboard discourages beginners | Opt-in, weekly board, badges for progress and streaks |

## 17. Success Metrics

- Monthly visitors and preview-lesson completion rate.
- Signup rate and share who opt in to launch emails.
- Preview-to-paid conversion rate (typical early range 1-3%).
- Paid users, revenue and refund rate.
- Lesson completion and project submission rates; share of submissions verified vs flagged.
- Leaderboard opt-in rate and weekly active learners.
- Collaboration posts, request-to-join acceptance rate, and projects completed by teams.
- Student feedback on whether the scenes helped (survey after each track).

## 18. Team and Responsibilities

- **Vishal:** product owner, curriculum and correctness review, spot-check reviews, marketing posts, pricing decisions.
- **Claude (AI):** curriculum and lesson specs, scene scripts, SEO text, quizzes, cheat sheets, project specs, review checklists.
- **Shikhar and Antigravity:** implementation of restructure, auth, payments, new visualizers, project pages and community features from specs.

## 19. Next Steps

1. Confirm the open decisions in Section 15.
2. Write one full lesson spec (proposed: RNN) and one full project spec (proposed: MNIST from scratch) as templates.
3. Start Phase 1 restructure while specs for Phase 2 are written.
