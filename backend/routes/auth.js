const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const _ = require("lodash");
const { User } = require("../models/user");
const authService = require("../services/authService");

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
  const result = authService.postAuth(req.body);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return result;
});

router.delete("/:id", async (req, res) => {
  const result = authService.deleteUser(req.params.id);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return result;
});

module.exports = router;
