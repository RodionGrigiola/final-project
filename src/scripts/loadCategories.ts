import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Category from '../model/categoryModel';

const DB_URL = process.env.DATABASE_URL;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DB_URL || !DB_PASSWORD) {
  throw new Error('Database URL or password is missing in environment variables');
}

const DB = DB_URL.replace('<db_password>', DB_PASSWORD);

mongoose
  .connect(DB) 
  .then(async (connection) => {
    try {
        const dataPath = path.join(__dirname, 'categories.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const categories = JSON.parse(rawData);

        // Удаляем все существующие данные (опционально)
        await Category.deleteMany({});
        console.log('Existing data cleared');

        // Создаем новые объекты и сохраняем их в базу данных
        const createdCategories = await Promise.all(
        categories.map(async (category: { imageSrc: string; category: string }) => {
            const newCategory = new Category(category);
            return await newCategory.save();
        })
        );
        console.log('Database seeded successfully:', createdCategories);
    }
    catch (error) {
        console.error('Error seeding database:', error);
      } finally {
        // Закрываем соединение с базой данных
        mongoose.connection.close();
      }
  })

  
// const port = process.env.PORT || 3000;


// const server = app.listen(port, () => {
//     console.log("listening");
//   });
