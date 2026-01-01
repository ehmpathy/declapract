/**
 * .what = runs `import(filePath)` on the file path
 * .why = enables dynamic import of practice declaration files at runtime
 *
 * .note = node 22.7+ handles typescript via --experimental-strip-types
 */
export const importExportsFromFile = async ({
  filePath,
}: {
  filePath: string;
}) => {
  return import(filePath);
};
