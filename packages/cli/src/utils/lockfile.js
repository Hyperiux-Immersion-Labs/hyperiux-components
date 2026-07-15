import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Buffer } from "buffer";

const LOCKFILE_NAME = "hyperiux.lock.json";

export function getLockfilePath(cwd = process.cwd()) {
  return path.join(cwd, LOCKFILE_NAME);
}

export function readLockfile(cwd = process.cwd()) {
  const lockfilePath = getLockfilePath(cwd);

  if (!fs.existsSync(lockfilePath)) {
    return { components: {} };
  }

  const content = fs.readFileSync(lockfilePath, "utf-8");
  const parsed = JSON.parse(content);

  return { components: {}, ...parsed };
}

export function writeLockfile(lock, cwd = process.cwd()) {
  const lockfilePath = getLockfilePath(cwd);

  fs.writeFileSync(lockfilePath, JSON.stringify(lock, null, 2) + "\n");
}

export function hashContent(content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content ?? "");

  return "sha256:" + crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Records/updates a component's lock entry after a successful install or
 * update. `files` is a map of targetPath -> raw content (string or Buffer)
 * as actually written to disk, so the hash reflects exactly what's there.
 */
export function upsertLockEntry(cwd, name, { version, files }) {
  const lock = readLockfile(cwd);

  const fileHashes = {};

  for (const [targetPath, content] of Object.entries(files)) {
    fileHashes[targetPath] = hashContent(content);
  }

  lock.components[name] = {
    version,
    installedAt: new Date().toISOString(),
    files: fileHashes,
  };

  writeLockfile(lock, cwd);

  return lock.components[name];
}

export function getLockEntry(cwd, name) {
  const lock = readLockfile(cwd);

  return lock.components[name] || null;
}

export function removeLockEntry(cwd, name) {
  const lock = readLockfile(cwd);

  if (!(name in lock.components)) return;

  delete lock.components[name];
  writeLockfile(lock, cwd);
}
