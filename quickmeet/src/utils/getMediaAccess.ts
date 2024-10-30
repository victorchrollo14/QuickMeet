export default async function getMediaAccess({input,cam,audio}:{input:string,cam:boolean | null,audio:boolean | null}){
    if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        let requestedMedia = null
        const screenWidth = window.innerWidth
        if (input == "audio"){
          if(cam == true){
            requestedMedia = {audio:true,video: {
              facingMode: "user",
              width: screenWidth || 883,
              height: { min: 402 },
            }}
          }else{
            requestedMedia={audio: true}
          }
        }else if(input == "video"){
          if(audio ==true){
            requestedMedia = {audio:true,video: {
              facingMode: "user",
              width: screenWidth || 883,
              height: { min: 402 },
            }}
          }else{
            requestedMedia = {video: {
             facingMode: "user",
             width: screenWidth || 883,
             height: { min: 402 },
           }}
          }
        }else{
          requestedMedia = {
            audio: true,
            video: {
              facingMode: "user",
              width: screenWidth || 883,
              height: { min: 402 },
            },
          }
        }
        let mediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(requestedMedia);
          //return the media stream
          
        } catch (error) {
          
          console.error(error);
          return false
        }
        return mediaStream
      }
      //return the data instead of setting it manually 
      return false
    
}