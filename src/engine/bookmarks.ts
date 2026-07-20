import { useCallback, useSyncExternalStore } from "react";
import { readStore, writeStore } from "@/lib/storage";

const KEY = "pyforge.bookmarks";

let bookmarks: string[] = readStore<string[]>(KEY, []);
const listeners = new Set<() => void>();

function emit() {
  writeStore(KEY, bookmarks);
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useBookmarks() {
  const list = useSyncExternalStore(subscribe, () => bookmarks);
  const isBookmarked = useCallback((id: string) => list.includes(id), [list]);
  const toggle = useCallback((id: string) => {
    bookmarks = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    emit();
  }, []);
  return { bookmarks: list, isBookmarked, toggle };
}
