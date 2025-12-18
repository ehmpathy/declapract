import type { FileCheckEvaluation } from '@src/domain.objects';

export const sortFileCheckEvaluationsByPracticeRef = (
  a: FileCheckEvaluation,
  b: FileCheckEvaluation,
) => (a.practiceRef < b.practiceRef ? -1 : 1);
