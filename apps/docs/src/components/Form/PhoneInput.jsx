'use client'
import React, { forwardRef, useState } from"react";

/**
 * Phone input with country code prefix (no external library)
 * Props:
 * - id: string
 * - label: string (placeholder text, default"Phone Number*")
 * - value: string (full value like"+91 98765 43210")
 * - onChange: function(fullValue: string)
 * - defaultCountry: string (ISO 3166-1 alpha-2, default"IN")
 * - error: string | undefined
 * - className: string
 *
 * For full international support you can swap this with react-phone-number-input
 * — just keep the same props interface.
 */

const COUNTRY_CODES = [
 { code:"IN", dial:"+91", flag:"🇮🇳" },
 { code:"IE", dial:"+353", flag:"🇮🇪" },
 { code:"US", dial:"+1", flag:"🇺🇸" },
 { code:"GB", dial:"+44", flag:"🇬🇧" },
 { code:"AU", dial:"+61", flag:"🇦🇺" },
 { code:"CA", dial:"+1", flag:"🇨🇦" },
 { code:"DE", dial:"+49", flag:"🇩🇪" },
 { code:"FR", dial:"+33", flag:"🇫🇷" },
 { code:"AE", dial:"+971", flag:"🇦🇪" },
 { code:"SG", dial:"+65", flag:"🇸🇬" },
];

const PhoneInput = forwardRef(function PhoneInput(
 {
 id ="phone",
 label ="Phone Number*",
 value ="",
 onChange,
 defaultCountry ="IN",
 error,
 className ="",
 ...rest
 },
 ref
) {
 const [selectedCountry, setSelectedCountry] = useState(
 () => COUNTRY_CODES.find((c) => c.code === defaultCountry) || COUNTRY_CODES[0]
 );
 const [open, setOpen] = useState(false);

 // Strip the dial prefix from value for display in number input
 const numberPart = value.startsWith(selectedCountry.dial)
 ? value.slice(selectedCountry.dial.length).trim()
 : value;

 const handleCountrySelect = (country) => {
 setSelectedCountry(country);
 setOpen(false);
 if (onChange) onChange(`${country.dial} ${numberPart}`);
 };

 const handleNumberChange = (e) => {
 const num = e.target.value.replace(/[^\d\s\-()]/g,"");
 if (onChange) onChange(`${selectedCountry.dial} ${num}`);
 };

 return (
 <div className="w-full">
 <div
 className={`
 flex items-center border rounded-full bg-white h-14
 border-gray-200 transition-all
 focus-within:border-gray-400
 ${error ?"border-red-400 focus-within:border-red-400" :""}
 ${className}
 `}
 >
 {/* Country selector */}
 <div className="relative shrink-0">
 <button
 type="button"
 onClick={() => setOpen((o) => !o)}
 className="flex items-center gap-1 pl-4 pr-2 h-full text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
 >
 <span className="text-base">{selectedCountry.flag}</span>
 <span className="font-medium">{selectedCountry.dial}</span>
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="12"
 height="12"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className={`transition-transform duration-200 ${open ?"rotate-180" :""}`}
 >
 <path d="m6 9 6 6 6-6" />
 </svg>
 </button>

 {open && (
 <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 min-w-40 py-1 max-h-52 overflow-y-auto">
 {COUNTRY_CODES.map((country) => (
 <button
 key={`${country.code}-${country.dial}`}
 type="button"
 onClick={() => handleCountrySelect(country)}
 className={`
 w-full flex items-center gap-2 px-4 py-2 text-sm text-left
 hover:bg-gray-50 transition-colors cursor-pointer
 ${selectedCountry.code === country.code ?"text-orange-500 font-medium" :"text-gray-700"}
 `}
 >
 <span>{country.flag}</span>
 <span>{country.code}</span>
 <span className="text-gray-400 ml-auto">{country.dial}</span>
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Divider */}
 <span className="w-px h-6 bg-gray-200 shrink-0" />

 {/* Number input */}
 <input
 ref={ref}
 id={id}
 type="tel"
 value={numberPart}
 onChange={handleNumberChange}
 placeholder={label}
 autoComplete="off"
 className="flex-1 h-full pl-4 pr-5 text-sm text-gray-800 bg-transparent outline-none rounded-r-full placeholder:text-gray-400"
 {...rest}
 />
 </div>
 {error && (
 <p className="mt-1 ml-4 text-xs text-red-500">{error}</p>
 )}
 </div>
 );
});

export default PhoneInput;