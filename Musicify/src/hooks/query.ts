import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';
import {getClient} from './../api/client';

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Fetches latest audios from server.
 * @returns {Promise<AudioData[]>} Resolves with array of latest audios.
 * @throws {Error} If request fails.
 */
/*******  37595690-2dba-4d64-8985-04d848e088e0  *******/ const fetchLatestAudios =
  async (): Promise<AudioData[]> => {
    const client = await getClient();
    const res = await client('/audio/latest');
    return res.data.audios;
  };

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['latest-audios'], {
    queryFn: () => fetchLatestAudios(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchRecommendedAudios = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const res = await client('/profile/recommended');
  return res.data.audios;
};

export const useFetchRecommendedtAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['recommended'], {
    queryFn: () => fetchRecommendedAudios(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
};

const fetchPlaylists = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const res = await client('/playlist/by-profile');
  return res.data.playlist;
};

export const useFetchPlaylists = () => {
  const dispatch = useDispatch();
  return useQuery(['playlist'], {
    queryFn: () => fetchPlaylists(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    },
  });
};
