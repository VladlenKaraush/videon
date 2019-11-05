module.export = function(req, res, next) {
  console.log("Logging...");
  next();
};
