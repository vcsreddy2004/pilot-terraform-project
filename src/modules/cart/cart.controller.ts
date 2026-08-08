import { Request,Response,NextFunction } from "express";
import { AppError } from "../../utils/error.handler";
import { varientValidationSchema } from "./cart.validation";
import cartService from "./cart.service";
import { success } from "zod";
class CartController {
    updateCartItem = async (req:Request,res:Response,next:NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const {id} = req.user;
            console.log("BODY:", req.body);
            console.log("TYPE:", typeof req.body);
            const validation = varientValidationSchema.parse(req.body); 
            await cartService.updateCartItem(id,validation.variantId,validation.quantity)
            return res.status(200).json({success:true});
        }
        catch(error) {
            next(error);
        }
    }
    getCart = async (req:Request,res:Response,next:NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const {id} = req.user;
            const cartData = await cartService.getCart(id);
            return res.status(200).json({success:true,cartData});
        }
        catch(error) {
            next(error);
        }
    }
}
export default new CartController();