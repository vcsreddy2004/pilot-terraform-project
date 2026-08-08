import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import * as userController from "./user.controller";
const router = Router();
router.get("/",protect,restrictTo("customer"),userController.fetchUserData);
export default router;  