import compression from "compression";
import cors from "cors";
import express from "express";
import { userRouter } from "./modules/user/user.routes";
import { postRouter } from "./modules/post/post.routes";
import { authRouter } from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import { projectRouter } from "./modules/project/project.routes";
import { contactRouter } from "./modules/contact/contact.routes";


const app = express();

app.use(compression()); 
app.use(cookieParser());
app.use(express.json()); 
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://personal-portfolio-six-sigma-40.vercel.app",
];
if (process.env.CORS_ORIGIN) {
  const customOrigins = process.env.CORS_ORIGIN.split(",").map((item) => item.trim());
  customOrigins.forEach((origin) => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/contact", contactRouter)


app.get("/", (_req, res) => {
  res.send("My portfolio API is running...");
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
