import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import User from "#/models/user";
import { paginationQuery } from "#/@types/misc";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  const userId = req.user.id;
  let status: "added" | "removed";

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ message: "Invalid profile id!" });
  }

  const userToFollow = await User.findById(profileId);

  if (!userToFollow) {
    return res.status(404).json({ message: "Profile not found!" });
  }

  const alreadyAFollower = await User.findOne({
    _id: profileId,
    followers: userId,
  });
  if (alreadyAFollower) {
    // unfollow
    await User.updateOne(
      { _id: userToFollow._id },
      {
        $pull: { followers: userId },
      }
    );

    await User.updateOne(
      { _id: userId },
      {
        $pull: { followings: profileId },
      }
    );

    status = "removed";
  } else {
    await User.updateOne(
      { _id: userToFollow._id },
      {
        $addToSet: { followers: userId },
      }
    );
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { followings: userToFollow },
      }
    );
    status = "added";
  }

  return res.json({ status });
};

export const getUploads: RequestHandler = async (req, res) => {
  const { page = "0", limit = "20" } = req.query as paginationQuery;
  const userId = req.user.id;

  const data = await Audio.find({ owner: userId })
    .skip(+page * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });

  const audios = data.map((audio) => {
    return {
      id: audio._id,
      title: audio.title,
      about: audio.about,
      file: audio.file.url,
      poster: audio.poster?.url,
      date: audio.createdAt,
      owner: { name: req.user.name, id: req.user.id },
    };
  });

  res.json({ audios });
};

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { page = "0", limit = "20" } = req.query as paginationQuery;
  const { profileId } = req.params;

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ message: "Invalid profile id!" });
  }

  const user = await User.findById(profileId);
  if (!user) {
    return res.status(404).json({ message: "Profile not found!" });
  }

  const data = await Audio.find({ owner: profileId })
    .skip(+page * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });

  const audios = data.map((audio) => {
    return {
      id: audio._id,
      title: audio.title,
      about: audio.about,
      file: audio.file.url,
      poster: audio.poster?.url,
      date: audio.createdAt,
      owner: { name: user.name, id: user.id },
    };
  });

  res.json({ audios });
};

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ message: "Invalid profile id!" });

  const user = await User.findById(profileId);
  if (!user) return res.status(404).json({ message: "Profile not found!" });

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      followers: user.followers.length,
      avatar: user.avatar?.url,
    },
  });
};

export const getPublicProfilePlaylist: RequestHandler = async (req, res) => {
  const { page = "0", limit = "20" } = req.query as paginationQuery;
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ message: "Invalid profile id!" });

  const playlist = await Playlist.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(+page * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });

  if (!playlist) {
    return res.json({ playlist: [] });
  }

  return res.json({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};
