import { FileActionPlan, FilePracticeEvaluation, PracticeDeclaration } from '../../../domain';
import { evaluteProjectAgainstPracticeDeclarations } from './evaluate/evaluateProjectAgainstPracticeDeclarations';
import { getRequiredActionForFile } from './getRequiredActionForFile';

/**
 * get the plans required to make a project follow the declared practices
 */
export const getPlansForProject = async ({
  practices,
  projectRootDirectory,
}: {
  practices: PracticeDeclaration[];
  projectRootDirectory: string;
}) => {
  // evaluate the project against the practices
  const evaluations = await evaluteProjectAgainstPracticeDeclarations({ practices, projectRootDirectory });

  // convert each file evaluation in to a plan per file
  const evaluationsPerFile = evaluations.reduce((summary, thisEvaluation) => {
    const currentState = summary[thisEvaluation.path] ?? []; // default to empty array
    return { ...summary, [thisEvaluation.path]: [...currentState, thisEvaluation] }; // append this evaluation
  }, {} as Record<string, FilePracticeEvaluation[]>);

  // compose evaluations into plans
  const plans = Object.entries(evaluationsPerFile).map(
    ([path, evaluations]) =>
      new FileActionPlan({
        path,
        evaluations,
        action: getRequiredActionForFile({ evaluations }),
      }),
  );

  // return the plans
  return plans;
};
