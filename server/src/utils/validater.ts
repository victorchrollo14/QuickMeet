import { joinParameters } from "../controllers/joinController";

const ValidateParams = (params: joinParameters) => {
  const { roomID, userID, userType, roomType, role, username, meetingID } =
    params;
  const userTypeValues = ["guest", "registered"];
  const roleTypeValues = ["host", "attendee"];
  const roomTypeValues = ["public", "private"];

  if (!roomID || !userID || !meetingID || !username) {
    return {
      isValid: false,
      error: "roomID, userID, meetingID or username cannot be null",
    };
  }

  if (!userTypeValues.includes(userType)) {
    return {
      isValid: false,
      error: "Invalid or Missing argument for `userType`",
    };
  }

  if (!roleTypeValues.includes(role)) {
    return {
      isValid: false,
      error: "Invalid or Missing Argument For `role`",
    };
  }

  if (!roomTypeValues.includes(roomType)) {
    return {
      isValid: false,
      error: "Invalid or Missing Argument for `roomType`",
    };
  }

  return { isValid: true };
};

export { ValidateParams };
