
const Product = require('../models/Product');
const multer = require('multer');
const Firm = require ('../models/Firm');
const path = require ('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const upload = multer ({storage: storage});

const addProduct = async (req, res) =>{
    try {
        const {productName, price, category, bestSeller, description} = req.body;
        const image = req.file ? req.file.filename : undefined ;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        
        if(!firm){
          return res.status(404).json({error: "No Firm Found"});
        }

        const product = new Product({
          productName, price, category, bestSeller, description, image, firm: firm._id

        })

        const savedProduct = await product.save();

         firm.products.push(savedProduct);

        await firm.save();

        res.status(200).json(savedProduct)
    } catch (error) {
        console.error('❌ Add Product Error:', error);
        res.status(500).json({error: error.message});
    }
}

const getProductByFirm = async (req, res) =>{
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({error : "No firm found"});
    }

    const restaurantName = firm.firmName;
    const products = await Product.find({firm: firmId});

    res.status(200).json({restaurantName, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({error : "Internal server error"})
  }
}

const deleteProductById = async(req, res)=>{
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct){
      return res.status(404).json({error: "No Product Found"})
    }

    await Firm.findByIdAndUpdate(
  deletedProduct.firm,
  { $pull: { products: productId } }
);


    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({error : "Internal Server Error"})
  }
}

module.exports = { addProduct, upload, getProductByFirm, deleteProductById };