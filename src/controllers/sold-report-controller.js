import soldReportService from "../services/sold-report-service.js";

const getTotalOrder = async (req, res, next) => {
  try {
    const responses = await soldReportService.getTotalOrder();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const getTotalProfit = async (req, res, next) => {
  try {
    const responses = await soldReportService.getTotalProfit();
    res.status(responses.status).json(responses).end();
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    if (req.query.skip && req.query.take) {
      req.body.skip = await req.query.skip;
      req.body.take = await req.query.take;
      const responses = await soldReportService.getByPagination(req.body);
      res.status(responses.status).json(responses).end();
    } else if (req.query.start_date && req.query.end_date) {
      req.body.start_date = await req.query.start_date;
      req.body.end_date = await req.query.end_date;
      const responses = await soldReportService.getByRangeDate(req.body);
      res.status(responses.status).json(responses).end();
    } else {
      const responses = await soldReportService.getAll();
      res.status(responses.status).json(responses).end();
    }
  } catch (error) {
    next(error);
  }
};

export default { getTotalOrder, getTotalProfit, get };
