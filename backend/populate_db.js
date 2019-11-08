
const { Genre } = require("/models/genre");
const { Movie, validate } = require("/models/movie");

const movies = [
    {title: "", numberInStock: 5, dailyRentalRate: }
]
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