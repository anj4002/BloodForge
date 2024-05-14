const userModel = require("../models/userModel");

//GET DONOR LIST
const getDonorsListController = async(req,res)=>{
    try {
        const donorData = await userModel
        .find({role:'donor'})
        .sort({createdAt:-1 });

        return res.status(200).send({
            success:true,
            TotalCount:donorData.length,
            message:'Donor List Fetched Successfully',
            donorData,
        });
    } catch (error) {
       console.log(error) 
       return res.status(500).send({
        success:false,
        message:'Error in Donor List API',
        error:error.message,
       });
    }
};


//GET HOSPITAL LIST
const getHospitalListController = async(req,res)=>{
    try {
        const hospitalData = await userModel
        .find({role:'hospital'})
        .sort({createdAt:-1 });

        return res.status(200).send({
            success:true,
            TotalCount:hospitalData.length,
            message:'Hospital List Fetched Successfully',
            hospitalData,
        });
    } catch (error) {
       console.log(error) 
       return res.status(500).send({
        success:false,
        message:'Error in Hospital List API',
        error:error.message,
       });
    }
};

//GET ORG LIST
const getOrgListController = async (req, res) => {
    try {
      const orgData = await userModel
        .find({ role: "organization" })
        .sort({ createdAt: -1 });
  
      return res.status(200).send({
        success: true,
        Totalcount: orgData.length,
        message: "ORG List Fetched Successfully",
        orgData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In ORG List API",
        error,
      });
    }
  };
//   ================================

//DELETE DONOR
const deleteDonorController = async (req,res)=>{
try {
    await userModel.findByIdAndDelete(req.params.id)
    return res.status(200).send({
        success:true,
        message:'Donor Record Deleted Successfully',
    });

} catch (error) {
   console.log(error);
    return res.status(500).send({
        success:false,
        message:'Error While Deleteing Donor',
        error:error.message,
    })
}
};


//EXPORT

module.exports ={getDonorsListController,getHospitalListController,
    getOrgListController,deleteDonorController}