import { ProjectCheckDeclaration, PracticeDeclaration, FileCheckPurpose } from '../../../../domain';
import { listPathsInDirectory } from '../../../../utils/filepaths/listPathsInDirectory';
import { UserInputError } from '../../../UserInputError';
import { getProjectCheckDeclaration } from './getProjectCheckDeclaration';

export const readPracticeDeclaration = async ({ declaredPracticeDirectory }: { declaredPracticeDirectory: string }) => {
  // grab the file paths in this dir
  const paths = await listPathsInDirectory({ directory: declaredPracticeDirectory });

  // grab the name of the practice
  const practiceName = declaredPracticeDirectory.split('/').slice(-1)[0];

  // find the "best-practice" dir, if one was defined
  const bestPracticeProjectCheck: ProjectCheckDeclaration | null = paths.includes('best-practice')
    ? await getProjectCheckDeclaration({
        purpose: FileCheckPurpose.BEST_PRACTICE,
        declaredProjectDirectory: `${declaredPracticeDirectory}/best-practice`,
      })
    : null;

  // find the "bad-practice" dirs, if any were defined
  const badPracticeProjectChecks: ProjectCheckDeclaration[] = await (async () => {
    if (!paths.includes('bad-practices')) return [];
    const badPracticesPaths = await listPathsInDirectory({ directory: `${declaredPracticeDirectory}/bad-practices` });
    return Promise.all(
      badPracticesPaths.map((path) =>
        getProjectCheckDeclaration({
          purpose: FileCheckPurpose.BAD_PRACTICE,
          declaredProjectDirectory: `${declaredPracticeDirectory}/bad-practices/${path}`,
        }),
      ),
    );
  })();

  // make sure that the `/bad-practices` dir was not typo'ed as `/bad-practice` on accident (happened on more than one occasion 😅)
  if (paths.includes('bad-practice'))
    throw new UserInputError(
      `a 'bad-practice/' directory was defined for practice '${practiceName}'. this is probably a typo and should have been 'bad-practices/'`,
      { potentialSolution: "rename 'bad-practice/' to 'bad-practices/'" },
    );

  // ensure atleast one of best-practice or bad-practice is defined
  if (!bestPracticeProjectCheck && !badPracticeProjectChecks.length)
    throw new UserInputError(
      `either a 'best-practice' or atleast one of 'bad-practices' must be defined for '${practiceName}'`,
    );

  // return it
  return new PracticeDeclaration({
    name: practiceName,
    bestPractice: bestPracticeProjectCheck,
    badPractices: badPracticeProjectChecks,
  });
};
