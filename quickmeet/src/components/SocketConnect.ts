import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { SetRoom } from "../redux/roomReducer";
import { room } from "../redux/roomReducer";
import { joinStatus } from "../pages/Meet";

type guestUser = {
  guest_id: string;
  username: string;
  userType: string;
};

export default async function SocketConnect(
  setSocket: (socket: Socket | null) => void,
  setError: (error: string) => void,
  setJoinStatus: (joinStatus: joinStatus) => void
) {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const [guestUser, setGuestUser] = useState<guestUser>(() => {
    const guest = JSON.parse(
      localStorage.getItem("guestInformation") || "null"
    );
    if (guest) return guest;
  });

  const googleToken = localStorage.getItem("google-token");
  const roomDetails: room = useAppSelector((state) => state.room);
  const dispatch = useAppDispatch();

  const roomID = params.id;
  let userType: string, userID: string, username: string;

  const createGuest = async () => {
    const response = await fetch(`${URL}/user/createGuest`);
    const data = await response.json();
    data["userType"] = "guest";
    // console.log({ guest: data });
    localStorage.setItem("guestInformation", JSON.stringify(data));
    setGuestUser({ ...data });
  };

  if (googleToken) {
    const user = JSON.parse(localStorage.getItem("userInformation") || "null");
    userType = "registered";
    userID = user.user_id;
    username = user.username;
  } else if (guestUser) {
    userType = "guest";
    username = guestUser.username;
    userID = guestUser.guest_id;
  }

  useEffect(() => {
    if (!googleToken && !guestUser) {
      createGuest();
    }
  });

  useEffect(() => {
    const s = io(URL);
    s.on("connect", () => {
      setSocket(s);

      if (roomDetails.roomID === null && (googleToken || guestUser)) {
        s.emit("get-room", { roomID, userType, userID, username });
        s.on("get-room", (roomDetails) => {
          // console.log(roomDetails);
          dispatch(SetRoom(roomDetails));
        });
      } else if (roomDetails.roomID !== null) {
        const {
          userID,
          meetingID,
          roomType,
          role,
          userType,
          username,
          roomID,
        } = roomDetails;
        s.emit("join", {
          userID,
          meetingID,
          roomType,
          role,
          userType,
          username,
          roomID,
        });

        s.on("join", (params) => {
          params.ok && setJoinStatus("joined");
        });

        s.on("error", (params) => {
          setError(params.error);
          setJoinStatus("error");
        });
        return () => s.disconnect();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomDetails, guestUser]);
}
