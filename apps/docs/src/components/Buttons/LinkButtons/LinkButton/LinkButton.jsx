"use client";

import Link from"next/link";
import { ArrowRight } from"lucide-react";
import"./LinkButton.css";

export const LinkButton = ({
 text,
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



 return (
 <Link
 href={href}
 {...linkProps}
 {...props}
 className={`group w-fit block duration-300 leading-[1.2] ${className}`}
 >
 <div className="flex items-center justify-start gap-2">
 <span className="btn-link-line relative inline-block w-fit">
 {children || text}
 </span>

 <span className="sr-only">About {href}</span>

 {Icon && (
 <Icon
 className={`group-hover:-rotate-45 transition-transform duration-300 ${iconClassName}`}
 />
 )}
 </div>
 </Link>
 );
};

export default LinkButton;