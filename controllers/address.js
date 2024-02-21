const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validationResult } = require("express-validator");


const getUserAddress = async (req, res) => {
  //#swagger.tags=['Address']
  console.log("get single");
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
      .collection("adresses")
      .find({ _id: userId });
    console.log("Param found!");
    console.log("this is the result ", JSON.stringify(result._eventsCount));
    result.toArray().then((address) => {
      console.log("this is the result ", JSON.stringify(address));
      //analize if the sysstem found a user
      if (address.length == 0) {
        console.log("Address not found!");
        return res.status(404).json({ error: "Address not found" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(address[0]);
    });
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
    //find user
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("adresses")
      .find({ _id: addressId});
//pendiente esto
    const address = {
      userId : req.body.userId,
      mainStreet: req.body.mainStreet,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      houseNumber: req.body.houseNumber,
      reference: req.body.reference,
      updateDate: req.body.updateDate,
    };
    const validations = validationResult(req);
    console.log("Validations ", validations);

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
        .collection("addreses")
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
    userId : req.body.userId,
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
