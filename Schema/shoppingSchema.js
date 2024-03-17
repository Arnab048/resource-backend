const mongoose = require('mongoose');
const { Schema } = mongoose;

const shoppingSchema = new Schema({
    name: {
        type: String,
    },
    basePrice: {
        type: Number,
    },
    sellingPrice: {
        type: Number,
    },
    profit: {
        type: Number,
    },
    profitValue: {
        type: Number,
    },
    image: {
        type: [String] || String,
        
    },

})

const Shopping = mongoose.model('shopping', shoppingSchema);
module.exports = Shopping;