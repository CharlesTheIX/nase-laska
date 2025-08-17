import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.route";
import errorRouter from "./routes/error.route";
import healthRouter from "./routes/health.route";
import errorHandler from "./library/errorHandler";
import coresOrigins from "./constants/corsOrigins";
import characterRoute from "./routes/character.route";

const api = express();
const corsOptions = {
  origin: coresOrigins,
  optionsSuccessStatus: 200,
  methods: "GET,POST,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization"
};

api.use(cors(corsOptions));
api.use(express.json());
api.use("/", healthRouter);
api.use("/error", errorRouter);
api.use(authRouter);

api.use("/characters", characterRoute);

api.use(errorHandler);

export default api;
