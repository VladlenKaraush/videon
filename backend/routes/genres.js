const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const genreService = require("../services/genreService");

router.get("/", async (req, res) => {
  res.send(await genreService.getGenres());
});

router.get("/:id", async (req, res) => {
  const genre = await genreService.findById(req.params.id);
  if (genre.error) res.status(genre.error.status).send(genre.error.msg);
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const genre = genreService.postGenre(req.body);
  if (genre.error) res.status(genre.error.status).send(genre.error.msg);
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const genre = genreService.putGenre(req.body, req.params.id);
  if (genre.error) res.status(genre.error.status).send(genre.error.msg);
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = genreService.deleteGenre(req.params.id);
  if (genre.error) res.status(genre.error.status).send(genre.error.msg);
  res.send(genre);
});

module.exports = router;
