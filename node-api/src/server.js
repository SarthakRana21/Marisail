import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRoutes from "./index.js";
var server = express();
server.use(cors());
server.use(logger("dev"));
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/api", authRoutes);

// catch 404 and forward to error handler
server.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "root route",
  });
});
server.get("/server/healthCheck", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
server.use(function (req, res, next) {
  next(createError(404));
});

var port = normalizePort(process.env.PORT || '3000');

server.listen(port, () => {
  console.log(`Running on 3001`);
});
export default server; 
