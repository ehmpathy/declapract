import { RequiredAction } from '../../../domain';
import { readPracticeDeclaration } from '../../config/readDeclarations/readPracticeDeclaration/readPracticeDeclaration';
import { testAssetsDirectoryPath } from '../../__test_assets__/dirPath';
import { getPlansForProject } from './getPlansForProject';

describe('getPlansForProject', () => {
  it('should define that a file failing a check that is not automatically fixable needs FIX_MANUAL action', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
    });
    // console.log(JSON.stringify(plans, null, 2));
    expect(plans.find((plan) => plan.path === 'package.json')).toMatchObject({
      action: RequiredAction.FIX_MANUAL,
    });
    expect(plans.find((plan) => plan.path === '.prettierignore')).toEqual(undefined); // not evaluated since not in the practices
  });
  it('should define that a file failing a check that _is_ automatically fixable needs FIX_AUTOMATIC action', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
    });
    // console.log(JSON.stringify(plans, null, 2));
    expect(plans.find((plan) => plan.path === '.prettierignore')).toMatchObject({
      action: RequiredAction.FIX_AUTOMATIC,
    });
    expect(plans.find((plan) => plan.path === 'package.json')).toMatchObject({
      action: RequiredAction.NO_CHANGE,
    });
  });
  it('should combine evaluations per file across multiple practices', async () => {
    const practices = await Promise.all([
      readPracticeDeclaration({
        declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
      }),
      readPracticeDeclaration({
        declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
      }),
    ]);
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices,
    });
    // console.log(JSON.stringify(plans, null, 2));
    expect(plans.find((plan) => plan.path === '.prettierignore')).toMatchObject({
      action: RequiredAction.FIX_AUTOMATIC,
    });
    expect(plans.find((plan) => plan.path === 'package.json')).toMatchObject({
      action: RequiredAction.FIX_MANUAL,
    });
  });
});
