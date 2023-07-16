import {
  FileCheckContext,
  FileCheckPurpose,
  FileCheckType,
} from '../../../../../domain';
import { doesDirectoryExist } from '../../../../../utils/fileio/doesDirectoryExist';
import { doesFileExist } from '../../../../../utils/fileio/doesFileExist';
import { readFileAsync as readFileAsyncUnsafe } from '../../../../../utils/fileio/readFileAsync';
import { createExampleFileCheckContext } from '../../../../__test_assets__/createExampleFileCheckContext';
import { testAssetsDirectoryPath } from '../../../../__test_assets__/dirPath';
import { compile } from '../../../../commands/compile';
import { replaceProjectVariablesInDeclaredFileContents } from '../../../../usage/evaluate/projectVariableExpressions/replaceProjectVariablesInDeclaredFileContents';
import { getFileCheckDeclaration } from './getFileCheckDeclaration';

const exampleContext = createExampleFileCheckContext();

const readFileAsync = async ({ filePath }: { filePath: string }) => {
  if (!(await doesFileExist({ filePath }))) return null;
  return readFileAsyncUnsafe({ filePath });
};

describe('getFileCheckDeclaration', () => {
  it('should get file declaration correctly for a prettier config file exact equals definition', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier/best-practice`;
    const declaredFileCorePath = 'prettier.config.js';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = { ...exampleContext, declaredFileContents };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.EQUALS);
    expect(declaration.pathGlob).toMatch(/prettier\.config\.js$/);
    expect(declaration.fix).toBeDefined();
    expect(declaration.fix).not.toBeNull();

    // check that the check function works correctly
    await declaration.check(
      `${`
// ref: http://json.schemastore.org/prettierrc

module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  singleQuote: true,
  printWidth: 150,
};
      `.trim()}\n`,
      context,
    );
    try {
      await declaration.check(
        `
// ref: http://json.schemastore.org/prettierrc

module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  singleQuote: false,
  printWidth: 150,
};
        `.trim(),
        context,
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toEqual');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResult = await declaration.fix!(null, {
      ...exampleContext,
      declaredFileContents,
    });
    expect(fixResult.contents).toEqual(
      `${`
// ref: http://json.schemastore.org/prettierrc

module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  singleQuote: true,
  printWidth: 150,
};
          `.trim()}\n`,
    );
  });
  it('should get file declaration correctly for a terraform file with a contains check', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/terraform/best-practice`;
    const declaredFileCorePath = 'provision/terraform/environments/dev/main.tf';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = { ...exampleContext, declaredFileContents };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.CONTAINS);
    expect(declaration.pathGlob).toMatch(
      /provision\/terraform\/environments\/dev\/main\.tf$/,
    );

    // check that the check function works correctly
    await declaration.check(
      `
provider "aws" {
  region = "us-east-1"
}

terraform {
  required_version = ">= 0.14"
  backend "s3" {
    bucket = "terraform-state-someidentifier-dev"
    key    = "svc-cool-stuff"
    region = "us-east-1"
  }
}

module "product" {
  source      = "../../product"
  environment = "dev"
}
      `.trim(),
      context,
    );
    try {
      await declaration.check(
        `
provider "aws" {
  region  = "us-west-1"
}

terraform {
  required_version = ">= 0.14"
  backend "s3" {
    bucket = "terraform-state-someidentifier-dev"
    key    = "svc-cool-stuff"
    region = "us-east-1"
  }
}

module "product" {
  source      = "../../product"
  environment = "dev"
}
        `.trim(),
        context,
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toContain');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultFileNotDefined = await declaration.fix!(null, context);
    expect(fixResultFileNotDefined!.contents!.trim()).toEqual(
      `
provider "aws" {
  region = "us-east-1"
}
      `.trim(),
    );
    const fixResultFileDefined = await declaration.fix!(
      'anything else',
      context,
    );
    expect(fixResultFileDefined).toEqual({}); // should change nothing
  });
  it('should get file declaration correctly for a json file with a contains check', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier/best-practice`;
    const declaredFileCorePath = 'package.json';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = {
      ...exampleContext,
      relativeFilePath: declaredFileCorePath,
      declaredFileContents,
    };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.CONTAINS);
    expect(declaration.pathGlob).toMatch(/package\.json$/);

    // check that the check function works correctly
    await declaration.check(
      JSON.stringify({
        name: 'svc-of-awesomeness',
        devDependencies: {
          prettier: '3.2.1',
        },
        scripts: {
          format: "prettier --write '**/*.ts' --config ./prettier.config.js",
        },
      }),
      context,
    );
    try {
      await declaration.check(
        JSON.stringify({
          name: 'svc-of-awesomeness',
          devDependencies: {
            prettier: '1.2.1',
          },
          scripts: {
            format: "prettier --read '**/*.ts' --config ./prettier.config.js",
          },
        }),
        context,
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toContain');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultFileNotDefined = await declaration.fix!(null, context);
    expect(fixResultFileNotDefined!.contents!.trim()).toEqual(
      JSON.stringify(
        {
          devDependencies: {
            prettier: '2.0.0',
          },
          scripts: {
            format: "prettier --write '**/*.ts' --config ./prettier.config.js",
          },
        },
        null,
        2,
      ),
    );
    const fixResultFileDefined = await declaration.fix!(
      JSON.stringify(
        {
          devDependencies: {
            prettier: '1.1.0',
          },
          scripts: {
            otherStuff: "echo 'still do the other stuff without changing'",
            format:
              "prettier --do-it '**/*.ts|js|otherstuff' --config ./prettier.old-config.js",
            otherStuffWithoutChangingPosition:
              "echo 'still do the other stuff without changing, in the same order as before'",
          },
        },
        null,
        2,
      ),
      context,
    );
    expect(fixResultFileDefined.contents).toEqual(
      // should fix all of the existing keys and replace them with their values
      JSON.stringify(
        {
          devDependencies: {
            prettier: '2.0.0', // should also bump the version of the dep
          },
          scripts: {
            otherStuff: "echo 'still do the other stuff without changing'",
            format: "prettier --write '**/*.ts' --config ./prettier.config.js", // notice that its position remains the same around the other scripts
            otherStuffWithoutChangingPosition:
              "echo 'still do the other stuff without changing, in the same order as before'",
          },
        },
        null,
        2,
      ),
    );
  });
  it('should get file declaration correctly for an optional file existence declaration (e.g., user wants to specify directory structure)', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src/best-practice`;
    const declaredFileCorePath = 'src/data/dao/**/*.ts';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = {
      ...exampleContext,
      declaredFileContents,
      required: false,
    };

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.EXISTS);
    expect(declaration.pathGlob).toMatch(/src\/data\/dao\/\*\*\/\*\.ts$/);

    // check that the check function works
    await declaration.check(null, context); // should allow null (i.e., file not exists)
    await declaration.check('random content', context); // should allow anything
  });
  it('should get file declaration correctly for an optional file contains check declaration', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src/best-practice`;
    const declaredFileCorePath = 'src/data/clients/**/*.ts';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = {
      ...exampleContext,
      declaredFileContents,
      required: false,
    };

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.CONTAINS);
    expect(declaration.pathGlob).toMatch(/src\/data\/clients\/\*\*\/\*\.ts$/);

    // check that the check function works
    await declaration.check(null, context); // should allow null, since file is optional
    await declaration.check(
      // should allow correct definition
      `
import { invokeLambdaFunction } from 'simple-lambda-client';

// and whatever else we put in the client, doesn't matter, above contains the expected content

      `.trim(),
      context,
    );
    try {
      await declaration.check(
        // should not allow incorrect definition
        `
import { AWS } from 'aws-sdk';
        `.trim(),
        context,
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toContain');
      expect(error.message).toMatchSnapshot();
    }
  });
  it('should get file declaration correctly for an optional file equals check declaration', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/util-sleep/best-practice`;
    const declaredFileCorePath = 'src/**/sleep.ts';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = {
      ...exampleContext,
      declaredFileContents,
      required: false,
    };

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.EQUALS);
    expect(declaration.pathGlob).toMatch(/src\/\*\*\/sleep\.ts$/);

    // check that the check function works
    await declaration.check(null, context); // should allow null
    await declaration.check(
      // should allow correct definition
      `${`
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
      `.trim()}\n`,
      context,
    );
    try {
      await declaration.check(
        // should not allow incorrect definition
        `
export const sleep = (ms: number) => new Promise((resolve, reject) => setTimeout(reject, ms));
        `.trim(),
        context,
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toEqual');
      expect(error.message).toMatchSnapshot();
    }
  });
  it('should get file declaration correctly for a package json file with a custom check', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/dates-and-times/best-practice`;
    const declaredFileCorePath = 'package.json';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = {
      ...exampleContext,
      relativeFilePath: declaredFileCorePath,
      declaredFileContents,
    };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.CUSTOM);
    expect(declaration.pathGlob).toMatch(/package\.json$/);

    // check that the check function works
    await declaration.check(
      JSON.stringify({
        dependencies: {
          'date-fns': '2.0.0',
        },
      }),
      context,
    );
    try {
      await declaration.check(
        JSON.stringify({
          dependencies: {
            'time-fns': '2.0.0',
          },
        }),
        context,
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toEqual');
      expect(error.message).toMatchSnapshot();
    }
  });
  it('should get file declaration correctly for a bad practice file exists check', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src/bad-practices/services-dir`;
    const declaredFileCorePath = 'src/services/**/*.ts';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BAD_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = { ...exampleContext, declaredFileContents };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.EXISTS);
    expect(declaration.pathGlob).toMatch(/src\/services\/\*\*\/\*\.ts$/);

    // check that the check function works
    await declaration.check(
      // should match anything existing
      `
export const anything = 'should not exist';
    `.trim(),
      context,
    );
    try {
      await declaration.check(null, context); // should not match file not existing, since file is required
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('Expected file to exist');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultNoFile = await declaration.fix!(null, context);
    expect(fixResultNoFile).toEqual({ contents: null }); // should do nothing if file is not defined
    const fixResultWithFile = await declaration.fix!('some contents', context);
    expect(fixResultWithFile).toEqual({ contents: null }); // should say to delete the file if exists
  });
  it('should declare the check function correctly when the declared file has variables that need dereferenced', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/readme-for-packages/best-practice`;
    const declaredFileCorePath = 'README.md';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = { ...exampleContext, declaredFileContents };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.EQUALS);
    expect(declaration.pathGlob).toMatch(/README\.md$/);

    // check that it passes only if variables are all replaced correctl
    await declaration.check(
      `${`
awesome-package
==============

this is a super awesome package that you should definitely use

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/awesome-package.svg)](https://npmjs.org/package/awesome-package)
[![Codecov](https://codecov.io/gh/org-of-awesomeness/awesome-package/branch/master/graph/badge.svg)](https://codecov.io/gh/org-of-awesomeness/awesome-package)
[![Downloads/week](https://img.shields.io/npm/dw/awesome-package.svg)](https://npmjs.org/package/awesome-package)
[![License](https://img.shields.io/npm/l/awesome-package.svg)](https://github.com/org-of-awesomeness/awesome-package/blob/master/package.json)

    `.trim()}
`,
      {
        ...context,
        projectVariables: {
          packageName: 'awesome-package',
          organizationName: 'org-of-awesomeness',
          packageDescription:
            'this is a super awesome package that you should definitely use',
        },
        declaredFileContents: replaceProjectVariablesInDeclaredFileContents({
          projectVariables: {
            packageName: 'awesome-package',
            organizationName: 'org-of-awesomeness',
            packageDescription:
              'this is a super awesome package that you should definitely use',
          },
          fileContents: context.declaredFileContents!,
        }),
      },
    );
    try {
      await declaration.check(
        `${`
awesome-package
==============

this is a super awesome package that you should definitely use

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/awesome-package.svg)](https://npmjs.org/package/awesome-package)
[![Codecov](https://codecov.io/gh/org-of-awesomeness/awesome-package/branch/master/graph/badge.svg)](https://codecov.io/gh/org-of-awesomeness/awesome-package)
[![Downloads/week](https://img.shields.io/npm/dw/awesome-package.svg)](https://npmjs.org/package/awesome-package)
[![License](https://img.shields.io/npm/l/awesome-package.svg)](https://github.com/org-of-awesomeness/awesome-package/blob/master/package.json)

    `.trim()}
`,
        {
          ...context,
          projectVariables: {
            packageName: 'renamed-package',
            organizationName: 'org-of-awesomeness',
            packageDescription:
              'this is a super awesome package that you should definitely use',
          },
          declaredFileContents: replaceProjectVariablesInDeclaredFileContents({
            projectVariables: {
              packageName: 'renamed-package',
              organizationName: 'org-of-awesomeness',
              packageDescription:
                'this is a super awesome package that you should definitely use',
            },
            fileContents: context.declaredFileContents!,
          }),
        },
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toEqual');
      expect(error.message).toMatchSnapshot();
    }

    // it should fix correctly
    const fixResult = await declaration.fix!(null, {
      ...context,
      projectVariables: {
        packageName: 'awesome-package',
        organizationName: 'org-of-awesomeness',
        packageDescription:
          'this is a super awesome package that you should definitely use',
      },
      declaredFileContents: replaceProjectVariablesInDeclaredFileContents({
        projectVariables: {
          packageName: 'awesome-package',
          organizationName: 'org-of-awesomeness',
          packageDescription:
            'this is a super awesome package that you should definitely use',
        },
        fileContents: context.declaredFileContents!,
      }),
    });
    expect(fixResult.contents).toContain(
      '[![License](https://img.shields.io/npm/l/awesome-package.svg)](https://github.com/org-of-awesomeness/awesome-package/blob/master/package.json)',
    ); // should also dereference the variables when fixing
  });
  it("should get file declaration with wildcard character, '*', serialized as '<star>', correctly", async () => {
    if (
      !(await doesDirectoryExist({
        directory: `${testAssetsDirectoryPath}/example-best-practices-compile-for-package-repo/dist`,
      }))
    )
      await compile({
        sourceDirectory: `${testAssetsDirectoryPath}/example-best-practices-compile-for-package-repo/src`,
        distributionDirectory: `${testAssetsDirectoryPath}/example-best-practices-compile-for-package-repo/dist`,
      });

    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-compile-for-package-repo/dist/practices/directory-structure-src/best-practice`;
    const declaredFileCorePath = 'src/data/dao/<star><star>/<star>.ts';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.EXISTS);
    expect(declaration.pathGlob).toMatch(/src\/data\/dao\/\*\*\/\*\.ts$/); // should have deserialized the wildcard character
  });
  it('should use the custom fix function defined, if one is defined', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/testing/bad-practices/old-extension-pattern`;
    const declaredFileCorePath = '**/*.test.integration.ts';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BAD_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });
    const declaredFileContents = await readFileAsync({
      filePath: `${declaredProjectDirectory}/${declaredFileCorePath}`,
    });
    const context = { ...exampleContext, declaredFileContents };

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.EXISTS);
    expect(declaration.pathGlob).toMatch(/\*\*\/\*\.test\.integration\.ts$/);

    // check that the check function works
    await declaration.check(
      // should match anything existing
      `
export const anything = 'should not exist';
    `.trim(),
      context,
    );
    try {
      await declaration.check(null, context); // should not match file not existing, since file is required
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('Expected file to exist');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultNoFile = await declaration.fix!(null, context);
    expect(fixResultNoFile).toEqual({
      contents: null,
      relativeFilePath: 'some/file/path.ts',
    }); // should do nothing if file is not defined
    const fixResultWithFile = await declaration.fix!('some contents', {
      ...context,
      relativeFilePath: 'some/file/path.test.integration.ts',
    });
    expect(fixResultWithFile).toEqual({
      relativeFilePath: 'some/file/path.integration.test.ts', // should have moved this file to the correct extension
      contents: 'some contents',
    });
  });

  it('should use the custom contents function defined, if one is defined', async () => {
    const declaredProjectDirectory = `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/format/best-practice`;
    const declaredFileCorePath = 'package.json';
    const declaration = await getFileCheckDeclaration({
      purpose: FileCheckPurpose.BEST_PRACTICE,
      declaredProjectDirectory,
      declaredFileCorePath,
    });

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.CONTAINS);
    expect(declaration.pathGlob).toMatch('package.json');

    // check that getting the contents works
    const declaredFileContents =
      (await declaration.contents!({ projectPractices: [] } as any)) ?? null;
    expect(declaredFileContents).toContain('fix:format');

    // check that the check function works
    const context: FileCheckContext = {
      ...exampleContext,
      declaredFileContents,
    };
    await declaration.check(
      // should match this by default
      JSON.stringify(
        {
          scripts: {
            'fix:format': 'npm run fix:format:prettier',
            'test:format': 'npm run test:format:prettier',
          },
        },
        null,
        2,
      ),
      context,
    );
    try {
      await declaration.check(null, context); // should not match file not existing, since file is required
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('Expected file to exist');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultFileNotDefined = await declaration.fix!(null, context);
    expect(fixResultFileNotDefined!.contents!.trim()).toEqual(
      JSON.stringify(
        {
          scripts: {
            'fix:format': 'npm run fix:format:prettier',
            'test:format': 'npm run test:format:prettier',
          },
        },
        null,
        2,
      ),
    );
    const fixResultFileDefined = await declaration.fix!(
      JSON.stringify(
        {
          scripts: {
            other: 'stuff',
            'fix:format':
              'npm run fix:format:prettier && npm run fix:format:terraform',
            'test:format':
              'npm run test:format:prettier && npm run fix:format:terraform',
          },
        },
        null,
        2,
      ),
      context,
    );
    expect(fixResultFileDefined.contents).toEqual(
      // should fix all of the existing keys and replace them with their values
      JSON.stringify(
        {
          scripts: {
            other: 'stuff',
            'fix:format': 'npm run fix:format:prettier',
            'test:format': 'npm run test:format:prettier',
          },
        },
        null,
        2,
      ),
    );
  });
});
