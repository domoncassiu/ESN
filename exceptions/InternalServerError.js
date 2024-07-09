class InternalServerError extends Error {
  code = '500';
  constructor() {
    super('Internal Server Error');
  }
}

export default InternalServerError;
