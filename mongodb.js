// CRUD Operations
// const mongodb=require('mongodb')
// // The above is a native driver for nodejs
// const MongoClient=mongodb.MongoClient
// const ObjectID=mongodb.ObjectID

// By Object destruction property
const {MongoClient,ObjectID}=require('mongodb')

const id=new ObjectID()
console.log(id,id.getTimestamp())
console.log(id.id,id.toHexString())

const connectionUrl='mongodb://127.0.0.1:27017'
const databaseName='task-app'
MongoClient.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("Unable to connect with Database")
    }
    console.log("Connection with Database is successfull.")
    const db=client.db(databaseName)
    // db.collection('users').insertOne({
    //     _id:id,
    //     'name':'Abilash',
    //     'age':10
    // },(error,result)=>{
    //     if(error){
    //         return console.log("Unable to insert data.")
    //     }else{
    //         console.log(result.ops)
    //     }
    // })
    // db.collection("users").insertMany([
    //     {
    //         "name":"fname",
    //         "age":10
    //     },
    //     {
    //         name:'sname',
    //         "age":10
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log("Unable to enter the data.")
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').findOne({name:"Abilash"},(error,user)=>{
    //     if(error){
    //         return console.log('Error finding the document.')
    //     }
    //     console.log(user)
    // })
    // db.collection('users').findOne({_id:new ObjectID("5cfd6cf806d5f01aaf614221")},(error,user)=>{
    //     if(error){
    //         return console.log("Error finding the document")
    //     }
    //     console.log(user)
    // })
    // db.collection('users').find({name:"Abilash"}).toArray((error,users)=>{
    //     if(error){
    //         return console.log("Error finding the document")
    //     }
    //     console.log(users)
    // })
    // db.collection('users').updateOne({
    //     name:"ABilash2"
    // },{
    //     $set:{name:"XYZ"}
    // }).then(
    //     (result)=>{
    //     console.log(result)
    // }).catch(
    //     (error)=>{
    //     console.log(error)
    // })
    // If callbacks not defined as a paramter , it returns a promise object.
    
    db.collection('users').updateMany({
        name:"Abilash"
    },{$set:{
        name:"Mod"
    }}).then((results)=>{
        console.log(results.modifiedCount)
    }).catch((error)=>{
        console.log(error)
    })
})