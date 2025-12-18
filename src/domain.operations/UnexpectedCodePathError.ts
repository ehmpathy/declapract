export class UnexpectedCodePathError extends Error {
  constructor(reason: string, metadata?: Record<string, any>) {
    super(
      `
Unexpected code path error. ${reason.replace(
        /\.$/,
        '',
      )}. This indicates a bug within the declapract library. Please file a ticket with this error message and stack trace.

${metadata ? JSON.stringify(metadata, null, 2) : ''}
    `.trim(),
    );
  }
}
