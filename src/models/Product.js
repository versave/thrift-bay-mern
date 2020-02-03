const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type: Buffer
    },
    hasImage: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ownerName: {
        type: String,
        required: true,
        ref: 'User'
    },
    ownerEmail: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Methods - Accesible on the instances
productSchema.methods.toJSON = function() {
    const product = this;
    const productObject = product.toObject();

    delete productObject.image;

    return productObject;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;