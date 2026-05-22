import Collections from "@/components/Arrows/Collections";

const arrows = () => {
  return (
    <>
      {/* Desktop */}
      <div className="max-sm:hidden">
        <Collections />
      </div>

      {/* Mobile */}
     <div className="hidden max-sm:flex min-h-screen py-10 relative flex-col items-start justify-between bg-[#f4f4f1] px-8">

  {/* Top */}
  <div className="w-full">
    <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-black/80">
      Desktop Experience
    </p>

    <div className="mt-4 h-px w-full bg-black/30" />
  </div>

    <div className="mb-5 flex h-12 w-12 absolute bottom-7 right-28 items-center justify-center rounded-full text-black border border-black/50  text-2xl">
        ↗
      </div>

  {/* Bottom */}
  <div className="w-full">
    <div className="text-left">
      
    
      <h1 className="font-mono text-[12vw] leading-[0.95] font-black uppercase text-black">
        Interactive
        <br />
        Arrows
        
        
      </h1>

      <p className="mt-6 absolute left-1/2 top-90 -translate-x-1/2 rounded-lg bg-black/10 px-5 py-3 text-center text-base leading-[1.3] text-black backdrop-blur-sm">
        Open on desktop to experience this effect
      </p>
    </div>
  </div>

</div>
    </>
  );
};

export default arrows;