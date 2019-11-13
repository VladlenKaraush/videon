const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
Fawn.init(mongoose);

async function getRentals() {
  return await Rental.find().sort("-dateOut");
}

async function getRentalById(id) {
  const movie = await Rental.findById(id);
  if (!movie)
    return {
      error: { msg: "The movie with the given ID was not found", status: 400 }
    };
  return movie;
}
async function postRental(body) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  const customer = await Customer.findById(body.customerId);
  if (!customer) return { error: { msg: "invalid customer id", status: 400 } };

  const movie = await Movie.findById(body.movieId);
  if (!movie) return { error: { msg: "invalid movie id", status: 400 } };
  if (movie.numberInStock === 0)
    return { error: { msg: "movie is out of stock", status: 400 } };

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    return rental;
  } catch (ex) {
    console.log(ex);
    return { error: { msg: ex.message, status: 500 } };
  }
}

async function putRental(body, id) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  const genre = await Genre.findById(body.genreId);
  if (!genre) return { error: { msg: "invalid genre", status: 400 } };
  const movie = await Movie.findByIdAndUpdate(
    id,
    {
      title: body.title,
      numberInStock: body.numberInStock,
      dailyRentalRate: body.dailyRentalRate,
      genre: {
        _id: genre.id,
        name: genre.name
      }
    },
    { new: true }
  );
  if (!movie)
    return { error: { msg: "movie with given id was not found", status: 404 } };
  res.send(movie);
}

exports.getRentals = getRentals;
exports.getRentalById = getRentalById;
exports.postRental = postRental;
exports.putRental = putRental;
