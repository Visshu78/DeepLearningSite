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

  it('marks exactly 1 free preview lesson per track (10 total) and balances quiz correctIndex without giveaway options', () => {
    const freePreviews = ALL_LESSONS.filter(l => l.isFreePreview);
    expect(freePreviews.length).toBe(10);
    for (const track of CURRICULUM) {
      const trackFree = track.lessons.filter(l => l.isFreePreview);
      expect(trackFree.length).toBe(1);
    }

    // Lesson 0.1 must not list the right answer first or attach explanations to options
    const lesson01 = LESSON_DETAILS['vectors-matrices-and-dot-products'];
    expect(lesson01.quiz[0].correctIndex).toBe(2);
    expect(lesson01.quiz[1].correctIndex).toBe(1);
    for (const q of lesson01.quiz) {
      for (const opt of q.options) {
        expect(opt).not.toContain('—');
      }
    }

    // Across all 115 questions, correctIndex is evenly distributed across 0, 1, 2, 3
    const counts = [0, 0, 0, 0];
    let totalQuestions = 0;
    let longestIsCorrect = 0;
    for (const detail of Object.values(LESSON_DETAILS)) {
      for (const q of detail.quiz) {
        counts[q.correctIndex]++;
        totalQuestions++;
        const cLen = q.options[q.correctIndex].length;
        const maxWrong = Math.max(
          ...q.options.filter((_, idx) => idx !== q.correctIndex).map(o => o.length)
        );
        if (cLen > maxWrong) longestIsCorrect++;
        // Correct option must never be more than 10 chars longer than the longest distractor
        expect(cLen - maxWrong).toBeLessThanOrEqual(10);
      }
    }
    for (const count of counts) {
      expect(count).toBeGreaterThanOrEqual(Math.floor(totalQuestions * 0.2));
      expect(count).toBeLessThanOrEqual(Math.ceil(totalQuestions * 0.3));
    }
    // Correct option is longest in roughly ~1/4 of questions (under 35%)
    expect(longestIsCorrect / totalQuestions).toBeLessThan(0.35);
  });

  it('verifies mathematical, historical, and domain accuracy fixes across Tracks 3, 4, 5, 6, and 9', () => {
    // 6.2 FFN formula & Pre-LN GPT-2/3 + LLaMA
    const l62 = LESSON_DETAILS['transformer-block-multihead-attention'];
    expect(l62.scene.narrative).toContain('at the intermission');
    expect(l62.intuition.join(' ')).toContain('GPT-2/3, LLaMA');
    expect(l62.intuition.join(' ')).not.toContain('GPT-4');
    const ffnFormula = l62.mathFormulas.find(f => f.name.includes('Feed-Forward'));
    expect(ffnFormula?.latex).not.toContain('\\max(0, x W_1 + b_1) W_2 + b_2 = \\text{GELU}');
    expect(ffnFormula?.explanation).toMatch(/ReLU in the original.*GELU/i);

    // 9.7 sin/cos collision example uses 3 AM and 9 AM
    const l97 = LESSON_DETAILS['feature-engineering-and-pipelines'];
    expect(l97.intuition.join(' ')).toContain('3 AM and 9 AM');
    expect(l97.intuition.join(' ')).not.toContain('6 AM and 6 PM');

    // 4.4 scene says 4 patches / 4 stops
    const l44 = LESSON_DETAILS['cnn-backpropagation'];
    expect(l44.scene.narrative).toContain('4 different patches');
    expect(l44.scene.narrative).toContain('4 stops');

    // 5.3 Jacobian uses diag(1 - h_k^2) W_hh (no transpose)
    const l53 = LESSON_DETAILS['bptt-and-vanishing-gradients'];
    expect(l53.mathFormulas[0].latex).toContain('\\text{diag}(1 - \\mathbf{h}_k^2)\\,\\mathbf{W}_{hh}');
    expect(l53.mathFormulas[0].latex).not.toContain('\\mathbf{W}_{hh}^\\top');
    expect(l53.intuition.join(' ')).toContain('Across (T - t)');

    // 5.4 credits Gers et al. (2000) for the forget gate
    const l54 = LESSON_DETAILS['lstm-networks'];
    expect(l54.intuition.join(' ')).toContain('Gers');
    expect(l54.intuition.join(' ')).toContain('2000');

    // 5.5 includes reset gate r_t, PyTorch swapped z_t note, and Luong vs Bahdanau attention
    const l55 = LESSON_DETAILS['gru-and-seq2seq'];
    expect(l55.mathFormulas[0].latex).toContain('\\mathbf{r}_t');
    expect(l55.intuition.join(' ')).toContain('PyTorch');
    expect(l55.mathFormulas[1].name).toContain('Luong');
    expect(l55.workedExample.steps[0].math).toContain('r_t');

    // 3.3 mentions AdamW / decoupled weight decay
    const l33 = LESSON_DETAILS['regularization-dropout'];
    expect(l33.intuition.join(' ')).toContain('AdamW');

    // 9.2 vs 9.3 ownership and Min-Max test range note
    const l92 = LESSON_DETAILS['handling-missing-data'];
    expect(l92.scene.title).toContain('An Attendance Sheet');
    expect(l92.scene.title).not.toContain('350%');
    expect(l92.quiz[0].options[l92.quiz[0].correctIndex]).toContain('Fill the blanks with 0');

    const l93 = LESSON_DETAILS['outliers-and-feature-scaling'];
    expect(l93.intuition.join(' ')).toMatch(/ONLY on training data/i);
    expect(l93.mathFormulas[0].name).toContain('Tukey IQR');

    // 4.7 mentions B0-B7 follow phi approximately
    const l47 = LESSON_DETAILS['efficientnet-compound-scaling'];
    expect(l47.intuition.join(' ')).toContain('approximately');
  });
});
