import express from "express";
import productController from "../controllers/product-controller.js";

const router = express.Router();
router.use("/products/images", express.static("public/images"));
router.get("/products", productController.get);
export default router;
