import { FileCheckEvaluation } from '../../../domain';

export const sortFileCheckEvaluationsByPracticeRef = (a: FileCheckEvaluation, b: FileCheckEvaluation) =>
  a.practiceRef < b.practiceRef ? -1 : 1;
