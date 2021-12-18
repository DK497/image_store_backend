const express= require('express');
const bp= require('body-parser');
const morgan=require('morgan');
const cors=require('cors');  
const mongoose=require('mongoose'); 


const app=express();
require('dotenv/config');


app.use(cors());
app.options('*',cors());


//middleware
app.use(bp.json());
app.use(morgan('tiny')); //for logging data of api requests in specific format
// app.use(authjwt());

// serving static files which were uploaded from client side
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))

// app.use(errorHandler);

app.get('/',(req,res)=>{
res.send('Welcome to imagestore backend server.');
});

// Routes
// const categoriesRoutes = require('./routes/categories');
const userRoutes=require('./routes/user');
const storeRoutes=require('./routes/stores');

// // enabling routes
// app.use(`${api}/products`,prouter)
app.use('/user',userRoutes);

app.use('/stores',storeRoutes);


// DB
mongoose.connect(process.env.conn_str,{
    useNewUrlParser:true,useUnifiedTopology:true,
    dbName:'imagestoreDB'
}) //this method returns a promise
.then(()=>console.log('DB ready'))
.catch((err)=>console.log(err))





// // development
// app.listen(3000,()=>{
//     console.log('Server is runnin at port 3000');
// });

// Production
var server=app.listen(process.env.PORT||3000,()=>{
    var port =server.address().port;
    console.log(`Express working on port ${port}`)
})

