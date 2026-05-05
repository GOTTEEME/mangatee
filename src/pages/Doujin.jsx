import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'
import MangaCard from '../components/MangaCard'
import SkeletonCard from '../components/SkeletonCard'
import Pagination from '../components/Pagination'
import { fetchDoujinshi } from '../services/mangadex'

const LIMIT = 24

export default function Doujin() {
  const [manga, setManga] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchDoujinshi(LIMIT, (page - 1) * LIMIT).then(({ manga: m, total: t }) => {
      setManga(m)
      setTotal(t)
      setLoading(false)
    })
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-red-500 rounded-full" />
        <Flame className="w-5 h-5 text-red-500" />
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">โดจิน</h1>
        <span className="text-xs font-bold px-2 py-0.5 bg-red-500 text-white rounded-full">18+</span>
        {!loading && (
          <span className="text-sm text-gray-400">
            (หน้า {page} — {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} จาก {total.toLocaleString()} รายการ)
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : manga.map(m => <MangaCard key={m.id} manga={m} />)
        }
      </div>

      {!loading && (
        <Pagination current={page} total={total} perPage={LIMIT} onChange={setPage} />
      )}
    </div>
  )
}
