import React from 'react';
import { PRACTICE_CHALLENGES } from '@/lib/lesson-data/practiceChallenges';
import { PracticeClient } from '@/components/quiz/PracticeClient';

export default function PracticePage() {
  const publicChallenges = PRACTICE_CHALLENGES.map(
    ({ id, category, title, scenario, question, options }) => ({
      id,
      category,
      title,
      scenario,
      question,
      options,
    })
  );

  return <PracticeClient challenges={publicChallenges} />;
}
