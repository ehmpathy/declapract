import { RequiredAction } from '../../domain';
import { getPlansForProject } from '../plan/getPlansForProject';
import { readPracticeDeclaration } from '../read/readDeclarations/readPracticeDeclaration/readPracticeDeclaration';
import { testAssetsDirectoryPath } from '../__test_assets__/dirPath';
import { displayPlan } from './displayPlan';

const logSpy = jest.spyOn(console, 'log');

describe('displayPlan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should show no change plans correctly', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find((plan) => plan.action === RequiredAction.NO_CHANGE);
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[NO_CHANGE]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('package.json'));
    expect(logSpy.mock.calls[0]).toMatchSnapshot();
  });
  it('should show automatically fixable plans correctly', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find((plan) => plan.action === RequiredAction.FIX_AUTOMATIC);
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[FIX_AUTOMATIC]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('.prettierignore'));
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
  it('should show manually fixable plans correctly', async () => {
    const practice = await readPracticeDeclaration({
      declaredPracticeDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times`,
    });
    const plans = await getPlansForProject({
      projectRootDirectory: `${testAssetsDirectoryPath}/example-project-fails-prettier`,
      practices: [practice],
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find((plan) => plan.action === RequiredAction.FIX_MANUAL);
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[FIX_MANUAL]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('package.json'));
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
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find((plan) => plan.action === RequiredAction.FIX_MANUAL);
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[FIX_MANUAL]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('package.json'));
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
    });
    // console.log(JSON.stringify(plans, null, 2));

    // grab the no change plan
    const plan = plans.find((plan) => plan.action === RequiredAction.FIX_MANUAL);
    if (!plan) throw new Error('expected to find the plan here');

    // now display the plan
    displayPlan({ plan });

    // check that it looks right
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[FIX_MANUAL]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('package.json'));
    expect(logSpy.mock.calls).toMatchSnapshot();
  });
  it.todo('should show failing both manually and automatically correctly');
});
