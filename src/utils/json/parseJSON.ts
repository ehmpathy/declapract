import JSON5 from 'json5';

export class JSONParsingError extends Error {
  constructor({
    jsonError,
    json5Error,
    contents,
  }: {
    jsonError: Error;
    json5Error: Error;
    contents: string;
  }) {
    super(
      `
Could not parse contents as neither JSON nor JSON5.

JSON Error:
${jsonError.message}

JSON5 Error:
${json5Error.message}

Contents Head:
${contents.slice(0, 50)}${contents.length > 50 ? '...' : ''}
    `.trim(),
    );
  }
}

export enum JSONVariant {
  JSON = 'JSON',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  JSON5 = 'JSON5',
}

/**
 * parse json with support for json5, when needed
 */
export const parseJSON = <T>(
  contents: string,
): { output: T; variant: JSONVariant } => {
  try {
    return { variant: JSONVariant.JSON, output: JSON.parse(contents) };
  } catch (jsonError) {
    try {
      return { variant: JSONVariant.JSON5, output: JSON5.parse(contents) };
    } catch (json5Error) {
      throw new JSONParsingError({ json5Error, jsonError, contents });
    }
  }
};
