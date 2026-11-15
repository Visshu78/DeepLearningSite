import React from 'react';
import Link from 'next/link';
import { TRACK_PROJECTS } from '@/lib/lesson-data/projects';
import { CURRICULUM } from '@/lib/lesson-data/curriculum';
import {
  FolderGit2,
  Database,
  ExternalLink,
  ArrowRight,
  Award,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hands-On Projects & Capstones — NeuroPlay',
  description:
    'Portfolio-grade deep learning and machine learning projects with verified external datasets, milestones, interview rubrics, and resume bullet templates.',
};

export default function ProjectsIndexPage() {
  const trackProjects = TRACK_PROJECTS.filter(p => !p.isCapstone);
  const capstones = TRACK_PROJECTS.filter(p => p.isCapstone);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <header className="border-b border-[#EAE2D5] pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FAF2E6] border border-[#EEDAA2] text-[#7A1C30] text-xs font-mono-num font-semibold">
            <FolderGit2 className="w-3.5 h-3.5 text-[#C28E38]" />
            <span>Section 7 • Portfolio-Grade Engineering Projects</span>
          </div>

          <div className="text-xs font-mono-num text-[#54484E] bg-[#FAF5EE] border border-[#EAE2D5] px-3 py-1.5 rounded">
            <strong>{trackProjects.length} Track Projects</strong> + <strong>{capstones.length} Capstones</strong>
          </div>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1D1819] tracking-tight">
          Hands-On Track Projects &amp; Capstones
        </h1>
        <p className="text-base sm:text-lg text-[#54484E] max-w-3xl leading-relaxed">
          Every track culminates in a real, resume-worthy build. Each project links directly to verified public datasets (with lightweight subsets for free Colab GPUs), step-by-step milestones, interview-style rubric questions, and a fill-in-the-numbers resume bullet.
        </p>
      </header>

      {/* Track Projects Grouped by Curriculum Order */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819]">
            Track Projects (In Learning Order)
          </h2>
          <p className="text-xs sm:text-sm text-[#625956]">
            Follow the official NeuroPlay progression: Track 0 (Math Toolkit) → Track 9 (Data Prep) → Tracks 1 through 8.
          </p>
        </div>

        <div className="space-y-6">
          {CURRICULUM.map(track => {
            const projects = trackProjects.filter(p => p.trackNumber === track.number);
            if (projects.length === 0) return null;

            return (
              <div
                key={track.id}
                className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-2xs"
              >
                <div className="px-5 py-3.5 bg-[#FAF5EE] border-b border-[#EAE2D5] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-num font-bold uppercase tracking-wider text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-2.5 py-0.5 rounded">
                      Track {track.number}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#1F191B]">
                      {track.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono-num text-[#625956]">
                    {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                <div className="divide-y divide-[#EAE2D5]">
                  {projects.map(project => (
                    <div
                      key={project.slug}
                      className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[#FDFBF8] transition-colors"
                    >
                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono-num font-semibold px-2 py-0.5 rounded bg-[#FAF2E6] text-[#7A1C30] border border-[#EEDAA2]">
                            “{project.funTitle}”
                          </span>
                          <span className="text-[11px] font-mono-num px-2 py-0.5 rounded bg-[#F4EFEB] text-[#54484E] border border-[#E8E2D9]">
                            {project.difficulty}
                          </span>
                          {project.medicalDisclaimer && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono-num px-2 py-0.5 rounded bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5] font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              Educational Only (Not Diagnosis)
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#1D1819]">
                          {project.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#54484E] leading-relaxed max-w-3xl">
                          {project.problemStatement}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#625956]">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1819]">
                            <Database className="w-3.5 h-3.5 text-[#C28E38]" />
                            <span>Dataset: {project.dataset.name}</span>
                          </span>
                          <a
                            href={project.dataset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#7A1C30] hover:underline font-mono-num"
                          >
                            <span>External Dataset Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7A1C30] text-white text-xs sm:text-sm font-semibold hover:bg-[#5F1424] transition-colors shadow-2xs"
                        >
                          <span>View Project Spec</span>
                          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Capstone Projects */}
      <section className="space-y-6 pt-6 border-t border-[#EAE2D5]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono-num uppercase tracking-wider font-bold text-[#C28E38]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Final Synthesis</span>
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1D1819]">
            Three Capstone Tracks
          </h2>
          <p className="text-xs sm:text-sm text-[#54484E]">
            After completing the core tracks, choose one of three open-ended capstones to anchor your technical portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {capstones.map(capstone => (
            <div
              key={capstone.slug}
              className="bg-white border border-[#E8E2D9] border-t-3 border-t-[#7A1C30] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-num">
                  <span className="inline-flex items-center gap-1 font-bold text-[#7A1C30]">
                    <Award className="w-3.5 h-3.5 text-[#C28E38]" />
                    <span>{capstone.funTitle}</span>
                  </span>
                  <span className="text-[#625956]">{capstone.difficulty}</span>
                </div>

                <h3 className="font-serif-editorial text-lg font-bold text-[#1D1819]">
                  {capstone.title}
                </h3>

                <p className="text-xs text-[#54484E] leading-relaxed">
                  {capstone.problemStatement}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE2D5]">
                <Link
                  href={`/projects/${capstone.slug}`}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-[#7A1C30] hover:text-[#5F1424]"
                >
                  <span>Open Capstone Brief &amp; Rubric</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C28E38]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
