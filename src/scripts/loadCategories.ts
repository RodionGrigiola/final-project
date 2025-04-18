import "dotenv/config";
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Category from '../model/categoryModel'; // Adjust path as needed

const imagesDir = path.join(__dirname, '../public/images');

const importCategories = async () => {
  try {
    if (!fs.existsSync(imagesDir)) {
      throw new Error(`Images directory not found at: ${imagesDir}`);
    }

    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => ['.jpg', '.jpeg', '.png', '.webp']
        .includes(path.extname(file).toLowerCase()));

    // Create categories
    for (const file of imageFiles) {
      let categoryName = path.parse(file).name; // Remove extension

      if (!categoryName.endsWith('furniture')) categoryName += 's';
      
      await Category.create({
        category: categoryName,
        imageSrc: `/images/${file}` // Relative path from public
      });

      console.log(`Created category: ${categoryName}`);
    }

  } catch (err) {
    console.error('Error importing categories:', err);
    throw err;
  }
};

// Database connection
// const DB_URL = process.env.DATABASE_URL?.replace(
//   "<db_password>", 
//   process.env.DATABASE_PASSWORD || ""
// );

// if (!DB_URL) {
//   throw new Error("Database URL is missing in environment variables");
// }

const DB_URL = process.env.TEST_DATABASE as string;

mongoose.connect(DB_URL)
  .then(() => importCategories())
  .then(() => {
    console.log('✅ Categories imported successfully');
    return mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Import failed:', err);
    process.exit(1);
  });