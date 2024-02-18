const dotenv = require("dotenv");
dotenv.config();

const MongoClient = require("mongodb").MongoClient;

let database;

const initDB = (callback) => {
  if (database) {
    console.log("DB is already initialized!");
    return callback(null, database);
  }
  //console.log("url mongo", process.env.MONGODB_URL);

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client;
      callback(null, database);
      console.log('Callback: database is connected!')
    })
    .catch((err) => {
      callback(err);
      console.log("not connected");
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error(`Database not initialized`);
  }
  console.log('return database');
  return database;
};

module.exports = {
  initDB,
  getDatabase,
};
