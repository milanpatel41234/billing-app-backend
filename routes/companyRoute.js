const {Router} = require('express');
const router = Router();
const companyController = require('../controllers/company');
const authentication = require("../middlewares/authentication");
const companyMulter = require("../middlewares/companyLogo");

router.get('/', authentication, companyController.getCompany);
router.post('/', authentication , companyMulter.fields([{name:'logo'},{name:'common_seal'},{name:'sign'}]), companyController.postCompany);
router.put('/', authentication , companyMulter.fields([{name:'logo'},{name:'common_seal'},{name:'sign'}]) , companyController.updateCompany);

module.exports = router;