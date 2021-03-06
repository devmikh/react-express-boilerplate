require("dotenv").config();

const Express = require("express");
const multer = require("multer");
// const formidable = require("formidable");
const nodemailer = require("nodemailer");
const App = Express();
const fs = require("fs");
const BodyParser = require("body-parser");
const PORT = 8080;

// DB connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

const {
  getUserQuery,
  getAllWarrantiesQuery,
  getAllPaymentsQuery,
  getAllTransactionsQuery,
  getItemDetailsQuery,
  getWarrantyQuery,
  getPaymentQuery,
  getFilesQuery,
  getTransactionsQuery,
  addNewItemQuery,
  addNewWarrantyQuery,
  addNewPaymentQuery,
  addNewTransactionQuery,
  updateItemQuery,
  checkWarrantyExistsQuery,
  updateWarrantyQuery,
  deleteWarrantyQuery,
  checkPaymentExistsQuery,
  updatePaymentQuery,
  deleteTransactionQuery,
  deletePaymentQuery,
  deleteFileQuery,
  getFileUrlQuery,
  addNewFileQuery,
} = require("./lib/dbQueries");

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
App.use(Express.static("public"));

// days_prior check

// email stuff
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// sms stuff
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// console.log(Date.now());

// let now = Date.now();
// let notify_at = Date.now() + 10000;
// let n = 0;
function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

let paymentNotificationLog = {};

setInterval(async () => {
  handleWarrantyNotifications();
  handlePaymentNotifications();
}, 1000);

// handlePaymentNotifications();

function handlePaymentNotifications() {
  db.query(getAllPaymentsQuery).then((data) => {
    data.rows.forEach((payment) => {
      let finalDueDate = addMonths(
        new Date(parseInt(payment.start_date, 10)),
        payment.duration_in_months
      );
      if (Date.now() < finalDueDate.getTime()) {
        if (!paymentNotificationLog[payment.id]) {
          paymentNotificationLog[payment.id] = {};
        }

        let startDate = new Date(parseInt(payment.start_date, 10));
        if (new Date().getDate() < startDate.getDate()) {
          console.log("before ", payment.item_name);
          let dueDate = new Date(new Date().setDate(startDate.getDate()));
          console.log(dueDate);
          if (
            Date.now() >= dueDate.getTime() - payment.days_prior * 86400000 &&
            !paymentNotificationLog[payment.id][dueDate.getMonth()] &&
            payment.days_prior > 0
          ) {
            let message = `Your payment for ${
              payment.item_name
            } is due on ${formatDate(dueDate)}.`;

            if (payment.sms) {
              client.messages
                .create({
                  body: message,
                  from: "+15876000586",
                  to: "+17787088227",
                })
                .then((message) => console.log(message.sid));
            }

            if (payment.email) {
              const mailOptions = {
                from: "wardentechnology@gmail.com",
                to: "mishacyb@gmail.com, danielzhang95@hotmail.com",
                subject: "Payment Notification",
                text: message,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            }
            paymentNotificationLog[payment.id][dueDate.getMonth()] = true;
          }
        } else {
          let dueDate = new Date(new Date().setDate(startDate.getDate()));
          dueDate = addMonths(dueDate, 1);
          console.log("start date", startDate);

          console.log("due after", dueDate);
          if (
            Date.now() >= dueDate.getTime() - payment.days_prior * 86400000 &&
            !paymentNotificationLog[payment.id][dueDate.getMonth()] &&
            payment.days_prior > 0
          ) {
            let message = `Your payment for ${
              payment.item_name
            } is due on ${formatDate(dueDate)}.`;

            if (payment.sms) {
              client.messages
                .create({
                  body: message,
                  from: "+15876000586",
                  to: "+17787088227",
                })
                .then((message) => console.log(message.sid));
            }

            if (payment.email) {
              const mailOptions = {
                from: "wardentechnology@gmail.com",
                to: "mishacyb@gmail.com, danielzhang95@hotmail.com",
                subject: "Payment Notification",
                text: message,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            }
            paymentNotificationLog[payment.id][dueDate.getMonth()] = true;
          }
        }
      }
    });
  });
}

function handleWarrantyNotifications() {
  db.query(getAllWarrantiesQuery).then((data) => {
    data.rows.forEach((warranty) => {
      if (warranty.days_prior > 0) {
        let expirationDate = addMonths(
          new Date(parseInt(warranty.start_date, 10)),
          warranty.duration_in_months
        );
        let datePrior =
          expirationDate.getTime() - warranty.days_prior * 86400000;

        if (Date.now() >= datePrior) {
          let message = `Your warranty for ${
            warranty.item_name
          } expires on ${formatDate(expirationDate)}.`;
          if (warranty.sms) {
            client.messages
              .create({
                body: message,
                from: "+15876000586",
                to: "+17787088227",
              })
              .then((message) => console.log(message.sid));
          }
          if (warranty.email) {
            // send email
            const mailOptions = {
              from: "wardentechnology@gmail.com",
              to: "mishacyb@gmail.com, danielzhang95@hotmail.com",
              subject: "Warranty Expiration Notification",
              text: message,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            //
          }
          db.query(
            `
            UPDATE entries SET days_prior = 0 WHERE id = $1;
          `,
            [warranty.id]
          );
        }
      }
    });
  });
}

// if (Date.now() > notify_at && n === 0) {
//   await client.messages
//     .create({
//       body: "Hello from Node",
//       from: "+15876000586",
//       to: "+17787088227",
//     })
//     .then((message) => console.log(message.sid));
//   n++;
// }

// client.messages
//   .create({
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//     from: "+15876000586",
//     to: "+16044016745",
//   })
//   .then((message) => console.log(message.sid));

// let mills = Date.now();
// let date = new Date(mills);
// console.log(mills);
// console.log(date.getTime());

// 1593912515028
// 1593912515028

// 2020-07-05T01:24:50.405Z

App.get("/api/users/:id", (req, res) => {
  let queryParams = [req.params.id];
  let query = getUserQuery;
  db.query(query, queryParams).then((data) => {
    res.json(data.rows);
  });
});

App.get("/api/warranties", (req, res) => {
  let query = getAllWarrantiesQuery;
  db.query(query).then((data) => {
    res.json(data.rows);
  });
});

App.get("/api/payments", (req, res) => {
  let query = getAllPaymentsQuery;
  db.query(query).then((data) => {
    res.json(data.rows);
  });
});

App.get("/api/transactions", (req, res) => {
  let query = getAllTransactionsQuery;
  db.query(query).then((data) => {
    res.json(data.rows);
  });
});

// Get item details
App.get("/api/items/:id", (req, res) => {
  let resObj = { id: req.params.id };
  let queryParams = [req.params.id];
  let itemQuery = getItemDetailsQuery;

  let warrantyQuery = getWarrantyQuery;

  let paymentQuery = getPaymentQuery;

  let fileQuery = getFilesQuery;
  let transactionQuery = getTransactionsQuery;

  db.query(itemQuery, queryParams)
    .then((data) => {
      resObj = { ...resObj, item: data.rows[0] };
      return db.query(warrantyQuery, queryParams);
    })
    .then((data) => {
      resObj = { ...resObj, warranty: data.rows[0] };
      return db.query(paymentQuery, queryParams);
    })
    .then((data) => {
      resObj = { ...resObj, payment: data.rows[0] };
      if (data.rows.length !== 0) {
        return db.query(transactionQuery, [data.rows[0].id]);
      }
      return db.query(transactionQuery, [0]);
    })
    .then((data) => {
      resObj = { ...resObj, transactions: data.rows };
      return db.query(fileQuery, queryParams);
    })
    .then((data) => {
      resObj = { ...resObj, filesDB: data.rows };
      res.json(resObj);
    });
});

// Create a new item
App.post("/api/items", (req, res) => {
  let {
    itemName,
    itemCategory,
    itemDescription,
    warrantyStartDate,
    warrantyDuration,
    warrantySmsNotification,
    warrantyEmailNotification,
    warrantyNotifyDaysPrior,
    paymentStartDate,
    paymentDuration,
    paymentSmsNotification,
    paymentEmailNotification,
    paymentNotifyDaysPrior,
    paymentMonthly,
    transactions,
  } = req.body;

  if (warrantyNotifyDaysPrior === "") {
    warrantyNotifyDaysPrior = 0;
  }
  if (paymentNotifyDaysPrior === "") {
    paymentNotifyDaysPrior = 0;
  }
  if (paymentDuration === "") {
    paymentDuration = 0;
  }

  // Create new item in the items table
  // return id of the newly created item
  db.query(addNewItemQuery, [itemName, itemCategory, itemDescription])
    // after the item is created, make a folder with a returned item id
    .then((data) => {
      let dir = `./uploads/1/${data.rows[0].id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      // If start date for warranty was passed, create a new warranty entry in the DB
      if (warrantyStartDate) {
        db.query(addNewWarrantyQuery, [
          data.rows[0].id,
          warrantyDuration,
          new Date(warrantyStartDate).getTime() + 25200001,
          warrantySmsNotification,
          warrantyEmailNotification,
          warrantyNotifyDaysPrior,
        ]);
      }
      // If start date for payment was passed, create a new payment entry in the DB
      if (paymentStartDate) {
        db.query(
          addNewPaymentQuery,
          [
            data.rows[0].id,
            paymentDuration,
            new Date(paymentStartDate).getTime() + 25200001,
            paymentSmsNotification,
            paymentEmailNotification,
            paymentNotifyDaysPrior,
          ]
          // after the payment was created, loop through passed transactions
          // and insert a new entry into transactions table using the id of the newly created item
        ).then((data) => {
          transactions.forEach((transaction) => {
            db.query(addNewTransactionQuery, [
              data.rows[0].id,
              transaction.name,
              transaction.amount,
              transaction.date,
            ]);
          });
        });
      }
      res.json(data.rows[0].id);
    })
    .catch((error) => console.log(error));
});
`
  DELETE FROM entries
  WHERE item_id = $1
  AND type = 'warranty'
`;
//
// Update an item
//
App.post("/api/items/:id", (req, res) => {
  let isTransactionQuery = false;
  let {
    itemName,
    itemCategory,
    itemDescription,
    warrantyStartDate,
    warrantyDuration,
    warrantySmsNotification,
    warrantyEmailNotification,
    warrantyNotifyDaysPrior,
    paymentStartDate,
    paymentDuration,
    paymentSmsNotification,
    paymentEmailNotification,
    paymentNotifyDaysPrior,
    paymentMonthly,
    transactions,
    oldTransactions,
  } = req.body;

  console.log("beginning transactions:", transactions);
  console.log("beginning oldTransactions:", oldTransactions);

  if (warrantyNotifyDaysPrior === "") {
    warrantyNotifyDaysPrior = 0;
    `
INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'payment', $2, $3, $4, $5, $6);
`;
  }
  if (paymentNotifyDaysPrior === "") {
    paymentNotifyDaysPrior = 0;
  }
  if (paymentDuration === "") {
    paymentDuration = 0;
  }

  db.query(updateItemQuery, [
    itemName,
    itemCategory,
    itemDescription,
    req.params.id,
  ])
    .then((data) => {
      let dir = `./uploads/1/${data.rows[0].id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      if (warrantyStartDate) {
        db.query(checkWarrantyExistsQuery, [req.params.id]).then((data) => {
          if (!data.rows[0].exists) {
            db.query(addNewWarrantyQuery, [
              req.params.id,
              warrantyDuration,
              new Date(warrantyStartDate).getTime() + 25200001,
              warrantySmsNotification,
              warrantyEmailNotification,
              warrantyNotifyDaysPrior,
            ]);
          } else {
            db.query(updateWarrantyQuery, [
              warrantyDuration,
              new Date(warrantyStartDate).getTime() + 25200001,
              warrantySmsNotification,
              warrantyEmailNotification,
              warrantyNotifyDaysPrior,
              req.params.id,
            ]);
          }
        });
      } else {
        db.query(deleteWarrantyQuery, [req.params.id]);
      }
      console.log("before payment start date");

      if (paymentStartDate) {
        console.log("in payment start date");
        db.query(checkPaymentExistsQuery, [req.params.id]).then((data) => {
          console.log("1:", data.rows[0]);
          console.log("2", data.rows[0].exists);

          if (!data.rows[0].exists) {
            console.log("in exist statmenet");

            db.query(addNewPaymentQuery, [
              req.params.id,
              paymentDuration,
              new Date(paymentStartDate).getTime() + 25200001,
              paymentSmsNotification,
              paymentEmailNotification,
              paymentNotifyDaysPrior,
            ]).then((data) => {
              transactions.forEach((transaction) => {
                db.query(addNewTransactionQuery, [
                  data.rows[0].id,
                  transaction.name,
                  transaction.amount,
                  transaction.date,
                ]);
              });
            });
          } else {
            console.log("in else statement for update payment");
            isTransactionQuery = true;
            db.query(updatePaymentQuery, [
              paymentDuration,
              new Date(paymentStartDate).getTime() + 25200001,
              paymentSmsNotification,
              paymentEmailNotification,
              paymentNotifyDaysPrior,
              req.params.id,
            ]).then((data) => {
              // const deleteTransactionsList = oldTransactions.filter(
              //   (transaction) => {
              //     return !transactions.includes(transaction);
              //   }
              // );
              // console.log("deleteTransactionList:", deleteTransactionsList);

              // const addTransactionsList = transactions.filter((transaction) => {
              //   return !oldTransactions.includes(transaction);
              // });
              // console.log("addTransactionsList", addTransactionsList);
              //deleteTransactionsList
              oldTransactions.forEach((transaction) => {
                db.query(deleteTransactionQuery, [
                  data.rows[0].id,
                  transaction.name,
                  transaction.date,
                  transaction.amount,
                ]);
              });

              //addTransactionsList
              setTimeout(() => {
                transactions.forEach((transaction, index) => {
                  db.query(addNewTransactionQuery, [
                    data.rows[0].id,
                    transaction.name,
                    transaction.amount,
                    transaction.date,
                  ]).then((resp) => {
                    if (index === transactions.length - 1) {
                    }
                  });
                });
              }, oldTransactions.length * 10);
            });
          }
        });
      } else {
        db.query(deletePaymentQuery, [req.params.id]);
      }
      setTimeout(
        () => res.json(data.rows[0].id),
        (oldTransactions.length + transactions.length) * 10
      );
    })

    .catch((error) => console.log(error));
});

// Delete a file
App.post("/api/files/:id/delete", (req, res) => {
  // res.json({ message: `File deleted! ${req.params.id}` });

  let query = deleteFileQuery;
  db.query(query, [req.params.id]).then((data) => {
    fs.unlinkSync(data.rows[0].url);
    res.json("hello");
  });
});

// Download a file

App.get("/api/files/:id", (req, res) => {
  db.query(getFileUrlQuery, [req.params.id]).then((data) => {
    res.download(data.rows[0].url);
  });
});
//
//

// Upload a file
App.post("/api/uploadfile/:id", (req, res) => {
  const itemId = req.params.id;
  // let dir = `./uploads/1/${file.id}`;
  //     if (!fs.existsSync(dir)) {
  //       fs.mkdirSync(dir);
  //     }
  const folderPath = `./uploads/1/${itemId}/`;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage }).single("file");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    console.log(req.file.filename);
    db.query(addNewFileQuery, [
      itemId,
      req.file.filename,
      folderPath + req.file.filename,
    ]);
    return res.status(200).send(req.file);
  });
});

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${PORT} so that's pretty good 👍`
  );
});
