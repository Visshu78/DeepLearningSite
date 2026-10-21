'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-block px-3 py-1 bg-[#FEF2F2] border border-[#FCA5A5] rounded font-mono-num text-xs text-[#991B1B] font-bold">
        Application Error
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F191B] tracking-tight">
        A runtime computation error occurred.
      </h1>
      <p className="text-sm text-[#54484E] leading-relaxed max-w-md mx-auto">
        {error.message || 'An unexpected mathematical error interrupted execution.'}
      </p>
      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#7A1C30] text-white text-xs font-semibold hover:bg-[#5F1424] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[#EAE2D5] bg-white text-xs font-semibold text-[#1F191B] hover:border-[#7A1C30] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
