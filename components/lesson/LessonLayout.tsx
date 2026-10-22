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
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs sm:text-sm text-[#786970]">
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
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono-num font-semibold text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-3.5 py-1.5 rounded-md shadow-2xs">
            <span>Module {meta.moduleNumber}: {meta.moduleName}</span>
            <span className="text-[#B8860B]">•</span>
            <span>Lesson {meta.lessonNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-[#625956]">
              <Clock className="w-4 h-4 text-[#C28E38]" />
              <span>{meta.duration}</span>
            </span>

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

      {/* 1. Intuition Section */}
      <section className="space-y-4">
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
          <span>1. Conceptual Intuition</span>
        </h2>
        <div className="space-y-4 text-base sm:text-lg text-[#2C2426] leading-relaxed max-w-4xl">
          {content.intuition.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-lg sm:text-xl text-[#1F191B] leading-relaxed font-normal' : ''}>{p}</p>
          ))}
        </div>
      </section>

      {/* 2. Interactive Visualization Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
            <span>2. Interactive Visualization & Experimentation</span>
          </h2>
          <span className="text-xs sm:text-sm text-[#968A86] font-mono-num font-medium">Live Parameter Workbench</span>
        </div>

        <div>{visualizer}</div>
      </section>

      {/* 3. Mathematical Formulations (KaTeX Rendered) */}
      <section className="space-y-4 pt-4 border-t border-[#E8E2D9]">
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
          <span>3. Mathematical Formulations</span>
        </h2>
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
      </section>

      {/* 4. Worked Numerical Example (KaTeX Rendered) */}
      <section className="space-y-4 pt-4 border-t border-[#E8E2D9]">
        <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
          <span>4. Step-by-Step Worked Numerical Example</span>
        </h2>
        <div className="bg-white border border-[#E8E2D9] rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs">
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

      {/* 5. Interactive Knowledge Check Quiz */}
      <section className="pt-4 border-t border-[#E8E2D9]">
        <KnowledgeCheck
          questions={content.quiz}
          onAllCorrect={() => {
            if (!completed) toggleLesson(meta.slug);
          }}
        />
      </section>

      {/* 6. Summary & Key Takeaways */}
      <section className="space-y-4 pt-4 border-t border-[#EAE2D5]">
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
              <div className="text-[11px] text-[#786970] uppercase font-mono-num font-medium">Previous Lesson</div>
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
              <div className="text-[11px] text-[#FEF9EE]/80 uppercase font-mono-num font-semibold">Next Lesson</div>
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
