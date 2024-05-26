import {
  FileCheckPurpose,
  FileCheckType,
  FileEvaluationResult,
  hasFailed,
} from '../../../domain';
import { ProjectCheckContext } from '../../../domain/objects/ProjectCheckContext';
import { testAssetsDirectoryPath } from '../../__test_assets__/dirPath';
import { readDeclarePracticesConfig } from '../../declaration/readDeclarePracticesConfig';
import { evaluteProjectAgainstPracticeDeclaration } from './evaluateProjectAgainstPracticeDeclaration';

describe('evaluteProjectAgainstPracticeDeclaration', () => {
  it('should be able to evaluate a practice with only a best practice', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'prettier',
    ); // lets use the "prettier" practice for this one, since its a "best-practice" only one
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.badPractices.length).toEqual(0); // check that our expectations for the test are met; should not have any bad practices

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-prettier`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(2); // 2 out of 3 fail
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(1); // 1 out of 3 pass
    expect(evaluations).toMatchSnapshot();
  });
  it('should be able to evaluate a practice with both a best practice and bad practices', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'dates-and-times',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.badPractices.length).toBeGreaterThan(0); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-dates-and-times`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(1);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(0);
    expect(
      evaluations[0]!.checks.filter(
        (check) => check.purpose === FileCheckPurpose.BEST_PRACTICE,
      )[0]!.result,
    ).toEqual(FileEvaluationResult.PASS);
    expect(
      evaluations[0]!.checks.filter(
        (check) => check.purpose === FileCheckPurpose.BAD_PRACTICE,
      )[0]!.result,
    ).toEqual(FileEvaluationResult.FAIL);
    expect(evaluations).toMatchSnapshot();
  });
  it('should be able to evaluate a practice with wildcard glob pattern path file checks - fails best and bad practices', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'directory-structure-src',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.badPractices.length).toBeGreaterThan(0); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-directory-structure-src`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(7);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(2);

    // sanity check a couple of important texamples
    expect(
      evaluations.find((file) => file.path === 'src/logic/**/*.ts'), // note that the file path is still wildcard, since no files were found by that glob
    ).toMatchObject({
      // should have found this file by wildcard _and_ failed it due to the contains check
      result: FileEvaluationResult.FAIL,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.FAIL,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.EXISTS,
        }),
      ]),
    });
    expect(
      evaluations.find(
        (file) => file.path === 'src/data/clients/coolServiceClient.ts',
      ),
    ).toMatchObject({
      // should have found this file by wildcard _and_ failed it due to the contains check not being satisfied correctly
      result: FileEvaluationResult.FAIL,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.FAIL,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.CONTAINS,
        }),
      ]),
    });
    expect(
      evaluations.find((file) => file.path === 'src/services/someFile.ts'), // shold have found this file from the bad-practices wildcard glob path
    ).toMatchObject({
      result: FileEvaluationResult.FAIL, // it failed,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.FAIL,
          purpose: FileCheckPurpose.BAD_PRACTICE,
          type: FileCheckType.EXISTS,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });
  it('should be able to evaluate a practice with wildcard glob pattern path file checks - passes without optionals', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'directory-structure-src',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.badPractices.length).toBeGreaterThan(0); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-passes-directory-structure-src-without-optionals`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });
    // console.log(JSON.stringify(evaluations, null, 2));

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(0);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(9);

    // sanity check a couple of important texamples
    expect(
      evaluations.find(
        (file) => file.path === 'src/contract/handlers/doSomething.ts',
      ), // found this file by wildcard glob path
    ).toMatchObject({
      result: FileEvaluationResult.PASS, // passed, due to existance
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.EXISTS,
        }),
      ]),
    });
    expect(
      evaluations.find((file) => file.path === 'src/data/clients/**/*.ts'), // did not find any files for this glob path -> glob path is kept
    ).toMatchObject({
      result: FileEvaluationResult.PASS,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.CONTAINS,
          required: false, // optional file -> that's why it passed
        }),
      ]),
    });
    expect(
      evaluations.find((file) => file.path === 'src/model/**/*.ts'), // should not have found any files in the model dir -> glob path is kept in the check
    ).toMatchObject({
      result: FileEvaluationResult.PASS, // it passed, because the bad practice check failed
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          type: FileCheckType.EXISTS,
          purpose: FileCheckPurpose.BAD_PRACTICE,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });
  it('should be able to evaluate a practice with wildcard glob pattern path file checks - passes with optionals', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'directory-structure-src',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.badPractices.length).toBeGreaterThan(0); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-passes-directory-structure-src-with-optionals`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });
    // console.log(JSON.stringify(evaluation, null, 2));

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(0);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(9);

    // sanity check a couple of important examples
    expect(
      evaluations.find(
        (file) => file.path === 'src/data/clients/svcAwesomeStuff.ts',
      ), // did not find any files for this glob path -> glob path is kept
    ).toMatchObject({
      result: FileEvaluationResult.PASS,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.CONTAINS,
        }),
      ]),
    });
    expect(
      evaluations.find(
        (file) => file.path === 'src/data/dao/superCoolThingDao/index.ts',
      ), // found this file by wildcard glob path
    ).toMatchObject({
      result: FileEvaluationResult.PASS, // passed, due to existance
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.EXISTS,
        }),
      ]),
    });
    expect(
      evaluations.find((file) => file.path === 'src/model/**/*.ts'), // should not have found any files in the model dir -> glob path is kept in the check
    ).toMatchObject({
      result: FileEvaluationResult.PASS,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BAD_PRACTICE,
          type: FileCheckType.EXISTS,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });
  it('should be able to evaluate a practice which reference project variables in the declared contents and custom checks', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'serverless',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.bestPractice).toBeDefined(); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-passes-serverless`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {
        organizationName: 'awesome-org',
        serviceName: 'svc-awesome-thing',
        infrastructureNamespaceId: 'abcde12345',
        slackReleaseWebHook: 'https://...',
      },
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });
    // console.log(JSON.stringify(evaluations, null, 2));
    evaluations
      .filter(hasFailed)
      .forEach((evaluation) =>
        evaluation.checks
          .filter(hasFailed)
          .forEach((failedCheck) => console.log(failedCheck.reason)),
      );

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(0);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(2);

    // sanity check a couple of important examples
    expect(
      evaluations.find((file) => file.path === 'serverless.yml'), // the serverless file should have passed
    ).toMatchObject({
      result: FileEvaluationResult.PASS,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS, // passed, due to having correct contents
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.CONTAINS,
        }),
      ]),
    });
    expect(
      evaluations.find((file) => file.path === 'package.json'), // found this file by wildcard glob path
    ).toMatchObject({
      result: FileEvaluationResult.PASS, // passed, due to having correct contents
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.CUSTOM,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });
  it('should be able to evaluate a practice which references project practices in the declared contents function for a contains check', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'format',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.bestPractice).toBeDefined(); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-passes-serverless`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: ['terraform'],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });

    // console.log(JSON.stringify(evaluations, null, 2));
    evaluations
      .filter(hasFailed)
      .forEach((evaluation) =>
        evaluation.checks
          .filter(hasFailed)
          .forEach((failedCheck) => console.log(failedCheck.reason)),
      );

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(1);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(0);

    // sanity check a couple of important examples
    expect(
      evaluations.find((file) => file.path === 'package.json'), // the package.json file should have failed
    ).toMatchObject({
      result: FileEvaluationResult.FAIL,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.FAIL, // passed, due to having missing contents
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.CONTAINS,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });
  it('should ignore the "node_modules" and ".declapract" directory when evaluating glob paths', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'testing',
    );
    if (!practice) fail('should have found a practice');

    // sanity check the practice we'll be using
    expect(practice.badPractices.length).toBeGreaterThan(0); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-passes-testing-with-bad-practices-in-ignored-dirs`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });
    // console.log(JSON.stringify(evaluations, null, 2));

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(0);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(1);

    // sanity check a couple of important examples
    expect(
      evaluations.find(
        (file) => file.path === 'node_modules/old-syntax.test.integration.ts',
      ), // should not have found this path
    ).not.toBeDefined(); // should have found it because `.declapract` directory should be ignored
    expect(
      evaluations.find(
        (file) =>
          file.path ===
          'node_modules/another-dir/old-syntax.test.integration.ts',
      ), // should not have found this path
    ).not.toBeDefined(); // should have found it because `.declapract` directory should be ignored

    expect(
      evaluations.find((file) => file.path === '**/*.test.integration.ts'), // did not find any files for this glob path -> glob path is kept
    ).toMatchObject({
      result: FileEvaluationResult.PASS,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.PASS,
          purpose: FileCheckPurpose.BAD_PRACTICE,
          type: FileCheckType.EXISTS,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });

  it.only('should include the ".npmrc" file when evaluating glob paths', async () => {
    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find(
      (thisPractice) => thisPractice.name === 'npmrc',
    );
    if (!practice) fail('should have found the practice');

    // sanity check the practice we'll be using
    console.log(practice);
    expect(practice.bestPractice).toBeDefined(); // check that our expectations for the test are met

    // now evaluate it
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-npmrc-practice`;
    const project = new ProjectCheckContext({
      getProjectRootDirectory: () => projectRootDirectory,
      projectVariables: {},
      projectPractices: [],
    });
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      project,
    });

    // check that the evaluation matches what we expect
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.FAIL)
        .length,
    ).toEqual(1);
    expect(
      evaluations.filter((file) => file.result === FileEvaluationResult.PASS)
        .length,
    ).toEqual(0);

    // sanity check a couple of important examples
    expect(
      evaluations.find((file) => file.path === '.npmrc'), // should  have found this path
    ).toBeDefined(); // should have found it because `.declapract` directory should be ignored

    expect(
      evaluations.find((file) => file.path === '.npmrc'), // should have required it to exist
    ).toMatchObject({
      result: FileEvaluationResult.FAIL,
      checks: expect.arrayContaining([
        expect.objectContaining({
          result: FileEvaluationResult.FAIL,
          purpose: FileCheckPurpose.BEST_PRACTICE,
          type: FileCheckType.EQUALS,
        }),
      ]),
    });

    // now just save an example of the results
    expect(evaluations).toMatchSnapshot();
  });
});
