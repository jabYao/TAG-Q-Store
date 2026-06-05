interface SkeletonProps {
 className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
 return (
 <div
 className={`animate-shimmer ${className}`}
 aria-hidden="true"
 />
 )
}

export function ProductCardSkeleton() {
 return (
 <div className="bg-white overflow-hidden border border-gray-100 shadow-sm">
 <Skeleton className="aspect-square -none" />
 <div className="p-3 space-y-2">
 <Skeleton className="h-4 w-3/4" />
 <Skeleton className="h-3 w-1/2" />
 <Skeleton className="h-5 w-1/3" />
 </div>
 </div>
 )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
 return (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
 {Array.from({ length: count }).map((_, i) => (
 <ProductCardSkeleton key={i} />
 ))}
 </div>
 )
}

export function DetailSkeleton() {
 return (
 <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
 <div className="w-full lg:w-[55%] space-y-4">
 <Skeleton className="aspect-square " />
 <div className="flex gap-3">
 {Array.from({ length: 4 }).map((_, i) => (
 <Skeleton key={i} className="w-16 h-16 md:w-20 md:h-20 " />
 ))}
 </div>
 </div>
 <div className="w-full lg:w-[45%] space-y-4">
 <Skeleton className="h-4 w-1/4" />
 <Skeleton className="h-8 w-3/4" />
 <Skeleton className="h-6 w-1/3" />
 <div className="space-y-2 pt-4">
 <Skeleton className="h-10 w-full" />
 <Skeleton className="h-10 w-full" />
 <Skeleton className="h-10 w-full" />
 <Skeleton className="h-10 w-2/3" />
 </div>
 </div>
 </div>
 )
}

export function CartSkeleton() {
 return (
 <div className="flex flex-col lg:flex-row gap-8">
 <div className="flex-1 space-y-4">
 {Array.from({ length: 3 }).map((_, i) => (
 <div key={i} className="flex gap-4 p-4 bg-white border border-gray-100 ">
 <Skeleton className="w-20 h-20 md:w-24 md:h-24 shrink-0" />
 <div className="flex-1 space-y-2">
 <Skeleton className="h-4 w-3/4" />
 <Skeleton className="h-3 w-1/2" />
 <div className="flex justify-between items-center mt-3">
 <Skeleton className="h-6 w-20" />
 <Skeleton className="h-8 w-24 " />
 </div>
 </div>
 </div>
 ))}
 </div>
 <div className="w-full lg:w-[380px] shrink-0">
 <div className="bg-white border border-gray-100 p-6 space-y-4">
 <Skeleton className="h-5 w-1/2" />
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-px w-full" />
 <Skeleton className="h-8 w-full" />
 <Skeleton className="h-12 w-full " />
 </div>
 </div>
 </div>
 )
}

export function OrderListSkeleton({ count = 5 }: { count?: number }) {
 return (
 <div className="space-y-3">
 {Array.from({ length: count }).map((_, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 ">
 <div className="flex items-center gap-4">
 <Skeleton className="w-8 h-8 " />
 <div className="space-y-1.5">
 <Skeleton className="h-4 w-32" />
 <Skeleton className="h-3 w-24" />
 </div>
 </div>
 <div className="text-right space-y-1.5">
 <Skeleton className="h-4 w-20 ml-auto" />
 <Skeleton className="h-3 w-16 ml-auto" />
 </div>
 </div>
 ))}
 </div>
 )
}

export function CategoryCardSkeleton() {
 return (
 <div className="bg-white overflow-hidden border border-gray-100 shadow-sm">
 <Skeleton className="aspect-square -none" />
 <div className="p-4 space-y-2 text-center">
 <Skeleton className="h-5 w-1/2 mx-auto" />
 <Skeleton className="h-3 w-1/3 mx-auto" />
 </div>
 </div>
 )
}

export function HeroSkeleton() {
 return (
 <div className="bg-gradient-to-br from-primary to-[#081d55] py-16 md:py-24 lg:py-32">
 <div className="max-w-7xl mx-auto px-4 lg:px-6">
 <div className="max-w-2xl space-y-4">
 <Skeleton className="h-12 md:h-16 w-3/4 bg-white/20" />
 <Skeleton className="h-5 w-full bg-white/10" />
 <Skeleton className="h-5 w-5/6 bg-white/10" />
 <Skeleton className="h-12 w-40 bg-gold/40 mt-6" />
 </div>
 </div>
 </div>
 )
}

export function HomeSectionSkeleton() {
 return (
 <div className="space-y-6">
 <div className="flex justify-center">
 <Skeleton className="h-8 w-64" />
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {Array.from({ length: 3 }).map((_, i) => (
 <div key={i} className="bg-white overflow-hidden border border-gray-100 shadow-sm">
 <Skeleton className="aspect-square -none" />
 <div className="p-4 space-y-2">
 <Skeleton className="h-5 w-1/2 mx-auto" />
 <Skeleton className="h-4 w-1/3 mx-auto" />
 </div>
 </div>
 ))}
 </div>
 </div>
 )
}
