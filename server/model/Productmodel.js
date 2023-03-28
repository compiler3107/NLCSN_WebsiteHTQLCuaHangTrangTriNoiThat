const mongoose = require("mongoose");

const productschema = mongoose.Schema(
    {
        //Tên sản phẩm
        Name: {
           type: String,
            require: true,
       },
       //Giá
       Price: {
           type: Number,
           require: true,
       },
       //Mô tả
        Discription:{
           type: String,
           require: true,
       },
       
       //Số lượng
       Quantity: {
           type: Number,
           require: true,
       },
       //Hình ảnh
       Image: {
           type: String,
           require: true,
       },
       //Giảm giá
       Discount: {
            type: Number,   
       },

       //Danh muc
       Category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        },

    },
    {timestamps: true}
)

module.exports = mongoose.model('product', productschema);