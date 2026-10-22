'use client';

import React from 'react';
import Link from 'next/link';
import { CURRICULUM, ALL_LESSONS, getLessonBySlug } from '@/lib/lesson-data/curriculum';
import { useLearningProgress } from '@/lib/progress/progressStore';
import { CheckCircle2, Clock, Lock, ArrowRight, Layers } from 'lucide-react';

export default function LearnRoadmapPage() {
  const { isCompleted, totalCompleted, mounted } = useLearningProgress();
  const totalAvailableLessons = ALL_LESSONS.filter(l => l.status === 'available').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#EAE2D5] pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF2E6] text-[#7A1C30] text-xs font-mono-num font-semibold">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Structured Deep Learning Curriculum</span>
          </div>

          <div className="text-xs font-mono-num text-[#54484E] bg-[#FAF5EE] border border-[#EAE2D5] px-3 py-1.5 rounded">
            Overall Progress: <strong className="text-[#7A1C30]">{mounted ? `${totalCompleted} / ${totalAvailableLessons}` : `0 / ${totalAvailableLessons}`} Completed</strong>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F191B] tracking-tight">
          Learning Roadmap
        </h1>
        <p className="text-base text-[#54484E] max-w-2xl leading-relaxed">
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
                  ? 'border-[#EAE2D5] bg-white shadow-xs'
                  : 'border-[#EAE2D5] bg-[#FAF5EE]/60 opacity-80'
              }`}
            >
              {/* Module Header */}
              <div className="p-5 border-b border-[#EAE2D5] bg-[#FAF5EE] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono-num font-bold uppercase tracking-wider text-[#7A1C30]">
                      Module {module.number}
                    </span>
                    {!isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#F4F4F1] border border-[#D1D1C7] text-[#54484E]">
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
                  <h2 className="text-lg font-bold text-[#1F191B]">
                    {module.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#54484E] font-mono-num">
                  {isAvailable && (
                    <span>Completed: <strong>{mounted ? moduleCompletedCount : 0}/{module.lessons.length}</strong></span>
                  )}
                  <span>{module.lessons.length} Lessons</span>
                </div>
              </div>

              {/* Module Description */}
              <div className="px-5 py-3 text-xs text-[#54484E] border-b border-[#EAE2D5] bg-[#FCFCFA]">
                {module.description}
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-[#EAE2D5]">
                {module.lessons.map((lesson) => {
                  const completed = mounted && isCompleted(lesson.slug);
                  const isLessonAvailable = lesson.status === 'available';

                  return (
                    <div
                      key={lesson.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF5EE]/50 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono-num text-[#6E7682]">
                            {module.number}.{lesson.lessonNumber}
                          </span>
                          <h3 className="text-sm font-bold text-[#1F191B]">
                            {lesson.title}
                          </h3>
                          {completed && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono-num text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#54484E] leading-relaxed max-w-2xl">
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
                                    <Link href={`/learn/${p}`} className="text-[#7A1C30] hover:underline">
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
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#7A1C30] text-white hover:bg-[#5F1424] transition-colors"
                          >
                            <span>{completed ? 'Review Lesson' : 'Start Lesson'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#6E7682] px-3 py-1.5 rounded border border-[#EAE2D5] bg-[#FAF5EE]">
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
