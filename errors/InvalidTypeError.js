class InvalidTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidTypeError";
    this.status = 400;
  }
}

module.exports = InvalidTypeError;
