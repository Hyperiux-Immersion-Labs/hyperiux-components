export default function PixelateSvgFilter({
 id ="pixelate-filter",
 size = 16,
 crossLayers = false
}) {
 return (
 <svg
 aria-hidden="true"
 className="pointer-events-none absolute h-0 w-0 overflow-hidden"
 >
 <defs>
 <filter id={id} x="0" y="0" width="1" height="1">
 {/* Base pixelation */}
 <feConvolveMatrix
 kernelMatrix="1 1 1
 1 1 1
 1 1 1"
 result="AVG"
 />

 <feFlood x="1" y="1" width="1" height="1" />

 <feComposite
 operator="arithmetic"
 k1="0"
 k2="1"
 k3="0"
 k4="0"
 width={size}
 height={size}
 />

 <feTile result="TILE" />

 <feComposite
 in="AVG"
 in2="TILE"
 operator="in"
 />

 <feMorphology
 operator="dilate"
 radius={size / 2}
 result="NORMAL"
 />

 {crossLayers && (
 <>
 {/* Horizontal fallback */}
 <feConvolveMatrix
 kernelMatrix="1 1 1
 1 1 1
 1 1 1"
 result="AVG"
 />
 <feFlood x="1" y="1" width="1" height="1" />
 <feComposite
 in2="SourceGraphic"
 operator="arithmetic"
 k1="0"
 k2="1"
 k3="0"
 k4="0"
 width={size / 2}
 height={size}
 />
 <feTile result="TILE" />
 <feComposite in="AVG" in2="TILE" operator="in" />
 <feMorphology
 operator="dilate"
 radius={size / 2}
 result="FALLBACKX"
 />

 {/* Vertical fallback */}
 <feConvolveMatrix
 kernelMatrix="1 1 1
 1 1 1
 1 1 1"
 result="AVG"
 />
 <feFlood x="1" y="1" width="1" height="1" />
 <feComposite
 in2="SourceGraphic"
 operator="arithmetic"
 k1="0"
 k2="1"
 k3="0"
 k4="0"
 width={size}
 height={size / 2}
 />
 <feTile result="TILE" />
 <feComposite in="AVG" in2="TILE" operator="in" />
 <feMorphology
 operator="dilate"
 radius={size / 2}
 result="FALLBACKY"
 />

 <feMerge>
 <feMergeNode in="FALLBACKX" />
 <feMergeNode in="FALLBACKY" />
 <feMergeNode in="NORMAL" />
 </feMerge>
 </>
 )}

 {!crossLayers && <feMergeNode in="NORMAL" />}
 </filter>
 </defs>
 </svg>
 );
}