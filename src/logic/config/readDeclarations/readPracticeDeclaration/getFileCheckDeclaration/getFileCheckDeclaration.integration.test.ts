import { FileCheckContext, FileCheckType } from '../../../../../domain';
import { testAssetsDirectoryPath } from '../../../../__test_assets__/dirPath';
import { getFileCheckDeclaration } from './getFileCheckDeclaration';

describe('getFileCheckDeclaration', () => {
  it('should get file declaration correctly for a prettier config file exact equals definition', async () => {
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier/best-practice`,
      declaredFileCorePath: 'prettier.config.js',
    });

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
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toEqual');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResult = declaration.fix!(null);
    expect(fixResult).toEqual(
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
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/terraform/best-practice`,
      declaredFileCorePath: 'provision/terraform/environments/dev/main.tf',
    });

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.CONTAINS);
    expect(declaration.pathGlob).toMatch(/provision\/terraform\/environments\/dev\/main\.tf$/);

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
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toContain');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultFileNotDefined = declaration.fix!(null);
    expect(fixResultFileNotDefined!.trim()).toEqual(
      `
provider "aws" {
  region = "us-east-1"
}
      `.trim(),
    );
    const fixResultFileDefined = declaration.fix!('anything else');
    expect(fixResultFileDefined).toEqual('anything else'); // should not change it. fix only changes the file when file does not exist
  });
  it('should get file declaration correctly for an optional file existence declaration (e.g., user wants to specify directory structure)', async () => {
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src/best-practice`,
      declaredFileCorePath: 'src/data/dao/**/*.ts',
    });

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.EXISTS);
    expect(declaration.pathGlob).toMatch(/src\/data\/dao\/\*\*\/\*\.ts$/);

    // check that the check function works
    await declaration.check(null); // should allow null (i.e., file not exists)
    await declaration.check('random content'); // should allow anything
  });
  it('should get file declaration correctly for an optional file contains check declaration', async () => {
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src/best-practice`,
      declaredFileCorePath: 'src/data/clients/**/*.ts',
    });

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.CONTAINS);
    expect(declaration.pathGlob).toMatch(/src\/data\/clients\/\*\*\/\*\.ts$/);

    // check that the check function works
    await declaration.check(null); // should allow null, since file is optional
    await declaration.check(
      // should allow correct definition
      `
import { invokeLambdaFunction } from 'simple-lambda-client';

// and whatever else we put in the client, doesn't matter, above contains the expected content

      `.trim(),
    );
    try {
      await declaration.check(
        // should not allow incorrect definition
        `
import { AWS } from 'aws-sdk';
        `.trim(),
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toContain');
      expect(error.message).toMatchSnapshot();
    }
  });
  it('should get file declaration correctly for an optional file equals check declaration', async () => {
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/util-sleep/best-practice`,
      declaredFileCorePath: 'src/**/sleep.ts',
    });

    // check that the properties look right
    expect(declaration.required).toEqual(false);
    expect(declaration.type).toEqual(FileCheckType.EQUALS);
    expect(declaration.pathGlob).toMatch(/src\/\*\*\/sleep\.ts$/);

    // check that the check function works
    await declaration.check(null); // should allow null
    await declaration.check(
      // should allow correct definition
      `${`
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      `.trim()}\n`,
    );
    try {
      await declaration.check(
        // should not allow incorrect definition
        `
export const sleep = (ms: number) => new Promise((resolve, reject) => setTimeout(reject, ms));
        `.trim(),
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toEqual');
      expect(error.message).toMatchSnapshot();
    }
  });
  it('should get file declaration correctly for a package json file with a custom check', async () => {
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BEST_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/prettier/best-practice`,
      declaredFileCorePath: 'package.json',
    });

    // check that the properties look right
    expect(declaration.required).toEqual(true);
    expect(declaration.type).toEqual(FileCheckType.CUSTOM);
    expect(declaration.pathGlob).toMatch(/package\.json$/);

    // check that the check function works
    await declaration.check(
      JSON.stringify({
        devDependencies: {
          prettier: '2.0.0',
        },
        scripts: {
          format: "prettier --write '**/*.ts' --config ./prettier.config.js",
        },
      }),
    );
    try {
      await declaration.check(
        JSON.stringify({
          devDependencies: {
            prettier: '1.7.21',
          },
          scripts: {
            format: "prettier --write '**/*.ts' --config ./prettier.config.js",
          },
        }),
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toMatchObject');
      expect(error.message).toMatchSnapshot();
    }
    try {
      await declaration.check(
        JSON.stringify({
          devDependencies: {
            prettier: '2.1.0',
          },
          scripts: {
            format: "prettier --write '**/*.ts",
          },
        }),
      );
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toMatchObject');
      expect(error.message).toMatchSnapshot();
    }
  });
  it('should get file declaration correctly for a bad practice file exists check', async () => {
    const declaration = await getFileCheckDeclaration({
      context: FileCheckContext.BAD_PRACTICE,
      declaredProjectDirectory: `${testAssetsDirectoryPath}/example-best-practices-repo/src/practices/directory-structure-src/bad-practices/services-dir`,
      declaredFileCorePath: 'src/services/**/*.ts',
    });

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
    );
    try {
      await declaration.check(null); // should not match file not existing, since file is required
      fail('should not reach here');
    } catch (error) {
      expect(error.message).toContain('toBeNull');
      expect(error.message).toMatchSnapshot();
    }

    // check that the fix function works correctly
    const fixResultNoFile = declaration.fix!(null);
    expect(fixResultNoFile).toEqual(null); // should do nothing if file is not defined
    const fixResultWithFile = declaration.fix!('some contents');
    expect(fixResultWithFile).toEqual(null); // should say to delete the file if exists
  });
});
