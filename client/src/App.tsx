import { useState } from "react";
import "./App.css";
import { getGoogleUrl } from "./utils/getGoogleUrl";

function App() {
  // const clientSecret = "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";
  const url = getGoogleUrl();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/login?code=${code}`
      );
      const data = await response.json();
      console.log(data);
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
      <button>
        {" "}
        <a href={url}>Login with Google</a>
      </button>
    </>
  );
}

export default App;
