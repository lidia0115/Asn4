/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: __Lidia Abey_ Student ID: _N01546403__ Date: __26/11/2023__
*
*
******************************************************************************
**/ 

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

function connectToMongo() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });
    });
}

function findAll() {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await connectToMongo();
            console.log('Connected to MongoDB');
            const db = client.db("mydb");
            let collection = db.collection('customers');
            let cursor = collection.find({}).limit(10);
            await cursor.forEach(doc => console.log(doc));
            client.close();
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

setTimeout(() => {
    findAll().then(() => {
        console.log('Task executed');
    }).catch(err => {
        console.error(err);
    });
}, 5000);
