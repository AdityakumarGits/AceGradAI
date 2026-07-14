import User from "../model/user.model.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";


export const signUp = async(req,res ,next)=>{
 try{
   const {fullname,email,password} =req.body;
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
    password
  })
    const token = jwt.sign({id : newUser._id},process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRES_IN || "1d"});
      
    res.status(201).json({
        message: "User created successfully",
        status:"success",
        token,
        user: newUser
    })
 }
    catch (error) { next(error); }
         
}






export const login=async(req,res,next)=>{
 try {
    const {email,password}=req.body;

    if(!email || !password){
        return  next( new AppError("Please Enter Email & Password",400));
    }

    const user=await User.findOne({email});
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
    data: { user }
});
 }
  catch (error) { next(error); } 
     
 }

