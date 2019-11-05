const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const movie = await Rental.findById(req.params.id);
  if (!movie) res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("invalid customer id.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("invalid movie id");
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock");

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

    res.send(rental);
  } catch (ex) {
    console.log(ex);
    res.status(500).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("invalid genre.");
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre.id,
        name: genre.name
      }
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const genre = await Movie.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});

module.exports = router;
