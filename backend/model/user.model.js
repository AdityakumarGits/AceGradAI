import mongoose from "mongoose";
import bcrypt from "bcrypt"; 

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true // Taaki Email hamesha small letters mein save ho
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select:false
    },
    role: {
        type: String,
        enum: ["candidate", "recruiter", "admin"], 
        default: "candidate" 
    },
    Verified:{
        type:Boolean,
        default:false,
    }
}, { 
    timestamps: true // Fixed: Yeh automatic createdAt aur updatedAt fields handle karega
});

//  THE PRE-SAVE HOOK: Database mein save hone se pehle password encrypt hoga
userSchema.pre("save", async function(next) {
    // Agar password modify nahi hua hai, toh aage badh jao
    if (!this.isModified("password")) return ;
    
    try {
        // Password ko 10 salt rounds ke sath hash kar diya
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
       next(error);
         // Kuch gadbad hui toh error ko humare central handler par fek diya
    }
});

// 🔑 UTILITY METHOD: Login ke waqt password match karne ke liye custom function
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User; // Export karna zaroori hai controller mein use karne ke liye