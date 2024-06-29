import { database } from "../app/database.js";
import { Response } from "../app/response.js";
import soldReportValidation from "../validations/sold-report-validation.js";
import validation from "../validations/validation.js";

const getTotalOrder = async () => {
  const total_order = await database.sold_report.count();
  return new Response(200, "successfully get", { total_order }, null, false);
};

const getTotalProfit = async () => {
  const total_profit = await database.sold_report.aggregate({
    _sum: {
      total_amount: true,
    },
  });
  return new Response(200, "successfully get", total_profit._sum, null, false);
};

const getByPagination = async (request) => {
  const result = await validation(
    soldReportValidation.getByPagination,
    request
  );
  const data = await database.sold_report.findMany({
    orderBy: {
      date: "desc",
    },
    skip: result.skip,
    take: result.take,
  });
  return new Response(200, "successfully get", data, null, false);
};

const getByRangeDate = async (request) => {
  const result = await validation(soldReportValidation.getByRangeDate, request);
  const startDate = new Date(result.start_date);
  const endDate = new Date(result.end_date);

  const data = await database.sold_report.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return new Response(200, "successfully responses", data, null, false);
};

const getAll = async () => {
  const data = await database.sold_report.findMany({
    orderBy: {
      date: "desc",
    },
  });
  return new Response(200, "successfully get", data, null, false);
};

export default {
  getTotalOrder,
  getTotalProfit,
  getByPagination,
  getByRangeDate,
  getAll,
};
