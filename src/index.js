const express=require("express") 
const path=require('path')
const hbs=require('hbs')
const request=require('request')
require("./db/mongoose")
// For making sure that we connect mongoose with the database.
//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between 
//data, provides schema validation,and is used to translate between objects in code and the representation of those objects in MongoDB.

//‘Models’ are higher-order constructors that take a schema and create 
//an instance of a document equivalent to records in a relational database.

//  https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/
const app=express()
const port=process.env.port || 3000


// // Express middleware
// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     next()  // to let express know that we are done. 
// })


app.use(express.json())
// Automatically parses incoming json into an object.

// A new body object containin  g the parsed data is populated on 
// the request object after the middleware (i.e. req.body),
//  or an empty object ({}) if there was no body to parse.


const publicdirectoryRoute=path.join(__dirname,'../public')
console.log(publicdirectoryRoute)
app.use(express.static(publicdirectoryRoute))

app.set('view engine','hbs')
app.set('views',path.join(__dirname,'../public/templates/views'))

console.log(__dirname)
const partialspath=path.join(__dirname,'../public/templates/partials')
hbs.registerPartials(partialspath)

app.get('/home',(req,res)=>{
    res.render('index',{
        title:"cool",
        title2:"dude"
    })
})

const userRouter=require('./routers/user')
app.use(userRouter)

const projectRouter=require('./routers/project')
app.use(projectRouter)

// const jwt=require("jsonwebtoken")

// const myFunction=async ()=>{
//     const token=jwt.sign({_id:"1234"},"Abilash",{expiresIn:"7 days"})
//     console.log(token)
//     const data=jwt.verify(token,"Abilash")
//     console.log(data)
// }
// myFunction().then(()=>{}).catch(()=>{})

app.listen(port,()=>{
    console.log("Server Started on port",port)
})

// const Project=require("./models/project")
// const main =async()=>{
//     const project =await Project.findById("5d056f5e82fb5319daa0708c")
//     console.log(project.creator)
//     await project.populate('creator').execPopulate()     // It populates with the relationshipped data.
//     console.log(project.creator)                         // Therfore the, creator of projects data is retrieved.
// }
// main()


// const User=require('./models/user')
// const main =async()=>{
//     const user =await User.findById("5d2592582f6c8d115117a698")
//     await user.populate('projects').execPopulate()      // We populate the virtual field projects of User Model 
//     console.log(user.projects)                          // with the projects created by that user.
// }
// main()
