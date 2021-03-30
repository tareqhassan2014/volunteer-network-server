const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


const port = process.env.PORT || 4321

app.use(cors())
app.use(bodyParser.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x1vlg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db(`${process.env.DB_NAME}`).collection("events");

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/events', (req, res) => {
        eventCollection.find()
            .toArray((error, items) => {
                res.send(items)
            })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        eventCollection.findOneAndDelete({ _id: id })
            .then(deletedDocument => res.send(!!deletedDocument))
    })
    // client.close();
});



app.get('/', (req, res) => {
    res.send('Hello Dear, developer is sleeping.')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})