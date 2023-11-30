const { withNought } = require('@nought/nextjs');
/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNought(nextConfig, {
  displayName: true,
});
