import mongoose, { Document, Schema } from "mongoose";

// Определяем интерфейс для TypeScript
interface ICategory extends Document {
  imageSrc: string;
  category: string;
}

// Создаем схему Mongoose
const CategorySchema: Schema = new Schema({
  imageSrc: { type: String, required: true },
  category: { type: String, required: true },
});

// Создаем модель Mongoose
const Category = mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
