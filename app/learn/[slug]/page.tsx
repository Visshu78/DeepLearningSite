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
