import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Item from "../model/itemModel.js";

const DB_URL = process.env.DATABASE_URL;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DB_URL || !DB_PASSWORD) {
  throw new Error(
    "Database URL or password is missing in environment variables",
  );
}

const DB = DB_URL.replace("<db_password>", DB_PASSWORD);

mongoose.connect(DB).then(async () => {
  try {
    const dataPath = path.join(__dirname, "items.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const items = JSON.parse(rawData);

    // Удаляем все существующие данные (опционально)
    await Item.deleteMany({});
    console.log("Existing data cleared");

    // Создаем новые объекты и сохраняем их в базу данных
    const createdItems = await Promise.all(
      items.map(async (item: { imageSrc: string; category: string }) => {
        const newItem = new Item(item);
        return await newItem.save();
      }),
    );
    console.log("Database seeded successfully:", createdItems);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Закрываем соединение с базой данных
    mongoose.connection.close();
  }
});

// const port = process.env.PORT || 3000;

// const server = app.listen(port, () => {
//     console.log("listening");
//   });
