const { Router } = require('express');
const router = Router();
const salesInvoiceController = require('../controllers/sales_invoice');
const authentication = require("../middlewares/authentication");

router.get('/', authentication, salesInvoiceController.getSalesInvoices);
router.post('/', authentication, salesInvoiceController.postSalesInvoice);
router.put('/:id', authentication, salesInvoiceController.updateSalesInvoice);
router.delete('/:id', authentication, salesInvoiceController.deleteSalesInvoice);

router.get('/get_inv', authentication, salesInvoiceController.get_inv_no);
router.get('/check_inv', authentication, salesInvoiceController.check_inv);
router.get('/check_quantity', authentication, salesInvoiceController.check_quantity);

module.exports = router;
