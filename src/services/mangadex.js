const BASE = import.meta.env.DEV ? 'https://api.mangadex.org' : '/api/mangadex'

export const getCoverUrl = (mangaId, fileName) =>
  `/api/cover/covers/${mangaId}/${fileName}.512.jpg`

// Report only needed for at-home CDN nodes (non-mangadex.org) — skip for proxied URLs
export function reportImageLoad(url, success, duration = 0) {
  if (!url || url.startsWith('/') || url.includes('mangadex.org')) return
  fetch('https://api.mangadex.network/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, success, cached: false, bytes: 0, duration }),
  }).catch(() => {})
}

export function normalizeManga(manga) {
  const coverRel = manga.relationships?.find(r => r.type === 'cover_art')
  const coverFile = coverRel?.attributes?.fileName
  const attrs = manga.attributes

  const title =
    attrs.title?.en ||
    attrs.title?.['ja-ro'] ||
    Object.values(attrs.title || {})[0] ||
    'Unknown'

  const contentType = { ja: 'manga', ko: 'manhwa', zh: 'manhua', 'zh-hk': 'manhua' }[attrs.originalLanguage] || 'manga'

  const relativeTime = (iso) => {
    if (!iso) return ''
    const diff = Math.floor((Date.now() - new Date(iso)) / 86400000)
    if (diff === 0) return 'วันนี้'
    if (diff < 7) return `${diff} วันที่แล้ว`
    if (diff < 30) return `${Math.floor(diff / 7)} สัปดาห์ที่แล้ว`
    return `${Math.floor(diff / 30)} เดือนที่แล้ว`
  }

  return {
    id: manga.id,
    title,
    description: attrs.description?.en || attrs.description?.th || '',
    status: attrs.status,
    contentType,
    genres: attrs.tags?.filter(t => t.attributes.group === 'genre').map(t => t.attributes.name.en).slice(0, 4) || [],
    genreIds: attrs.tags?.filter(t => t.attributes.group === 'genre').map(t => t.id).slice(0, 3) || [],
    cover: coverFile ? getCoverUrl(manga.id, coverFile) : null,
    availableLanguages: attrs.availableTranslatedLanguages || [],
    updatedAt: relativeTime(attrs.updatedAt),
    isNew: false,
    year: attrs.year,
  }
}

export function normalizeChapter(ch) {
  const diff = Math.floor((Date.now() - new Date(ch.attributes.publishAt)) / 86400000)
  let updatedAt = 'วันนี้'
  if (diff >= 30) updatedAt = `${Math.floor(diff / 30)} เดือนที่แล้ว`
  else if (diff >= 7) updatedAt = `${Math.floor(diff / 7)} สัปดาห์ที่แล้ว`
  else if (diff > 0) updatedAt = `${diff} วันที่แล้ว`

  return {
    id: ch.id,
    number: ch.attributes.chapter || '?',
    title: ch.attributes.title || '',
    language: ch.attributes.translatedLanguage,
    pages: ch.attributes.pages,
    updatedAt,
  }
}

export async function fetchPopularManga(limit = 24, offset = 0) {
  const res = await fetch(`${BASE}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[followedCount]=desc`)
  const data = await res.json()
  return { manga: data.data?.map(normalizeManga) || [], total: data.total ?? 0 }
}

export async function fetchLatestManga(limit = 24, offset = 0) {
  const res = await fetch(`${BASE}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[latestUploadedChapter]=desc`)
  const data = await res.json()
  const manga = data.data?.map(m => ({ ...normalizeManga(m), isNew: true })) || []
  return { manga, total: data.total ?? 0 }
}

export async function fetchMangaById(id) {
  const res = await fetch(`${BASE}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`)
  const data = await res.json()
  return normalizeManga(data.data)
}

export async function fetchAllChapters(mangaId) {
  const res = await fetch(`${BASE}/manga/${mangaId}/feed?translatedLanguage[]=th&translatedLanguage[]=en&order[chapter]=desc&limit=500`)
  const data = await res.json()
  return data.data?.map(normalizeChapter) || []
}

export async function fetchChaptersByLang(mangaId, lang) {
  const res = await fetch(`${BASE}/manga/${mangaId}/feed?translatedLanguage[]=${lang}&order[chapter]=asc&limit=500`)
  const data = await res.json()
  return data.data?.map(normalizeChapter) || []
}

export async function fetchChapterPages(chapterId) {
  const res = await fetch(`${BASE}/at-home/server/${chapterId}`)
  const data = await res.json()
  const { chapter } = data
  const files = chapter.dataSaver?.length ? chapter.dataSaver : chapter.data
  const folder = chapter.dataSaver?.length ? 'data-saver' : 'data'
  return files.map(f => `/api/cover/${folder}/${chapter.hash}/${f}`)
}

export async function fetchDoujinshi(limit = 24, offset = 0) {
  const res = await fetch(`${BASE}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includedTags[]=b13b2a48-c720-44a9-9c77-39c9979373fb&contentRating[]=erotica&contentRating[]=pornographic&contentRating[]=suggestive&order[followedCount]=desc`)
  const data = await res.json()
  return { manga: data.data?.map(normalizeManga) || [], total: data.total ?? 0 }
}

export async function fetchMangaByTag(tagId, limit = 24, offset = 0) {
  const res = await fetch(`${BASE}/manga?limit=${limit}&offset=${offset}&includedTags[]=${tagId}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[followedCount]=desc`)
  const data = await res.json()
  return { manga: data.data?.map(normalizeManga) || [], total: data.total ?? 0 }
}

export async function searchManga(query, limit = 20) {
  const res = await fetch(`${BASE}/manga?title=${encodeURIComponent(query)}&limit=${limit}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`)
  const data = await res.json()
  return data.data?.map(normalizeManga) || []
}
