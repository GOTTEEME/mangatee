import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BookOpen, Play } from 'lucide-react'

export default function HeroBanner({ manga = [] }) {
  const [current, setCurrent] = useState(0)
  const featured = manga.slice(0, 5)

  useEffect(() => {
    if (featured.length === 0) return
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % featured.length), 4000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (featured.length === 0) {
    return <div className="rounded-2xl h-72 md:h-96 bg-gray-200 dark:bg-gray-800 animate-pulse" />
  }

  const item = featured[current]

  return (
    <div className="relative overflow-hidden rounded-2xl h-72 md:h-96">
      <div className="absolute inset-0 transition-all duration-700">
        {item.cover && <img src={item.cover} alt={item.title} className="w-full h-full object-cover scale-110 blur-sm opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 dark:from-gray-950 via-gray-100/80 dark:via-gray-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center px-6 md:px-10 gap-6">
        {item.cover && (
          <img src={item.cover} alt={item.title} className="hidden sm:block w-32 md:w-40 aspect-[2/3] object-cover rounded-xl shadow-2xl shrink-0" />
        )}
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">แนะนำ</span>
            <span className={`text-xs px-2 py-0.5 rounded-full text-white font-semibold ${item.contentType === 'manhwa' ? 'bg-sky-600' : 'bg-purple-600'}`}>
              {item.contentType === 'manhwa' ? 'มังฮวา' : 'มังงะ'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.title}</h1>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.genres.map(g => (
              <span key={g} className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-700">{g}</span>
            ))}
          </div>
          {item.description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
          )}
          <div className="flex gap-3 mt-1">
            <Link to={`/manga/${item.id}`}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <Play className="w-4 h-4 fill-white" /> เริ่มอ่าน
            </Link>
            <Link to={`/manga/${item.id}`}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-gray-300 dark:border-gray-700">
              <BookOpen className="w-4 h-4" /> รายละเอียด
            </Link>
          </div>
        </div>
      </div>

      <button onClick={() => setCurrent(prev => (prev - 1 + featured.length) % featured.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent(prev => (prev + 1) % featured.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featured.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500'}`} />
        ))}
      </div>
    </div>
  )
}
