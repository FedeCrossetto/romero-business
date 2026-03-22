import { cn } from '@/lib/utils'

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded-xl animate-pulse',
        className,
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm">
      <Bone className="aspect-square rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Bone className="h-4 w-3/4" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-2/3" />
        <div className="flex items-end justify-between gap-2 mt-1">
          <div className="space-y-1">
            <Bone className="h-6 w-20" />
            <Bone className="h-3 w-12" />
          </div>
          <Bone className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
