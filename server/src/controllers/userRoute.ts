const googleAuth = async (req, res) => {
  try {
    const code  = req.query.code;
    console.log(code);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export { googleAuth };
