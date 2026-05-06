import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'dev-image-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/image')) return next()

          const urlParam = new URL(`http://localhost${req.url}`).searchParams.get('url')
          if (!urlParam) return next()

          try {
            const response = await fetch(decodeURIComponent(urlParam))
            res.statusCode = response.status
            res.setHeader('content-type', response.headers.get('content-type') || 'image/jpeg')
            res.end(Buffer.from(await response.arrayBuffer()))
          } catch {
            res.statusCode = 502
            res.end()
          }
        })
      },
    },
  ],
  server: {
    proxy: {
      '/api/mangadex': {
        target: 'https://api.mangadex.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mangadex/, ''),
      },
    },
  },
})
