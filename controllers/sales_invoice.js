const db = require("../models/db");
const { Op } = require('sequelize');

exports.getSalesInvoices = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const fy_id = req.header("fy_id");
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    } else if (!fy_id) {
      return res.status(400).json({
        message: "Please select financial year first",
        success: false,
      });
    }

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const searchQuery = req.query.search || ''; 
    const offset = (page - 1) * pageSize;

    const salesInvoices = await db.sales_inv.findAndCountAll({
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

    if (salesInvoices.rows.length > 0) {
      const response = {
        salesInvoices: salesInvoices.rows,
        totalCount: salesInvoices.count,
        totalPages: Math.ceil(salesInvoices.count / pageSize),
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

exports.postSalesInvoice = async (req, res) => {
  let transaction;
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
    } else if (!fy_id) {
      return res.status(400).json({
        message: "Please select financial year",
        success: false,
      });
    }

    if (obj.paid_amount == obj.balance) {
      obj.payment_status = 'Paid';
    } else if (obj.paid_amount > 0 && obj.paid_amount < obj.balance) {
      obj.payment_status = 'Partial';
    }

    // Start transaction
    transaction = await db.sequelize.transaction();

    // Update products and create the sales invoice within the transaction
    await Promise.all(obj.all_products.map(async (ele) => {
      const existingProduct = await db.product.findOne({
        where: { id: ele.product.id },
        transaction
      });
      const updatedOpeningQty = +existingProduct.opening_qty_per - +ele.quantity;
      await existingProduct.update({ opening_qty_per: updatedOpeningQty }, { transaction });
    }));

    // Create the sales invoice within the transaction
    const newSalesInvoice = await db.sales_inv.create({ ...obj, companyId, fy_id }, { transaction });

    // Commit the transaction
    await transaction.commit();

    return res.json({ salesInvoice: newSalesInvoice, success: true, message: 'Invoice created successfully' });
  } catch (error) {
    console.error(error);
    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();

    if (error.name === "SequelizeUniqueConstraintError") {
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


exports.deleteSalesInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const salesInvoiceId = req.params.id;

    // Check if the sales invoice exists for the specified company
    const existingSalesInvoice = await db.sales_inv.findOne({
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

exports.updateSalesInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const salesInvoiceId = req.params.id;
    const obj = req.body;

    // Check if the sales invoice exists for the specified company
    const existingSalesInvoice = await db.sales_inv.findOne({
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

    const salesInvoices = await db.sales_inv.findAll({
      where: {
        companyId: companyId,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
 if(salesInvoices[0]?.invoice){
  return res.json({
    invoice: salesInvoices[0].invoice + 1,
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

    const salesInvoice = await db.sales_inv.findOne({
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
exports.check_quantity = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const quantity = req.query.quantity;
    const id = req.query.prod_id;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const salesInvoice = await db.product.findOne({
      where: {
        companyId: companyId,
        id,
      }
    });
   
 if(!salesInvoice || +salesInvoice.opening_qty_per < +quantity){
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

