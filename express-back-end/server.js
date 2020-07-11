require("dotenv").config();

const Express = require("express");
const multer = require("multer");
const formidable = require("formidable");
const App = Express();
const fs = require("fs");
const BodyParser = require("body-parser");
const PORT = 8080;

// DB connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

const { getAllWarrantiesQuery } = require("./lib/dbQueries");

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
App.use(Express.static("public"));

// Sample GET route
App.get("/api/data", (req, res) =>
  res.json({
    message: "Seems to work!",
  })
);

App.get("/api/users/:id", (req, res) => {
  let queryParams = [req.params.id];
  let query = "SELECT * FROM users WHERE id=$1";
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
  let query = "SELECT * FROM entries WHERE type='payment'";
  db.query(query).then((data) => {
    res.json(data.rows);
  });
});

// Get item details
App.get("/api/items/:id", (req, res) => {
  let resObj = { id: req.params.id };
  let queryParams = [req.params.id];
  let itemQuery = `
    SELECT 
      id,
      name,
      category,
      description    
    FROM items
    WHERE id = $1;
  `;

  let warrantyQuery = `
    SELECT 
      start_date,
      duration_in_months,
      sms,
      email,
      days_prior
    FROM entries
    WHERE type='warranty' AND item_id = $1;
  `;

  let paymentQuery = `
    SELECT 
      id,
      start_date,
      duration_in_months,
      sms,
      email,
      days_prior
    FROM entries
    WHERE type='payment' AND item_id = $1;
  `;

  let fileQuery = `
    SELECT id, name, url
    FROM files
    WHERE item_id = $1;
  `;
  let transactionQuery = `
    SELECT name, amount, date
    FROM transactions
    WHERE entry_id = $1;
  `;

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
      //data.rows ? [data.rows[0].id] :
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
  db.query(
    `
    INSERT INTO items (user_id, name, category, description) VALUES (1, $1, $2, $3)
    RETURNING id;
  `,
    [itemName, itemCategory, itemDescription]
  )
    // after the item is created, make a folder with a returned item id
    .then((data) => {
      let dir = `./uploads/1/${data.rows[0].id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      // If start date for warranty was passed, create a new warranty entry in the DB
      if (warrantyStartDate) {
        db.query(
          `
      INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'warranty', $2, $3, $4, $5, $6);
      `,
          [
            data.rows[0].id,
            warrantyDuration,
            new Date(warrantyStartDate).getTime() + 25200001,
            warrantySmsNotification,
            warrantyEmailNotification,
            warrantyNotifyDaysPrior,
          ]
        );
      }
      // If start date for payment was passed, create a new payment entry in the DB
      if (paymentStartDate) {
        db.query(
          `
      INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'payment', $2, $3, $4, $5, $6)
      RETURNING id;
      `,
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
            db.query(
              `
          INSERT INTO transactions (entry_id, name, amount, date) VALUES ($1, $2, $3, $4);
          `,
              [
                data.rows[0].id,
                transaction.name,
                transaction.amount,
                transaction.date,
              ]
            );
          });
        });
      }
      res.json(data.rows[0].id);
    })
    .catch((error) => console.log(error));
});
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
  }
  if (paymentNotifyDaysPrior === "") {
    paymentNotifyDaysPrior = 0;
  }
  if (paymentDuration === "") {
    paymentDuration = 0;
  }

  db.query(
    `
    UPDATE items 
    SET name = $1,
    category = $2,
    description = $3
    WHERE id = $4
    RETURNING id;
  `,
    [itemName, itemCategory, itemDescription, req.params.id]
  )
    .then((data) => {
      let dir = `./uploads/1/${data.rows[0].id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      if (warrantyStartDate) {
        // select exists(select 1 from contact where id=12
        db.query(
          `SELECT exists(SELECT 1 FROM entries WHERE item_id=$1 AND type = 'warranty')`,
          [req.params.id]
        ).then((data) => {
          if (!data.rows[0].exists) {
            db.query(
              `
          INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'warranty', $2, $3, $4, $5, $6);
          `,
              [
                req.params.id,
                warrantyDuration,
                new Date(warrantyStartDate).getTime() + 25200001,
                warrantySmsNotification,
                warrantyEmailNotification,
                warrantyNotifyDaysPrior,
              ]
            );
          } else {
            db.query(
              `
              UPDATE entries
              SET
              duration_in_months = $1,
              start_date = $2,
              sms = $3,
              email = $4,
              days_prior = $5
              WHERE type = 'warranty'
              AND item_id = $6
            
          `,
              [
                warrantyDuration,
                new Date(warrantyStartDate).getTime() + 25200001,
                warrantySmsNotification,
                warrantyEmailNotification,
                warrantyNotifyDaysPrior,
                req.params.id,
              ]
            );
          }
        });
      } else {
        db.query(
          `
            DELETE FROM entries
            WHERE item_id = $1
            AND type = 'warranty'
          `,
          [req.params.id]
        );
      }
      console.log("before payment start date");

      if (paymentStartDate) {
        console.log("in payment start date");
        db.query(
          `SELECT exists(SELECT 1 FROM entries WHERE item_id=$1 AND type = 'payment')`,
          [req.params.id]
        ).then((data) => {
          console.log("1:", data.rows[0]);
          console.log("2", data.rows[0].exists);

          if (!data.rows[0].exists) {
            console.log("in exist statmenet");

            db.query(
              `
          INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'payment', $2, $3, $4, $5, $6);
          `,
              [
                req.params.id,
                paymentDuration,
                new Date(paymentStartDate).getTime() + 25200001,
                paymentSmsNotification,
                paymentEmailNotification,
                paymentNotifyDaysPrior,
              ]
            );
          } else {
            console.log("in else statement for update payment");
            isTransactionQuery = true;
            db.query(
              `
          UPDATE entries
          SET
          duration_in_months = $1,
          start_date = $2,
          sms = $3,
          email = $4,
          days_prior = $5
          WHERE type = 'payment'
          AND item_id = $6
          RETURNING entries.id;
          `,
              [
                paymentDuration,
                new Date(paymentStartDate).getTime() + 25200001,
                paymentSmsNotification,
                paymentEmailNotification,
                paymentNotifyDaysPrior,
                req.params.id,
              ]
            ).then((data) => {
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
                db.query(
                  `
                DELETE FROM transactions WHERE entry_id = $1 AND name = $2 AND date = $3 AND amount = $4;
              `,
                  [
                    data.rows[0].id,
                    transaction.name,
                    transaction.date,
                    transaction.amount,
                  ]
                );
              });

              //addTransactionsList
              transactions.forEach((transaction, index) => {
                db.query(
                  `
                INSERT INTO transactions(entry_id, name, date, amount) VALUES($1, $2, $3, $4);
              `,
                  [
                    data.rows[0].id,
                    transaction.name,
                    transaction.date,
                    transaction.amount,
                  ]
                ).then((resp) => {
                  if (index === transactions.length - 1) {
                  }
                });
              });
            });
          }
        });
      } else {
        db.query(
          `
            DELETE FROM entries
            WHERE item_id = $1
            AND type = 'payment'
          `,
          [req.params.id]
        );
      }

      res.json(data.rows[0].id);
    })

    .catch((error) => console.log(error));
});

// Delete a file
App.post("/api/files/:id/delete", (req, res) => {
  // res.json({ message: `File deleted! ${req.params.id}` });

  let query = `
    DELETE FROM files WHERE id = $1
    RETURNING url;
  `;
  db.query(query, [req.params.id]).then((data) => {
    fs.unlinkSync(data.rows[0].url);
    res.json("hello");
  });
});

// Download a file

App.get("/api/files/:id", (req, res) => {
  db.query(
    `
          SELECT url From files Where id = $1
          `,
    [req.params.id]
  ).then((data) => {
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
    db.query(
      `
            INSERT INTO files (item_id, name, url) VALUES ($1, $2, $3);
            `,
      [itemId, req.file.filename, folderPath + req.file.filename]
    );
    return res.status(200).send(req.file);
  });
});

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${PORT} so that's pretty good 👍`
  );
});
