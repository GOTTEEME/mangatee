import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import MangaCard from '../components/MangaCard'
import SkeletonCard from '../components/SkeletonCard'
import { searchManga } from '../services/mangadex'

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) return
    setLoading(true)
    searchManga(query).then(data => {
      setResults(data)
      setLoading(false)
    })
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <SearchIcon className="w-5 h-5 text-orange-500" />
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          ผลการค้นหา: <span className="text-orange-500">"{query}"</span>
        </h1>
        {!loading && <span className="text-gray-400 text-sm">({results.length} รายการ)</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {results.map(m => <MangaCard key={m.id} manga={m} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <SearchIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">ไม่พบมังงะที่ค้นหา</p>
          <Link to="/" className="mt-4 inline-block text-orange-500 hover:text-orange-600 text-sm">กลับหน้าแรก</Link>
        </div>
      )}
    </div>
  )
}
