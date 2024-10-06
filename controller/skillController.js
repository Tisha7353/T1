import { Skill } from "../models/skillSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import cloudinary from "cloudinary"
export const getAllSkills=catchAsyncErrors(async(req,res,next)=>{
const skills=await Skill.find();
res.status(200).json({
    success:true,
    message:"All skills got",
    skills
})
})
export const deleteSkill=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    const skill=await Skill.findById(id);
    if(!skill){
        return next(new ErrorHandler("Skill doesn't exist"),404);
    }
    const skillSvg=skill.svg.public_id;
    await cloudinary.uploader.destroy(skillSvg);
    await skill.deleteOne();
res.status(200).json({
    success:true,
    message:" Skill Deleted successfully",
    skill
})
})
export const updateSkill=catchAsyncErrors(async(req,res,next)=>{
    const { id } = req.params;
    let skill = await Skill.findById(id);
    
    if (!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }
    
    const { proficiency } = req.body;
    skill = await Skill.findByIdAndUpdate(
        id,
        { proficiency },
        {
            new: true,
            runValidators: true
        }
    );
    
    res.status(200).json({
        success: true,
        message: "Skill updated successfully",
        skill
    });
    
})
export const addNewSkill=catchAsyncErrors(async(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length == 0) {
        return next(new ErrorHandler("Skills icon/svg is required", 400));
    }

    const { svg } = req.files;
    const {title}=req.body;
    const{proficiency}=req.body;
    if(!title){
        return next(new ErrorHandler("Software's name is requires",400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(svg.tempFilePath, { folder: "SKILLS FOLDER" });
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Unknown cloudinary error ", 500));
    }
    const softwareApplication=await Skill.create({
        title,
        svg:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        },
        proficiency
    })
    res.status(200).json({
        success:true,
        message:"New skill added",
        softwareApplication
    })
})