import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import client from 'src/api/client';
import {updateNotification} from 'src/store/notification';

const fetchLatestAudios = async (): Promise<AudioData[]> => {
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
