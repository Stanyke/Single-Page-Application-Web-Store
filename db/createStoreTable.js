const client = require('./connectDB');

const runStoreTable = client.query("CREATE TABLE IF NOT EXISTS store ( Id SERIAL PRIMARY KEY, item_name TEXT NOT NULL, description TEXT NOT NULL, image_name VARCHAR (100) NOT NULL, item_category TEXT NOT NULL, created_at VARCHAR (150) NOT NULL, updated_on VARCHAR (150) NOT NULL)", (err, res) =>
{
    console.log(err, res);
});

module.exports = runStoreTable;