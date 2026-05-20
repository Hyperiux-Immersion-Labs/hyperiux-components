// components/ui/Input.jsx
import React, { forwardRef } from"react";

/**
 * Floating-label Input
 * Props:
 * - id: string (required, links label to input)
 * - label: string
 * - type: string (default"text")
 * - error: string | undefined
 * - className: string (extra classes on <input>)
 * - All standard <input> props (name, value, onChange, onBlur, autoComplete, …)
 */
const Input = forwardRef(function Input(
 { id, label, type ="text", error, className ="", ...rest },
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
 has-[+input:not(:placeholder-shown)]:text-gray-700
 absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm
 transition-all
 group-focus-within:pointer-events-none
 group-focus-within:top-0
 group-focus-within:cursor-default
 group-focus-within:text-xs
 group-focus-within:font-medium
 has-[+input:not(:placeholder-shown)]:pointer-events-none
 has-[+input:not(:placeholder-shown)]:top-0
 has-[+input:not(:placeholder-shown)]:cursor-default
 has-[+input:not(:placeholder-shown)]:text-xs
 has-[+input:not(:placeholder-shown)]:font-medium
 ml-4
"
 >
 <span className="bg-white text-gray-700 inline-flex px-1 text-sm">
 {label}
 </span>
 </label>
 )}
 <input
 ref={ref}
 id={id}
 type={type}
 placeholder=""
 className={`
 w-full border rounded-full bg-white
 h-14 pl-5 pr-4 text-sm text-gray-800
 outline-none transition-all
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

export default Input;