const mongoose = require('mongoose');
const Schedule = require('../models/schedule');
const scheds = require('./schedules');

mongoose.connect('mongodb://localhost:27017/sidur');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected.');
})

const cleanDB = async () => await Schedule.deleteMany({});

const seedDB = async () => {
    await Schedule.insertMany(scheds)
}

cleanDB();

seedDB()
.then(() => {
    console.log('Seeding Done.');
})
.catch(err => {
    console.log('Seeding Error: ', err);
})
.finally(() => {
    db.close();
    console.log('Database Closed.');
});