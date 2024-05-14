const express= require("express");
const  testController  = require("../controller/testController");

//router object
const router= express.Router();

//routes
router.get("/",testController);

//EXPORT
module.exports = router;
