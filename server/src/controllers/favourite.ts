import Audio, { AudioDocument } from "#/models/audio";
import { Favourite } from "#/models/favourite";
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import { PopulatedFavList } from "../@types/audio";
import { paginationQuery } from "#/@types/misc";

export const toggleFavourite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "added" | "removed";

  if (!isValidObjectId(audioId)) {
    return res.status(422).json({ error: "Invalid audio id" });
  }

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ error: "Audio not found" });

  // 1) audio is already in fav

  const userId = req.user.id;
  const existingFav = await Favourite.findOne({
    owner: userId,
    items: { $in: [audioId] },
  });

  if (existingFav) {
    // remove from fav list
    await Favourite.updateOne(
      {
        owner: userId,
      },
      {
        $pull: { items: audioId }, // built in method to remove id from the array ; similar to filter
      }
    );

    status = "removed";
  } else {
    const favList = await Favourite.findOne({ owner: userId });
    if (!favList) {
      // 2) trying to create a fresh fav list

      await Favourite.create({ owner: userId, items: [audioId] });
    } else {
      // add to fav list
      // 3) trying to add new audio to the old list
      await Favourite.updateOne(
        { owner: userId },
        { $addToSet: { items: audioId } } // Update operator to push audioId to items array ; different from push as does not create duplicates
      );
    }
    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, { $addToSet: { likes: userId } });
  }
  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, { $pull: { likes: userId } });
  }

  res.json({ status });
};

export const getFavourites: RequestHandler = async (req, res) => {
  const ownerId = req.user.id;
  const { page = "0", limit = "20" } = req.query as paginationQuery;
  // console.log(parseInt(page), parseInt(limit));

  const favourites = await Favourite.aggregate([
    { $match: { owner: ownerId } },
    {
      $project: {
        audioIds: {
          $slice: ["$items", parseInt(page) * parseInt(limit), parseInt(limit)],
        },
      },
    },
    { $unwind: "$audioIds" },
    {
      $lookup: {
        from: "audios",
        localField: "audioIds",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    { $unwind: "$audioInfo" },
    {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $project: {
        _id: "$audioInfo._id",
        title: "$audioInfo.title",
        category: "$audioInfo.category",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
      },
    },
  ]);

  res.status(200).json(favourites);

  // const favourites = await Favourite.findOne({ owner: ownerId }).populate<{
  //   items: PopulatedFavList[];
  // }>({
  //   path: "items",
  //   populate: { path: "owner" }, //deep populate
  // });

  // if (!favourites) return res.json({ audios: [] });

  // const audios = favourites.items.map((item) => {
  //   return {
  //     id: item._id,
  //     title: item.title,
  //     category: item.category,
  //     file: item.file.url,
  //     poster: item.poster?.url,
  //     owner: { name: item.owner.name, id: item.owner._id },
  //   };
  // });

  // res.json({ audios });
};

export const getIsFavourite: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const audioId = req.query.audioId as string;

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Invalid audio id" });

  const favourite = await Favourite.findOne({ owner: userId, items: audioId });

  res.json({ result: favourite ? true : false });
};
