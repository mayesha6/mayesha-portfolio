import express from "express";
import { ContactController } from "./contact.controller";

const router = express.Router();

router.post("/send", ContactController.sendEmail);

export const contactRouter = router;
