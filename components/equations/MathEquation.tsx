'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathEquationProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function MathEquation({ math, block = false, className = '' }: MathEquationProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`math-block overflow-x-auto py-1 text-sm ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
