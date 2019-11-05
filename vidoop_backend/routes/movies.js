const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log(req.body);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("invalid genre.");
  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre.id,
      name: genre.name
    }
  });
  try {
    await movie.save();
    res.send(movie);
  } catch (ex) {
    console.log(ex.message);
    res.send(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});

module.exports = router;
