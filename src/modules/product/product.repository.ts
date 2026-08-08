import Product from "../../models/product.model";
import ProductImage from "../../models/productImage.model";
import ProductVariant from "../../models/productVariant.model";
import { Sequelize,Op, Transaction } from "sequelize";

class ProductRepository {
  createProductRepo = async (data: any, transaction: any) => {
    return await Product.create(data, { transaction });
  };
  
  createImagesRepo = async (images: any[], transaction: any) => {
    return await ProductImage.bulkCreate(images, { transaction });
  };
  
  createVariantsRepo = async (variants: any[], transaction: any) => {
    return await ProductVariant.bulkCreate(variants, { transaction });
  };
  findProductsAdvanced = async (filters: any,limit: number,offset: number,transaction:Transaction) => {
    const where: any = {};
    const order: any = [];
    if(filters.search) {
      where[Op.or] = [
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          {
            [Op.like]: `%${filters.search.toLowerCase()}%`,
          }
        ),
      ];
    }
    if(filters.minPrice || filters.maxPrice) {
      where.basePrice = {};
      if (filters.minPrice) where.basePrice[Op.gte] = filters.minPrice;
      if (filters.maxPrice) where.basePrice[Op.lte] = filters.maxPrice;
    }
    if(filters.sort === "price_asc") order.push(["basePrice", "ASC"]);
    else order.push(["createdAt", "DESC"]);
    return Product.findAndCountAll({
      where,
      order,
      limit,
      offset,
      distinct: true,
      transaction,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["imageKey", "isPrimary"],
        },
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["id","size", "stock", "price"],
        },
      ]
    });
  };
  getProductByPK = async (id:number,transaction:Transaction) => {
    const product = await Product.findByPk(id, {transaction,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["imageKey", "isPrimary"],
        },
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["id","size", "stock", "price"],
          where: {
            stock: { [Op.gt]: 0 },
          },
          required: true,
        },
      ],
    });
    return product;
  }
  getVariant = (productId: number,variant: string,transaction: Transaction) => {
    const productVariant= ProductVariant.findOne({
      where: { productId, size: variant },
      transaction,
      lock: true
    });
    return productVariant;
  };
  increaseStock = (productId: number,variant: string,qty: number,transaction: Transaction) => {
    return ProductVariant.increment("stock", {
      by: qty,
      where: { productId, size: variant },
      transaction
    });
  };
  decreaseStock = (productId: number,variant: string,qty: number,transaction: Transaction) => {
    return ProductVariant.decrement("stock", {
      by: qty,
      where: { productId, size: variant, stock: { [Op.gte]: qty }},  
      transaction
    });
  };
  createVariant = async (productId: number,variant: string,qty: number,transaction: Transaction) => {
    try {
      return await ProductVariant.create(
        { productId, size: variant, stock: qty },
        { transaction }
      );
    } 
    catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return ProductVariant.increment("stock", {
          by: qty,
          where: { productId, size: variant },
          transaction
        });
      }
      throw error;
    }
  };
  deleteVariant = (productId: number,variant: string,transaction: Transaction) => {
    return ProductVariant.destroy({
      where: {
        productId,
        size: variant
      },
      transaction
    });
  };
  deleteVariantsByProductId = (productId: number,transaction: Transaction) => {
    return ProductVariant.destroy({
      where: { productId },
      transaction
    });
  };
  deleteImagesByProductId = (productId: number,transaction: Transaction) => {
    return ProductImage.destroy({
      where: { productId },
      transaction
    });
  };
  deleteProductById = (productId: number,transaction: Transaction) => {
    return Product.destroy({
      where: { id: productId },
      transaction
    });
  };
}
export default new ProductRepository;