const express=require("express")
const router=new express.Router()
const auth=require('../middleware/auth')
const Project=require("../models/project")


// Creating of projects.
router.post("/projects",auth,async(req,res)=>{
    // console.log("bbody",req.body)
    // const project=new Project(req.body)
    const project=new Project({
        ...req.body,     //ES6 spread operaotr , copies all of its body here
        creator:req.user._id
    })
    try{
        await project.save()
        res.status(201).send(project)
    }catch(e){
        res.status(400).send(e)
    }

    // project.save().then(()=>{
    //     res.status(201)
    //     res.send(project)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    // })
})

// /projects?completed=true         // Filtering data
// /projects?limit=10&skip=10       // Pagination
// limit is for the number of entires in a page, skip is for the number of entries to be skipped.
// /projects?sortBy=createdAt:desc       sorting as per createdAt entry in ascending order (asc/desc)
router.get("/projects",async(req,res)=>{
    const match={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'        // Cause query sting will have 
    }                                                           // only sting values.but we need boolean.
    try{
        // const projects=await Project.find({creator:req.user._id})
        console.log("cool")
        await req.usere.populate({
            path:"projects",
            match:match,
            options:{           // options property can be used for pagination and sorting.
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:{
                    createdAt:-1         //we will sort as per createdAt attribute , and 1==asc,-1==desc
                }
            }
        }).execPopulate(req.usere.projects)
        console.log()
        res.send(req.usere.projects)
    }catch(e){
        res.status(500).send()
    }
    // Project.find({}).then((projects)=>{
    //     res.send(projects) 
    // }).catch((error)=>{
    //     res.status(500) 
    //     res.send("Server Error")
    // })
})

router.get("/projects/:id",auth,async(req,res)=>{
    const _id=req.params.id
    try{
        // const project=await Project.findById(_id)
        console.log(req.user._id)
        const project=await Project.findOne({_id,creator:req.user._id})   //Filtering Data
        if(!project)      
            return res.status(404).send()
        res.send(project)
    }catch(e){
        res.status(500).send()
    }
    // Project.findById(_id).then((project)=>{
    //     if(!project)      
    //         return res.status(404).send()
    //     res.send(project) 
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
})


router.patch('/projects/:id',auth,async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowed_updates=['title','description','colloborators','link','techstack']
    const isValidOperation=updates.every((update)=>{
        return allowed_updates.includes(update)
    })
    //return true if every callback returned true,else false
    console.log(isValidOperation)
    if(!isValidOperation){
        return res.status(400).send({err:"Invalid Update"})
    }
    try{
        // req.body contains the value to which we should update.(sent from client)
        // option object contains few elements.(like new for returning the updated value as opposed to
        // the outdated value),runValidators for validity checks before updating.
        // const project=await Project.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        // const project=await Project.findById(req.params.id)
        const project=await Project.findOne({_id:req.params.id,creator:req.user._id})
        if(!project){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            project[update]=req.body[update]
        })
        await project.save()
        
        res.send(project)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/projects/:id',auth,async (req,res)=>{
    try{
        // const project=await Project.findByIdAndDelete(req.params.id)
        const project=await Project.findOneAndDelete({_id:req.params.id,creator:req.user._id})
        
        if(!project){
            return res.status(404).send()
        }
        res.send(project)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports=router
