import { useState, useEffect } from 'react'
import { Clock, TrendingUp, Flame, Sparkles, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import MangaCard from '../components/MangaCard'
import SkeletonCard from '../components/SkeletonCard'
import SectionHeader from '../components/SectionHeader'
import { fetchPopularManga, fetchLatestManga, fetchDoujinshi } from '../services/mangadex'

const SkeletonGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
)

export default function Home() {
  const [popular, setPopular] = useState([])
  const [latest, setLatest] = useState([])
  const [doujin, setDoujin] = useState([])
  const [loading, setLoading] = useState(true)
  const [doujinLoading, setDoujinLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchPopularManga(24), fetchLatestManga(24)])
      .then(([{ manga: pop }, { manga: lat }]) => {
        setPopular(pop)
        setLatest(lat)
      })
      .finally(() => setLoading(false))

    fetchDoujinshi(24).then(({ manga: d }) => {
      setDoujin(d)
      setDoujinLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-10">
      <HeroBanner manga={popular} />

      <div>
        <SectionHeader title="ใหม่มาแรง" icon={Sparkles} href="/popular" />
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
            {popular.slice(0, 6).map(m => <MangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="อัปเดตล่าสุด" icon={Clock} href="/latest" />
        {loading ? <SkeletonGrid /> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {latest.map(m => <MangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="ยอดนิยม" icon={TrendingUp} href="/popular" />
        {loading ? <SkeletonGrid /> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {popular.map(m => <MangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </div>

      {/* โดจิน 18+ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-red-500 rounded-full" />
            <Flame className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">โดจิน</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-red-500 text-white rounded-full">18+</span>
          </div>
          <Link to="/doujin" className="flex items-center gap-1 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {doujinLoading ? <SkeletonGrid count={24} /> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {doujin.map(m => <MangaCard key={m.id} manga={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}
