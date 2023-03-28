const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //Tên đăng nhập
    Username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 20,
    },

    //Mật khẩu
    Password: {
        type: String,
        required: true,
        minlength: 6,
    },

    //Email
    Email: {
        type: String,
        required: true,
        unique: true,
    },

    //Họ và tên
    Name: {
        type: String,
        require: true,
    },

    //Số điện thoại
    Phone: {
        type: String,
        require: true,
    },

    //Số điện thoại
    Address: {
        type: String,
        require: true,
    },

    //Chuc vu
    Admin: {
        type: String,
        require: true,
        default: 'Client',
    },

    //Gioi tinh
    Gender: {
        type: Boolean,
        // Nam = true
        require: true,
    },

    //Ngay Sinh
    Date: {
        type: String,
        require: true,
    },
    //Danh sach hoa don
    InvoiceList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'invoice'
    }],
    
})

module.exports = mongoose.model('user', userSchema);