import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/error.handler";
import orderService from "./order.service";
import { createOrderSchema, paymentVerificationSchema } from "./order.validation";
import { ZodError } from "zod";

class OrderController {
    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const validated = createOrderSchema.parse(req.body);
            const result = await orderService.createOrder(req.user.id, validated);
            return res.status(201).json(result);
        } 
        catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            next(error);
        }
    };
    createPaymentOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const validated = createOrderSchema.parse(req.body);
            const result = await orderService.createPaymentOrder(req.user.id, validated);
            return res.status(200).json(result);
        } 
        catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            next(error);
        }
    };
    verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const validated = paymentVerificationSchema.parse(req.body);
            const result = await orderService.verifyPayment(req.user.id, validated);
            return res.status(200).json(result);
        } 
        catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            next(error);
        }
    };
    getOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const orders = await orderService.getOrders(req.user.id);
            return res.status(200).json({ success: true, orders });
        } 
        catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            next(error);
        }
    };
    getOrderById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const order = await orderService.getOrderById(req.user.id, req.params.id);
            return res.status(200).json({ success: true, order });
        } 
        catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            next(error);
        }
    };
    updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.user) {
                throw new AppError("Unauthorized", 401);
            }
            const result = await orderService.updateOrderStatus(req.params.id, req.body.status);
            return res.status(200).json(result);
        } 
        catch (error) {
            if(error instanceof ZodError) {
                return res.status(400).json({ errors: error.issues });
            }
            next(error);
        }
    };
}

export default new OrderController();
