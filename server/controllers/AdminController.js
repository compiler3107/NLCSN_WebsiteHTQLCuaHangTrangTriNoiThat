const User = require('../model/Usermodel');
const Category = require('../model/Category');
const Product = require('../model/Productmodel');
const Invoice = require('../model/Invoicemodel');
const Cart = require('../model/Cartmodel');
const sha256 = require('sha256');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const { setImage } = require('../helper/helpfunction');


const adminController = {
    //CreateUser
    CreateUser: async(req,res) => {
        try{
            //Create new User
            const hashed = await sha256(req.body.Password);
            const newUser = new User({
                Username: req.body.Username,
                Email: req.body.Email,
                Name: req.body.Name,
                Phone: req.body.Phone,
                Gender: req.body.Gender,
                Date:req.body.Date,
                Password: hashed,
            });
            //Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Login
    Login: async(req, res) =>{
        try{
            const user = await User.findOne({Username : req.body.Username});
            if(!user){
                res.status(404).json('Tài khoản không đúng!');
            }
            const hashed = await sha256(req.body.Password);
            const isPassword = (user.Password === hashed) ? true:false
            if(!isPassword){
                res.status(404).json('Mật khẩu không chính xác.');
            }
            if(user && isPassword){
                const accessToken = jwt.sign({
                    id: user.id,
                    Position: user.Position,
                },
                process.env.JWT_ACCESS_KEY,
                { expiresIn: '30d'}
                );
                const {Password, ...orthers} = user._doc;
                res.status(200).json({...orthers,accessToken});
            }
        }catch (err){
            res.status(500).json(err);
        }
    },
    //Get All users
    GetAllUsers: async(req,res)=>{
        try{
            const user = await User.find();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }

    },
    //Get one user
    GetOneUser: async(req, res) => {
        try{
            const user = await User.findById( req.params.id);
            if(!user){
                return res.status(404).json("Không tìm thấy tài khoản");
            }
                return res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Delete user
    DeleteUser: async(req, res) => {
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            if(!user){
                return res.status(404).json("Không tìm thấy tài khoản");
            }
                return res.status(200).json('Xóa thành công');
        }catch(err){
            res.status(500).json(err);
        }
    },

    // Them danh muc san pham
    AddCategory: async(req, res) => {
        try{
            const newCategory = new Category({
                Name: req.body.Name,
                Image: req.file.filename,
                
            });
            //Save to DB
            const category = await newCategory.save();
            res.status(200).json(category);
        }catch(err){
            res.status(500).json(err);
            console.log(err)

        }

    },
    //Xoa danh muc
    DeleteCategory: async(req, res) => {
        try{

            await Product.deleteMany({Category: req.params.id});
            const category = await Category.findByIdAndDelete(req.params.id);
            if(!category){
                return res.status(404).json("Không tìm thấy danh muc");
            }
            return res.status(200).json('Xóa thành công');
        }catch(err){
            res.status(500).json(err);
        }
    },

    // cap nhat danh muc
    UpdateCategory: async(req, res) => {
        try{
            const category = await Category.findByIdAndUpdate(req.params.id,{Name:req.body.Name, Image: req.file.originalname});
            if(!category){
                return res.status(404).json("Không tìm thấy danh muc");
            }
            return res.status(200).json('Cập nhật thành công thành công');
        }catch(err){
            res.status(500).json(err);
        }
    },
    //Tim danh muc
    GetOneCategory: async(req, res) => {
        try{
            const category = await Category.findById( req.params.id);
            if(!category){
                res.status(404).json("Không tìm thấy tài khoản");
            }
            
            res.status(200).json(category);
        }catch(err){
            res.status(500).json(err);
        }
    },

     //Lay tat ca danh muc
     GetAllCategories: async(req,res)=>{
        try{
            const category = await Category.find();
            category.forEach(element => {
                element.Image = setImage(element.Image);
            });
            res.status(200).json(category);
        }catch(err){
            res.status(500).json(err);
        }

    },

    // Them san pham
    AddProduct: async(req, res) => {
        // console.log(req.body)
        try{
            const newProduct = new Product({
                Name: req.body.Name,
                Image: req.file.filename,
                Price: req.body.Price,
                Discription: req.body.Discription,
                Quantity: req.body.Quantity,
                Category: req.body.idCategory,               
            });
            const product = await newProduct.save();
            await Category.findOneAndUpdate(
                {_id : req.body.idCategory },
                {$push:{
                    ProductList : product._id
                }});
            res.status(200).json(product);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

     // cap nhat san pham
     UpdateProduct: async(req, res) => {
        try{
            const updateData = req.body;

            // console.log("tren",updateData);
            if(req.file){
                updateData.Image = req.file;
                await Product.findByIdAndUpdate(req.params.id,updateData);
            }else{
                await Product.findByIdAndUpdate(req.params.id,updateData);
            }
            
            // if(!product){
            //     return res.status(404).json("Không tìm thấy san pham");
            // }
            return res.status(200).json('Cập nhật thành công');
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Xoa san pham
    DeleteProduct: async(req, res) => {
        try{
            const product = await Product.findByIdAndDelete(req.params.id);
            if(!product){
                res.status(404).json("Không tìm thấy san pham");
            }
            console.log(product)
            await Category.findOneAndUpdate(
                {_id :  product.Category},
                {$pull:{
                    ProductList :product._id
                }});
            res.status(200).json('Xóa thành công');
        }catch(err){
            console.log(err)
            res.status(500).json(err);
        }
    },


    //Lay tat ca san pham
    GetAllProducts: async(req,res)=>{
        try{
            await Product.find().populate('Category').
            exec(function (err, story) {
              if (err) return console.log(err);
              story.forEach(element => {
                element.Image = setImage(element.Image)})
              res.status(200).json(story);
            });;
            
        }catch(err){
            res.status(500).json(err);
        }

    },
    //Tim nhieu san pham
    GetmanyProducts: async(req, res) => {
        try{
            // console.log(req.params.id)
            await Category.findById(req.params.id).populate('ProductList').
            exec(function (err, story) {
              if (err) return console.log(err);
              const list = story.ProductList;
              list.forEach(element => {
                element.Image = setImage(element.Image)})
              res.status(200).json(list);
            });;
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Tim san pham
    GetOneProduct: async(req, res) => {
        try{
            const product = await Product.findById( req.params.id);
            if(!product){
                res.status(404).json("Không tìm thấy san pham");
            }
            product.Image = setImage(product.Image);
            res.status(200).json(product);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //search
    Search: async(req, res) => {
        try{
            const docs = await Product.find({ Name: { $regex: req.params.search } });

            docs.forEach(element => {
                element.Image = setImage(element.Image)})

            res.status(200).json(docs);
        }catch(err){
            res.status(500).json(err);
        }
    },

    // Them hoa don
    AddInvoice: async(req, res) => {
        // console.log(req.body)
        try{
            const newInvoice = new Invoice({
                Products: req.body.Products,
                Payment: req.body.Payment,
                Sum: req.body.Sum,
                Client: req.body.Client,               
            });
            const invoice = await newInvoice.save();
            await User.findOneAndUpdate(
                {_id : req.body.Client },
                {$push:{
                    InvoiceList : invoice._id
                }});
            res.status(200).json(invoice);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    //Add
    AddCart: async(req,res)=>{
        try{
            const newCart = new Cart({
                idClient : req.body.Client,
                ProductList: req.body.cartitem,
            });
            newCart.save();
            res.status(200).json(newCart);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    //Tim nhieu hoa don
    GetmanyInvoice: async(req, res) => {
        try{
            // console.log(req.params.id)
            await User.findById(req.params.id).populate({ path: 'InvoiceList', populate: { path: 'Products', populate: { path: 'Product' } } }).
            exec(function (err, story) {
              if (err) return console.log(err);
              const list = story.InvoiceList;
              res.status(200).json(list);
            });
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Lay tat ca san pham
    GetAllInvoice: async(req,res)=>{
        try{
            await Invoice.find().populate( { path: 'Products', populate: { path: 'Product' } } ).sort({createdAt: -1}).
            exec(function (err, story) {
              if (err) return console.log(err);
            //   story.forEach(element => {
            //     element.Image = setImage(element.Image)})
              res.status(200).json(story);
            });;
            
        }catch(err){
            res.status(500).json(err);
        }

    },

    // Duyet don hang
    UpdateInvoice: async(req, res) => {
        try{
            const {id , list} = req.body;
            await Invoice.findByIdAndUpdate(id,{Status: "Đã duyệt"});
            for (let item of list) {
                console.log(item);
                await Product.findByIdAndUpdate(item.id,{$inc: {Quantity: -item.quantity}})
            }


            return res.status(200).json('Cập nhật thành công');
        }catch(err){
            res.status(500).json(err);
            console.log(err);
        }
    },




}

module.exports = adminController;