export interface RegistryIndexItem {
  name: string;
  type: string;
  category: string;
  categories: string[];
  dependencies: string[];
  registryDependencies: string[];
  exportName: string;
  exportKind: string;
  version: string;
}

export interface RegistryIndex {
  items: RegistryIndexItem[];
}

export interface ChangelogEntry {
  version: string;
  date?: string;
  summary?: string;
  breaking?: boolean;
}

export interface EffectFile {
  path: string;
  target?: string;
  type?: string;
  content?: string;
}

export interface RegistryEffect {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies: string[];
  registryDependencies: string[];
  exportName: string;
  exportKind: string;
  tier: "free" | "pro" | string;
  version: string;
  changelog: ChangelogEntry[];
  files: EffectFile[];
  previewUrl?: string;
  importPath?: string;
  target?: string;
  main?: string;
  // Set by fetchEffect() when a free effect's metered fetch is denied by
  // Installation-SyncUp.md Stage 3 enforcement - files carry no content in
  // this case regardless of include_source (see get-effect.ts).
  rateLimited?: boolean;
  retryAfter?: number;
  installLimit?: number | null;
  // Present on a successful (non-rate-limited) delivery too - null for
  // admins, whose fetches never consume a slot.
  installRemaining?: number | null;
}

export class RegistryError extends Error {
  status?: number;
  requiresPro: boolean;
  rateLimited: boolean;
  retryAfter?: number;
  limit?: number | null;

  constructor(
    message: string,
    options: { status?: number; requiresPro?: boolean; rateLimited?: boolean; retryAfter?: number; limit?: number | null } = {}
  ) {
    super(message);
    this.name = "RegistryError";
    this.status = options.status;
    this.requiresPro = Boolean(options.requiresPro);
    this.rateLimited = Boolean(options.rateLimited);
    this.retryAfter = options.retryAfter;
    this.limit = options.limit;
  }
}
