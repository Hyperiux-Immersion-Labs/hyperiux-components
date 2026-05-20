import { useRef } from"react";

const CARD_W = 300;
const CARD_H = 450;

export default function SliderCard({ card, index, cardRefs, cardFaceRefs, textureRefs }) {
 return (
 <div
 key={card.num}
 ref={(el) => { cardRefs.current[index] = el; }}
 className="absolute will-change-transform cursor-pointer"
 style={{
 width: CARD_W,
 height: CARD_H,
 top:"50%",
 left:"50%",
 marginTop: -(CARD_H / 2),
 marginLeft: -(CARD_W / 2),
 transformOrigin:"center bottom",
 transformStyle:"preserve-3d",
 }}
 >
 <div
 ref={(el) => { cardFaceRefs.current[index] = el; }}
 className="relative w-full h-full will-change-transform"
 style={{
 borderRadius: 18,
 boxShadow:"0 14px 50px rgba(0,0,0,0.28)",
 background: card.color,
 transformOrigin:"center",
 }}
 >
 <div
 ref={(el) => { textureRefs.current[index] = el; }}
 className="absolute bg-repeat-y mix-blend-screen inset-0 pointer-events-none opacity-0"
 style={{
 borderRadius: 18,
 backgroundImage: `url('${card.textureImage}')`,
 backgroundPosition:"center",
 backgroundRepeat:"repeat",
 backgroundSize:"auto",
"--reveal-x":"50%",
"--reveal-y":"50%",
 WebkitMaskImage:
"radial-gradient(circle 100px at var(--reveal-x) var(--reveal-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 80%, transparent 100%)",
 maskImage:
"radial-gradient(circle 100px at var(--reveal-x) var(--reveal-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 80%, transparent 100%)",
 }}
 />

 {/* Card content */}
 <div className="relative z-10 flex flex-col justify-between h-full p-5">
 <p className="text-white">hero</p>
 <div className="text-center">
 <p className="text-[26px] font-bold text-white tracking-tight leading-tight">
 {card.name}
 </p>
 <p className="text-[10px] text-white/40 font-medium mt-0.5">Early Access</p>
 </div>
 <div className="flex justify-between">
 <div>
 <p className="text-[9px] text-white/35 font-medium">Joined</p>
 <p className="text-[13px] text-white/50 font-semibold">{card.joined}</p>
 </div>
 <div className="text-right">
 <p className="text-[9px] text-white/35 font-medium">Member</p>
 <p className="text-[13px] text-white/50 font-semibold">#{card.num}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}