import Joi from "joi";

const getByPagination = Joi.object({
  skip: Joi.number().required(),
  take: Joi.number().required(),
});

const getByRangeDate = Joi.object({
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

export default { getByPagination, getByRangeDate };
