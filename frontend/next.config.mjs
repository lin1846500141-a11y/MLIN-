/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出：构建产物为纯静态文件，直接部署到 Cloudflare Pages。
  // 动态接口 (/api/wiki、/api/messages) 由 frontend/functions/ 下的
  // Pages Functions 提供，与静态资源同域。
  output: 'export',
  images: {
    // 静态导出不支持 Next.js 图片优化服务，图片以原样输出。
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
