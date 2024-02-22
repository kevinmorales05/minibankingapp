const { validationResult } = require("express-validator");
const mongodb = require("../data/database");
const { printCurrentDate } = require("../utils/functions");
const { ObjectId } = require("mongodb");

const createTransaction = async (req, res) => {
  //#swagger.tags=['Transactions']
  console.log("********* Init transaction **********");
  console.log("Transacction request", req.body);
  let currentDate = printCurrentDate();
  //0. validate transaction payload
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
    let githubId = req.body.githubId;
    //1. getbalance of sender
    const actualBalance = await mongodb
      .getDatabase()
      .db()
      .collection("balances")
      .findOne({ githubId });
    console.log("actual balance sender ", actualBalance);
    let newBalance = 0;
    if (req.body.amount > actualBalance.balance) {
      console.log(
        "************End of transaction for insuffiente balance******"
      );
      return res.status(200).json(response.error || "Insufficient balance");
    } else {
      //2. update balance sender
      newBalance = actualBalance.balance - req.body.amount;
      console.log("old balance", actualBalance.balance);
      console.log("new sender balance ", newBalance);

      let dateNewBalance = printCurrentDate();
      let balanceCreditor = {
        githubId: req.body.githubId,
        balance: newBalance,
        dateUpdateDate: dateNewBalance,
      };
      const updateSenderBalance = await mongodb
        .getDatabase()
        .db()
        .collection("balances")
        .replaceOne({ githubId }, balanceCreditor);

      if (updateSenderBalance.modifiedCount > 0) {
        //3. look for the githubid of the receiver account holder
        console.log("Sender balance updated succesfully ", balanceCreditor);
        let accountNumber = req.body.accountDestiny;
        const receiverAccount = await mongodb
          .getDatabase()
          .db()
          .collection("accounts")
          .findOne({ accountNumber });
        if (receiverAccount !== null) {
          //4. look for the balance of the receiver account holder
          let githubId = receiverAccount.githubId;
          const receiverBalance = await mongodb
            .getDatabase()
            .db()
            .collection("balances")
            .findOne({ githubId });
          if (receiverBalance !== null) {
            //5. update balance of the receiver account

            let dateNewBalance = printCurrentDate();
            let newReceiverBalance = {
              githubId: receiverBalance.githubId,
              balance: receiverBalance.balance + req.body.amount,
              dateUpdateDate: dateNewBalance,
            };
            const updateReceiverBalance = await mongodb
              .getDatabase()
              .db()
              .collection("balances")
              .replaceOne({ githubId }, newReceiverBalance);

            if (updateReceiverBalance.modifiedCount > 0) {
              console.log("********Updated receiver balance ********");
              //6 save transaction
              // persist transaction
              console.log(
                "********** Persist transaction ***********************"
              );
              const transaction = {
                accountOrigin: req.body.accountOrigin,
                nameAccountOrigin: req.body.nameAccountOrigin,
                accountDestiny: req.body.accountDestiny,
                nameAccountDestiny: req.body.nameAccountDestiny,
                transactionDate: currentDate,
                reference: req.body.reference,
                amount: req.body.amount,
                status: "completed",
                githubId: req.body.githubId
              };
              const response = await mongodb
                .getDatabase()
                .db()
                .collection("transactions")
                .insertOne(transaction);
              if (response.acknowledged > 0) {
                console.log("Account added successfully!");
                res.status(200).send("Transaction sent succesfully!");
              } else {
                res
                  .status(200)
                  .json(
                    resAccount.error ||
                      "Some Error ocurred during the transaction try again later"
                  );
              }
            } else {
              return res
                .status(200)
                .json(
                  rupdateReceiverBalance.error ||
                    "Some Error ocurred during the transaction"
                );
            }
          } else {
          }
        } else {
          res.status(200).send("Receiver account balance not found");
        }
      } else {
        return res
          .status(200)
          .json(
            updateSenderBalance.error ||
              "Troubles updating the balance of sender, try again it later"
          );
      }
    }
  }
};

const reverseTransaction = async (req, res) => {
  //#swagger.tags=['Transactions']
  const transactionId =req.body.id;
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("transactions")
    .findOne({  transactionId });

  if (result !== null) {
    console.log("transaction found! ", result);
    let dateReverse = printCurrentDate();
    const newReverse = {
      githubId: req.body.githubId,
      transactionId: req.body.transactionId,
      justification: req.body.justification,
      dateOfReversed: dateReverse,
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
        amount: result.amount,
        status: "reversed",
      };
      const response = await mongodb
        .getDatabase()
        .db()
        .collection("transactions")
        .replaceOne({ transactionId }, updatedTransaction);

      if (response.modifiedCount > 0) {
        try {
          //give the money back
        //1. get the balance
        let githubIdReceiver = req.body.githubIdReceiver;
        let githubSender = req.body.githubId;
        console.log(`sender ${githubSender} receiver ${githubIdReceiver}`)
        //sender
        const balanceSender = await mongodb
          .getDatabase()
          .db()
          .collection("balances")
          .findOne({ githubId: githubIdReceiver });
          console.log('balance receiver', balanceSender)
        //receiver
          const balanceReceiver = await mongodb
          .getDatabase()
          .db()
          .collection("balances")
          .findOne({ githubId: githubSender });
          console.log('balance receiver ', balanceReceiver);
          //2. update balances
          let dateReverse = printCurrentDate();
          const senderBalanceNow = {
            githubId: balanceSender.githubId,
            balance: balanceSender.balance + result.amount,
            balanceUpdateDate: dateReverse,
          }
          const receiverBalanceNow ={
            githubId: balanceReceiver.githubId,
            balance: balanceReceiver.balance - result.amount,
            balanceUpdateDate: dateReverse,
          }
          const balanceSenderNow = await mongodb
          .getDatabase()
          .db()
          .collection("balances")
          .replaceOne({ githubId: githubIdReceiver },senderBalanceNow);
        //receiver
          const balanceReceiverNow = await mongodb
          .getDatabase()
          .db()
          .collection("balances")
          .replaceOne({ githubId: githubSender }, receiverBalanceNow);



        return res.status(200).send("Transaction reverse created successfully!");
        }
        catch (error){
          console.log("Error ", error);
          return res.status(401).send("Error during the transaction ");

        }
        
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
  if (req.params.githubId.length > 0) {
    console.log("get user transactions");
    console.log("from params ", req.params.githubId);
    const githubId = req.params.githubId;
    const results = await mongodb
      .getDatabase()
      .db()
      .collection("transactions")
      .find({ githubId });
    results.toArray().then((transactions) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(transactions);
    });
  } else {
    return res.status(404).json({ error: "User id invalid!" });
  }
};

const fundAccount = async (req, res) => {
  //#swagger.tags=['Transactions']
  let githubId = req.params.githubId;

  const getUserBalance = await mongodb
  .getDatabase()
  .db()
  .collection("balances")
  .findOne({ githubId });

  let dateNewBalance = printCurrentDate();
      let balanceCreditor = {
        githubId: getUserBalance.githubId,
        balance: getUserBalance.balance + req.body.amount,
        dateUpdateDate: dateNewBalance,
      };
      const updateSenderBalance = await mongodb
        .getDatabase()
        .db()
        .collection("balances")
        .replaceOne({ githubId }, balanceCreditor);
        return res.status(200).json({message:`Account ${githubId} funded succesfully! Actual balance: ${getUserBalance.balance + req.body.amount} USD`});
}

module.exports = {
  createTransaction,
  reverseTransaction,
  getUserTransactions,
  fundAccount
};
