const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validationResult } = require("express-validator");


const getUserAddress = async (req, res) => {
  //#swagger.tags=['Address']
  console.log("get single address");
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
      .collection("adresses")
      .findOne({ githubId });
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};
const updateAddress = async (req, res) => {
  //#swagger.tags=['Address']
  console.log("Update User");
  if (req.params.id.length == 24) {
    const addressId= new ObjectId(req.params.id);
    console.log("Valid id!");
//pendiente esto
    const address = {
      githubId : req.body.githubId,
      mainStreet: req.body.mainStreet,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      houseNumber: req.body.houseNumber,
      reference: req.body.reference,
      updateDate: req.body.updateDate,
    };
    const validations = validationResult(req);
    //console.log("Validations ", validations);

    //validations
    if (validations.errors.length > 0) {
      let errorDescriptions = "Payload invalid :";
      validations.errors.map((er) => {
        errorDescriptions = errorDescriptions + " " + er.msg + ", ";
        console.log("Some errors in the payload");
        console.log("descriptions ", errorDescriptions);
        return res.status(404).json({ error: `${errorDescriptions}` });
      });
    } else {
      console.log("this is the new body ", address);
      const response = await mongodb
        .getDatabase()
        .db()
        .collection("adresses")
        .replaceOne({ _id: addressId }, address);
      if (response.modifiedCount > 0) {
        res.status(200).send("Address updated successfully!");
      } else {
        res.status(200).json(response.error || "Address not found");
      }
    }
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};
const createAddress = async (req, res) => {
  const result = validationResult(req);
  console.log("results ", result.errors);
  //#swagger.tags=['Address']
  console.log("request", req.body);
  const address = {
    githubId : req.body.githubId,
    mainStreet: req.body.mainStreet,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    houseNumber: req.body.houseNumber,
    reference: req.body.reference,
    updateDate: req.body.updateDate,
  };
  if (result.errors.length > 0) {
    let errorDescriptions = "Payload invalid :";
    result.errors.map((er) => {
      errorDescriptions = errorDescriptions + " " + er.msg + ", ";
    });
    console.log("Some errors in the payload");
    console.log("descriptions ", errorDescriptions);
    return res.status(404).json({ error: `${errorDescriptions}` });
  } else {
    console.log("Valid schemas!");
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("adresses")
      .insertOne(address);
    if (response.acknowledged > 0) {
      res.status(200).send("Address added successfully!");
    } else {
      res
        .status(200)
        .json(response.error || "Some Error ocurred while creating the address");
    }
  }
};

const deleteUserAddress = async (req, res) => {
  //#swagger.tags=['Address']

  //validate the size of the param.id
  if (req.params.id.length == 24) {
    console.log("Delete Address");
    const userId = new ObjectId(req.params.id);
    console.log("this is the param ", userId);

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("adresses")
      .deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      res.status(200).send("Address deleted successfylly!");
    } else {
      res
        .status(200)
        .json(
          response.error ||
            `Some Error ocurred while deleting the address`
        );
    }
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};

module.exports = {
  getUserAddress,
  createAddress,
  updateAddress,
  deleteUserAddress,
};
