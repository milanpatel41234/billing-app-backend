const {Router} = require('express');
const router = Router();
const brandController = require('../controllers/brand');
const authentication = require("../middlewares/authentication");

router.get('/', authentication, brandController.getBrands);
router.post('/', authentication , brandController.postBrand);
router.put('/:id', authentication , brandController.updateBrand);
router.delete('/:id', authentication , brandController.deleteBrand);

module.exports = router;
