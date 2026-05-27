import React from "react";
import DocsCli from "./DocsCli";

export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <DocsCli />
    </React.Suspense>
  );
}
