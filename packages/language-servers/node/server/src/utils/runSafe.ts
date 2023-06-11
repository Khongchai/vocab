import {
  CancellationToken,
  LSPErrorCodes,
  ResponseError,
} from "vscode-languageserver";

export function formatError(message: string, err: any): string {
  if (err instanceof Error) {
    const error = <Error>err;
    return `${message}: ${error.message}\n${error.stack}`;
  } else if (typeof err === "string") {
    return `${message}: ${err}`;
  } else if (err) {
    return `${message}: ${err.toString()}`;
  }
  return message;
}

/**
 * Modified from several vscode's langauge-feature implementations.
 */
export function runSafe<T>(
  func: () => Thenable<T>,
  errorVal: T,
  errorMessage: string,
  token: CancellationToken
): Thenable<T | ResponseError<any>> {
  return new Promise<T | ResponseError<any>>((resolve) => {
    if (token.isCancellationRequested) {
      resolve(cancelValue());
      return;
    }
    return func().then(
      (result) => {
        if (token.isCancellationRequested) {
          resolve(cancelValue());
          return;
        } else {
          resolve(result);
        }
      },
      (e) => {
        console.error(formatError(errorMessage, e));
        resolve(errorVal);
      }
    );
  });
}

function cancelValue<E>() {
  return new ResponseError<E>(
    LSPErrorCodes.RequestCancelled,
    "Request cancelled"
  );
}
