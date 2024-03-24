const bcrypt = require('bcrypt');


exports.getUserProfile = async (req, res) => {
  try {
    return res.json({
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, name, mobile } = req.body;

    const response = await req.user.update({
      name,
      email,
      mobile,
    });
    return res.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required for an update.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update only the password field in the database
     const response = await req.user.update({
      password: hashedPassword,
    });

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};




