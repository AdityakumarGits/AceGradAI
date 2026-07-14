import express from"express";
import { signUp,login } from "../controller/user.controller.js"; 
const route=express.Router();



route.post("/signup",signUp );
route.post("/login",login);




export default route;