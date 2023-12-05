const { getUser, updateUser, register,verifyUserEmail } = require("../services/authIndex");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Jimp = require('jimp');

const fs = require("fs");
const path = require("path");


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

   if (!user.verify) {
    throw new Error("Trebuie sa iti verifici contul de email!");
  }
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


const updateAvatar = async (req, res, next) => {

  try {
    if (!req.file) {
      return res.status(404).json({ error: "Nu exista fisier de incarcat!" });
    }

    const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(
      req.file.originalname
    )}`;

    const destinationPath = path.join(
      __dirname,
      `../public/avatars/${uniqFilename}`
    ); 

   
    await Jimp.read(req.file.path)
      .then((image) => {
        return image
          .resize(350, 350)
          .quality(60)
          .greyscale()
          .writeAsync(destinationPath);
      })
      .then(() => {
        fs.unlinkSync(req.file.path);
      })
      .catch((error) => {
        throw error; 
      });

    req.user.avatarUrl = `/avatars/${uniqFilename}`;

    await req.user.save(); 

    res.status(200).json({ avatarUrl: req.user.avatarUrl }); 
  } catch (error) {
    res.status(404).json({ error: error.message }); 
    next(error);
  }
};

const verifyEmail = async (req,res, next)=>{
  try {
    const { verificationToken } = req.params;

    await verifyUserEmail(verificationToken)

    res.status(200).json({message: "Email verified succesfully", code: 200});

  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    })
  }
}

module.exports = {
 currentUser,
 signup,
 login,
 logout,
 updateAvatar,
 verifyEmail
};