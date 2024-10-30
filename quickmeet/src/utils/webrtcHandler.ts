import { userObject } from "../pages/Meet";
import { room } from "../redux/roomReducer";

const updateUserList = (data: userObject, users: userObject) => {
  Object.keys(data).forEach((socketId) => {
    // logic when some one reloads
    Object.keys(users).forEach((user) => {
      const { username, userType, userID } = users[user];
      const { username: uname, userType: uType, userID: uID } = data[socketId];
      if (
        username === uname &&
        userType === uType &&
        userID === uID &&
        user !== socketId
      ) {
        // deleting the old one.
        delete users[user];
        // adding the new one
        users[socketId] = data[socketId];
      }
    });

    if (!(socketId in users)) {
      // console.log(socketId);
      users[socketId] = data[socketId];
    }
  });

  console.log(users);
};

const getCurrentUser = async (users: userObject, roomDetails: room) => {
  let you;

  Object.keys(users).forEach((user) => {
    const { username, userType, userID } = users[user];

    if (
      userID === roomDetails.userID &&
      username === roomDetails.username &&
      userType === roomDetails.userType
    ) {
      you = user;
    }
  });

  return you;
};

export { updateUserList, getCurrentUser };
