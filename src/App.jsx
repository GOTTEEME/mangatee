import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import MangaDetail from './pages/MangaDetail'
import ChapterReader from './pages/ChapterReader'
import Popular from './pages/Popular'
import Search from './pages/Search'
import Latest from './pages/Latest'
import Genre from './pages/Genre'
import Doujin from './pages/Doujin'

function Layout() {
  const location = useLocation()
  const isReader = location.pathname.includes('/chapter/')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
      <ScrollToTop />
      {!isReader && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/manga/:id/chapter/:chapterId" element={<ChapterReader />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/search" element={<Search />} />
          <Route path="/genre/:tagId" element={<Genre />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/all" element={<Popular />} />
          <Route path="/doujin" element={<Doujin />} />
        </Routes>
      </main>
      {!isReader && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  )
}
