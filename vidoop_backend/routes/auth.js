const express = require("express");
const router = express.Router();
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

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Incorrect email or  password");

  const passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordValid) res.status(400).send("Incorrect email or  password");

  const token = user.generateAuthToken();
  res.send(token);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found");
  res.send(user);
});

module.exports = router;
