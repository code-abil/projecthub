const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
//Check whether a empty user_name clears the screening.
const userSchema=new mongoose.Schema({
    user_name:{
        type:String,
        required:true
    }, 
    password:{
        type:String,
        required:true,
        // validate(value){
        //     error_message=""
        //     validator.trim(value)
        //     if(value.length<8)
        //         error_message+="Password should be of atleast 8 characters"
        //     if(!validator.isAlphanumeric(value))
        //         error_message+="Password should not contain any specail characters."
        //     if(error_message.length)
        //         throw new Error(error_message)
        // }
    },
    email:{
        unique:true,    // this will create indexes for the emailids and use them to check for uniqueness
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid.")
            }
        }
    },
    tokens:[{ 
        token:{
            type:String,
            required:true
        }
    }]
},{                                                     // The Second argument of Mongoose Schema is 
    timestamps:true                                     // Schema options which is an object.                    
})                                                      // timestamps will create two attributes
                                                        // 1.createdat     2.updatedat            
// Virtual property/field.
// Its not the data which gets stored actually in database.
// Its a relationship between two entities. (example user and a task)

userSchema.virtual('projects',{
    ref:'Project',
    localField:"_id",
    foreignField:"creator"
})
// userSchema.virtual('projects',{          // here projects is the derived attribute.s
//     ref:'Project',                       // Relationship between UserModel to ProjectModel
//     localField:"_id",                    // they are related with the _id of UserModel
//     foreignField:"creator"               // to the _id of ProjectModel. 
// })
userSchema.pre('save',async function(next){
    const user=this
    console.log("Before saving a user.")

    // true when user is created with a new passord,or if the password of a user is modified.
    if(user.isModified("password")){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})
// Arrow functions don't bind this
//  so you must use a regular function since we're using this within the top-level scope of the function.

// Here we  include the function findByCredentials to the model User.
userSchema.statics.findByCredentials =async function(email,password){
    console.log("findByCredentials")
    const user =await User.findOne({email})
    console.log(user)
    if(!user){
        throw new Error("Unable to Login.")
    }
    const isMatch=await bcrypt.compare(password,user.password)
    console.log(isMatch)
    if(!isMatch){
        throw new Error("Unable to Login.")
    }
    console.log("reached")
    return user
}

// Here methods are used    for defining functions on the instance of a model.
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token= jwt.sign({_id:user._id.toString()},"abilash")
    console.log(token)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}


//  toJSON gets executed automatically , when JSON.stringify() is runned.
//  When we make an json object, it gets called automatically. 
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
const User=mongoose.model("User",userSchema)

module.exports=User
