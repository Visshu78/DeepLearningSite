'use client';

import React from 'react';
import Link from 'next/link';
import { LessonMeta, getAdjacentLessons } from '@/lib/lesson-data/curriculum';
import { DetailedLessonContent } from '@/lib/lesson-data/lessonContent';
import { getProjectBySlug } from '@/lib/lesson-data/projects';
import { useLearningProgress } from '@/lib/progress/progressStore';
import { KnowledgeCheck, PublicQuizQuestion } from '@/components/quiz/KnowledgeCheck';
import { MathEquation } from '@/components/equations/MathEquation';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  ArrowRight,
  Compass,
  Sliders,
  AlertTriangle,
  FolderGit2,
  Sparkles,
} from 'lucide-react';

export type ClientLessonContent = Omit<DetailedLessonContent, 'quiz'> & {
  quiz: PublicQuizQuestion[];
};

interface LessonLayoutProps {
  meta: LessonMeta;
  content: ClientLessonContent;
  visualizer: React.ReactNode;
}

export function LessonLayout({ meta, content, visualizer }: LessonLayoutProps) {
  const { isCompleted, toggleLesson, mounted } = useLearningProgress();
  const completed = mounted && isCompleted(meta.slug);
  const { prev, next } = getAdjacentLessons(meta.slug);
  const relatedProject = meta.relatedProjectSlug
    ? getProjectBySlug(meta.relatedProjectSlug)
    : undefined;

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#786970]">
        <Link href="/" className="hover:text-[#7A1C30] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
        <Link href="/learn" className="hover:text-[#7A1C30] transition-colors">Curriculum</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
        <span className="text-[#54484E]">Track {meta.moduleNumber}: {meta.moduleName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
        <span className="text-[#1F191B] font-semibold truncate">{meta.lessonCode} {meta.title}</span>
      </nav>

      {/* Lesson Header */}
      <header className="space-y-4 pb-6 border-b border-[#EAE2D5]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono-num font-semibold text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-3.5 py-1.5 rounded-md shadow-2xs">
              <span>Track {meta.moduleNumber}: {meta.moduleName}</span>
              <span className="text-[#B8860B]">•</span>
              <span>Lesson {meta.lessonCode}</span>
            </div>
            {meta.isFreePreview && (
              <span className="inline-flex items-center gap-1 text-xs font-mono-num font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md bg-[#DCFCE7] border border-[#86EFAC] text-[#166534]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Preview</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-[#625956]">
              <Clock className="w-4 h-4 text-[#C28E38]" />
              <span>{meta.duration}</span>
            </span>

            {relatedProject && (
              <Link
                href={`/projects/${relatedProject.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-[#FAF8F5] border border-[#E8E2D9] text-[#6E1A2B] hover:border-[#C28E38] transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#C28E38]" />
                <span>Track Project: {relatedProject.funTitle}</span>
              </Link>
            )}

            {/* Mark as Completed Button */}
            <button
              onClick={() => toggleLesson(meta.slug)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors border ${
                completed
                  ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                  : 'bg-white border-[#E8E2D9] text-[#1D1819] hover:border-[#6E1A2B] hover:text-[#6E1A2B]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-[#166534]' : 'text-[#968A86]'}`} />
              <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#1D1819] tracking-tight leading-[1.12]">
          {meta.title}
        </h1>
        <p className="text-lg sm:text-xl text-[#54484E] leading-relaxed max-w-3xl">
          {meta.subtitle}
        </p>

        {meta.prerequisites.length > 0 && (
          <div className="text-xs sm:text-sm text-[#625956] flex items-center gap-2 pt-1 flex-wrap">
            <span className="font-bold text-[#1D1819]">Prerequisites:</span>
            {meta.prerequisites.map(prereq => (
              <Link
                key={prereq}
                href={`/learn/${prereq}`}
                className="text-[#6E1A2B] hover:underline bg-[#F4EFEB] px-2.5 py-1 rounded border border-[#E8E2D9] hover:border-[#C28E38] font-medium"
              >
                {prereq.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* PART 1: The Scene (Everyday Anchor) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
            <span>1. The Scene: {content.scene.title}</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono-num uppercase tracking-wider text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-2.5 py-1 rounded">
            <Compass className="w-3.5 h-3.5 text-[#C28E38]" />
            <span>Everyday Intuition First</span>
          </span>
        </div>

        <div className="bg-gradient-to-br from-[#FAF6EE] to-[#F5EFE4] border border-[#E5D5B5] border-l-4 border-l-[#C28E38] rounded-xl p-5 sm:p-7 shadow-2xs">
          <p className="text-base sm:text-lg text-[#1F191B] leading-relaxed">
            {content.scene.narrative}
          </p>
        </div>
      </section>

      {/* PART 2: The Mapping (Scene <-> Model <-> Math Symbol) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
            <span>2. The Mapping: From Daily Life to Mathematical Symbols</span>
          </h2>
          <p className="text-sm sm:text-base text-[#54484E]">
            Every symbol in the equations and interactive workbench below corresponds directly to one piece of the scene above:
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] sm:text-xs font-mono-num uppercase tracking-wider text-[#6E1A2B]">
                  <th className="py-3.5 px-4 font-bold">What&apos;s in the Scene</th>
                  <th className="py-3.5 px-4 font-bold">What It Is in the Model</th>
                  <th className="py-3.5 px-4 font-bold">Math Symbol</th>
                  <th className="py-3.5 px-4 font-bold">Why It&apos;s There</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEAE2] text-xs sm:text-sm">
                {content.mapping.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FDFBF8] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1D1819] align-top">
                      {row.scenePart}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#6E1A2B] align-top">
                      {row.modelPart}
                    </td>
                    <td className="py-3.5 px-4 font-mono-num font-bold text-[#1F191B] bg-[#FAF8F5]/70 align-top whitespace-nowrap">
                      {row.symbol}
                    </td>
                    <td className="py-3.5 px-4 text-[#54484E] leading-relaxed align-top">
                      {row.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PART 3: Play With It (Interactive Visualization) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
            <span>3. Play With It: Interactive Workbench</span>
          </h2>
          <span className="text-xs sm:text-sm text-[#968A86] font-mono-num font-medium">
            Scene-Labeled Parameter Controls
          </span>
        </div>

        <div className="bg-[#FAF2E6] border border-[#EEDAA2] rounded-lg p-4 flex items-start gap-3 text-xs sm:text-sm text-[#4A3B3E]">
          <Sliders className="w-4 h-4 text-[#7A1C30] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#7A1C30]">Try This First: </span>
            <span>{content.playWithItPrompt}</span>
          </div>
        </div>

        <div>{visualizer}</div>
      </section>

      {/* PART 4: The Math & Step-by-Step Numerical Trace */}
      <section className="space-y-8 pt-4 border-t border-[#E8E2D9]">
        <div className="space-y-4">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
            <span>4. The Math: Analytical Formulation & Worked Trace</span>
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#2C2426] leading-relaxed max-w-4xl">
            {content.intuition.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg sm:text-xl text-[#1F191B] leading-relaxed font-normal' : ''}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* KaTeX Formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.mathFormulas.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-[#E8E2D9] border-t-2 border-t-[#6E1A2B] rounded-lg p-5 sm:p-6 space-y-3.5 shadow-2xs hover:shadow-xs hover:border-[#D6CCC0] transition-all"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#6E1A2B]">
                {f.name}
              </h3>
              <div className="bg-[#FAF8F5] border-l-3 border-[#6E1A2B] p-3.5 rounded-r text-[#1D1819] overflow-x-auto text-base">
                <MathEquation math={f.latex} block />
              </div>
              <p className="text-sm sm:text-base text-[#54484E] leading-relaxed">
                {f.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Step-by-Step Worked Numerical Example */}
        <div className="bg-white border border-[#E8E2D9] rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-serif-editorial text-xl font-bold text-[#1D1819]">
              Step-by-Step Worked Numerical Trace
            </h3>
            <span className="text-xs font-mono-num uppercase tracking-wider text-[#7A1C30] bg-[#FAF2E6] px-2.5 py-1 rounded">
              Exact Arithmetic
            </span>
          </div>

          <div className="text-sm sm:text-base font-medium text-[#625956] italic">
            Scenario: {content.workedExample.scenario}
          </div>

          <div className="space-y-3">
            {content.workedExample.steps.map((st, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-2 text-sm"
              >
                <div className="font-bold text-[#1D1819] text-sm sm:text-base">{st.label}</div>
                <div className="bg-white p-2.5 rounded border border-[#E8E2D9] overflow-x-auto text-[#6E1A2B] text-base">
                  <MathEquation math={st.math} block />
                </div>
                <div className="text-xs sm:text-sm text-[#54484E]">{st.note}</div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-[#FBF6EB] border border-[#E8D3A8] rounded-md text-sm sm:text-base font-semibold text-[#6E1A2B]">
            {content.workedExample.result}
          </div>
        </div>
      </section>

      {/* PART 5: Where the Analogy Breaks */}
      <section className="space-y-4 pt-4 border-t border-[#E8E2D9]">
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
          <span>5. Where the Analogy Breaks</span>
        </h2>

        <div className="bg-[#FFFDF9] border border-[#E8D3A8] border-l-4 border-l-[#6E1A2B] rounded-xl p-5 sm:p-6 flex items-start gap-3.5 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-[#6E1A2B] shrink-0 mt-1" />
          <div className="space-y-1.5">
            <div className="text-xs font-mono-num uppercase tracking-wider font-bold text-[#6E1A2B]">
              Why Real Models Go Beyond the Everyday Scene
            </div>
            <p className="text-sm sm:text-base text-[#2C2426] leading-relaxed">
              {content.analogyBreaks}
            </p>
          </div>
        </div>
      </section>

      {/* PART 6: Quick Check (Situation-Based Quiz) */}
      <section className="space-y-4 pt-4 border-t border-[#E8E2D9]">
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
          <span>6. Quick Check: Test Your Intuition</span>
        </h2>
        <KnowledgeCheck
          lessonSlug={meta.slug}
          questions={content.quiz}
          onAllCorrect={() => {
            if (!completed) toggleLesson(meta.slug);
          }}
        />
      </section>

      {/* Summary & Key Takeaways + Track Project Callout */}
      <section className="space-y-6 pt-4 border-t border-[#EAE2D5]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F191B] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#7A1C30]"></span>
          <span>Key Takeaways</span>
        </h2>
        <ul className="space-y-2.5 text-sm sm:text-base text-[#1F191B]">
          {content.summary.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#B8860B] mt-2 shrink-0"></span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>

        {relatedProject && (
          <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="text-xs font-mono-num uppercase tracking-wider font-bold text-[#7A1C30]">
                Hands-On Track {relatedProject.trackNumber} Project
              </div>
              <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#1D1819]">
                {relatedProject.title} ({relatedProject.funTitle})
              </h3>
              <p className="text-xs sm:text-sm text-[#54484E] max-w-2xl">
                {relatedProject.problemStatement}
              </p>
            </div>
            <Link
              href={`/projects/${relatedProject.slug}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#7A1C30] text-white text-xs sm:text-sm font-semibold hover:bg-[#5F1424] transition-colors shrink-0"
            >
              <span>Open Project Spec & Dataset</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>
        )}
      </section>

      {/* Lesson Navigation Footer */}
      <nav aria-label="Lesson navigation" className="pt-8 border-t border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="w-full sm:w-auto flex items-center gap-3 p-3.5 rounded-lg border border-[#EAE2D5] bg-white hover:border-[#7A1C30] transition-colors text-sm text-left shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5 text-[#786970]" />
            <div>
              <div className="text-[11px] text-[#786970] uppercase font-mono-num font-medium">Previous Lesson ({prev.lessonCode})</div>
              <div className="font-bold text-[#1F191B] text-sm sm:text-base">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block"></div>
        )}

        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="w-full sm:w-auto flex items-center gap-3 p-3.5 rounded-lg border border-[#9B2242] bg-[#7A1C30] text-white hover:bg-[#5F1424] transition-colors text-sm text-right ml-auto shadow-sm"
          >
            <div>
              <div className="text-[11px] text-[#FEF9EE]/80 uppercase font-mono-num font-semibold">Next Lesson ({next.lessonCode})</div>
              <div className="font-bold text-white text-sm sm:text-base">{next.title}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
          </Link>
        ) : (
          <Link
            href="/learn"
            className="w-full sm:w-auto flex items-center gap-2 p-3.5 rounded-lg border border-[#9B2242] bg-[#7A1C30] text-sm font-bold text-white hover:bg-[#5F1424] ml-auto shadow-sm"
          >
            <span>Back to Full Roadmap</span>
            <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
          </Link>
        )}
      </nav>
    </article>
  );
}
