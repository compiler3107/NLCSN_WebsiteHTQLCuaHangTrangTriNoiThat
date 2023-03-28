const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
    {

       //Danh hang hoa
       Products: [
        {
            Product: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "product"
          },
            Quantity:
                {
                type: Number,
                required: true
                },
            Price:
                {
                type: Number,
                required: true
                },
        }
      ],
        //Khach hang
        Client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'client'
            },

       //Phuong thuc thanh toan
        Payment: {
            type: String,
            require: true,
        },

        //Trang thai hoa don
        Status: {
            type: String,
            default:'Chờ duyệt'
        },

        //Trang thai hoa don
        Sum: {
            type: Number,
        },

    },
    {timestamps: true}
)

module.exports = mongoose.model('invoice', invoiceSchema);