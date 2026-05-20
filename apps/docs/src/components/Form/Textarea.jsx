// components/ui/Textarea.jsx
import React, { forwardRef } from"react";

/**
 * Floating-label Textarea
 * Props:
 * - id: string (required)
 * - label: string
 * - error: string | undefined
 * - rows: number (default 5)
 * - className: string
 * - All standard <textarea> props
 */
const Textarea = forwardRef(function Textarea(
 { id, label, error, rows = 5, className ="", ...rest },
 ref
) {
 return (
 <div className="w-full">
 <div className="group relative w-full">
 {label && (
 <label
 htmlFor={id}
 className="
 origin-start text-gray-400
 group-focus-within:text-gray-700
 has-[+textarea:not(:placeholder-shown)]:text-gray-700
 absolute top-0 block translate-y-4 cursor-text px-2 text-sm
 transition-all z-5 ml-3
 group-focus-within:pointer-events-none
 group-focus-within:-translate-y-1/2
 group-focus-within:cursor-default
 group-focus-within:text-xs
 group-focus-within:font-medium
 has-[+textarea:not(:placeholder-shown)]:pointer-events-none
 has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2
 has-[+textarea:not(:placeholder-shown)]:cursor-default
 has-[+textarea:not(:placeholder-shown)]:text-xs
 has-[+textarea:not(:placeholder-shown)]:font-medium
"
 >
 <span className="bg-white text-gray-700 inline-flex px-1 text-sm">
 {label}
 </span>
 </label>
 )}
 <textarea
 ref={ref}
 id={id}
 rows={rows}
 placeholder=""
 className={`
 w-full border rounded-2xl bg-white
 pt-5 pb-4 pl-5 pr-4 text-sm text-gray-800
 outline-none transition-all resize-none
 border-gray-200
 focus:border-gray-400
 ${error ?"border-red-400 focus:border-red-400" :""}
 ${className}
 `}
 {...rest}
 />
 </div>
 {error && (
 <p className="mt-1 ml-4 text-xs text-red-500">{error}</p>
 )}
 </div>
 );
});

export default Textarea;