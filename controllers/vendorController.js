const Vendor = require('../models/Vendor');
const Firm = require('../models/Firm'); // ✅ MISS AYYINA IMPORT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.WhatIsYourName;

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
             firm: req.body.firmId 
        });

        await newVendor.save();

        console.log("firmId:", req.body.firmId);


        // ✅ MISS AYYINA LOGIC (IDHI MATRAM ADD CHESA)
        await Firm.findByIdAndUpdate(
            req.body.firmId,
            { $push: { Vendor: newVendor._id } }
        );

        res.status(201).json({ message: "vendor registered successfully" });
        console.log('registered');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { vendorId: vendor._id },
            secretKey,
            { expiresIn: "1h" }
        );

        res.status(200).json({ success: "Login successfull", token });
        console.log(email, " this is token", token);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();

    const vendorsWithFirms = await Promise.all(
      vendors.map(async (vendor) => {
        const firms = await Firm.find({ vendor: vendor._id });
        return {
          ...vendor.toObject(),
          firms
        };
      })
    );

    res.status(200).json({ vendors: vendorsWithFirms });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
 const getVendorById = async (req,res) =>{
    const vendorId = req.params.id;
     try {
         const  vendor = await Vendor.findById(vendorId).populate('firm');
         if(!vendor){
             return res.status(404).json({error: "Vendor not found"})
         }
         res.status(200).json({vendor})
     } catch (error) {
         console.log(error);
         res.status(500).json({error:"Internal server error"});   
     }
 }

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
