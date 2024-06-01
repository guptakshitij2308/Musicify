import { paginationQuery } from "#/@types/misc";
import History, { historyType } from "#/models/history";
import { RequestHandler } from "express";

export const updateHistory: RequestHandler = async (req, res) => {
  const userId = req.user.id;

  const oldHistory = await History.findOne({ owner: userId });

  const { audio, progress, date } = req.body;
  const history: historyType = { audio, progress, date };

  if (!oldHistory) {
    await History.create({
      owner: userId,
      last: history,
      all: [history],
    });
    return res.json({ success: true });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const histories = await History.aggregate([
    {
      $match: { owner: userId },
    },
    {
      $unwind: "$all",
    },
    {
      $match: {
        "all.date": {
          $gte: todayStart,
          $lt: todayEnd,
        },
      },
    },
    {
      $project: {
        _id: 0,
        audio: "$all.audio",
      },
    },
  ]);

  const sameDayHistory = histories.find((item) => {
    if (item.audio.toString() === audio) return item;
  });

  if (sameDayHistory) {
    await History.findOneAndUpdate(
      { owner: userId, "all.audio": audio },
      {
        $set: {
          "all.$.progress": progress,
          "all.$.date": date,
        },
      }
    );
  } else {
    await History.findByIdAndUpdate(oldHistory._id, {
      $push: {
        all: {
          $each: [history],
          $position: 0,
        },
      },
      $set: { last: history },
    });
  }

  res.json({ success: true });
};

export const deleteHistory: RequestHandler = async (req, res) => {
  // '/history?histories=["123","456"]&all=yes'
  //    audioId will be received as parameters

  const removeAll = req.query.all === "yes";
  const userId = req.user.id;

  if (removeAll) {
    await History.findOneAndDelete({ owner: userId });
    return res.json({ success: true });
  }

  const histories = req.query.histories as string;
  const ids = JSON.parse(histories) as string[];

  await History.findOneAndUpdate(
    { owner: userId },
    {
      $pull: {
        all: { _id: ids },
      },
    }
  );

  return res.json({ success: true });
};

export const getHistory: RequestHandler = async (req, res) => {
  // date : 1 => all histories corresponding to that
  // date : 2 => all histories corresponding to that

  const userId = req.user.id;
  const { limit = "20", page = "0" } = req.query as paginationQuery;

  const histories = await History.aggregate([
    {
      $match: { owner: userId },
    },
    {
      $project: {
        all: {
          $slice: ["$all", +page * +limit, +limit], // similar to slice of array
        },
      },
    },
    {
      $unwind: "$all",
    },
    {
      $lookup: {
        from: "audios",
        localField: "all.audio",
        foreignField: "_id",
        as: "audioInfo",
      }, // similar to populate
    },
    {
      $unwind: "$audioInfo",
    },
    {
      $project: {
        _id: 0,
        id: "$all._id",
        audioId: "$audioInfo._id",
        date: "$all.date",
        title: "$audioInfo.title",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },
        audios: { $push: "$$ROOT" }, // $$ROOT is used to push everything we are getting from the result of the previous stage
      },
    },

    {
      $project: {
        _id: 0,
        id: "$id",
        date: "$_id",
        audios: "$$ROOT.audios",
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ]);

  res.json({ histories });
};

export const getRecentlyPlayed: RequestHandler = async (req, res) => {
  const userId = req.user.id;

  const match = {
    $match: { owner: userId },
  };

  const sliceMatch = {
    $project: {
      myHistory: { $slice: ["$all", 10] },
    },
  };

  const dateSort = {
    $project: {
      histories: {
        $sortArray: {
          input: "$myHistory",
          sortBy: {
            date: -1,
          },
        },
      },
    },
  };

  const unwindWithIndex = {
    // $unwind: "$histories", // here we cannot get the benefit of indexes as indexes are messed up
    $unwind: { path: "$histories", includeArrayIndex: "index" }, // using this we can get performance optimization in case of large amount of data
  };

  const audioLookup = {
    $lookup: {
      from: "audios",
      localField: "histories.audio",
      foreignField: "_id",
      as: "audioInfo",
    },
  };

  const unwindAudioInfo = {
    $unwind: {
      path: "$audioInfo",
    },
  };

  const userLookup = {
    $lookup: {
      from: "users",
      localField: "audioInfo.owner",
      foreignField: "_id",
      as: "owner",
    },
  };

  const unwindUserLookup = {
    $unwind: {
      path: "$owner",
    },
  };

  const projectAudioInfo = {
    $project: {
      _id: 0,
      id: "$audioInfo._id",
      title: "$audioInfo.title",
      about: "$audioInfo.about",
      category: "$audioInfo.category",
      file: "$audioInfo.file.url",
      poster: "$audioInfo.poster.url",
      owner: {
        name: "$owner.name",
        id: "$owner._id",
      },
      date: "$histories.date",
      progress: "$histories.progress",
      index: "$index",
    },
  };

  const audios = await History.aggregate([
    match,
    sliceMatch,
    dateSort,
    unwindWithIndex,
    audioLookup,
    unwindAudioInfo,
    userLookup,
    unwindUserLookup,
    projectAudioInfo,
  ]);

  res.json({ audios });
};
