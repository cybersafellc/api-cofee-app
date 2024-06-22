import Joi from "joi";

const create = Joi.object({
  user_id: Joi.string().required(),
  product_id: Joi.string().required(),
});

const cancel = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.string().required(),
});

const getAll = Joi.object({
  user_id: Joi.string().required(),
});

const getById = Joi.object({
  id: Joi.string().required(),
  user_id: Joi.string().required(),
});

const adminCancel = Joi.object({
  id: Joi.string().required(),
});

const done = Joi.object({
  id: Joi.string().required(),
});

const adminGetById = Joi.object({
  id: Joi.string().required(),
});

export default {
  create,
  cancel,
  getAll,
  getById,
  adminCancel,
  done,
  adminGetById,
};
