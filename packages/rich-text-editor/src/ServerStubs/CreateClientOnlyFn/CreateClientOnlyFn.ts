/**
 * Creates the server stand-in for a function that needs the browser: calling it throws an error
 * naming the function.
 */
export const createClientOnlyFn = (name: string) => {
  return (): never => {
    throw new Error(
      `${name}() can only run in the browser. Call it from client-only code, e.g. a mount hook.`,
    );
  };
};
