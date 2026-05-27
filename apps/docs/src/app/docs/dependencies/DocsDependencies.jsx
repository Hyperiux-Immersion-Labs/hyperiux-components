"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";

export default function DocsDependencies() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Dependencies</Heading>

      <Heading2 id="runtime">Runtime</Heading2>
      <Para>Dummy content. Mention required runtime deps and peer deps.</Para>

      <Heading2 id="optional">Optional</Heading2>
      <Para>Dummy content. Mention optional packages (e.g. framer-motion/gsap/etc.).</Para>
    </DocsContent>
  );
}

