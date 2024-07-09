class ErrorResponse {
  constructor(handledError) {
    this.message = handledError.message;
    this.status = 'error';
  }
}

export default ErrorResponse;
