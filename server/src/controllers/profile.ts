import { RequestHandler } from "express";
import { isValidObjectId, PipelineStage } from "mongoose";
import User from "#/models/user";
import { paginationQuery } from "#/@types/misc";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import History from "#/models/history";
import moment from "moment";

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

export const getRecommendedByProfile: RequestHandler = async (req, res) => {
  const user = req.user;

  let matchOptions: PipelineStage.Match = {
    $match: {
      _id: { $exists: true },
    },
  };

  if (user) {
    // send audios accoring to profile
    // console.log(user);
    // fetch users previous history
    const userPreviousHistory = await History.aggregate([
      {
        $match: {
          owner: req.user.id,
        },
      },
      {
        $unwind: "$all",
      },
      {
        $match: {
          "all.date": {
            // match only those hitories which are not older than 30 days
            $gte: moment().subtract(30, "days").toDate(),
          },
        },
      },
      {
        $group: {
          _id: "$all.audio",
        },
      },
      {
        $lookup: {
          from: "audios",
          localField: "_id",
          foreignField: "_id",
          as: "audioInfo",
        },
      },
      {
        $unwind: "$audioInfo",
      },
      {
        $group: {
          _id: null,
          category: {
            $addToSet: "$audioInfo.category",
          },
        },
      },
    ]); // in the last 30 days user is listening to these category music

    // console.log(userPreviousHistory)

    const categories = userPreviousHistory[0]?.category;

    if (categories?.length) {
      matchOptions = {
        $match: {
          category: { $in: categories },
        },
      };
    }
  }

  // send generic audios
  const audios = await Audio.aggregate([
    // {
    //   $match: {
    //     _id: { $exists: true },
    //   },
    // },
    matchOptions,
    {
      $sort: {
        "likes.count": -1,
      },
    },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        category: "$category",
        about: "$about",
        file: "$file.url",
        poster: "$poster.url",
        owner: {
          id: "$owner._id",
          name: "$owner.name",
        },
      },
    },
  ]);

  res.json({ audios });
};
