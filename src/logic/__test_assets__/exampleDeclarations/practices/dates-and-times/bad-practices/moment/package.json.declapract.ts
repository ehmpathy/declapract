import expect from 'expect';
import { FileCheckFunction } from '../../../../../../../domain';

export const check: FileCheckFunction = (contents: string | null) => {
  expect(JSON.parse(contents ?? '')).toEqual(
    expect.objectContaining({
      dependencies: expect.objectContaining({
        moment: expect.any(String),
      }),
    }),
  );
};
