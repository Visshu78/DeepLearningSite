import React from 'react';
import { NeuralPlayground } from '@/components/playground/NeuralPlayground';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neural Playground — NeuroPlay',
  description: 'Interactive sandbox for freely experimenting with neural network layer dimensions, weights, biases, and activation functions.'
};

export default function PlaygroundPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6E6E0] pb-6 space-y-2">
        <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#0D6E6E]">
          Interactive Sandbox
        </div>
        <h1 className="text-3xl font-extrabold text-[#18191B] tracking-tight">
          Neural Architecture Playground
        </h1>
        <p className="text-sm text-[#5C626B] max-w-2xl leading-relaxed">
          Experiment directly with multi-layer feedforward neural networks. Vary input dimensions, alter hidden unit capacity, tweak synaptic weights, and observe forward signal transmission in real time.
        </p>
      </div>

      {/* The Interactive Playground */}
      <NeuralPlayground />

      {/* Guide & Architectural Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E6E6E0] text-xs text-[#5C626B]">
        <div className="space-y-1.5">
          <h3 className="font-bold text-[#18191B] text-sm">Feature Dimensions</h3>
          <p className="leading-relaxed">
            Changing the number of inputs simulates expanding feature dimensionality—for instance, passing tabular attributes or raw sensory coordinates into the network.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-[#18191B] text-sm">Hidden Representation Capacity</h3>
          <p className="leading-relaxed">
            Increasing hidden units allows the network to partition feature space with more hyperplanes, forming rich intermediate basis functions for complex decisions.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-[#18191B] text-sm">Activation Gating</h3>
          <p className="leading-relaxed">
            Switching activations from ReLU to Sigmoid or Tanh demonstrates how differing non-linear regimes affect numerical scaling, sparsity, and saturation.
          </p>
        </div>
      </div>
    </div>
  );
}
