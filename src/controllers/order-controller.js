import orderService from "../services/order-service.js";

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
    if (req.query.id) {
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

export default { create, afterPayment, cancel, get };
