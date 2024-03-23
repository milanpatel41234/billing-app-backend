const db = require("../models/db");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! , Please add a company first",
        success: false,
      });
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 1000;
    const searchQuery = req.query.search || "";
    const offset = (page - 1) * pageSize;

    const products = await db.product.findAndCountAll({
      where: {
        companyId: companyId,
        [Op.or]: [{ name: { [Op.like]: `%${searchQuery}%` } }],
      },
      offset: Number(offset),
      limit: Number(pageSize),
      order: [["createdAt", "DESC"]],
    });

    if (products.rows.length > 0) {
      const response = {
        products: products.rows,
        totalCount: products.count,
        totalPages: Math.ceil(products.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No products found for the specified company",
      success: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.postProduct = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const {
      name,
      varient,
      categoryName,
      brandName,
      type,
      hsn_code,
      taxName,
      mrp_price,
      s_price,
      p_price,
      UOM,
      opening_qty_per,
      description,
    } = req.body;

    // Validate the request data (you can add more validation as needed)
    let requiredFields = ["name", "opening_qty_per" ,'s_price','p_price'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `The following fields are required: ${missingFields.join(
          ", "
        )}`,
        success: false,
      });
    } else if (!companyId) {
      return res.status(400).json({
        message:
          "Company Details not added yet! , Please add company details first",
        success: false,
      });
    }

    // Create the product
    const newProduct = await db.product.create({
      name,
      varient,
      categoryName,
      brandName,
      type,
      hsn_code,
      taxName,
      mrp_price,
      s_price,
      p_price,
      UOM,
      opening_qty_per,
      description,
      companyId,
    });

    return res.json({ product: newProduct, success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Product with the same name already exists",
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const productId = req.params.id;

    // Check if the product exists for the specified company
    const existingProduct = await db.product.findOne({
      where: { id: productId, companyId: companyId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found for the specified company",
        success: false,
      });
    }

    // Delete the product
    await existingProduct.destroy();

    return res.json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const productId = req.params.id;
    const {
      name,
      varient,
      categoryName,
      brandName,
      type,
      hsn_code,
      taxName,
      mrp_price,
      s_price,
      p_price,
      UOM,
      opening_qty_per,
      description,
    } = req.body;

    // Check if the product exists for the specified company
    const existingProduct = await db.product.findOne({
      where: { id: productId, companyId: companyId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found for the specified company",
        success: false,
      });
    }

    // if (productId !== name) {
    //   await db.product.create({
    //     name,
    //     varient,
    //     categoryName,
    //     brandName,
    //     type,
    //     hsn_code,
    //     taxName,
    //     mrp_price,
    //     s_price,
    //     p_price,
    //     UOM,
    //     opening_qty_per,
    //     description,
    //     companyId,
    //   });
    //   await db.product.destroy({
    //     where: { id: productId, companyId },
    //   });
    //   return res.json({
    //     message: "Product updated successfully",
    //     success: true,
    //   });
    // }

    // Update the product
    await existingProduct.update({
      name,
      varient,
      categoryName,
      brandName,
      type,
      hsn_code,
      taxName,
      mrp_price,
      s_price,
      p_price,
      UOM,
      opening_qty_per,
      description,
    });
    return res.json({
      message: "Product updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
