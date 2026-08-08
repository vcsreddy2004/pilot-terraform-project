import { sequelize } from "../../config/database";
import { AppError } from "../../utils/error.handler";
import { getImageUrl } from "../../utils/s3.handler";
import { createRazorpayOrder, verifyRazorpaySignature } from "../../utils/razorpay";
import orderRepository from "./order.repository";
import { CreateOrderDTO, PaymentVerificationDTO } from "./order.validation";

class OrderService {
    private buildCartSummary = async (userId: string, transaction: any) => {
        const cart = await orderRepository.findCartByUserId(userId);
        if(!cart) {
            throw new AppError("Cart is empty", 400);
        }
        const cartItems = await orderRepository.findCartItems(cart.id);
        if(!cartItems.length) {
            throw new AppError("Cart is empty", 400);
        }
        let subtotal = 0;
        const orderItems: any[] = [];
        for(const item of cartItems) {
            const variant = await orderRepository.findVariantById(item.variantId, transaction);
            if(!variant) {
                throw new AppError("One or more variants are unavailable", 404);
            }
            if(Number(variant.getDataValue("stock")) < item.quantity) {
                throw new AppError("Insufficient stock for one or more items", 400);
            }
            const unitPrice = Number(variant.getDataValue("price") ?? 0);
            subtotal += unitPrice * item.quantity;
            const product = (variant as any).product;
            const primaryImage = (product?.images || []).find((img: any) => img.isPrimary) || (product?.images || [])[0];
            const productImageUrl = primaryImage?.imageKey ? getImageUrl(primaryImage.imageKey) : "";
            orderItems.push({
                variantId: item.variantId,
                productName: product?.name || "Product",
                productImageUrl,
                price: unitPrice,
                quantity: item.quantity,
            });
        }
        return { cart, cartItems, subtotal, orderItems };
    };

    createOrder = async (userId: string, payload: CreateOrderDTO) => {
        const transaction = await sequelize.transaction();
        try {
            const { cart, cartItems, subtotal, orderItems } = await this.buildCartSummary(userId, transaction);
            const order = await orderRepository.createOrder(
                {
                userId,
                totalAmount: subtotal,
                shippingAddress: payload.shippingAddress,
                phoneNumber: payload.phoneNumber,
                paymentId: payload.paymentId || null,
                status: "pending",
                },
                transaction
            );
            const orderId = (order as unknown as { id: string }).id;
            const itemsWithOrderId = orderItems.map((item) => ({
                ...item,
                orderId,
                productName: item.productName || "Product",
                productImageUrl: item.productImageUrl || "",
            }));
            await orderRepository.createOrderItems(itemsWithOrderId, transaction);
            for(const item of cartItems) {
                await orderRepository.decreaseVariantStock(item.variantId, item.quantity, transaction);
            }
            await orderRepository.clearCartItems(cart.id, transaction);
            await transaction.commit();
            return { success: true, order };
        } 
        catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError("Internal Server Error", 500);
        }
    };

    createPaymentOrder = async (userId: string, payload: CreateOrderDTO) => {
        const transaction = await sequelize.transaction();
        try {
            const { cart, cartItems, subtotal, orderItems } = await this.buildCartSummary(userId, transaction);
            const receipt = `order_${Date.now()}`;
            const razorpayOrder = await createRazorpayOrder({
                amount: subtotal,
                receipt,
            });

            const order = await orderRepository.createOrder(
                {
                userId,
                totalAmount: subtotal,
                shippingAddress: payload.shippingAddress,
                phoneNumber: payload.phoneNumber,
                paymentId: razorpayOrder.id,
                status: "pending",
                },
                transaction
            );

            const orderId = (order as unknown as { id: string }).id;
            const itemsWithOrderId = orderItems.map((item) => ({
                ...item,
                orderId,
                productName: item.productName || "Product",
                productImageUrl: item.productImageUrl || "",
            }));

            await orderRepository.createOrderItems(itemsWithOrderId, transaction);
            await transaction.commit();

            return {
                success: true,
                orderId,
                razorpayOrder,
            };
        } 
        catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError("Internal Server Error", 500);
        }
    };

    verifyPayment = async (userId: string, payload: PaymentVerificationDTO) => {
        try {
        const order = await orderRepository.findOrderById(payload.orderId);
        if (!order) {
            throw new AppError("Order not found", 404);
        }
        const orderData = order as unknown as { userId: string };
        if (orderData.userId !== userId) {
            throw new AppError("Forbidden", 403);
        }

        const isValidSignature = verifyRazorpaySignature(payload);
        if (!isValidSignature) {
            throw new AppError("Payment verification failed", 400);
        }

        await orderRepository.updateOrderStatus(payload.orderId, "paid");
        return {
            success: true,
            message: "Payment verified successfully",
            orderId: payload.orderId,
        };
        } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Internal Server Error", 500);
        }
    };

    getOrders = async (userId: string) => {
        return orderRepository.getOrdersByUserId(userId);
    };

    getOrderById = async (userId: string, orderId: string) => {
        const order = await orderRepository.getOrderById(orderId, userId);
        if (!order) {
        throw new AppError("Order not found", 404);
        }
        return order;
    };

    updateOrderStatus = async (orderId: string, status: string) => {
        const [updated] = await orderRepository.updateOrderStatus(orderId, status);
        if (!updated) {
        throw new AppError("Order not found", 404);
        }
        return { success: true, message: "Order status updated" };
    };
}

export default new OrderService();
