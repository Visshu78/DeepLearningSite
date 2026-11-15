import React from 'react';
import Link from 'next/link';
import { CURRICULUM } from '@/lib/lesson-data/curriculum';

export function Footer() {
  return (
    <footer className="border-t border-[#E8E2D9] bg-[#F4EFEB] mt-16 text-[#625956]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Col 1: Mission */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#6E1A2B] border border-[#C28E38]/50 text-white flex items-center justify-center text-[10px] font-mono-num font-bold">
                N
              </div>
              <span className="font-semibold text-sm text-[#1D1819]">NeuroPlay</span>
              <span className="text-[10px] font-mono-num uppercase px-1.5 py-0.5 rounded bg-[#FBF6EB] border border-[#E8D3A8] text-[#6E1A2B] font-semibold">
                10 Tracks • 57 Lessons
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              A visual-first deep learning platform for college students in CS, AI, and ML. Understand deep learning by seeing it work: every lesson opens with a relatable daily-life scene, maps each piece to exact tested math, and links to resume-ready projects.
            </p>
            <div className="text-[11px] text-[#968A86]">
              Strict mathematical correctness: all visualizations are generated from pure analytical equations and verified derivatives.
            </div>
          </div>

          {/* Col 2 & 3: 10-Track Curriculum in Official Learning Order */}
          <div className="md:col-span-5 space-y-2 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-[#1D1819]">
              10-Track Learning Path (In Order)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {CURRICULUM.map(track => {
                const freeLesson = track.lessons.find(l => l.isFreePreview) || track.lessons[0];
                return (
                  <Link
                    key={track.id}
                    href={freeLesson ? `/learn/${freeLesson.slug}` : '/learn'}
                    className="hover:text-[#6E1A2B] transition-colors flex items-center gap-1.5 truncate"
                  >
                    <span className="font-mono-num font-bold text-[#6E1A2B] shrink-0">
                      T{track.number}.
                    </span>
                    <span className="truncate">{track.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Col 4: Platform & Laboratories */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-[#1D1819]">Platform &amp; Labs</h5>
            <ul className="space-y-1.5">
              <li><Link href="/learn" className="hover:text-[#6E1A2B] transition-colors">10-Track Curriculum Roadmap (57 Lessons)</Link></li>
              <li><Link href="/projects" className="hover:text-[#6E1A2B] transition-colors">Hands-On Projects &amp; Capstones (21 Projects)</Link></li>
              <li><Link href="/playground" className="hover:text-[#6E1A2B] transition-colors">Neural Network Playground</Link></li>
              <li><Link href="/practice" className="hover:text-[#6E1A2B] transition-colors">Concept Challenges &amp; Practice</Link></li>
              <li><Link href="/about" className="hover:text-[#6E1A2B] transition-colors">Design &amp; Pedagogy Mission</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E8E2D9] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#968A86] gap-3">
          <div>
            © 2026 NeuroPlay — Visual Deep Learning Platform (10 Tracks • 57 Lessons • 21 Projects).
          </div>
          <div className="text-[#C28E38] font-medium">
            Scene first, rigorous verified math second.
          </div>
        </div>
      </div>
    </footer>
  );
}
