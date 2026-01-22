import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRouter.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';


//app config
const app=express();
const port=process.env.PORT || 4000;
connectDB()
connectCloudinary()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//MIDDLEWARES



const allowedOrigins = [
  "http://localhost:5173", // frontend local
  "http://localhost:5174",
  "https://prescriptofrontend-sigma.vercel.app", 
  "https://prescripto-three-alpha.vercel.app"
   
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token",
      "atoken",
      "dtoken",
    ],
  })
);

// IMPORTANT
app.options("*", cors());
//API End Points

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

//localhost:4000/api/admin/add-doctor


app.get('/',(req,res)=>{
res.send('API working')
})

app.listen(port,()=>console.log("serever started",port))