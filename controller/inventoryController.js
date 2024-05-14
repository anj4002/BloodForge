const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//Create inventory
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    req.body.donorEmail = req.body.email;
    //validation
    console.log("email", email);
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if(inventoryType === "in" && user.role !== "donor") {
    //    throw new Error("Not a donor");
    // }
    // if(inventoryType === "out" && user.role !== "hospital") {
    //    throw new Error('Not a hospital');
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);
      //calculate blood quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      console.log("Total In", totalInOfRequestedBlood);
      //   calculate out blood quantity
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in and out calculation
      const availableQuantityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup} (ML) of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }

    //save record
    // console.log('inventory', req.body);
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error: error.message,
    });
  }
};

//Get all blood records
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organization: req.body.userId
      })
      .populate("donor")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error: error.message,
    });
  }
};

//Get all hospital records
const getInventoryHospitalController = async (req, res) => {
  try {
    console.log("New ", req.body.filters);
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donor")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get Consumer Inventory",
      error: error.message,
    });
  }
};

//GET BLOOD RECORDS OF 3
const getRecentInventoryController = async (req,res)=>{
try {
  const inventory = await inventoryModel.find({
    organization:req.body.userId
  }).limit(3).sort({createdAt: -1})
  return res.status(200).send({
    success:true,
    message:'Recent Inventory data',
    inventory,
  })

} catch (error) {
  console.log(error)
  return res.status(500).send({
     success: false,
     message:'Error in Recent Inventory API',
     error,
  });
}
}

//GET DONOR RECORDS
const getDonorsController = async (req, res) => {
  try {
    const organization = req.body.userId;
    //find donors
    const donorId = await inventoryModel.distinct("donor", {
      organization,
    });
    //  console.log(donorId);

    const donors = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donor Record Fetched Successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donor records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {

  try {
    const organization = req.body.userId;
    console.log(organization);

    //GET HOSPITAL ID
    // const hospitalId = await inventoryModel.distinct("hospital", {
    //   organization,
    // });
    //FIND HOSPITAL
    const hospitals = await userModel.find({
      _id: { $in: organization },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Record Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get Hospital API",
      error,
    });
  }
};

// GET ORG PROFILES
const getOrganizationController = async (req, res) => {
  try {
    const donor = req.body.userId;
    const orgId = await inventoryModel.distinct("organization", { donor });
    //find org
    const organizations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
      error,
    });
  }
};

//Get org for hospital
const getOrganizationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organization", { hospital });
    //find org
    console.log("hello", orgId, hospital);
    const organizations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Organization Record Fetched Successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get Hospital Organization API",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getOrganizationController,
  getRecentInventoryController,
};
