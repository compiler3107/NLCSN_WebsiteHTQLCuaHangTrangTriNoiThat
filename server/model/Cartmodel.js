const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
    { 
       ProductList: {type : Array},
       idClient: {type: String},
    },

)

module.exports = mongoose.model('cart', cartSchema);