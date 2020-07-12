const getUserQuery = `SELECT * FROM users WHERE id=$1;`;

const getAllWarrantiesQuery = `
  SELECT entries.*, items.name as item_name, items.category as item_category
  FROM entries
  JOIN items ON items.id = entries.item_id
  WHERE type='warranty';
`;

const getAllPaymentsQuery = `
SELECT entries.*, items.name as item_name, items.category as item_category
FROM entries
JOIN items ON items.id = entries.item_id
WHERE type='payment'
AND duration_in_months > 0;
`;

const getAllTransactionsQuery = `
  SELECT transactions.*, entries.item_id as item_id
  FROM transactions
  JOIN entries ON entries.id = transactions.entry_id
  WHERE type='payment';
`;

const getItemDetailsQuery = `
  SELECT 
    id,
    name,
    category,
    description    
  FROM items
  WHERE id = $1;
`;

const getWarrantyQuery = `
  SELECT 
    start_date,
    duration_in_months,
    sms,
    email,
    days_prior
  FROM entries
  WHERE type='warranty' AND item_id = $1;
`;

const getPaymentQuery = `
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

const getFilesQuery = `
  SELECT id, name, url
  FROM files
  WHERE item_id = $1;
`;

const getTransactionsQuery = `
  SELECT name, amount, date
  FROM transactions
  WHERE entry_id = $1;
`;

const addNewItemQuery = `
  INSERT INTO items (user_id, name, category, description) VALUES (1, $1, $2, $3)
  RETURNING id;
`;

const addNewWarrantyQuery = `
  INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'warranty', $2, $3, $4, $5, $6);
`;

const addNewPaymentQuery = `
  INSERT INTO entries (item_id, type, duration_in_months, start_date, sms, email, days_prior) VALUES ($1, 'payment', $2, $3, $4, $5, $6)
  RETURNING id;
`;

const addNewTransactionQuery = `
  INSERT INTO transactions (entry_id, name, amount, date) VALUES ($1, $2, $3, $4);
`;

const updateItemQuery = `
  UPDATE items 
  SET name = $1,
  category = $2,
  description = $3
  WHERE id = $4
  RETURNING id;
`;

const checkWarrantyExistsQuery = `
  SELECT exists(SELECT 1 FROM entries WHERE item_id=$1 AND type = 'warranty');
`;

const updateWarrantyQuery = `
  UPDATE entries
  SET
  duration_in_months = $1,
  start_date = $2,
  sms = $3,
  email = $4,
  days_prior = $5
  WHERE type = 'warranty'
  AND item_id = $6;
`;

const deleteWarrantyQuery = `
  DELETE FROM entries
  WHERE item_id = $1
  AND type = 'warranty';
`;

const checkPaymentExistsQuery = `
  SELECT exists(SELECT 1 FROM entries WHERE item_id=$1 AND type = 'payment');
`;

const updatePaymentQuery = `
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
`;

const deleteTransactionQuery = `
  DELETE FROM transactions WHERE entry_id = $1 AND name = $2 AND date = $3 AND amount = $4;
`;

const deletePaymentQuery = `
  DELETE FROM entries
  WHERE item_id = $1
  AND type = 'payment';
`;

const deleteFileQuery = `
  DELETE FROM files WHERE id = $1
  RETURNING url;
`;

const getFileUrlQuery = `
  SELECT url From files Where id = $1
`;

const addNewFileQuery = `
  INSERT INTO files (item_id, name, url) VALUES ($1, $2, $3);
`;

module.exports = {
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
};
