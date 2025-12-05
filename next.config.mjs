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
};

export default nextConfig;
