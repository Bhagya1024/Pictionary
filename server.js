const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const bodyParser=require('body-parser')
const cors = require('cors');

const UserRoute=require('./route/UserRoute')
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/pictionary", { useNewUrlParser: true });
const db=mongoose.connection

db.on('error',(err)=>{
    console.log(err);
});

db.once('open',()=>{
    console.log('database connection estabilished');
});

const app=express()
app.use(cors());

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('server is running on port ' + PORT)

})

app.use('/api/user',UserRoute)


