import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // three.js ships untranspiled ESM; Next must transpile it (and the R3F
  // ecosystem pulls it in transitively).
  transpilePackages: ['three'],
};

export default nextConfig;
