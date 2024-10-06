import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";
import { User } from "../models/userSchema.js";
export const getAllTimelines=catchAsyncErrors(async(req,res,next)=>{
const timelines= await Timeline.find()
res.status(200).json({
    success:true,
    timelines
})

})
export const deleteTimeline=catchAsyncErrors(async(req,res,next)=>{
const {id}=req.params;
const timeline=await Timeline.findById(id);
if(!timeline){
    return next(new ErrorHandler("Timeline not found",404))
}
await timeline.deleteOne();
res.status(200).json({
    success:true,
    message:"Timeline deleted"
})
})
export const postTimeline=catchAsyncErrors(async(req,res,next)=>{
    const {title,description,from,to}=req.body
    const newtimeline=await Timeline.create({title,description,timeline:{from,to}})
    res.status(200).json({
        success:true,
        message:"Timeline added",
        newtimeline
    })
})