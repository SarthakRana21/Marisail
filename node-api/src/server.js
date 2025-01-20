import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRoutes from "./index.js";

var server = express();

// Configuración más específica de CORS
server.use(cors({
  origin: 'https://test.marisail.com', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para logging de solicitudes (moverlo arriba para loggear todo)
server.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

server.use(logger("dev"));
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cookieParser());
server.use("/api", authRoutes);

// Rutas
server.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "root route, tested deploy 5",
  });
});

server.get("/server/healthCheck", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Manejador de 404
server.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

var port = (process.env.PORT || '3000'); 
server.listen(port, () => {
  console.log(`Running on port ` + port);
});

export default server;
