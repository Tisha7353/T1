import express from "express"
import { getUser, getUserPortfolio, login, logout, register, updateProfile, } from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { updatePassword } from "../controller/messageController.js";
import { forgotPassword,resetPassword } from "../controller/userController.js";
const router=express.Router();
router.post("/register",register)
router.post("/login",login)
router.get("/logout",isAuthenticated, logout)
router.get("/me",isAuthenticated,getUser)
router.put("/update/me",isAuthenticated,updateProfile)
router.put("/update/password",isAuthenticated,updatePassword)
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me/portfolio",getUserPortfolio)
export  default router