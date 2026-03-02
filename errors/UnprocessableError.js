class UnprocessableError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnprocessableError";
    this.status = 422;
  }
}

module.exports = UnprocessableError;
