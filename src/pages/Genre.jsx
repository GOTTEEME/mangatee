import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tag } from 'lucide-react'
import MangaCard from '../components/MangaCard'
import SkeletonCard from '../components/SkeletonCard'
import Pagination from '../components/Pagination'
import { fetchMangaByTag } from '../services/mangadex'
import { genres } from '../data/mockData'

const LIMIT = 24

export default function Genre() {
  const { tagId } = useParams()
  const genre = genres.find(g => g.id === tagId)
  const [manga, setManga] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setPage(1)
  }, [tagId])

  useEffect(() => {
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchMangaByTag(tagId, LIMIT, (page - 1) * LIMIT).then(({ manga: m, total: t }) => {
      setManga(m)
      setTotal(t)
      setLoading(false)
    })
  }, [tagId, page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        <Tag className="w-5 h-5 text-orange-500" />
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {genre?.name || tagId}
        </h1>
        {!loading && (
          <span className="text-sm text-gray-400">
            (หน้า {page} — {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} จาก {total.toLocaleString()} รายการ)
          </span>
        )}
      </div>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map(g => (
          <Link
            key={g.id}
            to={`/genre/${g.id}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              g.id === tagId
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500'
            }`}
          >
            {g.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : manga.map(m => <MangaCard key={m.id} manga={m} />)
        }
      </div>

      {!loading && (
        <Pagination
          current={page}
          total={total}
          perPage={LIMIT}
          onChange={setPage}
        />
      )}
    </div>
  )
}
