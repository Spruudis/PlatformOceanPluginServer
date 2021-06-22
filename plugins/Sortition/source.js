const path = require('path');
const basePath = path.join(process.cwd(),"Plugin APIs/plug-in_base")
const BasePlugIn = require(basePath);

const config = require('./config');

class Sortition extends BasePlugIn{

    constructor(parentObject) {
        super(parentObject);

        //Returns an array document properties sampled from the collection
        this.registerHook("sampleDocumentProperty", args =>{
            return this.sampleField(args[0], args[1], args[2]);
        })
    }


    sampleField(collectionAccess, sampleSize, fieldName){
        return new Promise((resolve, reject) => {
            collectionAccess.aggregate(
                [ { $sample: { size: sampleSize } } ],
                {},
                function(err, result) {
                    const sampledFields = [];
                    result.forEach(element => {
                        console.log(element);
                        sampledFields.push(element[fieldName])
                    }).then(r => resolve(sampledFields))
                }
            )
        })
    }

}

module.exports = Sortition;