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
    amount: req.body.amount,
    status: "completed",
  };
///check balance

//if(){}

// else
//error not balance


  const validations = validationResult(req);
  console.log("validation errors ", validations);
  if (validations.errors.length > 0) {
    let errorDescriptions = "Transaction invalid :";
    validations.errors.map((er) => {
      errorDescriptions = errorDescriptions + " " + er.msg + ", ";
      console.log("Some errors in the transaction payload");
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
      res.status(200).send("Money send successfully!");
    } else {
      res
        .status(200)
        .json(response.error || "Some Error ocurred during the transaction");
    }
  }
};

const reverseTransaction = async (req, res) => {
  //#swagger.tags=['Transactions']
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("transactions")
    .find({ _id: req.params.id });

  if (result) {
    console.log("transaction found!");
    const newReverse = {
      githubId: req.body.githubId,
      transactionId: req.body.transactionId,
      justification: req.body.justification,
      dateOfReversed: req.body.dateOfReversed,
    };
    const createReverse = await mongodb
      .getDatabase()
      .db()
      .collection("reverses")
      .insertOne(newReverse);

    if (createReverse.acknowledged > 0) {
      console.log("this is the result ", result);

      const updatedTransaction = {
        accountOrigin: result.accountOrigin,
        nameAccountOrigin: result.nameAccountOrigin,
        accountDestiny: result.accountDestiny,
        nameAccountDestiny: result.nameAccountDestiny,
        transactionDate: result.transactionDate,
        reference: result.reference,
        status: "reversed",
      };
      const response = await mongodb
        .getDatabase()
        .db()
        .collection("transactions")
        .replaceOne({ _id: req.params.id }, updatedTransaction);

      if (response.modifiedCount > 0) {
        res.status(200).send("Transaction reverse created successfully!");
      } else {
        res
          .status(200)
          .json(
            response.error || "Error during the update of the transaction!"
          );
      }
    } else {
      res
        .status(200)
        .json(
          response.error ||
            "Some Error ocurred while reversing the transacction"
        );
    }
  } else {
    return res.status(404).json({ error: "Transaction not found!" });
  }
};

const getUserTransactions = async (req, res) => {
  //#swagger.tags=['Transactions']
  if (req.params.githubId.length == 24) {
    console.log("get user transactions");
    console.log("from params ", req.params.githubId);
    const githubId = req.params.githubId;
    const results = await mongodb
      .getDatabase()
      .db()
      .collection("transactions")
      .findMany({ githubId });
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
  getUserTransactions,
};
