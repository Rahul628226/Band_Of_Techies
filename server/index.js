require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const MainCategoryRoutes=require("./routes/MainCategories")
const CategoryRoutes=require("./routes/Category/Categories")
const SubCategoryRoutes=require("./routes/Category/subCategories")
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

//MainCategory Routes
app.use("/",MainCategoryRoutes)

//category
app.use("/",CategoryRoutes)

//subCategory
app.use("/",SubCategoryRoutes)

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
