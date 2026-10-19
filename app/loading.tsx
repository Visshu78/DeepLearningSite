import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-[#0D6E6E] border-t-transparent animate-spin" />
      <div className="text-xs font-mono-num text-[#4A525D] uppercase tracking-wider">
        Loading mathematical modules...
      </div>
    </div>
  );
}
