const User = require("./schemas/userSchema");
const sgMail = require("@sendgrid/mail");
const {nanoid} = require("nanoid");

const register = async ({ email, password, subscription }) => {
  try {
    const existingUser = await User.findOne({email});
    if(existingUser) {
      throw new Error("This email allready exists!")
    };
    
    const uniqueVerificationCode = nanoid();

    const msg = {
      to: email,
      from: "gtdinamo@gmail.com",
      subject: "Email de verificare cont.",
      text: `Codul de verificare este ${uniqueVerificationCode}/http://localhost:5000/api/users/verify/${uniqueVerificationCode}`,
    };
    
    sgMail
    .send(msg)
    .then(() => console.log("Email trimis"))
    .catch((err) => {
      console.log(err);
      throw new Error("Eroare la trimitere");
    });;

    const newUser = new User({ email, password, subscription, verificationToken: uniqueVerificationCode });
    newUser.hashPassword(password);
    return newUser.save();

  } catch (error) {
    throw error;
  }
};

const getUser = async ({ email, password }) => {
 try {
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new Error("Email sau parola gresita!");
  }

  if (!user.verify) {
    throw new Error("Trebuie sa iti verifici contul de email!");
  }
  return user;

  
 } catch (error) {
  throw error;
 }
};

const getUserById = (userId) => User.findById(userId);

const updateUser = (userId, body) => User.findByIdAndUpdate(userId, body);

const verifyUserEmail = async (verificationToken) => {
  try {
    const update = { verify: true, verificationToken: null }

    const result = await User.findOneAndUpdate(
      { verificationToken }, 
      { $set: update },
      { new: true },
      );

      if(!result) throw new Error ("User not found")
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
 getUser,
 getUserById,
 updateUser,
 register,
 verifyUserEmail
};