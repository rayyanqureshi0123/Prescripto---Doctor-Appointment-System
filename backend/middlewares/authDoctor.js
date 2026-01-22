import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = (req, res, next) => {
  try {
    // Get token either from Authorization header or dtoken (for fallback)
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.headers.dtoken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized Login Again" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach doctor ID to request
    req.docId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }
};

export default authDoctor;
