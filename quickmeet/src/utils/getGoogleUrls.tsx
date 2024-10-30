const getGoogleUrl = () => {
  const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
  console.log(REDIRECT_URL);
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const options = {
    redirect_uri: `${REDIRECT_URL}/auth/google`,
    client_id:
      "238790933380-ldhndr6th0pbmc35ll7vkll2ft4ujdvq.apps.googleusercontent.com",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export { getGoogleUrl };
