import chalk from 'chalk';

import {
  PracticeDeclaration,
  ProjectVariablesImplementation,
} from '../../../domain';
import { FilePracticeEvaluation } from '../../../domain/objects/FilePracticeEvaluation';
import { withDurationReporting } from '../../../utils/wrappers/withDurationReporting';
import { evaluteProjectAgainstPracticeDeclaration } from './evaluateProjectAgainstPracticeDeclaration';

const colorDurationInSeconds = (durationInSeconds: number) => {
  const message = `${durationInSeconds} seconds`;
  if (durationInSeconds < 3) return chalk.gray(message);
  if (durationInSeconds < 7) return chalk.yellow(message);
  return chalk.red(message);
};

/**
 * given:
 * - practice declarations
 * - directory to project
 *
 * does:
 * - check that the project conforms to the practices specified
 *
 * note: not checking against use case specifically because we may be asked to apply multiple use cases to the same project
 */
export const evaluateProjectAgainstPracticeDeclarations = async ({
  practices,
  projectRootDirectory,
  projectVariables,
}: {
  practices: PracticeDeclaration[];
  projectRootDirectory: string;
  projectVariables: ProjectVariablesImplementation;
}): Promise<FilePracticeEvaluation[]> => {
  return (
    await Promise.all(
      practices.map((practice) =>
        withDurationReporting(
          `practice:${practice.name}`,
          () =>
            evaluteProjectAgainstPracticeDeclaration({
              practice,
              projectRootDirectory,
              projectVariables,
            }),
          {
            reportingThresholdSeconds: 0.5,
            log: ({ durationInSeconds }) =>
              console.log(
                chalk.gray(
                  `    > took ${colorDurationInSeconds(durationInSeconds)}`,
                ),
              ), // tslint:disable-line: no-console
          },
        )(),
      ),
    )
  ).flat();
};
