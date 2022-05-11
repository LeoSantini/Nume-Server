module.exports = (req, res, next) => {
  if (req.currentUser.role === "ADMIN") {
    return next();
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
