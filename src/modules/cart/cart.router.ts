import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import cartController from "./cart.controller";

const router:Router = Router();
router.post("/",protect,restrictTo("customer"),cartController.updateCartItem);
router.get("/",protect,restrictTo("customer"),cartController.getCart);
export default router;