import { describe, it, expect } from 'vitest';
import { CURRICULUM, ALL_LESSONS } from '../lib/lesson-data/curriculum';
import { LESSON_DETAILS } from '../lib/lesson-data/lessonContent';
import { TRACK_PROJECTS, getProjectBySlug } from '../lib/lesson-data/projects';

describe('NeuroPlay PRD v2.1 Curriculum & Lesson Structure', () => {
  it('defines all 10 tracks in the exact learning order (0 -> 9 -> 1..8) with 57 total lessons', () => {
    expect(CURRICULUM.length).toBe(10);
    const trackNumbers = CURRICULUM.map(t => t.number);
    expect(trackNumbers).toEqual([0, 9, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(ALL_LESSONS.length).toBe(57);
  });

  it('includes all 57 available interactive lessons across all 10 tracks with full Section 5 template fields', () => {
    const availableTracks = CURRICULUM.filter(t => t.status === 'available');
    expect(availableTracks.length).toBe(10);

    const availableLessons = ALL_LESSONS.filter(l => l.status === 'available');
    expect(availableLessons.length).toBe(57);

    for (const lesson of availableLessons) {
      const detail = LESSON_DETAILS[lesson.slug];
      expect(detail, `Missing LESSON_DETAILS for ${lesson.slug}`).toBeDefined();
      expect(detail.scene.title.length).toBeGreaterThan(3);
      expect(detail.scene.narrative.length).toBeGreaterThan(40);
      expect(detail.mapping.length).toBeGreaterThanOrEqual(3);
      expect(detail.playWithItPrompt.length).toBeGreaterThan(20);
      expect(detail.analogyBreaks.length).toBeGreaterThan(30);
      expect(detail.mathFormulas.length).toBeGreaterThanOrEqual(1);
      expect(detail.workedExample.steps.length).toBeGreaterThanOrEqual(2);
      expect(detail.quiz.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('defines all 18 track projects and 3 capstones with verified external dataset metadata and disclaimers', () => {
    expect(TRACK_PROJECTS.length).toBe(21);
    const capstones = TRACK_PROJECTS.filter(p => p.isCapstone);
    expect(capstones.length).toBe(3);

    for (const proj of TRACK_PROJECTS) {
      expect(proj.dataset.url).toMatch(/^https:\/\//);
      expect(proj.milestones.length).toBeGreaterThanOrEqual(3);
      expect(proj.rubricQuestions.length).toBe(3);
      expect(proj.resumeBulletTemplate.length).toBeGreaterThan(30);
    }

    const xrayProject = getProjectBySlug('chest-xray-classifier');
    expect(xrayProject).toBeDefined();
    expect(xrayProject?.medicalDisclaimer).toMatch(/NOT FOR CLINICAL OR MEDICAL DIAGNOSIS/i);
  });
});
