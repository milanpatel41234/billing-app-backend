const { Router } = require('express');
const router = Router();
const quotationController = require('../controllers/quotation');
const authentication = require("../middlewares/authentication");

router.get('/', authentication, quotationController.getQuotations);
router.post('/', authentication, quotationController.createQuotation);
router.put('/:id', authentication, quotationController.updateQuotation);
router.delete('/:id', authentication, quotationController.deleteQuotation);

router.get('/get_quot', authentication, quotationController.getQuotationNo);
router.get('/check_quot', authentication, quotationController.checkQuotationNo);

module.exports = router;
