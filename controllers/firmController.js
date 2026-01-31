
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');

const multer = require('multer');

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


const addFirm = async(req, res)=>{
   try {
     const {firmName, area, category, region, offer} = req.body

    const image = req.file? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId)
    if(!vendor){
        res.status(404).json({message: "Vendor not found"})
    }

    const firm = new Firm({
        firmName,area, category, region, offer, image, vendor: vendor._id
    });


     const savedFirm = await firm.save();

     if (!vendor.firm) vendor.firm = []; 
     vendor.firm.push(savedFirm.id)

     await vendor.save()

    //  vendor.firm.push(savedFirm._id);  // NEW LINE
    //  await vendor.save(); 

    return res.status(200).json({message: 'Firm Added Successfully'})
    
   } catch (error) {
    console.error(error)
    res.status(500).json({message: "Internal Server Error"})
    
   }
}

const deleteFirmById = async(req, res)=>{
  try {
    const firmId = req.params.FirmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if(!deletedFirm){
      return res.status(404).json({error: "No Firm Found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error : "Internal Server Error"})
  }
}

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}
