/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Cloudflare Turnstile 站点密钥（公开，客户端 widget 使用）；未配置则表单不渲染 widget */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
