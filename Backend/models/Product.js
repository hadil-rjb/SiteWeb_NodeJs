const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { 
        type: String, 
        enum: ['Accessoire', 'Pâtisserie'], // Limite les valeurs possibles
        required: true 
    },
    image: { 
        type: String, // URL de l'image
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Product', ProductSchema);
