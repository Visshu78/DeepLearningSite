'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sliders } from 'lucide-react';
import { NeuronVisualizer } from '@/components/visualizers/NeuronVisualizer';
import { CURRICULUM } from '@/lib/lesson-data/curriculum';

export default function HomePage() {
  const learningSteps = [
    {
      num: '01',
      title: 'Explain',
      desc: 'Ground each concept first with clear intuition, explicit definitions, and geometric reasoning.'
    },
    {
      num: '02',
      title: 'Experiment',
      desc: 'Manipulate inputs, weights, biases, and learning rates using real-time parameter controls.'
    },
    {
      num: '03',
      title: 'Visualize',
      desc: 'Watch pre-activations, coordinate curves, loss landscapes, and backpropagation flows update dynamically.'
    },
    {
      num: '04',
      title: 'Understand',
      desc: 'Connect every visual artifact directly to analytical calculus and verified arithmetic traces.'
    },
    {
      num: '05',
      title: 'Practice',
      desc: 'Solidify your mental models with diagnostic challenges and immediate explanatory feedback.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2E6] border border-[#EEDAA2] text-xs font-mono-num font-semibold text-[#7A1C30] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#B8860B]" aria-hidden="true"></span>
              <span>NeuroPlay — Visual Deep Learning</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F191B] tracking-tight leading-[1.15]">
              Understand Deep Learning by seeing it work.
            </h1>

            <p className="text-sm sm:text-base text-[#54484E] leading-relaxed">
              An interactive visual platform designed for college students studying artificial intelligence and machine learning. Manipulate model parameters, observe intermediate numerical calculations, and trace forward and backward propagation step by step.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/learn/what-is-an-artificial-neuron"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#7A1C30] text-[#FEF9EE] hover:bg-[#5F1424] text-xs sm:text-sm font-semibold transition-colors shadow-sm border border-[#9B2242]"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </Link>

              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#DFCDB6] bg-white text-[#1F191B] hover:border-[#B8860B] hover:text-[#7A1C30] text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
              >
                <Sliders className="w-4 h-4 text-[#B8860B]" />
                <span>Explore the Playground</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-[#EAE2D5] flex items-center gap-6 text-xs text-[#786970] font-mono-num">
              <span>Verified Calculus</span>
              <span className="text-[#D4AF37]">•</span>
              <span>In-Browser Runtime</span>
              <span className="text-[#D4AF37]">•</span>
              <span>Zero Black Boxes</span>
            </div>
          </div>

          {/* Hero Live Visualizer Component */}
          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -top-3 left-4 z-10 bg-[#7A1C30] border border-[#D4AF37]/60 text-[#FEF9EE] text-[10px] font-mono-num font-bold px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Live Interactive Demonstration
              </div>
              <NeuronVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* Educational Framework (Explain -> Experiment -> Visualize -> Understand -> Practice) */}
      <section className="bg-[#FAF5EE] border-y border-[#EAE2D5] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#B8860B]">
              Pedagogical Framework
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F191B] tracking-tight">
              The Five-Phase Learning Progression
            </h2>
            <p className="text-xs sm:text-sm text-[#54484E] leading-relaxed">
              Every concept follows a deliberate sequence that grounds abstract mathematical principles in concrete, tangible visual models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {learningSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white border border-[#EAE2D5] rounded-lg p-4 space-y-2 shadow-2xs hover:border-[#B8860B] transition-colors"
              >
                <div className="font-mono-num text-xs font-bold text-[#B8860B]">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-[#1F191B]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#54484E] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Roadmap Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EAE2D5] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#B8860B]">
              Structured Path
            </div>
            <h2 className="text-2xl font-extrabold text-[#1F191B] tracking-tight">
              Curriculum Roadmap
            </h2>
          </div>
          <Link
            href="/learn"
            className="text-xs font-semibold text-[#7A1C30] hover:text-[#5F1424] flex items-center gap-1 transition-colors"
          >
            <span>View Full Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CURRICULUM.map((module) => (
            <div
              key={module.id}
              className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-3 flex flex-col justify-between shadow-2xs hover:border-[#B8860B] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-num text-[#786970]">
                  <span>Module {module.number}</span>
                  <span className="text-[#B8860B] font-semibold">{module.lessons.length} Lessons</span>
                </div>
                <h3 className="text-sm font-bold text-[#1F191B]">
                  {module.title}
                </h3>
                <p className="text-xs text-[#54484E] leading-relaxed line-clamp-2">
                  {module.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-xs">
                {module.status === 'available' ? (
                  <Link
                    href={`/learn/${module.lessons[0].slug}`}
                    className="font-semibold text-[#7A1C30] hover:text-[#5F1424] flex items-center gap-1"
                  >
                    <span>Start Module</span>
                    <ArrowRight className="w-3 h-3 text-[#B8860B]" />
                  </Link>
                ) : (
                  <span className="text-[#786970] font-mono-num text-[11px]">Upcoming Content</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Interactive Lessons */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-[#EAE2D5] pb-4">
          <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#B8860B]">
            Foundational Lessons
          </div>
          <h2 className="text-2xl font-extrabold text-[#1F191B] tracking-tight">
            Explore Interactive Visualizers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM.flatMap(m => m.lessons).filter(l => l.status === 'available').map((lesson) => (
            <Link
              key={lesson.id}
              href={`/learn/${lesson.slug}`}
              className="group bg-white border border-[#EAE2D5] hover:border-[#7A1C30] rounded-lg p-5 space-y-3 transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-num text-[#786970]">
                  <span>Lesson {lesson.moduleNumber}.{lesson.lessonNumber}</span>
                  <span className="text-[#B8860B]">{lesson.duration}</span>
                </div>
                <h3 className="text-sm font-bold text-[#1F191B] group-hover:text-[#7A1C30] transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-[#54484E] leading-relaxed line-clamp-2">
                  {lesson.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-xs font-semibold text-[#7A1C30]">
                <span>Launch Interactive Lesson</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8860B] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curriculum Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5EE] border border-[#DFCDB6] rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F191B]">
              Ready to explore multi-layer network dynamics?
            </h2>
            <p className="text-xs sm:text-sm text-[#54484E] leading-relaxed">
              Step through inputs, hidden representations, loss landscapes, and exact analytical backpropagation calculations in our interactive sandbox.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/learn/what-is-an-artificial-neuron"
              className="px-5 py-2.5 rounded bg-[#7A1C30] text-[#FEF9EE] hover:bg-[#5F1424] text-xs font-semibold transition-colors shadow-sm border border-[#9B2242]"
            >
              Start Lesson 1
            </Link>
            <Link
              href="/playground"
              className="px-5 py-2.5 rounded border border-[#DFCDB6] bg-white text-[#1F191B] hover:border-[#B8860B] hover:text-[#7A1C30] text-xs font-semibold transition-colors"
            >
              Open Sandbox
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
