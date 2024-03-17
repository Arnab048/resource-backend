const mongoose = require('mongoose');
const { Schema } = mongoose;

const createCraftSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      basePrice: {
        type: Number,
       
      },
      selectedItems: {
        type: [String], // You may need to adjust the type based on your requirements
        required: true,
      },
      image: {
        type: [String], // Array of image filenames
        required: true,
      },
    });


const CreateCraft = mongoose.model('createCraft', createCraftSchema);
module.exports = CreateCraft;