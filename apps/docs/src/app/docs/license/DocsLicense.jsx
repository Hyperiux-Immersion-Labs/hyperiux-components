"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";

export default function DocsLicense() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>License</Heading>

      <Heading2 id="summary">Summary</Heading2>
      <Para>Dummy content. Explain the project license and usage terms.</Para>

      <Heading2 id="attribution">Attribution</Heading2>
      <Para>Dummy content. Mention attribution requirements (if any).</Para>
    </DocsContent>
  );
}

