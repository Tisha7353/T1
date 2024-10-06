import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import crypto from 'crypto';
import { sendEmail } from "../utils/sendEmail.js";
export const register = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length == 0) {
        return next(new ErrorHandler("Avatar & Resume are required", 400));
    }

    const { avatar, resume } = req.files;

    const cloudinaryResAvatar = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: "AVATARS" });
    if (!cloudinaryResAvatar || cloudinaryResAvatar.error) {
        return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
    }

    const cloudinaryResResume = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "MY_RESUME" });
    if (!cloudinaryResResume || cloudinaryResResume.error) {
        return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
    }

    const { fullName, email, phone, aboutme, password, portfolioUrl, linkedinUrl, githubUrl, leetCodeUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    try {
        const user = await User.create({
            fullName,
            email,
            phone,
            aboutme,
            password,
            portfolioUrl,
            linkedinUrl,
            githubUrl,
            leetCodeUrl,
            avatar: {
                public_id: cloudinaryResAvatar.public_id,
                url: cloudinaryResAvatar.secure_url,
            },
            resume: {
                public_id: cloudinaryResResume.public_id,
                url: cloudinaryResResume.secure_url,
            },
        });

        generateToken(user, "User registered", 201, res);
    } catch (error) {
        return next(new ErrorHandler("User registration failed", 500));
    }
}); export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email & Password are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password"));
    }

    generateToken(user, "Logged In", 200, res);
});
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logged out"
    })
})
export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutme: req.body.aboutme,
        portfolioUrl: req.body.portfolioUrl,
        linkedinUrl: req.body.linkedinUrl,
        githubUrl: req.body.githubUrl,
        leetCodeUrl: req.body.leetCodeUrl
    }
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = await User.findById(req.user.id);
        const profileImgId = user.avatar.public_id
        await cloudinary.uploader.destroy(profileImgId);
        const cloudinaryRes = await cloudinary.uploader.upload(avatar.tempFilePath, { folder: "AVATARS" });
        newUserData.avatar={
            public_id:cloudinaryRes.public_id,
            url:cloudinaryRes.secure_url
        }
    }
    if (req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = await User.findById(req.user.id);
        const resumeId = user.resume.public_id
        await cloudinary.uploader.destroy(resumeId);
        const cloudinaryRes = await cloudinary.uploader.upload(resume.tempFilePath, { folder: "MY_RESUME" });
        newUserData.resume={
            public_id:cloudinaryRes.public_id,
            url:cloudinaryRes.secure_url
        }
    }
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false

    })
    res.status(200).json({
        success:true,
        message:"Profile Updated",
        user
    })
})
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler("User Not Found!", 404));
    }
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  
    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
    You've not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Personal Portfolio Dashboard Password Recovery`,
        message,
      });
      res.status(201).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  //RESET PASSWORD
  export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset password token is invalid or has been expired.",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password & Confirm Password do not match"));
    }
    user.password = await req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    generateToken(user, "Reset Password Successfully!", 200, res);
  });
export const getUserPortfolio=catchAsyncErrors(async(req,res,next)=>{
    const id="66f9302d6a74eda53520330a";
    const user=await User.findById(id);
    res.status(200).json({
        success:true,
        user
    })
})