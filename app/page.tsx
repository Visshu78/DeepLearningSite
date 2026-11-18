'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sliders, Sparkles, Compass, FolderGit2, Layers } from 'lucide-react';
import { NeuronVisualizer } from '@/components/visualizers/NeuronVisualizer';
import { CURRICULUM, ALL_LESSONS, getTrackStageLabel } from '@/lib/lesson-data/curriculum';
import { TRACK_PROJECTS } from '@/lib/lesson-data/projects';

export default function HomePage() {
  const freePreviewLessons = CURRICULUM.flatMap(m => m.lessons).filter(l => l.isFreePreview);

  const lessonTemplateSteps = [
    {
      num: '01',
      title: 'The Scene',
      desc: 'Start with a 30-second everyday situation—playlist taste matching, hostel chai plans, or auto-rickshaw fares.'
    },
    {
      num: '02',
      title: 'The Mapping',
      desc: 'Connect every piece of the daily scene directly to its mathematical symbol and role in the model.'
    },
    {
      num: '03',
      title: 'Play With It',
      desc: 'Drag scene-labeled sliders and step through live interactive visualizers that run in your browser.'
    },
    {
      num: '04',
      title: 'The Math',
      desc: 'Inspect exact analytical equations, derivatives, and step-by-step worked arithmetic traces.'
    },
    {
      num: '05',
      title: 'Where It Breaks',
      desc: 'See an honest note on where the everyday analogy stops and why real high-dimensional models go further.'
    },
    {
      num: '06',
      title: 'Quick Check',
      desc: 'Pass situation-based diagnostic checks with instant explanatory feedback and build portfolio projects.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6EB] border border-[#E8D3A8] text-xs font-mono-num font-semibold text-[#6E1A2B] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#C28E38]" aria-hidden="true"></span>
            <span>{CURRICULUM.length} Tracks • {ALL_LESSONS.length} Interactive Lessons • {TRACK_PROJECTS.length} Hands-On Projects</span>
          </div>

          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1D1819] tracking-tight leading-[1.1]">
            Understand Machine Learning and Deep Learning by seeing how they actually work.
          </h1>

          <p className="hero-description text-base sm:text-lg text-[#625956] leading-relaxed max-w-2xl mx-auto">
            Learn through intuitive explanations, interactive visualizations, mathematical walkthroughs, and hands-on projects—all in one structured learning path.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/learn/vectors-matrices-and-dot-products"
              className="btn-primary text-xs sm:text-sm font-semibold"
            >
              <span>Start Track 0 Free (Lesson 0.1)</span>
              <ArrowRight className="w-4 h-4 text-[#C28E38]" />
            </Link>

            <Link
              href="/learn"
              className="btn-secondary text-xs sm:text-sm font-semibold"
            >
              <Layers className="w-4 h-4 text-[#6E1A2B]" />
              <span>Explore All 10 Tracks</span>
            </Link>

            <Link
              href="/playground"
              className="btn-secondary text-xs sm:text-sm font-semibold"
            >
              <Sliders className="w-4 h-4 text-[#C28E38]" />
              <span>Open Playground</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-xs text-[#968A86] font-mono-num">
            <span>10 Free Preview Lessons (1 Per Track)</span>
            <span className="text-[#C28E38]">•</span>
            <span>Interactive Visual Workbenches</span>
            <span className="text-[#C28E38]">•</span>
            <span>Optional Guided Projects</span>
          </div>
        </div>

        {/* Hero Live Visualizer Component */}
        <div className="max-w-5xl mx-auto pt-2">
          <div className="relative">
            <div className="absolute -top-3.5 left-6 z-10 badge-live shadow-sm">
              Live Interactive Demonstration (Lesson 2.1 Free Preview)
            </div>
            <NeuronVisualizer />
          </div>
        </div>
      </section>

      {/* 6-Part Lesson Template Section */}
      <section className="bg-[#F4EFEB] border-y border-[#E8E2D9] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#C28E38]">
              Intuition First, Math When You Want It
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] tracking-tight">
              Inside Every NeuroPlay Lesson
            </h2>
            <p className="text-xs sm:text-sm text-[#625956] leading-relaxed">
              Every single lesson across all 10 tracks follows a consistent 6-part structure that connects daily intuition to analytical math.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {lessonTemplateSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white border border-[#E8E2D9] rounded-lg p-4 space-y-2 shadow-2xs hover:border-[#C28E38] editorial-card-lift"
              >
                <div className="font-mono-num text-xs font-bold text-[#C28E38]">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-[#1D1819]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#625956] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10-Track Curriculum Roadmap in Official Learning Order */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#C28E38]">
              Sequential Learning Path (Tracks 0 → 9)
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] tracking-tight">
              Curriculum Roadmap ({ALL_LESSONS.length} Lessons)
            </h2>
            <p className="text-xs text-[#625956] max-w-2xl">
              Follow Tracks 0 through 9 in order—from math foundations and classical ML to deep neural networks, transformers, and production data engineering. Every track also pairs with an optional guided project.
            </p>
          </div>
          <Link
            href="/learn"
            className="text-xs font-semibold text-[#6E1A2B] hover:text-[#54111F] flex items-center gap-1 transition-colors"
          >
            <span>View Full {ALL_LESSONS.length}-Lesson Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM.map((module) => {
            const freePreview = module.lessons.find(l => l.isFreePreview) || module.lessons[0];
            return (
              <div
                key={module.id}
                className="bg-white border border-[#E8E2D9] rounded-lg p-5 space-y-3 flex flex-col justify-between shadow-2xs hover:border-[#C28E38] editorial-card-lift"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-num text-[#968A86]">
                    <span className="font-bold text-[#6E1A2B] bg-[#FAF2E6] border border-[#EEDAA2] px-2 py-0.5 rounded">
                      {getTrackStageLabel(module.number)} • Track {module.number}
                    </span>
                    <span className="text-[#C28E38] font-semibold">{module.lessons.length} Lessons</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1D1819]">
                    Track {module.number}: {module.title}
                  </h3>
                  <p className="text-xs text-[#625956] leading-relaxed line-clamp-2">
                    {module.description}
                  </p>

                  {freePreview && (
                    <div className="pt-1">
                      <Link
                        href={`/learn/${freePreview.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded hover:bg-[#DCFCE7] transition-colors max-w-full"
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          <strong>Free Preview ({freePreview.lessonCode}):</strong> {freePreview.title}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EAE2D5] flex items-center justify-between text-xs">
                  <Link
                    href={`/learn#track-${module.number}`}
                    className="font-semibold text-[#7A1C30] hover:text-[#5F1424] flex items-center gap-1"
                  >
                    <span>Explore Track {module.number}</span>
                    <ArrowRight className="w-3 h-3 text-[#B8860B]" />
                  </Link>
                  <Link
                    href="/projects"
                    className="text-[11px] font-mono-num text-[#625956] hover:text-[#7A1C30] flex items-center gap-1"
                  >
                    <FolderGit2 className="w-3 h-3 text-[#C28E38]" />
                    <span>{module.projectSlugs.length} {module.projectSlugs.length === 1 ? 'Project' : 'Projects'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10 Free Preview Lessons (One Per Track) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EAE2D5] pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-num font-semibold uppercase tracking-wider text-[#166534]">
              Try 1 Lesson Per Track Free ({freePreviewLessons.length} Free Previews)
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1F191B] tracking-tight">
              Free Preview Interactive Lessons
            </h2>
          </div>
          <Link
            href="/learn"
            className="text-xs font-semibold text-[#6E1A2B] hover:text-[#54111F] flex items-center gap-1 transition-colors"
          >
            <span>See All {ALL_LESSONS.length} Lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {freePreviewLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/learn/${lesson.slug}`}
              className="group bg-white border border-[#EAE2D5] hover:border-[#7A1C30] rounded-lg p-5 space-y-3 transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num">
                  <span className="text-[#786970] font-semibold">
                    Track {lesson.moduleNumber} • Lesson {lesson.lessonCode}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] font-bold uppercase text-[10px]">
                    <Sparkles className="w-2.5 h-2.5" />
                    Free Preview
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1F191B] group-hover:text-[#7A1C30] transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-[#54484E] leading-relaxed line-clamp-2">
                  {lesson.subtitle}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6E1A2B] bg-[#FAF8F5] border border-[#EAE2D5] px-2.5 py-1 rounded">
                  <Compass className="w-3 h-3 text-[#C28E38] shrink-0" />
                  <span className="truncate">{lesson.everydayScene}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-xs font-semibold text-[#7A1C30]">
                <span>Launch Free Preview ({lesson.duration})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8860B] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curriculum & Projects Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5EE] border border-[#DFCDB6] rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F191B]">
              Ready to build resume-worthy ML &amp; Deep Learning projects?
            </h2>
            <p className="text-xs sm:text-sm text-[#54484E] leading-relaxed">
              Every track pairs interactive mathematical lessons with guided projects featuring verified public datasets, milestones, interview rubrics, and resume bullet templates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/learn/vectors-matrices-and-dot-products"
              className="px-5 py-2.5 rounded bg-[#7A1C30] text-[#FEF9EE] hover:bg-[#5F1424] text-xs font-semibold transition-colors shadow-sm border border-[#9B2242]"
            >
              Start Lesson 0.1 Free
            </Link>
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded border border-[#DFCDB6] bg-white text-[#1F191B] hover:border-[#B8860B] hover:text-[#7A1C30] text-xs font-semibold transition-colors"
            >
              Browse 21 Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
