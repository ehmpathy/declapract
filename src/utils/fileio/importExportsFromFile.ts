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
  const mod = await import(filePath);
  // handle esm/cjs interop - check if exports are on default or direct
  if (mod.default && typeof mod.default === 'object' && mod.default.check) {
    return mod.default;
  }
  return mod;
};
