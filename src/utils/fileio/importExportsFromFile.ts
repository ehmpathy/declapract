/**
 * runs `import(filePath)` on the file path
 *
 * note: tsx handles transpilation through its loader, so no special registration is needed
 */
export const importExportsFromFile = async ({
  filePath,
}: {
  filePath: string;
}) => {
  return import(filePath);
};
