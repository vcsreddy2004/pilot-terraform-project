import Cart from "../../models/cart.model";
import CartItem from "../../models/cartItem.model";
import ProductVariant from "../../models/productVariant.model";
import Product from "../../models/product.model";
import ProductImage from "../../models/productImage.model";

class CartRepository {
  async findCartByUserId(userId: string) {
    return Cart.findOne({ where: { userId } });
  }
  async createCart(userId: string) {
    return Cart.create({ userId });
  }
  async findOrCreateCart(userId: string) {
    let cart = await this.findCartByUserId(userId);
    if(!cart) cart = await this.createCart(userId);
    return cart;
  }
  async findCartItem(cartId: string, variantId: number) {
    return CartItem.findOne({
      where: { cartId, variantId },
    });
  }
  async createCartItem(data: {cartId: string;variantId: number;quantity: number;}) {
    return CartItem.create(data);
  }
  async updateCartItem(item: CartItem, quantity: number) {
    return item.update({ quantity });
  }
  async deleteCartItem(cartId: string, variantId: number) {
    return CartItem.destroy({
      where: { cartId, variantId },
    });
  }
  async findVariantById(variantId: number) {
    return ProductVariant.findByPk(variantId);
  }
  async getCartFull(cartId: string) {
    return Cart.findByPk(cartId, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: ProductVariant,
              as: "variant",
              attributes: ["id", "price", "stock", "size"],
              include: [
                {
                  model: Product,
                  as: "product", 
                  attributes: ["id", "name", "slug","basePrice"],
                  include: [
                    {
                      model: ProductImage,
                      as: "images", 
                      attributes: ["imageKey", "isPrimary"],
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}
export default new CartRepository();