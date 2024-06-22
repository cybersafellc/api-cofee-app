import orderService from "../services/order-service.js";
import userService from "../services/user-service.js";

const create = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await orderService.create(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const afterPayment = async (req, res, next) => {
  try {
    const responses = await orderService.afterPayment(req.body);
    res.status(200).json({ message: "thankyou" });
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const responses = await orderService.cancel(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    if (await req.query.id) {
      req.body.id = await req.query.id;
      const responses = await orderService.getById(req.body);
      res.status(responses.status).json(responses).end();
    } else {
      const responses = await orderService.getAll(req.body);
      res.status(responses.status).json(responses).end();
    }
  } catch (error) {
    next(error);
  }
};

const adminCancel = async (req, res, next) => {
  try {
    const responses = await orderService.adminCancel(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const done = async (req, res, next) => {
  try {
    const responses = await orderService.done(req.body);
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const adminGet = async (req, res, next) => {
  try {
    if (await req.query.id) {
      req.body.id = await req.query.id;
      const responses = await orderService.adminGetById(req.body);
      res.status(responses.status).json(responses).end();
    } else {
      const responses = await orderService.adminGetAll();
      res.status(responses.status).json(responses).end();
    }
  } catch (error) {
    next(error);
  }
};

const adminGetDone = async (req, res, next) => {
  try {
    const responses = await orderService.adminGetDone();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};
const adminGetPending = async (req, res, next) => {
  try {
    const responses = await orderService.adminGetPending();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};
const adminGetProcessing = async (req, res, next) => {
  try {
    const responses = await orderService.adminGetProcessing();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};
const adminGetCancel = async (req, res, next) => {
  try {
    const responses = await orderService.adminGetCancel();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  afterPayment,
  cancel,
  get,
  adminCancel,
  done,
  adminGet,
  adminGetDone,
  adminGetPending,
  adminGetProcessing,
  adminGetCancel,
};
