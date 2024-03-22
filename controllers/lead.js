const db = require("../models/db");
const { Op } = require('sequelize');

exports.getLeads = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const searchQuery = req.query.search || ''; 
    const offset = (page - 1) * pageSize;

    const leads = await db.lead.findAndCountAll({
      where: {
        companyId: companyId,
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } }, 
          { email: { [Op.like]: `%${searchQuery}%` } },
          // Add more fields for search if needed
        ],
      },
      offset: Number(offset),
      limit: Number(pageSize),
      order: [['createdAt', 'DESC']],
    });

    if (leads.rows.length > 0) {
      const response = {
        leads: leads.rows,
        totalCount: leads.count,
        totalPages: Math.ceil(leads.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No leads found for the specified company",
      leads: [],
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

exports.postLead = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const obj = req.body;

    // Validate the request data (you can add more validation as needed)
    let requiredFields = ['name', 'email', 'phone', 'billing_country','display_name'];
   
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
    }

    // Create the lead
    const newLead = await db.lead.create({...obj , companyId});
    return res.json({ lead: newLead, success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Lead with the same mobile or email already exists",
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

exports.deleteLead = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const leadId = req.params.id;

    // Check if the lead exists for the specified company
    const existingLead = await db.lead.findOne({
      where: { id: leadId, companyId: companyId },
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found for the specified company",
        success: false,
      });
    }

    // Delete the lead
    await existingLead.destroy();

    return res.json({ message: "Lead deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const leadId = req.params.id;
    const obj = req.body;

    // Check if the lead exists for the specified company
    const existingLead = await db.lead.findOne({
      where: { id: leadId, companyId: companyId },
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found for the specified company",
        success: false,
      });
    }

    // Update the lead
    await existingLead.update(obj);

    return res.json({ message: "Lead updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
