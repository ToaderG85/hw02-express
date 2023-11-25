const User = require("./schemas/userSchema");

const register = ({ email, password, subscription }) => {
 const newUser = new User({ email, password, subscription });
 newUser.hashPassword(password);
 return newUser.save();
};

const getUser = async ({ email }) => {
 return User.findOne({ email }).select("+password +subscription");
};

const getUserById = (userId) => User.findById(userId);

const updateUser = (userId, body) => User.findByIdAndUpdate(userId, body);

module.exports = {
 getUser,
 getUserById,
 updateUser,
 register,
};