import express from "express";
import productController from "../controllers/product-controller.js";
import orderController from "../controllers/order-controller.js";

const router = express.Router();
router.use("/products/images", express.static("public/images"));
router.get("/products", productController.get);
router.post("/weebhooks/orders/after-payment", orderController.afterPayment);
export default router;
