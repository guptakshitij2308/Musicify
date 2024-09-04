import {
  getPublicProfile,
  getPublicProfilePlaylist,
  getPublicUploads,
  getRecommendedByProfile,
  getUploads,
  updateFollower,
} from "#/controllers/profile";
import { isAuth, isVerified, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/update-follower/:profileId", mustAuth, updateFollower);
router.get("/uploads", mustAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/playlist/:profileId", getPublicProfilePlaylist);
router.get("/recommended", isAuth, getRecommendedByProfile);

export default router;
