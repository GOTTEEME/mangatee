import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List, X, Home } from 'lucide-react'
import { fetchMangaById, fetchChaptersByLang, fetchChapterPages, reportImageLoad } from '../services/mangadex'

export default function ChapterReader() {
  const { id, chapterId } = useParams()
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || 'en'
  const navigate = useNavigate()

  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUI, setShowUI] = useState(true)
  const [showChapterList, setShowChapterList] = useState(false)
  const loadStartRef = useRef({})

  useEffect(() => {
    setLoading(true)
    setPages([])
    Promise.all([
      fetchMangaById(id),
      fetchChaptersByLang(id, lang),
      fetchChapterPages(chapterId),
    ]).then(([m, chs, pg]) => {
      setManga(m)
      setChapters(chs)
      setPages(pg)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, chapterId, lang])

  const chapterIndex = chapters.findIndex(c => c.id === chapterId)
  const chapter = chapters[chapterIndex]
  const prevChapter = chapters[chapterIndex - 1] ?? null
  const nextChapter = chapters[chapterIndex + 1] ?? null

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' && prevChapter) navigate(`/manga/${id}/chapter/${prevChapter.id}?lang=${lang}`)
    if (e.key === 'ArrowRight' && nextChapter) navigate(`/manga/${id}/chapter/${nextChapter.id}?lang=${lang}`)
    if (e.key === 'Escape') setShowUI(p => !p)
  }, [nextChapter, prevChapter, id, lang, navigate])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Top bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-transform duration-300 ${showUI ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-1 shrink-0">
            <Link to="/" className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            <Link to={`/manga/${id}`} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </div>

          <div className="text-center min-w-0 px-2">
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
              {loading ? '...' : manga?.title}
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {chapter ? `ตอนที่ ${chapter.number}` : '...'}
            </p>
          </div>

          <button onClick={() => setShowChapterList(!showChapterList)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0">
            <List className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chapter list sidebar */}
      {showChapterList && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowChapterList(false)} />
          <div className="relative ml-auto w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">รายการตอน</h3>
              <button onClick={() => setShowChapterList(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {chapters.map(ch => (
              <Link
                key={ch.id}
                to={`/manga/${id}/chapter/${ch.id}?lang=${lang}`}
                onClick={() => setShowChapterList(false)}
                className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${ch.id === chapterId ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <span className="text-sm">ตอนที่ {ch.number}</span>
                <span className="text-xs text-gray-400">{ch.updatedAt}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pages */}
      <div className="pt-20 pb-20 cursor-pointer" onClick={() => setShowUI(p => !p)}>
        {loading ? (
          <div className="flex flex-col items-center gap-2 pt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded" style={{ width: '100%', maxWidth: '800px', height: '400px' }} />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">ไม่พบหน้ามังงะ</div>
        ) : (
          <div className="flex flex-col items-center gap-0.5" style={{ padding: '8px 0' }}>
            {pages.map((page, i) => (
              <img
                key={i}
                src={page}
                alt={`หน้า ${i + 1}`}
                style={{ maxWidth: '800px', width: '100%' }}
                className="block select-none"
                loading="lazy"
                onLoadStart={() => { loadStartRef.current[page] = Date.now() }}
                onLoad={() => {
                  const duration = Date.now() - (loadStartRef.current[page] ?? Date.now())
                  reportImageLoad(page, true, duration)
                  delete loadStartRef.current[page]
                }}
                onError={() => {
                  reportImageLoad(page, false)
                  delete loadStartRef.current[page]
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 transition-transform duration-300 ${showUI ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {prevChapter ? (
            <Link
              to={`/manga/${id}/chapter/${prevChapter.id}?lang=${lang}`}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> ตอนก่อน
            </Link>
          ) : <div />}

          {nextChapter ? (
            <Link
              to={`/manga/${id}/chapter/${nextChapter.id}?lang=${lang}`}
              className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl transition-colors"
            >
              ตอนต่อไป <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button disabled className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm rounded-xl border border-gray-200 dark:border-gray-700 cursor-not-allowed">
              ตอนต่อไป <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
