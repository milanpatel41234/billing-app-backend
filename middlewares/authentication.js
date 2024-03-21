const jwt = require("jsonwebtoken");
const db = require("../models/db");

module.exports = async (req, res, next) => {
  try {
      const token = req.header("token");
      if (!token)
      return res.json({
    message: "user is not authorized",
});
const { userId } = jwt.verify(token, process.env.JWT_KEY);

const user = await db.user.findByPk(userId);

    req.user = user;
    next();
  } catch (error) {
    console.log('error', error)
    res.status(405).send({ success: false });
  }
};
