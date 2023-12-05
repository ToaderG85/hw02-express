const { getUser, getUserByEmail, updateUser, sendEmail, register,verifyUserEmail } = require("../services/authIndex");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Jimp = require('jimp');

const fs = require("fs");
const path = require("path");
const secret = process.env.SECRET;


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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await getUser({
      email,
      password,
    });

    const payload = { email: result.email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(201).json({
      status: "succes",
      code: 201,
      data: {
        email: result.email,
        token,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      error: error.message,
    });
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
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
     return res.status(400).json({ message: "Missing required field: email" });
    }
    const user = await getUserByEmail({ email });
  
    if (!user) {
     return res.status(404).json({ message: "Email not found" });
    }
    if (user.verify) {
     return res.status(400).json({ message: "Verification has already been passed" });
    }
    const verificationToken = nanoid();
    const verifyEmail = {
     to: email,
     from: "gtdinamo@gmail.com",
     subject: "Verify email!",
     text: `Your verification code is ${verificationToken} / http://localhost:5000/api/users/verify/${verificationToken}`,
    };
  
    await sendEmail(verifyEmail);
    res.json({
     message: "Verification email sent",
    });
   } catch (error) {
    next(error);
   }
}

module.exports = {
 currentUser,
 signup,
 login,
 logout,
 updateAvatar,
 verifyEmail,
 resendVerifyEmail
};