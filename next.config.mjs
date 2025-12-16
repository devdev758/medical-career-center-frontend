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

    // 301 Redirects: Old plural URLs to new singular hierarchical URLs
    async redirects() {
        // Define professions that need redirects (plural -> singular)
        const professionRedirects = [
            { old: 'registered-nurses', new: 'registered-nurse' },
            { old: 'licensed-practical-nurses', new: 'licensed-practical-nurse' },
            { old: 'nurse-practitioners', new: 'nurse-practitioner' },
            { old: 'physician-assistants', new: 'physician-assistant' },
            { old: 'physical-therapists', new: 'physical-therapist' },
            { old: 'occupational-therapists', new: 'occupational-therapist' },
            { old: 'respiratory-therapists', new: 'respiratory-therapist' },
            { old: 'medical-assistants', new: 'medical-assistant' },
            { old: 'dental-hygienists', new: 'dental-hygienist' },
            { old: 'dental-assistants', new: 'dental-assistant' },
            { old: 'pharmacy-technicians', new: 'pharmacy-technician' },
            { old: 'phlebotomists', new: 'phlebotomist' },
            { old: 'emt-paramedics', new: 'emt-paramedic' },
            { old: 'surgical-technologists', new: 'surgical-technologist' },
            { old: 'radiologic-technologists', new: 'radiologic-technologist' },
            { old: 'ultrasound-technicians', new: 'ultrasound-technician' },
        ];

        const redirects = [];

        for (const prof of professionRedirects) {
            // Hub page: /registered-nurses -> /registered-nurse
            redirects.push({
                source: `/${prof.old}`,
                destination: `/${prof.new}`,
                permanent: true,
            });

            // Old spoke pages to new hierarchical structure
            // /registered-nurses-salary -> /registered-nurse/salary
            redirects.push({
                source: `/${prof.old}-salary`,
                destination: `/${prof.new}/salary`,
                permanent: true,
            });

            // /registered-nurses-jobs -> /registered-nurse/jobs
            redirects.push({
                source: `/${prof.old}-jobs`,
                destination: `/${prof.new}/jobs`,
                permanent: true,
            });

            // /how-to-become-registered-nurses -> /registered-nurse/how-to-become
            redirects.push({
                source: `/how-to-become-${prof.old}`,
                destination: `/${prof.new}/how-to-become`,
                permanent: true,
            });

            // /registered-nurses-schools -> /registered-nurse/schools
            redirects.push({
                source: `/${prof.old}-schools`,
                destination: `/${prof.new}/schools`,
                permanent: true,
            });

            // /registered-nurses-certification -> /registered-nurse/license
            redirects.push({
                source: `/${prof.old}-certification`,
                destination: `/${prof.new}/license`,
                permanent: true,
            });

            // /registered-nurses-resume -> /registered-nurse/resume
            redirects.push({
                source: `/${prof.old}-resume`,
                destination: `/${prof.new}/resume`,
                permanent: true,
            });

            // /registered-nurses-interview -> /registered-nurse/interview
            redirects.push({
                source: `/${prof.old}-interview`,
                destination: `/${prof.new}/interview`,
                permanent: true,
            });

            // /registered-nurses-specializations -> /registered-nurse/specializations
            redirects.push({
                source: `/${prof.old}-specializations`,
                destination: `/${prof.new}/specializations`,
                permanent: true,
            });

            // /registered-nurses-skills -> /registered-nurse/skills
            redirects.push({
                source: `/${prof.old}-skills`,
                destination: `/${prof.new}/skills`,
                permanent: true,
            });

            // /registered-nurses-career-path -> /registered-nurse/career-path
            redirects.push({
                source: `/${prof.old}-career-path`,
                destination: `/${prof.new}/career-path`,
                permanent: true,
            });

            // Salary state/city pages: /registered-nurses-salary/ca -> /registered-nurse/salary/ca
            redirects.push({
                source: `/${prof.old}-salary/:state`,
                destination: `/${prof.new}/salary/:state`,
                permanent: true,
            });

            redirects.push({
                source: `/${prof.old}-salary/:state/:city`,
                destination: `/${prof.new}/salary/:state/:city`,
                permanent: true,
            });
        }

        return redirects;
    },
};

export default nextConfig;
