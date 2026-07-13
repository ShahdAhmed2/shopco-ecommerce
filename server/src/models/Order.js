import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Order item must refer to a product'],
        },
        name: {
          type: String,
          required: [true, 'Order item name is required'],
        },
        image: {
          type: String,
        },
        price: {
          type: Number,
          required: [true, 'Order item price is required'],
          min: [0, 'Item price cannot be negative'],
        },
        quantity: {
          type: Number,
          required: [true, 'Order item quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        color: {
          type: String,
        },
        size: {
          type: String,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Recipient name is required'],
      },
      phone: {
        type: String,
        required: [true, 'Contact phone number is required'],
      },
      address: {
        type: String,
        required: [true, 'Shipping street address is required'],
      },
      city: {
        type: String,
        required: [true, 'Shipping city is required'],
      },
      country: {
        type: String,
        required: [true, 'Shipping country is required'],
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Shipping fee cannot be negative'],
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        message: 'Status must be pending, paid, shipped, delivered, or cancelled',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
