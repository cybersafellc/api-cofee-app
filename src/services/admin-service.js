import { database } from "../app/database.js";
import { generate } from "../app/id.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../error/response-error.js";
import adminValidation from "../validations/admin-validation.js";
import validation from "../validations/validation.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const register = async (request) => {
  const result = await validation(adminValidation.register, request);
  const count = await database.admin.count({
    where: {
      username: result.username,
    },
  });
  if (count) throw new ResponseError(400, "admin username already exist");
  result.id = await generate.user_id();
  result.password = await bcrypt.hash(result.password, 10);
  const adminRegister = await database.admin.create({
    data: result,
    select: {
      username: true,
    },
  });
  return new Response(
    200,
    "admin successfully register",
    adminRegister,
    null,
    false
  );
};

const login = async (request) => {
  const result = await validation(adminValidation.login, request);
  const admin = await database.admin.findFirst({
    where: {
      username: result.username,
    },
  });

  if (admin && (await bcrypt.compare(result.password, admin.password))) {
    const access_token = await Jwt.sign(
      { id: admin.id },
      process.env.ADMIN_ACCESS_TOKEN,
      { expiresIn: "5m" }
    );
    const refresh_token = await Jwt.sign(
      { id: admin.id },
      process.env.ADMIN_REFRESH_TOKEN,
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
  return new Response(400, "username and password not match", null, null, true);
};

const verifyToken = async () => {
  return new Response(200, "access_token verified", null, null, false);
};

const refreshToken = async (request) => {
  const result = await validation(adminValidation.refreshToken, request);
  const access_token = await Jwt.sign(
    { id: result.user_id },
    process.env.ADMIN_ACCESS_TOKEN,
    { expiresIn: "5m" }
  );
  return new Response(
    200,
    "successfully generate new access_token",
    { access_token },
    null,
    false
  );
};

export default { register, login, verifyToken, refreshToken };
