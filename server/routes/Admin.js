const router = require('express').Router();
const adminController = require('../controllers/AdminController');
const middlewareController = require('../controllers/MiddlewareController');

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'image/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/product/search/:search',adminController.Search);



router.put('/category/update/:id',upload.single('avatar'),adminController.UpdateCategory);
router.get('/category/findall',adminController.GetAllCategories);
router.get('/category/:id',adminController.GetOneCategory);
router.post('/addcategory',upload.single('avatar'),adminController.AddCategory);
router.delete('/category/:id',adminController.DeleteCategory);


router.put('/product/update/:id',upload.single('avatarproduct'),adminController.UpdateProduct);
router.post('/addproduct',upload.single('avatarproduct'),adminController.AddProduct);
router.delete('/product/:id',adminController.DeleteProduct);
router.get('/product/findall',adminController.GetAllProducts);
router.get('/product/findmany/:id',adminController.GetmanyProducts);
router.get('/product/:id',adminController.GetOneProduct);


router.put('/invoice/handle',adminController.UpdateInvoice);
router.get('/invoice/findall',adminController.GetAllInvoice);
router.get('/invoice/findmany/:id',adminController.GetmanyInvoice);
router.post('/addinvoice',adminController.AddInvoice);
router.post('/addcart',adminController.AddCart);


router.post('/register',adminController.CreateUser);
router.post('/login',adminController.Login);
router.get('/findall',middlewareController.verifyTokenAndAdmin,adminController.GetAllUsers);
router.get('/:id',adminController.GetOneUser);
router.delete('/:id',adminController.DeleteUser);



module.exports = router;