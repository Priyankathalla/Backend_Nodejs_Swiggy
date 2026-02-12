const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require('./routes/vendorRoutes');
// const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const cors = require ('cors')


const app = express();
// app.use(cors())
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



const PORT = process.env.PORT || 4000;

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Routes
 // app.use(bodyParser.json());
 app.use(express.json());

app.use('/vendor' , vendorRoutes);
app.use('/firm',firmRoutes)
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'))


app.use('/', (req, res) => {
  res.send("<h1>Welcome to Swiggy</h1>");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server started and running at ${PORT}`);
});
