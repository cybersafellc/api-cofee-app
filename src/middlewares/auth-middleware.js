import Jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";

const userAccessToken = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = await Jwt.verify(
      access_token,
      process.env.USER_ACCESS_TOKEN,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "please provided valid access_token");
    req.id = await decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

const userRefreshToken = async (req, res, next) => {
  try {
    const refresh_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = await Jwt.verify(
      refresh_token,
      process.env.USER_REFRESH_TOKEN,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "please provided valid refresh_token");
    req.id = await decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

const adminAccessToken = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = await Jwt.verify(
      access_token,
      process.env.ADMIN_ACCESS_TOKEN,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "please provided valid access_token");
    req.id = await decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

const adminRefreshToken = async (req, res, next) => {
  try {
    const refresh_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = await Jwt.verify(
      refresh_token,
      process.env.ADMIN_REFRESH_TOKEN,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "please provided valid refresh_token");
    req.id = await decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

export default {
  userAccessToken,
  userRefreshToken,
  adminAccessToken,
  adminRefreshToken,
};
