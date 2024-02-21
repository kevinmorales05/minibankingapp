const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validationResult } = require("express-validator");



const getSingleBalance = async (req, res) => {
  //#swagger.tags=['Balance']
  console.log("get balance");
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
      .collection("balances")
      .findOne({ githubId });
      //analize if the sysstem found a user
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
   
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};


module.exports = {
  getSingleBalance,
};
