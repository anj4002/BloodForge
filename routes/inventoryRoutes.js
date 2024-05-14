const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, 
    getInventoryController, 
    getDonorsController, 
    getHospitalController, 
    getOrganizationForHospitalController,
    getOrganizationController, 
    getInventoryHospitalController, 
    getRecentInventoryController } = require('../controller/inventoryController');

const router = express.Router()

//routes
//ADD INVENTORY ||Post
router.post('/create-inventory',authMiddleware,createInventoryController);

//GET ALL BLOOD RECORDS
router.get('/get-inventory',authMiddleware,getInventoryController);

//GET RECENT BLOOD RECORDS
router.get('/get-recent-inventory',authMiddleware,getRecentInventoryController);

//GET HOSPITAL BLOOD RECORDS
router.post('/get-inventory-hospital',authMiddleware,getInventoryHospitalController);

//GET DONOR RECORDS
router.get('/get-donors',authMiddleware, getDonorsController);

//GET HOSPITAL RECORDS
router.get('/get-hospitals',authMiddleware, getHospitalController);

//GET organization RECORDS
router.get("/get-organization", authMiddleware, getOrganizationController);

//GET ORGANIZATION RECORDS
router.get('/get-organization-for-hospital',authMiddleware, getOrganizationForHospitalController);



module.exports = router;