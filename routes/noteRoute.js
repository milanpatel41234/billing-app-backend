const { Router } = require('express');
const router = Router();
const noteController = require('../controllers/note'); // Assuming you have a note controller
const authentication = require("../middlewares/authentication");

router.get('/', authentication, noteController.getNotes);
router.post('/', authentication, noteController.postNote);
router.put('/:id', authentication, noteController.updateNote);
router.delete('/:id', authentication, noteController.deleteNote);

router.get('/get_srn', authentication, noteController.get_srn);
router.get('/check_srn', authentication, noteController.check_srn);
router.get('/get_inv', authentication, noteController.getSalesInvoices);

module.exports = router;
