import { FilePracticeEvaluation } from '../../../domain';

export const sortFilePracticeEvaluationsByPracticeName = (
  a: FilePracticeEvaluation,
  b: FilePracticeEvaluation,
) => (a.practice.name < b.practice.name ? -1 : 1);
