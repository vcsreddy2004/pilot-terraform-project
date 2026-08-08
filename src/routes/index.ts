import { Router } from "express";
import userRoutes from "./../modules/user/user.router";
import authRoutes from "./../modules/auth/auth.router";
import productRoutes from "./../modules/product/product.router";
import cartRouter from "../modules/cart/cart.router";
import orderRouter from "../modules/order/order.router";
const router = Router();

router.use("/users", userRoutes);
router.use("/auth",authRoutes);
router.use("/product",productRoutes);
router.use("/cart",cartRouter);
router.use("/orders", orderRouter);
export default router;