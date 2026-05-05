export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-xl bg-gray-200 dark:bg-gray-800" />
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  )
}
