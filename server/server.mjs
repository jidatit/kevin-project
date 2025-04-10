import express from "express";
import cors from "cors";
import { config } from "dotenv";
import tokensRouter from "./routes/tokens.mjs";
import VerificationRoutes from "./routes/VerificationRoutes.mjs";

config();

const app = express();
const port = process.env.PORT || 10000;

app.use(
  cors({
    origin: [
      `${process.env.FRONTEND_URL}`, // Add your new frontend URL here
    ],
    // credentials: true,
  })
);
app.use(express.json());
app.use("/api", tokensRouter);
app.use("/auth", VerificationRoutes);
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
