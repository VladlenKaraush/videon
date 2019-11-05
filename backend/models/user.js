const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 250
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1200 },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  console.log("token generated");
  console.log(this);
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      name: this.name,
      email: this.email
    },
    config.get("jwt_private_key")
  );
};

const User = mongoose.model("User", userSchema);

const schema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .min(5)
    .max(250)
    .required(),
  password: Joi.string()
    .required()
    .min(5)
    .max(1200),
  isAdmin: Joi.boolean()
});

function validate(user) {
  return schema.validate(user);
}
exports.User = User;
exports.validate = validate;
