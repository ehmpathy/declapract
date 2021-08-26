import expect from 'expect';

export const check = (contents: string | null) => {
  expect(JSON.stringify(contents ?? '')).toEqual(
    expect.objectContaining({
      dependencies: expect.objectContaining({
        'date-fns': expect.any(String),
      }),
    }),
  );
};
