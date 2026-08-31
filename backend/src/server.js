import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./database/connectDB.js";
import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(logger);
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SupportDesk API is running",
  });
});

app.use(notFound);

app.use(errorHandler);
await connectDB();

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
