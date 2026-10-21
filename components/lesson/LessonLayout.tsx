'use client';

import React from 'react';
import Link from 'next/link';
import { LessonMeta, getAdjacentLessons } from '@/lib/lesson-data/curriculum';
import { DetailedLessonContent } from '@/lib/lesson-data/lessonContent';
import { useLearningProgress } from '@/lib/progress/progressStore';
import { KnowledgeCheck } from '@/components/quiz/KnowledgeCheck';
import { MathEquation } from '@/components/equations/MathEquation';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface LessonLayoutProps {
  meta: LessonMeta;
  content: DetailedLessonContent;
  visualizer: React.ReactNode;
}

export function LessonLayout({ meta, content, visualizer }: LessonLayoutProps) {
  const { isCompleted, toggleLesson, mounted } = useLearningProgress();
  const completed = mounted && isCompleted(meta.slug);
  const { prev, next } = getAdjacentLessons(meta.slug);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[#786970]">
        <Link href="/" className="hover:text-[#7A1C30] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B]" />
        <Link href="/learn" className="hover:text-[#7A1C30] transition-colors">Learn</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B]" />
        <span className="text-[#54484E]">Module {meta.moduleNumber}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B]" />
        <span className="text-[#1F191B] font-semibold truncate">{meta.title}</span>
      </nav>

      {/* Lesson Header */}
      <header className="space-y-4 pb-6 border-b border-[#EAE2D5]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-3 py-1 rounded shadow-2xs">
            <span>Module {meta.moduleNumber}: {meta.moduleName}</span>
            <span className="text-[#B8860B]">•</span>
            <span>Lesson {meta.lessonNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-[#54484E]">
              <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{meta.duration}</span>
            </span>

            {/* Mark as Completed Button */}
            <button
              onClick={() => toggleLesson(meta.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border ${
                completed
                  ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                  : 'bg-white border-[#EAE2D5] text-[#1F191B] hover:border-[#7A1C30] hover:text-[#7A1C30]'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${completed ? 'text-[#166534]' : 'text-[#786970]'}`} />
              <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F191B] tracking-tight">
          {meta.title}
        </h1>
        <p className="text-base text-[#54484E] leading-relaxed max-w-3xl">
          {meta.subtitle}
        </p>

        {meta.prerequisites.length > 0 && (
          <div className="text-xs text-[#54484E] flex items-center gap-1.5 pt-1">
            <span className="font-semibold text-[#1F191B]">Prerequisites:</span>
            {meta.prerequisites.map(prereq => (
              <Link
                key={prereq}
                href={`/learn/${prereq}`}
                className="text-[#7A1C30] hover:underline bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#EAE2D5] hover:border-[#D4AF37]"
              >
                {prereq.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 1. Intuition Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#1F191B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A1C30]"></span>
          <span>1. Conceptual Intuition</span>
        </h2>
        <div className="space-y-3 text-sm text-[#1F191B] leading-relaxed max-w-4xl">
          {content.intuition.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* 2. Interactive Visualization Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F191B] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]"></span>
            <span>2. Interactive Visualization & Experimentation</span>
          </h2>
          <span className="text-xs text-[#786970] font-mono-num">Live Parameter Workbench</span>
        </div>

        <div>{visualizer}</div>
      </section>

      {/* 3. Mathematical Formulations (KaTeX Rendered) */}
      <section className="space-y-4 pt-4 border-t border-[#EAE2D5]">
        <h2 className="text-lg font-bold text-[#1F191B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A1C30]"></span>
          <span>3. Mathematical Formulations</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.mathFormulas.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-3 shadow-2xs hover:border-[#DFCDB6] transition-colors"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A1C30]">
                {f.name}
              </h3>
              <div className="bg-[#FAF5EE] border-l-3 border-[#7A1C30] p-3 rounded-r text-[#1F191B] overflow-x-auto">
                <MathEquation math={f.latex} block />
              </div>
              <p className="text-xs text-[#54484E] leading-relaxed">
                {f.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Worked Numerical Example (KaTeX Rendered) */}
      <section className="space-y-4 pt-4 border-t border-[#EAE2D5]">
        <h2 className="text-lg font-bold text-[#1F191B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]"></span>
          <span>4. Step-by-Step Worked Numerical Example</span>
        </h2>
        <div className="bg-[#FAF5EE] border border-[#DFCDB6] rounded-lg p-5 space-y-4 shadow-2xs">
          <div className="text-xs font-medium text-[#1F191B] italic">
            Scenario: {content.workedExample.scenario}
          </div>

          <div className="space-y-2.5">
            {content.workedExample.steps.map((st, i) => (
              <div
                key={i}
                className="bg-white border border-[#EAE2D5] rounded p-3 text-xs space-y-1.5"
              >
                <div className="font-semibold text-[#1F191B]">{st.label}</div>
                <div className="bg-[#FDFBF7] p-2 rounded border border-[#EAE2D5] overflow-x-auto text-[#7A1C30]">
                  <MathEquation math={st.math} block />
                </div>
                <div className="text-[11px] text-[#54484E]">{st.note}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#FAF2E6] border border-[#EEDAA2] rounded text-xs font-semibold text-[#7A1C30]">
            {content.workedExample.result}
          </div>
        </div>
      </section>

      {/* 5. Interactive Knowledge Check Quiz */}
      <section className="pt-4 border-t border-[#EAE2D5]">
        <KnowledgeCheck
          questions={content.quiz}
          onAllCorrect={() => {
            if (!completed) toggleLesson(meta.slug);
          }}
        />
      </section>

      {/* 6. Summary & Key Takeaways */}
      <section className="space-y-4 pt-4 border-t border-[#EAE2D5]">
        <h2 className="text-lg font-bold text-[#1F191B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A1C30]"></span>
          <span>Key Takeaways</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-[#1F191B]">
          {content.summary.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-2 shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lesson Navigation Footer */}
      <nav aria-label="Lesson navigation" className="pt-8 border-t border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="w-full sm:w-auto flex items-center gap-2 p-3 rounded border border-[#EAE2D5] bg-white hover:border-[#7A1C30] transition-colors text-xs text-left shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 text-[#786970]" />
            <div>
              <div className="text-[10px] text-[#786970] uppercase font-mono-num">Previous Lesson</div>
              <div className="font-semibold text-[#1F191B]">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block"></div>
        )}

        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="w-full sm:w-auto flex items-center gap-2 p-3 rounded border border-[#9B2242] bg-[#7A1C30] text-white hover:bg-[#5F1424] transition-colors text-xs text-right ml-auto shadow-sm"
          >
            <div>
              <div className="text-[10px] text-[#FEF9EE]/80 uppercase font-mono-num font-semibold">Next Lesson</div>
              <div className="font-bold text-white">{next.title}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        ) : (
          <Link
            href="/learn"
            className="w-full sm:w-auto flex items-center gap-2 p-3 rounded border border-[#9B2242] bg-[#7A1C30] text-xs font-bold text-white hover:bg-[#5F1424] ml-auto shadow-sm"
          >
            <span>Back to Full Roadmap</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        )}
      </nav>
    </article>

  );
}
