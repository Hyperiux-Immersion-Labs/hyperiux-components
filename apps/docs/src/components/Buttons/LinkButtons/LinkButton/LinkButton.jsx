"use client";

import { useLayoutEffect, useState } from"react";
import Link from"next/link";
import { ArrowRight } from"lucide-react";
import"./LinkButton.css";

export const LinkButton = ({
 text,
 mobileText ="Click me",
 clickedColor ="#ff6b00",
 href ="#",
 className ="",
 linkProps = {},
 icon: Icon = ArrowRight,
 iconClassName ="",
 children,
 disableNavigation = false,
 onClick,
 ...props
}) => {
 const [isCompactViewport, setIsCompactViewport] = useState(false);
 const [hasMeasuredViewport, setHasMeasuredViewport] = useState(false);
 const [isIconRotated, setIsIconRotated] = useState(false);

 useLayoutEffect(() => {
 const handleResize = () => {
 setIsCompactViewport(window.innerWidth <= 1024);
 setHasMeasuredViewport(true);
 };

 handleResize();
 window.addEventListener("resize", handleResize);

 return () => window.removeEventListener("resize", handleResize);
 }, []);

 const handleClick = (event) => {
 setIsIconRotated((prev) => !prev);

 if (disableNavigation) {
 event.preventDefault();
 }

 onClick?.(event);
 };

 const displayText = hasMeasuredViewport && isCompactViewport ? mobileText : children || text;
 const compactClickedStyle =
 hasMeasuredViewport && isCompactViewport && isIconRotated
 ? { color: clickedColor }
 : undefined;

 return (
 <Link
 href={href}
 {...linkProps}
 {...props}
 onClick={handleClick}
  className={`group w-fit block duration-300 leading-[1.2] ${className}`}
 style={compactClickedStyle}
 >
 <div className="flex items-center justify-start gap-2">
 <span
 className="btn-link-line relative inline-block w-fit max-md:text-[3vw] max-sm:text-[5vw] "
 style={{
 visibility: hasMeasuredViewport ? "visible" :"hidden",
 }}
 >
 {displayText}
 </span>

 <span className="sr-only">About {href}</span>

 {Icon && (
 <Icon
 className={`${isIconRotated ?"-rotate-45" :""} ${!isCompactViewport ?"group-hover:-rotate-45" :""} transition-transform duration-300 ${iconClassName}`}
 />
 )}
 </div>
 </Link>
 );
};

export default LinkButton;
