/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize production builds
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
    },

    // Optimize bundle size - tree-shake lucide icons
    modularizeImports: {
        'lucide-react': {
            transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
        },
    },
};

export default nextConfig;
