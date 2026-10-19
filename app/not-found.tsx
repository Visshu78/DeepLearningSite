import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-block px-3 py-1 bg-[#FAF8F5] border border-[#E6E6E0] rounded font-mono-num text-xs text-[#0D6E6E] font-bold">
        Error 404 — Page Not Found
      </div>
      <h1 className="text-3xl font-extrabold text-[#18191B] tracking-tight">
        The requested resource does not exist.
      </h1>
      <p className="text-sm text-[#4A525D] leading-relaxed max-w-md mx-auto">
        The lesson, parameter workbench, or path you attempted to reach could not be located.
      </p>
      <div className="pt-4 flex items-center justify-center gap-3">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#0D6E6E] text-white text-xs font-semibold hover:bg-[#085252] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Browse Curriculum</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[#E6E6E0] bg-white text-xs font-semibold text-[#18191B] hover:border-[#0D6E6E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
