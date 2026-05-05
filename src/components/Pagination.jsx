export default function Pagination({ current, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i)
    } else if (
      i === current - delta - 1 ||
      i === current + delta + 1
    ) {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800 disabled:hover:text-gray-600 transition-colors border border-gray-200 dark:border-gray-700"
      >
        ก่อนหน้า
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-gray-400 select-none">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors border ${
              p === current
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 border-gray-200 dark:border-gray-700'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages}
        className="px-3 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800 disabled:hover:text-gray-600 transition-colors border border-gray-200 dark:border-gray-700"
      >
        ถัดไป
      </button>
    </div>
  )
}
