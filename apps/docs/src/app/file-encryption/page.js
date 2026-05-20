import EncryptionMarquee from"@/components/FileEncryption/FileEncryption";


const CARDS = [
 {
 id:"card-01",
 number:"4111 1111 4555 1142",
 holder:"Emma Johnson",
 expiry:"09/27",
 gradient:"linear-gradient(135deg, #4ade80 0%, #22c55e 40%, #86efac 70%, #bbf7d0 100%)",
 glowColor:"#4ade80",
 networkColor1:"#f97316",
 networkColor2:"#ef4444",
 },
 {
 id:"card-02",
 number:"5577 0000 5577 0004",
 holder:"Chris Smith",
 expiry:"04/28",
 gradient:"linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
 glowColor:"#818cf8",
 networkColor1:"#f59e0b",
 networkColor2:"#fbbf24",
 },
 {
 id:"card-03",
 number:"3782 8224 6310 005",
 holder:"Aria Chen",
 expiry:"11/26",
 gradient:"linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
 glowColor:"#c084fc",
 networkColor1:"#06b6d4",
 networkColor2:"#0ea5e9",
 },
 {
 id:"card-04",
 number:"6011 1111 1111 1117",
 holder:"Marcus Reed",
 expiry:"07/29",
 gradient:"linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
 glowColor:"#38bdf8",
 networkColor1:"#f43f5e",
 networkColor2:"#fb7185",
 },
 {
 id:"card-05",
 number:"4000 0566 5566 5556",
 holder:"Sofia Laurent",
 expiry:"02/27",
 gradient:"linear-gradient(135deg, #f43f5e 0%, #e11d48 40%, #fda4af 100%)",
 glowColor:"#f43f5e",
 networkColor1:"#fbbf24",
 networkColor2:"#f59e0b",
 },
 {
 id:"card-06",
 number:"3714 4963 5398 431",
 holder:"Liam Okafor",
 expiry:"12/28",
 gradient:"linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)",
 glowColor:"#34d399",
 networkColor1:"#6366f1",
 networkColor2:"#818cf8",
 },
];

function seededUnit(index, salt) {
 const value = Math.sin(index * 91.713 + salt * 37.529) * 10000;
 return value - Math.floor(value);
}

const STARS = Array.from({ length: 120 }, (_, i) => ({
 id: i,
 size: seededUnit(i, 1) < 0.3 ? 2 : 1,
 top: `${seededUnit(i, 2) * 100}%`,
 left: `${seededUnit(i, 3) * 100}%`,
 opacity: seededUnit(i, 4) * 0.6 + 0.1,
 duration: `${2 + seededUnit(i, 5) * 4}s`,
 delay: `${seededUnit(i, 6) * 5}s`,
}));

function StarField() {
 return (
 <div className="absolute inset-0 pointer-events-none overflow-hidden">
 {STARS.map((s) => (
 <div
 key={s.id}
 className="absolute rounded-full bg-white"
 style={{
 width: s.size,
 height: s.size,
 top: s.top,
 left: s.left,
 opacity: s.opacity,
 animation: `twinkle ${s.duration} ease-in-out infinite`,
 animationDelay: s.delay,
 }}
 />
 ))}
 </div>
 );
}


/* ══════════════════════════════════════════
 PAGE
══════════════════════════════════════════ */
export default function Page() {
 return (
 <main
 className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
 style={{ background:"#07060f" }}
 >
 <StarField />

 {/* Radial purple ambient */}
 <div
 className="absolute pointer-events-none"
 style={{
 inset: 0,
 background:
"radial-gradient(ellipse 60% 50% at 50% 60%, rgba(109,40,217,0.18) 0%, transparent 70%)",
 }}
 />

 {/* Header */}
 <div className="relative z-10 flex flex-col items-center gap-3 mb-16 text-center px-4">
 <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
 <span className="font-mono text-[10px] text-purple-400/70 tracking-widest uppercase">
 256-bit AES Encryption Active
 </span>
 </div>
 <h1
 className="font-mono font-black text-5xl md:text-6xl tracking-tight"
 style={{
 color:"#f0e8ff",
 textShadow:"0 0 60px rgba(168,85,247,0.4)",
 }}
 >
 CARD{""}
 <span
 className="text-transparent bg-clip-text"
 style={{
 backgroundImage:"linear-gradient(90deg, #a855f7, #818cf8, #c084fc)",
 }}
 >
 VAULT
 </span>
 </h1>
 <p className="font-mono text-purple-300/40 text-sm max-w-sm leading-relaxed">
 Every card is encrypted in real-time as it passes through the beam.
 Zero plaintext. Zero exposure.
 </p>
 </div>

 {/* Marquee */}
 <div className="relative w-full z-10">
 <EncryptionMarquee cards={CARDS} />
 </div>

 {/* Bottom label */}
 <div className="relative z-10 mt-12 flex items-center gap-6 font-mono text-[11px] text-white/20 tracking-widest uppercase">
 <span>AES-256-GCM</span>
 <span className="w-1 h-1 rounded-full bg-white/20" />
 <span>RSA-4096</span>
 <span className="w-1 h-1 rounded-full bg-white/20" />
 <span>ChaCha20-Poly1305</span>
 </div>

 <style>{`
 @keyframes twinkle {
 0%, 100% { opacity: 0.1; }
 50% { opacity: 0.7; }
 }
 `}</style>
 </main>
 );
}
