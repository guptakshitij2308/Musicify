import {
  deleteHistory,
  getHistory,
  getRecentlyPlayed,
  updateHistory,
} from "#/controllers/history";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { HistoryUpdateSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/", mustAuth, validate(HistoryUpdateSchema), updateHistory);
router.delete("/", mustAuth, deleteHistory);
router.get("/", mustAuth, getHistory);
router.get("/recently-played", mustAuth, getRecentlyPlayed);

export default router;
