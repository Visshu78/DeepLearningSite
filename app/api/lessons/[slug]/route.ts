import { NextRequest, NextResponse } from 'next/server';
import { getLessonBySlug } from '@/lib/lesson-data/curriculum';
import { LESSON_DETAILS } from '@/lib/lesson-data/lessonContent';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const meta = getLessonBySlug(slug);
  const content = LESSON_DETAILS[slug];

  if (!meta || !content) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  return NextResponse.json({
    meta,
    content: {
      ...content,
      quiz: content.quiz.map(({ id, question, options }) => ({
        id,
        question,
        options,
      })),
    },
  });
}
