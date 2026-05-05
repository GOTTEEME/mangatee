import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, BookOpen, Home, TrendingUp, Grid3X3, ChevronDown, Star, Sun, Moon } from 'lucide-react'
import { genres } from '../data/mockData'
import { searchManga } from '../services/mangadex'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const debounceRef = useRef(null)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(debounceRef.current)
    setSearching(true)
    debounceRef.current = setTimeout(() => {
      searchManga(query, 6).then(data => {
        setResults(data)
        setSearching(false)
      })
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      closeSearch()
    }
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const handleSelect = (id) => {
    navigate(`/manga/${id}`)
    closeSearch()
  }

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) closeSearch()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <BookOpen className="w-9 h-9 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Manga<span className="text-orange-500">Tee</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Home className="w-5 h-5" /> หน้าแรก
            </Link>
            <Link to="/popular" className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5" /> ยอดนิยม
            </Link>
            <div className="relative">
              <button
                onClick={() => setGenreOpen(!genreOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Grid3X3 className="w-5 h-5" /> หมวดหมู่ <ChevronDown className="w-4 h-4" />
              </button>
              {genreOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 grid grid-cols-2 gap-1">
                  {genres.map(g => (
                    <Link
                      key={g.id}
                      to={`/genre/${g.id}`}
                      onClick={() => setGenreOpen(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search + Theme toggle + Mobile menu */}
          <div className="flex items-center gap-1">
            {searchOpen ? (
              <div ref={searchRef} className="relative">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      autoFocus
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="ค้นหามังงะ..."
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-orange-500 w-52 md:w-72 transition-colors"
                    />
                  </div>
                  <button type="button" onClick={closeSearch} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </form>

                {(results.length > 0 || searching) && query.trim() && (
                  <div className="absolute top-full left-0 mt-2 w-52 md:w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    {searching ? (
                      <div className="px-4 py-3 text-sm text-gray-400 animate-pulse">กำลังค้นหา...</div>
                    ) : (
                      <>
                        {results.map(manga => (
                          <button
                            key={manga.id}
                            onClick={() => handleSelect(manga.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                          >
                            {manga.cover && <img src={manga.cover} alt={manga.title} className="w-8 h-11 object-cover rounded-lg shrink-0" />}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{manga.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{manga.contentType} • {manga.status === 'completed' ? 'จบแล้ว' : 'กำลังออก'}</p>
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={() => { navigate(`/search?q=${encodeURIComponent(query.trim())}`); closeSearch() }}
                          className="w-full px-3 py-2.5 text-sm text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors text-left"
                        >
                          ดูผลลัพธ์ทั้งหมดสำหรับ "{query}"
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Search className="w-6 h-6" />
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-col gap-1">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Home className="w-4 h-4" /> หน้าแรก
          </Link>
          <Link to="/popular" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <TrendingUp className="w-4 h-4" /> ยอดนิยม
          </Link>
          <div className="px-3 py-2">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">หมวดหมู่</p>
            <div className="grid grid-cols-3 gap-1">
              {genres.map(g => (
                <Link key={g.id} to={`/genre/${g.id}`} onClick={() => setMenuOpen(false)}
                  className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
