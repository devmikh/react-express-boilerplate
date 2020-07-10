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
      console.log(data.rows);

      resObj = { ...resObj, payment: data.rows[0] };
      console.log(data.rows);
      if (data.rows.length !== 0) {
        return db.query(transactionQuery, [data.rows[0].id]);
      }
      return db.query(transactionQuery, [0]);
      //data.rows ? [data.rows[0].id] :
    })
    .then((data) => {
      console.log("after transactions");

      resObj = { ...resObj, transactions: data.rows };
      return db.query(fileQuery, queryParams);
    })
    .then((data) => {
      resObj = { ...resObj, filesDB: data.rows };
      res.json(resObj);
    });
  // db.query(paymentQuery).then((data) => {
  // queryparams.push(data.rows[0].id)
  // });

  // db.query(query).then((data) => {
  //   res.json(data.rows[0]);
  // });
  // res.json({ message: "Item fetched" });
  //{id: 1, files:[], transactions: [], warranty: {}, payment:{}}
});

App.post("/api/items", (req, res) => {
  console.log(req.body);
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

  db.query(
    `
    INSERT INTO items (user_id, name, category, description) VALUES (1, $1, $2, $3)
    RETURNING id;
  `,
    [itemName, itemCategory, itemDescription]
  )
    .then((data) => {
      console.log(typeof data.rows[0].id);
      let dir = `./uploads/1/${data.rows[0].id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

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
      if (paymentStartDate) {
        db.query(
          `
      INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'payment', $2, $3, $4, $5, $6);
      `,
          [
            data.rows[0].id,
            paymentDuration,
            new Date(paymentStartDate).getTime() + 25200001,
            paymentSmsNotification,
            paymentEmailNotification,
            paymentNotifyDaysPrior,
          ]
        );
      }
      res.json(data.rows[0].id);
    })
    .catch((error) => console.log(error));
});

App.post("/api/items/:id", (req, res) => {
  console.log(req.body);
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
      console.log(typeof data.rows[0].id);
      let dir = `./uploads/1/${data.rows[0].id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      if (warrantyStartDate) {
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
      if (paymentStartDate) {
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
      `,
          [
            paymentDuration,
            new Date(paymentStartDate).getTime() + 25200001,
            paymentSmsNotification,
            paymentEmailNotification,
            paymentNotifyDaysPrior,
            req.params.id,
          ]
        );
      }
      res.json(data.rows[0].id);
    })

    .catch((error) => console.log(error));
});

App.post("/api/files/:id/delete", (req, res) => {
  // res.json({ message: `File deleted! ${req.params.id}` });

  let query = `
    DELETE FROM files WHERE id = $1
    RETURNING url;
  `;
  db.query(query, [req.params.id]).then((data) => {
    // console.log(data.rows[0].url);
    fs.unlinkSync(data.rows[0].url);
    res.json("hello");
  });
});

// File download

// App.get("/api/files/:name", (req, res) => {
//   console.log("downloading");
//   res.download(`./uploads/${req.params.name}`);
// });
// App.get("/api/files", (req, res) => {
//   db.query(
//     `
//           SELECT url From files Where id = 3
//           `
//   ).then((data) => {
//     console.log("downloading");
//     // console.log(data.rows[0]);

//     res.download(data.rows[0].url);
//   });
// });
//
//

// File uploads
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
