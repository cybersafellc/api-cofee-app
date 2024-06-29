import { database } from "../app/database.js";
import { generate } from "../app/id.js";
import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import sendNotification from "../app/send-notification.js";
import { ResponseError } from "../error/response-error.js";
import orderValidation from "../validations/order-validation.js";
import validation from "../validations/validation.js";
import midtransClient from "midtrans-client";
const snap = new midtransClient.Snap({
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

  await database.sold_report.create({
    data: {
      id: await generate.ohter_id(),
      order_id: createOrder.id,
      date: result.date,
      total_amount: result.total,
    },
    select: {
      id: true,
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
      await database.sold_report.updateMany({
        data: {
          total_amount: 0,
        },
        where: {
          order_id: request.order_id,
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
  const ordersRemap = await Promise.all(
    orders.map(async (order) => {
      const product = await database.products.findFirst({
        where: {
          id: order.product_id,
        },
      });
      order.product_id = undefined;
      order.product_details = product;
      return order;
    })
  );
  return new Response(200, "successfully response", ordersRemap, null, false);
};

const getById = async (request) => {
  const result = await validation(orderValidation.getById, request);
  const order = await database.orders.findFirst({
    where: result,
  });
  if (!order) throw new ResponseError(400, "order does not exist");
  const product = await database.products.findFirst({
    where: {
      id: order.product_id,
    },
  });
  order.product_id = undefined;
  order.product_details = product;
  return new Response(200, "successfully get", order, null, false);
};

const adminCancel = async (request) => {
  const result = await validation(orderValidation.adminCancel, request);
  result.done = false;
  result.cancel = false;
  const order = await database.orders.findFirst({
    where: result,
  });

  if (!order) throw new ResponseError(400, "order does not exist");

  if (order.processing) {
    const reffundProcess = await fetch(
      `${process.env.API_STATUS_ORDER}/v2/${order.id}/refund`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.APP_SERVER_KEY_ENCODE}`,
        },
        body: JSON.stringify({
          refund_key: order.id,
          amount: order.total,
          reason: `reffund cofee_app`,
        }),
      }
    );
    const response = await reffundProcess.json();
    if (response.status_code != 200) {
      throw new ResponseError(
        400,
        "can't reffunded : " + response.status_message
      );
    }
    return new Response(
      200,
      "successfully cancel and reffunded",
      response,
      null,
      false
    );
  }

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
      "the user hasn't select payment methode, wait the user canceled or select payment methode"
    );
  }
  return new Response(200, "successfully canceled", response, null, false);
};

const done = async (request) => {
  const result = await validation(orderValidation.done, request);
  result.processing = true;
  result.done = false;
  const orderInfo = await database.orders.findFirst({
    where: result,
  });
  if (!orderInfo)
    throw new ResponseError(400, "order on processing does not exist");
  const markADone = await database.orders.update({
    data: {
      processing: false,
      done: true,
    },
    where: {
      id: result.id,
    },
  });
  const user = await database.users.findFirst({
    where: {
      id: orderInfo.user_id,
    },
    select: {
      phone: true,
      first_name: true,
    },
  });
  await sendNotification(
    `Hello ${user.first_name},%0AOrderan kamu sudah selesai nih %0AID: ${orderInfo.id}, %0ATotal: Rp.${orderInfo.total}`,
    user.phone
  );
  return new Response(200, "successfully mark a done", markADone, null, false);
};

const adminGetAll = async () => {
  const orders = await database.orders.findMany();
  const remapOrders = await Promise.all(
    orders.map(async (order) => {
      order.product_details = await database.products.findFirst({
        where: {
          id: order.product_id,
        },
      });
      order.product_id = undefined;
      return order;
    })
  );
  return new Response(200, "successfully get orders", remapOrders, null, false);
};

const adminGetById = async (request) => {
  const result = await validation(orderValidation.adminGetById, request);
  const order = await database.orders.findFirst({
    where: {
      id: result.id,
    },
  });
  if (!order) throw new ResponseError(400, "order does not exist");
  order.product_details = await database.products.findFirst({
    where: {
      id: order.product_id,
    },
  });
  order.product_id = undefined;
  return new Response(200, "successfully get order", order, null, false);
};

const adminGetDone = async () => {
  const orders = await database.orders.findMany({
    where: {
      done: true,
    },
  });
  const newOrders = await Promise.all(
    orders.map(async (order) => {
      order.product_details = await database.products.findFirst({
        where: {
          id: order.product_id,
        },
      });
      order.product_id = undefined;
      return order;
    })
  );
  return new Response(200, "successfully responses", newOrders, null, false);
};

const adminGetPending = async () => {
  const orders = await database.orders.findMany({
    where: {
      pending_payment: true,
    },
  });
  const newOrders = await Promise.all(
    orders.map(async (order) => {
      order.product_details = await database.products.findFirst({
        where: {
          id: order.product_id,
        },
      });
      order.product_id = undefined;
      return order;
    })
  );
  return new Response(200, "successfully responses", newOrders, null, false);
};

const adminGetProcessing = async () => {
  const orders = await database.orders.findMany({
    where: {
      processing: true,
    },
  });
  const newOrders = await Promise.all(
    orders.map(async (order) => {
      order.product_details = await database.products.findFirst({
        where: {
          id: order.product_id,
        },
      });
      order.product_id = undefined;
      return order;
    })
  );
  return new Response(200, "successfully responses", newOrders, null, false);
};

const adminGetCancel = async () => {
  const orders = await database.orders.findMany({
    where: {
      cancel: true,
    },
  });
  const newOrders = await Promise.all(
    orders.map(async (order) => {
      order.product_details = await database.products.findFirst({
        where: {
          id: order.product_id,
        },
      });
      order.product_id = undefined;
      return order;
    })
  );
  return new Response(200, "successfully responses", newOrders, null, false);
};

export default {
  adminGetCancel,
  adminGetProcessing,
  adminGetPending,
  create,
  afterPayment,
  cancel,
  getAll,
  getById,
  adminCancel,
  done,
  adminGetAll,
  adminGetById,
  adminGetDone,
};
