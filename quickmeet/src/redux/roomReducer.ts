/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
export interface room {
  meetingID: string | null;
  messages: [] | null;
  roomID: string | null;
  roomType: string | null;
  userID: string | null;
  userType: string | null;
  role: string | null;
  username: string | null;
}
const initialState: room = {
  meetingID: null,
  messages: null,
  roomID: null,
  roomType: null,
  userID: null,
  userType: null,
  role: null,
  username: null,
};
export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    SetRoom: (state, action) => {
      //   console.log("room", action.payload);
      return { ...state, ...action.payload };
    },
    DeleteRoom: () => {
      return {
        meetingID: null,
        messages: null,
        roomID: null,
        roomType: null,
        userID: null,
        userType: null,
        role: null,
        username: null,
      };
    },
  },
});
export const { SetRoom, DeleteRoom } = roomSlice.actions;
export default roomSlice.reducer;
