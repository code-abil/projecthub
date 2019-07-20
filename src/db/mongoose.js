const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/users",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true   //To avoid displaying depreceated warnings.
})

// To connect the with database
//  mongo-db/mongo-db/bin/mongod --dbpath=mongo-db/mongo-db-data

// const user1=new User({name:"Abilash",age:5,email:"1@gmail.com"})

// user1.save().then((result)=>{
//     console.log(user1,result)
// }).catch((error)=>{
//         console.log(error)
// })

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
