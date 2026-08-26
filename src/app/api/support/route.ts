// Proxies the public support-ticket endpoint on the real backend. Same
// reasoning as src/app/api/kundli/route.ts: keeps JYOTISH_BACKEND_URL out of
// the client bundle, and needs no CORS config since this is server-to-server.
//
// Upstream status codes and bodies (422 malformed input, 429 rate limited)
// are passed straight through rather than collapsed into a generic 500, so
// the client can branch on them.

type SupportTicketRequestBody = {
  name: string;
  email: string;
  category: string;
  message: string;
  website: string;
};

function isValidBody(value: unknown): value is SupportTicketRequestBody {
  if (typeof value !== 'object' || value === null) return false;
  const body = value as Record<string, unknown>;
  return (
    typeof body.name === 'string' &&
    typeof body.email === 'string' &&
    typeof body.category === 'string' &&
    typeof body.message === 'string' &&
    typeof body.website === 'string'
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
          message: 'name, email, category and message are required.',
        },
      },
      { status: 422 },
    );
  }

  const base = process.env.JYOTISH_BACKEND_URL ?? 'https://api.arohaastrology.in';

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/v1/public/support/tickets`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        category: payload.category,
        message: payload.message,
        website: payload.website,
      }),
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      {
        error: {
          code: 'upstream_unreachable',
          message: 'Could not reach the support service. Please try again or email us directly.',
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
