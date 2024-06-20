import express from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

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
export default router;
