const db = require("../models/db");
const { Op } = require("sequelize");

exports.getPayments = async (req, res) => {
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
    const searchQuery = req.query.search || "";
    const offset = (page - 1) * pageSize;

    const payments = await db.payment.findAndCountAll({
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
      order: [["createdAt", "DESC"]],
    });

    if (payments.rows.length > 0) {
      const response = {
        payments: payments.rows,
        totalCount: payments.count,
        totalPages: Math.ceil(payments.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No payments found for the specified company",
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

exports.createPayment = async (req, res) => {
  let transaction ;
  try {
  
    const companyId = req.user?.companyId;
    const obj = req.body;
    const fy_id = req.header("fy_id");
    
    let requiredFields = ["name", "paid_amount", "date"];
    const missingFields = requiredFields.filter((field) => !obj[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `The following fields are required: ${missingFields.join(
          ", "
        )}`,
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
   
    // Create the payment
   transaction = await db.sequelize.transaction();

    const existingSalesInvoice = await db.sales_inv.findOne({
      where: { invoice: obj.invoice_no, companyId: companyId },
      transaction,
    });
   const payment_status = +obj.invoice_amount === +obj.paid_amount ? 'paid' : 'partial' ;
   const balance =  +obj.invoice_amount - +obj.paid_amount ;
   const paid_amount = +existingSalesInvoice.paid_amount + +obj.paid_amount
    const updateObj = {paid_date:obj.date, payment_status , balance , paid_amount }

    await existingSalesInvoice.update(updateObj, { transaction });
    const newPayment = await db.payment.create({ ...obj, companyId, fy_id }, { transaction });

    await transaction.commit();
   
    return res.json({ success: true, message: "Payment done successfully" });
  } catch (error) {
    console.error(error);
    if (transaction) await transaction.rollback();
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const paymentId = req.params.id;

    // Check if the payment exists for the specified company
    const existingPayment = await db.payment.findOne({
      where: { id: paymentId, companyId: companyId },
    });

    if (!existingPayment) {
      return res.status(404).json({
        message: "Payment not found for the specified company",
        success: false,
      });
    }

    // Delete the payment
    await existingPayment.destroy();

    return res.json({ message: "Payment deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const paymentId = req.params.id;
    const obj = req.body;

    // Check if the payment exists for the specified company
    const existingPayment = await db.payment.findOne({
      where: { id: paymentId, companyId: companyId },
    });

    if (!existingPayment) {
      return res.status(404).json({
        message: "Payment not found for the specified company",
        success: false,
      });
    }

    // Update the payment
    await existingPayment.update(obj);

    return res.json({ message: "Payment updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.getSalesInvoices = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const fy_id = req.header("fy_id");

    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const salesInvoices = await db.sales_inv.findAll({
      attributes: ['invoice','name','balance'],
      where: {
        companyId: companyId,
        fy_id,
        balance: {
          [Op.gt]: 0
        }
      },
      order: [['createdAt', 'DESC']],
    });

    if (salesInvoices.length > 0) {
      const response = {
        salesInvoices: salesInvoices,
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


exports.checkPaymentExistence = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const paymentId = req.params.id;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }
    const payment = await db.payment.findOne({
      where: {
        companyId: companyId,
        id: paymentId,
      },
    });

    if (payment) {
      return res.json({
        exists: true,
        success: true,
      });
    } else {
      return res.json({
        exists: false,
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
