import { Response } from "../app/response.js";
import productService from "../services/product-service.js";

const uploadImage = async (req, res, next) => {
  try {
    if (!req?.file?.filename) {
      res
        .status(400)
        .json(
          new Response(
            400,
            "please provided valid image file extention ex: .png .jpg .jpeg",
            null,
            null,
            true
          )
        )
        .end();
      return;
    }
    req.body.filename = await req?.file?.filename;
    const responses = await productService.uploadImage(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const responses = await productService.create(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const sold = async (req, res, next) => {
  try {
    const responses = await productService.sold(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const ready = async (req, res, next) => {
  try {
    const responses = await productService.ready(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const deletes = async (req, res, next) => {
  try {
    const responses = await productService.deletes(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    if (req.query.id) {
      req.body.id = await req.query.id;
      const responses = await productService.getById(req.body);
      res.status(responses.status).json(responses).end();
    } else if (req.query.q) {
      req.body.query = await req.query.q;
      const responses = await productService.getByQuery(req.body);
      res.status(responses.status).json(responses).end();
    } else {
      const responses = await productService.getAll();
      res.status(responses.status).json(responses).end();
    }
  } catch (error) {
    next(error);
  }
};

export default { uploadImage, create, sold, ready, deletes, get };
