import { database } from "../app/database.js";
import { generate } from "../app/id.js";
import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../error/response-error.js";
import orderValidation from "../validations/order-validation.js";
import validation from "../validations/validation.js";
import midtransClient from "midtrans-client";
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

const create = async (request) => {
  const result = await validation(orderValidation.create, request);
  const product = await database.products.findFirst({
    where: {
      id: result.product_id,
    },
  });
  if (!product) throw new ResponseError(400, "product does not exist");
  const user = await database.users.findFirst({
    where: {
      id: result.user_id,
    },
  });
  result.id = await generate.ohter_id();
  result.total = product.price;

  const parameter = {
    transaction_details: {
      order_id: result.id,
      gross_amount: result.total,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    },
    item_details: [
      {
        id: product.id,
        price: product.price,
        quantity: 1,
        name: product.name,
      },
    ],
  };
  await snap.createTransaction(parameter).then((transaction) => {
    result.token_pay = transaction.token;
    result.payment_link = transaction.redirect_url;
  });
  result.date = new Date();
  result.pending_payment = true;
  result.processing = false;
  result.done = false;
  result.cancel = false;

  const createOrder = await database.orders.create({
    data: result,
    select: {
      id: true,
      payment_link: true,
      token_pay: true,
    },
  });

  return new Response(200, "successfully order", createOrder, null, false);
};

const afterPayment = async (request) => {
  logger.info("midtrans call me");
  const statusCanceled = [
    "deny",
    "cancel",
    "expire",
    "failure",
    "refund",
    "partial_refund",
  ];
  const statusAccept = ["settlement", "capture"];

  if (statusAccept.includes(request.transaction_status)) {
    const getStatusOrder = await fetch(
      `${process.env.API_STATUS_ORDER}/v2/${request.order_id}/status`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.APP_SERVER_KEY_ENCODE}`,
        },
      }
    );
    const responses = await getStatusOrder.json();
    if (statusAccept.includes(responses.transaction_status)) {
      await database.orders.update({
        data: {
          pending_payment: false,
          processing: true,
        },
        where: {
          id: responses.order_id,
        },
      });
    }
  } else {
    const getStatusOrder = await fetch(
      `${process.env.API_STATUS_ORDER}/v2/${request.order_id}/status`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.APP_SERVER_KEY_ENCODE}`,
        },
      }
    );
    const responses = await getStatusOrder.json();
    if (statusCanceled.includes(responses.transaction_status)) {
      await database.orders.update({
        data: {
          pending_payment: false,
          cancel: true,
        },
        where: {
          id: responses.order_id,
        },
      });
    }
  }
  return;
};

const cancel = async (request) => {
  const result = await validation(orderValidation.cancel, request);
  result.pending_payment = true;
  result.cancel = false;
  const count = await database.orders.count({
    where: result,
  });
  if (!count)
    throw new ResponseError(
      400,
      "this pending orders does not exist on your account"
    );
  const canceled = await fetch(
    `${process.env.API_STATUS_ORDER}/v2/${result.id}/cancel`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env.APP_SERVER_KEY_ENCODE}`,
      },
    }
  );
  const response = await canceled.json();
  if (response.status_code != 200) {
    throw new ResponseError(
      400,
      "you hasn't select payment methode, please select payment methode before take action cancel"
    );
  }
  return new Response(200, "successfully canceled", response, null, false);
};

const getAll = async (request) => {
  const result = await validation(orderValidation.getAll, request);
  const orders = await database.orders.findMany({
    where: result,
  });
  return new Response(200, "successfully response", orders, null, false);
};

const getById = async (request) => {
  const result = await validation(orderValidation.getById, request);
  const order = await database.orders.findFirst({
    where: result,
  });
  if (!order) throw new ResponseError(400, "order does not exist");
  return new Response(200, "successfully get", order, null, false);
};

export default { create, afterPayment, cancel, getAll, getById };
