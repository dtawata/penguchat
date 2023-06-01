/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['penguchat-room.s3.amazonaws.com', 'penguchat-users.s3.amazonaws.com'],
  },
}

module.exports = nextConfig