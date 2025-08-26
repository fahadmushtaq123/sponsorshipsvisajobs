/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Ensures Next.js builds to static HTML
  transpilePackages: [
    'lexical',
    '@lexical/react',
    '@lexical/nodes',
    '@lexical/html',
    '@lexical/selection',
    '@lexical/history',
    '@lexical/rich-text',
    '@lexical/utils',
    '@lexical/clipboard',
    '@lexical/list',
    '@lexical/table',
    '@lexical/link',
    '@lexical/mark',
    '@lexical/plain-text',
    '@lexical/code',
    '@lexical/markdown',
    '@lexical/offset',
    '@lexical/overflow',
    '@lexical/yjs',
    '@lexical/dragon',
    '@lexical/hashtag',
    '@lexical/devtools-core'
  ],
};

module.exports = nextConfig;