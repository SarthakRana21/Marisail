import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRoutes from "./index.js";
var server = express();
const allowOrigins = ['https://test.marisail.com', 'http://localhost:5173']
const corsOptions = {
  // origin: ['*'],
  origin: allowOrigins,
  methods: ['GET', 'POST', 'PUT'], // Allow the necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed content types
  
};
server.use(cors(corsOptions));
server.use(logger("dev"));
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/api", authRoutes);


// catch 404 and forward to error handler
server.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "root route, tested deploy 5",
  });
});
server.get("/server/healthCheck", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
server.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
server.use((req, res, next) => {
  // console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
// usin .env PORT value or the pm2 its ok
var port = (process.env.PORT || '3000'); 

server.listen(port, () => {
  console.log(`Running on port ` + port);
});
export default server; 
