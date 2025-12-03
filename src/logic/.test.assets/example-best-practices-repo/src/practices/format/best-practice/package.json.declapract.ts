// eslint-disable-next-line import/no-extraneous-dependencies
import { isPresent } from 'type-fns';

import {
  FileCheckType,
  type FileContentsFunction,
} from '../../../../../../../domain';

/**
 * declare the expected contents
 */
export const contents: FileContentsFunction = (context) => {
  const formatters = [
    'prettier',
    context.projectPractices.includes('terraform') ? 'terraform' : null, // only include the terraform formatter if terraform practice is used
  ].filter(isPresent);

  return JSON.stringify(
    {
      scripts: {
        'fix:format': formatters
          .map((formatter) => `npm run fix:format:${formatter}`)
          .join(' && '),
        'test:format': formatters
          .map((formatter) => `npm run test:format:${formatter}`)
          .join(' && '),
      },
    },
    null,
    2,
  );
};

/**
 * check that they're contained in the file
 */
export const check: FileCheckType = FileCheckType.CONTAINS;
