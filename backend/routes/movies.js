const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const movieService = require("../services/movieService");

router.get("/", async (req, res) => {
  const movies = await movieService.getMovies();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await movieService.getMovieById(req.params.id);
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const result = await movieService.postMovie(req.body);
  console.log("resut: ", result);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const result = await movieService.putMovie(req.params.id, req.body);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
  const result = await movieService.deleteMovie(req.params.id);
  if (result.error)
    return res.status(result.error.status).send(result.error.msg);
  return res.send(result);
});

module.exports = router;
