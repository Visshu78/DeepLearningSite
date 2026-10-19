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
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[#5C626B]">
        <Link href="/" className="hover:text-[#18191B]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#878E99]" />
        <Link href="/learn" className="hover:text-[#18191B]">Learn</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#878E99]" />
        <span className="text-[#878E99]">Module {meta.moduleNumber}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#878E99]" />
        <span className="text-[#18191B] font-medium truncate">{meta.title}</span>
      </nav>

      {/* Lesson Header */}
      <header className="space-y-4 pb-6 border-b border-[#E6E6E0]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold text-[#0D6E6E] bg-[#EEF7F7] px-2.5 py-1 rounded">
            <span>Module {meta.moduleNumber}: {meta.moduleName}</span>
            <span>•</span>
            <span>Lesson {meta.lessonNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-[#5C626B]">
              <Clock className="w-3.5 h-3.5 text-[#878E99]" />
              <span>{meta.duration}</span>
            </span>

            {/* Mark as Completed Button */}
            <button
              onClick={() => toggleLesson(meta.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors border ${
                completed
                  ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                  : 'bg-white border-[#E6E6E0] text-[#18191B] hover:border-[#0D6E6E]'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${completed ? 'text-[#166534]' : 'text-[#878E99]'}`} />
              <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18191B] tracking-tight">
          {meta.title}
        </h1>
        <p className="text-base text-[#5C626B] leading-relaxed max-w-3xl">
          {meta.subtitle}
        </p>

        {meta.prerequisites.length > 0 && (
          <div className="text-xs text-[#5C626B] flex items-center gap-1.5 pt-1">
            <span className="font-semibold text-[#18191B]">Prerequisites:</span>
            {meta.prerequisites.map(prereq => (
              <Link
                key={prereq}
                href={`/learn/${prereq}`}
                className="text-[#0D6E6E] hover:underline bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E6E0]"
              >
                {prereq.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 1. Intuition Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#18191B] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D6E6E]"></span>
          <span>1. Conceptual Intuition</span>
        </h2>
        <div className="space-y-3 text-sm text-[#18191B] leading-relaxed max-w-4xl">
          {content.intuition.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* 2. Interactive Visualization Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#18191B] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0D6E6E]"></span>
            <span>2. Interactive Visualization & Experimentation</span>
          </h2>
          <span className="text-xs text-[#5C626B] font-mono-num">Live Parameter Workbench</span>
        </div>

        <div>{visualizer}</div>
      </section>

      {/* 3. Mathematical Formulations (KaTeX Rendered) */}
      <section className="space-y-4 pt-4 border-t border-[#E6E6E0]">
        <h2 className="text-lg font-bold text-[#18191B] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D6E6E]"></span>
          <span>3. Mathematical Formulations</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.mathFormulas.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-3 shadow-xs"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191B]">
                {f.name}
              </h3>
              <div className="bg-[#F8FBFB] border-l-3 border-[#0D6E6E] p-3 rounded-r text-[#18191B] overflow-x-auto">
                <MathEquation math={f.latex} block />
              </div>
              <p className="text-xs text-[#5C626B] leading-relaxed">
                {f.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Worked Numerical Example (KaTeX Rendered) */}
      <section className="space-y-4 pt-4 border-t border-[#E6E6E0]">
        <h2 className="text-lg font-bold text-[#18191B] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D6E6E]"></span>
          <span>4. Step-by-Step Worked Numerical Example</span>
        </h2>
        <div className="bg-[#FAF8F5] border border-[#E6E6E0] rounded-lg p-5 space-y-4">
          <div className="text-xs font-medium text-[#18191B] italic">
            Scenario: {content.workedExample.scenario}
          </div>

          <div className="space-y-2.5">
            {content.workedExample.steps.map((st, i) => (
              <div
                key={i}
                className="bg-white border border-[#E6E6E0] rounded p-3 text-xs space-y-1.5"
              >
                <div className="font-semibold text-[#18191B]">{st.label}</div>
                <div className="bg-[#FCFCFA] p-2 rounded border border-[#E6E6E0] overflow-x-auto text-[#0D6E6E]">
                  <MathEquation math={st.math} block />
                </div>
                <div className="text-[11px] text-[#5C626B]">{st.note}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#EEF7F7] border border-[#B7E2E2] rounded text-xs font-semibold text-[#0D6E6E]">
            {content.workedExample.result}
          </div>
        </div>
      </section>

      {/* 5. Interactive Knowledge Check Quiz */}
      <section className="pt-4 border-t border-[#E6E6E0]">
        <KnowledgeCheck
          questions={content.quiz}
          onAllCorrect={() => {
            if (!completed) toggleLesson(meta.slug);
          }}
        />
      </section>

      {/* 6. Summary & Key Takeaways */}
      <section className="space-y-4 pt-4 border-t border-[#E6E6E0]">
        <h2 className="text-lg font-bold text-[#18191B] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D6E6E]"></span>
          <span>Key Takeaways</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-[#18191B]">
          {content.summary.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E6E] mt-2 shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lesson Navigation Footer */}
      <nav aria-label="Lesson navigation" className="pt-8 border-t border-[#E6E6E0] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="w-full sm:w-auto flex items-center gap-2 p-3 rounded border border-[#E6E6E0] bg-white hover:border-[#0D6E6E] transition-colors text-xs text-left"
          >
            <ChevronLeft className="w-4 h-4 text-[#5C626B]" />
            <div>
              <div className="text-[10px] text-[#878E99] uppercase font-mono-num">Previous Lesson</div>
              <div className="font-semibold text-[#18191B]">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block"></div>
        )}

        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="w-full sm:w-auto flex items-center gap-2 p-3 rounded border border-[#0D6E6E] bg-[#EEF7F7] hover:bg-[#E0F2F2] transition-colors text-xs text-right ml-auto"
          >
            <div>
              <div className="text-[10px] text-[#0D6E6E] uppercase font-mono-num font-semibold">Next Lesson</div>
              <div className="font-bold text-[#18191B]">{next.title}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0D6E6E]" />
          </Link>
        ) : (
          <Link
            href="/learn"
            className="w-full sm:w-auto flex items-center gap-2 p-3 rounded border border-[#0D6E6E] bg-[#EEF7F7] text-xs font-bold text-[#0D6E6E] ml-auto"
          >
            <span>Back to Full Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}
