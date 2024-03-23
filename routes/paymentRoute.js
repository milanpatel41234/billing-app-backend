const { Router } = require('express');
const router = Router();
const paymentController = require('../controllers/payment'); // Assuming you have a payment controller
const authentication = require("../middlewares/authentication");

// Define routes for handling payments
router.get('/', authentication, paymentController.getPayments);
router.post('/', authentication, paymentController.createPayment);
router.put('/:id', authentication, paymentController.updatePayment);
router.delete('/:id', authentication, paymentController.deletePayment);

router.get('/get_inv', authentication, paymentController.getSalesInvoices);

module.exports = router;
