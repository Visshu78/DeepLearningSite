'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CURRICULUM, ALL_LESSONS } from '@/lib/lesson-data/curriculum';
import { ShieldCheck, Lock, Unlock, LogOut, CheckCircle2 } from 'lucide-react';

interface SessionInfo {
  email: string;
  name: string;
  tier: 'free' | 'pro';
}

export default function LoginPage() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [email, setEmail] = useState('student@neuroplay.dev');
  const [name, setName] = useState('Aarav Sharma');
  const [tier, setTier] = useState<'free' | 'pro'>('pro');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data?.session) {
          setSession(data.session);
          setEmail(data.session.email);
          setName(data.session.name);
          setTier(data.session.tier);
        }
      })
      .catch(() => {});
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, tier }),
      });
      const data = await res.json();
      if (res.ok && data.session) {
        setSession(data.session);
        setStatusMsg(
          data.session.tier === 'pro'
            ? 'Signed in with NeuroPlay Pro access (all 57 lessons unlocked on server).'
            : 'Signed in with Free Preview access (10 free preview lessons unlocked; 47 Pro lessons gated).'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      setSession(null);
      setStatusMsg('Signed out. Paid lessons are now gated on the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono-num font-bold uppercase tracking-wider text-[#7A1C30]">
          <ShieldCheck className="w-4 h-4" />
          Server-Side Access Control
        </div>
        <h1 className="text-3xl font-extrabold text-[#1F191B] tracking-tight">
          Sign In &amp; Curriculum Access
        </h1>
        <p className="text-sm text-[#54484E] leading-relaxed">
          NeuroPlay gates paid lessons on the server using an HTTP-only HMAC-signed session cookie. Free visitors can explore 10 free preview lessons (1 per track) and all project briefs; Pro members unlock all 57 lessons.
        </p>
      </div>

      <div className="bg-white border border-[#EAE2D5] rounded-2xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D5]">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#786970]">
              Current Server Session
            </div>
            <div className="text-sm font-bold text-[#1F191B] mt-0.5">
              {session ? `${session.name} (${session.email})` : 'Not signed in (Free Visitor)'}
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono-num font-bold ${
              session?.tier === 'pro'
                ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                : 'bg-[#FAF2E6] text-[#7A1C30] border border-[#EEDAA2]'
            }`}
          >
            {session?.tier === 'pro' ? (
              <>
                <Unlock className="w-3 h-3" /> Pro Unlocked (57/57)
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" /> Free Tier (10/57)
              </>
            )}
          </span>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="login-name" className="block text-xs font-bold text-[#1F191B] mb-1">
              Full Name
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-[#DCD2C2] text-sm text-[#1F191B]"
              required
            />
          </div>

          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-[#1F191B] mb-1">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-[#DCD2C2] text-sm text-[#1F191B]"
              required
            />
          </div>

          <div>
            <span className="block text-xs font-bold text-[#1F191B] mb-1.5">
              Access Tier
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTier('free')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  tier === 'free'
                    ? 'border-[#7A1C30] bg-[#FDF2F4]'
                    : 'border-[#EAE2D5] bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-bold text-[#1F191B]">Free Tier (₹0)</div>
                <div className="text-[11px] text-[#54484E] mt-0.5">
                  10 Free Preview lessons (1 per track)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTier('pro')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  tier === 'pro'
                    ? 'border-[#7A1C30] bg-[#FDF2F4]'
                    : 'border-[#EAE2D5] bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-bold text-[#7A1C30]">NeuroPlay Pro (₹500)</div>
                <div className="text-[11px] text-[#54484E] mt-0.5">
                  All {ALL_LESSONS.length} lessons across {CURRICULUM.length} tracks
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-[#7A1C30] text-white text-sm font-bold hover:bg-[#5E1424] transition-colors cursor-pointer"
            >
              {loading ? 'Updating Session...' : 'Save Server Session'}
            </button>

            {session && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#DCD2C2] text-xs font-semibold text-[#54484E] hover:text-[#1F191B]"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            )}
          </div>
        </form>

        {statusMsg && (
          <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link href="/learn" className="text-xs font-bold text-[#7A1C30] hover:underline">
          ← Return to the 10-Track Curriculum
        </Link>
      </div>
    </div>
  );
}
