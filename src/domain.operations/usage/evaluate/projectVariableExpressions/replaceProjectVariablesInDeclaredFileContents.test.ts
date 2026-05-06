import { UserInputError } from '@src/domain.operations/UserInputError';

import { replaceProjectVariablesInDeclaredFileContents } from './replaceProjectVariablesInDeclaredFileContents';

const exampleReadmeFileContents = `
# @declapract{variable.serviceName}

this is the readme for @declapract{variable.serviceName} of the @declapract{variable.organizationName} org

the database service user is named '@declapract{variable.databaseUserName.serviceUser}'. you can auth under that in dev
`.trim();

describe('replaceProjectVariablesInDeclaredFileContents', () => {
  it('should replace all occurrences of declared variables with their implemented values', async () => {
    const replacedFileContents = replaceProjectVariablesInDeclaredFileContents({
      projectVariables: {
        serviceName: 'super-cool-service',
        organizationName: 'org-of-coolness',
        databaseUserName: { serviceUser: 'super-cool-service-user' },
      },
      fileContents: exampleReadmeFileContents,
    });
    expect(replacedFileContents).toEqual(
      `
# super-cool-service

this is the readme for super-cool-service of the org-of-coolness org

the database service user is named 'super-cool-service-user'. you can auth under that in dev
    `.trim(),
    );
  });
  it('should throw an error if one of the variables did not have its value defined', () => {
    expect(() =>
      replaceProjectVariablesInDeclaredFileContents({
        projectVariables: { organizationName: 'org-of-coolness' },
        fileContents: exampleReadmeFileContents,
      }),
    ).toThrow(UserInputError);
  });
  it('should replace array variables with JSON array literals', () => {
    const exampleResourcesFileContents = `
reviewers: { users: @declapract{variable.productionApprovers}, teams: null },
origins: @declapract{variable.allowedOrigins},
    `.trim();
    const replacedFileContents = replaceProjectVariablesInDeclaredFileContents({
      projectVariables: {
        productionApprovers: ['alice', 'bob'],
        allowedOrigins: ['https://example.com', 'https://api.example.com'],
      },
      fileContents: exampleResourcesFileContents,
    });
    expect(replacedFileContents).toEqual(
      `
reviewers: { users: ["alice","bob"], teams: null },
origins: ["https://example.com","https://api.example.com"],
      `.trim(),
    );
  });
  it('should handle empty array variables', () => {
    const result = replaceProjectVariablesInDeclaredFileContents({
      projectVariables: { approvers: [] },
      fileContents: 'reviewers: @declapract{variable.approvers}',
    });
    expect(result).toEqual('reviewers: []');
  });
  it('should handle single item array variables', () => {
    const result = replaceProjectVariablesInDeclaredFileContents({
      projectVariables: { approvers: ['alice'] },
      fileContents: 'reviewers: @declapract{variable.approvers}',
    });
    expect(result).toEqual('reviewers: ["alice"]');
  });
});
