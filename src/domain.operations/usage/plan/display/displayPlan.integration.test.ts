import { RequiredAction } from '@src/domain.objects';
import { testAssetsDirectoryPath } from '@src/domain.operations/.test.assets/dirPath';
import { readPracticeDeclaration } from '@src/domain.operations/declaration/readPracticeDeclarations/readPracticeDeclaration/readPracticeDeclaration';
import { getPlansForProject } from '@src/domain.operations/usage/plan/getPlansForProject';
import { log } from '@src/utils/logger';

import { displayPlan } from './displayPlan';

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => log.debug); // swap to log debug so its not displaying during tests by default

describe('displayPlan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should show no change plans correctly', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
      projectVariables: {},
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find(
      (thisPlan) => thisPlan.action === RequiredAction.NO_CHANGE,
    );
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    await displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[NO_CHANGE]'));
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
    );
    expect(logSpy.mock.calls[0]).toMatchSnapshot();
  });
  it('should show automatically fixable plans correctly', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
      projectVariables: {},
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find(
      (thisPlan) => thisPlan.action === RequiredAction.FIX_AUTOMATIC,
    );
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    await displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[FIX_AUTOMATIC]'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('.prettierignore'),
    );
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
  it('should show manually fixable plans correctly', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
      projectVariables: {},
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find(
      (thisPlan) => thisPlan.action === RequiredAction.FIX_MANUAL,
    );
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    await displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[FIX_MANUAL]'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
    );
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
  it('should show failing bad practice correctly', async () => {
    const practices = await Promise.all([
      await readPracticeDeclaration({
        declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
      }),
    ]);
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-dates-and-times`,
      practices,
      projectVariables: {},
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find(
      (thisPlan) => thisPlan.action === RequiredAction.FIX_MANUAL,
    );
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    await displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[FIX_MANUAL]'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
    );
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
  it('should show failing multiple practices on the same file correctly', async () => {
    const practices = await Promise.all([
      await readPracticeDeclaration({
        declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
      }),
      await readPracticeDeclaration({
        declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
      }),
    ]);
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-dates-and-times`,
      practices,
      projectVariables: {},
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find(
      (thisPlan) => thisPlan.action === RequiredAction.FIX_MANUAL,
    );
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    await displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[FIX_MANUAL]'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
    );
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
  it.todo('should show failing both manually and automatically correctly');
});
