const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const _ = require("lodash");
const { User } = require("../models/user");

const schema = Joi.object({
  email: Joi.string()
    .email()
    .min(5)
    .max(250)
    .required(),
  password: Joi.string()
    .required()
    .min(5)
    .max(1200)
});

function validate(req) {
  return schema.validate(req);
}
async function postAuth(body) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  let user = await User.findOne({ email: body.email });
  if (!user)
    return { error: { msg: "Incorrect email or  password", status: 400 } };

  const passwordValid = await bcrypt.compare(body.password, user.password);
  if (!passwordValid)
    return { error: { msg: "Incorrect email or  password", status: 400 } };

  const token = user.generateAuthToken();
  return token;
}
async function deleteUser(id) {
  const user = await User.findByIdAndRemove(id);
  if (!user)
    return {
      error: { msg: "The user with the given ID was not found", status: 404 }
    };
  return user;
}

exports.postAuth = postAuth;
exports.deleteUser = deleteUser;
