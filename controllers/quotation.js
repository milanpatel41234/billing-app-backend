const db = require("../models/db");
const { Op } = require('sequelize');

exports.getQuotations = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const fy_id = req.header("fy_id");
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }else if (!fy_id) {
      return res.status(400).json({
        message: "Please select financial year first",
        success: false,
      });
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const searchQuery = req.query.search || ''; 
    const offset = (page - 1) * pageSize;

    const quotations = await db.quotation.findAndCountAll({
      where: {
        companyId: companyId,
        fy_id,
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } },
          // Add more search criteria if needed
        ],
      },
      offset: Number(offset),
      limit: Number(pageSize),
      order: [['createdAt', 'DESC']],
    });

    if (quotations.rows.length > 0) {
      const response = {
        quotations: quotations.rows,
        totalCount: quotations.count,
        totalPages: Math.ceil(quotations.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No quotations found for the specified company",
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

exports.createQuotation = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const obj = req.body;
    const fy_id = req.header("fy_id");

    let requiredFields = ['name', 'amount', 'date'];
    const missingFields = requiredFields.filter(field => !obj[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `The following fields are required: ${missingFields.join(', ')}`,
        success: false,
      });
    } else if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }else if (!fy_id) {
      return res.status(400).json({
        message: "Please select financial year first",
        success: false,
      });
    }

    // Create the quotation
    const newQuotation = await db.quotation.create({...obj , companyId, fy_id});
    return res.json({ success: true ,message:'Quotation created successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation (duplicate entry)
      return res.status(400).json({
        message: "Quotation with the same quote no. already exists",
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

exports.deleteQuotation = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const quotationId = req.params.id;

    // Check if the quotation exists for the specified company
    const existingQuotation = await db.quotation.findOne({
      where: { id: quotationId, companyId: companyId },
    });

    if (!existingQuotation) {
      return res.status(404).json({
        message: "Quotation not found for the specified company",
        success: false,
      });
    }

    // Delete the quotation
    await existingQuotation.destroy();

    return res.json({ message: "Quotation deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const quotationId = req.params.id;
    const obj = req.body;

    // Check if the quotation exists for the specified company
    const existingQuotation = await db.quotation.findOne({
      where: { id: quotationId, companyId: companyId },
    });

    if (!existingQuotation) {
      return res.status(404).json({
        message: "Quotation not found for the specified company",
        success: false,
      });
    }

    // Update the quotation
    await existingQuotation.update(obj);

    return res.json({ message: "Quotation updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.getQuotationNo = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const quotations = await db.quotation.findAll({
      where: {
        companyId: companyId,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
    
    if (quotations[0]?.quotation) {
      return res.json({
        quotation: quotations[0].quotation + 1,
        success: true,
      });
    } else {
      return res.json({
        quotation: 1,
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.checkQuotationNo = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const quote = req.query.quotation;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const quotation = await db.quotation.findOne({
      where: {
        companyId: companyId,
        quotation: quote
      }
    });

    if (quotation) {
      return res.json({
        success: false,
      });
    } else {
      return res.json({
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
