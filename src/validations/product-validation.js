import Joi from "joi";

const uploadImage = Joi.object({
  filename: Joi.string().required(),
});

const create = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  img: Joi.string().required(),
  description: Joi.string().required(),
});

const sold = Joi.object({
  id: Joi.string().required(),
});

const ready = Joi.object({
  id: Joi.string().required(),
});

const deletes = Joi.object({
  id: Joi.string().required(),
});

const getById = Joi.object({
  id: Joi.string().required(),
});

const getByQuery = Joi.object({
  query: Joi.string().required(),
});

export default {
  uploadImage,
  create,
  sold,
  ready,
  deletes,
  getById,
  getByQuery,
};
