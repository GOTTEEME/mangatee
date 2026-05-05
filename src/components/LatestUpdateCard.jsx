import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

export default function LatestUpdateCard({ manga }) {
  return (
    <Link to={`/manga/${manga.id}`} className="group flex gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors">
      <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
        <img src={manga.cover} alt={manga.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors truncate">{manga.titleTh}</p>
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/manga/${manga.id}/chapter/${manga.chapters[0].id}`}
            className="text-xs text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            ตอนที่ {manga.chapters[0].number}
          </Link>
          {manga.chapters[1] && (
            <Link
              to={`/manga/${manga.id}/chapter/${manga.chapters[1].id}`}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              ตอนที่ {manga.chapters[1].number}
            </Link>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600">
          <Clock className="w-3 h-3" /> {manga.updatedAt}
        </span>
      </div>
    </Link>
  )
}
