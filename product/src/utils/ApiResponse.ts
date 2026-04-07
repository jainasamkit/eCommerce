class ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;

  constructor(statusCode: number, data: T | null = null, message: string = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'Success') {
    return new ApiResponse<T>(200, data, message);
  }
}

export { ApiResponse };
