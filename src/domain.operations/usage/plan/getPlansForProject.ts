import {
  FileActionPlan,
  type FilePracticeEvaluation,
  type PracticeDeclaration,
  type ProjectVariablesImplementation,
} from '@src/domain.objects';
import { ProjectCheckContext } from '@src/domain.objects/ProjectCheckContext';
import { evaluateProjectAgainstPracticeDeclarations } from '@src/domain.operations/usage/evaluate/evaluateProjectAgainstPracticeDeclarations';
import { withDurationReporting } from '@src/utils/wrappers/withDurationReporting';

import { getRequiredActionForFile } from './getRequiredActionForFile';

/**
 * get the plans required to make a project follow the declared practices
 */
export const getPlansForProject = withDurationReporting(
  'getPlansForProject',
  async ({
    practices,
    projectRootDirectory,
    projectVariables,
  }: {
    practices: PracticeDeclaration[];
    projectRootDirectory: string;
    projectVariables: ProjectVariablesImplementation;
  }) => {
    // define the project context
    const project = new ProjectCheckContext({
      projectVariables,
      projectPractices: practices.map((practice) => practice.name),
      getProjectRootDirectory: () => projectRootDirectory,
    });

    // evaluate the project against the practices
    const evaluations = await evaluateProjectAgainstPracticeDeclarations({
      practices,
      project,
    });

    // convert each file evaluation in to a plan per file
    const evaluationsPerFile = evaluations.reduce(
      (summary, thisEvaluation) => {
        const currentState = summary[thisEvaluation.path] ?? []; // default to empty array
        return {
          ...summary,
          [thisEvaluation.path]: [...currentState, thisEvaluation],
        }; // append this evaluation
      },
      {} as Record<string, FilePracticeEvaluation[]>,
    );

    // compose evaluations into plans
    const plans = Object.entries(evaluationsPerFile).map(
      ([path, evaluationsForFile]) =>
        new FileActionPlan({
          path,
          evaluations: evaluationsForFile,
          action: getRequiredActionForFile({ evaluations: evaluationsForFile }),
        }),
    );

    // return the plans
    return plans;
  },
);
