import { diff } from 'jest-diff';

import { UnexpectedCodePathError } from '../../../../../UnexpectedCodePathError';

export const checkContainsSubstring = ({
  declaredContents,
  foundContents,
  bAnnotation = 'Received',
}: {
  declaredContents: string;
  foundContents: string;
  bAnnotation?: string;
}) => {
  try {
    expect(foundContents).toContain(declaredContents);
  } catch (error) {
    // if the above check failed, run diff on the string directly to show a better string diff message
    const difference = diff(declaredContents, foundContents, { aAnnotation: 'Expected toContain', bAnnotation });
    if (!difference)
      throw new UnexpectedCodePathError(
        'expect().toContain() threw an error, but no difference was detected in the strings',
      );
    throw new Error(difference);
  }
};
