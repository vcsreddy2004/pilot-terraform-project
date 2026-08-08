import cartRepository from "./cart.repository";
import { AppError } from "../../utils/error.handler";
class CartService {
    updateCartItem = async (userId: string,variantId: number,quantity: number) => {
        try {
            if(quantity < 0) {
                throw new AppError("Invalid quantity", 400);
            }
            const cart = await cartRepository.findOrCreateCart(userId);
            const existing = await cartRepository.findCartItem(cart.id,variantId);
            // Remove case
            if(quantity === 0) {
                if(!existing) {
                    return { message: "Item already not in cart" };
                }
                await cartRepository.deleteCartItem(cart.id, variantId);
                return { message: "Item removed from cart" };
            }
            const variant = await cartRepository.findVariantById(variantId);
            if(!variant) throw new AppError("Variant not found", 404);
            if(variant.getDataValue("stock") < quantity) {
                throw new AppError("Stock exceeded", 400);
            }
            // Create or update
            if(!existing) {
                await cartRepository.createCartItem({cartId: cart.id,variantId,quantity,});
                return { message: "Item added to cart" };
            }
            await cartRepository.updateCartItem(existing, quantity);
            return { message: "Cart updated" };
        } 
        catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Internal Server Error", 500);
        }
    };
    getCart = async (userId: string) => {
        try {
            const cart = await cartRepository.findCartByUserId(userId);
            if(!cart) return { items: [], total: 0 };
            const fullCart = await cartRepository.getCartFull(cart.id);
            console.log(fullCart);
            return this.formatCart(fullCart);
        }
        catch(error) {
            if(error instanceof AppError) {
                throw error; 
            }
            throw new AppError("Internal Server Error", 500);
        }
    }
    formatCart(cart: any) {
        let subtotal = 0;
        const items = (cart.items || []).map((item: any) => {
            const variant = item.variant;
            const product = variant.product;
            const price = Number(variant.price ?? variant.product.basePrice);
            const total = price * item.quantity;
            subtotal += total;
            const primaryImage = (product.images || []).find((img: any) => img.isPrimary);
            return {
                cartItemId: item.id,
                quantity: item.quantity,
                price,
                total,
                variant: {
                    id: variant.id,
                    size: variant.size,
                    stock: variant.stock,
                },
                product: {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: primaryImage?.imageKey || null,
                },
            };
        });
        return {
            items,
            subtotal,
            total: subtotal,
        };
    }
}
export default new CartService();