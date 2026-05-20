// components/ui/Select.jsx
import React, { forwardRef, useState, useRef, useEffect } from"react";

const Select = forwardRef(function Select(
 { id, label, options = [], error, className ="", ...rest },
 ref
) {
 const [open, setOpen] = useState(false);
 const containerRef = useRef(null);

 const selectedOption = options.find((opt) => opt.value === rest.value);

 // Close on outside click
 useEffect(() => {
 const handleClickOutside = (e) => {
 if (!containerRef.current?.contains(e.target)) {
 setOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const handleSelect = (value) => {
 if (rest.onChange) {
 rest.onChange({ target: { value, id } });
 }
 setOpen(false);
 };

 return (
 <div className="w-full" ref={containerRef}>
 <div className="relative w-full">
 {/* Trigger */}
 <button
 type="button"
 id={id}
 ref={ref}
 onClick={() => setOpen((prev) => !prev)}
 className={`
 w-full border rounded-full bg-white
 h-14 pl-5 pr-10 text-sm text-left
 outline-none transition-all cursor-pointer
 border-gray-200
 focus:border-gray-400
 flex items-center
 ${
 !selectedOption
 ?"text-gray-400"
 :"text-gray-800"
 }
 ${error ?"border-red-400 focus:border-red-400" :""}
 ${className}
 `}
 >
 {selectedOption ? selectedOption.label : label}
 </button>

 {/* Chevron */}
 <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 >
 <path d="m6 9 6 6 6-6" />
 </svg>
 </span>

 {/* Fancy Dropdown */}
 <div
 className={`
 absolute z-50 mt-2 w-full
 transition-all duration-200 origin-top
 ${
 open
 ?"opacity-100 scale-100 translate-y-0"
 :"opacity-0 scale-95 -translate-y-2 pointer-events-none"
 }
 `}
 >
 <div className="bg-white p-1 border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
 {options.map((opt) => (
 <button
 key={opt.value}
 type="button"
 onClick={() => handleSelect(opt.value)}
 className={`
 w-full text-left px-5 py-3 text-sm transition-all rounded-full
 hover:bg-gray-100
 ${
 rest.value === opt.value
 ?"bg-gray-50 text-gray-900 font-medium"
 :"text-gray-700"
 }
 `}
 >
 {opt.label}
 </button>
 ))}
 </div>
 </div>
 </div>

 {error && (
 <p className="mt-1 ml-4 text-xs text-red-500">{error}</p>
 )}
 </div>
 );
});

export default Select;