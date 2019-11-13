const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { schema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
    trim: true
  },
  numberInStock: { type: Number, min: 0, max: 255, required: true },
  dailyRentalRate: { type: Number, min: 0, max: 255, required: true },
  genre: { type: schema, required: true }
});
const Movie = mongoose.model("Movie", movieSchema);

const joiSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  numberInStock: Joi.number()
    .min(0)
    .required(),
  dailyRentalRate: Joi.number()
    .min(0)
    .required(),
  genreId: Joi.objectId().required()
});

function validate(movie) {
  return joiSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validate;
exports.movieSchema = movieSchema;
