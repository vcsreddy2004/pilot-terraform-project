// services/product.service.ts
import { sequelize } from "../../config/database";
import ProductRepository from "./product.repository";
import { AppError } from "../../utils/error.handler";
import { uploadToS3,getImageUrl,sanitizeName,getFileExtension,deleteFromS3} from "../../utils/s3.handler";
import { ProductDTO,UpdateStockDTO } from "./product.validation";
import slugify from "slugify";
import { extractIdFromSlug } from "../../helpers/extract.ids";
class ProductService {
    createProductService = async (body: any, files: any[]) => {
        const transaction = await sequelize.transaction();
        try {
            const { name, basePrice, description, variants } = body;
            // 1. Create product
            const product = await ProductRepository.createProductRepo({ name, basePrice, description },transaction);
            const slug:string = `${slugify(product.name.trim(), { lower: true, strict: true })}-${product.id}`;
            await product.update({ slug }, { transaction });
            // 2. Prepare images from S3
            const cleanName = sanitizeName(name);
            const imageData = await Promise.all(
                files.map(async (file, index) => {
                    const ext = getFileExtension(file.originalname);
                    // your custom key
                    const key = `products/${product.id}/${cleanName}_image${index + 1}.${ext}`;
                    // upload using custom key      
                    await uploadToS3(file,key);
                    return {
                        productId: product.id,
                        imageKey: key,
                        isPrimary: index === 0,
                    };
                })
            );
            await ProductRepository.createImagesRepo(imageData, transaction);
            // 3. Prepare variants
            const variantData = variants.map((v: any) => ({productId: product.id,size: v.size,stock: v.stock,price: v.price}));
            await ProductRepository.createVariantsRepo(variantData, transaction);
            await transaction.commit();
            return product;
        } 
        catch (error) {
            await transaction.rollback();
            if(error instanceof AppError) {
                throw error; 
            }
            throw new AppError("Internal Server Error", 500);
        }
    };
    getProductsService = async (query: any) => {
        const transaction = await sequelize.transaction();
        try {
            let { page, limit, search, minPrice, maxPrice, sort } = query;
            page = Math.max(1, parseInt(page) || 1);
            limit = Math.min(50, parseInt(limit) || 5);
            search = search?.trim();
            const offset = (page - 1) * limit;
            const filters = {
                search,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sort,
            };
            const { count, rows } = await ProductRepository.findProductsAdvanced(filters,limit,offset,transaction);
            const products:ProductDTO[] = rows.map((product:any)=>({
                id:product.id,
                name:product.name,
                basePrice:product.basePrice,
                slug:product.slug,
                images: (product.images || []).map((img: any) => ({
                    imageUrl: getImageUrl(img.imageKey),
                    isPrimary: img.isPrimary,
                })),
                variants: (product.variants || []).map((v: any) => ({
                    variantId:v.id,
                    size: v.size,
                    stock: v.stock,
                    price: Number(v.price),
                })),
                description:product.description
            }))
            const totalPages = Math.ceil(count / limit);
            await transaction.commit();
            return {
                currentPage: page,
                totalPages,
                totalProducts: count,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                products: products,
            };
        }
        catch (error) {
            transaction.rollback();
            if(error instanceof AppError) {
                throw error; 
            }
            throw new AppError("Internal Server Error", 500);
        }
    };
    getProductBySlugService = async (slug:string) => {
        const transaction = await sequelize.transaction();
        try {
            if(!slug || typeof slug !== "string") {
                throw new AppError("Invalid product identifier", 400);
            } 
            const id:number | null = extractIdFromSlug(slug);
            if(id) {
                const data = await ProductRepository.getProductByPK(id,transaction);
                if(data && slug===data.slug) {
                    const product = {
                        id: data.id,
                        slug:data.slug,
                        name:data.name,
                        basePrice:data.basePrice,
                        images: (data.images || []).map((img: any) => ({
                            imageUrl: getImageUrl(img.imageKey),
                            isPrimary: img.isPrimary,
                        })),
                        variants: (data.variants || []).map((v: any) => ({
                            variatId:v.id,
                            size: v.size,
                            stock: v.stock,
                            price: Number(v.price),
                        })),
                        description:data.description
                    }
                    await transaction.commit();
                    return product;
                }
                else {
                    throw new AppError("Product not found",404);
                }
            }
            throw new AppError("Product not found",404);
        }
        catch (error) {
            await transaction.rollback();
            if(error instanceof AppError) {
                throw error; 
            }
            throw new AppError("Internal Server Error", 500);
        }
    }
    updateStockService = async ({slug,variant,action,quantity}: UpdateStockDTO) => {
        const transaction = await sequelize.transaction();
        try {
            if (!slug || typeof slug !== "string") {
                throw new AppError("Invalid product identifier", 400);
            }
            const id = extractIdFromSlug(slug);
            if (!id) throw new AppError("Invalid Product Id", 400);
            const product = await ProductRepository.getProductByPK(id,transaction);
            if (!product || product.slug !== slug) {
                throw new AppError("Product not found", 404);
            }
            const existingVariantModel = await ProductRepository.getVariant(id, variant, transaction);
            const existingVariant = existingVariantModel?(existingVariantModel.toJSON() as {
                size: string;
                stock: number;
                price?: number;
                })
            : null;
            if(action === "add") {
                if(quantity === undefined)
                {
                    throw new AppError("Quantity required", 400);
                }
                existingVariant? await ProductRepository.increaseStock(id, variant, quantity, transaction): await ProductRepository.createVariant(id, variant, quantity, transaction);
                const updated = await ProductRepository.getVariant(id, variant, transaction);
                await transaction.commit();
                return updated;
            }
            if(action === "remove") {
                if(quantity === undefined)
                {
                    throw new AppError("Quantity required", 400);
                }
                if(!existingVariant)
                {
                    throw new AppError("Variant not found", 404);
                }
                if(existingVariant.stock < quantity) {
                    throw new AppError("Insufficient stock", 400);
                }
                const result = await ProductRepository.decreaseStock(id,variant,quantity,transaction);
                const affected = result as unknown as number[];
                if(affected[0] === 0) {
                    throw new AppError("Insufficient stock", 400);
                }
                const updated = await ProductRepository.getVariant(id, variant, transaction);
                await transaction.commit();
                return updated;
            }
            if(action === "delete") {
                if(!existingVariant)
                {
                    throw new AppError("Variant not found", 404);
                }
                await ProductRepository.deleteVariant(id, variant, transaction);
                const updated = await ProductRepository.getVariant(id, variant, transaction);
                await transaction.commit();
                return updated;
            }
            throw new AppError("Invalid action", 400);
    
        } 
        catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
    
            throw new AppError("Internal Server Error", 500);
        }
    };
    deleteProductService = async (slug: string) => {
        const transaction = await sequelize.transaction();
        try {
            if(!slug) {
                throw new AppError("Product not found", 400);
            }
            const id = extractIdFromSlug(slug);
            if(!id) throw new AppError("Product not found", 400);
            const product = await ProductRepository.getProductByPK(id,transaction);
            if(!product || product.slug !== slug) {
                throw new AppError("Product not found", 404);
            }
            const images = product.images || [];
            await ProductRepository. deleteVariantsByProductId(id, transaction);
            // 2. delete images from DB
            await ProductRepository.deleteImagesByProductId(id, transaction);
            // 3. delete product
            await ProductRepository.deleteProductById(id, transaction);
            await transaction.commit();
            for (const img of images) {
                await deleteFromS3(img.imageKey); 
            }
            return { message: "Product deleted successfully" };
        } 
        catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError("Internal Server Error", 500);
        }
    };
}
export default new ProductService();