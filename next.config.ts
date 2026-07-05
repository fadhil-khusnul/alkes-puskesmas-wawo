import type {NextConfig} from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: false,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    } else if (dev) {
      const originalIgnored = config.watchOptions?.ignored;
      let newIgnored: any;
      
      if (originalIgnored instanceof RegExp) {
        newIgnored = new RegExp(`${originalIgnored.source}|public/sw\\.js(?:\\.map)?$`);
      } else if (typeof originalIgnored === 'string') {
        newIgnored = [originalIgnored, '**/public/sw.js', '**/public/sw.js.map'];
      } else if (Array.isArray(originalIgnored)) {
        newIgnored = [...originalIgnored, '**/public/sw.js', '**/public/sw.js.map'];
      } else {
        newIgnored = /public\/sw\.js(?:\.map)?$/;
      }
      
      config.watchOptions = {
        ...config.watchOptions,
        ignored: newIgnored,
      };
    }
    return config;
  },
};

export default withSerwist(nextConfig);
