const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products', 
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);