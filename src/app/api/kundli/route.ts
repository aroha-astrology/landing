// Proxies the public Kundli-chart endpoint on the real backend. Same
// reasoning as src/app/api/moon-sign/route.ts: keeps JYOTISH_BACKEND_URL out
// of the client bundle, and needs no CORS config since this is server-to-server.
//
// Upstream status codes and bodies (422 malformed input, 429 rate limited)
// are passed straight through rather than collapsed into a generic 500, so
// the client can branch on them.

type KundliRequestBody = {
  date: string;
  time: string;
  tzOffsetMinutes: number;
  lat: number;
  lng: number;
};

function isValidBody(value: unknown): value is KundliRequestBody {
  if (typeof value !== 'object' || value === null) return false;
  const body = value as Record<string, unknown>;
  return (
    typeof body.date === 'string' &&
    typeof body.time === 'string' &&
    typeof body.tzOffsetMinutes === 'number' &&
    Number.isFinite(body.tzOffsetMinutes) &&
    typeof body.lat === 'number' &&
    Number.isFinite(body.lat) &&
    typeof body.lng === 'number' &&
    Number.isFinite(body.lng)
  );
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json(
      { error: { code: 'invalid_json', message: 'Request body must be valid JSON.' } },
      { status: 422 },
    );
  }

  if (!isValidBody(payload)) {
    return Response.json(
      {
        error: {
          code: 'invalid_request',
          message: 'date, time, tzOffsetMinutes, lat and lng are required.',
        },
      },
      { status: 422 },
    );
  }

  const base = process.env.JYOTISH_BACKEND_URL ?? 'https://api.arohaastrology.in';

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/v1/public/kundli-chart`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        date: payload.date,
        time: payload.time,
        tzOffsetMinutes: payload.tzOffsetMinutes,
        lat: payload.lat,
        lng: payload.lng,
      }),
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      {
        error: {
          code: 'upstream_unreachable',
          message: 'Could not reach the calculation service. Please try again.',
        },
      },
      { status: 502 },
    );
  }

  const contentType = upstream.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return Response.json(
      { error: { code: 'upstream_error', message: 'Unexpected response from upstream.' } },
      { status: 502 },
    );
  }

  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}
