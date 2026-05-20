"use client"

const ChevronBird = ({
 isActive = false,
 size = 14,
 strokeWidth = 10,
 className ="mt-[0.25vw]",
}) => {
 return (
 <svg
 className={className}
 viewBox="0 0 100 100"
 width={size}
 height={size}
 fill="none"
 aria-hidden="true"
 style={{
 transform: isActive ?'translateY(-25%)' :'translateY(0%)',
 transition:'transform 0.32s ease-in-out',
 }}
 >
 <g>
 <path
 d="M10 50H50"
 stroke="currentColor"
 strokeWidth={strokeWidth}
 strokeLinecap="square"
 style={{
 transformBox:'view-box',
 transformOrigin:'50px 50px',
 transform: isActive ?'rotate(-42deg)' :'rotate(42deg)',
 transition:'transform 0.32s ease-in-out',
 }}
 />
 <path
 d="M90 50H50"
 stroke="currentColor"
 strokeWidth={strokeWidth}
 strokeLinecap="square"
 style={{
 transformBox:'view-box',
 transformOrigin:'50px 50px',
 transform: isActive ?'rotate(42deg)' :'rotate(-42deg)',
 transition:'transform 0.32s ease-in-out',
 }}
 />
 </g>
 </svg>
 );
}

export default ChevronBird