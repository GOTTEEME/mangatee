export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).end()

  const target = decodeURIComponent(url)

  // Only allow MangaDex domains
  if (!/^https:\/\/([\w-]+\.)?mangadex\.(org|network)\//.test(target)) {
    return res.status(403).end()
  }

  try {
    const response = await fetch(target, {
      headers: { 'User-Agent': 'MochiManga/1.0' },
    })

    if (!response.ok) return res.status(response.status).end()

    const buffer = Buffer.from(await response.arrayBuffer())
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.status(200).send(buffer)
  } catch {
    res.status(502).end()
  }
}
