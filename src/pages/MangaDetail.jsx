import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Clock, ChevronRight, Play, Heart, Share2, Globe } from 'lucide-react'
import { fetchMangaById, fetchAllChapters, fetchMangaByTag } from '../services/mangadex'
import MangaCard from '../components/MangaCard'
import SkeletonCard from '../components/SkeletonCard'
import SectionHeader from '../components/SectionHeader'

export default function MangaDetail() {
  const { id } = useParams()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [chapLoading, setChapLoading] = useState(true)
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [selectedLang, setSelectedLang] = useState('th')

  useEffect(() => {
    setLoading(true)
    setChapLoading(true)
    setRelatedLoading(true)
    setRelated([])
    fetchMangaById(id).then(m => {
      setManga(m)
      setLoading(false)
      const defaultLang = m.availableLanguages.includes('th') ? 'th' : 'en'
      setSelectedLang(defaultLang)
      if (m.genreIds?.[0]) {
        fetchMangaByTag(m.genreIds[0], 13).then(({ manga: rel }) => {
          setRelated(rel.filter(r => r.id !== id).slice(0, 12))
          setRelatedLoading(false)
        })
      } else {
        setRelatedLoading(false)
      }
    })
    fetchAllChapters(id).then(chs => {
      setChapters(chs)
      setChapLoading(false)
    })
  }, [id])

  const thChapters = chapters.filter(c => c.language === 'th')
  const enChapters = chapters.filter(c => c.language === 'en')
  const hasThaiChapters = thChapters.length > 0
  const displayedChapters = selectedLang === 'th' ? thChapters : enChapters
  const firstChapter = displayedChapters[displayedChapters.length - 1]
  const latestChapter = displayedChapters[0]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 h-64 mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!manga) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-xl">ไม่พบมังงะนี้</p>
        <Link to="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600">กลับหน้าแรก</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-orange-500 transition-colors">ไม่บอก</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-600 dark:text-gray-300 truncate">{manga.title}</span>
      </div>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          {manga.cover && <img src={manga.cover} alt={manga.title} className="w-full h-full object-cover blur-md opacity-20 scale-110" />}
          <div className="absolute inset-0 bg-gray-100/90 dark:bg-gray-900/90" />
        </div>
        <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row gap-6">
          <div className="shrink-0">
            {manga.cover ? (
              <img src={manga.cover} alt={manga.title} className="w-36 md:w-48 aspect-[2/3] object-cover rounded-xl shadow-2xl" />
            ) : (
              <div className="w-36 md:w-48 aspect-[2/3] rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm text-center px-2">
                ไม่มีรูปภาพ
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{manga.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                manga.status === 'completed'
                  ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-600/30'
                  : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30'
              }`}>
                {manga.status === 'completed' ? 'จบแล้ว' : 'กำลังออก'}
              </span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${manga.contentType === 'manhwa' ? 'bg-sky-600' : 'bg-purple-600'}`}>
                {manga.contentType === 'manhwa' ? 'มังฮวา' : 'มังงะ'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {manga.genres.map(g => (
                <span key={g} className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-700">
                  {g}
                </span>
              ))}
            </div>

            {manga.description && (
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">{manga.description}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-auto">
              {latestChapter && (
                <Link
                  to={`/manga/${id}/chapter/${latestChapter.id}?lang=${selectedLang}`}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" /> อ่านตอนล่าสุด
                </Link>
              )}
              {firstChapter && (
                <Link
                  to={`/manga/${id}/chapter/${firstChapter.id}?lang=${selectedLang}`}
                  className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> อ่านตอนแรก
                </Link>
              )}
              <button className="p-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 rounded-xl border border-gray-300 dark:border-gray-700 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-500 rounded-xl border border-gray-300 dark:border-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-orange-500 rounded-full" />
            <Globe className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">รายการตอน</h2>
            {!chapLoading && (
              <span className="text-sm text-gray-400">({displayedChapters.length} ตอน)</span>
            )}
          </div>

          {/* Language toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => hasThaiChapters && setSelectedLang('th')}
              disabled={!hasThaiChapters}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                selectedLang === 'th'
                  ? 'bg-orange-500 text-white shadow'
                  : hasThaiChapters
                    ? 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              🇹🇭 ไทย
              {!hasThaiChapters && !chapLoading && (
                <span className="ml-1 text-xs opacity-60">(ไม่มี)</span>
              )}
            </button>
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                selectedLang === 'en'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {chapLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : displayedChapters.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>ไม่พบตอนในภาษาที่เลือก</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
            {displayedChapters.map((ch, i) => (
              <Link
                key={ch.id}
                to={`/manga/${id}/chapter/${ch.id}?lang=${selectedLang}`}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  i !== displayedChapters.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-orange-500 font-bold shrink-0">
                    {ch.number}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white truncate max-w-xs">
                    {ch.title || `ตอนที่ ${ch.number}`}
                  </span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" /> {ch.updatedAt}
                </span>
              </Link>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* แนะนำ */}
      {(relatedLoading || related.length > 0) && (
        <div className="mb-6">
          <SectionHeader
            title={`แนะนำในหมวด ${manga?.genres?.[0] || ''}`}
            icon={null}
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {relatedLoading
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              : related.map(m => <MangaCard key={m.id} manga={m} />)
            }
          </div>
        </div>
      )}
    </div>
  )
}
