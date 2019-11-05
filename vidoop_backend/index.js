const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.error("Could not connect to mongodb...", err));

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 50 },
  numberInStock: Number,
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 100,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: function() {
      return this.numberInStock;
    }
  },
  tag: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 100);
      },
      message: "movie should have at least one tag"
    }
  },
  genre: { name: String }
});

const Movie = mongoose.model("Movie", movieSchema);

async function createMovie() {
  const movie = new Movie({
    title: "qqqasd",
    tag: ["web"],
    // numberInStock: 20
    dailyRentalRate: 10.4
  });
  try {
    const result = await movie.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
}
async function getCources() {
  const movies = await Movie
    //   .find({ isPublished: true })
    // .find({ price: { $gt: 10, $lte: 20 } })
    .find();
  //   .or([{ price: { $gte: 15 } }, { name: /by/i }])
  //   // .or([{ name: /Hero/ }])
  //   .sort({ price: -1 })
  //   .select({ name: 1, author: 1, price: 1 });
  // // .count();
  console.log(movies);
}

async function updateMovie(id) {
  const movie = await Movie.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        numberInStock: 3,
        dailyRentalRate: 5
      }
    },
    { new: true }
  );
  console.log(movie);
}
async function removeMovie(id) {
  const result = await Movie.deleteOne({ _id: id });
  console.log(result);
}
// getCources();
// updateMovie("5da02c4708791d181a7a2c01");
// removeMovie("5da02c4708791d181a7a2c01");
createMovie();
