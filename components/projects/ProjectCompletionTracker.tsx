'use client';

import React, { useSyncExternalStore } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface MilestoneItem {
  number: number;
  title: string;
}

interface ProjectCompletionTrackerProps {
  projectSlug: string;
  milestones: MilestoneItem[];
}

const STORAGE_KEY = 'neuroplay_project_progress';

function getSnapshot(): string {
  if (typeof window === 'undefined') return '{}';
  try {
    return localStorage.getItem(STORAGE_KEY) || '{}';
  } catch {
    return '{}';
  }
}

function getServerSnapshot(): string {
  return '{}';
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('neuroplay_project_updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('neuroplay_project_updated', callback);
    window.removeEventListener('storage', callback);
  };
}

interface ProjectState {
  completed?: boolean;
  milestones?: number[];
}

export function ProjectCompletionTracker({
  projectSlug,
  milestones,
}: ProjectCompletionTrackerProps) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let allState: Record<string, ProjectState> = {};
  try {
    allState = JSON.parse(raw) || {};
  } catch {
    allState = {};
  }

  const current: ProjectState = allState[projectSlug] || {};
  const checkedMilestones = current.milestones || [];
  const isCompleted = Boolean(current.completed);

  const saveState = (next: ProjectState) => {
    if (typeof window === 'undefined') return;
    try {
      const updated = { ...allState, [projectSlug]: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('neuroplay_project_updated'));
    } catch {
      // ignore storage errors
    }
  };

  const toggleMilestone = (num: number) => {
    const nextMilestones = checkedMilestones.includes(num)
      ? checkedMilestones.filter(n => n !== num)
      : [...checkedMilestones, num];
    saveState({
      ...current,
      milestones: nextMilestones,
      completed: nextMilestones.length === milestones.length ? true : current.completed,
    });
  };

  const toggleProjectComplete = () => {
    saveState({
      ...current,
      completed: !isCompleted,
      milestones: !isCompleted ? milestones.map(m => m.number) : checkedMilestones,
    });
  };

  return (
    <section
      className={`rounded-xl p-5 sm:p-6 border space-y-4 ${
        isCompleted
          ? 'bg-[#F0FDF4] border-[#BBF7D0]'
          : 'bg-[#FAF5EE] border-[#E2D3BD]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div
            className={`text-xs font-mono-num font-bold uppercase tracking-wider ${
              isCompleted ? 'text-[#166534]' : 'text-[#7A1C30]'
            }`}
          >
            {isCompleted ? 'Project Completed' : 'Project Checklist & Completion'}
          </div>
          <p className="text-sm text-[#1D1819] font-medium">
            {checkedMilestones.length} of {milestones.length} milestones checked off
          </p>
        </div>

        <button
          type="button"
          onClick={toggleProjectComplete}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors border cursor-pointer ${
            isCompleted
              ? 'bg-white border-[#86EFAC] text-[#166534]'
              : 'bg-[#7A1C30] border-[#7A1C30] text-white hover:bg-[#5E1424]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Completed ✓' : 'Mark Project Complete'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {milestones.map(m => {
          const checked = checkedMilestones.includes(m.number);
          return (
            <button
              key={m.number}
              type="button"
              onClick={() => toggleMilestone(m.number)}
              className={`flex items-start gap-2.5 p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                checked
                  ? 'bg-white border-[#86EFAC] text-[#166534]'
                  : 'bg-white border-[#E8E2D9] text-[#1D1819] hover:border-[#7A1C30]'
              }`}
            >
              {checked ? (
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-[#968A86] shrink-0 mt-0.5" />
              )}
              <span>
                <strong>M{m.number}:</strong> {m.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
