import express from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import orderController from "../controllers/order-controller.js";

const router = express.Router();
router.post("/users", userController.register);
router.post("/users/login", userController.login);
router.get(
  "/users/verify-token",
  authMiddleware.userAccessToken,
  userController.accessTokenVerify
);
router.get(
  "/users/refresh-token",
  authMiddleware.userRefreshToken,
  userController.refreshToken
);
router.post(
  "/users/orders",
  authMiddleware.userAccessToken,
  orderController.create
);
router.get(
  "/users/orders",
  authMiddleware.userAccessToken,
  orderController.get
);
router.put(
  "/users/orders/cancel",
  authMiddleware.userAccessToken,
  orderController.cancel
);
export default router;
