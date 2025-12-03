import chalk from 'chalk';
import { LOG_LEVEL } from 'simple-leveled-log-methods';
import { isPresent } from 'type-fns';

import type { PracticeDeclaration } from '../../../domain';
import type { FilePracticeEvaluation } from '../../../domain/objects/FilePracticeEvaluation';
import type { ProjectCheckContext } from '../../../domain/objects/ProjectCheckContext';
import { ACTIVE_LOG_LEVEL } from '../../../utils/logger';
import { withDurationReporting } from '../../../utils/wrappers/withDurationReporting';
import { evaluteProjectAgainstPracticeDeclaration } from './evaluateProjectAgainstPracticeDeclaration';

const SKIP_BROKEN = process.env.SKIP_BROKEN?.toLocaleLowerCase() === 'true'; // TODO: pass in an argument through the oclif cli args

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
  project,
}: {
  practices: PracticeDeclaration[];
  project: ProjectCheckContext;
}): Promise<FilePracticeEvaluation[]> => {
  return (
    await Promise.all(
      practices.map((practice) =>
        withDurationReporting(
          `practice:${practice.name}`,
          () =>
            evaluteProjectAgainstPracticeDeclaration({
              practice,
              project,
            }).catch((error) => {
              console.log(chalk.yellow(`  ⚠️ broken practice:${practice.name}`)); // tslint:disable-line: no-console
              console.log(chalk.yellow(`    > ${error.message}`)); // tslint:disable-line: no-console
              if (ACTIVE_LOG_LEVEL === LOG_LEVEL.DEBUG) console.error(error); // only show this if running in debug mode
              if (SKIP_BROKEN !== true) throw error;
              return null;
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
  )
    .flat()
    .filter(isPresent);
};
