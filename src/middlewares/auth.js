const adminAuth = (req, res, next) => {
  console.log("auth getting checked");
  const token = "xyz";
  const isAdminAuthenitcated = token === "xyz";
  if (!isAdminAuthenitcated) {
    res.status(401).send("unauthorised request");
  } else {
    next();
  }
};

module.exports = { adminAuth };
