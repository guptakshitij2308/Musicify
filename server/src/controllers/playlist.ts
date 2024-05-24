import {
  CreatePlaylistRequest,
  PopulatedFavList,
  UpdatePlaylistRequest,
} from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res
) => {
  const { title, resId, visibility } = req.body;
  const userId = req.user.id;

  //   user wants to add audio also to the playlist
  if (resId) {
    if (!isValidObjectId(resId)) {
      return res.status(422).json({ message: "Invalid resource id!" });
    }

    const audio = await Audio.findById(resId);
    if (!audio) {
      return res.status(404).json({ message: "Audio not found!" });
    }
  }

  const playlist = new Playlist({
    title,
    visibility,
    owner: userId,
  });

  if (resId) {
    playlist.items.push(resId as any);
  }

  await playlist.save();

  return res.status(201).json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: UpdatePlaylistRequest,
  res
) => {
  const { title, id, visibility, item } = req.body;
  const userId = req.user.id;

  if (!isValidObjectId(id)) {
    return res.status(422).json({ message: "Invalid playlist id!" });
  }

  const playlist = await Playlist.findById(id);
  if (!playlist)
    return res.status(404).json({ message: "Playlist not found!" });

  if (title) playlist.title = title;

  if (visibility) playlist.visibility = visibility;

  if (item) {
    if (!isValidObjectId(item)) {
      return res.status(422).json({ message: "Invalid audio id!" });
    }
    const audio = await Audio.findById(item);
    if (!audio) return res.status(404).json({ message: "Audio not found!" });

    if (!playlist.items.includes(audio._id)) {
      playlist.items.push(audio._id);
    }
  }

  await playlist.save();

  res.status(201).json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (req, res) => {
  // 'playlist?playlistId=abcd&resId=abcd&all=yes'
  const { playlistId, resId, all } = req.query;

  if (!isValidObjectId(playlistId)) {
    return res.status(404).json({ message: "Invalid playlist id!" });
  }

  const userId = req.user.id;
  if (all === "yes") {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: userId,
    });
    if (!playlist)
      return res.status(404).json({ error: "Playlist not found!" });
  }

  if (resId) {
    if (!isValidObjectId(resId)) {
      return res.status(422).json({ message: "Invalid audio id!" });
    }

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: userId,
      },
      {
        $pull: { items: resId },
      },
      { new: true }
    );
    if (!playlist)
      return res.status(404).json({ error: "Playlist not found!" });
  }

  return res.json({ success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const { page = "0", limit = "20" } = req.query as {
    page: string;
    limit: string;
  };

  const userId = req.user.id;

  const playlist = await Playlist.find({
    owner: userId,
    visibility: { $ne: "auto" },
  })
    .skip(+page * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found!" });
  }

  const data = playlist.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.json({
    playlist: data,
  });
};

export const getAudios: RequestHandler = async (req, res) => {
  const { page = "0", limit = "20" } = req.query as {
    page: string;
    limit: string;
  };

  const userId = req.user.id;
  const playlistId = req.params.playlistId;

  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ error: "Invalid playlist id!" });
  }

  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: userId,
  }).populate<{ items: PopulatedFavList[] }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playlist) return res.status(404).json({ error: "Playlist not found!" });

  const audios = playlist?.items.map((audio) => {
    return {
      id: audio._id,
      title: audio.title,
      category: audio.category,
      owner: {
        name: audio.owner.name,
        id: audio.owner._id,
      },
      file: audio.file.url,
      poster: audio.poster?.url,
    };
  });

  return res.json({
    list: { id: playlist._id, title: playlist.title, audios },
  });
};
