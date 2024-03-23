const { Router } = require('express');
const router = Router();
const leadController = require('../controllers/lead');
const authentication = require('../middlewares/authentication');

router.get('/', authentication, leadController.getLeads);
router.post('/', authentication, leadController.postLead);
router.put('/:id', authentication, leadController.updateLead);
router.delete('/:id', authentication, leadController.deleteLead);

module.exports = router;
