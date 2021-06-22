const mongo = require('mongodb');

const path = require('path');
const basePath = path.join(process.cwd(),"Plugin APIs/plug-in_base")
const BasePlugIn = require(basePath);


const MongoClient = require('mongodb').MongoClient;



class MongoDB extends BasePlugIn{

    #url
    #client

    constructor(parent) {
        super(parent);
        const url = "mongodb://127.0.0.1:27017";
        this.#url = url;
    }

    initialiseDatabase(){
        console.log("---MongoDB---Started setting the databaseProxy.databaseClient---")
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.#url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
                .then((client) => {
                    this.#client = client;
                    console.log("---Finished setting the databaseProxy.databaseClient---")
                    // Specify database you want to access
                    const db = this.#client.db('school');
                    const courses = db.collection('courses');
                    courses.find().toArray((err, results) => {
                        console.log("---Proof of MongoDB connection:--- ", results[0])
                        resolve();
                    });

                    this.databaseProxy.setDatabaseClient(this.#client);
                })
                .catch(err => reject(err))
        })
    }

    start(){
        console.log("----Starting MongoDB");
    }

}

module.exports = MongoDB;