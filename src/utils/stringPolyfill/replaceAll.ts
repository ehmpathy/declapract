const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
export const replaceAll = (
  inString: string,
  matchingString: string,
  replacement: string,
) => {
  return inString.replace(
    new RegExp(escapeRegExp(matchingString), 'g'),
    () => replacement,
  );
};
