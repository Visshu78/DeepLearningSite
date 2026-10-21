import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About NeuroPlay — Educational Philosophy',
  description: 'The educational mission, pedagogy, and design philosophy behind NeuroPlay.'
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#EAE2D5] pb-8 space-y-3">
        <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#7A1C30]">
          Educational Mission
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F191B] tracking-tight">
          About NeuroPlay
        </h1>
        <p className="text-base text-[#54484E] leading-relaxed max-w-2xl">
          An open educational platform created to make deep learning intuitive, mathematically transparent, and hands-on for college students and engineers.
        </p>
      </div>

      {/* Core Philosophy Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1F191B]">
          The Educational Philosophy
        </h2>
        <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-6 space-y-3">
          <div className="font-mono-num text-xs font-bold text-[#7A1C30] uppercase tracking-wider">
            Explain → Experiment → Visualize → Understand → Practice
          </div>
          <p className="text-sm text-[#1F191B] leading-relaxed">
            Many traditional textbooks present neural networks either as opaque matrix calculus without visual grounding, or as high-level black-box API calls (<code>model.fit()</code>) that conceal how calculations actually flow.
          </p>
          <p className="text-sm text-[#54484E] leading-relaxed">
            NeuroPlay bridges this gap. By seeing intermediate pre-activations, observing activations respond dynamically to parameter changes, and walking step-by-step through backward chain-rule derivatives, students develop lasting geometric intuition before encountering production frameworks like PyTorch or JAX.
          </p>
        </div>
      </section>

      {/* Technical Standards Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[#1F191B]">
          Principles of Design & Mathematics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-bold text-[#1F191B]">
              Mathematical Exactness
            </h3>
            <p className="text-xs text-[#54484E] leading-relaxed">
              Every curve, tangent line, arrow, and label is calculated from pure mathematical functions. Analytical backpropagation gradients are verified via numerical finite-difference gradient checks.
            </p>
          </div>

          <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-bold text-[#1F191B]">
              Restrained, Human-Crafted Design
            </h3>
            <p className="text-xs text-[#54484E] leading-relaxed">
              We reject the generic AI-generated aesthetic—no gratuitous purple gradients, glowing neon borders, or fabricated metrics. The design draws inspiration from classic engineering notebooks and scientific papers.
            </p>
          </div>

          <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-bold text-[#1F191B]">
              Client-Side & Frictionless
            </h3>
            <p className="text-xs text-[#54484E] leading-relaxed">
              Learning requires immediate response times. All computations run instantaneously inside your browser without backend latency, accounts, or paywalls.
            </p>
          </div>

          <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-bold text-[#1F191B]">
              Progressive Pedagogical Disclosure
            </h3>
            <p className="text-xs text-[#54484E] leading-relaxed">
              We introduce concepts in a coherent order: from single neurons and non-linearities, to layered forward passes, loss surfaces, gradient descent, and backpropagation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="p-6 bg-[#FAF2E6] border border-[#EEDAA2] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1F191B]">
            Ready to explore?
          </h3>
          <p className="text-xs text-[#54484E]">
            Begin with Lesson 1: What is an Artificial Neuron?
          </p>
        </div>
        <Link
          href="/learn/what-is-an-artificial-neuron"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold bg-[#7A1C30] text-white hover:bg-[#5F1424] transition-colors shrink-0"
        >
          <span>Start Module 1</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
