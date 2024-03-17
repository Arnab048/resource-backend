const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    image: {
        type: [String] || String,
        // required: true,
    },

})


const Resource = mongoose.model('resource', resourceSchema);
module.exports = Resource;