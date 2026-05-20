
import React, { forwardRef } from"react";

/**
 * Button
 * Props:
 * - children: React.ReactNode
 * - type:"button" |"submit" |"reset" (default"button")
 * - isLoading: boolean
 * - loadingText: string (default"Sending...")
 * - className: string
 * - All standard <button> props
 */
const Button = forwardRef(function Button(
 {
 children,
 type ="button",
 isLoading = false,
 loadingText ="Sending...",
 className ="",
 disabled,
 ...rest
 },
 ref
) {
 return (
 <button
 ref={ref}
 type={type}
 disabled={isLoading || disabled}
 className={`
 relative inline-flex items-center justify-center
 rounded-full cursor-pointer
 bg-primary text-white text-sm font-medium
 px-8 py-4 min-w-45
 transition-all duration-300
 hover:scale-[0.97] active:scale-95
 disabled:opacity-70 disabled:cursor-not-allowed
 ${className}
 `}
 {...rest}
 >
 {isLoading ? (
 <span className="flex items-center gap-2">
 <svg
 className="animate-spin w-4 h-4"
 xmlns="http://www.w3.org/2000/svg"
 fill="none"
 viewBox="0 0 24 24"
 >
 <circle
 className="opacity-25"
 cx="12"
 cy="12"
 r="10"
 stroke="currentColor"
 strokeWidth="4"
 />
 <path
 className="opacity-75"
 fill="currentColor"
 d="M4 12a8 8 0 018-8v8H4z"
 />
 </svg>
 {loadingText}
 </span>
 ) : (
 children
 )}
 </button>
 );
});

export default Button;