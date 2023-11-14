import { useState } from "react";
import "./App.css";
import { getGoogleUrl } from "./utils/getGoogleUrl";

function App() {
  const [success, setSuccess] = useState();
  const url = getGoogleUrl();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  const redirect = () => {
    setInterval(() => {
      window.location.href = "/";
    }, 3000);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/login?code=${code}`
      );
      const data = await response.json();

      if (response.status === 200) {
        console.log(data.token);
        setSuccess(data.message);
        redirect();
      } else if (response.status === 500 || response.status === 400) {
        alert(data.error);
        redirect();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useState(() => {
    if (code) {
      console.log(code);
      handleLogin();
    }
  });

  return (
    <>
      <div>{success && success}</div>
      <button>
        {" "}
        <a href={url}>Login with Google</a>
      </button>
      {/* <img
        src="https://lh3.googleusercontent.com/a/ACg8ocK5LcRD9l_o7L0StD8P1vVkw0M2BJoFToOmByi3tWjR=s96-c"
        alt="profile image"
        referrerPolicy="no-referrer"
      /> */}
    </>
  );
}

export default App;
