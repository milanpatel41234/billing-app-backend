const { Router } = require('express');
const router = Router();
const contactController = require('../controllers/contact');
const authentication = require("../middlewares/authentication");

router.get('/', authentication, contactController.getContacts);
router.post('/', authentication, contactController.postContact);
router.put('/:id', authentication, contactController.updateContact);
router.delete('/:id', authentication, contactController.deleteContact);

module.exports = router;
