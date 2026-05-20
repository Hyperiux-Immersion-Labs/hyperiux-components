import Link from"next/link";

export function EffectCard({ effect, children }) {
 return (
 <Link
 href={`/effects/${effect.name}`}
 className="group block rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden hover:border-neutral-700 transition-colors"
 >
 <div className="aspect-video relative overflow-hidden bg-neutral-950 flex items-center justify-center p-8">
 {children}
 </div>
 <div className="p-4 border-t border-neutral-800">
 <h3 className="font-medium text-neutral-200 group-hover:text-white transition-colors">
 {effect.title}
 </h3>
 <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
 {effect.description}
 </p>
 <div className="flex items-center gap-2 mt-3">
 {effect.dependencies?.map((dep) => (
 <span
 key={dep}
 className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
 >
 {dep}
 </span>
 ))}
 </div>
 </div>
 </Link>
 );
}

export function EffectCardSkeleton() {
 return (
 <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden animate-pulse">
 <div className="aspect-video bg-neutral-800" />
 <div className="p-4 border-t border-neutral-800">
 <div className="h-5 bg-neutral-800 rounded w-1/2" />
 <div className="h-4 bg-neutral-800 rounded w-full mt-2" />
 <div className="flex items-center gap-2 mt-3">
 <div className="h-5 w-20 bg-neutral-800 rounded-full" />
 </div>
 </div>
 </div>
 );
}
