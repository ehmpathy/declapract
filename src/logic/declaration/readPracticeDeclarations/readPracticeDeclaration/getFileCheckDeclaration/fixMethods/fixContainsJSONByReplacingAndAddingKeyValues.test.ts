import { FileCheckContext } from '../../../../../../domain';
import { fixContainsJSONByReplacingAndAddingKeyValues } from './fixContainsJSONByReplacingAndAddingKeyValues';

const exampleDesiredContents = `
{
  "devDependencies": {
    "prettier": "@declapract{check.minVersion('2.0.0')}"
  },
  "scripts": {
    "format": "prettier --write '**/*.ts' --config ./prettier.config.js",
    "test:format": "prettier --parser typescript --check 'src/**/*.ts' --config ./prettier.config.js",
    "test": "npm run test:types && npm run test:format && npm run test:lint && npm run test:unit && npm run test:integration && npm run test:acceptance:locally"
  }
}
    `.trim();

const exampleFoundContents = `
{
  "name": "goolash",
  "version": "0.8.2",
  "main": "src/index.js",
  "scripts": {
    "build": "npm run build:clean && npm run build:compile",
    "provision:schema:apply": "npx sql-schema-control apply -c provision/schema/control.yml",
    "test:types": "tsc -p ./tsconfig.build.json --noEmit",
    "test:lint": "eslint -c ./.eslintrc.js src/**/*.ts",
    "test:unit": "jest -c ./jest.unit.config.js --forceExit --coverage --verbose",
    "test:integration": "jest -c ./jest.integration.config.js --forceExit --coverage --verbose",
    "test:acceptance:locally": "npm run build && LOCALLY=true jest -c ./jest.acceptance.config.js",
    "test": "npm run test:types && npm run test:lint && npm run test:unit && npm run test:integration && npm run test:acceptance:locally",
    "test:acceptance": "npm run build && jest -c ./jest.acceptance.config.js --forceExit --verbose --runInBand",
    "prepush": "npm run test && npm run build",
    "preversion": "npm run prepush",
    "postversion": "git push origin master --tags --no-verify"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "yesql": "4.1.3"
  },
  "devDependencies": {
    "@types/aws-lambda": "8.10.40",
    "prettier": "8.2.1"
  }
}
    `.trim();

const exampleFoundContentsFailingDevDepMinVersionCheck = `
{
  "devDependencies": {
    "@types/aws-lambda": "8.10.40",
    "prettier": "1.2.1"
  }
}
    `.trim();

describe('fixContainsJSONByReplacingAndAddingKeyValues', () => {
  it('should correctly replace nested keys with the correct values', async () => {
    // fix them
    const { contents: fixedContents } =
      await fixContainsJSONByReplacingAndAddingKeyValues(exampleFoundContents, {
        declaredFileContents: exampleDesiredContents,
        projectVariables: {},
      } as FileCheckContext);

    // parse the fixed contents
    const fixedPackageJSON = JSON.parse(fixedContents!);
    expect(fixedPackageJSON).toHaveProperty('scripts.test');
    expect(fixedPackageJSON.scripts.test).toEqual(
      'npm run test:types && npm run test:format && npm run test:lint && npm run test:unit && npm run test:integration && npm run test:acceptance:locally',
    );

    // make sure it looks good
    expect(fixedContents).toMatchSnapshot();
  });
  it('should add new keys to the object at the end of their object', async () => {
    // fix them
    const { contents: fixedContents } =
      await fixContainsJSONByReplacingAndAddingKeyValues(exampleFoundContents, {
        declaredFileContents: exampleDesiredContents,
        projectVariables: {},
      } as FileCheckContext);

    // parse the fixed contents
    const fixedPackageJSON = JSON.parse(fixedContents!);
    expect(fixedPackageJSON).toHaveProperty('scripts.format');
    expect(fixedPackageJSON).toHaveProperty('scripts.test:format');
  });
  it('should add new nested keys to the object at the end of their object', async () => {
    const exampleDesiredNewNestedContents = `
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
    `.trim();

    // fix them
    const { contents: fixedContents } =
      await fixContainsJSONByReplacingAndAddingKeyValues(exampleFoundContents, {
        declaredFileContents: exampleDesiredNewNestedContents,
        projectVariables: {},
      } as FileCheckContext);

    // parse the fixed contents
    const fixedPackageJSON = JSON.parse(fixedContents!);
    expect(fixedPackageJSON).toHaveProperty('config.commitizen.path');
  });
  describe('check.minVersion', () => {
    it('should not substitute declapract minVersion check expression values with the correct value, if key is already defined but it does not fail', async () => {
      // fix them
      const { contents: fixedContents } =
        await fixContainsJSONByReplacingAndAddingKeyValues(
          exampleFoundContents,
          {
            declaredFileContents: exampleDesiredContents,
            projectVariables: {},
          } as FileCheckContext,
        );

      // parse the fixed contents
      const fixedPackageJSON = JSON.parse(fixedContents!);
      expect(fixedPackageJSON).toHaveProperty('devDependencies.prettier');
      expect(fixedPackageJSON.devDependencies.prettier).toEqual('8.2.1');
    });
    it('should substitute declapract minVersion check expression values with the correct value, if key is already defined and it fails', async () => {
      // fix them
      const { contents: fixedContents } =
        await fixContainsJSONByReplacingAndAddingKeyValues(
          exampleFoundContentsFailingDevDepMinVersionCheck,
          {
            declaredFileContents: exampleDesiredContents,
            projectVariables: {},
          } as FileCheckContext,
        );

      // parse the fixed contents
      const fixedPackageJSON = JSON.parse(fixedContents!);
      expect(fixedPackageJSON).toHaveProperty('devDependencies.prettier');
      expect(fixedPackageJSON.devDependencies.prettier).toEqual('2.0.0');
    });
  });
});
