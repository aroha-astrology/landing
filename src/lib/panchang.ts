// Server-side fetch helper for the live "today's Panchang" widget. No
// 'use client' — this is called from a Server Component so the fetch never
// ships to the browser bundle and can use Next's fetch cache (revalidate).

export type PanchangData = {
  date: string;
  tithi: {
    number: number;
    name: string;
    paksha: 'Shukla' | 'Krishna';
    deity: string;
    isAuspicious: boolean;
  };
  nakshatra: {
    index: number;
    name: string;
    lord: string;
    pada: number;
    deity: string;
  };
  yoga: {
    index: number;
    name: string;
    isAuspicious: boolean;
  };
  karana: {
    index: number;
    name: string;
    isFixed: boolean;
  };
  vara: string;
  rahuKaal: { start: string; end: string };
  gulikaKaal: { start: string; end: string };
  yamagandaKaal: { start: string; end: string };
  abhijitMuhurta: { start: string; end: string };
  sunriseTime: string;
  sunsetTime: string;
};

export async function getTodayPanchang(): Promise<PanchangData | null> {
  const base = process.env.JYOTISH_BACKEND_URL ?? 'https://api.arohaastrology.in';

  try {
    const res = await fetch(`${base}/v1/panchang`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as PanchangData;
  } catch {
    return null;
  }
}
