import { UserInputError } from '../UserInputError';
import { replaceProjectVariablesInDeclaredFileContents } from './replaceProjectVariablesInDeclaredFileContents';

const exampleReadmeFileContents = `
# @declapract{variable.serviceName}

this is the readme for @declapract{variable.serviceName} of the @declapract{variable.organizationName} org
`.trim();

describe('replaceProjectVariablesInDeclaredFileContents', () => {
  it('should replace all occurrences of declared variables with their implemented values', async () => {
    const replacedFileContents = replaceProjectVariablesInDeclaredFileContents({
      projectVariables: { serviceName: 'super-cool-service', organizationName: 'org-of-coolness' },
      fileContents: exampleReadmeFileContents,
    });
    expect(replacedFileContents).toEqual(
      `
# super-cool-service

this is the readme for super-cool-service of the org-of-coolness org
    `.trim(),
    );
  });
  it('should throw an error if one of the variables did not have its value defined', async () => {
    try {
      replaceProjectVariablesInDeclaredFileContents({
        projectVariables: { organizationName: 'org-of-coolness' },
        fileContents: exampleReadmeFileContents,
      });
      fail('should not reach here');
    } catch (error) {
      expect(error).toBeInstanceOf(UserInputError);
    }
  });
});
