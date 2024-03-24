const db = require("../models/db");

exports.getTaxes = async (req, res) => {
  try {
    const companyId = req.user?.companyId ;
   
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! , Please add a company first",
        success: false,
      });
    }

    const taxes = await db.tax.findAndCountAll({
      where: { companyId: companyId },
      order: [['createdAt', 'DESC']],
    });

    if (taxes.rows.length > 0) {
      const response = {
        taxes: taxes.rows,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No taxes found for the specified company",
      taxes: [],
      success: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Include error message in the response
    });
  }
};

exports.postTax = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { name, rate, description } = req.body;

    // Validate the request data (you can add more validation as needed)
    if (!name || rate === undefined) {
      return res
        .status(400)
        .json({ message: "Name and Rate are required", success: false });
    } else if (!companyId) {
        return res.status(400).json({
          message: "Company Details not added yet! , Please add a company first",
          success: false,
        });
      }
    // Create the tax
    const newTax = await db.tax.create({
      name,
      rate,
      description,
      companyId,
    });

    return res.json({ tax: newTax, success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation (duplicate entry)
      return res.status(400).json({
        message: "Tax with the same name already exists",
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Include error message in the response
    });
  }
};

exports.deleteTax = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const taxId = req.params.id;
    // Check if the tax exists for the specified company
    const existingTax = await db.tax.findOne({
      where: { name: taxId, companyId: companyId },
    });

    if (!existingTax) {
      return res
        .status(404)
        .json({
          message: "Tax not found for the specified company",
          success: false,
        });
    }

    // Delete the tax
    await existingTax.destroy();

    return res.json({ message: "Tax deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Include error message in the response
    });
  }
};

exports.updateTax = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const taxId = req.params.id;
    const { name, rate, description } = req.body;

    // Check if the tax exists for the specified company
    const existingTax = await db.tax.findOne({
      where: { name: taxId, companyId: companyId },
    });

    if (!existingTax) {
      return res
        .status(404)
        .json({
          message: "Tax not found for the specified company",
          success: false,
        });
    }
    if(taxId !== name){
      console.log('ttttttttttttttttttttttt', taxId , companyId , req.body)
      await db.tax.create({
       name,
       rate,
       description,
       companyId,
     });
      await db.tax.destroy({
       where: { name: taxId, companyId },
     });
     return res.json({
       message: "tax updated successfully",
       success: true,
     });
   }

    // Update the tax
    await existingTax.update({
      name: name,
      rate: rate,
      description: description,
    });

    return res.json({ message: "Tax updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message, // Include error message in the response
    });
  }
};
