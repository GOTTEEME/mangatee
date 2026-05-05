import { Link } from 'react-router-dom'
import useHoverSound from '../hooks/useHoverSound'

const typeLabel = { manga: 'มังงะ', manhwa: 'มังฮวา', manhua: 'มังฮวา' }
const typeBg = { manga: 'bg-purple-600', manhwa: 'bg-sky-600', manhua: 'bg-green-600' }

export default function MangaCard({ manga }) {
  const playHover = useHoverSound()

  return (
    <Link to={`/manga/${manga.id}`} className="group block" onMouseEnter={playHover}>
      <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 aspect-[2/3]">
        {manga.cover ? (
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs text-center px-2">
            {manga.title}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${typeBg[manga.contentType] || 'bg-gray-600'}`}>
            {typeLabel[manga.contentType] || 'มังงะ'}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-8 left-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${manga.status === 'completed' ? 'bg-blue-600' : 'bg-orange-500'}`}>
            {manga.status === 'completed' ? 'จบแล้ว' : 'กำลังออก'}
          </span>
        </div>

        {/* UP badge */}
        {manga.isNew && (
          <div className="absolute bottom-2 right-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-green-500 text-white shadow-md animate-pulse">
              UP
            </span>
          </div>
        )}

        {/* Hover info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {manga.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {manga.genres.slice(0, 2).map(g => (
                <span key={g} className="text-xs bg-black/40 text-gray-200 px-1.5 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
          {manga.title}
        </h3>
        {manga.updatedAt && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{manga.updatedAt}</p>
        )}
      </div>
    </Link>
  )
}
