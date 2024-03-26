const db = require("../models/db");
const fs = require("fs");
const path = require("path");

exports.getCompany = async (req, res) => {
  try {
    if(!req.user?.companyId) {
      return res.json({ message: "No Details added yet", success: false });
    }
    const company = await db.company.findOne({
      where: { id: req.user.companyId },
    });
    if (company) {
      let logoBase64 ;
      let commonSealBase64 ;
      let signBase64 ;
      if(company.logo){
        const logoPath = path.join(__dirname, "../", company.logo);
        const logoData = fs.readFileSync(logoPath);
        logoBase64 = Buffer.from(logoData).toString("base64");
      }
      if(company.sign){
        const signPath = path.join(__dirname, "../", company.sign);
        const signData = fs.readFileSync(signPath);
        signBase64 = Buffer.from(signData).toString("base64");
      }
      if(company.common_seal){
        const commonSealPath = path.join(__dirname, "../", company.common_seal);
      const commonSealData = fs.readFileSync(commonSealPath);
      commonSealBase64 = Buffer.from(commonSealData).toString("base64");
      }
     
      const response = {
        ...company.dataValues,
        logo: logoBase64 ? `data:image/png;base64,${logoBase64}` : null,
        common_seal: commonSealBase64 ? `data:image/png;base64,${commonSealBase64}` : null,
        sign: signBase64 ? `data:image/png;base64,${signBase64}` : null,
        success: true,
      };
      return res.json(response);
    }
    res.json({ message: "No Details added yet", success: false });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const data = req.body.companyDetails;
    let obj = JSON.parse(data);
    obj.ip = req.ip;
    const images = req.files;
    if(images.logo){
      obj.logo = images.logo[0].path;
    }
     if(images.sign){
      obj.sign = images?.sign[0].path;
    }
     if(images.common_seal){
      obj.common_seal = images.sign[0].path;
    }
    
    const companyId = req.user.companyId;
    const existingCompany = await db.company.findOne({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }

    // Update only the fields that are present
    const result = await existingCompany.update(obj);

    return res.json({
      message: "Company details updated successfully",
      success: true,
    });
  } catch (error) {
   
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

exports.postCompany = async (req, res) => {
  try {
    const images = req.files;
    const data = req.body.companyDetails;
    let obj = JSON.parse(data);
    obj.ip = req.ip;
   
    if(images.logo){
      obj.logo = images.logo[0].path;
    }
     if(images.sign){
      obj.sign = images?.sign[0].path;
    }
     if(images.common_seal){
      obj.common_seal = images.sign[0].path;
    }
    
    const response = await req.user.createCompany(obj);
   
    return res.json({
      success: true,
      message: "Data saved successfully",
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // console.log('sssss',error.errors[0].path)
      return res.status(400).json({
        message:`This ${error.errors[0].path} already present , Try with different one`,
        error: error,
      });
    }
   
    return res.status(500).json({
      message: "Internal server errorr",
      error: error,
    });
  }
};
