import { VersionNav } from "./version-nav";

export default function MousePixelationLayout({ children }) {
  return (
    <>
      <VersionNav />
      {children}
    </>
  );
}
