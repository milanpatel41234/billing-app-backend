const db = require("../models/db");
const { Op } = require('sequelize');

exports.getPurchaseInvoices = async (req, res) => {
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

    const purchaseInvoices = await db.purchase_inv.findAndCountAll({
      where: {
        companyId: companyId,
        [Op.or]: [
          { name: { [Op.like]: `%${searchQuery}%` } },
          // Add more search criteria if needed
        ],
      },
      offset: Number(offset),
      limit: Number(pageSize),
      order: [['createdAt', 'DESC']],
    });

    if (purchaseInvoices.rows.length > 0) {
      const response = {
        purchaseInvoices: purchaseInvoices.rows,
        totalCount: purchaseInvoices.count,
        totalPages: Math.ceil(purchaseInvoices.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No sales invoices found for the specified company",
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

exports.postPurchaseInvoice = async (req, res) => {
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

    if(obj.paid_amount == obj.balance){
      obj.payment_status = 'Paid';
    }else if(obj.paid_amount > 0 && obj.paid_amount < obj.balance){
      obj.payment_status = 'Partial';
    }
    // Create the sales invoice
    const newSalesInvoice = await db.purchase_inv.create({...obj , companyId , fy_id});
    return res.json({ salesInvoice: newSalesInvoice, success: true ,message:'Invoice created successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation (duplicate entry)
      return res.status(400).json({
        message: "invoice with the same invoice no. already exists",
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

exports.deletePurchaseInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const salesInvoiceId = req.params.id;

    // Check if the sales invoice exists for the specified company
    const existingSalesInvoice = await db.purchase_inv.findOne({
      where: { id: salesInvoiceId, companyId: companyId },
    });

    if (!existingSalesInvoice) {
      return res.status(404).json({
        message: "Sales invoice not found for the specified company",
        success: false,
      });
    }

    // Delete the sales invoice
    await existingSalesInvoice.destroy();

    return res.json({ message: "Sales invoice deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updatePurchaseInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const salesInvoiceId = req.params.id;
    const obj = req.body;

    // Check if the sales invoice exists for the specified company
    const existingSalesInvoice = await db.purchase_inv.findOne({
      where: { id: salesInvoiceId, companyId: companyId },
    });

    if (!existingSalesInvoice) {
      return res.status(404).json({
        message: "Sales invoice not found for the specified company",
        success: false,
      });
    }

    // Update the sales invoice
    await existingSalesInvoice.update(obj);

    return res.json({ message: "Sales invoice updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// for invoice no.

exports.get_inv_no = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const purchaseInvoices = await db.purchase_inv.findAll({
      where: {
        companyId: companyId,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
 if(purchaseInvoices[0]?.invoice){
  return res.json({
    invoice: purchaseInvoices[0].invoice + 1,
    success: true,
  });
 }else {
  return res.json({
    invoice: 1,
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
exports.check_inv = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const invoice = req.query.inv
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const salesInvoice = await db.purchase_inv.findOne({
      where: {
        companyId: companyId,
        invoice
      }
    });
 if(salesInvoice){
  return res.json({
    success: false,
  });
 }else {
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

