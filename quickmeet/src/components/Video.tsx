/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import CamOn from "../assets/images/camon.svg?react";
import CamOff from "../assets/images/camOff.svg?react";
import MicOn from "../assets/images/micOn.svg?react";
import MicOff from "../assets/images/micOff.svg?react";
import FullScreen from "../assets/images/fullscreen.svg?react";
import getMediaAccess from "../utils/getMediaAccess";
import { v4 as uuid } from "uuid";

//export getMediaAccess and use it on the load of meeting page(put it in utils folder)
function Video({
  id,
  localStream,
  setLocalStream,
  autoRun,
}: {
  id: string | null | undefined;
  localStream: MediaStream | null;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  autoRun: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [screenWidth, setScreenWidth] = useState<null | number>(null);
  const [cam, setCam] = useState<boolean | null>(null);
  const [audio, setAudio] = useState<boolean | null>(null);
  const videoRef = useRef<null | HTMLVideoElement>(null);

  [id] = useState(id != null ? id : uuid());

  //gets the userMedia
  useEffect(() => {
    if (localStream && autoRun == false) {
      setCam(() => {
        return localStream.getTracks().some((track) => track.kind === "video");
      });
      setAudio(() => {
        return localStream.getTracks().some((track) => track.kind === "audio");
      });
      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }
    }
    //make it into a function and export it
    //responsive video
    // const updateScreenWidth = () => {
    //   setScreenWidth(window.innerWidth);
    // };
    // window.addEventListener("resize", updateScreenWidth);
    // pass input,cam,audio as arguments
    if (autoRun == true) {
      getMediaAccess({ input: "all", cam: cam, audio: audio }).then(
        (MediaStream) => {
          if (typeof MediaStream != "boolean") {
            setLocalStream(MediaStream);

            if (videoRef.current) {
              videoRef.current.srcObject = localStream;
            }
          }

          setCam(true);
          setAudio(true);
        }
      );
    }

    // clean up event listener
    return () => {
      // window.removeEventListener("resize", updateScreenWidth);
    };
  }, [screenWidth]);

  // clean up media tracks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  function toggleAudio() {
    if (audio && localStream) {
      const modifiedStream = localStream.clone();
      modifiedStream.getAudioTracks().forEach((track) => {
        track.stop();
        modifiedStream.removeTrack(track);
      });
      setLocalStream(() => {
        return modifiedStream;
      });
      setAudio(false);
    } else {
      getMediaAccess({ input: "audio", cam: cam, audio: audio }).then(
        (MediaStream) => {
          if (typeof MediaStream != "boolean") {
            setLocalStream(() => {
              return MediaStream;
            });
            if (videoRef.current) {
              videoRef.current.srcObject = localStream;
            }
          }

          setAudio(true);
        }
      );
    }
  }

  function toggleCam() {
    if (cam && localStream) {
      const modifiedStream = localStream.clone();
      modifiedStream.getVideoTracks().forEach((track) => {
        track.stop();
        modifiedStream.removeTrack(track);
      });
      setLocalStream(() => {
        return modifiedStream;
      });

      setCam(false);
    } else {
      getMediaAccess({ input: "video", cam: cam, audio: audio }).then(
        (MediaStream) => {
          if (typeof MediaStream != "boolean") {
            setLocalStream(() => {
              return MediaStream;
            });
            if (videoRef.current) {
              videoRef.current.srcObject = localStream;
            }
          }
          setCam(true);
        }
      );
    }
  }

  function toggleFullscreen() {
    const video = document.querySelector<HTMLVideoElement>(".localCam");
    if (document.fullscreenElement) {
      // If fullscreen is active, exit fullscreen
      document.exitFullscreen();
    } else {
      // If fullscreen is not active, request fullscreen
      if (video != null) {
        video.requestFullscreen();
        video.controls = false;
      }
    }
  }

  return (
    <div className="relative localCam h-full w-full  object-cover">
      <video
        ref={videoRef}
        playsInline={true}
        autoPlay={true}
        className=" h-full w-full"
        controls={false}
      ></video>

      <div className="absolute flex w-full bottom-0 justify-between black-gradient-hover">
        <div>
          <button className=" bg-transparent text-white  " onClick={toggleCam}>
            {cam ? <CamOn /> : <CamOff />}
          </button>
          <button className="   bg-transparent" onClick={toggleAudio}>
            {audio ? <MicOn /> : <MicOff />}
          </button>
        </div>
        <button className=" bg-transparent  " onClick={toggleFullscreen}>
          <FullScreen />
        </button>
      </div>
      <div className="absolute top-1 left-3 text-xl text-white">you</div>
    </div>
  );
}
export default Video;
