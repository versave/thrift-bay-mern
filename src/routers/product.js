const express = require('express');
const router = new express.Router();
const sharp = require('sharp');
const multer = require('multer');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a .png or .jpg file'));
        }

        cb(undefined, true);
    }
});

// @route POST /products
// @desc Create new product
// @access Private
router.post('/api/products', auth, upload.single('product'), async (req, res) => {
    if(!req.body.name || !req.body.price) {
       return res.status(400).send({error: 'Please fill all text fields'}); 
    }

    let buffer = null;

    if(req.file) {
        buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).webp().toBuffer();
    }
    
    const product = new Product({
        ...req.body,
        owner: req.user._id,
        ownerName: req.user.name,
        ownerEmail: req.user.email,
        image: buffer
    });

    try {
        await product.save();
        res.status(201).send(product);
    } catch(e) {
        res.status(404).send(e);
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message});
});

// @route GET /products
// @desc Get all products
// @access Public
router.get('/api/products', (req, res) => {
    Product.find()
        .sort({ createdAt: -1 })
        .then(products => res.send(products));
});

// @route GET /products/:id
// @desc Get all user products
// @access Public
router.get('/api/products/:id', async (req, res) => {
    const products = await Product.find({ owner: req.params.id });
    res.send(products);
});

// @route GET /api/products/:id/image
// @desc Get product image
// @access Public
router.get('/api/products/:id/image', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if(!product || !product.image) {
            throw new Error();
        }

        res.set('Content-Type', 'image/webp');
        res.send(product.image);
    } catch (e) {
        res.status(404).send();
    }
});

// @route PATCH /products/:id
// @desc Edit user product
// @access Private
router.patch('/api/products/:id', auth, upload.single('product'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'price'];
    const isValidOperation = updates.every(update => allowUpdates.includes(update));

    if(!req.body.name && !req.body.price && !req.file) {
        return res.status(400).send({error: 'You must fill at least one filed in order to update product'});
    }

    if(!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates' });
    }

    try {
        const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });
        let buffer = null;
        
        if(!product) {
            return res.status(404).send();
        }
        
        updates.forEach(update => product[update] = req.body[update]);
        
        if(req.file !== undefined) {
            buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).webp().toBuffer();
            product.image = buffer;
        }
        
        await product.save();
        
        res.send(product);
    } catch(e) {
        res.status(404).send(e);
    }
}, (err, req, res, next) => {
    res.status(400).send({error: err.message});
});

// @route DELETE /products/:id
// @desc Delete user product
// @access Private
router.delete('/api/products/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if(!product) {
            return res.status(404).send();
        }

        res.send(product);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;