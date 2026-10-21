import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-block px-3 py-1 bg-[#FAF5EE] border border-[#EAE2D5] rounded font-mono-num text-xs text-[#7A1C30] font-bold">
        Error 404 — Page Not Found
      </div>
      <h1 className="text-3xl font-extrabold text-[#1F191B] tracking-tight">
        The requested resource does not exist.
      </h1>
      <p className="text-sm text-[#54484E] leading-relaxed max-w-md mx-auto">
        The lesson, parameter workbench, or path you attempted to reach could not be located.
      </p>
      <div className="pt-4 flex items-center justify-center gap-3">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#7A1C30] text-white text-xs font-semibold hover:bg-[#5F1424] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Browse Curriculum</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[#EAE2D5] bg-white text-xs font-semibold text-[#1F191B] hover:border-[#7A1C30] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
