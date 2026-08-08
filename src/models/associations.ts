import User from "./user.model";
import Cart from "./cart.model";
import CartItem from "./cartItem.model";
import Product from "./product.model";
import ProductImage from "./productImage.model";
import ProductVariant from "./productVariant.model";
import Order from "./order.model";
import OrderItem from "./orderItem.model";

User.hasOne(Cart, {
  foreignKey: "userId",
  as: "cart",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "items",
  onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  as: "cart",
});

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});

ProductImage.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Product.hasMany(ProductVariant, {
  foreignKey: "productId",
  as: "variants",
  onDelete: "CASCADE",
});

ProductVariant.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

ProductVariant.hasMany(CartItem, {
  foreignKey: "variantId",
  as: "cartItems",
});

CartItem.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

ProductVariant.hasMany(OrderItem, {
  foreignKey: "variantId",
  as: "orderItems",
});

OrderItem.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});