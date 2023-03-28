const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        //Tên danh muc
        Name: {
           type: String,
            require: true,
       },

       //Anh danh muc
       Image: {
        type: String,
        require: true,
       },

       //Danh sach san pham
       ProductList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
        }],

    }
)

module.exports = mongoose.model('category', categorySchema);