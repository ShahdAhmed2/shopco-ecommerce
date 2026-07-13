import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import Product from './models/Product.js';

// Load environment variables
dotenv.config();

/**
 * Normalize rating values that exceed 5
 */
const normalizeProducts = (productList) => {
  return productList.map((product) => {
    let normalizedRating = product.rating || 0;
    if (normalizedRating > 5) {
      // Divide by 20 and fix to 1 decimal place (e.g. 60 -> 3.0, 81 -> 4.1)
      normalizedRating = Number((normalizedRating / 20).toFixed(1));
    }
    return {
      ...product,
      rating: normalizedRating,
    };
  });
};

/**
 * Connect to MongoDB before executing commands
 */
const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error('❌ Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }
  await mongoose.connect(dbUri);
};

/**
 * Seed all products into DB (idempotent: deletes current ones first)
 */
const importData = async () => {
  try {
    await connectDB();

    // Delete existing products
    await Product.deleteMany();

    // Normalize ratings
    const cleanProducts = normalizeProducts(products);

    // Insert new data
    await Product.insertMany(cleanProducts);

    console.log('✔ Products Imported Successfully');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error during import: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Wipe the product collection
 */
const deleteData = async () => {
  try {
    await connectDB();

    // Delete all products
    await Product.deleteMany();

    console.log('✔ Products Deleted Successfully');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error during deletion: ${error.message}`);
    process.exit(1);
  }
};

// Handle CLI routing based on arguments
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Use one of the following arguments:');
  console.log('  --import   - Import seed data to MongoDB');
  console.log('  --delete   - Wipe product collection in MongoDB');
  process.exit(0);
}
