const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = db.user;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_KEY);
};

exports.login = async (req, res) => {
  const { email, password} = req.body;
  if (!email.includes('@') || password.length <8) {
    return res.status(200).json({
      message: "Please enter valid email address and password",
      login: false,
    });
  }
  try {
    const usr = await user.findOne({ where: { email } });
      
    if (usr) {
      const result = await bcrypt.compare(password, usr.password);
      if (result) {
        const token = generateToken(usr.id);

        res.json({ message: "Login successful", success: true, token });
      } else {
        res.status(200).json({ message: "Password incorrect", success: false });
      }
    } else {
      res
        .status(200)
        .json({ message: "This email doesn't exist", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Some error occurred. Please try again later.",
      login: false,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, name, mobile } = req.body;
    
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error hashing the password",
          success: false,
        });
      }

      try {
        const response = await user.create({
          name,
          email,
          mobile,
          password: hash,
        });

        const token = generateToken(response.id);

        return res.json({
          success: true,
          message: "User created successfully",
          login: true,
          token,
        });
      } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError"){
          return res.json({
            success: false,
            message: `This ${error.errors[0].path} is already registered , try with a different one`,
            login: false,
          });
        }
        return res.status(500).json({
          message: "Internal server error",
          error: error,
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

