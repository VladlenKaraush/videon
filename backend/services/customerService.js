const { Customer, validate } = require("../models/customer");

async function getCustomers() {
  return await Customer.find().sort("name");
}

async function getCustomerById(id) {
  const customer = await Customer.findById(id);
  if (!customer)
    return {
      error: {
        msg: "The customer with the given ID was not found",
        status: 404
      }
    };
  return customer;
}

async function postCustomer(body) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  let customer = new Customer({
    name: body.name,
    phone: body.phone,
    isGold: body.isGold
  });
  try {
    customer = await customer.save();
    return customer;
  } catch (ex) {
    console.log(ex.message);
    if (error) return { error: { msg: error.details[0].message, status: 400 } };
  }
}

async function putCustomer(body, id) {
  const { error } = validate(req.body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  const customer = await Customer.findByIdAndUpdate(
    id,
    { name: body.name, phone: body.phone, isGold: body.isGold },
    { new: true }
  );
  if (!customer)
    if (error) return { error: { msg: error.details[0].message, status: 404 } };
  return customer;
}

async function deleteCustomer(id) {
  const genre = await Customer.findByIdAndRemove(id);
  if (!genre)
    if (error) return { error: { msg: error.details[0].message, status: 404 } };
  return genre;
}

exports.getCustomers = getCustomers;
exports.getCustomerById = getCustomerById;
exports.postCustomer = postCustomer;
exports.putCustomer = putCustomer;
exports.deleteCustomer = deleteCustomer;
