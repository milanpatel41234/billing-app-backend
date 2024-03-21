const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // The maximum time, in milliseconds, that the pool will try to get a connection before throwing an error
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
    },
  }
);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add associations to the models
db.user = require("./users")(sequelize, Sequelize);
db.company = require("./company")(sequelize, Sequelize);
db.brand = require("./brand")(sequelize, Sequelize);
db.category = require("./category")(sequelize);
db.tax = require("./tax")(sequelize);
db.product = require("./product")(sequelize);
db.contact = require("./contact")(sequelize);
db.lead = require("./lead")(sequelize);
db.bank = require("./bank")(sequelize);
db.sales_inv = require("./sales_inv")(sequelize);
db.purchase_inv = require("./purchase_inv")(sequelize);
db.quotation = require("./quotation")(sequelize);
db.payment = require("./payment")(sequelize);


module.exports = db;
