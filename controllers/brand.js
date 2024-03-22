const db = require("../models/db");

exports.getBrands = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! , Please add a company first",
        success: false,
      });
    }

    const brands = await db.brand.findAndCountAll({
      where: { companyId: companyId },
      order: [['createdAt', 'DESC']],
    });

    if (brands.rows.length > 0) {
      const response = {
        brands: brands.rows,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No brands found for the specified company",
      brands: [],
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

exports.postBrand = async (req, res) => {
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
        message: "Company Details not added yet! , Please add a company first",
        success: false,
      });
    }

    // Create the brand
    const newBrand = await db.brand.create({
      name,
      active,
      description,
      companyId,
    });

    return res.json({ brand: newBrand, success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation (duplicate entry)
      return res.status(400).json({
        message: "Brand with the same name already exists",
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

exports.deleteBrand = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const brandId = req.params.id;

    // Check if the brand exists for the specified company
    const existingBrand = await db.brand.findOne({
      where: { name: brandId, companyId: companyId },
    });

    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found for the specified company",
        success: false,
      });
    }

    // Delete the brand
    await existingBrand.destroy();

    return res.json({ message: "Brand deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const brandId = req.params.id;
    const { name, active, description } = req.body;

    // Check if the brand exists for the specified company
    const existingBrand = await db.brand.findOne({
      where: { name: brandId, companyId: companyId },
    });

    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found for the specified company",
        success: false,
      });
    }
    if(brandId !== name){
      await db.brand.create({
       name,
       active,
       description,
       companyId,
     });
      await db.brand.destroy({
       where: { name: brandId, companyId },
     });
     return res.json({
       message: "brand updated successfully",
       success: true,
     });
   }

    // Update the brand
    await existingBrand.update({
      name: name,
      active: active,
      description: description,
    });

    return res.json({ message: "Brand updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
