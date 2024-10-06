import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    senderName:{
        type:String,
        minLength:[2,"Name must contain atleast two characters"]
    },
    subject:{
        type:String,
        minLength:[2,"Subject must contain atleast two characters"]
    },
    message:{
        type:String,
        minLength:[2,"Message must contain atleast two characters"]
    }
},{timestamps:true});
export const Message= mongoose.model("Message",messageSchema)