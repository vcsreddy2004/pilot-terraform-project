// controllers/product.controller.ts
import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service";
import { ProductDTO, productSchema,updateStockSchema } from "./product.validation";
import { ZodError } from "zod";
export const createProduct = async (req: Request, res: Response,next:NextFunction) => {
    try {
        if(typeof req.body.variants === "string") {
            req.body.variants = JSON.parse(req.body.variants);
        }
        if(!req.files || (req.files as any[]).length === 0) {
            throw new Error("At least one image is required");
        }
        if((req.files as any[]).length > 5) {
            return res.status(400).json({
                error: "Maximum 5 images allowed",
            });
        }   
        const validatedData:ProductDTO = productSchema.parse(req.body);
        const product = await ProductService.createProductService(validatedData,req.files as any[]);
        return res.status(201).json({
            success: true,
            product,
        });
    } 
    catch (error) {
        if(error instanceof ZodError) {
            const formattedErrors = error.issues.map(err => ({
                field: err.path.join("."),
                message: err.message
            }));        
            return res.status(400).json({
                errors: formattedErrors
            });
        }
        next(error);
    }
};  
export const getProducts = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { slug } = req.params;
        if(slug) {
            const product = await ProductService.getProductBySlugService(slug);
            return res.json({
                success: true,
                product,
            });
        }
        const query = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 5,
            search: req.query.search as string,
            minPrice: req.query.minPrice as string,
            maxPrice: req.query.maxPrice as string,
            sort: req.query.sort as string,
        };
        const data = await ProductService.getProductsService(query);
        return res.json({
            success: true,
            ...data,
        });
    } 
    catch (error) {
        next(error);
    }
};
export const updateStockController = async (req: Request<{ slug: string }>,res: Response,next:NextFunction) => {
    try {
        const { slug } = req.params;
        const parsed = updateStockSchema.parse(req.body);
        const result = await ProductService.updateStockService({
            slug,
            ...parsed
        });
        res.json(result);
    } 
    catch (err: any) {
        next(err);
    }
};
export const deleteProduct = async (req: Request<{ slug: string }>,res: Response,next:NextFunction) => {
    try {
        const { slug } = req.params;
        const result = await ProductService.deleteProductService(slug);
        res.json(result);
    } 
    catch (err: any) {
        next(err);
    }
};