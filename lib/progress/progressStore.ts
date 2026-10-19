'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'neuroplay_completed_lessons';

function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  try {
    return localStorage.getItem(STORAGE_KEY) || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('neuroplay_progress_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('neuroplay_progress_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : [];
  } catch (e) {
    console.warn('Failed to read learning progress from localStorage', e);
    return [];
  }
}

export function markLessonCompleted(slug: string, completed: boolean = true): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCompletedLessons();
    const updated = completed
      ? Array.from(new Set([...current, slug]))
      : current.filter(s => s !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('neuroplay_progress_updated'));
    return updated;
  } catch (e) {
    console.warn('Failed to update lesson progress in localStorage', e);
    return [];
  }
}

export function isLessonCompleted(slug: string): boolean {
  return getCompletedLessons().includes(slug);
}

export function useLearningProgress() {
  const rawCompleted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  let completed: string[] = [];
  try {
    const parsed = JSON.parse(rawCompleted);
    completed = Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : [];
  } catch {
    completed = [];
  }

  const toggleLesson = (slug: string) => {
    const nextState = !completed.includes(slug);
    markLessonCompleted(slug, nextState);
  };

  return {
    completed,
    isCompleted: (slug: string) => completed.includes(slug),
    toggleLesson,
    mounted: true,
    totalCompleted: completed.length
  };
}
