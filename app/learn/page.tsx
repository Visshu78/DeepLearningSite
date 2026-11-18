'use client';

import React from 'react';
import Link from 'next/link';
import { CURRICULUM, ALL_LESSONS, getLessonBySlug, getTrackStageLabel } from '@/lib/lesson-data/curriculum';
import { getProjectsByTrack, TRACK_PROJECTS } from '@/lib/lesson-data/projects';
import { useLearningProgress } from '@/lib/progress/progressStore';
import { CheckCircle2, Clock, Lock, ArrowRight, Layers, Compass, FolderGit2, Sparkles } from 'lucide-react';

export default function LearnRoadmapPage() {
  const { isCompleted, totalCompleted, mounted } = useLearningProgress();
  const totalAvailableLessons = ALL_LESSONS.filter(l => l.status === 'available').length;
  const totalFreePreviews = ALL_LESSONS.filter(l => l.isFreePreview).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#EAE2D5] pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF2E6] text-[#7A1C30] text-xs font-mono-num font-semibold">
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>10 Tracks • {totalAvailableLessons} Lessons • {TRACK_PROJECTS.length} Projects</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-xs font-mono-num font-bold">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{totalFreePreviews} Free Preview Lessons (1 Per Track)</span>
            </div>
          </div>

          <div className="text-xs font-mono-num text-[#54484E] bg-[#FAF5EE] border border-[#EAE2D5] px-3 py-1.5 rounded">
            Live Progress: <strong className="text-[#7A1C30]">{mounted ? `${totalCompleted} / ${totalAvailableLessons}` : `0 / ${totalAvailableLessons}`} Lessons Completed</strong>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F191B] tracking-tight">
          Learning Roadmap
        </h1>
        <p className="text-base text-[#54484E] max-w-3xl leading-relaxed">
          Progress cleanly from <strong>Track 0 to Track 9</strong>: start with <strong>Stage 1: Foundations (Track 0)</strong> and <strong>Stage 2: Classical ML (Track 1)</strong>, then move through <strong>Stage 3: Deep Learning (Tracks 2–4)</strong>, <strong>Stage 4: Advanced AI (Tracks 5–8)</strong>, and <strong>Stage 5: Data Engineering (Track 9)</strong>. Every track includes a marked <strong>Free Preview</strong> lesson.
        </p>
      </div>

      {/* Tracks List in Official Learning Order */}
      <div className="space-y-8">
        {CURRICULUM.map((module) => {
          const availableLessonsInTrack = module.lessons.filter(l => l.status === 'available');
          const hasAvailableLessons = availableLessonsInTrack.length > 0;
          const moduleCompletedCount = module.lessons.filter(l => mounted && isCompleted(l.slug)).length;
          const isModuleComplete =
            hasAvailableLessons &&
            moduleCompletedCount === availableLessonsInTrack.length &&
            availableLessonsInTrack.length === module.lessons.length;
          const trackProjects = getProjectsByTrack(module.number);
          const freeLesson = module.lessons.find(l => l.isFreePreview);

          return (
            <section
              key={module.id}
              id={`track-${module.number}`}
              className={`border rounded-lg overflow-hidden transition-all scroll-mt-20 ${
                hasAvailableLessons
                  ? 'border-[#EAE2D5] bg-white shadow-xs'
                  : 'border-[#EAE2D5] bg-[#FAF5EE]/60 opacity-90'
              }`}
            >
              {/* Track Header */}
              <div className="p-5 border-b border-[#EAE2D5] bg-[#FAF5EE] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono-num font-bold uppercase tracking-wider text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-2 py-0.5 rounded">
                      {getTrackStageLabel(module.number)} • Step {module.learningOrder} (Track {module.number})
                    </span>
                    {hasAvailableLessons ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#FBF6EB] border border-[#E8D3A8] text-[#6E1A2B] font-semibold">
                        {availableLessonsInTrack.length} of {module.lessons.length} Interactive Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#F4F4F1] border border-[#D1D1C7] text-[#54484E]">
                        <Lock className="w-2.5 h-2.5" />
                        Upcoming Track
                      </span>
                    )}
                    {freeLesson && (
                      <Link
                        href={`/learn/${freeLesson.slug}`}
                        className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] font-bold hover:bg-[#BBF7D0] transition-colors"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Free Preview: Lesson {freeLesson.lessonCode}</span>
                      </Link>
                    )}
                    {isModuleComplete && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-num px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Track Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#1F191B]">
                    Track {module.number}: {module.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#54484E] font-mono-num">
                  {hasAvailableLessons && (
                    <span>Completed: <strong>{mounted ? moduleCompletedCount : 0}/{availableLessonsInTrack.length}</strong></span>
                  )}
                  <span>{module.lessons.length} Lessons</span>
                </div>
              </div>

              {/* Track Description */}
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
                          <span className="text-xs font-mono-num font-bold text-[#7A1C30] bg-[#FAF2E6] px-2 py-0.5 rounded">
                            {lesson.lessonCode}
                          </span>
                          <h3 className="text-sm font-bold text-[#1F191B]">
                            {lesson.title}
                          </h3>
                          {lesson.isFreePreview && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono-num font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] border border-[#86EFAC] px-2 py-0.5 rounded">
                              <Sparkles className="w-2.5 h-2.5" />
                              Free Preview
                            </span>
                          )}
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

                        <div className="flex items-center gap-1.5 text-[11px] text-[#6E1A2B] bg-[#FAF8F5] border border-[#EAE2D5] px-2.5 py-1 rounded-md w-fit max-w-2xl">
                          <Compass className="w-3 h-3 text-[#C28E38] shrink-0" />
                          <span><strong>Scene:</strong> {lesson.everydayScene}</span>
                        </div>

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
                            <span>
                              {completed
                                ? 'Review Lesson'
                                : lesson.isFreePreview
                                ? 'Start Free Preview'
                                : 'Start Lesson'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#6E7682] px-3 py-1.5 rounded border border-[#EAE2D5] bg-[#FAF5EE]">
                            <Lock className="w-3 h-3" />
                            <span>Upcoming in Track {module.number}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Track Hands-On Projects Footer */}
              {trackProjects.length > 0 && (
                <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#EAE2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1819]">
                    <FolderGit2 className="w-4 h-4 text-[#C28E38] shrink-0" />
                    <span>Hands-On Track {module.number} {trackProjects.length === 1 ? 'Project' : 'Projects'}:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {trackProjects.map(proj => (
                      <Link
                        key={proj.slug}
                        href={`/projects/${proj.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E8E2D9] hover:border-[#7A1C30] text-xs font-semibold text-[#7A1C30] transition-colors shadow-2xs"
                      >
                        <span>{proj.funTitle}</span>
                        <ArrowRight className="w-3 h-3 text-[#C28E38]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
