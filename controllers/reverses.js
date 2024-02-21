const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validationResult } = require("express-validator");



const getUserReverses = async (req, res) => {
  //#swagger.tags=['Reverses']
  console.log("get all reverses");
  console.log("from params ", req.params.githubId);

  if (req.params.githubId == undefined || null) {
    console.log("Param is empty");
  }

  if (req.params.githubId.length > 0) {
    console.log("user id valid!");
    const githubId = req.params.githubId;
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("reverses")
      .findMany({ githubId });
    console.log("Param found!");
    console.log("this is the result ", JSON.stringify(result._eventsCount));
    result.toArray().then((reverses) => {
      console.log("this is the result ", JSON.stringify(reverses));
      //analize if the sysstem found a user
      if (reverses.length == 0) {
        console.log("User reveses not found!");
        return res.status(404).json({ error: "User reverses not found" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(reverses);
    });
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};


module.exports = {
  getUserReverses,
};
