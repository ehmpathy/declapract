/**
 * runs `import(filePath)` on the file path
 *
 * the only reason this function exists is so that we can easily mock it 😂
 */
export const importExportsFromFile = async ({ filePath }: { filePath: string }) => import(filePath);
