import User from "../model/user.model.js";
import Otp from "../model/otp.model.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import {createAndSendOtp } from "../utils/otp.utils.js";

export const signUp = async(req,res ,next)=>{
 try{
   const {fullname,email,password,role} =req.body;
     if(!fullname || !email ||!password){
     return next(new AppError("Please Fill all fields",400))
      }
   const userExits= await User.findOne({email});
     if(userExits){
      return next(new AppError("User already exists", 400));
     }

  const newUser=await User.create({
    fullname,
    email,
    password,
    role
  })
     await createAndSendOtp(newUser.email, "signup"); // helper — niche define karunga
   // const token = jwt.sign({id : newUser._id},process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRES_IN || "1d"});
      
    res.status(201).json({
        message: "User created successfully",
        status:"success",
        user: newUser
    })
 }
    catch (error) { next(error); }
         
}
     
export const SendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new AppError("Email is required", 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("User not Found", 404));
        }

        await createAndSendOtp(email, "signup");

        res.status(201).json({
            message: "OTP Send successfully",
            status: "success",
        });
    } catch (error) {
        next(error);
    }
}

    //Verify OTP
 export const verifyOTP=async(req,res,next)=>{
  try {
     const {email,otp}=req.body;

        if (!email || !otp) {
            return next(new AppError("Email and OTP are required", 400));
        }
      const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return next(new AppError("OTP not found or expired", 400));
        }


   if(otpRecord.otp !== otp){
      return next(new AppError("Invalid OTP",400));
    }

    if(otpRecord.expiresAt < Date.now()){
      return next(new AppError(" OTP expired",400));
    }
    

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
    user.isVerified=true;
    await user.save();
 await Otp.deleteOne({ email });

 const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        ); 
        // reuse prevent karo
   res.status(200).json({
        message: "User Verified successfully",
        status:"success",  
    })


  } catch (error)  {
    next(error);
  }
  
 }
 
 //Resend OTP
 export const resendOtp = async (req, res, next) => {
    try {
        const { email, purpose } = req.body;
        if (!email) {
            return next(new AppError("Email is required", 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("User not Found", 404));
        }

       await createAndSendOtp(email, purpose || "signup");

        res.status(200).json({
            message: "OTP resent successfully",
            status: "success",
        });
    } catch (error) {
        next(error);
    }
}

//Login Controller
export const login=async(req,res,next)=>{
 try {
    const {email,password}=req.body;

    if(!email || !password){
        return  next( new AppError("Please Enter Email & Password",400));
    }
      const user = await User.findOne({ email }).select("+password");
      if(!user){
        return next (new AppError("User Not Exist"));
      }

      const isMatch = await user.correctPassword(password, user.password)
        if(!isMatch){
            return next(new AppError("Invalid User or Password" ,400))
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRES_IN });
      res.status(200).json({
    status: 'success',
    token,
    data: {
            user: {
                id: user._id,
                fullname: user.fullname,
                role: user.role,
                email: user.email,
        }
      }
});
 }
  catch (error) { next(error); } 
     
 }

 //Forget-Password Controller

export const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new AppError("Email is required", 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("User not Found", 404));
        }

        await createAndSendOtp(email, "forgot-password");

        res.json({ success: true, message: "Password reset OTP sent" });
    } catch (error) {
        next(error);
    }
}
 export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return next(new AppError("Email, OTP and new password are required", 400));
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return next(new AppError("OTP not found or expired", 400));
        }

        if (otpRecord.otp !== otp) {
            return next(new AppError("Invalid OTP", 400));
        }

        if (otpRecord.expiresAt < Date.now()) {
            return next(new AppError("OTP expired", 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("User not Found", 404));
        }

        user.password = password;   // pre-save hook automatically hash karega
        await user.save();

        await Otp.deleteOne({ email });

        res.json({
            success: true,
            message: "Password reset successful. You can log in now.",
        });
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}