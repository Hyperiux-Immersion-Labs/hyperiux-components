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
}

export class RegistryError extends Error {
  status?: number;
  requiresPro: boolean;

  constructor(message: string, options: { status?: number; requiresPro?: boolean } = {}) {
    super(message);
    this.name = "RegistryError";
    this.status = options.status;
    this.requiresPro = Boolean(options.requiresPro);
  }
}
