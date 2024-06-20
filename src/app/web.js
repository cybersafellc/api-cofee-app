import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "../middlewares/error-middleware.js";
import userRouter from "../routers/user.js";
import adminRouter from "../routers/admin.js";
import publicRouter from "../routers/public.js";

export const web = express();
web.use(cors());
web.use(cookieParser());
web.use(bodyParser.json());

web.use(publicRouter);
web.use(userRouter);
web.use(adminRouter);

web.use(errorMiddleware.routeNotFound);
web.use(errorMiddleware.errorHandler);
