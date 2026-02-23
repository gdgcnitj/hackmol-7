import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/login',
        destination: 'https://hackmol-7.devfolio.co/',
        permanent: false,
      },
      {
        source: '/register',
        destination: 'https://hackmol-7.devfolio.co/',
        permanent: false,
      },
      {
        source: '/signup',
        destination: 'https://hackmol-7.devfolio.co/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
