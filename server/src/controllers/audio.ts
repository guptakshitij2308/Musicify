import { PopulatedFavList } from "#/@types/audio";
import { paginationQuery } from "#/@types/misc";
import cloudinary from "#/cloud";
import { RequestWithFiles } from "#/middleware/fileParser";
import Audio from "#/models/audio";
import { RequestHandler } from "express";
import formidable from "formidable";

interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: string;
  };
}

export const createAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const userId = req.user.id;
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const audioFile = req.files?.file as formidable.File;

  if (!audioFile) {
    return res.status(422).json({ error: "Please upload audio files first." });
  }

  const audioRes = await cloudinary.uploader.upload(audioFile.filepath, {
    resource_type: "video",
  });

  const newAudio = new Audio({
    title,
    about,
    category,
    owner: userId,
    file: {
      url: audioRes.secure_url,
      publicId: audioRes.public_id,
    },
  });

  if (poster) {
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      gravity: "face",
      crop: "thumb",
    });

    newAudio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await newAudio.save();

  res.status(201).json({
    audio: {
      title,
      about,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
      category,
    },
  });
};

export const updateAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const userId = req.user.id;
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const id = req.params.audioId;

  // console.log(id);

  const audio = await Audio.findOneAndUpdate(
    { owner: userId, _id: id },
    { title, category, about },
    { new: true }
  );

  if (!audio) {
    return res.status(404).json({ error: "No such audio found." });
  }

  if (poster) {
    if (audio.poster?.publicId) {
      await cloudinary.uploader.destroy(audio.poster.publicId);
    }

    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      gravity: "face",
      crop: "thumb",
    });

    audio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };

    await audio.save();
  }

  res.status(201).json({
    audio: {
      title,
      about,
      file: audio.file.url,
      poster: audio.poster?.url,
      category,
    },
  });
};

export const getLatestUploads: RequestHandler = async (req, res) => {
  const uploads = await Audio.find()
    .limit(10)
    .sort({ createdAt: -1 })
    .populate<PopulatedFavList>("owner");

  const audios = uploads.map((upload) => {
    return {
      id: upload._id,
      title: upload.title,
      about: upload.about,
      category: upload.category,
      file: upload.file.url,
      poster: upload.poster?.url,
      owner: { name: upload.owner.name, id: upload.owner._id },
    };
  });

  res.json({ audios });
};
