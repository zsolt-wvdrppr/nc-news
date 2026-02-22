exports.validateRequestBody = async (body) => {
  if (body === undefined) throw new BadRequestError("Missing Request Body!");
};
