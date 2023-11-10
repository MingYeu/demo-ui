/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: process.env.api_url + '/api/:path*',
            },
        ];
    },
    i18n,
};

module.exports = nextConfig;
