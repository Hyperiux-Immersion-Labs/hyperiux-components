"use client";

import Link from"next/link";
import"./ArrowBgFillPrimary.css";

const ArrowBgFillPrimaryBtn = ({
 btnText,
 className ="",

 bgColor ="#ff6b00",
 textColor ="#ffffff",

 fillBgColor ="#ffffff",
 fillTextColor ="#ff6b00",

 hoverFillBgColor ="#ffffff",
 hoverFillTextColor ="#ff6b00",

 // NEW
 arrowColor,
 hoverArrowColor,

 ...props
}) => {
 return (
 <Link
 {...props}
 className={`arrow-bg-fill-btn ${className}`}
 style={{
"--btn-bg": bgColor,
"--btn-text": textColor,
"--btn-fill-bg": fillBgColor,
"--btn-fill-text": fillTextColor,
"--btn-fill-bg-hover": hoverFillBgColor,
"--btn-fill-text-hover": hoverFillTextColor,
 // NEW
"--btn-arrow": arrowColor || fillTextColor,
"--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
 }}
 >
 <span className="arrow-bg-fill-btn__text">{btnText}</span>

 <div aria-hidden="true" className="arrow-bg-fill-btn__circle">
 <span className="">{btnText}</span>

 <div className="arrow-bg-fill-btn__circle-text">
 <svg
 viewBox="0 0 10 10"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="arrow-bg-fill-btn__icon"
 >
 <path
 fillRule="evenodd"
 clipRule="evenodd"
 d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
 className="arrow-bg-fill-btn__path"
 />
 <path
 fillRule="evenodd"
 clipRule="evenodd"
 d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
 className="arrow-bg-fill-btn__path"
 />
 </svg>
 </div>
 </div>
 </Link>
 );
};

export default ArrowBgFillPrimaryBtn;