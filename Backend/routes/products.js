const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Create product
router.post('/add', auth, async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;

        // Création d'un nouveau produit
        const product = new Product({ name, price, description, category, image });
        await product.save();

        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Error creating product', error: err.message });
    }
});

// Read all products with pagination and category filter
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query; // Ajout du paramètre "category"

        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        if (isNaN(pageInt) || isNaN(limitInt) || pageInt < 1 || limitInt < 1) {
            return res.status(400).json({ message: 'Invalid page or limit parameter' });
        }

        const query = {}; // Construction du filtre
        if (category) {
            query.category = category; // Filtrer par catégorie si le paramètre existe
        }

        const products = await Product.find(query)
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        const totalProducts = await Product.countDocuments(query); // Compter les documents filtrés

        res.json({
            page: pageInt,
            limit: limitInt,
            totalPages: Math.ceil(totalProducts / limitInt),
            totalProducts,
            products,
        });
    } catch (err) {
        res.status(400).json({ message: 'Error fetching products', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });  // Retourner un message JSON approprié
        }

        res.json(product);
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de la récupération du produit', error: err.message });
    }
});


// Update product
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new:
                true
        });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err.message });
    }
});


// Delete product
router.delete('/:id', auth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', error: err.message });
    }
});

module.exports = router;
