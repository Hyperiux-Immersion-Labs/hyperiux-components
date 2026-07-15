/**
 * Minimal semver comparison for plain "major.minor.patch" version strings.
 * Registry versions are always exact (no ranges, no pre-release tags), so a
 * full semver library would be overkill here.
 */
function parse(version) {
  const parts = String(version || "0.0.0")
    .split(".")
    .map((part) => parseInt(part, 10) || 0);

  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

/** Returns -1, 0, or 1, like Array.prototype.sort comparators. */
export function compareVersions(a, b) {
  const va = parse(a);
  const vb = parse(b);

  if (va.major !== vb.major) return va.major < vb.major ? -1 : 1;
  if (va.minor !== vb.minor) return va.minor < vb.minor ? -1 : 1;
  if (va.patch !== vb.patch) return va.patch < vb.patch ? -1 : 1;

  return 0;
}

export function isOutdated(installedVersion, latestVersion) {
  return compareVersions(installedVersion, latestVersion) < 0;
}

/** "major" | "minor" | "patch" | null (null when not outdated). */
export function getBumpType(installedVersion, latestVersion) {
  if (!isOutdated(installedVersion, latestVersion)) return null;

  const from = parse(installedVersion);
  const to = parse(latestVersion);

  if (to.major !== from.major) return "major";
  if (to.minor !== from.minor) return "minor";

  return "patch";
}
