/** @type {import('next').NextConfig} */
// add for random user images
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'randomuser.me',
        }, ],
    },
};

export default nextConfig;