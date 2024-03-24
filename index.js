const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

 const db = require("./models/db");
 const userRouter = require("./routes/userRoute");
const companyRoute = require("./routes/companyRoute");
const brandRoute = require("./routes/brandRoute");
const categoryRoute = require("./routes/categoryRoute");
const taxRoute = require("./routes/taxRoute");
const productRoute = require('./routes/productRoute');
const contactRoute = require( './routes/contactRoute' );
const leadRoute = require( './routes/leadRoute' ) ; 
const bankRoute = require( './routes/bankRoute' ) ; 
const seles_invRoute = require('./routes/seles_invoice')
const purchase_invRoute = require('./routes/purchase_invoice')
const quotationRoute = require('./routes/quotation')
const noteRoute = require('./routes/noteRoute')
const paymentRoute = require('./routes/paymentRoute')
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
    
app.use("/welcome", (req, res)=>{return res.send('Welcome')});



// relations
db.company.hasMany(db.user);
db.user.belongsTo(db.company);
db.company.hasMany(db.brand);
db.brand.belongsTo(db.company);
db.company.hasMany(db.category);
db.category.belongsTo(db.company);
db.company.hasMany(db.tax);
db.tax.belongsTo(db.company);
db.company.hasMany(db.product);
db.product.belongsTo(db.company);
db.category.hasMany(db.product);
db.tax.hasMany(db.product);
db.brand.hasMany(db.product);
db.company.hasMany(db.contact);
db.company.hasMany(db.lead);
db.company.hasMany(db.bank);
db.company.hasMany(db.sales_inv);
db.company.hasMany(db.purchase_inv);
db.company.hasMany(db.quotation);
db.company.hasMany(db.payment);



 app.use("/user", userRouter);
// app.use("/company", companyRoute);
// app.use("/brand", brandRoute);
// app.use("/category", categoryRoute);
// app.use("/tax", taxRoute);
// app.use('/product', productRoute);
// app.use('/contact', contactRoute);
// app.use('/lead', leadRoute);
// app.use('/bank', bankRoute);
// app.use('/sales_inv', seles_invRoute);
// app.use('/purchase_inv', purchase_invRoute);
// app.use('/quotation', quotationRoute);
// app.use('/note', noteRoute);
// app.use('/payment', paymentRoute);

// const fs = require('fs');

// // Create a writable stream
// const logStream = fs.createWriteStream('errorLogs.txt', { flags: 'a' });

// // Function to handle uncaught exceptions
// process.on('uncaughtException', function(err) {
//     // Write the error to the log file
//     logStream.write(`Caught exception: ${err}\n`);
// });

// // Function to handle unhandled promise rejections
// process.on('unhandledRejection', function(reason, p) {
//     // Write the rejection reason to the log file
//     logStream.write(`Unhandled Rejection at: Promise ${p}, reason: ${reason}\n`);
// });

db.sequelize.sync();
app.listen(5000);
