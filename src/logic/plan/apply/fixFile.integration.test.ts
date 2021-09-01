import { FileEvaluationResult } from '../../../domain';
import { doesFileExist } from '../../../utils/fileio/doesFileExist';
import { removeFileAsync } from '../../../utils/fileio/removeFileAsync';
import { writeFileAsync } from '../../../utils/fileio/writeFileAsync';
import { readDeclarePracticesConfig } from '../../config/readDeclarePracticesConfig';
import { testAssetsDirectoryPath } from '../../__test_assets__/dirPath';
import { evaluteProjectAgainstPracticeDeclaration } from '../get/evaluate/evaluateProjectAgainstPracticeDeclaration';
import { fixFile } from './fixFile';

describe('fixFile', () => {
  it('should be able to fix by changing contents', async () => {
    const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-prettier-for-fixing`;

    // overwrite the contents of the file we're planning on fixing in this test, to get it back to the failing state
    await writeFileAsync({ path: `${projectRootDirectory}/.prettierignore`, content: '.js' }); // write the file contents to get it to failing state

    // lookup a practice
    const declarations = await readDeclarePracticesConfig({
      configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    });
    const practice = declarations.practices.find((practice) => practice.name === 'prettier'); // lets use the "prettier" practice for this one
    if (!practice) fail('should have found a practice');

    // now evaluate it
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory });

    // now find the ".prettierignore" file's evaluation against this practice
    const evaluation = evaluations.find((evaluation) => evaluation.path === '.prettierignore')?.checked.bestPractice[0];
    if (!evaluation) throw new Error('should have found the evaluation');
    expect(evaluation.result).toEqual(FileEvaluationResult.FAIL);
    await fixFile({ evaluation, projectRootDirectory });

    // now evaluate it again and see whether it now passes
    const evaluationsNow = await evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory });
    const evaluationNow = evaluationsNow.find((evaluation) => evaluation.path === '.prettierignore')?.checked
      .bestPractice[0];
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
    const evaluations = await evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory });

    // now find the ".prettierignore" file's evaluation against this practice
    const evaluation = evaluations.find((evaluation) => evaluation.path === fileToCheckRelativePath)?.checked
      .bestPractice[0];
    if (!evaluation) throw new Error('should have found the evaluation');
    expect(evaluation.result).toEqual(FileEvaluationResult.FAIL);
    await fixFile({ evaluation, projectRootDirectory });

    // now evaluate it again and see whether it now passes
    const evaluationsNow = await evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory });
    const evaluationNow = evaluationsNow.find((evaluation) => evaluation.path === fileToCheckRelativePath)?.checked
      .bestPractice[0];
    if (!evaluationNow) throw new Error('should have found the evaluation');
    expect(evaluationNow.result).toEqual(FileEvaluationResult.PASS);
  });
  it('should be able to fix by removing an existing file', async () => {
    throw new Error('todo - src directory check must be able to remove files... but that means must support fixes');
    // const projectRootDirectory = `${testAssetsDirectoryPath}/example-project-fails-prettier-for-fixing`;
    // const fileToCheckRelativePath = 'prettier.config.js';

    // // overwrite the contents of the file we're planning on fixing in this test, to get it back to the failing state
    // if (await doesFileExist({ filePath: `${projectRootDirectory}/${fileToCheckRelativePath}` }))
    //   await removeFileAsync({ path: `${projectRootDirectory}/${fileToCheckRelativePath}` });

    // // lookup a practice
    // const declarations = await readDeclarePracticesConfig({
    //   configPath: `${testAssetsDirectoryPath}/example-best-practices-repo/declapract.declare.yml`,
    // });
    // const practice = declarations.practices.find((practice) => practice.name === 'prettier'); // lets use the "prettier" practice for this one
    // if (!practice) fail('should have found a practice');

    // // now evaluate it
    // const evaluations = await evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory });

    // // now find the ".prettierignore" file's evaluation against this practice
    // const evaluation = evaluations.find((evaluation) => evaluation.path === fileToCheckRelativePath)?.checked
    //   .bestPractice[0];
    // if (!evaluation) throw new Error('should have found the evaluation');
    // expect(evaluation.result).toEqual(FileEvaluationResult.FAIL);
    // await fixFile({ evaluation, projectRootDirectory });

    // // now evaluate it again and see whether it now passes
    // const evaluationsNow = await evaluteProjectAgainstPracticeDeclaration({ practice, projectRootDirectory });
    // const evaluationNow = evaluationsNow.find((evaluation) => evaluation.path === fileToCheckRelativePath)?.checked
    //   .bestPractice[0];
    // if (!evaluationNow) throw new Error('should have found the evaluation');
    // expect(evaluationNow.result).toEqual(FileEvaluationResult.PASS);
  });
});
