'use client';

import React from 'react';
import Link from 'next/link';
import { CURRICULUM, getLessonBySlug } from '@/lib/lesson-data/curriculum';
import { useLearningProgress } from '@/lib/progress/progressStore';
import { CheckCircle2, Clock, Lock, ArrowRight, Layers } from 'lucide-react';

export default function LearnRoadmapPage() {
  const { isCompleted, totalCompleted, mounted } = useLearningProgress();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E6E6E0] pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF7F7] text-[#0D6E6E] text-xs font-mono-num font-semibold">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Structured Deep Learning Curriculum</span>
          </div>

          <div className="text-xs font-mono-num text-[#4A525D] bg-[#FAF8F5] border border-[#E6E6E0] px-3 py-1.5 rounded">
            Overall Progress: <strong className="text-[#0D6E6E]">{mounted ? `${totalCompleted} / 6` : '0 / 6'} Completed</strong>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18191B] tracking-tight">
          Learning Roadmap
        </h1>
        <p className="text-base text-[#4A525D] max-w-2xl leading-relaxed">
          Master deep learning from first principles through a step-by-step visual progression. Every module connects intuition directly to live mathematical simulations.
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {CURRICULUM.map((module) => {
          const isAvailable = module.status === 'available';
          const moduleCompletedCount = module.lessons.filter(l => mounted && isCompleted(l.slug)).length;
          const isModuleComplete = isAvailable && moduleCompletedCount === module.lessons.length && module.lessons.length > 0;

          return (
            <section
              key={module.id}
              className={`border rounded-lg overflow-hidden transition-all ${
                isAvailable
                  ? 'border-[#E6E6E0] bg-white shadow-xs'
                  : 'border-[#E6E6E0] bg-[#FAF8F5]/60 opacity-80'
              }`}
            >
              {/* Module Header */}
              <div className="p-5 border-b border-[#E6E6E0] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono-num font-bold uppercase tracking-wider text-[#0D6E6E]">
                      Module {module.number}
                    </span>
                    {!isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#F4F4F1] border border-[#D1D1C7] text-[#4A525D]">
                        <Lock className="w-2.5 h-2.5" />
                        Upcoming Curriculum
                      </span>
                    )}
                    {isModuleComplete && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Module Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#18191B]">
                    {module.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#4A525D] font-mono-num">
                  {isAvailable && (
                    <span>Completed: <strong>{mounted ? moduleCompletedCount : 0}/{module.lessons.length}</strong></span>
                  )}
                  <span>{module.lessons.length} Lessons</span>
                </div>
              </div>

              {/* Module Description */}
              <div className="px-5 py-3 text-xs text-[#4A525D] border-b border-[#E6E6E0] bg-[#FCFCFA]">
                {module.description}
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-[#E6E6E0]">
                {module.lessons.map((lesson) => {
                  const completed = mounted && isCompleted(lesson.slug);
                  const isLessonAvailable = lesson.status === 'available';

                  return (
                    <div
                      key={lesson.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/50 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono-num text-[#6E7682]">
                            {module.number}.{lesson.lessonNumber}
                          </span>
                          <h3 className="text-sm font-bold text-[#18191B]">
                            {lesson.title}
                          </h3>
                          {completed && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono-num text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4A525D] leading-relaxed max-w-2xl">
                          {lesson.subtitle}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-[#6E7682] font-mono-num pt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                          {lesson.prerequisites.length > 0 && (
                            <span>
                              Requires:{' '}
                              {lesson.prerequisites.map((p, idx) => {
                                const prereqLesson = getLessonBySlug(p);
                                const title = prereqLesson ? prereqLesson.title : p.replace(/-/g, ' ');
                                return (
                                  <span key={p}>
                                    {idx > 0 && ', '}
                                    <Link href={`/learn/${p}`} className="text-[#0D6E6E] hover:underline">
                                      {title}
                                    </Link>
                                  </span>
                                );
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0">
                        {isLessonAvailable ? (
                          <Link
                            href={`/learn/${lesson.slug}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#0D6E6E] text-white hover:bg-[#085252] transition-colors"
                          >
                            <span>{completed ? 'Review Lesson' : 'Start Lesson'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#6E7682] px-3 py-1.5 rounded border border-[#E6E6E0] bg-[#FAF8F5]">
                            <Lock className="w-3 h-3" />
                            <span>In Development</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
