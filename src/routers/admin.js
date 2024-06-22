import express from "express";
import adminController from "../controllers/admin-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import { multers } from "../middlewares/multer-middleware.js";
import productController from "../controllers/product-controller.js";
import orderController from "../controllers/order-controller.js";

const router = express.Router();
router.post("/admin", adminController.register);
router.post("/admin/login", adminController.login);
router.get(
  "/admin/verify-token",
  authMiddleware.adminAccessToken,
  adminController.verifyToken
);
router.get(
  "/admin/refresh-token",
  authMiddleware.adminRefreshToken,
  adminController.refreshToken
);
router.post(
  "/products/images",
  authMiddleware.adminAccessToken,
  multers,
  productController.uploadImage
);
router.post(
  "/products",
  authMiddleware.adminAccessToken,
  productController.create
);
router.put(
  "/products/sold",
  authMiddleware.adminAccessToken,
  productController.sold
);
router.put(
  "/products/ready",
  authMiddleware.adminAccessToken,
  productController.ready
);
router.delete(
  "/products",
  authMiddleware.adminAccessToken,
  productController.deletes
);
router.put(
  "/admin/orders/cancel",
  authMiddleware.adminAccessToken,
  orderController.adminCancel
);
router.put(
  "/admin/orders/done",
  authMiddleware.adminAccessToken,
  orderController.done
);
router.get(
  "/admin/orders",
  authMiddleware.adminAccessToken,
  orderController.adminGet
);
router.get(
  "/admin/orders/done",
  authMiddleware.adminAccessToken,
  orderController.adminGetDone
);
router.get(
  "/admin/orders/pending",
  authMiddleware.adminAccessToken,
  orderController.adminGetPending
);
router.get(
  "/admin/orders/processing",
  authMiddleware.adminAccessToken,
  orderController.adminGetProcessing
);
router.get(
  "/admin/orders/cancel",
  authMiddleware.adminAccessToken,
  orderController.adminGetCancel
);
export default router;
