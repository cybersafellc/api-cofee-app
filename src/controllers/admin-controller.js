import adminService from "../services/admin-service.js";

const register = async (req, res, next) => {
  try {
    const responses = await adminService.register(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const responses = await adminService.login(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const responses = await adminService.verifyToken();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await adminService.refreshToken(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

export default { register, login, verifyToken, refreshToken };
