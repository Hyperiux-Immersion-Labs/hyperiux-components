"use client";

import { useEffect, useRef, useState } from"react";
import Link from"next/link";


const DotScaleFillCharBtn = ({
 btnText ="",
 className ="",
 textClassName ="",
 staggerStep = 0.01,
 bgColor ="#ff6b00",
 textColor ="#ffffff",
 fillColor ="#ffffff",
 hoverTextColor ="#ff6b00",
 dotColor,
 ...props
}) => {
 const textRef = useRef(null);
 const [hovered, setHovered] = useState(false);

 useEffect(() => {
 const el = textRef.current;
 if (!el) return;

 const sourceText = btnText ||"";
 el.innerHTML ="";

 [...sourceText].forEach((char, index) => {
 const span = document.createElement("span");
 span.textContent = char;
 span.style.transitionDelay = `${index * staggerStep}s`;

 if (char ===" ") {
 span.style.whiteSpace ="pre";
 }

 el.appendChild(span);
 });
 }, [btnText, staggerStep]);

	useEffect(() => {
		const el = textRef.current;
		if (!el) return;

		const spans = Array.from(el.children || []);
		spans.forEach((span) => {
			span.style.display = "inline-block";
			span.style.position = "relative";
			span.style.textShadow = "0px 1.3em currentColor";
			span.style.transform = "translateY(0em) rotate(0.001deg)";
			span.style.transition =
				"transform 0.6s cubic-bezier(0.625, 0.05, 0, 1), color 0.6s cubic-bezier(0.625, 0.05, 0, 1)";
			span.style.willChange = "transform";
		});
	}, [btnText, staggerStep]);

	const handleMouseEnter = () => {
		const el = textRef.current;
		if (el) {
			Array.from(el.children).forEach((span) => {
				span.style.transform = "translateY(-1.3em) rotate(0.001deg)";
			});
		}
		setHovered(true);
	};

	const handleMouseLeave = () => {
		const el = textRef.current;
		if (el) {
			Array.from(el.children).forEach((span) => {
				span.style.transform = "translateY(0em) rotate(0.001deg)";
			});
		}
		setHovered(false);
	};

	return (
		<Link
			{...props}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={`group relative flex items-center justify-center h-[4.2vw] pl-[2.8vw] pt-[0.2vw] max-md:pt-[0.5vw] max-sm:pt-[0.7vw] pr-[2vw] rounded-full overflow-hidden whitespace-nowrap no-underline font-medium text-[1.05vw] ${className} max-md:h-[11vw] max-md:pl-[7vw] max-md:pr-[5vw] max-md:text-[3vw] max-md:font-normal max-sm:h-[15vw] max-sm:pl-[11vw] max-sm:pr-[9vw] max-sm:text-[4.2vw]`}
			style={{ background: bgColor, color: hovered ? hoverTextColor : textColor }}
		>
			<span
				aria-hidden
				className={`absolute left-[1.7vw] top-[54%] max-md:top-[57%] w-[0.5vw] h-[0.5vw] rounded-full z-10 transform -translate-y-1/2 transition-transform duration-500 max-md:left-[3.5vw] max-md:w-[2vw] max-md:h-[2vw] max-sm:left-[6vw] max-sm:w-[2.5vw] max-sm:h-[2.5vw]`}
				style={{
					background: dotColor || fillColor,
					transform: hovered ? "translateY(-50%) scale(120)" : "translateY(-50%) scale(1)",
					transitionTimingFunction: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
				}}
			/>

			<span className="relative z-20 inline-block">
				<span
					ref={textRef}
					className={`relative inline-block overflow-hidden leading-[1.2] ${textClassName}`}
					aria-hidden={false}
				>
					{btnText}
				</span>
			</span>
		</Link>
	);
};

export default DotScaleFillCharBtn;