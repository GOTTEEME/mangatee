import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SectionHeader({ title, icon: Icon, href }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-orange-500 rounded-full" />
        {Icon && <Icon className="w-5 h-5 text-orange-500" />}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {href && (
        <Link to={href} className="flex items-center gap-1 text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
          ดูทั้งหมด <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
