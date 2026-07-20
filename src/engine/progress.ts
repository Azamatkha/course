import { useCallback, useSyncExternalStore } from "react";
import { readStore, writeStore } from "@/lib/storage";
import { allLessons, courseLessons } from "./content";

const KEY = "pyforge.progress";

export interface ProgressState {
  /** lessonId (`course/slug`) → ISO date completed */
  completed: Record<string, string>;
  /** ISO dates (yyyy-mm-dd) with any learning activity, for the streak. */
  activeDays: string[];
  lastVisited: string | null;
}

const empty: ProgressState = { completed: {}, activeDays: [], lastVisited: null };

let state: ProgressState = readStore(KEY, empty);
const listeners = new Set<() => void>();

function emit() {
  writeStore(KEY, state);
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): ProgressState {
  return state;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordVisit(lessonId: string) {
  const day = today();
  if (state.lastVisited === lessonId && state.activeDays.includes(day)) {
    return; // nothing changed — avoid notifying subscribers in a render loop
  }
  const activeDays = state.activeDays.includes(day)
    ? state.activeDays
    : [...state.activeDays, day];
  state = { ...state, lastVisited: lessonId, activeDays };
  emit();
}

export function toggleCompleted(lessonId: string) {
  const completed = { ...state.completed };
  if (completed[lessonId]) delete completed[lessonId];
  else completed[lessonId] = new Date().toISOString();
  state = { ...state, completed };
  emit();
}

export function resetProgress() {
  state = empty;
  emit();
}

/** Consecutive-day streak ending today or yesterday. */
export function computeStreak(activeDays: string[]): number {
  const days = new Set(activeDays);
  const cursor = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  let streak = 0;
  if (!days.has(iso(cursor))) cursor.setDate(cursor.getDate() - 1); // allow "yesterday"
  while (days.has(iso(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const isCompleted = useCallback(
    (lessonId: string) => Boolean(snapshot.completed[lessonId]),
    [snapshot]
  );
  const completedCount = Object.keys(snapshot.completed).length;
  const totalCount = allLessons().length;

  const coursePercent = useCallback(
    (courseId: string) => {
      const lessons = courseLessons(courseId);
      if (lessons.length === 0) return 0;
      const done = lessons.filter((l) => snapshot.completed[l.id]).length;
      return Math.round((done / lessons.length) * 100);
    },
    [snapshot]
  );

  return {
    state: snapshot,
    isCompleted,
    toggleCompleted,
    recordVisit,
    resetProgress,
    completedCount,
    totalCount,
    coursePercent,
    streak: computeStreak(snapshot.activeDays),
  };
}
