import "dotenv/config.js";

const googleAuth = async (req, res) => {
  try {
    const code = req.query.code;
    console.log(code);

    const { access_token } = await getAccessToken(code);

    // get user data
    const googleUser = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await googleUser.json();
    console.log(data);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

// get access token
const getAccessToken = async (code: string) => {
  try {
    const URL = "https://oauth2.googleapis.com/token";
    const values = {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:5173/auth/google",
      grant_type: "authorization_code",
    };
    const params = new URLSearchParams(values);

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export { googleAuth };
