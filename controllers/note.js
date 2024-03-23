const db = require("../models/db");
const { Op } = require('sequelize');

exports.getNotes = async (req, res) => {
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

    const notes = await db.note.findAndCountAll({
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

    if (notes.rows.length > 0) {
      const response = {
        notes: notes.rows,
        totalCount: notes.count,
        totalPages: Math.ceil(notes.count / pageSize),
        currentPage: page,
        pageSize: pageSize,
        success: true,
      };

      return res.json(response);
    }

    return res.json({
      message: "No notes found for the specified company",
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

exports.postNote = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const obj = req.body;
    const fy_id = req.header("fy_id");

    let requiredFields = ['name', 'srn', 'date'];
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
        message: "Please select financial year first",
        success: false,
      });
    }

    // Create the note
    const newNote = await db.note.create({...obj , companyId , fy_id});
    return res.json({ success: true ,message:'Note created successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violation (duplicate entry)
      return res.status(400).json({
        message: "Note with the same title already exists",
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

exports.deleteNote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const noteId = req.params.id;

    // Check if the note exists for the specified company
    const existingNote = await db.note.findOne({
      where: { id: noteId, companyId: companyId },
    });

    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found for the specified company",
        success: false,
      });
    }

    // Delete the note
    await existingNote.destroy();

    return res.json({ message: "Note deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const noteId = req.params.id;
    const obj = req.body;

    // Check if the note exists for the specified company
    const existingNote = await db.note.findOne({
      where: { id: noteId, companyId: companyId },
    });

    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found for the specified company",
        success: false,
      });
    }

    // Update the note
    await existingNote.update(obj);

    return res.json({ message: "Note updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.get_srn = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const notes = await db.note.findAll({
      where: {
        companyId: companyId,
      },
      limit: 1,
      order: [['createdAt', 'DESC']],
    });
    
    if (notes[0]?.srn) {
      return res.json({
        note: notes[0].srn + 1,
        success: true,
      });
    } else {
      return res.json({
        note: 1,
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

exports.check_srn = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const srn = req.query.srn;
    if (!companyId) {
      return res.status(400).json({
        message: "Company Details not added yet! Please add a company first",
        success: false,
      });
    }

    const note = await db.note.findOne({
      where: {
        companyId: companyId,
        note: srn
      }
    });

    if (note) {
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
      attributes: ['invoice'], 
      where: {
        companyId: companyId,
        fy_id,
      },
      order: [['createdAt', 'DESC']],
    });

    if (salesInvoices.length > 0) {
      const response = {
        salesInvoices: salesInvoices.map(row => row.invoice), // Extract 'invoice' column from each row
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
