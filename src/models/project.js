const mongoose=require('mongoose')
const validator=require('validator')

const ProjectSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        validate(value){
            validator.trim(value)
            if(value.length>=15)
                throw new Error("Title should contain less than 15 Characters.")
        }
    },
    description:{
        type:String,
        default:"No Description Available"
    },
    link:{
        type:String,
        default:"No links attached with the project."
    },
    techstack:{

    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,    //id of an user.
        required:true,
        ref:'User'                              // For creating a relationship between creator field and 
    },                                          // and its corresponding user model instanace.
    completed:{
        type:Boolean
    }
},{
    timestamps:true
})
const Project=mongoose.model('Project',ProjectSchema)
module.exports=Project