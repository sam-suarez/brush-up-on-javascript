import type { Challenge, Topic } from "./types";

// Lazy glob: Vite turns every topic file into its own chunk, loaded on first visit.
const modules = import.meta.glob<{ default: Topic }>("./*/*.ts");

const cache = new Map<string, Promise<Topic | undefined>>();

export function loadTopic(course: string, topic: string): Promise<Topic | undefined> {
  const key = `${course}/${topic}`;
  let pending = cache.get(key);
  if (!pending) {
    const importer = modules[`./${key}.ts`];
    pending = importer ? importer().then((m) => m.default) : Promise.resolve(undefined);
    cache.set(key, pending);
  }
  return pending;
}

export async function loadChallenge(
  course: string,
  topic: string,
  slug: string,
): Promise<{ topic: Topic; challenge: Challenge } | undefined> {
  const loaded = await loadTopic(course, topic);
  const challenge = loaded?.challenges.find((c) => c.slug === slug);
  return loaded && challenge ? { topic: loaded, challenge } : undefined;
}

export const topicModuleKeys = Object.keys(modules).map((p) => p.slice(2, -3));
