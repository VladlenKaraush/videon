const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  phone: { type: String, validation: { match: /^\d+$/ } },
  isGold: Boolean
});
const Customer = mongoose.model("Customer", customerSchema);

const schema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required(),
  phone: Joi.string()
    .regex(/^\d+$/)
    .required(),
  isGold: Joi.boolean()
});

function validate(customer) {
  return schema.validate(customer);
}
exports.Customer = Customer;
exports.validate = validate;
exports.customerSchema = customerSchema;
