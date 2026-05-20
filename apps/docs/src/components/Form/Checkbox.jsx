
import React, { forwardRef } from"react";

/**
 * Props:
 * - id: string
 * - checked: boolean
 * - onChange: function
 * - label: React.ReactNode (can contain JSX, links, etc.)
 * - error: string | undefined
 * - accentColor: string (tailwind bg class, default"bg-orange-500")
 */
const Checkbox = forwardRef(function Checkbox(
 { id, checked, onChange, label, error, accentColor ="bg-orange-500", ...rest },
 ref
) {
 return (
 <div className="w-full">
 <div className="flex items-start gap-3">
 <button
 ref={ref}
 type="button"
 id={id}
 role="checkbox"
 aria-checked={checked}
 onClick={() => onChange && onChange(!checked)}
 className={`
 mt-0.5 shrink-0 w-5 h-5 rounded border-2 transition-all duration-200
 flex items-center justify-center cursor-pointer
 ${checked
 ? `${accentColor} border-transparent`
 :"bg-white border-gray-400 hover:border-gray-600"
 }
 `}
 {...rest}
 >
 {checked && (
 <svg
 xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 12 12"
 fill="none"
 className="w-3 h-3"
 >
 <path
 d="M2 6l3 3 5-5"
 stroke="white"
 strokeWidth="1.8"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 )}
 </button>

 {label && (
 <label
 htmlFor={id}
 className="text-sm text-gray-600 font-light leading-snug cursor-pointer select-none"
 onClick={() => onChange && onChange(!checked)}
 >
 {label}
 </label>
 )}
 </div>
 {error && (
 <p className="mt-1 ml-8 text-xs text-red-500">{error}</p>
 )}
 </div>
 );
});

export default Checkbox;