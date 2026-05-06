export default async function handler(req, res) {
  const targetPath = req.url.replace('/api/mangadex', '')
  const targetUrl = `https://api.mangadex.org${targetPath}`

  // Forward real client IP so MangaDex assigns the correct at-home CDN node
  const clientIP = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()

  const headers = { 'User-Agent': 'MochiManga/1.0' }
  if (clientIP) headers['X-Forwarded-For'] = clientIP

  try {
    const response = await fetch(targetUrl, { headers })
    const data = await response.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).json(data)
  } catch {
    res.status(500).json({ error: 'Proxy error' })
  }
}
