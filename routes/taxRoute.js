const { Router } = require('express');
const router = Router();
const tax = require('../controllers/tax');
const authentication = require('../middlewares/authentication');

router.get('/', authentication, tax.getTaxes);
router.post('/', authentication, tax.postTax);
router.put('/:id', authentication, tax.updateTax);
router.delete('/:id', authentication, tax.deleteTax);

module.exports = router;
