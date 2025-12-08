/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "medicalcareercenter.org",
            },
        ],
    },
    experimental: {
        // Skip static generation for pages with force-dynamic
        isrMemoryCacheSize: 0,
    },
    // Optimize build for large number of pages
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
