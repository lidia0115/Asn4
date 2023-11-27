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

async function findAll() {
    
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log("s2");console.log(err); });
    if (!client) return;
        
    try {
        console.log('1');
        const db =  client.db("mydb");
        console.log('2');
        let collection =  db.collection('customers');
        console.log('3');
        let cursor =  collection.find({}).limit(10);
        console.log('4');
        await cursor.forEach(doc => console.log(doc));
        console.log('5');
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
setTimeout(()=>{
    findAll();
    console.log('iter');
}, 5000);