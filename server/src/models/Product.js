import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Review rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'Old price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      enum: {
        values: ['new-arrivals', 'top-selling', ''],
        message: 'Section must be new-arrivals, top-selling, or empty',
      },
    },
    dressStyle: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot be above 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
