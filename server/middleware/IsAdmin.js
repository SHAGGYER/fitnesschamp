exports.IsAdmin = (req, res, next) => {
  if (res.locals.userRole !== "Admin") {
    return res.status(403).send({ error: "Ikke Admin" });
  }

  next();
};
