const crypto = require("crypto");

function generateAccountNumber() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let accountNumber = "";
  for (let i = 0; i < 10; i++) {
    accountNumber += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return accountNumber;
}
function printCurrentDate() {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad with leading zero if necessary
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (months are zero-based) and pad with leading zero if necessary
  const year = currentDate.getFullYear(); // Get the full year
  console.log(`${day}/${month}/${year}`);
  return `${day}/${month}/${year}`;
}

module.exports = { generateAccountNumber, printCurrentDate };
