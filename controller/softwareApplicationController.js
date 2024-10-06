import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { SoftwareApp } from "../models/softwareApplicationSchema.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary"

 export const deleteApplication=catchAsyncErrors(async(req,res,next)=>{
const {id}=req.params;
const softwareApplication=await SoftwareApp.findById(id);
if(!softwareApplication){
    return next (new ErrorHandler("Software application not found",404));
}
const softwareAppSvg=softwareApplication.svg.public_id;
await cloudinary.uploader.destroy(softwareAppSvg);
await softwareApplication.deleteOne();
res.status(200).json({
    success:true,
    message:" Software Deleted successfully",
    softwareApplication
})
})
 export const getAllApplication=catchAsyncErrors(async(req,res,next)=>{
    const softwareApplication= await SoftwareApp.find()
res.status(200).json({
    success:true,
    softwareApplication
})
})
 export const addNewApplication=catchAsyncErrors(async(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length == 0) {
        return next(new ErrorHandler("Software Application icon/svg is required", 400));
    }

    const { svg } = req.files;
    const {name}=req.body;
    if(!name){
        return next(new ErrorHandler("Software's name is requires",400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, { folder: "PORTFOLIO SOFTWARE APPS" });
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Unknown cloudinary error ", 500));
    }
    const softwareApplication=await SoftwareApp.create({
        name,
        svg:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    })
    res.status(200).json({
        success:true,
        message:"New software application added",
        softwareApplication
    })
})
