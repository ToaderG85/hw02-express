const passport = require("passport");

module.exports = async (req, res, next) => {
 try {
  await passport.authenticate("jwt", { session: false }, (error, user) => {
   if (error || !user) {
    return res.status(401).json({
     status: "Unauthorized",
     code: 401,
     message: "Unauthorized",
    });
   }
   req.user = user;
   next();
  })(req, res, next);
 } catch (error) {
  console.error("Authentication error:", error);
  return res.status(500).json({
   status: "Internal Server Error",
   code: 500,
   message: "Internal Server Error",
  });
 }
};