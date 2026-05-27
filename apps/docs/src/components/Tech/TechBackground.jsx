/**
 * TechBackground
 * Shared page wrapper for all /tech/* routes.
 * Provides: hero background image (via VaultLayout bgImageSrc) +
 * an orange radial gradient glow overlay matching the homepage aesthetic.
 */
export default function TechBackground({ children, className = "" }) {
  return (
    <div className={`min-h-screen text-foreground px-15 max-sm:px-6 relative ${className}`}>
      {/* Orange radial glow — mirrors homepage hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,95,0,0.10) 0%, transparent 55%)",
        }}
      />
      {/* Page content sits above the glow */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
