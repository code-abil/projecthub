const express=require("express")
const router=new express.Router()
const auth=require("../middleware/auth")

const User=require("../models/user")

router.get('/test',(req,res)=>{
    res.send("from user.sj")
})

router.get('/users/me',auth,async (req,res)=>{
    console.log(req.user)
    res.render('index',req.user)
})

router.post("/users",async (req,res)=>{
    // res.send("Testing")
    console.log(req.body)
    const user=new User(req.body)
    
    try{
        await  user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
    

    
    // user.save().then(()=>{
    //     res.status(201)
    //     res.send(user)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    // })
})


// auth is a middleware,the third arg(async function runs only if auth call next())
router.get("/users",auth,async (req,res)=>{
    console.log("reached")
    try{
        const user=await User.find({})
        res.status(200).send(user)
    }catch(e){
        res.status(500).send()
    }


    // // We can querry on the mongoose model. (mongoose querries)
    // User.find({}).then((users)=>{
    //     res.send(users) // Return an array of users.
    // }).catch((error)=>{
    //     res.status(500) //We were not able to return the users data, probably because of server errors.
    //     res.send("Server Error")
    // })
})

router.get("/users/:id",async (req,res)=>{
    
    // req.params provides all of the route paramaters provided.
    // console.log(req.params) 
    const _id=req.params.id
    console.log(_id)

    try{
        const user=await User.findById(_id)
        if(!user)
            return res.status(404).send()
        
        res.status(200).send(user)
    }catch(e){
        res.status(500).send()   
    }
    
    
    // // Mongoose automatically makes the string id passes to an objectid.Whereas in case if we use mongodb,
    // // we have do it by ourself.
    // User.findById(_id).then((user)=>{
    //     if(!user)      //No user match for that id.
    //         return res.status(404).send()

    //     res.send(user)  //If a match is found.
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
    // If the id is ill of being an objectid, it will give a status 500.
    // Where as if no match was found for a eligible id,it returns a 404.
})




// router.patch('/users/:id',async (req,res)=>{

//     const updates=Object.keys(req.body)
//     const allowed_updates=['user_name','password','email']
//     const isValidOperation=updates.every((update)=>{
//         return allowed_updates.includes(update)
//     })
//     //return true if every callback returned true,else false

//     if(!isValidOperation){
//         return res.status(400).send({err:"Invalid Updates"})
//     }
//     try{
//         // req.body contains the value to which we should update.(sent from client)
//         // option object contains few elements.(like new for returning the updated value as opposed to
//         // the outdated value),runValidators for validity checks before updating.
       
//         // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         // findByIdAndUpdate executes directly on database ,instead of running through mongoose.
//         // Therfore we cant use the advantagge of middlewares
       
//         const user=await User.findById(req.params.id)
//         updates.forEach((update)=>{
//             user[update]=req.body[update]
//         })    
//         await user.save()
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowed_updates=['user_name','password','email']
    const isValidOperation=updates.every((update)=>{
        return allowed_updates.includes(update)
    })
    //return true if every callback returned true,else false

    if(!isValidOperation){
        return res.status(400).send({err:"Invalid Updates"})
    }

    try{
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })    
        await req.user.save()
        res.send(req.user)
    }catch(e){ 
        console.log(e)
        res.status(400).send(e)
    }
})

//Deleting a user after authentication.
router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id)
        // console.log(user) 

        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login',async (req,res)=>{
    try {
        // findByCredentials is registered in the User model.
        const user =await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        console.log(user,token)
        res.render({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
module.exports=router