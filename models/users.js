const { getUser, updateUser, register } = require("../services/authIndex");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const currentUser = async ({ user: { email, subscription } }, res, next) => {
 try {
  return res.json({
   status: "Success",
   code: 200,
   data: {
    result: { email, subscription },
   },
  });
 } catch (error) {
  next(error);
 }
};

const signup = async ({ body: { email, password } }, res, next) => {
 try {
  const user = await getUser({ email });
  if (user) {
   return res.status(409).json({
    status: "Conflict",
    code: 409,
    message: "Email in use",
   });
  }

  const results = await register({ email, password });

  return res.status(201).json({
   status: "Created",
   code: 201,
   data: { email: results.email, subscription: results.subscription },
  });
 } catch (error) {
  next(error);
 }
};

const login = async ({ body: { email, password } }, res, next) => {
 try {
  const user = await getUser({ email });

  if (!user || !user.comparePassword(password)) {
   return res.status(400).json({
    status: "Unauthorized",
    code: 401,
    message: "Email or password is wrong",
   });
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET);
  await updateUser(user._id, { token });

  return res.json({
   status: "Success",
   code: 200,
   data: {
    token,
    email: user.email,
    subscription: user.subscription,
   },
  });
 } catch (error) {
  next(error);
 }
};
const logout = async ({ user: { id } }, res, next) => {
 try {
  await updateUser(id, { token: null });

  return res.json({
   status: "Success",
   code: 204,
  });
 } catch (error) {
  next(error);
 }
};

module.exports = {
 currentUser,
 signup,
 login,
 logout,
};