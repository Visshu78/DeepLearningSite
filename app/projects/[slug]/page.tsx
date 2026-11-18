import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TRACK_PROJECTS, getProjectBySlug } from '@/lib/lesson-data/projects';
import { ALL_LESSONS } from '@/lib/lesson-data/curriculum';
import {
  ChevronRight,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  HelpCircle,
  Briefcase,
  Rocket,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { ProjectCompletionTracker } from '@/components/projects/ProjectCompletionTracker';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return TRACK_PROJECTS.map(p => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found — NeuroPlay' };
  return {
    title: `${project.title} — NeuroPlay Project`,
    description: project.problemStatement,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedLessons = ALL_LESSONS.filter(
    l => l.relatedProjectSlug === project.slug || l.moduleNumber === project.trackNumber
  );

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#786970]">
        <Link href="/" className="hover:text-[#7A1C30] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
        <Link href="/projects" className="hover:text-[#7A1C30] transition-colors">Projects</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
        <span className="text-[#1F191B] font-semibold truncate">{project.title}</span>
      </nav>

      {/* Prominent Medical / Clinical Disclaimer Banner (Required for Chest X-Ray Project) */}
      {project.medicalDisclaimer && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-xl p-5 sm:p-6 flex items-start gap-3.5 shadow-xs"
        >
          <AlertTriangle className="w-6 h-6 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-mono-num uppercase tracking-wider font-extrabold text-[#991B1B]">
              Mandatory Educational Disclaimer — Not for Clinical Diagnosis
            </div>
            <p className="text-xs sm:text-sm text-[#7F1D1D] leading-relaxed font-medium">
              {project.medicalDisclaimer}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-[#EAE2D5]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono-num font-semibold text-[#7A1C30] bg-[#FAF2E6] border border-[#EEDAA2] px-3.5 py-1.5 rounded-md">
            <span>
              {project.isCapstone
                ? 'Capstone Track'
                : `Track ${project.trackNumber}: ${project.trackTitle}`}
            </span>
            <span className="text-[#B8860B]">•</span>
            <span>“{project.funTitle}”</span>
          </div>

          <span className="px-3 py-1 rounded text-xs font-mono-num font-semibold bg-[#F4EFEB] border border-[#E8E2D9] text-[#1D1819]">
            Difficulty: {project.difficulty}
          </span>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1D1819] tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-[#54484E] leading-relaxed">
          {project.problemStatement}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={project.colabStarterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7A1C30] text-white text-xs sm:text-sm font-semibold hover:bg-[#5F1424] transition-colors shadow-2xs"
          >
            <FileCode2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Open Starter Notebook in Google Colab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={project.dataset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#E8E2D9] text-[#1D1819] hover:border-[#7A1C30] text-xs sm:text-sm font-semibold transition-colors"
          >
            <Database className="w-4 h-4 text-[#C28E38]" />
            <span>Visit Official Dataset Source</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#7A1C30]" />
          </a>
        </div>

        {/* Prerequisites & Concrete Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs sm:text-sm">
          <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-1.5">
            <div className="font-mono-num text-[11px] font-bold uppercase tracking-wider text-[#6E1A2B]">
              Prerequisites (Recommended Before Starting)
            </div>
            <p className="text-[#54484E] leading-relaxed">
              {relatedLessons.length > 0
                ? `Complete Track ${project.trackNumber} lessons (${relatedLessons.slice(0, 3).map(l => l.lessonCode).join(', ')}) or jump in directly if you already know the concepts.`
                : 'Recommended after completing the core tracks; you can also start independently.'}
            </p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-1.5">
            <div className="font-mono-num text-[11px] font-bold uppercase tracking-wider text-[#166534]">
              Concrete Deliverables
            </div>
            <p className="text-[#54484E] leading-relaxed">
              Reproducible notebook completing all {project.milestones.length} milestones, logged evaluation metrics, answers to the 3 rubric questions, and your filled-in resume bullet.
            </p>
          </div>
        </div>
      </header>

      {/* 1. Learning Goals */}
      <section className="space-y-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
          <span>1. Engineering &amp; Mathematical Learning Goals</span>
        </h2>

        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 sm:p-6 shadow-2xs">
          <ul className="space-y-2.5 text-sm sm:text-base text-[#1F191B]">
            {project.learningGoals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-1" />
                <span className="leading-relaxed">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Dataset Block (External Links Only, Verified HTTP 200) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif-editorial text-2xl font-bold text-[#1D1819] flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
            <span>2. Dataset Block &amp; One-Line Loader</span>
          </h2>
          <span className="text-xs font-mono-num text-[#625956] bg-[#FAF5EE] border border-[#EAE2D5] px-2.5 py-1 rounded">
            External Link Only • Never Re-Hosted
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D9] border-t-3 border-t-[#C28E38] rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFEAE2]">
            <div>
              <div className="text-xs font-mono-num uppercase tracking-wider text-[#7A1C30] font-bold">
                Primary Public Dataset
              </div>
              <h3 className="text-lg font-bold text-[#1D1819]">
                {project.dataset.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={project.dataset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF2E6] border border-[#EEDAA2] text-[#7A1C30] text-xs font-semibold hover:bg-[#F5E6CE] transition-colors"
              >
                <span>Primary Dataset URL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {project.dataset.secondaryUrl && (
                <a
                  href={project.dataset.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF8F5] border border-[#E8E2D9] text-[#54484E] text-xs font-semibold hover:text-[#1D1819] transition-colors"
                >
                  <span>{project.dataset.secondaryName || 'Alternate Dataset'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3 space-y-1">
              <div className="text-[#786970] font-mono-num uppercase">Size &amp; Footprint</div>
              <div className="font-semibold text-[#1D1819]">{project.dataset.size}</div>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3 space-y-1">
              <div className="text-[#786970] font-mono-num uppercase">License</div>
              <div className="font-semibold text-[#1D1819]">{project.dataset.license}</div>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3 space-y-1">
              <div className="text-[#786970] font-mono-num uppercase">Expected Download Time</div>
              <div className="font-semibold text-[#1D1819]">{project.dataset.downloadTime}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#625956]">
              Python / Colab Loader Snippet
            </div>
            <pre className="bg-[#1D1819] text-[#FAF8F5] p-4 rounded-lg text-xs font-mono-num overflow-x-auto leading-relaxed">
              <code>{project.dataset.loaderSnippet}</code>
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-[#FBF6EB] border border-[#E8D3A8] space-y-1">
              <div className="font-bold text-[#7A1C30]">Lite Subset for Fast Free-Colab Runs (&lt; 10 min):</div>
              <p className="text-[#4A3B3E] leading-relaxed">{project.dataset.liteSubsetNote}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] space-y-1">
              <div className="font-bold text-[#1D1819]">Sample Tensor / Table Shape:</div>
              <p className="text-[#54484E] font-mono-num leading-relaxed">{project.dataset.sampleColumnsOrShape}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Milestones with Expected Outputs */}
      <section className="space-y-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#6E1A2B]"></span>
          <span>3. Build Milestones &amp; Expected Outputs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.milestones.map(m => (
            <div
              key={m.number}
              className="bg-white border border-[#E8E2D9] rounded-xl p-5 space-y-2.5 shadow-2xs"
            >
              <div className="text-xs font-mono-num font-bold uppercase tracking-wider text-[#7A1C30]">
                Milestone {m.number}
              </div>
              <h3 className="text-base font-bold text-[#1D1819]">{m.title}</h3>
              <p className="text-xs sm:text-sm text-[#54484E] leading-relaxed">
                <strong className="text-[#1D1819]">Expected Output: </strong>
                {m.expectedOutput}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Self-Check Rubric (3 Interview-Style Questions) */}
      <section className="space-y-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[#1D1819] flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#C28E38]"></span>
          <span>4. Self-Check Rubric (Interview Defense Questions)</span>
        </h2>

        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 sm:p-6 space-y-3.5 shadow-2xs">
          <p className="text-xs sm:text-sm text-[#625956]">
            Before marking this project complete or adding it to your resume, make sure you can answer these three technical interview questions from your own code and plots:
          </p>
          <div className="space-y-3">
            {project.rubricQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] flex items-start gap-3 text-sm text-[#1D1819]"
              >
                <HelpCircle className="w-4 h-4 text-[#7A1C30] shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Resume Bullet Template & Stretch Goals */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF2E6] border border-[#EEDAA2] rounded-xl p-5 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono-num uppercase tracking-wider font-bold text-[#7A1C30]">
            <Briefcase className="w-4 h-4 text-[#C28E38]" />
            <span>5. Resume Bullet Template (Fill In Your Numbers)</span>
          </div>
          <p className="text-xs sm:text-sm font-mono-num bg-white border border-[#E8D3A8] rounded-lg p-3.5 text-[#1D1819] leading-relaxed">
            “{project.resumeBulletTemplate}”
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-xl p-5 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono-num uppercase tracking-wider font-bold text-[#6E1A2B]">
            <Rocket className="w-4 h-4 text-[#C28E38]" />
            <span>6. Stretch Goals</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[#54484E]">
            {project.stretchGoals.map((sg, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C28E38] mt-2 shrink-0" />
                <span className="leading-relaxed">{sg}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Interactive Project Completion Tracker */}
      <ProjectCompletionTracker
        projectSlug={project.slug}
        milestones={project.milestones.map(m => ({ number: m.number, title: m.title }))}
      />

      {/* Related Track Lessons */}
      {relatedLessons.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#EAE2D5]">
          <h2 className="text-lg font-bold text-[#1D1819] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#7A1C30]" />
            <span>Related Track {project.trackNumber} Lessons</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedLessons.map(lesson => (
              <Link
                key={lesson.slug}
                href={lesson.status === 'available' ? `/learn/${lesson.slug}` : '/learn'}
                className="p-3.5 rounded-lg border border-[#EAE2D5] bg-white hover:border-[#7A1C30] transition-colors space-y-1"
              >
                <div className="text-[11px] font-mono-num text-[#786970]">
                  Lesson {lesson.lessonCode} • {lesson.status === 'available' ? 'Interactive' : 'Upcoming'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1D1819]">
                  {lesson.title}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer Back Link */}
      <div className="pt-4 border-t border-[#EAE2D5]">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#7A1C30] hover:text-[#5F1424]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Track Projects &amp; Capstones</span>
        </Link>
      </div>
    </article>
  );
}
