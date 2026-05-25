"use client";

import { useMemo, useState } from "react";
import hljs from "highlight.js";

export function CodeBlock({ code, language ="jsx", filename }) {
 const [copied, setCopied] = useState(false);
 const highlighted = useMemo(() => {
  try {
   if (!code) return "";
   if (language && hljs.getLanguage(language)) {
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
   }
   return hljs.highlightAuto(code).value;
  } catch {
   return "";
  }
 }, [code, language]);

 const handleCopy = async () => {
 await navigator.clipboard.writeText(code);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className="relative rounded-md border border-border/60 bg-black/60 backdrop-blur-md overflow-hidden">
 <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-black/20">
 <span className="text-sm text-muted">{filename || ""}</span>
 <button
 onClick={handleCopy}
 className="text-xs px-3 cursor-pointer py-1.5 rounded-sm bg-black/40 border border-border/60 text-muted hover:text-foreground transition-colors"
 >
 {copied ?"Copied!" :"Copy"}
 </button>
 </div>
 <div className="relative">
 <pre className=" overflow-x-auto text-sm bg-transparent!">
 {highlighted ? (
 <code
 className={`hljs language-${language}`}
 dangerouslySetInnerHTML={{ __html: highlighted }}
 />
 ) : (
 <code className={`hljs language-${language}`}>{code}</code>
 )}
 </pre>
 </div>
 </div>
 );
}

export function InstallCommand({ effect }) {
 const [copied, setCopied] = useState(false);
 const command = `npx hyperiux add ${effect}`;

 const handleCopy = async () => {
 await navigator.clipboard.writeText(command);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
 <span className="text-green-500">$</span>
 <code className="flex-1 text-sm text-neutral-300">{command}</code>
 <button
 onClick={handleCopy}
 className="text-xs px-3 py-1.5 rounded bg-white text-black hover:bg-neutral-200 transition-colors font-medium"
 >
 {copied ?"Copied!" :"Copy"}
 </button>
 </div>
 );
}
