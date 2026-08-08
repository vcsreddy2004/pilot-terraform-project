import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import orderController from "./order.controller";

const router = Router();

router.post("/", protect, restrictTo("customer"), orderController.createOrder);
router.post("/payment", protect, restrictTo("customer"), orderController.createPaymentOrder);
router.post("/payment/verify", protect, restrictTo("customer"), orderController.verifyPayment);
router.get("/", protect, restrictTo("customer"), orderController.getOrders);
router.get("/:id", protect, restrictTo("customer"), orderController.getOrderById);
router.patch("/:id/status", protect, restrictTo("admin"), orderController.updateOrderStatus);

export default router;
