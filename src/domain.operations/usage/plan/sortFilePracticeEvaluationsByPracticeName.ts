import type { FilePracticeEvaluation } from '@src/domain.objects';

export const sortFilePracticeEvaluationsByPracticeName = (
  a: FilePracticeEvaluation,
  b: FilePracticeEvaluation,
) => (a.practice.name < b.practice.name ? -1 : 1);
