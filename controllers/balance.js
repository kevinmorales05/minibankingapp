const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validationResult } = require("express-validator");



const getSingleBalance = async (req, res) => {
  //#swagger.tags=['Balance']
  console.log("get balance");
  console.log("from params ", req.params.id);

  if (req.params.id == undefined || null) {
    console.log("Param is empty");
  }

  if (req.params.id.length == 24) {
    console.log("user id valid!");
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("balances")
      .find({ _id: userId });
    console.log("Param found!");
    console.log("this is the result ", JSON.stringify(result._eventsCount));
    result.toArray().then((balance) => {
      console.log("this is the result ", JSON.stringify(balance));
      //analize if the sysstem found a user
      if (balance.length == 0) {
        console.log("User balance not found!");
        return res.status(404).json({ error: "User not found" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(balance[0]);
    });
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};


module.exports = {
  getSingleBalance,
};
