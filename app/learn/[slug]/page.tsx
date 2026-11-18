import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getLessonBySlug, ALL_LESSONS, type LessonMeta } from '@/lib/lesson-data/curriculum';
import { LESSON_DETAILS } from '@/lib/lesson-data/lessonContent';
import { hasServerPaidAccess } from '@/lib/auth/session';
import { LessonLayout } from '@/components/lesson/LessonLayout';
import { LockedLessonPaywall } from '@/components/lesson/LockedLessonPaywall';
import { NeuronVisualizer } from '@/components/visualizers/NeuronVisualizer';
import { ActivationGraphVisualizer } from '@/components/visualizers/ActivationGraphVisualizer';
import { ForwardPassVisualizer } from '@/components/visualizers/ForwardPassVisualizer';
import { LossLandscapeVisualizer } from '@/components/visualizers/LossLandscapeVisualizer';
import { GradientDescentVisualizer } from '@/components/visualizers/GradientDescentVisualizer';
import { BackpropagationVisualizer } from '@/components/visualizers/BackpropagationVisualizer';
import { ConvolutionVisualizer } from '@/components/visualizers/ConvolutionVisualizer';
import { PoolingVisualizer } from '@/components/visualizers/PoolingVisualizer';
import { RegularizationVisualizer } from '@/components/visualizers/RegularizationVisualizer';
import { AdaptiveOptimizersVisualizer } from '@/components/visualizers/AdaptiveOptimizersVisualizer';
import { CNNInferencePipelineVisualizer } from '@/components/visualizers/CNNInferencePipelineVisualizer';
import { CNNBackpropagationVisualizer } from '@/components/visualizers/CNNBackpropagationVisualizer';
import { ResNetVisualizer } from '@/components/visualizers/ResNetVisualizer';
import { EfficientNetVisualizer } from '@/components/visualizers/EfficientNetVisualizer';
import { SelfAttentionVisualizer } from '@/components/visualizers/SelfAttentionVisualizer';
import { DataPrepVisualizer } from '@/components/visualizers/DataPrepVisualizer';
import { SequenceModelsVisualizer } from '@/components/visualizers/SequenceModelsVisualizer';
import { GenerativeModelsVisualizer } from '@/components/visualizers/GenerativeModelsVisualizer';
import { TrainingDynamicsVisualizer } from '@/components/visualizers/TrainingDynamicsVisualizer';
import { ModernLLMVisualizer } from '@/components/visualizers/ModernLLMVisualizer';
import { ClassicalMLVisualizer } from '@/components/visualizers/ClassicalMLVisualizer';
import { MathToolkitVisualizer } from '@/components/visualizers/MathToolkitVisualizer';
import { VisionAndTransformerExtendedVisualizer } from '@/components/visualizers/VisionAndTransformerExtendedVisualizer';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return ALL_LESSONS.filter(l => l.status === 'available').map(l => ({
    slug: l.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return { title: 'Lesson Not Found — NeuroPlay' };
  return {
    title: `${lesson.title} — NeuroPlay`,
    description: lesson.subtitle,
  };
}

function getVisualizerForSlug(slug: string): React.ReactNode {
  switch (slug) {
    case 'what-is-an-artificial-neuron':
      return <NeuronVisualizer />;
    case 'activation-functions':
      return <ActivationGraphVisualizer />;
    case 'forward-propagation':
      return <ForwardPassVisualizer />;
    case 'loss-functions':
      return <LossLandscapeVisualizer />;
    case 'gradient-descent':
      return <GradientDescentVisualizer />;
    case 'backpropagation-fundamentals':
      return <BackpropagationVisualizer />;
    case 'convolutional-filters':
      return <ConvolutionVisualizer />;
    case 'pooling-and-receptive-fields':
      return <PoolingVisualizer />;
    case 'cnn-inference-pipeline':
      return <CNNInferencePipelineVisualizer />;
    case 'cnn-backpropagation':
      return <CNNBackpropagationVisualizer />;
    case 'resnet-architectures':
      return <ResNetVisualizer />;
    case 'efficientnet-compound-scaling':
      return <EfficientNetVisualizer />;
    case 'regularization-dropout':
      return <RegularizationVisualizer />;
    case 'adaptive-optimizers':
      return <AdaptiveOptimizersVisualizer />;
    case 'self-attention-scaled-dot-product':
    case 'transformer-block-multihead-attention':
      return <SelfAttentionVisualizer />;
    case 'first-look-at-data-eda':
      return <DataPrepVisualizer defaultTab="eda" />;
    case 'handling-missing-data':
      return <DataPrepVisualizer defaultTab="missing-outliers" />;
    case 'outliers-and-feature-scaling':
      return <DataPrepVisualizer defaultTab="scaling" />;
    case 'encoding-categorical-features':
      return <DataPrepVisualizer defaultTab="encoding" />;
    case 'splits-cross-validation-and-leakage':
      return <DataPrepVisualizer defaultTab="leakage" />;
    case 'imbalanced-data-and-metrics':
      return <DataPrepVisualizer defaultTab="imbalance" />;
    case 'feature-engineering-and-pipelines':
      return <DataPrepVisualizer defaultTab="pipelines" />;
    // Track 0: Math Toolkit
    case 'vectors-matrices-and-dot-products':
      return <MathToolkitVisualizer defaultTab="vectors" />;
    case 'derivatives-and-gradients':
      return <MathToolkitVisualizer defaultTab="gradients" />;
    case 'the-chain-rule':
      return <MathToolkitVisualizer defaultTab="chainrule" />;
    case 'probability-and-distributions':
      return <MathToolkitVisualizer defaultTab="probability" />;
    case 'matrix-operations-and-linear-transformations':
      return <MathToolkitVisualizer defaultTab="matrix-transforms" />;
    case 'norms-distances-and-eigenvalues-pca':
      return <MathToolkitVisualizer defaultTab="norms-eigen" />;
    case 'partial-derivatives-jacobian-and-hessian':
      return <MathToolkitVisualizer defaultTab="jacobian-hessian" />;
    case 'conditional-probability-bayes-covariance-distributions':
      return <MathToolkitVisualizer defaultTab="bayes-distributions" />;
    // Track 1: Classical ML
    case 'linear-regression':
      return <ClassicalMLVisualizer defaultTab="linreg" />;
    case 'logistic-regression':
      return <ClassicalMLVisualizer defaultTab="logreg" />;
    case 'bias-variance-and-evaluation-metrics':
      return <ClassicalMLVisualizer defaultTab="biasvar" />;
    case 'decision-trees-and-random-forests':
      return <ClassicalMLVisualizer defaultTab="trees" />;
    case 'kmeans-and-pca':
      return <ClassicalMLVisualizer defaultTab="kmeans-pca" />;
    case 'knn-svm-and-naive-bayes':
      return <ClassicalMLVisualizer defaultTab="logreg" />;
    case 'gradient-boosting-and-xgboost':
      return <ClassicalMLVisualizer defaultTab="trees" />;
    // Track 2.7: Universal Approximation
    case 'universal-approximation-and-depth':
      return <VisionAndTransformerExtendedVisualizer defaultTab="universal" />;
    // Track 3: Training Neural Networks Well (3.1, 3.2, 3.5, 3.6)
    case 'weight-initialization':
      return <TrainingDynamicsVisualizer defaultTab="init" />;
    case 'batch-and-layer-normalization':
      return <TrainingDynamicsVisualizer defaultTab="norm" />;
    case 'learning-rate-schedules-and-warmup':
      return <TrainingDynamicsVisualizer defaultTab="schedule" />;
    case 'reading-loss-curves-and-debugging':
      return <TrainingDynamicsVisualizer defaultTab="debugging" />;
    // Track 4 Extended (4.5, 4.8, 4.9, 4.10)
    case 'from-lenet-to-vgg':
      return <VisionAndTransformerExtendedVisualizer defaultTab="vgg" />;
    case 'transfer-learning':
      return <VisionAndTransformerExtendedVisualizer defaultTab="transfer" />;
    case 'object-detection-yolo':
      return <VisionAndTransformerExtendedVisualizer defaultTab="yolo" />;
    case 'image-segmentation-unet':
      return <VisionAndTransformerExtendedVisualizer defaultTab="unet" />;
    case 'cv-augmentation-explainability-and-domain-shift':
      return <VisionAndTransformerExtendedVisualizer defaultTab="transfer" />;
    // Track 5: Sequence Models
    case 'embeddings-and-word-vectors':
      return <SequenceModelsVisualizer defaultTab="embeddings" />;
    case 'recurrent-neural-networks':
      return <SequenceModelsVisualizer defaultTab="rnn" />;
    case 'bptt-and-vanishing-gradients':
      return <SequenceModelsVisualizer defaultTab="bptt" />;
    case 'lstm-networks':
      return <SequenceModelsVisualizer defaultTab="lstm" />;
    case 'gru-and-seq2seq':
      return <SequenceModelsVisualizer defaultTab="gru-seq2seq" />;
    // Track 6 Extended (6.3, 6.4, 6.5)
    case 'positional-encoding':
      return <VisionAndTransformerExtendedVisualizer defaultTab="pos-encoding" />;
    case 'bert-vs-gpt':
      return <VisionAndTransformerExtendedVisualizer defaultTab="bert-gpt" />;
    case 'vision-transformer-vit':
      return <VisionAndTransformerExtendedVisualizer defaultTab="vit" />;
    case 'text-generation-decoding-and-llm-evaluation':
      return <VisionAndTransformerExtendedVisualizer defaultTab="bert-gpt" />;
    // Track 7: Generative Models
    case 'autoencoders':
      return <GenerativeModelsVisualizer defaultTab="autoencoder" />;
    case 'variational-autoencoders':
      return <GenerativeModelsVisualizer defaultTab="vae" />;
    case 'generative-adversarial-networks':
      return <GenerativeModelsVisualizer defaultTab="gan" />;
    case 'diffusion-models':
      return <GenerativeModelsVisualizer defaultTab="diffusion" />;
    // Track 8: Modern LLM Practice
    case 'tokenization-and-llm-pretraining':
      return <ModernLLMVisualizer defaultTab="tokenization" />;
    case 'finetuning-and-lora':
      return <ModernLLMVisualizer defaultTab="lora" />;
    case 'retrieval-augmented-generation-rag':
      return <ModernLLMVisualizer defaultTab="rag" />;
    case 'reinforcement-learning-and-rlhf':
      return <ModernLLMVisualizer defaultTab="rlhf" />;
    case 'advanced-rag-reranking-and-retrieval-eval':
      return <ModernLLMVisualizer defaultTab="rag" />;
    case 'llm-quantization-kv-cache-and-inference':
      return <ModernLLMVisualizer defaultTab="lora" />;
    default:
      return (
        <div className="p-8 text-center text-sm text-[#5C626B]">
          Interactive visualizer initializing...
        </div>
      );
  }
}

function renderFullLesson(slug: string, meta: LessonMeta) {
  const content = LESSON_DETAILS[slug];
  const clientContent = {
    ...content,
    quiz: content.quiz.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    })),
  };

  return (
    <LessonLayout
      meta={meta}
      content={clientContent}
      visualizer={getVisualizerForSlug(slug)}
    />
  );
}

async function PaidLessonGate({
  slug,
  meta,
  sceneTitle,
}: {
  slug: string;
  meta: LessonMeta;
  sceneTitle: string;
}) {
  const unlocked = await hasServerPaidAccess();
  if (!unlocked) {
    return <LockedLessonPaywall meta={meta} sceneTitle={sceneTitle} />;
  }
  return renderFullLesson(slug, meta);
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getLessonBySlug(slug);
  const content = LESSON_DETAILS[slug];

  if (!meta || !content) {
    notFound();
  }

  // Free preview lessons (1 per track = 10 lessons) render immediately
  if (meta.isFreePreview) {
    return renderFullLesson(slug, meta);
  }

  // Paid lessons are gated on the server after an access check
  return (
    <Suspense fallback={<LockedLessonPaywall meta={meta} sceneTitle={content.scene.title} />}>
      <PaidLessonGate slug={slug} meta={meta} sceneTitle={content.scene.title} />
    </Suspense>
  );
}
