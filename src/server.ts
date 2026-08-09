import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config";
import { sequelize } from "./config/database";
import routes from "./routes";
import "./models/associations";
const app:express.Application = express();
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (!origin) {
//     return res.status(403).end();
//   }

//   if (origin !== "https://thegerado.com" && origin !== "https://www.thegerado.com")
//   {
//     return res.status(403).end();
//   }

//   next();
// });
app.use("/api/v1",routes);
app.get("/",(req:express.Request, res:express.Response) => {
    return res.status(200).json({
        "msg":"server is running"
    });
});
app.use((err:any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    let statusCode:number;
    let message:string;
    if(err.name === "AppError") {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if(err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if(err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    else if(err.name === "ZodError") {
        statusCode = 400;
        message = err.errors?.[0]?.message;
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});
// Database Connection
const startServer = async () => {
    try {
        await sequelize.authenticate(); 
        console.log("Database connected successfully");
        if(config.PORT) {
            app.listen(config.PORT,,"0.0.0.0",()=>{
                console.log("server started");
            })
        }
    } 
    catch (error) {
        console.error("Unable to connect to DB:", error);
    }
};
// starting server
startServer();