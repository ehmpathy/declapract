import chalk from 'chalk';

/**
 * .what = emits a warn about self-dependency detection
 * .why = informs user when a self-dep is omitted or preserved
 */
export const emitSelfDepWarn = (input: {
  packageName: string;
  declaredVersion: string;
  action: 'omitted' | 'preserved';
}): void => {
  if (input.action === 'omitted') {
    console.log(
      chalk.yellow(
        `⚠️ warn: omit self-dependency ${input.packageName}@${input.declaredVersion}\n` +
          `   ├─ a package should not depend on itself\n` +
          `   └─ if intentional, use link:. or file:. to self-reference`,
      ),
    );
  } else {
    console.log(
      chalk.yellow(
        `⚠️ warn: preserve self-dependency ${input.packageName}\n` +
          `   ├─ extant self-ref was preserved\n` +
          `   └─ practice declared version was skipped`,
      ),
    );
  }
};
