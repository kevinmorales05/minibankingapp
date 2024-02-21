const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validationResult } = require("express-validator");
const {
  generateAccountNumber,
  printCurrentDate,
} = require("../utils/functions");

const getAll = async (req, res) => {
  //#swagger.tags=['Users']
  console.log("getAll");
  const result = await mongodb.getDatabase().db().collection("users").find();
  //const result = await mongodb.getDatabase().db().collection('users').find();
  //console.log('these are the results ', result);
  result.toArray().then((users) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Users']
  console.log("get single");
  console.log("from params ", req.params.githubId);

  if (req.params.githubId == undefined || null) {
    console.log("Param is empty");
  }

  if (req.params.githubId.length > 0) {
    console.log("github id valid!");
    //const userId = new ObjectId(req.params.id);
    const githubId = req.params.githubId;
    console.log(githubId);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .findOne({ githubId: githubId });
    console.log("Param found!");
    console.log("result find one", result);
    //analize if the sysstem found a user
    if (result == null) {
      console.log("User not found!");
      return res.status(404).json({ error: "User not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};
const updateUser = async (req, res) => {
  //#swagger.tags=['Users']
  console.log("Update User");
  if (req.params.githubId.length > 0) {
    const githubId = req.params.githubId;
    console.log("Valid id!");
    //find user
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .findOne({ githubId });

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      email: req.body.email,
      addressId: req.body.addressId,
      favoriteColor: req.body.favoriteColor,
      githubId: req.body.githubId,
      accountId: req.body.accountId,
    };
    const validations = validationResult(req);
    console.log("Validations ", validations);

    //validations
    if (validations.errors.length > 0) {
      let errorDescriptions = "User invalid :";
      validations.errors.map((er) => {
        errorDescriptions = errorDescriptions + " " + er.msg + ", ";
        console.log("Some errors in the payload");
        console.log("descriptions ", errorDescriptions);
        return res.status(404).json({ error: `${errorDescriptions}` });
      });
    } else {
      console.log("this is the new body ", user);
      const response = await mongodb
        .getDatabase()
        .db()
        .collection("users")
        .replaceOne({ githubId }, user);
      if (response.modifiedCount > 0) {
        res.status(200).send("User updated successfully!");
      } else {
        res.status(200).json(response.error || "User not found");
      }
    }
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};
const createUser = async (req, res) => {
  const result = validationResult(req);
  console.log("results ", result.errors);
  //#swagger.tags=['Users']
  console.log("request", req.body);

  if (result.errors.length > 0) {
    let errorDescriptions = "User payload invalid :";
    result.errors.map((er) => {
      errorDescriptions = errorDescriptions + " " + er.msg + ", ";
    });
    console.log("Some errors in the payload");
    console.log("descriptions ", errorDescriptions);
    return res.status(404).json({ error: `${errorDescriptions}` });
  } else {
    console.log("Valid schemas!");

    //1. create account
    let accountNumberRandom = generateAccountNumber();
    let currentDate = printCurrentDate();
    console.log("account Created ", accountNumberRandom);
    let newAccount = {
      githubId: req.body.githubId,
      userFullName: req.body.firstName + " " + req.body.lastName,
      dateOfCreation: currentDate,
      accountNumber: accountNumberRandom,
    };
    const resAccount = await mongodb
      .getDatabase()
      .db()
      .collection("accounts")
      .insertOne(newAccount);
    if (resAccount.acknowledged > 0) {
      console.log("Account added successfully!");

      //2. create balance
      let newBalance = {
        githubId: req.body.githubId,
        balance: 0,
        balanceUpdateDate: currentDate,
      };
      const resBalance = await mongodb
        .getDatabase()
        .db()
        .collection("balances")
        .insertOne(newBalance);

      if (resBalance.acknowledged > 0) {
        console.log("Balance created successfully!");

        //create json for the account
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthday: req.body.birthday,
          email: req.body.email,
          addressId: req.body.addressId,
          favoriteColor: req.body.favoriteColor,
          githubId: req.body.githubId,
          accountId: accountNumberRandom,
        };

        const response = await mongodb
          .getDatabase()
          .db()
          .collection("users")
          .insertOne(user);
        if (response.acknowledged > 0) {
          res
            .status(200)
            .json({ message: "User created created successfully!", user });
        } else {
          res
            .status(200)
            .json(
              response.error || "Some Error ocurred while creating the user"
            );
        }
      } else {
        res
          .status(200)
          .json(
            resBalance.error || "Some Error ocurred while creating the address"
          );
      }
    } else {
      res
        .status(200)
        .json(
          resAccount.error || "Some Error ocurred while creating the balance"
        );
    }
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags=['Users']

  //validate the size of the param.id
  if (req.params.githubId.length > 0) {
    console.log("Delete User");
    const githubId = req.params.githubId;
    console.log("this is the param ", githubId);

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .deleteOne({ githubId });
    if (response.deletedCount > 0) {
      res.status(200).send("Element deleted successfylly!");
    } else {
      res
        .status(200)
        .json(response.error || `Some Error ocurred while deleting the user`);
    }
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
