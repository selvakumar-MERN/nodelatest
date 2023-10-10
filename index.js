const express= require('express')
const app=express();
const mongoose=require('mongoose');
const cors= require('cors')

require('dotenv').config();

const PORT= process.env.PORT || 3030;
app.use(cors({origin:true}))
const dbUrl=process.env.DB_URL;

mongoose.connect(dbUrl,{useNewUrlParser:true});

const con=mongoose.connection;
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(PORT,()=>{
    console.log('server is running at',PORT)
})
try{
     con.on('open',()=>{
        console.log('db connected')
     })
}
catch(error){
     console.log("error"+error)
}
const adminRouter= require('./routes/admin')
const userRouter=require('./routes/user')

app.use('/user',userRouter)
app.use('/admin',adminRouter)