const {Client} = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

client.connect(undefined)
    .then(() => { console.log(`${process.env.DB_USER} successfully connected at ${process.env.DB_NAME}`)})
    .catch(err => console.log(`Error while trying to connect to ${process.env.DB_NAME}`, err));

module.exports = client;