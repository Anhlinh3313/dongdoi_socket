var mongoose = require("mongoose");
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    let mongodbURL = `mongodb+srv://admin:taipei101@cluster0.3afh7oh.mongodb.net/dongdoi?retryWrites=true&w=majority`;
    mongoose.set("strictQuery", false);
    mongoose
      .connect(mongodbURL)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Database();
