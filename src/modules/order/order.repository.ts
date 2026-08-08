import Order from "../../models/order.model";
import OrderItem from "../../models/orderItem.model";
import Cart from "../../models/cart.model";
import CartItem from "../../models/cartItem.model";
import ProductVariant from "../../models/productVariant.model";
import Product from "../../models/product.model";
import ProductImage from "../../models/productImage.model";
import { Transaction } from "sequelize";

class OrderRepository {
    createOrder = async (data: any, transaction?: Transaction) => {
        return Order.create(data, { transaction });
    };

    createOrderItems = async (items: any[], transaction?: Transaction) => {
        return OrderItem.bulkCreate(items, { transaction });
    };

    findCartByUserId = async (userId: string) => {
        return Cart.findOne({ where: { userId } });
    };

    findCartItems = async (cartId: string) => {
        return CartItem.findAll({ where: { cartId } });
    };

    findVariantById = async (variantId: number, transaction?: Transaction) => {
        return ProductVariant.findByPk(variantId, {
        transaction,
        include: [
            {
                model: Product,
                as: "product",
                attributes: ["id", "name", "slug"],
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
        });
    };

    decreaseVariantStock = async (variantId: number, quantity: number, transaction?: Transaction) => {
        return ProductVariant.decrement("stock", {
        by: quantity,
        where: { id: variantId },
        transaction,
        });
    };

    clearCartItems = async (cartId: string, transaction?: Transaction) => {
        return CartItem.destroy({ where: { cartId }, transaction });
    };

    getOrdersByUserId = async (userId: string) => {
        return Order.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        include: [
            {
            model: OrderItem,
            as: "items",
            include: [
                {
                model: ProductVariant,
                as: "variant",
                include: [
                    {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "slug"],
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
    };

    getOrderById = async (orderId: string, userId?: string) => {
        return Order.findOne({
        where: userId ? { id: orderId, userId } : { id: orderId },
        include: [
            {
            model: OrderItem,
            as: "items",
            include: [
                {
                model: ProductVariant,
                as: "variant",
                include: [
                    {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "slug"],
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
    };

    updateOrderStatus = async (orderId: string, status: string) => {
        return Order.update({ status }, { where: { id: orderId } });
    };

    findOrderById = async (orderId: string) => {
        return Order.findByPk(orderId);
    };
}

export default new OrderRepository();
