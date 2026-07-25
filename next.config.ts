import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This repo has its own package-lock.json, but sits inside a directory tree
  // that also contains an unrelated pnpm-lock.yaml higher up — without this,
  // Next guesses the workspace root from the nearest lockfile and picks the
  // wrong one, which only affects file-tracing output, not correctness, but
  // logs a warning on every build.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
