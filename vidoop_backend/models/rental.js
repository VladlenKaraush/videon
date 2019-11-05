const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0
      }
    }),
    required: true
  },

  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});
const Rental = mongoose.model("Rental", rentalSchema);

const joiSchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required()
});

function validate(rental) {
  return joiSchema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validate;
