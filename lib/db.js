const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { response } = require('express');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({users:[]}).write();

module.exports = db;