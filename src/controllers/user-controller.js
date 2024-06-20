import userService from "../services/user-service.js";

const register = async (req, res, next) => {
  try {
    const responses = await userService.register(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const responses = await userService.login(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const accessTokenVerify = async (req, res, next) => {
  try {
    const responses = await userService.accessTokenVerify();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await userService.refreshToken(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

export default { register, login, accessTokenVerify, refreshToken };
