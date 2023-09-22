// app.js

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const path = require('path');

// Import route files
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const mainCategoryRoutes = require("./routes/MainCategories");
const categoryRoutes = require("./routes/Category/Categories");
const subCategoryRoutes = require("./routes/Category/subCategories");
const plantcareRoutes = require("./routes/Plantcare/Plantcare");
const featureTagRoutes=require("./routes/featureTag/featureTag");
const addProductRouter=require("./routes/AddProduct/AddProduct")
// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Mount route handlers
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/", mainCategoryRoutes);
app.use("/", categoryRoutes);
app.use("/", subCategoryRoutes);
app.use("/", plantcareRoutes);
app.use("/",featureTagRoutes);
app.use("/",addProductRouter);
// Serve static images
app.use('/Image', express.static(path.join(__dirname, 'Image')));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
