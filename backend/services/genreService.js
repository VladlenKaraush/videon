const { Genre, validate } = require("../models/genre");

function getGenres() {
  return Genre.find().sort("name");
}

async function getGenreById(id) {
  const genre = await Genre.findById(id);
  if (!genre)
    return { error: { msg: "genre with given id was not found", status: 404 } };
  return genre;
}

async function postGenre(body) {
  const { error } = validate(body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  let genre = new Genre({ name: body.name });
  try {
    genre = await genre.save();
    return genre;
  } catch (ex) {
    console.log(ex.message);
    return { error: { msg: ex.message, status: 400 } };
  }
}
async function putGenre(body, id) {
  const { error } = validate(req.body);
  if (error) return { error: { msg: error.details[0].message, status: 400 } };

  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: body.name },
    { new: true }
  );
  if (!genre)
    return {
      error: { msg: "The genre with the given ID was not found", status: 404 }
    };
  return genre;
}

async function deleteGenre(id) {
  const genre = await Genre.findByIdAndRemove(id);
  if (!genre)
    return {
      error: { msg: "The genre with the given ID was not found", status: 404 }
    };
  return genre;
}

exports.getGenres = getGenres;
exports.getGenreById = getGenreById;
exports.postGenre = postGenre;
exports.putGenre = putGenre;
exports.deleteGenre = deleteGenre;
