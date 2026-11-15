'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { LessonMeta } from '@/lib/lesson-data/curriculum';

interface LockedLessonPaywallProps {
  meta: LessonMeta;
  sceneTitle: string;
}

export function LockedLessonPaywall({ meta, sceneTitle }: LockedLessonPaywallProps) {
  const router = useRouter();
  const [unlocking, setUnlocking] = useState(false);

  const handleInstantDemoUnlock = async () => {
    setUnlocking(true);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'pro.learner@neuroplay.dev',
          name: 'Pro Learner',
          tier: 'pro',
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#54484E] hover:text-[#7A1C30] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to 10-Track Curriculum
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF2E6] border border-[#EEDAA2] text-xs font-mono-num font-bold text-[#7A1C30]">
          <Lock className="w-3 h-3" />
          Pro Track Lesson {meta.lessonCode}
        </span>
      </div>

      {/* Header */}
      <div className="bg-white border border-[#EAE2D5] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-num text-[#786970]">
          <span className="font-bold text-[#7A1C30]">
            Track {meta.moduleNumber}: {meta.moduleName}
          </span>
          <span>•</span>
          <span>Lesson {meta.lessonCode}</span>
          <span>•</span>
          <span>{meta.duration}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F191B] tracking-tight">
          {meta.title}
        </h1>
        <p className="text-base text-[#54484E] leading-relaxed">{meta.subtitle}</p>

        {/* Everyday Scene Teaser */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5">
          <div className="text-[11px] font-mono-num font-bold uppercase tracking-wider text-[#7A1C30]">
            Everyday Scene Preview
          </div>
          <div className="text-sm font-bold text-[#1F191B]">{sceneTitle}</div>
          <p className="text-xs text-[#6E6066]">
            {meta.everydayScene} — full interactive workbench, analytical derivations, worked numerical example, and server-verified quiz are gated on the server for Pro members.
          </p>
        </div>

        {/* Key Takeaways Teaser */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#54484E]">
            What You Will Master in Lesson {meta.lessonCode}
          </div>
          <ul className="space-y-1.5">
            {meta.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#3F363A]">
                <CheckCircle2 className="w-4 h-4 text-[#7A1C30] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Server-Gated Paywall Card */}
      <div className="bg-[#FAF5EE] border-2 border-[#E2D3BD] rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7A1C30] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1F191B]">
              Unlock All 57 Interactive Lessons &amp; 21 Guided Projects
            </h2>
            <p className="text-xs sm:text-sm text-[#54484E] leading-relaxed">
              This lesson is served from a protected server route after an access check so paid lesson content and quiz solutions never leak into the client bundle or page source.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            disabled={unlocking}
            onClick={handleInstantDemoUnlock}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7A1C30] text-white text-sm font-bold hover:bg-[#5E1424] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {unlocking ? 'Unlocking Server Session...' : 'Unlock Full Access (₹500 Pro Pass / Demo Sign-In)'}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#DCD2C2] text-sm font-semibold text-[#1F191B] hover:border-[#7A1C30] transition-colors"
          >
            Account &amp; Access Settings
          </Link>

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#54484E] hover:text-[#1F191B]"
          >
            Browse 10 Free Preview Lessons →
          </Link>
        </div>
      </div>
    </div>
  );
}
