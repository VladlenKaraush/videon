const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");

function getMovies() {
  return Movie.find().sort("title");
}

function getMovieById(id) {
  return Movie.findById(id);
}

async function postMovie(body) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  const genre = await Genre.findById(body.genreId);
  if (!genre) return { error: "invalid genre" };
  const movie = new Movie({
    title: body.title,
    numberInStock: body.numberInStock,
    dailyRentalRate: body.dailyRentalRate,
    genre: {
      _id: genre.id,
      name: genre.name
    }
  });
  try {
    await movie.save();
    return movie;
  } catch (ex) {
    console.log(ex.message);
    return ex.message;
  }
}
async function putMovie(id, body) {
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
  if (!movie) res.send(movie);
  return {
    error: { msg: "The movie with the given ID was not found", status: 404 }
  };
}

async function deleteMovie(id) {
  const movie = await Movie.findByIdAndRemove(id);
  if (!movie)
    return { error: { msg: "movie with given id was not found", status: 404 } };
  return movie;
}

exports.getMovies = getMovies;
exports.getMovieById = getMovieById;
exports.postMovie = postMovie;
exports.putMovie = putMovie;
exports.deleteMovie = deleteMovie;
