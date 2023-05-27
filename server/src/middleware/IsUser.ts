export const IsUser = (_req, res, next) => {
  if (!res.locals.userId) {
    return res.status(403).send({ error: "NOT_AUTHENTICATED" });
  }

  return next();
};
