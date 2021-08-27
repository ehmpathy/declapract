import expect from 'expect';

export const check = (contents: string | null) => {
  expect(JSON.parse(contents ?? '')).toEqual(
    expect.objectContaining({
      dependencies: expect.objectContaining({
        'date-fns': expect.any(String),
      }),
    }),
  );
};
