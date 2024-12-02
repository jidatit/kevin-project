import express from "express";
import { sendVerificationEmail } from "../controllers/VerificationControllers.mjs";

const VerificationRoutes = express.Router();

VerificationRoutes.post("/sendVerifyEmail", sendVerificationEmail);
export default VerificationRoutes;
