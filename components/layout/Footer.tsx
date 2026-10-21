import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#EAE2D5] bg-[#FAF5EE] mt-16 text-[#54484E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#7A1C30] border border-[#D4AF37]/50 text-[#FEF9EE] flex items-center justify-center text-[10px] font-mono-num font-bold">
                N
              </div>
              <span className="font-semibold text-sm text-[#1F191B]">NeuroPlay</span>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              A visual-first deep learning education platform designed for college students in computer science, machine learning, and artificial intelligence. Built around the cycle of <em>Explain → Experiment → Visualize → Understand → Practice</em>.
            </p>
            <div className="text-[11px] text-[#786970]">
              Strict mathematical correctness: all visualizations are generated from pure analytical equations and tested derivatives.
            </div>
          </div>

          {/* Col 2: Curriculum */}
          <div className="space-y-2 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-[#1F191B]">Core Modules</h5>
            <ul className="space-y-1.5">
              <li><Link href="/learn/what-is-an-artificial-neuron" className="hover:text-[#7A1C30] transition-colors">1. The Artificial Neuron</Link></li>
              <li><Link href="/learn/activation-functions" className="hover:text-[#7A1C30] transition-colors">2. Activation Functions</Link></li>
              <li><Link href="/learn/forward-propagation" className="hover:text-[#7A1C30] transition-colors">3. Forward Propagation</Link></li>
              <li><Link href="/learn/loss-functions" className="hover:text-[#7A1C30] transition-colors">4. Loss Functions & MSE</Link></li>
              <li><Link href="/learn/gradient-descent" className="hover:text-[#7A1C30] transition-colors">5. Gradient Descent</Link></li>
              <li><Link href="/learn/backpropagation-fundamentals" className="hover:text-[#7A1C30] transition-colors">6. Backpropagation</Link></li>
            </ul>
          </div>

          {/* Col 3: Interactive Tools */}
          <div className="space-y-2 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-[#1F191B]">Laboratories</h5>
            <ul className="space-y-1.5">
              <li><Link href="/playground" className="hover:text-[#7A1C30] transition-colors">Neural Network Playground</Link></li>
              <li><Link href="/practice" className="hover:text-[#7A1C30] transition-colors">Interactive Concept Practice</Link></li>
              <li><Link href="/learn" className="hover:text-[#7A1C30] transition-colors">Complete Curriculum Map</Link></li>
              <li><Link href="/about" className="hover:text-[#7A1C30] transition-colors">Design & Pedagogy Mission</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#786970] gap-3">
          <div>
            © 2026 NeuroPlay — Educational Deep Learning Platform.
          </div>
          <div className="text-[#B8860B] font-medium">
            Designed for engineering rigor & mathematical clarity.
          </div>
        </div>
      </div>
    </footer>

  );
}
