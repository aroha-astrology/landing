// Resolves a (city, country) pair — as selected from the curated CITIES list
// used by the Moon-sign/Kundli forms — to real coordinates via Nominatim
// (OpenStreetMap), the same free geocoder the main app's
// app/api/places/geocode route already uses in production. CITIES only
// carries an IANA timezone id, not lat/lng, so this is the only source of
// truth for coordinates on this site; a single "city, country" query is
// reliable here because CITIES is a short, curated list of major cities
// (not the arbitrary village-level input the app's place-picker has to
// handle), so none of that route's district/pincode fallback logic is
// needed.
import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited, clientIp } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  if (isRateLimited(`geocode:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json(null, { status: 429 });
  }

  const city = req.nextUrl.searchParams.get('city')?.trim();
  const country = req.nextUrl.searchParams.get('country')?.trim();
  if (!city) return NextResponse.json(null, { status: 422 });

  const q = [city, country].filter(Boolean).join(', ');
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    format: 'json',
    limit: '1',
    q,
  })}`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'ArohaAstrology/1.0' } });
    if (!res.ok) return NextResponse.json(null, { status: 502 });

    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return NextResponse.json(null, { status: 404 });

    return NextResponse.json({
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    });
  } catch {
    return NextResponse.json(null, { status: 502 });
  }
}
