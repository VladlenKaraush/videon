const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const customerService = require("../services/customerService");

router.get("/", async (req, res) => {
  const customers = await customerService.getCustomers();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const result = customerService.postCustomer(req.body);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const result = customerService.putCustomer(req.params.id, req.body);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
  const result = customerService.deleteCustomer(req.params.id);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return res.send(result);
});
module.exports = router;
