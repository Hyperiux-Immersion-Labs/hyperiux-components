import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const tmp = mkdtempSync(join(tmpdir(), "hyperiux-pack-"));

console.log("Packing tarball...");

try {
  const output = execFileSync("npm", ["pack", "--json"], {
    cwd: root,
    encoding: "utf8",
  });

  const [{ filename }] = JSON.parse(output);
  const tarball = join(root, filename);

  console.log(`Installing ${filename} into ${tmp}...`);
  execFileSync("npm", ["init", "-y"], { cwd: tmp, stdio: "ignore" });
  execFileSync("npm", ["install", tarball], { cwd: tmp, stdio: "inherit" });

  console.log("\nRunning smoke checks...");
  execFileSync("node", ["./node_modules/.bin/hyperiux", "--version"], {
    cwd: tmp,
    stdio: "inherit",
  });
  execFileSync("node", ["./node_modules/.bin/hyperiux", "--help"], {
    cwd: tmp,
    stdio: "inherit",
  });

  console.log("\nsmoke:pack passed.");
} finally {
  rmSync(tmp, { recursive: true, force: true });
  // Clean up the .tgz from the package directory
  try {
    const tgzFiles = (await import("node:fs")).readdirSync(root).filter((f) => f.endsWith(".tgz"));
    for (const f of tgzFiles) rmSync(join(root, f));
  } catch {}
}
