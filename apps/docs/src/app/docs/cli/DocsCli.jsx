"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";

export default function DocsCli() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>CLI</Heading>

      <Heading2 id="install">Install</Heading2>
      <Para>Dummy content. Show how to install / run the Hyperiux CLI.</Para>

      <Heading2 id="commands">Commands</Heading2>
      <Para>Dummy content. List key commands like add/remove/list.</Para>
    </DocsContent>
  );
}

