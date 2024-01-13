import { Socket } from "socket.io";
import { createGuest } from "../DatabaseAPI/user.api";
import { Request, Response } from "express";

const handleGuest = async (req: Request, res: Response) => {
  try {
    const data = await createGuest();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { handleGuest };
