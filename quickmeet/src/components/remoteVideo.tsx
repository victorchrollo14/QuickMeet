import { useRef, useEffect } from "react";

import CamOn from "../assets/images/camon.svg?react";
import CamOff from "../assets/images/camOff.svg?react";
import MicOn from "../assets/images/micOn.svg?react";
import MicOff from "../assets/images/micOff.svg?react";

interface props {
  remoteStream: MediaStream | null;
}

const RemoteVideo = ({ remoteStream }: props) => {
  const videoRef = useRef<null | HTMLVideoElement>(null);

  const video = remoteStream?.getVideoTracks().some((track) => track.enabled);
  const audio = remoteStream?.getAudioTracks().some((track) => track.enabled);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [videoRef, remoteStream]);

  return (
    <>
      <div className="remote-video relative w-full h-full object-cover">
        <video
          ref={videoRef}
          playsInline={true}
          autoPlay={true}
          controls={false}
          className="w-full h-full bg-black"
        ></video>
        <div className="absolute flex w-full bottom-0 justify-between black-gradient-hover">
          <div className="flex flex-row gap-2 m-2">
            {video ? <CamOn /> : <CamOff />}
            {audio ? <MicOn /> : <MicOff />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoteVideo;
