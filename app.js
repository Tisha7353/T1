import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js"
import timelineRouter from "./router/timelineRouter.js"
import userRouter from "./router/userRouter.js"
import skillRouter from "./router/skillRoutes.js"
import softwareRouter from "./router/softwareApplicationRouter.js"
import projectRouter from "./router/projectRouter.js"
const app=express();
dotenv.config({
    path:"./.env"
})

app.use(cors({
    origin:[process.env.PORTFOLIO_URL,process.env.DASHBOARD_URL],
    methods:["GET","PUT","POST","DELETE"],
    credentials:true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))

  
app.use("/api/v1/message",messageRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/timeline",timelineRouter)
app.use("/api/v1/softwareApplication",softwareRouter)
app.use("/api/v1/skills",skillRouter)
app.use("/api/v1/projects",projectRouter)
dbConnection()
app.use(errorMiddleware)
console.log(process.env.PORT)
export default app;