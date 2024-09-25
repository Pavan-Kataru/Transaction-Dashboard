const mongoose = require('mongoose');


const productsSchema = new mongoose.Schema({
    id : {type : Number},
    title : {type : String},
    price : {type : Number},
    description : {type : String},
    category : {type : String},
    image : {type : String},
    sold : {type : Boolean},
    dateOfSale : {type : Date}
})

module.exports = mongoose.model('items',productsSchema);