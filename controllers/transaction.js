const { validationResult } = require("express-validator");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const createTransaction = async (req, res) => {
  //#swagger.tags=['Transactions']
  console.log("request", req.body);
  
  const transaction = {
    accountOrigin: req.body.accountOrigin,
    nameAccountOrigin: req.body.nameAccountOrigin,
    accountDestiny: req.body.accountDestiny,
    nameAccountDestiny: req.body.nameAccountDestiny,
    transactionDate: req.body.transactionDate,
    reference: req.body.reference,
    status: "completed" 
  }

  const validations = validationResult(req);
  console.log("validation errors ", validations);
  if (validations.errors.length > 0) {
    let errorDescriptions = "Payload invalid :";
    validations.errors.map((er) => {
      errorDescriptions = errorDescriptions + " " + er.msg + ", ";
      console.log("Some errors in the payload");
    });
    console.log("descriptions ", errorDescriptions);
    return res.status(404).json({ error: `${errorDescriptions}` });
  } else {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("transactions")
      .insertOne(transaction);
    if (response.acknowledged > 0) {
      res.status(200).send('Money send successfully!');
    } else {
      res
        .status(200)
        .json(response.error || "Some Error ocurred during the transaction");
    }
  }
};

const reverseTransaction = async (req, res) => {
  //#swagger.tags=['Transactions']
  console.log("Delete Transaction");
  if (req.params.id.length == 24) {
    const userId = new ObjectId(req.params.id);
  console.log("this is the param ", userId);

  const response = await mongodb
    .getDatabase()
    .db()
    .collection("transactions")
    .deleteOne({ _id: userId });
  if (response.deletedCount > 0) {
    res.status(200).send("Goal deleted successfully!");
  } else {
    res
      .status(200)
      .json(
        response.error ||
          `Transaction not found`
      );
  }
  } else {
    return res.status(404).json({ error: "Transaction id invalid!" });
  }
  
};

const getUserTransactions = async (req, res) => {
  //#swagger.tags=['Transactions']
  if (req.params.id.length == 24) {
    console.log("get user transactions");
  console.log("from params ", req.params.id);
  const userId = req.params.id;
  const results = await mongodb
    .getDatabase()
    .db()
    .collection("transactions")
    .find({ idUser: userId });
  results.toArray().then((transactions) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(transactions);
  });
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
  
};

module.exports = {
 createTransaction,
 reverseTransaction,
 getUserTransactions
};
