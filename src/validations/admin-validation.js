import Joi from "joi";

const register = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshToken = Joi.object({
  user_id: Joi.string().required(),
});

export default { register, login, refreshToken };
