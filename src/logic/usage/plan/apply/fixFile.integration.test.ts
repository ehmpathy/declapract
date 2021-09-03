import { FileCheckPurpose, FileEvaluationResult } from '../../../../domain';
import { doesFileExist } from '../../../../utils/fileio/doesFileExist';
import { removeFileAsync } from '../../../../utils/fileio/removeFileAsync';
import { writeFileAsync } from '../../../../utils/fileio/writeFileAsync';
import { testAssetsDirectoryPath } from '../../../__test_assets__/dirPath';
import { readDeclarePracticesConfig } from '../../../declaration/readDeclarePracticesConfig';
import { evaluteProjectAgainstPracticeDeclaration } from '../../evaluate/evaluateProjectAgainstPracticeDeclaration';
import { fixFile } from './fixFile';

describe('fixFile', () => {
  it('should be able to fix by changing contents', async () => {
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-prettier-for-fixing`;
    const fileToCheckRelativePath = '.prettierignore';

    // overwrite the contents of the file we're planning on fixing in this test, to get it back to the failing state
    await writeFileAsync({ path: `${projectRootDirectory}/${fileToCheckRelativePath}`, content: '.js' }); // write the file contents to get it to failing state

    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find((practice) => practice.name === 'prettier'); // lets use the "prettier" practice for this one
    if (!practice) fail('should have found a practice');

    // now evaluate it
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      projectRootDirectory,
      projectVariables: {},
    });

    // now find the file's evaluation against this practice
    const evaluation = evaluations
      .find((evaluation) => evaluation.path === fileToCheckRelativePath)
      ?.checks.find((check) => check.purpose === FileCheckPurpose.BEST_PRACTICE);
    if (!evaluation) throw new Error('should have found the evaluation');
    expect(evaluation.result).toEqual(FileEvaluationResult.FAIL);

    // run the fix on that evaluation
    await fixFile({ evaluation, projectRootDirectory, projectVariables: {} });

    // now evaluate it again and see whether it now passes
    const evaluationsNow = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      projectRootDirectory,
      projectVariables: {},
    });
    const evaluationNow = evaluationsNow
      .find((evaluation) => evaluation.path === fileToCheckRelativePath)
      ?.checks.find((check) => check.purpose === FileCheckPurpose.BEST_PRACTICE);
    if (!evaluationNow) throw new Error('should have found the evaluation');
    expect(evaluationNow.result).toEqual(FileEvaluationResult.PASS);
  });
  it('should be able to fix by creating a new file', async () => {
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-prettier-for-fixing`;
    const fileToCheckRelativePath = 'prettier.config.js';

    // overwrite the contents of the file we're planning on fixing in this test, to get it back to the failing state
    if (await doesFileExist({ filePath: `${projectRootDirectory}/${fileToCheckRelativePath}` }))
      await removeFileAsync({ path: `${projectRootDirectory}/${fileToCheckRelativePath}` });

    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find((practice) => practice.name === 'prettier'); // lets use the "prettier" practice for this one
    if (!practice) fail('should have found a practice');

    // now evaluate it
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      projectRootDirectory,
      projectVariables: {},
    });

    // now find the file's evaluation against this practice
    const evaluation = evaluations
      .find((evaluation) => evaluation.path === fileToCheckRelativePath)
      ?.checks.find((check) => check.purpose === FileCheckPurpose.BEST_PRACTICE);
    if (!evaluation) throw new Error('should have found the evaluation');
    expect(evaluation.result).toEqual(FileEvaluationResult.FAIL);

    // run the fix on that evaluation
    await fixFile({ evaluation, projectRootDirectory, projectVariables: {} });

    // now evaluate it again and see whether it now passes
    const evaluationsNow = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      projectRootDirectory,
      projectVariables: {},
    });
    const evaluationNow = evaluationsNow
      .find((evaluation) => evaluation.path === fileToCheckRelativePath)
      ?.checks.find((check) => check.purpose === FileCheckPurpose.BEST_PRACTICE);
    if (!evaluationNow) throw new Error('should have found the evaluation');
    expect(evaluationNow.result).toEqual(FileEvaluationResult.PASS);
  });
  it('should be able to fix by removing the file', async () => {
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-directory-structure-src-for-fixing`;
    const fileToCheckRelativePath = 'src/services/someFile.ts';

    // overwrite the contents of the file we're planning on fixing in this test, to get it back to the failing state
    await writeFileAsync({
      path: `${projectRootDirectory}/${fileToCheckRelativePath}`,
      content: 'const shouldExist = false;', // any contents, really
    });

    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find((practice) => practice.name === 'directory-structure-src'); // lets use the "prettier" practice for this one
    if (!practice) fail('should have found a practice');

    // now evaluate it
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      projectRootDirectory,
      projectVariables: {},
    });

    // now find the file's evaluation against this practice
    const evaluation = evaluations
      .find((evaluation) => evaluation.path === fileToCheckRelativePath)
      ?.checks.find((check) => check.purpose === FileCheckPurpose.BAD_PRACTICE);
    if (!evaluation) throw new Error('should have found the evaluation');
    expect(evaluation.result).toEqual(FileEvaluationResult.FAIL); // should have failed the bad practice check (i.e., file exists)

    // run the fix on that evaluation
    await fixFile({ evaluation, projectRootDirectory, projectVariables: {} });

    // now evaluate it again and see whether it now passes
    const evaluationsNow = await evaluteProjectAgainstPracticeDeclaration({
      practice,
      projectRootDirectory,
      projectVariables: {},
    });
    const evaluationNow = evaluationsNow
      .find((evaluation) => evaluation.path === fileToCheckRelativePath)
      ?.checks.find((check) => check.purpose === FileCheckPurpose.BAD_PRACTICE);
    expect(evaluationNow).toEqual(undefined); // should not be defined anymore, since that file should have been deleted
  });
});
