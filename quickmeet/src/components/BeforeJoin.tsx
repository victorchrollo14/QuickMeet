import React, { Dispatch, SetStateAction } from "react";
import Navbar from "./Navbar";
import Video from "./Video";
import { Link } from "react-router-dom";
import { joinStatus } from "../pages/Meet";

interface Props {
  localStream: MediaStream | null;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  join: () => void;
  error: string;
  joinStatus: joinStatus;
}

const BeforeJoin: React.FC<Props> = ({
  localStream,
  setLocalStream,
  error,
  joinStatus,
  join,
}) => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <section className="pt-0 mt-0 flex flex-col items-center justify-center">
        <div className="  ">
          <div className="relative localCam h-[60vh] bg-black">
            <Video
              id={null}
              localStream={localStream}
              setLocalStream={setLocalStream}
              autoRun={true}
            />
          </div>
          {error && (
            <div className="mt-[30px] text-center  text-black">
              <p className="text-center text-2xl">{error}</p> <br />
              <Link to={"/"}>
                <button className="bg-red-500 text-white">Back</button>
              </Link>
            </div>
          )}
          {joinStatus === "joined" && (
            <div className="mt-[30px] flex justify-center">
              <button
                onClick={join}
                className="bg-green   text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white"
              >
                join room
              </button>
            </div>
          )}
          {joinStatus === "loading" && (
            <div className="text-center">
              <h2 className="text-2xl text-black ">Getting Ready....</h2>
              <p>You'll be able to join in a moment</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BeforeJoin;
