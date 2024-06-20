import productValidation from "../validations/product-validation.js";
import validation from "../validations/validation.js";
import { Response } from "../app/response.js";
import { database } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { generate } from "../app/id.js";

const uploadImage = async (request) => {
  const result = await validation(productValidation.uploadImage, request);
  const url = `${process.env.API_URL}/products/images/${result.filename}`;
  return new Response(
    200,
    "successfully upload image",
    { filename: url },
    null,
    false
  );
};

const create = async (request) => {
  const result = await validation(productValidation.create, request);
  const count = await database.products.count({
    where: {
      name: result.name,
    },
  });
  if (count) throw new ResponseError(400, "cofee already exist");
  result.id = await generate.ohter_id();
  result.stocks = true;
  const createNewCofee = await database.products.create({
    data: result,
  });
  return new Response(200, "successfully created", createNewCofee, null, false);
};

const sold = async (request) => {
  const result = await validation(productValidation.sold, request);
  const count = await database.products.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "product does not exist");
  const updateSold = await database.products.update({
    data: {
      stocks: false,
    },
    where: result,
  });
  return new Response(200, "successfully mark a sold", updateSold, null, false);
};

const ready = async (request) => {
  const result = await validation(productValidation.ready, request);
  const count = await database.products.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "product does not exist");
  const updateReady = await database.products.update({
    data: {
      stocks: true,
    },
    where: result,
  });
  return new Response(
    200,
    "successfully mark a ready",
    updateReady,
    null,
    false
  );
};

const deletes = async (request) => {
  const result = await validation(productValidation.deletes, request);
  const count = await database.products.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "product does not exist");
  const deleted = await database.products.delete({
    where: result,
  });
  return new Response(200, "successfully deleted", deleted, null, false);
};

const getAll = async () => {
  const products = await database.products.findMany();
  return new Response(200, "successfully get products", products, null, false);
};

const getById = async (request) => {
  const result = await validation(productValidation.getById, request);
  const product = await database.products.findFirst({
    where: {
      id: result.id,
    },
  });
  if (!product) throw new ResponseError(400, "product does not exist");
  return new Response(200, "successfully get product", product, null, false);
};

const getByQuery = async (request) => {
  const result = await validation(productValidation.getByQuery, request);
  const products = await database.products.findMany({
    where: {
      OR: [
        {
          name: {
            contains: result.query,
          },
        },
        {
          description: {
            contains: result.query,
          },
        },
      ],
    },
  });
  return new Response(200, "successfully get products", products, null, false);
};

export default {
  uploadImage,
  create,
  sold,
  ready,
  deletes,
  getAll,
  getById,
  getByQuery,
};
