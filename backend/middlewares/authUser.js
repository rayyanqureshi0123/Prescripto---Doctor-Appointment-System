import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized, login again" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // optionally attach to req if needed
    req.user = { id: decoded.id }; 

    // ✅ allow frontend to send userId in body, so we don’t override it
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
