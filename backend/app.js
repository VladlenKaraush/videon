const express = require("express");
const debug = require("debug")("app:startup");
const morgan = require("morgan");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.error("Could not connect to mongodb...", err));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(cors());
app.options("/", cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

console.log(" name: " + config.get("name"));
console.log(" mail server: " + config.get("mail.host"));
if (!config.get("jwt_private_key")) {
  console.error(" jwt PRIVATE_KEY is not defined");
  process.exit(1);
}
console.log("secret for jwt: " + config.get("jwt_private_key"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

const port = process.env.PORT || 3900;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
