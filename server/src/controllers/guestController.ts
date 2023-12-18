import { Socket } from "socket.io";
import { createGuest } from "../DatabaseAPI/user.api";

const handleGuest = async (socket: Socket) => {
  try {
    const data = await createGuest();
    console.log(data);
    return socket.emit("create-guest", data);
  } catch (err) {
    throw new Error(err);
  }
};

export { handleGuest };
