const checkAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  next();
};

export{
  checkAdmin
}
