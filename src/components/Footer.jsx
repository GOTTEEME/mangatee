import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Manga<span className="text-orange-500">Tee</span></span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-500">
            <Link to="/" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">หน้าแรก</Link>
            <Link to="/popular" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">ยอดนิยม</Link>
            <a href="#" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">ติดต่อเรา</a>
            <a href="#" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">DMCA</a>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">© 2026 MangaTee. เนื้อหาทั้งหมดเป็นลิขสิทธิ์ของเจ้าของ</p>
        </div>
      </div>
    </footer>
  )
}
