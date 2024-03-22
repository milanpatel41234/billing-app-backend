const db = require("../models/db");

exports.getBanks = async (req, res) => {
    const companyId = req.user?.companyId;
  try {
    const banks = await db.bank.findAndCountAll({
        where: {companyId},
      order: [['createdAt', 'DESC']],
    });

    if (banks.rows.length > 0) {
      const response = {
        banks: banks.rows,
        success: true,
      };
      return res.json(response);
    }

    return res.json({
      message: "No banks found",
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

exports.postBank = async (req, res) => {
  try {
    const { name, ifsc, branch, account_no, active, discription } = req.body;
    const companyId = req.user?.companyId;

    // Validate the request data
    if (!name || !ifsc || !branch || !account_no) {
      return res.status(400).json({
        message: "All fields (name, ifsc, branch, account_no) are required",
        success: false,
      });
    } else if (!companyId) {
        return res.status(400).json({
          message: "Company Details not added yet! Please add a company first",
          success: false,
        });
      }

    // Create the bank
    const newBank = await db.bank.create({
      name,
      ifsc,
      branch,
      account_no,
      active,
      discription,
      companyId,
    });

    return res.json({ bank: newBank, success: true });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
        let errorMessage = "Bank with the same ";
        if (error.fields.name) {
          errorMessage += "name";
        } else if (error.fields.ifsc) {
          errorMessage += "IFSC";
        } else if (error.fields.account_no) {
          errorMessage += "account number";
        }
        errorMessage += " already exists";
        
        return res.status(400).json({
          message: errorMessage,
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

exports.deleteBank = async (req, res) => {
  try {
    const bankId = req.params.id;

    // Check if the bank exists
    const existingBank = await db.bank.findByPk(bankId);
    if (!existingBank) {
      return res.status(404).json({
        message: "Bank not found",
        success: false,
      });
    }

    // Delete the bank
    await existingBank.destroy();

    return res.json({ message: "Bank deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateBank = async (req, res) => {
  try {
    const bankId = req.params.id;
    const { name, ifsc, branch, account_no, active, discription } = req.body;

    // Check if the bank exists
    const existingBank = await db.bank.findByPk(bankId);
    if (!existingBank) {
      return res.status(404).json({
        message: "Bank not found",
        success: false,
      });
    }

    // Update the bank
    await existingBank.update({
      name,
      ifsc,
      branch,
      account_no,
      active,
      discription,
    });

    return res.json({ message: "Bank updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
