import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  signSessionToken,
  getServerSession,
} from '@/lib/auth/session';

export async function GET() {
  const session = await getServerSession();
  return NextResponse.json({ session });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, tier } = body as {
      email?: string;
      name?: string;
      tier?: 'free' | 'pro';
    };

    const cleanEmail = (email || 'student@neuroplay.dev').trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Student').trim();
    const cleanTier: 'free' | 'pro' = tier === 'pro' ? 'pro' : 'free';

    const token = signSessionToken({
      email: cleanEmail,
      name: cleanName,
      tier: cleanTier,
      iat: Date.now(),
    });

    const res = NextResponse.json({
      ok: true,
      session: { email: cleanEmail, name: cleanName, tier: cleanTier },
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
