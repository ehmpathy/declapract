const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export class UserInputError extends Error {
  constructor(reason: string, opts?: { potentialSolution?: string }) {
    super(
      `
User input error. ${capitalizeFirstLetter(reason.trim().replace(/\.$/, ''))}. Please correct this and try again.${
        opts?.potentialSolution ? `\n\n${opts.potentialSolution}` : ''
      }
    `.trim(),
    );
  }
}
