import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This repo has its own package-lock.json, but sits inside a directory tree
  // that also contains an unrelated pnpm-lock.yaml higher up — without this,
  // Next guesses the workspace root from the nearest lockfile and picks the
  // wrong one, which only affects file-tracing output, not correctness, but
  // logs a warning on every build.
  outputFileTracingRoot: path.join(__dirname),

  // Legacy URLs indexed from whatever preceded this repo on the domain
  // (first detected broken in Search Console 5/19/26, five days before this
  // repo's initial commit) — gated app features with no free/public
  // equivalent on the marketing site, so send them somewhere real instead of
  // leaving a 404 for Google and any inbound links to hit.
  async redirects() {
    return [
      { source: '/horoscope/daily', destination: '/', permanent: true },
      { source: '/horoscope/yearly', destination: '/', permanent: true },
      { source: '/baby-names', destination: '/', permanent: true },
      // Legacy path; the new free calculator page lives at /kundli, not
      // /kundli/generate.
      { source: '/kundli/generate', destination: '/kundli', permanent: true },
    ];
  },
};

export default nextConfig;
