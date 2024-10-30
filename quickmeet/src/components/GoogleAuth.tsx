import { getGoogleUrl } from "../utils/getGoogleUrls";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const token = localStorage.getItem("google-token");
  const url = getGoogleUrl();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const URL = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${URL}/user/login?code=${code}`);
      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("google-token", data.token);
        const token = localStorage.getItem("google-token");
        if (token != null) {
          try {
            const response = await fetch(`${URL}/user/me`, {
              headers: { Authorization: token },
            });

            const data = await response.json();
            if (response.status === 200) {
              localStorage.removeItem("guestInformation");
              localStorage.setItem("userInformation", JSON.stringify(data));
            } else if (response.status === 500 || response.status === 400) {
              console.log(data.error);
            }
          } catch (error) {
            console.log(error);
          }
        }
        navigate("/");
      } else if (response.status === 500 || response.status === 400) {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    // remove token from local storage
    localStorage.removeItem("google-token");
    localStorage.removeItem("roomDetails");
    localStorage.removeItem("userInformation");

    console.log("loged out");
    console.log("hello");
  };

  useState(() => {
    if (code && !token) {
      handleLogin();
    }
  });
  return (
    <>
      {token ? (
        <a
          href="/"
          onClick={logout}
          className="py-[10px] px-[50px] tablet:px-[30px] hover:cursor-pointer mobile:text-white border-purple border-2 rounded-[8px] "
        >
          logout
        </a>
      ) : (
        <a
          href={url}
          className="py-[10px] px-[50px] tablet:px-[30px] mobile:px-0 mobile:text-white tablet:py-[4px] border-purple border-2 rounded-[8px] "
        >
          Sign in
        </a>
      )}
    </>
  );
};

export { GoogleAuth };
