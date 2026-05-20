"use client";

export function PropsPanel({ props, values, onChange }) {
 return (
 <div className="space-y-4 p-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
 <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
 Props
 </h3>
 <div className="space-y-4">
 {props.map((prop) => (
 <PropControl
 key={prop.name}
 prop={prop}
 value={values[prop.name]}
 onChange={(value) => onChange(prop.name, value)}
 />
 ))}
 </div>
 </div>
 );
}

function PropControl({ prop, value, onChange }) {
 const { name, type, min, max, step, options, description } = prop;

 return (
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <label className="text-sm font-medium text-neutral-200">{name}</label>
 {type ==="range" && (
 <span className="text-xs text-neutral-500">{value}</span>
 )}
 </div>

 {type ==="range" && (
 <input
 type="range"
 min={min}
 max={max}
 step={step || 1}
 value={value}
 onChange={(e) => onChange(parseFloat(e.target.value))}
 className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
 />
 )}

 {type ==="number" && (
 <input
 type="number"
 min={min}
 max={max}
 step={step || 1}
 value={value}
 onChange={(e) => onChange(parseFloat(e.target.value))}
 className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
 />
 )}

 {type ==="text" && (
 <input
 type="text"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
 />
 )}

 {type ==="select" && (
 <select
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
 >
 {options.map((option) => (
 <option key={option} value={option}>
 {option}
 </option>
 ))}
 </select>
 )}

 {type ==="boolean" && (
 <button
 onClick={() => onChange(!value)}
 className={`w-12 h-6 rounded-full transition-colors ${
 value ?"bg-white" :"bg-neutral-700"
 }`}
 >
 <div
 className={`w-5 h-5 rounded-full bg-neutral-900 transition-transform ${
 value ?"translate-x-6" :"translate-x-0.5"
 }`}
 />
 </button>
 )}

 {type ==="color" && (
 <div className="flex items-center gap-2">
 <input
 type="color"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-10 h-10 rounded border border-neutral-700 cursor-pointer"
 />
 <input
 type="text"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
 />
 </div>
 )}

 {description && (
 <p className="text-xs text-neutral-500">{description}</p>
 )}
 </div>
 );
}
