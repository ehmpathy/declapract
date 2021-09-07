// tslint:disable no-console
import { hrtime } from 'process';
import { log } from '../logger';

const roundToHundredths = (num: number) => Math.round(num * 100) / 100; // https://stackoverflow.com/a/14968691/3068233

/**
 * a wrapper which reports how long it took to execute a function, after the function completes
 *
 * for example:
 * ```ts
 * const doSomethingThatMayTakeAWhile = withDurationReporting(
 *   'doSomethingThatMayTakeAWhile',
 *   async (someArg: string, anotherArg: number) => {
 *     // your logic here
 *   }
 * )
 * ```
 */
export const withDurationReporting = <R extends any, T extends (...args: any[]) => Promise<R>>(
  title: string,
  logic: T,
  options: {
    reportingThresholdSeconds: number;
    log: (args: { title: string; durationInSeconds: number }) => void;
  } = {
    reportingThresholdSeconds: 1, // report on anything that takes more than 1 second, by default
    log: ({ title, durationInSeconds }) =>
      log.debug(`⏲️  ${title} took ${durationInSeconds} seconds to execute`, { title, durationInSeconds }), // debug log by default
  },
) => {
  return (async (...args: Parameters<T>): Promise<R> => {
    const startTimeInNanoseconds = hrtime.bigint();
    const result = await logic(...args);
    const endTimeInNanoseconds = hrtime.bigint();
    const durationInNanoseconds = endTimeInNanoseconds - startTimeInNanoseconds;
    const durationInSeconds = roundToHundredths(Number(durationInNanoseconds) / 1e9); // https://stackoverflow.com/a/53970656/3068233
    if (durationInSeconds >= options.reportingThresholdSeconds) options.log({ title, durationInSeconds });
    return result;
  }) as T;
};
