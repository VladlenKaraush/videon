const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 }
});
const Genre = mongoose.model("Genre", genreSchema);

const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
});

function validate(genre) {
  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validate;
exports.schema = genreSchema;
