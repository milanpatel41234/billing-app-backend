const { Router } = require('express');
const router = Router();
const productController = require('../controllers/productController');
const authentication = require('../middlewares/authentication');

router.post('/', authentication, productController.postProduct);
router.get('/', authentication, productController.getProducts);
router.put('/:id', authentication, productController.updateProduct);
router.delete('/:id', authentication, productController.deleteProduct);

module.exports = router;
