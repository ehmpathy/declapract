import expect from 'expect';
import { diff } from 'jest-diff';

import { UnexpectedCodePathError } from '../../../../../../UnexpectedCodePathError';

export const checkEqualsString = ({
  declaredContents,
  foundContents,
}: {
  declaredContents: string;
  foundContents: string;
}) => {
  try {
    expect(foundContents).toEqual(declaredContents);
  } catch (error) {
    // if the above check failed, run diff on the string directly to show a better string diff message
    const difference = diff(declaredContents, foundContents, {
      aAnnotation: 'Expected toEqual',
    });
    if (
      !difference ||
      difference === 'Compared values have no visual difference.'
    )
      throw new UnexpectedCodePathError(
        'expect().toEqual() threw an error, but no difference was detected in the strings',
        { errorMessage: error.message },
      );
    throw new Error(difference);
  }
};
