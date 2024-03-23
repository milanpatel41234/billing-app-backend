const { Router } = require('express');
const router = Router();
const InvoiceController = require('../controllers/purchase_invoice');
const authentication = require("../middlewares/authentication");

router.get('/', authentication, InvoiceController.getPurchaseInvoices);
router.post('/', authentication, InvoiceController.postPurchaseInvoice);
router.put('/:id', authentication, InvoiceController.updatePurchaseInvoice);
router.delete('/:id', authentication, InvoiceController.deletePurchaseInvoice);

router.get('/get_inv', authentication, InvoiceController.get_inv_no);
router.get('/check_inv', authentication, InvoiceController.check_inv);

module.exports = router;
