const { Router } = require('express');
const router = Router();
const categoryController = require('../controllers/category');
const authentication = require('../middlewares/authentication');

router.get('/', authentication, categoryController.getCategories);
router.post('/', authentication, categoryController.postCategory);
router.put('/:id', authentication, categoryController.updateCategory);
router.delete('/:id', authentication, categoryController.deleteCategory);

module.exports = router;
