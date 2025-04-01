import "dotenv/config";
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Item from '../model/itemModel';

// 1. Получаем абсолютный путь к папке models
const modelsDir = path.join(__dirname, '../public/models');

const importModels = async () => {
  try {
    // 2. Проверяем существование папки
    if (!fs.existsSync(modelsDir)) {
      throw new Error(`Directory ${modelsDir} not found`);
    }

    const categories = fs.readdirSync(modelsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(modelsDir, category);
      const models = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.glb'));

      for (const modelFile of models) {
        await Item.create({
          type: 'gltf',
          src: `/models/${category}/${modelFile}`,
          properties: {
            category,
            name: path.parse(modelFile).name
          }
        });
        console.log(`Added: ${category}/${modelFile}`);
      }
    }
  } catch (err) {
    console.error('Error in importModels:', err);
    throw err; // Пробрасываем ошибку для обработки в основном потоке
  }
};

const DB_URL = process.env.DATABASE_URL;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DB_URL || !DB_PASSWORD) {
  throw new Error(
    "Database URL or password is missing in environment variables",
  );
}

const DB = DB_URL.replace("<db_password>", DB_PASSWORD);

// 3. Подключение и запуск
mongoose.connect(DB)
  .then(() => importModels())
  .then(() => {
    console.log('✅ All models seeded successfully');
    return mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });