import expect from 'expect';
import { FileCheckFunction } from '../../../../../../domain';

import { defineMinPackageVersionRegex } from '../../../../../declare/defineMinPackageVersionRegex';

export const check: FileCheckFunction = (contents: string | null) => {
  expect(JSON.parse(contents ?? '')).toMatchObject({
    devDependencies: expect.objectContaining({
      prettier: expect.stringMatching(defineMinPackageVersionRegex('2.0.0')),
    }),
    scripts: expect.objectContaining({
      format: "prettier --write '**/*.ts' --config ./prettier.config.js",
    }),
  });
};
