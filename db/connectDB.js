const { Client } = require('pg');

const client = new Client({
    "user": "fzqujkbq",
    "password": "X7P8KxtM4Xvu1tl9pKnaezzmiWD_QGyU",
    "host": "rajje.db.elephantsql.com",
    "port": 5432,
    "database": "fzqujkbq"
});

client.connect().then(() =>
{
    console.log("Server, You Have Successfully connected to PostgreSql");
})
.catch((error) =>
{
    console.log("Server, Unable to connect to PostgreSql");
	console.error(error);
});

module.exports = client;