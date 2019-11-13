const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");

async function getMe(id) {
  return await User.findById(id).select("-password");
}

async function postUser(body) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  let user = await User.findOne({ email: body.email });
  if (user)
    return {
      error: { msg: "Used with this email is already registered", status: 400 }
    };
  user = new User(_.pick(body, ["name", "email", "isAdmin", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  return user.generateAuthToken();
}
exports.getMe = getMe;
exports.postUser = postUser;
