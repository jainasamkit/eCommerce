class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: unknown[];
  data: unknown;

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: unknown[] = [],
    stack: string = '',
    data: unknown = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }
}

export { ApiError };
