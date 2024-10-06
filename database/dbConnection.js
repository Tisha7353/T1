import mongoose from "mongoose";
const dbConnection=()=>{
    mongoose.connect(process.env.MONGODB_URI,{
        dbName:"PORTFOLIO"
    }).then(()=>{
        console.log("Connected to db")
    }).catch((error)=>{
        console.log(`Error occured while connecting to database:${error}`)
    })
} 
export default dbConnection