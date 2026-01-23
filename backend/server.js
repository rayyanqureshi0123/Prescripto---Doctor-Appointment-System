import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRouter.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// ✅ CORS CONFIG (FIXED)
// =======================

const allowedOrigins = [
  "http://localhost:5173", // frontend local
  "http://localhost:5174", // admin local
  "https://prescriptofrontend-sigma.vercel.app",
  "https://prescripto-three-alpha.vercel.app", // admin vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ VERY IMPORTANT: handle preflight requests
app.options("*", cors());

// =======================
// API Routes
// =======================

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log("server started", port);
});
