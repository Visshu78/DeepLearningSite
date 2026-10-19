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
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18191B] tracking-tight">
        A runtime computation error occurred.
      </h1>
      <p className="text-sm text-[#4A525D] leading-relaxed max-w-md mx-auto">
        {error.message || 'An unexpected mathematical error interrupted execution.'}
      </p>
      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#0D6E6E] text-white text-xs font-semibold hover:bg-[#085252] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-[#E6E6E0] bg-white text-xs font-semibold text-[#18191B] hover:border-[#0D6E6E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
