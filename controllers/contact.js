const db = require("../models/db");
const { Op } = require('sequelize');

exports.getContacts = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 1000;
    const searchQuery = req.query.search || ''; 
    const offset = (page - 1) * pageSize;

    const contacts = await db.contact.findAndCountAll({
      where: {
        companyId: companyId,
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } }, 
          { email: { [Op.like]: `%${searchQuery}%` } },
         
        ],
      },
      offset: Number(offset),
      limit: Number(pageSize),
      order: [['createdAt', 'DESC']],
    });

    if (contacts.rows.length > 0) {
      const response = {
        contacts: contacts.rows,
        totalCount: contacts.count,
        totalPages: Math.ceil(contacts.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No contacts found for the specified company",
      contacts: [],
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


exports.postContact = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const obj = req.body;

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

    // Create the contact
    const newContact = await db.contact.create({...obj , companyId});
    return res.json({ contact: newContact, success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation (duplicate entry)
      return res.status(400).json({
        message: "Contact with the same phone or email already exists",
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

exports.deleteContact = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const contactId = req.params.id;

    // Check if the contact exists for the specified company
    const existingContact = await db.contact.findOne({
      where: { id: contactId, companyId: companyId },
    });

    if (!existingContact) {
      return res.status(404).json({
        message: "Contact not found for the specified company",
        success: false,
      });
    }

    // Delete the contact
    await existingContact.destroy();

    return res.json({ message: "Contact deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const contactId = req.params.id;
    const obj = req.body;

    // Check if the contact exists for the specified company
    const existingContact = await db.contact.findOne({
      where: { id: contactId, companyId: companyId },
    });

    if (!existingContact) {
      return res.status(404).json({
        message: "Contact not found for the specified company",
        success: false,
      });
    }

    // Update the contact
    await existingContact.update(obj);

    return res.json({ message: "Contact updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
