const BadRequestError = require("../errors/BadRequestError");
const ServerError = require("../errors/ServerError");
const { fetchAllTopics, insertNewTopic } = require("../models/topics.model");

exports.getAllTopics = async () => {
  return await fetchAllTopics();
};

exports.postNewTopic = async (
  description,
  slug,
  img_url = "placeholder.webp",
) => {
  if (!description) throw new BadRequestError("Description is required!");
  if (!slug) throw new BadRequestError("Slug is required!");
  if (description.length > 255)
    throw new BadRequestError(
      "Description must be no more than 255 characters!",
    );
  if (slug.length > 55)
    throw new BadRequestError("Slug must be no longer than 55 characters!");

  const result = await insertNewTopic(description, slug, img_url);

  if (result === undefined) throw new ServerError("Topic insertion failed!");

  return result;
};
