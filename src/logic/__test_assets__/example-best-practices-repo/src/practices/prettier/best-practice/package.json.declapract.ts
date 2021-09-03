import expect from 'expect';

import { defineMinPackageVersionRegex } from '../../../../../../../contract';
import { FileCheckFunction } from '../../../../../../../domain';

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
