import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './index';

type NotificationType = 'error' | 'success';

interface Notification {
  message: string;
  type: NotificationType;
}

const initialState: Notification = {
  message: '',
  type: 'error',
};

const slice = createSlice({
  initialState,
  name: 'notification',
  reducers: {
    updateNotification(
      notificationState,
      {payload}: PayloadAction<Notification>,
    ) {
      notificationState.message = payload.message;
      notificationState.type = payload.type;
    },
  },
});

export const getNotificationState = (state: RootState) => state.notification;

export const {updateNotification} = slice.actions;

export default slice.reducer;
