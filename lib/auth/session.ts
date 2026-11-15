import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'neuroplay_session';

const SECRET_KEY =
  process.env.NEUROPLAY_SESSION_SECRET ||
  'neuroplay-v2-server-hmac-secret-key-2026-production';

export interface SessionPayload {
  email: string;
  name: string;
  tier: 'free' | 'pro';
  iat: number;
}

export function signSessionToken(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expectedSig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('base64url');
  if (
    sig.length !== expectedSig.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  ) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (typeof parsed?.email === 'string' && (parsed.tier === 'free' || parsed.tier === 'pro')) {
      return parsed as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(raw);
}

export async function hasServerPaidAccess(): Promise<boolean> {
  const session = await getServerSession();
  return session?.tier === 'pro';
}
