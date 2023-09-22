const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    maincategory: {
      type: String,
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    stock: {
      type: Number,
    },
    photos: [
      {
        type: String,
      },
    ],
    FeatureTag:[
      {
        type:String,
      }
    ],
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('AddProduct', productSchema);
