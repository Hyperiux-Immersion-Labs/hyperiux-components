import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

export const metadata = {
  title: "Extra | Hyperiux UI",
  description: "Browse all extra demos",
};

async function getExtraFolderNames() {
  const extrasDir = path.join(process.cwd(), "src/app/extras");
  const entries = await fs.readdir(extrasDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

export default async function ExtraPage() {
  const folders = await getExtraFolderNames();

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-semibold">Extra folders</h1>

        <ul className="space-y-3">
          {folders.map((folder) => (
            <li key={folder}>
              <Link
                href={`/extras/${folder}`}
                target="_blank"
        rel="noopener noreferrer"
                className="text-lg underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {folder}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
