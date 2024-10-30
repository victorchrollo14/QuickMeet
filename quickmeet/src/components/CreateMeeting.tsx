import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { SetRoom } from "../redux/roomReducer";

const CreateMeeting = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const googleToken = localStorage.getItem("google-token");
  const navigate = useNavigate();

  let response;
  let params = {};
  const dispatch = useAppDispatch();

  const createMeet = async () => {
    if (
      googleToken != null &&
      localStorage.getItem("userInformation") != null
    ) {
      const userInformation = JSON.parse(
        localStorage.getItem("userInformation") || ""
      );
      params = {
        method: "POST",
        headers: {
          authorization: googleToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userInformation["user_id"] }),
      };
    } else {
      params = { method: "POST" };
    }

    try {
      response = await fetch(url + "/meet/create", params);
    } catch (error) {
      console.log(error);
      return;
    }
    const data = await response.json();

    if (data.roomID) {
      if (data.userType === "guest")
        localStorage.setItem(
          "guestInformation",
          JSON.stringify({
            guest_id: data.userID,
            userType: data.userType,
            username: data.username,
          })
        );

      //   localStorage.setItem("roomDetails", JSON.stringify(data));

      dispatch(SetRoom(data));
      console.log("room", data);

      navigate(`/meet/${data.roomID}`);
    }
  };

  return (
    <>
      <button
        onClick={createMeet}
        className="bg-green  text-[14px] tablet:text-[12px] tablet:px-[10px] px-[18px] py-[11px] text-white"
      >
        New Meeting
      </button>
    </>
  );
};
export default CreateMeeting;
