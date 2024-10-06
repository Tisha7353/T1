import express from "express"
import { getAllMessages, sendMessage}  from "../controller/messageController.js";
import { deleteAllMessages } from "../controller/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router=express.Router();
router.post("/send",sendMessage)
router.get("/getall",getAllMessages)
router.delete("/delete/:id",isAuthenticated,deleteAllMessages)
export  default router