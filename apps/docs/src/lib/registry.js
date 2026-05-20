import fs from"fs";
import path from"path";

const REGISTRY_PATH = path.join(process.cwd(),"public/r");

export function getRegistryIndex() {
 const indexPath = path.join(REGISTRY_PATH,"index.json");
 const content = fs.readFileSync(indexPath,"utf-8");
 return JSON.parse(content);
}

export function getEffectBySlug(slug) {
 const effectPath = path.join(REGISTRY_PATH, `${slug}.json`);

 if (!fs.existsSync(effectPath)) {
 return null;
 }

 const content = fs.readFileSync(effectPath,"utf-8");
 return JSON.parse(content);
}

export function getAllEffectSlugs() {
 const index = getRegistryIndex();
 return index.items.map((item) => item.name);
}

export function getEffectsByCategory() {
 const index = getRegistryIndex();
 const categories = {};

 for (const item of index.items) {
 const cats = item.categories?.length ? item.categories : [item.category ||"other"];
 for (const cat of cats) {
 if (!categories[cat]) categories[cat] = [];
 categories[cat].push(item);
 }
 }

 return categories;
}

export function getEffectCode(slug) {
 const effect = getEffectBySlug(slug);
 if (!effect || !effect.files || effect.files.length === 0) {
 return null;
 }
 const primary =
 effect.files.find((f) => f.path === `${slug}.jsx`) ||
 effect.files.find((f) => f.path === `${slug}.js`) ||
 effect.files.find((f) => f.path.endsWith(".jsx")) ||
 effect.files.find((f) => f.path.endsWith(".js")) ||
 effect.files[0];
 return primary.content;
}
