const db = require("../models/db");

exports.getCategories = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! , Please add a company first",
        success: false,
      });
    }

    const categories = await db.category.findAndCountAll({
      where: { companyId: companyId },
      order: [['createdAt', 'DESC']],
    });

    if (categories.rows.length > 0) {
      const response = {
        categories: categories.rows,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No categories found for the specified company",
      categories: [],
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

exports.postCategory = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { name, active, description } = req.body;

    // Validate the request data (you can add more validation as needed)
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
        success: false,
      });
    } else if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! , Please add company details first",
        success: false,
      });
    }

    // Create the category
    const newCategory = await db.category.create({
      name,
      active,
      description,
      companyId,
    });

    return res.json({ category: newCategory, success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Category with the same name already exists",
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

exports.deleteCategory = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const categoryId = req.params.id;

    // Check if the category exists for the specified company
    const existingCategory = await db.category.findOne({
      where: { name: categoryId, companyId: companyId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found for the specified company",
        success: false,
      });
    }

    // Delete the category
    await existingCategory.destroy();

    return res.json({
      message: "Category deleted successfully",
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

exports.updateCategory = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const categoryId = req.params.id;
    const { name, active, description } = req.body;

    // Check if the category exists for the specified company
    const existingCategory = await db.category.findOne({
      where: { name: categoryId, companyId: companyId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found for the specified company",
        success: false,
      });
    }

    if(categoryId !== name){
       await db.category.create({
        name,
        active,
        description,
        companyId,
      });
       await db.category.destroy({
        where: { name: categoryId, companyId },
      });
      return res.json({
        message: "Category updated successfully",
        success: true,
      });
    }

    // Update the category
   await existingCategory.update({
      name: name,
      active: active,
      description: description,
    });
    return res.json({
      message: "Category updated successfully",
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
