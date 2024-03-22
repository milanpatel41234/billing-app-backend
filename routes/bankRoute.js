const { Router } = require('express');
const router = Router();
const bankController = require('../controllers/bank');
const authentication = require("../middlewares/authentication");

router.get('/', authentication, bankController.getBanks);
router.post('/', authentication, bankController.postBank);
router.put('/:id', authentication, bankController.updateBank);
router.delete('/:id', authentication, bankController.deleteBank);

module.exports = router;
