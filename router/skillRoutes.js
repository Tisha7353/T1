import express from "express"
import { addNewSkill,getAllSkills,updateSkill,deleteSkill }  from "../controller/skillController.js";

import { isAuthenticated } from "../middlewares/auth.js";
const router=express.Router();
router.post("/add",isAuthenticated,addNewSkill)
router.get("/getall",getAllSkills)
router.put("/update/:id",isAuthenticated,updateSkill)
router.delete("/delete/:id",isAuthenticated,deleteSkill)
export  default router