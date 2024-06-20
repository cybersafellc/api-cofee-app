import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../error/response-error.js";

const errorHandler = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  if (err instanceof ResponseError) {
    const responses = new Response(err.status, err.message, null, null, true);
    res.status(responses.status).json(responses).end();
  } else {
    const response = new Response(500, err.message, null, null, true);
    res.status(response.status).json(response).end();
    logger.error(err.message);
  }
};

const routeNotFound = async (req, res, next) => {
  try {
    throw new ResponseError(404, "page not found");
  } catch (error) {
    next(error);
  }
};

export default { errorHandler, routeNotFound };
