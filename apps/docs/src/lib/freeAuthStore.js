import fs from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "free-users.json");

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      users: [],
    };
  }
}

async function writeStore(store) {
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getFreeUserByEmail(email) {
  const store = await readStore();

  return (
    store.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    ) || null
  );
}

export async function upsertFreeUser(nextUser) {
  const store = await readStore();
  const email = nextUser.email.toLowerCase();

  const existingIndex = store.users.findIndex(
    (user) => user.email.toLowerCase() === email
  );

  if (existingIndex >= 0) {
    store.users[existingIndex] = {
      ...store.users[existingIndex],
      ...nextUser,
      email,
      updatedAt: new Date().toISOString(),
    };
  } else {
    store.users.push({
      ...nextUser,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await writeStore(store);

  return getFreeUserByEmail(email);
}

export async function markFreeUserLoggedIn(email) {
  const user = await getFreeUserByEmail(email);

  if (!user) return null;

  return upsertFreeUser({
    ...user,
    hasLoggedIn: true,
    firstLoggedInAt: user.firstLoggedInAt || new Date().toISOString(),
    lastLoggedInAt: new Date().toISOString(),
  });
}