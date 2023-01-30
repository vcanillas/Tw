/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=UTF-8",
          },
        ],
      },
    ]
  },
  reactStrictMode: true,
}

module.exports = nextConfig
