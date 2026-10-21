'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLearningProgress } from '@/lib/progress/progressStore';
import { ALL_LESSONS } from '@/lib/lesson-data/curriculum';
import { BookOpen, Sliders, CheckSquare, Info, Menu, X } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { totalCompleted, mounted } = useLearningProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableCount = ALL_LESSONS.filter(l => l.status === 'available').length;

  const navLinks = [
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/playground', label: 'Playground', icon: Sliders },
    { href: '/practice', label: 'Practice', icon: CheckSquare },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-[#6E1A2B] border border-[#C28E38]/60 flex items-center justify-center text-white text-xs font-mono-num font-bold shadow-xs group-hover:bg-[#54111F] transition-colors">
            N
          </div>
          <span className="font-semibold text-base tracking-tight text-[#1D1819] group-hover:text-[#6E1A2B] transition-colors">
            NeuroPlay
          </span>
          <span className="hidden md:inline-block text-[11px] font-mono-num uppercase px-1.5 py-0.5 rounded bg-[#FBF6EB] border border-[#E8D3A8] text-[#6E1A2B] font-semibold">
            Deep Learning Lab
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden sm:flex items-center gap-1 sm:gap-2">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F9EFF1] text-[#6E1A2B] font-semibold border border-[#F5CBD3]'
                    : 'text-[#625956] hover:text-[#6E1A2B] hover:bg-[#F4EFEB]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#6E1A2B]' : 'text-[#968A86]'}`} aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: Progress & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#E8E2D9] bg-white text-[11px] font-mono-num text-[#1D1819] hover:border-[#C28E38] transition-colors shadow-2xs"
            title="Completed lessons out of available foundational modules"
          >
            <span className="w-2 h-2 rounded-full bg-[#C28E38]" aria-hidden="true"></span>
            <span>Progress:</span>
            <strong className="text-[#6E1A2B]">
              {mounted ? `${totalCompleted}/${availableCount}` : `0/${availableCount}`}
            </strong>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 rounded border border-[#EAE2D5] text-[#54484E] hover:text-[#7A1C30] hover:bg-[#FAF5EE]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#EAE2D5] bg-[#FDFBF7] px-4 py-3 space-y-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FDF2F4] text-[#7A1C30] font-semibold border border-[#F5CBD3]'
                    : 'text-[#54484E] hover:text-[#7A1C30]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>

  );
}
