
const express = require ('express');
const productController = require ('../controllers/productController');

const { addProduct, upload } = require('../controllers/productController');

const router = express.Router();
// router.post('/add-product/:firmId', productController.addProduct);

// router.post('/test', (req, res) => {
//   res.send('Product route working');
// });
router.post(
  '/add-product/:firmId',
  upload.single('image'),
  addProduct
);
router.get('/:firmId/products', productController.getProductByFirm)

router.get('uploads/:imageName', (req,res)=>{
    const imageName = req.params.imageName;
    req.headersSent('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
})

router.delete('/:productId', productController.deleteProductById)

module.exports = router;