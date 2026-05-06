export default async function handler(req, res) {
  const targetPath = req.url.replace('/api/cover', '')
  const targetUrl = `https://uploads.mangadex.org${targetPath}`

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'MochiManga/1.0' },
    })

    if (!response.ok) return res.status(response.status).end()

    const buffer = Buffer.from(await response.arrayBuffer())

    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).send(buffer)
  } catch {
    res.status(500).end()
  }
}
