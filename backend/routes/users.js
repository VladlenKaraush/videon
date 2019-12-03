const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const userService = require("../services/userService");

router.get("/me", auth, async (req, res) => {
  res.send(await userService.getMe(req.user._id));
});

router.post("/", async (req, res) => {
  const result = await userService.postUser(req.body);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  res
    .header("x-auth-token", result)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
