import Link from'next/link'

export default function page() {
 return (
 <div className="min-h-screen bg-neutral-950 flex items-center justify-center gap-6">
 <Link
 href="/loaders/lines-loading/option-1"
 className="px-6 py-3 bg-white text-black rounded-lg font-mono text-sm hover:bg-neutral-200 transition-colors"
 >
 Option 1 — Line Reveal
 </Link>
 <Link
 href="/loaders/lines-loading/option-2"
 className="px-6 py-3 bg-white text-black rounded-lg font-mono text-sm hover:bg-neutral-200 transition-colors"
 >
 Option 2 — Center Lines
 </Link>
 </div>
 )
}
