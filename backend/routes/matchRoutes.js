import express from "express";
import { matchKundali } from "../controllers/matchController.js";

const router = express.Router();

// 💞 MATCH API ENDPOINT
router.post("/kundali", matchKundali);

export default router;