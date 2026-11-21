# NeuroPlay Tracks 0–4 Improvement & Verification Report

**Date:** 2026-11-21  
**Scope:** Tracks 0, 1, 2, 3, and 4 (35 lessons total) — mathematical accuracy, conceptual rigor, cross-track consistency, interactive workbenches, quizzes, and independent numerical verification. Tracks 5–9 were left untouched except where Track 7/9 route dispatch (`7.2`, `7.6`, `9.6`) was already fixed in the prior pass.

---

## 1. Summary of Completed Changes

- **Track 0 (Lessons 0.1–0.8):** Corrected reverse-mode autodiff complexity (`O(V + E)` vs `O(P(V + E))`), clarified fixed-variance vs. predicted-variance Gaussian NLL vs. MSE with a worked numerical comparison and live σ slider, distinguished linear (`y = Wx`) vs. affine (`y = Wx + b`) transformations, added centered 2D data cloud + projection + reconstruction + `k=1/k=2` selector to PCA, corrected Hessian classification (including semidefinite/singular inconclusive cases) and gradient/Jacobian/Hessian distinctions, and clarified Bayes' theorem roles and covariance vs. correlation.
- **Track 1 (Lessons 1.1–1.7):** Aligned `1.1` (mess bills) and `1.3` (apartment rents) scenes with their demos, clarified median/IQR contamination dependence, removed rigid `<5%` / `>60%` missingness rules and `<15` one-hot cardinality rules, distinguished outlier detection vs. treatment, distinguished K-Fold / Stratified / Group / TimeSeries splits without claiming universal variance reduction, clarified Pipeline leakage boundaries, and updated all stale `9.x` / `Track 9` labels to `1.x` / `Track 1`.
- **Track 2 (Lessons 2.1–2.7):** Fixed `computeLinearRegression` constant-target $R^2$ (`MATH-01`) and `computeLogisticRegressionStep` odds cap (`MATH-02`), explained why `(XᵀX)⁻¹` is discouraged vs. QR/SVD, corrected Logistic Regression convexity vs. strict convexity, aligned Random Forest variance explanation with `Var(f̄) = ρσ² + ((1 - ρ)/B)σ²`, made PCA variance dataset-dependent, added dedicated `2.6 k-NN, SVM & NB` tab (`knn-svm-nb`), clarified SVM margin `2/||w||₂` and kernel feature space, and updated stale `1.x` / `Track 1` labels to `2.x` / `Track 2`.
- **Track 3 (Lessons 3.1–3.7):** Qualified activation derivative vs. learning speed and ReLU subgradient at `z = 0`, qualified convex function minima existence/uniqueness, explicitly separated Forward Propagation vs. Backpropagation vs. Optimizer roles, refined `(N + 1)^L` and `1 + LN` in Lesson 3.7 as 1D illustrative bounds/constructions rather than universal exact counts, and updated `2.7` → `3.7` tab label.
- **Track 4 (Lessons 4.1–4.6):** Clarified Xavier/He assumptions, explained `(N, C, H, W)` per-channel/spatial BatchNorm and variance/epsilon conventions, distinguished L2 penalty vs. coupled weight decay vs. AdamW, completed the Adam update equations, qualified warmup/cosine decay claims, clarified gradient clipping limits vs. NaNs, and updated stale `3.x` / `Track 3` labels to `4.x` / `Track 4`.

---

## 2. Modified Lessons & Status (35-Lesson Audit)

| Track / Lesson | File Path | Original Issue | Implemented Correction | Status |
|---|---|---|---|---|
| 0.1 Vectors, Matrices & Dot Products | `lib/lesson-data/lessonContent.ts` | Omitted rank in rectangular matrix explanation | Preserved prior fixes and included matrix rank & singular values | FIXED AND VERIFIED |
| 0.2 Derivatives & Gradients | `lib/lesson-data/lessonContent.ts`, `components/visualizers/MathToolkitVisualizer.tsx` | Precision claim, unqualified `ALWAYS`, saddle generalization, missing level-curve geometry & directional arrow | Verified preserved: `O(h²)` trade-off, nonzero Euclidean qualification, contour orthogonality, `+∇f`/`-∇f`/`u`/angle arc | FIXED AND VERIFIED |
| 0.3 The Chain Rule | `lib/lesson-data/lessonContent.ts`, `components/visualizers/MathToolkitVisualizer.tsx` | Described reverse-mode autodiff as `O(1)` passes; lacked DAG visual | Corrected to `O(V + E)` vs forward-mode `O(P(V + E))`; added SVG computational graph showing forward values, local derivatives, and accumulation | FIXED AND VERIFIED |
| 0.4 Probability & Distributions | `lib/lesson-data/lessonContent.ts`, `components/visualizers/MathToolkitVisualizer.tsx` | Implied MSE = Gaussian NLL unconditionally; `setGaussSigma` unused | Clarified fixed-`σ²` equivalence vs predicted-`σ²` log-variance term; added numerical comparison & live `σ` slider | FIXED AND VERIFIED |
| 0.5 Matrix Ops & Linear Transforms | `lib/lesson-data/lessonContent.ts` | Conflated `y = Wx + b` with strictly linear maps | Explicitly distinguished linear (`y = Wx`) vs affine (`y = Wx + b`) | FIXED AND VERIFIED |
| 0.6 Norms, Distances & Eigenvalues (PCA) | `lib/lesson-data/lessonContent.ts`, `components/visualizers/MathToolkitVisualizer.tsx` | Lacked centering/scaling emphasis and interactive projection/reconstruction | Added centering & scaling caveats, dataset-dependent variance note, 2D cloud projection/reconstruction SVG, and `k=1`/`k=2` toggle | FIXED AND VERIFIED |
| 0.7 Partial Derivatives, Jacobian & Hessian | `lib/lesson-data/lessonContent.ts` | Over-generalized high-dim saddles; omitted semidefinite/singular inconclusive case | Added full positive/negative definite, indefinite, and semidefinite/singular classification + Gradient/Jacobian/Hessian distinction | FIXED AND VERIFIED |
| 0.8 Conditional Prob, Bayes & Distributions | `lib/lesson-data/lessonContent.ts` | Covariance vs correlation scale behavior & Bayes terms needed sharper separation | Distinguished Prior, Likelihood, Evidence, Posterior and unit-dependent Cov vs scale-free Pearson `ρ` | FIXED AND VERIFIED |
| 1.1 First Look at Data (EDA) | `lib/lesson-data/curriculum.ts`, `lessonContent.ts`, `DataPrepVisualizer.tsx` | Scooter/fruit-basket scene mismatched mess-bills demo; `Tab 9.1` label; robustness caveat missing | Aligned scene to hostel mess bills, updated `Tab 1.1`, clarified contamination-pattern dependence | FIXED AND VERIFIED |
| 1.2 Handling Missing Data | `lib/lesson-data/lessonContent.ts`, `DataPrepVisualizer.tsx` | Rigid `<5%` / `>60%` rules; `Tab 9.2` / `9.2` cheat sheet | Replaced rigid thresholds with context heuristics; strengthened MCAR/MAR/MNAR; updated labels to `1.2` | FIXED AND VERIFIED |
| 1.3 Outliers & Feature Scaling | `lib/lesson-data/curriculum.ts`, `lessonContent.ts`, `DataPrepVisualizer.tsx` | Scholarship scene mismatched apartment-rent demo; detection vs treatment blurred; `Tab 9.3` | Aligned scene to apartment rents, distinguished IQR detection vs treatment, updated `Tab 1.3` | FIXED AND VERIFIED |
| 1.4 Encoding Categorical Features | `lib/lesson-data/lessonContent.ts`, `DataPrepVisualizer.tsx` | Rigid `K ≤ 15` one-hot rule; `Tab 9.4` / `9.4` cheat sheet | Replaced with cardinality/frequency/model/memory/ordinality criteria; strengthened OOF + smoothed target encoding; updated labels to `1.4` | FIXED AND VERIFIED |
| 1.5 Splits, CV & Data Leakage | `lib/lesson-data/lessonContent.ts`, `DataPrepVisualizer.tsx` | Missing explicit 4-way split comparison; `Tab 9.5` / `9.5` cheat sheet | Distinguished K-Fold, Stratified, Group, TimeSeries without universal variance-reduction claim; updated labels to `1.5` | FIXED AND VERIFIED |
| 1.6 Imbalanced Data & Metrics | `lib/lesson-data/lessonContent.ts`, `DataPrepVisualizer.tsx` | Stale `9.6` cheat sheet / `Tab 9.6` labels | Updated labels to `1.6`; verified SMOTE fold-isolation, class weights, PR-AUC vs accuracy | FIXED AND VERIFIED |
| 1.7 Feature Engineering & Pipelines | `lib/lesson-data/lessonContent.ts`, `DataPrepVisualizer.tsx` | Pipeline implied to stop all leakage; `Tab 9.7` / `Track 9` labels | Clarified Pipeline prevents preprocessing leakage (not target/split leakage); distinguished transformation/construction/selection/extraction; updated to `1.7` / `Track 1` | FIXED AND VERIFIED |
| 2.1 Linear Regression | `lib/math/classicalMl.ts`, `lessonContent.ts`, `ClassicalMLVisualizer.tsx` | `MATH-01` constant-target `R²=1`; `(XᵀX)⁻¹` not discouraged; `Tab 1.1` | Fixed `R²` branch (`1` iff exact, else `0`); explained condition-number squaring & QR/SVD; updated to `Tab 2.1` / `Track 2` | FIXED AND VERIFIED |
| 2.2 Logistic Regression | `lib/math/classicalMl.ts`, `lessonContent.ts`, `ClassicalMLVisualizer.tsx` | `MATH-02` odds clamp; described BCE as always strictly convex; `Tab 1.2` | Removed `±20` odds clamp; distinguished convexity vs strict convexity (rank/curvature); updated to `Tab 2.2` | FIXED AND VERIFIED |
| 2.3 Bias-Variance & Metrics | `lib/lesson-data/lessonContent.ts`, `ClassicalMLVisualizer.tsx` | Stale `Track 1` workbench header | Updated header to `Track 2`; verified metrics & threshold content | FIXED AND VERIFIED |
| 2.4 Decision Trees & Random Forests | `lib/lesson-data/lessonContent.ts`, `ClassicalMLVisualizer.tsx` | Variance explanation needed `1/B` vs `ρσ²` floor assumptions; `Tab 1.4` | Explained independent `1/B` vs correlated `ρσ²` floor under equal-variance/correlation assumptions; updated to `Tab 2.4` / `Track 2` | FIXED AND VERIFIED |
| 2.5 k-Means & PCA | `lib/lesson-data/lessonContent.ts`, `ClassicalMLVisualizer.tsx` | Claimed `95%+` / `99.3%+` variance unconditionally; `Tab 1.5` | Made explained variance explicitly dataset-dependent; updated to `Tab 2.5` | FIXED AND VERIFIED |
| 2.6 k-NN, SVM & Naive Bayes | `components/visualizers/ClassicalMLVisualizer.tsx`, `app/learn/[slug]/page.tsx`, `lessonContent.ts` | Routed to `logreg` tab; kernel feature-space caveat missing | Added `knn-svm-nb` (`2.6`) tab with k-NN/SVM/NB experiments; clarified `2/||w||₂` & kernel feature space | FIXED AND VERIFIED |
| 2.7 Gradient Boosting & XGBoost | `lib/lesson-data/lessonContent.ts` | Stale `Tab 1.4` reference | Updated reference to `Tab 2.4`; verified Bagging vs Boosting vs GBDT vs XGBoost | FIXED AND VERIFIED |
| 3.1 Artificial Neuron | `lib/lesson-data/lessonContent.ts` | Audited equations & labels | Verified `z = Σ wᵢxᵢ + b`, `a = φ(z)` | FIXED AND VERIFIED |
| 3.2 Activation Functions | `lib/lesson-data/lessonContent.ts` | Implied derivative magnitude directly sets training speed; omitted `z=0` convention & GELU | Clarified gradient flow vs optimizer/weights/loss, ReLU subgradient `[0, 1]` at `z=0`, and added GELU comparison | FIXED AND VERIFIED |
| 3.3 Forward Propagation | `lib/lesson-data/lessonContent.ts` | Audited dimensions & flow | Verified Input → Weighted Sum → Activation → Output | FIXED AND VERIFIED |
| 3.4 Loss Functions | `lib/lesson-data/lessonContent.ts` | Audited activations, losses, and logits stability | Verified MSE, MAE, BCE, CCE, and `BCEWithLogitsLoss`/`CrossEntropyLoss` stability | FIXED AND VERIFIED |
| 3.5 Gradient Descent | `lib/lesson-data/lessonContent.ts` | Unqualified convex function wording | Qualified that convex local minima are global, but existence & uniqueness are not guaranteed | FIXED AND VERIFIED |
| 3.6 Comp Graphs & Backprop | `lib/lesson-data/lessonContent.ts` | Forward vs backprop vs optimizer roles implicit | Made Forward (activations) vs Backprop (gradients) vs Optimizer (updates) explicit | FIXED AND VERIFIED |
| 3.7 Universal Approx & Depth | `lib/lesson-data/lessonContent.ts`, `VisionAndTransformerExtendedVisualizer.tsx` | `(N+1)^L` and `1+LN` stated without 1D bound assumptions; `Tab 2.7` label | Qualified as 1D illustrative bounds/constructions; clarified UAT capacity vs training guarantee; updated to `Tab 3.7` | FIXED AND VERIFIED |
| 4.1 Weight Initialization | `lib/lesson-data/lessonContent.ts`, `TrainingDynamicsVisualizer.tsx` | Omitted linear/zero-mean assumptions; `Tab 3.1` label | Added assumptions & distribution caveat; updated to `Tab 4.1` | FIXED AND VERIFIED |
| 4.2 Batch & Layer Normalization | `lib/lesson-data/lessonContent.ts`, `TrainingDynamicsVisualizer.tsx` | Omitted `(N, C, H, W)` spatial reduction & `ε` caveat; `Tab 3.2` | Added `(N, C, H, W)` per-channel over batch+spatial explanation and `ε`/variance caveats; updated to `Tab 4.2` | FIXED AND VERIFIED |
| 4.3 Overfitting, L2 & Dropout | `lib/lesson-data/lessonContent.ts` | L2 penalty vs coupled decay vs AdamW needed sharper separation | Explicitly distinguished L2 penalty, coupled weight decay, and AdamW decoupled decay | FIXED AND VERIFIED |
| 4.4 Momentum, RMSprop & Adam | `lib/lesson-data/lessonContent.ts` | Adam formula omitted `m_t` and `v_t` recurrence lines | Added complete `m_t`, `v_t`, `m̂_t`, `v̂_t`, `θ_{t+1}` equations | FIXED AND VERIFIED |
| 4.5 LR Schedules & Warmup | `lib/lesson-data/lessonContent.ts`, `TrainingDynamicsVisualizer.tsx` | Warmup tied too narrowly to Adam; `Tab 3.5` label | Broadened warmup rationale beyond Adam and qualified cosine decay outcomes; updated to `Tab 4.5` | FIXED AND VERIFIED |
| 4.6 Loss Curves & Debugging | `lib/lesson-data/lessonContent.ts`, `TrainingDynamicsVisualizer.tsx` | Clipping sounded like a NaN cure-all; `Tab 3.6` / `Track 3` | Clarified clipping bounds norm, not invalid arithmetic/NaNs; updated to `Tab 4.6` / `Track 4` | FIXED AND VERIFIED |

---

## 3. Visualisations Modified
- `components/visualizers/MathToolkitVisualizer.tsx` — Extended Tab `0.2` (directional vector `u`, `+∇f`/`-∇f`, angle arc, `η` slider, Step/Reset), Tab `0.3` (computational graph SVG with forward values, local derivatives, and accumulation), Tab `0.4` (`σ` slider + MSE vs fixed-`σ` vs predicted-`σ` NLL comparison), and Tab `0.6` (centered 2D cloud, projection/reconstruction, `k=1`/`k=2` toggle).
- `components/visualizers/DataPrepVisualizer.tsx` — Updated tab labels (`1.1`–`1.7`) and header (`Track 1`).
- `components/visualizers/ClassicalMLVisualizer.tsx` — Added Tab `2.6` (`knn-svm-nb`), updated tab labels (`2.1`–`2.6`) and header (`Track 2`).
- `components/visualizers/VisionAndTransformerExtendedVisualizer.tsx` — Updated `3.7 ReLU Depth` label (and added `7.6 Decoding & Eval` tab).
- `components/visualizers/TrainingDynamicsVisualizer.tsx` — Updated tab labels (`4.1`, `4.2`, `4.5`, `4.6`) and header (`Track 4`).

---

## 4. Independent Numerical Verification & Tests Executed
- **Independent Python verification script:** Executed and passed (`INDEPENDENT PYTHON VERIFICATION PASSED`), verifying `0.2` surface/gradient/step/directional derivative, `0.4` MSE vs fixed-`σ` vs predicted-`σ` NLL, `0.8` Bayes posterior `1/6`, `2.2` `exp(21)` odds, `2.4` Random Forest variance `0.307`, `4.5` cosine schedule `η(60)=0.005`, and `4.6` gradient clipping norm `2.50`.
- **`npm test -- --run`:** **24 test files passed, 113 tests passed** (0 failures, 0 skipped), including new tests in `tests/math/classical-ml.test.ts` for `MATH-01` and `MATH-02`.
- **`npm run lint`:** **0 errors** (53 pre-existing unused-variable/hook warnings in other files).
- **`npm run build`:** **Passed (exit code 0)**, 102 static pages generated.

---

## 5. Remaining Issues / Items Requiring Manual Browser Testing
- **Interactive UI / Responsive / Console QA (`FIXED, TESTING PENDING`):** All new/updated React controls, SVG layouts, Reset buttons, mobile viewports, and KaTeX rendering compiled and statically built, but were not exercised in a live browser session.
- **Additional Requested Visualizations (Deferred / Incremental):**
  - Animated k-Means assignment/centroid step loop (`2.5`), multi-tree correlation slider (`2.4`), sequential boosting residual rounds (`2.7`), and 2D loss-surface contour in `2.1`/`3.5` remain opportunities for future visualizer expansion beyond the current pure math/UI tabs.
