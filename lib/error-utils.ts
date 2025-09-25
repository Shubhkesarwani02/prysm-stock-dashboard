export class PortfolioError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = "PortfolioError"
  }
}

export class CSVParseError extends PortfolioError {
  constructor(
    message: string,
    public row?: number,
    public column?: string,
  ) {
    super(message, "CSV_PARSE_ERROR", { row, column })
    this.name = "CSVParseError"
  }
}

export class StorageError extends PortfolioError {
  constructor(
    message: string,
    public operation: "save" | "load" | "clear",
  ) {
    super(message, "STORAGE_ERROR", { operation })
    this.name = "StorageError"
  }
}

export class ValidationError extends PortfolioError {
  constructor(
    message: string,
    public field: string,
    public value?: any,
  ) {
    super(message, "VALIDATION_ERROR", { field, value })
    this.name = "ValidationError"
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unknown error occurred"
}

export function isPortfolioError(error: unknown): error is PortfolioError {
  return error instanceof PortfolioError
}

export function handleAsyncError<T>(
  promise: Promise<T>,
  errorHandler?: (error: Error) => void,
): Promise<[T | null, Error | null]> {
  return promise
    .then<[T, null]>((data: T) => [data, null])
    .catch<[null, Error]>((error: Error) => {
      if (errorHandler) {
        errorHandler(error)
      }
      return [null, error]
    })
}
