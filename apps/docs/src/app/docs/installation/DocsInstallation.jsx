"use client";

import DocsContent from "@/components/DocsContent/DocsContent";
import Heading from "@/components/DocsContent/Heading";
import Heading2 from "@/components/DocsContent/Heading2";
import Para from "@/components/DocsContent/Para";

export default function DocsInstallation() {
  return (
    <DocsContent className="max-w-none mx-0">
      <Heading>Installation</Heading>

      <Heading2 id="requirements">Requirements</Heading2>
      <Para>Dummy content. List Node.js / package manager requirements here.</Para>

      <Heading2 id="setup">Setup</Heading2>
      <Para>Dummy content. Explain how to install Hyperiux UI and initialize a project.</Para>
    </DocsContent>
  );
}

