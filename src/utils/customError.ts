export class CustomError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string, statusCode: number, details: unknown = {}) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;

    // Set the prototype explicitly to maintain proper instance behavior
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

