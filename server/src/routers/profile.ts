import {
  getPublicProfile,
  getPublicProfilePlaylist,
  getPublicUploads,
  getUploads,
  updateFollower,
} from "#/controllers/profile";
import { isVerified, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router();

router.post("/update-follower/:profileId", mustAuth, updateFollower);
router.get("/uploads", mustAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/playlist/:profileId", getPublicProfilePlaylist);

export default router;
