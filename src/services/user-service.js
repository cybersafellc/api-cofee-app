import { database } from "../app/database.js";
import { generate } from "../app/id.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../error/response-error.js";
import userValidation from "../validations/user-validation.js";
import validation from "../validations/validation.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const register = async (request) => {
  const result = await validation(userValidation.register, request);
  const count = await database.users.count({
    where: {
      username: result.username,
    },
  });
  if (count) throw new ResponseError(400, "username already exist");
  result.id = await generate.user_id();
  result.password = await bcrypt.hash(result.password, 10);
  const pushRegister = await database.users.create({
    data: result,
    select: {
      username: true,
      first_name: true,
      last_name: true,
    },
  });
  return new Response(
    200,
    "successfully register, please login",
    pushRegister,
    "/users/login",
    false
  );
};

const login = async (request) => {
  const result = await validation(userValidation.login, request);
  const user = await database.users.findFirst({
    where: {
      username: result.username,
    },
  });
  if (user && (await bcrypt.compare(result.password, user.password))) {
    const access_token = await Jwt.sign(
      { id: user.id },
      process.env.USER_ACCESS_TOKEN,
      { expiresIn: "5m" }
    );
    const refresh_token = await Jwt.sign(
      {
        id: user.id,
      },
      process.env.USER_REFRESH_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    return new Response(
      200,
      "successfully login",
      { access_token, refresh_token },
      null,
      false
    );
  }
  throw new ResponseError(400, "username and password not match");
};

const accessTokenVerify = async () => {
  return new Response(200, "access_token verified", null, null, false);
};

const refreshToken = async (request) => {
  const result = await validation(userValidation.refreshToken, request);
  const access_token = await Jwt.sign(
    { id: result.user_id },
    process.env.USER_ACCESS_TOKEN,
    { expiresIn: "5m" }
  );
  return new Response(
    200,
    "successfully generate access_token",
    { access_token },
    null,
    false
  );
};

export default { register, login, accessTokenVerify, refreshToken };
