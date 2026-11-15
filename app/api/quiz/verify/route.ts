import { NextRequest, NextResponse } from 'next/server';
import { LESSON_DETAILS } from '@/lib/lesson-data/lessonContent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonSlug, questionId, selectedIndex } = body as {
      lessonSlug?: string;
      questionId?: string;
      selectedIndex?: number;
    };

    if (!lessonSlug || !questionId || typeof selectedIndex !== 'number') {
      return NextResponse.json(
        { error: 'Missing lessonSlug, questionId, or selectedIndex' },
        { status: 400 }
      );
    }

    const lesson = LESSON_DETAILS[lessonSlug];
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const question = lesson.quiz.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({
      isCorrect: selectedIndex === question.correctIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
