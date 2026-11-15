import React from 'react';
import { notFound } from 'next/navigation';
import { getLessonBySlug, ALL_LESSONS } from '@/lib/lesson-data/curriculum';
import { LESSON_DETAILS } from '@/lib/lesson-data/lessonContent';
import { LessonLayout } from '@/components/lesson/LessonLayout';
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
    slug: l.slug
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
    description: lesson.subtitle
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getLessonBySlug(slug);
  const content = LESSON_DETAILS[slug];

  if (!meta || !content) {
    notFound();
  }

  // Select the appropriate visualizer
  let visualizer: React.ReactNode = null;
  switch (slug) {
    case 'what-is-an-artificial-neuron':
      visualizer = <NeuronVisualizer />;
      break;
    case 'activation-functions':
      visualizer = <ActivationGraphVisualizer />;
      break;
    case 'forward-propagation':
      visualizer = <ForwardPassVisualizer />;
      break;
    case 'loss-functions':
      visualizer = <LossLandscapeVisualizer />;
      break;
    case 'gradient-descent':
      visualizer = <GradientDescentVisualizer />;
      break;
    case 'backpropagation-fundamentals':
      visualizer = <BackpropagationVisualizer />;
      break;
    case 'convolutional-filters':
      visualizer = <ConvolutionVisualizer />;
      break;
    case 'pooling-and-receptive-fields':
      visualizer = <PoolingVisualizer />;
      break;
    case 'cnn-inference-pipeline':
      visualizer = <CNNInferencePipelineVisualizer />;
      break;
    case 'cnn-backpropagation':
      visualizer = <CNNBackpropagationVisualizer />;
      break;
    case 'resnet-architectures':
      visualizer = <ResNetVisualizer />;
      break;
    case 'efficientnet-compound-scaling':
      visualizer = <EfficientNetVisualizer />;
      break;
    case 'regularization-dropout':
      visualizer = <RegularizationVisualizer />;
      break;
    case 'adaptive-optimizers':
      visualizer = <AdaptiveOptimizersVisualizer />;
      break;
    case 'self-attention-scaled-dot-product':
    case 'transformer-block-multihead-attention':
      visualizer = <SelfAttentionVisualizer />;
      break;
    case 'first-look-at-data-eda':
      visualizer = <DataPrepVisualizer defaultTab="eda" />;
      break;
    case 'handling-missing-data':
      visualizer = <DataPrepVisualizer defaultTab="missing-outliers" />;
      break;
    case 'outliers-and-feature-scaling':
      visualizer = <DataPrepVisualizer defaultTab="scaling" />;
      break;
    case 'encoding-categorical-features':
      visualizer = <DataPrepVisualizer defaultTab="encoding" />;
      break;
    case 'splits-cross-validation-and-leakage':
      visualizer = <DataPrepVisualizer defaultTab="leakage" />;
      break;
    case 'imbalanced-data-and-metrics':
      visualizer = <DataPrepVisualizer defaultTab="imbalance" />;
      break;
    case 'feature-engineering-and-pipelines':
      visualizer = <DataPrepVisualizer defaultTab="pipelines" />;
      break;
    // Track 0: Math Toolkit
    case 'vectors-matrices-and-dot-products':
      visualizer = <MathToolkitVisualizer defaultTab="vectors" />;
      break;
    case 'derivatives-and-gradients':
      visualizer = <MathToolkitVisualizer defaultTab="gradients" />;
      break;
    case 'the-chain-rule':
      visualizer = <MathToolkitVisualizer defaultTab="chainrule" />;
      break;
    case 'probability-and-distributions':
      visualizer = <MathToolkitVisualizer defaultTab="probability" />;
      break;
    // Track 1: Classical ML
    case 'linear-regression':
      visualizer = <ClassicalMLVisualizer defaultTab="linreg" />;
      break;
    case 'logistic-regression':
      visualizer = <ClassicalMLVisualizer defaultTab="logreg" />;
      break;
    case 'bias-variance-and-evaluation-metrics':
      visualizer = <ClassicalMLVisualizer defaultTab="biasvar" />;
      break;
    case 'decision-trees-and-random-forests':
      visualizer = <ClassicalMLVisualizer defaultTab="trees" />;
      break;
    case 'kmeans-and-pca':
      visualizer = <ClassicalMLVisualizer defaultTab="kmeans-pca" />;
      break;
    // Track 2.7: Universal Approximation
    case 'universal-approximation-and-depth':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="universal" />;
      break;
    // Track 3: Training Neural Networks Well (3.1, 3.2, 3.5, 3.6)
    case 'weight-initialization':
      visualizer = <TrainingDynamicsVisualizer defaultTab="init" />;
      break;
    case 'batch-and-layer-normalization':
      visualizer = <TrainingDynamicsVisualizer defaultTab="norm" />;
      break;
    case 'learning-rate-schedules-and-warmup':
      visualizer = <TrainingDynamicsVisualizer defaultTab="schedule" />;
      break;
    case 'reading-loss-curves-and-debugging':
      visualizer = <TrainingDynamicsVisualizer defaultTab="debugging" />;
      break;
    // Track 4 Extended (4.5, 4.8, 4.9, 4.10)
    case 'from-lenet-to-vgg':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="vgg" />;
      break;
    case 'transfer-learning':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="transfer" />;
      break;
    case 'object-detection-yolo':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="yolo" />;
      break;
    case 'image-segmentation-unet':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="unet" />;
      break;
    // Track 5: Sequence Models
    case 'embeddings-and-word-vectors':
      visualizer = <SequenceModelsVisualizer defaultTab="embeddings" />;
      break;
    case 'recurrent-neural-networks':
      visualizer = <SequenceModelsVisualizer defaultTab="rnn" />;
      break;
    case 'bptt-and-vanishing-gradients':
      visualizer = <SequenceModelsVisualizer defaultTab="bptt" />;
      break;
    case 'lstm-networks':
      visualizer = <SequenceModelsVisualizer defaultTab="lstm" />;
      break;
    case 'gru-and-seq2seq':
      visualizer = <SequenceModelsVisualizer defaultTab="gru-seq2seq" />;
      break;
    // Track 6 Extended (6.3, 6.4, 6.5)
    case 'positional-encoding':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="pos-encoding" />;
      break;
    case 'bert-vs-gpt':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="bert-gpt" />;
      break;
    case 'vision-transformer-vit':
      visualizer = <VisionAndTransformerExtendedVisualizer defaultTab="vit" />;
      break;
    // Track 7: Generative Models
    case 'autoencoders':
      visualizer = <GenerativeModelsVisualizer defaultTab="autoencoder" />;
      break;
    case 'variational-autoencoders':
      visualizer = <GenerativeModelsVisualizer defaultTab="vae" />;
      break;
    case 'generative-adversarial-networks':
      visualizer = <GenerativeModelsVisualizer defaultTab="gan" />;
      break;
    case 'diffusion-models':
      visualizer = <GenerativeModelsVisualizer defaultTab="diffusion" />;
      break;
    // Track 8: Modern LLM Practice
    case 'tokenization-and-llm-pretraining':
      visualizer = <ModernLLMVisualizer defaultTab="tokenization" />;
      break;
    case 'finetuning-and-lora':
      visualizer = <ModernLLMVisualizer defaultTab="lora" />;
      break;
    case 'retrieval-augmented-generation-rag':
      visualizer = <ModernLLMVisualizer defaultTab="rag" />;
      break;
    case 'reinforcement-learning-and-rlhf':
      visualizer = <ModernLLMVisualizer defaultTab="rlhf" />;
      break;
    default:
      visualizer = <div className="p-8 text-center text-sm text-[#5C626B]">Interactive visualizer initializing...</div>;
  }

  return (
    <LessonLayout
      meta={meta}
      content={content}
      visualizer={visualizer}
    />
  );
}
